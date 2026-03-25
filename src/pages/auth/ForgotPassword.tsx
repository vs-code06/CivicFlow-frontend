import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import client from '../../api/client';

export function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await client.post('/auth/forgot-password', { email });
            setIsSent(true);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center border border-gray-100 dark:border-gray-700">
                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">
                        We've sent a password reset link to <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
                    </p>
                    <Link to="/login" className="inline-flex items-center gap-2 text-civic-green-600 font-bold hover:underline">
                        <ArrowLeft className="h-4 w-4" /> Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        No worries! Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 h-12 rounded-xl bg-gray-50"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl bg-civic-green-600 hover:bg-civic-green-700 text-white font-bold shadow-lg shadow-civic-green-600/20"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" /> Sending link...
                            </div>
                        ) : 'Send Reset Link'}
                    </Button>

                    <div className="text-center pt-2">
                        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-civic-green-600 font-medium transition-colors">
                            <ArrowLeft className="h-4 w-4" /> Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
