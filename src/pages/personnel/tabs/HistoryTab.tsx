import React, { useEffect, useState } from 'react';
import { PageTransition } from '../../../components/ui/page-transition';
import { Calendar, Clock, CheckCircle2, CalendarOff, Truck } from 'lucide-react';
import { getMyTasks } from '../../../api/tasks';
import { format } from 'date-fns';

export function HistoryTab() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getMyTasks({ status: 'Completed' });
                setHistory(data.tasks || []);
            } catch (err) {
                console.error('Failed to fetch history', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const totalRoutes = history.length;
    const totalHours = history.reduce((acc: number, t: any) => {
        const est = parseFloat(t.estimatedTime) || 0;
        return acc + est;
    }, 0);
    const perfectCount = history.filter((t: any) => t.collectionStatus === 'Perfect').length;
    const efficiency = totalRoutes > 0 ? Math.round((perfectCount / totalRoutes) * 100) : 0;

    return (
        <PageTransition>
            <div className="p-4 pt-4 pb-24 w-full mx-auto">
                <h1 className="text-3xl font-black text-civic-dark dark:text-white mb-6">Shift History</h1>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-civic-dark dark:bg-gray-800 p-5 rounded-2xl text-white shadow-lg shadow-civic-dark/10">
                        <p className="text-xs font-bold text-civic-green-400 uppercase tracking-wider mb-1">Total</p>
                        <p className="text-3xl font-black">{totalHours.toFixed(0)}</p>
                        <p className="text-xs text-gray-400 font-medium">Est. Hours</p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Routes</p>
                        <p className="text-3xl font-black text-civic-dark dark:text-white">{totalRoutes}</p>
                        <p className="text-xs text-green-500 font-bold flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Completed
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Efficiency</p>
                        <p className="text-3xl font-black text-civic-dark dark:text-white">{totalRoutes > 0 ? `${efficiency}%` : '--'}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Perfect Rate</p>
                    </div>
                </div>

                <div className="space-y-4 relative pl-4">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="h-8 w-8 border-4 border-civic-green-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : history.length > 0 ? (
                        history.map((task: any) => (
                            <div key={task._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center shrink-0">
                                    <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-bold text-civic-dark dark:text-white truncate">{task.title}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${task.collectionStatus === 'Perfect' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                task.collectionStatus === 'Missed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>{task.collectionStatus || 'Completed'}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.location || task.zoneId?.name || 'Zone Route'}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        {task.completedAt && (
                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(task.completedAt), 'MMM d, yyyy')}
                                            </span>
                                        )}
                                        {task.estimatedTime && (
                                            <span className="flex items-center gap-1 text-xs text-gray-400">
                                                <Clock className="h-3 w-3" /> {task.estimatedTime}h
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                <CalendarOff className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No History Yet</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                Completed routes and shifts will appear here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
}
