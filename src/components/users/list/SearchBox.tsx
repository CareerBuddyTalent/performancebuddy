
import { Input } from "@/components/ui/input";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  usersCount: number;
}

export function SearchBox({ value, onChange, usersCount }: SearchBoxProps) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder="Search users..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-sm"
      />
      <p className="text-sm text-muted-foreground">
        Total: {usersCount} users
      </p>
    </div>
  );
}
