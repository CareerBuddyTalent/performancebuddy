
import React, { useState } from 'react';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, TrendingUp } from "lucide-react";
import { Goal } from "@/types";

interface ObjectiveType {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  keyResults: string[];
}

export default function PersonalOKRs() {
  const { user } = useSupabaseAuth();
  const [objectives, setObjectives] = useState<ObjectiveType[]>([
    {
      id: '1',
      title: 'Improve Customer Satisfaction',
      description: 'Increase overall customer satisfaction scores',
      progress: 75,
      status: 'in_progress',
      keyResults: [
        'Achieve 90% customer satisfaction score',
        'Reduce response time to under 2 hours',
        'Implement 3 new customer feedback initiatives'
      ]
    }
  ]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Personal OKRs</CardTitle>
            <CardDescription>
              Track your objectives and key results
            </CardDescription>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {objectives.map((objective) => (
            <div key={objective.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{objective.title}</h3>
                  <p className="text-muted-foreground">{objective.description}</p>
                </div>
                <Badge variant={
                  objective.status === 'completed' ? 'default' :
                  objective.status === 'in_progress' ? 'secondary' : 'outline'
                }>
                  {objective.status.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{objective.progress}%</span>
                </div>
                <Progress value={objective.progress} />
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Results</h4>
                <ul className="space-y-1">
                  {objective.keyResults.map((keyResult, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <Target className="h-3 w-3 mr-2" />
                      {keyResult}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
