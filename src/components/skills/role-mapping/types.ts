
import { Skill } from "@/types";

export interface Role {
  id: string;
  title: string;
  department: string;
  skills: string[];
}

export interface RoleMappingProps {
  roles: Role[];
  skills: Skill[];
  filteredSkills: Skill[];
}

export interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSkill: (skillName: string, proficiency: number) => void;
  isSubmitting: boolean;
}

export interface RoleSkillListProps {
  roleSkills: Skill[];
  onRemoveSkill: (skillId: string) => void;
}
