
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AccountSettingsForm from "@/components/settings/AccountSettingsForm";
import EmailSettingsForm from "@/components/settings/EmailSettingsForm";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Link to="/my-profile">
              <Avatar className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <AccountSettingsForm />
        <EmailSettingsForm />
      </div>
    </div>
  );
}
