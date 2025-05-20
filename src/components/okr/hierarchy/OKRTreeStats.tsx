
import React from 'react';
import { Objective } from "@/services/objectiveService";
import { ArrowDownUp, Users } from "lucide-react";

interface OKRTreeStatsProps {
  objectives: Objective[];
}

export const OKRTreeStats: React.FC<OKRTreeStatsProps> = ({ objectives }) => {
  // Calculate stats
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(obj => obj.progress === 100).length;
  const averageProgress = objectives.length > 0
    ? Math.round(objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length)
    : 0;

  const getLevelIcon = (level: string) => {
    switch(level) {
      case 'company':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'department':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'team':
        return <Users className="h-4 w-4 text-green-600" />;
      default:
        return <ArrowDownUp className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
      <div className="flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-1">
          {getLevelIcon('company')}
          <span className="text-xs">Company</span>
        </div>
        <div className="flex items-center space-x-1">
          {getLevelIcon('department')}
          <span className="text-xs">Department</span>
        </div>
        <div className="flex items-center space-x-1">
          {getLevelIcon('team')}
          <span className="text-xs">Team</span>
        </div>
        <div className="flex items-center space-x-1">
          {getLevelIcon('individual')}
          <span className="text-xs">Individual</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 ml-auto text-sm">
        <div>
          <span className="font-medium">{totalObjectives}</span>
          <span className="text-muted-foreground ml-1">Objectives</span>
        </div>
        <div>
          <span className="font-medium">{completedObjectives}</span>
          <span className="text-muted-foreground ml-1">Completed</span>
        </div>
        <div>
          <span className="font-medium">{averageProgress}%</span>
          <span className="text-muted-foreground ml-1">Avg Progress</span>
        </div>
      </div>
    </div>
  );
};
