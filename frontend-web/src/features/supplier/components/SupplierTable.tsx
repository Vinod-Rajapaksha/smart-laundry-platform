import { Edit2, Trash2, Search } from 'lucide-react';
import { Supplier } from '../types';

interface SupplierTableProps {
  suppliers: Supplier[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function SupplierTable({
  suppliers,
  searchQuery,
  onSearchChange,
  onEdit,
  onDelete,
  onAdd
}: SupplierTableProps) {
  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search suppliers..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button
          onClick={onAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          Add Supplier
        </button>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Supplier Name</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Contact Info</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSuppliers.map((supplier) => (
              <tr key={supplier._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-900">{supplier.name}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900 font-medium">{supplier.email}</span>
                    <span className="text-xs text-gray-500">{supplier.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{supplier.address}</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(supplier)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Supplier"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => supplier._id && onDelete(supplier._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Supplier"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSuppliers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <Search className="h-10 w-10 text-gray-300 mb-3" />
                    <p className="text-sm">No suppliers found matching your search.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
