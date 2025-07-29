"use client";


import React from 'react';
import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const pathname = usePathname();
  
  // Check if we're on a chat route
  const isChatRoute = pathname.includes('/nest/') && pathname.includes('/chat');
  
  return (
    <main className={`flex-1 flex flex-col overflow-y-auto ${isChatRoute ? '' : 'pb-[80px]'}`}>
      {children}
    </main>
  );
} 