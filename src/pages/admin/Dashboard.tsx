import React, { useEffect, useState } from 'react';
import {
    History,
    Activity,
    MapPin,
    Clock,
    AlertOctagon,
    Leaf,
    TrendingUp,
    MoreHorizontal,
    Loader2,
    Truck,
    CheckCircle2,
    XCircle,
    Send
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import client from '../../api/client';
import { format } from 'date-fns';

interface DashboardStats {
    vehicles: {
        total: number;
        active: number;
        maintenance: number;
    };
    tasks: {
        total: number;
        pending: number;
        inProgress: number;
        completed: number;
        completionRate: number;
    };
    personnel: {
        total: number;
        onDuty: number;
        onLeave: number;
        offDuty: number;
    };
    complaints: {
        total: number;
        pending: number;
        resolved: number;
    };
    zones: {
        total: number;
        servicePoints: number;
        critical: number;
    };
    alerts: Array<{
        id: string;
        title: string;
        priority: string;
        location: string;
        details: string;
        time: string;
    }>;
    logs: Array<{
        action: string;
        details: string;
        type: 'Info' | 'Warning' | 'Error' | 'Success';
        createdAt: string;
    }>;
}

export function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Dispatch Modal State
    const [isDispatchOpen, setIsDispatchOpen] = useState(false);
    const [dispatching, setDispatching] = useState(false);
    const [dispatchResult, setDispatchResult] = useState<{ created: any[]; skipped: any[]; message: string } | null>(null);
    const [dispatchError, setDispatchError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await client.get('/dashboard/stats');
                // New API returns flat object: { success, vehicles, tasks, personnel, zones, alerts, logs }
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-civic-green-500" />
            </div>
        );
    }

    const handleDispatch = async () => {
        setDispatching(true);
        setDispatchError(null);
        setDispatchResult(null);
        try {
            const { data } = await client.post('/tasks/dispatch-today');
            setDispatchResult(data);
            // Refresh stats after dispatch
            const statsRes = await client.get('/dashboard/stats');
            setStats(statsRes.data);
        } catch (err: any) {
            setDispatchError(err?.response?.data?.message || 'Failed to dispatch tasks. Please try again.');
        } finally {
            setDispatching(false);
        }
    };

    const openDispatchModal = () => {
        setDispatchResult(null);
        setDispatchError(null);
        setDispatching(false);
        setIsDispatchOpen(true);
    };

    return (
        <div className="max-w-[1600px] mx-auto pb-12">

            {/* 1. HERO HEADER with VISUAL MAP & GLASS EFFECT */}
            <div className="relative bg-civic-green-500 -mx-6 -mt-8 mb-10 overflow-hidden shadow-lg">
                {/* Decorative Background Pattern (Hex Grid) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
                                <path d="M25 0 L50 14.4 L50 43.3 L25 57.7 L0 43.3 L0 14.4 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hexagons)" stroke="none" />
                    </svg>
                </div>

                <div className="relative px-6 py-12 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-[1600px] mx-auto z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            <span className="text-xs font-bold tracking-[0.2em] text-white/90 uppercase">System Nominal</span>
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-white font-sans drop-shadow-sm">Municipal Command</h1>
                        <div className="flex items-center gap-3 mt-3">
                            <p className="text-sm text-green-50 font-medium bg-civic-green-600/40 inline-block px-3 py-1 rounded-md border border-white/10 backdrop-blur-md">
                                City Operations Center • Sector 4
                            </p>
                        </div>
                    </div>

                    {/* Glassmorphism Stats Pannel */}
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 bg-white/10 backdrop-blur-md px-6 py-5 rounded-2xl border border-white/20 shadow-xl text-white w-full md:w-auto">
                        <div className="text-center md:text-right group cursor-default min-w-[80px]">
                            <span className="block text-[10px] font-bold text-green-100 uppercase tracking-widest mb-0.5 group-hover:text-white transition-colors">Active Units</span>
                            <span className="text-3xl font-bold text-white tracking-tight">{stats?.vehicles.active}<span className="text-green-200 text-lg font-medium">/{stats?.vehicles.total}</span></span>
                        </div>
                        <div className="hidden md:block h-12 w-px bg-gradient-to-b from-white/0 via-white/30 to-white/0"></div>
                        <div className="text-center md:text-right group cursor-default min-w-[80px]">
                            <span className="block text-[10px] font-bold text-green-100 uppercase tracking-widest mb-0.5 group-hover:text-white transition-colors">Completion</span>
                            <span className="text-3xl font-bold text-white tracking-tight">{stats?.tasks.completionRate}%</span>
                        </div>
                        <div className="hidden md:block h-12 w-px bg-gradient-to-b from-white/0 via-white/30 to-white/0"></div>
                        <div className="text-center md:text-right group cursor-default min-w-[80px]">
                            <span className="block text-[10px] font-bold text-green-100 uppercase tracking-widest mb-0.5 group-hover:text-white transition-colors">Risk Level</span>
                            <span className="text-3xl font-bold text-white tracking-tight">Low</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. LIVE TELEMETRY (Visual Stats Row) */}
            <div className="mb-10 px-2 lg:px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Card 1: Carbon - Simple Stat */}
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm hover:shadow-lg hover:shadow-civic-green-500/5 hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-civic-green-50 dark:bg-civic-green-900/20 text-civic-green-600 dark:text-civic-green-400 p-2.5 rounded-xl group-hover:bg-civic-green-500 group-hover:text-white transition-colors">
                                <Leaf className="h-6 w-6" />
                            </div>
                            <span className="flex items-center text-xs font-bold text-civic-green-600 dark:text-civic-green-400 bg-civic-green-50 dark:bg-civic-green-900/20 px-2 py-1 rounded-lg">
                                +0.1% <TrendingUp className="h-3 w-3 ml-1" />
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-civic-dark dark:text-white mb-1">1.2T</div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Carbon Eliminated</span>
                    </div>

                    {/* Card 2: Efficiency - WITH CHART */}
                    <div className="p-0 bg-white dark:bg-gray-900 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm hover:shadow-lg hover:shadow-civic-orange-500/5 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <div className="bg-civic-orange-50 dark:bg-civic-orange-900/20 text-civic-orange-500 dark:text-civic-orange-400 p-2.5 rounded-xl group-hover:bg-civic-orange-500 group-hover:text-white transition-colors">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <span className="flex items-center text-xs font-bold text-civic-orange-600 dark:text-civic-orange-400 bg-civic-orange-50 dark:bg-civic-orange-900/20 px-2 py-1 rounded-lg">
                                    +2.4%
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-civic-dark dark:text-white mb-1">{stats?.tasks.completionRate}%</div>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Collection Efficiency</span>
                        </div>
                        {/* Decorative Chart Background */}
                        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 text-civic-orange-500">
                            <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full fill-current">
                                <path d="M0 40 L0 30 Q 10 20 20 30 T 40 20 T 60 30 T 80 15 T 100 25 L 100 40 Z" />
                            </svg>
                        </div>
                    </div>

                    {/* Card 3: Route Time */}
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 p-2.5 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Clock className="h-6 w-6" />
                            </div>
                            <span className="flex items-center text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                Nominal
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-civic-dark dark:text-white mb-1">4h 12m</div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Avg Route Time</span>
                    </div>

                    {/* Card 4: Total Bins */}
                    <div className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-500 dark:text-purple-400 p-2.5 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <span className="flex items-center text-xs font-bold text-civic-green-600 dark:text-civic-green-400 bg-civic-green-50 dark:bg-civic-green-900/20 px-2 py-1 rounded-lg">
                                +12 New
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-civic-dark dark:text-white mb-1">{stats?.zones.servicePoints || 0}</div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Service Points</span>
                    </div>
                </div>
            </div>

            {/* 3. MAIN GRID: ALERTS & LOGS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 px-2 lg:px-4">

                {/* Left Column: GRID of Alerts (2/3 width) */}
                <div className="xl:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-civic-red/10 dark:bg-civic-red/20 rounded-lg">
                                <AlertOctagon className="h-5 w-5 text-civic-red dark:text-red-400" />
                            </div>
                            <h2 className="text-lg font-bold text-civic-dark dark:text-white tracking-tight">Active Incidents</h2>
                        </div>
                        <Button variant="ghost" className="h-8 text-xs font-bold text-gray-400 hover:text-civic-dark hover:bg-white/50 dark:hover:bg-gray-800">
                            Dismiss All
                        </Button>
                    </div>

                    {/* BENTO GRID for Alerts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {stats?.alerts.length === 0 ? (
                            <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-civic-muted dark:border-gray-700 p-8 text-center">
                                <p className="text-gray-500">No active incidents detected. Keep up the good work!</p>
                            </div>
                        ) : (
                            stats?.alerts.map((alert) => (
                                <div key={alert.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm p-6 relative overflow-hidden group hover:shadow-lg hover:border-civic-red/30 transition-all duration-300">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-civic-red to-red-400"></div>

                                    <div className="flex justify-between items-start mb-4 pl-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold bg-civic-red/10 dark:bg-civic-red/20 text-civic-red dark:text-red-400 px-2 py-1 rounded-md uppercase tracking-wider">{alert.priority}</span>
                                            <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase">#{alert.id.slice(-4)}</span>
                                        </div>
                                        <MoreHorizontal className="h-4 w-4 text-gray-300 dark:text-gray-600 cursor-pointer hover:text-civic-dark dark:hover:text-white" />
                                    </div>

                                    <div className="pl-3 mb-2">
                                        <h3 className="text-lg font-bold text-civic-dark dark:text-white leading-tight mb-1">{alert.title}</h3>
                                        <p className="text-sm font-medium text-gray-400">{alert.location}</p>
                                    </div>

                                    <p className="pl-3 text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                        {alert.details}
                                    </p>

                                    <div className="flex gap-3 pl-3">
                                        <Button
                                            onClick={openDispatchModal}
                                            className="flex-1 bg-civic-orange-500 hover:bg-civic-orange-600 text-white font-bold text-xs h-10 rounded-lg shadow-sm shadow-civic-orange-500/20"
                                        >
                                            Dispatch
                                        </Button>
                                        <Button variant="ghost" className="flex-1 text-gray-500 dark:text-gray-400 font-bold text-xs h-10 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                                            Details
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}

                        {/* Efficiency Milestone Card (Double Width) */}
                        <div className="bg-gradient-to-r from-civic-green-500 to-civic-green-600 rounded-2xl shadow-lg p-6 relative overflow-hidden group md:col-span-2 text-white">
                            {/* Decorative Circles */}
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute left-10 -top-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>

                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-white/20 rounded backdrop-blur-sm">
                                            <Leaf className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-[10px] font-bold text-green-100 uppercase tracking-widest">Sustainability Milestone</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Sector 4 is {stats?.tasks.completionRate}% Clear</h3>
                                    <p className="text-sm text-green-50 max-w-lg leading-relaxed">
                                        Completion rate based on total assigned tasks vs. completed tasks for the current cycle.
                                    </p>
                                </div>
                                <div className="hidden sm:flex flex-col items-end">
                                    <div className="text-5xl font-black text-white/90">{stats?.tasks.completionRate}%</div>
                                    <div className="text-xs font-bold text-green-200 uppercase tracking-widest mt-1">Clearance Rate</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Right Column: Operational Log */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-civic-muted/30 dark:bg-gray-900 rounded-lg">
                            <History className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h2 className="text-lg font-bold text-civic-dark dark:text-white tracking-tight">Recent Activity</h2>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-civic-muted dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {stats?.logs.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-default">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 
                                            ${item.type === 'Success' ? 'bg-civic-green-500 shadow-[0_0_8px_rgba(46,204,113,0.5)]' :
                                                item.type === 'Warning' ? 'bg-civic-yellow shadow-[0_0_8px_rgba(241,196,15,0.5)]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                        </div>
                                        <div className="w-px h-full bg-gray-100 dark:bg-gray-800 group-last:hidden"></div>
                                    </div>
                                    <div className="flex-1 min-w-0 pb-4">
                                        <p className="text-sm font-bold text-civic-dark dark:text-white truncate group-hover:text-civic-green-600 dark:group-hover:text-civic-green-400 transition-colors">{item.action}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{item.details}</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1">{format(new Date(item.createdAt), 'HH:mm')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* DISPATCH MODAL */}
            <Dialog
                isOpen={isDispatchOpen}
                onClose={() => setIsDispatchOpen(false)}
                title="Dispatch Collection Tasks"
                description="Create and assign today's scheduled pickup tasks for all zones."
            >
                <div className="space-y-6">
                    {/* Pre-dispatch state */}
                    {!dispatching && !dispatchResult && !dispatchError && (
                        <>
                            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <Truck className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-orange-900 dark:text-orange-200 mb-1">What happens when you dispatch?</h4>
                                        <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1.5">
                                            <li className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                                                Creates collection tasks for all zones scheduled today
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                                                Tasks appear in the Tasks section as "Pending"
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                                                Assign drivers and vehicles from the Tasks page
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                                                Zones already dispatched today will be skipped
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-11 rounded-xl font-bold"
                                    onClick={() => setIsDispatchOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 h-11 rounded-xl font-bold bg-civic-orange-500 hover:bg-civic-orange-600 text-white shadow-lg shadow-civic-orange-500/20"
                                    onClick={handleDispatch}
                                >
                                    <Send className="h-4 w-4 mr-2" /> Dispatch Now
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Dispatching spinner */}
                    {dispatching && (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-full border-4 border-orange-100 dark:border-orange-900/30" />
                                <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-civic-orange-500 animate-spin" />
                                <Truck className="absolute inset-0 m-auto h-6 w-6 text-civic-orange-500" />
                            </div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white mt-5">Dispatching Tasks...</p>
                            <p className="text-xs text-gray-500 mt-1">Creating collection assignments for all scheduled zones</p>
                        </div>
                    )}

                    {/* Error state */}
                    {dispatchError && (
                        <div className="text-center py-6">
                            <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                <XCircle className="h-7 w-7 text-red-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Dispatch Failed</h3>
                            <p className="text-sm text-gray-500 mb-6">{dispatchError}</p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 h-10 rounded-xl font-bold" onClick={() => setIsDispatchOpen(false)}>Close</Button>
                                <Button className="flex-1 h-10 rounded-xl font-bold bg-civic-orange-500 hover:bg-civic-orange-600 text-white" onClick={handleDispatch}>Retry</Button>
                            </div>
                        </div>
                    )}

                    {/* Success result */}
                    {dispatchResult && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                    <CheckCircle2 className="h-7 w-7 text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Dispatch Complete!</h3>
                                <p className="text-sm text-gray-500">{dispatchResult.message}</p>
                            </div>

                            {/* Created tasks */}
                            {dispatchResult.created.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tasks Created</h4>
                                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                                        {dispatchResult.created.map((item: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-800">
                                                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                                <div className="flex-1">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{item.zone}</span>
                                                    <div className="flex gap-1.5 mt-0.5">
                                                        {item.types?.map((t: string) => (
                                                            <span key={t} className="text-[10px] font-bold uppercase text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded">{t}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skipped zones */}
                            {dispatchResult.skipped.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skipped</h4>
                                    <div className="space-y-1.5">
                                        {dispatchResult.skipped.map((item: any, i: number) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.zone}</span>
                                                    <span className="text-xs text-gray-400 ml-2">— {item.reason}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full h-11 rounded-xl font-bold bg-civic-dark dark:bg-white text-white dark:text-civic-dark shadow-lg"
                                onClick={() => setIsDispatchOpen(false)}
                            >
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
