'use server';

import { createAdminClient, createSessionClient } from '@/lib/appwrite';
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
    } catch (error) {
        return { error: error instanceof Error ? error.message : "An unknown error occurred" };
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
    } catch (error) {
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return { error: message };
    }
}

export async function signOut() {
    try {
        const { account } = await createSessionClient();

        (await cookies()).delete("appwrite-session");
        await account.deleteSession("current");
        return { success: true };
    } catch {
        // Even if session delete fails on server, we clear the cookie
        (await cookies()).delete("appwrite-session");
        return { success: true };
    }
}

// GitHub OAuth implementation
export async function signInWithGitHub() {
    // Build the OAuth URL and return it instead of performing a server redirect
    try {
        const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/github-callback`;
        const successUrl = encodeURIComponent(redirectUrl);
        const failureUrl = encodeURIComponent(redirectUrl);
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';

        const authUrl = `${endpoint}/account/sessions/oauth2/github?success=${successUrl}&failure=${failureUrl}`;
        return { url: authUrl };
    } catch (error) {
        console.error('GitHub OAuth build error:', error);
        return { error: error instanceof Error ? error.message : 'Failed to build GitHub OAuth URL.' };
    }
}

// Handle GitHub OAuth callback
export async function handleGitHubCallback(userId: string, secret: string) {
    try {
        const { account } = await createAdminClient();

        // Create session using the OAuth credentials from callback
        const session = await account.createSession(userId, secret);

        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });

        return { success: true, message: 'GitHub authentication successful' };
    } catch (error) {
        console.error('GitHub callback error:', error);
        return { error: error instanceof Error ? error.message : 'Failed to complete GitHub authentication' };
    }
}

