import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)

    // OAuth parameters from Appwrite redirect after GitHub authentication
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')
    const next = searchParams.get('next') ?? '/dashboard'

    try {
        // GitHub OAuth was successful - userId and secret are provided by Appwrite
        if (userId && secret) {
            const { account } = await createAdminClient();

            try {
                // Create a session with the OAuth credentials from GitHub
                const session = await account.createSession(userId, secret);

                (await cookies()).set('appwrite-session', session.secret, {
                    path: '/',
                    httpOnly: true,
                    sameSite: 'strict',
                    secure: true,
                });

                return NextResponse.redirect(`${origin}${next}`)
            } catch (sessionError) {
                const message = sessionError instanceof Error ? sessionError.message : 'Unknown session error';
                console.error('Session creation error:', sessionError);
                return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Failed to create session: ' + message)}`)
            }
        }

        // No userId/secret means authentication failed
        const error = searchParams.get('error') || 'GitHub authentication failed'
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`)
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Authentication failed';
        console.error('GitHub callback error:', e);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(message)}`)
    }
}
