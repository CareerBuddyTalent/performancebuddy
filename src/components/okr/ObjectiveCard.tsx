
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Objective } from "@/types/okr";
import { format } from "date-fns";
import { AlertCircle, Calendar, Check, ChevronDown, ChevronUp, Plus } from "lucide-react";
import KeyResultItem from "./KeyResultItem";
import { useState } from "react";
import CheckInDialog from "./CheckInDialog";

interface ObjectiveCardProps {
  objective: Objective;
  onAddKeyResult: () => void;
}

export default function ObjectiveCard({ objective, onAddKeyResult }: ObjectiveCardProps) {
  const [expanded, setExpanded] = useState(true);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedKeyResultId, setSelectedKeyResultId] = useState<string | null>(null);

  const statusColors = {
    draft: "bg-gray-100 text-gray-800",
    active: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const handleCheckIn = (keyResultId: string) => {
    setSelectedKeyResultId(keyResultId);
    setShowCheckIn(true);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{objective.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {objective.description}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded ${statusColors[objective.status]}`}>
              {objective.status.charAt(0).toUpperCase() + objective.status.slice(1)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {format(objective.startDate, "MMM d, yyyy")} - {format(objective.endDate, "MMM d, yyyy")}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2 mt-2">
          <span className="text-sm font-medium">Progress: {objective.progress}%</span>
          {objective.progress >= 70 ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : objective.progress < 30 ? (
            <AlertCircle className="h-4 w-4 text-amber-500" />
          ) : null}
        </div>
        <Progress value={objective.progress} className="h-2" />

        {expanded && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Key Results</h4>
              <span className="text-xs text-muted-foreground">{objective.keyResults.length} items</span>
            </div>
            <div className="space-y-2 mt-2">
              {objective.keyResults.map(keyResult => (
                <KeyResultItem
                  key={keyResult.id}
                  keyResult={keyResult}
                  onCheckIn={() => handleCheckIn(keyResult.id)}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" size="sm" onClick={onAddKeyResult}>
          <Plus className="h-3 w-3 mr-1" />
          Add Key Result
        </Button>
      </CardFooter>

      {selectedKeyResultId && (
        <CheckInDialog
          open={showCheckIn}
          onOpenChange={setShowCheckIn}
          keyResult={objective.keyResults.find(kr => kr.id === selectedKeyResultId)!}
          onCheckIn={() => setShowCheckIn(false)}
        />
      )}
    </Card>
  );
}
