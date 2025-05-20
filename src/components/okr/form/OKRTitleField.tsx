
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OKRTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function OKRTitleField({ value, onChange }: OKRTitleFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter objective title"
        required
      />
    </div>
  );
}
