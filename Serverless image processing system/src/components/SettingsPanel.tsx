import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getApiConfig, saveApiConfig } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const [config, setConfig] = useState(getApiConfig());
  const { toast } = useToast();

  useEffect(() => {
    if (open) setConfig(getApiConfig());
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    saveApiConfig(config);
    toast({ title: "Settings saved" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <Card className="glass-card glow-border w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="font-display flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs">API Gateway URL</Label>
            <Input
              placeholder="https://xxxx.execute-api.region.amazonaws.com/prod"
              value={config.apiGatewayUrl}
              onChange={(e) => setConfig({ ...config, apiGatewayUrl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">S3 Bucket Name</Label>
            <Input
              placeholder="my-image-bucket"
              value={config.s3BucketName}
              onChange={(e) => setConfig({ ...config, s3BucketName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">AWS Region</Label>
            <Input
              placeholder="us-east-1"
              value={config.awsRegion}
              onChange={(e) => setConfig({ ...config, awsRegion: e.target.value })}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1 gradient-bg text-primary-foreground font-display hover:opacity-90">
              <Save className="w-4 h-4 mr-2" /> Save
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
