'use client';

import { useState } from 'react';
import { Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateProfileName, updateProfilePassword } from '@/app/dashboard/profile/actions';

interface ProfileFormProps {
    user: {
        $id: string;
        name: string;
        email: string;
    };
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [name, setName] = useState(user.name || '');
    const [isUpdatingName, setIsUpdatingName] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleUpdateName = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingName(true);
        setMessage(null);

        try {
            const result = await updateProfileName(name);
            if (result.success) {
                setMessage({ type: 'success', text: 'Name updated successfully!' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update name.' });
            }
        } catch (error: any) {
            console.error('Error updating name:', error);
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsUpdatingName(false);
        }
    };

    const handleUpdatePassword = async () => {
        setIsUpdatingPassword(true);
        setMessage(null);

        try {
            const newPassword = window.prompt('Enter your new password:');
            if (!newPassword) {
                setIsUpdatingPassword(false);
                return;
            }

            const result = await updateProfilePassword(newPassword);
            if (result.success) {
                setMessage({ type: 'success', text: 'Password updated successfully!' });
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update password.' });
            }
        } catch (error: any) {
            console.error('Error updating password:', error);
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="space-y-12">
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.type === 'success'
                    ? 'bg-green-500/10 border-green-500/20 text-green-600'
                    : 'bg-destructive/10 border-destructive/20 text-destructive'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="text-sm font-medium">{message.text}</p>
                </div>
            )}

            <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border/20 pb-4">Personal Information</h2>
                <form onSubmit={handleUpdateName} className="grid gap-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Full Name</label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            className="max-w-md h-10 focus-visible:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Email Address</label>
                        <Input
                            value={user.email}
                            disabled
                            className="max-w-md h-10 bg-secondary/30 opacity-60 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-muted-foreground/50 italic">Email cannot be changed directly for security reasons.</p>
                    </div>
                    <Button
                        type="submit"
                        disabled={isUpdatingName || name === user.name}
                        className="w-fit h-10 px-8 font-semibold transition-all active:scale-95"
                    >
                        {isUpdatingName ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </Button>
                </form>
            </section>

            <section className="space-y-6">
                <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border/20 pb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Security
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl border border-border/20 bg-secondary/5 hover:bg-secondary/10 transition-colors group">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold group-hover:text-primary transition-colors">Two-Factor Authentication</p>
                            <p className="text-[11px] text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                        <Button variant="outline" size="sm" className="font-semibold" disabled>Enable</Button>
                    </div>
                    <div className="flex items-center justify-between p-5 rounded-2xl border border-border/20 bg-secondary/5 hover:bg-secondary/10 transition-colors group">
                        <div className="space-y-1">
                            <p className="text-sm font-semibold group-hover:text-primary transition-colors">Password Management</p>
                            <p className="text-[11px] text-muted-foreground">Update your password to keep your account safe.</p>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="font-semibold"
                            onClick={handleUpdatePassword}
                            disabled={isUpdatingPassword}
                        >
                            {isUpdatingPassword ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : 'Update Password'}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
