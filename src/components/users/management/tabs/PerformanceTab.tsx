
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Building2 } from "lucide-react";
import { User } from "@/types";
import UserPerformanceRanking from "@/components/UserPerformanceRanking";

interface PerformanceTabProps {
  users: User[];
}

export default function PerformanceTab({ users }: PerformanceTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Performance Rankings
          </CardTitle>
          <CardDescription>
            View top performers and performance rankings across the organization
          </CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <BarChart className="h-4 w-4 mr-2" />
          Analytics
        </Button>
      </CardHeader>
      <CardContent>
        <UserPerformanceRanking users={users} />
      </CardContent>
    </Card>
  );
}
