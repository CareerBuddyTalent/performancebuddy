
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewTemplate } from "@/types/templates";
import { format } from "date-fns";
import { Pencil, FileText, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface TemplateCardProps {
  template: ReviewTemplate;
  onDelete?: (id: string) => void;
}

export default function TemplateCard({ template, onDelete }: TemplateCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "self": return "bg-blue-100 text-blue-800";
      case "peer": return "bg-green-100 text-green-800";
      case "manager": return "bg-purple-100 text-purple-800";
      case "360": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <Badge variant="outline" className={getTypeColor(template.type)}>
              {template.type === "360" ? "360° Review" : `${template.type.charAt(0).toUpperCase() + template.type.slice(1)} Review`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {template.description && <p className="text-muted-foreground text-sm mb-4">{template.description}</p>}
          
          <div className="flex flex-col space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sections:</span>
              <span className="font-medium">{template.sections.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Questions:</span>
              <span className="font-medium">{template.sections.reduce((acc, section) => acc + section.questions.length, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{format(template.createdAt, "MMM d, yyyy")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span>{template.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
          
          {onDelete && (
            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => onDelete && onDelete(template.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
