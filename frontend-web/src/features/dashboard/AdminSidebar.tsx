import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Users, 
    ShoppingBag, 
    Landmark,
    PackageSearch,
    RefreshCcw,
    Tag,
    MessageSquare,
    Truck,
    BarChart2,
    LogOut
} from 'lucide-react';
import UserProfileModal from '../../features/user/pages/UserProfileModal';
import type { User } from '../../features/user/types';
import * as userAPI from '../../features/user/api/user.api';

const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        // Load current user profile from localStorage or API
        const loadUserProfile = async () => {
            try {
                const userIdStr = localStorage.getItem('userId') || localStorage.getItem('user');
                if (userIdStr) {
                    const userId = typeof userIdStr === 'string' ? JSON.parse(userIdStr).id || userIdStr : userIdStr;
                    const user = await userAPI.getUserById(userId);
                    setCurrentUser(user);
                } else {
                    // Fallback if no user in localStorage
                    setCurrentUser({
                        id: 'admin',
                        name: 'BW Laundry',
                        email: 'admin@bwlaundry.com',
                        telephone: '+94770000000',
                        role: 'ADMIN',
                        isActive: true,
                    });
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
                // Set default admin profile on error
                setCurrentUser({
                    id: 'admin',
                    name: 'BW Laundry',
                    email: 'admin@bwlaundry.com',
                    telephone: '+94770000000',
                    role: 'ADMIN',
                    isActive: true,
                });
            }
        };

        loadUserProfile();
    }, []);
    
    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin-dashboard' },
        { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
        // { name: 'Customers', icon: <Users size={20} />, path: '/customers' },
        { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/orders' },
        { name: 'Bank Verification', icon: <Landmark size={20} />, path: '/bank-verification' },
        { name: 'Inventory', icon: <PackageSearch size={20} />, path: '/inventory' },
        { name: 'Update Status', icon: <RefreshCcw size={20} />, path: '/update-status' },
        { name: 'Promotions', icon: <Tag size={20} />, path: '/promotions' },
        { name: 'Feedbacks', icon: <MessageSquare size={20} />, path: '/feedbacks' },
        { name: 'Deliveries', icon: <Truck size={20} />, path: '/deliveries' },
        { name: 'Reports', icon: <BarChart2 size={20} />, path: '/report' },
    ];

    return (
        <aside className="w-[260px] h-screen bg-white flex flex-col border-r border-gray-100 shadow-sm shrink-0">
            {/* Top Logo Area */}
            <div className="h-24 flex items-center px-6 border-b border-gray-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#3FA0F6] rounded-full flex items-center justify-center text-white">
                        <ShoppingBag size={20} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-bold text-[#1f2937] uppercase tracking-wider">B & W Laundry</h1>
                        <span className="text-xs text-gray-500 font-medium tracking-wide">Admin Portal</span>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
                {menuItems.map((item) => {
                    // Check if current path matches, if no path match exact word Dashboard maybe?
                    const isActive = location.pathname.includes(item.path?.toLowerCase() || 'dashboard');
                    return (
                        <div
                            key={item.name}
                            onClick={() => item.path && navigate(item.path)}
                            className={`px-4 py-3 flex items-center gap-4 cursor-pointer rounded-xl transition-all duration-200 group ${
                                isActive 
                                    ? 'bg-[#eef5fd] text-[#3FA0F6] font-semibold' 
                                    : 'text-[#4b5563] hover:bg-gray-50 hover:text-[#1f2937]'
                            }`}
                        >
                            <span className={`${isActive ? 'text-[#3FA0F6]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                {item.icon}
                            </span>
                            <span className="text-[15px]">
                                {item.name}
                            </span>
                        </div>
                    );
                })}
            </nav>

            {/* Bottom User Area */}
            <div className="p-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                <div 
                    onClick={() => setIsProfileModalOpen(true)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-2 transition-colors flex-1"
                >
                    <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center border border-gray-100 overflow-hidden">
                        <span className="text-xl">👨‍💼</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#1f2937]">{currentUser?.name || 'Admin'}</span>
                        <span className="text-xs text-gray-400 font-medium">{currentUser?.role || 'Admin'}</span>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('userId');
                        navigate('/login');
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                    <LogOut size={16} />
                </button>
            </div>

            {/* User Profile Modal */}
            <UserProfileModal 
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={currentUser || undefined}
                mode="edit"
                onSave={(updatedUser) => {
                    setCurrentUser(updatedUser);
                    setIsProfileModalOpen(false);
                }}
            />
        </aside>
    );
};

export default AdminSidebar;
