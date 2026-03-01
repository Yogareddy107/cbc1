import { User, Mail, Shield, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProfilePage() {
    return (
        <div className="max-w-2xl mx-auto px-6 py-20 space-y-16">
            <header className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground text-sm">Update your profile information and security preferences.</p>
            </header>

            <section className="space-y-8">
                <div className="space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border/20 pb-4">Personal Information</h2>
                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Full Name</label>
                            <Input placeholder="John Doe" className="max-w-md h-10" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">Email Address</label>
                            <Input placeholder="john@example.com" disabled className="max-w-md h-10 bg-secondary/30 opacity-60" />
                            <p className="text-[10px] text-muted-foreground/50 italic">Email cannot be changed once verified.</p>
                        </div>
                    </div>
                    <Button className="h-10 px-6 font-semibold">Save Changes</Button>
                </div>

                <div className="space-y-6 pt-12">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border/20 pb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border/20 bg-secondary/5">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">Two-Factor Authentication</p>
                                <p className="text-[11px] text-muted-foreground">Add an extra layer of security to your account.</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-border/20 bg-secondary/5">
                            <div className="space-y-1">
                                <p className="text-sm font-semibold">Password Management</p>
                                <p className="text-[11px] text-muted-foreground">Change your password at regular intervals for safety.</p>
                            </div>
                            <Button variant="outline" size="sm">Update Password</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
