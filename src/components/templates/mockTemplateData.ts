
import { ReviewTemplate } from "@/types/templates";

export const mockTemplates: ReviewTemplate[] = [
  {
    id: "1",
    name: "Quarterly Performance Review",
    description: "Standard quarterly performance evaluation template",
    type: "manager",
    isActive: true,
    createdBy: "admin",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
    usageCount: 45,
    sections: [
      {
        id: "s1",
        title: "Goals & Objectives",
        description: "Review of quarterly goals and objectives",
        order: 0,
        questions: [
          {
            id: "q1",
            text: "How well did the employee meet their quarterly objectives?",
            type: "rating",
            required: true,
            order: 0,
            ratingScale: { min: 1, max: 5 }
          },
          {
            id: "q2",
            text: "What specific achievements stood out this quarter?",
            type: "text",
            required: true,
            order: 1
          }
        ]
      },
      {
        id: "s2",
        title: "Core Competencies",
        description: "Evaluation of key competencies",
        order: 1,
        questions: [
          {
            id: "q3",
            text: "Rate the employee's communication skills",
            type: "rating",
            required: true,
            order: 0,
            ratingScale: { min: 1, max: 5 }
          },
          {
            id: "q4",
            text: "Rate the employee's ability to collaborate with team members",
            type: "rating",
            required: true,
            order: 1,
            ratingScale: { min: 1, max: 5 }
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Self-Assessment",
    description: "For employees to evaluate their own performance",
    type: "self",
    isActive: true,
    createdBy: "admin",
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
    usageCount: 78,
    sections: [
      {
        id: "s3",
        title: "Goal Reflection",
        description: "Reflect on your performance goals",
        order: 0,
        questions: [
          {
            id: "q5",
            text: "How would you rate your progress toward your goals this period?",
            type: "rating",
            required: true,
            order: 0,
            ratingScale: { min: 1, max: 5 }
          },
          {
            id: "q6",
            text: "What are your most significant accomplishments during this period?",
            type: "text",
            required: true,
            order: 1
          }
        ]
      },
      {
        id: "s4",
        title: "Growth & Development",
        description: "Evaluate your professional development",
        order: 1,
        questions: [
          {
            id: "q7",
            text: "What skills have you improved during this period?",
            type: "text",
            required: true,
            order: 0
          },
          {
            id: "q8",
            text: "What areas would you like to focus on for professional development?",
            type: "text",
            required: true,
            order: 1
          }
        ]
      }
    ]
  },
  {
    id: "3",
    name: "Peer Feedback Review",
    description: "For team members to provide feedback on colleagues",
    type: "peer",
    isActive: true,
    createdBy: "hr-manager",
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05"),
    usageCount: 52,
    sections: [
      {
        id: "s5",
        title: "Collaboration",
        description: "Assess teamwork and collaboration skills",
        order: 0,
        questions: [
          {
            id: "q9",
            text: "How effectively does this colleague collaborate with others?",
            type: "rating",
            required: true,
            order: 0,
            ratingScale: { min: 1, max: 5 }
          },
          {
            id: "q10",
            text: "What is this person's greatest strength as a team member?",
            type: "text",
            required: true,
            order: 1
          }
        ]
      },
      {
        id: "s6",
        title: "Technical Skills",
        description: "Feedback on technical abilities",
        order: 1,
        questions: [
          {
            id: "q11",
            text: "Rate this colleague's technical knowledge and expertise",
            type: "rating",
            required: true,
            order: 0,
            ratingScale: { min: 1, max: 5 }
          }
        ]
      }
    ]
  },
  {
    id: "4",
    name: "360° Leadership Review",
    description: "Comprehensive feedback from multiple perspectives",
    type: "360",
    isActive: true,
    createdBy: "admin",
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-20"),
    usageCount: 23,
    sections: [
      {
        id: "s7",
        title: "Leadership Skills",
        order: 0,
        questions: [
          {
            id: "q12",
            text: "Rate this leader's ability to communicate vision and direction",
            type: "rating",
            required: true,
            order: 0,
            ratingScale: { min: 1, max: 5 }
          },
          {
            id: "q13",
            text: "How well does this leader support their team's development?",
            type: "rating",
            required: true,
            order: 1,
            ratingScale: { min: 1, max: 5 }
          }
        ]
      },
      {
        id: "s8",
        title: "Decision Making",
        order: 1,
        questions: [
          {
            id: "q14",
            text: "How effective is this leader at making decisions?",
            type: "rating",
            required: true,
            order: 0,
            ratingScale: { min: 1, max: 5 }
          },
          {
            id: "q15",
            text: "Provide an example of good or poor decision making by this leader",
            type: "text",
            required: false,
            order: 1
          }
        ]
      }
    ]
  }
];
