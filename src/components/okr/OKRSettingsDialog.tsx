
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Check, MessageSquare, User } from "lucide-react";

interface OKRSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function OKRSettingsDialog({ open, onOpenChange }: OKRSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>OKR Settings</DialogTitle>
          <DialogDescription>
            Configure the OKR system settings for your organization
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="periods" className="space-y-4">
          <TabsList>
            <TabsTrigger value="periods">Time Periods</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="periods" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Active Periods
                    </CardTitle>
                    <CardDescription>
                      Configure current and upcoming OKR periods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                          <div>
                            <div className="font-medium">Q2 2025</div>
                            <div className="text-xs text-muted-foreground">Apr 1 - Jun 30, 2025</div>
                          </div>
                          <div className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-md">
                            Active
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-muted p-3 rounded-md">
                          <div>
                            <div className="font-medium">Q3 2025</div>
                            <div className="text-xs text-muted-foreground">Jul 1 - Sep 30, 2025</div>
                          </div>
                          <div className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">
                            Upcoming
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Add Period
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Period Settings</CardTitle>
                    <CardDescription>
                      Configure how OKR periods work
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="default-period" className="flex-1">Default Period Length</Label>
                        <select id="default-period" className="flex-1 rounded-md border border-input bg-background px-3 py-1">
                          <option value="quarter">Quarterly</option>
                          <option value="month">Monthly</option>
                          <option value="year">Yearly</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="auto-close">Auto-close completed periods</Label>
                          <Switch id="auto-close" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="auto-create">Auto-create upcoming periods</Label>
                          <Switch id="auto-create" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                          <Label htmlFor="allow-overlap">Allow overlapping periods</Label>
                          <Switch id="allow-overlap" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reminders</CardTitle>
                  <CardDescription>
                    Configure automated reminders for OKR updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Check-in Frequency</Label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-1">
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Reminder Day</Label>
                      <select className="w-full rounded-md border border-input bg-background px-3 py-1">
                        <option value="monday">Monday</option>
                        <option value="friday">Friday</option>
                      </select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="email-reminders">Email Reminders</Label>
                        <Switch id="email-reminders" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="slack-reminders">Slack Reminders</Label>
                        <Switch id="slack-reminders" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Role Permissions
                </CardTitle>
                <CardDescription>
                  Control what different roles can do in the OKR system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Employees</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emp-create-personal">Create personal objectives</Label>
                        <Switch id="emp-create-personal" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emp-view-team">View team objectives</Label>
                        <Switch id="emp-view-team" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emp-comment">Comment on team objectives</Label>
                        <Switch id="emp-comment" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Managers</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mgr-create-team">Create team objectives</Label>
                        <Switch id="mgr-create-team" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mgr-approve">Approve employee objectives</Label>
                        <Switch id="mgr-approve" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="mgr-edit-emp">Edit employee objectives</Label>
                        <Switch id="mgr-edit-emp" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Admins</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-company">Create company objectives</Label>
                        <Switch id="admin-company" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-periods">Manage OKR periods</Label>
                        <Switch id="admin-periods" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="admin-edit-all">Edit all objectives</Label>
                        <Switch id="admin-edit-all" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure when and how users receive OKR notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-md font-medium">Check-in Reminders</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-checkin">Regular check-in reminders</Label>
                      <Switch id="notify-checkin" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-risk">At-risk objective alerts</Label>
                      <Switch id="notify-risk" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-md font-medium">Manager Notifications</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-team-update">Team updates</Label>
                      <Switch id="notify-team-update" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-approval">Approval requests</Label>
                      <Switch id="notify-approval" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-md font-medium">Admin Notifications</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-period">Period start/end</Label>
                      <Switch id="notify-period" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-company">Company objective updates</Label>
                      <Switch id="notify-company" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>
                  Connect OKRs with other tools and systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">JIRA Integration</div>
                        <div className="text-sm text-muted-foreground">Connect objectives to JIRA tickets</div>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Slack Integration</div>
                        <div className="text-sm text-muted-foreground">Post OKR updates to Slack</div>
                      </div>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                        <Check className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">Google Sheets Export</div>
                        <div className="text-sm text-muted-foreground">Export OKR data to Google Sheets</div>
                      </div>
                    </div>
                    <Button variant="outline">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
