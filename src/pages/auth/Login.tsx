import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Activity, Globe, Shield, Home, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { GoogleLogin } from '@react-oauth/google';

export function Login() {
    // Force light mode on login/signup pages to prevent dark inputs bleeding through
    useEffect(() => {
        const root = document.documentElement;
        const wasDark = root.classList.contains('dark');
        root.classList.remove('dark');
        root.classList.add('light');
        return () => {
            // Restore dark mode if it was previously active
            root.classList.remove('light');
            if (wasDark || localStorage.getItem('vite-ui-theme') === 'dark') {
                root.classList.add('dark');
            }
        };
    }, []);

    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<'admin' | 'personnel' | 'resident'>('admin');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login(selectedRole, email, password);
            if (selectedRole === 'resident') navigate('/resident');
            else if (selectedRole === 'personnel') navigate('/driver');
            else navigate('/');
        } catch (err: any) {
            console.error("Login failed", err);
            setError(err.response?.data?.message || err.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setIsLoading(true);
        setError(null);
        try {
            await googleLogin(credentialResponse.credential, selectedRole);
            if (selectedRole === 'resident') navigate('/resident');
            else if (selectedRole === 'personnel') navigate('/driver');
            else navigate('/');
        } catch (err: any) {
            console.error("Google login failed", err);
            setError(err.response?.data?.message || "Google Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper for dynamic theme colors
    const getThemeColor = () => {
        if (selectedRole === 'admin') return '#2ECC71';
        if (selectedRole === 'personnel') return '#F39C12';
        return '#1ABC9C'; // Teal for Resident (Login Only)
    };

    const getRoleIcon = () => {
        if (selectedRole === 'admin') return <Activity className="h-5 w-5" />;
        if (selectedRole === 'personnel') return <Globe className="h-5 w-5" />;
        return <Home className="h-5 w-5" />;
    };

    return (
        <div className="min-h-screen w-full flex font-sans">

            {/* Left Panel - Charcoal with Visual Complexity */}
            <div className="hidden lg:flex w-1/2 bg-[#212121] flex-col justify-center items-center relative overflow-hidden p-8">
                {/* Background Gradients */}
                <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] rounded-full blur-3xl transition-colors duration-500" style={{ background: `linear-gradient(to bottom right, ${getThemeColor()}1A, transparent)` }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-3xl transition-colors duration-500" style={{ background: `linear-gradient(to top left, ${getThemeColor()}1A, transparent)` }}></div>

                {/* Glass Dashboard Mockup Card */}
                <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 ease-out">
                    {/* Mock Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold transition-colors duration-300"
                                style={{ backgroundColor: getThemeColor() }}
                            >
                                {getRoleIcon()}
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">
                                    {selectedRole === 'resident' ? 'Service Status' : 'System Status'}
                                </div>
                                <div className="text-xs text-green-400 flex items-center gap-1">
                                    Online
                                </div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 font-mono">v4.2.0</div>
                    </div>

                    {/* Mock Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                            <div className="text-gray-400 text-xs mb-1">
                                {selectedRole === 'resident' ? 'Next Pickup' : 'Active Fleet'}
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {selectedRole === 'resident' ? 'Today' : '248'}
                            </div>
                            <div className="w-full bg-gray-700 h-1 mt-3 rounded-full overflow-hidden">
                                <div className="h-full w-[70%] transition-colors duration-300" style={{ backgroundColor: getThemeColor() }}></div>
                            </div>
                        </div>
                        <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                            <div className="text-gray-400 text-xs mb-1">
                                {selectedRole === 'resident' ? 'Requests' : 'Efficiency'}
                            </div>
                            <div className="text-2xl font-bold text-white">
                                {selectedRole === 'resident' ? '0' : '96%'}
                            </div>
                            <div className="w-full bg-gray-700 h-1 mt-3 rounded-full overflow-hidden">
                                <div className="h-full w-[92%] transition-colors duration-300" style={{ backgroundColor: getThemeColor() }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Mock Graph Area */}
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5 h-32 flex items-end justify-between gap-1">
                        {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                            <div
                                key={i}
                                className="w-full rounded-t-sm opacity-80 transition-all duration-300"
                                style={{ height: `${h}%`, backgroundColor: getThemeColor() }}
                            ></div>
                        ))}
                    </div>

                    {/* Floating Badge */}
                    <div className="absolute -right-4 -top-4 bg-[#212121] border border-white/10 p-3 rounded-xl shadow-xl flex items-center gap-3">
                        <Shield className="h-5 w-5 text-blue-400" />
                        <div className="text-xs">
                            <div className="text-gray-400">Security</div>
                            <div className="text-white font-bold">Verified</div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-2">
                        {selectedRole === 'resident' ? 'Your City. Your Service.' : (selectedRole === 'admin' ? 'Monitor Everything.' : 'Drive Efficiently.')}
                    </h2>
                    <p className="text-gray-400 max-w-xs mx-auto text-sm leading-relaxed">
                        Data-driven insights for modern municipal management.
                    </p>
                </div>
            </div>

            {/* Right Panel - White with Dot Pattern */}
            <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 relative">
                {/* Subtle Dot Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="w-full max-w-md space-y-8 relative z-10 animate-fade-in">

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-[#212121]">Sign In</h2>
                        <p className="mt-2 text-gray-500">
                            to continue to CivicFlow
                        </p>
                    </div>

                    {/* Role Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setSelectedRole('admin')}
                            type="button"
                            className={`flex-1 py-2.5 text-xs lg:text-sm font-bold rounded-lg transition-all ${selectedRole === 'admin'
                                ? 'bg-white text-[#212121] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setSelectedRole('resident')}
                            type="button"
                            className={`flex-1 py-2.5 text-xs lg:text-sm font-bold rounded-lg transition-all ${selectedRole === 'resident'
                                ? 'bg-white text-[#212121] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Resident
                        </button>
                        <button
                            onClick={() => setSelectedRole('personnel')}
                            type="button"
                            className={`flex-1 py-2.5 text-xs lg:text-sm font-bold rounded-lg transition-all ${selectedRole === 'personnel'
                                ? 'bg-white text-[#212121] shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Personnel
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleLoginSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-[#212121]">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="name@civicflow.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-11 bg-white border-gray-200 focus:border-[#212121] focus:ring-0 transition-all rounded-xl"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-[#212121]">Password</label>
                                    <Link to="/forgot-password" title="Forgot Password" className="text-sm font-bold hover:underline" style={{ color: getThemeColor() }}>
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-11 bg-white border-gray-200 focus:border-[#212121] focus:ring-0 transition-all rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-3 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-white"
                            style={{ backgroundColor: selectedRole === 'admin' ? '#212121' : getThemeColor() }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : <span className="flex items-center justify-center gap-2">Get Started <ArrowRight className="h-4 w-4" /></span>}
                        </Button>

                        <div className="relative flex items-center py-4">
                            <div className="flex-grow border-t border-gray-200"></div>
                            <span className="flex-shrink mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
                            <div className="flex-grow border-t border-gray-200"></div>
                        </div>

                        <div className="flex justify-center w-full">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('Google Login Failed')}
                                theme="outline"
                                shape="pill"
                                width="100%"
                                size="large"
                                text="signin_with"
                            />
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            New to CivicFlow? {' '}
                            <Link to="/signup" className="font-bold hover:underline" style={{ color: getThemeColor() }}>
                                Register Now
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
