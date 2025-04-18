
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import { RoleSkillListProps } from "./types";

export function RoleSkillList({ roleSkills, onRemoveSkill }: RoleSkillListProps) {
  if (roleSkills.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <ListChecks className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No skills defined for this role yet</p>
        <p className="text-sm mt-1">
          Add skills to define competency requirements for this role
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg divide-y">
      {roleSkills.map(skill => (
        <div key={skill.id} className="p-4 flex justify-between items-center">
          <div>
            <div className="font-medium">{skill.name}</div>
            <div className="flex items-center mt-1">
              <div className="text-sm text-muted-foreground mr-2">Proficiency:</div>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(level => (
                  <div 
                    key={level} 
                    className={`w-4 h-4 rounded-full ${level <= skill.levels.length ? 'bg-primary' : 'bg-muted'}`}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onRemoveSkill(skill.id)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  );
}
