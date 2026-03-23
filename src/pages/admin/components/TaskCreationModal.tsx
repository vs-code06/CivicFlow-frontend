import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Target, AlertTriangle, Truck, Clock } from 'lucide-react';
import { getZones } from '../../../api/zones';
import client from '../../../api/client';

// Simple Toggle Component
const ScopeToggle = ({ value, onChange }: { value: 'zone' | 'area', onChange: (v: 'zone' | 'area') => void }) => (
    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-4">
        <button
            type="button"
            onClick={() => onChange('zone')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${value === 'zone' ? 'bg-white dark:bg-gray-700 shadow-sm text-civic-dark dark:text-white' : 'text-gray-400'}`}
        >
            Select Full Zone
        </button>
        <button
            type="button"
            onClick={() => onChange('area')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${value === 'area' ? 'bg-white dark:bg-gray-700 shadow-sm text-civic-dark dark:text-white' : 'text-gray-400'}`}
        >
            Select Specific Area
        </button>
    </div>
);

interface TaskCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data?: any) => void;
    editingTask?: any;
    defaultValues?: any;
}

export function TaskCreationModal({ isOpen, onClose, onSuccess, editingTask, defaultValues }: TaskCreationModalProps) {
    const [step, setStep] = useState(1);
    const [zones, setZones] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [scope, setScope] = useState<'zone' | 'area'>('zone');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'Regular',
        priority: 'Medium',
        zoneId: '',
        targetAreaId: '',
        locationName: '',
        estimatedTime: '2h',
        status: 'Pending',
        assignedTo: '',
        vehicleId: ''
    });

    useEffect(() => {
        if (isOpen) {
            getZones().then(setZones).catch(console.error);
            import('../../../api/users').then(({ getPersonnel }) => {
                getPersonnel().then(setDrivers).catch(console.error);
            });
            client.get('/vehicles').then(res => setVehicles(res.data)).catch(console.error);

            if (editingTask) {
                setFormData({
                    title: editingTask.title,
                    description: editingTask.description || '',
                    type: editingTask.type || 'Regular',
                    priority: editingTask.priority,
                    zoneId: editingTask.zoneId?._id || editingTask.zoneId || '',
                    targetAreaId: editingTask.targetAreaId || '',
                    locationName: editingTask.location,
                    estimatedTime: editingTask.estimatedTime || '2h',
                    status: editingTask.status,
                    assignedTo: editingTask.assignedTo?._id || editingTask.assignedTo || '',
                    vehicleId: editingTask.vehicleId?._id || editingTask.vehicleId || ''
                });
                setScope(editingTask.targetAreaId ? 'area' : 'zone');
            } else if (defaultValues) {
                setFormData({
                    title: defaultValues.title || '',
                    description: defaultValues.description || '',
                    type: defaultValues.type || 'Regular',
                    priority: defaultValues.priority || 'Medium',
                    zoneId: defaultValues.zoneId || '',
                    targetAreaId: defaultValues.targetAreaId || '',
                    locationName: defaultValues.locationName || '',
                    estimatedTime: '2h',
                    status: 'Pending',
                    assignedTo: '',
                    vehicleId: ''
                });
                setScope(defaultValues.targetAreaId ? 'area' : 'zone');
            } else {
                setFormData({ title: '', description: '', type: 'Regular', priority: 'Medium', zoneId: '', targetAreaId: '', locationName: '', estimatedTime: '2h', status: 'Pending', assignedTo: '', vehicleId: '' });
                setStep(1);
            }
        }
    }, [isOpen, editingTask, defaultValues]);

    const selectedZoneData = zones.find(z => z._id === formData.zoneId);

    // Available vehicles: available or the one currently assigned to this task
    const availableVehicles = vehicles.filter(v =>
        v.status === 'Available' || v.status === 'Active' ||
        v._id === formData.vehicleId ||
        (editingTask && (editingTask.vehicleId?._id === v._id || editingTask.vehicleId === v._id))
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                location: formData.locationName,
                targetAreaId: scope === 'area' ? formData.targetAreaId : null,
                assignedTo: formData.assignedTo || null,
                vehicleId: formData.vehicleId || null,
            };

            let response;
            if (editingTask) {
                response = await client.put(`/tasks/${editingTask._id}`, payload);
            } else {
                response = await client.post('/tasks', payload);
            }
            onSuccess(response?.data);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    if (!isOpen) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-2xl shadow-xl relative z-10 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-black text-civic-dark dark:text-white">{editingTask ? 'Edit Task' : 'New Assignment'}</h2>
                        <p className="text-sm text-gray-400">Step {step} of 2</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none">
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* STEP 1: SCOPE & LOCATION */}
                    {step === 1 && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">

                            <div className="space-y-2">
                                <Label>Task Type</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Regular', 'Emergency', 'Bulk'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t, priority: t === 'Emergency' ? 'Critical' : 'Medium' })}
                                            className={`p-3 rounded-xl border text-sm font-bold flex flex-col items-center gap-1 transition-all ${formData.type === t
                                                ? 'bg-civic-dark text-white border-civic-dark'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'}`}
                                        >
                                            {t === 'Regular' && <Truck className="h-4 w-4" />}
                                            {t === 'Emergency' && <AlertTriangle className="h-4 w-4" />}
                                            {t === 'Bulk' && <Target className="h-4 w-4" />}
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Select Scope</Label>
                                <ScopeToggle value={scope} onChange={setScope} />
                            </div>

                            <div className="space-y-2">
                                <Label>Zone</Label>
                                <select
                                    required
                                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 font-medium outline-none focus:ring-2 focus:ring-civic-green-500 dark:text-white"
                                    value={formData.zoneId}
                                    onChange={(e) => {
                                        const z = zones.find(z => z._id === e.target.value);
                                        setFormData({
                                            ...formData,
                                            zoneId: e.target.value,
                                            locationName: z ? z.name : '',
                                            targetAreaId: ''
                                        });
                                    }}
                                >
                                    <option value="">Choose a Zone...</option>
                                    {zones.map(z => <option key={z._id} value={z._id}>{z.name}</option>)}
                                </select>
                            </div>

                            {scope === 'area' && formData.zoneId && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label>Specific Area</Label>
                                    <select
                                        required
                                        className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 font-medium outline-none focus:ring-2 focus:ring-civic-green-500 dark:text-white"
                                        value={formData.targetAreaId}
                                        onChange={(e) => {
                                            const area = selectedZoneData?.areas?.find((a: any) => a._id === e.target.value);
                                            setFormData({
                                                ...formData,
                                                targetAreaId: e.target.value,
                                                locationName: area ? `${selectedZoneData?.name} - ${area.name}` : formData.locationName
                                            });
                                        }}
                                    >
                                        <option value="">Choose an Area...</option>
                                        {selectedZoneData?.areas?.map((a: any) => (
                                            <option key={a._id} value={a._id}>{a.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                        </div>
                    )}

                    {/* STEP 2: DETAILS */}
                    {step === 2 && (
                        <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Morning Collection"
                                    className="h-12 bg-gray-50 border-gray-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Description (Optional)</Label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Add any special instructions..."
                                    rows={2}
                                    className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-civic-green-500 text-sm resize-none dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <select
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 dark:text-white"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Critical</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Est. Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                        <Input
                                            value={formData.estimatedTime}
                                            onChange={e => setFormData({ ...formData, estimatedTime: e.target.value })}
                                            className="h-12 bg-gray-50 border-gray-100 pl-10"
                                            placeholder="e.g. 2h"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Assign Driver (Optional)</Label>
                                <select
                                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 dark:text-white"
                                    value={formData.assignedTo}
                                    onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                                >
                                    <option value="">Auto-Assign / Pending</option>
                                    {drivers.map((d: any) => (
                                        <option key={d._id} value={d._id}>
                                            {d.name} ({d.status === 'On Duty' ? '🟢' : '⚪'} {d.status})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label>Assign Vehicle (Optional)</Label>
                                <select
                                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-4 dark:text-white"
                                    value={formData.vehicleId}
                                    onChange={e => setFormData({ ...formData, vehicleId: e.target.value })}
                                >
                                    <option value="">No Vehicle Assigned</option>
                                    {availableVehicles.map((v: any) => (
                                        <option key={v._id} value={v._id}>
                                            {v.vehicleId} — {v.type} {v.licensePlate ? `(${v.licensePlate})` : ''}
                                            {v.status === 'Available' ? ' ✅' : v.status === 'Active' ? ' 🔵' : ' 🟡'}
                                        </option>
                                    ))}
                                </select>
                                {availableVehicles.length === 0 && (
                                    <p className="text-xs text-orange-500 font-medium">No vehicles available. Add vehicles in Fleet.</p>
                                )}
                            </div>
                        </div>
                    )}

                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                    {step === 2 && (
                        <Button type="button" variant="ghost" onClick={() => setStep(1)} className="flex-1">Back</Button>
                    )}
                    {step === 1 ? (
                        <Button
                            type="button"
                            onClick={() => {
                                if (!formData.zoneId) return;
                                setStep(2);
                            }}
                            disabled={!formData.zoneId || (scope === 'area' && !formData.targetAreaId)}
                            className="flex-1 bg-civic-dark text-white"
                        >
                            Next: Details
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} className="flex-1 bg-civic-green-600 hover:bg-civic-green-700 text-white">
                            {editingTask ? 'Save Changes' : 'Create Assignment'}
                        </Button>
                    )}
                </div>

            </div>
        </div>,
        document.body
    );
}
