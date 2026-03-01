import { NextResponse } from 'next/server'
import { createSessionClient } from '@/lib/appwrite'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)

    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/dashboard'

    try {
        const { account } = await createSessionClient();
        const user = await account.get();
        if (user) {
            return NextResponse.redirect(`${origin}${next}`)
        }
    } catch (e) {
        // Not logged in or session expired
    }

    // return the user to an error page or login
    return NextResponse.redirect(`${origin}/login`)
}

