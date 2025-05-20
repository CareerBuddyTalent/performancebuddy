
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Objective } from "@/services/objectiveService";
import { OKRTreeNode } from "./hierarchy/OKRTreeNode";
import { OKRTreeStats } from "./hierarchy/OKRTreeStats";
import { OKRTreeFilters } from "./hierarchy/OKRTreeFilters";
import { TreeNode, buildTree, filterObjectives } from "./hierarchy/treeUtils";

interface OKRHierarchyTreeProps {
  objectives: Objective[];
  onCreateObjective?: (parentId?: string) => void;
  onViewObjective?: (objective: Objective) => void;
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

  useEffect(() => {
    // Apply search filter and level filter to objectives
    const filteredObjectives = filterObjectives(objectives, searchQuery, filterLevel);
    const rootNodes = buildTree(filteredObjectives, expandedNodes);
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

  // Render child nodes for a given parent
  const renderChildNodes = (parentId: string) => {
    const childNodes = visibleNodes
      .filter(node => node.parent_id === parentId)
      .map(node => (
        <OKRTreeNode
          key={node.id}
          node={node}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
          onCreateObjective={onCreateObjective}
          onViewObjective={onViewObjective}
          renderChildNodes={renderChildNodes}
        />
      ));

    return <div className="ml-8">{childNodes}</div>;
  };

  // Render root nodes (nodes without a parent)
  const renderRootNodes = () => {
    const rootNodes = visibleNodes.filter(node => !node.parent_id);
    
    return rootNodes.map(node => (
      <OKRTreeNode
        key={node.id}
        node={node}
        expandedNodes={expandedNodes}
        toggleNode={toggleNode}
        onCreateObjective={onCreateObjective}
        onViewObjective={onViewObjective}
        renderChildNodes={renderChildNodes}
      />
    ));
  };

  return (
    <div className="space-y-4">
      <OKRTreeFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterLevel={filterLevel}
        setFilterLevel={setFilterLevel}
        expandAll={expandAll}
        collapseAll={collapseAll}
      />
      
      <OKRTreeStats objectives={objectives} />
      
      {onCreateObjective && (
        <Button onClick={() => onCreateObjective()} variant="outline" size="sm" className="mb-4">
          <Plus className="h-4 w-4 mr-2" />
          Top-Level Objective
        </Button>
      )}
      
      <div className="space-y-2">
        {renderRootNodes()}
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
