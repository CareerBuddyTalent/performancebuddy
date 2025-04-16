
import { useState } from "react";
import { format } from "date-fns";
import { Goal, Milestone } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Link as LinkIcon } from "lucide-react";

interface GoalDetailsProps {
  goal: Goal;
}

export default function GoalDetails({ goal }: GoalDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const statusIcons = {
    not_started: <AlertCircle className="h-4 w-4 text-slate-500" />,
    in_progress: <Clock className="h-4 w-4 text-amber-500" />,
    completed: <CheckCircle2 className="h-4 w-4 text-green-500" />
  };

  const statusColors = {
    not_started: "bg-slate-100 text-slate-700",
    in_progress: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700"
  };

  const levelColors = {
    individual: "bg-sky-100 text-sky-700",
    team: "bg-indigo-100 text-indigo-700",
    department: "bg-purple-100 text-purple-700",
    company: "bg-rose-100 text-rose-700"
  };

  const integrationIcons = {
    salesforce: "✓",
    jira: "J",
    notion: "N"
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle>{goal.title}</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className={levelColors[goal.level]}>
              {goal.level.charAt(0).toUpperCase() + goal.level.slice(1)}
            </Badge>
            <Badge className={statusColors[goal.status]}>
              <div className="flex items-center gap-1">
                {statusIcons[goal.status]}
                <span>{goal.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="milestones"
              className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary"
            >
              Milestones
            </TabsTrigger>
            <TabsTrigger
              value="metrics"
              className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary"
            >
              Metrics
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary"
            >
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p>{goal.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
                  <span className="text-sm font-medium">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
                  <p>{format(goal.dueDate, 'MMM d, yyyy')}</p>
                </div>
                {goal.alignedWith && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Aligned With</h3>
                    <p>{goal.alignedWith}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="milestones" className="p-6">
            {goal.milestones && goal.milestones.length > 0 ? (
              <div className="space-y-4">
                {goal.milestones.map((milestone: Milestone) => (
                  <div key={milestone.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          {statusIcons[milestone.status]}
                          {milestone.title}
                        </h4>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        )}
                      </div>
                      <Badge variant="outline">
                        {format(milestone.dueDate, 'MMM d, yyyy')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                No milestones have been defined for this goal
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="metrics" className="p-6">
            {goal.metrics && goal.metrics.length > 0 ? (
              <div className="space-y-6">
                {goal.metrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">{metric.name}</h3>
                      <span className="text-sm font-medium">
                        {metric.current} / {metric.target} {metric.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(metric.current / metric.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                No metrics have been defined for this goal
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="integrations" className="p-6">
            {goal.integrations && goal.integrations.length > 0 ? (
              <div className="space-y-4">
                {goal.integrations.map((integration, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full text-primary font-medium">
                      {integrationIcons[integration.type]}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium capitalize">{integration.type}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" />
                        ID: {integration.entityId}
                      </div>
                    </div>
                    {integration.lastSynced && (
                      <div className="text-xs text-muted-foreground">
                        Last synced: {format(integration.lastSynced, 'MMM d, HH:mm')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-muted-foreground">
                No integrations have been configured for this goal
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
