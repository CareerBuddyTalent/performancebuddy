
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { OneOnOneMeeting } from "@/types/templates";

interface CreateOneOnOneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (meeting: OneOnOneMeeting) => void;
}

export default function CreateOneOnOneDialog({
  open,
  onOpenChange,
  onSchedule
}: CreateOneOnOneDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [employee, setEmployee] = useState<string>("");
  const [duration, setDuration] = useState<string>("30");
  const [templateId, setTemplateId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  // Mock employees
  const employees = [
    { id: "emp1", name: "John Doe" },
    { id: "emp2", name: "Emily Chen" },
    { id: "emp3", name: "Michael Brown" },
  ];

  // Mock templates
  const templates = [
    { id: "temp1", name: "Regular Check-in" },
    { id: "temp2", name: "Goal Setting" },
    { id: "temp3", name: "Performance Review Prep" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !employee || !duration) {
      return;
    }

    // Create meeting object
    const meeting: OneOnOneMeeting = {
      id: Math.random().toString(36).substring(2, 9),
      managerId: "manager1", // Current user ID
      employeeId: employee,
      date,
      duration: parseInt(duration),
      status: "scheduled",
      templateId,
      notes,
      actionItems: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSchedule(meeting);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule 1:1 Check-In</DialogTitle>
          <DialogDescription>
            Schedule a one-on-one meeting with a team member.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="employee">Team Member</Label>
            <Select value={employee} onValueChange={setEmployee} required>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Date & Time</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal w-full",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input 
                type="time" 
                className="w-32" 
                defaultValue="09:00" 
                onChange={(e) => {
                  if (date) {
                    const newDate = new Date(date);
                    const [hours, minutes] = e.target.value.split(':').map(Number);
                    newDate.setHours(hours, minutes);
                    setDate(newDate);
                  }
                }}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="template">Meeting Template</Label>
            <Select value={templateId} onValueChange={setTemplateId}>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template (optional)" />
              </SelectTrigger>
              <SelectContent>
                {templates.map(template => (
                  <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Initial Notes</Label>
            <Textarea
              id="notes"
              placeholder="Topics to discuss, preparation notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!date || !employee || !duration}
            >
              Schedule Meeting
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
