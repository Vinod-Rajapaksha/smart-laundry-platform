import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import StatCard from './StatCard';

const revenueData = [
    { month: "Jan", revenue: 2000 },
    { month: "Feb", revenue: 4000 },
    { month: "Mar", revenue: 3000 },
    { month: "Apr", revenue: 8000 },
    { month: "May", revenue: 10000 },
    { month: "Jun", revenue: 12000 }
];

const serviceData = [
    { name: "Wash & Dry", value: 30 },
    { name: "Dry Clean", value: 20 },
    { name: "Iron", value: 10 }
];

const COLORS = ['#3b82f6', '#0ea5e9', '#67e8f9'];

const SystemAnalysis: React.FC = () => {
    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-[#1c222d] to-[#111827] p-8 space-y-10 overflow-y-auto">
            {/* Top Section: Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Orders" value={48} />
                <StatCard title="Total Customers" value={73} />
                <StatCard title="Pending Orders" value={35} />
                <StatCard title="Completed Orders" value={13} />
            </div>

            {/* Second Section: Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Left Side: Revenue Chart - Spans 2 columns on extra large screens */}
                <div className="xl:col-span-2 bg-white rounded-3xl p-8 shadow-2xl">
                    <h3 className="text-2xl font-bold text-[#1f3a4d] mb-6">Revenue Over Time</h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRev)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Side: Donut Chart & Summary */}
                <div className="flex flex-col gap-8">
                    {/* Donut Chart Container */}
                    <div className="bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center">
                        <h3 className="text-xl font-bold text-[#1f3a4d] self-start mb-2">Service Distribution</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={serviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {serviceData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Small Summary Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-2xl space-y-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-400 uppercase tracking-tighter">Total Revenue</span>
                            <span className="text-3xl font-black text-[#1f3a4d]">LKR 150,000</span>
                        </div>
                        <div className="h-px bg-slate-100" />
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Best Selling</span>
                            <span className="text-[#3b82f6] font-bold">Wash & Dry</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-medium">Total Customers</span>
                            <span className="text-[#1f3a4d] font-bold">320</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SystemAnalysis;
