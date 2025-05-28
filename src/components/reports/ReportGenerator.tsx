import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export default function ReportGenerator() {
  const [reportType, setReportType] = useState("performance");
  const [dateRange, setDateRange] = useState<Date | undefined>([new Date(2024, 0, 1), new Date()]);
  const [includeDetails, setIncludeDetails] = useState(true);
  const { user } = useSupabaseAuth();

  const generateReport = () => {
    alert(`Generating ${reportType} report for ${dateRange?.[0]?.toLocaleDateString()} - ${dateRange?.[1]?.toLocaleDateString()} with details: ${includeDetails}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <CardDescription>
          Customize and generate performance reports for your team.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Report Type</h3>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select a report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance Report</SelectItem>
              <SelectItem value="okr">OKR Report</SelectItem>
              <SelectItem value="engagement">Engagement Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Date Range</h3>
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="include-details"
            checked={includeDetails}
            onCheckedChange={() => setIncludeDetails(!includeDetails)}
          />
          <label
            htmlFor="include-details"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Include Detailed Information
          </label>
        </div>

        <Button onClick={generateReport}>Generate Report</Button>
      </CardContent>
    </Card>
  );
}
