////
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

export async function getBoards() {
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

// get boards by workspace id; returns the workspace name as well
export async function getBoardsById(workspace_id) {
  try {
    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      console.error('Auth error:', userError);
      return { error: 'Unauthorized' };
    }

    const { data: boards, error } = await supabase
      .from('boards')
      .select('*')
      .eq('workspace_id', workspace_id)
      .order('created_at', { ascending: false });

    const { data: title, nameError } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', workspace_id)
      .single();

    if (error || nameError) {
      console.error('Database error:', error);
      return { error: error.message };
    }

    return { data: boards, title: title };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function getBoardTitle(board_id) {
  try {
    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      console.error('Auth error:', userError);
      return { error: 'Unauthorized' };
    }

    const { data: title, error } = await supabase
      .from('boards')
      .select('title')
      .eq('id', board_id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return { error: error.message };
    }

    return { data: title };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function createBoard(formData) {
  const title = formData.title;
  const background = formData.background;
  const workspace_id = formData.workspace_id;

  try {
    if (!workspace_id) {
      return { error: 'ws required' };
    }

    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      return { error: 'Unauthorized' };
    }

    const { data: board, error } = await supabase
      .from('boards')
      .insert({
        title: title,
        owner_id: data.user.id,
        workspace_id: workspace_id,
        background: background,
        visibility: 'public', // TODO: update this later when adding visibility options
        // furthermore check policies boards and board_members
      })
      .select();

    if (error) {
      return { error: error.message };
    }

    // here https://nextjs.org/docs/app/api-reference/functions/revalidatePath
    revalidatePath('/home');
    return { data: board };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
