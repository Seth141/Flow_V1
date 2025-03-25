import flowLogo from '@/assets/images/flow-logo.png';
import Image from 'next/image';
import { logout } from '@/actions/authentication';

export default function NavBar({ className = '' }) {
  return (
    <nav
      className={`flex p-2 sticky top-0 z-10 w-full ${className} h-[48px] border-b`}
    >
      <div className="mr-4 flex items-center">
        <Image src={flowLogo} alt="Flow Logo" width={30} height={30} />
        <div>Flow</div>
      </div>

      <nav className="flex-1 flex">{/*Nav*/}</nav>

      <div className="flex items-center bg-black/20">
        <form action={logout} className="p-2">
          <button type="submit">Logout</button>
        </form>
      </div>
    </nav>
  );
}
