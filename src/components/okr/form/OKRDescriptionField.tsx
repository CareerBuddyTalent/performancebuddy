
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface OKRDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function OKRDescriptionField({ value, onChange }: OKRDescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your objective"
        rows={3}
      />
    </div>
  );
}
