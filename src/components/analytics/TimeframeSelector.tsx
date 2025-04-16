
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TimeframeSelectorProps {
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  onTimeframeChange: (timeframe: 'week' | 'month' | 'quarter' | 'year') => void;
}

export default function TimeframeSelector({ timeframe, onTimeframeChange }: TimeframeSelectorProps) {
  return (
    <TabsList>
      <TabsTrigger 
        value="week" 
        onClick={() => onTimeframeChange('week')}
        data-state={timeframe === 'week' ? 'active' : 'inactive'}
      >
        Week
      </TabsTrigger>
      <TabsTrigger 
        value="month" 
        onClick={() => onTimeframeChange('month')}
        data-state={timeframe === 'month' ? 'active' : 'inactive'}
      >
        Month
      </TabsTrigger>
      <TabsTrigger 
        value="quarter" 
        onClick={() => onTimeframeChange('quarter')}
        data-state={timeframe === 'quarter' ? 'active' : 'inactive'}
      >
        Quarter
      </TabsTrigger>
      <TabsTrigger 
        value="year" 
        onClick={() => onTimeframeChange('year')}
        data-state={timeframe === 'year' ? 'active' : 'inactive'}
      >
        Year
      </TabsTrigger>
    </TabsList>
  );
}
