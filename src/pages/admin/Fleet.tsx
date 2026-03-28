import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import client from '../../api/client';
import { PageTransition } from '../../components/ui/page-transition';
import {
    Truck,
    Users,
    Search,
    MapPin,
    AlertTriangle,
    CheckCircle2,
    X,
    Clock,
    ChevronLeft,
    ChevronRight,
    Gauge,
    Plus,
    Edit2,
    Trash2,
    UserCheck,
    ClipboardList
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

// --- Vehicle Modal (Create / Edit) ---
function VehicleModal({ vehicle, onClose, onSave }: { vehicle: any | null, onClose: () => void, onSave: () => void }) {
    const [form, setForm] = useState({
        vehicleId: vehicle?.vehicleId || '',
        type: vehicle?.type || 'Compactor',
        licensePlate: vehicle?.licensePlate || '',
        capacity: vehicle?.capacity || '',
        status: vehicle?.status || 'Available',
        fuelLevel: vehicle?.fuelLevel ?? 100,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (vehicle) {
                await client.put(`/vehicles/${vehicle._id}`, form);
            } else {
                await client.post('/vehicles', form);
            }
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save vehicle');
        } finally {
            setLoading(false);
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-xl relative z-10">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-black text-civic-dark dark:text-white">{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <p className="text-xs text-red-500 font-bold p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</p>}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Vehicle ID *</label>
                            <input required value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })} disabled={!!vehicle}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-civic-green-500 disabled:opacity-50" placeholder="e.g. TRK-001" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Type *</label>
                            <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 text-sm font-medium dark:text-white outline-none">
                                <option>Compactor</option>
                                <option>Recycler</option>
                                <option>Flatbed</option>
                                <option>Mini Truck</option>
                                <option>Hauler</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">License Plate</label>
                            <input value={form.licensePlate} onChange={e => setForm({ ...form, licensePlate: e.target.value })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-civic-green-500" placeholder="e.g. MH-01-AB-1234" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Capacity</label>
                            <input value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-civic-green-500" placeholder="e.g. 5 Tons" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Status</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 text-sm font-medium dark:text-white outline-none">
                                <option>Available</option>
                                {vehicle?.driverId && <option>Active</option>}
                                <option>Maintenance</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Fuel Level (%)</label>
                            <input type="number" min={0} max={100} value={form.fuelLevel} onChange={e => setForm({ ...form, fuelLevel: Number(e.target.value) })}
                                className="w-full h-10 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-3 text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-civic-green-500" />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button type="submit" disabled={loading} className="flex-1 bg-civic-green-600 hover:bg-civic-green-700 text-white">
                            {loading ? 'Saving...' : (vehicle ? 'Save Changes' : 'Add Vehicle')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

// --- Assign Driver Modal ---
function AssignDriverModal({ vehicle, personnel, onClose, onSave }: { vehicle: any, personnel: any[], onClose: () => void, onSave: () => void }) {
    const [selectedDriver, setSelectedDriver] = useState(vehicle.driverId?._id || vehicle.driverId || '');
    const [loading, setLoading] = useState(false);

    const handleAssign = async () => {
        setLoading(true);
        try {
            await client.put(`/vehicles/${vehicle._id}/assign`, { driverId: selectedDriver || null });
            onSave();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-gray-900 w-full max-w-sm rounded-2xl shadow-xl relative z-10">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-black text-civic-dark dark:text-white">Assign Driver</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Vehicle: {vehicle.vehicleId}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                        <X className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <select
                        value={selectedDriver}
                        onChange={e => setSelectedDriver(e.target.value)}
                        className="w-full h-12 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 text-sm font-medium dark:text-white outline-none"
                    >
                        <option value="">— Unassign Driver —</option>
                        {personnel.map(p => (
                            <option key={p._id} value={p._id}>
                                {p.name} ({p.status === 'On Duty' ? '🟢' : p.status === 'On Leave' ? '🟠' : '⚪'} {p.status})
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-3">
                        <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
                        <Button onClick={handleAssign} disabled={loading} className="flex-1 bg-civic-dark text-white">
                            {loading ? 'Assigning...' : 'Confirm'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

export function Fleet() {
    const [activeTab, setActiveTab] = useState<'vehicles' | 'personnel'>('vehicles');
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<any[]>([]);

    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [selectedItemTasks, setSelectedItemTasks] = useState<any[]>([]);

    // Modals
    const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
    const [assignDriverVehicle, setAssignDriverVehicle] = useState<any | null>(null);

    // Filter & Search
    const [filterStatus, setFilterStatus] = useState('All');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        setPage(1);
        setSearch('');
        if (activeTab === 'personnel') {
            fetchPersonnel();
            setFilterStatus('On Duty');
        } else {
            fetchVehicles();
            setFilterStatus('All');
        }
    }, [activeTab]);

    useEffect(() => {
        if (activeTab === 'personnel' && filterStatus === 'Leave Request') {
            fetchLeaveRequests();
        }
    }, [filterStatus, activeTab]);

    // When selecting a personnel, fetch their tasks
    useEffect(() => {
        if (selectedItem && activeTab === 'personnel' && filterStatus !== 'Leave Request') {
            fetchPersonnelTasks(selectedItem._id);
        } else {
            setSelectedItemTasks([]);
        }
    }, [selectedItem, activeTab, filterStatus]);

    const fetchVehicles = async () => {
        try {
            const { data } = await client.get('/vehicles');
            setVehicles(data);
        } catch (error) {
            console.error("Failed to fetch vehicles", error);
        }
    };

    const fetchPersonnel = async () => {
        try {
            const { data } = await client.get('/users/personnel');
            setStaff(data.personnel || data);
        } catch (error) {
            console.error("Failed to fetch personnel", error);
        }
    };

    const fetchLeaveRequests = async () => {
        try {
            const { data } = await client.get('/users/leave-requests');
            setLeaveRequests(data.requests || (Array.isArray(data) ? data : []));
        } catch (error) {
            console.error("Failed to fetch leave requests", error);
        }
    };

    const fetchPersonnelTasks = async (userId: string) => {
        try {
            const { data } = await client.get(`/tasks?assignedTo=${userId}&limit=5`);
            const taskList = Array.isArray(data) ? data : data.tasks || [];
            setSelectedItemTasks(taskList.slice(0, 5));
        } catch {
            setSelectedItemTasks([]);
        }
    };

    const handleLeaveAction = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            await client.put(`/leaves/${id}`, { status });
            setLeaveRequests(prev => prev.map(req =>
                req._id === id ? { ...req, status } : req
            ));
            setSelectedItem(null);
            fetchPersonnel();
        } catch (error) {
            console.error(`Failed to ${status} leave`, error);
        }
    };

    const handleDeleteVehicle = async (id: string) => {
        if (!window.confirm('Delete this vehicle?')) return;
        try {
            await client.delete(`/vehicles/${id}`);
            setSelectedItem(null);
            fetchVehicles();
        } catch (error) {
            console.error("Failed to delete vehicle", error);
        }
    };

    // Stats
    const statTotal = activeTab === 'vehicles' ? vehicles.length : staff.length;
    const statActive = activeTab === 'vehicles'
        ? vehicles.filter(v => v.status === 'Active').length
        : staff.filter(s => s.status === 'On Duty').length;
    const statIssue = activeTab === 'vehicles'
        ? vehicles.filter(v => v.status === 'Maintenance' || v.status === 'Repair').length
        : staff.filter(s => s.status === 'On Leave').length;
    const statAvail = activeTab === 'vehicles'
        ? vehicles.filter(v => v.status === 'Available').length
        : staff.filter(s => s.status === 'Off Duty').length;

    const getFilteredItems = () => {
        if (filterStatus === 'Leave Request') return leaveRequests;

        let items = activeTab === 'vehicles' ? vehicles : staff;

        if (search) {
            const lowerSearch = search.toLowerCase();
            if (activeTab === 'vehicles') {
                items = items.filter((v: any) =>
                    v.vehicleId?.toLowerCase().includes(lowerSearch) ||
                    v.type?.toLowerCase().includes(lowerSearch) ||
                    v.licensePlate?.toLowerCase().includes(lowerSearch)
                );
            } else {
                items = items.filter((s: any) =>
                    s.name.toLowerCase().includes(lowerSearch) ||
                    s.role.toLowerCase().includes(lowerSearch)
                );
            }
        }

        if (filterStatus !== 'All') {
            if (activeTab === 'vehicles') {
                items = items.filter((v: any) => v.status === filterStatus);
            } else if (activeTab === 'personnel') {
                if (filterStatus === 'On Duty') items = items.filter((s: any) => s.status === 'On Duty');
                if (filterStatus === 'Off Duty') items = items.filter((s: any) => s.status === 'Off Duty' || s.status === 'On Leave');
            }
        }

        return items;
    };

    const filteredItems = getFilteredItems();
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <PageTransition className="flex flex-col h-[calc(100vh-theme(spacing.24))] relative overflow-hidden pb-6">

            {/* Modals */}
            {vehicleModalOpen && (
                <VehicleModal
                    vehicle={editingVehicle}
                    onClose={() => { setVehicleModalOpen(false); setEditingVehicle(null); }}
                    onSave={() => { fetchVehicles(); setSelectedItem(null); }}
                />
            )}
            {assignDriverVehicle && (
                <AssignDriverModal
                    vehicle={assignDriverVehicle}
                    personnel={staff.length > 0 ? staff : []}
                    onClose={() => setAssignDriverVehicle(null)}
                    onSave={() => { fetchVehicles(); fetchPersonnel(); setSelectedItem(null); setAssignDriverVehicle(null); }}
                />
            )}

            {/* HEADER & STATS */}
            <div className="shrink-0 mb-6 space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-civic-dark dark:text-white tracking-tight">Fleet Command</h1>
                        <p className="text-gray-500 font-medium mt-1">Real-time logistics and personnel tracking.</p>
                    </div>
                    {activeTab === 'vehicles' && (
                        <Button
                            onClick={() => { setEditingVehicle(null); setVehicleModalOpen(true); }}
                            className="bg-civic-green-600 hover:bg-civic-green-700 text-white font-bold shadow-sm rounded-xl"
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Vehicle
                        </Button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total {activeTab}</p>
                            <p className="text-2xl font-black text-civic-dark dark:text-white mt-1">{statTotal}</p>
                        </div>
                        <div className="h-10 w-10 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            {activeTab === 'vehicles' ? <Truck className="h-5 w-5 text-gray-400" /> : <Users className="h-5 w-5 text-gray-400" />}
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeTab === 'vehicles' ? 'Active Duty' : 'On Duty'}</p>
                            <p className="text-2xl font-black text-green-600 mt-1">{statActive}</p>
                        </div>
                        <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeTab === 'vehicles' ? 'Maintenance' : 'On Leave'}</p>
                            <p className="text-2xl font-black text-orange-600 mt-1">{statIssue}</p>
                        </div>
                        <div className="h-10 w-10 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{activeTab === 'vehicles' ? 'Available' : 'Off Duty'}</p>
                            <p className="text-2xl font-black text-blue-600 mt-1">{statAvail}</p>
                        </div>
                        <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                            <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col overflow-hidden relative z-0">

                {/* Unified Toolbar */}
                <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Tab Switcher */}
                        <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('vehicles')}
                                className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'vehicles' ? "bg-white dark:bg-gray-700 text-civic-dark dark:text-white shadow-sm" : "text-gray-400 hover:text-gray-600")}
                            >
                                Vehicles
                            </button>
                            <button
                                onClick={() => setActiveTab('personnel')}
                                className={cn("px-4 py-2 rounded-lg text-xs font-bold transition-all", activeTab === 'personnel' ? "bg-white dark:bg-gray-700 text-civic-dark dark:text-white shadow-sm" : "text-gray-400 hover:text-gray-600")}
                            >
                                Personnel
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto no-scrollbar">
                            {(activeTab === 'vehicles'
                                ? ['All', 'Active', 'Maintenance', 'Available']
                                : ['On Duty', 'Off Duty', 'Leave Request']
                            ).map(status => (
                                <button
                                    key={status}
                                    onClick={() => { setFilterStatus(status); setPage(1); }}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                                        filterStatus === status
                                            ? "bg-white dark:bg-gray-700 text-civic-dark dark:text-white shadow-sm"
                                            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    )}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            placeholder={`Search ${activeTab}...`}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-civic-dark/10 dark:text-white placeholder:text-gray-500"
                        />
                    </div>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto w-full p-6">
                    {activeTab === 'vehicles' ? (
                        <div>
                            <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <div className="col-span-2">Vehicle ID</div>
                                <div className="col-span-2">Status</div>
                                <div className="col-span-2">Type</div>
                                <div className="col-span-2">Capacity</div>
                                <div className="col-span-2">Driver</div>
                                <div className="col-span-2 text-right">Actions</div>
                            </div>
                            {paginatedItems.map((truck: any) => (
                                <div
                                    key={truck._id}
                                    onClick={() => setSelectedItem(truck)}
                                    className="group grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-4 md:gap-0 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                                >
                                    <div className="col-span-2 font-bold text-gray-700 dark:text-white flex items-center gap-2">
                                        <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded">
                                            <Truck className="h-4 w-4 text-gray-500" />
                                        </div>
                                        {truck.vehicleId}
                                    </div>
                                    <div className="col-span-2">
                                        <span className={cn(
                                            "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                            truck.status === 'Active' ? "bg-green-50 text-green-700 border-green-100" :
                                                truck.status === 'Maintenance' ? "bg-orange-50 text-orange-700 border-orange-100" :
                                                    "bg-blue-50 text-blue-700 border-blue-100"
                                        )}>
                                            {truck.status}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-sm font-medium text-gray-600 dark:text-gray-300">{truck.type}</div>
                                    <div className="col-span-2">
                                        <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-200">
                                            <Gauge className="h-4 w-4 text-gray-400" />
                                            {truck.capacity || 'N/A'}
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {truck.driverId ? (
                                            <span className="flex items-center gap-1">
                                                <span className="h-2 w-2 bg-green-400 rounded-full"></span>
                                                {truck.driverId.name}
                                            </span>
                                        ) : (
                                            <span className="text-gray-300 dark:text-gray-600 italic">Unassigned</span>
                                        )}
                                    </div>
                                    <div className="col-span-2 flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={() => { setEditingVehicle(truck); setVehicleModalOpen(true); }}
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="h-3.5 w-3.5 text-gray-400" />
                                        </button>
                                        <button
                                            onClick={() => { fetchPersonnel(); setAssignDriverVehicle(truck); }}
                                            className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title="Assign Driver"
                                        >
                                            <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVehicle(truck._id)}
                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // PERSONNEL VIEW
                        <div>
                            <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {filterStatus === 'Leave Request' ? (
                                    <>
                                        <div className="col-span-3">Employee</div>
                                        <div className="col-span-2">Type</div>
                                        <div className="col-span-3">Duration</div>
                                        <div className="col-span-2">Reason</div>
                                        <div className="col-span-2 text-right">Status</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-span-3">Employee</div>
                                        <div className="col-span-2">Status</div>
                                        <div className="col-span-2">Role</div>
                                        <div className="col-span-3">Assignment</div>
                                        <div className="col-span-2 text-right">Action</div>
                                    </>
                                )}
                            </div>
                            {paginatedItems.map((item: any) => {
                                const isLeave = filterStatus === 'Leave Request';
                                const person = isLeave ? item.personnelId : item;

                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => setSelectedItem(item)}
                                        className="group grid grid-cols-1 md:grid-cols-12 px-6 py-4 items-center gap-4 md:gap-0 border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                                    >
                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 group-hover:bg-civic-dark group-hover:text-white transition-colors">
                                                {person?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white text-sm">{person?.name || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500">{person?.email || 'No Email'}</p>
                                            </div>
                                        </div>

                                        {isLeave ? (
                                            <>
                                                <div className="col-span-2">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                        item.type === 'Sick' ? "bg-red-50 text-red-700 border-red-100" :
                                                            item.type === 'Vacation' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                                "bg-gray-50 text-gray-600 border-gray-100"
                                                    )}>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <div className="col-span-3 text-sm text-gray-600 dark:text-gray-300">
                                                    {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
                                                </div>
                                                <div className="col-span-2 text-sm text-gray-500 truncate pr-4" title={item.reason}>
                                                    {item.reason}
                                                </div>
                                                <div className="col-span-2 text-right">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                        item.status === 'Approved' ? "bg-green-50 text-green-700 border-green-100" :
                                                            item.status === 'Rejected' ? "bg-red-50 text-red-700 border-red-100" :
                                                                "bg-yellow-50 text-yellow-700 border-yellow-100"
                                                    )}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="col-span-2">
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                                                        person.status === 'On Duty' ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900" :
                                                            person.status === 'On Leave' ? "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900" :
                                                                "bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                                                    )}>
                                                        {person.status}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{person.role}</div>
                                                <div className="col-span-3">
                                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        {person.status === 'On Leave' ? (
                                                            <span className="text-orange-500 font-bold flex items-center gap-1">
                                                                <AlertTriangle className="h-3.5 w-3.5" /> On Leave
                                                            </span>
                                                        ) : person.assignedVehicle ? (
                                                            <>
                                                                <Truck className="h-3.5 w-3.5 text-civic-dark dark:text-white" />
                                                                {person.assignedVehicle}
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs italic">No Assignment</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="col-span-2 text-right">
                                                    <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-civic-dark dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        View Profile
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 sm:pr-24">
                    <p className="text-xs font-bold text-gray-400">
                        Showing {filteredItems.length > 0 ? ((page - 1) * itemsPerPage) + 1 : 0} - {Math.min(page * itemsPerPage, filteredItems.length)} of {filteredItems.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-gray-200 dark:border-gray-700" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 border-t border-gray-50 dark:border-gray-700 text-gray-500">
                        {filterStatus === 'Leave Request' ? (
                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                    <Clock className="h-6 w-6 text-gray-400" />
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white">No leave data</p>
                                <p className="text-xs text-gray-400 mt-1">Leave requests will appear here when submitted.</p>
                            </div>
                        ) : (
                            <p>No records found.</p>
                        )}
                    </div>
                )}
            </div>

            {/* SIDE DRAWER */}
            <div
                className={cn(
                    "absolute top-0 bottom-0 right-0 w-full md:w-[450px] bg-white dark:bg-gray-900 md:rounded-l-[2rem] shadow-2xl border-l border-gray-100 dark:border-gray-800 transform transition-transform duration-300 ease-out z-20 flex flex-col overflow-hidden",
                    selectedItem ? "translate-x-0" : "translate-x-[110%]"
                )}
            >
                {selectedItem && (
                    <>
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-start gap-4 bg-white dark:bg-gray-900">
                            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300 shrink-0">
                                {selectedItem.vehicleId ? (
                                    <Truck className="h-6 w-6 text-gray-400" />
                                ) : (
                                    (selectedItem.name || selectedItem.personnelId?.name || '?').charAt(0)
                                )}
                            </div>

                            <div className="flex-1">
                                <span className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border mb-2 inline-block",
                                    (selectedItem.status === 'Active' || selectedItem.status === 'On Duty' || selectedItem.status === 'Approved') ? "bg-green-50 text-green-600 border-green-100" :
                                        (selectedItem.status === 'On Leave' || selectedItem.status === 'Pending') ? "bg-orange-50 text-orange-600 border-orange-100" :
                                            "bg-gray-50 text-gray-600 border-gray-100"
                                )}>
                                    {selectedItem.status}
                                </span>
                                <h2 className="text-xl font-black text-civic-dark dark:text-white leading-tight">
                                    {selectedItem.vehicleId || selectedItem.name || selectedItem.personnelId?.name}
                                </h2>
                                <p className="text-xs font-bold text-gray-400 mt-1 capitalize">{selectedItem.type || selectedItem.role || 'Personnel'}</p>
                            </div>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors -mr-2 -mt-2"
                            >
                                <X className="h-4 w-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {filterStatus === 'Leave Request' ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Leave Type</p>
                                        <p className="font-bold text-civic-dark dark:text-white mt-1 capitalize text-lg">{selectedItem.type}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Start Date</p>
                                            <p className="font-bold text-civic-dark dark:text-white mt-1">{new Date(selectedItem.startDate).toLocaleDateString()}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">End Date</p>
                                            <p className="font-bold text-civic-dark dark:text-white mt-1">{new Date(selectedItem.endDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Reason</p>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">"{selectedItem.reason}"</p>
                                    </div>
                                </div>
                            ) : selectedItem.vehicleId ? (
                                // VEHICLE DETAILS
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">License Plate</p>
                                            <p className="font-bold text-civic-dark dark:text-white mt-1">{selectedItem.licensePlate || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Capacity</p>
                                            <p className="font-bold text-civic-dark dark:text-white mt-1">{selectedItem.capacity || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Fuel Level</p>
                                            <p className="font-bold text-civic-dark dark:text-white mt-1">{selectedItem.fuelLevel ?? 'N/A'}%</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Current Route</p>
                                            <p className="font-bold text-civic-dark dark:text-white mt-1">{selectedItem.currentRoute || 'Depot'}</p>
                                        </div>
                                    </div>
                                    {/* Assigned Driver */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Assigned Driver</p>
                                        {selectedItem.driverId ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 bg-civic-dark rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {selectedItem.driverId.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-civic-dark dark:text-white">{selectedItem.driverId.name}</p>
                                                    <p className="text-xs text-gray-400">{selectedItem.driverId.email}</p>
                                                </div>
                                                <span className={cn("ml-auto px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                                    selectedItem.driverId.status === 'On Duty' ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                                                )}>
                                                    {selectedItem.driverId.status}
                                                </span>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No driver assigned</p>
                                        )}
                                    </div>
                                    <div className="h-36 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 text-sm font-medium">
                                        <MapPin className="h-5 w-5 mr-2" /> Live Location Preview
                                    </div>
                                </>
                            ) : (
                                // PERSONNEL DETAILS
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Phone</p>
                                            <p className="font-bold text-civic-dark dark:text-white mt-1">{selectedItem.phone || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Assigned Vehicle</p>
                                            <p className="font-bold text-civic-dark dark:text-white mt-1">{selectedItem.assignedVehicle || 'None'}</p>
                                        </div>
                                    </div>

                                    {/* Current & Recent Tasks */}
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-3 flex items-center gap-2">
                                            <ClipboardList className="h-3.5 w-3.5" /> Recent Tasks
                                        </p>
                                        {selectedItemTasks.length > 0 ? (
                                            <div className="space-y-2">
                                                {selectedItemTasks.map((t: any) => (
                                                    <div key={t._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                                        <span className={cn("h-2 w-2 rounded-full shrink-0",
                                                            t.status === 'Completed' ? "bg-green-400" :
                                                                t.status === 'In Progress' ? "bg-blue-400" :
                                                                    "bg-gray-300"
                                                        )} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-civic-dark dark:text-white text-xs truncate">{t.title}</p>
                                                            <p className="text-[10px] text-gray-400">{t.ticketId} · {t.location}</p>
                                                        </div>
                                                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0",
                                                            t.status === 'Completed' ? "bg-green-50 text-green-700 border-green-100" :
                                                                t.status === 'In Progress' ? "bg-blue-50 text-blue-700 border-blue-100" :
                                                                    "bg-gray-50 text-gray-500 border-gray-100"
                                                        )}>
                                                            {t.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-gray-400 italic p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">No tasks found for this personnel.</p>
                                        )}
                                    </div>

                                    {selectedItem.status === 'On Leave' && (
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800">
                                            <p className="text-xs text-orange-600 dark:text-orange-400 uppercase tracking-wide font-bold mb-1">Currently Unavailable</p>
                                            <p className="text-orange-800 dark:text-orange-300 font-medium text-sm">This personnel is on leave.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 border-t border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex gap-3">
                            {filterStatus === 'Leave Request' && selectedItem.status === 'Pending' ? (
                                <>
                                    <Button
                                        onClick={() => handleLeaveAction(selectedItem._id, 'Approved')}
                                        className="flex-1 h-11 rounded-xl bg-civic-green-600 hover:bg-civic-green-700 text-white font-bold"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        onClick={() => handleLeaveAction(selectedItem._id, 'Rejected')}
                                        className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold"
                                    >
                                        Reject
                                    </Button>
                                </>
                            ) : selectedItem.vehicleId ? (
                                selectedItem.driverId ? (
                                    <Button
                                        onClick={async () => {
                                            if (!window.confirm("Remove assigned driver from this vehicle?")) return;
                                            try {
                                                await client.put(`/vehicles/${selectedItem._id}/assign`, { driverId: null });
                                                fetchVehicles();
                                                fetchPersonnel();
                                                setSelectedItem(null);
                                            } catch (err) {
                                                console.error("Failed to remove driver", err);
                                            }
                                        }}
                                        className="flex-1 h-11 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 font-bold"
                                    >
                                        <X className="h-4 w-4 mr-2" /> Remove Driver
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => { fetchPersonnel(); setAssignDriverVehicle(selectedItem); setSelectedItem(null); }}
                                        className="flex-1 h-11 rounded-xl bg-civic-dark dark:bg-white text-white dark:text-civic-dark font-bold"
                                    >
                                        <UserCheck className="h-4 w-4 mr-2" /> Assign Driver
                                    </Button>
                                )
                            ) : (
                                <Button
                                    onClick={() => setSelectedItem(null)}
                                    className="flex-1 h-11 rounded-xl bg-civic-dark dark:bg-white text-white dark:text-civic-dark font-bold"
                                >
                                    Close
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* BACKDROP */}
            {selectedItem && (
                <div
                    className="absolute inset-0 bg-black/5 dark:bg-black/50 z-10 backdrop-blur-[1px]"
                    onClick={() => setSelectedItem(null)}
                />
            )}

        </PageTransition>
    );
}
