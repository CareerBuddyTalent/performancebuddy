
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ReactNode } from "react";

interface TaskAssignee {
  name: string;
  avatar?: string;
  initial?: string;
}

interface TaskItemProps {
  id: number;
  title: string;
  dueIn: string;
  type: string;
  assignee: TaskAssignee;
  action: string;
  icon: ReactNode;
}

export default function TaskItem({ task }: { task: TaskItemProps }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          {task.icon}
        </div>
        <div>
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-red-500">Due in {task.dueIn}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-gray-200 dark:bg-gray-700 text-xs font-normal">
          {task.type}
        </Badge>
        <div className="flex items-center gap-2">
          {task.assignee.initial ? (
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
              {task.assignee.initial}
            </div>
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
          <span className="text-sm">{task.assignee.name}</span>
        </div>
        <Button variant="secondary" size="sm" className="rounded-full">
          {task.action}
        </Button>
        <Button variant="ghost" size="sm" className="rounded-full px-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
