
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface AnonymitySettings {
  isAnonymous: boolean;
  responseVisibility: "reviewer_only" | "manager_only" | "reviewee_visible" | "all_participants";
  hideIdentities: boolean;
  aggregateResults: boolean;
}

interface TemplateAnonymitySettingsProps {
  settings: AnonymitySettings;
  onSettingsChange: (settings: AnonymitySettings) => void;
}

export default function TemplateAnonymitySettings({
  settings,
  onSettingsChange,
}: TemplateAnonymitySettingsProps) {
  const [localSettings, setLocalSettings] = useState<AnonymitySettings>(settings);

  const handleChange = (key: keyof AnonymitySettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Response Anonymity Settings
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[300px] text-sm">
                  Configure how feedback and responses are shared with others
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>
          Determine who can see responses and how reviewer identities are handled
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous-mode"
              checked={localSettings.isAnonymous}
              onCheckedChange={(checked) => handleChange("isAnonymous", checked)}
            />
            <Label htmlFor="anonymous-mode" className="font-medium">Enable Anonymous Mode</Label>
          </div>
          <p className="text-sm text-muted-foreground pl-7">
            When enabled, reviewer identities won't be visible to the reviewee
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Response Visibility</h3>
          <RadioGroup
            value={localSettings.responseVisibility}
            onValueChange={(value) => 
              handleChange("responseVisibility", value as AnonymitySettings["responseVisibility"])
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reviewer_only" id="reviewer_only" />
              <Label htmlFor="reviewer_only">Reviewer Only (private)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manager_only" id="manager_only" />
              <Label htmlFor="manager_only">Manager Only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reviewee_visible" id="reviewee_visible" />
              <Label htmlFor="reviewee_visible">Visible to Reviewee</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all_participants" id="all_participants" />
              <Label htmlFor="all_participants">All Participants</Label>
            </div>
          </RadioGroup>
        </div>

        {localSettings.isAnonymous && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="hide-identities"
                checked={localSettings.hideIdentities}
                onCheckedChange={(checked) => handleChange("hideIdentities", checked)}
              />
              <Label htmlFor="hide-identities" className="font-medium">Hide identities from managers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="aggregate-results"
                checked={localSettings.aggregateResults}
                onCheckedChange={(checked) => handleChange("aggregateResults", checked)}
              />
              <Label htmlFor="aggregate-results" className="font-medium">Aggregate results in reports</Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
