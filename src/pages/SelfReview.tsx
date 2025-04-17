
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, CheckCircle } from "lucide-react";
import SelfReviewForm from "@/components/reviews/SelfReviewForm";
import { ReviewSkill } from "@/types";
import { initialSkills } from "@/data/reviewSkillsData";

// Mock data - Replace with actual data from your backend
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

const mockActiveCycle = {
  id: "cycle1",
  name: "Q1 2024 Performance Review",
  deadline: "2024-03-31",
  status: "active"
};

export default function SelfReview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<ReviewSkill[]>([]);

  // In a real app, fetch skills from your backend
  useEffect(() => {
    // Simulating API call with mock data
    setSkills(initialSkills || []);
  }, []);

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
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Self Review</h1>
        <p className="text-muted-foreground">
          Complete your self-assessment for the current review cycle
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
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
              <div className="flex items-center gap-2 text-green-600">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">In Progress</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <SelfReviewForm 
          cycleId={mockActiveCycle.id}
          parameters={mockParameters}
          skills={skills}
          onSubmit={handleSubmitReview}
        />
      </div>
    </div>
  );
}
