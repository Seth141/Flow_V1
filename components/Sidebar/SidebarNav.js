import Link from 'next/link';

export default function SidebarNav() {
  return (
    <div className="mb-6">
      <nav>
        <ul>
          <li>
            <Link
              href="/"
              className="flex items-center px-4 py-2 rounded hover:bg-gray-100/20 transition-colors"
            >
              Home
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
