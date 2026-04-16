import { useState, useEffect } from 'react';
import { Truck, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Supplier } from '../types';
import { supplierApi } from '../api/supplierApi';
import { SupplierTable } from '../components/SupplierTable';
import { SupplierForm } from '../components/SupplierForm';
import { NotificationHistory } from '../components/NotificationHistory';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  
  // Notification history state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Delete confirm state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const data = await supplierApi.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await supplierApi.getNotifications();
      setNotifications(data);
      setIsHistoryOpen(true);
    } catch (error) {
      toast.error('Failed to load notification history');
    }
  };

  const handleSave = async (data: Supplier) => {
    try {
      if (editingSupplier && editingSupplier._id) {
        const updated = await supplierApi.updateSupplier(editingSupplier._id, data);
        setSuppliers(suppliers.map(s => s._id === editingSupplier._id ? updated : s));
        toast.success('Supplier updated successfully');
      } else {
        const created = await supplierApi.createSupplier(data);
        setSuppliers([...suppliers, created]);
        toast.success('Supplier registered successfully');
      }
      setIsModalOpen(false);
      setEditingSupplier(null);
    } catch (error) {
      toast.error('Failed to save supplier');
    }
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;
    
    try {
      await supplierApi.deleteSupplier(supplierToDelete);
      setSuppliers(suppliers.filter(s => s._id !== supplierToDelete));
      toast.success('Supplier deleted successfully');
    } catch (error) {
      toast.error('Failed to delete supplier');
    } finally {
      setIsDeleteModalOpen(false);
      setSupplierToDelete(null);
    }
  };

  const openDeleteConfirm = (id: string) => {
    setSupplierToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setEditingSupplier(null);
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full text-gray-800 px-4 sm:px-8 py-6">
      <Toaster position="top-right" />
      
      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-start mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Supplier Management</h1>
          <p className="text-[15px] text-gray-500 mt-1 font-medium">Manage and monitor your suppliers and contacts.</p>
        </div>
        
        <div className="hidden xl:flex items-center space-x-3">
          <button
            onClick={loadNotifications}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all text-gray-700 font-bold text-sm"
          >
            <div className="p-1.5 bg-yellow-50 text-yellow-600 rounded-lg">
              <Mail size={16} />
            </div>
            <span>Notification History</span>
          </button>

          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <Truck size={16} />
            </div>
            <span className="text-sm font-bold text-gray-700">{suppliers.length} Active Suppliers</span>
          </div>
        </div>
      </div>

      <SupplierTable
        suppliers={suppliers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEdit={openEditModal}
        onDelete={openDeleteConfirm}
        onAdd={openAddModal}
      />

      {isModalOpen && (
        <SupplierForm
          initialData={editingSupplier || {}}
          isEditing={!!editingSupplier}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {isHistoryOpen && (
        <NotificationHistory 
          notifications={notifications} 
          onClose={() => setIsHistoryOpen(false)} 
          onRefresh={async () => {
            const data = await supplierApi.getNotifications();
            setNotifications(data);
          }}
        />
      )}

      <ConfirmDialog
        open={isDeleteModalOpen}
        title="Delete Supplier"
        description="Are you sure you want to delete this supplier? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSupplierToDelete(null);
        }}
      />
    </div>
  );
}
