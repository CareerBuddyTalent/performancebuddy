
import { Button } from "@/components/ui/button";
import { Upload, Eye } from "lucide-react";

interface SkillsHeaderProps {
  onImportClick: () => void;
}

export function SkillsHeader({ onImportClick }: SkillsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Skills & Development</h1>
        <p className="text-muted-foreground">
          Manage skills, career paths, and development plans
        </p>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" onClick={onImportClick}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button variant="default">
          <Eye className="mr-2 h-4 w-4" />
          Skills Report
        </Button>
      </div>
    </div>
  );
}
