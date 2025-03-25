import SidebarNav from './SidebarNav';
import WorkspaceList from './WorkspaceList';

export default function Sidebar() {
  return (
    <div className="font-medium text-sm text-gray-100 flex flex-col">
      <SidebarNav />
      <WorkspaceList />
    </div>
  );
}
