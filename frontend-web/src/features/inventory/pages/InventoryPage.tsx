import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import type { InventoryItem } from '../types';
import { ItemTable } from '../components/ItemTable';
import { ItemForm } from '../components/ItemForm';
import { CategoryManager } from '../components/CategoryManager';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import {
    fetchInventory,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    fetchCategories,
    createCategory,
    deleteCategory,
    fetchRecentDeductionsCount,
    restockInventoryItem
} from '../api/api';
import { LowStockView } from '../components/LowStockView';

export function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [recentDeductions, setRecentDeductions] = useState(0);
    
    // Deletion states
    const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [itemsData, catsData, decCount] = await Promise.all([
                    fetchInventory(),
                    fetchCategories(),
                    fetchRecentDeductionsCount()
                ]);
                setItems(itemsData);
                setCategories(catsData);
                setRecentDeductions(decCount);
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
    const [activeView, setActiveView] = useState<'dashboard' | 'low-stock'>('dashboard');

    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [initialFormItem, setInitialFormItem] = useState<Partial<InventoryItem>>({ id: '', name: '', category: '', price: '', stock: '', threshold: '' });

    const parseNum = (str: string) => parseInt(str.replace(/[^\d.-]/g, ''), 10);
    const lowStockItems = items.filter(item => parseNum(item.stock) <= parseNum(item.threshold)).length;

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

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        try {
            await deleteCategory(categoryToDelete);
            setCategories(categories.filter(c => c !== categoryToDelete));
            if (activeCategory === categoryToDelete) setActiveCategory('All');
            toast.success('Category deleted');
        } catch (err) {
            toast.error('Failed to delete category');
        } finally {
            setIsDeleteCategoryModalOpen(false);
            setCategoryToDelete(null);
        }
    };

    const openDeleteCategoryConfirm = (cat: string) => {
        setCategoryToDelete(cat);
        setIsDeleteCategoryModalOpen(true);
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

    const handleDeleteItem = async () => {
        if (!itemToDelete) return;
        try {
            await deleteInventoryItem(itemToDelete);
            setItems(items.filter(item => item.id !== itemToDelete));
            toast.success('Item deleted successfully');
        } catch (err) {
            toast.error('Failed to delete item');
        } finally {
            setIsDeleteItemModalOpen(false);
            setItemToDelete(null);
        }
    };

    const openDeleteItemConfirm = (id: string) => {
        setItemToDelete(id);
        setIsDeleteItemModalOpen(true);
    };

    const handleRestockSubmit = async (item: InventoryItem, amount: number) => {
        try {
            const unit = item.stock.split(' ')[1] || 'units';
            const updated = await restockInventoryItem(item.id, amount, unit);
            setItems(items.map(i => i.id === item.id ? updated : i));
            toast.success(`Successfully restocked ${amount} ${unit} to ${item.name}`);
        } catch (error: any) {
            toast.error(error.message || 'Failed to restock');
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
        <div className="w-full text-gray-800 px-4 sm:px-8 py-6">
            <Toaster position="top-right" />

            <div>
                    {activeView === 'dashboard' ? (
                        <>
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

                                <div onClick={() => setActiveView('low-stock')} className="bg-yellow-50 rounded-2xl p-6 shadow-sm border border-yellow-200 cursor-pointer flex items-center space-x-5 relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <div className="p-3 bg-yellow-100/80 text-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                                onDeleteClick={openDeleteItemConfirm}
                            />
                        </>
                    ) : (
                        <LowStockView
                            items={items}
                            onBack={() => setActiveView('dashboard')}
                            onRestockSubmit={handleRestockSubmit}
                        />
                    )}

            </div>

            {isCategoryModalOpen && (
                <CategoryManager
                    categories={categories}
                    onClose={() => setIsCategoryModalOpen(false)}
                    onAddCategory={handleAddCategory}
                    onDeleteCategory={openDeleteCategoryConfirm}
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

            <ConfirmDialog
                open={isDeleteItemModalOpen}
                title="Delete Inventory Item"
                description="Are you sure you want to delete this inventory item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteItem}
                onCancel={() => {
                    setIsDeleteItemModalOpen(false);
                    setItemToDelete(null);
                }}
            />

            <ConfirmDialog
                open={isDeleteCategoryModalOpen}
                title="Delete Category"
                description={`Are you sure you want to delete the category "${categoryToDelete}"? Items in this category will not be deleted but may require recategorization.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteCategory}
                onCancel={() => {
                    setIsDeleteCategoryModalOpen(false);
                    setCategoryToDelete(null);
                }}
            />
        </div>
    );
}
