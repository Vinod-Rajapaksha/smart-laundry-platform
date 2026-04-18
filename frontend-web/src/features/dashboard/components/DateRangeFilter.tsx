import type { DateRange } from '../types';

interface DateRangeFilterProps {
  activeRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export default function DateRangeFilter({ activeRange, onRangeChange }: DateRangeFilterProps) {
  const ranges: { id: DateRange; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Past Week' },
    { id: 'month', label: 'Past Month' },
    { id: 'year', label: 'Overall' },
  ];

  return (
    <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
      {ranges.map((range) => (
        <button
          key={range.id}
          onClick={() => onRangeChange(range.id)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeRange === range.id
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
            }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
