
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Clock, Plus } from "lucide-react";
import { Objective } from "@/services/objectiveService";
import OKRProgressBar from "./OKRProgressBar";
import KeyResultItem from "./KeyResultItem";

interface ObjectiveCardProps {
  objective: Objective;
  onView?: () => void;
  onAddKeyResult?: () => void;
}

export default function ObjectiveCard({ objective, onView, onAddKeyResult }: ObjectiveCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on_track': return 'bg-blue-500';
      case 'behind_schedule': return 'bg-red-500';
      case 'ahead': return 'bg-green-400';
      case 'in_progress': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2 relative">
        <div className={`absolute top-0 left-0 h-full w-1 ${getStatusColor(objective.status)}`}></div>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{objective.title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="capitalize">
              {objective.level}
            </Badge>
            <Badge variant={objective.progress >= 80 ? "default" : objective.progress >= 50 ? "secondary" : "outline"}>
              {objective.progress}% Complete
            </Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDate(objective.start_date)} - {formatDate(objective.due_date)}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2">
        <OKRProgressBar percentage={objective.progress} status={objective.status} />
        
        <div className="mt-4">
          {objective.description && (
            <p className={`text-sm text-muted-foreground ${!showDetails ? "line-clamp-2" : ""} mb-3`}>
              {objective.description}
            </p>
          )}
          
          {objective.key_results && objective.key_results.length > 0 && (
            <div className={`mt-2 space-y-3 ${!showDetails ? "hidden" : ""}`}>
              <h3 className="text-sm font-medium">Key Results</h3>
              {objective.key_results.map((kr, index) => (
                <KeyResultItem key={kr.id || index} keyResult={kr} />
              ))}
            </div>
          )}
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs px-2"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Show More
                </>
              )}
            </Button>
            
            <div className="flex gap-2">
              {onAddKeyResult && (
                <Button variant="outline" size="sm" onClick={onAddKeyResult}>
                  <Plus className="h-4 w-4 mr-1" /> Key Result
                </Button>
              )}
              
              {onView && (
                <Button variant="outline" size="sm" onClick={onView}>
                  View Details
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
