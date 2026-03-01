import { db } from '@/lib/db';
import { analyses as analysesTable } from '@/lib/db/schema';
import { createSessionClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { Search, History } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { HistoryTable } from '@/components/dashboard/HistoryTable';
import { desc, eq } from 'drizzle-orm';

export default async function HistoryPage() {
    let user: { $id: string, email: string } | null = null;
    try {
        const { account } = await createSessionClient();
        const appwriteUser = await account.get();
        user = {
            $id: appwriteUser.$id,
            email: appwriteUser.email,
        };
    } catch (e) {
        redirect('/login');
    }


    const analyses = await db.select()
        .from(analysesTable)
        .where(eq(analysesTable.user_id, user.$id))
        .orderBy(desc(analysesTable.created_at));

    return (
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Analysis History</h1>
                    <p className="text-sm text-muted-foreground">Manage and review your previous codebase explorations.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search repositories..." className="h-9 pl-9 text-xs" />
                    </div>
                </div>
            </header>

            {!analyses || analyses.length === 0 ? (
                <div className="py-24 text-center border border-dashed border-border/40 rounded-2xl bg-secondary/5">
                    <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-4 border border-border/10">
                        <History className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-semibold mb-1">No history yet</h3>
                    <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Start by analyzing your first repository from the dashboard.</p>
                </div>
            ) : (
                <HistoryTable initialAnalyses={analyses as any} />
            )}
        </div>
    );
}

