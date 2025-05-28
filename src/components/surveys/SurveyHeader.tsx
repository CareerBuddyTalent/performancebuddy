
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Survey } from "@/types/surveys";
import { SurveyActions } from "./SurveyActions";

interface SurveyHeaderProps {
  survey: Survey;
  onEdit: (survey: Survey) => void;
  onDelete: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
}

export default function SurveyHeader({ survey, onEdit, onDelete, onViewResults }: SurveyHeaderProps) {
  const { user } = useSupabaseAuth();
  const canEdit = user?.role === 'admin' || user?.id === survey.creator_id;

  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">{survey.title}</h2>
      
      {canEdit ? (
        <SurveyActions 
          surveyId={survey.id}
          onEdit={() => onEdit(survey)} 
          onDelete={onDelete} 
          onShare={() => {}}
          onViewResults={onViewResults} 
        />
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewResults(survey.id)}>
              View Results
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
