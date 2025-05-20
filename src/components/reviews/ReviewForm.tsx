
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { User } from "@/types/user";
import { ReviewCycle, PerformanceReview } from "@/types/performance";
import ReviewTypeSelector from "./ReviewTypeSelector";
import CycleSelector from "./CycleSelector";
import EmployeeSelector from "./EmployeeSelector";
import InitialComments from "./InitialComments";
import { useCreateReview } from "@/hooks/use-create-review";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockTemplates } from "@/components/templates/mockTemplateData";
import { useState } from "react";

interface ReviewFormProps {
  onCreateReview: (review: PerformanceReview) => void;
  onClose: () => void;
  cycles: ReviewCycle[];
  currentUser: User | null;
}

export default function ReviewForm({
  onCreateReview,
  onClose,
  cycles,
  currentUser
}: ReviewFormProps) {
  const {
    activeTab,
    setActiveTab,
    selectedEmployees,
    setSelectedEmployees,
    cycleId,
    setCycleId,
    initialComments,
    setInitialComments,
    selectedCycle,
    performanceCycles,
    handleSubmit
  } = useCreateReview({
    cycles,
    currentUser,
    onCreateReview,
    onClose
  });

  // Mock users for testing - updated to include all required User properties
  const mockUsers: User[] = [
    { 
      id: "user1", 
      name: "John Doe", 
      email: "john@example.com",
      role: "employee", 
      position: "Developer" 
    },
    { 
      id: "user2", 
      name: "Jane Smith", 
      email: "jane@example.com",
      role: "employee", 
      position: "Designer" 
    },
    { 
      id: "user3", 
      name: "Bob Johnson", 
      email: "bob@example.com",
      role: "employee", 
      position: "Product Manager" 
    },
    { 
      id: "user4", 
      name: "Alice Williams", 
      email: "alice@example.com",
      role: "employee", 
      position: "Marketing" 
    },
    { 
      id: "user5", 
      name: "Charlie Brown", 
      email: "charlie@example.com",
      role: "employee", 
      position: "Sales" 
    }
  ];

  // Filter users based on current user role
  const filteredUsers = currentUser ? 
    currentUser.role === "manager" || currentUser.role === "admin" 
      ? mockUsers 
      : []
    : [];

  const [templateId, setTemplateId] = useState<string>("");
  const applicableTemplates = mockTemplates.filter(t => 
    (activeTab === "individual" && (t.type === "self" || t.type === "manager")) || 
    (activeTab === "team" && (t.type === "peer" || t.type === "360"))
  );

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cycleId) {
      toast.error("Please select a review cycle");
      return;
    }

    if (activeTab === "individual" && selectedEmployees.length !== 1) {
      toast.error("Please select an employee for individual review");
      return;
    }

    if (activeTab === "team" && selectedEmployees.length === 0) {
      toast.error("Please select at least one team member");
      return;
    }
    
    if (!templateId) {
      toast.error("Please select a review template");
      return;
    }

    handleSubmit(e);
  };

  return (
    <form onSubmit={onFormSubmit}>
      <div className="space-y-4 mt-4">
        <ReviewTypeSelector
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
          
        <CycleSelector
          cycles={cycles}
          selectedCycleId={cycleId}
          onCycleChange={setCycleId}
        />

        <EmployeeSelector
          type={activeTab}
          employees={filteredUsers}
          selectedEmployees={selectedEmployees} 
          onSelectionChange={(selected: User[]) => {
            setSelectedEmployees(selected);
          }}
        />
        
        <InitialComments
          value={initialComments}
          onChange={setInitialComments}
        />

        <div className="grid gap-2">
          <Label>Review Template</Label>
          <Select
            value={templateId}
            onValueChange={setTemplateId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              {applicableTemplates.length > 0 ? (
                applicableTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-templates" disabled>No templates available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={
            !cycleId || 
            !selectedCycle || 
            !templateId ||
            (activeTab === "individual" && selectedEmployees.length !== 1) ||
            (activeTab === "team" && selectedEmployees.length === 0)
          }
        >
          Create {activeTab === "individual" ? "Review" : "Team Reviews"}
        </Button>
      </DialogFooter>
    </form>
  );
}
