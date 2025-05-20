
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowDownUp, ChevronDown, ChevronUp, Plus, Users } from "lucide-react";
import { Objective } from "@/types/okr";

interface OKRHierarchyTreeProps {
  objectives: Objective[];
  onCreateObjective?: (parentId?: string) => void;
  onViewObjective?: (objective: Objective) => void;
}

interface TreeNode extends Objective {
  children: TreeNode[];
  depth: number;
  isExpanded: boolean;
}

export default function OKRHierarchyTree({
  objectives,
  onCreateObjective,
  onViewObjective
}: OKRHierarchyTreeProps) {
  // Build the tree structure from flat objectives array
  const buildTree = (objectives: Objective[]): TreeNode[] => {
    const nodeMap: { [key: string]: TreeNode } = {};
    const roots: TreeNode[] = [];
    
    // First pass: create nodes with empty children arrays
    objectives.forEach(obj => {
      nodeMap[obj.id] = { 
        ...obj, 
        children: [],
        depth: 0,
        isExpanded: true
      };
    });
    
    // Second pass: build the tree structure
    objectives.forEach(obj => {
      const node = nodeMap[obj.id];
      
      if (obj.alignedWith && nodeMap[obj.alignedWith]) {
        // This is a child node
        const parent = nodeMap[obj.alignedWith];
        parent.children.push(node);
        node.depth = parent.depth + 1;
      } else {
        // This is a root node
        roots.push(node);
      }
    });
    
    return roots;
  };

  const rootNodes = buildTree(objectives);
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(objectives.map(obj => obj.id))
  );
  
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };
  
  const renderNode = (node: TreeNode) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    
    return (
      <div key={node.id} className="mb-2">
        <div 
          className={`relative pl-${node.depth * 4} ${node.depth > 0 ? 'border-l ml-3' : ''}`}
          style={{ marginLeft: node.depth > 0 ? '0.75rem' : 0, paddingLeft: `${node.depth * 1}rem` }}
        >
          <Card className={`border-l-4 ${
            node.level === 'company' ? 'border-l-blue-600' : 
            node.level === 'department' ? 'border-l-purple-600' : 
            node.level === 'team' ? 'border-l-green-600' : 
            'border-l-amber-600'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {hasChildren && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 mr-2"
                      onClick={() => toggleNode(node.id)}
                    >
                      {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                    </Button>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{node.title}</h4>
                      <Badge variant="outline" className="ml-2">
                        {node.level === 'company' ? 'Company' :
                         node.level === 'department' ? 'Department' :
                         node.level === 'team' ? 'Team' : 'Individual'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {node.description}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">Progress</span>
                        <span className="text-xs font-medium">{node.progress}%</span>
                      </div>
                      <Progress value={node.progress} className="h-2" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {onViewObjective && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewObjective(node)}
                    >
                      View
                    </Button>
                  )}
                  {onCreateObjective && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCreateObjective(node.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Child
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {isExpanded && hasChildren && (
          <div className="ml-8">
            {node.children.map(child => renderNode(child))}
          </div>
        )}
      </div>
    );
  };
  
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
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
        {onCreateObjective && (
          <Button onClick={() => onCreateObjective()} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Top-Level Objective
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {rootNodes.map(node => renderNode(node))}
      </div>
      
      {rootNodes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No objectives have been created yet</p>
          {onCreateObjective && (
            <Button onClick={() => onCreateObjective()} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Create First Objective
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
