'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2, AlertCircle, Compass, Eye, EyeOff } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../auth/actions';


function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mode, setMode] = useState<'signin' | 'signup'>('signup');
    const [forgotMode, setForgotMode] = useState(false);
    const [emailValue, setEmailValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const next = searchParams.get('next') || '/dashboard';
    const isLimitReached = searchParams.get('meta') === 'limit_reached';

    useEffect(() => {
        if (isLimitReached) {
            setMode('signup');
        }
    }, [isLimitReached]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData(e.currentTarget);
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (mode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            const res = (mode === 'signin'
                ? await signInWithEmail(formData)
                : await signUpWithEmail(formData)) as any;

            if (res?.error) {
                setError(res.error);
                setLoading(false);
            } else if (res?.success) {
                setSuccess(res.message || 'Success! Redirecting...');
                // if the user is an admin, go to admin dashboard regardless of `next`
                if (res.isAdmin) {
                    router.push('/admin');
                } else {
                    router.push(next);
                }
            }
        } catch (err: any) {
            if (err.message !== 'NEXT_REDIRECT') {
                setError(err.message || 'An unexpected error occurred.');
            }
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        // Appwrite OAuth implementation for SSR is usually done client-side first
        // or through a server action that returns the OAuth URL.
        // For this migration, we'll keep it as a placeholder or redirect to login.
        setError('Google Login is being migrated. Please use email/password for now.');
    };


    return (
        <div className="flex min-h-screen bg-[#FFFDF6] text-[#1A1A1A]">
            {/* Left Column: Organic Visual Asset */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden border-r border-[#1A1A1A]/5"
                style={{
                    backgroundColor: '#F04B3E',
                    backgroundImage: `
                     radial-gradient(at 0% 0%, #FFB677 0px, transparent 50%),
                     radial-gradient(at 100% 0%, #F04B3E 0px, transparent 50%),
                     radial-gradient(at 50% 100%, #FF782D 0px, transparent 50%),
                     radial-gradient(at 100% 100%, #F04B3E 0px, transparent 50%),
                     radial-gradient(at 0% 100%, #FF782D 0px, transparent 50%)
                   `
                }}>
                {/* Subtle Text Overlays */}
                <div className="absolute inset-0 bg-white/5 opacity-40 mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 p-16 max-w-xl space-y-12">
                    <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white backdrop-blur-md bg-white/10 w-fit px-6 py-3 rounded-2xl border border-white/20 shadow-xl">
                        <Compass className="text-white w-6 h-6" />
                        CheckBeforeCommit
                    </div>
                    <div className="space-y-8">
                        <h2 className="text-5xl font-bold tracking-tight text-white leading-[1.1]">
                            Stop guessing. <br />
                            Start knowing.
                        </h2>
                        <p className="text-white/80 text-xl font-medium leading-relaxed max-w-md">
                            Join over 2,000+ engineers who use our structured insights to master technical complexity.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8">
                        {[
                            { label: 'Instant Discovery', desc: 'Zero-setup repo analysis' },
                            { label: 'Deep Mapping', desc: 'Full structural intelligence' }
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 space-y-1">
                                <div className="text-white font-bold text-lg">{stat.label}</div>
                                <div className="text-white/60 text-xs font-medium uppercase tracking-wider">{stat.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Auth Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 bg-[#FFFDF6]">
                <div className="max-w-md w-full mx-auto space-y-10">
                    <div className="space-y-2 lg:hidden">
                        <div className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#1A1A1A]">
                            <Compass className="text-[#FF7D29] w-6 h-6" />
                            CheckBeforeCommit
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
                            {mode === 'signin' ? 'Welcome back' : 'Get started for free'}
                        </h1>
                        <p className="text-[#1A1A1A]/60 text-md font-medium">
                            {mode === 'signin'
                                ? 'Log in to access your analysis dashboard.'
                                : 'Create an account to analyze your first repository.'}
                        </p>
                    </div>

                    {isLimitReached && (
                        <div className="p-4 rounded-2xl bg-[#FF7D29]/5 border border-[#FF7D29]/10 flex gap-3 text-sm text-[#FF7D29] animate-in fade-in slide-in-from-top-2 duration-500">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="leading-relaxed font-medium">
                                You’ve reached the free analysis limit.
                                <br />
                                <span className="font-bold opacity-80">Create an account to continue.</span>
                            </p>
                        </div>
                    )}

                    <div className="space-y-8">
                        <Button
                            variant="outline"
                            className="w-full h-14 text-md font-bold border-[#1A1A1A]/5 hover:bg-white hover:border-[#1A1A1A]/10 bg-white shadow-sm transition-all flex items-center justify-center gap-3 rounded-2xl group"
                            onClick={handleGoogleLogin}
                            disabled={loading}
                        >
                            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-[#1A1A1A]/5" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                <span className="bg-[#FFFDF6] px-4 text-[#1A1A1A]/30">Or use email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 text-sm rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 font-medium">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-4 text-sm rounded-2xl bg-green-50 border border-green-100 text-green-600 flex items-center gap-3 font-medium">
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                    {success}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#1A1A1A]/60 font-bold text-xs uppercase tracking-wider ml-1">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={emailValue}
                                    onChange={(e) => setEmailValue(e.target.value)}
                                    className="h-12 bg-white border-[#1A1A1A]/10 focus:border-[#FF7D29] focus:ring-[#FF7D29]/20 transition-all rounded-xl shadow-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-[#1A1A1A]/60 font-bold text-xs uppercase tracking-wider ml-1">Password</Label>
                                    {mode === 'signin' && (
                                        <button type="button" onClick={() => setForgotMode(true)} className="text-xs font-bold text-[#FF7D29] hover:underline transition-all">
                                            Forgot?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="h-12 bg-white border-[#1A1A1A]/10 focus:border-[#FF7D29] focus:ring-[#FF7D29]/20 transition-all rounded-xl shadow-sm pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(s => !s)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                                {forgotMode && mode === 'signin' && (
                                    <div className="p-4 rounded-lg border border-[#EAEAEA] bg-white/50 space-y-3">
                                        <p className="text-sm text-[#1A1A1A]/70">Enter your email and we'll send a password reset link.</p>
                                        <div className="flex gap-2">
                                            <Input
                                                type="email"
                                                placeholder="name@company.com"
                                                value={emailValue}
                                                onChange={(e) => setEmailValue(e.target.value)}
                                                className="h-12"
                                            />
                                            <Button onClick={async () => {
                                                if (!emailValue) return setError('Please enter your email');
                                                setError('');
                                                setSuccess('');
                                                try {
                                                    const res = await fetch('/api/auth/recover', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ email: emailValue, redirectUrl: window.location.origin + '/reset-password' })
                                                    });
                                                    const data = await res.json();
                                                    if (data?.error) setError(data.error);
                                                    else setSuccess(data.message || 'If the email exists, a recovery link was sent.');
                                                } catch (e: any) {
                                                    setError('Failed to send recovery email');
                                                }
                                            }} className="h-12">Send</Button>
                                        </div>
                                        <div>
                                            <button className="text-xs text-[#666] hover:underline" type="button" onClick={() => setForgotMode(false)}>Cancel</button>
                                        </div>
                                    </div>
                                )}
                            {mode === 'signup' && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <Label htmlFor="confirmPassword" className="text-[#1A1A1A]/60 font-bold text-xs uppercase tracking-wider ml-1">Confirm Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="h-12 bg-white border-[#1A1A1A]/10 focus:border-[#FF7D29] focus:ring-[#FF7D29]/20 transition-all rounded-xl shadow-sm pr-12"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(s => !s)}
                                            aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <Button type="submit" className="w-full h-14 text-md font-bold bg-[#FF7D29] text-white hover:bg-[#FF7D29]/90 shadow-lg shadow-[#FF7D29]/20 transition-all active:scale-[0.98] rounded-2xl" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : mode === 'signin' ? 'Sign in' : 'Create free account'}
                            </Button>
                        </form>

                        <div className="text-center pt-2">
                            <span className="text-[#1A1A1A]/50 text-sm font-medium">
                                {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                            </span>{' '}
                            <button
                                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                className="text-[#FF7D29] font-bold text-sm hover:underline transition-all ml-1"
                            >
                                {mode === 'signin' ? 'Sign up' : 'Log in'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-[#FFFDF6]">
                <Loader2 className="animate-spin text-[#FF7D29] w-8 h-8" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}

