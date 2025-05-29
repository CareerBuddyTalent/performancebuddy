
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TimeSeriesDataPoint {
  date: string;
  value: number;
  baseline?: number;
  target?: number;
  trend?: 'up' | 'down' | 'stable';
}

interface TimeSeriesChartProps {
  title: string;
  description?: string;
  data: TimeSeriesDataPoint[];
  metric: string;
  unit?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  showBaseline?: boolean;
  showTarget?: boolean;
}

export function TimeSeriesChart({
  title,
  description,
  data,
  metric,
  unit = '',
  frequency,
  showBaseline = true,
  showTarget = true
}: TimeSeriesChartProps) {
  const [timeRange, setTimeRange] = useState('30d');

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatValue = (value: number) => {
    return `${value.toFixed(1)}${unit}`;
  };

  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const change = currentValue - previousValue;
  const changePercent = previousValue ? ((change / previousValue) * 100).toFixed(1) : '0';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {title}
              {getTrendIcon(data[data.length - 1]?.trend)}
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7D</SelectItem>
                <SelectItem value="30d">30D</SelectItem>
                <SelectItem value="90d">90D</SelectItem>
                <SelectItem value="1y">1Y</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-bold">{formatValue(currentValue)}</p>
            <p className="text-sm text-muted-foreground">Current</p>
          </div>
          <Badge variant={change >= 0 ? 'default' : 'destructive'}>
            {change >= 0 ? '+' : ''}{changePercent}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={formatValue}
            />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value: number) => [formatValue(value), metric]}
            />
            <Legend />
            
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={2}
              name={metric}
              dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            />
            
            {showBaseline && (
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#64748b" 
                strokeDasharray="5 5"
                name="Baseline"
                dot={false}
              />
            )}
            
            {showTarget && (
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#dc2626" 
                strokeDasharray="5 5"
                name="Target"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
