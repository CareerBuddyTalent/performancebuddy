
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function CompaniesTab() {
  return (
    <Button asChild variant="outline" className="mb-4">
      <a href="/companies">
        <Building2 className="mr-2 h-4 w-4" />
        Manage Companies
      </a>
    </Button>
  );
}
