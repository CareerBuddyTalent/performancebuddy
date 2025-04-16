
import { User, PerformanceParameter, ReviewCycle, PerformanceReview, Goal, Feedback } from '@/types';

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
  },
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
    id: 'c1',
    name: 'Mid-Year Review 2024',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-06-30'),
    status: 'active',
    parameters: ['p1', 'p2', 'p3', 'p4', 'p5'],
  },
  {
    id: 'c2',
    name: 'Annual Review 2023',
    startDate: new Date('2023-12-01'),
    endDate: new Date('2023-12-31'),
    status: 'completed',
    parameters: ['p1', 'p2', 'p3', 'p4', 'p5'],
  },
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
