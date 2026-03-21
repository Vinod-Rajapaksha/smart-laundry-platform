import React, { useState } from 'react';
import type { ReportRequestPayload } from '../types';

interface ReportFormProps {
  onSubmit: (payload: ReportRequestPayload) => void;
  loading?: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, loading }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return;
    onSubmit({ dateRange: { from, to }, filters });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white">
      <div>
        <label className="block font-medium">From</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border p-2 rounded w-full" required />
      </div>
      <div>
        <label className="block font-medium">To</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border p-2 rounded w-full" required />
      </div>
      {/* Add more filter fields as needed */}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Generating...' : 'Generate Report'}
      </button>
    </form>
  );
};

export default ReportForm;
