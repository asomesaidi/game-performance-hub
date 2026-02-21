import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import type { PerformanceResult } from '@/types/game';

const colorMap: Record<string, string> = {
  success: '#22c55e',
  info: '#3b82f6',
  warning: '#f59e0b',
  destructive: '#ef4444',
};

interface PerformanceChartProps {
  result: PerformanceResult;
  gameName: string;
}

export function PerformanceChart({ result, gameName }: PerformanceChartProps) {
  const levelScore: Record<string, number> = {
    ultra: 100,
    high: 80,
    medium: 60,
    low: 40,
    playable: 25,
    unplayable: 10,
  };

  const data = [
    { name: 'Your PC', score: levelScore[result.level] || 0, color: colorMap[result.color] || '#666' },
    { name: 'Minimum', score: 30, color: '#666' },
    { name: 'Recommended', score: 70, color: '#888' },
    { name: 'Ultra', score: 100, color: '#22c55e' },
  ];

  return (
    <div className="glass-card p-6 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">Performance Estimation</h3>
      <p className="text-xs text-muted-foreground">{gameName} on your system</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis dataKey="name" tick={{ fill: 'hsl(215, 15%, 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(220, 20%, 10%)',
                border: '1px solid hsl(220, 15%, 20%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 93%)',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
