
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Filter, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'failure' | 'warning';
  ipAddress: string;
  userAgent: string;
  details: string;
}

export function ComplianceAuditLog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock audit log data
  const auditLogs: AuditLogEntry[] = [
    {
      id: "1",
      timestamp: "2024-01-15 14:30:25",
      user: "john.doe@company.com",
      action: "LOGIN",
      resource: "Authentication",
      status: "success",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      details: "Successful login via SSO"
    },
    {
      id: "2",
      timestamp: "2024-01-15 14:25:12",
      user: "jane.smith@company.com",
      action: "DATA_EXPORT",
      resource: "Performance Reports",
      status: "success",
      ipAddress: "192.168.1.101",
      userAgent: "Mozilla/5.0 (macOS; Intel Mac OS X 10_15_7)",
      details: "Exported quarterly performance data"
    },
    {
      id: "3",
      timestamp: "2024-01-15 14:20:33",
      user: "unauthorized.user@external.com",
      action: "ACCESS_ATTEMPT",
      resource: "Admin Panel",
      status: "failure",
      ipAddress: "203.0.113.45",
      userAgent: "curl/7.68.0",
      details: "Unauthorized access attempt blocked"
    },
    {
      id: "4",
      timestamp: "2024-01-15 14:15:18",
      user: "admin@company.com",
      action: "PERMISSION_CHANGE",
      resource: "User Roles",
      status: "warning",
      ipAddress: "192.168.1.102",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      details: "Modified user permissions for sensitive data access"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default",
      failure: "destructive",
      warning: "secondary"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Compliance Audit Log
        </CardTitle>
        <CardDescription>
          Complete audit trail of all system activities for compliance monitoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search logs by user, action, or resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failure">Failure</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="font-medium">{log.action}</TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    {getStatusBadge(log.status)}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                <TableCell className="max-w-xs truncate" title={log.details}>
                  {log.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No audit logs found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
}
