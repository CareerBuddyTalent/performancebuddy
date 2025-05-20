
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Objective } from "@/services/objectiveService";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import KeyResultItem, { KeyResult as KeyResultItemType } from "./KeyResultItem";

// Define the KeyResult type that matches the expected structure
interface KeyResult {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: string;
  objectiveId: string;
  type: string;
  currentValue: number;
  targetValue: number;
  startValue: number;
  unit?: string;
  updated_at?: string;
}

interface ObjectiveCardProps {
  objective: Objective;
  onView?: (objective: Objective) => void;
  onAddKeyResult?: (objectiveId: string) => void;
}

export function ObjectiveCard({ objective, onView, onAddKeyResult }: ObjectiveCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'company':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'department':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'team':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
    }
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'on_track':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'behind_schedule':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      case 'at_risk':
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Create a function to convert service KeyResult to component KeyResult
  const convertKeyResult = (kr: any): KeyResultItemType => {
    return {
      id: kr.id,
      title: kr.title,
      description: kr.description,
      progress: kr.progress,
      status: kr.status,
      objectiveId: kr.objective_id || objective.id || '',
      type: kr.type || 'number',
      currentValue: kr.current_value,
      targetValue: kr.target_value,
      startValue: kr.start_value || 0,
      unit: kr.unit,
      updated_at: kr.updated_at
    };
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge className={getLevelBadgeColor(objective.level)}>
              {objective.level.charAt(0).toUpperCase() + objective.level.slice(1)}
            </Badge>
            <Badge className={getStatusBadgeColor(objective.status)}>
              {formatStatus(objective.status)}
            </Badge>
          </div>
          <h3 className="font-medium text-lg mt-2">{objective.title}</h3>
          {objective.description && <p className="text-sm text-muted-foreground mt-1">{objective.description}</p>}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{objective.progress}%</span>
            </div>
            <Progress value={objective.progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>
                {format(new Date(objective.due_date), "MMM d, yyyy")}
              </span>
            </div>
            
            <div className="flex gap-2">
              {onAddKeyResult && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onAddKeyResult(objective.id || '')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Key Result
                </Button>
              )}
              
              {onView && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onView(objective)}
                >
                  View
                </Button>
              )}
            </div>
          </div>
          
          {objective.key_results && objective.key_results.length > 0 && (
            <div className="pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 text-muted-foreground"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <ChevronUp className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 mr-1" />
                )}
                {objective.key_results.length} Key Results
              </Button>
              
              {expanded && (
                <div className="mt-2 space-y-2">
                  {objective.key_results.map(kr => (
                    <KeyResultItem key={kr.id} keyResult={convertKeyResult(kr)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ObjectiveCard;
