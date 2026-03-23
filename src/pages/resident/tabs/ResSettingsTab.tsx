import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { User, Bell, Shield, Save, Mail, Lock, Moon, Sun, Monitor, MapPin, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { cn } from '../../../lib/utils';

export function ResSettingsTab() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Monitor },
    ];

    return (
        <div className="max-w-[1600px] mx-auto pb-12 w-full">


            <div className="flex flex-col lg:flex-row gap-8 px-2">
                {/* Sidebar Navigation - Sticky on Mobile */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 border lg:border-none",
                                    activeTab === tab.id
                                        ? "bg-gray-900 dark:bg-gray-800 text-white shadow-md border-gray-900 dark:border-gray-700"
                                        : "bg-white dark:bg-gray-900 lg:bg-transparent border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                )}
                            >
                                <tab.icon className={cn(
                                    "h-4 w-4",
                                    activeTab === tab.id ? "text-green-500" : "text-gray-400 dark:text-gray-500"
                                )} />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Panel */}
                <div className="flex-1 max-w-4xl">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 sm:p-8 min-h-[600px]">

                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Profile Information</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your photo and personal details.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="h-24 w-24 rounded-full bg-gray-900 dark:bg-gray-800 flex items-center justify-center text-3xl text-white font-bold border-4 border-white dark:border-gray-700 shadow-lg">
                                        {user?.name?.charAt(0) || 'R'}
                                    </div>
                                    <div className="space-y-3 text-center sm:text-left">
                                        <div className="flex gap-2 justify-center sm:justify-start">
                                            <Button variant="outline" size="sm" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">Upload New Photo</Button>
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Remove</Button>
                                        </div>
                                        <p className="text-xs text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>

                                <GeneralSettingsForm user={user} />
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Notification Preferences</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Choose how and when you want to be notified.</p>
                                </div>

                                <div className="space-y-2 divide-y divide-gray-100 dark:divide-gray-800">
                                    {[
                                        { icon: Mail, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', title: 'Email Digests', desc: 'Receive weekly summaries of your recycling impact.' },
                                        { icon: Bell, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400', title: 'Pickup Alerts', desc: 'Get notified when the waste collection truck is approaching.' },
                                        { icon: MapPin, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 dark:text-orange-400', title: 'Service Disruptions', desc: 'Alerts about schedule changes or delays.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between py-4">
                                            <div className="flex gap-4">
                                                <div className={`p-2 rounded-lg h-fit ${item.color}`}><item.icon className="h-5 w-5" /></div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{item.title}</h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pr-4">{item.desc}</p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Security & Access</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password and session security.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-start gap-4">
                                        <Lock className="h-5 w-5 text-gray-400 mt-1" />
                                        <div className="flex-1 w-full">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Change Password</h4>
                                            <div className="grid grid-cols-1 gap-4 mt-4 w-full">
                                                <Input type="password" placeholder="Current Password" className="dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                                                <Input type="password" placeholder="New Password" className="dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                                                <Input type="password" placeholder="Confirm New Password" className="dark:bg-gray-900 dark:border-gray-600 dark:text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Two-Factor Authentication</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add an extra layer of security.</p>
                                        </div>
                                        <Button variant="outline" size="sm" className="dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">Enable 2FA</Button>
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-800">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Delete Account</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Permanently delete your resident account and data.</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20">
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* APPEARANCE TAB */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Appearance</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Customize how CivicFlow looks on your device.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Light', value: 'light', icon: Sun },
                                        { label: 'Dark', value: 'dark', icon: Moon },
                                        { label: 'System', value: 'system', icon: Monitor }
                                    ].map((mode) => (
                                        <div
                                            key={mode.value}
                                            onClick={() => setTheme(mode.value as any)}
                                            className="cursor-pointer group"
                                        >
                                            <div className={cn(
                                                "aspect-video rounded-lg border-2 flex items-center justify-center mb-2 transition-all duration-200",
                                                theme === mode.value
                                                    ? "border-green-500 bg-green-50/50 dark:bg-green-900/20"
                                                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 hover:border-green-400"
                                            )}>
                                                <mode.icon className={cn(
                                                    "h-6 w-6",
                                                    theme === mode.value ? "text-green-600 dark:text-green-400" : "text-gray-400 group-hover:text-green-600"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "text-xs font-bold text-center block",
                                                theme === mode.value ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                                            )}>{mode.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

function GeneralSettingsForm({ user }: { user: any }) {
    const { updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await updateProfile(formData);
            // success feedback
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Assigned Zone</label>
                    <Input defaultValue={user?.zoneId || 'Unassigned'} disabled className="bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 dark:border-gray-700" />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                    <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-sm rounded-lg"
                >
                    {isSaving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                </Button>
            </div>
        </>
    );
}
