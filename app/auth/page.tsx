"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent, HueCardHeader, HueCardTitle } from '@/components/ui/hue-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  // Pre-defined avatar options
  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        router.push('/chats');
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
          router.push('/chats');
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        {/* Back Button */}
        <Link href="/">
          <HueButton variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </HueButton>
        </Link>

        <HueCard>
          <HueCardHeader className="text-center">
            <HueCardTitle className="text-2xl">
              {isLogin ? 'Welcome Back' : 'Join HueNest'}
            </HueCardTitle>
            <p className="text-muted-foreground">
              {isLogin ? 'Sign in to your account' : 'Create your safe space account'}
            </p>
          </HueCardHeader>

          <HueCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="pl-10 hue-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Choose Your Avatar</Label>
                    <div className="grid grid-cols-4 gap-3">
                      {avatarOptions.map((avatar, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData({ ...formData, avatar_url: avatar })}
                          className={`w-16 h-16 rounded-full border-2 transition-all ${
                            formData.avatar_url === avatar
                              ? 'border-primary scale-110'
                              : 'border-gray-200 hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={avatar}
                            alt={`Avatar ${index + 1}`}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                    {!formData.avatar_url && (
                      <p className="text-xs text-muted-foreground">
                        Please select an avatar to continue
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 hue-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 hue-input"
                    required
                  />
                </div>
              </div>

              <HueButton 
                type="submit" 
                className="w-full" 
                disabled={loading || (!isLogin && !formData.avatar_url)}
              >
                {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
              </HueButton>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </HueCardContent>
        </HueCard>
      </div>
    </div>
  );
}