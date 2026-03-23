import React from 'react';
import { Home, Map, User, ShieldCheck, ChevronLeft, ChevronRight, LogOut, Inbox, Coffee, Fuel, AlertTriangle, Settings, Clock, Truck, Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../context/AuthContext';

interface PersonnelSidebarProps {
    activeTab: 'home' | 'assignments' | 'vehicle' | 'route' | 'history' | 'profile' | 'settings' | 'leave';
    setActiveTab: (tab: 'home' | 'assignments' | 'vehicle' | 'route' | 'history' | 'profile' | 'settings' | 'leave') => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

export function PersonnelSidebar({ activeTab, setActiveTab, isCollapsed, onToggle }: PersonnelSidebarProps) {
    const { user, logout } = useAuth();

    const navItems = [
        { id: 'home', icon: Home, label: 'Dashboard' },
        { id: 'assignments', icon: Inbox, label: 'Assignments' },
        { id: 'vehicle', icon: Truck, label: 'Vehicle' },
        { id: 'route', icon: Map, label: 'My Route' },
        { id: 'history', icon: Clock, label: 'History' },
        { id: 'leave', icon: Calendar, label: 'Leave' },
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ] as const;

    // Quick Actions Widget
    const QuickActions = () => (
        <div className={cn(
            "mt-auto mb-4 transition-all duration-300",
            isCollapsed ? "px-1" : "px-3"
        )}>
            <div className={cn(
                "bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden",
                isCollapsed ? "p-1" : "p-3"
            )}>
                {!isCollapsed && <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">Quick Actions</p>}

                <div className={cn("grid gap-2", isCollapsed ? "grid-cols-1" : "grid-cols-3")}>
                    <button
                        onClick={() => alert("Break")}
                        className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1 hover:border-orange-200 hover:text-orange-500 transition-colors group"
                        title="Break"
                    >
                        <Coffee className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-orange-500" />
                        {!isCollapsed && <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Break</span>}
                    </button>

                    <button
                        onClick={() => alert("Fuel")}
                        className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1 hover:border-purple-200 hover:text-purple-500 transition-colors group"
                        title="Fuel"
                    >
                        <Fuel className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-purple-500" />
                        {!isCollapsed && <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Fuel</span>}
                    </button>

                    <button
                        onClick={() => alert("Issue")}
                        className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-1 hover:border-red-200 hover:text-red-500 transition-colors group"
                        title="Issue"
                    >
                        <AlertTriangle className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-red-500" />
                        {!isCollapsed && <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase">Issue</span>}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={cn(
            "flex h-screen flex-col bg-white dark:bg-gray-900 border-r border-civic-muted dark:border-gray-800 transition-all duration-300 sticky top-0",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Header */}
            <div className={cn(
                "relative flex h-20 items-center transition-all duration-300 overflow-hidden shrink-0",
                isCollapsed ? "justify-center" : "px-6 justify-start gap-3"
            )}>
                {/* Decorative Hex Pattern */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hexagons-sidebar-p" width="20" height="17" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                                <path d="M10 0 L20 5.8 L20 17.3 L10 23.1 L0 17.3 L0 5.8 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-civic-dark dark:text-white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexagons-sidebar-p)" stroke="none" />
                    </svg>
                </div>

                <div className="h-8 w-8 rounded-lg bg-civic-green-50 dark:bg-civic-green-900/30 flex items-center justify-center shrink-0 z-10">
                    <ShieldCheck className="h-5 w-5 text-civic-green-600 dark:text-civic-green-400" />
                </div>
                {!isCollapsed && <span className="text-xl font-extrabold tracking-tight text-civic-dark dark:text-white z-10">DriverPortal</span>}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-3 flex flex-col">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={cn(
                            "flex items-center transition-all duration-200 group relative overflow-hidden w-full text-left",
                            isCollapsed
                                ? "h-11 w-11 justify-center rounded-xl mx-auto"
                                : "gap-3 px-4 py-3 rounded-xl",
                            activeTab === item.id
                                ? "bg-gradient-to-r from-civic-green-50 to-transparent dark:from-civic-green-900/20 text-civic-green-700 dark:text-civic-green-400"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-civic-dark dark:hover:text-white"
                        )}
                        title={isCollapsed ? item.label : ""}
                    >
                        {activeTab === item.id && (
                            <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-civic-green-500"></div>
                        )}
                        <item.icon className={cn(
                            "shrink-0 transition-colors",
                            isCollapsed ? "h-5 w-5" : "h-4.5 w-4.5",
                            activeTab === item.id ? "text-civic-green-600 dark:text-civic-green-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                        )} />
                        {!isCollapsed && (
                            <span className={cn("text-sm transition-all", activeTab === item.id ? "font-bold" : "font-medium")}>
                                {item.label}
                            </span>
                        )}
                    </button>
                ))}

                {/* Insert Quick Actions Here */}
                <QuickActions />
            </nav>

            {/* Footer / Profile */}
            <div className="p-3 shrink-0">
                <div className={cn(
                    "rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-3 flex transition-all duration-300 backdrop-blur-sm mb-2",
                    isCollapsed ? "flex-col items-center gap-3" : "px-4 items-center justify-between"
                )}>
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                            <div className="h-9 w-9 rounded-xl bg-civic-dark dark:bg-gray-800 text-white flex items-center justify-center font-black text-xs shadow-sm">
                                {user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'PS'}
                            </div>
                            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-civic-green-500 border-2 border-white dark:border-gray-900"></span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col truncate min-w-0">
                                <span className="text-sm font-bold text-civic-dark dark:text-white leading-none truncate">{user?.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter truncate">ID: {user?.id}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="flex-1 h-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                    {!isCollapsed && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            title="Logout"
                            className="h-10 w-10 shrink-0 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
