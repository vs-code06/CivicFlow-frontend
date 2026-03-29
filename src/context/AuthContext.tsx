import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

type UserRole = 'admin' | 'personnel' | 'resident' | null;

interface User {
    _id: string; // Backend uses _id
    id?: string; // Optional for compatibility
    name: string;
    role: UserRole;
    avatar?: string;
    email?: string;
    status?: 'On Duty' | 'Off Duty' | 'On Leave';
    assignedVehicle?: string;
    zoneId?: string;
    address?: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: UserRole, email?: string, password?: string) => Promise<void>;
    googleLogin: (idToken: string, role?: UserRole) => Promise<void>;
    register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data } = await client.get('/auth/me');
            setUser(data.user);
        } catch (error) {
            setUser(null);
            // It's expected to fail if not logged in
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (data: Partial<User>) => {
        const endpoint = '/auth/profile';
        const response = await client.put(endpoint, data);
        if (response.data.success && response.data.user) {
            setUser(response.data.user);
        } else {
            setUser(response.data);
        }
    };

    const login = async (role: UserRole, email?: string, password?: string) => {
        if (!email || !password) {
            // Fallback for dev/mock buttons if we still have them? 
            // Ideally we should enforce email/password.
            // For now, let's assume the frontend provides them.
            throw new Error("Email and password required");
        }

        const endpoint = '/auth/login';
        const { data } = await client.post(endpoint, { email, password, role });
        if (data.token) localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    const googleLogin = async (idToken: string, role?: UserRole) => {
        const { data } = await client.post('/auth/google', { idToken, role });
        if (data.token) localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    const logout = async () => {
        try {
            localStorage.removeItem('token');
            await client.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    const register = async (name: string, email: string, password: string, role: UserRole) => {
        const endpoint = '/auth/register';
        // Note: The backend expects { name, email, password, role }
        const { data } = await client.post(endpoint, { name, email, password, role });
        if (data.token) localStorage.setItem('token', data.token);
        setUser(data.user);
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, register, logout, refreshUser: checkAuth, updateProfile, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
