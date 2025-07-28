"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, User, LogOut, Sparkles, Shield } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, userProfile, setUser, setUserProfile } = useAuthStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setUser(null);
    setUserProfile(null);
  };

  if (!user || pathname === '/' || pathname === '/auth' || pathname === '/onboarding') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-white/20 shadow-lg z-50">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-around">
          <Link href="/chats">
            <div className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
              pathname === '/chats' ? 'bg-accent-blue/20 text-primary' : 'text-muted-foreground'
            }`}>
              <Home size={20} />
              <span className="text-xs font-medium">Chats</span>
            </div>
          </Link>
          
          <Link href="/profile">
            <div className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
              pathname === '/profile' ? 'bg-accent-blue/20 text-primary' : 'text-muted-foreground'
            }`}>
              <User size={20} />
              <span className="text-xs font-medium">Profile</span>
            </div>
          </Link>
          
          {userProfile?.role === 'admin' || userProfile?.role === 'super_admin' ? (
            <Link href="/admin/users">
              <div className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                pathname.startsWith('/admin') ? 'bg-accent-blue/20 text-primary' : 'text-muted-foreground'
              }`}>
                <Shield size={20} />
                <span className="text-xs font-medium">Admin</span>
              </div>
            </Link>
          ) : null}
          
          <button
            onClick={handleSignOut}
            className="flex flex-col items-center space-y-1 p-2 rounded-xl transition-all text-muted-foreground hover:text-destructive"
          >
            <LogOut size={20} />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}