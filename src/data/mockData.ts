import { User, PerformanceParameter, ReviewCycle, PerformanceReview, Goal, Feedback, Company } from '@/types';

// Mock Companies
export const companies: Company[] = [
  {
    id: 'comp1',
    name: 'Acme Corporation',
    description: 'A global leader in innovative solutions',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=acme'
  },
  {
    id: 'comp2',
    name: 'TechNova',
    description: 'Cutting-edge technology provider',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=technova'
  },
  {
    id: 'comp3',
    name: 'Global Enterprises',
    description: 'Multinational business services',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=global'
  }
];

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    department: 'Executive',
    position: 'CEO',
    companyId: 'comp1',
    company: companies[0]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
    department: 'Engineering',
    position: 'Engineering Manager',
    manager: '1',
    companyId: 'comp1',
    company: companies[0]
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'employee',
    profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
    department: 'Engineering',
    position: 'Software Engineer',
    manager: '2',
    companyId: 'comp1',
    company: companies[0]
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'employee',
    profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
    department: 'Engineering',
    position: 'Frontend Developer',
    manager: '2',
    companyId: 'comp1',
    company: companies[0]
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'manager',
    profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
    department: 'Product',
    position: 'Product Manager',
    manager: '1',
    companyId: 'comp2',
    company: companies[1]
  },
  {
    id: '6',
    name: 'Dana Lee',
    email: 'dana@example.com',
    role: 'employee',
    profilePicture: 'https://randomuser.me/api/portraits/women/6.jpg',
    department: 'Marketing',
    position: 'Marketing Specialist',
    manager: '5',
    companyId: 'comp2',
    company: companies[1]
  },
  {
    id: '7',
    name: 'Evan Black',
    email: 'evan@example.com',
    role: 'admin',
    profilePicture: 'https://randomuser.me/api/portraits/men/7.jpg',
    department: 'Executive',
    position: 'CTO',
    companyId: 'comp3',
    company: companies[2]
  }
];

// Mock Performance Parameters
export const parameters: PerformanceParameter[] = [
  {
    id: 'p1',
    name: 'Technical Skills',
    description: 'Proficiency in required technical skills for the role',
    category: 'Competency',
  },
  {
    id: 'p2',
    name: 'Communication',
    description: 'Effectiveness in verbal and written communication',
    category: 'Soft Skills',
  },
  {
    id: 'p3',
    name: 'Productivity',
    description: 'Quantity and quality of work delivered',
    category: 'Performance',
  },
  {
    id: 'p4',
    name: 'Leadership',
    description: 'Ability to guide and influence others',
    category: 'Leadership',
  },
  {
    id: 'p5',
    name: 'Teamwork',
    description: 'Collaboration and contribution to team success',
    category: 'Soft Skills',
  },
];

// Mock Review Cycles
export const reviewCycles: ReviewCycle[] = [
  {
    id: "cycle1",
    name: "Q2 2023 Performance Review",
    startDate: new Date(2023, 3, 1), // April 1, 2023
    endDate: new Date(2023, 5, 30), // June 30, 2023
    status: "completed",
    parameters: ["param1", "param2", "param3"],
    type: "quarterly",
    purpose: "performance"
  },
  {
    id: "cycle2",
    name: "Mid-Year 2023 Performance Review",
    startDate: new Date(2023, 5, 1), // June 1, 2023
    endDate: new Date(2023, 10, 30), // November 30, 2023
    status: "completed",
    parameters: ["param1", "param2", "param3"],
    type: "bi-annual",
    purpose: "performance"
  },
  {
    id: "cycle3",
    name: "Annual 2023 Performance Review",
    startDate: new Date(2023, 10, 1), // November 1, 2023
    endDate: new Date(2024, 0, 31), // January 31, 2024
    status: "active",
    parameters: ["param1", "param2", "param3", "param4", "param5"],
    type: "annual",
    purpose: "performance"
  },
  {
    id: "cycle4",
    name: "Q1 2024 Goals Review",
    startDate: new Date(2024, 0, 1), // January 1, 2024
    endDate: new Date(2024, 2, 31), // March 31, 2024
    status: "active",
    parameters: ["param6", "param7"],
    type: "quarterly",
    purpose: "goal"
  },
  {
    id: "cycle5", 
    name: "April 2024 Team Feedback",
    startDate: new Date(2024, 3, 1), // April 1, 2024
    endDate: new Date(2024, 3, 30), // April 30, 2024
    status: "draft",
    parameters: ["param8", "param9"],
    type: "monthly",
    purpose: "feedback"
  },
  {
    id: "cycle6",
    name: "Weekly Team Feedback - Apr 15",
    startDate: new Date(2024, 3, 15), // April 15, 2024
    endDate: new Date(2024, 3, 21), // April 21, 2024
    status: "draft",
    parameters: ["param10"],
    type: "weekly",
    purpose: "feedback"
  }
];

// Mock Performance Reviews
export const reviews: PerformanceReview[] = [
  {
    id: 'r1',
    employeeId: '3',
    reviewerId: '2',
    cycleId: 'c2',
    status: 'acknowledged',
    ratings: [
      { parameterId: 'p1', score: 4, comment: 'Strong technical skills' },
      { parameterId: 'p2', score: 3, comment: 'Good communication, can improve documentation' },
      { parameterId: 'p3', score: 4, comment: 'Consistently delivers high-quality work' },
      { parameterId: 'p4', score: 2, comment: 'Can take more initiative in leading projects' },
      { parameterId: 'p5', score: 5, comment: 'Excellent team player' },
    ],
    overallRating: 3.6,
    feedback: 'Bob has been a valuable team member this year. His technical skills are strong, and he collaborates well with others. He could work on taking more leadership opportunities in the coming year.',
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2023-12-20'),
  },
  {
    id: 'r2',
    employeeId: '4',
    reviewerId: '2',
    cycleId: 'c2',
    status: 'acknowledged',
    ratings: [
      { parameterId: 'p1', score: 5, comment: 'Exceptional frontend skills' },
      { parameterId: 'p2', score: 4, comment: 'Communicates clearly and effectively' },
      { parameterId: 'p3', score: 4, comment: 'Consistently meets deadlines with quality work' },
      { parameterId: 'p4', score: 3, comment: 'Has begun mentoring junior devs effectively' },
      { parameterId: 'p5', score: 4, comment: 'Great collaborator' },
    ],
    overallRating: 4.0,
    feedback: "Alice has exceeded expectations this year. Her frontend development work is exceptional, and she has begun to grow in her leadership skills by mentoring others.",
    createdAt: new Date('2023-12-16'),
    updatedAt: new Date('2023-12-21'),
  },
  {
    id: 'r3',
    employeeId: '3',
    reviewerId: '2',
    cycleId: 'c1',
    status: 'in_progress',
    ratings: [
      { parameterId: 'p1', score: 4, comment: '' },
      { parameterId: 'p2', score: 3, comment: '' },
      { parameterId: 'p3', score: 0, comment: '' },
      { parameterId: 'p4', score: 0, comment: '' },
      { parameterId: 'p5', score: 0, comment: '' },
    ],
    overallRating: 0,
    feedback: '',
    createdAt: new Date('2024-06-05'),
    updatedAt: new Date('2024-06-05'),
  },
];

// Mock Goals
export const goals: Goal[] = [
  {
    id: 'g1',
    userId: '3',
    title: 'Learn React Native',
    description: 'Develop skills in React Native to contribute to mobile app projects',
    dueDate: new Date('2024-09-30'),
    status: 'in_progress',
    progress: 40,
    alignedWith: "Expand mobile development capabilities",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-01'),
    level: 'individual',
  },
  {
    id: 'g2',
    userId: '3',
    title: 'Improve code review skills',
    description: 'Become more effective at providing constructive feedback in code reviews',
    dueDate: new Date('2024-08-31'),
    status: 'in_progress',
    progress: 60,
    alignedWith: "Engineering excellence",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-01'),
    level: 'individual',
  },
  {
    id: 'g3',
    userId: '4',
    title: 'Master Typescript',
    description: 'Deepen understanding of TypeScript to improve code quality',
    dueDate: new Date('2024-07-31'),
    status: 'in_progress',
    progress: 75,
    alignedWith: "Engineering excellence",
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-06-01'),
    level: 'individual',
  },
  {
    id: 'g4',
    userId: '2',
    title: 'Improve team velocity',
    description: 'Implement process improvements to increase team productivity',
    dueDate: new Date('2024-12-31'),
    status: 'in_progress',
    progress: 30,
    alignedWith: "Engineering efficiency",
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-05-28'),
    level: 'team',
  },
];

// Mock Feedback
export const feedbackEntries: Feedback[] = [
  {
    id: 'f1',
    senderId: '2',
    recipientId: '3',
    content: 'Great job on the authentication feature implementation. The code was clean and well-tested.',
    type: 'praise',
    isAnonymous: false,
    createdAt: new Date('2024-05-10'),
  },
  {
    id: 'f2',
    senderId: '1',
    recipientId: '2',
    content: 'Your team has been delivering consistently ahead of schedule. Great leadership!',
    type: 'praise',
    isAnonymous: false,
    createdAt: new Date('2024-05-20'),
  },
  {
    id: 'f3',
    senderId: '2',
    recipientId: '4',
    content: 'I appreciate your attention to detail on the UI redesign. The stakeholders were very impressed.',
    type: 'praise',
    isAnonymous: false,
    createdAt: new Date('2024-06-01'),
  },
  {
    id: 'f4',
    senderId: '3',
    recipientId: '4',
    content: 'Thanks for helping me debug that tricky issue. I learned a lot from your approach.',
    type: 'praise',
    isAnonymous: false,
    createdAt: new Date('2024-06-02'),
  },
];

// Current logged in user (for demo purposes)
export const currentUser = users[2]; // Default to Bob (employee)
