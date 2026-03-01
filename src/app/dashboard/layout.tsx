import { createSessionClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { TopBar } from '@/components/dashboard/TopBar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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



    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar (Fixed) */}
            <Sidebar />

            <div className="flex-1 ml-64 flex flex-col">
                {/* TopBar (Sticky) */}
                <TopBar user={user} />

                {/* Workspace Area */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
