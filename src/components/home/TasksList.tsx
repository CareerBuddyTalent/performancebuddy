
import TaskItem from "./TaskItem";
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

export default function TasksList({ tasks }: { tasks: TaskItemProps[] }) {
  return (
    <div className="space-y-px">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
