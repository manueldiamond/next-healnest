"use client";

import React from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Focus, Timer, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FocusPage() {
  const router = useRouter();

  const focusOptions = [
    {
      id: 'focus-vault',
      title: 'Focus Vault',
      description: 'Productivity and focus tools',
      icon: Target,
      onClick: () => router.push('/focus-vault'),
    },
    {
      id: 'timer',
      title: 'Focus Timer',
      description: 'Pomodoro and time management',
      icon: Timer,
      onClick: () => router.push('/timer'),
    },
  ];

  return (
    <div className="min-h-screen bg-azure pt-16 pb-20">
      <GlobalHeader 
        title="Focus"
        showLogo={false}
        showBackButton={true}
        showRightButton={false}
        onBackClick={() => router.back()}
      />
      
      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="space-y-4">
          {focusOptions.map((option) => {
            const Icon = option.icon;
            
            return (
              <button
                key={option.id}
                onClick={option.onClick}
                className="w-full bg-cardBg rounded-2xl p-6 flex flex-col items-center space-y-3 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="w-16 h-16 bg-chartPink rounded-2xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-cardBg" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
} 