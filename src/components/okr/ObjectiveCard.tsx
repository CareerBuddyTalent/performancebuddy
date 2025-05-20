
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, ArrowUp, ArrowDown, Plus } from "lucide-react";
import OKRProgressBar from "./OKRProgressBar";

interface ObjectiveCardProps {
  objective: any;
  onAddKeyResult: () => void;
}

export default function ObjectiveCard({ objective, onAddKeyResult }: ObjectiveCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [objectiveProgress, setObjectiveProgress] = useState(objective.progress);
  const [keyResults, setKeyResults] = useState(objective.keyResults);
  const [showWarning, setShowWarning] = useState(false);
  
  // Recalculate objective progress when key results change
  useEffect(() => {
    if (keyResults.length === 0) return;
    
    const totalProgress = keyResults.reduce((sum: number, kr: any) => sum + kr.progress, 0);
    const newProgress = Math.round(totalProgress / keyResults.length);
    
    if (newProgress !== objectiveProgress) {
      setObjectiveProgress(newProgress);
      // In a real app, this would update the objective in the database
    }
  }, [keyResults]);
  
  // Check for behind-schedule objectives and show warning
  useEffect(() => {
    // Simple logic: if progress is significantly behind expectation based on timeline
    const startDate = new Date(objective.startDate).getTime();
    const endDate = new Date(objective.endDate).getTime();
    const today = new Date().getTime();
    
    const totalDuration = endDate - startDate;
    const elapsed = today - startDate;
    const expectedProgress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
    
    // If progress is more than 20% behind expected, show warning
    setShowWarning(expectedProgress - objectiveProgress > 20);
  }, [objective, objectiveProgress]);
  
  // Update key result progress
  const handleKeyResultProgressUpdate = (id: string, newProgress: number) => {
    const updatedKeyResults = keyResults.map((kr: any) => 
      kr.id === id ? { ...kr, progress: newProgress } : kr
    );
    
    setKeyResults(updatedKeyResults);
    
    // In a real app, this would update the key result in the database
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
            Active
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30">
            Completed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  // Get progress color
  const getProgressColor = (value: number) => {
    if (value < 30) return "bg-red-500";
    if (value < 70) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle>{objective.title}</CardTitle>
          {getStatusBadge(objective.status)}
        </div>
        <CardDescription className="line-clamp-2">{objective.description}</CardDescription>
        <div className="flex justify-between items-center text-sm mt-2 text-muted-foreground">
          <div>
            {formatDate(objective.startDate)} — {formatDate(objective.endDate)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Overall Progress</div>
            <div className="text-sm font-medium">{objectiveProgress}%</div>
          </div>
          <Progress value={objectiveProgress} className={`h-2 ${getProgressColor(objectiveProgress)}`} />
        </div>
        
        {showWarning && (
          <div className="flex items-start gap-2 p-3 rounded bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div>
              <p className="font-medium">Goal is behind schedule</p>
              <p>Progress is lower than expected at this point in the timeline.</p>
            </div>
          </div>
        )}
        
        <div className="pt-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Key Results</h3>
            <Button onClick={() => setIsExpanded(!isExpanded)} variant="ghost" size="sm">
              {isExpanded ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </Button>
          </div>
          
          {isExpanded && (
            <div className="space-y-4 mt-2">
              {keyResults.map((kr: any) => (
                <div key={kr.id} className="border rounded-lg p-3 space-y-2">
                  <div className="font-medium">{kr.title}</div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <div>Current: {kr.currentValue}</div>
                    <div>Target: {kr.targetValue}</div>
                  </div>
                  <OKRProgressBar 
                    progress={kr.progress} 
                    keyResultId={kr.id} 
                    onUpdateProgress={handleKeyResultProgressUpdate} 
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button onClick={onAddKeyResult} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Key Result
        </Button>
      </CardFooter>
    </Card>
  );
}
