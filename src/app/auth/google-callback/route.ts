import { NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/appwrite'

export async function GET(request: Request) {
    const { origin, searchParams } = new URL(request.url)
    const next = searchParams.get('next') ?? '/dashboard'

    try {
        // Appwrite has already created the session and set the cookie
        // Just verify the session is valid
        const { account } = await createSessionClient();
        await account.get(); // Verify user is authenticated
        
        // Session is valid, redirect to dashboard
        return NextResponse.redirect(`${origin}${next}`)
    } catch (error: any) {
        // No valid session, redirect to login with error
        console.error('Google callback error:', error);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Google authentication failed. Please try again.')}`)
    }
}
