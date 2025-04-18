
import { Plus, BarChart4 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SurveyActionsProps {
  onCreateClick: () => void;
}

export default function SurveyActions({ onCreateClick }: SurveyActionsProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline">
        <BarChart4 className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      <Button onClick={onCreateClick}>
        <Plus className="mr-2 h-4 w-4" />
        Create Survey
      </Button>
    </div>
  );
}
