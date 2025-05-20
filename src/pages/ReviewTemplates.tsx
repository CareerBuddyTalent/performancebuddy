
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewTemplate, ReviewTemplateType } from "@/types/templates";
import TemplateCard from "@/components/templates/TemplateCard";
import CreateTemplateDialog from "@/components/templates/CreateTemplateDialog";
import { mockTemplates } from "@/components/templates/mockTemplateData";
import { hasPermission } from "@/types/performance-permissions";

export default function ReviewTemplates() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<ReviewTemplate[]>(mockTemplates);
  const [activeTab, setActiveTab] = useState<ReviewTemplateType | 'all'>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (!user) return null;
  
  const filteredTemplates = activeTab === 'all' 
    ? templates 
    : templates.filter(t => t.type === activeTab);

  const handleCreateTemplate = (template: ReviewTemplate) => {
    setTemplates([...templates, template]);
    setIsCreateDialogOpen(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };
  
  const canManageTemplates = hasPermission(user.role, 'manage_templates');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Review Templates</h1>
        
        {canManageTemplates && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Review Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={(v) => setActiveTab(v as ReviewTemplateType | 'all')}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="self">Self Review</TabsTrigger>
              <TabsTrigger value="peer">Peer Review</TabsTrigger>
              <TabsTrigger value="manager">Manager Review</TabsTrigger>
              <TabsTrigger value="360">360° Review</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map(template => (
                  <TemplateCard 
                    key={template.id} 
                    template={template} 
                    onDelete={canManageTemplates ? handleDeleteTemplate : undefined}
                  />
                ))}
              </div>
              
              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No templates found for this category
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CreateTemplateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreate={handleCreateTemplate}
      />
    </div>
  );
}
