import React, { useState, useEffect } from 'react';
import { getSuppliers } from '../../supplier/api/supplier.api';

export default function ItemForm({ item, onClose, onSubmit }: any) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    categoryName: item?.categoryName || 'Detergents',
    unitPrice: item?.unitPrice || 0,
    qtyInStock: item?.qtyInStock || 0,
    reorderLevel: item?.reorderLevel || 0,
    unit: item?.unit || 'L',
    supplierId: item?.supplierId || '',
    isActive: item?.isActive ?? true
  });
  const [suppliers, setSuppliers] = useState([]);
  
  useEffect(() => {
    getSuppliers().then(data => setSuppliers(data || [])).catch(console.error);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{item ? 'Edit Item' : 'Register New Item'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Item Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
              <select value={formData.categoryName} onChange={e => setFormData({...formData, categoryName: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="Detergents">Detergents</option>
                <option value="Fabric Care">Fabric Care</option>
                <option value="Stain Removal">Stain Removal</option>
                <option value="Finishing">Finishing</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Price ($)</label>
              <input type="number" required value={formData.unitPrice as number} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Stock</label>
              <input type="number" required value={formData.qtyInStock as number} onChange={e => setFormData({...formData, qtyInStock: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Unit</label>
              <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="L">L</option>
                <option value="KG">KG</option>
                <option value="PCS">units</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-red-600">Threshold (Reorder)</label>
              <input type="number" required value={formData.reorderLevel as number} onChange={e => setFormData({...formData, reorderLevel: Number(e.target.value)})} className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">Primary Supplier</label>
              <select required value={formData.supplierId} onChange={e => setFormData({...formData, supplierId: e.target.value})} className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50">
                <option value="">Select a Supplier</option>
                {suppliers.map((s: any) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 hover:bg-gray-100 text-gray-600 font-medium rounded-lg transition">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Save Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}
