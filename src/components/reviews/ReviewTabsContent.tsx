
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { RatingItem } from "./RatingItem";
import { ReviewSkill } from "@/types";

interface ReviewTabsContentProps {
  activeTab: "parameters" | "technical" | "soft";
  parameters?: {
    id: string;
    name: string;
    description: string;
  }[];
  skills?: ReviewSkill[];
  ratings: Record<string, number>;
  comments: Record<string, string>;
  onRatingChange: (itemId: string, rating: number) => void;
  onCommentChange: (itemId: string, comment: string) => void;
  isReadOnly: boolean;
}

export function ReviewTabsContent({
  activeTab,
  parameters,
  skills,
  ratings,
  comments,
  onRatingChange,
  onCommentChange,
  isReadOnly
}: ReviewTabsContentProps) {
  // Filter skills by category if skills are provided
  const technicalSkills = skills?.filter(skill => skill.category === "technical") || [];
  const softSkills = skills?.filter(skill => skill.category === "soft") || [];

  return (
    <>
      <TabsContent value="parameters" className="space-y-6">
        {parameters?.map(param => (
          <RatingItem 
            key={param.id}
            id={param.id}
            name={param.name}
            description={param.description}
            rating={ratings[param.id] || 0}
            comment={comments[param.id] || ""}
            onRatingChange={onRatingChange}
            onCommentChange={onCommentChange}
            readOnly={isReadOnly}
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
            onRatingChange={onRatingChange}
            onCommentChange={onCommentChange}
            readOnly={isReadOnly}
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
            onRatingChange={onRatingChange}
            onCommentChange={onCommentChange}
            readOnly={isReadOnly}
          />
        ))}
        {softSkills.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No soft skills defined for this review cycle.
          </div>
        )}
      </TabsContent>
    </>
  );
}
