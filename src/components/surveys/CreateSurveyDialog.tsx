
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Survey } from "@/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSurveyCreation } from "@/hooks/useSurveyCreation";
import SurveyDetailsForm from "./SurveyDetailsForm";
import SurveyQuestionsForm from "./SurveyQuestionsForm";

interface CreateSurveyDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateSurvey: (survey: Partial<Survey>) => void;
}

export default function CreateSurveyDialog({ 
  open, 
  onClose, 
  onCreateSurvey 
}: CreateSurveyDialogProps) {
  const [currentTab, setCurrentTab] = useState('details');
  const { 
    form, 
    questions, 
    canCreateSurvey, 
    handleSubmit, 
    handleAddQuestion 
  } = useSurveyCreation(onCreateSurvey, onClose);

  if (!canCreateSurvey) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Survey</DialogTitle>
          </DialogHeader>
          
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You don't have permission to create surveys. Only administrators and managers can create surveys.
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Survey Details</TabsTrigger>
            <TabsTrigger value="questions" disabled={!form.getValues('title')}>
              Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <SurveyDetailsForm 
              form={form}
              onNext={() => setCurrentTab('questions')}
            />
          </TabsContent>

          <TabsContent value="questions">
            <SurveyQuestionsForm 
              questions={questions}
              onAddQuestion={handleAddQuestion}
              onBack={() => setCurrentTab('details')}
              onSubmit={form.handleSubmit(handleSubmit)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
