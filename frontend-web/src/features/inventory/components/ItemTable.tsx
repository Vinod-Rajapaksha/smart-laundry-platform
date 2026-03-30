import { Package, Plus, Search } from 'lucide-react';
import type { InventoryItem } from '../types';

interface ItemTableProps {
    items: InventoryItem[];
    filteredItems: InventoryItem[];
    categories: string[];
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    setIsCategoryModalOpen: (open: boolean) => void;
    onRegisterClick: () => void;
    onEditClick: (item: InventoryItem) => void;
    onDeleteClick: (id: string) => void;
}

export function ItemTable({
    filteredItems,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    onSearchChange,
    setIsCategoryModalOpen,
    onRegisterClick,
    onEditClick,
    onDeleteClick
}: ItemTableProps) {
    const parseNum = (str: string) => parseInt(str.replace(/[^\d.-]/g, ''), 10);

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 border-b border-gray-200/50 pb-2">
                <div className="flex space-x-2 overflow-x-auto smooth-scrollbar">
                    {['All', ...categories].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-[#3B82F6] text-white shadow-md shadow-blue-500/20' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="flex items-center justify-center space-x-1 px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full text-[13px] font-bold transition-colors shadow-sm shrink-0"
                >
                    <span>Manage Categories</span>
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between bg-white border-b border-gray-100 rounded-t-xl gap-4">
                    <h2 className="text-xl font-extrabold text-[#111827] hidden sm:block">Current Inventory</h2>
                    <div className="relative w-full sm:w-72 border border-gray-200 rounded-lg shadow-sm sm:ml-auto">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="pl-10 pr-4 py-2 bg-transparent text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full font-medium transition-all"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={onRegisterClick}
                        className="group relative flex items-center justify-center space-x-2 bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-[13px] font-bold transition-all duration-300 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
                        <span>Register New Item</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">ITEM ID</th>
                                <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">NAME</th>
                                <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">CATEGORY</th>
                                <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">PRICE</th>
                                <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">STOCK</th>
                                <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap">THRESHOLD</th>
                                <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap text-center">STATUS</th>
                                <th className="px-5 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 whitespace-nowrap text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="text-[13px] bg-white">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => {
                                    const isLowStock = parseNum(item.stock) <= parseNum(item.threshold);

                                    return (
                                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-5 py-5 font-bold text-[#111827]">{item.id}</td>
                                            <td className="px-5 py-5 font-medium text-gray-500">{item.name}</td>
                                            <td className="px-5 py-5">
                                                <span className="inline-flex items-center px-3 py-1 bg-gray-100/80 text-gray-600 rounded-full text-[11px] font-bold">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-5 py-5 font-medium text-gray-500">${item.price}</td>
                                            <td className="px-5 py-5">
                                                <span className="font-bold text-gray-900">{item.stock}</span>
                                            </td>
                                            <td className="px-5 py-5">
                                                <span className="font-medium text-gray-500">{item.threshold}</span>
                                            </td>
                                            <td className="px-5 py-5 text-center">
                                                {isLowStock ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-600">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-600">
                                                        In Stock
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-5 space-x-4 text-center">
                                                <button onClick={() => onEditClick(item)} className="text-[12px] font-bold text-[#2563EB] hover:text-blue-800 transition-colors">Edit</button>
                                                <button onClick={() => onDeleteClick(item.id)} className="text-[12px] font-bold text-[#EF4444] hover:text-red-800 transition-colors">Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 border-b border-gray-100">
                                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p>No inventory items found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
