
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ParameterScoringFormProps {
  maxScore: number;
  onMaxScoreChange: (score: number) => void;
}

export default function ParameterScoringForm({
  maxScore,
  onMaxScoreChange,
}: ParameterScoringFormProps) {
  const [customScore, setCustomScore] = useState(maxScore.toString());

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Scoring Scale</Label>
        <RadioGroup
          value={maxScore.toString()}
          onValueChange={(value) => onMaxScoreChange(Number(value))}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="scale-5" />
            <Label htmlFor="scale-5">5-point scale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="10" id="scale-10" />
            <Label htmlFor="scale-10">10-point scale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="scale-3" />
            <Label htmlFor="scale-3">3-point scale</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="scale-none" />
            <Label htmlFor="scale-none">No scoring (text only)</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
