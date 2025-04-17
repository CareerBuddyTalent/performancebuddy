
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";

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
    <div className="min-w-[400px] max-w-md rounded-lg bg-primary/10 p-4 relative">
      <button className="absolute right-2 top-2 rounded-full p-1 hover:bg-gray-200/20">
        <X className="h-4 w-4" />
      </button>
      <div className="flex gap-3 mb-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={notification.sender.avatar} alt={notification.sender.name} />
          <AvatarFallback>{notification.sender.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="font-medium">{notification.sender.name}</div>
      </div>
      <h3 className="text-lg font-semibold mb-1">{notification.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        {notification.description}
      </p>
      <div className="text-xs text-gray-500">{notification.days} days ago</div>
    </div>
  );
}
