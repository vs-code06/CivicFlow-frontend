import { Home, Calendar, AlertTriangle, Settings, LogOut, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../context/AuthContext';

const navItems = [
    { id: 'home', icon: Home, label: 'Overview' },
    { id: 'education', icon: BookOpen, label: 'Waste Wizard' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'complaints', icon: AlertTriangle, label: 'Complaints' },
    { id: 'settings', icon: Settings, label: 'Settings' },
];

interface ResidentSidebarProps {
    activeTab: 'home' | 'schedule' | 'complaints' | 'settings' | 'education';
    setActiveTab: (tab: 'home' | 'schedule' | 'complaints' | 'settings' | 'education') => void;
    isCollapsed: boolean;
    onToggle: () => void;
}

export function ResidentSidebar({ activeTab, setActiveTab, isCollapsed, onToggle }: ResidentSidebarProps) {
    const { user, logout } = useAuth();

    return (
        <div className="flex h-screen flex-col bg-white dark:bg-gray-900 overflow-hidden relative border-r border-civic-muted dark:border-gray-800 transition-all duration-300" style={{ width: isCollapsed ? '80px' : '280px' }}>
            <div className={cn(
                "relative flex h-20 items-center transition-all duration-300 overflow-hidden",
                isCollapsed ? "justify-center" : "px-6 justify-between"
            )}>
                {/* Decorative Hex Pattern for Sidebar Header */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hexagons-sidebar-res" width="20" height="17" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                                <path d="M10 0 L20 5.8 L20 17.3 L10 23.1 L0 17.3 L0 5.8 Z" fill="none" stroke="currentColor" strokeWidth="1" className="text-civic-dark dark:text-white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexagons-sidebar-res)" stroke="none" />
                    </svg>
                </div>

                <div className="flex items-center shrink-0 relative z-10">
                    <div className="h-8 w-8 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                        <Home className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    {!isCollapsed && <span className="text-xl font-extrabold tracking-tight text-civic-dark dark:text-white ml-3">Resident<span className="text-green-500">Hub</span></span>}
                </div>
            </div>

            <nav className={cn(
                "flex-1 space-y-1 p-3 flex flex-col pt-4 transition-all duration-300",
                isCollapsed ? "items-center" : "items-start"
            )}>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        title={isCollapsed ? item.label : ""}
                        className={cn(
                            "flex items-center transition-all duration-200 group relative overflow-hidden w-full",
                            isCollapsed
                                ? "h-11 w-11 justify-center rounded-xl"
                                : "gap-3 px-4 py-3 rounded-xl",
                            activeTab === item.id
                                ? "bg-gradient-to-r from-green-50 to-transparent dark:from-green-900/20 text-green-700 dark:text-green-400"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-civic-dark dark:hover:text-white"
                        )}
                    >
                        {activeTab === item.id && (
                            <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-green-500"></div>
                        )}
                        <item.icon className={cn("shrink-0 transition-colors", isCollapsed ? "h-5 w-5" : "h-4.5 w-4.5", activeTab === item.id ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300")} />
                        {!isCollapsed && <span className={cn("text-sm truncate transition-all", activeTab === item.id ? "font-bold" : "font-medium")}>{item.label}</span>}
                    </button>
                ))}
            </nav>

            {/* Sidebar Toggle & Profile Area */}
            <div className="p-3">
                <div className={cn(
                    "rounded-2xl bg-gray-50/80 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700 p-3 flex transition-all duration-300 backdrop-blur-sm",
                    isCollapsed ? "flex-col items-center gap-3" : "px-4 items-center justify-between"
                )}>
                    {/* User Info */}
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative shrink-0">
                            <div className="absolute -inset-0.5 bg-gradient-to-br from-green-200 to-green-100 dark:from-green-900 dark:to-green-800 rounded-xl opacity-50"></div>
                            <div className="relative h-9 w-9 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-green-600 dark:text-green-400 font-black text-sm shadow-sm">
                                {user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'RS'}
                            </div>
                        </div>

                        {!isCollapsed && (
                            <div className="flex flex-col truncate">
                                <span className="text-sm font-bold text-civic-dark dark:text-gray-200 leading-none truncate">{user?.name}</span>
                                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter truncate">Resident</span>
                            </div>
                        )}
                    </div>

                    {/* Toggle Button */}
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggle}
                            className={cn(
                                "h-7 w-7 text-gray-400 hover:text-civic-dark dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all shadow-none hover:shadow-sm",
                                isCollapsed ? "mt-1" : ""
                            )}
                        >
                            {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
                        </Button>
                        {!isCollapsed && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={logout}
                                className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50"
                                title="Sign Out"
                            >
                                <LogOut className="h-3.5 w-3.5" />
                            </Button>
                        )}
                    </div>
                </div>
                {isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={logout}
                        className="mt-2 text-red-400 hover:text-red-600 hover:bg-red-50 w-full"
                        title="Sign Out"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
