
import { Skill } from "@/types";
import { Badge } from "@/components/ui/badge";

interface SkillCategoriesProps {
  skills: Skill[];
  currentSkill: Skill | null;
  setCurrentSkill: (skill: Skill) => void;
  selectedCategory?: string;
}

export function SkillCategories({ 
  skills, 
  currentSkill, 
  setCurrentSkill, 
  selectedCategory 
}: SkillCategoriesProps) {
  // Filter skills by category if needed
  const filteredSkills = selectedCategory && selectedCategory !== "all"
    ? skills.filter(skill => skill.category === selectedCategory) 
    : skills;

  // Group skills by category for better organization
  const skillsByCategory: Record<string, Skill[]> = {};
  filteredSkills.forEach(skill => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill);
  });

  return (
    <>
      {Object.entries(skillsByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-medium">{category}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {categorySkills.map(skill => (
                  <Badge 
                    key={skill.id}
                    variant={currentSkill?.id === skill.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setCurrentSkill(skill)}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 mb-4">
          {filteredSkills.map(skill => (
            <Badge 
              key={skill.id}
              variant={currentSkill?.id === skill.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCurrentSkill(skill)}
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      )}
    </>
  );
}
