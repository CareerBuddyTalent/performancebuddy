
import { supabaseClient } from "@/integrations/supabase/client";

export interface ReviewParameter {
  id: string;
  name: string;
  description: string;
  category: string;
  weight: number;
}

export interface ReviewResponse {
  id?: string;
  parameter_id: string;
  rating: number;
  comment: string;
}

export interface PerformanceReview {
  id?: string;
  user_id: string;
  reviewer_id?: string;
  cycle_id: string;
  status: "draft" | "submitted" | "in_review" | "completed";
  responses: ReviewResponse[];
  overall_score?: number;
  feedback?: string;
  submitted_at?: string;
  last_saved_at?: string;
}

export interface ReviewCycle {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  status: string;
}

// Fetch active review cycles
export const getActiveReviewCycles = async () => {
  const { data, error } = await supabaseClient
    .from("review_cycles")
    .select("*")
    .eq("status", "active")
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as ReviewCycle[];
};

// Fetch review parameters for a specific cycle
export const getReviewParameters = async (cycleId: string) => {
  const { data, error } = await supabaseClient
    .from("review_parameters")
    .select("*")
    .eq("cycle_id", cycleId)
    .order("category");

  if (error) {
    throw new Error(error.message);
  }

  return data as ReviewParameter[];
};

// Fetch a review for a specific user and cycle
export const getUserReview = async (userId: string, cycleId: string) => {
  // First get the review record
  const { data: reviewData, error: reviewError } = await supabaseClient
    .from("performance_reviews")
    .select("*")
    .eq("user_id", userId)
    .eq("cycle_id", cycleId)
    .single();

  if (reviewError && reviewError.code !== "PGRST116") {
    // PGRST116 is "no rows returned" which we handle as null
    throw new Error(reviewError.message);
  }

  if (!reviewData) {
    return null;
  }

  // Now get the responses
  const { data: responseData, error: responseError } = await supabaseClient
    .from("review_responses")
    .select("*")
    .eq("review_id", reviewData.id);

  if (responseError) {
    throw new Error(responseError.message);
  }

  return {
    ...reviewData,
    responses: responseData || [],
  } as PerformanceReview;
};

// Save a draft review
export const saveDraftReview = async (review: PerformanceReview) => {
  // If there's an existing review, update it, otherwise create a new one
  let reviewId = review.id;
  
  if (!reviewId) {
    // Create new review
    const { data: reviewData, error: reviewError } = await supabaseClient
      .from("performance_reviews")
      .insert({
        user_id: review.user_id,
        cycle_id: review.cycle_id,
        status: "draft",
        overall_score: review.overall_score,
        feedback: review.feedback,
      })
      .select()
      .single();

    if (reviewError) {
      throw new Error(reviewError.message);
    }
    
    reviewId = reviewData.id;
  } else {
    // Update existing review
    const { error: reviewError } = await supabaseClient
      .from("performance_reviews")
      .update({
        overall_score: review.overall_score,
        feedback: review.feedback,
        last_saved_at: new Date().toISOString(),
      })
      .eq("id", reviewId);

    if (reviewError) {
      throw new Error(reviewError.message);
    }
  }

  // Now handle the responses
  for (const response of review.responses) {
    if (response.id) {
      // Update existing response
      const { error } = await supabaseClient
        .from("review_responses")
        .update({
          rating: response.rating,
          comment: response.comment,
        })
        .eq("id", response.id);

      if (error) {
        throw new Error(error.message);
      }
    } else {
      // Create new response
      const { error } = await supabaseClient
        .from("review_responses")
        .insert({
          review_id: reviewId,
          parameter_id: response.parameter_id,
          rating: response.rating,
          comment: response.comment,
        });

      if (error) {
        throw new Error(error.message);
      }
    }
  }

  return { reviewId };
};

// Submit a completed review
export const submitReview = async (reviewId: string) => {
  const { error } = await supabaseClient
    .from("performance_reviews")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
    })
    .eq("id", reviewId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

// Get past reviews for a user
export const getPastReviews = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from("performance_reviews")
    .select(`
      *,
      review_cycles(name, end_date)
    `)
    .eq("user_id", userId)
    .not("status", "eq", "draft")
    .order("submitted_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
