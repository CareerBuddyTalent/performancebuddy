
import { User } from "@/types";
import { useClerkAuth } from "@/context/ClerkAuthContext";

interface HomeHeaderProps {
  user: User;
}

export default function HomeHeader({ user }: HomeHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Here's what's happening in your workspace today</p>
      </div>
    </div>
  );
}
