
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface CycleSchedule {
  startDate: Date;
  endDate: Date;
  isRecurring: boolean;
  recurringType: "weekly" | "monthly" | "quarterly" | "annually";
  recurringCount?: number;
  reminders: Array<{
    days: number;
    type: "before_start" | "before_end" | "after_start";
    notificationType: "email" | "app" | "both";
  }>;
}

interface CycleSchedulerProps {
  initialSchedule?: Partial<CycleSchedule>;
  onScheduleChange: (schedule: CycleSchedule) => void;
}

const defaultReminders = [
  { days: 7, type: "before_start", notificationType: "both" },
  { days: 3, type: "before_end", notificationType: "both" },
];

export default function CycleScheduler({ 
  initialSchedule,
  onScheduleChange
}: CycleSchedulerProps) {
  const [schedule, setSchedule] = useState<CycleSchedule>({
    startDate: initialSchedule?.startDate || new Date(),
    endDate: initialSchedule?.endDate || new Date(new Date().setDate(new Date().getDate() + 14)),
    isRecurring: initialSchedule?.isRecurring || false,
    recurringType: initialSchedule?.recurringType || "quarterly",
    reminders: initialSchedule?.reminders || [...defaultReminders],
  });

  const handleChange = <K extends keyof CycleSchedule>(key: K, value: CycleSchedule[K]) => {
    const newSchedule = { ...schedule, [key]: value };
    setSchedule(newSchedule);
    onScheduleChange(newSchedule);
  };

  const addReminder = () => {
    const newReminder = { days: 1, type: "before_end" as const, notificationType: "both" as const };
    handleChange("reminders", [...schedule.reminders, newReminder]);
  };

  const updateReminder = (index: number, key: keyof CycleSchedule["reminders"][0], value: any) => {
    const updatedReminders = [...schedule.reminders];
    updatedReminders[index] = { ...updatedReminders[index], [key]: value };
    handleChange("reminders", updatedReminders);
  };

  const removeReminder = (index: number) => {
    const updatedReminders = schedule.reminders.filter((_, i) => i !== index);
    handleChange("reminders", updatedReminders);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cycle Timeline</CardTitle>
          <CardDescription>
            Set the start and end dates for this review cycle
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="start-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {schedule.startDate ? (
                      format(schedule.startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={schedule.startDate}
                    onSelect={(date) => date && handleChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="end-date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {schedule.endDate ? (
                      format(schedule.endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={schedule.endDate}
                    onSelect={(date) => date && handleChange("endDate", date)}
                    initialFocus
                    disabled={(date) => date < schedule.startDate}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recurring Schedule</CardTitle>
          <CardDescription>
            Configure if this cycle should automatically repeat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <RadioGroup 
              value={schedule.isRecurring ? "recurring" : "one-time"} 
              onValueChange={(value) => handleChange("isRecurring", value === "recurring")}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time">One-time cycle</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="recurring" id="recurring" />
                <Label htmlFor="recurring">Recurring cycle</Label>
              </div>
            </RadioGroup>
          </div>

          {schedule.isRecurring && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="recurring-type">Repeat Every</Label>
                <Select
                  value={schedule.recurringType}
                  onValueChange={(value) => 
                    handleChange("recurringType", value as CycleSchedule["recurringType"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occurrences">Number of Occurrences</Label>
                <Input 
                  type="number" 
                  id="occurrences"
                  min={1}
                  max={100}
                  value={schedule.recurringCount || 4}
                  onChange={(e) => handleChange("recurringCount", parseInt(e.target.value))}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Automated Reminders</CardTitle>
            <CardDescription>
              Schedule notifications for participants
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addReminder}>
            Add Reminder
          </Button>
        </CardHeader>
        <CardContent>
          {schedule.reminders.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <p>No reminders configured</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.reminders.map((reminder, index) => (
                <div key={index} className="flex items-center gap-3 border-b pb-3">
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <Input 
                          type="number" 
                          className="w-16"
                          min={1}
                          value={reminder.days}
                          onChange={(e) => updateReminder(index, "days", parseInt(e.target.value))}
                        />
                        <span>days</span>
                      </div>
                      <Select
                        value={reminder.type}
                        onValueChange={(value) => 
                          updateReminder(index, "type", value as any)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="before_start">before start</SelectItem>
                          <SelectItem value="after_start">after start</SelectItem>
                          <SelectItem value="before_end">before end</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex-1">
                    <Select
                      value={reminder.notificationType}
                      onValueChange={(value) => 
                        updateReminder(index, "notificationType", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email only</SelectItem>
                        <SelectItem value="app">In-app only</SelectItem>
                        <SelectItem value="both">Email & In-app</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeReminder(index)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
