
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RatingData {
  name: string;
  score: number;
  color: string;
}

interface RatingsGraphProps {
  data: Array<RatingData>;
  title: string;
  description?: string;
}

export default function RatingsGraph({ data, title, description }: RatingsGraphProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 0,
                bottom: 20,
              }}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#888', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 5]} 
                tick={{ fill: '#888', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickCount={6}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                contentStyle={{ 
                  background: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <ReferenceLine y={3} stroke="#888" strokeDasharray="3 3" />
              <Bar dataKey="score" fill="#9B87F5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
