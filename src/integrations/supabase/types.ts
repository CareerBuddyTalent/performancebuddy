export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      career_paths: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      career_roles: {
        Row: {
          created_at: string | null
          id: string
          order_position: number | null
          path_id: string | null
          title: string
          years_experience: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_position?: number | null
          path_id?: string | null
          title: string
          years_experience?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_position?: number | null
          path_id?: string | null
          title?: string
          years_experience?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "career_roles_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "career_paths"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          name: string
          size: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name: string
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string
          size?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_import_urls: {
        Row: {
          company_id: string | null
          created_at: string
          error_message: string | null
          id: string
          import_id: string
          linkedin_url: string
          status: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          import_id: string
          linkedin_url: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          import_id?: string
          linkedin_url?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_import_urls_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_import_urls_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "company_imports"
            referencedColumns: ["id"]
          },
        ]
      }
      company_imports: {
        Row: {
          created_at: string
          error_details: Json | null
          failed_imports: number
          id: string
          processed_urls: number
          status: string
          successful_imports: number
          total_urls: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_details?: Json | null
          failed_imports?: number
          id?: string
          processed_urls?: number
          status?: string
          successful_imports?: number
          total_urls?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_details?: Json | null
          failed_imports?: number
          id?: string
          processed_urls?: number
          status?: string
          successful_imports?: number
          total_urls?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_managers: {
        Row: {
          company_id: string
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_managers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      development_plans: {
        Row: {
          created_at: string
          description: string | null
          employee_id: string
          end_date: string
          id: string
          manager_id: string
          objectives: Json | null
          review_id: string | null
          skills_focus: string[] | null
          start_date: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          employee_id: string
          end_date: string
          id?: string
          manager_id: string
          objectives?: Json | null
          review_id?: string | null
          skills_focus?: string[] | null
          start_date: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          manager_id?: string
          objectives?: Json | null
          review_id?: string | null
          skills_focus?: string[] | null
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "development_plans_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "performance_reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          content: string
          created_at: string
          id: string
          is_anonymous: boolean | null
          recipient_id: string
          sender_id: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id: string
          is_anonymous?: boolean | null
          recipient_id: string
          sender_id: string
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          recipient_id?: string
          sender_id?: string
          type?: string
        }
        Relationships: []
      }
      feedback_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          is_anonymous: boolean | null
          recipient_id: string
          requester_id: string
          reviewer_id: string
          status: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          recipient_id: string
          requester_id: string
          reviewer_id: string
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_anonymous?: boolean | null
          recipient_id?: string
          requester_id?: string
          reviewer_id?: string
          status?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_requests_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "review_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_integrations: {
        Row: {
          created_at: string
          entity_id: string
          goal_id: string
          id: string
          integration_type: string
          last_synced: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          goal_id: string
          id?: string
          integration_type: string
          last_synced?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          goal_id?: string
          id?: string
          integration_type?: string
          last_synced?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      goal_metrics: {
        Row: {
          created_at: string
          current_value: number | null
          goal_id: string
          id: string
          name: string
          target_value: number
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          goal_id: string
          id?: string
          name: string
          target_value: number
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          goal_id?: string
          id?: string
          name?: string
          target_value?: number
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      goal_milestones: {
        Row: {
          completed_date: string | null
          created_at: string
          description: string | null
          due_date: string | null
          goal_id: string
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          goal_id: string
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          goal_id?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          aligned_with: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          level: string
          progress: number | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aligned_with?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id: string
          level?: string
          progress?: number | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aligned_with?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          level?: string
          progress?: number | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_import_urls: {
        Row: {
          company_name: string | null
          created_at: string
          error_message: string | null
          id: string
          import_id: string
          job_id: string | null
          job_title: string | null
          job_url: string
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          import_id: string
          job_id?: string | null
          job_title?: string | null
          job_url: string
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          import_id?: string
          job_id?: string | null
          job_title?: string | null
          job_url?: string
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_import_urls_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "job_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_import_urls_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_imports: {
        Row: {
          created_at: string
          failed_imports: number
          id: string
          processed_urls: number
          source: string | null
          status: string
          successful_imports: number
          total_urls: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          failed_imports?: number
          id?: string
          processed_urls?: number
          source?: string | null
          status?: string
          successful_imports?: number
          total_urls?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          failed_imports?: number
          id?: string
          processed_urls?: number
          source?: string | null
          status?: string
          successful_imports?: number
          total_urls?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          application_url: string | null
          company: string
          created_at: string
          description: string | null
          id: string
          location: string | null
          requirements: string[] | null
          salary_range: string[] | null
          scraped_at: string
          source: string
          title: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          company: string
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          requirements?: string[] | null
          salary_range?: string[] | null
          scraped_at?: string
          source: string
          title: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          company?: string
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          requirements?: string[] | null
          salary_range?: string[] | null
          scraped_at?: string
          source?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      mock_users: {
        Row: {
          company_id: string | null
          created_at: string
          department: string | null
          email: string
          id: string
          manager: string | null
          name: string
          position: string | null
          profile_picture: string | null
          role: string
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          department?: string | null
          email: string
          id?: string
          manager?: string | null
          name: string
          position?: string | null
          profile_picture?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          manager?: string | null
          name?: string
          position?: string | null
          profile_picture?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mock_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          feedback_received: boolean | null
          goal_deadlines: boolean | null
          id: string
          push_notifications: boolean | null
          review_reminders: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          feedback_received?: boolean | null
          goal_deadlines?: boolean | null
          id?: string
          push_notifications?: boolean | null
          review_reminders?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          feedback_received?: boolean | null
          goal_deadlines?: boolean | null
          id?: string
          push_notifications?: boolean | null
          review_reminders?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      okrs: {
        Row: {
          created_at: string
          current_value: number | null
          description: string | null
          due_date: string | null
          id: string
          level: string
          parent_id: string | null
          progress: number | null
          status: string
          target_value: number | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          due_date?: string | null
          id: string
          level?: string
          parent_id?: string | null
          progress?: number | null
          status?: string
          target_value?: number | null
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_value?: number | null
          description?: string | null
          due_date?: string | null
          id?: string
          level?: string
          parent_id?: string | null
          progress?: number | null
          status?: string
          target_value?: number | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      performance_benchmarks: {
        Row: {
          benchmark_value: number
          category: string
          created_at: string
          department: string | null
          id: string
          metric_name: string
          percentile: number | null
          role_level: string | null
          updated_at: string
        }
        Insert: {
          benchmark_value: number
          category: string
          created_at?: string
          department?: string | null
          id?: string
          metric_name: string
          percentile?: number | null
          role_level?: string | null
          updated_at?: string
        }
        Update: {
          benchmark_value?: number
          category?: string
          created_at?: string
          department?: string | null
          id?: string
          metric_name?: string
          percentile?: number | null
          role_level?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      performance_reviews: {
        Row: {
          created_at: string
          cycle_id: string
          employee_id: string
          feedback: string | null
          id: string
          overall_rating: number | null
          ratings: Json | null
          reviewer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cycle_id: string
          employee_id: string
          feedback?: string | null
          id?: string
          overall_rating?: number | null
          ratings?: Json | null
          reviewer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cycle_id?: string
          employee_id?: string
          feedback?: string | null
          id?: string
          overall_rating?: number | null
          ratings?: Json | null
          reviewer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      performance_trends: {
        Row: {
          created_at: string
          feedback_sentiment: number | null
          goal_completion_rate: number | null
          id: string
          overall_score: number | null
          period_end: string
          period_start: string
          skill_scores: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_sentiment?: number | null
          goal_completion_rate?: number | null
          id?: string
          overall_score?: number | null
          period_end: string
          period_start: string
          skill_scores?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_sentiment?: number | null
          goal_completion_rate?: number | null
          id?: string
          overall_score?: number | null
          period_end?: string
          period_start?: string
          skill_scores?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          created_at: string | null
          department: string | null
          email: string
          id: string
          manager: string | null
          name: string | null
          position: string | null
          profile_picture: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          id: string
          manager?: string | null
          name?: string | null
          position?: string | null
          profile_picture?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          manager?: string | null
          name?: string | null
          position?: string | null
          profile_picture?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      question_responses: {
        Row: {
          answer: string
          created_at: string | null
          id: string
          question_id: string | null
          response_id: string | null
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: string
          question_id?: string | null
          response_id?: string | null
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: string
          question_id?: string | null
          response_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "survey_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_responses_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "survey_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      review_cycles: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          parameters: Json | null
          purpose: string
          start_date: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id: string
          name: string
          parameters?: Json | null
          purpose?: string
          start_date: string
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          parameters?: Json | null
          purpose?: string
          start_date?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_templates: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          metadata: Json | null
          name: string
          type: string
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          metadata?: Json | null
          name: string
          type: string
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          metadata?: Json | null
          name?: string
          type?: string
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      role_skills: {
        Row: {
          created_at: string | null
          id: string
          proficiency_level: number | null
          role_id: string | null
          skill_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          proficiency_level?: number | null
          role_id?: string | null
          skill_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          proficiency_level?: number | null
          role_id?: string | null
          skill_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_skills_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "career_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_assessments: {
        Row: {
          assessment_date: string
          assessment_type: string
          assessor_id: string
          competency_level: number
          created_at: string
          id: string
          notes: string | null
          skill_id: string
          user_id: string
        }
        Insert: {
          assessment_date?: string
          assessment_type: string
          assessor_id: string
          competency_level: number
          created_at?: string
          id?: string
          notes?: string | null
          skill_id: string
          user_id: string
        }
        Update: {
          assessment_date?: string
          assessment_type?: string
          assessor_id?: string
          competency_level?: number
          created_at?: string
          id?: string
          notes?: string | null
          skill_id?: string
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      survey_questions: {
        Row: {
          created_at: string | null
          id: string
          options: string[] | null
          order_index: number
          required: boolean | null
          survey_id: string | null
          text: string
          type: Database["public"]["Enums"]["question_type"]
        }
        Insert: {
          created_at?: string | null
          id?: string
          options?: string[] | null
          order_index: number
          required?: boolean | null
          survey_id?: string | null
          text: string
          type: Database["public"]["Enums"]["question_type"]
        }
        Update: {
          created_at?: string | null
          id?: string
          options?: string[] | null
          order_index?: number
          required?: boolean | null
          survey_id?: string | null
          text?: string
          type?: Database["public"]["Enums"]["question_type"]
        }
        Relationships: [
          {
            foreignKeyName: "survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          id: string
          submitted_at: string | null
          survey_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          submitted_at?: string | null
          survey_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          submitted_at?: string | null
          survey_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string | null
          creator_id: string | null
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          status: string
          target_audience: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          target_audience?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          status?: string
          target_audience?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      template_questions: {
        Row: {
          created_at: string
          description: string | null
          goal_ids: string[] | null
          id: string
          options: string[] | null
          order_position: number
          rating_scale: Json | null
          required: boolean | null
          section_id: string
          skill_ids: string[] | null
          text: string
          type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          goal_ids?: string[] | null
          id?: string
          options?: string[] | null
          order_position: number
          rating_scale?: Json | null
          required?: boolean | null
          section_id: string
          skill_ids?: string[] | null
          text: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          goal_ids?: string[] | null
          id?: string
          options?: string[] | null
          order_position?: number
          rating_scale?: Json | null
          required?: boolean | null
          section_id?: string
          skill_ids?: string[] | null
          text?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "template_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      template_sections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          order_position: number
          template_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          order_position: number
          template_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          order_position?: number
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_sections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "review_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          competency_level: number
          created_at: string
          id: string
          skill_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          competency_level?: number
          created_at?: string
          id?: string
          skill_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          competency_level?: number
          created_at?: string
          id?: string
          skill_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_count: {
        Args: { x: number }
        Returns: number
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_profile_with_role: {
        Args: { user_id_param: string }
        Returns: {
          id: string
          email: string
          name: string
          department: string
          position: string
          manager: string
          role: Database["public"]["Enums"]["user_role"]
          created_at: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_company_admin: {
        Args: { company_id: string }
        Returns: boolean
      }
      update_user_profile: {
        Args: {
          profile_name?: string
          profile_department?: string
          profile_position?: string
          profile_manager?: string
        }
        Returns: undefined
      }
      update_user_role: {
        Args: {
          target_user_id: string
          new_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: undefined
      }
      user_manages_company: {
        Args: { company_id: string }
        Returns: boolean
      }
    }
    Enums: {
      question_type: "multiple_choice" | "text" | "rating"
      user_role: "admin" | "manager" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      question_type: ["multiple_choice", "text", "rating"],
      user_role: ["admin", "manager", "employee"],
    },
  },
} as const
