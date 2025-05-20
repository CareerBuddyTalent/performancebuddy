
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ReviewSkill } from "@/types";
import { saveReviewDraft, getReviewDraft, draftToRatingsAndComments, formatLastSaved, deleteReviewDraft } from "@/utils/reviewUtils";

interface UseSelfReviewProps {
  cycleId: string;
  parameters?: {
    id: string;
    name: string;
    description: string;
  }[];
  skills?: ReviewSkill[];
  isReadOnly?: boolean;
}

export function useSelfReview({
  cycleId,
  parameters,
  skills,
  isReadOnly = false
}: UseSelfReviewProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"parameters" | "technical" | "soft">("parameters");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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

  const handleSubmit = (onSubmit: (data: any) => void) => {
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

  return {
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
  };
}
