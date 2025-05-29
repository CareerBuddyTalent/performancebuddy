
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, AlertTriangle, CheckCircle, Users, Lock, Activity } from "lucide-react";

export function SecurityDashboard() {
  const securityMetrics = [
    { label: "Active Sessions", value: 156, icon: Activity, status: "normal" },
    { label: "Failed Login Attempts", value: 12, icon: AlertTriangle, status: "warning" },
    { label: "SSO Enabled Users", value: 89, icon: CheckCircle, status: "good" },
    { label: "2FA Enabled", value: 67, icon: Shield, status: "normal" }
  ];

  const securityScore = 87;
  
  const recentAlerts = [
    { id: 1, type: "warning", message: "Multiple failed login attempts detected", time: "2 minutes ago" },
    { id: 2, type: "info", message: "New SSO provider configured", time: "1 hour ago" },
    { id: 3, type: "success", message: "Security policy updated successfully", time: "3 hours ago" },
    { id: 4, type: "warning", message: "Unusual access pattern detected", time: "5 hours ago" }
  ];

  const getAlertBadge = (type: string) => {
    const variants = {
      warning: "secondary",
      info: "outline",
      success: "default",
      error: "destructive"
    } as const;
    
    return <Badge variant={variants[type as keyof typeof variants] || "outline"}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <metric.icon className="h-4 w-4 text-blue-500" />
                <p className="text-sm font-medium">{metric.label}</p>
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <Badge variant={metric.status === 'good' ? 'default' : metric.status === 'warning' ? 'secondary' : 'outline'} className="mt-1">
                {metric.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Score
            </CardTitle>
            <CardDescription>
              Overall security posture assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Progress value={securityScore} className="flex-1" />
              <span className="text-2xl font-bold">{securityScore}%</span>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Authentication Security</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="flex justify-between">
                <span>Data Protection</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between">
                <span>Access Controls</span>
                <span className="font-medium">88%</span>
              </div>
              <div className="flex justify-between">
                <span>Compliance</span>
                <span className="font-medium">73%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Alerts
            </CardTitle>
            <CardDescription>
              Recent security events and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getAlertBadge(alert.type)}
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Sessions</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span>Idle Sessions</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span>Expired Sessions</span>
                <span className="font-medium">8</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Access Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Peak Hours</span>
                <span className="font-medium">9AM - 5PM</span>
              </div>
              <div className="flex justify-between">
                <span>Geographic Spread</span>
                <span className="font-medium">12 countries</span>
              </div>
              <div className="flex justify-between">
                <span>Mobile Access</span>
                <span className="font-medium">34%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>GDPR</span>
                <Badge variant="default">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>SOX</span>
                <Badge variant="secondary">Partial</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>ISO 27001</span>
                <Badge variant="default">Compliant</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
