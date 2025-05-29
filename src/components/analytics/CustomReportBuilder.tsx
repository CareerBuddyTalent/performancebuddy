
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Filter, Plus, X } from "lucide-react";

interface ReportFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ReportColumn {
  id: string;
  name: string;
  type: string;
  selected: boolean;
}

const availableColumns: ReportColumn[] = [
  { id: '1', name: 'Employee Name', type: 'text', selected: true },
  { id: '2', name: 'Department', type: 'text', selected: true },
  { id: '3', name: 'Performance Score', type: 'number', selected: true },
  { id: '4', name: 'Goal Completion Rate', type: 'percentage', selected: false },
  { id: '5', name: 'Skill Assessments', type: 'number', selected: false },
  { id: '6', name: 'Review Date', type: 'date', selected: true },
  { id: '7', name: 'Manager', type: 'text', selected: false },
  { id: '8', name: 'KPI Scores', type: 'number', selected: false }
];

export function CustomReportBuilder() {
  const [reportName, setReportName] = useState('');
  const [selectedColumns, setSelectedColumns] = useState<ReportColumn[]>(availableColumns);
  const [filters, setFilters] = useState<ReportFilter[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const addFilter = () => {
    const newFilter: ReportFilter = {
      id: Date.now().toString(),
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
    setFilters(filters.map(f => f.id === filterId ? { ...f, ...updates } : f));
  };

  const toggleColumn = (columnId: string) => {
    setSelectedColumns(columns => 
      columns.map(col => 
        col.id === columnId ? { ...col, selected: !col.selected } : col
      )
    );
  };

  const generateReport = () => {
    console.log('Generating report with:', {
      name: reportName,
      columns: selectedColumns.filter(col => col.selected),
      filters,
      dateRange
    });
    // Here you would implement the actual report generation logic
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Report Builder</CardTitle>
        <CardDescription>
          Create customized performance reports with flexible filtering and data selection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Name */}
        <div className="space-y-2">
          <Label htmlFor="reportName">Report Name</Label>
          <Input
            id="reportName"
            placeholder="Enter report name..."
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
            />
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
            />
          </div>
        </div>

        {/* Column Selection */}
        <div className="space-y-3">
          <Label>Select Columns</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {selectedColumns.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={column.id}
                  checked={column.selected}
                  onCheckedChange={() => toggleColumn(column.id)}
                />
                <Label htmlFor={column.id} className="text-sm">
                  {column.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Filters</Label>
            <Button variant="outline" size="sm" onClick={addFilter}>
              <Plus className="h-4 w-4 mr-1" />
              Add Filter
            </Button>
          </div>
          
          {filters.map((filter) => (
            <div key={filter.id} className="flex gap-2 items-center">
              <Select value={filter.field} onValueChange={(value) => updateFilter(filter.id, { field: value })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="performance_score">Performance Score</SelectItem>
                  <SelectItem value="goal_completion">Goal Completion</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filter.operator} onValueChange={(value) => updateFilter(filter.id, { operator: value })}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
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
                variant="outline"
                size="sm"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Selected Filters Display */}
        {filters.length > 0 && (
          <div className="space-y-2">
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Badge key={filter.id} variant="secondary" className="gap-1">
                  <Filter className="h-3 w-3" />
                  {filter.field} {filter.operator} {filter.value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={generateReport} disabled={!reportName}>
            <Calendar className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
