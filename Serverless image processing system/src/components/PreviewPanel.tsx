import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw, GripVertical } from "lucide-react";
import { ImageMetadata } from "@/lib/types";

interface PreviewPanelProps {
  originalUrl: string;
  processedUrl: string;
  originalMeta: ImageMetadata | null;
  processedMeta: ImageMetadata | null;
  onReset: () => void;
}

function formatBytes(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

export default function PreviewPanel({ originalUrl, processedUrl, originalMeta, processedMeta, onReset }: PreviewPanelProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !dragging.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = processedUrl;
    a.download = processedMeta?.name || "processed_image";
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto space-y-6">
      {/* Slider comparison */}
      <div
        ref={containerRef}
        className="glass-card relative overflow-hidden rounded-xl select-none"
        style={{ aspectRatio: "16/10" }}
        onMouseDown={() => { dragging.current = true; }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onMouseMove={(e) => handleMove(e.clientX)}
        onTouchStart={() => { dragging.current = true; }}
        onTouchEnd={() => { dragging.current = false; }}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      >
        {/* Processed (full background) */}
        <img src={processedUrl} alt="Processed" className="absolute inset-0 w-full h-full object-contain" />
        {/* Original (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
          <img src={originalUrl} alt="Original" className="absolute inset-0 w-full h-full object-contain" style={{ width: containerRef.current?.offsetWidth || "100%" }} />
        </div>
        {/* Divider */}
        <div className="absolute top-0 bottom-0 z-10 flex items-center" style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}>
          <div className="w-0.5 h-full bg-primary/80" />
          <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full gradient-bg flex items-center justify-center cursor-ew-resize shadow-lg">
            <GripVertical className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        {/* Labels */}
        <span className="absolute top-3 left-3 text-xs font-display font-semibold bg-background/70 backdrop-blur px-2 py-1 rounded">Original</span>
        <span className="absolute top-3 right-3 text-xs font-display font-semibold bg-background/70 backdrop-blur px-2 py-1 rounded">Processed</span>
      </div>

      {/* Metadata */}
      <div className="grid md:grid-cols-2 gap-4">
        {originalMeta && (
          <div className="glass-card p-4 space-y-2">
            <h4 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Original</h4>
            <MetaRow label="File" value={originalMeta.name} />
            <MetaRow label="Size" value={formatBytes(originalMeta.size)} />
            <MetaRow label="Dimensions" value={`${originalMeta.width}×${originalMeta.height}`} />
            <MetaRow label="Type" value={originalMeta.type} />
          </div>
        )}
        {processedMeta && (
          <div className="glass-card p-4 space-y-2">
            <h4 className="text-xs font-display font-semibold text-primary uppercase tracking-wider">Processed</h4>
            <MetaRow label="File" value={processedMeta.name} />
            <MetaRow label="Size" value={formatBytes(processedMeta.size)} />
            <MetaRow label="Dimensions" value={`${processedMeta.width}×${processedMeta.height}`} />
            <MetaRow label="Type" value={processedMeta.type} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        <Button onClick={handleDownload} className="gradient-bg text-primary-foreground font-display hover:opacity-90">
          <Download className="w-4 h-4 mr-2" /> Download Processed
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" /> Start Over
        </Button>
      </div>
    </motion.div>
  );
}
