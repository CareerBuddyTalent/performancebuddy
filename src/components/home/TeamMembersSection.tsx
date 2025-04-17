
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { ChevronDown, Users } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface TeamMember {
  id: number;
  name: string;
  avatar: string;
}

export default function TeamMembersSection({ members }: { members: TeamMember[] }) {
  return (
    <Card className="border-t-4 border-t-primary overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <Users className="h-4 w-4 text-primary" />
            <span>Team Members</span>
          </div>
          <Link to="/users" className="text-primary text-sm hover:underline">See all</Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex flex-wrap gap-4 justify-center">
          {members.map((member) => (
            <Link key={member.id} to={`/users/${member.id}`} className="group">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="h-16 w-16 border-2 border-primary/20 group-hover:border-primary transition-colors">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-center max-w-24 truncate group-hover:text-primary">
                  {member.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
