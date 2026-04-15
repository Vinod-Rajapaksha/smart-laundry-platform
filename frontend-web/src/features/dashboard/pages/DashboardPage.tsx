import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    LabelList,
    Cell
} from 'recharts';

import { dashboardApi } from '../api/dashboard.api';




const serviceUsageData = [
    { name: 'Iron Express\nService', usage: 10, label: 'Iron Express Service' },
    { name: 'Dry Clean', usage: 30, label: 'Dry Clean' },
    { name: 'Wash', usage: 30, label: 'Wash' },
    { name: 'Wash & Iron', usage: 40, label: 'Wash & Iron' },
];


const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    // Move revenue-related state hooks inside the component
    const [revenueData, setRevenueData] = useState<{ month: string; revenue: number }[]>([]);
    const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
    const [revenueError, setRevenueError] = useState<string | null>(null);
    const [totalOrders, setTotalOrders] = useState<number | null>(null);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [ordersError, setOrdersError] = useState<string | null>(null);
    const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
    const [customersError, setCustomersError] = useState<string | null>(null);
    const [pendingOrders, setPendingOrders] = useState<number | null>(null);
    const [isLoadingPending, setIsLoadingPending] = useState(false);
    const [pendingError, setPendingError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardStats = async () => {
            setIsLoadingOrders(true);
            setIsLoadingCustomers(true);
            setIsLoadingPending(true);
            setOrdersError(null);
            setCustomersError(null);
            setPendingError(null);
            try {
                const stats = await dashboardApi.getDashboardStats();
                setTotalOrders(stats.totalOrders);
                setTotalCustomers(stats.totalCustomers);
                setPendingOrders(stats.pendingOrders);
            } catch (error) {
                setOrdersError('Failed to load total orders');
                setCustomersError('Failed to load total customers');
                setPendingError('Failed to load pending orders');
            } finally {
                setIsLoadingOrders(false);
                setIsLoadingCustomers(false);
                setIsLoadingPending(false);
            }
        };

        const loadRevenueData = async () => {
            setIsLoadingRevenue(true);
            setRevenueError(null);
            try {
                const res = await fetch('/api/finance/revenue/monthly');
                const data = await res.json();
                if (data.success && Array.isArray(data.data)) {
                    setRevenueData(data.data.map((item: any) => ({
                        month: item.month,
                        revenue: Math.round(item.total / 1000), // convert to thousands for chart
                    })));
                } else {
                    setRevenueError('Failed to load revenue data');
                }
            } catch (err) {
                setRevenueError('Failed to load revenue data');
            }
            setIsLoadingRevenue(false);
        };

        loadDashboardStats();
        loadRevenueData();
    }, []);
    
    return (
        <div className="flex-1 bg-[#f8f9fc] min-h-screen p-8 flex flex-col items-center justify-center">
            
            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto mb-12">
                {/* Total Orders */}
                <div className="w-full max-w-[400px] h-[220px] bg-[#eef7fd] border-[1px] border-[#bed7ed] rounded-[24px] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-2">Total Orders</h3>
                    <p className="text-6xl font-extrabold">
                        {isLoadingOrders ? '...' : (ordersError ? '-' : (totalOrders ?? 0))}
                    </p>
                </div>
                {/* Total Customers */}
                <div className="w-full max-w-[400px] h-[220px] bg-[#eef7fd] border-[1px] border-[#bed7ed] rounded-[24px] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-2">Total Customers</h3>
                    <p className="text-6xl font-extrabold">
                        {isLoadingCustomers ? '...' : (customersError ? '-' : (totalCustomers ?? 0))}
                    </p>
                </div>
                {/* Pending Orders */}
                <div className="w-full max-w-[400px] h-[220px] bg-[#eef7fd] border-[1px] border-[#bed7ed] rounded-[24px] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-2">Pending Orders</h3>
                    <p className="text-6xl font-extrabold">
                        {isLoadingPending ? '...' : (pendingError ? '-' : (pendingOrders ?? 0))}
                    </p>
                </div>
                {/* Completed Orders */}
                <div className="w-full max-w-[400px] h-[220px] bg-[#eef7fd] border-[1px] border-[#bed7ed] rounded-[24px] p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <h3 className="text-xl font-bold mb-2">Completed Orders</h3>
                    <p className="text-6xl font-extrabold">13</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="flex flex-col xl:flex-row gap-6 w-full max-w-7xl mx-auto items-stretch mb-10">
                {/* Left Chart (Revenue) */}
                <div className="flex-grow xl:w-2/3 bg-[#f3f7fb] rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                    <div className="text-center mb-8 relative z-10">
                        <h2 className="text-[#0e2a47] text-2xl font-bold uppercase tracking-wide">12-Month Revenue Analytics</h2>
                        <p className="text-gray-600 text-sm">(Simple Vertical Bar Chart | Values in LKR '000)</p>
                    </div>
                    
                    <div className="h-[350px] min-h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height={350} minHeight={350}>
                            <BarChart data={revenueData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#4b5563', fontSize: 12 }}
                                    domain={[0, 120]}
                                    ticks={[0, 20, 40, 60, 80, 100, 120]}
                                    label={{ 
                                        value: "REVENUE (LKR in Thousands)", 
                                        angle: -90, 
                                        position: 'insideLeft', 
                                        style: { textAnchor: 'middle', fill: '#4b5563', fontSize: 12, fontWeight: 500 }
                                    }}
                                />
                                <Bar dataKey="revenue" radius={[6, 6, 6, 6]} barSize={28}>
                                    {
                                        revenueData.map((_entry, index) => {
                                            const opacity = 0.5 + (index * 0.045);
                                            return <Cell key={`cell-${index}`} fill={`rgba(14, 128, 235, ${opacity})`} />;
                                        })
                                    }
                                    <LabelList 
                                        dataKey="revenue" 
                                        position="top" 
                                        // @ts-expect-error - Recharts types are complex for this simple formatter
                                        formatter={(val: string | number | null | undefined) => val != null ? `${val}K` : ''}
                                        style={{ fontSize: 11, fontWeight: 'bold', fill: '#1f2937' }}
                                        dy={-5}
                                    />
                                                    {isLoadingRevenue && <div className="text-center text-gray-500 mt-2">Loading revenue chart...</div>}
                                                    {revenueError && <div className="text-center text-red-500 mt-2">{revenueError}</div>}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Chart (Service Usage) */}
                <div className="flex-shrink-0 xl:w-[400px] bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col">
                    <div className="text-center mb-8">
                        <h2 className="text-[#1a1a1a] text-xl font-bold"></h2>
                    </div>
                    
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serviceUsageData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="none" vertical={false} stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={true} 
                                    tickLine={false}
                                    interval={0}
                                    tick={({ x, y, payload }) => {
                                        // Custom tick for potentially multi-line labels
                                        const lines = payload.value.split('\n');
                                        return (
                                            <g transform={`translate(${x},${y})`}>
                                                {lines.map((line: string, index: number) => (
                                                    <text
                                                        key={index}
                                                        x={0}
                                                        y={12 + index * 12}
                                                        dy={0}
                                                        textAnchor="middle"
                                                        fill="#4b5563"
                                                        fontSize={10}
                                                        fontWeight={500}
                                                    >
                                                        {line}
                                                    </text>
                                                ))}
                                            </g>
                                        );
                                    }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#4b5563', fontSize: 11 }}
                                    domain={[0, 100]}
                                    ticks={[0, 25, 50, 75, 100]}
                                    tickFormatter={(val) => `${val}%`}
                                    label={{ 
                                        value: "Percentage of Usage (%)", 
                                        angle: -90, 
                                        position: 'insideLeft', 
                                        style: { textAnchor: 'middle', fill: '#4b5563', fontSize: 11, fontWeight: 500 }
                                    }}
                                />
                                <Bar dataKey="usage" radius={[4, 4, 0, 0]} barSize={40}>
                                    {
                                        serviceUsageData.map((_entry, index) => (
                                            // The image uses a teal color with a slight gradient
                                            <Cell key={`cell-${index}`} fill="url(#tealGradient)" />
                                        ))
                                    }
                                    <LabelList 
                                        dataKey="usage" 
                                        position="top" 
                                        // @ts-expect-error - Recharts types are complex
                                        formatter={(val: string | number | null | undefined) => val != null ? `${val}%` : ''}
                                        style={{ fontSize: 11, fontWeight: 'bold', fill: '#1f2937' }}
                                        dy={-5}
                                    />
                                </Bar>
                                <defs>
                                    <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2ca8a8" />
                                        <stop offset="100%" stopColor="#1e7178" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Button */}
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
                <button 
                  className="bg-[#3FA0F6] hover:bg-[#2c8ee1] transition-colors text-white font-bold text-lg py-3 px-10 rounded-lg shadow-md w-full max-w-sm mx-auto"
                  onClick={() => navigate('/admin/financial-analysis')}
                >
                    Financial Analysis
                </button>
            </div>
            
        </div>
    );
};

export default DashboardPage;
