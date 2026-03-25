import React, { useState, useEffect } from 'react';
import client from '../../api/client'; // Client is imported already
import { PageTransition } from '../../components/ui/page-transition';
import {
    MapPin,
    Search,
    Clock,
    Calendar as CalendarIcon,
    CheckCircle2,
    AlertTriangle,
    Filter,
    ChevronLeft,
    ChevronRight,
    X,
    Phone
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';
import { TaskCreationModal } from './components/TaskCreationModal';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel
} from '../../components/ui/dropdown-menu';

// --- TYPES ---
interface Complaint {
    id: string;
    type: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Open' | 'In Progress' | 'Resolved';
    location: {
        address: string;
        zone: string;
    };
    reporter: {
        name: string;
        contact: string;
    };
    timestamp: string;
    description: string;
}

// --- MOCK DATA REMOVED ---

export function Complaints() {
    // State
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [filter, setFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
    const [search, setSearch] = useState('');
    const [date, setDate] = useState('');
    const [page, setPage] = useState(1);
    const [data, setData] = useState({ complaints: [], total: 0, pages: 1 });
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
    const [actionLoading, setActionLoading] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const itemsPerPage = 8;

    // Fetch Complaints & Stats
    useEffect(() => {
        fetchComplaints();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, page, search, date]);

    const fetchStats = async () => {
        try {
            const { data } = await client.get('/complaints/stats');
            setStats(data.stats || { total: 0, pending: 0, inProgress: 0, resolved: 0 });
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            let statusQuery = '';
            if (filter !== 'All') statusQuery = filter === 'Open' ? 'pending' : filter.toLowerCase().replace(' ', '-');

            // Pass the same date as start and end to filter for that specific day
            const response = await client.get(`/complaints?page=${page}&limit=${itemsPerPage}&status=${filter === 'All' ? '' : statusQuery}&search=${search}&startDate=${date}&endDate=${date}`);

            console.log("Fetch Complaints Response:", response.data); // DEBUG

            setData({
                complaints: (response.data.complaints || []).map((c: any) => ({
                    id: c._id, // Using Mongo ID, or handle short ID mapping if needed
                    type: c.type,
                    priority: c.priority.charAt(0).toUpperCase() + c.priority.slice(1),
                    status: c.status === 'pending' ? 'Open' : c.status === 'in-progress' ? 'In Progress' : c.status === 'rejected' || c.status === 'invalid' ? 'Invalid' : 'Resolved',
                    location: {
                        address: c.location,
                        zone: c.zoneId ? c.zoneId.name : 'Unassigned'
                    },
                    reporter: {
                        name: c.residentId?.name || 'Unknown',
                        contact: c.residentId?.email || 'N/A'
                    },
                    timestamp: new Date(c.createdAt).toLocaleDateString(),
                    description: c.description
                })),
                total: response.data.total,
                pages: response.data.pages
            });
        } catch (error) {
            console.error("Failed to fetch complaints", error);
        } finally {
            setLoading(false);
        }
    };

    // Handlers
    const handleFilterChange = (f: typeof filter) => {
        setFilter(f);
        setPage(1);
    };

    const handleStatusUpdate = async (status: string, newUpdateMessage: string, assignedToId?: string) => {
        if (!selectedComplaint) return;
        setActionLoading(true);
        try {
            await client.put(`/complaints/${selectedComplaint.id}`, {
                status,
                newUpdate: newUpdateMessage,
                ...(assignedToId && { assignedTo: assignedToId })
            });
            // Refetch data
            setSelectedComplaint(null);
            fetchComplaints();
            fetchStats();
        } catch (error) {
            console.error("Failed to update complaint", error);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <PageTransition className="flex flex-col h-[calc(100vh-theme(spacing.24))] relative overflow-hidden pb-6">

            {/* HEADER & STATS */}
            <div className="shrink-0 mb-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-civic-dark dark:text-white tracking-tight">Complaints Management</h1>
                        <p className="text-gray-500 font-medium mt-1">Review, track, and resolve resident reports.</p>
                    </div>


                </div>

                {/* Stats Cards - Note: ideally these counts come from a stats endpoint */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Reports</p>
                            <p className="text-2xl font-black text-civic-dark dark:text-white mt-1">{stats.total}</p>
                        </div>
                        <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    {/* Placeholder stats for specific statuses as we don't have aggregated stats api yet */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending</p>
                            <p className="text-2xl font-black text-red-600 mt-1">{stats.pending}</p>
                        </div>
                        <div className="h-10 w-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">In Progress</p>
                            <p className="text-2xl font-black text-orange-600 mt-1">{stats.inProgress}</p>
                        </div>
                        <div className="h-10 w-10 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resolved</p>
                            <p className="text-2xl font-black text-green-600 mt-1">{stats.resolved}</p>
                        </div>
                        <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN TABLE AREA */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col overflow-hidden relative z-0">

                {/* Toolbar */}
                <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    {/* Tabs */}
                    <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                        {['All', 'Open', 'In Progress', 'Resolved'].map((f) => (
                            <button
                                key={f}
                                onClick={() => handleFilterChange(f as any)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-1 md:flex-none",
                                    filter === f
                                        ? "bg-white dark:bg-gray-700 text-civic-dark dark:text-white shadow-sm"
                                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Date Filter Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className={cn(
                                    "gap-2 h-10 border-none bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium hover:text-civic-dark transition-colors",
                                    date && "text-civic-dark dark:text-white bg-civic-dark/5 dark:bg-white/10"
                                )}>
                                    <CalendarIcon className="h-4 w-4" />
                                    <span className="text-xs">
                                        {date ? new Date(date).toLocaleDateString() : "Filter by Date"}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-auto p-4" align="end">
                                <DropdownMenuLabel>Select Date</DropdownMenuLabel>
                                <div className="flex flex-col gap-4 mt-2">
                                    <div className="space-y-1.5">
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-civic-dark/10 dark:text-white text-gray-600"
                                        />
                                    </div>
                                    {date && (
                                        <Button
                                            variant="ghost"
                                            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-full mt-1"
                                            onClick={() => setDate('')}
                                        >
                                            Clear Filter
                                        </Button>
                                    )}
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                placeholder="Search by ID or Address..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-civic-dark/10 dark:text-white placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Table Header (Hidden on Mobile) */}
                <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-3">Type / Description</div>
                    <div className="col-span-2">Location</div>
                    <div className="col-span-2 text-right">Date</div>
                </div>

                {/* Table Rows */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-12 text-gray-400 min-h-[400px]">
                            <div className="h-8 w-8 rounded-full border-4 border-civic-green-200 border-t-civic-green-600 animate-spin mb-4" />
                            <p className="text-sm font-bold animate-pulse">Loading reports...</p>
                        </div>
                    ) : data.complaints.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center min-h-[400px]">
                            <div className="h-16 w-16 mb-4 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                                <AlertTriangle className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-civic-dark dark:text-white mb-2">No Reports Found</h3>
                            <p className="text-sm text-gray-500 max-w-sm">
                                There are currently no resident complaints matching your criteria. Everything looks good!
                            </p>
                            {(search || filter !== 'All' || date) && (
                                <Button variant="outline" className="mt-4" onClick={() => { setSearch(''); setFilter('All'); setDate(''); }}>
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    ) : (data.complaints.map((complaint: any) => (
                        <div
                            key={complaint.id}
                            onClick={() => setSelectedComplaint(complaint)}
                            className="group transition-colors cursor-pointer border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                        >
                            {/* DESKTOP ROW */}
                            <div className="hidden md:grid grid-cols-12 px-6 py-4 items-center">
                                <div className="col-span-1 font-bold text-gray-500 group-hover:text-civic-dark dark:group-hover:text-white" title={complaint.id}>#{complaint.id.slice(-6)}</div>

                                <div className="col-span-2">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                        complaint.status === 'Resolved' ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900" :
                                            complaint.status === 'In Progress' ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900" :
                                                "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900"
                                    )}>
                                        {complaint.status}
                                    </span>
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full",
                                            complaint.priority === 'High' ? "bg-red-500" :
                                                complaint.priority === 'Medium' ? "bg-orange-400" : "bg-blue-400"
                                        )}></div>
                                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{complaint.priority}</span>
                                    </div>
                                </div>

                                <div className="col-span-3 pr-4">
                                    <p className="text-sm font-bold text-civic-dark dark:text-white truncate">{complaint.type}</p>
                                    <p className="text-xs text-gray-400 truncate">{complaint.description}</p>
                                </div>

                                <div className="col-span-2">
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                                        <MapPin className="h-3 w-3 shrink-0" />
                                        <span className="truncate">{complaint.location.address}</span>
                                    </div>
                                </div>

                                <div className="col-span-2 text-right text-xs font-bold text-gray-400">
                                    {complaint.timestamp}
                                </div>
                            </div>

                            {/* MOBILE CARD */}
                            <div className="flex md:hidden flex-col p-4 gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-400">#{complaint.id.slice(-6)}</span>
                                            <span className="text-[10px] text-gray-400">• {complaint.timestamp}</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-civic-dark dark:text-white">{complaint.type}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{complaint.description}</p>
                                    </div>
                                    <span className={cn(
                                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border",
                                        complaint.status === 'Resolved' ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900" :
                                            complaint.status === 'In Progress' ? "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-900" :
                                                "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900"
                                    )}>
                                        {complaint.status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-800">
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                                        <MapPin className="h-3 w-3" />
                                        <span className="truncate max-w-[150px]">{complaint.location.address}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            complaint.priority === 'High' ? "bg-red-500" :
                                                complaint.priority === 'Medium' ? "bg-orange-400" : "bg-blue-400"
                                        )}></div>
                                        <span className="text-[10px] font-medium text-gray-500">{complaint.priority} Priority</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )))}
                </div>

                {/* Footer / Pagination */}
                <div className="p-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sm:pr-24">
                    <p className="text-xs font-bold text-gray-400">
                        Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, data.total)} of {data.total}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-bold text-civic-dark dark:text-white px-2">Page {page}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            disabled={page >= data.pages}
                            onClick={() => setPage(p => p + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* SIDE DRAWER (DETAILS) */}
            <div
                className={cn(
                    "absolute top-0 bottom-0 right-0 w-full md:w-[450px] bg-white dark:bg-gray-800 md:rounded-l-[2rem] shadow-2xl border-l border-gray-100 dark:border-gray-700 transform transition-transform duration-300 ease-out z-20 flex flex-col overflow-hidden",
                    selectedComplaint ? "translate-x-0" : "translate-x-[110%]"
                )}
            >
                {selectedComplaint && (
                    <>
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-start bg-white dark:bg-gray-900">
                            <div>
                                <span className={cn(
                                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border mb-3 inline-block",
                                    selectedComplaint.status === 'Resolved' ? "bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-900" :
                                        selectedComplaint.status === 'In Progress' ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100 dark:border-orange-900" :
                                            "bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100 dark:border-red-900"
                                )}>
                                    {selectedComplaint.status}
                                </span>
                                <h2 className="text-2xl font-black text-civic-dark dark:text-white leading-tight">{selectedComplaint.type}</h2>
                                <p className="text-xs font-bold text-gray-400 mt-1">ID: {selectedComplaint.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                className="h-8 w-8 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">

                            {/* Map Preview */}
                            <div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 mb-6 relative overflow-hidden border border-gray-200 dark:border-gray-700 group">
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-87.6298,41.8781,13,0/600x400@2x?access_token=YOUR_TOKEN')] bg-cover bg-center grayscale opacity-60 group-hover:opacity-80 transition-opacity"></div>
                                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                    <MapPin className="h-3.5 w-3.5 text-civic-dark dark:text-white" />
                                    <span className="text-xs font-bold text-civic-dark dark:text-white">{selectedComplaint.location.address}</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wide mb-2">Issue Description</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    "{selectedComplaint.description}"
                                </p>
                            </div>

                            {/* Reporter */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-200 uppercase tracking-wide mb-2">Citizen Details</h4>
                                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-civic-dark dark:bg-white text-white dark:text-civic-dark flex items-center justify-center font-bold">
                                            {selectedComplaint.reporter.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-civic-dark dark:text-white">{selectedComplaint.reporter.name}</p>
                                            <p className="text-xs text-gray-500">{selectedComplaint.reporter.contact}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-400 hover:text-civic-dark dark:hover:text-white">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                        </div>

                        {/* Drawer Footer */}
                        {(selectedComplaint.status === 'Open' || selectedComplaint.status === 'In Progress') && (
                            <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-3">
                                <Button 
                                    disabled={actionLoading}
                                    onClick={() => setIsTaskModalOpen(true)}
                                    className="w-full h-11 rounded-xl bg-civic-dark dark:bg-white text-white dark:text-civic-dark font-bold shadow-lg shadow-civic-dark/10 hover:shadow-xl transition-all"
                                >
                                    Assign to Crew
                                </Button>
                                <div className="flex gap-3">
                                    <Button 
                                        variant="outline" 
                                        disabled={actionLoading}
                                        onClick={() => handleStatusUpdate('rejected', 'Flagged as invalid report')}
                                        className="flex-1 h-10 rounded-xl font-bold border-gray-200 dark:border-gray-700 dark:text-gray-300"
                                    >
                                        Flag Invalid
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        disabled={actionLoading}
                                        onClick={() => handleStatusUpdate('resolved', 'Issue marked as resolved')}
                                        className="flex-1 h-10 rounded-xl font-bold border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30"
                                    >
                                        Resolve
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* BACKDROP for Drawer */}
            {selectedComplaint && (
                <div
                    className="absolute inset-0 bg-black/5 dark:bg-black/50 z-10 backdrop-blur-[1px]"
                    onClick={() => setSelectedComplaint(null)}
                />
            )}

            {/* Task Creation Modal */}
            {selectedComplaint && (
                <TaskCreationModal
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSuccess={(taskData: any) => {
                        handleStatusUpdate('in-progress', 'Crew Assigned to investigate', taskData?.task?.assignedTo || undefined);
                    }}
                    defaultValues={{
                        title: `Complaint: ${selectedComplaint.type}`,
                        description: selectedComplaint.description,
                        priority: selectedComplaint.priority,
                        locationName: selectedComplaint.location.address
                    }}
                />
            )}

        </PageTransition>
    );
}
