import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Banknote, Wallet, TrendingUp, MoveUpRight, ArrowUp, Plus, Minus } from 'lucide-react';

const FinancialAnalysisPage: React.FC = () => {

  const navigate = useNavigate();
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [revenueForm, setRevenueForm] = useState({ date: '', name: '', amount: '' });
  const [expenseForm, setExpenseForm] = useState({ date: '', name: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|null>(null);
  const [error, setError] = useState<string|null>(null);

  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRevenueForm({ ...revenueForm, [e.target.name]: e.target.value });
  };
  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
  };

  const submitRevenue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await fetch('/api/finance/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...revenueForm, amount: Number(revenueForm.amount) })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Revenue added successfully!');
        setShowRevenueModal(false);
        setRevenueForm({ date: '', name: '', amount: '' });
      } else {
        setError(data.message || 'Failed to add revenue');
      }
    } catch (err: any) {
      setError('Failed to add revenue');
    }
    setLoading(false);
  };

  const submitExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);
    try {
      const res = await fetch('/api/finance/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...expenseForm, amount: Number(expenseForm.amount) })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Expense added successfully!');
        setShowExpenseModal(false);
        setExpenseForm({ date: '', name: '', amount: '' });
      } else {
        setError(data.message || 'Failed to add expense');
      }
    } catch (err: any) {
      setError('Failed to add expense');
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 bg-[#f8f9fc] min-h-screen p-8 md:p-12 flex flex-col font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-start gap-6">
          <button 
            className="w-[60px] h-[60px] rounded-full border-[2px] border-black flex items-center justify-center bg-transparent shrink-0 hover:bg-gray-100 transition-colors"
            onClick={() => navigate('/reports')}
          >
            <ArrowLeft className="w-10 h-10 text-black" strokeWidth={2.5} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[36px] md:text-[42px] font-black text-black leading-tight tracking-tight">
              Financial System Analysis
            </h1>
            <h2 className="text-[18px] md:text-[22px] font-black text-black leading-tight">
              Revenue, Expenses<span className="ml-[2px]">&</span> Profit Overview
            </h2>
          </div>
        </div>
        <div>
          <button className="flex items-center gap-6 bg-[#eef7fd] border-[1px] border-[#bed7ed] rounded-xl px-8 py-4 text-black font-bold text-[18px] hover:bg-[#b5cced] transition-colors shadow-sm">
            This Month
            <ChevronDown className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Cards Section */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 justify-center items-center mb-12">
        {/* Total Revenue Card */}
        <div className="w-full max-w-[400px] h-[220px] bg-[#eef7fd] border-[1px] border-[#bed7ed] rounded-[24px] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* subtle inset white layer effect styling to match image */}
          <div className="absolute inset-[3px] bg-white opacity-40 rounded-[20px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#eed6c2] flex items-center justify-center overflow-hidden border-[1px] border-[#e1c0a2] opacity-80 mix-blend-multiply">
              <Banknote className="w-6 h-6 text-gray-700" strokeWidth={2} />
            </div>
            <span className="text-[22px] font-normal text-gray-800">Total Revenue</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-end gap-2">
              <span className="text-[44px] font-black tracking-tight text-[#111]">LKR 450,000</span>
              <ArrowUp className="w-8 h-8 text-[#1b8c4c] mb-2 font-black" strokeWidth={3} />
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-[18px]">
            <MoveUpRight className="w-5 h-5 text-[#24904f]" strokeWidth={2.5} />
            <span className="font-bold text-[#24904f]">+12%</span>
            <span className="text-gray-700">from last month</span>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="w-full max-w-[400px] h-[220px] bg-[#eef7fd] border-[1px] border-[#bed7ed] rounded-[24px] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-[3px] bg-white opacity-40 rounded-[20px] pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#e3e6eb] flex items-center justify-center overflow-hidden border-[1px] border-[#ccd2db] mix-blend-multiply">
               <Wallet className="w-6 h-6 text-[#ef7e3e]" strokeWidth={2} />
            </div>
            <span className="text-[22px] font-normal text-gray-800">Total Expenses</span>
          </div>
          <div className="relative z-10">
            <span className="text-[44px] font-black tracking-tight text-[#111]">LKR 280,000</span>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-[18px]">
            <div className="w-4 h-4 bg-[#f89840] rounded-sm mr-1"></div>
            <span className="font-bold text-[#e17b2b]">65%</span>
            <span className="text-gray-700">of revenue</span>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="w-full max-w-[400px] h-[220px] bg-[#eef7fd] border-[1px] border-[#bed7ed] rounded-[24px] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-[3px] bg-white opacity-40 rounded-[20px] pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#d5eafa] flex items-center justify-center overflow-hidden border-[1px] border-[#b4d8f4] mix-blend-multiply">
               <TrendingUp className="w-6 h-6 text-[#3FA0F6]" strokeWidth={2.5} />
            </div>
            <span className="text-[22px] font-normal text-gray-800">Net Profit</span>
          </div>
          <div className="relative z-10">
             <span className="text-[44px] font-black tracking-tight text-[#111]">LKR 170,000</span>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-[18px]">
            <div className="w-4 h-4 rounded-full bg-[#4ba3f4] mr-1"></div>
            <span className="text-gray-700">Healthy growth</span>
          </div>
        </div>
      </div>


      {/* Action Buttons Row */}
      <div className="flex justify-center w-full gap-6 mb-12">
        <button type="button" onClick={() => setShowRevenueModal(true)} className="flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-[16px] py-4 px-8 rounded-xl border-[1px] border-[#15803d] shadow-md transition-colors active:scale-95">
          <Plus className="w-5 h-5" /> Add Revenue
        </button>
        <button className="flex items-center gap-2 bg-[#3FA0F6] hover:bg-[#328bd5] text-white font-bold text-[16px] py-4 px-8 rounded-xl border-[1px] border-[#1b5e9f] shadow-md transition-colors active:scale-95">
          Generate a report
        </button>
        <button type="button" onClick={() => setShowExpenseModal(true)} className="flex items-center gap-2 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold text-[16px] py-4 px-8 rounded-xl border-[1px] border-[#991b1b] shadow-md transition-colors active:scale-95">
          <Minus className="w-5 h-5" /> Add Expense
        </button>
      </div>

      {/* Revenue Modal */}
      {showRevenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-md relative overflow-hidden">
            <div className="flex items-center gap-3 px-8 py-6 bg-[#22c55e]">
              <Plus className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-black text-white tracking-wide">Add Revenue</h3>
              <button onClick={() => setShowRevenueModal(false)} className="ml-auto text-white text-3xl hover:text-gray-200">×</button>
            </div>
            <form onSubmit={submitRevenue} className="space-y-7 px-8 py-8">
              <div>
                <label className="block font-semibold mb-2 text-[#22c55e]">Date</label>
                <input type="date" name="date" value={revenueForm.date} onChange={handleRevenueChange} className="border-2 border-[#22c55e] focus:border-[#16a34a] p-3 rounded-xl w-full text-lg outline-none transition" required />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[#22c55e]">Revenue Name</label>
                <input type="text" name="name" value={revenueForm.name} onChange={handleRevenueChange} className="border-2 border-[#22c55e] focus:border-[#16a34a] p-3 rounded-xl w-full text-lg outline-none transition" required placeholder="e.g. Laundry Service" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[#22c55e]">Amount</label>
                <input type="number" name="amount" value={revenueForm.amount} onChange={handleRevenueChange} className="border-2 border-[#22c55e] focus:border-[#16a34a] p-3 rounded-xl w-full text-lg outline-none transition" required min="0" step="0.01" placeholder="e.g. 10000" />
              </div>
              <button type="submit" className="w-full bg-[#22c55e]  hover:[#16a34a]  text-white font-bold py-3 rounded-xl text-lg shadow-md transition" disabled={loading}>
                {loading ? 'Adding...' : 'Add Revenue'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/10">
          <div className="bg-white rounded-3xl shadow-2xl p-0 w-full max-w-md relative overflow-hidden">
            <div className="flex items-center gap-3 px-8 py-6 bg-[#ef4444]">
              <Minus className="w-8 h-8 text-white" />
              <h3 className="text-2xl font-black text-white tracking-wide">Add Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="ml-auto text-white text-3xl hover:text-gray-200">×</button>
            </div>
            <form onSubmit={submitExpense} className="space-y-7 px-8 py-8">
              <div>
                <label className="block font-semibold mb-2 text-[#ef4444]">Date</label>
                <input type="date" name="date" value={expenseForm.date} onChange={handleExpenseChange} className="border-2 border-[#ef4444] focus:border-[#dc2626] p-3 rounded-xl w-full text-lg outline-none transition" required />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[#ef4444]">Expense Name</label>
                <input type="text" name="name" value={expenseForm.name} onChange={handleExpenseChange} className="border-2 border-[#ef4444] focus:border-[#dc2626] p-3 rounded-xl w-full text-lg outline-none transition" required placeholder="e.g. Staff Salary" />
              </div>
              <div>
                <label className="block font-semibold mb-2 text-[#ef4444]">Amount</label>
                <input type="number" name="amount" value={expenseForm.amount} onChange={handleExpenseChange} className="border-2 border-[#ef4444] focus:border-[#dc2626] p-3 rounded-xl w-full text-lg outline-none transition" required min="0" step="0.01" placeholder="e.g. 5000" />
              </div>
              <button type="submit" className="w-full bg-[#ef4444]  hover:[#dc2626]  text-white font-bold py-3 rounded-xl text-lg shadow-md transition" disabled={loading}>
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Success/Error Message */}
      {(message || error) && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-xl shadow-lg font-bold text-lg ${message ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message || error}</div>
        </div>
      )}

      {/* Financial Insights Box */}
      <div className="w-full max-w-[1200px] mx-auto bg-white border-[1px] border-[#3FA0F6] rounded-2xl p-10 md:p-14 shadow-sm min-h-[300px]">
        <h3 className="text-[24px] md:text-[28px] font-black text-black mb-10 tracking-tight">Financial Insights</h3>
        
        <ul className="list-disc pl-8 space-y-6">
          <li className="text-[18px] md:text-[20px] font-bold text-black pl-2">
            Revenue increased steadily over last 3 months.
          </li>
          <li className="text-[18px] md:text-[20px] font-bold text-black pl-2">
            Staff salaries are the highest expense category.
          </li>
          <li className="text-[18px] md:text-[20px] font-bold text-black pl-2">
            Profit margin is currently 38%.
          </li>
          <li className="text-[18px] md:text-[20px] font-bold text-black pl-2">
            Consider reducing electricity consumption to improve margin.
          </li>
        </ul>
      </div>

    </div>
  );
};

export default FinancialAnalysisPage;
