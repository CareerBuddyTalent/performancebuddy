
import { useState } from "react";
import { useClerkAuth } from "@/context/ClerkAuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Clock, CheckCircle } from "lucide-react";
import SelfReviewForm from "@/components/reviews/SelfReviewForm";

export default function SelfReview() {
  const { user } = useClerkAuth();
  const [selectedCycle, setSelectedCycle] = useState<string | null>(null);

  // Mock review cycles - replace with real data
  const availableCycles = [
    {
      id: "cycle1",
      name: "Q1 2024 Performance Review",
      deadline: "2024-03-31",
      status: "active",
      hasSubmitted: false
    },
    {
      id: "cycle2", 
      name: "Mid-Year 2023 Review",
      deadline: "2023-06-30",
      status: "completed",
      hasSubmitted: true
    }
  ];

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Please log in to complete your self-review.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleReviewSubmit = (reviewData: any) => {
    console.log('Self-review submitted:', reviewData);
    // Handle review submission logic here
  };

  const activeCycles = availableCycles.filter(c => c.status === 'active');
  const completedCycles = availableCycles.filter(c => c.status === 'completed');

  if (selectedCycle) {
    const cycle = availableCycles.find(c => c.id === selectedCycle);
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Self-Review</h1>
            <p className="text-muted-foreground">{cycle?.name}</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedCycle(null)}>
            Back to Review Cycles
          </Button>
        </div>

        <SelfReviewForm 
          cycleId={selectedCycle} 
          onSubmit={handleReviewSubmit}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Self-Review</h1>
        <p className="text-muted-foreground">
          Complete your self-assessment for available review cycles
        </p>
      </div>

      {/* Active Review Cycles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Active Review Cycles
          </CardTitle>
          <CardDescription>
            Review cycles that are currently open for submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeCycles.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-muted-foreground">No active review cycles</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                There are no review cycles available for completion at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeCycles.map((cycle) => (
                <div key={cycle.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{cycle.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Deadline: {new Date(cycle.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {cycle.hasSubmitted ? (
                        <Badge variant="default">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Submitted
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => setSelectedCycle(cycle.id)}
                        disabled={cycle.hasSubmitted}
                      >
                        {cycle.hasSubmitted ? 'View' : 'Start Review'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Review Cycles */}
      {completedCycles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Completed Review Cycles
            </CardTitle>
            <CardDescription>
              Review cycles you have previously completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {completedCycles.map((cycle) => (
                <div key={cycle.id} className="border rounded-lg p-4 opacity-75">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{cycle.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        Completed: {new Date(cycle.deadline).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">Completed</Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedCycle(cycle.id)}
                      >
                        View Review
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Getting Started Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Self-Review Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">
                1
              </div>
              <div>
                <h4 className="font-medium">Rate Your Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Evaluate yourself on key competencies and skills relevant to your role.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">
                2
              </div>
              <div>
                <h4 className="font-medium">Reflect on Achievements</h4>
                <p className="text-sm text-muted-foreground">
                  Highlight your key accomplishments and contributions during the review period.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-800">
                3
              </div>
              <div>
                <h4 className="font-medium">Set Future Goals</h4>
                <p className="text-sm text-muted-foreground">
                  Identify areas for improvement and set objectives for the upcoming period.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
