import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trees, Home, Building2, Store, Map, Plus, CheckCircle2, AlertTriangle, ChevronDown, BarChart3, Clock, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Dialog } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { getZones, createZone, Zone, ZoneArea } from '../../api/zones';

// Helper to determine icon based on area type
const AreaIcon = ({ type, className }: { type: string[] | string, className?: string }) => {
    // If array, take the first type for icon selection, or strictly check
    const mainType = Array.isArray(type) ? type[0] : type;

    switch (mainType) {
        case 'park': return <Trees className={className} />;
        case 'residential': return <Home className={className} />;
        case 'commercial': return <Building2 className={className} />;
        case 'market': return <Store className={className} />;
        case 'industrial': return <Building2 className={className} />; // Reuse building for industrial or add specific
        default: return <Map className={className} />;
    }
};

export function Zones() {
    const navigate = useNavigate();
    const [expandedZoneId, setExpandedZoneId] = useState<string | null>(null);
    const [zones, setZones] = useState<Zone[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newZoneName, setNewZoneName] = useState('');

    useEffect(() => {
        const fetchZones = async () => {
            try {
                const data = await getZones();
                setZones(data);
            } catch (error) {
                console.error("Failed to fetch zones:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchZones();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedZoneId(expandedZoneId === id ? null : id);
    };

    const handleAddZone = async () => {
        if (!newZoneName.trim()) return;

        try {
            const newZone = await createZone({ name: newZoneName });
            setZones([newZone, ...zones]);
            setNewZoneName('');
            setIsAddOpen(false);
        } catch (error) {
            console.error("Failed to create zone:", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
    }

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-civic-dark dark:text-white">Zones Overview</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Detailed sector analysis and sub-area monitoring</p>
                </div>

                <Button
                    onClick={() => setIsAddOpen(true)}
                    className="bg-civic-green-600 hover:bg-civic-green-700 text-white font-bold shadow-sm rounded-lg"
                >
                    <Plus className="h-4 w-4 mr-2" /> Add Zone
                </Button>
            </div>

            <div className="flex flex-col gap-4 px-2">
                {zones.map((zone: Zone) => {
                    const isExpanded = expandedZoneId === zone._id;

                    return (
                        <div
                            key={zone._id}
                            className={`group relative overflow-hidden bg-white dark:bg-gray-900 rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md hover:scale-[1.005]
                                ${isExpanded ? 'border-civic-green-200 dark:border-civic-green-900 ring-4 ring-civic-green-50 dark:ring-civic-green-900/20' : 'border-civic-muted dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'}`}
                        >
                            {/* Status Stripe */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                                ${zone.status === 'Good' ? 'bg-civic-green-500' :
                                    zone.status === 'Attention' ? 'bg-civic-yellow' : 'bg-civic-red'}`}>
                            </div>

                            {/* SUMMARY ROW (Clickable) */}
                            <div
                                onClick={() => toggleExpand(zone._id)}
                                className="flex flex-col xl:flex-row xl:items-center p-4 pl-5 gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                                {/* 1. Zone Info */}
                                <div className="flex-shrink-0 lg:w-64">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-base font-bold text-civic-dark dark:text-white tracking-tight">{zone.name}</h3>
                                        {zone.status === 'Good' && <span className="text-[10px] font-bold bg-civic-green-50 dark:bg-civic-green-900/20 text-civic-green-600 dark:text-civic-green-400 px-2 py-0.5 rounded uppercase">Good</span>}
                                        {zone.status === 'Attention' && <span className="text-[10px] font-bold bg-civic-yellow/10 text-civic-yellow px-2 py-0.5 rounded uppercase">Attention</span>}
                                        {zone.status === 'Critical' && <span className="text-[10px] font-bold bg-civic-red/10 text-civic-red px-2 py-0.5 rounded uppercase">Critical</span>}
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">ID: {zone._id}</span>
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{zone.areas.length} Areas </span>
                                    </div>
                                </div>

                                {/* 2. Metrics */}
                                <div className="flex items-center gap-6 lg:border-l lg:border-r border-gray-100 dark:border-gray-800 lg:px-6">
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">Score</div>
                                        <div className={`text-xl font-black ${zone.score < 60 ? 'text-civic-red' : zone.score <= 90 ? 'text-civic-yellow' : 'text-civic-green-600 dark:text-civic-green-400'}`}>
                                            {zone.score}%
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                            <CheckCircle2 className="h-3 w-3 text-civic-green-600 dark:text-civic-green-400" />
                                            <span>{zone.tasks} Routes Active</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500 dark:text-gray-400">
                                            <AlertTriangle className={`h-3 w-3 ${zone.issues > 0 ? 'text-civic-orange-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                            <span className={zone.issues > 0 ? 'text-civic-orange-600 dark:text-civic-orange-500' : ''}>{zone.issues} Issues Reported</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Preview (only visible when collapsed) */}
                                {!isExpanded && (
                                    <div className="flex-1 min-w-0 hidden xl:block">
                                        <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">Key Areas</div>
                                        <div className="flex gap-2 opacity-60">
                                            {zone.areas.slice(0, 3).map((area: ZoneArea, idx: number) => (
                                                <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold text-gray-500 dark:text-gray-400">
                                                    <AreaIcon type={area.type} className="h-3 w-3" /> {area.name}
                                                </div>
                                            ))}
                                            {zone.areas.length > 3 && <span className="text-xs text-gray-400 dark:text-gray-500">+{zone.areas.length - 3}</span>}
                                            {zone.areas.length === 0 && <span className="text-xs text-gray-300 italic">No areas yet</span>}
                                        </div>
                                    </div>
                                )}

                                {/* 4. Action Icon */}
                                <div className="flex-shrink-0 ml-auto flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            navigate(`/zones/${zone._id}`);
                                        }}
                                        className="hidden sm:flex h-8 text-xs font-bold text-gray-500 hover:text-civic-dark dark:text-gray-400 dark:hover:text-white uppercase tracking-widest bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                    >
                                        View Full Report
                                    </Button>
                                    <Button variant="ghost" size="icon" className={`text-gray-400 hover:text-civic-dark dark:hover:text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* EXPANDED AREA DETAILS */}
                            {/* EXPANDED AREA DETAILS */}
                            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                <div className="overflow-hidden">
                                    <div className={`border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 p-6 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <Map className="h-4 w-4" /> Area Breakdown
                                            </h4>
                                            {zone.areas.length > 3 && (
                                                <span className="text-[10px] font-medium text-gray-400 italic">Showing 3 of {zone.areas.length} areas. View full report for details.</span>
                                            )}
                                        </div>

                                        {zone.areas.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {zone.areas.slice(0, 3).map((area: ZoneArea, idx: number) => (
                                                    <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 shadow-sm hover:shadow-md transition-all group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-1.5 rounded-lg ${(Array.isArray(area.type) ? area.type[0] : area.type) === 'park' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                                                    <AreaIcon type={area.type} className="h-3.5 w-3.5" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-civic-dark dark:text-white leading-none">{area.name}</p>
                                                                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{Array.isArray(area.type) ? area.type.join(', ') : area.type}</p>
                                                                </div>
                                                            </div>
                                                            <span className={`h-1.5 w-1.5 rounded-full mt-1
                                                                ${area.status === 'good' ? 'bg-civic-green-500' :
                                                                    area.status === 'attention' ? 'bg-civic-yellow' : 'bg-civic-red'}`}>
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-50 dark:border-gray-800">
                                                            <div>
                                                                <span className="text-[9px] text-gray-400 font-bold uppercase block mb-0.5">Cleanliness</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <BarChart3 className="h-3 w-3 text-gray-400" />
                                                                    <span className={`text-xs font-bold ${area.cleanlinessScore < 80 ? 'text-civic-yellow' : 'text-civic-dark dark:text-white'}`}>{area.cleanlinessScore}%</span>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="text-[9px] text-gray-400 font-bold uppercase block mb-0.5">Pick up Stats</span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <Clock className="h-3 w-3 text-gray-400" />
                                                                    <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">{area.lastVisit}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                                                <p className="text-sm text-gray-500 font-medium">No areas allocated to this zone yet.</p>
                                                <Button variant="link" className="text-civic-green-600 font-bold text-xs mt-1">
                                                    Assign New Area
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Dialog
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Create New Zone"
                description="Define a new operational sector for waste management."
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="zoneName">Zone Name</Label>
                        <Input
                            id="zoneName"
                            placeholder="e.g. Central Business District"
                            value={newZoneName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewZoneName(e.target.value)}
                            className="bg-gray-50 dark:bg-gray-800"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="lat">Latitude</Label>
                            <Input
                                id="lat"
                                type="number"
                                placeholder="26.9..."
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lng">Longitude</Label>
                            <Input
                                id="lng"
                                type="number"
                                placeholder="75.7..."
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddZone} disabled={!newZoneName} className="bg-civic-green-600 text-white">
                            Create Zone
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
