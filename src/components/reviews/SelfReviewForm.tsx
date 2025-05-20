
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, HeartHandshake, StarIcon, Save } from "lucide-react";
import { ReviewSkill } from "@/types";
import { saveReviewDraft, getReviewDraft, draftToRatingsAndComments, formatLastSaved, deleteReviewDraft } from "@/utils/reviewUtils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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

export default function SelfReviewForm({ cycleId, parameters, skills, onSubmit, isReadOnly = false }: SelfReviewFormProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"parameters" | "technical" | "soft">("parameters");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Filter skills by category if skills are provided
  const technicalSkills = skills?.filter(skill => skill.category === "technical") || [];
  const softSkills = skills?.filter(skill => skill.category === "soft") || [];
  
  // Load saved draft on component mount
  useEffect(() => {
    const loadDraft = async () => {
      const draft = getReviewDraft(cycleId);
      if (draft) {
        const { ratings: draftRatings, comments: draftComments } = draftToRatingsAndComments(draft);
        setRatings(draftRatings);
        setComments(draftComments);
        setLastSaved(draft.lastSaved);
        toast.info("Draft review loaded", {
          description: `Last saved ${formatLastSaved(draft.lastSaved)}`,
        });
      }
    };
    
    if (!isReadOnly) {
      loadDraft();
    }
  }, [cycleId, isReadOnly]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [ratings, comments]);
  
  const handleRatingClick = (itemId: string, rating: number) => {
    if (isReadOnly) return;
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    if (isReadOnly) return;
    setComments(prev => ({ ...prev, [itemId]: comment }));
  };

  const handleSaveDraft = async () => {
    if (isReadOnly) return;
    
    try {
      setSavingDraft(true);
      await saveReviewDraft(cycleId, ratings, comments, parameters, skills);
      const now = new Date();
      setLastSaved(now);
      setHasUnsavedChanges(false);
      toast.success("Draft saved successfully");
    } catch (error) {
      toast.error("Failed to save draft", {
        description: "Please try again later",
      });
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmitClick = () => {
    setConfirmSubmitOpen(true);
  };

  const handleSubmit = () => {
    if (isReadOnly) return;
    
    setIsSubmitting(true);
    
    try {
      // Combine parameters and skills ratings
      const parameterRatings = parameters?.map(param => ({
        parameterId: param.id,
        parameterName: param.name,
        score: ratings[param.id] || 0,
        comment: comments[param.id] || ""
      })) || [];
      
      const skillRatings = skills?.map(skill => ({
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        score: ratings[skill.id] || 0,
        comment: comments[skill.id] || ""
      })) || [];
      
      const reviewData = {
        cycleId,
        parameters: parameterRatings,
        skills: skillRatings
      };
      
      // Delete the draft after successful submission
      deleteReviewDraft(cycleId);
      
      onSubmit(reviewData);
      setConfirmSubmitOpen(false);
    } catch (error) {
      toast.error("Failed to submit review", {
        description: "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          
          <TabsContent value="parameters" className="space-y-6">
            {parameters?.map(param => (
              <RatingItem 
                key={param.id}
                id={param.id}
                name={param.name}
                description={param.description}
                rating={ratings[param.id] || 0}
                comment={comments[param.id] || ""}
                onRatingChange={handleRatingClick}
                onCommentChange={handleCommentChange}
                readOnly={isReadOnly}
              />
            ))}
            {(!parameters || parameters.length === 0) && (
              <div className="p-4 text-center text-muted-foreground">
                No general parameters defined for this review cycle.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-6">
            {technicalSkills.map(skill => (
              <RatingItem 
                key={skill.id}
                id={skill.id}
                name={skill.name}
                description={skill.description}
                rating={ratings[skill.id] || 0}
                comment={comments[skill.id] || ""}
                onRatingChange={handleRatingClick}
                onCommentChange={handleCommentChange}
                readOnly={isReadOnly}
              />
            ))}
            {technicalSkills.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No technical skills defined for this review cycle.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="soft" className="space-y-6">
            {softSkills.map(skill => (
              <RatingItem 
                key={skill.id}
                id={skill.id}
                name={skill.name}
                description={skill.description}
                rating={ratings[skill.id] || 0}
                comment={comments[skill.id] || ""}
                onRatingChange={handleRatingClick}
                onCommentChange={handleCommentChange}
                readOnly={isReadOnly}
              />
            ))}
            {softSkills.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No soft skills defined for this review cycle.
              </div>
            )}
          </TabsContent>
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

      <Dialog open={confirmSubmitOpen} onOpenChange={setConfirmSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Self Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your self review? Once submitted, you won't be able to make further changes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmSubmitOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

interface RatingItemProps {
  id: string;
  name: string;
  description: string;
  rating: number;
  comment: string;
  onRatingChange: (id: string, rating: number) => void;
  onCommentChange: (id: string, comment: string) => void;
  readOnly?: boolean;
}

function RatingItem({
  id,
  name,
  description,
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  readOnly = false
}: RatingItemProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>{name}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className={`p-2 ${rating === star ? 'text-yellow-500' : 'text-gray-400'} ${
              readOnly ? 'pointer-events-none' : ''
            }`}
            onClick={() => onRatingChange(id, star)}
            disabled={readOnly}
          >
            <StarIcon className="h-5 w-5" />
          </Button>
        ))}
      </div>
      
      <Textarea
        placeholder="Add your comments..."
        value={comment}
        onChange={(e) => onCommentChange(id, e.target.value)}
        disabled={readOnly}
      />
    </div>
  );
}
