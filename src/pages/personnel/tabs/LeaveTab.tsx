import React, { useState } from 'react';
import { PageTransition } from '../../../components/ui/page-transition';
import { Button } from '../../../components/ui/button';
import { Calendar } from 'lucide-react';
import { cn } from '../../../lib/utils';
import client from '../../../api/client';

interface LeaveTabProps {
    user?: any;
}

export function LeaveTab({ user }: LeaveTabProps) {
    // Mock History - Empty for new users
    const [requests, setRequests] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        type: 'Sick Leave',
        startDate: '',
        endDate: '',
        reason: ''
    });

    // Fetch leaves on mount
    React.useEffect(() => {
        const fetchLeaves = async () => {
            try {
                const res = await client.get('/leaves');
                setRequests(res.data.requests || []);
            } catch (error) {
                console.error("Failed to fetch leaves", error);
            }
        };
        fetchLeaves();
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await client.post('/leaves', formData);
            const newRequest = res.data.leaveRequest || res.data;
            setRequests([newRequest, ...requests]);
            setFormData({
                type: 'Sick Leave',
                startDate: '',
                endDate: '',
                reason: ''
            });
            // Optional: Show success toast
        } catch (error) {
            console.error("Failed to create leave", error);
            alert("Failed to submit request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageTransition>
            <div className="p-4 pt-4 pb-24 w-full max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-civic-dark dark:text-white">Leave Portal</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage your time off and view history</p>
                    </div>
                </div>

                {/* Balances Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-blue-100 font-bold text-xs uppercase tracking-wider mb-1">Vacation Balance</p>
                            <h2 className="text-4xl font-black">{user?.leaveBalances?.vacation || 0} <span className="text-lg font-medium opacity-80">days</span></h2>
                        </div>
                        <Calendar className="absolute -right-4 -bottom-4 h-24 w-24 text-white opacity-10 rotate-12" />
                    </div>
                    <div className="bg-gradient-to-br from-civic-green-500 to-civic-green-600 p-6 rounded-2xl text-white shadow-lg shadow-civic-green-500/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-green-100 font-bold text-xs uppercase tracking-wider mb-1">Sick Leave</p>
                            <h2 className="text-4xl font-black">{user?.leaveBalances?.sick || 0} <span className="text-lg font-medium opacity-80">days</span></h2>
                        </div>
                        <div className="absolute -right-4 -bottom-4 h-24 w-24 text-white opacity-10 bg-white rounded-full"></div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider mb-1">Pending Requests</p>
                        <h2 className="text-4xl font-black text-civic-dark dark:text-white">
                            {requests.filter(r => r.status === 'Pending').length} <span className="text-lg font-medium text-gray-400">active</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT: Apply Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h3 className="text-xl font-black text-civic-dark dark:text-white mb-6 flex items-center gap-2">
                                <span className="bg-civic-dark text-white rounded-lg p-1.5"><Calendar className="h-4 w-4" /></span>
                                New Request
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Select Type</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Sick Leave', 'Vacation', 'Personal'].map(type => (
                                            <button
                                                type="button"
                                                key={type}
                                                onClick={() => setFormData({ ...formData, type })}
                                                className={cn(
                                                    "py-4 px-3 rounded-2xl text-sm font-bold border-2 transition-all flex flex-col items-center gap-2",
                                                    formData.type === type
                                                        ? "border-civic-green-500 bg-civic-green-50 dark:bg-civic-green-900/20 text-civic-green-700 dark:text-civic-green-400 shadow-sm"
                                                        : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50"
                                                )}
                                            >
                                                <span className={cn("h-2 w-2 rounded-full",
                                                    type === 'Sick Leave' ? 'bg-red-400' : type === 'Vacation' ? 'bg-blue-400' : 'bg-orange-400'
                                                )}></span>
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">From</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-civic-green-500 focus:bg-white dark:focus:bg-gray-900 transition-all font-medium dark:text-white outline-none"
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">To</label>
                                        <input
                                            required
                                            type="date"
                                            className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-civic-green-500 focus:bg-white dark:focus:bg-gray-900 transition-all font-medium dark:text-white outline-none"
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Reason</label>
                                    <textarea
                                        required
                                        className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-civic-green-500 focus:bg-white dark:focus:bg-gray-900 transition-all font-medium dark:text-white outline-none min-h-[100px] resize-none"
                                        placeholder="Briefly describe why..."
                                        value={formData.reason}
                                        onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                    />
                                </div>

                                <Button
                                    disabled={isSubmitting}
                                    className="w-full h-14 text-lg font-bold rounded-2xl bg-civic-dark dark:bg-white text-white dark:text-civic-dark hover:bg-gray-800 active:scale-[0.98] transition-all shadow-lg shadow-civic-dark/10"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: History */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-1">Recent History</h3>
                        <div className="space-y-3">
                            {requests.length > 0 ? requests.map((req) => (
                                <div key={req._id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold px-2 py-0.5 rounded",
                                            req.status === 'Approved' ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                                                req.status === 'Rejected' ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
                                                    "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                        )}>
                                            {req.status}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-civic-dark dark:text-white">{req.type}</h4>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{req.reason}</p>
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-sm">No leave history</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
