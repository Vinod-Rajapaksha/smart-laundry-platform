import React, { useState } from 'react';
import EditProfileModal from './EditProfileModal';

const AdminMainContent: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <main className="flex-1 h-screen relative bg-[#1c222d] flex flex-col p-12 overflow-hidden">
            {/* Top Bar */}
            <div className="flex justify-between items-start w-full relative z-10">
                <h2 className="text-4xl font-semibold text-white tracking-tight">
                    Hello... Admin01
                </h2>

                {/* Profile Avatar Icon - Clickable Trigger */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl overflow-hidden transform transition-all hover:scale-105 active:scale-95 group border-2 border-transparent hover:border-blue-500/50"
                        title="Edit Profile"
                    >
                        {/* Simple Admin Illustration / Icon */}
                        <div className="w-full h-full bg-[#1c222d] flex items-center justify-center group-hover:bg-[#242c38] transition-colors">
                            <span className="text-4xl">👨‍💼</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* Main Message Section */}
            <div className="flex-1 flex flex-col justify-center items-center -mt-20">
                <div className="max-w-2xl text-center lg:text-left lg:self-start lg:ml-20">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-wide drop-shadow-lg">
                        You Can Manage & navigate all the <br /> system settings Here
                    </h1>
                </div>
            </div>

            {/* Large Decorative Blue Shape - Bottom Right */}
            <div
                className={`absolute bottom-[-15%] right-[-10%] w-[55%] h-[75%] bg-[#3b82f6] z-0 opacity-95 shadow-[0_0_100px_rgba(59,130,246,0.3)] transition-all duration-700 ${isModalOpen ? 'blur-md scale-105 opacity-40' : ''}`}
                style={{
                    borderRadius: '100% 0% 0% 100% / 100% 0% 0% 100%',
                    clipPath: 'polygon(100% 0, 100% 100%, 15% 100%, 45% 45%)'
                }}
            ></div>

            {/* Profile Edit Modal Overlay */}
            <EditProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
};

export default AdminMainContent;
