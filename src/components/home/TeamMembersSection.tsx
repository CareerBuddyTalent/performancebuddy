
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

export default function TeamMembersSection({ members }: { members: TeamMember[] }) {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <span className="font-medium">In your team</span>
          <ChevronDown className="h-4 w-4" />
        </div>
        <Link to="/users" className="text-primary text-sm">See all</Link>
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center gap-1">
            <Avatar className="h-14 w-14 border-2 border-primary rounded-full">
              <AvatarImage src={member.avatar} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-center max-w-24 truncate">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
