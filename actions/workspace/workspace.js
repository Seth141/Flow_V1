'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { cache } from 'react';

export async function getWorkspaces() {
  try {
    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      console.error('Auth error:', userError);
      return { error: 'Unauthorized' };
    }

    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('owner_id', data.user.id) // owner_id for now; yet to implement all roles
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return { error: error.message };
    }

    return { data: workspaces };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getWorkspaceById(workspace_id) {
  try {
    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      console.error('Auth error:', userError);
      return { error: 'Unauthorized' };
    }

    const { data: workspace, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('id', workspace_id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return { error: error.message };
    }

    return { data: workspace };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// This will be cached per request
export const getWorkspacesWithBoards = cache(async () => {
  try {
    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      console.error('Auth error:', userError);
      return { error: 'Unauthorized' };
    }

    const { data: workspaces, error } = await supabase
      .from('workspaces')
      .select(
        `
      id, 
      name, 
      description,
      boards(id, title, description, background)
    `
      )
      .eq('owner_id', data.user.id); // owner_id for now; yet to implement all roles

    if (error) {
      console.error('Database error:', error);
      return { error: error.message };
    }

    return { data: workspaces };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
});

export async function createWorkspace(formData) {
  try {
    const name = formData.get('name');
    const description = formData.get('description');

    if (!name) {
      return { error: 'ws required' };
    }

    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      return { error: 'Unauthorized' };
    }

    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert([
        {
          name,
          description,
          user_id: data.user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    // here https://nextjs.org/docs/app/api-reference/functions/revalidatePath
    revalidatePath('/workspaces');

    return { data: workspace };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
