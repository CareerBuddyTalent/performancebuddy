
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowDownUp, ChevronDown, ChevronUp, Plus, Users, Search, Filter } from "lucide-react";
import { Objective } from "@/services/objectiveService";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [visibleNodes, setVisibleNodes] = useState<TreeNode[]>([]);

  // Build the tree structure from flat objectives array
  const buildTree = (objectives: Objective[]): TreeNode[] => {
    const nodeMap: { [key: string]: TreeNode } = {};
    const roots: TreeNode[] = [];
    
    // First pass: create nodes with empty children arrays
    objectives.forEach(obj => {
      nodeMap[obj.id || ''] = { 
        ...obj, 
        children: [],
        depth: 0,
        isExpanded: expandedNodes.has(obj.id || '')
      };
    });
    
    // Second pass: build the tree structure
    objectives.forEach(obj => {
      const node = nodeMap[obj.id || ''];
      
      if (obj.parent_id && nodeMap[obj.parent_id]) {
        // This is a child node
        const parent = nodeMap[obj.parent_id];
        parent.children.push(node);
        node.depth = parent.depth + 1;
      } else {
        // This is a root node
        roots.push(node);
      }
    });
    
    // Sort children at each level
    const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
      const sorted = nodes.sort((a, b) => {
        // Sort by level first
        const levelOrder = { company: 0, department: 1, team: 2, individual: 3 };
        const levelDiff = 
          levelOrder[a.level as keyof typeof levelOrder] - 
          levelOrder[b.level as keyof typeof levelOrder];
        
        if (levelDiff !== 0) return levelDiff;
        
        // Then by progress (descending)
        return b.progress - a.progress;
      });
      
      // Recursively sort children
      sorted.forEach(node => {
        node.children = sortNodes(node.children);
      });
      
      return sorted;
    };
    
    return sortNodes(roots);
  };

  useEffect(() => {
    // Apply search filter and level filter to objectives
    let filteredObjectives = [...objectives];
    
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filteredObjectives = filteredObjectives.filter(obj => 
        obj.title.toLowerCase().includes(lowercaseQuery) ||
        (obj.description || "").toLowerCase().includes(lowercaseQuery)
      );
    }
    
    if (filterLevel !== "all") {
      filteredObjectives = filteredObjectives.filter(obj => obj.level === filterLevel);
    }
    
    const rootNodes = buildTree(filteredObjectives);
    setVisibleNodes(rootNodes);
  }, [objectives, searchQuery, filterLevel, expandedNodes]);
  
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
  
  const expandAll = () => {
    const allIds = objectives.map(obj => obj.id || '');
    setExpandedNodes(new Set(allIds));
  };
  
  const collapseAll = () => {
    setExpandedNodes(new Set());
  };
  
  const renderNode = (node: TreeNode) => {
    const isExpanded = expandedNodes.has(node.id || '');
    const hasChildren = node.children.length > 0;
    
    // Skip nodes that don't match the search or filter
    if (
      (searchQuery && !node.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !(node.description || "").toLowerCase().includes(searchQuery.toLowerCase())) ||
      (filterLevel !== "all" && node.level !== filterLevel)
    ) {
      // Still render children in case they match
      return hasChildren && isExpanded ? (
        <div key={node.id} className="ml-8">
          {node.children.map(child => renderNode(child))}
        </div>
      ) : null;
    }
    
    return (
      <div key={node.id} className="mb-3">
        <div 
          className={`relative pl-${node.depth * 4} ${node.depth > 0 ? 'border-l ml-3' : ''}`}
          style={{ marginLeft: node.depth > 0 ? '0.75rem' : 0, paddingLeft: `${node.depth * 1}rem` }}
        >
          <Card className={`border-l-4 ${
            node.level === 'company' ? 'border-l-blue-600' : 
            node.level === 'department' ? 'border-l-purple-600' : 
            node.level === 'team' ? 'border-l-green-600' : 
            'border-l-amber-600'
          } hover:shadow-md transition-shadow`}>
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

  // Calculate some statistics
  const totalObjectives = objectives.length;
  const completedObjectives = objectives.filter(obj => obj.progress === 100).length;
  const averageProgress = objectives.length > 0
    ? Math.round(objectives.reduce((sum, obj) => sum + obj.progress, 0) / objectives.length)
    : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search objectives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="company">Company</SelectItem>
              <SelectItem value="department">Department</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={expandAll}>Expand All</Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>Collapse All</Button>
        </div>
      </div>
      
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
      
      {onCreateObjective && (
        <Button onClick={() => onCreateObjective()} variant="outline" size="sm" className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Top-Level Objective
        </Button>
      )}
      
      <div className="space-y-2">
        {visibleNodes.map(node => renderNode(node))}
      </div>
      
      {visibleNodes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No objectives found with the current filters</p>
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
