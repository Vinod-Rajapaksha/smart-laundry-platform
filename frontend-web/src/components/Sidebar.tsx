import React from 'react';
import { Menu, LayoutDashboard, MessageSquare, Tag, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
        { name: 'Feedbacks', icon: MessageSquare, path: '/feedbacks' },
        { name: 'Promotions', icon: Tag, path: '/promotions' },
        { name: 'Status Updates', icon: RefreshCw, path: '/status' },
    ];

    return (
        <aside className="w-[220px] h-screen bg-[#1f3a4d] flex flex-col shadow-2xl z-20 transition-all duration-300">
            {/* Sidebar Top: Hamburger Menu */}
            <div className="p-6">
                <button className="text-[#a5c0e0] hover:text-white transition-colors">
                    <Menu size={32} />
                </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 px-4 py-4 flex flex-col gap-4">
                {menuItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => item.path && navigate(item.path)}
                        className="flex items-center gap-3 px-4 py-3 bg-[#a5c0e0] hover:bg-[#8da8c5] text-[#1f3a4d] font-bold rounded-xl shadow-md transition-all duration-200 group active:scale-95"
                    >
                        <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-sm uppercase tracking-wide">{item.name}</span>
                    </button>
                ))}
            </nav>

            {/* Sidebar Footer decorative area */}
            <div className="p-8 opacity-20 mt-auto">
                <div className="w-full h-1 bg-[#a5c0e0] rounded-full mb-2"></div>
                <div className="w-2/3 h-1 bg-[#a5c0e0] rounded-full"></div>
            </div>
        </aside>
    );
};

export default Sidebar;
