
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileChart, PlusCircle, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ManageReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManageReportsDialog({ open, onOpenChange }: ManageReportsDialogProps) {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("performance");
  const [frequency, setFrequency] = useState("monthly");
  const [recipients, setRecipients] = useState("");
  const [isAutoExport, setIsAutoExport] = useState(false);
  
  // Mock reports data
  const reports = [
    { id: "1", name: "Monthly Performance Summary", type: "Performance", frequency: "Monthly", recipients: "HR Team", lastGenerated: "2025-03-15" },
    { id: "2", name: "Quarterly OKR Status", type: "Goals", frequency: "Quarterly", recipients: "Leadership", lastGenerated: "2025-04-01" },
  ];

  const handleCreateReport = () => {
    // Validate form
    if (!reportType) {
      toast({
        title: "Error",
        description: "Please select a report type",
        variant: "destructive",
      });
      return;
    }

    // Show success toast
    toast({
      title: "Report configuration saved",
      description: "Your new report has been set up successfully",
    });
    
    // Close dialog
    onOpenChange(false);
  };
  
  const handleGenerateReport = (reportId: string) => {
    toast({
      title: "Report generated",
      description: "Your report has been generated and is ready for download",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Manage Reports</DialogTitle>
          <DialogDescription>
            Set up automated reports and export settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Configured Reports</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Last Generated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map(report => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.frequency}</TableCell>
                      <TableCell>{report.recipients}</TableCell>
                      <TableCell>{report.lastGenerated}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleGenerateReport(report.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Create New Report</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance Overview</SelectItem>
                        <SelectItem value="goals">Goals Status</SelectItem>
                        <SelectItem value="feedback">Feedback Summary</SelectItem>
                        <SelectItem value="skills">Skills Distribution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="manual">Manual Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipients">Recipients (comma separated email addresses)</Label>
                  <Input
                    id="recipients"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                    placeholder="hr@example.com, managers@example.com"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-export"
                    checked={isAutoExport}
                    onCheckedChange={setIsAutoExport}
                  />
                  <Label htmlFor="auto-export">Auto export to storage</Label>
                </div>
                
                <Button onClick={handleCreateReport} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Report
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
