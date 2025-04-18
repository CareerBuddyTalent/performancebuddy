
export interface Survey {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  status: 'draft' | 'active' | 'closed';
  target_audience: 'all' | 'department' | 'team';
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
}

export interface SurveyQuestion {
  id: string;
  survey_id: string;
  text: string;
  type: 'multiple_choice' | 'text' | 'rating';
  options?: string[];
  required: boolean;
  order_index: number;
  created_at: Date;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  user_id: string;
  submitted_at: Date;
  answers: QuestionResponse[];
}

export interface QuestionResponse {
  id: string;
  response_id: string;
  question_id: string;
  answer: string;
  created_at: Date;
}
