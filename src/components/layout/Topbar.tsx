import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, Calendar, User, Settings, LogOut, HelpCircle, ChevronDown, Menu, LayoutDashboard, Map, ListTodo, BarChart3, Truck, MessageSquareWarning, ShieldCheck, Building, ClipboardList, Monitor } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SEARCH_INDEX = [
    // Dashboard
    { id: 'dash-main', title: 'Overview & Statistics', parent: 'Dashboard', to: '/', icon: LayoutDashboard, keywords: ['home', 'main', 'stats', 'data', 'charts', 'graph'] },
    
    // Zones
    { id: 'zone-map', title: 'City Map View', parent: 'Zone Management', to: '/zones', icon: Map, keywords: ['map', 'location', 'gps', 'areas', 'territory', 'boundaries', 'geography'] },
    { id: 'zone-list', title: 'Service Areas List', parent: 'Zone Management', to: '/zones', icon: Map, keywords: ['list', 'regions', 'zones', 'sectors'] },
    
    // Complaints
    { id: 'comp-tickets', title: 'Civic Tickets', parent: 'Complaints', to: '/complaints', icon: MessageSquareWarning, keywords: ['issues', 'tickets', 'problems', 'reports'] },
    { id: 'comp-reports', title: 'Citizen Reports', parent: 'Complaints', to: '/complaints', icon: MessageSquareWarning, keywords: ['feedback', 'grievances', 'citizen', 'forms'] },
    
    // Tasks
    { id: 'task-board', title: 'Usage & Tasks Board', parent: 'Tasks', to: '/tasks', icon: ListTodo, keywords: ['kanban', 'board', 'lists', 'todos', 'workflow', 'process'] },
    { id: 'task-assign', title: 'Job Assignments', parent: 'Tasks', to: '/tasks', icon: ListTodo, keywords: ['usage', 'jobs', 'assignments', 'work'] },
    
    // Fleet
    { id: 'fleet-vehicles', title: 'Vehicle Roster', parent: 'Fleet Management', to: '/fleet', icon: Truck, keywords: ['vehicles', 'trucks', 'cars', 'assigned', 'status'] },
    { id: 'fleet-personnel', title: 'Personnel & Drivers', parent: 'Fleet Management', to: '/fleet', icon: User, keywords: ['personnel', 'drivers', 'staff', 'employees', 'users', 'team', 'workers'] },
    { id: 'fleet-leave', title: 'Leave Requests', parent: 'Fleet Management', to: '/fleet', icon: Calendar, keywords: ['leave', 'vacation', 'time off', 'requests', 'approve', 'deny'] },
    
    // Analytics
    { id: 'analytics-charts', title: 'Performance Metrics', parent: 'Analytics', to: '/analytics', icon: BarChart3, keywords: ['metrics', 'performance', 'charts', 'data'] },
    { id: 'analytics-reports', title: 'System Reports', parent: 'Analytics', to: '/analytics', icon: BarChart3, keywords: ['reports', 'insights', 'exports', 'csv'] },
    
    // Settings
    { id: 'set-general', title: 'General Profile', parent: 'Settings', to: '/settings#general', icon: User, keywords: ['general', 'profile', 'avatar', 'name', 'email', 'personal'] },
    { id: 'set-org', title: 'Organization Details', parent: 'Settings', to: '/settings#organization', icon: Building, keywords: ['organization', 'department', 'region', 'support', 'company', 'business'] },
    { id: 'set-security', title: 'Security & Access', parent: 'Settings', to: '/settings#security', icon: ShieldCheck, keywords: ['password', 'security', 'login', 'authentication', 'auth'] },
    { id: 'set-audit', title: 'Audit Logs', parent: 'Settings', to: '/settings#audit', icon: ClipboardList, keywords: ['audit', 'logs', 'activity', 'events', 'history', 'records', 'csv'] },
    { id: 'set-appearance', title: 'Theme & Appearance', parent: 'Settings', to: '/settings#appearance', icon: Monitor, keywords: ['theme', 'appearance', 'dark mode', 'ui', 'colors', 'light'] },
];

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    
    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const filteredFeatures = SEARCH_INDEX.filter(f => {
        const query = searchQuery.toLowerCase();
        return (
            f.title.toLowerCase().includes(query) || 
            (f.parent && f.parent.toLowerCase().includes(query)) ||
            (f.keywords && f.keywords.some(keyword => keyword.includes(query)))
        );
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Handle clicks outside the search dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/20 dark:border-white/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-8 transition-all shadow-sm">
            <div className="flex items-center gap-4 w-full max-w-md">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="relative w-full hidden sm:block group" ref={searchRef}>
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-civic-green-600 transition-colors" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        placeholder="Search operations, features, settings..."
                        className="pl-10 w-full bg-gray-100/50 dark:bg-gray-800 border-transparent dark:border-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-civic-green-100 dark:focus:ring-civic-green-900/30 focus:border-civic-green-200 transition-all shadow-none h-10 rounded-full"
                    />
                    
                    {/* Search Dropdown Palette */}
                    {isSearchFocused && searchQuery.length > 0 && (
                        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                            <div className="p-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/80 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                Quick Navigation
                            </div>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                {filteredFeatures.length > 0 ? (
                                    filteredFeatures.map(f => (
                                        <div 
                                            key={f.id} 
                                            onClick={() => {
                                                navigate(f.to);
                                                setSearchQuery('');
                                                setIsSearchFocused(false);
                                            }}
                                            className="flex flex-row items-center gap-3 p-3 hover:bg-civic-green-50 dark:hover:bg-gray-800 cursor-pointer transition-colors group/item"
                                        >
                                            <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover/item:bg-civic-green-100 dark:group-hover/item:bg-civic-green-900/30 flex items-center justify-center shrink-0 transition-colors">
                                                <f.icon className="h-4 w-4 text-gray-500 dark:text-gray-400 group-hover/item:text-civic-green-600 dark:group-hover/item:text-civic-green-400 transition-colors" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-civic-dark dark:text-white group-hover/item:text-civic-green-700 dark:group-hover/item:text-civic-green-400 transition-colors leading-tight">
                                                    {f.title}
                                                </h4>
                                                <p className="text-[11px] text-gray-500 font-bold tracking-tight uppercase leading-tight mt-0.5 mt-1">
                                                    <span className="opacity-50">in</span> {f.parent}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No operations found</p>
                                        <p className="text-xs text-gray-400 font-medium mt-1">Try searching for features like "Fleet" or "Settings"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 ml-auto">
                {/* Date/Time Widget */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-full border border-gray-100 dark:border-gray-700">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        {format(currentTime, "MMM dd '•' HH:mm")}
                    </span>
                </div>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>

                <Button variant="ghost" size="icon" className="relative shrink-0 text-gray-400 hover:text-civic-dark hover:bg-civic-green-50/50 rounded-full h-10 w-10 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-civic-green-500 ring-2 ring-white dark:ring-gray-900" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="h-8 w-8 rounded-full bg-civic-dark text-white flex items-center justify-center font-bold text-sm overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" />
                                ) : (
                                    user?.name ?
                                        (user.name.split(' ').length >= 2 ?
                                            (user.name.split(' ')[0][0] + user.name.split(' ')[user.name.split(' ').length - 1][0]).toUpperCase() :
                                            user.name.substring(0, 2).toUpperCase())
                                        : 'U'
                                )}
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 mt-2 animate-in fade-in-80 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 duration-200"
                    >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <HelpCircle className="mr-2 h-4 w-4" />
                            <span>Help & Support</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-civic-red hover:text-civic-red hover:bg-red-50">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
