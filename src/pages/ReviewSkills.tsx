
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SkillsUploader } from "@/components/reviews/SkillsUploader";
import { toast } from "sonner";
import { ReviewSkill } from "@/types";
import { initialSkills } from "@/data/reviewSkillsData";

export default function ReviewSkills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<ReviewSkill[]>(initialSkills);
  
  const handleAddSkill = (newSkill: ReviewSkill) => {
    setSkills(prevSkills => [...prevSkills, newSkill]);
  };
  
  const handleDeleteSkill = (skillId: string) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
  };
  
  const handleImportSkills = (importedSkills: ReviewSkill[]) => {
    setSkills(prevSkills => {
      // Filter out duplicates based on name
      const existingNames = new Set(prevSkills.map(skill => skill.name.toLowerCase()));
      const filteredImports = importedSkills.filter(
        skill => !existingNames.has(skill.name.toLowerCase())
      );
      
      if (filteredImports.length < importedSkills.length) {
        toast.info(`${importedSkills.length - filteredImports.length} duplicate skills were skipped.`);
      }
      
      return [...prevSkills, ...filteredImports];
    });
    
    toast.success(`Successfully imported ${importedSkills.length} skills.`);
  };
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Review Skills Management</h1>
        <p className="text-muted-foreground">
          Add, remove and manage skills used in employee reviews
        </p>
      </div>
      
      <SkillsUploader 
        skills={skills}
        onSkillAdded={handleAddSkill}
        onSkillDeleted={handleDeleteSkill}
        onSkillsImported={handleImportSkills}
      />
    </div>
  );
}
