import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import * as userAPI from '../api/user.api';
import type { User, UpdateUserInput } from '../types';
import toast from 'react-hot-toast';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
  onSave?: (user: User) => void;
  mode?: 'view' | 'edit';
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  user,
  onSave,
  mode = 'edit'
}) => {
  const [formData, setFormData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(mode === 'edit');

  useEffect(() => {
    if (user) {
      setFormData(user);
      setEditMode(mode === 'edit');
    }
  }, [user, mode]);

  const handleChange = (field: keyof User, value: any) => {
    setFormData((prev) => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      setIsLoading(true);

      const updateData: UpdateUserInput = {
        name: formData.name,
        email: formData.email,
        telephone: formData.telephone,
        address: formData.address,
      };

      const userId = formData._id || formData.id;
      if (!userId) {
        toast.error('User ID not found');
        return;
      }

      const updatedUser = await userAPI.updateUser(userId, updateData);
      toast.success('Profile updated successfully');
      onSave?.(updatedUser);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              disabled={!editMode}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                editMode
                  ? 'bg-white border-gray-300 text-gray-900'
                  : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={!editMode}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                editMode
                  ? 'bg-white border-gray-300 text-gray-900'
                  : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Telephone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              disabled={!editMode}
              placeholder="+94 7X XXX XXXX"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                editMode
                  ? 'bg-white border-gray-300 text-gray-900'
                  : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              disabled={!editMode}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                editMode
                  ? 'bg-white border-gray-300 text-gray-900'
                  : 'bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              value={formData.role}
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-3 h-3 rounded-full ${
                  formData.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></span>
              <span className="text-sm text-gray-600">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-all"
          >
            Close
          </button>
          {editMode ? (
            <>
              <button
                onClick={() => {
                  setFormData(user || null);
                  setEditMode(false);
                }}
                className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                {isLoading && <Loader size={16} className="animate-spin" />}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
