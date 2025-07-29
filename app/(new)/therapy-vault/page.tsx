"use client";
import React, { useState } from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { useRouter } from 'next/navigation';
import { MessageCircle, Play, Music, Bot } from 'lucide-react';
import { NowPlaying } from '@/components/ui/now-playing';

export default function TherapyVaultPage() {
  const router = useRouter();
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  
  const therapyOptions = [
    {
      id: 'counselling',
      title: 'Counselling',
      description: 'Professional therapy sessions and guidance',
      icon: MessageCircle,
      onClick: () => router.push('/therapy-vault/counselling'),
    },
    {
      id: 'guided-exercises',
      title: 'Guided Exercises',
      description: 'Mindfulness and relaxation techniques',
      icon: Play,
      onClick: () => router.push('/therapy-vault/guided-exercises'),
    },
    {
      id: 'calming-music',
      title: 'Calming Music',
      description: 'Soothing sounds for stress relief',
      icon: Music,
      onClick: () => {
        setIsMusicPlaying(!isMusicPlaying);
        setShowNowPlaying(true);
      },
    },
    {
      id: 'ai-support',
      title: 'AI Support',
      description: '24/7 AI-powered mental health assistance',
      icon: Bot,
    },
  ];

  const handleMusicToggle = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  const handleCloseMusic = () => {
    setIsMusicPlaying(false);
    setShowNowPlaying(false);
  };

  return (
    <div className="min-h-screen bg-sand py-20">
      <GlobalHeader
        title="Therapy Vault"
        showLogo={false}
        showBackButton={true}
        showRightButton={false}
        onBackClick={() => router.back()}
      />
      
      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="space-y-4">
          {therapyOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={option.onClick || (() => {})}
                className="w-full bg-cardBg rounded-2xl p-4 flex items-center space-x-4 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-primary">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Now Playing Component */}
      {showNowPlaying && (
        <NowPlaying
          isPlaying={isMusicPlaying}
          onToggle={handleMusicToggle}
          onClose={handleCloseMusic}
          title="Calming Therapy"
          artist="Relaxation Sounds"
        />
      )}
    </div>
  );
} 