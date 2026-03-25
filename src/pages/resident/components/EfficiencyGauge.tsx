import React from 'react';
import { cn } from '../../../lib/utils';
import { Leaf, Award, AlertTriangle } from 'lucide-react';

interface EfficiencyGaugeProps {
    score: number;
    metrics?: {
        totalCollections: number;
        perfectCollections: number;
        contaminatedCollections: number;
        blockedCollections: number;
        missedCollections: number;
    };
    loading?: boolean;
}

export function EfficiencyGauge({ score, metrics }: EfficiencyGaugeProps) {
    // SVG Config

    const strokeWidth = 15;
    const radius = 60; // (size - strokeWidth * 2) / 2 approx but fixed for simplicity
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - ((score || 0) / 100) * circumference;

    // Color Logic
    const getColor = (s: number) => {
        if (s >= 90) return 'text-green-500';
        if (s >= 70) return 'text-blue-500';
        if (s >= 50) return 'text-amber-500';
        return 'text-red-500';
    };

    const getStatusText = (s: number) => {
        if (s >= 90) return { title: 'Gold Standard', subtitle: 'Excellent Sorting!', icon: Award };
        if (s >= 70) return { title: 'Eco-Friendly', subtitle: 'Good Participation', icon: Leaf };
        if (s >= 50) return { title: 'Needs Focus', subtitle: 'Watch Contamination', icon: AlertTriangle };
        return { title: 'Critical', subtitle: 'Action Required', icon: AlertTriangle };
    };

    const statusObj = getStatusText(score);
    const StatusIcon = statusObj.icon;
    const colorClass = getColor(score);

    return (
        <div className="flex flex-col items-center justify-center relative p-6 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">

            <div className="relative h-48 w-48 flex items-center justify-center">
                {/* SVG Circle */}
                <svg className="transform -rotate-90 w-full h-full">
                    {/* Background Track */}
                    <circle
                        className="text-gray-100 dark:text-gray-700"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50%"
                        cy="50%"
                    />
                    {/* Progress Circle */}
                    <circle
                        className={cn("transition-all duration-1000 ease-out drop-shadow-lg", colorClass)}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50%"
                        cy="50%"
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className={cn("text-4xl font-black", colorClass)}>{score}%</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Efficiency</span>
                </div>
            </div>

            {/* Labels */}
            <div className="mt-[-20px] text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <StatusIcon className={cn("h-5 w-5", colorClass)} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{statusObj.title}</h3>
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{statusObj.subtitle}</p>
            </div>

            {/* Mini Metrics if available */}
            {metrics && (
                <div className="grid grid-cols-3 gap-2 mt-6 w-full">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg text-center border border-green-100 dark:border-green-900/30">
                        <div className="text-lg text-green-600 font-bold">{metrics.perfectCollections}</div>
                        <div className="text-[10px] text-green-600/70 uppercase font-bold tracking-wide">Perfect</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center border border-amber-100 dark:border-amber-900/30">
                        <div className="text-lg text-amber-600 font-bold">{metrics.contaminatedCollections}</div>
                        <div className="text-[10px] text-amber-600/70 uppercase font-bold tracking-wide">Dirty</div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded-lg text-center border border-red-100 dark:border-red-900/30">
                        <div className="text-lg text-red-600 font-bold">{metrics.blockedCollections + metrics.missedCollections}</div>
                        <div className="text-[10px] text-red-600/70 uppercase font-bold tracking-wide">Issues</div>
                    </div>
                </div>
            )}
        </div>
    );
}
