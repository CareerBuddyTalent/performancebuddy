
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import MyObjectives from "@/components/okr/MyObjectives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PersonalOKRs() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // In a real application, fetch organization OKRs from your backend
  const organizationObjectives = [
    {
      id: "org1",
      title: "Increase User Engagement",
      progress: 72,
      keyResults: [
        { title: "Increase DAU by 20%", progress: 85 },
        { title: "Reduce churn by 5%", progress: 60 }
      ]
    },
    {
      id: "org2",
      title: "Expand Market Reach",
      progress: 45,
      keyResults: [
        { title: "Enter 3 new markets", progress: 33 },
        { title: "Increase international users by 30%", progress: 57 }
      ]
    }
  ];
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Personal OKRs</h1>
          <p className="text-muted-foreground">
            Track your personal objectives and key results
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Objective
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>OKR Overview</CardTitle>
          <CardDescription>
            Your objective alignment and progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">85%</div>
              <div className="text-sm text-muted-foreground">OKR Completion</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
              <div className="text-sm text-muted-foreground">Active Objectives</div>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">12</div>
              <div className="text-sm text-muted-foreground">Key Results</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="mt-6">
          <MyObjectives userId={user.id} />
        </TabsContent>
        
        <TabsContent value="organization" className="mt-6">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Organization Objectives</h2>
            <p className="text-sm text-muted-foreground">Align your objectives with the company goals</p>
            
            <div className="grid gap-6">
              {organizationObjectives.map(obj => (
                <Card key={obj.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>{obj.title}</CardTitle>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                        {obj.progress}% complete
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {obj.keyResults.map((kr, index) => (
                        <li key={index} className="flex justify-between items-center">
                          <span>{kr.title}</span>
                          <Badge variant="outline">{kr.progress}%</Badge>
                        </li>
                      ))}
                    </ul>
                    
                    <Button variant="outline" className="mt-4 w-full" asChild>
                      <Link to={`/align-objective/${obj.id}`} className="flex items-center justify-center gap-2">
                        Align My Objective
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
