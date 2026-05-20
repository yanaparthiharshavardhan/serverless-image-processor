export interface ApiConfig {
  apiGatewayUrl: string;
  s3BucketName: string;
  awsRegion: string;
}

export interface ProcessingOptions {
  resize: {
    enabled: boolean;
    preset: "small" | "medium" | "large" | "custom";
    width: number;
    height: number;
  };
  filters: {
    grayscale: boolean;
    sepia: boolean;
    blur: number;
    sharpen: boolean;
    brightness: number;
    contrast: number;
  };
  format: {
    enabled: boolean;
    outputFormat: "png" | "jpeg" | "webp";
    quality: number;
  };
}

export interface ImageMetadata {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
}

export const defaultProcessingOptions: ProcessingOptions = {
  resize: { enabled: false, preset: "medium", width: 800, height: 600 },
  filters: { grayscale: false, sepia: false, blur: 0, sharpen: false, brightness: 100, contrast: 100 },
  format: { enabled: false, outputFormat: "jpeg", quality: 80 },
};

export const RESIZE_PRESETS = {
  small: { width: 320, height: 240 },
  medium: { width: 800, height: 600 },
  large: { width: 1920, height: 1080 },
} as const;
