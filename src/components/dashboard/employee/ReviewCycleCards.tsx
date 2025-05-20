
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Clock, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getReviewDraft } from "@/utils/reviewUtils";

// In a real app, this would come from your API
const mockReviewCycles = [
  {
    id: "cycle1",
    name: "Q2 2025 Performance Review",
    deadline: "2025-06-30",
    type: "Quarterly",
    status: "active",
    quarter: "Q2"
  },
  {
    id: "cycle2",
    name: "Mid-Year 2025 Check-in",
    deadline: "2025-07-15",
    type: "Mid-Year",
    status: "upcoming",
    quarter: "Q3"
  },
  {
    id: "cycle3",
    name: "Q1 2025 Performance Review",
    deadline: "2025-03-31",
    type: "Quarterly",
    status: "completed",
    quarter: "Q1"
  }
];

export default function ReviewCycleCards() {
  const [reviewCycles, setReviewCycles] = useState(mockReviewCycles);
  const [draftStatuses, setDraftStatuses] = useState<Record<string, boolean>>({});
  
  // Check for drafts
  useEffect(() => {
    const checkForDrafts = () => {
      const drafts: Record<string, boolean> = {};
      
      reviewCycles.forEach(cycle => {
        const draft = getReviewDraft(cycle.id);
        drafts[cycle.id] = !!draft;
      });
      
      setDraftStatuses(drafts);
    };
    
    checkForDrafts();
  }, [reviewCycles]);
  
  // Calculate days remaining
  const getDaysRemaining = (deadline: string): number => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Get status badge styles
  const getStatusBadge = (status: string, cycleId: string) => {
    if (status === "active") {
      const hasDraft = draftStatuses[cycleId];
      
      if (hasDraft) {
        return {
          label: "Draft Saved",
          className: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
        };
      }
      
      return {
        label: "In Progress",
        className: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
      };
    }
    
    if (status === "upcoming") {
      return {
        label: "Upcoming",
        className: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
      };
    }
    
    if (status === "completed") {
      return {
        label: "Completed",
        className: "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400"
      };
    }
    
    return {
      label: status,
      className: ""
    };
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Review Cycles</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviewCycles
          .sort((a, b) => {
            // Sort by status (active first, then upcoming, then completed)
            const statusOrder: Record<string, number> = { active: 0, upcoming: 1, completed: 2 };
            return statusOrder[a.status] - statusOrder[b.status];
          })
          .map(cycle => {
            const daysRemaining = getDaysRemaining(cycle.deadline);
            const badge = getStatusBadge(cycle.status, cycle.id);
            const isActive = cycle.status === "active";
            const isUpcoming = cycle.status === "upcoming";
            const hasDraft = draftStatuses[cycle.id];
            
            return (
              <Card key={cycle.id} className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                      <span className="font-bold">{cycle.quarter}</span>
                    </div>
                    <div>
                      <div className="text-lg font-medium">{cycle.type}</div>
                      <div className="text-sm text-gray-500">{new Date(cycle.deadline).toLocaleDateString()}</div>
                    </div>
                    <Badge className={`ml-auto ${badge.className}`}>
                      {badge.label}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{cycle.name}</h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    {isActive && (
                      <>
                        <Clock className="h-4 w-4" />
                        <span>{daysRemaining > 0 ? `${daysRemaining} days remaining` : "Due today"}</span>
                      </>
                    )}
                    
                    {isUpcoming && (
                      <>
                        <Calendar className="h-4 w-4" />
                        <span>Opens in {Math.abs(daysRemaining)} days</span>
                      </>
                    )}
                    
                    {!isActive && !isUpcoming && (
                      <span>Completed on {new Date(cycle.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  {isActive && (
                    <Button asChild size="sm" className="w-full" variant={hasDraft ? "default" : "outline"}>
                      <Link to="/self-review" className="flex items-center justify-center gap-1">
                        {hasDraft ? "Continue Review" : "Start Review"}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  
                  {!isActive && isUpcoming && (
                    <Button disabled size="sm" variant="outline" className="w-full">
                      Not yet available
                    </Button>
                  )}
                  
                  {!isActive && !isUpcoming && (
                    <Button asChild size="sm" variant="outline" className="w-full">
                      <Link to="/reviews" className="flex items-center justify-center gap-1">
                        View Results
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
