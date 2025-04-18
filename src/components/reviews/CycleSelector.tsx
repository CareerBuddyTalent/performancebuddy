
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReviewCycle } from "@/types";

interface CycleSelectorProps {
  cycles: ReviewCycle[];
  selectedCycleId: string;
  onCycleChange: (cycleId: string) => void;
}

export default function CycleSelector({ cycles, selectedCycleId, onCycleChange }: CycleSelectorProps) {
  // Filter available cycles to only performance review cycles
  const performanceCycles = cycles.filter(cycle => 
    cycle.purpose === "performance" || !cycle.purpose
  );
  
  return (
    <div className="grid gap-2">
      <Label>Review Cycle</Label>
      <Select
        value={selectedCycleId}
        onValueChange={onCycleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a review cycle" />
        </SelectTrigger>
        <SelectContent>
          {performanceCycles.length > 0 ? (
            performanceCycles.map(cycle => (
              <SelectItem key={cycle.id} value={cycle.id}>
                {cycle.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-cycles" disabled>No review cycles available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
