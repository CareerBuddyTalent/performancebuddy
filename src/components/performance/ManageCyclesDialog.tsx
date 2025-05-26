
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useRealReviewCycles } from "@/hooks/useRealReviewCycles";

interface ManageCyclesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ManageCyclesDialog({ open, onOpenChange }: ManageCyclesDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { reviewCycles, isLoading } = useRealReviewCycles();

  const handleCreateCycle = () => {
    // Close the dialog
    onOpenChange(false);
    
    // Navigate to the PerformanceCycles page
    navigate("/performance-cycles");
    
    toast({
      title: "Redirecting to Performance Cycles",
      description: "You can create and manage review cycles on this page",
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Review Cycles</DialogTitle>
          <DialogDescription>
            Manage your organization's review cycles and timing
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Loading review cycles...</p>
            </div>
          ) : reviewCycles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviewCycles.slice(0, 3).map(cycle => (
                  <TableRow key={cycle.id}>
                    <TableCell className="font-medium">{cycle.name}</TableCell>
                    <TableCell>{cycle.type}</TableCell>
                    <TableCell>{format(new Date(cycle.start_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{format(new Date(cycle.end_date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No review cycles found</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button onClick={handleCreateCycle}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Manage All Cycles
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
