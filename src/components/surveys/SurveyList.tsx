
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Survey } from "@/types";
import SurveyGrid from "./SurveyGrid";
import EmployeeSurveyTabs from "./EmployeeSurveyTabs";
import SurveyFilters from "./SurveyFilters";
import SurveyActions from "./SurveyActions";

interface SurveyListProps {
  surveys: Survey[];
  onCreateSurvey: (survey: Partial<Survey>) => void;
}

export default function SurveyList({ surveys, onCreateSurvey }: SurveyListProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);

  if (!user) return null;

  const canCreateSurvey = user.role === 'admin' || user.role === 'manager';

  // Filter surveys based on search query and status
  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || survey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Group surveys by status for employee view
  const activeSurveys = filteredSurveys.filter(s => s.status === 'active');
  const completedSurveys = filteredSurveys.filter(s => 
    s.status === 'closed' && s.responses.some(r => r.userId === user.id)
  );
  const pendingSurveys = filteredSurveys.filter(s => 
    s.status === 'active' && !s.responses.some(r => r.userId === user.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SurveyFilters
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
          showStatusFilter={user.role !== 'employee'}
        />
        {canCreateSurvey && (
          <SurveyActions onCreateClick={() => setIsCreateSurveyOpen(true)} />
        )}
      </div>

      {user.role === 'employee' ? (
        <EmployeeSurveyTabs
          pendingSurveys={pendingSurveys}
          completedSurveys={completedSurveys}
          activeSurveys={activeSurveys}
        />
      ) : (
        <SurveyGrid 
          surveys={filteredSurveys} 
          emptyMessage="No surveys matching your filters."
        />
      )}

      {canCreateSurvey && (
        <CreateSurveyDialog
          open={isCreateSurveyOpen}
          onClose={() => setIsCreateSurveyOpen(false)}
          onCreateSurvey={onCreateSurvey}
        />
      )}
    </div>
  );
}
