
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Check } from "lucide-react";
import { format } from "date-fns";
import { OneOnOneMeeting } from "@/types/templates";

// Mock data for 1:1 meetings
const mockMeetings: OneOnOneMeeting[] = [
  {
    id: "1",
    managerId: "manager1",
    employeeId: "employee1",
    date: new Date("2025-06-01T10:00:00"),
    duration: 30,
    status: "scheduled",
    actionItems: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    managerId: "manager1",
    employeeId: "employee2",
    date: new Date("2025-05-28T14:00:00"),
    duration: 45,
    status: "completed",
    notes: "Discussed quarterly goals and career development plan.",
    actionItems: [
      {
        id: "action1",
        description: "Complete online course on leadership",
        assignedTo: "employee2",
        dueDate: new Date("2025-06-15"),
        status: "in_progress",
        createdAt: new Date("2025-05-28")
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export default function OneOnOneCheckIns() {
  const [meetings, setMeetings] = useState<OneOnOneMeeting[]>(mockMeetings);

  const aiSuggestedTopics = [
    "Follow up on last week's action items",
    "Progress on Q2 goals - currently at 65%",
    "Recent feedback on project collaboration",
    "Upcoming skill development opportunities",
    "Work-life balance check-in"
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming 1:1 Meetings</CardTitle>
              <CardDescription>Your scheduled one-on-one check-ins</CardDescription>
            </CardHeader>
            <CardContent>
              {meetings.filter(m => m.status === "scheduled").length > 0 ? (
                <div className="space-y-4">
                  {meetings.filter(m => m.status === "scheduled").map((meeting) => (
                    <div key={meeting.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">1:1 with John Doe</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>{format(meeting.date, "PPP 'at' p")}</span>
                            <span className="mx-1">•</span>
                            <span>{meeting.duration} minutes</span>
                          </div>
                        </div>
                        <Badge variant="outline">Scheduled</Badge>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">AI-suggested agenda topics:</h4>
                        <ul className="space-y-1.5 text-sm">
                          {aiSuggestedTopics.map((topic, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-emerald-500 mr-1.5">•</span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-4 flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          <FileText className="h-3.5 w-3.5 mr-1.5" />
                          Prepare Notes
                        </Button>
                        <Button size="sm">
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                          Start Meeting
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No upcoming 1:1 meetings scheduled</p>
                  <Button variant="outline" className="mt-4" onClick={() => {}}>
                    Schedule New 1:1
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Previous 1:1 Meetings</CardTitle>
              <CardDescription>Review past meetings and action items</CardDescription>
            </CardHeader>
            <CardContent>
              {meetings.filter(m => m.status === "completed").length > 0 ? (
                <div className="space-y-4">
                  {meetings.filter(m => m.status === "completed").map((meeting) => (
                    <div key={meeting.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">1:1 with Emily Chen</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            <span>{format(meeting.date, "PPP")}</span>
                          </div>
                        </div>
                        <Badge>Completed</Badge>
                      </div>
                      
                      {meeting.notes && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Notes:</h4>
                          <p className="text-sm text-muted-foreground mt-1">{meeting.notes}</p>
                        </div>
                      )}
                      
                      {meeting.actionItems?.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Action Items:</h4>
                          <ul className="mt-1 space-y-1">
                            {meeting.actionItems.map(item => (
                              <li key={item.id} className="flex items-center text-sm">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                  item.status === "completed" ? "bg-green-500" : 
                                  item.status === "in_progress" ? "bg-amber-500" : "bg-slate-300"
                                }`} />
                                <span className="flex-1">{item.description}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.status === "completed" ? "Done" : 
                                   item.status === "in_progress" ? "In Progress" : "Pending"}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No previous 1:1 meetings found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
