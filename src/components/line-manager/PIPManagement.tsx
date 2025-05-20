
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/line-manager/ProgressBar";
import { Bell, CalendarDays, AlertCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { PerformanceImprovementPlan } from "@/types/templates";

// Mock data for PIPs
const mockPIPs: PerformanceImprovementPlan[] = [
  {
    id: "1",
    employeeId: "employee1",
    managerId: "manager1",
    status: "active",
    startDate: new Date("2025-05-01"),
    endDate: new Date("2025-07-01"),
    objectives: [
      {
        id: "obj1",
        description: "Improve customer response time to under 4 hours",
        successCriteria: "Average response time under 4 hours for two consecutive weeks",
        status: "in_progress",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "obj2",
        description: "Complete technical certification",
        successCriteria: "Pass certification exam with at least 80% score",
        status: "not_started",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    meetings: [
      {
        id: "meet1",
        date: new Date("2025-05-15"),
        notes: "Initial discussion of goals and expectations",
        attendees: ["manager1", "employee1", "hr1"],
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-01")
  }
];

// Mock probation data
const mockProbations = [
  {
    id: "prob1",
    employeeId: "employee3",
    name: "Michael Brown",
    avatar: "https://ui-avatars.com/api/?name=Michael+Brown",
    startDate: new Date("2025-03-15"),
    endDate: new Date("2025-06-15"),
    status: "active",
    progress: 65,
    reviewDate: new Date("2025-06-01")
  }
];

export default function PIPManagement() {
  const [pips, setPIPs] = useState<PerformanceImprovementPlan[]>(mockPIPs);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Active Probation Periods</CardTitle>
          <CardDescription>Track employees on probation periods</CardDescription>
        </CardHeader>
        <CardContent>
          {mockProbations.length > 0 ? (
            <div className="space-y-4">
              {mockProbations.map(probation => (
                <div key={probation.id} className="border rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={probation.avatar} />
                        <AvatarFallback>{probation.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h3 className="font-medium">{probation.name}</h3>
                        <div className="text-sm text-muted-foreground">
                          {format(probation.startDate, "MMM d, yyyy")} - {format(probation.endDate, "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    <Badge className={
                      probation.status === "active" ? "bg-blue-100 text-blue-800" : 
                      "bg-green-100 text-green-800"
                    }>
                      {probation.status}
                    </Badge>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span>Probation progress</span>
                      <span className="font-medium">{probation.progress}%</span>
                    </div>
                    <ProgressBar value={probation.progress} className="h-2" />
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-amber-600">
                      <Bell className="h-4 w-4 mr-1.5" />
                      <span>Final review due on {format(probation.reviewDate, "MMM d, yyyy")}</span>
                    </div>
                    <Button variant="outline" size="sm">Schedule Review</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No active probation periods</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Performance Improvement Plans</CardTitle>
          <CardDescription>Track active and past PIPs</CardDescription>
        </CardHeader>
        <CardContent>
          {pips.length > 0 ? (
            <div className="space-y-6">
              {pips.map(pip => {
                // Calculate progress percentage
                const totalDays = differenceInDays(pip.endDate, pip.startDate);
                const daysPassed = differenceInDays(new Date(), pip.startDate);
                const progressPercentage = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
                
                // Calculate objective completion
                const totalObjectives = pip.objectives.length;
                const completedObjectives = pip.objectives.filter(o => o.status === "completed").length;
                const objectivePercentage = totalObjectives ? (completedObjectives / totalObjectives) * 100 : 0;
                
                return (
                  <div key={pip.id} className="border rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="https://ui-avatars.com/api/?name=John+Doe" />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <div className="ml-3">
                            <h3 className="font-medium">John Doe</h3>
                            <div className="text-sm text-muted-foreground">
                              {format(pip.startDate, "MMM d, yyyy")} - {format(pip.endDate, "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                        <Badge className={
                          pip.status === "active" ? "bg-amber-100 text-amber-800" : 
                          pip.status === "completed" ? "bg-green-100 text-green-800" : 
                          "bg-red-100 text-red-800"
                        }>
                          {pip.status.charAt(0).toUpperCase() + pip.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="flex justify-between items-center mb-1 text-sm">
                            <span>Timeline progress</span>
                            <span className="font-medium">{Math.round(progressPercentage)}%</span>
                          </div>
                          <ProgressBar value={progressPercentage} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1 text-sm">
                            <span>Objectives completed</span>
                            <span className="font-medium">{completedObjectives}/{totalObjectives}</span>
                          </div>
                          <ProgressBar value={objectivePercentage} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="mt-5">
                        <h4 className="text-sm font-medium mb-2">Objectives</h4>
                        <div className="space-y-2">
                          {pip.objectives.map(objective => (
                            <div key={objective.id} className="bg-slate-50 p-3 rounded-md text-sm">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  objective.status === "completed" ? "bg-green-500" : 
                                  objective.status === "in_progress" ? "bg-blue-500" : 
                                  objective.status === "failed" ? "bg-red-500" : 
                                  "bg-slate-300"
                                }`} />
                                <div className="font-medium flex-1">{objective.description}</div>
                                <Badge variant="outline" className="text-xs">
                                  {objective.status === "completed" ? "Completed" : 
                                   objective.status === "in_progress" ? "In Progress" : 
                                   objective.status === "failed" ? "Failed" : 
                                   "Not Started"}
                                </Badge>
                              </div>
                              <p className="mt-1 text-muted-foreground pl-4">
                                Success criteria: {objective.successCriteria}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mt-5">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Recent Check-ins</h4>
                          <Button variant="outline" size="sm">
                            <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                            Schedule Check-in
                          </Button>
                        </div>
                        {pip.meetings.length > 0 ? (
                          <div className="space-y-2">
                            {pip.meetings.map(meeting => (
                              <div key={meeting.id} className="border p-2 rounded-md text-sm">
                                <div className="flex justify-between items-center">
                                  <div className="font-medium">{format(meeting.date, "MMM d, yyyy")}</div>
                                  <Badge variant={meeting.status === "completed" ? "default" : "outline"}>
                                    {meeting.status}
                                  </Badge>
                                </div>
                                {meeting.notes && (
                                  <p className="mt-1 text-muted-foreground">{meeting.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No check-in meetings recorded yet</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-4 mt-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                        <span className="text-sm">
                          {Math.max(0, differenceInDays(pip.endDate, new Date()))} days remaining until final assessment
                        </span>
                      </div>
                      <Button>View Details</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No active performance improvement plans</p>
              <Button className="mt-4">Create PIP</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
