import React from 'react';
import laundryMachine from '../assests/laundry-machine.png';

const Dashboard: React.FC = () => {
    return (
        <main className="flex-1 relative h-screen bg-gradient-to-br from-[#1c222d] to-[#111827] overflow-hidden flex flex-col items-center justify-center">
            {/* Decorative abstract shape in top right */}
            <div
                className="absolute top-[-5%] right-[-5%] w-[45%] h-[60%] bg-[#3b82f6] opacity-80 z-0"
                style={{
                    borderRadius: '30% 70% 20% 80% / 50% 20% 80% 50%',
                    clipPath: 'circle(75% at 85% 15%)'
                }}
            ></div>

            {/* Hero Content Area */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Main Title */}
                <div className="mb-10">
                    <h1 className="text-8xl sm:text-[10rem] font-black tracking-tight leading-none mb-4">
                        <span className="text-[#facc15]">B</span>
                        <span className="text-[#3b82f6] mx-4">&</span>
                        <span className="text-[#facc15]">W</span>
                    </h1>
                    <h2 className="text-5xl sm:text-7xl font-bold text-white tracking-widest drop-shadow-lg">
                        Laundry System
                    </h2>
                </div>

                {/* Machine Illustration Container */}
                <div className="relative mt-8 group">
                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    <img
                        src={laundryMachine}
                        alt="Smart Laundry Machine"
                        className="relative z-10 w-full max-w-xl drop-shadow-[0_35px_35px_rgba(0,0,0,0.5)] transform transition-transform duration-700 hover:scale-[1.03]"
                    />
                </div>
            </div>

            {/* Subtle Bottom Accent Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
        </main>
    );
};

export default Dashboard;
