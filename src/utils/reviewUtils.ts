
/**
 * Utility functions for managing review data and drafts
 */

import { toast } from "sonner";

interface ReviewDraft {
  cycleId: string;
  parameters: Array<{
    parameterId: string;
    parameterName: string;
    score: number;
    comment: string;
  }>;
  skills: Array<{
    skillId: string;
    skillName: string;
    category: string;
    score: number;
    comment: string;
  }>;
  lastSaved: Date;
}

/**
 * Saves a review draft to local storage
 */
export const saveReviewDraft = (
  cycleId: string,
  ratings: Record<string, number>,
  comments: Record<string, string>,
  parameters: any[] = [],
  skills: any[] = []
): void => {
  try {
    // Format parameters and skills data
    const parameterRatings = parameters.map(param => ({
      parameterId: param.id,
      parameterName: param.name,
      score: ratings[param.id] || 0,
      comment: comments[param.id] || ""
    }));
    
    const skillRatings = skills.map(skill => ({
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      score: ratings[skill.id] || 0,
      comment: comments[skill.id] || ""
    }));
    
    const draft: ReviewDraft = {
      cycleId,
      parameters: parameterRatings,
      skills: skillRatings,
      lastSaved: new Date()
    };
    
    // Save draft to local storage
    localStorage.setItem(`review-draft-${cycleId}`, JSON.stringify(draft));
    
    return;
  } catch (error) {
    console.error("Error saving review draft:", error);
    throw error;
  }
};

/**
 * Retrieves a review draft from local storage
 */
export const getReviewDraft = (cycleId: string): ReviewDraft | null => {
  try {
    const draftJson = localStorage.getItem(`review-draft-${cycleId}`);
    if (!draftJson) return null;
    
    const draft = JSON.parse(draftJson) as ReviewDraft;
    return draft;
  } catch (error) {
    console.error("Error retrieving review draft:", error);
    return null;
  }
};

/**
 * Deletes a review draft from local storage
 */
export const deleteReviewDraft = (cycleId: string): void => {
  try {
    localStorage.removeItem(`review-draft-${cycleId}`);
  } catch (error) {
    console.error("Error deleting review draft:", error);
  }
};

/**
 * Converts a draft to ratings and comments records
 */
export const draftToRatingsAndComments = (draft: ReviewDraft): {
  ratings: Record<string, number>;
  comments: Record<string, string>;
} => {
  const ratings: Record<string, number> = {};
  const comments: Record<string, string> = {};
  
  // Add parameter ratings and comments
  draft.parameters.forEach(param => {
    ratings[param.parameterId] = param.score;
    comments[param.parameterId] = param.comment;
  });
  
  // Add skill ratings and comments
  draft.skills.forEach(skill => {
    ratings[skill.skillId] = skill.score;
    comments[skill.skillId] = skill.comment;
  });
  
  return { ratings, comments };
};

/**
 * Format relative time for last saved
 */
export const formatLastSaved = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.round(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins === 1) return '1 minute ago';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours === 1) return '1 hour ago';
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
};
