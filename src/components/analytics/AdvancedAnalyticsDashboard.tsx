
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PredictiveInsights } from "./PredictiveInsights";
import { EngagementPulse } from "./EngagementPulse";
import { CustomReportBuilder } from "./CustomReportBuilder";
import { EnhancedDataVisualization } from "./EnhancedDataVisualization";

export function AdvancedAnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Advanced Analytics</h2>
        <p className="text-muted-foreground">
          AI-powered insights, predictive analytics, and custom reporting
        </p>
      </div>
      
      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          <TabsTrigger value="visualization">Data Visualization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insights">
          <PredictiveInsights />
        </TabsContent>
        
        <TabsContent value="engagement">
          <EngagementPulse />
        </TabsContent>
        
        <TabsContent value="reports">
          <CustomReportBuilder />
        </TabsContent>
        
        <TabsContent value="visualization">
          <EnhancedDataVisualization />
        </TabsContent>
      </Tabs>
    </div>
  );
}
