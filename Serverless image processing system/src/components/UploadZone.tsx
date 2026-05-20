import React, { useCallback, useState, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  /* ===============================
     VALIDATION
  ================================ */

  const validate = useCallback(
    (file: File) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload PNG, JPEG, or WebP.",
          variant: "destructive",
        });
        return false;
      }

      if (file.size > MAX_SIZE) {
        toast({
          title: "File too large",
          description: "Max file size is 10 MB.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    },
    [toast]
  );

  /* ===============================
     HANDLE FILE SELECTION
  ================================ */

  const handleFile = useCallback(
    (file: File) => {
      if (!validate(file)) return;

      onFileSelect(file);

      // 🔥 Clear input value so same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [onFileSelect, validate]
  );

  /* ===============================
     DRAG & DROP
  ================================ */

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  /* ===============================
     INPUT CHANGE
  ================================ */

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          glass-card cursor-pointer transition-all duration-300 
          p-12 flex flex-col items-center gap-4 text-center border
          ${
            isDragging
              ? "glow-border border-primary"
              : "border-border/50 hover:border-primary/50"
          }
        `}
      >
        <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center">
          {isDragging ? (
            <ImageIcon className="w-8 h-8 text-primary-foreground" />
          ) : (
            <Upload className="w-8 h-8 text-primary-foreground" />
          )}
        </div>

        <div>
          <h3 className="text-lg font-display font-semibold text-foreground mb-1">
            {isDragging ? "Drop your image here" : "Drag & drop your image"}
          </h3>

          <p className="text-sm text-muted-foreground">
            or{" "}
            <span className="text-primary underline">
              browse files
            </span>{" "}
            — PNG, JPEG, WebP up to 10 MB
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleChange}
      />
    </motion.div>
  );
}