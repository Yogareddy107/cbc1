'use server';

import { createSessionClient } from '@/lib/appwrite';
import { revalidatePath } from 'next/cache';

export async function updateProfileName(name: string) {
    try {
        const { account } = await createSessionClient();
        await account.updateName(name);
        revalidatePath('/dashboard/profile');
        return { success: true };
    } catch (error: any) {
        console.error('Error in updateProfileName:', error);
        return { error: error.message || 'Failed to update name' };
    }
}

export async function updateProfilePassword(password: string) {
    try {
        const { account } = await createSessionClient();
        await account.updatePassword(password);
        return { success: true };
    } catch (error: any) {
        console.error('Error in updateProfilePassword:', error);
        return { error: error.message || 'Failed to update password' };
    }
}
