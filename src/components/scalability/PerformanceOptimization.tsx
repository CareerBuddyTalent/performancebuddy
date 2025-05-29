
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, Database, Server, Network, Cpu, MemoryStick, Activity } from "lucide-react";

export function PerformanceOptimization() {
  const [metrics, setMetrics] = useState({
    responseTime: 245,
    throughput: 1250,
    errorRate: 0.02,
    cpuUsage: 68,
    memoryUsage: 72,
    diskUsage: 45
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        responseTime: Math.max(100, prev.responseTime + (Math.random() - 0.5) * 50),
        throughput: Math.max(800, prev.throughput + (Math.random() - 0.5) * 200),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
        cpuUsage: Math.max(20, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 8)),
        diskUsage: Math.max(20, Math.min(80, prev.diskUsage + (Math.random() - 0.5) * 5))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const optimizations = [
    {
      category: "Database",
      items: [
        { name: "Query Optimization", status: "active", impact: "high", description: "Optimized slow-running queries" },
        { name: "Index Management", status: "active", impact: "medium", description: "Added missing database indexes" },
        { name: "Connection Pooling", status: "active", impact: "high", description: "Implemented connection pooling" }
      ]
    },
    {
      category: "Caching",
      items: [
        { name: "Redis Cache", status: "active", impact: "high", description: "In-memory caching for frequent queries" },
        { name: "CDN Integration", status: "active", impact: "medium", description: "Static asset caching" },
        { name: "Application Cache", status: "pending", impact: "medium", description: "Component-level caching" }
      ]
    },
    {
      category: "Load Balancing",
      items: [
        { name: "Auto Scaling", status: "active", impact: "high", description: "Dynamic resource allocation" },
        { name: "Geographic Distribution", status: "active", impact: "medium", description: "Multi-region deployment" },
        { name: "Health Checks", status: "active", impact: "low", description: "Automated health monitoring" }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      disabled: "outline"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline"
    } as const;
    
    return <Badge variant={variants[impact as keyof typeof variants] || "outline"}>{impact} impact</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-medium">Response Time</p>
            </div>
            <p className="text-2xl font-bold">{Math.round(metrics.responseTime)}ms</p>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Server className="h-4 w-4 text-green-500" />
              <p className="text-sm font-medium">Throughput</p>
            </div>
            <p className="text-2xl font-bold">{Math.round(metrics.throughput)}</p>
            <p className="text-xs text-muted-foreground">Requests per minute</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Network className="h-4 w-4 text-red-500" />
              <p className="text-sm font-medium">Error Rate</p>
            </div>
            <p className="text-2xl font-bold">{(metrics.errorRate * 100).toFixed(2)}%</p>
            <p className="text-xs text-muted-foreground">Error percentage</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Real-time system performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span>{Math.round(metrics.responseTime)}ms</span>
                  </div>
                  <Progress value={Math.min(100, (metrics.responseTime / 500) * 100)} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Throughput</span>
                    <span>{Math.round(metrics.throughput)} req/min</span>
                  </div>
                  <Progress value={(metrics.throughput / 2000) * 100} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span>{(metrics.errorRate * 100).toFixed(2)}%</span>
                  </div>
                  <Progress value={metrics.errorRate * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scaling Status</CardTitle>
                <CardDescription>Current scaling configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto Scaling</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Load Balancer</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CDN</span>
                    <Badge variant="default">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Caching</span>
                    <Badge variant="default">Optimized</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold">{Math.round(metrics.cpuUsage)}%</span>
                    <Badge variant={metrics.cpuUsage > 80 ? "destructive" : metrics.cpuUsage > 60 ? "secondary" : "default"}>
                      {metrics.cpuUsage > 80 ? "High" : metrics.cpuUsage > 60 ? "Medium" : "Normal"}
                    </Badge>
                  </div>
                  <Progress value={metrics.cpuUsage} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold">{Math.round(metrics.memoryUsage)}%</span>
                    <Badge variant={metrics.memoryUsage > 80 ? "destructive" : metrics.memoryUsage > 60 ? "secondary" : "default"}>
                      {metrics.memoryUsage > 80 ? "High" : metrics.memoryUsage > 60 ? "Medium" : "Normal"}
                    </Badge>
                  </div>
                  <Progress value={metrics.memoryUsage} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-2xl font-bold">{Math.round(metrics.diskUsage)}%</span>
                    <Badge variant={metrics.diskUsage > 80 ? "destructive" : metrics.diskUsage > 60 ? "secondary" : "default"}>
                      {metrics.diskUsage > 80 ? "High" : metrics.diskUsage > 60 ? "Medium" : "Normal"}
                    </Badge>
                  </div>
                  <Progress value={metrics.diskUsage} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimizations">
          <div className="space-y-6">
            {optimizations.map((category) => (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle>{category.category} Optimizations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-medium">{item.name}</h4>
                            {getStatusBadge(item.status)}
                            {getImpactBadge(item.impact)}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
