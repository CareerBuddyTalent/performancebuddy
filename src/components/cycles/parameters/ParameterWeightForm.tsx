
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ParameterWeightFormProps {
  weight: number;
  onWeightChange: (weight: number) => void;
}

export default function ParameterWeightForm({
  weight,
  onWeightChange,
}: ParameterWeightFormProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="weight">Parameter Weight (%)</Label>
        <span className="text-sm text-muted-foreground">{weight}%</span>
      </div>
      <Slider
        id="weight"
        min={0}
        max={100}
        step={5}
        value={[weight]}
        onValueChange={(value) => onWeightChange(value[0])}
        className="py-2"
      />
      <p className="text-xs text-muted-foreground">
        Adjust the weight of this parameter in the overall review score
      </p>
    </div>
  );
}
