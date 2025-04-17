
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
  examples?: string[];
}

export interface ReviewSkill {
  id: string;
  name: string;
  description: string;
  category: "technical" | "soft";
  isActive: boolean;
  visibleTo: ("admin" | "manager" | "employee")[];
}
