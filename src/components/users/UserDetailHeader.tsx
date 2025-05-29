
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserDetailHeader() {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/users">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to User Management
        </Link>
      </Button>
    </div>
  );
}
