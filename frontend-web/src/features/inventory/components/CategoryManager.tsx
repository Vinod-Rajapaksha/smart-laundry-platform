import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

interface CategoryManagerProps {
    categories: string[];
    onClose: () => void;
    onAddCategory: (categoryName: string) => void;
    onDeleteCategory: (categoryName: string) => void;
}

export function CategoryManager({
    categories,
    onClose,
    onAddCategory,
    onDeleteCategory
}: CategoryManagerProps) {
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        onAddCategory(newCategoryName);
        setNewCategoryName('');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="bg-white rounded-[1.5rem] shadow-2xl w-full max-w-md relative z-10 overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <h3 className="text-xl font-extrabold text-gray-900">Manage Categories</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 bg-[#FAFAFA] flex-1 overflow-y-auto">
                    <form onSubmit={handleAdd} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="New category label..."
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:border-blue-500 focus:ring-blue-500/20 outline-none transition-all shadow-sm font-medium"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                        />
                        <button type="submit" className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-md transition-colors whitespace-nowrap">
                            Add
                        </button>
                    </form>

                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Existing Categories</p>
                        {categories.map(cat => (
                            <div key={cat} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-xl shadow-sm hover:border-gray-300 transition-colors">
                                <span className="text-sm font-semibold text-gray-800">{cat}</span>
                                <button
                                    type="button"
                                    onClick={() => onDeleteCategory(cat)}
                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Delete category"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">No categories found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
