import React, { useState } from 'react';
import { Plus, CheckCircle, Clock, LayoutList, History, AlertCircle, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { cn } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';
import { getMyComplaints, createComplaint } from '../../../api/complaints';

interface Complaint {
    id: string;
    type: string;
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected' | 'invalid';
    date: string;
    description: string;
    location: string;
    updates: { date: string; message: string; active?: boolean }[];
}

export function ResComplaintsTab() {
    const { user } = useAuth();
    const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [selectedHistoryComplaint, setSelectedHistoryComplaint] = useState<Complaint | null>(null);

    const [complaints, setComplaints] = useState<Complaint[]>([]);

    const [newComplaintData, setNewComplaintData] = useState({ type: 'Missed Pickup', description: '', location: '', date: new Date().toISOString().split('T')[0] });

    // Fetch Complaints
    React.useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const data = await getMyComplaints();
                // Transform API data to Component state format if needed, or update Component interface
                // API returns { complaints: [], ... }
                setComplaints(data.complaints.map((c: any) => ({
                    id: c._id, // Use _id as id
                    type: c.type,
                    status: c.status,
                    date: new Date(c.createdAt).toLocaleDateString(),
                    description: c.description,
                    location: c.location,
                    updates: c.updates || []
                })));
            } catch (error) {
                console.error("Failed to fetch complaints", error);
            } finally {

            }
        };

        fetchComplaints();
    }, []);

    const handleCreateComplaint = async () => {
        try {
            await createComplaint({
                type: newComplaintData.type,
                description: newComplaintData.description,
                location: newComplaintData.location,
                zoneId: (user as any)?.zoneId
            });
            setIsComplaintModalOpen(false);
            // Refresh list
            const data = await getMyComplaints();
            setComplaints(data.complaints.map((c: any) => ({
                id: c._id,
                type: c.type,
                status: c.status,
                date: new Date(c.createdAt).toLocaleDateString(),
                description: c.description,
                location: c.location,
                updates: c.updates || []
            })));
        } catch (error) {
            console.error("Failed to create complaint", error);
        }
    };

    const activeComplaints = complaints.filter(c => c.status !== 'resolved');
    const historyComplaints = complaints.filter(c => c.status === 'resolved');



    return (
        <div className="h-full w-full mx-auto flex flex-col gap-6 animate-in fade-in duration-500 pb-20 p-4">

            {/* STATS OVERVIEW - Fills empty space and adds 'dashboard' feel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <AlertCircle className="h-12 w-12 text-blue-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider z-10">Active Issues</span>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white z-10">{activeComplaints.length}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <Clock className="h-12 w-12 text-amber-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider z-10">Pending Review</span>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white z-10">
                        {activeComplaints.filter(c => c.status === 'pending').length}
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-24 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider z-10">Resolved (Year)</span>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white z-10">{historyComplaints.length}</div>
                </div>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none flex flex-col justify-center items-center text-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setIsComplaintModalOpen(true)}>
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-bold text-white/90">New Request</span>
                </div>
            </div>

            {/* Top Toolbar: Tabs */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-20 bg-gray-50/90 dark:bg-black/90 backdrop-blur-md py-2">
                <div className="flex p-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={cn("flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                            activeTab === 'active'
                                ? "bg-gray-900 text-white shadow-md"
                                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                        )}
                    >
                        <LayoutList className="h-4 w-4" /> Active Requests
                        <span className={cn("ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]", activeTab === 'active' ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500")}>
                            {activeComplaints.length}
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={cn("flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300",
                            activeTab === 'history'
                                ? "bg-gray-900 text-white shadow-md"
                                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900"
                        )}
                    >
                        <History className="h-4 w-4" /> History
                    </button>
                </div>
            </div>

            {/* TAB CONTENT: ACTIVE */}
            {activeTab === 'active' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-500">
                    {activeComplaints.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">

                            {/* Status Pill */}
                            <div className="flex justify-between items-start mb-3 relative z-10">
                                <Badge variant="secondary" className={cn("px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]",
                                    item.status === 'in-progress' ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                )}>
                                    {item.status === 'in-progress' ? 'In Progress' : 'Pending Review'}
                                </Badge>
                                <span className="text-xs font-mono text-gray-400">#{item.id}</span>
                            </div>

                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 transition-colors relative z-10">{item.type}</h4>
                            <p className="text-sm text-gray-500 mb-6 line-clamp-2 relative z-10">{item.description}</p>

                            {/* Progress Section */}
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 relative z-10">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Status</span>
                                    <span className={cn("text-xs font-bold", item.status === 'in-progress' ? "text-blue-600" : "text-amber-600")}>
                                        {item.updates && item.updates.length > 0 ? item.updates[item.updates.length - 1].message : 'Request Received'}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", item.status === 'in-progress' ? "w-[60%] bg-blue-500" : "w-[10%] bg-amber-500")}
                                    ></div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
                                    <Clock className="h-3 w-3" /> Last updated: Today
                                </div>
                            </div>

                            {/* Decorative Background Gradient */}
                            <div className={cn("absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-20",
                                item.status === 'in-progress' ? "bg-blue-600" : "bg-amber-500"
                            )}></div>
                        </div>
                    ))}

                    {/* Add New Empty State Card - Now more compact/different style */}
                    <div
                        onClick={() => setIsComplaintModalOpen(true)}
                        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all min-h-[250px] group opacity-60 hover:opacity-100"
                    >
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="h-5 w-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">Another Issue?</h4>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: HISTORY */}
            {activeTab === 'history' && (
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    {historyComplaints.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">ID</th>
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Issue Type</th>
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider">Date Resolved</th>
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider text-right">Status</th>
                                            <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px] tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {historyComplaints.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-xs text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">#{item.id.substring(item.id.length - 6)}</td>
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{item.type}</td>
                                                <td className="px-6 py-4 text-gray-500">{item.date}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900">
                                                        <CheckCircle className="h-3 w-3 mr-1" /> Resolved
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => setSelectedHistoryComplaint(item)}
                                                    >
                                                        Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
                                <span className="text-xs text-gray-400">Showing last {historyComplaints.length} resolved requests</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="h-16 w-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mb-4">
                                <History className="h-8 w-8 text-gray-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Resolved History</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                You don't have any resolved complaints yet. Active issues will appear here once they are completed.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* DIALOG FOR NEW REQUEST */}
            <Dialog
                isOpen={isComplaintModalOpen}
                onClose={() => setIsComplaintModalOpen(false)}
                title="Report an Issue"
                description="Describe the problem. We will investigate as soon as possible."
                containerClassName="backdrop-blur-sm"
            >
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Issue Type</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={newComplaintData.type}
                                    onChange={(e) => setNewComplaintData({ ...newComplaintData, type: e.target.value })}
                                >
                                    <option>Missed Pickup</option>
                                    <option>Damaged Bin</option>
                                    <option>Overflowing Dumpster</option>
                                    <option>Street Light</option>
                                    <option>Graffiti</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Date Observed</label>
                                <Input type="date" value={newComplaintData.date} onChange={(e) => setNewComplaintData({ ...newComplaintData, date: e.target.value })} className="dark:text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Description</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-civic-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Provide more details..."
                            value={newComplaintData.description}
                            onChange={(e) => setNewComplaintData({ ...newComplaintData, description: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-900 dark:text-gray-200">Location</label>
                        <Input
                            placeholder="e.g. Main St, or 'My Address'"
                            value={newComplaintData.location}
                            onChange={(e) => setNewComplaintData({ ...newComplaintData, location: e.target.value })}
                        />
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-xs p-3 rounded-lg flex items-start gap-2 border border-blue-100 dark:border-blue-900/30">
                        <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                        <p>Most requests are reviewed within 24 hours. You will receive a notification when the status updates.</p>
                    </div>
                    <div className="flex justify-end pt-4 gap-2">
                        <Button variant="ghost" className="text-gray-500 dark:text-gray-400" onClick={() => setIsComplaintModalOpen(false)}>Cancel</Button>
                        <Button type="button" className="bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 text-white" onClick={handleCreateComplaint}>Submit Report</Button>
                    </div>
                </div>
            </Dialog>

            {/* DIALOG FOR COMPLAINT DETAILS */}
            <Dialog
                isOpen={!!selectedHistoryComplaint}
                onClose={() => setSelectedHistoryComplaint(null)}
                title="Complaint Details"
                description={`View details for complaint #${selectedHistoryComplaint?.id?.substring(selectedHistoryComplaint.id.length - 6) || ''}`}
                containerClassName="backdrop-blur-sm"
            >
                {selectedHistoryComplaint && (
                    <div className="space-y-6 py-2 pb-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedHistoryComplaint.type}</h3>
                            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 capitalize">
                                {selectedHistoryComplaint.status === 'rejected' ? 'Invalid' : selectedHistoryComplaint.status}
                            </Badge>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl space-y-3 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Location</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedHistoryComplaint.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Date Submitted</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedHistoryComplaint.date}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedHistoryComplaint.description}</p>
                            </div>
                            
                            {selectedHistoryComplaint.updates && selectedHistoryComplaint.updates.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Status Updates</h4>
                                    <div className="space-y-3 relative pl-4 border-l-2 border-gray-100 dark:border-gray-800">
                                        {selectedHistoryComplaint.updates.slice().reverse().map((update, idx) => (
                                            <div key={idx} className="relative">
                                                {/* Timeline dot */}
                                                <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-gray-900" />
                                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800">
                                                    <p className="text-[10px] font-bold text-gray-400 mb-1">{new Date(update.date).toLocaleDateString()} at {new Date(update.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{update.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    );
}
