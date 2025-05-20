
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ReviewTabsContent } from "./ReviewTabsContent";
import { ReviewConfirmDialog } from "./ReviewConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { ReviewSkill } from "@/types";
import {
  saveDraftReview,
  submitReview,
  getUserReview,
  getReviewParameters
} from "@/services/reviewService";

interface SelfReviewFormProps {
  cycleId: string;
  parameters?: { id: string; name: string; description: string }[];
  skills?: ReviewSkill[];
  onSubmit?: (data: any) => Promise<void>;
  readOnly?: boolean;
}

export default function SelfReviewForm({
  cycleId,
  parameters = [],
  skills = [],
  onSubmit,
  readOnly = false
}: SelfReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"parameters" | "technical" | "soft">("parameters");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dbParameters, setDbParameters] = useState<any[]>([]);
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load review data from database
  useEffect(() => {
    if (!user || !cycleId) return;

    const loadReviewData = async () => {
      try {
        setLoading(true);
        
        // Get parameters for this cycle
        const cycleParameters = await getReviewParameters(cycleId);
        setDbParameters(cycleParameters);
        
        // Check for existing review
        const existingReview = await getUserReview(user.id, cycleId);
        
        if (existingReview) {
          setReviewId(existingReview.id);
          
          // Convert responses to ratings and comments
          const loadedRatings: Record<string, number> = {};
          const loadedComments: Record<string, string> = {};
          
          existingReview.responses.forEach(response => {
            loadedRatings[response.parameter_id] = response.rating;
            loadedComments[response.parameter_id] = response.comment || "";
          });
          
          setRatings(loadedRatings);
          setComments(loadedComments);
        }
        
      } catch (error) {
        console.error("Error loading review data:", error);
        toast({
          title: "Error",
          description: "Failed to load review data. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadReviewData();
  }, [user, cycleId, toast]);

  const handleRatingChange = (itemId: string, rating: number) => {
    if (readOnly) return;
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    if (readOnly) return;
    setComments(prev => ({ ...prev, [itemId]: comment }));
  };

  const handleSaveDraft = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Prepare the review data
      const reviewResponses = Object.keys(ratings).map(parameterId => ({
        parameter_id: parameterId,
        rating: ratings[parameterId],
        comment: comments[parameterId] || ""
      }));
      
      // Calculate overall score
      const validRatings = Object.values(ratings).filter(r => r > 0);
      const overallScore = validRatings.length 
        ? validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length 
        : undefined;
      
      const result = await saveDraftReview({
        id: reviewId || undefined,
        user_id: user.id,
        cycle_id: cycleId,
        status: "draft",
        responses: reviewResponses,
        overall_score: overallScore
      });
      
      if (result.reviewId && !reviewId) {
        setReviewId(result.reviewId);
      }
      
      toast({
        title: "Draft saved",
        description: "Your review has been saved as a draft."
      });
      
    } catch (error: any) {
      console.error("Error saving draft:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save draft. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!reviewId || !user) return;
    
    try {
      setIsSubmitting(true);
      
      // First save the latest changes
      await handleSaveDraft();
      
      // Then submit the review
      await submitReview(reviewId);
      
      toast({
        title: "Review submitted",
        description: "Your self review has been submitted successfully."
      });
      
      // Close the dialog
      setIsDialogOpen(false);
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        await onSubmit({
          id: reviewId,
          userId: user.id,
          cycleId,
          ratings,
          comments
        });
      }
      
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine all parameters from props and database
  const allParameters = [...parameters, ...dbParameters];
  
  // Determine when form is ready to be submitted
  const canSubmit = !readOnly && Object.keys(ratings).length > 0;

  if (loading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Self Review Form</CardTitle>
          <CardDescription>Loading review data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="animate-pulse flex flex-col w-full space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
            <div className="h-32 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Self Review Form</CardTitle>
        <CardDescription>
          Rate yourself on the following parameters and provide comments to support your ratings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "parameters" | "technical" | "soft")}
          className="space-y-6"
        >
          <TabsList>
            <TabsTrigger value="parameters">General Parameters</TabsTrigger>
            <TabsTrigger value="technical">Technical Skills</TabsTrigger>
            <TabsTrigger value="soft">Soft Skills</TabsTrigger>
          </TabsList>
          
          <ReviewTabsContent 
            activeTab={activeTab}
            parameters={allParameters}
            skills={skills}
            ratings={ratings}
            comments={comments}
            onRatingChange={handleRatingChange}
            onCommentChange={handleCommentChange}
            isReadOnly={readOnly}
          />
          
          {!readOnly && (
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handleSaveDraft}
                disabled={isSaving || isSubmitting}
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                disabled={!canSubmit || isSaving || isSubmitting}
              >
                Submit Review
              </Button>
            </div>
          )}
        </Tabs>
      </CardContent>
      <ReviewConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting} 
      />
    </Card>
  );
}
