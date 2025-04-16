
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CareerPath } from "../../../types/career";

interface PathCardProps {
  path: CareerPath;
  onAddRole: (pathId: string) => void;
  onRemovePath: (pathId: string) => void;
}

export function PathCard({ path, onAddRole, onRemovePath }: PathCardProps) {
  return (
    <div className="w-full md:w-1/3 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{path.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAddRole(path.id)}>
              Add Role
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRemovePath(path.id)}>
              Remove Track
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative">
        <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${path.color}`}></div>
        
        {path.roles.length > 0 ? (
          path.roles.map((role) => (
            <div key={role.id} className="relative pl-10 pb-8">
              <div className={`absolute left-2.5 w-5 h-5 ${path.color} rounded-full`}></div>
              <h4 className="font-medium">{role.title}</h4>
              <p className="text-sm text-muted-foreground">
                {role.years_experience} years
              </p>
            </div>
          ))
        ) : (
          <div className="pl-10 pb-8 italic text-muted-foreground">
            No roles added yet
          </div>
        )}
      </div>
    </div>
  );
}
