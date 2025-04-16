
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, PlusCircle } from "lucide-react";
import { ReviewCycle } from "@/types";
import { format } from "date-fns";
import CreateCycleDialog from "./CreateCycleDialog";
import { useToast } from "@/components/ui/use-toast";

interface CycleManagementProps {
  cycles: ReviewCycle[];
  onCreateCycle: (cycle: ReviewCycle) => void;
}

export default function CycleManagement({ cycles, onCreateCycle }: CycleManagementProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const handleCreateCycle = (newCycle: ReviewCycle) => {
    onCreateCycle(newCycle);
    toast({
      title: "Cycle created",
      description: `${newCycle.name} has been successfully created`,
    });
    setShowCreateDialog(false);
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

  const getCycleType = (type: string) => {
    switch(type) {
      case 'weekly':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">Weekly</Badge>;
      case 'monthly':
        return <Badge variant="outline" className="bg-purple-100 text-purple-700">Monthly</Badge>;
      case 'quarterly':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">Quarterly</Badge>;
      case 'bi-annual':
        return <Badge variant="outline" className="bg-emerald-100 text-emerald-700">Bi-Annual</Badge>;
      case 'annual':
        return <Badge variant="outline" className="bg-rose-100 text-rose-700">Annual</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getCyclePurpose = (purpose: string) => {
    switch(purpose) {
      case 'goal':
        return <Badge variant="secondary">Goal Review</Badge>;
      case 'feedback':
        return <Badge variant="secondary">Feedback</Badge>;
      case 'performance':
        return <Badge variant="secondary">Performance Review</Badge>;
      default:
        return <Badge variant="secondary">{purpose}</Badge>;
    }
  };

  // Filter cycles based on purpose
  const goalCycles = cycles.filter(cycle => cycle.purpose === 'goal');
  const feedbackCycles = cycles.filter(cycle => cycle.purpose === 'feedback');
  const performanceCycles = cycles.filter(cycle => cycle.purpose === 'performance');

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Performance Cycles</h2>
          <p className="text-muted-foreground">
            Manage review cycles for goals, feedback, and performance reviews
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Cycle
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Cycles</TabsTrigger>
          <TabsTrigger value="goals">Goal Reviews</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="performance">Performance Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Review Cycles</CardTitle>
              <CardDescription>
                All scheduled review cycles across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              {cycles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cycles.map(cycle => (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">{cycle.name}</TableCell>
                        <TableCell>{getCycleType(cycle.type)}</TableCell>
                        <TableCell>{getCyclePurpose(cycle.purpose)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Start: {format(new Date(cycle.startDate), 'MMM d, yyyy')}</span>
                            <span className="text-xs text-muted-foreground">End: {format(new Date(cycle.endDate), 'MMM d, yyyy')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-24 text-center text-muted-foreground">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Calendar className="h-10 w-10 opacity-50" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No review cycles found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create a new review cycle to get started
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Cycle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Goal Review Cycles</CardTitle>
              <CardDescription>
                Weekly, monthly, and quarterly cycles for reviewing employee goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              {goalCycles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {goalCycles.map(cycle => (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">{cycle.name}</TableCell>
                        <TableCell>{getCycleType(cycle.type)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Start: {format(new Date(cycle.startDate), 'MMM d, yyyy')}</span>
                            <span className="text-xs text-muted-foreground">End: {format(new Date(cycle.endDate), 'MMM d, yyyy')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No goal review cycles found</p>
                  <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
                    Create Goal Review Cycle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Cycles</CardTitle>
              <CardDescription>
                Weekly, monthly, and quarterly cycles for collecting employee feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {feedbackCycles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbackCycles.map(cycle => (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">{cycle.name}</TableCell>
                        <TableCell>{getCycleType(cycle.type)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Start: {format(new Date(cycle.startDate), 'MMM d, yyyy')}</span>
                            <span className="text-xs text-muted-foreground">End: {format(new Date(cycle.endDate), 'MMM d, yyyy')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No feedback cycles found</p>
                  <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
                    Create Feedback Cycle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Review Cycles</CardTitle>
              <CardDescription>
                Bi-annual and annual cycles for formal performance reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              {performanceCycles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceCycles.map(cycle => (
                      <TableRow key={cycle.id}>
                        <TableCell className="font-medium">{cycle.name}</TableCell>
                        <TableCell>{getCycleType(cycle.type)}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground">Start: {format(new Date(cycle.startDate), 'MMM d, yyyy')}</span>
                            <span className="text-xs text-muted-foreground">End: {format(new Date(cycle.endDate), 'MMM d, yyyy')}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cycle.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No performance review cycles found</p>
                  <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
                    Create Performance Review Cycle
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateCycleDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateCycle={handleCreateCycle}
      />
    </>
  );
}
