import React, { useState } from 'react';
import { Search, Recycle, Trash2, Zap, Leaf, Lightbulb, ChevronRight, AlertCircle } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../lib/utils';

type WasteType = 'Recycle' | 'Compost' | 'Hazardous' | 'Trash';

interface WasteItem {
    id: string;
    name: string;
    type: WasteType;
    category: string;
    steps: string[];
    tip: string;
}

export function ResEducationTab() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<WasteType | 'All'>('All');

    // Initial data
    const wasteItems: WasteItem[] = [
        {
            id: '1',
            name: 'Plastic Bottles',
            type: 'Recycle',
            category: 'Plastic',
            steps: ['Empty all liquid liquids.', 'Rinse lightly with water.', 'Keep the cap ON.', 'Place in Blue Bin.'],
            tip: 'Recycling just one plastic bottle saves enough energy to power a 60W light bulb for 6 hours!',
        },
        {
            id: '2',
            name: 'Pizza Boxes',
            type: 'Compost',
            category: 'Paper',
            steps: ['Remove any plastic dip cups.', 'If greasy/soiled, tear it up.', 'Place in Green Compost Bin.', 'Clean lids can be recycled.'],
            tip: 'Grease ruins the recycling process for paper, so always compost the dirty parts.',
        },
        {
            id: '3',
            name: 'Batteries',
            type: 'Hazardous',
            category: 'E-Waste',
            steps: ['Tape the terminals (ends).', 'Place in a clear plastic bag.', 'Drop off at designated e-waste center.', 'NEVER put in curb bins.'],
            tip: 'Batteries can start fires in garbage trucks if crushed. Always separate them.',
        },
        {
            id: '4',
            name: 'Glass Jars',
            type: 'Recycle',
            category: 'Glass',
            steps: ['Empty contents.', 'Rinse clean.', 'Remove lids (metal lids go separately).', 'Place in Blue Bin.'],
            tip: 'Glass can be recycled endlessly without losing quality or purity.',
        },
        {
            id: '5',
            name: 'Styrofoam',
            type: 'Trash',
            category: 'Plastic',
            steps: ['Check for local drop-off programs (rare).', 'Otherwise, bag it securely.', 'Place in Gray Trash Bin.'],
            tip: 'Styrofoam takes over 500 years to decompose. Try to avoid using it!',
        },
        {
            id: '6',
            name: 'Aluminum Cans',
            type: 'Recycle',
            category: 'Metal',
            steps: ['Empty completely.', 'Crush to save space (optional).', 'Place in Blue Bin.'],
            tip: 'Recycling aluminum saves 95% of the energy needed to make new aluminum from raw ore.',
        },
        {
            id: '7',
            name: 'Paint Cans',
            type: 'Hazardous',
            category: 'Chemical',
            steps: ['Do not throw in regular trash.', 'Dry out latex paint with kitty litter.', 'Oil-based paints must go to hazardous waste facility.'],
            tip: 'Leftover paint can often be donated to community centers or theater groups.',
        },
    ];

    const [selectedItemId, setSelectedItemId] = useState<string>(wasteItems[0].id);

    const filteredItems = wasteItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || item.type === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const selectedItem = wasteItems.find(item => item.id === selectedItemId) || wasteItems[0];

    const getTypeColor = (type: WasteType) => {
        switch (type) {
            case 'Recycle': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Compost': return 'text-green-600 bg-green-50 border-green-200';
            case 'Hazardous': return 'text-red-600 bg-red-50 border-red-200';
            case 'Trash': return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getTypeGradient = (type: WasteType) => {
        switch (type) {
            case 'Recycle': return 'from-blue-600 to-cyan-600';
            case 'Compost': return 'from-green-600 to-emerald-600';
            case 'Hazardous': return 'from-red-600 to-orange-600';
            case 'Trash': return 'from-gray-600 to-slate-600';
        }
    };

    const getDisposalVerb = (type: WasteType) => {
        if (type === 'Recycle') return 'Recycle';
        if (type === 'Compost') return 'Compost';
        if (type === 'Hazardous') return 'Handle';
        return 'Dispose of';
    };

    const getTypeIcon = (type: WasteType) => {
        switch (type) {
            case 'Recycle': return <Recycle className="h-5 w-5" />;
            case 'Compost': return <Leaf className="h-5 w-5" />;
            case 'Hazardous': return <Zap className="h-5 w-5" />;
            case 'Trash': return <Trash2 className="h-5 w-5" />;
        }
    }

    return (
        <div className="md:h-[calc(100vh-140px)] h-auto w-full max-w-7xl mx-auto flex flex-col gap-6 animate-in fade-in duration-500 overflow-y-auto md:overflow-hidden pb-6 p-2">

            {/* 1. GLOBAL HEADER (Search & Filters) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
                <div className="w-full md:w-auto relative group">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            className="pl-9 h-10 w-full md:w-[380px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500/50 focus:border-green-500 block transition-all shadow-sm"
                            placeholder="Search waste items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto p-2 no-scrollbar">
                    {['All', 'Recycle', 'Compost', 'Hazardous', 'Trash'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter as any)}
                            className={cn(
                                "px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap",
                                activeFilter === filter
                                    ? "bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white shadow-md transform scale-105"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                            )}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2. MAIN CONTENT SPLIT */}
            <div className="flex-1 flex flex-col lg:flex-row gap-8 md:overflow-hidden">

                {/* LEFT: FLOATING LIST (No Container) */}
                <div className="w-full md:w-[340px] flex flex-col flex-shrink-0 overflow-y-auto px-2 custom-scrollbar space-y-3 pb-2">
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-sm">No items found.</p>
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                className={cn(
                                    "w-full text-left p-4 rounded-2xl transition-all duration-200 flex items-center justify-between group relative overflow-hidden",
                                    selectedItem?.id === item.id
                                        ? "bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 scale-[1.02]"
                                        : "bg-transparent hover:bg-white/50 dark:hover:bg-gray-800/50 border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
                                )}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={cn("p-2.5 rounded-xl shrink-0 transition-colors shadow-sm",
                                        item.type === 'Recycle' ? 'bg-blue-50 text-blue-600' :
                                            item.type === 'Compost' ? 'bg-green-50 text-green-600' :
                                                item.type === 'Hazardous' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'
                                    )}>
                                        {getTypeIcon(item.type)}
                                    </div>
                                    <div>
                                        <h4 className={cn("font-bold text-base", selectedItem?.id === item.id ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-300")}>
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-gray-400 font-medium tracking-wide">{item.category}</p>
                                    </div>
                                </div>
                                {selectedItem?.id === item.id && <ChevronRight className="h-5 w-5 text-gray-400" />}
                            </button>
                        ))
                    )}
                </div>

                {/* RIGHT: DETAIL PANEL */}
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden flex flex-col relative h-full">

                    {selectedItem ? (
                        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                            {/* Dynamic Background Gradient */}
                            <div className={cn("absolute top-0 right-0 w-[800px] h-[600px] rounded-full blur-[100px] opacity-[0.15] pointer-events-none bg-gradient-to-br", getTypeGradient(selectedItem.type))}></div>

                            {/* Hero Header */}
                            <div className="p-10 pb-6 relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <Badge variant="outline" className={cn("text-xs font-bold uppercase tracking-wider px-3 py-1.5 shadow-sm border", getTypeColor(selectedItem.type))}>
                                        {selectedItem.type} Guideline
                                    </Badge>
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                        {selectedItem.category}
                                    </span>
                                </div>

                                <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-2 leading-[1.1] tracking-tight">
                                    How to {getDisposalVerb(selectedItem.type).toLowerCase()}<br />
                                    <span className={cn("text-transparent bg-clip-text bg-gradient-to-r", getTypeGradient(selectedItem.type))}>
                                        {selectedItem.name}
                                    </span>
                                </h2>
                            </div>

                            {/* Content Grid */}
                            <div className="p-10 grid xl:grid-cols-3 gap-10 relative z-10 pt-4">

                                {/* Steps Column (2/3) */}
                                <div className="xl:col-span-2 space-y-10">
                                    <div className="bg-white/50 dark:bg-gray-900/50 rounded-[2rem] p-0">
                                        <h3 className="font-bold text-xl mb-8 flex items-center gap-3 text-gray-900 dark:text-white">
                                            <div className={cn("h-8 w-1.5 rounded-full bg-gradient-to-b", getTypeGradient(selectedItem.type))}></div>
                                            Disposal Steps
                                        </h3>

                                        <div className="space-y-8 relative pl-3">
                                            {/* Timeline Line */}
                                            <div className="absolute left-[23px] top-6 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-700"></div>

                                            {selectedItem.steps.map((step, idx) => (
                                                <div key={idx} className="relative flex gap-8 group">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-2xl border-[4px] border-white dark:border-gray-800 flex items-center justify-center shrink-0 z-10 shadow-lg transition-transform group-hover:scale-110",
                                                        idx === 0 ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-white text-gray-400 dark:bg-gray-900"
                                                    )}>
                                                        <span className="text-lg font-bold">{idx + 1}</span>
                                                    </div>
                                                    <div className="pt-2">
                                                        <p className="font-medium text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                                                            {step}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar Column (1/3) */}
                                <div className="space-y-6">
                                    {/* Impact Card */}
                                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-[2rem] p-8 border border-amber-100/50 dark:border-amber-800/30 relative overflow-hidden group">
                                        <div className="absolute -right-6 -top-6 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
                                            <Lightbulb className="w-32 h-32 rotate-12" />
                                        </div>
                                        <h4 className="relative flex items-center gap-2 font-bold text-amber-900 dark:text-amber-100 mb-4 text-lg">
                                            <Lightbulb className="h-5 w-5 text-amber-500" />
                                            Did you know?
                                        </h4>
                                        <p className="relative text-amber-900/80 dark:text-amber-100/80 leading-relaxed font-medium">
                                            "{selectedItem.tip}"
                                        </p>
                                    </div>

                                    {/* Rules Card */}
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800">
                                        <h4 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-6 text-xs uppercase tracking-widest">
                                            <AlertCircle className="h-4 w-4" />
                                            Details
                                        </h4>
                                        <ul className="space-y-4">
                                            <div className="flex justify-between text-sm py-2 border-b border-gray-200 dark:border-gray-700">
                                                <span className="text-gray-500 font-medium">Category</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{selectedItem.category}</span>
                                            </div>
                                            <div className="flex justify-between text-sm py-2 border-b border-gray-200 dark:border-gray-700">
                                                <span className="text-gray-500 font-medium">Classification</span>
                                                <span className={cn("font-bold px-2 py-0.5 rounded text-xs uppercase", getTypeColor(selectedItem.type))}>{selectedItem.type}</span>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/30">
                            <div className="h-24 w-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                <Search className="h-10 w-10 opacity-20" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Usage Guide</h3>
                            <p className="max-w-xs mx-auto mt-3 text-gray-500">Select an item from the left to view detailed disposal instructions.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
