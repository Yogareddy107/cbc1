'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { ID } from 'node-appwrite';
import { isAdminEmail } from '@/lib/admin';

export async function signInWithEmail(formData: FormData) {
    const email = (formData.get('email') as string)?.toLowerCase();
    const password = formData.get('password') as string;

    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        // return flag indicating whether the user is an admin
        const isAdmin = isAdminEmail(email);
        return { success: true, isAdmin };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function signUpWithEmail(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string || email.split('@')[0];

    try {
        const { account } = await createAdminClient();
        await account.create(ID.unique(), email, password, name);

        // Log them in immediately after sign up
        return await signInWithEmail(formData);
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function signOut() {
    try {
        const { account } = await createSessionClient();

        (await cookies()).delete("appwrite-session");
        await account.deleteSession("current");
    } catch (error) {
        // Even if session delete fails on server, we clear the cookie
        (await cookies()).delete("appwrite-session");
    }

    redirect("/");
}

// Google OAuth is slightly different in Appwrite SSR, usually requires client-side initiation 
// or custom redirect flow. For now, we focus on Email/Password.
export async function signInWithGoogle() {
    // Implementation depends on Appwrite OAuth flow in Next.js
    return { error: 'OAuth not yet implemented for Appwrite migration' };
}

