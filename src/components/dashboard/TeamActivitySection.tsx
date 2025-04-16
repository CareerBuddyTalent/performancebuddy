
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ActivityItem {
  type: string;
  date: Date;
  data: any;
  message: string;
}

interface TeamActivitySectionProps {
  recentActivity: ActivityItem[];
}

export default function TeamActivitySection({ recentActivity }: TeamActivitySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>The latest updates in your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div className="space-y-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.date.toLocaleDateString()} at {activity.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No recent activity to show.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
