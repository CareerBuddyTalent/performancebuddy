
import { useState, useEffect } from 'react';
import { User, Goal, Skill, Review } from '@/types';
import { useRealUsers } from '@/hooks/useRealUsers';
import { useEnhancedGoalsData } from '@/hooks/useEnhancedGoalsData';
import { useRealReviews } from '@/hooks/useRealReviews';

export function useUserDetailData(userId: string | undefined) {
  const [user, setUser] = useState<User | null>(null);
  const [userGoals, setUserGoals] = useState<Goal[]>([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  
  const { users } = useRealUsers();
  const { goals } = useEnhancedGoalsData();
  const { reviews } = useRealReviews();
  
  useEffect(() => {
    if (userId && users.length > 0) {
      const foundUser = users.find(u => u.id === userId);
      setUser(foundUser || null);
      
      // Fetch user goals
      const userSpecificGoals = goals.filter(goal => goal.userId === userId);
      setUserGoals(userSpecificGoals);
      
      // Mock skills data
      const mockSkills: Skill[] = [
        {
          id: "s1",
          name: "React Development",
          description: "Proficiency in React framework and ecosystem",
          category: "Technical",
          levels: [
            {
              level: 1,
              description: "Basic knowledge of React concepts",
              expectations: ["Can create simple components", "Understands JSX syntax"]
            },
            {
              level: 2,
              description: "Working knowledge of React",
              expectations: ["Can use hooks effectively", "Understands component lifecycle"]
            },
            {
              level: 3,
              description: "Advanced knowledge of React",
              expectations: ["Can build complex applications", "Understands React performance optimization"]
            },
            {
              level: 4,
              description: "Expert in React development",
              expectations: ["Can architect large scale React applications", "Deep knowledge of React internals"]
            },
            {
              level: 5,
              description: "Master of React development",
              expectations: ["Contributes to React ecosystem", "Mentors others in React best practices"]
            }
          ]
        },
        {
          id: "s2",
          name: "Communication Skills",
          description: "Ability to communicate effectively with team members and stakeholders",
          category: "Soft Skills",
          levels: [
            {
              level: 1,
              description: "Basic communication skills",
              expectations: ["Can express simple ideas", "Listens to feedback"]
            },
            {
              level: 2,
              description: "Effective communicator in team settings",
              expectations: ["Clearly articulates ideas", "Actively participates in meetings"]
            },
            {
              level: 3,
              description: "Strong communicator across teams",
              expectations: ["Facilitates team discussions", "Presents complex ideas effectively"]
            },
            {
              level: 4,
              description: "Excellent communicator with leadership qualities",
              expectations: ["Influences decision making", "Mentors others in communication"]
            },
            {
              level: 5,
              description: "Expert communicator at all levels",
              expectations: ["Strategic communication with executives", "Represents the company externally"]
            }
          ]
        }
      ];
      
      setUserSkills(mockSkills);
    }
  }, [userId, users, goals]);
  
  // Transform reviews to match expected Review interface
  const userReviews: Review[] = reviews
    .filter(review => review.employeeId === userId)
    .map(review => ({
      ...review,
      ratings: [], // Initialize empty ratings array as required by interface
      status: (review.status === 'not_started' || review.status === 'in_progress' || 
               review.status === 'submitted' || review.status === 'acknowledged') 
               ? review.status 
               : 'not_started' as const, // Type-cast to expected literal types
      createdAt: new Date(review.createdAt),
      updatedAt: new Date(review.updatedAt)
    }));
    
  const averageRating = userReviews.length > 0
    ? userReviews.reduce((sum, review) => sum + review.overallRating, 0) / userReviews.length
    : 0;
  
  const getPerformanceColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-blue-600";
    if (rating >= 2) return "text-yellow-600";
    return "text-red-600";
  };
  
  return {
    user,
    userGoals,
    userSkills,
    userReviews,
    averageRating,
    getPerformanceColor
  };
}
