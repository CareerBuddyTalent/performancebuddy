
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Calendar, Star, Target, Award } from "lucide-react";
import { User, Goal, Skill, Review } from "@/types";

export interface UserProfileProps {
  user: User;
  averageRating: number;
  userReviews: Review[];
  userGoals: Goal[];
  userSkills: Skill[];
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
  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="md:w-1/3">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-xl">{user.name}</CardTitle>
          <CardDescription>{user.role}</CardDescription>
          <Badge variant="outline" className="w-fit mx-auto">
            {user.department}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          
          {user.location && (
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{user.location}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined {new Date(user.joinDate || Date.now()).toLocaleDateString()}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold flex items-center justify-center space-x-1">
                <Star className={`h-5 w-5 ${getPerformanceColor(averageRating)}`} />
                <span className={getPerformanceColor(averageRating)}>
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userReviews.length}</div>
              <div className="text-xs text-muted-foreground">Reviews</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold flex items-center justify-center space-x-1">
                <Target className="h-5 w-5 text-green-600" />
                <span className="text-green-600">{userGoals.length}</span>
              </div>
              <div className="text-xs text-muted-foreground">Goals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold flex items-center justify-center space-x-1">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-purple-600">{userSkills.length}</span>
              </div>
              <div className="text-xs text-muted-foreground">Skills</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
