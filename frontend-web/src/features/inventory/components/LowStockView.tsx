import React, { useState } from 'react';
import { Search, AlertCircle, X, Package } from 'lucide-react';
import type { InventoryItem } from '../types';

interface LowStockViewProps {
    items: InventoryItem[];
    onBack: () => void;
    onRestockSubmit: (item: InventoryItem, amount: number) => Promise<void>;
}

export function LowStockView({ items, onBack, onRestockSubmit }: LowStockViewProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [restockModalOpen, setRestockModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [restockAmount, setRestockAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const parseNum = (str: string) => parseInt(str.replace(/[^\d.-]/g, ''), 10);

    const lowStockItems = items.filter(item => parseNum(item.stock) <= parseNum(item.threshold));

    const filteredItems = lowStockItems.filter(item =>
        (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.id?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    const handleRestockClick = (item: InventoryItem) => {
        setSelectedItem(item);
        setRestockAmount('');
        setRestockModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem || !restockAmount) return;

        setIsSubmitting(true);
        try {
            await onRestockSubmit(selectedItem, Number(restockAmount));
            setRestockModalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                        ← Back to Dashboard
                    </button>
                    <h2 className="text-2xl font-extrabold text-[#111827]">Low-Stock Alerts</h2>
                </div>
                <div className="relative w-full sm:w-72 border border-gray-200 rounded-lg shadow-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        className="pl-10 pr-4 py-2 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full font-medium transition-all rounded-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <div key={item.id} className="bg-[#EAF1FB] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#D5E4F7]">
                            <div className="flex items-center space-x-4">
                                <div className="bg-red-500 rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                                    <span className="text-white font-black text-lg leading-none mt-[-2px]">!</span>
                                </div>
                                <span className="font-bold text-[#111827] text-base">{item.name}</span>
                            </div>

                            <div className="text-gray-500 font-medium text-sm flex-1 sm:text-center">
                                Monitoring: {item.stock} <span className="mx-2 text-gray-300">|</span> Threshold: {item.threshold}
                            </div>

                            <button
                                onClick={() => handleRestockClick(item)}
                                className="bg-[#E1E7EF] hover:bg-[#D1D8E0] text-[#111827] font-bold px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
                            >
                                Restock
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Low Stock Items</h3>
                        <p className="text-gray-500">All inventory levels are looking healthy.</p>
                    </div>
                )}
            </div>

            {/* Restock Modal */}
            {restockModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-extrabold text-gray-900">Restock {selectedItem.name}</h3>
                            <button onClick={() => setRestockModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-5">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500 font-medium">Current Stock:</span>
                                        <span className="font-bold text-gray-900">{selectedItem.stock}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Threshold:</span>
                                        <span className="font-bold text-gray-900">{selectedItem.threshold}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold text-gray-700 mb-2">Amount to Add</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="any"
                                            required
                                            value={restockAmount}
                                            onChange={(e) => setRestockAmount(e.target.value)}
                                            className="w-full pl-4 pr-16 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                                            placeholder="e.g. 50"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                                            {selectedItem.stock.split(' ')[1] || 'units'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 font-medium">
                                        This will immediately add to the existing {selectedItem.stock}.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setRestockModalOpen(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl text-[13px] font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-[#2563EB] text-white rounded-xl text-[13px] font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Processing...' : 'Confirm Restock'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
