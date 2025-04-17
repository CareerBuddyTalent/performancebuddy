
import { useEffect } from "react";
import { ReviewCycle } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CycleDetailsFormProps {
  name: string;
  type: ReviewCycle['type'];
  purpose: ReviewCycle['purpose'];
  startDate: Date;
  endDate: Date;
  onNameChange: (name: string) => void;
  onTypeChange: (type: ReviewCycle['type']) => void;
  onPurposeChange: (purpose: ReviewCycle['purpose']) => void;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
}

export default function CycleDetailsForm({
  name,
  type,
  purpose,
  startDate,
  endDate,
  onNameChange,
  onTypeChange,
  onPurposeChange,
  onStartDateChange,
  onEndDateChange,
}: CycleDetailsFormProps) {
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
    
    onEndDateChange(newEndDate);
  }, [type, startDate]);

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Cycle Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Q2 2024 Performance Review"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="purpose">Purpose</Label>
        <Select
          value={purpose}
          onValueChange={(value: ReviewCycle['purpose']) => onPurposeChange(value)}
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
          onValueChange={(value: ReviewCycle['type']) => onTypeChange(value)}
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
              onSelect={(date) => date && onStartDateChange(date)}
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
              onSelect={(date) => date && onEndDateChange(date)}
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
  );
}
