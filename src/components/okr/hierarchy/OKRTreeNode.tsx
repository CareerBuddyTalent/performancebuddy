
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { TreeNode } from "./treeUtils";

interface OKRTreeNodeProps {
  node: TreeNode;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
  onCreateObjective?: (parentId?: string) => void;
  onViewObjective?: (objective: TreeNode) => void;
  renderChildNodes: (parentId: string) => React.ReactNode;
}

export const OKRTreeNode: React.FC<OKRTreeNodeProps> = ({
  node, 
  expandedNodes,
  toggleNode,
  onCreateObjective,
  onViewObjective,
  renderChildNodes
}) => {
  const isExpanded = expandedNodes.has(node.id || '');
  const hasChildren = node.children.length > 0;
  
  const getBorderColor = (level: string) => {
    switch (level) {
      case 'company': return 'border-l-blue-600';
      case 'department': return 'border-l-purple-600';
      case 'team': return 'border-l-green-600';
      default: return 'border-l-amber-600';
    }
  };

  return (
    <div key={node.id} className="mb-3">
      <div 
        className={`relative pl-${node.depth * 4} ${node.depth > 0 ? 'border-l ml-3' : ''}`}
        style={{ marginLeft: node.depth > 0 ? '0.75rem' : 0, paddingLeft: `${node.depth * 1}rem` }}
      >
        <Card className={`border-l-4 ${getBorderColor(node.level)} hover:shadow-md transition-shadow`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 mr-2"
                    onClick={() => toggleNode(node.id || '')}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </Button>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{node.title}</h4>
                    <Badge variant="outline" className="ml-2">
                      {node.level === 'company' ? 'Company' :
                       node.level === 'department' ? 'Department' :
                       node.level === 'team' ? 'Team' : 'Individual'}
                    </Badge>
                    <Badge 
                      variant={
                        node.status === 'completed' ? 'default' :
                        node.status === 'on_track' ? 'outline' :
                        node.status === 'behind_schedule' ? 'destructive' :
                        'secondary'
                      }
                      className="ml-auto"
                    >
                      {node.status?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {node.description || 'No description'}
                  </p>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Progress</span>
                      <span className="text-xs font-medium">{node.progress}%</span>
                    </div>
                    <Progress 
                      value={node.progress} 
                      className={`h-2 ${
                        node.progress >= 80 ? 'bg-green-600' :
                        node.progress >= 50 ? 'bg-amber-600' :
                        'bg-red-600'
                      }`} 
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <span className="inline-block mr-4">
                      Start: {new Date(node.start_date).toLocaleDateString()}
                    </span>
                    <span>
                      Due: {new Date(node.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
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
      {isExpanded && hasChildren && renderChildNodes(node.id || '')}
    </div>
  );
};
