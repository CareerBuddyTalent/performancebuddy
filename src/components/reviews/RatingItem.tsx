
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";

interface RatingItemProps {
  id: string;
  name: string;
  description: string;
  rating: number;
  comment: string;
  onRatingChange: (id: string, rating: number) => void;
  onCommentChange: (id: string, comment: string) => void;
  readOnly?: boolean;
}

export function RatingItem({
  id,
  name,
  description,
  rating,
  comment,
  onRatingChange,
  onCommentChange,
  readOnly = false
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
            className={`p-2 ${rating === star ? 'text-yellow-500' : 'text-gray-400'} ${
              readOnly ? 'pointer-events-none' : ''
            }`}
            onClick={() => onRatingChange(id, star)}
            disabled={readOnly}
          >
            <StarIcon className="h-5 w-5" />
          </Button>
        ))}
      </div>
      
      <Textarea
        placeholder="Add your comments..."
        value={comment}
        onChange={(e) => onCommentChange(id, e.target.value)}
        disabled={readOnly}
      />
    </div>
  );
}
