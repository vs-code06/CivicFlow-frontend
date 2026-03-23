import React, { useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Phone } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { Header } from './components/Header';
import { PersonnelSidebar } from './components/PersonnelSidebar';

// Tabs
import { HomeTab } from './tabs/HomeTab';
import { RouteTab } from './tabs/RouteTab';
import { ProfileTab } from './tabs/ProfileTab';
import { AssignmentsTab } from './tabs/AssignmentsTab';
import { SettingsTab } from './tabs/SettingsTab';
import { VehicleTab } from './tabs/VehicleTab';
import { HistoryTab } from './tabs/HistoryTab';
import { LeaveTab } from './tabs/LeaveTab';

export function PersonnelDashboard() {
    const { user, logout, refreshUser } = useAuth();

    // State
    const [activeTab, setActiveTab] = useState<'home' | 'assignments' | 'vehicle' | 'route' | 'history' | 'profile' | 'settings' | 'leave'>('assignments');
    const [taskStatus, setTaskStatus] = useState<'pending' | 'accepted' | 'active' | 'completed'>('pending');
    const [currentTask, setCurrentTask] = useState<any>(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const fetchTasks = useCallback(async () => {
        try {
            const { getMyTasks } = await import('../../api/tasks');
            const data = await getMyTasks();
            // Preference: In Progress > Accepted > Pending
            const inProgress = data.tasks?.find((t: any) => t.status === 'In Progress');
            const accepted = data.tasks?.find((t: any) => t.status === 'Accepted');
            const pending = data.tasks?.find((t: any) => t.status === 'Pending');

            if (inProgress) {
                setCurrentTask(inProgress);
                setTaskStatus('active');
            } else if (accepted) {
                setCurrentTask(accepted);
                setTaskStatus('accepted');
            } else if (pending) {
                setCurrentTask(pending);
                setTaskStatus('pending');
            } else {
                setCurrentTask(null);
                setTaskStatus('completed');
            }
        } catch (error) {
            console.error('Failed to fetch tasks', error);
        }
    }, []);

    React.useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    // Workflow Actions
    const handleAcceptTask = async () => {
        if (!currentTask) return;
        try {
            const api = await import('../../api/tasks');
            await api.acceptTask(currentTask._id);
            setCurrentTask({ ...currentTask, status: 'Accepted' });
            setTaskStatus('accepted');
            setActiveTab('vehicle'); // Go to vehicle inspection
        } catch (e) {
            console.error('Failed to accept task:', e);
        }
    };

    const handleInspectionComplete = () => {
        // Inspection done → go to Route tab
        setActiveTab('route');
    };

    const handleStartTask = async () => {
        if (!currentTask) return;
        try {
            const api = await import('../../api/tasks');
            const result = await api.startTask(currentTask._id);
            setCurrentTask(result.task || { ...currentTask, status: 'In Progress' });
            setTaskStatus('active');
            setActiveTab('route');
        } catch (e) { console.error('Failed to start task:', e); }
    };

    const handleCompleteTask = async (data?: any) => {
        if (!currentTask) return;
        try {
            const api = await import('../../api/tasks');
            await api.completeTask(currentTask._id, {
                collectionStatus: data?.collectionStatus || 'Perfect',
                notes: data?.notes
            });
            setCurrentTask(null);
            setTaskStatus('completed');
            setActiveTab('home');
            // Re-fetch to clear state
            await fetchTasks();
        } catch (e) { console.error('Failed to complete task:', e); }
    };

    // Duty Toggle
    const handleToggleDuty = async () => {
        if (!user) return;
        if (user.status === 'On Leave') return; // Should be handled by UI too

        // Assuming user.status exists on the user object from AuthContext
        // If not, we might need to extend the type or fetch it.
        // User interface in AuthContext needs to have status. 
        // Let's assume it does or I will add it if I see an error.

        // Use a safe cast if needed or reliable logic
        const currentStatus = (user as any).status || 'Off Duty';
        const newStatus = currentStatus === 'On Duty' ? 'Off Duty' : 'On Duty';

        try {
            await import('../../api/users').then(m => m.updateStatus(newStatus));
            await refreshUser();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

            {/* LEFT SIDEBAR - Responsive Wrapper */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full", // Mobile menu state
                isSidebarCollapsed ? "md:w-20 md:translate-x-0" : "md:w-64 md:translate-x-0" // Desktop sidebar state
            )}>
                <div className="h-full relative z-10">
                    <PersonnelSidebar
                        activeTab={activeTab}
                        setActiveTab={(tab) => {
                            setActiveTab(tab);
                            setIsMobileMenuOpen(false);
                        }}
                        isCollapsed={isSidebarCollapsed}
                        onToggle={toggleSidebar}
                    />
                </div>
            </div>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Page Header - Fixed at Top */}
                <div className="shrink-0 z-10 bg-white dark:bg-gray-950/80 backdrop-blur-md transition-all duration-200">
                    <Header
                        user={user}
                        onLogout={logout}
                        onMenuClick={() => setIsMobileMenuOpen(true)}
                    />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-24">
                    <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
                        {/* --- TAB VIEW RENDERER --- */}
                        {activeTab === 'assignments' && (
                            <AssignmentsTab
                                taskStatus={taskStatus}
                                pendingTask={currentTask}
                                onAcceptTask={handleAcceptTask}
                            />
                        )}

                        {activeTab === 'vehicle' && (
                            <VehicleTab
                                onInspectionComplete={handleInspectionComplete}
                                user={user}
                                taskStatus={taskStatus}
                            />
                        )}

                        {activeTab === 'home' && (
                            <HomeTab
                                taskStatus={taskStatus}
                                currentTask={currentTask}
                                onAcceptTask={handleAcceptTask}
                                onStartTask={handleStartTask}
                                onCompleteTask={handleCompleteTask}
                                user={user}
                                onToggleDuty={handleToggleDuty}
                            />
                        )}

                        {activeTab === 'route' && (
                            <RouteTab taskStatus={taskStatus} currentTask={currentTask} />
                        )}

                        {activeTab === 'history' && (
                            <HistoryTab />
                        )}

                        {activeTab === 'leave' && (
                            <LeaveTab user={user} />
                        )}

                        {activeTab === 'profile' && (
                            <ProfileTab />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsTab />
                        )}
                    </div>
                </div>

                {/* Floating Support Button */}
                {activeTab !== 'profile' && activeTab !== 'settings' && taskStatus !== 'pending' && (
                    <div className="absolute bottom-6 right-8 z-40">
                        <Button className="h-14 w-14 rounded-full bg-civic-dark shadow-2xl shadow-gray-400 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                            <Phone className="h-6 w-6 text-white" />
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
