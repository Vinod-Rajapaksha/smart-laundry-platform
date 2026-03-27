
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Download, MoreHorizontal } from 'lucide-react';
import FinancialReport from '../components/FinancialReport';
import LoadingSpinner from '../components/LoadingSpinner';
import { type ReportRequestPayload } from '../types';
import { env } from '../../../app/config/env';
import { apiFetch } from '../../../services/http/interceptors';


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

type DateValidationResult = {
  fromError: string | null;
  toError: string | null;
  summaryError: string | null;
  isValid: boolean;
};

const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const parseDateInput = (value: string): Date | null => {
  if (!DATE_INPUT_REGEX.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
};

const getTodayDateOnly = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const validateDateRange = (from: string, to: string): DateValidationResult => {
  const today = getTodayDateOnly();
  let fromError: string | null = null;
  let toError: string | null = null;

  const trimmedFrom = from.trim();
  const trimmedTo = to.trim();

  const fromDate = parseDateInput(trimmedFrom);
  const toDate = parseDateInput(trimmedTo);

  if (!trimmedFrom) {
    fromError = 'From date is required.';
  } else if (!fromDate) {
    fromError = 'Enter a valid From date.';
  } else if (fromDate > today) {
    fromError = 'From date cannot be in the future.';
  }

  if (!trimmedTo) {
    toError = 'To date is required.';
  } else if (!toDate) {
    toError = 'Enter a valid To date.';
  } else if (toDate > today) {
    toError = 'To date cannot be in the future.';
  }

  if (!fromError && !toError && fromDate && toDate && toDate < fromDate) {
    toError = 'To date must be greater than or equal to From date.';
  }

  const summaryError = fromError && toError ? 'Please correct both date fields.' : null;

  return {
    fromError,
    toError,
    summaryError,
    isValid: !fromError && !toError,
  };
};

type GeneratedReportMeta = {
  id: string;
  reportCode: string;
  generatedByName: string;
  generatedDate: string;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const ReportPage: React.FC = () => {
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState(() => formatDateForInput(new Date()));
  const [checkedOptions, setCheckedOptions] = useState<boolean[]>(checkboxOptions.map(() => false));
  const [reportData, setReportData] = useState<any>(null);
  const [generatedReportMeta, setGeneratedReportMeta] = useState<GeneratedReportMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromError, setFromError] = useState<string | null>(null);
  const [toError, setToError] = useState<string | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  const todayMax = useMemo(() => formatDateForInput(new Date()), []);
  const dateValidation = useMemo(() => validateDateRange(from, to), [from, to]);
  const isDateRangeValid = dateValidation.isValid;

  useEffect(() => {
    setFromError(dateValidation.fromError);
    setToError(dateValidation.toError);
    setSummaryError(dateValidation.summaryError);
  }, [dateValidation]);

  const handleCheckboxChange = (idx: number) => {
    setCheckedOptions(prev => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  const handleFromChange = (value: string) => {
    setFrom(value);

    const nextFromDate = parseDateInput(value.trim());
    const currentToDate = parseDateInput(to.trim());

    if (nextFromDate && currentToDate && currentToDate < nextFromDate) {
      setTo('');
    }
  };

  const handleToChange = (value: string) => {
    setTo(value);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentValidation = validateDateRange(from, to);
    if (!currentValidation.isValid) {
      setFromError(currentValidation.fromError);
      setToError(currentValidation.toError);
      setSummaryError(currentValidation.summaryError);
      return;
    }

    setLoading(true);
    setError(null);
    setReportData(null);
    setGeneratedReportMeta(null);
    const filters = { sections: checkboxOptions.filter((_, i) => checkedOptions[i]) };
    const payload: ReportRequestPayload = { dateRange: { from, to }, filters };

    try {
      const data = await apiFetch<{
        success: boolean;
        data: any;
        message?: string;
        report?: {
          id: string;
          reportCode: string;
          generatedByName?: string;
          generatedDate: string;
        };
      }>('/reportGen/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (data.success) {
        setReportData(data.data);
        if (data.report?.id) {
          setGeneratedReportMeta({
            id: data.report.id,
            reportCode: data.report.reportCode,
            generatedByName: data.report.generatedByName || 'Admin',
            generatedDate: data.report.generatedDate,
          });
        }
      }
      else setError(data.message || 'Failed to generate report');
    } catch (err: any) {
      setError('Failed to generate report');
    }
    setLoading(false);
  };

  const handleDownloadGeneratedReport = async () => {
    if (!generatedReportMeta?.id) {
      return;
    }

    setDownloading(true);
    try {
      const response = await fetch(`${env.API_URL}/reportGen/reports/${generatedReportMeta.id}/download`);
      if (!response.ok) {
        throw new Error('Download failed');
      }
      const blob = await response.blob();
      downloadBlob(blob, `${generatedReportMeta.reportCode}.pdf`);
    } catch (err: any) {
      setError('Failed to download report');
    }
    setDownloading(false);
  };

  const handleOpenMoreReports = () => {
    window.open('/generated-reports', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex-1 bg-[#f8f9fc] min-h-screen p-12 flex flex-col">
      <h1 className="text-[42px] font-black text-black mb-12 tracking-tight">Report Generation</h1>
      <form onSubmit={handleGenerate} className="max-w-[1100px] w-full mx-auto flex flex-col items-center gap-10">
        <div className="flex flex-col md:flex-row justify-between w-full gap-12 mb-8">
          <div className="flex-1 flex flex-col">
            <label className="text-[32px] font-black text-[#3FA0F6] mb-3">From :</label>
            <div
              className={`flex items-center bg-white border-[1.5px] ${fromError ? 'border-red-500' : 'border-[#3FA0F6]'} rounded-2xl px-6 py-5 w-full shadow-sm cursor-pointer`}
              onClick={() => fromInputRef.current?.showPicker()}
            >
              <Calendar className="text-black w-8 h-8 mr-8" strokeWidth={2.5} />
              <input
                ref={fromInputRef}
                type="date"
                value={from}
                max={todayMax}
                onChange={e => handleFromChange(e.target.value)}
                className="text-[26px] font-bold text-black border-none outline-none w-full bg-transparent text-center cursor-pointer pr-8 [&::-webkit-calendar-picker-indicator]:hidden"
                onClick={e => { e.stopPropagation(); fromInputRef.current?.showPicker(); }}
                required
              />
            </div>
            {fromError && <p className="mt-2 text-sm text-red-600 font-semibold">{fromError}</p>}
          </div>
          <div className="flex-1 flex flex-col">
            <label className="text-[32px] font-black text-[#3FA0F6] mb-3">To:</label>
            <div
              className={`flex items-center bg-white border-[1.5px] ${toError ? 'border-red-500' : 'border-[#3FA0F6]'} rounded-2xl px-6 py-5 w-full shadow-sm cursor-pointer`}
              onClick={() => toInputRef.current?.showPicker()}
            >
              <Calendar className="text-black w-8 h-8 mr-8" strokeWidth={2.5} />
              <input
                ref={toInputRef}
                type="date"
                value={to}
                min={from || undefined}
                max={todayMax}
                onChange={e => handleToChange(e.target.value)}
                className="text-[26px] font-bold text-black border-none outline-none w-full bg-transparent text-center cursor-pointer pr-8 [&::-webkit-calendar-picker-indicator]:hidden"
                onClick={e => { e.stopPropagation(); toInputRef.current?.showPicker(); }}
                required
              />
            </div>
            {toError && <p className="mt-2 text-sm text-red-600 font-semibold">{toError}</p>}
          </div>
        </div>
        {summaryError && <div className="w-full text-center text-red-600 font-bold -mt-6">{summaryError}</div>}
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
        <button
          type="submit"
          disabled={!isDateRangeValid || loading}
          className={`bg-[#2196f3] text-white font-bold text-[18px] py-3 px-16 rounded-2xl border-[1px] border-[#1e3b8a] shadow-sm transform transition-all active:scale-95 ${(!isDateRangeValid || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1976d2]'}`}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {loading && <LoadingSpinner />}
      {error && <div className="text-red-500 my-4">{error}</div>}
      {reportData && (
        <div className="my-8">
          <div className="max-w-[900px] mx-auto mb-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleDownloadGeneratedReport}
              disabled={downloading || !generatedReportMeta?.id}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-semibold transition-colors ${downloading || !generatedReportMeta?.id ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed' : 'bg-green-600 text-white border-green-700 hover:bg-green-700'}`}
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Downloading...' : 'Download'}
            </button>
            <button
              type="button"
              onClick={handleOpenMoreReports}
              className="inline-flex items-center gap-2 rounded-xl border border-[#1e3b8a] bg-[#2563eb] px-4 py-2 font-semibold text-white hover:bg-[#1d4ed8] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
              More
            </button>
          </div>
          <FinancialReport data={reportData} periodLabel={from + ' to ' + to} />
        </div>
      )}
    </div>
  );
};

export default ReportPage;
