import React, { useState } from 'react';
import { PageTransition } from '../../../components/ui/page-transition';
import { Bell, Shield, Moon, Sun, Monitor, Wifi, Truck, ChevronRight, Volume2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';


// Simple Toggle Switch Component if not available
function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-civic-green-500 focus:ring-offset-2",
                enabled ? "bg-civic-green-500" : "bg-gray-200 dark:bg-gray-700"
            )}
        >
            <span
                className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    enabled ? "translate-x-6" : "translate-x-1"
                )}
            />
        </button>
    );
}

export function SettingsTab() {
    const { theme, setTheme } = useTheme();
    const [notifications, setNotifications] = useState({
        push: true,
        email: false,
        sms: true
    });
    const [offlineMode, setOfflineMode] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    return (
        <PageTransition>
            <div className="p-4 pt-4 pb-24 w-full max-w-5xl mx-auto">
                <h1 className="text-3xl font-black text-civic-dark dark:text-white mb-6">Settings</h1>

                <div className="space-y-8">
                    {/* APPEARANCE SECTION */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-1">Appearance</h3>
                        <div className="bg-white dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex">
                            {[
                                { label: 'Light', value: 'light', icon: Sun },
                                { label: 'Dark', value: 'dark', icon: Moon },
                                { label: 'System', value: 'system', icon: Monitor }
                            ].map((mode) => (
                                <button
                                    key={mode.value}
                                    onClick={() => setTheme(mode.value as any)}
                                    className={cn(
                                        "flex-1 flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-200",
                                        theme === mode.value
                                            ? "bg-civic-dark text-white shadow-md"
                                            : "text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-500"
                                    )}
                                >
                                    <mode.icon className={cn("h-6 w-6 mb-2", theme === mode.value ? "text-civic-green-400" : "currentColor")} />
                                    <span className="text-xs font-bold uppercase tracking-wider">{mode.label}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* NOTIFICATIONS SECTION */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-1">Notifications</h3>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center">
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-civic-dark dark:text-white">Push Notifications</p>
                                        <p className="text-xs text-gray-400 font-medium">Route updates & alerts</p>
                                    </div>
                                </div>
                                <Toggle enabled={notifications.push} onChange={(v) => setNotifications({ ...notifications, push: v })} />
                            </div>
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-full flex items-center justify-center">
                                        <Volume2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-civic-dark dark:text-white">Sound Effects</p>
                                        <p className="text-xs text-gray-400 font-medium">In-app interactions</p>
                                    </div>
                                </div>
                                <Toggle enabled={soundEnabled} onChange={setSoundEnabled} />
                            </div>
                        </div>
                    </section>

                    {/* APP PREFERENCES */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-1">App Preferences</h3>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-orange-50 dark:bg-orange-900/20 text-civic-orange-500 rounded-full flex items-center justify-center">
                                        <Wifi className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-civic-dark dark:text-white">Offline Mode</p>
                                        <p className="text-xs text-gray-400 font-medium">Download routes for low signal areas</p>
                                    </div>
                                </div>
                                <Toggle enabled={offlineMode} onChange={setOfflineMode} />
                            </div>
                            <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-full flex items-center justify-center">
                                        <Truck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-civic-dark dark:text-white">Default Vehicle</p>
                                        <p className="text-xs text-gray-400 font-medium">TRUCK-101 (Rear Loader)</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300" />
                            </div>
                        </div>
                    </section>

                    {/* SECURITY */}
                    <section>
                        <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-1">Security</h3>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <button className="w-full p-4 flex items-center justify-between group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-civic-dark dark:text-white">Privacy & Security</p>
                                        <p className="text-xs text-gray-400 font-medium">Password, Biometrics</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-300" />
                            </button>
                        </div>
                    </section>

                    <div className="pt-4 text-center">
                        <p className="text-xs font-bold text-gray-300 dark:text-gray-700">App Version 2.4.0 (Build 892)</p>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}
