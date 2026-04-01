import React, { useState } from 'react';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    role: string;
}

const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState<ProfileData>({
        name: 'Admin01',
        email: 'admin01@bwlaundry.com',
        phone: '+94 77 123 4567',
        role: 'Senior Administrator',
    });

    if (!isOpen) return null;

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f9fc] px-4 py-10">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-100 p-10 flex flex-col items-center">
                <h2 className="text-3xl font-black text-[#1f2937] mb-8 flex items-center gap-3">
                    <span className="text-3xl">📝</span> Edit Profile Details
                </h2>
                <form className="w-full space-y-6" onSubmit={e => { e.preventDefault(); onClose(); }}>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA0F6] focus:border-transparent transition-all text-gray-900 font-medium bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA0F6] focus:border-transparent transition-all text-gray-900 font-medium bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA0F6] focus:border-transparent transition-all text-gray-900 font-medium bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                        <input
                            type="text"
                            value={formData.role}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed font-medium"
                        />
                        <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                    </div>
                    <div className="flex gap-4 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold rounded-lg transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-[#3FA0F6] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
