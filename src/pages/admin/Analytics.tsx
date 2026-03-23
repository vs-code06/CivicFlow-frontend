import React from 'react';
import { Button } from '../../components/ui/button';
import { Calendar, Download, TrendingUp, Leaf, Truck, DollarSign, BarChart3, PieChart, ArrowUpRight } from 'lucide-react';

// Mock Data
const stats = [
    { label: 'Total Waste Collected', value: '8,420 t', change: '+12%', trend: 'up', icon: Truck, color: 'text-civic-dark', hoverBg: 'group-hover:bg-gray-500' },
    { label: 'Recycling Rate', value: '42%', change: '+5%', trend: 'up', icon: Leaf, color: 'text-civic-green-600', hoverBg: 'group-hover:bg-civic-green-500' },
    { label: 'Operational Cost', value: '$12.4k', change: '-2%', trend: 'down', icon: DollarSign, color: 'text-civic-orange-600', hoverBg: 'group-hover:bg-civic-orange-500' },
    { label: 'CO2 Emissions Saved', value: '1,240 t', change: '+8%', trend: 'up', icon: TrendingUp, color: 'text-civic-blue', hoverBg: 'group-hover:bg-blue-500' },
];

const wasteComposition = [
    { type: 'Organic', value: 45, color: 'bg-civic-green-500' },
    { type: 'Plastic', value: 30, color: 'bg-civic-orange-500' },
    { type: 'Paper', value: 15, color: 'bg-civic-blue' },
    { type: 'Metal/Glass', value: 10, color: 'bg-civic-dark' },
];

const zoneRanking = [
    { name: 'South Zone', efficiency: 98, color: 'bg-civic-green-600' },
    { name: 'East Zone', efficiency: 92, color: 'bg-civic-green-500' },
    { name: 'North Zone', efficiency: 85, color: 'bg-civic-yellow' },
    { name: 'West Zone', efficiency: 65, color: 'bg-civic-red' },
];

export function Analytics() {
    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-civic-dark dark:text-white">System Analytics</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Performance metrics and waste collection trends</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none h-9 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700">
                        <Calendar className="h-4 w-4 mr-2" /> Last 30 Days
                    </Button>
                    <Button className="flex-1 sm:flex-none h-9 bg-civic-dark dark:bg-white text-white dark:text-civic-dark hover:bg-black dark:hover:bg-gray-200">
                        <Download className="h-4 w-4 mr-2" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Hero KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
                {stats.map((stat, idx) => (
                    <div key={idx} className="p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ring-1 ring-transparent hover:ring-civic-muted dark:hover:ring-gray-700">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 ${stat.hoverBg} group-hover:text-white transition-colors ${stat.color} dark:text-gray-200`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg border ${stat.trend === 'up' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900'}`}>
                                {stat.change} <ArrowUpRight className={`h-3 w-3 ml-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                            </span>
                        </div>
                        <div className="text-4xl font-black text-civic-dark dark:text-white mb-1 tracking-tight">{stat.value}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2">

                {/* 1. Collection Trend (Large) */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-civic-dark dark:text-white flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-400" /> Collection Volume Trend
                        </h3>
                    </div>
                    {/* CSS Chart Mock */}
                    <div className="h-64 w-full relative pt-4">
                        <svg viewBox="0 0 400 150" className="w-full h-full overflow-visible">
                            {/* Grid Lines */}
                            <line x1="0" y1="0" x2="400" y2="0" stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
                            <line x1="0" y1="50" x2="400" y2="50" stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
                            <line x1="0" y1="100" x2="400" y2="100" stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />
                            <line x1="0" y1="150" x2="400" y2="150" stroke="#f3f4f6" strokeWidth="1" className="dark:stroke-gray-800" />

                            {/* Area Path */}
                            <path
                                d="M0,120 Q50,100 80,110 T150,70 T220,90 T300,40 T350,60 L400,20 V150 H0 Z"
                                fill="url(#gradient)"
                                className="opacity-20"
                            />
                            {/* Line Path */}
                            <path
                                d="M0,120 Q50,100 80,110 T150,70 T220,90 T300,40 T350,60 L400,20"
                                fill="none"
                                stroke="#166534"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* Gradient Def */}
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#166534" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>
                        </svg>
                        {/* X-Axis Labels */}
                        <div className="flex justify-between text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>
                </div>

                {/* 2. Operational Composition (Side) */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold text-civic-dark dark:text-white flex items-center gap-2 mb-6">
                        <PieChart className="h-5 w-5 text-gray-400" /> Waste Composition
                    </h3>

                    <div className="flex-1 flex flex-col justify-center gap-6">
                        {/* Donut Chart Mock (CSS conic-gradient) */}
                        <div className="relative h-48 w-48 mx-auto rounded-full" style={{
                            background: `conic-gradient(
                            #22c55e 0% 45%, 
                            #f97316 45% 75%, 
                            #3b82f6 75% 90%, 
                            #1f2937 90% 100%
                        )`}}>
                            <div className="absolute inset-4 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center flex-col">
                                <span className="text-3xl font-black text-civic-dark dark:text-white">8.4k</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Total Tons</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3">
                            {wasteComposition.map((item) => (
                                <div key={item.type} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                        <span className="font-bold text-gray-600 dark:text-gray-300">{item.type}</span>
                                    </div>
                                    <span className="font-mono font-medium text-gray-500 dark:text-gray-400">{item.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                {/* Zone Efficiency Ranking */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm">
                    <h3 className="text-lg font-bold text-civic-dark dark:text-white flex items-center gap-2 mb-6">
                        <TrendingUp className="h-5 w-5 text-gray-400" /> Zone Efficiency Leaderboard
                    </h3>
                    <div className="space-y-5">
                        {zoneRanking.map((zone, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="font-bold text-civic-dark dark:text-white">{idx + 1}. {zone.name}</span>
                                    <span className="font-mono font-bold text-gray-500 dark:text-gray-400">{zone.efficiency}%</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${zone.color}`}
                                        style={{ width: `${zone.efficiency}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Insights (Text) */}
                <div className="bg-gradient-to-br from-civic-dark to-black p-6 rounded-2xl shadow-md text-white">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                        <Leaf className="h-5 w-5 text-civic-green-500" /> AI Insights & Recommendations
                    </h3>
                    <div className="space-y-4">
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-sm font-medium leading-relaxed">
                                <span className="text-civic-green-400 font-bold">Optimization:</span> South Zone collection routes can be optimized by 12% by shifting pick-up times to 06:00 AM to avoid traffic congestion.
                            </p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-sm font-medium leading-relaxed">
                                <span className="text-civic-orange-400 font-bold">Alert:</span> Plastic waste volume in North Zone has increased by 15% this week. Consider deploying an additional recycling unit.
                            </p>
                        </div>
                        <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-sm font-medium leading-relaxed">
                                <span className="text-civic-blue font-bold">Maintenance:</span> Truck #04 and #09 are due for preventative maintenance based on mileage usage.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
