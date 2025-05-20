
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface OKRCompletionCardProps {
  title: string;
  description: string;
  value: number;
  showProgress?: boolean;
  subtitle?: string;
}

export const OKRCompletionCard: React.FC<OKRCompletionCardProps> = ({
  title,
  description,
  value,
  showProgress = true,
  subtitle
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}{typeof value === 'number' && value < 100 && '%'}</div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        )}
        {showProgress && <Progress className="h-2 mt-2" value={value} />}
      </CardContent>
    </Card>
  );
};
