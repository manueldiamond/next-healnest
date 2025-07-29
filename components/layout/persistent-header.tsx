"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PersistentHeader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Routes where the header should be hidden initially
  const hiddenRoutes = ['','/admin', '/profile', '/nest'];
  const shouldHide = true // hiddenRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 80; // Show after scrolling 80px
      
      setIsScrolled(scrollTop > 0);
      setLastScrollY(scrollTop);
      
      if (shouldHide) {
        // For hidden routes, show header when scrolled down
        setIsVisible(scrollTop > scrollThreshold);
      } else {
        // For other routes, always show header
        setIsVisible(true);
      }
    };

    // Set initial state
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldHide]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/80 border-b border-white/20 transition-all duration-500 ease-in-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-[-100%] opacity-0'
      }`}
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-hue-gradient shadow-lg overflow-hidden">
            <img src="/logo.png" alt="HealNest Logo" className="w-6 h-6 object-contain" />
          </div>
          <span className="ml-3 text-lg font-heading font-bold bg-gradient-to-r from-accent-dark to-accent-pink bg-clip-text text-transparent">
            HealNest
          </span>
        </div>
      </div>
    </div>
  );
} 