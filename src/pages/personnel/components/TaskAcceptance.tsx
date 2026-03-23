import React from 'react';
import { MapPin, Truck, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { PageTransition } from '../../../components/ui/page-transition';

interface TaskAcceptanceProps {
    onAccept: () => void;
    task: any;
}

export function TaskAcceptance({ onAccept, task }: TaskAcceptanceProps) {
    return (
        <PageTransition className="flex items-center justify-center min-h-[600px]">
            <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl shadow-civic-dark/20 dark:shadow-none border border-gray-100 dark:border-gray-800 overflow-hidden relative">

                <div className="flex flex-col lg:flex-row h-full">

                    {/* LEFT: MAP & VISUALS */}
                    <div className="lg:w-1/2 bg-gray-100 dark:bg-gray-950 relative min-h-[400px] lg:min-h-full">
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-87.6298,41.8781,13,0/800x600@2x?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale opacity-60 dark:opacity-30 dark:invert"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex flex-col justify-end p-8">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl mb-4 self-start">
                                <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-civic-green-400" />
                                    {task?.location || 'Unknown Location'} • {task?.zoneId?.name || 'Assigned Zone'}
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-white leading-tight mb-2">{task?.title || 'New Assignment'}</h2>
                            <p className="text-gray-300 font-medium">{task?.description || 'No additional details provided.'}</p>
                        </div>
                    </div>

                    {/* RIGHT: DETAILS & ACTIONS */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-white dark:bg-gray-900 relative">

                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-civic-dark dark:bg-white rounded-full text-white dark:text-civic-dark text-[10px] font-bold uppercase tracking-wider mb-6">
                                <ShieldCheck className="h-3 w-3" />
                                New Duty Assignment
                            </div>

                            <div className="space-y-6">
                                {/* Vehicle Assignment Card */}
                                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                                    <div className="h-14 w-14 bg-white dark:bg-gray-900 rounded-xl shadow-sm flex items-center justify-center border border-gray-100 dark:border-gray-700">
                                        <Truck className="h-7 w-7 text-civic-dark dark:text-white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Assigned Vehicle</p>
                                        <p className="text-lg font-black text-civic-dark dark:text-white">{task?.vehicleId?.vehicleId || 'TRUCK-101'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{task?.vehicleId?.type || 'Standard'} • {task?.vehicleId?.licensePlate || 'N/A'}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Ready</span>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Ticket ID</p>
                                        <p className="text-xl font-bold text-civic-dark dark:text-white">{task?.ticketId || 'T-0000'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">High Priority</p>
                                    </div>
                                    <div className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Est. Duration</p>
                                        <p className="text-xl font-bold text-civic-dark dark:text-white">{task?.estimatedTime || 'N/A'}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Standard Shift</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                            <Button
                                onClick={onAccept}
                                className="w-full bg-civic-green-500 hover:bg-civic-green-600 text-white font-bold text-lg h-16 rounded-2xl shadow-xl shadow-civic-green-500/30 flex items-center justify-between px-8 group transition-all"
                            >
                                <span>Confirm & Start Duty</span>
                                <div className="bg-white/20 rounded-xl p-2 group-hover:bg-white/30 transition-colors">
                                    <ChevronRight className="h-6 w-6" />
                                </div>
                            </Button>
                            <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium mt-4">
                                By confirming, you acknowledge vehicle {task?.vehicleId?.vehicleId || 'Assigned Truck'} is inspected and safe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
