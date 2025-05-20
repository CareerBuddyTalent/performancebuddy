
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Clock, ChevronLeft } from "lucide-react";
import SelfReviewForm from "@/components/reviews/SelfReviewForm";
import { ReviewSkill } from "@/types";
import { initialSkills } from "@/data/reviewSkillsData";
import { Link } from "react-router-dom";
import { getReviewDraft, formatLastSaved } from "@/utils/reviewUtils";

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
  name: "Q2 2025 Performance Review",
  deadline: "2025-06-30",
  status: "active",
  type: "Quarterly"
};

export default function SelfReview() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<ReviewSkill[]>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [draftLastSaved, setDraftLastSaved] = useState<Date | null>(null);

  // In a real app, fetch skills and active cycle from your backend
  useEffect(() => {
    // Simulating API call with mock data
    setSkills(initialSkills || []);
    
    // Check for existing draft
    const draft = getReviewDraft(mockActiveCycle.id);
    if (draft) {
      setHasDraft(true);
      setDraftLastSaved(new Date(draft.lastSaved));
    }
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

  // Calculate days remaining until deadline
  const getDaysRemaining = () => {
    const today = new Date();
    const deadlineDate = new Date(mockActiveCycle.deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  if (!user) return null;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Self Review</h1>
          <p className="text-muted-foreground">
            Complete your self-assessment for the current review cycle
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/dashboard" className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
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
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <Clock className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {daysRemaining > 0 
                    ? `${daysRemaining} days remaining` 
                    : daysRemaining === 0 
                      ? "Due today" 
                      : "Overdue"
                  }
                </span>
              </div>
            </div>
            
            {hasDraft && draftLastSaved && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm">
                <p>You have a saved draft from {formatLastSaved(draftLastSaved)}</p>
              </div>
            )}
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
