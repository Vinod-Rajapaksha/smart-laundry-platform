import React, { useState } from 'react';
import { Search, Bell, Plus, Package, AlertTriangle, TrendingDown, X } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  threshold: number;
}

export default function InventoryDashboard() {
  const [items, setItems] = useState<InventoryItem[]>([
    { id: 'INV-001', name: 'Premium Detergent', category: 'Cleaning Supplies', price: 15.99, stock: 45, threshold: 20 },
    { id: 'INV-002', name: 'Fabric Softener', category: 'Cleaning Supplies', price: 12.50, stock: 12, threshold: 15 },
    { id: 'INV-003', name: 'Washing Machine Belt', category: 'Spare Parts', price: 25.00, stock: 5, threshold: 10 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    id: '', name: '', category: '', price: 0, stock: 0, threshold: 0
  });

  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.stock <= item.threshold).length;
  // Mocking recent deductions as it's just a stat card for now
  const recentDeductions = 14; 

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.id && newItem.name) {
      setItems([...items, newItem as InventoryItem]);
      setIsModalOpen(false);
      setNewItem({ id: '', name: '', category: '', price: 0, stock: 0, threshold: 0 });
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage state, items, and track stock levels.</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-9 w-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            A
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Items Registered</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalItems}</h3>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{lowStockItems}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <TrendingDown className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Recent Deductions</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{recentDeductions}</h3>
            </div>
          </div>
        </div>

        {/* Inventory Table Section */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-lg font-semibold text-gray-900">Current Inventory</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm shadow-blue-200"
            >
              <Plus className="h-4 w-4" />
              <span>Register New Item</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Item ID</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold text-right">Price</th>
                  <th className="px-6 py-4 font-semibold text-right">Stock</th>
                  <th className="px-6 py-4 font-semibold text-right">Threshold</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{item.id}</td>
                      <td className="px-6 py-4 text-gray-700">{item.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-gray-700">${Number(item.price).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{item.stock}</td>
                      <td className="px-6 py-4 text-right text-gray-500">{item.threshold}</td>
                      <td className="px-6 py-4 text-center">
                        {item.stock <= item.threshold ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-100">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p>No inventory items found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal Overlay and Content */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden transform transition-all">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900">Register New Item</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 rounded-full p-1.5 transition-colors"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Item ID</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. INV-004"
                    value={newItem.id}
                    onChange={e => setNewItem({...newItem, id: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Item name"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Item category"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="0.00"
                    value={newItem.price || ''}
                    onChange={e => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="0"
                    value={newItem.stock || ''}
                    onChange={e => setNewItem({...newItem, stock: parseInt(e.target.value)})}
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Alert Threshold</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="Minimum stock before alert"
                    value={newItem.threshold || ''}
                    onChange={e => setNewItem({...newItem, threshold: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
