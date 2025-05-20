
import { Objective } from "@/services/objectiveService";

export interface TreeNode extends Objective {
  children: TreeNode[];
  depth: number;
  isExpanded: boolean;
}

/**
 * Builds a tree structure from a flat array of objectives
 */
export const buildTree = (objectives: Objective[], expandedNodes: Set<string>): TreeNode[] => {
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
  
  return sortNodes(roots);
};

/**
 * Sorts nodes recursively at each level
 */
export const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
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

/**
 * Apply search and level filters to objectives
 */
export const filterObjectives = (
  objectives: Objective[], 
  searchQuery: string,
  filterLevel: string
): Objective[] => {
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
  
  return filteredObjectives;
};
