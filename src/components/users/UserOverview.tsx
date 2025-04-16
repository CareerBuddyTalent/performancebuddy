
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, LineChart } from "lucide-react";
import { User } from "@/types";

interface UserOverviewProps {
  user: User;
}

export default function UserOverview({ user }: UserOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Overview</CardTitle>
        <CardDescription>
          Career path and development summary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Career Path</h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">Current Position</div>
                <Badge variant="outline">{user.position || "Not set"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Next Position</div>
                <Badge variant="outline">Senior {user.position || "Not set"}</Badge>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                Time in current role: 1 year, 3 months
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Development Summary</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  <span className="font-medium">Current Focus Areas</span>
                </div>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Technical leadership skills</li>
                  <li>Project management</li>
                  <li>Advanced {user.position} capabilities</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <LineChart className="h-5 w-5 mr-2 text-green-600" />
                  <span className="font-medium">Strengths</span>
                </div>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Technical expertise</li>
                  <li>Problem solving</li>
                  <li>Team collaboration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
