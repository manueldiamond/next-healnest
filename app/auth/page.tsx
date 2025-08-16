"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent, HueCardHeader, HueCardTitle } from '@/components/ui/hue-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    avatar_url: '',
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Extended avatar options
  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Riley',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Avery',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Quinn',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Skyler',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Rowan',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Emery',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Blake',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Dakota',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=River',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sage',
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        router.push('/welcome');
      }
    };
    checkUser();
  }, [setUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          setUser(data.user);
          router.push('/welcome');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              avatar_url: formData.avatar_url,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          setUser(data.user);
          router.push('/onboarding');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        {/* Back Button */}
        <Link href="/">
          <button className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </Link>

        <div className="bg-cardBg rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-chartPink shadow-lg overflow-hidden mx-auto mb-4">
              <img 
                src="/logo.png" 
                alt="HealNest Logo" 
                className="w-12 h-12 object-contain"
                style={{
                  filter: 'invert(34%) sepia(10%) saturate(1012%) hue-rotate(110deg) brightness(90%) contrast(90%)',
                }}
              />
            </div>
            <h1 className="text-2xl font-heading font-semibold text-primary mb-2">
              {isLogin ? 'Welcome Back' : 'Join HealNest'}
            </h1>
            <p className="text-sm text-muted">
              {isLogin ? 'Sign in to your account' : 'Create your safe space account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-primary">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted" />
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-chartPink text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Choose Your Avatar</label>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/50 flex items-center justify-center">
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Selected avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg text-primary">?</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarModal(true)}
                      className="flex-1 bg-white/80 rounded-xl py-3 px-4 text-sm font-medium text-primary border border-white/20 hover:bg-white transition-colors"
                    >
                      {formData.avatar_url ? 'Change Avatar' : 'Select Avatar'}
                    </button>
                  </div>
                  {!formData.avatar_url && (
                    <p className="text-xs text-muted">
                      Please select an avatar to continue
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-chartPink text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-primary">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-chartPink text-sm"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || (!isLogin && !formData.avatar_url)}
            >
              {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted hover:text-primary transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowAvatarModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-80 max-w-[90vw] bg-cardBg rounded-3xl shadow-2xl border border-white/20">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-primary">Choose Your Avatar</h2>
                <button
                  onClick={() => setShowAvatarModal(false)}
                  className="w-8 h-8 bg-chartPink/20 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-chartPink/30"
                >
                  <X className="w-4 h-4 text-chartPink" />
                </button>
              </div>
              
              {/* Avatar Grid */}
              <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, avatar_url: avatar });
                      setShowAvatarModal(false);
                    }}
                    className={`w-16 h-16 rounded-xl border-2 transition-all hover:scale-110 ${
                      formData.avatar_url === avatar
                        ? 'border-chartPink scale-110'
                        : 'border-white/20 hover:border-chartPink/50'
                    }`}
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}