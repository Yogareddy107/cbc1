import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/appwrite';

export async function POST(request: NextRequest) {
  try {
    const { email, redirectUrl } = await request.json();
    if (!email || !redirectUrl) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const { users, account } = await createAdminClient();

    // Find user by email
    const list = await users.list();
    const found = list.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!found) {
      return NextResponse.json({ success: true, message: 'If the email exists, a recovery link will be sent.' });
    }

    // createRecovery requires userId and redirect URL
    await account.createRecovery(found.$id, redirectUrl);

    return NextResponse.json({ success: true, message: 'Recovery email sent (if the address exists).' });
  } catch (error) {
    console.error('Recovery error:', error);
    return NextResponse.json({ error: 'Failed to initiate recovery' }, { status: 500 });
  }
}
