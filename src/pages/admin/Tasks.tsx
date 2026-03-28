import React, { useState, useEffect, useCallback } from 'react';
import client from '../../api/client';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Dialog } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { Search, Filter, Calendar, LayoutGrid, List as ListIcon, MoreHorizontal, Clock, AlertCircle, MapPin, User, CheckCircle2, Truck, AlertTriangle, Plus, ChevronLeft, ChevronRight, X, Loader2, Send, XCircle } from 'lucide-react';
import { TaskCreationModal } from './components/TaskCreationModal';

const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles = {
        Critical: 'bg-civic-red text-white',
        High: 'bg-civic-red/10 text-civic-red border-civic-red/20',
        Medium: 'bg-civic-orange-50 text-civic-orange-600 border-civic-orange-200',
        Low: 'bg-civic-green-50 text-civic-green-600 border-civic-green-200',
    };
    return (
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest transition-all duration-300 ${styles[priority as keyof typeof styles] || styles.Low} dark:glow-green dark:text-glow-green`}>
            {priority}
        </span>
    );
};

const priorityColors = {
    Critical: 'border-l-civic-red shadow-red-100 dark:shadow-none',
    High: 'border-l-orange-500 shadow-orange-100 dark:shadow-none',
    Medium: 'border-l-yellow-500 shadow-yellow-100 dark:shadow-none',
    Low: 'border-l-civic-green-500 shadow-green-100 dark:shadow-none',
};

const TaskCard = ({ task, onDelete, onEdit }: { task: any, onDelete: (id: string) => void, onEdit: (task: any) => void }) => {
    return (
        <div className={`group glass-card dark:bg-gray-900/40 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:dark:glow-green transition-all duration-500 cursor-pointer border-t-[4px] flex flex-col gap-3 relative overflow-hidden ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Low}`}>
            {/* Subtle Gradient Glow inside the card */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-civic-green-500/5 blur-[50px] pointer-events-none group-hover:bg-civic-green-500/10 transition-all duration-500" />
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500 font-bold bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded-md">{task.id}</span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border
                            ${task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400' :
                                task.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400' :
                                    task.status === 'Review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}>
                            {task.status}
                        </span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-civic-dark hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-400 transition-colors outline-none ring-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="left" className="w-36 rounded-xl p-1 dark:bg-gray-950 dark:border-white/20 shadow-2xl border border-gray-100 dark:shadow-black/50">
                            <DropdownMenuLabel className="text-[9px] text-gray-400 font-bold uppercase px-2 py-1">Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEdit(task)} className="text-xs font-semibold cursor-pointer rounded-lg px-2 py-1.5 focus:bg-civic-dark focus:text-white dark:focus:bg-white/10">
                                Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(task._id)}
                                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 focus:bg-red-50 dark:focus:bg-red-900/20 font-bold cursor-pointer rounded-lg px-2 py-1.5"
                            >
                                Delete Task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <h4 className="font-extrabold text-civic-dark dark:text-white text-[14px] mb-2 leading-tight group-hover:text-civic-green-600 dark:group-hover:text-civic-green-400 transition-colors line-clamp-1">
                    {task.title}
                </h4>

                <div className="flex items-center gap-2 mb-2 overflow-hidden">
                    <PriorityBadge priority={task.priority} />
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/5 uppercase tracking-wider flex items-center gap-1.5 truncate">
                        <MapPin className="h-3 w-3 text-civic-dark dark:text-white shrink-0" /> 
                        <span className="truncate">{task.zone}</span>
                    </span>
                </div>
            </div>

            <div className="pt-3 border-t border-gray-50 dark:border-white/5 relative z-10">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 font-bold bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg truncate flex-1 transition-colors group-hover:bg-civic-green-500/10">
                        <User className="h-3.5 w-3.5 text-civic-dark dark:text-civic-green-400 shrink-0" />
                        <span className="truncate">{task.driver}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        {task.truck !== '-' ? (
                            <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400 font-bold">
                                <Truck className="h-3.5 w-3.5 text-civic-dark dark:text-civic-green-400 shrink-0" />
                                <span className="font-mono bg-gray-50 dark:bg-white/5 px-1.5 py-0.5 rounded-md">{task.truck}</span>
                            </div>
                        ) : (
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium italic">No Vehicle</div>
                        )}
                        
                        {task.status !== 'Completed' && (
                            <div className="flex items-center gap-1 text-[10px] font-black text-civic-dark dark:text-civic-green-400">
                                <Clock className="h-3 w-3" /> {task.due}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export function Tasks() {
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [tasks, setTasks] = useState<any[]>([]);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<{ status: string | null, priority: string | null }>({
        status: null,
        priority: null
    });
    const [dateRange, setDateRange] = useState<{ from: string, to: string }>({ from: '', to: '' });


    // Dispatch Modal State
    const [isDispatchOpen, setIsDispatchOpen] = useState(false);
    const [dispatching, setDispatching] = useState(false);
    const [dispatchResult, setDispatchResult] = useState<{ created: any[]; skipped: any[]; message: string } | null>(null);
    const [dispatchError, setDispatchError] = useState<string | null>(null);
    const [dispatchDrivers, setDispatchDrivers] = useState<any[]>([]);
    const [dispatchVehicles, setDispatchVehicles] = useState<any[]>([]);
    const [selectedDriver, setSelectedDriver] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState('');

    const columns = ['Pending', 'In Progress', 'Review', 'Completed'];

    const getQueryString = useCallback(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (dateRange.from) params.append('dateFrom', dateRange.from);
        if (dateRange.to) params.append('dateTo', dateRange.to);
        params.append('page', currentPage.toString());
        params.append('limit', '8'); // 8 items per page for clearer grid
        return params.toString();
    }, [searchQuery, filters, dateRange, currentPage]);

    const fetchTasks = useCallback(async () => {
        setLoading(true);
        try {
            const queryString = getQueryString();
            const { data } = await client.get(`/tasks?${queryString}`);

            // Handle both old array format and new paginated format
            const taskData = Array.isArray(data) ? data : data.tasks;
            const meta = !Array.isArray(data) ? { page: data.page, pages: data.pages, total: data.total } : { page: 1, pages: 1, total: taskData.length };

            setTotalPages(meta.pages);
            setTotalTasks(meta.total);

            const mapped = taskData.map((t: any) => ({
                id: t.ticketId,
                title: t.title,
                zone: t.location,
                status: t.status,
                driver: t.assignedTo ? t.assignedTo.name : 'Unassigned',
                truck: t.vehicleId ? t.vehicleId.vehicleId : '-',
                priority: t.priority,
                due: t.estimatedTime || 'Today',
                _id: t._id,
                assignedTo: t.assignedTo,
                vehicleId: t.vehicleId,
                location: t.location,
                estimatedTime: t.estimatedTime,
                createdAt: t.createdAt
            }));
            setTasks(mapped);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
            // Fallback for empty state or error
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [getQueryString]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTasks(); // Debounce search
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchTasks]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters, dateRange]);


    const handleEditClick = (task: any) => {
        setEditingTask(task);
        setIsCreateTaskOpen(true);
    };

    const handleDeleteClick = (taskId: string) => {
        setTaskToDelete(taskId);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            await client.delete(`/tasks/${taskToDelete}`);
            fetchTasks();
            setIsDeleteOpen(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error("Failed to delete task", error);
        }
    };

    const clearFilters = () => {
        setFilters({ status: null, priority: null });
        setDateRange({ from: '', to: '' });
        setSearchQuery('');
    };

    const hasActiveFilters = searchQuery || filters.status || filters.priority || dateRange.from || dateRange.to;

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-civic-dark dark:text-white">Usage & Tasks</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage fleet operations and maintenance tickets</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-white dark:bg-gray-700 shadow-sm text-civic-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-civic-dark dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            <ListIcon className="h-4 w-4" />
                        </button>
                    </div>
                    <Button
                        onClick={async () => {
                            // Load drivers and vehicles, then open modal
                            try {
                                const { getPersonnel } = await import('../../api/users');
                                const [drivers, vehiclesRes] = await Promise.all([
                                    getPersonnel(),
                                    client.get('/vehicles')
                                ]);
                                setDispatchDrivers(drivers || []);
                                setDispatchVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : vehiclesRes.data.vehicles || []);
                            } catch (e) {
                                console.error('Failed to load dispatch data', e);
                            }
                            setDispatchResult(null);
                            setDispatchError(null);
                            setDispatching(false);
                            setSelectedDriver('');
                            setSelectedVehicle('');
                            setIsDispatchOpen(true);
                        }}
                        variant="outline"
                        className="font-bold shadow-sm rounded-lg border-civic-green-600 text-civic-green-600 hover:bg-civic-green-50 dark:hover:bg-civic-green-900/20"
                    >
                        <Calendar className="h-4 w-4 mr-2" /> Dispatch Today
                    </Button>
                    <Button
                        onClick={() => {
                            setEditingTask(null);
                            setIsCreateTaskOpen(true);
                        }}
                        className="bg-civic-green-600 hover:bg-civic-green-700 text-white font-bold shadow-sm rounded-lg"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create Task
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mx-2 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search ticket ID, title or assignee..."
                            className="pl-10 border-transparent bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors dark:text-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto p-1 flex-wrap">
                        <Button
                            variant="ghost"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex-1 sm:flex-none gap-2 font-bold text-xs uppercase tracking-wider ${showFilters || hasActiveFilters ? 'text-civic-green-600 bg-civic-green-50' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                            <Filter className="h-4 w-4" /> Filters {hasActiveFilters && '• Active'}
                        </Button>

                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-2 h-8 px-2 text-gray-400 hover:text-red-500">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Expanded Filter Panel */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</Label>
                            <select
                                className="w-full text-sm rounded-md border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800"
                                value={filters.status || ''}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value || null })}
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Review">Review</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Priority</Label>
                            <select
                                className="w-full text-sm rounded-md border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800"
                                value={filters.priority || ''}
                                onChange={(e) => setFilters({ ...filters, priority: e.target.value || null })}
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wide">From Date</Label>
                            <Input
                                type="date"
                                value={dateRange.from}
                                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                className="h-9 text-xs"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs font-bold text-gray-400 uppercase tracking-wide">To Date</Label>
                            <Input
                                type="date"
                                value={dateRange.to}
                                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                className="h-9 text-xs"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* CONTENT AREA */}
            {loading && tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 min-h-[400px] bg-gray-50/50 dark:bg-gray-800/30 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <Loader2 className="h-8 w-8 text-civic-green-500 animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Loading tasks...</p>
                </div>
            ) : (
                <>
                    {/* Board View (Grouped Grid / Swimlanes) */}
            {viewMode === 'board' && (
                <div className="px-2 space-y-10 pb-6">
                    {columns.map(status => {
                        const columnTasks = tasks.filter(t => t.status === status);
                        if (columnTasks.length === 0) return null;

                        return (
                            <div key={status} className="space-y-4">
                                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
                                    <div className="flex items-center gap-2">
                                        {status === 'Pending' && <AlertCircle className="h-5 w-5 text-gray-400" />}
                                        {status === 'In Progress' && <Clock className="h-5 w-5 text-civic-orange-500" />}
                                        {status === 'Completed' && <CheckCircle2 className="h-5 w-5 text-civic-green-600 dark:text-civic-green-400" />}
                                        {status === 'Review' && <User className="h-5 w-5 text-civic-blue" />}
                                        <h3 className="text-lg font-black text-civic-dark dark:text-white uppercase tracking-widest">{status}</h3>
                                    </div>
                                    <span className="bg-white border border-gray-200 shadow-sm dark:border-gray-700 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {columnTasks.length} {columnTasks.length === 1 ? 'Task' : 'Tasks'}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                                    {columnTasks.map(task => (
                                        <TaskCard key={task.id} task={task} onDelete={handleDeleteClick} onEdit={handleEditClick} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                    
                    {tasks.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
                            <p className="text-gray-500 font-medium">No tasks found matching your filters.</p>
                            <Button variant="link" onClick={clearFilters} className="text-civic-green-600 mt-2">Clear all filters</Button>
                        </div>
                    )}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="px-2 space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className={`group bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-[4px] ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Low}`}>
                            <div className="flex items-start md:items-center gap-6">
                                <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 font-bold w-12 pt-1 md:pt-0">{task.id}</span>
                                <div>
                                    <h4 className="font-bold text-civic-dark dark:text-white text-sm group-hover:text-civic-green-600 dark:group-hover:text-civic-green-400 transition-colors mb-1">{task.title}</h4>
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            <MapPin className="h-3 w-3" /> {task.zone}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            <User className="h-3 w-3" /> {task.driver}
                                        </div>
                                        {task.truck !== '-' && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                <Truck className="h-3 w-3" /> {task.truck}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            <Calendar className="h-3 w-3" /> {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : '-'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 ml-16 md:ml-0">
                                <PriorityBadge priority={task.priority} />
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border
                                    ${task.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400' :
                                        task.status === 'In Progress' ? 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400' :
                                            task.status === 'Review' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400'}`}>
                                    {task.status}
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors outline-none ring-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleEditClick(task)}>
                                            Edit Task
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => handleDeleteClick(task._id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                                        >
                                            Delete Task
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
                            <p className="text-gray-500 font-medium">No tasks found matching your filters.</p>
                            <Button variant="link" onClick={clearFilters} className="text-civic-green-600 mt-2">Clear all filters</Button>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-100 dark:border-gray-800 sm:pr-24">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing <span className="font-bold text-civic-dark dark:text-white">{Math.min(tasks.length, 8)}</span> of <span className="font-bold text-civic-dark dark:text-white">{totalTasks}</span> tasks
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="h-8 text-xs font-bold"
                        >
                            <ChevronLeft className="h-3 w-3 mr-1" /> Previous
                        </Button>
                        <div className="text-xs font-bold text-gray-500 px-2">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="h-8 text-xs font-bold"
                        >
                            Next <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
                </>
            )}

            {/* CREATE/EDIT TASK WIZARD */}
            <TaskCreationModal
                isOpen={isCreateTaskOpen}
                onClose={() => setIsCreateTaskOpen(false)}
                onSuccess={fetchTasks}
                editingTask={editingTask}
            />

            {/* DELETE CONFIRMATION DIALOG */}
            <Dialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title=""
                description=""
            >
                <div className="flex flex-col items-center text-center p-4">
                    <div className="h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Task?</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-[280px]">
                        This action cannot be undone. This will permanently delete this task from the database.
                    </p>

                    <div className="flex w-full gap-3">
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="flex-1">
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmDelete}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* DISPATCH TODAY MODAL */}
            <Dialog
                isOpen={isDispatchOpen}
                onClose={() => setIsDispatchOpen(false)}
                title="Dispatch Today's Collections"
                description="Create pickup tasks for all zones scheduled today."
            >
                <div className="space-y-5">
                    {/* Pre-dispatch state */}
                    {!dispatching && !dispatchResult && !dispatchError && (
                        <>
                            {/* Driver Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    <User className="h-3.5 w-3.5 inline mr-1.5" />Assign Driver (Optional)
                                </label>
                                <select
                                    value={selectedDriver}
                                    onChange={(e) => setSelectedDriver(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-civic-green-500/20 focus:border-civic-green-500 dark:text-white transition-all"
                                >
                                    <option value="">No driver — assign later from Tasks</option>
                                    {dispatchDrivers.map((d: any) => (
                                        <option key={d._id} value={d._id}>
                                            {d.name} {d.status === 'On Duty' ? '● On Duty' : d.status === 'On Leave' ? '○ On Leave' : '○ Off Duty'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Vehicle Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    <Truck className="h-3.5 w-3.5 inline mr-1.5" />Assign Vehicle (Optional)
                                </label>
                                <select
                                    value={selectedVehicle}
                                    onChange={(e) => setSelectedVehicle(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-civic-green-500/20 focus:border-civic-green-500 dark:text-white transition-all"
                                >
                                    <option value="">No vehicle — assign later from Tasks</option>
                                    {dispatchVehicles.map((v: any) => (
                                        <option key={v._id} value={v._id}>
                                            {v.vehicleId} — {v.type} ({v.status || 'Active'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Info banner */}
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-xl p-3.5">
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                    This will create collection tasks for <strong>all zones</strong> scheduled today. Zones that already have tasks today will be skipped. {selectedDriver ? 'Tasks will be auto-assigned to the selected driver.' : 'Tasks will be created as "Pending" for manual assignment.'}
                                </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 pt-1">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-11 rounded-xl font-bold"
                                    onClick={() => setIsDispatchOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 h-11 rounded-xl font-bold bg-civic-green-600 hover:bg-civic-green-700 text-white shadow-lg shadow-civic-green-600/20"
                                    onClick={async () => {
                                        setDispatching(true);
                                        setDispatchError(null);
                                        setDispatchResult(null);
                                        try {
                                            const body: any = {};
                                            if (selectedDriver) body.assignedTo = selectedDriver;
                                            if (selectedVehicle) body.vehicleId = selectedVehicle;
                                            const { data } = await client.post('/tasks/dispatch-today', body);
                                            setDispatchResult(data);
                                            fetchTasks();
                                        } catch (err: any) {
                                            setDispatchError(err?.response?.data?.message || 'Failed to dispatch tasks.');
                                        } finally {
                                            setDispatching(false);
                                        }
                                    }}
                                >
                                    <Send className="h-4 w-4 mr-2" /> Dispatch Now
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Dispatching spinner */}
                    {dispatching && (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="relative">
                                <div className="h-16 w-16 rounded-full border-4 border-civic-green-100 dark:border-civic-green-900/30" />
                                <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-civic-green-600 animate-spin" />
                                <Truck className="absolute inset-0 m-auto h-6 w-6 text-civic-green-600" />
                            </div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white mt-5">Dispatching Tasks...</p>
                            <p className="text-xs text-gray-500 mt-1">Creating collection assignments for scheduled zones</p>
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
                                <Button className="flex-1 h-10 rounded-xl font-bold bg-civic-green-600 hover:bg-civic-green-700 text-white" onClick={() => { setDispatchError(null); setDispatching(false); setDispatchResult(null); }}>Try Again</Button>
                            </div>
                        </div>
                    )}

                    {/* Success result */}
                    {dispatchResult && (
                        <div className="space-y-4">
                            {dispatchResult.created.length > 0 ? (
                                <div className="text-center">
                                    <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                                        <CheckCircle2 className="h-7 w-7 text-green-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Dispatch Complete!</h3>
                                    <p className="text-sm text-gray-500">{dispatchResult.message}</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="h-14 w-14 mx-auto mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                        <CheckCircle2 className="h-7 w-7 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">All Done for Today!</h3>
                                    <p className="text-sm text-gray-500">All scheduled zones already have tasks dispatched. Nothing more to do.</p>
                                </div>
                            )}

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
