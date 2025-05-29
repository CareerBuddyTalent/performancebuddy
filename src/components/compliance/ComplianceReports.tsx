
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Download, FileText, Shield, Calendar, AlertCircle } from "lucide-react";

export function ComplianceReports() {
  const complianceReports = [
    {
      id: "gdpr",
      name: "GDPR Compliance Report",
      description: "General Data Protection Regulation compliance status",
      status: "compliant",
      lastGenerated: "2024-01-15",
      coverage: 98,
      findings: 2
    },
    {
      id: "sox",
      name: "SOX Compliance Report",
      description: "Sarbanes-Oxley Act financial controls and procedures",
      status: "partial",
      lastGenerated: "2024-01-10",
      coverage: 85,
      findings: 5
    },
    {
      id: "iso27001",
      name: "ISO 27001 Security Report",
      description: "Information security management system compliance",
      status: "compliant",
      lastGenerated: "2024-01-12",
      coverage: 95,
      findings: 1
    },
    {
      id: "hipaa",
      name: "HIPAA Compliance Report",
      description: "Health Insurance Portability and Accountability Act",
      status: "non-compliant",
      lastGenerated: "2024-01-08",
      coverage: 72,
      findings: 8
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: { variant: "default" as const, text: "Compliant" },
      partial: { variant: "secondary" as const, text: "Partial" },
      "non-compliant": { variant: "destructive" as const, text: "Non-Compliant" }
    };
    
    const config = variants[status as keyof typeof variants] || variants.partial;
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const getProgressColor = (coverage: number) => {
    if (coverage >= 95) return "bg-green-500";
    if (coverage >= 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium">Active Frameworks</p>
            </div>
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs text-muted-foreground">Compliance frameworks monitored</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-medium">Reports Generated</p>
            </div>
            <p className="text-2xl font-bold">24</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <p className="text-sm font-medium">Open Findings</p>
            </div>
            <p className="text-2xl font-bold">16</p>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <p className="text-sm font-medium">Next Audit</p>
            </div>
            <p className="text-2xl font-bold">45</p>
            <p className="text-xs text-muted-foreground">Days remaining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {complianceReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
                {getStatusBadge(report.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm font-medium">Coverage</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Progress value={report.coverage} className="flex-1" />
                    <span className="text-sm font-medium">{report.coverage}%</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Last Generated</p>
                  <p className="text-sm text-muted-foreground mt-1">{report.lastGenerated}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium">Findings</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {report.findings} {report.findings === 1 ? 'issue' : 'issues'} found
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
                <Button variant="ghost" size="sm">
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
