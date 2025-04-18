
import { Survey } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SurveyGrid from "./SurveyGrid";

interface EmployeeSurveyTabsProps {
  pendingSurveys: Survey[];
  completedSurveys: Survey[];
  activeSurveys: Survey[];
}

export default function EmployeeSurveyTabs({ 
  pendingSurveys, 
  completedSurveys, 
  activeSurveys 
}: EmployeeSurveyTabsProps) {
  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending">
          Pending ({pendingSurveys.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completedSurveys.length})
        </TabsTrigger>
        <TabsTrigger value="all">
          All Surveys ({activeSurveys.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="pending" className="space-y-4">
        <SurveyGrid surveys={pendingSurveys} emptyMessage="No pending surveys found." />
      </TabsContent>
      
      <TabsContent value="completed" className="space-y-4">
        <SurveyGrid surveys={completedSurveys} emptyMessage="No completed surveys found." />
      </TabsContent>
      
      <TabsContent value="all" className="space-y-4">
        <SurveyGrid surveys={activeSurveys} emptyMessage="No active surveys available." />
      </TabsContent>
    </Tabs>
  );
}
