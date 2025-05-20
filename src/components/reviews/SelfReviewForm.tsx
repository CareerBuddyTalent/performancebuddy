
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, HeartHandshake, Save } from "lucide-react";
import { ReviewSkill } from "@/types";
import { formatLastSaved } from "@/utils/reviewUtils";
import { useSelfReview } from "@/hooks/useSelfReview";
import { ReviewConfirmDialog } from "./ReviewConfirmDialog";
import { ReviewTabsContent } from "./ReviewTabsContent";

interface SelfReviewFormProps {
  cycleId: string;
  parameters?: {
    id: string;
    name: string;
    description: string;
  }[];
  skills?: ReviewSkill[];
  onSubmit: (data: any) => void;
  isReadOnly?: boolean;
}

export default function SelfReviewForm({ 
  cycleId, 
  parameters, 
  skills, 
  onSubmit, 
  isReadOnly = false 
}: SelfReviewFormProps) {
  const {
    ratings,
    comments,
    activeTab,
    lastSaved,
    savingDraft,
    isSubmitting,
    confirmSubmitOpen,
    hasUnsavedChanges,
    setActiveTab,
    handleRatingClick,
    handleCommentChange,
    handleSaveDraft,
    handleSubmit,
    setConfirmSubmitOpen
  } = useSelfReview({
    cycleId,
    parameters,
    skills,
    isReadOnly
  });

  const handleSubmitClick = () => {
    setConfirmSubmitOpen(true);
  };

  // Last saved indicator
  const renderLastSaved = () => {
    if (!lastSaved) return null;
    
    return (
      <span className="text-xs text-muted-foreground">
        Last saved: {formatLastSaved(lastSaved)}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Self Review</CardTitle>
        <CardDescription>Rate yourself on the following parameters and skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="parameters">General Parameters</TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Technical Skills
            </TabsTrigger>
            <TabsTrigger value="soft" className="flex items-center gap-1">
              <HeartHandshake className="h-4 w-4" />
              Soft Skills
            </TabsTrigger>
          </TabsList>
          
          <ReviewTabsContent
            activeTab={activeTab}
            parameters={parameters}
            skills={skills}
            ratings={ratings}
            comments={comments}
            onRatingChange={handleRatingClick}
            onCommentChange={handleCommentChange}
            isReadOnly={isReadOnly}
          />
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center">
          {!isReadOnly && (
            <Button 
              variant="outline" 
              onClick={handleSaveDraft}
              disabled={savingDraft || !hasUnsavedChanges}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {savingDraft ? "Saving..." : "Save Draft"}
            </Button>
          )}
          {renderLastSaved()}
        </div>
        
        {!isReadOnly && (
          <Button onClick={handleSubmitClick} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        )}
      </CardFooter>

      <ReviewConfirmDialog
        open={confirmSubmitOpen}
        onOpenChange={setConfirmSubmitOpen}
        onConfirm={() => handleSubmit(onSubmit)}
        isSubmitting={isSubmitting}
      />
    </Card>
  );
}
