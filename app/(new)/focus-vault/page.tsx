"use client";
import React, { useState, useEffect } from 'react';
import { GlobalHeader } from '@/components/layout/global-header';
import { useRouter } from 'next/navigation';
import { Play, Music, Users, Pause } from 'lucide-react';
import { NowPlaying } from '@/components/ui/now-playing';

export default function FocusVaultPage() {
  const router = useRouter();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [originalTime] = useState(30 * 60); // Store original time for reset
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timeLeft]);

  const handleStartTimer = () => {
    if (timeLeft === 0) {
      // Reset timer if it's finished
      setTimeLeft(originalTime);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(originalTime);
  };

  const handleMusicToggle = () => {
    setIsMusicPlaying(!isMusicPlaying);
    setShowNowPlaying(true);
  };

  const handleCloseMusic = () => {
    setIsMusicPlaying(false);
    setShowNowPlaying(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-sand py-20">
      <GlobalHeader
        title="Focus Vault"
        showLogo={false}
        showBackButton={true}
        showRightButton={false}
        onBackClick={() => router.back()}
      />
      
      <div className="max-w-md mx-auto px-4 space-y-6">
        {/* Timer Card */}
        <div className="bg-cardBg rounded-2xl p-6 text-center">
          <div className="text-6xl font-bold text-primary mb-4">
            {formatTime(timeLeft)}
          </div>
          
          <div className="mb-6">
            <img
              src="/logo.png"
              alt="Plant"
              className="w-16 h-16 mx-auto"
              style={{
                filter: 'invert(34%) sepia(10%) saturate(1012%) hue-rotate(110deg) brightness(90%) contrast(90%)',
              }}
            />
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleStartTimer}
              className="w-full bg-primary text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Start Focus Session</span>
                </>
              )}
            </button>
            
            {timeLeft === 0 && (
              <button
                onClick={handleResetTimer}
                className="w-full bg-white/80 text-primary rounded-xl py-3 font-semibold border border-white/20 transition-all duration-200 hover:bg-white"
              >
                Reset Timer
              </button>
            )}
          </div>
        </div>

        {/* Focus Cards */}
        <div className="flex space-x-4">
          {/* Calming Music */}
          <button 
            onClick={handleMusicToggle}
            className="flex-1 bg-cardBg rounded-2xl p-4 flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <div className="w-12 h-12 bg-chartPink rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-cardBg" />
            </div>
            <span className="text-sm font-medium text-primary">Calming Music</span>
          </button>

          {/* Focusers */}
          <div className="flex-1 bg-cardBg rounded-2xl p-4 flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-chartPink rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-cardBg" />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-primary">5 nesters</div>
              <div className="text-xs text-muted">focusing</div>
            </div>
          </div>
        </div>
      </div>

      {/* Now Playing Component */}
      {showNowPlaying && (
        <NowPlaying
          isPlaying={isMusicPlaying}
          onToggle={handleMusicToggle}
          onClose={handleCloseMusic}
          title="Lo-Fi Focus"
          artist="Study Beats"
        />
      )}
    </div>
  );
} 