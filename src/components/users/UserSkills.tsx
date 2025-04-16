
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SkillsMatrix from "@/components/SkillsMatrix";
import { Skill } from "@/types";

interface UserSkillsProps {
  userName: string;
  userSkills: Skill[];
}

export default function UserSkills({ userName, userSkills }: UserSkillsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Competencies</CardTitle>
        <CardDescription>
          Skills and competency levels for {userName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkillsMatrix skills={userSkills} />
      </CardContent>
    </Card>
  );
}
