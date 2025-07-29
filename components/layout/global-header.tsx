"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';

interface GlobalHeaderProps {
  title?: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  showRightButton?: boolean;
  rightButtonText?: string;
  onBackClick?: () => void;
  onRightClick?: () => void;
}

export function GlobalHeader({
  title = 'HealNest',
  showLogo = false,
  showBackButton = false,
  showRightButton = false,
  rightButtonText = 'More',
  onBackClick,
  onRightClick,
}: GlobalHeaderProps) {
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md ">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Back button or Logo */}
          <div className="flex items-center">
            {showBackButton ? (
              <button
                onClick={onBackClick || (() => router.back())}
                className="p-2 rounded-xl hover:bg-azure/50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-primary" />
              </button>
            ) : null}
          </div>

          {/* Center - Title */}
          <div className="flex-1 items-center flex justify-center gap-1  text-center">
            { showLogo &&
                <img
                  src="/logo.png"
                  alt="HealNest Logo"
                  className="w-12 h-12 object-contain"
                  style={{
                    filter:
                      'invert(34%) sepia(10%) saturate(1012%) hue-rotate(110deg) brightness(90%) contrast(90%)',
                  }}
                />
        }
            <h1 className="text-2xl font-heading font-medium text-primary">
              {title}
            </h1>
          </div>

          {/* Right side - Action button */}
          <div className="flex items-center">
            {showRightButton ? (
              <button
                onClick={onRightClick}
                className="p-2 rounded-xl hover:bg-azure/50 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5 text-primary" />
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 