import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Define the KeyResult type that should match the one in ObjectiveCard.tsx
export interface KeyResult {
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

interface KeyResultItemProps {
  keyResult: KeyResult;
}

const KeyResultItem: React.FC<KeyResultItemProps> = ({ keyResult }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'behind':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300';
      case 'at_risk':
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

  const renderValue = () => {
    if (keyResult.unit === '%') {
      return `${keyResult.currentValue}% / ${keyResult.targetValue}%`;
    } else if (keyResult.unit) {
      return `${keyResult.currentValue}${keyResult.unit} / ${keyResult.targetValue}${keyResult.unit}`;
    }
    return `${keyResult.currentValue} / ${keyResult.targetValue}`;
  };

  return (
    <Card className="border-l-2 border-l-gray-300">
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium">{keyResult.title}</h4>
              <Badge className={getStatusColor(keyResult.status)}>
                {formatStatus(keyResult.status)}
              </Badge>
            </div>
            
            {keyResult.description && (
              <p className="text-xs text-muted-foreground mb-2">{keyResult.description}</p>
            )}
            
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{renderValue()}</span>
              </div>
              <Progress value={keyResult.progress} className="h-1.5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KeyResultItem;
