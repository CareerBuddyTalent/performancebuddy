import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Survey } from "@/types";
import { Plus, Search, BarChart4 } from "lucide-react";
import SurveyCard from "@/components/SurveyCard";
import CreateSurveyDialog from "@/components/surveys/CreateSurveyDialog";

// Sample survey data
const sampleSurveys: Survey[] = [
  {
    id: "1",
    title: "Q2 Employee Engagement Survey",
    description: "Help us understand how engaged you feel at work and what we can improve",
    questions: [
      {
        id: "q1",
        text: "How satisfied are you with your current role?",
        type: "rating",
        required: true
      },
      {
        id: "q2",
        text: "Do you feel your work is recognized and valued?",
        type: "rating",
        required: true
      },
      {
        id: "q3",
        text: "What would improve your work experience?",
        type: "text",
        required: false
      }
    ],
    targetAudience: "all",
    status: "active",
    startDate: new Date(2025, 3, 1),
    endDate: new Date(2025, 3, 15),
    responses: []
  },
  {
    id: "2",
    title: "Manager Effectiveness Survey",
    description: "Provide feedback on management effectiveness and leadership skills",
    questions: [
      {
        id: "q1",
        text: "My manager provides clear direction and expectations",
        type: "rating",
        required: true
      },
      {
        id: "q2",
        text: "My manager gives useful feedback on my work",
        type: "rating",
        required: true
      },
      {
        id: "q3",
        text: "My manager supports my professional development",
        type: "rating",
        required: true
      }
    ],
    targetAudience: "department",
    audienceIds: ["engineering", "product"],
    status: "closed",
    startDate: new Date(2025, 1, 1),
    endDate: new Date(2025, 1, 15),
    responses: [
      {
        id: "r1",
        surveyId: "2",
        userId: "user1",
        answers: [
          { questionId: "q1", answer: 4 },
          { questionId: "q2", answer: 5 },
          { questionId: "q3", answer: 3 }
        ],
        submittedAt: new Date(2025, 1, 10)
      },
      {
        id: "r2",
        surveyId: "2",
        userId: "user2",
        answers: [
          { questionId: "q1", answer: 3 },
          { questionId: "q2", answer: 4 },
          { questionId: "q3", answer: 4 }
        ],
        submittedAt: new Date(2025, 1, 12)
      }
    ]
  },
  {
    id: "3",
    title: "Work From Home Experience",
    description: "Share your experience with remote work policies and practices",
    questions: [
      {
        id: "q1",
        text: "How productive do you feel working remotely?",
        type: "rating",
        required: true
      },
      {
        id: "q2",
        text: "Do you have the tools you need to work effectively remotely?",
        type: "multiple_choice",
        options: ["Yes, completely", "Mostly, with some gaps", "No, missing essential tools"],
        required: true
      }
    ],
    targetAudience: "all",
    status: "draft",
    startDate: new Date(2025, 4, 1),
    endDate: new Date(2025, 4, 15),
    responses: []
  }
];

export default function Surveys() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);
  const [surveys, setSurveys] = useState(sampleSurveys);
  
  if (!user) return null;

  const canCreateSurvey = user.role === 'admin' || user.role === 'manager';
  
  // Filter surveys based on role, search query, and status
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
  
  const handleCreateSurvey = (newSurvey: Partial<Survey>) => {
    const survey = {
      ...newSurvey,
      id: String(surveys.length + 1),
      questions: [],
      responses: [],
    } as Survey;
    
    setSurveys([...surveys, survey]);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {user.role === 'employee' ? 'Engagement Surveys' : 'Survey Management'}
        </h1>
        <p className="text-muted-foreground">
          {user.role === 'employee' 
            ? 'Provide feedback through engagement surveys' 
            : 'Create and manage employee engagement surveys'}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-1 items-center gap-4 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search surveys..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {user.role !== 'employee' && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        {canCreateSurvey && (
          <div className="flex gap-2">
            <Button variant="outline">
              <BarChart4 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button onClick={() => setIsCreateSurveyOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Survey
            </Button>
          </div>
        )}
      </div>
      
      <Separator />
      
      {user.role === 'employee' ? (
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
            {pendingSurveys.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pendingSurveys.map(survey => (
                  <SurveyCard key={survey.id} survey={survey} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">No pending surveys found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedSurveys.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedSurveys.map(survey => (
                  <SurveyCard key={survey.id} survey={survey} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">No completed surveys found.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="space-y-4">
            {activeSurveys.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeSurveys.map(survey => (
                  <SurveyCard key={survey.id} survey={survey} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center py-8">
                <p className="text-muted-foreground">No active surveys available.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSurveys.length > 0 ? (
            filteredSurveys.map(survey => (
              <SurveyCard key={survey.id} survey={survey} />
            ))
          ) : (
            <div className="col-span-full flex justify-center py-8">
              <p className="text-muted-foreground">No surveys matching your filters.</p>
            </div>
          )}
        </div>
      )}
      
      {canCreateSurvey && (
        <CreateSurveyDialog
          open={isCreateSurveyOpen}
          onClose={() => setIsCreateSurveyOpen(false)}
          onCreateSurvey={handleCreateSurvey}
        />
      )}
    </div>
  );
}
