import React, { useState } from 'react';
import { createSupplier, updateSupplier } from '../api/supplier.api';

interface FormErrors {
  name?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function SupplierForm({ supplier, onClose, onSuccess }: { supplier?: any, onClose: () => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contactPerson: supplier?.contactPerson || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    status: supplier?.status || 'Active',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const e: FormErrors = {};

    // Company Name
    if (!formData.name.trim()) {
      e.name = 'Company name is required.';
    } else if (formData.name.trim().length < 2) {
      e.name = 'Company name must be at least 2 characters.';
    } else if (formData.name.trim().length > 100) {
      e.name = 'Company name must not exceed 100 characters.';
    } else if (!/^[a-zA-Z0-9 &.,'\-]+$/.test(formData.name.trim())) {
      e.name = 'Company name contains invalid characters.';
    }

    // Contact Person
    if (!formData.contactPerson.trim()) {
      e.contactPerson = 'Contact person name is required.';
    } else if (formData.contactPerson.trim().length < 2) {
      e.contactPerson = 'Name must be at least 2 characters.';
    } else if (formData.contactPerson.trim().length > 80) {
      e.contactPerson = 'Name must not exceed 80 characters.';
    } else if (!/^[a-zA-Z\s.'\-]+$/.test(formData.contactPerson.trim())) {
      e.contactPerson = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
    }

    // Email
    if (!formData.email.trim()) {
      e.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email.trim())) {
      e.email = 'Enter a valid email address (e.g. name@example.com).';
    }

    // Phone – accepts 0771234567 or +94771234567
    const rawPhone = formData.phone.trim().replace(/[\s\-()+]/g, '');
    if (!formData.phone.trim()) {
      e.phone = 'Phone number is required.';
    } else if (!/^\d+$/.test(rawPhone)) {
      e.phone = 'Phone number must contain only digits, spaces, or +/-.';
    } else if (rawPhone.length < 9 || rawPhone.length > 12) {
      e.phone = 'Phone number must be 9–12 digits (e.g. 0771234567).';
    } else if (!/^(94|0)[0-9]{8,9}$/.test(rawPhone)) {
      e.phone = 'Enter a valid Sri Lankan phone number (e.g. 0771234567 or +94771234567).';
    }

    // Address
    if (!formData.address.trim()) {
      e.address = 'Address is required.';
    } else if (formData.address.trim().length < 5) {
      e.address = 'Address must be at least 5 characters.';
    } else if (formData.address.trim().length > 250) {
      e.address = 'Address must not exceed 250 characters.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Per-field change handler (clears error on edit) ───────────────────────
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (supplier && supplier._id) {
        await updateSupplier(supplier._id, formData);
      } else {
        await createSupplier(formData);
      }
      onSuccess();
    } catch (err: any) {
      alert(err.message || 'Error occurred while saving supplier.');
    } finally {
      setLoading(false);
    }
  };

  // ── Dynamic input class ───────────────────────────────────────────────────
  const inputCls = (field: keyof FormErrors) =>
    `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
      errors[field]
        ? 'border-red-400 bg-red-50 focus:ring-red-300'
        : 'border-gray-300 focus:ring-blue-500'
    }`;

  return (
    // ── Backdrop: blur instead of solid black ─────────────────────────────
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-5 text-gray-800">
          {supplier ? 'Edit Supplier' : 'Register New Supplier'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. ABC Supplies Ltd."
              className={inputCls('name')}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">⚠ {errors.name}</p>}
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.contactPerson}
              onChange={e => handleChange('contactPerson', e.target.value)}
              placeholder="e.g. John Silva"
              className={inputCls('contactPerson')}
            />
            {errors.contactPerson && <p className="mt-1 text-xs text-red-500">⚠ {errors.contactPerson}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              placeholder="e.g. contact@supplier.com"
              className={inputCls('email')}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">⚠ {errors.email}</p>}
          </div>

          {/* Phone + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="e.g. 0771234567"
                maxLength={15}
                className={inputCls('phone')}
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">⚠ {errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="e.g. 123 Main St, Colombo 03"
              rows={3}
              className={inputCls('address')}
            />
            {errors.address && <p className="mt-1 text-xs text-red-500">⚠ {errors.address}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
