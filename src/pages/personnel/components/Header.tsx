import React from 'react';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
    user: any;
    onLogout: () => void;
    onMenuClick: () => void;
}

export function Header({ user, onLogout, onMenuClick }: HeaderProps) {
    return (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05] dark:invert"></div>
            <div className="relative z-10 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 -ml-2 text-gray-500 hover:text-civic-dark dark:hover:text-white"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-civic-dark dark:text-white">{user?.name}</h1>
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-2 mt-1">
                            <span className="h-2 w-2 rounded-full bg-civic-green-500 animate-pulse"></span>
                            On Duty • {user?.id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-full border border-gray-100 dark:border-gray-700">
                        <Bell className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}

