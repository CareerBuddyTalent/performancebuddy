
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { ReviewCycle } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { cn } from "@/lib/utils";

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
      parameters: [] // This would be populated based on the organization's performance parameters
    };
    
    onCreateCycle(newCycle);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Review Cycle</DialogTitle>
            <DialogDescription>
              Set up a new cycle for performance, goals, or feedback reviews
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !startDate || !endDate}>
              Create Cycle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
