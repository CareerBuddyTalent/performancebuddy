import { useState } from "react";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { SkillsUploader } from "@/components/reviews/SkillsUploader";
import { toast } from "sonner";
import { ReviewSkill } from "@/types";
import { initialSkills } from "@/data/reviewSkillsData";

export default function ReviewSkills() {
  const { user } = useSupabaseAuth();
  const [skills, setSkills] = useState<ReviewSkill[]>(initialSkills);
  
  const handleAddSkill = (newSkill: ReviewSkill) => {
    setSkills(prevSkills => [...prevSkills, newSkill]);
  };
  
  const handleDeleteSkill = (skillId: string) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId));
    toast.success("Skill deleted successfully");
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
      />
    </div>
  );
}
