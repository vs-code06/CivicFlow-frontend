import React from 'react';
import { createPortal } from 'react-dom';
import { PageTransition } from '../../../components/ui/page-transition';
import { Navigation, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface HomeTabProps {
    taskStatus: 'pending' | 'accepted' | 'active' | 'completed';
    currentTask: any;
    onAcceptTask: () => void;
    onStartTask: () => void;
    onCompleteTask: (data?: any) => void;
    user?: any; // Add user prop
    onToggleDuty?: () => void; // Add toggle handler
}

export function HomeTab({ taskStatus, currentTask, onAcceptTask, onStartTask, onCompleteTask, user, onToggleDuty }: HomeTabProps) {
    const [showCompletionModal, setShowCompletionModal] = React.useState(false);

    // Helper to determine status
    const status = user?.status || 'Off Duty';
    const isOnLeave = status === 'On Leave';
    const isOnDuty = status === 'On Duty';

    // 1. ACTIVE / ACCEPTED STATE (Show the Action Dashboard)
    if (taskStatus === 'active' || taskStatus === 'accepted') {
        return (
            <PageTransition>
                <div className="relative z-20">
                    {/* Current Task Card */}
                    <div className="bg-white/10 dark:bg-gray-800/40 backdrop-blur-md border border-white/20 dark:border-gray-700/50 p-5 rounded-2xl shadow-lg relative overflow-hidden group active:scale-[0.98] transition-all mb-8">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-civic-green-500/20 blur-3xl rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm text-white
                                ${taskStatus === 'active' ? 'bg-civic-green-500 animate-pulse' : 'bg-civic-orange-500'}`}>
                                {taskStatus === 'active' ? 'In Progress' : 'Ready to Start'}
                            </span>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
                                <Clock className="h-3 w-3" /> Due 2h
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-civic-dark dark:text-white mb-1 leading-tight">{currentTask?.title || 'Unknown Route'}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 font-medium">{currentTask?.description || 'Regular residential waste collection.'}</p>

                        <div className="flex items-center gap-3 text-sm font-bold text-civic-dark dark:text-white bg-gray-50 dark:bg-gray-800/80 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                            <MapPin className="h-5 w-5 text-civic-dark dark:text-white shrink-0" />
                            <span className="truncate">Start: {currentTask?.location || 'Unknown Location'}</span>
                        </div>
                    </div>

                    {/* Quick Actions (Sidebar now handles these, but we can keep context specific actions if needed, or remove. Keeping generic for now as per design request) */}
                    {/* PRIMARY ACTION HERO */}
                    <div className="mb-8">
                        {taskStatus === 'accepted' ? (
                            <button
                                onClick={onStartTask}
                                className="w-full bg-civic-dark text-white p-6 rounded-3xl shadow-2xl shadow-civic-dark/20 flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"></div>
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center">
                                        <Navigation className="h-6 w-6 text-civic-green-400" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-black tracking-tight">Start Route</h3>
                                        <p className="text-sm text-gray-400 font-medium">Swipe or tap to begin</p>
                                    </div>
                                </div>
                                <div className="relative z-10 h-10 w-10 bg-white rounded-full flex items-center justify-center text-civic-dark">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowCompletionModal(true)}
                                className="w-full bg-civic-green-500 text-white p-6 rounded-3xl shadow-2xl shadow-civic-green-500/30 flex items-center justify-between group active:scale-[0.98] transition-all relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-civic-green-500 to-emerald-600"></div>
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                        <CheckCircle2 className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-black tracking-tight">Complete Route</h3>
                                        <p className="text-sm text-emerald-100 font-medium">Tap to finish job</p>
                                    </div>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* COMPLETION MODAL */}
                {showCompletionModal && typeof document !== 'undefined' && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={() => setShowCompletionModal(false)}></div>
                        <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-gray-100 dark:border-gray-800">

                            <div className="text-center mb-8">
                                <div className="h-16 w-16 bg-civic-green-100 dark:bg-civic-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-civic-green-600 dark:text-civic-green-400">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <h3 className="text-2xl font-black text-civic-dark dark:text-white mb-2">Wait! One last thing.</h3>
                                <p className="text-sm text-gray-400 font-medium">How would you rate this collection run?</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button
                                    onClick={() => { onCompleteTask({ collectionStatus: 'Perfect' }); setShowCompletionModal(false); }}
                                    className="group relative overflow-hidden rounded-2xl p-4 transition-all hover:shadow-lg border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                                >
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="h-12 w-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-green-500 shadow-md group-hover:scale-110 transition-transform">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-green-900 dark:text-green-100 text-lg">Perfect Run</div>
                                            <div className="text-xs text-green-600 dark:text-green-400 font-bold opacity-80">All bins collected, no issues</div>
                                        </div>
                                    </div>
                                </button>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => { onCompleteTask({ collectionStatus: 'Contaminated' }); setShowCompletionModal(false); }}
                                        className="group rounded-2xl p-4 transition-all hover:shadow-md border border-gray-100 dark:border-gray-800 bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100 dark:hover:bg-amber-900/20 text-left flex flex-col justify-between h-32"
                                    >
                                        <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform mb-2">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-amber-900 dark:text-amber-100 leading-tight">Issues Found</div>
                                            <div className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-1">Contamination / Damage</div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => { onCompleteTask({ collectionStatus: 'Blocked' }); setShowCompletionModal(false); }}
                                        className="group rounded-2xl p-4 transition-all hover:shadow-md border border-gray-100 dark:border-gray-800 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 text-left flex flex-col justify-between h-32"
                                    >
                                        <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-red-500 shadow-sm group-hover:scale-110 transition-transform mb-2">
                                            <Navigation className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-red-900 dark:text-red-100 leading-tight">Blocked</div>
                                            <div className="text-[10px] text-red-600 dark:text-red-400 font-bold mt-1">Access Denied / Missed</div>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowCompletionModal(false)}
                                className="mt-8 w-full py-4 rounded-xl text-sm font-bold text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>,
                    document.body
                )}
            </PageTransition>
        );
    }

    // 2. IDLE / PENDING STATE (Show History & Status)
    return (
        <PageTransition>
            <div className="space-y-8">
                {/* Status Toggle Card */}
                <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-black text-civic-dark dark:text-white mb-1">
                            {isOnLeave ? 'On Leave' : (isOnDuty ? 'On Duty' : 'Off Duty')}
                        </h2>
                        <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                            {isOnLeave ? 'You are currently on approved leave.' :
                                isOnDuty ? 'You are active and visible to dispatch.' :
                                    'You are currently off duty.'}
                        </p>
                    </div>
                    <div
                        onClick={() => !isOnLeave && onToggleDuty && onToggleDuty()}
                        className={`h-12 w-20 rounded-full p-1 cursor-pointer transition-colors relative flex items-center ${isOnLeave ? 'bg-orange-200 cursor-not-allowed' :
                            isOnDuty ? 'bg-civic-green-500' :
                                'bg-gray-200 dark:bg-gray-700'
                            }`}
                    >
                        <div className={`h-10 w-10 bg-white dark:bg-gray-200 rounded-full shadow-md transition-transform ${isOnLeave ? 'translate-x-[50%] opacity-50' : // Centeredish or something for disabled? Or just keep generic
                            isOnDuty ? 'translate-x-8' :
                                'translate-x-0'
                            }`}></div>
                    </div>
                </div>

                {/* Past Work History */}
                <div>
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-2">Recent History</h3>
                    <div className="space-y-3">
                        {/* Empty State for New Users */}
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
                            <div className="h-12 w-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-3">
                                <Clock className="h-6 w-6" />
                            </div>
                            <h4 className="text-sm font-bold text-civic-dark dark:text-white">No history yet</h4>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Completed tasks will appear here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
