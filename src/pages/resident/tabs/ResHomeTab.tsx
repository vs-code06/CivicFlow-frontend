import React from 'react';
import {
    Clock,
    CheckCircle2,
    Calendar,
    MapPin,
    AlertCircle,
    ChevronRight,
    Truck,
    Leaf,
    Activity,
    Megaphone
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Zone, getZoneScheduleStatus } from '../../../api/zones';
import { EfficiencyGauge } from '../components/EfficiencyGauge';


interface ResHomeTabProps {
    currentLocation: {
        zone: string;
        location: string;
    };
    zone?: Zone | null;
    onSelectLocation: () => void;
    onNavigate?: (tab: 'home' | 'schedule' | 'complaints' | 'settings' | 'education') => void;
}

export function ResHomeTab({ currentLocation, zone, onSelectLocation, onNavigate }: ResHomeTabProps) {

    const [todayCompleted, setTodayCompleted] = React.useState(false);

    // Fetch today's schedule status to know if pickup is completed
    React.useEffect(() => {
        if (zone?._id) {
            getZoneScheduleStatus(zone._id)
                .then(data => {
                    if (data?.status === 'completed') {
                        setTodayCompleted(true);
                    }
                })
                .catch(() => {});
        }
    }, [zone?._id]);

    // Helper to calculate next pickup
    const getNextPickup = () => {
        if (!zone?.schedule || zone.schedule.length === 0) return { day: 'Unknown', types: ['Waiting for schedule...'] };

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayIdx = new Date().getDay();
        const todayName = days[todayIdx];

        // Check for today's pickup — only show if NOT completed
        if (!todayCompleted) {
            const todayPickup = zone.schedule.find(s => s.day === todayName);
            if (todayPickup) return { day: 'Today', types: todayPickup.types, time: todayPickup.startTime };
        }

        // Find next day
        const sortedSchedule = [...zone.schedule].sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));

        let next = sortedSchedule.find(s => days.indexOf(s.day) > todayIdx);
        if (!next) next = sortedSchedule[0]; // Wrap around to next week

        return { day: next.day, types: next.types, time: next.startTime };
    };

    const [activeTask, setActiveTask] = React.useState<any>(null);

    React.useEffect(() => {
        if (currentLocation.zone !== 'Unassigned') {
            import('../../../api/tasks').then(m => m.getResidentActiveTask())
                .then(task => setActiveTask(task))
                .catch(err => console.error("Failed to load active task", err));
        }
    }, [currentLocation]);

    const nextPickup = getNextPickup();
    const activeAlert = zone?.alerts?.find(a => a.active);

    // ... existing activeAlert logic ...

    // EMPTY STATE: No Location Selected
    if (currentLocation.zone === 'Unassigned') {
        // ... existing empty state ...
        return (
            <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-full mb-6 relative">

                    <MapPin className="h-12 w-12 text-green-600 dark:text-green-400 relative z-10" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Welcome Home! 🏡</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8 text-lg">
                    To see your personalized pickup schedule, local alerts, and service status, please select your neighborhood.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        size="lg"
                        onClick={onSelectLocation}
                        className="rounded-full px-8 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all font-bold text-base"
                    >
                        <MapPin className="mr-2 h-5 w-5" /> Select Location
                    </Button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-12 grid grid-cols-3 gap-6 opacity-40 max-w-lg mx-auto grayscale">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 full bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center"><Truck className="h-5 w-5" /></div>
                        <span className="text-xs font-bold">Track Pickups</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 full bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center"><AlertCircle className="h-5 w-5" /></div>
                        <span className="text-xs font-bold">Get Alerts</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-10 w-10 full bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center"><Activity className="h-5 w-5" /></div>
                        <span className="text-xs font-bold">View Status</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-12 w-full">


            {/* 1. PRIMARY FLOATING CARD (Live Status or Next Service) */}
            {activeTask ? (
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 md:p-8 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 mb-10 relative overflow-hidden group">
                    {/* Live Pulse Animation */}
                    <div className="absolute top-0 right-0 p-4">
                        <span className="relative flex h-3 w-3">

                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-400"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-xl shadow-sm">
                                    <Truck className="h-5 w-5" />
                                </span>
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">Collection in Progress</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Truck En Route</h2>
                            <div className="flex items-center gap-2 text-gray-500 font-medium text-lg">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <span className="text-sm md:text-lg">Currently active in <span className="text-gray-900 dark:text-white font-bold">{zone?.name || 'Your Zone'}</span></span>
                            </div>

                            {/* Driver Info */}
                            {activeTask.vehicleId && (
                                <div className="mt-6 flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 max-w-md">
                                    <div className="h-12 w-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm text-2xl">
                                        🚛
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle</div>
                                        <div className="font-bold text-gray-900 dark:text-white">{activeTask.vehicleId.licensePlate} • {activeTask.vehicleId.type}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-auto min-w-0 md:min-w-[300px] flex justify-center">
                            <EfficiencyGauge
                                score={zone?.healthScore || 100}
                                metrics={zone?.currentMetrics}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 md:p-8 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-700 mb-10 relative overflow-hidden group">
                    {/* Subtle Accent Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="inline-flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl">
                                    <Clock className="h-5 w-5" />
                                </span>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Next Pickup</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">{nextPickup.day}</h2>
                            <div className="flex items-center gap-2 text-gray-500 font-medium text-lg">
                                <span className="text-sm md:text-lg">Estimated arrival <span className="text-gray-900 dark:text-white font-bold">{nextPickup.time || '8:00 AM'}</span></span>
                            </div>
                            {nextPickup.types && (
                                <div className="flex gap-2 mt-4">
                                    {nextPickup.types.map((type: any) => (
                                        <Badge key={type} variant="secondary" className="uppercase text-[10px] tracking-wider">{type}</Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="w-full md:w-auto min-w-0 md:min-w-[300px] flex justify-center">
                            <EfficiencyGauge
                                score={zone?.healthScore || 100}
                                metrics={zone?.currentMetrics}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* 2. SERVICE & COMMUNITY INFO ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

                {/* Card 1: System Status */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Activity className="h-5 w-5" />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
                                <CheckCircle2 className="h-3 w-3" /> Zone Health: {zone?.healthScore || 100}%
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Service Status</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                            {zone?.status === 'Critical'
                                ? "Service disruptions reported. Check alerts."
                                : `No delays reported in ${zone?.name || currentLocation.zone}. Trucks are operating on standard schedule.`}
                        </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs font-medium text-gray-400">
                            <span>Last updated: Recently</span>
                            <span className="flex items-center gap-1 text-green-500"><div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> Live</span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Community Notice / Alerts */}
                {activeAlert ? (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col justify-between border-l-4 border-l-amber-500">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 font-bold border-0">Alert</Badge>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{activeAlert.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                {activeAlert.message}
                            </p>
                        </div>
                        <Button variant="link" className="mt-2 p-0 h-auto text-amber-600 dark:text-amber-400 text-xs font-bold self-start">
                            View Details <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="h-10 w-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                    <Megaphone className="h-5 w-5" />
                                </div>
                                <Badge variant="secondary" className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 font-bold border-0">Announcement</Badge>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Active Alerts</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                Everything is looking good in your neighborhood!
                            </p>
                        </div>
                    </div>
                )}

                {/* Card 3: Seasonal Tip */}
                <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 shadow-lg shadow-green-600/20 text-white relative overflow-hidden group flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Leaf className="h-24 w-24 -mr-6 -mt-6 rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Leaf className="h-4 w-4" />
                            </div>
                            <span className="text-[10px] font-bold text-green-100 uppercase tracking-widest">Seasonal Tip</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Winter Composting</h3>
                        <p className="text-sm text-green-50 font-medium leading-relaxed">
                            Avoid putting frozen waste directly into the bin. Wrap in newspaper to prevent sticking.
                        </p>
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={() => onNavigate?.('education')}
                        className="relative z-10 bg-white/10 hover:bg-white/20 text-white border-0 mt-4 w-full justify-between group-hover:bg-white group-hover:text-green-700 font-bold transition-all"
                    >
                        View More Tips <ChevronRight className="h-4 w-4 opacity-60" />
                    </Button>
                </div>

            </div>

            {/* 3. ACTIVITY & ACTIONS SPLIT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Recent Activity List */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
                        <Button variant="link" className="text-green-600 font-bold text-xs uppercase tracking-wider h-auto p-0">
                            View All
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: 'Recycling Collection', date: 'Jan 26', status: 'Completed' },
                            { title: 'Regular Waste', date: 'Jan 19', status: 'Completed' },
                            { title: 'Bulk Pickup Request', date: 'Jan 05', status: 'Completed' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                        <CheckCircle2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 dark:text-white">{item.title}</div>
                                        <div className="text-xs text-gray-500 font-medium">{item.date}</div>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-gray-400">
                                    {item.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>

                    <div className="space-y-4">
                        <button 
                            onClick={() => onNavigate?.('schedule')}
                            className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-green-200 hover:shadow-md transition-all group text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">Schedule Pickup</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-green-500 transition-colors" />
                        </button>

                        <button 
                            onClick={() => onNavigate?.('complaints')}
                            className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:border-red-200 hover:shadow-md transition-all group text-left"
                        >
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">Report Issue</span>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-red-500 transition-colors" />
                        </button>
                    </div>

                    <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-blue-500 mt-1 shrink-0" />
                        <div>
                            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-1">Local Update</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">New recycling guidelines are in effect for {zone?.name || currentLocation.location} as of Feb 1st.</p>
                            <Button variant="link" className="p-0 h-auto text-blue-600 text-xs font-bold mt-2">Read Notice</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
}
