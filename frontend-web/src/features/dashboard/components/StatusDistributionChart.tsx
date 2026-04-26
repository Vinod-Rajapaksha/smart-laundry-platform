import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { StatusDistribution } from '../types';

interface StatusDistributionChartProps {
  data: StatusDistribution[];
}

const STATUS_COLORS: Record<string, string> = {
  ORDER_PLACED: '#94a3b8',    // Slate
  PENDING: '#f59e0b',         // Amber
  PICKUP_ASSIGNED: '#3b82f6', // Blue
  PICKUP_ON_THE_WAY: '#2563eb',
  PICKED_UP: '#8b5cf6',       // Purple
  WASHING: '#0ea5e9',         // Sky
  DRYING: '#0284c7',
  PROCESSING: '#6366f1',      // Indigo
  READY: '#10b981',           // Emerald
  DELIVERY_ASSIGNED: '#059669',
  DELIVERY_ON_THE_WAY: '#047857',
  ON_THE_WAY: '#14b8a6',      // Teal
  DELIVERED: '#0f766e',
  ON_HOLD: '#f97316',         // Orange
  CANCELLED: '#ef4444',       // Rose
  RETURNED: '#7f1d1d',
};

const DEFAULT_COLOR = '#cbd5e1';

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ');
};

export default function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  // Normalize and merge data to prevent case-sensitivity dupes (e.g. 'Completed' vs 'COMPLETED')
  const normalizedDataMap = data.reduce((acc, current) => {
    const rawStatus = String(current.status || 'UNKNOWN').toUpperCase();
    if (acc[rawStatus]) {
      acc[rawStatus].count += current.count;
    } else {
      acc[rawStatus] = { status: rawStatus, count: current.count };
    }
    return acc;
  }, {} as Record<string, StatusDistribution>);

  const chartData = Object.values(normalizedDataMap).filter(item => item.count > 0);

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={8}
            dataKey="count"
            nameKey="status"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || DEFAULT_COLOR}
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
            formatter={(value, name) => [value, formatStatus(name as string)]}
          />
          <Legend
            verticalAlign="bottom"
            height={48}
            iconType="circle"
            formatter={(value) => <span className="text-[10px] font-bold text-slate-600 tracking-widest ml-1">{formatStatus(value)}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
