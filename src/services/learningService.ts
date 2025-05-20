
import { supabaseClient } from "@/integrations/supabase/client";

export interface LearningCourse {
  id?: string;
  title: string;
  description?: string;
  category?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration_minutes: number;
  url?: string;
}

export interface UserEnrollment {
  id?: string;
  user_id: string;
  course_id: string;
  progress: number;
  start_date?: string;
  completed_at?: string;
  status: "enrolled" | "in_progress" | "completed" | "dropped";
}

// Get all available courses
export const getAllCourses = async () => {
  const { data, error } = await supabaseClient
    .from("learning_courses")
    .select("*")
    .order("title");

  if (error) {
    throw new Error(error.message);
  }

  return data as LearningCourse[];
};

// Get courses by category
export const getCoursesByCategory = async (category: string) => {
  const { data, error } = await supabaseClient
    .from("learning_courses")
    .select("*")
    .eq("category", category)
    .order("title");

  if (error) {
    throw new Error(error.message);
  }

  return data as LearningCourse[];
};

// Get a specific course
export const getCourseById = async (courseId: string) => {
  const { data, error } = await supabaseClient
    .from("learning_courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as LearningCourse;
};

// Get user enrollments
export const getUserEnrollments = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from("user_enrollments")
    .select(`
      *,
      learning_courses(*)
    `)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Enroll in a course
export const enrollInCourse = async (userId: string, courseId: string) => {
  const { data, error } = await supabaseClient
    .from("user_enrollments")
    .insert({
      user_id: userId,
      course_id: courseId,
      progress: 0,
      status: "enrolled"
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserEnrollment;
};

// Update course progress
export const updateCourseProgress = async (enrollmentId: string, progress: number, status?: string) => {
  const updates: any = { progress };
  
  if (status) {
    updates.status = status;
  }
  
  // If completed, add completion date
  if (status === "completed") {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabaseClient
    .from("user_enrollments")
    .update(updates)
    .eq("id", enrollmentId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserEnrollment;
};

// Add a new course (admin only)
export const addCourse = async (course: LearningCourse) => {
  const { data, error } = await supabaseClient
    .from("learning_courses")
    .insert(course)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as LearningCourse;
};
