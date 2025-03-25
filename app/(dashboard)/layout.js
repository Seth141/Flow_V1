import NavBar from '@/components/NavBar';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function WithSidebarLayout({ children, sidebar }) {
  return (
    <>
      <AnimatedBackground />

      <div className="flex flex-col h-dvh">
        {/* navbar (fixed across all (dashboard) pages) */}
        <div>
          <NavBar />
        </div>

        {/* body container (main content area) */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center h-dvh text-theme-text-body">
            <div className="w-[288px] h-full px-4 sticky top-[48px] mt-[40px] rounded-lg">
              {sidebar}
            </div>

            <div className="overflow-y-auto flex-1 mx-4 max-w-[825px] mt-[40px] bg-theme-bg-main text-theme-text-body">
              <div className="bg-ctp-mantle">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
