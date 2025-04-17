
export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: SurveyQuestion[];
  targetAudience: 'all' | 'department' | 'team';
  audienceIds?: string[];
  status: 'draft' | 'active' | 'closed';
  startDate: Date;
  endDate: Date;
  responses: SurveyResponse[];
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'multiple_choice' | 'text';
  options?: string[];
  required: boolean;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId: string;
  answers: {
    questionId: string;
    answer: string | number;
  }[];
  submittedAt: Date;
}
