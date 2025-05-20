import { supabaseClient } from "@/integrations/supabase/client";

export interface Objective {
  id?: string;
  user_id: string;
  title: string;
  description?: string;
  start_date: string;
  due_date: string;
  status: "not_started" | "in_progress" | "behind_schedule" | "on_track" | "ahead" | "completed" | "canceled";
  progress: number;
  parent_id?: string;
  level: "individual" | "team" | "department" | "company";
  key_results?: KeyResult[];
}

export interface KeyResult {
  id?: string;
  objective_id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit?: string;
  is_boolean: boolean;
  status: "not_started" | "in_progress" | "behind_schedule" | "on_track" | "ahead" | "completed" | "canceled";
  due_date: string;
}

// Get user objectives
export const getUserObjectives = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from("objectives")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Objective[];
};

// Get full objective details including key results
export const getObjectiveWithKeyResults = async (objectiveId: string) => {
  // Get the objective
  const { data: objective, error: objectiveError } = await supabaseClient
    .from("objectives")
    .select("*")
    .eq("id", objectiveId)
    .single();

  if (objectiveError) {
    throw new Error(objectiveError.message);
  }

  // Get the key results
  const { data: keyResults, error: keyResultsError } = await supabaseClient
    .from("key_results")
    .select("*")
    .eq("objective_id", objectiveId)
    .order("created_at");

  if (keyResultsError) {
    throw new Error(keyResultsError.message);
  }

  return {
    ...objective,
    key_results: keyResults || [],
  } as Objective;
};

// Create a new objective
export const createObjective = async (objective: Objective) => {
  const { data, error } = await supabaseClient
    .from("objectives")
    .insert(objective)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Objective;
};

// Add key results to an objective
export const addKeyResult = async (keyResult: KeyResult) => {
  const { data, error } = await supabaseClient
    .from("key_results")
    .insert(keyResult)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as KeyResult;
};

// Update objective
export const updateObjective = async (id: string, updates: Partial<Objective>) => {
  const { data, error } = await supabaseClient
    .from("objectives")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Objective;
};

// Update key result
export const updateKeyResult = async (id: string, updates: Partial<KeyResult>) => {
  const { data, error } = await supabaseClient
    .from("key_results")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // If progress was updated, recalculate objective progress
  if ('current_value' in updates) {
    const { data: keyResult } = await supabaseClient
      .from("key_results")
      .select("objective_id")
      .eq("id", id)
      .single();
    
    if (keyResult) {
      await recalculateObjectiveProgress(keyResult.objective_id);
    }
  }

  return data as KeyResult;
};

// Recalculate objective progress based on key results
const recalculateObjectiveProgress = async (objectiveId: string) => {
  // Get all key results for this objective
  const { data: keyResults, error } = await supabaseClient
    .from("key_results")
    .select("*")
    .eq("objective_id", objectiveId);

  if (error) {
    throw new Error(error.message);
  }

  if (!keyResults || keyResults.length === 0) {
    return;
  }

  // Calculate progress for each key result
  const progressValues = keyResults.map(kr => {
    if (kr.is_boolean) {
      return kr.current_value > 0 ? 100 : 0;
    }
    return Math.min(100, (kr.current_value / kr.target_value) * 100);
  });

  // Calculate overall progress as average
  const overallProgress = progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length;

  // Determine status based on progress and due dates
  let status = "not_started";
  
  if (overallProgress >= 100) {
    status = "completed";
  } else if (overallProgress > 0) {
    const now = new Date();
    const dueDate = new Date(keyResults[0].due_date);
    const totalDuration = dueDate.getTime() - new Date(keyResults[0].due_date).getTime();
    const elapsed = now.getTime() - new Date(keyResults[0].due_date).getTime();
    const expectedProgress = Math.min(100, (elapsed / totalDuration) * 100);

    if (overallProgress > expectedProgress * 1.1) {
      status = "ahead";
    } else if (overallProgress < expectedProgress * 0.9) {
      status = "behind_schedule";
    } else {
      status = "on_track";
    }
  }

  // Update the objective
  await supabaseClient
    .from("objectives")
    .update({
      progress: Math.round(overallProgress),
      status,
    })
    .eq("id", objectiveId);
};

// Update objective alignment
export const updateObjectiveAlignment = async (objectiveId: string, parentId: string | null) => {
  const { data, error } = await supabaseClient
    .from("objectives")
    .update({
      parent_id: parentId
    })
    .eq("id", objectiveId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Objective;
};

// Get objective hierarchy
export const getObjectiveHierarchy = async () => {
  const { data, error } = await supabaseClient
    .from("objectives")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Objective[];
};

// Get team objectives (for managers)
export const getTeamObjectives = async (managerId: string) => {
  // Get team members for this manager
  const { data: teamMembers, error: teamError } = await supabaseClient
    .from("mock_users")  // In a real app, use a proper team/reporting relationship table
    .select("id")
    .eq("manager", managerId);

  if (teamError) {
    throw new Error(teamError.message);
  }

  if (!teamMembers || teamMembers.length === 0) {
    return [];
  }

  // Get objectives for team members
  const userIds = teamMembers.map(member => member.id);
  
  const { data: objectives, error: objectivesError } = await supabaseClient
    .from("objectives")
    .select("*")
    .in("user_id", userIds)
    .order("created_at", { ascending: false });

  if (objectivesError) {
    throw new Error(objectivesError.message);
  }

  return objectives as Objective[];
};

// Get company objectives
export const getCompanyObjectives = async () => {
  const { data, error } = await supabaseClient
    .from("objectives")
    .select("*")
    .eq("level", "company")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as Objective[];
};
