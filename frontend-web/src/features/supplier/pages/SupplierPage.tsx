import React, { useEffect, useState } from 'react';
import { getSuppliers } from '../api/supplier.api';
import SupplierTable from '../components/SupplierTable';
import SupplierForm from '../components/SupplierForm';
import { Truck, AlertCircle, Users, Activity } from 'lucide-react';

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsFormOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center space-x-2 mb-8 text-blue-600">
        <Truck className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Suppliers</p>
            <p className="text-2xl font-bold text-gray-800">{suppliers.length}</p>
          </div>
        </div>
        <div className="bg-[#fffdf0] p-6 rounded-xl shadow-sm border border-yellow-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Alerts</p>
            <p className="text-2xl font-bold text-gray-800">0</p>
          </div>
        </div>
        <div className="bg-[#fcfaff] p-6 rounded-xl shadow-sm border border-purple-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Suppliers</p>
            <p className="text-2xl font-bold text-gray-800">{suppliers.filter((s:any) => s.status === 'Active').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Current Suppliers</h2>
          <div className="flex space-x-4">
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
            />
            <button 
              onClick={() => { setSelectedSupplier(null); setIsFormOpen(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center"
            >
              + Register New Supplier
            </button>
          </div>
        </div>

        <SupplierTable 
          suppliers={suppliers.filter((s:any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()) || s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()))} 
          onEdit={handleEdit} 
          refresh={fetchSuppliers} 
        />
      </div>

      {isFormOpen && (
        <SupplierForm 
          supplier={selectedSupplier} 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => { setIsFormOpen(false); fetchSuppliers(); }} 
        />
      )}
    </div>
  );
}
