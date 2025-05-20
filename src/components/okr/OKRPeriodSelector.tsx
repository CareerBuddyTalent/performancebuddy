
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OKRPeriodSelector() {
  const [period, setPeriod] = useState("Q2 2025");
  
  // Sample periods - in a real app, these would come from an API
  const periods = [
    "Q1 2025",
    "Q2 2025", 
    "Q3 2025", 
    "Q4 2025"
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          {period}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[180px]">
        <DropdownMenuRadioGroup value={period} onValueChange={setPeriod}>
          {periods.map((p) => (
            <DropdownMenuRadioItem key={p} value={p} className="cursor-pointer">
              {p}
              {period === p && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
