
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InitialCommentsProps {
  value: string;
  onChange: (value: string) => void;
}

export default function InitialComments({ value, onChange }: InitialCommentsProps) {
  return (
    <div className="grid gap-2">
      <Label>Initial Comments (Optional)</Label>
      <Textarea
        placeholder="Add any initial comments or instructions for the review"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </div>
  );
}
