import React, { useState, useEffect } from 'react';
import { Clock, Truck, AlertTriangle, ChevronRight, Leaf, Recycle, Trash2, Info, BellRing, Wine, Newspaper, Calendar as CalendarIcon, Package, Loader2, User } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../lib/utils';
import { Zone, getZoneScheduleStatus } from '../../../api/zones';

interface ResScheduleTabProps {
    onNavigateToWizard?: () => void;
    zone?: Zone | null;
}

interface LiveStatus {
    todayScheduled: boolean;
    status: 'scheduled' | 'driver-en-route' | 'dispatched' | 'completed' | 'delayed' | 'no-pickup';
    types: string[];
    scheduledTime?: string;
    driver?: { name: string; avatar?: string; phone?: string } | null;
    vehicle?: { vehicleId: string; type?: string; licensePlate?: string } | null;
    eta?: string;
    startedAt?: string;
    completedAt?: string;
}

export function ResScheduleTab({ onNavigateToWizard, zone }: ResScheduleTabProps) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [liveStatus, setLiveStatus] = useState<LiveStatus | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [selectedDayOffset, setSelectedDayOffset] = useState(() => {
        // Default to today's position in the Mon-Sun grid
        const dow = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
        return (dow + 6) % 7; // Convert to Mon=0, Tue=1, ... Sun=6
    });

    // Fetch real-time status for today
    useEffect(() => {
        const fetchStatus = async () => {
            if (!zone?._id) { setLoadingStatus(false); return; }
            try {
                const data = await getZoneScheduleStatus(zone._id);
                setLiveStatus(data);
            } catch (err) {
                console.error('Failed to fetch schedule status:', err);
            } finally {
                setLoadingStatus(false);
            }
        };
        fetchStatus();
        // Poll every 30s for live updates
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, [zone?._id]);

    // Build real upcoming pickups from zone.schedule
    const getUpcomingPickups = () => {
        if (!zone?.schedule) return [];
        const pickups: { id: string; date: string; day: string; types: string[]; status: string; startTime?: string }[] = [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();

        // Start from the day AFTER the selected day
        for (let i = 1; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dayName = days[d.getDay()];
            const scheduleForDay = zone.schedule.find(s => s.day === dayName);
            if (scheduleForDay) {
                pickups.push({
                    id: `pickup-${i}`,
                    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    day: i === 1 ? 'Tomorrow' : dayName,
                    types: scheduleForDay.types,
                    status: 'scheduled',
                    startTime: scheduleForDay.startTime,
                });
            }
        }
        return pickups;
    };

    const upcomingPickups = getUpcomingPickups();

    // Build real calendar for current week
    const getWeekDays = () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Get Monday

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            const dayName = days[d.getDay()];
            const hasPickup = zone?.schedule?.some(s => s.day === dayName);
            const scheduleEntry = zone?.schedule?.find(s => s.day === dayName);
            const types = scheduleEntry?.types;
            const isToday = d.toDateString() === today.toDateString();
            return {
                day: shortDays[i],
                date: d.getDate().toString().padStart(2, '0'),
                fullDate: d,
                dayName,
                isToday,
                isSelected: i === selectedDayOffset,
                hasPickup: !!hasPickup,
                types,
                startTime: scheduleEntry?.startTime,
                endTime: scheduleEntry?.endTime,
                weekIndex: i,
            };
        });
    };

    const weekDays = getWeekDays();

    const getWasteIcon = (type: string) => {
        switch (type) {
            case 'trash': return <Trash2 className="h-4 w-4 text-gray-500" />;
            case 'recycle': return <Recycle className="h-4 w-4 text-blue-500" />;
            case 'compost': return <Leaf className="h-4 w-4 text-green-500" />;
            case 'bulk': return <Package className="h-4 w-4 text-orange-500" />;
            default: return <Truck className="h-4 w-4 text-gray-400" />;
        }
    };

    const getWasteLabel = (type: string) => {
        switch (type) {
            case 'trash': return 'General Waste';
            case 'recycle': return 'Recycling';
            case 'compost': return 'Green Waste';
            case 'bulk': return 'Bulk Pickup';
            default: return 'Pickup';
        }
    };

    // Status display helpers
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'driver-en-route':
                return { label: 'Driver En Route', color: 'bg-green-500/20 text-green-300', live: true };
            case 'dispatched':
                return { label: 'Dispatched', color: 'bg-blue-500/20 text-blue-200', live: false };
            case 'completed':
                return { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300', live: false };
            case 'delayed':
                return { label: 'Delayed', color: 'bg-red-500/20 text-red-300', live: true };
            case 'no-pickup':
                return { label: 'No Pickup Today', color: 'bg-gray-500/20 text-gray-300', live: false };
            default:
                return { label: 'Scheduled', color: 'bg-blue-500/20 text-blue-200', live: false };
        }
    };

    const todayStatus = liveStatus ? getStatusConfig(liveStatus.status) : null;

    // Get info about the selected day from the calendar
    const selectedDayData = weekDays[selectedDayOffset];
    const isViewingToday = selectedDayData?.isToday;
    const selectedDaySchedule = selectedDayData?.hasPickup ? {
        types: selectedDayData.types || [],
        startTime: selectedDayData.startTime,
        endTime: selectedDayData.endTime,
    } : null;

    return (
        <div className="w-full max-w-none mx-auto flex flex-col gap-6 animate-in fade-in duration-500 pb-20">

            {/* SERVICE ALERTS */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-100 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span><span className="font-bold">Notice:</span> Schedule is set by your zone administrator. Contact them for changes.</span>
            </div>

            {/* TOP ROW: HERO + SORTING FOCUS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: SELECTED DAY STATUS HERO (2/3) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-gray-200/20 dark:shadow-none relative overflow-hidden group flex flex-col justify-between min-h-[280px]">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none" />

                    {loadingStatus && isViewingToday ? (
                        <div className="relative z-10 flex flex-col items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 text-blue-300 animate-spin" />
                            <p className="text-sm text-blue-200/60 mt-3">Checking today's status...</p>
                        </div>
                    ) : isViewingToday && liveStatus?.todayScheduled ? (
                        /* TODAY with live status */
                        <>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn("border-0 uppercase tracking-wider text-[10px] font-bold py-1 px-2.5", todayStatus?.color)}>
                                            {todayStatus?.label}
                                        </Badge>
                                        {todayStatus?.live && (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl md:text-5xl font-bold tracking-tight">Today</div>
                                        <div className="text-blue-200/60 font-medium uppercase tracking-widest text-xs mt-1">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                {liveStatus.driver && (
                                    <div className="flex items-center gap-4 text-gray-100/80 text-sm font-medium mb-4 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                                        <User className="h-4 w-4 text-green-300" />
                                        <span>{liveStatus.driver.name}</span>
                                        {liveStatus.vehicle && (
                                            <span className="text-blue-200/60">• {liveStatus.vehicle.vehicleId}</span>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4 text-gray-100/80 text-sm font-medium mb-8 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                                    <Clock className="h-4 w-4 text-green-300" />
                                    {liveStatus.status === 'completed'
                                        ? `Completed at ${liveStatus.completedAt ? new Date(liveStatus.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'today'}`
                                        : liveStatus.scheduledTime
                                            ? `Window: ${liveStatus.scheduledTime}`
                                            : 'Regular Schedule (8 AM - 4 PM)'}
                                </div>
                            </div>

                            <div className="flex gap-3 relative z-10">
                                {liveStatus.types.map(type => (
                                    <div key={type} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors cursor-default">
                                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shadow-inner",
                                            type === 'recycle' ? "bg-blue-500/20 text-blue-300" :
                                                type === 'compost' ? "bg-green-500/20 text-green-300" :
                                                    type === 'bulk' ? "bg-orange-500/20 text-orange-300" :
                                                        "bg-gray-500/20 text-gray-300"
                                        )}>
                                            {getWasteIcon(type)}
                                        </div>
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : selectedDaySchedule ? (
                        /* NON-TODAY day with a schedule */
                        <>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2">
                                        <Badge className="border-0 uppercase tracking-wider text-[10px] font-bold py-1 px-2.5 bg-blue-500/20 text-blue-200">
                                            Scheduled
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl md:text-5xl font-bold tracking-tight">{selectedDayData?.dayName}</div>
                                        <div className="text-blue-200/60 font-medium uppercase tracking-widest text-xs mt-1">
                                            {selectedDayData?.fullDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-gray-100/80 text-sm font-medium mb-8 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                                    <Clock className="h-4 w-4 text-green-300" />
                                    <span>Window: {selectedDaySchedule.startTime || '08:00'} - {selectedDaySchedule.endTime || '16:00'}</span>
                                </div>
                            </div>

                            <div className="flex gap-3 relative z-10">
                                {selectedDaySchedule.types.map((type: string) => (
                                    <div key={type} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors cursor-default">
                                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shadow-inner",
                                            type === 'recycle' ? "bg-blue-500/20 text-blue-300" :
                                                type === 'compost' ? "bg-green-500/20 text-green-300" :
                                                    type === 'bulk' ? "bg-orange-500/20 text-orange-300" :
                                                        "bg-gray-500/20 text-gray-300"
                                        )}>
                                            {getWasteIcon(type)}
                                        </div>
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">{type}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* No pickup on the selected day */
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                            <Truck className="h-12 w-12 text-blue-300/20 mb-4" />
                            <h3 className="text-xl font-bold text-white">No Pickup on {selectedDayData?.dayName || 'this day'}</h3>
                            <p className="text-sm text-blue-200/60 mt-2">
                                {zone?.schedule && zone.schedule.length > 0
                                    ? 'Select a day with colored dots to see its schedule.'
                                    : 'No schedule has been set for your zone yet.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT: PREPARATION (1/3) */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-500" /> Preparation
                        </h3>
                        <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-md">For Today</span>
                    </div>

                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                <Wine className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Clean Glass</div>
                                <div className="text-xs text-gray-500">Rinse bottles & jars</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                <Newspaper className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-100">Paper</div>
                                <div className="text-xs text-gray-500">Keep dry and flat</div>
                            </div>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4 rounded-xl text-xs font-bold border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={onNavigateToWizard}>
                        Open Waste Wizard
                    </Button>
                </div>
            </div>

            {/* WEEKLY CALENDAR STRIP */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">This Week</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border", notificationsEnabled ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" : "bg-transparent text-gray-400 border-transparent hover:bg-gray-100")}>
                            <BellRing className="h-3 w-3" /> {notificationsEnabled ? 'On' : 'Off'}
                        </button>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-x-auto">
                    <div className="grid grid-cols-7 gap-2 min-w-[600px]">
                        {weekDays.map((day, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedDayOffset(idx)}
                                className={cn("flex flex-col items-center p-3 rounded-2xl transition-all cursor-pointer relative group",
                                    day.isSelected
                                        ? "bg-gray-900 text-white shadow-lg ring-4 ring-gray-100 dark:ring-gray-700"
                                        : day.isToday
                                            ? "bg-gray-100 dark:bg-gray-700 ring-2 ring-gray-200 dark:ring-gray-600"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-500"
                                )}
                            >
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", day.isSelected ? "text-gray-300" : day.isToday ? "text-blue-500 font-extrabold" : "text-gray-400")}>{day.day}</span>
                                <span className={cn("text-xl font-bold mb-2", day.isSelected ? "text-white" : "text-gray-900 dark:text-white")}>{day.date}</span>

                                <div className="h-6 flex items-center justify-center">
                                    {day.types ? (
                                        <div className="flex -space-x-1">
                                            {day.types.map(type => (
                                                <div key={type} className={cn("h-2.5 w-2.5 rounded-full ring-2",
                                                    day.isSelected ? "ring-gray-900" : "ring-white dark:ring-gray-800",
                                                    type === 'recycle' ? "bg-blue-500" :
                                                        type === 'compost' ? "bg-green-500" :
                                                            type === 'bulk' ? "bg-orange-500" :
                                                                "bg-gray-500"
                                                )} />
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="h-1 w-1 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300" />
                                    )}
                                </div>

                                {/* Today status indicator */}
                                {day.isToday && liveStatus?.todayScheduled && (
                                    <div className={cn("absolute -top-1 -right-1 h-3 w-3 rounded-full border-2",
                                        day.isSelected ? "border-gray-900" : "border-white dark:border-gray-800",
                                        liveStatus.status === 'completed' ? 'bg-emerald-500' :
                                            liveStatus.status === 'driver-en-route' ? 'bg-green-500 animate-pulse' :
                                                liveStatus.status === 'delayed' ? 'bg-red-500 animate-pulse' :
                                                    'bg-blue-500'
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* UPCOMING COLLECTIONS */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1">Upcoming Collections</h3>
                {upcomingPickups.length > 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                        {upcomingPickups.slice(0, 7).map((item, idx) => (
                            <div key={item.id} className={cn("flex items-center p-4 gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group", idx !== Math.min(upcomingPickups.length, 7) - 1 ? "border-b border-gray-100 dark:border-gray-800" : "")}>
                                <div className="flex flex-col items-center justify-center h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                    <span className="text-[9px] uppercase font-bold text-gray-400">{item.day.substring(0, 3)}</span>
                                    <span className="text-base font-bold text-gray-900 dark:text-white">{item.date.split(' ')[1]}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Regular Pickup</h4>
                                        <Badge variant="secondary" className="text-[9px] text-gray-500 bg-gray-100 dark:bg-gray-800 border-0 h-5 px-1.5">Scheduled</Badge>
                                    </div>
                                    <div className="flex gap-3 text-xs text-gray-500">
                                        {item.types.map(t => (
                                            <span key={t} className="flex items-center gap-1.5">
                                                {getWasteIcon(t)} {getWasteLabel(t)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-gray-900">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 p-12 text-center shadow-sm">
                        <CalendarIcon className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-400">No upcoming collections</p>
                        <p className="text-xs text-gray-400 mt-1">Your zone doesn't have a collection schedule set yet. Contact your administrator.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
