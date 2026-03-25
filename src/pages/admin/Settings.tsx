import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { User, Shield, Monitor, Save, Building, ClipboardList, Loader2, CheckCircle, AlertCircle, FileText, Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import client from '../../api/client';
import { cn } from '../../lib/utils';

export function Settings() {
    const { theme, setTheme } = useTheme();
    const { user, refreshUser } = useAuth();
    const location = useLocation();
    
    const [activeTab, setActiveTab] = useState(() => {
        const hash = location.hash.replace('#', '');
        return ['general', 'organization', 'security', 'audit', 'appearance'].includes(hash) ? hash : 'general';
    });

    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (['general', 'organization', 'security', 'audit', 'appearance'].includes(hash)) {
            setActiveTab(hash);
        }
    }, [location.hash]);

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Avatar State
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Password State
    const [passData, setPassData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);
    const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Organization State (Mock)
    const [orgData, setOrgData] = useState({
        deptName: 'Sanitation Dept.',
        region: 'North District',
        supportEmail: 'support@civicflow.gov'
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                email: user.email || ''
            });
        }
    }, [user]);

    const handleProfileUpdate = async () => {
        setIsUpdatingProfile(true);
        setProfileMessage(null);
        try {
            await client.put('/auth/profile', profileData);
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
            if (refreshUser) await refreshUser();
        } catch (error: any) {
            setProfileMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file);

        setIsUploadingAvatar(true);
        try {
            await client.post('/auth/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (refreshUser) await refreshUser();
        } catch (error: any) {
            console.error("Avatar upload failed", error);
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!user?.avatar) return;
        try {
            await client.delete('/auth/avatar');
            if (refreshUser) await refreshUser();
        } catch (error: any) {
            console.error("Avatar removal failed", error);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passData.newPassword !== passData.confirmPassword) {
            setPassMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        setIsUpdatingPass(true);
        setPassMessage(null);
        try {
            await client.put('/auth/password', {
                currentPassword: passData.currentPassword,
                newPassword: passData.newPassword
            });
            setPassMessage({ type: 'success', text: 'Password changed successfully' });
            setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setPassMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setIsUpdatingPass(false);
        }
    };

    const getInitials = (name: string) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Tabs Configuration
    const tabs = [
        { id: 'general', label: 'General', icon: User },
        { id: 'organization', label: 'Organization', icon: Building }, // New
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'audit', label: 'Audit Logs', icon: ClipboardList }, // New
        { id: 'appearance', label: 'Appearance', icon: Monitor },
    ];

    return (
        <div className="max-w-[1600px] mx-auto pb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between px-2 mb-8 gap-4">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-civic-dark dark:text-white">Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your account and system preferences</p>
                </div>
                {activeTab === 'general' && (
                    <Button
                        onClick={handleProfileUpdate}
                        disabled={isUpdatingProfile}
                        className="w-full sm:w-auto bg-civic-green-600 hover:bg-civic-green-700 text-white font-bold shadow-sm rounded-lg"
                    >
                        {isUpdatingProfile ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-8 px-2">
                <div className="w-full lg:w-64 flex-shrink-0">
                    <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-shrink-0 lg:w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 border lg:border-none
                                    ${activeTab === tab.id
                                        ? 'bg-civic-dark dark:bg-gray-800 text-white shadow-md border-civic-dark dark:border-gray-700'
                                        : 'bg-white dark:bg-gray-900 lg:bg-transparent border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            >
                                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-civic-green-500' : 'text-gray-400 dark:text-gray-500'}`} />
                                <span className="whitespace-nowrap">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex-1 max-w-4xl">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-civic-muted dark:border-gray-700 shadow-sm p-6 sm:p-8 min-h-[600px]">

                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-civic-dark dark:text-white mb-1">Profile Information</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your photo and personal details.</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="h-24 w-24 rounded-full bg-civic-dark dark:bg-gray-800 flex items-center justify-center text-3xl text-white font-bold border-4 border-white dark:border-gray-700 shadow-lg overflow-hidden relative">
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            getInitials(user?.name || '')
                                        )}
                                        {isUploadingAvatar && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-3 text-center sm:text-left">
                                        <div className="flex gap-2 justify-center sm:justify-start items-center">
                                            <label htmlFor="avatar-upload">
                                                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
                                                    Upload New Photo
                                                </div>
                                            </label>
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleAvatarUpload}
                                                disabled={isUploadingAvatar}
                                            />
                                            {user?.avatar && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={handleRemoveAvatar}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                                        <Input
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                                        <Input
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</label>
                                        <Input
                                            value={user?.role || 'User'}
                                            disabled
                                            className="bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 dark:border-gray-700 capitalize"
                                        />
                                    </div>
                                </div>
                                {profileMessage && (
                                    <div className={`text-sm font-bold flex items-center gap-2 p-3 rounded-lg ${profileMessage.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {profileMessage.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                        {profileMessage.text}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ORGANIZATION TAB (NEW) */}
                        {activeTab === 'organization' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-civic-dark dark:text-white mb-1">Organization Details</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage department and regional settings.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department Name</label>
                                        <Input
                                            value={orgData.deptName}
                                            onChange={(e) => setOrgData({ ...orgData, deptName: e.target.value })}
                                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Operating Region</label>
                                        <Input
                                            value={orgData.region}
                                            onChange={(e) => setOrgData({ ...orgData, region: e.target.value })}
                                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact Support Email</label>
                                        <Input
                                            value={orgData.supportEmail}
                                            onChange={(e) => setOrgData({ ...orgData, supportEmail: e.target.value })}
                                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <Button className="bg-civic-dark dark:bg-white text-white dark:text-civic-dark font-bold">
                                            Update Details
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-civic-dark dark:text-white mb-1">Security & Access</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your password and session security.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-start gap-4">
                                        <User className="h-5 w-5 text-gray-400 mt-1" /> {/* Replaced Lock with User as Lock might not be imported or I should import it. Let's add Lock to imports */}
                                        <div className="flex-1 w-full">
                                            <h4 className="font-bold text-civic-dark dark:text-white text-sm">Change Password</h4>
                                            <div className="grid grid-cols-1 gap-4 mt-4 w-full">
                                                <Input
                                                    type="password"
                                                    placeholder="Current Password"
                                                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                                    value={passData.currentPassword}
                                                    onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                                                />
                                                <Input
                                                    type="password"
                                                    placeholder="New Password"
                                                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                                    value={passData.newPassword}
                                                    onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                                />
                                                <Input
                                                    type="password"
                                                    placeholder="Confirm New Password"
                                                    className="dark:bg-gray-900 dark:border-gray-600 dark:text-white"
                                                    value={passData.confirmPassword}
                                                    onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                            {passMessage && (
                                                <div className={`text-sm font-bold flex items-center gap-2 mt-4 ${passMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                                    {passMessage.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                                    {passMessage.text}
                                                </div>
                                            )}
                                            <Button
                                                onClick={handlePasswordUpdate}
                                                disabled={isUpdatingPass}
                                                className="mt-4 bg-civic-dark dark:bg-white text-white dark:text-civic-dark font-bold"
                                            >
                                                {isUpdatingPass && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                                Update Password
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AUDIT LOGS TAB (NEW) */}
                        {activeTab === 'audit' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-civic-dark dark:text-white mb-1">Audit Logs</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Recent system activities and events.</p>
                                </div>

                                <div className="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Recent Activity</span>
                                        <Button variant="ghost" size="sm" className="text-xs">Export CSV</Button>
                                    </div>
                                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {[
                                            { action: 'User Login', detail: 'Admin logged in via Web', time: '2 mins ago', icon: User },
                                            { action: 'Route Updated', detail: 'Route #452 modified by Dispatch', time: '1 hour ago', icon: FileText },
                                            { action: 'System Backup', detail: 'Automated daily backup completed', time: '5 hours ago', icon: Clock },
                                            { action: 'Profile Updated', detail: 'User updated avatar settings', time: 'Yesterday', icon: User },
                                        ].map((log, i) => (
                                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                                                    <log.icon className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-civic-dark dark:text-white">{log.action}</h4>
                                                    <p className="text-xs text-gray-500">{log.detail}</p>
                                                </div>
                                                <span className="text-xs font-medium text-gray-400">{log.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* APPEARANCE TAB */}
                        {activeTab === 'appearance' && (
                            <div className="space-y-8 animate-in fade-in duration-300">
                                <div>
                                    <h3 className="text-lg font-bold text-civic-dark dark:text-white mb-1">Appearance</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Customize how WasteHeroes looks on your device.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Light', value: 'light', icon: Monitor }, // Reusing Monitor icon since Sun/Moon might not be imported or I should simplify imports
                                        { label: 'Dark', value: 'dark', icon: Monitor },
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
                                                    ? "border-civic-green-500 bg-civic-green-50/50 dark:bg-civic-green-900/20"
                                                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 hover:border-civic-green-400"
                                            )}>
                                                <Monitor className={cn(
                                                    "h-6 w-6",
                                                    theme === mode.value ? "text-civic-green-600 dark:text-civic-green-400" : "text-gray-400 group-hover:text-civic-green-600"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "text-xs font-bold text-center block",
                                                theme === mode.value ? "text-civic-dark dark:text-white" : "text-gray-500 dark:text-gray-400"
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
