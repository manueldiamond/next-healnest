import { Navbar } from '@/components/layout/navbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen max-h-screen h-screen flex flex-col">
      <main className="flex-1 flex flex-col overflow-y-auto pb-[80px]">
        {children}
      </main>
      <Navbar />
    </div>
  );
} 