import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
    return (
        <div className="bg-[#9db4d6] p-6 rounded-[2rem] shadow-xl flex flex-col items-center justify-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-default group">
            <div className="text-sm font-bold text-[#1f3a4d]/60 uppercase tracking-widest mb-1">
                {title}
            </div>
            <div className="text-4xl font-black text-[#1f3a4d] flex items-center gap-2">
                {value}
                {icon && <span className="group-hover:rotate-12 transition-transform">{icon}</span>}
            </div>
        </div>
    );
};

export default StatCard;
