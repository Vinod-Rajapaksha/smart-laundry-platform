import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
    const navigate = useNavigate();
    const menuItems = [
        { name: 'Dashboard', icon: '🏠', path: '/admin-dashboard' },
        { name: 'Orders', icon: '🧺' },
        { name: 'Customers', icon: '👥' },
        { name: 'Staff', icon: '👨‍💼', path: '/staff' },
        { name: 'System Analysis', icon: '📊', path: '/system-analysis' },
        { name: 'Services', icon: '🧾' },
        { name: 'Settings', icon: '⚙️' },
    ];

    return (
        <aside className="w-[230px] h-screen bg-[#245b78] flex flex-col border-r border-white/10 shadow-xl overflow-hidden shrink-0">
            {/* Top Logo Area (Mockup specific spacing) */}
            <div className="h-24"></div>

            {/* Menu Items */}
            <nav className="flex-1 flex flex-col">
                {menuItems.map((item) => (
                    <div
                        key={item.name}
                        onClick={() => item.path && navigate(item.path)}
                        className="bg-[#a5c0e0] border-b border-[#245b78]/30 px-6 py-4 flex items-center gap-4 cursor-pointer transition-all duration-300 hover:bg-[#8da8c5] group rounded-sm mx-1 mb-1"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">
                            {item.icon}
                        </span>
                        <span className="text-lg font-semibold text-[#1a222d] whitespace-nowrap">
                            {item.name}
                        </span>
                    </div>
                ))}
            </nav>

            {/* Bottom Footer Area (Empty) */}
            <div className="h-40 bg-[#1c2a35] opacity-20 mt-auto"></div>
        </aside>
    );
};

export default AdminSidebar;
