import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { ArrowLeft, Trees, Home, Building2, Store, Map, AlertTriangle, CheckCircle2, Clock, Calendar, Plus, Loader2, Trash2, Recycle, Leaf, Package, Save } from 'lucide-react';
import { getZoneById, addAreaToZone, updateZoneSchedule, Zone } from '../../api/zones';

const AreaIcon = ({ type, className }: { type: string[] | string, className?: string }) => {
    const mainType = Array.isArray(type) ? type[0] : type;
    switch (mainType) {
        case 'park': return <Trees className={className} />;
        case 'residential': return <Home className={className} />;
        case 'commercial': return <Building2 className={className} />;
        case 'market': return <Store className={className} />;
        case 'industrial': return <Building2 className={className} />;
        default: return <Map className={className} />;
    }
};

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WASTE_TYPES = [
    { id: 'trash', label: 'General Waste', icon: Trash2, color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
    { id: 'recycle', label: 'Recycling', icon: Recycle, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
    { id: 'compost', label: 'Green Waste', icon: Leaf, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
    { id: 'bulk', label: 'Bulk Pickup', icon: Package, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20' },
];

interface ScheduleEntry {
    day: string;
    types: string[];
    startTime: string;
    endTime: string;
}

export function ZoneDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [zoneData, setZoneData] = React.useState<Zone | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [isAddAreaOpen, setIsAddAreaOpen] = React.useState(false);
    const [newArea, setNewArea] = React.useState({ name: '', type: 'residential', cleanlinessScore: 100 });

    // Schedule state
    const [schedule, setSchedule] = React.useState<ScheduleEntry[]>([]);
    const [savingSchedule, setSavingSchedule] = React.useState(false);
    const [scheduleChanged, setScheduleChanged] = React.useState(false);

    const fetchZone = React.useCallback(async () => {
        if (!id) return;
        try {
            const data = await getZoneById(id);
            setZoneData(data);
            setSchedule(data.schedule || []);
        } catch (error) {
            console.error("Failed to fetch zone details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => { fetchZone(); }, [fetchZone]);

    const handleAddArea = async () => {
        if (!id || !newArea.name) return;
        try {
            await addAreaToZone(id, { name: newArea.name, type: [newArea.type], status: 'good', cleanlinessScore: newArea.cleanlinessScore, issues: 0 });
            fetchZone();
            setIsAddAreaOpen(false);
            setNewArea({ name: '', type: 'residential', cleanlinessScore: 100 });
        } catch (error) { console.error("Failed to add area:", error); }
    };

    // Schedule helpers
    const toggleDay = (day: string) => {
        setScheduleChanged(true);
        const exists = schedule.find(s => s.day === day);
        if (exists) {
            setSchedule(schedule.filter(s => s.day !== day));
        } else {
            setSchedule([...schedule, { day, types: ['trash'], startTime: '08:00', endTime: '16:00' }]);
        }
    };

    const toggleType = (day: string, type: string) => {
        setScheduleChanged(true);
        setSchedule(schedule.map(s => {
            if (s.day !== day) return s;
            const hasType = s.types.includes(type);
            const newTypes = hasType ? s.types.filter(t => t !== type) : [...s.types, type];
            return { ...s, types: newTypes.length > 0 ? newTypes : [type] };
        }));
    };

    const updateTime = (day: string, field: 'startTime' | 'endTime', value: string) => {
        setScheduleChanged(true);
        setSchedule(schedule.map(s => s.day === day ? { ...s, [field]: value } : s));
    };

    const handleSaveSchedule = async () => {
        if (!id) return;
        setSavingSchedule(true);
        try {
            await updateZoneSchedule(id, schedule);
            setScheduleChanged(false);
            fetchZone();
        } catch (error) { console.error("Failed to save schedule:", error); }
        finally { setSavingSchedule(false); }
    };

    if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-gray-400" /></div>;
    if (!zoneData) return <div className="p-8 text-center">Zone not found</div>;

    return (
        <div className="max-w-[1600px] mx-auto pb-12 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 px-2">
                <Button variant="ghost" size="icon" onClick={() => navigate('/zones')} className="rounded-full hover:bg-white dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                    <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Button>
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-extrabold text-civic-dark dark:text-white tracking-tight">{zoneData.name} Report</h1>
                        {zoneData.status === 'Attention' && <span className="text-[10px] font-bold bg-civic-yellow/10 text-civic-yellow px-2 py-0.5 rounded uppercase tracking-wider border border-civic-yellow/20">Attention Required</span>}
                        {zoneData.status === 'Critical' && <span className="text-[10px] font-bold bg-civic-red/10 text-civic-red px-2 py-0.5 rounded uppercase tracking-wider border border-civic-red/20">Critical Status</span>}
                        {zoneData.status === 'Good' && <span className="text-[10px] font-bold bg-civic-green-50 text-civic-green-600 px-2 py-0.5 rounded uppercase tracking-wider border border-civic-green-100">Optimal</span>}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Zone ID: {zoneData._id} • Managed by {zoneData.manager}</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <Button onClick={() => setIsAddAreaOpen(true)} className="h-9 text-xs font-bold bg-civic-green-600 hover:bg-civic-green-700 text-white shadow-md shadow-civic-green-200/50">
                        <Plus className="h-4 w-4 mr-2" /> Add Area
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-civic-muted dark:border-gray-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-2">Efficiency Score</span>
                    <div className={`text-4xl font-black ${zoneData.score < 60 ? 'text-civic-red' : zoneData.score <= 90 ? 'text-civic-yellow' : 'text-civic-green-600'}`}>{zoneData.score}%</div>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-civic-muted dark:border-gray-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-2">Active Issues</span>
                    <div className="flex items-end gap-3">
                        <div className={`text-4xl font-black ${zoneData.issues > 0 ? 'text-civic-orange-500' : 'text-civic-dark dark:text-white'}`}>{zoneData.issues}</div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1.5">Open Tickets</span>
                    </div>
                </div>
                <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-civic-muted dark:border-gray-800 shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-2">Coverage</span>
                    <div className="flex items-end gap-3">
                        <div className="text-4xl font-black text-civic-dark dark:text-white">{zoneData.coverage}%</div>
                        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-1.5">Area Serviced</span>
                    </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-civic-green-500 to-civic-green-600 rounded-2xl shadow-md text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="text-[10px] font-bold text-green-100 uppercase tracking-widest block mb-2">Actions</span>
                        <div className="space-y-2">
                            <Button onClick={() => navigate(`/tasks?search=${encodeURIComponent(zoneData.name)}`)} variant="ghost" className="w-full justify-start h-8 text-xs font-bold bg-white/20 hover:bg-white/30 text-white border-none">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> View Active Tasks
                            </Button>
                            <Button onClick={() => navigate(`/complaints?search=${encodeURIComponent(zoneData.name)}`)} variant="ghost" className="w-full justify-start h-8 text-xs font-bold bg-white/20 hover:bg-white/30 text-white border-none">
                                <AlertTriangle className="h-3.5 w-3.5 mr-2" /> View Complaints
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ COLLECTION SCHEDULE EDITOR ═══ */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-civic-dark dark:text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" /> Collection Schedule
                    </h2>
                    {scheduleChanged && (
                        <Button onClick={handleSaveSchedule} disabled={savingSchedule} className="h-9 text-xs font-bold bg-civic-green-600 hover:bg-civic-green-700 text-white shadow-md">
                            {savingSchedule ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Schedule
                        </Button>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-civic-muted dark:border-gray-800 shadow-sm overflow-hidden">
                    {/* Day Selector Row */}
                    <div className="grid grid-cols-7 gap-0 border-b border-gray-100 dark:border-gray-800">
                        {ALL_DAYS.map(day => {
                            const isActive = schedule.some(s => s.day === day);
                            return (
                                <button key={day} onClick={() => toggleDay(day)}
                                    className={`py-4 text-center transition-all border-r last:border-r-0 border-gray-100 dark:border-gray-800 ${isActive ? 'bg-civic-green-50 dark:bg-civic-green-900/20 text-civic-green-700 dark:text-civic-green-400' : 'bg-transparent text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                                    <div className="text-[10px] font-bold uppercase tracking-wider">{day.substring(0, 3)}</div>
                                    <div className={`h-3 w-3 rounded-full mx-auto mt-2 ${isActive ? 'bg-civic-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                </button>
                            );
                        })}
                    </div>

                    {/* Per-Day Details */}
                    {schedule.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {ALL_DAYS.filter(d => schedule.some(s => s.day === d)).map(day => {
                                const entry = schedule.find(s => s.day === day)!;
                                return (
                                    <div key={day} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="w-24 shrink-0">
                                            <span className="text-sm font-bold text-civic-dark dark:text-white">{day}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 flex-1">
                                            {WASTE_TYPES.map(wt => {
                                                const isSelected = entry.types.includes(wt.id);
                                                const Icon = wt.icon;
                                                return (
                                                    <button key={wt.id} onClick={() => toggleType(day, wt.id)}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${isSelected ? `${wt.color} border-current` : 'bg-transparent text-gray-300 dark:text-gray-600 border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                                                        <Icon className="h-3.5 w-3.5" /> {wt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <input type="time" value={entry.startTime} onChange={(e) => updateTime(day, 'startTime', e.target.value)}
                                                className="h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 text-xs font-bold text-gray-700 dark:text-gray-300" />
                                            <span className="text-xs text-gray-400">to</span>
                                            <input type="time" value={entry.endTime} onChange={(e) => updateTime(day, 'endTime', e.target.value)}
                                                className="h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 text-xs font-bold text-gray-700 dark:text-gray-300" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <Calendar className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No days selected</p>
                            <p className="text-xs text-gray-400 mt-1">Click on a day above to add it to the collection schedule</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Area Breakdown */}
            <div className="px-2">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-civic-dark dark:text-white flex items-center gap-2">
                        <Map className="h-5 w-5 text-gray-400" /> Area Breakdown
                    </h2>
                </div>

                {zoneData.areas.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {zoneData.areas.map((area, idx) => (
                            <div key={idx} className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-civic-muted dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                <div className="p-5 border-b border-gray-50 dark:border-gray-800 flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${(Array.isArray(area.type) ? area.type[0] : area.type) === 'park' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                            <AreaIcon type={area.type} className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-civic-dark dark:text-white leading-tight">{area.name}</h3>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{Array.isArray(area.type) ? area.type.join(', ') : area.type}</span>
                                        </div>
                                    </div>
                                    <span className={`h-2.5 w-2.5 rounded-full mt-1 ${area.status === 'good' ? 'bg-civic-green-500' : area.status === 'attention' ? 'bg-civic-yellow' : 'bg-civic-red'}`} />
                                </div>
                                <div className="p-5 flex-1">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cleanliness</span>
                                                <span className={`text-sm font-black ${area.cleanlinessScore < 80 ? 'text-civic-yellow' : 'text-civic-dark dark:text-white'}`}>{area.cleanlinessScore}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${area.cleanlinessScore < 80 ? 'bg-civic-yellow' : 'bg-civic-green-500'}`} style={{ width: `${area.cleanlinessScore}%` }} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Last Service</span>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                    <Clock className="h-3.5 w-3.5 text-gray-400" /> {area.lastVisit || 'Never'}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Next Pickup</span>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400">
                                                    <Calendar className="h-3.5 w-3.5 text-gray-400" /> {area.nextPickup || 'Pending'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl flex border-t border-gray-100 dark:border-gray-800">
                                    {area.issues > 0 ? (
                                        <div className="flex items-center gap-2 text-xs font-bold text-civic-orange-600 dark:text-civic-orange-500 w-full justify-center">
                                            <AlertTriangle className="h-3.5 w-3.5" /> {area.issues} Issues Reported
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 w-full justify-center">
                                            <CheckCircle2 className="h-3.5 w-3.5" /> No Active Issues
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 rounded-3xl">
                        <Map className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Areas Defined</h3>
                        <p className="text-gray-500 text-sm mb-6">This zone does not have any sub-areas monitored yet.</p>
                        <Button onClick={() => setIsAddAreaOpen(true)} variant="outline" className="border-civic-green-600 text-civic-green-600 hover:bg-civic-green-50">Add First Area</Button>
                    </div>
                )}
            </div>

            {/* ADD AREA DIALOG */}
            <Dialog isOpen={isAddAreaOpen} onClose={() => setIsAddAreaOpen(false)} title="Add New Area" description={`Add a sub-area to ${zoneData.name} for monitoring.`}>
                <div className="space-y-4 mt-4">
                    <div className="space-y-1">
                        <Label>Area Name</Label>
                        <Input value={newArea.name} onChange={(e) => setNewArea({ ...newArea, name: e.target.value })} placeholder="e.g. North Park Plaza" className="bg-gray-50 dark:bg-gray-800" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label>Area Type</Label>
                            <select value={newArea.type} onChange={(e) => setNewArea({ ...newArea, type: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-civic-green-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                <option value="park">Park</option>
                                <option value="residential">Residential</option>
                                <option value="commercial">Commercial</option>
                                <option value="market">Market</option>
                                <option value="industrial">Industrial</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label>Initial Score</Label>
                            <Input type="number" min="0" max="100" value={newArea.cleanlinessScore} onChange={(e) => setNewArea({ ...newArea, cleanlinessScore: parseInt(e.target.value) || 0 })} className="bg-gray-50 dark:bg-gray-800" />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsAddAreaOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddArea} disabled={!newArea.name} className="bg-civic-green-600 hover:bg-civic-green-700 text-white">Add Area</Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
