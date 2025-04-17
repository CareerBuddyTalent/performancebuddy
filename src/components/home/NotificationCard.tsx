
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationSender {
  name: string;
  avatar: string;
}

interface NotificationProps {
  id: number;
  title: string;
  description: string;
  days: number;
  sender: NotificationSender;
  image: string;
}

export default function NotificationCard({ notification }: { notification: NotificationProps }) {
  return (
    <div className="min-w-[300px] max-w-md rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors p-4 relative border border-primary/10">
      <Button variant="ghost" size="icon" className="absolute right-2 top-2 h-7 w-7 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50">
        <X className="h-4 w-4" />
      </Button>
      <div className="flex gap-3 mb-3">
        <Avatar className="h-10 w-10 border-2 border-primary/10">
          <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
          <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{notification.sender.name}</div>
          <div className="text-xs text-gray-500">{notification.days} days ago</div>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{notification.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
        {notification.description}
      </p>
    </div>
  );
}
