import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/appwrite'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
    const { origin, searchParams } = new URL(request.url)
    const next = searchParams.get('next') ?? '/dashboard'

    // Appwrite OAuth redirects back with userId and secret as query params
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')

    if (!userId || !secret) {
        console.error('GitHub callback: Missing userId or secret in query params')
        return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent('GitHub authentication failed. Missing credentials.')}`
        )
    }

    try {
        // Use admin client to create a session from the OAuth credentials
        const { account } = await createAdminClient()
        const session = await account.createSession(userId, secret)

            // Set the session cookie so createSessionClient() works on subsequent requests
            ; (await cookies()).set('appwrite-session', session.secret, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
            })

        // Session is valid, redirect to dashboard
        return NextResponse.redirect(`${origin}${next}`)
    } catch (error: any) {
        console.error('GitHub callback error:', error)
        return NextResponse.redirect(
            `${origin}/login?error=${encodeURIComponent('GitHub authentication failed. Please try again.')}`
        )
    }
}
