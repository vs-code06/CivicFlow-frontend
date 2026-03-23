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
import { Search, Filter, Calendar, LayoutGrid, List as ListIcon, MoreHorizontal, Clock, AlertCircle, MapPin, User, CheckCircle2, Truck, AlertTriangle, Plus, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { getZones } from '../../api/zones';
import { TaskCreationModal } from './components/TaskCreationModal';

const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles = {
        Critical: 'bg-civic-red text-white',
        High: 'bg-civic-red/10 text-civic-red border-civic-red/20',
        Medium: 'bg-civic-orange-50 text-civic-orange-600 border-civic-orange-200',
        Low: 'bg-civic-green-50 text-civic-green-600 border-civic-green-200',
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${styles[priority as keyof typeof styles] || styles.Low}`}>
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
        <div className={`group bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border-l-[4px] ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Low}`}>
            <div className="flex justify-between items-start mb-3">
                <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 font-bold">{task.id}</span>
                <DropdownMenu>
                    <DropdownMenuTrigger className="h-6 w-6 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors outline-none ring-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                            Edit Task
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(task._id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                        >
                            Delete Task
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <h4 className="font-bold text-civic-dark dark:text-white text-sm mb-3 leading-tight group-hover:text-civic-green-600 dark:group-hover:text-civic-green-400 transition-colors">
                {task.title}
            </h4>

            <div className="flex flex-wrap gap-2 mb-4">
                <PriorityBadge priority={task.priority} />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {task.zone}
                </span>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-50 dark:border-gray-800">
                {/* Driver Row */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <User className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
                        <span>{task.driver}</span>
                    </div>
                    {task.status !== 'Completed' && (
                        <div className="font-bold text-gray-400 dark:text-gray-500">{task.due}</div>
                    )}
                </div>

                {/* Truck Row */}
                {task.truck !== '-' && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Truck className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
                        <span className="font-mono font-bold text-xs">{task.truck}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export function Tasks() {
    const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
    const [tasks, setTasks] = useState<any[]>([]);
    const [zones, setZones] = useState<any[]>([]);
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

    // Form State
    const [newTask, setNewTask] = useState({
        title: '',
        location: '',
        zoneId: '',
        priority: 'Medium',
        status: 'Pending',
        assignedTo: null,
        vehicleId: null,
        estimatedTime: '2h'
    });

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

    // Fetch Zones for Dropdown
    useEffect(() => {
        const fetchZonesData = async () => {
            try {
                const data = await getZones();
                setZones(data);
            } catch (error) {
                console.error("Failed to fetch zones for dropdown", error);
            }
        };
        fetchZonesData();
    }, []);

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

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTask) {
                await client.put(`/tasks/${editingTask._id}`, newTask);
            } else {
                await client.post('/tasks', newTask);
            }
            fetchTasks(); // Refresh
            setIsCreateTaskOpen(false);
            setEditingTask(null);
            setEditingTask(null);
            setNewTask({ title: '', location: '', zoneId: '', priority: 'Medium', status: 'Pending', assignedTo: null, vehicleId: null, estimatedTime: '2h' });
        } catch (error) {
            console.error("Failed to save task", error);
        }
    };

    const handleEditClick = (task: any) => {
        setEditingTask(task);
        setNewTask({
            title: task.title,
            location: task.location || '',
            zoneId: task.zoneId?._id || task.zoneId || '',
            priority: task.priority,
            status: task.status,
            assignedTo: task.assignedTo,
            vehicleId: task.vehicleId,
            estimatedTime: task.estimatedTime || '2h'
        });
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
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-3xl min-h-[400px]">
                    <Loader2 className="h-10 w-10 text-civic-green-500 animate-spin mb-4" />
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 animate-pulse uppercase tracking-widest">Loading Tasks...</p>
                </div>
            )}

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
                        onClick={() => {
                            setEditingTask(null);
                            setEditingTask(null);
                            setNewTask({ title: '', location: '', zoneId: '', priority: 'Medium', status: 'Pending', assignedTo: null, vehicleId: null, estimatedTime: '2h' });
                            setIsCreateTaskOpen(true);
                            setIsCreateTaskOpen(true);
                        }}
                        className="bg-civic-green-600 hover:bg-civic-green-700 text-white font-bold shadow-sm rounded-lg"
                    >
                        <Plus className="h-4 w-4 mr-2" /> Create Task
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white dark:bg-gray-900 p-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mx-2 space-y-3">
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

            {/* Board View */}
            {viewMode === 'board' && (
                <div className="px-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
                        {columns.map(status => {
                            const columnTasks = tasks.filter(t => t.status === status);
                            return (
                                <div key={status} className="flex flex-col h-full rounded-xl bg-gray-50/50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 p-2 min-h-[500px]">
                                    <div className="flex items-center justify-between mb-4 px-1 pt-2">
                                        <h3 className="text-sm font-bold text-civic-dark dark:text-white uppercase tracking-widest flex items-center gap-2">
                                            {status === 'Pending' && <AlertCircle className="h-4 w-4 text-gray-400" />}
                                            {status === 'In Progress' && <Clock className="h-4 w-4 text-civic-orange-500" />}
                                            {status === 'Completed' && <CheckCircle2 className="h-4 w-4 text-civic-green-600 dark:text-civic-green-400" />}
                                            {status === 'Review' && <User className="h-4 w-4 text-civic-blue" />}
                                            {status}
                                        </h3>
                                        <span className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">
                                            {columnTasks.length}
                                        </span>
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        {columnTasks.map(task => (
                                            <TaskCard key={task.id} task={task} onDelete={handleDeleteClick} onEdit={handleEditClick} />
                                        ))}
                                        {columnTasks.length === 0 && (
                                            <div className="h-full flex items-center justify-center text-gray-300 dark:text-gray-700 text-xs font-medium italic">
                                                No tasks
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="px-2 space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className={`group bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-[4px] ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Low}`}>
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
                <div className="flex items-center justify-between px-2 pt-4 border-t border-gray-100 dark:border-gray-800">
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

        </div>
    );
}
