
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification, useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export default function NotificationPopover() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    removeNotification
  } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    
    return Math.floor(seconds) + "s ago";
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setOpen(false);
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const handleDismiss = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    removeNotification(id);
    toast({
      description: "Notification dismissed",
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1.5 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 px-1.5 py-0 text-xs font-medium text-white" 
              variant="destructive"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1 text-xs"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[70vh] md:max-h-[400px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "flex gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-muted/30"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 pt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className={cn(
                        "text-sm font-medium line-clamp-1",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </p>
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span className="sr-only">Mark as read</span>
                          </Button>
                        )}
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-6 w-6 opacity-40 hover:opacity-100"
                          onClick={(e) => handleDismiss(e, notification.id)}
                        >
                          <span className="sr-only">Dismiss</span>
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.4142 3.41421C13.8047 3.00369 13.8047 2.34052 13.4142 1.93C13.0237 1.51947 12.3605 1.51947 11.97 1.93L8 5.9L4.03 1.93C3.63947 1.51947 2.97631 1.51947 2.57579 1.93C2.17526 2.34052 2.17526 3.00369 2.57579 3.41421L6.54579 7.38421L2.57579 11.3542C2.17526 11.7648 2.17526 12.4279 2.57579 12.8384C2.97631 13.249 3.63947 13.249 4.03 12.8384L8 8.86842L11.97 12.8384C12.3605 13.249 13.0237 13.249 13.4142 12.8384C13.8047 12.4279 13.8047 11.7648 13.4142 11.3542L9.44421 7.38421L13.4142 3.41421Z" fill="currentColor"/>
                          </svg>
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {formatTimeAgo(notification.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}
