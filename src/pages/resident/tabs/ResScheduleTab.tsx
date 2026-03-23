import React, { useState } from 'react';
import { Clock, Truck, AlertTriangle, ChevronRight, Leaf, Recycle, Trash2, Info, BellRing, Wine, Newspaper, ChevronLeft, Calendar as CalendarIcon, MapPin, Search, Filter, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

import { cn } from '../../../lib/utils';
import { Zone } from '../../../api/zones';

interface PickupEvent {
    id: string;
    date: string;
    day: string;
    types: string[]; // e.g. 'trash', 'recycle', 'compost'
    status: 'driver-en-route' | 'scheduled' | 'completed' | 'delayed';
    driverEta?: string;
}

interface ResScheduleTabProps {
    onNavigateToWizard?: () => void;
    zone?: Zone | null;
}

export function ResScheduleTab({ onNavigateToWizard, zone }: ResScheduleTabProps) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Helper: Get next pickups from zone schedule
    const getUpcomingPickups = (): PickupEvent[] => {
        if (!zone?.schedule) return [];

        const pickups: PickupEvent[] = [];
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();

        // Look ahead 14 days
        for (let i = 0; i < 14; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);
            const dayName = days[d.getDay()];

            const scheduleForDay = zone.schedule.find(s => s.day === dayName);

            if (scheduleForDay) {
                let status: PickupEvent['status'] = 'scheduled';
                if (i === 0) status = 'driver-en-route'; // Mock status for today

                pickups.push({
                    id: `pickup-${i}`,
                    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    day: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayName,
                    types: scheduleForDay.types,
                    status: status,
                    driverEta: scheduleForDay.startTime
                });
            }
        }
        return pickups;
    };

    const upcomingPickups = getUpcomingPickups();
    const nextPickup = upcomingPickups[0];

    // Helper: Check if a day has pickup (for calendar view)
    const hasPickup = (dayName: string) => {
        return zone?.schedule?.some(s => s.day === dayName);
    };

    const weekDays = [
        { day: 'Mon', date: '27', status: hasPickup('Monday') ? 'pickup' : 'no-pickup', types: zone?.schedule?.find(s => s.day === 'Monday')?.types },
        { day: 'Tue', date: '28', status: hasPickup('Tuesday') ? 'pickup' : 'no-pickup', types: zone?.schedule?.find(s => s.day === 'Tuesday')?.types },
        { day: 'Wed', date: '29', status: hasPickup('Wednesday') ? 'pickup' : 'no-pickup', types: zone?.schedule?.find(s => s.day === 'Wednesday')?.types },
        { day: 'Thu', date: '30', status: hasPickup('Thursday') ? 'pickup' : 'no-pickup', types: zone?.schedule?.find(s => s.day === 'Thursday')?.types },
        { day: 'Fri', date: '31', status: hasPickup('Friday') ? 'pickup' : 'no-pickup', types: zone?.schedule?.find(s => s.day === 'Friday')?.types },
        { day: 'Sat', date: '01', status: hasPickup('Saturday') ? 'pickup' : 'no-pickup', types: zone?.schedule?.find(s => s.day === 'Saturday')?.types },
        { day: 'Sun', date: '02', status: hasPickup('Sunday') ? 'pickup' : 'no-pickup', types: zone?.schedule?.find(s => s.day === 'Sunday')?.types },
    ];

    // ... (rest of date logic)

    const getWasteIcon = (type: string) => {
        switch (type) {
            case 'trash': return <Trash2 className="h-4 w-4 text-gray-500" />;
            case 'recycle': return <Recycle className="h-4 w-4 text-blue-500" />;
            case 'compost': return <Leaf className="h-4 w-4 text-green-500" />;
            default: return <Truck className="h-4 w-4 text-gray-400" />;
        }
    };

    const getWasteLabel = (type: string) => {
        switch (type) {
            case 'trash': return 'General Waste';
            case 'recycle': return 'Recycling';
            case 'compost': return 'Green Waste';
            default: return 'Pickup';
        }
    };


    return (
        <div className="w-full max-w-none mx-auto flex flex-col gap-6 animate-in fade-in duration-500 pb-20">

            {/* SERVICE ALERTS - Subtle Top Banner */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-100 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
                <span><span className="font-bold">Notice:</span> Collections next week delayed by 1 day due to Bank Holiday.</span>
            </div>

            {/* TOP ROW: HERO + SORTING FOCUS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: NEXT PICKUP HERO (2/3) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-200/20 dark:shadow-none relative overflow-hidden group flex flex-col justify-between min-h-[280px]">
                    {/* Animated Background Decor */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none"></div>

                    {nextPickup ? (
                        <>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-2">
                                        <Badge className={cn("border-0 uppercase tracking-wider text-[10px] font-bold py-1 px-2.5",
                                            nextPickup.status === 'driver-en-route'
                                                ? "bg-green-500/20 text-green-300 animate-in fade-in duration-1000"
                                                : "bg-blue-500/20 text-blue-200"
                                        )}>
                                            {nextPickup.status === 'driver-en-route' ? 'Driver En Route' : 'Next Pickup'}
                                        </Badge>
                                        {nextPickup.status === 'driver-en-route' && (
                                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span> Live
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl md:text-5xl font-bold tracking-tight">{nextPickup.day}</div>
                                        <div className="text-blue-200/60 font-medium uppercase tracking-widest text-xs mt-1">{nextPickup.date}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-blue-100/80 text-sm font-medium mb-8 bg-white/5 w-fit px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                                    <Clock className="h-4 w-4 text-blue-300" />
                                    {nextPickup.driverEta ? `Estimated arrival: ${nextPickup.driverEta}` : 'Regular Schedule (8 AM - 4 PM)'}
                                </div>
                            </div>

                            {/* Bin Types Display (Bottom of Card) */}
                            <div className="flex gap-3 relative z-10">
                                {nextPickup.types.map(type => (
                                    <div key={type} className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/15 transition-colors cursor-default">
                                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shadow-inner",
                                            type === 'recycle' ? "bg-blue-500/20 text-blue-300" :
                                                type === 'compost' ? "bg-green-500/20 text-green-300" :
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
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
                            <Truck className="h-12 w-12 text-blue-300/20 mb-4" />
                            <h3 className="text-xl font-bold text-white">No Upcoming Pickups</h3>
                            <p className="text-sm text-blue-200/60 mt-2">Check back later for schedule updates.</p>
                        </div>
                    )}
                </div>

                {/* RIGHT: TODAY'S FOCUS (1/3) */}
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

                    <Button
                        variant="outline"
                        className="w-full mt-4 rounded-xl text-xs font-bold border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={onNavigateToWizard}
                    >
                        Open Waste Wizard
                    </Button>
                </div>
            </div>

            {/* MIDDLE ROW: WEEKLY CALENDAR STRIP */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">This Week</h3>
                    <div className="flex gap-2">
                        <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border", notificationsEnabled ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-transparent text-gray-400 border-transparent hover:bg-gray-100")}>
                            <BellRing className="h-3 w-3" /> {notificationsEnabled ? 'On' : 'Off'}
                        </button>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-x-auto">
                    <div className="grid grid-cols-7 gap-2 min-w-[600px]">
                        {weekDays.map((day, idx) => (
                            <div key={idx} className={cn("flex flex-col items-center p-3 rounded-2xl transition-all cursor-pointer relative group",
                                day.status === 'today'
                                    ? "bg-gray-900 text-white shadow-lg ring-4 ring-gray-100 dark:ring-gray-700"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-500"
                            )}>
                                <span className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", day.status === 'today' ? "text-gray-300" : "text-gray-400")}>{day.day}</span>
                                <span className={cn("text-xl font-bold mb-2", day.status === 'today' ? "text-white" : "text-gray-900 dark:text-white")}>{day.date}</span>

                                {/* Status Indicator */}
                                <div className="h-6 flex items-center justify-center">
                                    {day.types ? (
                                        <div className="flex -space-x-1">
                                            {day.types.map(type => (
                                                <div key={type} className={cn("h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-800",
                                                    type === 'recycle' ? "bg-blue-500" :
                                                        type === 'compost' ? "bg-green-500" :
                                                            "bg-gray-500"
                                                )}></div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="h-1 w-1 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300"></span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* UPCOMING LIST */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-1">Upcoming Collections</h3>
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                    {upcomingPickups.slice(1).map((item, idx) => (
                        <div key={item.id} className={cn("flex items-center p-4 gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group", idx !== upcomingPickups.length - 2 ? "border-b border-gray-100 dark:border-gray-800" : "")}>
                            {/* Date Box */}
                            <div className="flex flex-col items-center justify-center h-12 w-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                                <span className="text-[9px] uppercase font-bold text-gray-400">{item.day.substring(0, 3)}</span>
                                <span className="text-base font-bold text-gray-900 dark:text-white">{item.date.split(' ')[1]}</span>
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Regular Pickup</h4>
                                    {item.status === 'scheduled' && <Badge variant="secondary" className="text-[9px] text-gray-500 bg-gray-100 dark:bg-gray-800 border-0 h-5 px-1.5">Scheduled</Badge>}
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
                    {/* Add Calendar Subs button at bottom */}
                    <div className="p-3 bg-gray-50/50 dark:bg-gray-900/30 text-center border-t border-gray-100 dark:border-gray-800">
                        <Button variant="link" className="text-xs text-gray-400 hover:text-blue-600 h-8 no-underline hover:underline">
                            Sync to Google Calendar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
