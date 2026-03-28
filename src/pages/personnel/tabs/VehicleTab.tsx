import { useState } from 'react';
import { PageTransition } from '../../../components/ui/page-transition';
import { Button } from '../../../components/ui/button';
import { CheckCircle2, AlertTriangle, Truck } from 'lucide-react';
import { cn } from '../../../lib/utils';


interface VehicleTabProps {
    onInspectionComplete: () => void;
    user?: any;
    taskStatus?: 'pending' | 'accepted' | 'active' | 'completed';
}

export function VehicleTab({ onInspectionComplete, user, taskStatus }: VehicleTabProps) {
    const isAssigned = taskStatus === 'accepted' || taskStatus === 'active';
    const canInspect = user?.status === 'On Duty' && isAssigned;

    const [checklist, setChecklist] = useState({
        tires: null as boolean | null,
        oil: null as boolean | null,
        lights: null as boolean | null,
        brakes: null as boolean | null,
        fuel: null as boolean | null,
        hydraulics: null as boolean | null
    });

    if (!canInspect) {
        return (
            <PageTransition>
                <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
                    <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-full mb-6">
                        <Truck className="h-16 w-16 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-black text-civic-dark dark:text-white mb-2">
                        {user?.status === 'On Leave' ? 'You are On Leave' :
                            user?.status === 'Off Duty' ? 'You are Off Duty' :
                                'No Vehicle Assigned'}
                    </h2>
                    <p className="text-gray-500 max-w-md">
                        {user?.status !== 'On Duty'
                            ? "Please go On Duty to view vehicle assignments and perform inspections."
                            : "You don't have any active vehicle assignments at the moment. Please check your assignments tab."}
                    </p>
                </div>
            </PageTransition>
        );
    }

    const isComplete = Object.values(checklist).every(val => val !== null);
    const hasIssues = Object.values(checklist).some(val => val === false);

    const handleCheck = (key: keyof typeof checklist, status: boolean) => {
        setChecklist(prev => ({ ...prev, [key]: status }));
    };

    const handleSubmit = () => {
        if (!isComplete) return;
        if (hasIssues) {
            alert("Please report issues to dispatch before starting.");
            return;
        }
        onInspectionComplete();
    };

    // Calculate progress for fun
    const completedCount = Object.values(checklist).filter(v => v !== null).length;
    const progress = (completedCount / 6) * 100;

    return (
        <PageTransition>
            <div className="p-4 pt-4 pb-32 w-full mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-civic-dark dark:text-white mb-2">Pre-Trip Check</h1>
                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="bg-civic-dark dark:bg-white text-white dark:text-civic-dark px-2 py-0.5 rounded text-[10px]">TRUCK-101</span>
                            Inspection Required
                        </p>
                    </div>

                    {/* Visual Progress */}
                    <div className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm w-full md:w-auto">
                        <div className="relative h-16 w-16">
                            <svg className="h-full w-full -rotate-90 text-gray-100 dark:text-gray-800" viewBox="0 0 36 36">
                                <path className="stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path className="stroke-civic-green-500 transition-all duration-500 ease-out" strokeDasharray={`${progress}, 100`} strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-sm font-black text-civic-dark dark:text-white">{Math.round(progress)}%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase mb-0.5">Status</p>
                            <p className="text-sm font-bold text-civic-dark dark:text-white">{isComplete ? "Ready to Submit" : "In Progress"}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="bg-gradient-to-r from-civic-dark via-gray-900 to-civic-dark rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-civic-dark/20 flex flex-col items-center justify-center min-h-[200px]">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605218427306-022ba806c177?q=80&w=2670&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                        <Truck className="h-24 w-24 text-white/10 absolute -right-4 -bottom-4 rotate-12" />

                        <div className="relative z-10 text-center">
                            <Truck className="h-16 w-16 text-white mx-auto mb-4" />
                            <h3 className="text-2xl font-black text-white">Rear Loader • 18t</h3>
                            <p className="text-gray-400 font-medium text-sm">Verify all systems functionality</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    {[
                        { id: 'tires', label: 'Tires & Pressure', desc: 'Check tread depth & psi' },
                        { id: 'oil', label: 'Engine Oil Level', desc: 'Dipstick check, no leaks' },
                        { id: 'lights', label: 'Lights & Indicators', desc: 'Headlights, brake, turn' },
                        { id: 'brakes', label: 'Brake System', desc: 'Pressure test, pedal feel' },
                        { id: 'fuel', label: 'Fuel & DEF Levels', desc: 'Tank > 50%, Cap secure' },
                        { id: 'hydraulics', label: 'Compact Hydraulics', desc: 'Check for leaks / damage' }
                    ].map((item) => (
                        <div key={item.id} className={cn(
                            "bg-white dark:bg-gray-900 p-5 rounded-2xl border transition-all duration-300 relative group overflow-hidden",
                            checklist[item.id as keyof typeof checklist] === true ? "border-green-200 dark:border-green-900/30 shadow-lg shadow-green-500/5 ring-1 ring-green-100 dark:ring-green-900/20" :
                                checklist[item.id as keyof typeof checklist] === false ? "border-red-200 dark:border-red-900/30 shadow-lg shadow-red-500/5 ring-1 ring-red-100 dark:ring-red-900/20" :
                                    "border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700"
                        )}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-civic-dark dark:text-white text-lg">{item.label}</h3>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{item.desc}</p>
                                </div>
                                {checklist[item.id as keyof typeof checklist] !== null && (
                                    <div className={cn("h-6 w-6 rounded-full flex items-center justify-center",
                                        checklist[item.id as keyof typeof checklist] ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                    )}>
                                        {checklist[item.id as keyof typeof checklist] ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <button
                                    onClick={() => handleCheck(item.id as any, true)}
                                    className={cn(
                                        "py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                        checklist[item.id as keyof typeof checklist] === true
                                            ? "bg-civic-green-500 text-white shadow-md active:scale-95"
                                            : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400"
                                    )}
                                >
                                    Pass
                                </button>
                                <button
                                    onClick={() => handleCheck(item.id as any, false)}
                                    className={cn(
                                        "py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
                                        checklist[item.id as keyof typeof checklist] === false
                                            ? "bg-red-500 text-white shadow-md active:scale-95"
                                            : "bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                    )}
                                >
                                    Fail
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 lg:left-20 right-0 p-6 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 z-50">
                    <div className="max-w-4xl mx-auto">
                        <Button
                            disabled={!isComplete || hasIssues}
                            onClick={handleSubmit}
                            className="w-full h-14 text-lg font-bold rounded-2xl bg-civic-dark dark:bg-white text-white dark:text-civic-dark hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-civic-dark/20 dark:shadow-none flex items-center justify-center gap-3"
                        >
                            <span>{hasIssues ? "Report Issues to Dispatch" : "Confirm Inspection & Start Route"}</span>
                            {!hasIssues && isComplete && <Truck className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Spacer for fixed bottom bar */}
                <div className="h-20"></div>
            </div>
        </PageTransition>
    );
}
