
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { useClerkAuth } from '@/context/ClerkAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type ReportType = 'performance' | 'goals' | 'skills' | 'feedback' | 'comprehensive';
type ExportFormat = 'pdf' | 'csv' | 'excel';

interface ReportConfig {
  type: ReportType;
  format: ExportFormat;
  startDate: Date;
  endDate: Date;
  includeCharts: boolean;
  includeRawData: boolean;
  includeSummary: boolean;
}

export default function ReportGenerator() {
  const { user } = useClerkAuth();
  const [config, setConfig] = useState<ReportConfig>({
    type: 'comprehensive',
    format: 'pdf',
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    endDate: new Date(),
    includeCharts: true,
    includeRawData: false,
    includeSummary: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    if (!user) return;

    setIsGenerating(true);
    try {
      // Fetch data based on report type and date range
      const reportData = await fetchReportData();
      
      // Generate report based on format
      switch (config.format) {
        case 'pdf':
          await generatePDFReport(reportData);
          break;
        case 'csv':
          await generateCSVReport(reportData);
          break;
        case 'excel':
          await generateExcelReport(reportData);
          break;
      }

      toast({
        title: "Report Generated",
        description: `Your ${config.type} report has been generated successfully.`,
      });

    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const fetchReportData = async () => {
    const data: any = {};

    if (config.type === 'performance' || config.type === 'comprehensive') {
      const { data: reviews } = await supabase
        .from('performance_reviews')
        .select('*')
        .eq('employee_id', user!.id)
        .gte('created_at', config.startDate.toISOString())
        .lte('created_at', config.endDate.toISOString());
      data.reviews = reviews;
    }

    if (config.type === 'goals' || config.type === 'comprehensive') {
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user!.id)
        .gte('created_at', config.startDate.toISOString())
        .lte('created_at', config.endDate.toISOString());
      data.goals = goals;
    }

    if (config.type === 'skills' || config.type === 'comprehensive') {
      const { data: skills } = await supabase
        .from('skill_assessments')
        .select('*, skills(name)')
        .eq('user_id', user!.id)
        .gte('created_at', config.startDate.toISOString())
        .lte('created_at', config.endDate.toISOString());
      data.skills = skills;
    }

    if (config.type === 'feedback' || config.type === 'comprehensive') {
      const { data: feedback } = await supabase
        .from('feedback')
        .select('*')
        .eq('recipient_id', user!.id)
        .gte('created_at', config.startDate.toISOString())
        .lte('created_at', config.endDate.toISOString());
      data.feedback = feedback;
    }

    return data;
  };

  const generatePDFReport = async (data: any) => {
    // In a real implementation, you would use a PDF generation library like jsPDF
    const content = generateReportContent(data);
    const blob = new Blob([content], { type: 'text/html' });
    downloadFile(blob, `${config.type}-report.html`);
  };

  const generateCSVReport = async (data: any) => {
    let csvContent = '';
    
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        csvContent += `\n${key.toUpperCase()}\n`;
        const headers = Object.keys(value[0]).join(',');
        csvContent += headers + '\n';
        
        value.forEach(item => {
          const row = Object.values(item).map(val => 
            typeof val === 'string' ? `"${val}"` : val
          ).join(',');
          csvContent += row + '\n';
        });
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `${config.type}-report.csv`);
  };

  const generateExcelReport = async (data: any) => {
    // For now, generate as CSV. In production, use a library like SheetJS
    await generateCSVReport(data);
  };

  const generateReportContent = (data: any) => {
    let content = `
      <html>
        <head>
          <title>${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { color: #333; }
            table { border-collapse: collapse; width: 100%; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${config.type.charAt(0).toUpperCase() + config.type.slice(1)} Report</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
          <p>Period: ${config.startDate.toLocaleDateString()} - ${config.endDate.toLocaleDateString()}</p>
    `;

    Object.entries(data).forEach(([section, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        content += `<h2>${section.charAt(0).toUpperCase() + section.slice(1)}</h2>`;
        content += '<table>';
        
        // Headers
        const headers = Object.keys(items[0]);
        content += '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
        
        // Data rows
        items.forEach(item => {
          content += '<tr>' + headers.map(h => `<td>${item[h] || ''}</td>`).join('') + '</tr>';
        });
        
        content += '</table>';
      }
    });

    content += '</body></html>';
    return content;
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Report Generator
        </CardTitle>
        <CardDescription>
          Generate detailed reports of your performance data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Report Type</label>
            <Select value={config.type} onValueChange={(value: ReportType) => setConfig({...config, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                <SelectItem value="performance">Performance Reviews</SelectItem>
                <SelectItem value="goals">Goals & OKRs</SelectItem>
                <SelectItem value="skills">Skills Assessment</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Export Format</label>
            <Select value={config.format} onValueChange={(value: ExportFormat) => setConfig({...config, format: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Start Date</label>
            <DatePicker
              selected={config.startDate}
              onSelect={(date) => date && setConfig({...config, startDate: date})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">End Date</label>
            <DatePicker
              selected={config.endDate}
              onSelect={(date) => date && setConfig({...config, endDate: date})}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Include Options</label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="charts"
                checked={config.includeCharts}
                onCheckedChange={(checked) => setConfig({...config, includeCharts: !!checked})}
              />
              <label htmlFor="charts" className="text-sm">Include Charts & Visualizations</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="summary"
                checked={config.includeSummary}
                onCheckedChange={(checked) => setConfig({...config, includeSummary: !!checked})}
              />
              <label htmlFor="summary" className="text-sm">Include Executive Summary</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rawdata"
                checked={config.includeRawData}
                onCheckedChange={(checked) => setConfig({...config, includeRawData: !!checked})}
              />
              <label htmlFor="rawdata" className="text-sm">Include Raw Data</label>
            </div>
          </div>
        </div>

        <Button
          onClick={generateReport}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <BarChart3 className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
