export const dynamic = 'force-dynamic';

import { workspace } from '@/actions/workspace';
import { BoardCard } from '@/components/cards';
import { CreateBoardCard } from '@/components/cards';
import Link from 'next/link';

export default async function Home() {
  const { data: workspaces, error } = await workspace.getWorkspacesWithBoards();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-full">
      <div className="space-y-8">
        {workspaces?.map((workspace) => (
          <div className="block" key={workspace.id}>
            <h1 className="text-2xl font-bold mb-4">{workspace.name}</h1>
            <div className="flex flex-wrap justify-start gap-4">
              {workspace.boards?.map((board) => (
                <Link key={board.id} href={`/board/${board.id}`}>
                  <BoardCard
                    title={board.title}
                    boardColor={board.background}
                  />
                </Link>
              ))}
              <CreateBoardCard workspaceId={workspace.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
