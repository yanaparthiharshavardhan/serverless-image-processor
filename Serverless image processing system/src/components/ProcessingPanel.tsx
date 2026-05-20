import { ProcessingOptions, RESIZE_PRESETS } from "@/lib/types";
import type { Detection } from "@/hooks/useImageProcessor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Maximize2, Palette, FileType, Wand2, Target } from "lucide-react";

interface ProcessingPanelProps {
  options: ProcessingOptions;
  onChange: (options: ProcessingOptions) => void;
  originalPreview: string;
  onProcess: () => void;
  isProcessing: boolean;
  isUploading: boolean;
  isDetecting?: boolean;
  detections?: Detection[];
  onDetect?: () => void;
}

export default function ProcessingPanel({ options, onChange, originalPreview, onProcess, isProcessing, isUploading, isDetecting = false, detections = [], onDetect, }: ProcessingPanelProps) {
  const update = (partial: Partial<ProcessingOptions>) => onChange({ ...options, ...partial });

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto grid md:grid-cols-[1fr_300px] gap-6">
      {/* Preview thumbnail */}
      <div className="glass-card p-4 flex items-center justify-center overflow-hidden">
        <img src={originalPreview} alt="Original" className="max-h-[400px] rounded-lg object-contain" />
      </div>

      {/* Options */}
      <div className="space-y-4">
        <Tabs defaultValue="resize" className="w-full">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="resize" className="flex-1 text-xs"><Maximize2 className="w-3 h-3 mr-1" />Resize</TabsTrigger>
            <TabsTrigger value="filters" className="flex-1 text-xs"><Palette className="w-3 h-3 mr-1" />Filters</TabsTrigger>
            <TabsTrigger value="format" className="flex-1 text-xs"><FileType className="w-3 h-3 mr-1" />Format</TabsTrigger>
            <TabsTrigger value="detect" className="flex-1 text-xs"><Target className="w-3 h-3 mr-1" />Detect</TabsTrigger>
          </TabsList>

          <TabsContent value="resize">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Resize</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Enable</Label>
                  <Switch checked={options.resize.enabled} onCheckedChange={(v) => update({ resize: { ...options.resize, enabled: v } })} />
                </div>
                {options.resize.enabled && (
                  <>
                    <Select value={options.resize.preset} onValueChange={(v) => {
                      const preset = v as keyof typeof RESIZE_PRESETS | "custom";
                      if (preset !== "custom") {
                        update({ resize: { ...options.resize, preset, ...RESIZE_PRESETS[preset] } });
                      } else {
                        update({ resize: { ...options.resize, preset } });
                      }
                    }}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (320×240)</SelectItem>
                        <SelectItem value="medium">Medium (800×600)</SelectItem>
                        <SelectItem value="large">Large (1920×1080)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    {options.resize.preset === "custom" && (
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="number" placeholder="Width" value={options.resize.width} onChange={(e) => update({ resize: { ...options.resize, width: +e.target.value } })} className="h-8 text-xs" />
                        <Input type="number" placeholder="Height" value={options.resize.height} onChange={(e) => update({ resize: { ...options.resize, height: +e.target.value } })} className="h-8 text-xs" />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="filters">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Filters & Effects</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between"><Label className="text-xs">Grayscale</Label><Switch checked={options.filters.grayscale} onCheckedChange={(v) => update({ filters: { ...options.filters, grayscale: v } })} /></div>
                <div className="flex items-center justify-between"><Label className="text-xs">Sepia</Label><Switch checked={options.filters.sepia} onCheckedChange={(v) => update({ filters: { ...options.filters, sepia: v } })} /></div>
                <div className="flex items-center justify-between"><Label className="text-xs">Sharpen</Label><Switch checked={options.filters.sharpen} onCheckedChange={(v) => update({ filters: { ...options.filters, sharpen: v } })} /></div>
                <div className="space-y-1">
                  <Label className="text-xs">Blur ({options.filters.blur})</Label>
                  <Slider min={0} max={20} step={1} value={[options.filters.blur]} onValueChange={([v]) => update({ filters: { ...options.filters, blur: v } })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Brightness ({options.filters.brightness}%)</Label>
                  <Slider min={0} max={200} step={5} value={[options.filters.brightness]} onValueChange={([v]) => update({ filters: { ...options.filters, brightness: v } })} />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Contrast ({options.filters.contrast}%)</Label>
                  <Slider min={0} max={200} step={5} value={[options.filters.contrast]} onValueChange={([v]) => update({ filters: { ...options.filters, contrast: v } })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="format">
            <Card className="glass-card border-border/50">
              <CardHeader className="pb-3"><CardTitle className="text-sm font-display">Format Conversion</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between"><Label className="text-xs">Enable</Label><Switch checked={options.format.enabled} onCheckedChange={(v) => update({ format: { ...options.format, enabled: v } })} /></div>
                {options.format.enabled && (
                  <>
                    <Select value={options.format.outputFormat} onValueChange={(v) => update({ format: { ...options.format, outputFormat: v as "png" | "jpeg" | "webp" } })}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="space-y-1">
                      <Label className="text-xs">Quality ({options.format.quality}%)</Label>
                      <Slider min={10} max={100} step={5} value={[options.format.quality]} onValueChange={([v]) => update({ format: { ...options.format, quality: v } })} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
            <TabsContent value="detect">
            <Card className="glass-card border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-display">
                  Object Detection (AWS Cloud)
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button
                  onClick={onDetect}
                  disabled={isDetecting}
                  className="w-full gradient-bg text-primary-foreground"
                >
                  {isDetecting ? "Detecting…" : "Run Object Detection"}
                </Button>

                {detections.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs">Detected Objects:</Label>
                    {detections.map((obj, index) => (
                      <div
                        key={index}
                        className="text-xs p-2 bg-secondary rounded-md flex justify-between"
                      >
                        <span>{obj.name}</span>
                        <span>{obj.confidence.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        <Button onClick={onProcess} disabled={isProcessing || isUploading} className="w-full gradient-bg text-primary-foreground font-display font-semibold hover:opacity-90 transition-opacity">
          <Wand2 className="w-4 h-4 mr-2" />
          {isUploading ? "Uploading…" : isProcessing ? "Processing…" : "Process Image"}
        </Button>
      </div>
    </motion.div>
  );
}
