import { useState, useEffect } from 'react';
import {
    Bell, Package, AlertTriangle, TrendingDown,
    LayoutDashboard, Users, ShoppingBag, Landmark, Activity,
    Megaphone, MessageSquare, Truck, BarChart2, LogOut
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import type { InventoryItem } from '../types';
import { ItemTable } from '../components/ItemTable';
import { ItemForm } from '../components/ItemForm';
import { CategoryManager } from '../components/CategoryManager';
import {
    fetchInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    fetchCategories,
    createCategory,
    deleteCategory
} from '../api/api';

export function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [itemsData, catsData] = await Promise.all([
                    fetchInventory(),
                    fetchCategories()
                ]);
                setItems(itemsData);
                setCategories(catsData);
            } catch (error) {
                toast.error('Failed to load inventory data');
            }
        };
        loadData();
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [initialFormItem, setInitialFormItem] = useState<Partial<InventoryItem>>({ id: '', name: '', category: '', price: '', stock: '', threshold: '' });

    const parseNum = (str: string) => parseInt(str.replace(/[^\d.-]/g, ''), 10);
    const lowStockItems = items.filter(item => parseNum(item.stock) <= parseNum(item.threshold)).length;
    const recentDeductions = 14;

    const getNextItemId = () => {
        if (items.length === 0) return '001';
        const ids = items.map(item => {
            const match = item.id.match(/\d+/);
            return match ? parseInt(match[0], 10) : 0;
        });
        const maxId = Math.max(...ids);
        return String(maxId + 1).padStart(3, '0');
    };

    const handleAddCategory = async (categoryName: string) => {
        const trimmed = categoryName.trim();
        if (!trimmed) return;
        if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
            toast.error('Category already exists');
            return;
        }
        try {
            const added = await createCategory(trimmed);
            setCategories([...categories, added]);
            toast.success('Category added');
        } catch (err) {
            toast.error('Failed to create category');
        }
    };

    const handleDeleteCategory = async (catToDelete: string) => {
        if (window.confirm(`Delete category "${catToDelete}"? Items in it won't be deleted but might need recategorization.`)) {
            try {
                await deleteCategory(catToDelete);
                setCategories(categories.filter(c => c !== catToDelete));
                if (activeCategory === catToDelete) setActiveCategory('All');
                toast.success('Category deleted');
            } catch (err) {
                toast.error('Failed to delete category');
            }
        }
    };

    const handleSaveItem = async (newItemData: Partial<InventoryItem>) => {
        try {
            if (editingItem) {
                const isDupe = items.some(i => i.id === newItemData.id && i.id !== editingItem.id);
                if (isDupe) return { id: 'Item ID already exists' };

                const updated = await updateInventoryItem(editingItem.id, newItemData);
                setItems(items.map(item => item.id === editingItem.id ? updated : item));
                toast.success('Item updated successfully!');
            } else {
                const isDupe = items.some(i => i.id === newItemData.id);
                if (isDupe) return { id: 'Item ID already exists' };

                const created = await createInventoryItem(newItemData);
                setItems([...items, created]);
                toast.success('Item registered successfully!');
            }
            setIsModalOpen(false);
            setEditingItem(null);
        } catch (err) {
            toast.error('Failed to save item');
        }
    };

    const openRegisterModal = () => {
        setEditingItem(null);
        setInitialFormItem({ id: getNextItemId(), name: '', category: activeCategory === 'All' ? '' : activeCategory, price: '', stock: '', threshold: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (item: InventoryItem) => {
        setEditingItem(item);
        setInitialFormItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteItem = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteInventoryItem(id);
                setItems(items.filter(item => item.id !== id));
                toast.success('Item deleted successfully');
            } catch (err) {
                toast.error('Failed to delete item');
            }
        }
    };

    const filteredItems = items.filter(item => {
        const query = (searchQuery || '').toLowerCase();
        const matchesSearch = String(item.name || '').toLowerCase().includes(query) ||
            String(item.id || '').toLowerCase().includes(query);
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
            <Toaster position="top-right" />

            {/* Sidebar - Remains identical */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex shrink-0">
                <div>
                    <div className="h-20 flex items-center px-6 border-b border-gray-100">
                        <div className="bg-[#3B82F6] p-2 rounded-lg mr-3 shadow-sm flex items-center justify-center">
                            <div className="border border-white rounded h-5 w-5 flex items-center justify-center">
                                <div className="bg-white h-2 w-2 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-gray-900 tracking-wider">B & W LAUNDRY</h2>
                            <p className="text-xs text-gray-400">Admin Portal</p>
                        </div>
                    </div>
                    <nav className="p-4 space-y-1">
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <LayoutDashboard className="h-4 w-4 mr-3 text-gray-400" /> Dashboard
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <Users className="h-4 w-4 mr-3 text-gray-400" /> Customers
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <ShoppingBag className="h-4 w-4 mr-3 text-gray-400" /> Orders
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <Landmark className="h-4 w-4 mr-3 text-gray-400" /> Bank Verification
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-[13px] font-semibold transition-colors relative">
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-blue-600 rounded-l-lg"></div>
                            <Package className="h-4 w-4 mr-3 text-blue-600" /> Inventory
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <Activity className="h-4 w-4 mr-3 text-gray-400" /> Update Status
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <Megaphone className="h-4 w-4 mr-3 text-gray-400" /> Promotions
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <MessageSquare className="h-4 w-4 mr-3 text-gray-400" /> Feedbacks
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <Truck className="h-4 w-4 mr-3 text-gray-400" /> Deliveries
                        </a>
                        <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg text-[13px] font-medium transition-colors">
                            <BarChart2 className="h-4 w-4 mr-3 text-gray-400" /> Reports
                        </a>
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`} alt="avatar" className="h-full w-full object-cover" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900 leading-tight">BW Laundry</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center text-gray-900 font-bold text-[15px]">
                        <div className="mr-2 text-[#3B82F6]">
                            <Package className="h-5 w-5 fill-[#DBEAFE] stroke-[#3B82F6]" />
                        </div>
                        Inventory
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="relative text-[#3B82F6] hover:text-blue-700">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-gray-900 leading-tight">BW Laundry</p>
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Admin`} alt="avatar" className="h-full w-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto px-10 py-8 bg-[#F8FAFC]">
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Inventory Dashboard</h1>
                            <p className="text-[15px] text-gray-500 mt-1 font-medium">Manage state, items, and track stock levels.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-5 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-gray-500 mb-0.5">Total Items Registered</p>
                                <h3 className="text-2xl font-bold text-gray-900">{items.length}</h3>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-5 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <div className="p-3 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-gray-500 mb-0.5">Low Stock Alerts</p>
                                <h3 className="text-2xl font-bold text-gray-900">{lowStockItems}</h3>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-5 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                            <div className="p-3 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <TrendingDown className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-gray-500 mb-0.5">Recent Deductions</p>
                                <h3 className="text-2xl font-bold text-gray-900">{recentDeductions}</h3>
                            </div>
                        </div>
                    </div>

                    <ItemTable
                        items={items}
                        filteredItems={filteredItems}
                        categories={categories}
                        activeCategory={activeCategory}
                        setActiveCategory={setActiveCategory}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        setIsCategoryModalOpen={setIsCategoryModalOpen}
                        onRegisterClick={openRegisterModal}
                        onEditClick={openEditModal}
                        onDeleteClick={handleDeleteItem}
                    />

                    <div className="text-center text-[11px] text-[#A1A1AA] font-semibold mt-8 mb-4">
                        © 2026 B & W Laundry Services. All rights reserved.
                    </div>
                </main>
            </div>

            {isCategoryModalOpen && (
                <CategoryManager
                    categories={categories}
                    onClose={() => setIsCategoryModalOpen(false)}
                    onAddCategory={handleAddCategory}
                    onDeleteCategory={handleDeleteCategory}
                />
            )}

            {isModalOpen && (
                <ItemForm
                    initialItem={initialFormItem}
                    isEditing={!!editingItem}
                    categories={categories}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveItem}
                />
            )}
        </div>
    );
}
