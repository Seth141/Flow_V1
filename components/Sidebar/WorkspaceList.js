import Link from 'next/link';
import { workspace } from '@/actions/workspace/';

export default async function WorkspaceList() {
  const workspaces = await workspace.getWorkspacesWithBoards();

  return (
    <div>
      <h2 className="text-sm font-medium px-4 mb-2">Workspaces</h2>
      <div className="px-[16px] w-[vw]">
        {!workspaces || workspaces.length === 0 ? (
          <div>
            <p>No workspaces yet. Create your first workspace!</p>
          </div>
        ) : (
          workspaces?.data.map((workspace) => (
            <div key={workspace.id} className="mb-4">
              <h3 className="">{workspace.name}</h3>
              <Link
                href={`/workspace/${workspace.id}/home`}
                className="flex items-center px-3 py-1.5 rounded hover:bg-gray-100/20 transition-colors"
              >
                Boards
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
