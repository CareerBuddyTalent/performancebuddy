import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Survey } from "@/types";
import SurveyHeader from "@/components/surveys/SurveyHeader";
import SurveyList from "@/components/surveys/SurveyList";

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
  const [surveys, setSurveys] = useState(sampleSurveys);
  
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
      <SurveyHeader />
      <Separator />
      <SurveyList 
        surveys={surveys}
        onCreateSurvey={handleCreateSurvey}
      />
    </div>
  );
}
