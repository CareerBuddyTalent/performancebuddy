
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Download, Building2 } from "lucide-react";
import { User } from "@/types";
import UserList from "@/components/UserList";

interface AllUsersTabProps {
  users: User[];
  departments: string[];
  onUpdateUser: (user: User) => void;
}

export default function AllUsersTab({ users, departments, onUpdateUser }: AllUsersTabProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            Team Members
          </CardTitle>
          <CardDescription>
            Manage team members and their roles in the organization
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UserList 
          users={users} 
          onUpdateUser={onUpdateUser} 
          departments={departments}
        />
      </CardContent>
    </Card>
  );
}
