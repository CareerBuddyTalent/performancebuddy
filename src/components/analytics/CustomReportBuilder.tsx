
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart3, Download, Eye, Save, X } from "lucide-react";

interface ReportField {
  id: string;
  name: string;
  type: 'metric' | 'dimension' | 'filter';
  category: string;
}

const availableFields: ReportField[] = [
  { id: 'performance_score', name: 'Performance Score', type: 'metric', category: 'Performance' },
  { id: 'goal_completion', name: 'Goal Completion Rate', type: 'metric', category: 'Goals' },
  { id: 'engagement_score', name: 'Engagement Score', type: 'metric', category: 'Engagement' },
  { id: 'department', name: 'Department', type: 'dimension', category: 'Demographics' },
  { id: 'role', name: 'Role', type: 'dimension', category: 'Demographics' },
  { id: 'manager', name: 'Manager', type: 'dimension', category: 'Demographics' },
  { id: 'date_range', name: 'Date Range', type: 'filter', category: 'Time' },
  { id: 'performance_level', name: 'Performance Level', type: 'filter', category: 'Performance' }
];

export function CustomReportBuilder() {
  const [reportName, setReportName] = useState("");
  const [selectedFields, setSelectedFields] = useState<ReportField[]>([]);
  const [chartType, setChartType] = useState<string>("");

  const addField = (field: ReportField) => {
    if (!selectedFields.find(f => f.id === field.id)) {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const removeField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter(f => f.id !== fieldId));
  };

  const getFieldsByCategory = (category: string) => {
    return availableFields.filter(field => field.category === category);
  };

  const categories = [...new Set(availableFields.map(field => field.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Custom Report Builder
        </CardTitle>
        <CardDescription>
          Create custom reports by selecting metrics, dimensions, and filters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Report Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              placeholder="Enter report name..."
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chart-type">Chart Type</Label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="table">Data Table</SelectItem>
                <SelectItem value="heatmap">Heat Map</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Selected Fields */}
        <div className="space-y-2">
          <Label>Selected Fields</Label>
          {selectedFields.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <p className="text-muted-foreground">No fields selected</p>
              <p className="text-sm text-muted-foreground">Drag and drop fields from below</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedFields.map((field) => (
                <Badge key={field.id} variant="secondary" className="flex items-center gap-2">
                  {field.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeField(field.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Available Fields */}
        <div className="space-y-4">
          <Label>Available Fields</Label>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                <div className="space-y-1">
                  {getFieldsByCategory(category).map((field) => (
                    <div
                      key={field.id}
                      className={`p-2 border rounded cursor-pointer hover:bg-accent transition-colors ${
                        selectedFields.find(f => f.id === field.id) ? 'bg-accent' : ''
                      }`}
                      onClick={() => addField(field)}
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={!!selectedFields.find(f => f.id === field.id)}
                          readOnly
                        />
                        <span className="text-sm">{field.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">
                        {field.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Template
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Button className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
