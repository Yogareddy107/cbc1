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

// GitHub OAuth implementation
export async function signInWithGitHub() {
    try {
        const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/github-callback`;
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';

        // Appwrite will handle the OAuth flow and redirect back to the success URL
        // Appwrite creates the session internally before redirecting
        const authUrl = `${endpoint}/account/sessions/oauth2/github?success=${encodeURIComponent(redirectUrl)}&failure=${encodeURIComponent(redirectUrl)}`;
        return { url: authUrl };
    } catch (error: any) {
        console.error('GitHub OAuth error:', error);
        return { error: error.message || 'Failed to initiate GitHub login.' };
    }
}

// Google OAuth implementation
export async function signInWithGoogle() {
    try {
        const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/google-callback`;
        const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';

        // Appwrite will handle the OAuth flow and redirect back to the success URL
        // Appwrite creates the session internally before redirecting
        const authUrl = `${endpoint}/account/sessions/oauth2/google?success=${encodeURIComponent(redirectUrl)}&failure=${encodeURIComponent(redirectUrl)}`;
        return { url: authUrl };
    } catch (error: any) {
        console.error('Google OAuth error:', error);
        return { error: error.message || 'Failed to initiate Google login.' };
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
    } catch (error: any) {
        console.error('GitHub callback error:', error);
        return { error: error.message || 'Failed to complete GitHub authentication' };
    }
}

