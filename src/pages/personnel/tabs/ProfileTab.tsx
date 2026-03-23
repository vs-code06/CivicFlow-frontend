import React, { useState } from 'react';
import { PageTransition } from '../../../components/ui/page-transition';
import { LogOut, Loader2, Save, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import client from '../../../api/client';

export function ProfileTab() {
    const { user, logout, refreshUser } = useAuth();

    // Profile State
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Password State
    const [passData, setPassData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isUpdatingPass, setIsUpdatingPass] = useState(false);
    const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        setProfileMessage(null);
        try {
            await client.put('/auth/profile', profileData);
            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
            // Ideally we should refresh the user context here, assuming useAuth exposes a reload method or we manually update local storage/state if needed
            // For now, let's just assume prompt success. In a real app, `refreshUser()` might be needed.
            if (refreshUser) {
                await refreshUser();
            }
        } catch (error: any) {
            setProfileMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <PageTransition>
            <div className="p-6 pt-12 pb-24 max-w-2xl mx-auto">
                {/* Header Profile Card */}
                <div className="flex flex-col items-center mb-8">
                    <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl relative group">
                        <div className="h-full w-full bg-civic-dark flex items-center justify-center text-white font-black text-2xl">
                            {user?.name.charAt(0)}
                        </div>
                        {/* Placeholder overlay for future image upload */}
                        {/* <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-white text-xs font-bold">Edit</span>
                         </div> */}
                    </div>
                    <h2 className="text-2xl font-black text-civic-dark dark:text-white">{user?.name}</h2>
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">{user?.role} • {user?.id?.substring(user.id.length - 6).toUpperCase()}</p>
                </div>

                {/* Edit Profile Section */}
                <div className="space-y-6 mb-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Profile Information</h3>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                placeholder="John Doe"
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                placeholder="john@example.com"
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                        </div>

                        {profileMessage && (
                            <div className={`text-sm font-bold flex items-center gap-2 ${profileMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                {profileMessage.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                {profileMessage.text}
                            </div>
                        )}

                        <div className="pt-2 flex justify-end">
                            <Button type="submit" disabled={isUpdatingProfile} className="bg-civic-dark dark:bg-white text-white dark:text-civic-dark font-bold">
                                {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Security Section */}
                <div className="space-y-6 mb-8">
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security</h3>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="current-pass">Current Password</Label>
                            <Input
                                id="current-pass"
                                type="password"
                                value={passData.currentPassword}
                                onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })}
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new-pass">New Password</Label>
                            <Input
                                id="new-pass"
                                type="password"
                                value={passData.newPassword}
                                onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })}
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="confirm-pass">Confirm New Password</Label>
                            <Input
                                id="confirm-pass"
                                type="password"
                                value={passData.confirmPassword}
                                onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })}
                                className="bg-gray-50 dark:bg-gray-800"
                            />
                        </div>

                        {passMessage && (
                            <div className={`text-sm font-bold flex items-center gap-2 ${passMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                {passMessage.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                {passMessage.text}
                            </div>
                        )}

                        <div className="pt-2 flex justify-end">
                            <Button type="submit" disabled={isUpdatingPass} variant="outline" className="border-civic-dark dark:border-white text-civic-dark dark:text-white font-bold hover:bg-civic-dark hover:text-white dark:hover:bg-white dark:hover:text-civic-dark">
                                {isUpdatingPass ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Update Password
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Account Actions */}
                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white px-1 mb-2">Account Actions</h3>
                    <button onClick={logout} className="w-full bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-100 dark:hover:border-red-900/20">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500"><LogOut className="h-4 w-4" /></div>
                            <span className="text-sm font-bold">Sign Out</span>
                        </div>
                    </button>
                    <p className="text-xs text-center text-gray-400 pt-4">CivicFlow v1.0.0 • Build 2024.12</p>
                </div>
            </div>
        </PageTransition>
    );
}
