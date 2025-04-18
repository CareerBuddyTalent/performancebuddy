
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReviewTypeSelectorProps {
  activeTab: "individual" | "team";
  onTabChange: (value: "individual" | "team") => void;
}

export default function ReviewTypeSelector({ activeTab, onTabChange }: ReviewTypeSelectorProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as "individual" | "team")} className="mt-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="individual">Individual Review</TabsTrigger>
        <TabsTrigger value="team">Team Review</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
