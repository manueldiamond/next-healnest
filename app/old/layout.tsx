import { Navbar } from '@/components/layout/navbar';
import { PersistentHeader } from '@/components/layout/persistent-header';
import { MainContent } from '@/components/layout/main-content';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PersistentHeader />
      
      <MainContent>
        {children}
      </MainContent>
      <Navbar />
    </div>
  );
} 