
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  levels: SkillLevel[];
}

export interface SkillLevel {
  level: number;
  description: string;
  expectations: string[];
}

export interface DevelopmentPlan {
  id: string;
  employeeId: string;
  title: string;
  skills: string[];
  description?: string;
  objectives: {
    id: string;
    description: string;
    dueDate: Date;
    status: "not_started" | "in_progress" | "completed";
  }[];
  createdAt: Date;
  modifiedAt: Date;
}

export interface ReviewSkill {
  id: string;
  name: string;
  description: string;
  category: "technical" | "soft";
  isActive: boolean;
}

