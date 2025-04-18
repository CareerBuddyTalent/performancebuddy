import { format } from "date-fns";
import { useState } from "react";
import { Survey } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MessageSquareText, BarChart4, ExternalLink } from "lucide-react";
import TakeSurveyDialog from "./surveys/TakeSurveyDialog";
import { useAuth } from "@/context/AuthContext";

interface SurveyCardProps {
  survey: Survey;
  onClick?: () => void;
}

export default function SurveyCard({ survey, onClick }: SurveyCardProps) {
  const [showTakeSurvey, setShowTakeSurvey] = useState(false);
  const { user } = useAuth();
  
  const hasResponded = survey.responses.some(r => r.user_id === user?.id);
  
  // Calculate response rate
  const responseRate = survey.target_audience === 'all' 
    ? Math.round((survey.responses.length / 100) * 100) 
    : Math.round((survey.responses.length / (survey.audienceIds?.length || 1)) * 100);
  
  // Determine status color
  const statusColor = {
    draft: "bg-slate-100 text-slate-700",
    active: "bg-green-100 text-green-700",
    closed: "bg-purple-100 text-purple-700"
  };
  
  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1">{survey.title}</CardTitle>
            <Badge className={statusColor[survey.status]}>
              {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{survey.description}</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Response Rate</span>
                <span className="font-medium">{responseRate}%</span>
              </div>
              <Progress value={responseRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Questions</p>
                <p className="font-medium">{survey.questions.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Responses</p>
                <p className="font-medium">{survey.responses.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{format(new Date(survey.start_date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">{format(new Date(survey.end_date), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 pt-2">
          {survey.status === 'active' && !hasResponded && (
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowTakeSurvey(true)}>
              <MessageSquareText className="h-4 w-4 mr-2" />
              Take Survey
            </Button>
          )}
          {(hasResponded || survey.status === 'closed') && (
            <Button variant="outline" size="sm" className="w-full">
              <BarChart4 className="h-4 w-4 mr-2" />
              View Results
            </Button>
          )}
        </CardFooter>
      </Card>

      {showTakeSurvey && (
        <TakeSurveyDialog
          survey={survey}
          open={showTakeSurvey}
          onClose={() => setShowTakeSurvey(false)}
        />
      )}
    </>
  );
}
