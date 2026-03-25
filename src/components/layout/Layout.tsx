import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { cn } from '../../lib/utils';
import { PageTransition } from '../ui/page-transition';
import { ChatbotWidget } from '../common/ChatbotWidget';

export function Layout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const location = useLocation();

    // Handle Resize to sync JS state with CSS breakpoints
    React.useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsDesktop(width >= 1024);
            if (width >= 1024) {
                setIsSidebarOpen(false); // Reset mobile toggle state when going to desktop
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        // ROOT CONTAINER
        // Mobile: Standard Flow (min-h-screen, window scrolls)
        // Desktop: App Layout (h-screen, internal scroll)
        <div className="relative bg-gray-50 dark:bg-gray-950 min-h-screen lg:h-screen lg:flex lg:flex-row lg:overflow-hidden">

            {/* Sidebar Backdrop (Mobile only) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-[70] transition-all duration-300 ease-in-out border-r bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 lg:static lg:z-auto",
                isSidebarOpen
                    ? "translate-x-0 shadow-2xl w-64" /* Mobile: Open, Desktop: Expanded */
                    : "-translate-x-full lg:translate-x-0 w-64 lg:w-20" /* Mobile: Closed, Desktop: Collapsed */
            )}>
                <Sidebar
                    isCollapsed={!isSidebarOpen && isDesktop}
                    onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                    onNavItemClick={() => { if (!isDesktop) setIsSidebarOpen(false) }}
                />
            </div>

            {/* Content Wrapper */}
            <div className="flex-1 flex flex-col w-full min-w-0 lg:h-full lg:overflow-hidden">

                {/* Mobile Header (Sticky) */}
                <div className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 h-16 flex items-center justify-between shadow-sm">
                    <div className="font-bold text-civic-dark dark:text-white text-lg flex items-center gap-2">
                        <div className="h-6 w-6 bg-civic-green-500 rounded-lg flex items-center justify-center text-white">
                            <span className="text-xs">CF</span>
                        </div>
                        CivicFlow
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                </div>

                {/* Desktop Topbar */}
                <div className="hidden lg:block">
                    <div className="hidden md:block">
                        <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                    </div>
                    <div className="md:hidden">
                        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                    </div>
                </div>

                {/* Main Content Area */}
                {/* Mobile: grows naturally. Desktop: internal scroll. */}
                <main className={cn(
                    "flex-1 p-4 md:p-6 lg:p-8 w-full max-w-[100vw]",
                    "lg:overflow-y-auto lg:h-full"
                )}>
                    {/* Key forces re-mount on route change to trigger animation */}
                    <PageTransition key={location.pathname} className="h-full">
                        <Outlet />
                    </PageTransition>
                </main>
            </div>
            
            {/* Global Chatbot Widget */}
            <ChatbotWidget />
        </div>
    );
}
