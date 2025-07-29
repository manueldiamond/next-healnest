"use client";

import React, { useState } from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Users, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HealPage() {
  const router = useRouter();
  const [isAnonymousNestsOpen, setIsAnonymousNestsOpen] = useState(false);

  const anonymousNests = [
    { id: 'anxiety', name: 'Anxiety Nest', description: 'Share and support anxiety struggles' },
    { id: 'overthinking', name: 'Overthinking Nest', description: 'For overthinkers and worriers' },
    { id: 'burnout', name: 'Burnout Nest', description: 'Dealing with work and life burnout' },
    { id: 'heartbreak', name: 'Heartbreak Nest', description: 'Healing from relationships' },
    { id: 'money-stress', name: 'Money Stress Nest', description: 'Financial anxiety and stress' },
  ];

  const healOptions = [
    {
      id: 'anonymous-nests',
      title: 'Anonymous Nests',
      description: 'Connect with others anonymously',
      icon: Users,
      onClick: () => setIsAnonymousNestsOpen(!isAnonymousNestsOpen),
    },
    {
      id: 'therapy-vault',
      title: 'Therapy Vault',
      description: 'Professional therapy resources',
      icon: Heart,
      onClick: () => router.push('/therapy-vault'),
    },
  ];

  return (
    <div className="min-h-screen bg-azure pt-16 pb-20">
      <GlobalHeader 
        title="Heal"
        showLogo={false}
        showBackButton={true}
        showRightButton={false}
        onBackClick={() => router.back()}
      />
      
      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="space-y-4">
          {healOptions.map((option) => {
            const Icon = option.icon;
            
            return (
              <div key={option.id}>
                <button
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
                  {option.id === 'anonymous-nests' && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {isAnonymousNestsOpen ? (
                        <ChevronUp className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  )}
                </button>
                
                {/* Anonymous Nests Dropdown */}
                {option.id === 'anonymous-nests' && isAnonymousNestsOpen && (
                  <div className="mt-4 space-y-2">
                    {anonymousNests.map((nest) => (
                      <button
                        key={nest.id}
                        onClick={() => router.push(`/chat/${nest.id}`)}
                        className="w-full bg-cardBg/80 rounded-xl p-4 flex items-center space-x-3 transition-all duration-200 hover:bg-cardBg hover:scale-105 active:scale-95"
                      >
                        <div className="w-10 h-10 bg-chartPink/60 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5 text-cardBg" />
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-primary">
                            {nest.name}
                          </h4>
                          <p className="text-xs text-muted">
                            {nest.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
} 