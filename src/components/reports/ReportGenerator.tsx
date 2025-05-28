
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { Download, FileText, BarChart3, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { DateRange } from "react-day-picker";

const ReportGenerator = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!reportType || !dateRange?.from || !dateRange?.to) {
      toast({
        title: "Error",
        description: "Please select report type and date range",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = [
    { value: 'performance', label: 'Performance Report', icon: BarChart3 },
    { value: 'attendance', label: 'Attendance Report', icon: Users },
    { value: 'goals', label: 'Goals Report', icon: FileText },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Generator</CardTitle>
        <CardDescription>
          Generate comprehensive reports for your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex items-center">
                    <type.icon className="mr-2 h-4 w-4" />
                    {type.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <DatePickerWithRange
            value={dateRange}
            onChange={setDateRange}
          />
        </div>

        <Button 
          onClick={generateReport} 
          disabled={isGenerating || !reportType || !dateRange?.from || !dateRange?.to}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
