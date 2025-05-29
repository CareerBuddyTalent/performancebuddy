
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const weeklyProgressData = [
  { week: 'Week 1', hours: 4.5 },
  { week: 'Week 2', hours: 6.2 },
  { week: 'Week 3', hours: 3.8 },
  { week: 'Week 4', hours: 7.1 },
  { week: 'Week 5', hours: 5.4 },
  { week: 'Week 6', hours: 8.3 }
];

const skillProgressData = [
  { name: 'Leadership', value: 85 },
  { name: 'Communication', value: 92 },
  { name: 'Technical', value: 67 },
  { name: 'Analytics', value: 74 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function LearningAnalytics() {
  return (
    <div className="space-y-6">
      {/* Learning Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">Total Learning Hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Courses Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">87%</div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">24</div>
            <p className="text-sm text-muted-foreground">Certificates Earned</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Learning Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Learning Hours</CardTitle>
            <CardDescription>Your learning activity over the past 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Progress Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Skill Progress Distribution</CardTitle>
            <CardDescription>Your progress across different skill categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillProgressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Skill Progress</CardTitle>
          <CardDescription>Track your advancement in key competency areas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillProgressData.map((skill, index) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{skill.name}</span>
                <span className="text-sm text-muted-foreground">{skill.value}%</span>
              </div>
              <Progress value={skill.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Learning Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Learning Goals</CardTitle>
          <CardDescription>Track your progress towards learning objectives</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Hours Goal</span>
                <span>28/40 hrs</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Courses Goal</span>
                <span>2/3 courses</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Certificates Goal</span>
                <span>1/2 certs</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
