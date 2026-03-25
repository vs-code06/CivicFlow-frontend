import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ResidentSidebar } from './components/ResidentSidebar';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { cn } from '../../lib/utils';
import { getZoneById, getZones, Zone } from '../../api/zones';

// Tabs
import { ResHomeTab } from './tabs/ResHomeTab';
import { ResComplaintsTab } from './tabs/ResComplaintsTab';
import { ResEducationTab } from './tabs/ResEducationTab';
import { ResSettingsTab } from './tabs/ResSettingsTab';
import { ResScheduleTab } from './tabs/ResScheduleTab';
import { ChatbotWidget } from '../../components/common/ChatbotWidget';

export function ResidentDashboard() {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'complaints' | 'settings' | 'education'>('home');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Location & Zone State
    const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
    const [currentLocation, setCurrentLocation] = useState({ zone: "Unassigned", location: "Select Location" });
    const [availableZones, setAvailableZones] = useState<Zone[]>([]);
    const [tempZone, setTempZone] = useState<Zone | null>(null);
    const [zoneData, setZoneData] = useState<Zone | null>(null);


    // Fetch All Zones for Selection
    useEffect(() => {
        const fetchAvailableZones = async () => {
            try {
                const zones = await getZones();
                setAvailableZones(zones);
            } catch (error) {
                console.error("Failed to fetch zones list", error);
            }
        };
        fetchAvailableZones();
    }, []);

    // Fetch User's Zone Data
    useEffect(() => {
        const fetchZone = async () => {
            if (user?.zoneId) {
                try {

                    const data = await getZoneById(user.zoneId);
                    setZoneData(data);
                    if (data) {
                        setCurrentLocation({ zone: data.name, location: user.address?.split(',')[0] || "Area Selected" });
                    }
                } catch (error) {
                    console.error("Failed to fetch zone", error);
                } finally {

                }
            }
        };
        fetchZone();
    }, [user?.zoneId, user?.address]);

    const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

    const handleUpdateLocation = async (location: string) => {
        if (tempZone) {
            // Optimistic update
            setCurrentLocation({ zone: tempZone.name, location: location });

            // Persist to backend
            try {
                await updateProfile({ zoneId: tempZone._id, address: location });
                // Refresh zone data will happen via useEffect dependency on user.zoneId
                // But we might need to manually trigger a re-fetch if updateProfile doesn't update 'user' immediately for this effect
                setZoneData(tempZone); // Immediate UI update
            } catch (error) {
                console.error("Failed to update profile", error);
            }

            setIsLocationDialogOpen(false);
            setTempZone(null);
        }
    };

    const handleCloseDialog = () => {
        setIsLocationDialogOpen(false);
        setTempZone(null);
    }

    if (!user) return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden text-civic-dark dark:text-gray-200">

            {/* Sidebar: Hidden on Mobile, Visible on Desktop */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full", // Mobile menu state
                isSidebarCollapsed ? "md:w-[80px] md:translate-x-0" : "md:w-[280px] md:translate-x-0" // Desktop sidebar state
            )}>
                <div className="h-full relative z-10">
                    <ResidentSidebar
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Page Header - Fixed at Top */}
                <div className="shrink-0 z-10 bg-white dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 p-4 md:p-5 shadow-sm">
                    <div className="max-w-7xl mx-auto w-full flex justify-between items-start gap-4">
                        {/* Mobile Menu Button */}
                        <Button variant="ghost" size="icon" className="md:hidden shrink-0" onClick={() => setIsMobileMenuOpen(true)}>
                            <span className="sr-only">Menu</span>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </Button>

                        <div className="flex-1">
                            <h1 className="text-xl md:text-2xl font-bold text-[#212121] dark:text-white capitalize tracking-tight truncate">
                                {activeTab === 'home' ? 'Dashboard Overview' :
                                    activeTab === 'education' ? 'Waste Wizard' :
                                        activeTab}
                            </h1>
                            <p className="text-xs md:text-sm text-gray-500 truncate">Welcome back, {user?.name}</p>
                        </div>

                        {/* LOCATION SELECTOR (Visible on Home) */}
                        {activeTab === 'home' && (
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1.5 pr-3 rounded-full border border-gray-100 dark:border-gray-700 shrink-0">
                                <div className="bg-white dark:bg-gray-800 text-blue-600 p-1.5 md:p-2 rounded-full shadow-sm">
                                    <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                                </div>
                                <div className="text-right hidden sm:block">
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Current Location</div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                        {user?.address ? user.address.split(',')[0] : currentLocation.location}
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setIsLocationDialogOpen(true)}
                                    className="ml-1 text-blue-600 hover:text-blue-700 font-bold text-xs h-7 hover:bg-white dark:hover:bg-gray-800"
                                >
                                    Change
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* LOCATION UPDATE DIALOG */}
                <Dialog
                    isOpen={isLocationDialogOpen}
                    onClose={handleCloseDialog}
                    title={tempZone ? "Select Area" : "Select Zone"}
                    description={tempZone ? `Choose a location within ${tempZone.name}` : "Select your primary service zone"}
                >
                    <div className="space-y-4 pt-2">
                        {!tempZone ? (
                            // STEP 1: SELECT ZONE
                            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
                                {availableZones.map((zone) => (
                                    <button
                                        key={zone._id}
                                        onClick={() => setTempZone(zone)}
                                        className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                                    >
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-700 group-hover:text-blue-700">{zone.name}</span>
                                            <span className="text-xs text-gray-400">{zone.areas.length} Areas</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500" />
                                    </button>
                                ))}
                            </div>
                        ) : (
                            // STEP 2: SELECT LOCATION (AREA)
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                                    {tempZone.areas.map((area: any) => (
                                        <button
                                            key={area._id || area.name}
                                            onClick={() => handleUpdateLocation(area.name)}
                                            className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-left"
                                        >
                                            <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                                            <span className="font-medium text-gray-700">{area.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <Button variant="ghost" className="w-full text-gray-400 hover:text-gray-600" onClick={() => setTempZone(null)}>
                                    ← Back to Zones
                                </Button>
                            </div>
                        )}
                    </div>
                </Dialog>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto relative">
                    <div className="p-4 md:p-6 lg:p-8 pb-24 min-h-full">
                        <div className="max-w-7xl mx-auto space-y-8 w-full">

                            {/* TAB RENDERER */}
                            {activeTab === 'home' && <ResHomeTab currentLocation={currentLocation} zone={zoneData} onSelectLocation={() => setIsLocationDialogOpen(true)} onNavigate={setActiveTab} />}
                            {activeTab === 'complaints' && <ResComplaintsTab />}
                            {activeTab === 'education' && <ResEducationTab />}
                            {activeTab === 'settings' && <ResSettingsTab />}
                            {activeTab === 'schedule' && <ResScheduleTab onNavigateToWizard={() => setActiveTab('education')} zone={zoneData} />}

                        </div>
                    </div>
                </div>

            </div>
            <ChatbotWidget />
        </div>
    );
}
