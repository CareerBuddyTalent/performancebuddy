import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewCycle, ReviewParameter } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import CycleDetailsForm from "./details/CycleDetailsForm";
import CycleParameters from "./parameters/CycleParameters";

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
  const [type, setType] = useState<ReviewCycle['type']>("monthly");
  const [purpose, setPurpose] = useState<ReviewCycle['purpose']>("goal");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date;
  });
  const [activeTab, setActiveTab] = useState("details");
  const [parameters, setParameters] = useState<ReviewParameter[]>([]);

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
              <CycleDetailsForm
                name={name}
                type={type}
                purpose={purpose}
                startDate={startDate}
                endDate={endDate}
                onNameChange={setName}
                onTypeChange={setType}
                onPurposeChange={setPurpose}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </TabsContent>
            
            <TabsContent value="parameters" className="space-y-4 pt-4">
              <CycleParameters
                parameters={parameters}
                onAddParameter={(param) => setParameters([...parameters, param])}
                onDeleteParameter={(id) => setParameters(parameters.filter(p => p.id !== id))}
                onBack={() => setActiveTab("details")}
              />
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
