
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";

interface BenchmarkData {
  name: string;
  value: number;
  benchmark?: number;
  industryAverage?: number;
  teamTarget?: number;
  color?: string;
}

interface PerformanceBenchmarkChartProps {
  title: string;
  description: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  data: BenchmarkData[];
}

export default function PerformanceBenchmarkChart({
  title,
  description,
  timeframe,
  data
}: PerformanceBenchmarkChartProps) {
  const [compareWith, setCompareWith] = useState<"benchmark" | "industryAverage" | "teamTarget">("benchmark");
  
  const renderData = data.map(item => ({
    ...item,
    compareValue: item[compareWith] || 0
  }));
  
  const getCompareLabel = () => {
    switch(compareWith) {
      case "benchmark":
        return "Historical Benchmark";
      case "industryAverage":
        return "Industry Average";
      case "teamTarget":
        return "Team Target";
      default:
        return "Benchmark";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Select 
            value={compareWith}
            onValueChange={(value) => setCompareWith(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Compare with..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="benchmark">Historical Benchmark</SelectItem>
              <SelectItem value="industryAverage">Industry Average</SelectItem>
              <SelectItem value="teamTarget">Team Target</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={renderData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  value, 
                  name === "compareValue" ? getCompareLabel() : "Current" 
                ]}
              />
              <Legend
                formatter={(value: string) => (
                  value === "value" ? "Current" : getCompareLabel()
                )}
              />
              <Bar 
                dataKey="value" 
                name="value"
                fill="#4f46e5" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="compareValue" 
                name="compareValue"
                fill="#94a3b8" 
                radius={[4, 4, 0, 0]} 
              />
              
              {compareWith === "teamTarget" && (
                <ReferenceLine 
                  y={Math.max(...data.map(item => item.teamTarget || 0))} 
                  label="Target" 
                  stroke="#10b981" 
                  strokeDasharray="3 3" 
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
