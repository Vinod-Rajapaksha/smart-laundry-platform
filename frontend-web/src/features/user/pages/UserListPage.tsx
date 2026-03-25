import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import * as userAPI from '../api/user.api';
import type { User, CreateUserInput, Role } from '../types';
import UserProfileModal from './UserProfileModal';

interface CreateUserForm extends CreateUserInput {
  passwordConfirm?: string;
}

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    name: '',
    email: '',
    telephone: '',
    address: '',
    password: '',
    passwordConfirm: '',
    role: 'CUSTOMER',
  });

  useEffect(() => {
    loadUsers();
  }, [pagination.page, searchQuery, roleFilter]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const result = await userAPI.getAllUsers(
        pagination.page,
        pagination.limit,
        searchQuery,
        roleFilter || undefined
      );
      setUsers(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRoleFilter = (role: Role | '') => {
    setRoleFilter(role);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsCreateMode(false);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userAPI.deleteUser(userId);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (userId: string) => {
    try {
      const updatedUser = await userAPI.toggleUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId || u.id === userId ? updatedUser : u))
      );
      toast.success('User status updated');
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleOpenCreateForm = () => {
    setCreateForm({
      name: '',
      email: '',
      telephone: '',
      address: '',
      password: '',
      passwordConfirm: '',
      role: 'CUSTOMER',
    });
    setSelectedUser(null);
    setIsCreateMode(true);
    setIsModalOpen(true);
  };

  const handleCreateUser = async () => {
    // Validation
    if (!createForm.name || !createForm.email || !createForm.telephone || !createForm.password) {
      toast.error('Please fill all required fields');
      return;
    }

    if (createForm.password !== createForm.passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await userAPI.createUser({
        name: createForm.name,
        email: createForm.email,
        telephone: createForm.telephone,
        address: createForm.address || undefined,
        password: createForm.password,
        role: createForm.role,
      });
      toast.success('User created successfully');
      setIsModalOpen(false);
      loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error?.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-2">
              Total Users: <span className="font-semibold text-gray-900">{pagination.total}</span>
            </p>
          </div>
          <button
            onClick={handleOpenCreateForm}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
          >
            <Plus size={20} />
            Create User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search by name, email, or phone..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilter(e.target.value as Role | '')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="STAFF">Staff</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="animate-spin text-blue-500" size={32} />
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.telephone}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleToggleStatus(user._id || user.id || '')}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          user.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-2"
                          title="Edit user"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id || user.id || '')}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.pages} (Total: {pagination.total} users)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPagination((prev) => ({ ...prev, page }))}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    page === pagination.page
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.pages, prev.page + 1),
                  }))
                }
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {isModalOpen && isCreateMode && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New User</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="Full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="Email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={createForm.telephone}
                    onChange={(e) => setCreateForm({ ...createForm, telephone: e.target.value })}
                    placeholder="+94 7X XXX XXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={createForm.address || ''}
                    onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                    placeholder="Street address"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={createForm.role}
                    onChange={(e) => setCreateForm({ ...createForm, role: e.target.value as Role })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="STAFF">Staff</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                  <input
                    type="password"
                    value={createForm.password}
                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must include uppercase, lowercase, number, and special character
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                  <input
                    type="password"
                    value={createForm.passwordConfirm || ''}
                    onChange={(e) => setCreateForm({ ...createForm, passwordConfirm: e.target.value })}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
                >
                  Create User
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isModalOpen && !isCreateMode && selectedUser && (
          <UserProfileModal
            isOpen={isModalOpen && !isCreateMode}
            onClose={() => setIsModalOpen(false)}
            user={selectedUser}
            mode="edit"
            onSave={(updatedUser) => {
              setUsers((prev) =>
                prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
              );
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserListPage;
