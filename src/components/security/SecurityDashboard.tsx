
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Shield, Users, Activity } from 'lucide-react';

interface SecurityMetric {
  id: string;
  action: string;
  user_id: string;
  created_at: string;
  new_values: any;
}

export function SecurityDashboard() {
  const { user } = useSupabaseAuth();
  const [auditLogs, setAuditLogs] = useState<SecurityMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLogins: 0,
    failedLogins: 0,
    activeUsers: 0,
    suspiciousActivity: 0,
  });

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchSecurityData = async () => {
      try {
        // Fetch recent audit logs
        const { data: logs, error: logsError } = await supabase
          .from('audit_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (logsError) throw logsError;
        setAuditLogs(logs || []);

        // Calculate security stats
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        const loginLogs = logs?.filter(log => 
          log.action === 'login' && log.created_at > last24Hours
        ) || [];
        
        const failedLogins = loginLogs.filter(log => 
          !log.new_values?.success
        ).length;

        setStats({
          totalLogins: loginLogs.length,
          failedLogins,
          activeUsers: new Set(loginLogs.map(log => log.user_id)).size,
          suspiciousActivity: failedLogins > 10 ? 1 : 0,
        });
      } catch (error) {
        console.error('Failed to fetch security data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSecurityData();
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>Access denied. Admin privileges required.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div>Loading security dashboard...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logins (24h)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLogins}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Logins</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedLogins}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspiciousActivity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Audit log of authentication and security-related activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={log.new_values?.success ? "default" : "destructive"}>
                    {log.action}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    User: {log.user_id === 'anonymous' ? 'Anonymous' : log.user_id.slice(0, 8)}...
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
