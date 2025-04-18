
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SkillCategories } from "./SkillCategories";

interface SkillsCatalogProps {
  categories: string[];
  showAddSkillDialog: boolean;
  onAddSkillClick: () => void;
}

export function SkillsCatalog({ categories, showAddSkillDialog, onAddSkillClick }: SkillsCatalogProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle>Skills Catalog</CardTitle>
          <CardDescription>Manage skills and competencies</CardDescription>
        </div>
        <Button onClick={onAddSkillClick}>
          Add Skill
        </Button>
      </CardHeader>
      <CardContent>
        <SkillCategories categories={categories} />
      </CardContent>
    </Card>
  );
}
