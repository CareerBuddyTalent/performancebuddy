
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { users, reviews as mockReviews, reviewCycles as mockCycles } from "@/data/mockData";
import { PerformanceReview, ReviewCycle } from "@/types";
import { PlusCircle, Filter, Clock, CheckCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import CreateReviewDialog from "@/components/CreateReviewDialog";
import { useToast } from "@/components/ui/use-toast";

export default function Reviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockReviews);
  const [cycles, setCycles] = useState<ReviewCycle[]>(mockCycles);
  const [activeTab, setActiveTab] = useState("reviews");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  
  // Filter reviews based on user role
  const filteredReviews = isAdmin 
    ? reviews 
    : isManager 
      ? reviews.filter(review => {
          const employee = users.find(u => u.id === review.employeeId);
          return employee?.manager === user?.name;
        })
      : [];
  
  // Active cycles that can be used for new reviews
  const activeCycles = cycles.filter(cycle => cycle.status === 'active');
  
  const handleCreateReview = (newReview: PerformanceReview) => {
    setReviews(prev => [...prev, newReview]);
    toast({
      title: "Review created",
      description: "The performance review has been successfully created",
    });
    setShowCreateDialog(false);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'not_started':
        return <Badge variant="outline">Not Started</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      case 'submitted':
        return <Badge variant="default">Submitted</Badge>;
      case 'acknowledged':
        return <Badge variant="default" className="bg-green-600">Acknowledged</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Performance Reviews</h1>
          <p className="text-muted-foreground">
            Manage and track performance reviews across the organization
          </p>
        </div>
        {(isAdmin || isManager) && activeCycles.length > 0 && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Review
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="reviews">All Reviews</TabsTrigger>
          {isAdmin && <TabsTrigger value="cycles">Review Cycles</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Performance Reviews</CardTitle>
                <CardDescription>
                  Track and manage employee performance reviews
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </CardHeader>
            <CardContent>
              {filteredReviews.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Reviewer</TableHead>
                      <TableHead>Cycle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map(review => {
                      const employee = users.find(u => u.id === review.employeeId);
                      const reviewer = users.find(u => u.id === review.reviewerId);
                      const cycle = cycles.find(c => c.id === review.cycleId);
                      
                      return (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{employee?.name || "Unknown"}</TableCell>
                          <TableCell>{reviewer?.name || "Unknown"}</TableCell>
                          <TableCell>{cycle?.name || "Unknown"}</TableCell>
                          <TableCell>{getStatusBadge(review.status)}</TableCell>
                          <TableCell>{review.overallRating.toFixed(1)}/5</TableCell>
                          <TableCell>{format(new Date(review.updatedAt), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-24 text-center text-muted-foreground">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-10 w-10 opacity-50" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">No reviews found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {activeCycles.length > 0 
                      ? "Create a new review to get started"
                      : "Wait for an active review cycle to create reviews"}
                  </p>
                  {(isAdmin || isManager) && activeCycles.length > 0 && (
                    <Button onClick={() => setShowCreateDialog(true)} className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Review
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {isAdmin && (
          <TabsContent value="cycles" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Review Cycles</CardTitle>
                  <CardDescription>
                    Manage organization-wide review cycles
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Cycle
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Parameters</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cycles.map(cycle => {
                      return (
                        <TableRow key={cycle.id}>
                          <TableCell className="font-medium">{cycle.name}</TableCell>
                          <TableCell>{format(new Date(cycle.startDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{format(new Date(cycle.endDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={cycle.status === 'active' ? 'default' : 'outline'}
                              className={cycle.status === 'completed' ? 'bg-green-600' : ''}
                            >
                              {cycle.status === 'active' && <CheckCircle className="mr-1 h-3 w-3" />}
                              <span className="capitalize">{cycle.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>{cycle.parameters.length}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      
      <CreateReviewDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateReview={handleCreateReview}
        cycles={activeCycles}
        currentUser={user}
      />
    </div>
  );
}
