import { useState } from "react";
import { Plus, BarChart4 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SurveyAnalytics from "./analytics/SurveyAnalytics";
import { useClerkAuth } from "@/context/ClerkAuthContext";

interface SurveyActionsProps {
  onCreateClick: () => void;
}

export default function SurveyActions({ onCreateClick }: SurveyActionsProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { user } = useClerkAuth();
  
  // Only allow admin and manager roles to create surveys
  const canCreateSurvey = user && (user.role === 'admin' || user.role === 'manager');

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setShowAnalytics(true)}>
          <BarChart4 className="mr-2 h-4 w-4" />
          Analytics
        </Button>
        {canCreateSurvey && (
          <Button onClick={onCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create Survey
          </Button>
        )}
      </div>

      <SurveyAnalytics 
        open={showAnalytics} 
        onClose={() => setShowAnalytics(false)} 
      />
    </>
  );
}
