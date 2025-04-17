
import TaskItem from "./TaskItem";

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
  iconType: string;
}

export default function TasksList({ tasks }: { tasks: TaskItemProps[] }) {
  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No tasks available</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 rounded-lg overflow-hidden">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
