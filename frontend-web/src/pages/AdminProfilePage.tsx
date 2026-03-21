import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    role: string;
}

const AdminProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ProfileData>({
        name: 'Admin01',
        email: 'admin01@bwlaundry.com',
        phone: '+94 77 123 4567',
        role: 'Senior Administrator',
    });
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        // TODO: Replace with actual API call to backend
        // const response = await fetch('/api/admin/profile', {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData),
        // });
        
        setTimeout(() => {
            setIsSaving(false);
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 1000);
    };

    return (
        <div className="w-full h-full bg-[#f8f9fc] overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 shadow-sm z-10">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin-dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={24} className="text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-[#1f2937]">Admin Profile</h1>
                            <p className="text-gray-500 text-sm mt-1">Manage your profile information</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {successMessage}
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Avatar Section */}
                    <div className="bg-gradient-to-r from-[#3FA0F6] to-[#2563eb] px-6 py-12 flex flex-col items-center">
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl border-4 border-white/30 mb-4">
                            👨‍💼
                        </div>
                        <h2 className="text-2xl font-bold text-white">{formData.name}</h2>
                        <p className="text-blue-100 text-sm mt-2">{formData.role}</p>
                    </div>

                    {/* Form Section */}
                    <form onSubmit={handleSave} className="px-6 py-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Display Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA0F6] focus:border-transparent transition-all"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    value={formData.role}
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                            </div>

                            {/* Email */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA0F6] focus:border-transparent transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>

                            {/* Phone */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3FA0F6] focus:border-transparent transition-all"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => navigate('/admin-dashboard')}
                                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-semibold rounded-lg transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-1 px-6 py-3 bg-[#3FA0F6] hover:bg-[#2563eb] text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Section */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                        💡 <strong>Note:</strong> For account security, password changes must be done through the security settings page. Contact support if you need additional assistance with your profile.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;
