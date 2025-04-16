
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeframeSelectorProps {
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
}

export default function TimeframeSelector({ timeframe, onTimeframeChange }: TimeframeSelectorProps) {
  return (
    <Tabs value={timeframe} onValueChange={(value) => onTimeframeChange(value as any)}>
      <TabsList>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
        <TabsTrigger value="quarter">Quarter</TabsTrigger>
        <TabsTrigger value="year">Year</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
