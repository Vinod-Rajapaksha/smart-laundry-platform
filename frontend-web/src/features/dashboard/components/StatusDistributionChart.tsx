import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { StatusDistribution } from '../types';

interface StatusDistributionChartProps {
  data: StatusDistribution[];
}

const COLORS = {
  'Completed': '#10b981', // Emerald
  'Pending': '#f59e0b',   // Amber
  'Processing': '#3b82f6', // Blue
  'Cancelled': '#ef4444',  // Rose
  'Delivered': '#6366f1',  // Indigo
};

const DEFAULT_COLOR = '#94a3b8';

export default function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={8}
            dataKey="count"
            nameKey="status"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.status as keyof typeof COLORS] || DEFAULT_COLOR} 
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'Poppins'
            }} 
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
