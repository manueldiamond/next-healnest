"use client";
import React, { useState, useRef } from 'react';
import { X, Play, Pause } from 'lucide-react';

interface NowPlayingProps {
  isPlaying: boolean;
  onToggle: () => void;
  onClose: () => void;
  title?: string;
  artist?: string;
}

export function NowPlaying({ isPlaying, onToggle, onClose, title = "Lo-Fi Beats", artist = "Chill Vibes" }: NowPlayingProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleToggle = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    onToggle();
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src="https://stream.live.radio24.pt/radio24.mp3"
        loop
        onPlay={() => onToggle()}
        onPause={() => onToggle()}
      />
      
      {/* Now Playing Bar */}
      <div className="fixed bottom-20 left-0 right-0 z-50 bg-cardBg border-t border-white/20 backdrop-blur-md">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Music Info */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-chartPink rounded-xl flex items-center justify-center">
                <Play className="w-5 h-5 text-cardBg" />
              </div>
              <div>
                <div className="text-sm font-semibold text-primary">{title}</div>
                <div className="text-xs text-muted">{artist}</div>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleToggle}
                className="w-8 h-8 bg-chartPink rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-cardBg" />
                ) : (
                  <Play className="w-4 h-4 text-cardBg" />
                )}
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 