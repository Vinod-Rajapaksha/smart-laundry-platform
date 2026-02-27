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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div
                className="bg-[#242c38] w-full max-w-md rounded-3xl p-8 border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">📝</span> Edit Profile Details
                </h2>

                <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#1c222d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[#1c222d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-[#1c222d] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Role</label>
                        <input
                            type="text"
                            value={formData.role}
                            readOnly
                            className="w-full bg-[#1c222d]/50 border border-white/5 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed font-medium"
                        />
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
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
