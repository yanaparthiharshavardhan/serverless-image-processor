# Serverless Image Processor UI

A modern React frontend for uploading and processing images via an AWS serverless backend (API Gateway, Lambda, and S3). Built with Vite, TypeScript, and Tailwind CSS.

## Features

- **Multipart Image Uploads**: Handles image uploads to AWS S3 via an API Gateway and Lambda backend.
- **Serverless Architecture**: Seamlessly interacts with AWS serverless endpoints for scalable image processing.
- **Modern Tech Stack**: Uses React, Vite, TypeScript, and Tailwind CSS for a fast, responsive user interface.
- **UI Components**: Built using Radix UI and Shadcn UI components.

## Getting Started

### Prerequisites

- Node.js & npm installed

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yanaparthiharshavardhan/serverless-image-processor.git
   ```
2. Navigate to the project directory:
   ```bash
   cd "serverless image processing system/Serverless image processing system/Serverless image processing system"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the App

Start the development server with auto-reloading:

```bash
npm run dev
```

## Configuration

Make sure your backend API Gateway URL and S3 Bucket are properly configured in your environment or settings so the app can communicate with your serverless backend.

## Architecture

The React frontend does not upload files directly to S3. Instead, it calls an API Gateway endpoint (`POST /upload`) which is backed by a Python Lambda. The Lambda is responsible for accepting the file (as `multipart/form-data`), writing it to the configured S3 bucket, and returning a JSON object with a `key` value. The frontend stores the key and later uses the `/process` endpoint to trigger any additional image processing.
