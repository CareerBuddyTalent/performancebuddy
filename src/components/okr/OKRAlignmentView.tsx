
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Objective } from "@/types/okr";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OKRHierarchyTree from "./OKRHierarchyTree";

interface OKRAlignmentViewProps {
  objectives: Objective[];
  onCreateObjective?: (parentId?: string) => void;
  onViewObjective?: (objective: Objective) => void;
}

interface ObjectiveWithScore extends Objective {
  alignmentScore: number;
}

export default function OKRAlignmentView({
  objectives,
  onCreateObjective,
  onViewObjective
}: OKRAlignmentViewProps) {
  const [viewType, setViewType] = useState<"tree" | "alignment">("tree");
  const [selectedLevel, setSelectedLevel] = useState<"all" | "company" | "department" | "team">("all");
  
  const filteredObjectives = useMemo(() => {
    if (selectedLevel === "all") {
      return objectives;
    }
    return objectives.filter(obj => obj.level === selectedLevel);
  }, [objectives, selectedLevel]);
  
  // Calculate alignment scores for each objective
  const objectivesWithScores = useMemo(() => {
    return filteredObjectives.map(obj => {
      // Find all descendants (directly or indirectly aligned objectives)
      const findDescendants = (objId: string): Objective[] => {
        const directChildren = objectives.filter(o => o.alignedWith === objId);
        const allDescendants = [...directChildren];
        
        directChildren.forEach(child => {
          allDescendants.push(...findDescendants(child.id));
        });
        
        return allDescendants;
      };
      
      const descendants = findDescendants(obj.id);
      
      // Alignment score: weighted average of descendant progress
      // Higher weight for direct children, lower for deeper descendants
      let totalWeight = 0;
      let weightedSum = 0;
      
      if (descendants.length > 0) {
        descendants.forEach(desc => {
          // Calculate distance from current objective
          let distance = 1;
          let current = desc;
          
          while (current.alignedWith && current.alignedWith !== obj.id) {
            distance++;
            current = objectives.find(o => o.id === current.alignedWith)!;
          }
          
          const weight = 1 / distance;
          weightedSum += desc.progress * weight;
          totalWeight += weight;
        });
      }
      
      const alignmentScore = descendants.length > 0 
        ? Math.round(weightedSum / totalWeight) 
        : obj.progress;
      
      return { ...obj, alignmentScore };
    });
  }, [filteredObjectives, objectives]);
  
  // Group objectives by level for the alignment view
  const groupedObjectives = useMemo(() => {
    const grouped = {
      company: objectivesWithScores.filter(obj => obj.level === "company"),
      department: objectivesWithScores.filter(obj => obj.level === "department"),
      team: objectivesWithScores.filter(obj => obj.level === "team"),
      individual: objectivesWithScores.filter(obj => obj.level === "individual")
    };
    
    return grouped;
  }, [objectivesWithScores]);
  
  const renderAlignmentGroup = (title: string, objectives: ObjectiveWithScore[]) => {
    if (objectives.length === 0) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">{title}</h3>
        <div className="grid gap-3">
          {objectives.map(obj => (
            <Card key={obj.id} className="overflow-hidden">
              <div className="flex">
                <div className="w-2 bg-blue-600" />
                <CardContent className="p-4 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{obj.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {obj.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {obj.level}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Progress</span>
                        <span className="text-xs">{obj.progress}%</span>
                      </div>
                      <Progress value={obj.progress} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Alignment</span>
                        <span className="text-xs">{obj.alignmentScore}%</span>
                      </div>
                      <Progress value={obj.alignmentScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Select 
            value={selectedLevel} 
            onValueChange={(value) => setSelectedLevel(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="team">Team</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs value={viewType} onValueChange={(value) => setViewType(value as "tree" | "alignment")}>
          <TabsList>
            <TabsTrigger value="tree">Hierarchy View</TabsTrigger>
            <TabsTrigger value="alignment">Alignment View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <TabsContent value="tree" className="mt-0">
        <OKRHierarchyTree 
          objectives={filteredObjectives}
          onCreateObjective={onCreateObjective}
          onViewObjective={onViewObjective}
        />
      </TabsContent>
      
      <TabsContent value="alignment" className="mt-0 space-y-6">
        {renderAlignmentGroup("Company Objectives", groupedObjectives.company)}
        {renderAlignmentGroup("Department Objectives", groupedObjectives.department)}
        {renderAlignmentGroup("Team Objectives", groupedObjectives.team)}
        {renderAlignmentGroup("Individual Objectives", groupedObjectives.individual)}
      </TabsContent>
    </div>
  );
}
