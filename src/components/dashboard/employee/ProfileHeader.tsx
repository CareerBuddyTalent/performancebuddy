
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

interface ProfileHeaderProps {
  user: User;
  manager?: { name: string; id: string; } | undefined;
}

export default function ProfileHeader({ user, manager }: ProfileHeaderProps) {
  return (
    <div className="bg-[#111827] text-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <Avatar className="h-20 w-20 border-2 border-blue-400">
          <AvatarImage src={user.profilePicture} alt={user.name} />
          <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            <span className="text-gray-300">{user.position || "No position set"}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{user.department || "No department"}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">{manager?.name || "No manager"}</span>
          </div>
          
          <div className="hidden md:flex space-x-1">
            <Button size="sm" variant="outline" className="text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white">
              <MessageSquare className="mr-1 h-4 w-4" />
              Add feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
