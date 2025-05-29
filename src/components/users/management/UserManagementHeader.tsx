
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CompanySelector from "@/components/CompanySelector";
import { Company } from "@/types";

interface UserManagementHeaderProps {
  isAdmin: boolean;
  userRole?: string;
  companies: Company[];
  selectedCompanyId: string;
  onCompanyChange: (companyId: string) => void;
  onAddUser: () => void;
}

export default function UserManagementHeader({
  isAdmin,
  userRole,
  companies,
  selectedCompanyId,
  onCompanyChange,
  onAddUser
}: UserManagementHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage users, departments, and view performance rankings
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {isAdmin && (
          <div className="w-full sm:w-64">
            <CompanySelector
              companies={companies}
              selectedCompanyId={selectedCompanyId}
              onCompanyChange={onCompanyChange}
            />
          </div>
        )}
        {(isAdmin || userRole === "manager") && (
          <Button onClick={onAddUser}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>
    </div>
  );
}
