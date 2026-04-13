import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';
import axios from 'axios';

interface Order {
    _id: string;
    orderNo: string;
    serviceMode?: string;
    finishingType?: string;
    paymentMethod: string;
    status: string;
}

const API_BASE_URL = 'http://localhost:5000'; // Define backend URL here or use env proxy

const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'PROCESSING') return 'bg-blue-100 text-blue-800';
    if (s === 'PLACED') return 'bg-gray-800 text-white';
    if (s === 'PICK UP') return 'bg-pink-100 text-pink-800';
    if (s === 'COMPLETED' || s === 'CONFIRMED') return 'bg-green-100 text-green-800';
    if (s === 'IN PROGRESS') return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
};

const OrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);

    const [isFilterModalOpen, setFilterModalOpen] = useState(false);

    const [filterServiceMode, setFilterServiceMode] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterFinishingType, setFilterFinishingType] = useState<string[]>([]);

    useEffect(() => {
        fetchOrders();
    }, [page]);

    const fetchOrders = async (bypassFilters = false) => {
        try {
            let url = `${API_BASE_URL}/api/services/orders?page=${page}&limit=${limit}`;
            
            // Only attach filters if we are not explicitly bypassing them during a 'Clear' action
            if (!bypassFilters) {
                if (filterStatus) url += `&status=${encodeURIComponent(filterStatus)}`;
                if (filterServiceMode) url += `&serviceMode=${encodeURIComponent(filterServiceMode)}`;
                if (filterFinishingType.length > 0) {
                    url += `&finishingType=${encodeURIComponent(filterFinishingType.join(','))}`;
                }
            }

            const { data } = await axios.get(url);
            setOrders(data.orders || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        }
    };

    const handleApplyFilters = () => {
        setPage(1);
        setFilterModalOpen(false);
        fetchOrders();
    };

    const handleClearFilters = () => {
        setFilterServiceMode('');
        setFilterStatus('');
        setFilterFinishingType([]);
        setPage(1);
        setFilterModalOpen(false);
        fetchOrders(true); // Fetch immediately without filters
    };

    const toggleFinishingType = (type: string) => {
        setFilterFinishingType((prev: string[]) =>
            prev.includes(type) ? prev.filter((t: string) => t !== type) : [...prev, type]
        );
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Active Reservations Management</h1>
                <p className="text-sm text-gray-500 mt-1">Monitor and manage all current laundry orders</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-base font-semibold text-gray-800">Current Orders Queue</h2>
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Filter size={16} />
                        Filter
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Service Mode</th>
                                <th className="px-6 py-4 font-medium">Finishing Type</th>
                                <th className="px-6 py-4 font-medium">Payment Type</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right shadow-sm">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 text-sm">
                                        No active reservations found.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {order.orderNo}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.serviceMode || 'Full Service'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.finishingType || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {order.paymentMethod || 'Online'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2.5 py-1 text-xs font-semibold rounded-full tracking-wide ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#3B82F6] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                                                <Eye size={14} />
                                                More details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <span className="text-sm text-gray-500">
                        Showing {orders.length} of {total} reservations
                    </span>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p: number) => p - 1)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={page * limit >= total || orders.length === 0}
                            onClick={() => setPage((p: number) => p + 1)}
                            className="p-1.5 rounded-lg border border-gray-200 text-gray-500 disabled:opacity-30 hover:bg-gray-100 transition-colors shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Modal */}
            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h3 className="text-base font-bold text-gray-900">Filter Orders</h3>
                            <button
                                onClick={() => setFilterModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Service Mode */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                                    Service Mode
                                </h4>
                                <div className="space-y-2.5">
                                    {['Full Service', 'Self Service'].map((mode) => (
                                        <label key={mode} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="serviceMode"
                                                checked={filterServiceMode === mode}
                                                onChange={() => setFilterServiceMode(mode)}
                                                className="w-4 h-4 text-[#3B82F6] border-gray-300 focus:ring-[#3B82F6] cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                                                {mode}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Finishing Type */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                                    Finishing Type
                                </h4>
                                <div className="space-y-2.5">
                                    {['Pressed', 'Folded', 'Hanged'].map((type) => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={filterFinishingType.includes(type)}
                                                onChange={() => toggleFinishingType(type)}
                                                className="w-4 h-4 text-[#3B82F6] border-gray-300 rounded focus:ring-[#3B82F6] cursor-pointer"
                                            />
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Status */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">
                                    Status
                                </h4>
                                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                                    {['Placed', 'Confirmed', 'Processing', 'Pick Up', 'In Progress', 'Completed'].map(
                                        (status) => (
                                            <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    checked={filterStatus === status}
                                                    onChange={() => setFilterStatus(status)}
                                                    className="w-4 h-4 text-[#3B82F6] border-gray-300 focus:ring-[#3B82F6] cursor-pointer"
                                                />
                                                <span className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                                                    {status}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80">
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 shadow-sm transition-colors"
                            >
                                Clear
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#3B82F6] rounded-lg hover:bg-blue-600 shadow-sm transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
