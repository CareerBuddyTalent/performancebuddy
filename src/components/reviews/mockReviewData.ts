
export const mockParameters = [
  {
    id: "1",
    name: "Technical Skills",
    description: "Your proficiency in required technical skills for your role"
  },
  {
    id: "2",
    name: "Communication",
    description: "Ability to communicate effectively with team members and stakeholders"
  },
  {
    id: "3",
    name: "Initiative & Innovation",
    description: "Taking initiative and bringing innovative solutions to challenges"
  },
  {
    id: "4",
    name: "Collaboration",
    description: "Working effectively with others to achieve common goals"
  }
];

export const mockActiveCycle = {
  id: "cycle1",
  name: "Q1 2024 Performance Review",
  deadline: "2024-03-31",
  status: "active",
  personalGoals: [
    { id: "1", title: "Complete React Training", status: "completed" },
    { id: "2", title: "Improve Code Quality", status: "in_progress" },
    { id: "3", title: "Learn TypeScript", status: "in_progress" },
    { id: "4", title: "Master Testing", status: "not_started" }
  ]
};

export const mockPastReviews = [
  {
    id: "rev1",
    cycleId: "cycle-prev1",
    cycleName: "Q4 2023 Performance Review",
    submittedDate: "2023-12-15",
    status: "completed" as "completed" | "in_progress" | "pending",
    overallRating: 4,
    feedback: "Great job this quarter! You've shown significant improvement in your technical skills and collaboration with the team."
  },
  {
    id: "rev2",
    cycleId: "cycle-prev2",
    cycleName: "Q3 2023 Performance Review",
    submittedDate: "2023-09-30",
    status: "completed" as "completed" | "in_progress" | "pending",
    overallRating: 3,
    feedback: "Solid performance overall. Continue focusing on improving your communication with stakeholders."
  },
  {
    id: "rev3",
    cycleId: "cycle-prev3",
    cycleName: "Mid-Year 2023 Performance Review",
    submittedDate: "2023-06-30",
    status: "completed" as "completed" | "in_progress" | "pending",
    overallRating: 3.5,
    feedback: "You're making good progress on your development goals. Keep up the good work!"
  }
];
