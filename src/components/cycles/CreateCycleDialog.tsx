
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
import { ReviewCycle, ReviewParameter } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateCycleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCycle: (cycle: ReviewCycle) => void;
}

export default function CreateCycleDialog({
  open,
  onOpenChange,
  onCreateCycle
}: CreateCycleDialogProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<"weekly" | "monthly" | "quarterly" | "bi-annual" | "annual">("monthly");
  const [purpose, setPurpose] = useState<"goal" | "feedback" | "performance">("goal");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // Default to 2 weeks later
    return date;
  });
  const [activeTab, setActiveTab] = useState("details");
  const [parameters, setParameters] = useState<ReviewParameter[]>([]);
  const [currentParameter, setCurrentParameter] = useState<ReviewParameter>({
    id: uuidv4(),
    name: "",
    description: "",
    category: "performance",
    required: true,
    maxScore: 5
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setName("");
      setType("monthly");
      setPurpose("goal");
      setStartDate(new Date());
      const date = new Date();
      date.setDate(date.getDate() + 14);
      setEndDate(date);
      setActiveTab("details");
      setParameters([]);
    }
  }, [open]);
  
  // Update end date based on cycle type
  useEffect(() => {
    const newStartDate = new Date(startDate);
    const newEndDate = new Date(startDate);
    
    switch(type) {
      case 'weekly':
        newEndDate.setDate(newStartDate.getDate() + 7);
        break;
      case 'monthly':
        newEndDate.setMonth(newStartDate.getMonth() + 1);
        break;
      case 'quarterly':
        newEndDate.setMonth(newStartDate.getMonth() + 3);
        break;
      case 'bi-annual':
        newEndDate.setMonth(newStartDate.getMonth() + 6);
        break;
      case 'annual':
        newEndDate.setFullYear(newStartDate.getFullYear() + 1);
        break;
    }
    
    setEndDate(newEndDate);
  }, [type, startDate]);

  // Set default cycle name based on type and purpose
  useEffect(() => {
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    
    let cycleName = "";
    switch(type) {
      case 'weekly':
        cycleName = `Weekly ${purpose === 'performance' ? 'Performance' : purpose === 'feedback' ? 'Feedback' : 'Goal'} Review - ${format(date, 'MMM d')}`;
        break;
      case 'monthly':
        cycleName = `${month} ${purpose === 'performance' ? 'Performance' : purpose === 'feedback' ? 'Feedback' : 'Goal'} Review`;
        break;
      case 'quarterly':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        cycleName = `Q${quarter} ${year} ${purpose === 'performance' ? 'Performance' : purpose === 'feedback' ? 'Feedback' : 'Goal'} Review`;
        break;
      case 'bi-annual':
        const half = date.getMonth() < 6 ? 'H1' : 'H2';
        cycleName = `${half} ${year} ${purpose === 'performance' ? 'Performance' : purpose === 'feedback' ? 'Feedback' : 'Goal'} Review`;
        break;
      case 'annual':
        cycleName = `${year} Annual ${purpose === 'performance' ? 'Performance' : purpose === 'feedback' ? 'Feedback' : 'Goal'} Review`;
        break;
    }
    
    setName(cycleName);
  }, [type, purpose]);
  
  // Restrict certain combinations (bi-annual/annual only for performance)
  useEffect(() => {
    if ((type === 'bi-annual' || type === 'annual') && purpose !== 'performance') {
      setPurpose('performance');
    }
    
    if (purpose === 'performance' && (type === 'weekly' || type === 'monthly')) {
      setType('quarterly');
    }
  }, [type, purpose]);

  // Add default parameters based on the purpose
  useEffect(() => {
    let defaultParams: ReviewParameter[] = [];
    
    if (purpose === 'performance') {
      defaultParams = [
        {
          id: uuidv4(),
          name: "Job Knowledge",
          description: "Understanding of job-related skills and requirements",
          category: "performance",
          required: true,
          maxScore: 5
        },
        {
          id: uuidv4(),
          name: "Quality of Work",
          description: "Accuracy, thoroughness, and effectiveness of work performed",
          category: "performance",
          required: true,
          maxScore: 5
        },
        {
          id: uuidv4(),
          name: "Communication Skills",
          description: "Effectiveness in expressing ideas and information",
          category: "soft",
          required: true,
          maxScore: 5
        },
        {
          id: uuidv4(),
          name: "Teamwork",
          description: "Ability to work effectively with others",
          category: "soft",
          required: true,
          maxScore: 5
        }
      ];
    } else if (purpose === 'feedback') {
      defaultParams = [
        {
          id: uuidv4(),
          name: "Strengths",
          description: "Areas where the employee excels",
          category: "custom",
          required: true,
          maxScore: 0 // No score for text feedback
        },
        {
          id: uuidv4(),
          name: "Areas for Improvement",
          description: "Areas where the employee can improve",
          category: "custom",
          required: true,
          maxScore: 0 // No score for text feedback
        }
      ];
    } else if (purpose === 'goal') {
      defaultParams = [
        {
          id: uuidv4(),
          name: "Goal Progress",
          description: "Progress towards defined goals",
          category: "goals",
          required: true,
          maxScore: 5
        },
        {
          id: uuidv4(),
          name: "Goal Quality",
          description: "Ambition and quality of set goals",
          category: "goals",
          required: true,
          maxScore: 5
        }
      ];
    }
    
    setParameters(defaultParams);
  }, [purpose]);
  
  const handleAddParameter = () => {
    if (currentParameter.name.trim() === "") return;
    
    setParameters([...parameters, { ...currentParameter, id: uuidv4() }]);
    setCurrentParameter({
      id: uuidv4(),
      name: "",
      description: "",
      category: "performance",
      required: true,
      maxScore: 5
    });
  };
  
  const handleDeleteParameter = (id: string) => {
    setParameters(parameters.filter(param => param.id !== id));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !startDate || !endDate) return;
    
    // Create a new cycle
    const newCycle: ReviewCycle = {
      id: uuidv4(),
      name,
      type,
      purpose,
      startDate,
      endDate,
      status: 'draft',
      parameters
    };
    
    onCreateCycle(newCycle);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Review Cycle</DialogTitle>
            <DialogDescription>
              Set up a new cycle for performance, goals, or feedback reviews
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Cycle Details</TabsTrigger>
              <TabsTrigger value="parameters">Review Parameters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Cycle Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Q2 2023 Performance Review"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select
                  value={purpose}
                  onValueChange={(value: "goal" | "feedback" | "performance") => setPurpose(value)}
                >
                  <SelectTrigger id="purpose">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goal">Goal Review</SelectItem>
                    <SelectItem value="feedback">Feedback Collection</SelectItem>
                    <SelectItem value="performance">Performance Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Cycle Type</Label>
                <Select
                  value={type}
                  onValueChange={(value: "weekly" | "monthly" | "quarterly" | "bi-annual" | "annual") => setType(value)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select cycle type" />
                  </SelectTrigger>
                  <SelectContent>
                    {purpose !== 'performance' && (
                      <>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </>
                    )}
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    {purpose === 'performance' && (
                      <>
                        <SelectItem value="bi-annual">Bi-Annual</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                {purpose === 'performance' && (type === 'weekly' || type === 'monthly') && (
                  <p className="text-xs text-muted-foreground">
                    Performance reviews should be quarterly, bi-annual, or annual.
                  </p>
                )}
                {(type === 'bi-annual' || type === 'annual') && purpose !== 'performance' && (
                  <p className="text-xs text-muted-foreground">
                    Bi-annual and annual cycles are for performance reviews.
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => date && setStartDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => date && setEndDate(date)}
                      initialFocus
                      disabled={(date) => date < startDate}
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  End date automatically set based on cycle type. You can adjust if needed.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="parameters" className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Review Parameters</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setActiveTab("details")}
                  >
                    Back to Details
                  </Button>
                </div>
                
                {parameters.length > 0 ? (
                  <div className="space-y-2">
                    {parameters.map((param) => (
                      <div 
                        key={param.id} 
                        className="flex items-center justify-between p-3 border rounded-md"
                      >
                        <div>
                          <p className="font-medium">{param.name}</p>
                          <p className="text-xs text-muted-foreground">{param.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              param.category === "performance" && "bg-blue-100 text-blue-700",
                              param.category === "soft" && "bg-green-100 text-green-700",
                              param.category === "technical" && "bg-purple-100 text-purple-700",
                              param.category === "goals" && "bg-amber-100 text-amber-700",
                              param.category === "custom" && "bg-slate-100 text-slate-700",
                            )}>
                              {param.category}
                            </span>
                            {param.required && (
                              <span className="text-xs text-muted-foreground">Required</span>
                            )}
                          </div>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteParameter(param.id)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground border rounded-md">
                    <p>No parameters added yet</p>
                    <p className="text-xs">Add parameters to evaluate during this review cycle</p>
                  </div>
                )}
                
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="text-sm font-medium mb-3">Add New Parameter</h4>
                  <div className="space-y-3">
                    <div className="grid gap-2">
                      <Label htmlFor="paramName">Parameter Name</Label>
                      <Input
                        id="paramName"
                        value={currentParameter.name}
                        onChange={(e) => setCurrentParameter({
                          ...currentParameter,
                          name: e.target.value
                        })}
                        placeholder="e.g. Communication Skills"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="paramDescription">Description (Optional)</Label>
                      <Textarea
                        id="paramDescription"
                        value={currentParameter.description}
                        onChange={(e) => setCurrentParameter({
                          ...currentParameter,
                          description: e.target.value
                        })}
                        placeholder="Describe what this parameter measures"
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="paramCategory">Category</Label>
                        <Select
                          value={currentParameter.category}
                          onValueChange={(value: "technical" | "soft" | "performance" | "goals" | "custom") => 
                            setCurrentParameter({
                              ...currentParameter,
                              category: value
                            })
                          }
                        >
                          <SelectTrigger id="paramCategory">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="performance">Performance</SelectItem>
                            <SelectItem value="soft">Soft Skills</SelectItem>
                            <SelectItem value="technical">Technical Skills</SelectItem>
                            <SelectItem value="goals">Goal-related</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="paramMaxScore">Max Score</Label>
                        <Select
                          value={currentParameter.maxScore.toString()}
                          onValueChange={(value) => 
                            setCurrentParameter({
                              ...currentParameter,
                              maxScore: parseInt(value)
                            })
                          }
                        >
                          <SelectTrigger id="paramMaxScore">
                            <SelectValue placeholder="Select max score" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">No Score (Text only)</SelectItem>
                            <SelectItem value="3">3-point scale</SelectItem>
                            <SelectItem value="5">5-point scale</SelectItem>
                            <SelectItem value="10">10-point scale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="paramRequired" 
                        checked={currentParameter.required}
                        onCheckedChange={(checked) => 
                          setCurrentParameter({
                            ...currentParameter,
                            required: checked === true
                          })
                        }
                      />
                      <Label htmlFor="paramRequired">Required parameter</Label>
                    </div>
                    
                    <Button 
                      type="button" 
                      onClick={handleAddParameter}
                      className="w-full"
                      disabled={!currentParameter.name.trim()}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Parameter
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!name || !startDate || !endDate || parameters.length === 0}
            >
              Create Cycle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
