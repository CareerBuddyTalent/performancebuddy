
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Plus, Trash2, BarChart3 } from "lucide-react";
import { useState } from "react";

interface ReportField {
  id: string;
  name: string;
  type: 'dimension' | 'metric';
  category: string;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

const availableFields: ReportField[] = [
  { id: 'employee_name', name: 'Employee Name', type: 'dimension', category: 'People' },
  { id: 'department', name: 'Department', type: 'dimension', category: 'People' },
  { id: 'role', name: 'Role', type: 'dimension', category: 'People' },
  { id: 'performance_score', name: 'Performance Score', type: 'metric', category: 'Performance' },
  { id: 'goal_completion', name: 'Goal Completion %', type: 'metric', category: 'Goals' },
  { id: 'review_score', name: 'Review Score', type: 'metric', category: 'Reviews' },
  { id: 'engagement_score', name: 'Engagement Score', type: 'metric', category: 'Engagement' }
];

export function CustomReportBuilder() {
  const [reportName, setReportName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [chartType, setChartType] = useState('table');

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev => 
      prev.includes(fieldId) 
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    );
  };

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: Math.random().toString(36).substr(2, 9),
      field: '',
      operator: 'equals',
      value: ''
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  const updateFilter = (filterId: string, updates: Partial<ReportFilter>) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, ...updates } : f
    ));
  };

  const generateReport = () => {
    console.log('Generating report:', {
      name: reportName,
      fields: selectedFields,
      filters,
      chartType
    });
  };

  const groupedFields = availableFields.reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ReportField[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Custom Report Builder
        </CardTitle>
        <CardDescription>
          Build custom reports with drag-and-drop interface
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Name */}
        <div className="space-y-2">
          <Label htmlFor="report-name">Report Name</Label>
          <Input
            id="report-name"
            placeholder="Enter report name..."
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>

        <Separator />

        {/* Fields Selection */}
        <div className="space-y-4">
          <h3 className="font-medium">Select Fields</h3>
          {Object.entries(groupedFields).map(([category, fields]) => (
            <div key={category} className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
              <div className="grid grid-cols-2 gap-2">
                {fields.map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={selectedFields.includes(field.id)}
                      onCheckedChange={() => handleFieldToggle(field.id)}
                    />
                    <Label
                      htmlFor={field.id}
                      className="text-sm flex items-center gap-2"
                    >
                      {field.name}
                      <Badge variant={field.type === 'metric' ? 'default' : 'secondary'} className="text-xs">
                        {field.type}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filters</h3>
            <Button variant="outline" size="sm" onClick={addFilter}>
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </div>
          
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center gap-2 p-3 border rounded-lg">
              <Select value={filter.field} onValueChange={(value) => updateFilter(filter.id, { field: value })}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {availableFields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filter.operator} onValueChange={(value) => updateFilter(filter.id, { operator: value })}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Value"
                value={filter.value}
                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                className="flex-1"
              />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFilter(filter.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Separator />

        {/* Chart Type */}
        <div className="space-y-2">
          <Label>Visualization Type</Label>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Table</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="scatter">Scatter Plot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={generateReport} className="flex-1">
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Preview */}
        {selectedFields.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Report Preview</h4>
            <div className="text-sm text-muted-foreground">
              <p><strong>Fields:</strong> {selectedFields.length} selected</p>
              <p><strong>Filters:</strong> {filters.length} applied</p>
              <p><strong>Visualization:</strong> {chartType}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
