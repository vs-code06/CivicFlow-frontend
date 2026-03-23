import React from 'react';
import { Home, Map, User } from 'lucide-react';

interface BottomNavProps {
    activeTab: 'home' | 'route' | 'profile';
    setActiveTab: (tab: 'home' | 'route' | 'profile') => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.03)] z-50">
            <div className="flex justify-around items-center max-w-md mx-auto">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 min-w-[64px]
                    ${activeTab === 'home' ? 'text-civic-dark bg-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Home className="h-6 w-6" strokeWidth={activeTab === 'home' ? 3 : 2} />
                    <span className="text-[10px] font-bold">Home</span>
                </button>
                <button
                    onClick={() => setActiveTab('route')}
                    className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 min-w-[64px]
                    ${activeTab === 'route' ? 'text-civic-dark bg-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Map className="h-6 w-6" strokeWidth={activeTab === 'route' ? 3 : 2} />
                    <span className="text-[10px] font-bold">Route</span>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`p-3 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 min-w-[64px]
                    ${activeTab === 'profile' ? 'text-civic-dark bg-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <User className="h-6 w-6" strokeWidth={activeTab === 'profile' ? 3 : 2} />
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </div>
        </div>
    );
}
