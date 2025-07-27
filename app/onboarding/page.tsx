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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          name: userData.name || '',
          username: userData.username || '',
          bio: profileData.bio,
          university: profileData.university,
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

  if (step === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-hue-gradient shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-primary">Welcome to HueNest!</h1>
            <p className="text-muted-foreground">
              Let's set up your profile and get you connected with your university community.
            </p>
          </div>

          <div className="space-y-4">
            <HueCard className="p-4 text-left">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-accent-blue" />
                <div>
                  <h3 className="font-semibold">Safe Group Spaces</h3>
                  <p className="text-sm text-muted-foreground">Join Nests with like-minded students</p>
                </div>
              </div>
            </HueCard>

            <HueCard className="p-4 text-left">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-accent-blue" />
                <div>
                  <h3 className="font-semibold">Aura System</h3>
                  <p className="text-sm text-muted-foreground">Level up through positive interactions</p>
                </div>
              </div>
            </HueCard>
          </div>

          <HueButton onClick={() => setStep(2)} size="lg" className="w-full">
            Continue Setup
            <ArrowRight className="w-5 h-5 ml-2" />
          </HueButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-6">
        <HueCard>
          <HueCardHeader className="text-center">
            <HueCardTitle className="text-2xl">Complete Your Profile</HueCardTitle>
            <p className="text-muted-foreground">
              Help us connect you with the right community
            </p>
          </HueCardHeader>

          <HueCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="university"
                    name="university"
                    type="text"
                    placeholder="Which university do you attend?"
                    value={profileData.university}
                    onChange={handleInputChange}
                    className="pl-10 hue-input"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself..."
                  value={profileData.bio}
                  onChange={handleInputChange}
                  className="hue-input resize-none"
                  rows={3}
                />
              </div>

              <div className="bg-accent-yellow/20 p-4 rounded-xl">
                <p className="text-sm text-primary">
                  <strong>Pro tip:</strong> You can always use anonymous mode in chats to express yourself freely!
                </p>
              </div>

              <div className="space-y-3">
                <HueButton type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Profile...' : 'Complete Setup'}
                </HueButton>
                
                <HueButton 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Back
                </HueButton>
              </div>
            </form>
          </HueCardContent>
        </HueCard>
      </div>
    </div>
  );
}