
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
        survey_id: "1",
        text: "How satisfied are you with your current role?",
        type: "rating",
        required: true,
        order_index: 0,
        created_at: new Date()
      },
      {
        id: "q2",
        survey_id: "1",
        text: "Do you feel your work is recognized and valued?",
        type: "rating",
        required: true,
        order_index: 1,
        created_at: new Date()
      },
      {
        id: "q3",
        survey_id: "1",
        text: "What would improve your work experience?",
        type: "text",
        required: false,
        order_index: 2,
        created_at: new Date()
      }
    ],
    target_audience: "all",
    status: "active",
    creator_id: "user1",
    start_date: new Date(2025, 3, 1),
    end_date: new Date(2025, 3, 15),
    created_at: new Date(),
    updated_at: new Date(),
    responses: []
  },
  {
    id: "2",
    title: "Manager Effectiveness Survey",
    description: "Provide feedback on management effectiveness and leadership skills",
    questions: [
      {
        id: "q1",
        survey_id: "2",
        text: "My manager provides clear direction and expectations",
        type: "rating",
        required: true,
        order_index: 0,
        created_at: new Date()
      },
      {
        id: "q2",
        survey_id: "2",
        text: "My manager gives useful feedback on my work",
        type: "rating",
        required: true,
        order_index: 1,
        created_at: new Date()
      },
      {
        id: "q3",
        survey_id: "2",
        text: "My manager supports my professional development",
        type: "rating",
        required: true,
        order_index: 2,
        created_at: new Date()
      }
    ],
    target_audience: "department",
    audience_ids: ["engineering", "product"],
    status: "closed",
    creator_id: "user1",
    start_date: new Date(2025, 1, 1),
    end_date: new Date(2025, 1, 15),
    created_at: new Date(),
    updated_at: new Date(),
    responses: [
      {
        id: "r1",
        survey_id: "2",
        user_id: "user1",
        answers: [
          { 
            id: "a1",
            response_id: "r1",
            question_id: "q1", 
            answer: "4",
            created_at: new Date()
          },
          { 
            id: "a2",
            response_id: "r1",
            question_id: "q2", 
            answer: "5",
            created_at: new Date()
          },
          { 
            id: "a3",
            response_id: "r1",
            question_id: "q3", 
            answer: "3",
            created_at: new Date()
          }
        ],
        submitted_at: new Date(2025, 1, 10)
      },
      {
        id: "r2",
        survey_id: "2",
        user_id: "user2",
        answers: [
          { 
            id: "a4",
            response_id: "r2",
            question_id: "q1", 
            answer: "3",
            created_at: new Date()
          },
          { 
            id: "a5",
            response_id: "r2",
            question_id: "q2", 
            answer: "4",
            created_at: new Date()
          },
          { 
            id: "a6",
            response_id: "r2",
            question_id: "q3", 
            answer: "4",
            created_at: new Date()
          }
        ],
        submitted_at: new Date(2025, 1, 12)
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
        survey_id: "3",
        text: "How productive do you feel working remotely?",
        type: "rating",
        required: true,
        order_index: 0,
        created_at: new Date()
      },
      {
        id: "q2",
        survey_id: "3",
        text: "Do you have the tools you need to work effectively remotely?",
        type: "multiple_choice",
        options: ["Yes, completely", "Mostly, with some gaps", "No, missing essential tools"],
        required: true,
        order_index: 1,
        created_at: new Date()
      }
    ],
    target_audience: "all",
    status: "draft",
    creator_id: "user1",
    start_date: new Date(2025, 4, 1),
    end_date: new Date(2025, 4, 15),
    created_at: new Date(),
    updated_at: new Date(),
    responses: []
  }
];

export default function Surveys() {
  const [surveys, setSurveys] = useState(sampleSurveys);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  
  const handleCreateSurvey = (newSurvey: Partial<Survey>) => {
    try {
      const survey = {
        ...newSurvey,
        id: String(surveys.length + 1),
        questions: [],
        responses: [],
        creator_id: "user1",
        created_at: new Date(),
        updated_at: new Date()
      } as Survey;
      
      setSurveys([...surveys, survey]);
    } catch (err) {
      setError("Failed to create survey. Please try again.");
    }
  };
  
  return (
    <div className="space-y-6">
      <SurveyHeader />
      <Separator />
      <SurveyList 
        surveys={surveys}
        onCreateSurvey={handleCreateSurvey}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
