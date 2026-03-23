import React, { useState, useEffect } from 'react';
import { Bell, Search, Calendar, User, Settings, LogOut, HelpCircle, ChevronDown, Menu } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/20 dark:border-white/5 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-8 transition-all shadow-sm">
            <div className="flex items-center gap-4 w-full max-w-md">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="relative w-full hidden sm:block group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-civic-green-600 transition-colors" />
                    <Input
                        placeholder="Search operations..."
                        className="pl-10 w-full bg-gray-100/50 dark:bg-gray-800 border-transparent dark:border-gray-700 dark:text-gray-200 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-civic-green-100 dark:focus:ring-civic-green-900/30 focus:border-civic-green-200 transition-all shadow-none h-10 rounded-full"
                    />
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
