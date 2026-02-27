import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddStaff: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'Worker',
        salary: '',
        status: 'Active',
    });

    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const roles = ['Manager', 'Worker', 'Cashier'];
    const statuses = ['Active', 'Inactive'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (saveSuccess) setSaveSuccess(false);
    };

    const handleReset = () => {
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            role: 'Worker',
            salary: '',
            status: 'Active',
        });
        setSaveSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.fullName || !formData.email || !formData.phone || !formData.salary) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/staff', formData);
            toast.success(response.data.message || 'Staff member added successfully!');
            setSaveSuccess(true);
            handleReset();
            // Note: handleReset clears saveSuccess, so we need to set it back or change the order
            setSaveSuccess(true);
        } catch (error: any) {
            console.error('Error adding staff:', error);
            const errorMsg = error.response?.data?.message || 'Failed to add staff member';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-gradient-to-br from-[#1c222d] to-[#111827] flex items-center justify-center p-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl p-10 transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-black text-[#1f3a4d] mb-2 uppercase tracking-tight">Add New Staff</h2>
                    <p className="text-slate-500 font-medium">Create a new staff member profile in the system</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-bold text-[#1f3a4d] mb-2 px-1">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Ex: Example Name"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-300"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-[#1f3a4d] mb-2 px-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@example.com"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-300"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-[#1f3a4d] mb-2 px-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+94 77 123 4567"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-300"
                            />
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-bold text-[#1f3a4d] mb-2 px-1">Monthly Salary (LKR)</label>
                            <input
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="25000"
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium placeholder:text-slate-300"
                            />
                        </div>

                        {/* Role Dropdown */}
                        <div>
                            <label className="block text-sm font-bold text-[#1f3a4d] mb-2 px-1">Staff Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
                            >
                                {roles.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Dropdown */}
                        <div>
                            <label className="block text-sm font-bold text-[#1f3a4d] mb-2 px-1">Employment Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium appearance-none cursor-pointer"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {saveSuccess && (
                        <div className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-3 rounded-2xl text-center font-bold animate-in fade-in zoom-in duration-300">
                            The staff saved successfully!
                        </div>
                    )}

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all active:scale-95"
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Save Staff Member'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaff;
