import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Target, User } from "lucide-react";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { toast } from "sonner";

interface SelfReviewFormProps {
  cycleId: string;
  onSubmit?: (reviewData: any) => void;
}

export default function SelfReviewForm({ cycleId, onSubmit }: SelfReviewFormProps) {
  const { user } = useSupabaseAuth();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [goals, setGoals] = useState("");

  // Mock review parameters - replace with real data
  const reviewParameters = [
    { id: "technical", name: "Technical Skills", description: "Your proficiency in technical skills" },
    { id: "communication", name: "Communication", description: "Your communication effectiveness" },
    { id: "teamwork", name: "Teamwork", description: "Your collaboration with team members" },
    { id: "innovation", name: "Innovation", description: "Your creative problem-solving abilities" }
  ];

  const handleRatingChange = (parameterId: string, value: number[]) => {
    setRatings(prev => ({ ...prev, [parameterId]: value[0] }));
  };

  const handleCommentChange = (parameterId: string, value: string) => {
    setComments(prev => ({ ...prev, [parameterId]: value }));
  };

  const handleSubmit = () => {
    if (!user) return;

    const reviewData = {
      cycleId,
      employeeId: user.id,
      ratings: Object.entries(ratings).map(([parameterId, score]) => ({
        parameterId,
        score,
        comment: comments[parameterId] || ""
      })),
      achievements,
      challenges,
      goals,
      submittedAt: new Date()
    };

    if (onSubmit) {
      onSubmit(reviewData);
    }
    
    toast.success("Self-review submitted successfully");
  };

  const isComplete = reviewParameters.every(param => ratings[param.id] !== undefined);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Self-Assessment</CardTitle>
          <p className="text-sm text-muted-foreground">
            Rate yourself on the following competencies and provide comments.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviewParameters.map((parameter) => (
            <div key={parameter.id} className="space-y-3">
              <div>
                <h4 className="font-medium">{parameter.name}</h4>
                <p className="text-sm text-muted-foreground">{parameter.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rating</span>
                  <Badge variant="outline">
                    {ratings[parameter.id] || 0} / 5
                  </Badge>
                </div>
                <Slider
                  value={[ratings[parameter.id] || 0]}
                  onValueChange={(value) => handleRatingChange(parameter.id, value)}
                  max={5}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Needs Improvement</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              <Textarea
                placeholder="Add comments about this competency..."
                value={comments[parameter.id] || ""}
                onChange={(e) => handleCommentChange(parameter.id, e.target.value)}
                rows={2}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Key Achievements</label>
            <Textarea
              placeholder="What are your key achievements this period?"
              value={achievements}
              onChange={(e) => setAchievements(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Challenges Faced</label>
            <Textarea
              placeholder="What challenges did you face and how did you overcome them?"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Goals for Next Period</label>
            <Textarea
              placeholder="What are your goals for the upcoming period?"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit}
          disabled={!isComplete}
          className="min-w-[120px]"
        >
          Submit Review
        </Button>
      </div>
    </div>
  );
}
