'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function logout() {
  const supabase = await createClient();

  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
