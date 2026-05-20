import { ApiConfig } from "./types";

const STORAGE_KEY = "img-processor-api-config";

/* ===============================
   CONFIG STORAGE
================================= */

export function getApiConfig(): ApiConfig {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Invalid API config in localStorage", error);
    }
  }

  return {
    apiGatewayUrl: "",
    s3BucketName: "",
    awsRegion: "us-east-1",
  };
}

export function saveApiConfig(config: ApiConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/* ===============================
   HELPER FUNCTIONS
================================= */

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/* ===============================
   FILE → BASE64 CONVERSION
================================= */

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;

      // remove "data:image/jpeg;base64,"
      const base64 = result.split(",")[1];

      resolve(base64);
    };

    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(file);
  });
}

/* ===============================
   UPLOAD IMAGE
================================= */

export async function uploadImage(
  config: ApiConfig,
  file: File
): Promise<{ key: string }> {

  const baseUrl = normalizeUrl(config.apiGatewayUrl);

  if (!baseUrl) {
    throw new Error("API Gateway URL is not configured.");
  }

  const base64Image = await fileToBase64(file);

  const response = await fetch(`${baseUrl}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image: base64Image,
      fileName: file.name,
      fileType: file.type,
      bucket: config.s3BucketName
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload image: ${errorText}`);
  }

  return response.json();
}

/* ===============================
   PROCESS IMAGE
================================= */

export async function processImage(
  config: ApiConfig,
  imageKey: string,
  options: Record<string, unknown>
): Promise<{
  processedUrl: string;
  metadata: Record<string, unknown>;
}> {

  const baseUrl = normalizeUrl(config.apiGatewayUrl);

  const response = await fetch(`${baseUrl}/process`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      imageKey,
      bucket: config.s3BucketName,
      options
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image processing failed: ${errorText}`);
  }

  return response.json();
}

/* ===============================
   IMAGE RECOGNITION
================================= */

export interface DetectedObject {
  name: string;
  confidence: number;
}

export async function recognizeImage(
  config: ApiConfig,
  imageKey: string
): Promise<DetectedObject[]> {

  const baseUrl = normalizeUrl(config.apiGatewayUrl);

  const response = await fetch(`${baseUrl}/detect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      imageKey,
      bucket: config.s3BucketName
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Image recognition failed: ${errorText}`);
  }

  const data = await response.json();

  // return only the detected objects list
  return data.labels || [];
}