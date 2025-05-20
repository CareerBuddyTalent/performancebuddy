
import { User } from "@/types";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

interface EmployeeSelectorProps {
  type: "individual" | "team";
  employees: User[];
  selectedEmployees: User[];
  onSelectionChange: (selected: User[]) => void;
}

export default function EmployeeSelector({ 
  type, 
  employees, 
  selectedEmployees, 
  onSelectionChange 
}: EmployeeSelectorProps) {
  
  // Reset selection when type changes
  useEffect(() => {
    // Clear selection when switching between individual and team
    onSelectionChange([]);
  }, [type, onSelectionChange]);
  
  if (type === "individual") {
    return (
      <div className="grid gap-2">
        <Label>Employee</Label>
        <Select
          value={selectedEmployees[0]?.id || ""}
          onValueChange={(value) => {
            const selectedUser = employees.find(user => user.id === value);
            onSelectionChange(selectedUser ? [selectedUser] : []);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an employee" />
          </SelectTrigger>
          <SelectContent>
            {employees && employees.length > 0 ? (
              employees.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} - {user.position || user.department || "No position"}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-employees" disabled>No employees available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <Label>Select Team Members</Label>
      <div className="border rounded-md p-4 space-y-2 max-h-[200px] overflow-y-auto">
        {employees && employees.length > 0 ? (
          employees.map(user => (
            <div key={user.id} className="flex items-center space-x-2">
              <Checkbox
                id={user.id}
                checked={selectedEmployees.some(emp => emp.id === user.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onSelectionChange([...selectedEmployees, user]);
                  } else {
                    onSelectionChange(selectedEmployees.filter(emp => emp.id !== user.id));
                  }
                }}
              />
              <label
                htmlFor={user.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {user.name} - {user.position || user.department || "No position"}
              </label>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground py-2">No team members available</div>
        )}
      </div>
    </div>
  );
}
