import { useState, useCallback } from "react";
import {
  ProcessingOptions,
  defaultProcessingOptions,
  ImageMetadata,
} from "@/lib/types";
import {
  getApiConfig,
  uploadImage,
  processImage,
  recognizeImage,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export type AppStep = "upload" | "options" | "preview";

export interface Detection {
  name: string;
  confidence: number;
  box?: {
    Width: number;
    Height: number;
    Left: number;
    Top: number;
  };
}

export function useImageProcessor() {
  const [step, setStep] = useState<AppStep>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [s3Key, setS3Key] = useState<string>("");

  const [originalUrl, setOriginalUrl] = useState<string>("");
  const [processedUrl, setProcessedUrl] = useState<string>("");

  const [options, setOptions] =
    useState<ProcessingOptions>(defaultProcessingOptions);

  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const [detections, setDetections] = useState<Detection[]>([]);

  const [originalMeta, setOriginalMeta] =
    useState<ImageMetadata | null>(null);
  const [processedMeta, setProcessedMeta] =
    useState<ImageMetadata | null>(null);

  const { toast } = useToast();

  /* ===============================
     FILE SELECT
  ================================ */

  const handleFileSelect = useCallback((selectedFile: File) => {
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalMeta({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        width: img.width,
        height: img.height,
      });
    };
    img.src = url;

    setProcessedUrl("");
    setProcessedMeta(null);
    setDetections([]);
    setStep("options");
  }, []);

  /* ===============================
     UPLOAD + PROCESS
  ================================ */

  const handleProcess = useCallback(async () => {
    if (!file) return;

    const config = getApiConfig();

    if (!config.apiGatewayUrl || !config.s3BucketName) {
      toast({
        title: "API not configured",
        description: "Please configure API Gateway URL and S3 bucket.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      toast({ title: "Uploading image..." });

      const { key } = await uploadImage(config, file);
      setS3Key(key);
      setIsUploading(false);

      setIsProcessing(true);
      toast({ title: "Processing image..." });

      const result = await processImage(
        config,
        key,
        options as unknown as Record<string, unknown>
      );

      setProcessedUrl(result.processedUrl);

      if (result.metadata) {
        setProcessedMeta({
          name: `processed_${file.name}`,
          size: (result.metadata.size as number) || 0,
          type:
            (result.metadata.type as string) ||
            options.format.outputFormat,
          width: (result.metadata.width as number) || 0,
          height: (result.metadata.height as number) || 0,
        });
      }

      setStep("preview");

      toast({ title: "Processing complete!" });

    } catch (err) {
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  }, [file, options, toast]);

  /* ===============================
     OBJECT DETECTION
  ================================ */

  const handleDetectObjects = useCallback(async () => {
    if (!file) return;

    const config = getApiConfig();

    if (!config.apiGatewayUrl || !config.s3BucketName) {
      toast({
        title: "API not configured",
        description: "Please configure API Gateway URL and S3 bucket.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      toast({ title: "Uploading image..." });

      let key = s3Key;

      if (!key) {
        const { key: newKey } = await uploadImage(config, file);
        key = newKey;
        setS3Key(newKey);
      }

      setIsUploading(false);
      setIsDetecting(true);

      toast({ title: "Detecting objects..." });

      const results = await recognizeImage(config, key);

      console.log("Detected objects:", results);

      const formatted: Detection[] = (results || []).map((item: any) => ({
        name: item.name,
        confidence: item.confidence,
        box: item.box || undefined,
      }));

      setDetections(formatted);

      toast({ title: "Object detection complete!" });

    } catch (err) {
      toast({
        title: "Detection Error",
        description:
          err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsDetecting(false);
    }
  }, [file, s3Key, toast]);

  /* ===============================
     RESET
  ================================ */

  const reset = useCallback(() => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);

    setFile(null);
    setS3Key("");
    setOriginalUrl("");
    setProcessedUrl("");
    setOptions(defaultProcessingOptions);
    setOriginalMeta(null);
    setProcessedMeta(null);
    setDetections([]);
    setStep("upload");
  }, [originalUrl]);

  return {
    step,
    setStep,
    file,
    originalUrl,
    processedUrl,
    options,
    setOptions,
    isUploading,
    isProcessing,
    isDetecting,
    detections,
    originalMeta,
    processedMeta,
    handleFileSelect,
    handleProcess,
    handleDetectObjects,
    reset,
  };
}
