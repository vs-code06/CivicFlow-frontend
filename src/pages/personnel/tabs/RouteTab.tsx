import React from 'react';
import { PageTransition } from '../../../components/ui/page-transition';
import { CheckCircle2 } from 'lucide-react';

interface RouteTabProps {
    taskStatus: 'pending' | 'accepted' | 'active' | 'completed';
    currentTask?: any;
}

export function RouteTab({ taskStatus, currentTask }: RouteTabProps) {
    const [zone, setZone] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(false);
    const [stopStatuses, setStopStatuses] = React.useState<{ [key: string]: 'pending' | 'completed' | 'issue' }>({});

    // Fetch Zone Data when task changes
    React.useEffect(() => {
        if (currentTask && currentTask.zoneId) {
            setLoading(true);
            // Verify if zoneId is object or string
            const zId = typeof currentTask.zoneId === 'object' ? currentTask.zoneId._id : currentTask.zoneId;
            import('../../../api/zones').then(m => m.getZones()).then(zones => {
                const found = zones.find((z: any) => z._id === zId);
                setZone(found);
                setLoading(false);
            });
        }
    }, [currentTask]);

    // Calculate Stops based on Task Scope
    const stops = React.useMemo(() => {
        if (!zone || !zone.areas) return [];

        // Smart Routing Logic
        let calculatedStops = [];
        if (currentTask?.targetAreaId) {
            // SINGLE AREA TASK
            calculatedStops = zone.areas.filter((a: any) => a._id === currentTask.targetAreaId).map((a: any) => ({
                id: a._id,
                name: a.name,
                type: 'Targeted',
                coordinates: a.coordinates
            }));
        } else {
            // FULL ZONE TASK
            calculatedStops = zone.areas.map((a: any) => ({
                id: a._id,
                name: a.name,
                type: 'Regular',
                coordinates: a.coordinates
            }));
        }
        return calculatedStops;
    }, [zone, currentTask]);

    const handleToggleStatus = (stopId: string, status: 'completed' | 'issue') => {
        setStopStatuses(prev => ({
            ...prev,
            [stopId]: prev[stopId] === status ? 'pending' : status
        }));
    };

    if (loading) return <div className="p-8 text-center text-gray-400">Loading Route Data...</div>;

    if (taskStatus === 'pending' || taskStatus === 'completed') {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
                <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">😴</span>
                </div>
                <h2 className="text-xl font-bold text-gray-400 dark:text-gray-500">
                    {taskStatus === 'completed' ? 'Route Completed' : 'No active route'}
                </h2>
                <p className="text-sm text-gray-400 mt-2">
                    {taskStatus === 'completed' ? 'Great job! Take a break.' : 'Accept a task to view stops.'}
                </p>
            </div>
        );
    }

    const completedCount = Object.values(stopStatuses).filter(s => s === 'completed').length;
    const progress = stops.length > 0 ? (completedCount / stops.length) * 100 : 0;

    return (
        <PageTransition>
            <div className="px-6 py-8 pb-32">
                <div className="mb-6 sticky top-0 bg-white dark:bg-black z-20 py-2 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <h2 className="text-3xl font-black text-civic-dark dark:text-white">Current Route</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide text-white ${currentTask?.type === 'Emergency' ? 'bg-red-500' : 'bg-civic-green-500'}`}>
                                    {currentTask?.type || 'Regular'}
                                </span>
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                    {stops.length} stops • {zone?.name || 'Unknown Zone'}
                                </span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-civic-green-600 dark:text-civic-green-400">{Math.round(progress)}%</div>
                            <div className="text-xs font-bold text-gray-400 uppercase">Complete</div>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-civic-green-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="space-y-4 relative">
                    {/* Connector Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-800 z-0"></div>

                    {stops.length === 0 && <div className="text-center text-gray-400 py-10">No stops found for this zone configuration.</div>}

                    {stops.map((stop: any, idx: number) => {
                        const status = stopStatuses[stop.id] || 'pending';
                        const isDone = status === 'completed';
                        const isIssue = status === 'issue';

                        return (
                            <div key={stop.id} className="flex gap-4 items-start relative z-10 group">
                                {/* Number/Status Bubble */}
                                <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center border-4 border-gray-50 dark:border-gray-900 text-sm font-bold shadow-sm transition-all
                                    ${isDone ? 'bg-civic-green-500 text-white border-white dark:border-gray-900' :
                                        isIssue ? 'bg-red-500 text-white border-white dark:border-gray-900' :
                                            'bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-civic-muted dark:border-gray-700'}`}>
                                    {isDone ? <CheckCircle2 className="h-5 w-5" /> : (isIssue ? '!' : idx + 1)}
                                </div>

                                {/* Card */}
                                <div className={`flex-1 p-4 rounded-2xl border transition-all duration-300
                                    ${isDone ? 'bg-green-50/50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 opacity-75' :
                                        isIssue ? 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' :
                                            'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 shadow-sm'}`}>

                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`font-bold text-sm ${isDone ? 'text-green-800 dark:text-green-400 line-through' : 'text-civic-dark dark:text-white'}`}>{stop.name}</h4>
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md">ETA 5m</span>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-3">
                                        {stop.coordinates ? `${stop.coordinates.lat}, ${stop.coordinates.lng}` : 'No GPS Data'}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(stop.id, 'completed')}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border
                                                ${isDone
                                                    ? 'bg-green-500 text-white border-green-500'
                                                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-green-50 hover:text-green-600 hover:border-green-200'}`}
                                        >
                                            {isDone ? 'Completed' : 'Mark Done'}
                                        </button>
                                        <button
                                            onClick={() => handleToggleStatus(stop.id, 'issue')}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border
                                                ${isIssue
                                                    ? 'bg-red-500 text-white border-red-500'
                                                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200'}`}
                                        >
                                            {isIssue ? 'Reported' : 'Issue'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageTransition>
    );
}
