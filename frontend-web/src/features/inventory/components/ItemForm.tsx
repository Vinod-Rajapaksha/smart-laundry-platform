import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, RotateCw } from 'lucide-react';
import type { InventoryItem, InventoryErrors } from '../types';
import { supplierApi } from '../../supplier/api/supplierApi';

interface ItemFormProps {
    initialItem: Partial<InventoryItem>;
    isEditing: boolean;
    categories: string[];
    onClose: () => void;
    onSave: (item: Partial<InventoryItem>) => Promise<InventoryErrors | void> | InventoryErrors | void;
}

export function ItemForm({
    initialItem,
    isEditing,
    categories,
    onClose,
    onSave
}: ItemFormProps) {
    const [newItem, setNewItem] = useState<Partial<InventoryItem>>(initialItem);
    const [errors, setErrors] = useState<InventoryErrors>({});
    const [suppliers, setSuppliers] = useState<{_id: string, name: string}[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const parseAmount = (str = '') => { const m = str.match(/[\d.]+/); return m ? m[0] : ''; };
    const parseUnit = (str = '') => { const m = str.match(/[a-zA-Z]+/); return m ? m[0] : 'units'; };

    useEffect(() => {
        const fetchSuppliersData = async () => {
            try {
                const data = await supplierApi.getSuppliers();
                setSuppliers(data);
            } catch (err) {
                console.error('Failed to fetch suppliers', err);
            }
        };
        fetchSuppliersData();
    }, []);

    useEffect(() => {
        setNewItem(initialItem);
        setErrors({});
    }, [initialItem]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: InventoryErrors = {};
        if (!newItem.id?.trim()) newErrors.id = 'Item ID is required';
        if (!newItem.name?.trim()) newErrors.name = 'Item Name is required';
        if (!newItem.category) newErrors.category = 'Category is required';
        
        const priceNum = parseFloat(newItem.price || '');
        if (!newItem.price || isNaN(priceNum) || priceNum < 0) {
            newErrors.price = 'Valid price is required';
        }
        
        const stockNum = parseFloat(parseAmount(newItem.stock) || '');
        if (!newItem.stock || isNaN(stockNum) || stockNum < 0) {
            newErrors.stock = 'Valid stock is required';
        }
        
        const thresholdNum = parseFloat(parseAmount(newItem.threshold) || '');
        if (!newItem.threshold || isNaN(thresholdNum) || thresholdNum < 0) {
            newErrors.threshold = 'Valid threshold is required';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSaving(true);
        try {
            const saveErrors = await onSave(newItem);
            if (saveErrors) {
                setErrors((prev) => ({ ...prev, ...saveErrors }));
                setIsSaving(false);
            }
            // onClose is usually handled by the parent on successful onSave
        } catch (err) {
            console.error('Save failed', err);
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden transform transition-all">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-start bg-white">
                    <div>
                        <h3 className="text-xl font-extrabold text-gray-900">{isEditing ? 'Edit Inventory Item' : 'Register New Item'}</h3>
                        <p className="text-sm text-gray-500 mt-1 font-medium">{isEditing ? 'Update the details below to keep stock accurate.' : 'Fill out the form below to add a new inventory item.'}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200" type="button">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-5 bg-[#FAFAFA]">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Item ID <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 bg-white border ${errors.id ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl text-sm focus:ring-4 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm hover:border-gray-300`}
                                placeholder="e.g. 008"
                                value={newItem.id}
                                onChange={e => { setNewItem({ ...newItem, id: e.target.value }); if (errors.id) setErrors({ ...errors, id: undefined }) }}
                            />
                            {errors.id && <p className="text-[12px] text-red-500 font-medium mt-1 pl-1 flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1" />{errors.id}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Item Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 bg-white border ${errors.name ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl text-sm focus:ring-4 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm hover:border-gray-300`}
                                placeholder="e.g. Lavender Liquid"
                                value={newItem.name}
                                onChange={e => { setNewItem({ ...newItem, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }) }}
                            />
                            {errors.name && <p className="text-[12px] text-red-500 font-medium mt-1 pl-1 flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1" />{errors.name}</p>}
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700">Category <span className="text-red-500">*</span></label>
                            <select
                                className={`w-full px-4 py-3 bg-white border ${errors.category ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl text-sm focus:ring-4 outline-none transition-all font-medium text-gray-900 shadow-sm hover:border-gray-300 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-[right_1rem_center] bg-no-repeat`}
                                value={newItem.category || ''}
                                onChange={e => { setNewItem({ ...newItem, category: e.target.value }); if (errors.category) setErrors({ ...errors, category: undefined }) }}
                            >
                                <option value="" disabled>Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-[12px] text-red-500 font-medium mt-1 pl-1 flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1" />{errors.category}</p>}
                        </div>
                        
                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700">Supplier (Optional)</label>
                            <select
                                className={`w-full px-4 py-3 bg-white border border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl text-sm focus:ring-4 outline-none transition-all font-medium text-gray-900 shadow-sm hover:border-gray-300 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1.2em_1.2em] bg-[right_1rem_center] bg-no-repeat`}
                                value={newItem.supplierId || ''}
                                onChange={e => setNewItem({ ...newItem, supplierId: e.target.value })}
                            >
                                <option value="">No Supplier Selected</option>
                                {suppliers.map(sup => (
                                    <option key={sup._id} value={sup._id}>{sup.name}</option>
                                ))}
                            </select>
                            <p className="text-[12px] text-gray-500 font-medium mt-1 pl-1">Selecting a supplier enables automatic restock emails.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Price (Rs.) <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 bg-white border ${errors.price ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl text-sm focus:ring-4 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm hover:border-gray-300`}
                                placeholder="0"
                                value={newItem.price || ''}
                                onChange={e => { setNewItem({ ...newItem, price: e.target.value }); if (errors.price) setErrors({ ...errors, price: undefined }) }}
                            />
                            {errors.price && <p className="text-[12px] text-red-500 font-medium mt-1 pl-1 flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1" />{errors.price}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Current Stock <span className="text-red-500">*</span></label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className={`w-2/3 px-4 py-3 bg-white border ${errors.stock ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl text-sm focus:ring-4 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm hover:border-gray-300`}
                                    placeholder="0"
                                    value={parseAmount(newItem.stock)}
                                    onChange={e => {
                                        const val = e.target.value;
                                        const unit = parseUnit(newItem.stock);
                                        setNewItem({ ...newItem, stock: val ? `${val} ${unit}` : '' });
                                        if (errors.stock) setErrors({ ...errors, stock: undefined });
                                    }}
                                />
                                <select
                                    className={`w-1/3 px-2 py-3 bg-white border ${errors.stock ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl text-sm focus:ring-4 outline-none transition-all font-medium text-gray-900 shadow-sm hover:border-gray-300`}
                                    value={parseUnit(newItem.stock)}
                                    onChange={e => {
                                        const unit = e.target.value;
                                        const val = parseAmount(newItem.stock);
                                        const threshVal = parseAmount(newItem.threshold);
                                        setNewItem({ 
                                            ...newItem, 
                                            stock: val ? `${val} ${unit}` : `0 ${unit}`,
                                            threshold: threshVal ? `${threshVal} ${unit}` : `0 ${unit}`
                                        });
                                        if (errors.stock) setErrors({ ...errors, stock: undefined });
                                        if (errors.threshold) setErrors({ ...errors, threshold: undefined });
                                    }}
                                >
                                    <option value="L">L</option>
                                    <option value="mL">mL</option>
                                    <option value="Kg">Kg</option>
                                    <option value="g">g</option>
                                    <option value="units">units</option>
                                </select>
                            </div>
                            {errors.stock && <p className="text-[12px] text-red-500 font-medium mt-1 pl-1 flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1" />{errors.stock}</p>}
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700">Alert Threshold <span className="text-red-500">*</span></label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className={`w-2/3 px-4 py-3 bg-white border ${errors.threshold ? 'border-red-400 focus:ring-red-500/20' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/20'} rounded-xl text-sm focus:ring-4 outline-none transition-all placeholder-gray-400 font-medium text-gray-900 shadow-sm hover:border-gray-300`}
                                    placeholder="0"
                                    value={parseAmount(newItem.threshold)}
                                    onChange={e => {
                                        const val = e.target.value;
                                        const unit = parseUnit(newItem.threshold);
                                        setNewItem({ ...newItem, threshold: val ? `${val} ${unit}` : '' });
                                        if (errors.threshold) setErrors({ ...errors, threshold: undefined });
                                    }}
                                />
                                <div className={`w-1/3 px-4 py-3 bg-gray-50 border ${errors.threshold ? 'border-red-400' : 'border-gray-200'} rounded-xl text-sm font-medium text-gray-500 flex items-center`}>
                                    {parseUnit(newItem.stock)}
                                </div>
                            </div>
                            {errors.threshold && <p className="text-[12px] text-red-500 font-medium mt-1 pl-1 flex items-center"><AlertTriangle className="h-3.5 w-3.5 mr-1" />{errors.threshold}</p>}
                        </div>
                    </div>

                    <div className="pt-6 flex items-center justify-end space-x-4 mt-8 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-tr from-blue-600 to-blue-500 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/50 transition-all flex items-center transform hover:-translate-y-0.5 active:translate-y-0 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSaving ? (
                                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            {isSaving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Confirm Registration')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
