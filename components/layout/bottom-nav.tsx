"use client";

import React from 'react';
import { Home, Heart, Focus, TrendingUp, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'heal' | 'focus' | 'grow' | 'profile';
  onTabChange: (tab: 'home' | 'heal' | 'focus' | 'grow' | 'profile') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'heal', label: 'Heal', icon: Heart },
    { id: 'focus', label: 'Focus', icon: Focus },
    { id: 'grow', label: 'Grow', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  return (
    <div className="rounded-t-2xl fixed bottom-0 left-0 right-0 z-40 bg-cardBg backdrop-blur-md border-t border-white/20">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
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