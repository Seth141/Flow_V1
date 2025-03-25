export const dynamic = 'force-dynamic';

import { board } from '@/actions/workspace';
import Link from 'next/link';
import { CreateBoardCard, BoardCard } from '@/components/cards';
import { createClient } from '@/utils/supabase/server';

export default async function WorkspaceHomePage({ params }) {
  const { workspace_id } = await params;
  const { data: boards, title: title } =
    await board.getBoardsById(workspace_id);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{title?.name}</h1>

      <div className="flex flex-wrap justify-start gap-4">
        {/* display boards */}
        {boards?.map((board) => (
          <Link href={`/board/${board.id}`} key={board.id}>
            <BoardCard title={board.title} boardColor={board.background} />
          </Link>
        ))}

        {/* create board card function */}
        <CreateBoardCard workspaceId={workspace_id} />
      </div>
    </div>
  );
}
