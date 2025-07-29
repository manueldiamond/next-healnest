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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-hue-gradient shadow-lg overflow-hidden mx-auto mb-4">
              <img src="/logo.png" alt="HealNest Logo" className="w-12 h-12 object-contain" />
            </div>
            <HueCardTitle className="text-2xl font-heading">
              {isLogin ? 'Welcome Back' : 'Join HealNest'}
            </HueCardTitle>
            <p className="text-body text-muted-foreground">
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
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-16 h-16">
                        {formData.avatar_url ? (
                          <AvatarImage src={formData.avatar_url} alt="Selected avatar" />
                        ) : (
                          <AvatarFallback className="bg-accent-blue/20 text-primary text-lg">
                            ?
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <HueButton
                        type="button"
                        variant="outline"
                        onClick={() => setShowAvatarModal(true)}
                        className="flex-1"
                      >
                        {formData.avatar_url ? 'Change Avatar' : 'Select Avatar'}
                      </HueButton>
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

      {/* Avatar Selection Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Your Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {avatarOptions.map((avatar, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setFormData({ ...formData, avatar_url: avatar });
                  setShowAvatarModal(false);
                }}
                className={`w-16 h-16 rounded-full border-2 transition-all hover:scale-110 ${
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
        </DialogContent>
      </Dialog>
    </div>
  );
}