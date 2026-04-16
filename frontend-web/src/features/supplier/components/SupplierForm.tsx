import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Supplier } from '../types';

interface SupplierFormProps {
  initialData: Partial<Supplier>;
  isEditing: boolean;
  onClose: () => void;
  onSave: (data: Supplier) => void;
}

export function SupplierForm({
  initialData,
  isEditing,
  onClose,
  onSave
}: SupplierFormProps) {
  const [formData, setFormData] = useState<Partial<Supplier>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.address) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData as Supplier);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Supplier Name</label>
            <input
              type="text"
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]`}
              placeholder="e.g. Acme Supplies Ltd"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-xs text-red-500 font-medium pl-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]`}
                placeholder="supplier@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-xs text-red-500 font-medium pl-1">{errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input
                type="text"
                className={`w-full px-4 py-2.5 rounded-xl border ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]`}
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {errors.phone && <p className="text-xs text-red-500 font-medium pl-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Business Address</label>
            <textarea
              className={`w-full px-4 py-2.5 rounded-xl border ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-[15px]`}
              placeholder="123 Business St, City, Country"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            {errors.address && <p className="text-xs text-red-500 font-medium pl-1">{errors.address}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              {isEditing ? 'Update Supplier' : 'Register Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
