
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Objective } from "@/services/objectiveService";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface OKRProgressDashboardProps {
  objectives: Objective[];
  timeframe?: string;
}

export default function OKRProgressDashboard({ objectives, timeframe = "quarter" }: OKRProgressDashboardProps) {
  const [view, setView] = useState<"progress" | "status" | "radar" | "alignment">("progress");
  
  // Calculate progress over time (simulated data)
  const generateProgressData = () => {
    const now = new Date();
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i * 7); // Weekly data points
      dates.push(date);
    }
    
    // Group by level
    const levels = ["company", "department", "team", "individual"];
    
    return dates.map((date, index) => {
      const result: any = {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      };
      
      levels.forEach(level => {
        // Simulate progress growth with some randomness
        const baseProgress = Math.min(100, 10 + index * 12); // Base progress increases over time
        const randomFactor = (Math.random() * 10 - 5); // Random variance of ±5%
        result[level] = Math.min(100, Math.max(0, baseProgress + randomFactor));
      });
      
      return result;
    });
  };
  
  // Status distribution
  const getStatusDistribution = () => {
    const statusMap: { [key: string]: number } = {};
    
    objectives.forEach(obj => {
      const status = obj.status || "not_started";
      statusMap[status] = (statusMap[status] || 0) + 1;
    });
    
    return Object.entries(statusMap).map(([status, count]) => ({
      status: status.replace(/_/g, ' '),
      count,
    }));
  };
  
  // Level distribution
  const getLevelDistribution = () => {
    const levelMap: { [key: string]: number } = {};
    
    objectives.forEach(obj => {
      const level = obj.level;
      levelMap[level] = (levelMap[level] || 0) + 1;
    });
    
    return Object.entries(levelMap).map(([level, count]) => ({
      level,
      count,
    }));
  };
  
  // Progress by level
  const getProgressByLevel = () => {
    const levelMap: { [key: string]: { total: number, count: number } } = {};
    
    objectives.forEach(obj => {
      const level = obj.level;
      if (!levelMap[level]) levelMap[level] = { total: 0, count: 0 };
      levelMap[level].total += obj.progress;
      levelMap[level].count += 1;
    });
    
    return Object.entries(levelMap).map(([level, { total, count }]) => ({
      level,
      progress: count > 0 ? Math.round(total / count) : 0,
    }));
  };
  
  // Radar chart data
  const getRadarData = () => {
    // Define main categories for the radar chart
    const categories = ["Innovation", "Growth", "Quality", "Efficiency", "Customer"];
    
    // Map objectives to these categories based on title keyword matches (simplified)
    const categoryScores: { [key: string]: number[] } = {};
    
    categories.forEach(category => {
      categoryScores[category] = [];
    });
    
    objectives.forEach(obj => {
      const title = obj.title.toLowerCase();
      const description = (obj.description || "").toLowerCase();
      
      if (title.includes("innovat") || description.includes("innovat")) {
        categoryScores["Innovation"].push(obj.progress);
      }
      if (title.includes("grow") || description.includes("grow")) {
        categoryScores["Growth"].push(obj.progress);
      }
      if (title.includes("quality") || description.includes("quality")) {
        categoryScores["Quality"].push(obj.progress);
      }
      if (title.includes("efficien") || description.includes("efficien")) {
        categoryScores["Efficiency"].push(obj.progress);
      }
      if (title.includes("customer") || description.includes("customer")) {
        categoryScores["Customer"].push(obj.progress);
      }
    });
    
    // Calculate average scores
    return categories.map(category => ({
      category,
      score: categoryScores[category].length > 0 
        ? Math.round(categoryScores[category].reduce((a, b) => a + b, 0) / categoryScores[category].length)
        : 0
    }));
  };
  
  // Alignment impact data
  const getAlignmentData = () => {
    // For each objective with children, calculate the impact
    const alignmentMap = new Map<string, { objective: Objective, childCount: number, avgProgress: number }>();
    
    // Build parent-child relationships
    objectives.forEach(obj => {
      if (obj.parent_id) {
        if (!alignmentMap.has(obj.parent_id)) {
          const parent = objectives.find(o => o.id === obj.parent_id);
          if (parent) {
            alignmentMap.set(obj.parent_id, { 
              objective: parent,
              childCount: 1,
              avgProgress: obj.progress
            });
          }
        } else {
          const data = alignmentMap.get(obj.parent_id);
          if (data) {
            data.childCount += 1;
            data.avgProgress = (data.avgProgress * (data.childCount - 1) + obj.progress) / data.childCount;
          }
        }
      }
    });
    
    return Array.from(alignmentMap.values())
      .filter(item => item.childCount >= 1) // Only include items with at least 1 child
      .sort((a, b) => b.childCount - a.childCount)
      .slice(0, 5); // Top 5
  };
  
  // Prepare data
  const progressData = generateProgressData();
  const statusData = getStatusDistribution();
  const levelData = getLevelDistribution();
  const levelProgressData = getProgressByLevel();
  const radarData = getRadarData();
  const alignmentData = getAlignmentData();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  const LEVEL_COLORS = {
    company: '#0088FE',
    department: '#00C49F',
    team: '#FFBB28',
    individual: '#FF8042'
  };
  
  const STATUS_COLORS = {
    not_started: '#e0e0e0',
    in_progress: '#FFBB28',
    behind_schedule: '#FF8042',
    on_track: '#00C49F',
    ahead: '#0088FE',
    completed: '#8884d8',
    canceled: '#cccccc'
  };

  return (
    <div className="space-y-6">
      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="progress">Progress Trends</TabsTrigger>
          <TabsTrigger value="status">Status Overview</TabsTrigger>
          <TabsTrigger value="radar">Focus Areas</TabsTrigger>
          <TabsTrigger value="alignment">Alignment Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progress Trends</CardTitle>
              <CardDescription>Track objective completion over time by level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="company" 
                      name="Company" 
                      stroke={LEVEL_COLORS.company} 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="department" 
                      name="Department" 
                      stroke={LEVEL_COLORS.department} 
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="team" 
                      name="Team" 
                      stroke={LEVEL_COLORS.team} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="individual" 
                      name="Individual" 
                      stroke={LEVEL_COLORS.individual} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Level Distribution</CardTitle>
                <CardDescription>Objectives by organizational level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={levelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="level"
                        label={({ level, percent }) => `${level} ${(percent * 100).toFixed(0)}%`}
                      >
                        {levelData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={LEVEL_COLORS[entry.level as keyof typeof LEVEL_COLORS] || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Average Progress by Level</CardTitle>
                <CardDescription>Completion rates across organizational levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={levelProgressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis unit="%" />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Bar dataKey="progress" name="Average Progress">
                        {levelProgressData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={LEVEL_COLORS[entry.level as keyof typeof LEVEL_COLORS] || COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>Overview of objective completion status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Objectives" fill="#8884d8">
                      {statusData.map((entry, index) => {
                        const status = entry.status.replace(/ /g, '_') as keyof typeof STATUS_COLORS;
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={STATUS_COLORS[status] || COLORS[index % COLORS.length]} 
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {statusData.map((status, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Badge 
                        variant={
                          status.status === 'completed' ? 'default' :
                          status.status === 'on track' ? 'outline' :
                          status.status === 'behind schedule' ? 'destructive' :
                          'secondary'
                        }
                      >
                        {status.status}
                      </Badge>
                    </div>
                    <div className="text-xl font-bold">{status.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="radar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Strategic Focus Areas</CardTitle>
              <CardDescription>Progress in key business areas based on objective categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Progress"
                      dataKey="score"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4 mt-6">
                <h4 className="text-sm font-medium">Focus Area Progress</h4>
                {radarData.map((area, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{area.category}</span>
                      <span className="text-sm font-medium">{area.score}%</span>
                    </div>
                    <Progress value={area.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alignment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alignment Impact</CardTitle>
              <CardDescription>Objectives with the most aligned sub-objectives</CardDescription>
            </CardHeader>
            <CardContent>
              {alignmentData.length > 0 ? (
                <div className="space-y-6">
                  {alignmentData.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">{item.objective.title}</h3>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="mr-2">{item.objective.level}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {item.childCount} aligned {item.childCount === 1 ? 'objective' : 'objectives'}
                            </span>
                          </div>
                        </div>
                        <Badge 
                          className="ml-2"
                          variant={item.objective.progress >= 70 ? 'default' : 'secondary'}
                        >
                          {item.objective.progress}% Complete
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <div>Parent Progress</div>
                          <div>{item.objective.progress}%</div>
                        </div>
                        <Progress value={item.objective.progress} className="h-2 mb-4" />
                        
                        <div className="flex justify-between items-center text-sm">
                          <div>Child Objectives Avg Progress</div>
                          <div>{Math.round(item.avgProgress)}%</div>
                        </div>
                        <Progress value={Math.round(item.avgProgress)} className="h-2 bg-muted" />
                        
                        {/* Progress comparison */}
                        <div className="mt-4 text-sm text-muted-foreground">
                          {item.avgProgress > item.objective.progress ? (
                            <span>Child objectives are ahead by {Math.round(item.avgProgress - item.objective.progress)}%</span>
                          ) : item.avgProgress < item.objective.progress ? (
                            <span>Child objectives are behind by {Math.round(item.objective.progress - item.avgProgress)}%</span>
                          ) : (
                            <span>Child and parent objectives are in perfect alignment</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No alignment data available</p>
                  <p className="text-sm mt-2">Create parent-child objective relationships to see alignment impact</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
