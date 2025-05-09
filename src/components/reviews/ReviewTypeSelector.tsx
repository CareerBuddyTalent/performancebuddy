
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReviewTypeSelectorProps {
  activeTab: "individual" | "team";
  onTabChange: (value: "individual" | "team") => void;
}

export default function ReviewTypeSelector({ activeTab, onTabChange }: ReviewTypeSelectorProps) {
  return (
    <div className="grid gap-2">
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => onTabChange(value as "individual" | "team")} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Individual Review</TabsTrigger>
          <TabsTrigger value="team">Team Review</TabsTrigger>
        </TabsList>
        <TabsContent value="individual" />
        <TabsContent value="team" />
      </Tabs>
    </div>
  );
}
