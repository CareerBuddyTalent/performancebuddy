
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, CheckCircle, Clock } from "lucide-react";

interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  status: 'in-progress' | 'completed' | 'not-started';
  nextLesson: string;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
}

const mockEnrolledCourses: EnrolledCourse[] = [
  {
    id: '1',
    title: 'Leadership Fundamentals',
    instructor: 'Dr. Sarah Johnson',
    progress: 75,
    status: 'in-progress',
    nextLesson: 'Module 4: Team Motivation',
    totalLessons: 12,
    completedLessons: 9,
    estimatedTime: '1h 30m'
  },
  {
    id: '2',
    title: 'Effective Communication',
    instructor: 'Emma Rodriguez',
    progress: 100,
    status: 'completed',
    nextLesson: 'Course Complete',
    totalLessons: 8,
    completedLessons: 8,
    estimatedTime: 'Complete'
  },
  {
    id: '3',
    title: 'Project Management Basics',
    instructor: 'James Wilson',
    progress: 25,
    status: 'in-progress',
    nextLesson: 'Module 2: Planning Phase',
    totalLessons: 10,
    completedLessons: 2,
    estimatedTime: '3h 45m'
  }
];

export function MyLearning() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Play className="h-5 w-5 text-blue-600" />;
      default:
        return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Enrolled Courses</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">1</div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">24h</div>
            <p className="text-sm text-muted-foreground">Total Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled Courses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">My Courses</h3>
        {mockEnrolledCourses.map((course) => (
          <Card key={course.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(course.status)}
                    <h4 className="font-semibold">{course.title}</h4>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    by {course.instructor}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress: {course.completedLessons}/{course.totalLessons} lessons</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      {course.status === 'completed' ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Course Complete
                        </span>
                      ) : (
                        <span>Next: {course.nextLesson}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {course.estimatedTime}
                    </div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {course.status === 'completed' ? (
                    <Button variant="outline">Review</Button>
                  ) : (
                    <Button>Continue</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
