
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type OKRLevel = "individual" | "team" | "department" | "company";

interface OKRLevelFieldProps {
  value: OKRLevel;
  onChange: (value: OKRLevel) => void;
}

export function OKRLevelField({ value, onChange }: OKRLevelFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="level">Level</Label>
      <Select value={value} onValueChange={(value) => onChange(value as OKRLevel)}>
        <SelectTrigger id="level">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="individual">Individual</SelectItem>
          <SelectItem value="team">Team</SelectItem>
          <SelectItem value="department">Department</SelectItem>
          <SelectItem value="company">Company</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
