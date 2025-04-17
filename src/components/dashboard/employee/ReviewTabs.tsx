
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewCycleCards from "./ReviewCycleCards";
import PreviousReviewCard from "./PreviousReviewCard";
import AnalyticsPlaceholder from "./AnalyticsPlaceholder";

interface ReviewTabsProps {
  onRequestReview: () => void;
}

export default function ReviewTabs({ onRequestReview }: ReviewTabsProps) {
  const [activeTab, setActiveTab] = useState("yourReviews");

  return (
    <Tabs 
      defaultValue="yourReviews" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="w-full justify-start border-b rounded-none px-0 h-auto mb-6">
        <TabsTrigger 
          value="yourReviews" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-2 px-4"
        >
          Your review cycles
        </TabsTrigger>
        <TabsTrigger 
          value="analytics" 
          className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent py-2 px-4"
        >
          Analytics
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="yourReviews" className="mt-0">
        <div className="flex justify-end mb-4">
          <Button onClick={onRequestReview}>
            Request review
          </Button>
        </div>
        
        <ReviewCycleCards />
        <PreviousReviewCard />
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-0">
        <AnalyticsPlaceholder />
      </TabsContent>
    </Tabs>
  );
}
