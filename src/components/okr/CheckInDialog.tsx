
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { KeyResult } from "@/types/okr";

interface CheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyResult: KeyResult;
  onCheckIn: () => void;
}

export default function CheckInDialog({ 
  open, 
  onOpenChange, 
  keyResult,
  onCheckIn 
}: CheckInDialogProps) {
  const [newValue, setNewValue] = useState<number>(keyResult.currentValue);
  const [confidence, setConfidence] = useState<number>(8); // Default confidence: 8 out of 10
  const [notes, setNotes] = useState<string>("");

  const formatValue = (value: number, type: KeyResultType) => {
    switch (type) {
      case "percentage":
        return `${value}%`;
      case "currency":
        return `$${value}`;
      case "binary":
        return value === 1 ? "Complete" : "Incomplete";
      default:
        return value.toString();
    }
  };

  const calculateProgress = () => {
    if (keyResult.startValue === keyResult.targetValue) return 0;
    
    const range = keyResult.targetValue - keyResult.startValue;
    const progress = ((newValue - keyResult.startValue) / range) * 100;
    return Math.max(0, Math.min(100, progress)); // Clamp between 0 and 100
  };

  const handleSubmit = () => {
    // In a real app, we would call an API to update the key result
    console.log("Updating key result:", {
      id: keyResult.id,
      previousValue: keyResult.currentValue,
      newValue,
      confidence,
      notes,
      progress: calculateProgress()
    });
    
    onCheckIn();
  };

  const handleChange = (value: number) => {
    setNewValue(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Progress</DialogTitle>
          <DialogDescription>
            Record your progress on: {keyResult.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Current Value:</span>
              <span>{formatValue(keyResult.currentValue, keyResult.type)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Target Value:</span>
              <span>{formatValue(keyResult.targetValue, keyResult.type)}</span>
            </div>
          </div>
          
          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium">New Value:</label>
            {keyResult.type === "binary" ? (
              <div className="flex space-x-4">
                <Button
                  variant={newValue === 0 ? "default" : "outline"}
                  onClick={() => setNewValue(0)}
                  className="flex-1"
                >
                  Not Complete
                </Button>
                <Button
                  variant={newValue === 1 ? "default" : "outline"}
                  onClick={() => setNewValue(1)}
                  className="flex-1"
                >
                  Complete
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <Slider
                    min={keyResult.startValue}
                    max={keyResult.targetValue}
                    step={keyResult.type === "percentage" ? 1 : 0.01}
                    value={[newValue]}
                    onValueChange={(value) => handleChange(value[0])}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={newValue}
                    onChange={(e) => handleChange(parseFloat(e.target.value))}
                    min={keyResult.startValue}
                    max={keyResult.targetValue}
                    step={keyResult.type === "percentage" ? 1 : 0.01}
                    className="w-20"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatValue(keyResult.startValue, keyResult.type)}</span>
                  <span>{formatValue(keyResult.targetValue, keyResult.type)}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Confidence (1-10):</label>
            <div className="flex items-center space-x-4">
              <Slider
                min={1}
                max={10}
                step={1}
                value={[confidence]}
                onValueChange={(value) => setConfidence(value[0])}
                className="flex-1"
              />
              <div className="w-12 text-center font-medium">{confidence}/10</div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes:</label>
            <Textarea
              placeholder="Any context or blockers to share?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between rounded-lg bg-muted p-3">
            <div className="text-sm">
              <div className="font-medium">Calculated Progress</div>
              <div className="text-muted-foreground">Based on current values</div>
            </div>
            <div className="text-2xl font-bold">{Math.round(calculateProgress())}%</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Progress</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
