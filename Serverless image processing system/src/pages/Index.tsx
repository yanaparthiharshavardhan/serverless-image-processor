import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadZone from "@/components/UploadZone";
import ProcessingPanel from "@/components/ProcessingPanel";
import PreviewPanel from "@/components/PreviewPanel";
import SettingsPanel from "@/components/SettingsPanel";
import { useImageProcessor } from "@/hooks/useImageProcessor";

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    step, file, originalUrl, processedUrl,
    options, setOptions, isUploading, isProcessing,
    originalMeta, processedMeta,
    handleFileSelect, handleProcess, reset,
    isDetecting, detections, handleDetectObjects,
  } = useImageProcessor();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none gradient-bg" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-lg gradient-text">Lambda Vision</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} className="text-muted-foreground hover:text-foreground">
          <Settings className="w-5 h-5" />
        </Button>
      </header>

      {/* Main content */}
      <main className="relative z-10 px-6 py-8 max-w-5xl mx-auto">
        {step === "upload" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-8 pt-16">
            <div className="text-center space-y-3 max-w-lg">
              <h2 className="text-4xl md:text-5xl font-display font-bold gradient-text">
                Serverless Image Processing
              </h2>
              <p className="text-muted-foreground">
                Upload an image, choose your transformations, and let AWS Lambda handle the rest.
              </p>
            </div>
            <UploadZone onFileSelect={handleFileSelect} />
          </motion.div>
        )}

        {step === "options" && (
          <ProcessingPanel
            options={options}
            onChange={setOptions}
            originalPreview={originalUrl}
            onProcess={handleProcess}
            isProcessing={isProcessing}
            isUploading={isUploading}
            isDetecting={isDetecting}
            detections={detections}
            onDetect={handleDetectObjects}
          />
        )}

        {step === "preview" && (
          <PreviewPanel
            originalUrl={originalUrl}
            processedUrl={processedUrl}
            originalMeta={originalMeta}
            processedMeta={processedMeta}
            onReset={reset}
          />
        )}
      </main>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Index;
