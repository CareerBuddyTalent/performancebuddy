import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Building, Users, LineChart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import UserSkills from "./UserSkills";
import UserValues from "./UserValues";

interface UserProfileProps {
  user: User;
  averageRating: number;
  userReviews: any[];
  userGoals: any[];
  userSkills: any[];
  getPerformanceColor: (rating: number) => string;
}

export default function UserProfile({
  user,
  averageRating,
  userReviews,
  userGoals,
  userSkills,
  getPerformanceColor
}: UserProfileProps) {
  const { user: currentUser } = useAuth();
  const canViewDetails = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <div className="space-y-6">
      <Card className="md:w-1/3">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <Badge className="mt-2 capitalize">{user.role}</Badge>
            <p className="text-muted-foreground mt-1">{user.position || "No position set"}</p>
            
            <div className="w-full mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{user.department || "No department"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Reports to: {user.manager || "No manager"}</span>
              </div>
            </div>
            
            <div className="w-full mt-6 pt-6 border-t">
              <div className="text-lg font-medium mb-2">Performance Overview</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                  <div className={`text-xl font-bold ${getPerformanceColor(averageRating)}`}>
                    {averageRating.toFixed(1)}/5
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Reviews</div>
                  <div className="text-xl font-bold">{userReviews.length}</div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Active Goals</div>
                  <div className="text-xl font-bold">
                    {userGoals.filter(g => g.status !== "completed").length}
                  </div>
                </div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground">Skills</div>
                  <div className="text-xl font-bold">{userSkills.length}</div>
                </div>
              </div>
              
              {canViewDetails && (
                <div className="mt-6">
                  <Button asChild variant="outline" className="w-full">
                    <Link to={`/dashboard?userId=${user.id}`} className="inline-flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      View Performance Analytics
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <UserValues userName={user.name} />
        <UserSkills userName={user.name} userSkills={userSkills} />
      </div>
    </div>
  );
}
