
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, HeartHandshake, StarIcon } from "lucide-react";
import { ReviewSkill } from "@/types";

interface SelfReviewFormProps {
  cycleId: string;
  parameters?: {
    id: string;
    name: string;
    description: string;
  }[];
  skills?: ReviewSkill[];
  onSubmit: (data: any) => void;
}

export default function SelfReviewForm({ cycleId, parameters, skills, onSubmit }: SelfReviewFormProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"parameters" | "technical" | "soft">("parameters");
  
  // Filter skills by category if skills are provided
  const technicalSkills = skills?.filter(skill => skill.category === "technical") || [];
  const softSkills = skills?.filter(skill => skill.category === "soft") || [];
  
  const handleRatingClick = (itemId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [itemId]: rating }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setComments(prev => ({ ...prev, [itemId]: comment }));
  };

  const handleSubmit = () => {
    // Combine parameters and skills ratings
    const parameterRatings = parameters?.map(param => ({
      parameterId: param.id,
      parameterName: param.name,
      score: ratings[param.id] || 0,
      comment: comments[param.id] || ""
    })) || [];
    
    const skillRatings = skills?.map(skill => ({
      skillId: skill.id,
      skillName: skill.name,
      category: skill.category,
      score: ratings[skill.id] || 0,
      comment: comments[skill.id] || ""
    })) || [];
    
    const reviewData = {
      cycleId,
      parameters: parameterRatings,
      skills: skillRatings
    };
    
    onSubmit(reviewData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Self Review</CardTitle>
        <CardDescription>Rate yourself on the following parameters and skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="parameters">General Parameters</TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              Technical Skills
            </TabsTrigger>
            <TabsTrigger value="soft" className="flex items-center gap-1">
              <HeartHandshake className="h-4 w-4" />
              Soft Skills
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="parameters" className="space-y-6">
            {parameters?.map(param => (
              <RatingItem 
                key={param.id}
                id={param.id}
                name={param.name}
                description={param.description}
                rating={ratings[param.id] || 0}
                comment={comments[param.id] || ""}
                onRatingChange={handleRatingClick}
                onCommentChange={handleCommentChange}
              />
            ))}
            {(!parameters || parameters.length === 0) && (
              <div className="p-4 text-center text-muted-foreground">
                No general parameters defined for this review cycle.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="technical" className="space-y-6">
            {technicalSkills.map(skill => (
              <RatingItem 
                key={skill.id}
                id={skill.id}
                name={skill.name}
                description={skill.description}
                rating={ratings[skill.id] || 0}
                comment={comments[skill.id] || ""}
                onRatingChange={handleRatingClick}
                onCommentChange={handleCommentChange}
              />
            ))}
            {technicalSkills.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No technical skills defined for this review cycle.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="soft" className="space-y-6">
            {softSkills.map(skill => (
              <RatingItem 
                key={skill.id}
                id={skill.id}
                name={skill.name}
                description={skill.description}
                rating={ratings[skill.id] || 0}
                comment={comments[skill.id] || ""}
                onRatingChange={handleRatingClick}
                onCommentChange={handleCommentChange}
              />
            ))}
            {softSkills.length === 0 && (
              <div className="p-4 text-center text-muted-foreground">
                No soft skills defined for this review cycle.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="ml-auto">Submit Review</Button>
      </CardFooter>
    </Card>
  );
}

interface RatingItemProps {
  id: string;
  name: string;
  description: string;
  rating: number;
  comment: string;
  onRatingChange: (id: string, rating: number) => void;
  onCommentChange: (id: string, comment: string) => void;
}

function RatingItem({
  id,
  name,
  description,
  rating,
  comment,
  onRatingChange,
  onCommentChange
}: RatingItemProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>{name}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className={`p-2 ${rating === star ? 'text-yellow-500' : 'text-gray-400'}`}
            onClick={() => onRatingChange(id, star)}
          >
            <StarIcon className="h-5 w-5" />
          </Button>
        ))}
      </div>
      
      <Textarea
        placeholder="Add your comments..."
        value={comment}
        onChange={(e) => onCommentChange(id, e.target.value)}
      />
    </div>
  );
}
