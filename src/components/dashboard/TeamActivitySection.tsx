
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItem {
  type: string;
  date: Date;
  data: any;
  message: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface TeamActivitySectionProps {
  recentActivity: ActivityItem[];
}

export default function TeamActivitySection({ recentActivity }: TeamActivitySectionProps) {
  return (
    <Card className="shadow-md border-t-4 border-t-green-500 dark:border-t-green-400 hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl text-gray-800 dark:text-gray-200">Recent Activity</CardTitle>
            <CardDescription className="text-gray-500">The latest updates in your organization</CardDescription>
          </div>
          <Activity className="h-5 w-5 text-green-500 dark:text-green-400" />
        </div>
      </CardHeader>
      <CardContent>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 rtl:space-x-reverse p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
                {activity.user ? (
                  <Avatar className="h-8 w-8 border-2 border-white dark:border-gray-800">
                    <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                    <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {activity.user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{activity.message}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{activity.date.toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{activity.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>•</span>
                    <span className="capitalize bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-green-800 dark:text-green-200">{activity.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <Activity className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No recent activity to show.</p>
            <p className="text-xs mt-1">New events will appear here as they happen.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
