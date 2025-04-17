
import { ReviewParameter } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Trash2, BarChart, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ParameterListProps {
  parameters: ReviewParameter[];
  onDeleteParameter: (id: string) => void;
}

export default function ParameterList({ parameters, onDeleteParameter }: ParameterListProps) {
  const getCategoryBadge = (category: string) => {
    return (
      <Badge
        variant="outline"
        className={cn(
          category === "performance" && "bg-blue-100 text-blue-700",
          category === "soft" && "bg-green-100 text-green-700",
          category === "technical" && "bg-purple-100 text-purple-700",
          category === "goals" && "bg-amber-100 text-amber-700",
          category === "custom" && "bg-slate-100 text-slate-700",
        )}
      >
        {category}
      </Badge>
    );
  };

  const getScoreLabel = (maxScore: number) => {
    if (maxScore === 0) return "Text feedback only";
    return `${maxScore}-point scale`;
  };

  if (parameters.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground border rounded-md">
        <p>No parameters added yet</p>
        <p className="text-xs">Add parameters to evaluate during this review cycle</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="border rounded-md">
      <AccordionItem value="parameters">
        <AccordionTrigger className="px-4">
          View {parameters.length} Parameters
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-2">
            {parameters.map((param) => (
              <div 
                key={param.id} 
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{param.name}</p>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDeleteParameter(param.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">{param.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {getCategoryBadge(param.category)}
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <BarChart className="h-3 w-3" />
                      {getScoreLabel(param.maxScore)}
                    </Badge>
                    {param.weight > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <StarIcon className="h-3 w-3" />
                        Weight: {param.weight}%
                      </Badge>
                    )}
                    {param.required && (
                      <span className="text-xs text-muted-foreground">Required</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
