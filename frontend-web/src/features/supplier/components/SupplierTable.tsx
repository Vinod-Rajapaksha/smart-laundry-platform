import React from 'react';
import { deleteSupplier } from '../api/supplier.api';

export default function SupplierTable({ suppliers, onEdit, refresh }: { suppliers: any[], onEdit: (s:any) => void, refresh: () => void }) {
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      await deleteSupplier(id);
      refresh();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs font-semibold tracking-wide text-gray-500 uppercase border-b border-gray-200">
            <th className="px-4 py-3">NAME</th>
            <th className="px-4 py-3">CONTACT PERSON</th>
            <th className="px-4 py-3">EMAIL</th>
            <th className="px-4 py-3">PHONE</th>
            <th className="px-4 py-3">STATUS</th>
            <th className="px-4 py-3 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {suppliers.map((s, idx) => (
            <tr key={s._id} className="text-gray-700 text-sm hover:bg-gray-50 transition">
              <td className="px-4 py-4 font-medium text-gray-800">{s.name}</td>
              <td className="px-4 py-4">{s.contactPerson}</td>
              <td className="px-4 py-4">{s.email}</td>
              <td className="px-4 py-4">{s.phone}</td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {s.status}
                </span>
              </td>
              <td className="px-4 py-4 text-right flex justify-end space-x-3">
                <button onClick={() => onEdit(s)} className="text-blue-600 hover:text-blue-800 font-semibold transition">
                  Edit
                </button>
                <button onClick={() => handleDelete(s._id)} className="text-red-500 hover:text-red-700 font-semibold transition">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                No suppliers registered yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
