
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, AlertCircle, Eye } from "lucide-react";
import { format } from "date-fns";
import { PeerReviewRequest } from "@/types/templates";

// Mock data for peer reviews
const mockPeerReviews: PeerReviewRequest[] = [
  {
    id: "1",
    initiatorId: "manager1",
    revieweeId: "employee1",
    reviewerId: "employee2",
    templateId: "template1",
    status: "pending",
    isAnonymous: true,
    dueDate: new Date("2025-06-07"),
    createdAt: new Date("2025-05-17"),
    updatedAt: new Date("2025-05-17")
  },
  {
    id: "2",
    initiatorId: "manager1",
    revieweeId: "employee2",
    reviewerId: "employee3",
    templateId: "template1",
    status: "completed",
    isAnonymous: true,
    dueDate: new Date("2025-05-15"),
    createdAt: new Date("2025-05-01"),
    updatedAt: new Date("2025-05-14")
  }
];

export default function PeerReviews() {
  const [peerReviews, setPeerReviews] = useState<PeerReviewRequest[]>(mockPeerReviews);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Peer Review Requests</CardTitle>
            <CardDescription>Track the status of peer feedback requests</CardDescription>
          </CardHeader>
          <CardContent>
            {peerReviews.length > 0 ? (
              <div className="space-y-4">
                {peerReviews.map(review => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=John+Doe`} />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <div className="font-medium">
                                {review.revieweeId === "employee1" ? "John Doe" : "Emily Chen"}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {review.isAnonymous ? (
                                  <div className="flex items-center">
                                    Anonymous review by team member
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    Review by Sarah Johnson
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge className={
                            review.status === "completed" ? "bg-green-100 text-green-800" :
                            review.status === "in_progress" ? "bg-blue-100 text-blue-800" :
                            "bg-amber-100 text-amber-800"
                          }>
                            {review.status === "completed" ? "Completed" :
                             review.status === "in_progress" ? "In Progress" :
                             review.status === "declined" ? "Declined" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 sm:justify-end">
                        <div className="text-sm text-muted-foreground">
                          Due: {format(review.dueDate, "MMM d, yyyy")}
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          {review.status === "completed" ? "View Response" : "View Request"}
                        </Button>
                      </div>
                    </div>
                    
                    {review.status !== "completed" && new Date() > review.dueDate && (
                      <div className="mt-3 flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span>Overdue</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <UserCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No peer reviews initiated yet</p>
                <Button className="mt-4">Create Peer Review</Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Peer Review Analysis</CardTitle>
            <CardDescription>Summary of completed peer reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {peerReviews.some(r => r.status === "completed") ? (
              <div>
                <p className="text-sm text-muted-foreground mb-6">
                  Key insights from completed peer reviews across your team
                </p>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-medium text-sm">Top Strengths</h3>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Communication (87%)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Collaboration (82%)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        Technical skills (78%)
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-medium text-sm">Growth Areas</h3>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Time management (65%)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Strategic thinking (62%)
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                        Delegation (58%)
                      </li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-medium text-sm">Review Metrics</h3>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Completion rate:</span>
                        <span className="font-medium">83%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Avg. response time:</span>
                        <span className="font-medium">4.2 days</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Written comments:</span>
                        <span className="font-medium">92%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No completed peer reviews to analyze yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
