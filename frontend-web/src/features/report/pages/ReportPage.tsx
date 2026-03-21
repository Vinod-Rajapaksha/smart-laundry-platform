
import React, { useState, useRef } from 'react';
import { Calendar } from 'lucide-react';
import FinancialReport from '../components/FinancialReport';
import DownloadButton from '../components/DownloadButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateReport } from '../api/reportApi';
import { type ReportRequestPayload } from '../types';


const checkboxOptions = [
  'Total Revenue',
  'Total Expenses',
  'Net Profit',
  'Revenue by Month',
  'Expense Category Breakdown',
  'Profit Trend',
  'Staff Salary Summary',
  'AI Insights Summary',
];

const ReportPage: React.FC = () => {
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState('2026-02-28');
  const [checkedOptions, setCheckedOptions] = useState<boolean[]>(checkboxOptions.map(() => false));
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  const handleCheckboxChange = (idx: number) => {
    setCheckedOptions(prev => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setReportData(null);
    const filters = { sections: checkboxOptions.filter((_, i) => checkedOptions[i]) };
    const payload: ReportRequestPayload = { dateRange: { from, to }, filters };
    try {
      const response = await fetch('/api/reportGen/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.success) setReportData(data.data);
      else setError(data.message || 'Failed to generate report');
    } catch (err: any) {
      setError('Failed to generate report');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 bg-[#f8f9fc] min-h-screen p-12 flex flex-col">
      <h1 className="text-[42px] font-black text-black mb-12 tracking-tight">Report Generation</h1>
      <form onSubmit={handleGenerate} className="max-w-[1100px] w-full mx-auto flex flex-col items-center gap-10">
        <div className="flex flex-col md:flex-row justify-between w-full gap-12 mb-8">
          <div className="flex-1 flex flex-col">
            <label className="text-[32px] font-black text-[#3FA0F6] mb-3">From :</label>
            <div
              className="flex items-center bg-white border-[1.5px] border-[#3FA0F6] rounded-2xl px-6 py-5 w-full shadow-sm cursor-pointer"
              onClick={() => fromInputRef.current?.showPicker()}
            >
              <Calendar className="text-black w-8 h-8 mr-8" strokeWidth={2.5} />
              <input
                ref={fromInputRef}
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="text-[26px] font-bold text-black border-none outline-none w-full bg-transparent text-center cursor-pointer pr-8 [&::-webkit-calendar-picker-indicator]:hidden"
                onClick={e => { e.stopPropagation(); fromInputRef.current?.showPicker(); }}
                required
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-[32px] font-black text-[#3FA0F6] mb-3">To:</label>
            <div
              className="flex items-center bg-white border-[1.5px] border-[#3FA0F6] rounded-2xl px-6 py-5 w-full shadow-sm cursor-pointer"
              onClick={() => toInputRef.current?.showPicker()}
            >
              <Calendar className="text-black w-8 h-8 mr-8" strokeWidth={2.5} />
              <input
                ref={toInputRef}
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="text-[26px] font-bold text-black border-none outline-none w-full bg-transparent text-center cursor-pointer pr-8 [&::-webkit-calendar-picker-indicator]:hidden"
                onClick={e => { e.stopPropagation(); toInputRef.current?.showPicker(); }}
                required
              />
            </div>
          </div>
        </div>
        <div className="w-[75%] bg-white border-[1.5px] border-[#3FA0F6] rounded-[24px] py-16 px-16 shadow-sm flex flex-col items-center justify-center min-h-[460px] mb-8">
          <div className="flex flex-col gap-1 w-[350px]">
            {checkboxOptions.map((option, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <input
                  type="checkbox"
                  className="w-[18px] h-[18px] border-2 border-black rounded-sm outline-none cursor-pointer accent-[#3FA0F6]"
                  checked={checkedOptions[idx]}
                  onChange={() => handleCheckboxChange(idx)}
                />
                <span className="text-[20px] text-[#222] font-normal leading-tight">{option}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="bg-[#2196f3] hover:bg-[#1976d2] text-white font-bold text-[18px] py-3 px-16 rounded-2xl border-[1px] border-[#1e3b8a] shadow-sm transform transition-all active:scale-95">
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {loading && <LoadingSpinner />}
      {error && <div className="text-red-500 my-4">{error}</div>}
      {reportData && <div className="my-8"><FinancialReport data={reportData} periodLabel={from + ' to ' + to} /></div>}
    </div>
  );
};

export default ReportPage;
