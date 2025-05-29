
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Target, Sparkles } from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  reason: string;
  type: 'skill-gap' | 'career-growth' | 'trending' | 'personalized';
  confidence: number;
  estimatedImpact: 'low' | 'medium' | 'high';
  course: {
    title: string;
    duration: string;
    difficulty: string;
  };
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Develop Leadership Skills',
    reason: 'Based on your role progression and peer feedback, developing leadership skills could accelerate your career growth.',
    type: 'career-growth',
    confidence: 95,
    estimatedImpact: 'high',
    course: {
      title: 'Advanced Leadership Strategies',
      duration: '6 weeks',
      difficulty: 'intermediate'
    }
  },
  {
    id: '2',
    title: 'Data Analysis Fundamentals',
    reason: 'Your recent OKRs indicate data-driven decision making is important for your role.',
    type: 'skill-gap',
    confidence: 87,
    estimatedImpact: 'medium',
    course: {
      title: 'Data Analytics for Managers',
      duration: '4 weeks',
      difficulty: 'beginner'
    }
  },
  {
    id: '3',
    title: 'AI & Machine Learning Basics',
    reason: 'Trending skill in your industry with high demand and career impact.',
    type: 'trending',
    confidence: 78,
    estimatedImpact: 'high',
    course: {
      title: 'AI for Business Professionals',
      duration: '5 weeks',
      difficulty: 'beginner'
    }
  }
];

export function AIRecommendations() {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'skill-gap': return <Target className="h-5 w-5 text-red-600" />;
      case 'career-growth': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'trending': return <Sparkles className="h-5 w-5 text-purple-600" />;
      default: return <Brain className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'skill-gap': return 'bg-red-100 text-red-800';
      case 'career-growth': return 'bg-green-100 text-green-800';
      case 'trending': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-blue-600" />
        <div>
          <h2 className="text-xl font-semibold">AI-Powered Recommendations</h2>
          <p className="text-muted-foreground">
            Personalized learning suggestions based on your performance, goals, and industry trends
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mockRecommendations.map((rec) => (
          <Card key={rec.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(rec.type)}
                  <div>
                    <CardTitle className="text-lg">{rec.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTypeColor(rec.type)}>
                        {rec.type.replace('-', ' ')}
                      </Badge>
                      <Badge className={getImpactColor(rec.estimatedImpact)}>
                        {rec.estimatedImpact} impact
                      </Badge>
                      <Badge variant="outline">
                        {rec.confidence}% confidence
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="mt-2">
                {rec.reason}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Recommended Course:</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{rec.course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {rec.course.duration} • {rec.course.difficulty}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                    <Button size="sm">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Want More Personalized Recommendations?</h3>
            <p className="text-muted-foreground mb-4">
              Complete your skill assessment to get more targeted learning suggestions
            </p>
            <Button>Take Skill Assessment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
