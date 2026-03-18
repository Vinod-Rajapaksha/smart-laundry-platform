import React, { useRef } from 'react';
import { Calendar } from 'lucide-react';

const checkboxOptions = [
    "Total Revenue",
    "Total Expenses",
    "Net Profit",
    "Revenue by Month",
    "Expense Category Breakdown",
    "Profit Trend",
    "Staff Salary Summary",
    "AI Insights Summary"
];

const ReportGenerationPage: React.FC = () => {
    const fromInputRef = useRef<HTMLInputElement>(null);
    const toInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex-1 bg-[#f8f9fc] min-h-screen p-12 flex flex-col">
            <h1 className="text-[42px] font-black text-black mb-12 tracking-tight">Report Generation</h1>
            
            <div className="max-w-[1100px] w-full mx-auto flex flex-col items-center">
                {/* Date Selectors */}
                <div className="flex flex-col md:flex-row justify-between w-full gap-12 mb-16">
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
                                defaultValue="2026-01-01"
                                className="text-[26px] font-bold text-black border-none outline-none w-full bg-transparent text-center cursor-pointer pr-8 [&::-webkit-calendar-picker-indicator]:hidden"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fromInputRef.current?.showPicker();
                                }}
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
                                defaultValue="2026-02-28"
                                className="text-[26px] font-bold text-black border-none outline-none w-full bg-transparent text-center cursor-pointer pr-8 [&::-webkit-calendar-picker-indicator]:hidden"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toInputRef.current?.showPicker();
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Options Box */}
                <div className="w-[75%] bg-white border-[1.5px] border-[#93c5fd] rounded-[24px] py-16 px-16 shadow-sm flex flex-col items-center justify-center min-h-[460px] mb-12">
                    <div className="flex flex-col gap-1 w-[350px]">
                        {checkboxOptions.map((option, idx) => (
                            <label key={idx} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <input 
                                    type="checkbox" 
                                    className="w-[18px] h-[18px] border-2 border-black rounded-sm outline-none cursor-pointer accent-[#3FA0F6]" 
                                />
                                <span className="text-[20px] text-[#222] font-normal leading-tight">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Button */}
                <button className="bg-[#3FA0F6] hover:bg-[#2c8ee1] text-white font-bold text-[18px] py-3 px-16 rounded-2xl border-[1px] border-[#1e3b8a] shadow-sm transform transition-all active:scale-95">
                    Generate
                </button>
            </div>
        </div>
    );
};

export default ReportGenerationPage;
