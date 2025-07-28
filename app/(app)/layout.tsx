import { Navbar } from '@/components/layout/navbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Persistent Logo Header */}
      <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-hue-gradient shadow-lg overflow-hidden">
              <img src="/logo.png" alt="HealNest Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="ml-3 text-lg font-bold bg-gradient-to-r from-accent-dark to-accent-pink bg-clip-text text-transparent">
              HueNest
            </span>
          </div>
        </div>
      </div>
      
      <main className="flex-1 flex flex-col overflow-y-auto pb-[80px] pt-[80px]">
        {children}
      </main>
      <Navbar />
    </div>
  );
} 