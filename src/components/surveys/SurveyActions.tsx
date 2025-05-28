import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users, BarChart3 } from "lucide-react";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface SurveyActionsProps {
  surveyId: string;
  onEdit: (surveyId: string) => void;
  onDelete: (surveyId: string) => void;
  onShare: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
}

export function SurveyActions({
  surveyId,
  onEdit,
  onDelete,
  onShare,
  onViewResults,
}: SurveyActionsProps) {
  const { user } = useSupabaseAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onEdit(surveyId)}
        disabled={!isAdmin}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onDelete(surveyId)}
        disabled={!isAdmin}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onShare(surveyId)}
      >
        <Users className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onViewResults(surveyId)}
      >
        <BarChart3 className="h-4 w-4" />
      </Button>
    </div>
  );
}

