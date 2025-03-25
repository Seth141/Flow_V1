import AnimatedBackground from '@/components/AnimatedBackground';

export default function AuthLayout({ children }) {
  return (
    <>
      <div className="text-white min-h-svh flex items-center justify-center">
        <AnimatedBackground />
        {children}
      </div>
    </>
  );
}
