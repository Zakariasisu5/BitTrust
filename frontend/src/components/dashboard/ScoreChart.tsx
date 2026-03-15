"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const defaultData = [
  { date: 'Jan 01', score: 650 },
  { date: 'Jan 15', score: 680 },
  { date: 'Feb 01', score: 670 },
  { date: 'Feb 15', score: 710 },
  { date: 'Mar 01', score: 732 },
];

interface ScoreChartProps {
  history?: { date: string; score: number }[];
  currentScore?: number;
}

export const ScoreChart = ({ history, currentScore }: ScoreChartProps) => {
  const data = history && history.length > 0
    ? history
    : currentScore !== undefined
      ? [...defaultData.slice(0, -1), { date: 'Now', score: currentScore }]
      : defaultData;
  return (
    <Card className="matte-card relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-900 opacity-50 pointer-events-none" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-sm font-medium text-slate-400 font-mono">[{'>'} REPUTATION_HISTORY_90D]</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-4 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontFamily: 'monospace' }}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              domain={[600, 800]}
              tick={{ fontFamily: 'monospace' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #1e293b',
                borderRadius: '8px',
                fontFamily: 'monospace'
              }}
              itemStyle={{ color: '#f59e0b' }}
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              dot={{ r: 4, fill: '#f59e0b' }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
