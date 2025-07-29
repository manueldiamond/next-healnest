"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Sparkles, Users, ArrowRight } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent, HueCardHeader, HueCardTitle } from '@/components/ui/hue-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { generateAnonymousName } from '@/lib/utils/anonymous-names';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUserProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    university: '',
    bio: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const createProfile = async (useDefaults = false) => {
    if (!user) return;

    setLoading(true);

    try {
      const anonymousName = generateAnonymousName();
      const userData = user.user_metadata;
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email!,
          name: userData.username || '',
          username: userData.username || '',
          bio: useDefaults ? '' : profileData.bio,
          university: useDefaults ? '' : profileData.university,
          avatar_url: userData.avatar_url || '',
          role: 'user',
          aura_points: 0,
          aura_level: 1,
          is_anonymous: false,
          anonymous_name: anonymousName,
        })
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      router.push('/chats');
    } catch (error: any) {
      console.error('Profile creation error:', error);
      alert(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProfile(false);
  };

  const handleSkip = async () => {
    await createProfile(true);
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-chartPink shadow-lg overflow-hidden">
            <img 
              src="/logo.png" 
              alt="HealNest Logo" 
              className="w-12 h-12 object-contain"
              style={{
                filter: 'invert(34%) sepia(10%) saturate(1012%) hue-rotate(110deg) brightness(90%) contrast(90%)',
              }}
            />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-heading font-bold text-primary">Welcome to HealNest!</h1>
            <p className="text-sm text-muted">
              Let's set up your profile and get you connected with your university community.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-cardBg rounded-2xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Safe Group Spaces</h3>
                  <p className="text-sm text-muted">Join Nests with like-minded students</p>
                </div>
              </div>
            </div>

            <div className="bg-cardBg rounded-2xl p-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Aura System</h3>
                  <p className="text-sm text-muted">Level up through positive interactions</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setStep(2)} 
            className="w-full bg-primary text-white rounded-xl py-4 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            Continue Setup
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-cardBg rounded-2xl p-6 shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-heading font-semibold text-primary mb-2">Complete Your Profile</h1>
            <p className="text-sm text-muted">
              Help us connect you with the right community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="university" className="text-sm font-medium text-primary">University (Optional)</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted" />
                <input
                  id="university"
                  name="university"
                  type="text"
                  placeholder="Which university do you attend?"
                  value={profileData.university}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-chartPink text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-primary">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us a bit about yourself..."
                value={profileData.bio}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/80 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-chartPink text-sm resize-none"
                rows={3}
              />
            </div>

            <div className="bg-yellow/20 p-4 rounded-xl">
              <p className="text-sm text-primary">
                <strong>Pro tip:</strong> You can always use anonymous mode in chats to express yourself freely!
              </p>
            </div>

            <div className="space-y-3">
              <button 
                type="submit" 
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Creating Profile...' : 'Complete Setup'}
              </button>
              
              <button 
                type="button" 
                onClick={handleSkip}
                disabled={loading}
                className="w-full bg-white/80 text-primary rounded-xl py-3 font-semibold border border-white/20 transition-all duration-200 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Profile...' : 'Skip for Now'}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="w-full text-primary hover:text-primary/80 transition-colors"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}