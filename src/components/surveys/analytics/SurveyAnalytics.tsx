
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ResponseRatesChart from "./ResponseRatesChart";
import SentimentAnalysis from "./SentimentAnalysis";
import ResponseTrendsChart from "./ResponseTrendsChart";

interface SurveyAnalyticsProps {
  open: boolean;
  onClose: () => void;
}

export default function SurveyAnalytics({ open, onClose }: SurveyAnalyticsProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Survey Analytics</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Response Trends</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <ResponseRatesChart />
          </TabsContent>
          
          <TabsContent value="trends" className="space-y-4">
            <ResponseTrendsChart />
          </TabsContent>
          
          <TabsContent value="sentiment" className="space-y-4">
            <SentimentAnalysis />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
