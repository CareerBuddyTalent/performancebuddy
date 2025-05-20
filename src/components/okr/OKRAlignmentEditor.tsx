
import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Objective } from "@/services/objectiveService";

interface OKRAlignmentEditorProps {
  objectives: Objective[];
  onAlignmentUpdate: (objective_id: string, parent_id: string | null) => Promise<void>;
}

export default function OKRAlignmentEditor({ objectives, onAlignmentUpdate }: OKRAlignmentEditorProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<Objective[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (objectives) {
      setItems(objectives);
    }
  }, [objectives]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    
    // Dropped outside the list or at the same position
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
    
    // Handle dropping into a different level (alignment change)
    if (source.droppableId !== destination.droppableId) {
      // Get the parent ID from the droppable ID (removing the 'droppable-' prefix)
      const newParentId = destination.droppableId === 'root' ? null : destination.droppableId.replace('droppable-', '');
      const objectiveId = draggableId.replace('draggable-', '');
      
      // Prevent circular dependencies
      if (wouldCreateCircularDependency(objectiveId, newParentId)) {
        toast({
          title: "Alignment Error",
          description: "This would create a circular dependency",
          variant: "destructive"
        });
        return;
      }
      
      try {
        setLoading({...loading, [objectiveId]: true});
        
        // Update the alignment in the database
        await onAlignmentUpdate(objectiveId, newParentId);
        
        // Update the UI
        const updatedItems = [...items];
        const itemIndex = updatedItems.findIndex(item => item.id === objectiveId);
        
        if (itemIndex !== -1) {
          updatedItems[itemIndex] = {
            ...updatedItems[itemIndex],
            parent_id: newParentId
          };
        }
        
        setItems(updatedItems);
        
        toast({
          title: "Success",
          description: "Objective alignment updated"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update alignment",
          variant: "destructive"
        });
      } finally {
        setLoading({...loading, [objectiveId]: false});
      }
    }
    
    // Handle reordering within the same level (priority change)
    else {
      // Reorder the items
      const result = reorderItems(items, source.index, destination.index, source.droppableId);
      setItems(result);
      
      // In a real app, you would update the priority/order in the database here
    }
  };
  
  // Check if setting a new parent would create a circular dependency
  const wouldCreateCircularDependency = (objectiveId: string, newParentId: string | null): boolean => {
    if (!newParentId) return false; // No circular dependency if parent is null
    
    // Check if the new parent is the same as the objective
    if (objectiveId === newParentId) return true;
    
    // Check if the new parent is a descendant of the objective
    let currentParentId = newParentId;
    const visited = new Set<string>();
    
    while (currentParentId) {
      if (visited.has(currentParentId)) return true; // Detected a cycle
      visited.add(currentParentId);
      
      const parent = items.find(item => item.id === currentParentId);
      currentParentId = parent?.parent_id || null;
      
      if (currentParentId === objectiveId) return true; // Circular reference detected
    }
    
    return false;
  };
  
  const reorderItems = (list: Objective[], startIndex: number, endIndex: number, droppableId: string): Objective[] => {
    const result = Array.from(list);
    const parentId = droppableId === 'root' ? null : droppableId.replace('droppable-', '');
    
    // Filter items that belong to this droppable (same parent)
    const itemsWithSameParent = result.filter(item => item.parent_id === parentId);
    
    // Remove the item from its original position
    const [removed] = itemsWithSameParent.splice(startIndex, 1);
    
    // Insert the item at the new position
    itemsWithSameParent.splice(endIndex, 0, removed);
    
    // Recreate the complete list, replacing the items with the same parent with the reordered ones
    const newResult = result.map(item => {
      if (item.parent_id === parentId) {
        return itemsWithSameParent.shift() || item;
      }
      return item;
    });
    
    return newResult;
  };
  
  const toggleExpand = (id: string) => {
    setExpandedItems(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };
  
  // Get items at a specific hierarchical level
  const getItemsAtLevel = (parentId: string | null) => {
    return items.filter(item => item.parent_id === parentId);
  };

  // Render a droppable region for a level
  const renderDroppable = (parentId: string | null) => {
    const levelItems = getItemsAtLevel(parentId);
    const droppableId = parentId ? `droppable-${parentId}` : 'root';
    
    return (
      <Droppable droppableId={droppableId} type="OBJECTIVE">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 p-2 rounded-md ${
              snapshot.isDraggingOver ? 'bg-slate-100 dark:bg-slate-800' : ''
            }`}
          >
            {levelItems.map((item, index) => renderDraggable(item, index))}
            {provided.placeholder}
            
            {levelItems.length === 0 && (
              <div className="text-center p-4 border border-dashed rounded-md text-muted-foreground">
                Drop objectives here
              </div>
            )}
          </div>
        )}
      </Droppable>
    );
  };
  
  // Render a draggable item
  const renderDraggable = (item: Objective, index: number) => {
    const isExpanded = expandedItems.has(item.id || '');
    const hasChildren = items.some(obj => obj.parent_id === item.id);
    const isLoading = loading[item.id || ''] || false;
    
    // Determine the color based on the objective level
    const getBorderColor = (level: string) => {
      switch (level) {
        case 'company': return 'border-l-blue-600';
        case 'department': return 'border-l-purple-600';
        case 'team': return 'border-l-green-600';
        default: return 'border-l-amber-600';
      }
    };
    
    return (
      <Draggable 
        key={item.id} 
        draggableId={`draggable-${item.id}`} 
        index={index}
        isDragDisabled={isLoading}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-2 ${snapshot.isDragging ? 'opacity-70' : ''}`}
          >
            <Card className={`border-l-4 ${getBorderColor(item.level)}`}>
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      {hasChildren && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 mr-2"
                          onClick={() => toggleExpand(item.id || '')}
                          disabled={isLoading}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div {...provided.dragHandleProps} className="cursor-grab">
                            <div className="flex flex-col h-4 w-4 justify-between">
                              <div className="h-0.5 w-full bg-current"></div>
                              <div className="h-0.5 w-full bg-current"></div>
                              <div className="h-0.5 w-full bg-current"></div>
                            </div>
                          </div>
                          <h4 className="font-medium">{item.title}</h4>
                          <Badge variant="outline">
                            {item.level}
                          </Badge>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium">Progress</span>
                            <span className="text-xs font-medium">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {item.parent_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={async () => {
                        try {
                          setLoading({...loading, [item.id || '']: true});
                          await onAlignmentUpdate(item.id || '', null);
                          setItems(items.map(obj => 
                            obj.id === item.id ? {...obj, parent_id: null} : obj
                          ));
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to remove alignment",
                            variant: "destructive"
                          });
                        } finally {
                          setLoading({...loading, [item.id || '']: false});
                        }
                      }}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {isExpanded && hasChildren && (
              <div className="ml-8 mt-2">
                {renderDroppable(item.id || '')}
              </div>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Objective Alignment</h2>
        <div className="text-sm text-muted-foreground">
          Drag objectives to align them with one another
        </div>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          <h3 className="text-md font-medium">Top-Level Objectives</h3>
          {renderDroppable(null)}
          
          <div className="mt-6">
            <h3 className="text-md font-medium mb-2">All Aligned Objectives</h3>
            {Array.from(expandedItems).map(id => {
              // Only render direct children dropzones for expanded items that aren't already shown
              const item = items.find(obj => obj.id === id);
              if (item && !item.parent_id) return null; // Skip top-level objectives
              
              const hasChildren = items.some(obj => obj.parent_id === id);
              if (!hasChildren) return null;
              
              return (
                <div key={id} className="ml-8 mb-4">
                  <div className="text-sm font-medium mb-1 text-muted-foreground">
                    {items.find(obj => obj.id === id)?.title || "Objective"}
                  </div>
                  {renderDroppable(id)}
                </div>
              );
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
