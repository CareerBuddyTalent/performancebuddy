
import { Skeleton } from "@/components/ui/skeleton";
import NotificationCard from "./NotificationCard";
import { useRealNotifications } from "@/hooks/useRealNotifications";

export default function NotificationsList() {
  const { notifications, isLoading } = useRealNotifications();

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-2 pt-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[300px]">
            <div className="flex gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No notifications available
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 pt-2">
      {notifications.slice(0, 3).map((notification) => (
        <NotificationCard 
          key={notification.id} 
          notification={{
            id: parseInt(notification.id.replace(/\D/g, '')) || Math.random(),
            title: notification.title,
            description: notification.description,
            days: Math.floor((Date.now() - notification.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
            sender: {
              name: "System",
              avatar: "/placeholder.svg"
            },
            image: "/placeholder.svg"
          }} 
        />
      ))}
    </div>
  );
}
