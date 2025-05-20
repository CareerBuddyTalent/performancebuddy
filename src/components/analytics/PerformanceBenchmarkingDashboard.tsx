
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from "recharts";
import PerformanceBenchmarkChart from "./PerformanceBenchmarkChart";

const benchmarkData = [
  { name: "Communication", value: 72, benchmark: 65, industryAverage: 70, teamTarget: 75 },
  { name: "Technical Skills", value: 85, benchmark: 75, industryAverage: 78, teamTarget: 80 },
  { name: "Problem Solving", value: 65, benchmark: 70, industryAverage: 68, teamTarget: 75 },
  { name: "Collaboration", value: 90, benchmark: 72, industryAverage: 75, teamTarget: 80 },
  { name: "Leadership", value: 60, benchmark: 68, industryAverage: 65, teamTarget: 70 }
];

const skillGapData = [
  { name: "Communication", current: 3.6, required: 4.0 },
  { name: "Technical Skills", current: 4.2, required: 4.0 },
  { name: "Problem Solving", current: 3.2, required: 3.5 },
  { name: "Collaboration", current: 4.5, required: 4.0 },
  { name: "Leadership", current: 3.0, required: 3.5 }
];

const departmentComparison = [
  { name: "Engineering", value: 85, average: 78 },
  { name: "Marketing", value: 72, average: 75 },
  { name: "Sales", value: 78, average: 76 },
  { name: "Product", value: 81, average: 77 },
  { name: "Customer Support", value: 79, average: 74 }
];

export default function PerformanceBenchmarkingDashboard() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "quarter" | "year">("quarter");
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Performance Benchmarking</h2>
        <Select 
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as "week" | "month" | "quarter" | "year")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <PerformanceBenchmarkChart
          title="Team Performance vs Benchmarks"
          description="How your team compares to historical benchmarks"
          timeframe={timeframe}
          data={benchmarkData}
        />
        
        <Card>
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
            <CardDescription>Current vs required competency levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillGapData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis 
                    domain={[0, 5]}
                    ticks={[0, 1, 2, 3, 4, 5]}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="current" 
                    name="Current Level" 
                    fill="#4f46e5" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="required" 
                    name="Required Level" 
                    fill="#94a3b8" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <ReferenceLine y={3} stroke="#f97316" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Department Performance Comparison</CardTitle>
            <CardDescription>How different departments are performing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentComparison}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis 
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    name="Department Score" 
                    fill="#4f46e5" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="average" 
                    name="Company Average" 
                    fill="#94a3b8" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
