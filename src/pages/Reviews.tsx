
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import SelfReviewForm from "@/components/reviews/SelfReviewForm";
import { useToast } from "@/hooks/use-toast";

// Mock parameters data for the self-review form
const mockParameters = [
  {
    id: "1",
    name: "Technical Skills",
    description: "Your proficiency in required technical skills for your role"
  },
  {
    id: "2",
    name: "Communication",
    description: "Ability to communicate effectively with team members and stakeholders"
  },
  {
    id: "3",
    name: "Initiative & Innovation",
    description: "Taking initiative and bringing innovative solutions to challenges"
  },
  {
    id: "4",
    name: "Collaboration",
    description: "Working effectively with others to achieve common goals"
  }
];

// Mock active cycle data
const mockActiveCycle = {
  id: "cycle1",
  name: "Q1 2024 Performance Review",
  deadline: "2024-03-31",
  status: "active"
};

export default function Reviews() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Review submitted",
        description: "Your self review has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Reviews</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Active Review Cycle</CardTitle>
          <CardDescription>Current review cycle requiring your input</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{mockActiveCycle.name}</h3>
              <p className="text-sm text-muted-foreground">
                Due by {new Date(mockActiveCycle.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <SelfReviewForm 
        cycleId={mockActiveCycle.id}
        parameters={mockParameters}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
