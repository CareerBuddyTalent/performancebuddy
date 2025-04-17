
import { AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  image?: string;
  status: 'not_started' | 'in_progress' | 'submitted' | 'acknowledged';
  daysOverdue?: number;
}

interface TeamReviewStatusProps {
  teamMembers: TeamMember[];
}

export default function TeamReviewStatus({ teamMembers }: TeamReviewStatusProps) {
  const navigate = useNavigate();
  
  // Filter team members who haven't started or are overdue
  const behindMembers = teamMembers.filter(
    member => member.status === 'not_started' || (member.daysOverdue && member.daysOverdue > 0)
  );

  return (
    <Card className="border-amber-200 dark:border-amber-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg">Team Review Status</CardTitle>
          <CardDescription>Team members needing attention</CardDescription>
        </div>
        <Button 
          onClick={() => navigate('/reviews/create')} 
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Review
        </Button>
      </CardHeader>
      <CardContent>
        {behindMembers.length > 0 ? (
          <div className="space-y-4">
            {behindMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.image} />
                    <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      {member.status === 'not_started' ? 'Review not started' : `${member.daysOverdue} days overdue`}
                    </p>
                  </div>
                </div>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">All team members are up to date with their reviews.</p>
        )}
      </CardContent>
    </Card>
  );
}
