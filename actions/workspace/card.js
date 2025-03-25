'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '../../utils/supabase/server';

export async function getCardsByBoardId(board_id) {
  try {
    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      console.error('Auth error:', userError);
      return { error: 'Unauthorized' };
    }

    const { data: cards, error } = await supabase
      .from('cards')
      .select('*')
      .eq('board_id', board_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return { error: error.message };
    }

    return { data: cards };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function createCard(formData) {
  try {
    const title = formData.get('title');
    const column_id = formData.get('column_id');

    if (!title) {
      return { error: 'title required' };
    }

    const supabase = await createClient();

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data?.user) {
      return { error: 'Unauthorized' };
    }

    // Get the column to get board_id for validation
    const { data: column } = await supabase
      .from('columns')
      .select('board_id')
      .eq('id', column_id)
      .single();

    if (!column) {
      return { error: 'Column not found' };
    }

    const { data: highestPositionCard } = await supabase
      .from('cards')
      .select('position')
      .eq('column_id', column_id)
      .order('position', { ascending: false })
      .limit(1)
      .single();

    const newPosition = highestPositionCard
      ? highestPositionCard.position + 1
      : 0;

    const { data: card, error } = await supabase
      .from('cards')
      .insert({
        title: title.trim(),
        column_id: column_id,
        board_id: column.board_id,
        position: newPosition,
        created_by: data.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating card:', error);
      return { error: error.message };
    }

    // revalidate the path to update the UI
    // here https://nextjs.org/docs/app/api-reference/functions/revalidatePath
    revalidatePath(`/board/${column.board_id}`);
    return { data: card };
  } catch (error) {
    console.error('Unexpected error:', error);
    return { error: 'An unexpected error occurred' };
  }
}
