
import { useState } from "react";
import { User } from "@/types";
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { UserTableRow } from "./users/list/UserTableRow";
import { UserEditDialog } from "./users/list/UserEditDialog";
import { SearchBox } from "./users/list/SearchBox";

interface UserListProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  departments: string[];
}

export default function UserList({ users, onUpdateUser, departments }: UserListProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.position && user.position.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setShowEditDialog(true);
  };
  
  const handleSaveEdit = (updatedUser: User) => {
    onUpdateUser(updatedUser);
    setShowEditDialog(false);
    setEditingUser(null);
  };
  
  const handleViewUserDetails = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="space-y-4">
      <SearchBox 
        value={searchQuery}
        onChange={setSearchQuery}
        usersCount={filteredUsers.length}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Position</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onEdit={handleEditUser}
                onViewDetails={handleViewUserDetails}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      <UserEditDialog
        user={editingUser}
        departments={departments}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSaveEdit}
        open={showEditDialog}
      />
    </div>
  );
}
