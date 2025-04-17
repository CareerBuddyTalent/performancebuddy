
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Circle, Code, FileSpreadsheet, HeartHandshake, Plus, Trash, Upload } from "lucide-react";
import { ReviewSkill } from "@/types";
import { ImportSkillsDialog } from "../ImportSkillsDialog";

interface SkillsUploaderProps {
  skills: ReviewSkill[];
  onSkillAdded: (skill: ReviewSkill) => void;
  onSkillDeleted: (skillId: string) => void;
  onSkillsImported: (skills: ReviewSkill[]) => void;
}

export function SkillsUploader({ skills, onSkillAdded, onSkillDeleted, onSkillsImported }: SkillsUploaderProps) {
  const { toast } = useToast();
  const [skillName, setSkillName] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [skillCategory, setSkillCategory] = useState<"technical" | "soft">("technical");
  const [activeTab, setActiveTab] = useState("technical");
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  // Filter skills by category
  const technicalSkills = skills.filter(skill => skill.category === "technical");
  const softSkills = skills.filter(skill => skill.category === "soft");
  
  const handleAddSkill = () => {
    if (!skillName.trim()) {
      toast({
        title: "Skill name required",
        description: "Please provide a name for the skill.",
        variant: "destructive",
      });
      return;
    }
    
    const newSkill: ReviewSkill = {
      id: crypto.randomUUID(),
      name: skillName,
      description: skillDescription,
      category: skillCategory,
      isActive: true
    };
    
    onSkillAdded(newSkill);
    
    // Reset form
    setSkillName("");
    setSkillDescription("");
    
    toast({
      title: "Skill added",
      description: `${skillName} has been added to ${skillCategory} skills.`,
    });
  };
  
  const handleDeleteSkill = (skillId: string, skillName: string) => {
    onSkillDeleted(skillId);
    
    toast({
      title: "Skill deleted",
      description: `${skillName} has been removed.`,
    });
  };
  
  const handleImportComplete = (importedSkills: any[]) => {
    // Convert the imported skills to the ReviewSkill format
    const formattedSkills: ReviewSkill[] = importedSkills.map(skill => ({
      id: skill.id,
      name: skill.name,
      description: skill.description || "",
      category: skill.category.toLowerCase().includes("soft") ? "soft" : "technical",
      isActive: true
    }));
    
    onSkillsImported(formattedSkills);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Add Review Skills</CardTitle>
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Import Skills
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="skill-name">Skill Name</Label>
              <Input
                id="skill-name"
                placeholder="Enter skill name"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skill-description">Description</Label>
              <Textarea
                id="skill-description"
                placeholder="Enter skill description"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="skill-category">Category</Label>
              <Select
                value={skillCategory}
                onValueChange={(value) => setSkillCategory(value as "technical" | "soft")}
              >
                <SelectTrigger id="skill-category">
                  <SelectValue placeholder="Select skill category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Skill</SelectItem>
                  <SelectItem value="soft">Soft Skill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddSkill}>
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Review Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="technical" className="flex items-center">
                <Code className="mr-2 h-4 w-4" />
                Technical Skills ({technicalSkills.length})
              </TabsTrigger>
              <TabsTrigger value="soft" className="flex items-center">
                <HeartHandshake className="mr-2 h-4 w-4" />
                Soft Skills ({softSkills.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="technical">
              <SkillsTable 
                skills={technicalSkills} 
                onDeleteSkill={handleDeleteSkill} 
                categoryIcon={<Code className="h-4 w-4 text-blue-500" />}
              />
            </TabsContent>
            
            <TabsContent value="soft">
              <SkillsTable 
                skills={softSkills} 
                onDeleteSkill={handleDeleteSkill}
                categoryIcon={<HeartHandshake className="h-4 w-4 text-purple-500" />}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <ImportSkillsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={handleImportComplete}
      />
    </div>
  );
}

interface SkillsTableProps {
  skills: ReviewSkill[];
  onDeleteSkill: (skillId: string, skillName: string) => void;
  categoryIcon: React.ReactNode;
}

function SkillsTable({ skills, onDeleteSkill, categoryIcon }: SkillsTableProps) {
  return (
    <div className="border rounded-md">
      {skills.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No skills added yet.</p>
        </div>
      ) : (
        <ScrollArea className="h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    {categoryIcon}
                    {skill.name}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {skill.description}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteSkill(skill.id, skill.name)}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </div>
  );
}
