
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";

interface SelfReviewFormProps {
  cycleId: string;
  parameters: {
    id: string;
    name: string;
    description: string;
  }[];
  onSubmit: (data: any) => void;
}

export default function SelfReviewForm({ cycleId, parameters, onSubmit }: SelfReviewFormProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const handleRatingClick = (parameterId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [parameterId]: rating }));
  };

  const handleCommentChange = (parameterId: string, comment: string) => {
    setComments(prev => ({ ...prev, [parameterId]: comment }));
  };

  const handleSubmit = () => {
    const reviewData = {
      cycleId,
      ratings: parameters.map(param => ({
        parameterId: param.id,
        score: ratings[param.id] || 0,
        comment: comments[param.id] || ""
      }))
    };
    
    onSubmit(reviewData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Self Review</CardTitle>
        <CardDescription>Rate yourself on the following parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {parameters.map(param => (
          <div key={param.id} className="space-y-4">
            <div>
              <Label>{param.name}</Label>
              <p className="text-sm text-muted-foreground">{param.description}</p>
            </div>
            
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  className={`p-2 ${ratings[param.id] === rating ? 'text-yellow-500' : 'text-gray-400'}`}
                  onClick={() => handleRatingClick(param.id, rating)}
                >
                  <StarIcon className="h-5 w-5" />
                </Button>
              ))}
            </div>
            
            <Textarea
              placeholder="Add your comments..."
              value={comments[param.id] || ""}
              onChange={(e) => handleCommentChange(param.id, e.target.value)}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="ml-auto">Submit Review</Button>
      </CardFooter>
    </Card>
  );
}
