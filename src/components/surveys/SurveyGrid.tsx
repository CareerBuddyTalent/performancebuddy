
import { Survey } from "@/types";
import SurveyCard from "@/components/SurveyCard";

interface SurveyGridProps {
  surveys: Survey[];
  emptyMessage: string;
}

export default function SurveyGrid({ surveys, emptyMessage }: SurveyGridProps) {
  if (surveys.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {surveys.map(survey => (
        <SurveyCard key={survey.id} survey={survey} />
      ))}
    </div>
  );
}
