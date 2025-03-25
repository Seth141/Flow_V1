import NavBar from '@/components/NavBar';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex flex-col h-dvh">
      <AnimatedBackground />
      {/* navbar (fixed across all authenticated pages) */}
      <div>
        <NavBar />
      </div>

      {/* full width content area without sidebar */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full h-full bg-theme-bg-main text-theme-text-body">
          {children}
        </div>
      </div>
    </div>
  );
}
