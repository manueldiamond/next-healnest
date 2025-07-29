"use client";

import React from 'react';
import { Home, Heart, Focus, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface BottomNavProps {
  activeTab?: 'home' | 'heal' | 'focus' | 'profile';
}

export function BottomNav({ activeTab }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab based on current path
  const getActiveTab = () => {
    if (pathname === '/dashboard') return 'home';
    if (pathname.startsWith('/heal')) return 'heal';
    if (pathname.startsWith('/focus')) return 'focus';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'home';
  };

  const currentActiveTab = activeTab || getActiveTab();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'heal', label: 'Heal', icon: Heart, path: '/heal' },
    { id: 'focus', label: 'Focus', icon: Focus, path: '/focus' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-cardBg backdrop-blur-md border-t border-white/20">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentActiveTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted hover:text-primary hover:bg-azure/50'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-muted'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-primary' : 'text-muted'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
} 