import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, ListTodo, BarChart3, Settings, ShieldCheck, ChevronLeft, ChevronRight, Truck, MessageSquareWarning, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
    { icon: Map, label: 'Zones', to: '/zones' },
    { icon: MessageSquareWarning, label: 'Complaints', to: '/complaints' },
    { icon: ListTodo, label: 'Tasks', to: '/tasks' },
    { icon: Truck, label: 'Fleet', to: '/fleet' },
    { icon: BarChart3, label: 'Analytics', to: '/analytics' },
    { icon: Settings, label: 'Settings', to: '/settings' },
];

interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
    onNavItemClick?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onNavItemClick }: SidebarProps) {
    const { user, logout } = useAuth();
    return (
        <div className="flex h-screen w-full flex-col bg-white dark:bg-gray-900 overflow-hidden relative border-r border-civic-muted dark:border-gray-800">
            <div className={cn(
                "relative flex h-20 items-center transition-all duration-300 overflow-hidden",
                isCollapsed ? "justify-center" : "px-6 justify-between"
            )}>
                {/* Decorative Hex Pattern for Sidebar Header */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hexagons-sidebar" width="20" height="17" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                                <path d="M10 0 L20 5.8 L20 17.3 L10 23.1 L0 17.3 L0 5.8 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-civic-dark dark:text-white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexagons-sidebar)" stroke="none" />
                    </svg>
                </div>

                <div className="flex items-center shrink-0 relative z-10">
                    <div className="h-8 w-8 rounded-lg bg-civic-green-50 dark:bg-civic-green-900/30 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-civic-green-600 dark:text-civic-green-400" />
                    </div>
                    {!isCollapsed && <span className="text-xl font-extrabold tracking-tight text-civic-dark dark:text-white ml-3">CivicFlow</span>}
                </div>
            </div>

            <nav className={cn(
                "flex-1 space-y-1 p-3 flex flex-col pt-4 transition-all duration-300",
                isCollapsed ? "items-center" : "items-start"
            )}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        title={isCollapsed ? item.label : ""}
                        onClick={onNavItemClick}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center transition-all duration-200 group relative overflow-hidden",
                                isCollapsed
                                    ? "h-11 w-11 justify-center rounded-xl"
                                    : "w-full gap-3 px-4 py-3 rounded-xl",
                                isActive
                                    ? "bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 text-green-700 dark:text-green-400"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-civic-dark dark:hover:text-white"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-green-500"></div>
                                )}
                                <item.icon className={cn("shrink-0 transition-colors", isCollapsed ? "h-5 w-5" : "h-4.5 w-4.5", isActive ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
                                {!isCollapsed && <span className={cn("text-sm truncate transition-all", isActive ? "font-bold" : "font-medium")}>{item.label}</span>}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Sidebar Toggle & Profile Area */}
            <div className="p-3">
                <div className={cn(
                    "rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 p-3 flex transition-all duration-300 backdrop-blur-sm",
                    isCollapsed ? "flex-col items-center gap-3" : "px-4 items-center justify-between"
                )}>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-green-200 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl opacity-50"></div>
                            <div className="relative h-9 w-9 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-green-600 dark:text-green-400 font-black text-[10px] shadow-sm shrink-0">
                                {user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'JD'}
                            </div>
                            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></span>
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-col truncate">
                                <span className="text-sm font-bold text-civic-dark dark:text-gray-200 leading-none truncate">{user?.name || 'User'}</span>
                                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter truncate">Online</span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className={cn(
                            "h-7 w-7 text-gray-400 hover:text-civic-dark dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-all shadow-none hover:shadow-sm",
                            isCollapsed ? "mt-1" : ""
                        )}
                    >
                        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={logout}
                        className={cn(
                            "h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all shadow-none hover:shadow-sm",
                            isCollapsed ? "mt-1" : ""
                        )}
                        title="Sign Out"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
