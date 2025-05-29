
import { User } from "@/types";
import DepartmentManagement from "@/components/DepartmentManagement";

interface DepartmentsTabProps {
  departments: string[];
  users: User[];
  onAddDepartment: (department: string) => void;
  onUpdateUser: (user: User) => void;
}

export default function DepartmentsTab({ departments, users, onAddDepartment, onUpdateUser }: DepartmentsTabProps) {
  return (
    <DepartmentManagement 
      departments={departments} 
      users={users}
      onAddDepartment={onAddDepartment}
      onUpdateUser={onUpdateUser}
    />
  );
}
