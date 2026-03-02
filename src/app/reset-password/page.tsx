'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

import { Suspense } from 'react';

function ResetPasswordContent() {
    const search = useSearchParams();
    const router = useRouter();
    const userId = search.get('userId') || '';
    const secret = search.get('secret') || '';

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!password) return setError('Enter a new password');
        if (password !== confirm) return setError('Passwords do not match');
        try {
            const res = await fetch('/api/auth/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, secret, password })
            });
            const data = await res.json();
            if (data?.error) setError(data.error);
            else {
                setSuccess('Password updated — you can now sign in');
                setTimeout(() => router.push('/login'), 1600);
            }
        } catch (e) {
            setError('Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFDF6] p-6">
            <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow">
                <h2 className="text-2xl font-bold mb-2">Reset your password</h2>
                <p className="text-sm text-[#666] mb-4">Enter a new password for your account.</p>
                {error && <div className="p-3 bg-red-50 text-red-600 rounded mb-3">{error}</div>}
                {success && <div className="p-3 bg-green-50 text-green-600 rounded mb-3">{success}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="password">New password</Label>
                        <div className="relative">
                            <Input id="password" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="pr-12 h-12" />
                            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666]">
                                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="confirm">Confirm password</Label>
                        <Input id="confirm" type={show ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} className="h-12" />
                    </div>

                    <Button type="submit" className="w-full h-12">Set new password</Button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
