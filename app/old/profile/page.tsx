"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, GraduationCap, Sparkles, Trophy, Edit, Save, X } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent, HueCardHeader, HueCardTitle } from '@/components/ui/hue-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { calculateAuraLevel, getAuraLevelName } from '@/lib/utils/anonymous-names';

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, setUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    university: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (userProfile) {
      setEditData({
        name: userProfile.name || '',
        bio: userProfile.bio || '',
        university: userProfile.university || '',
      });
    }
  }, [user, userProfile, router]);

  const handleSave = async () => {
    if (!user || !userProfile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: editData.name,
          bio: editData.bio,
          university: editData.university,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: userProfile?.name || '',
      bio: userProfile?.bio || '',
      university: userProfile?.university || '',
    });
    setIsEditing(false);
  };

  const getProgressToNextLevel = () => {
    if (!userProfile) return 0;
    const currentLevel = userProfile.aura_level;
    
    // Updated aura requirements (reduced by 8x)
    const levelThresholds = [0, 6, 25, 62, 125, 250];
    const pointsForCurrentLevel = levelThresholds[currentLevel - 1] || 0;
    const pointsForNextLevel = levelThresholds[currentLevel] || (currentLevel * 125);
    
    const progress = ((userProfile.aura_points - pointsForCurrentLevel) / (pointsForNextLevel - pointsForCurrentLevel)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-hue-gradient mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-hue-gradient shadow-lg overflow-hidden">
            <img src="/logo.png" alt="HealNest Logo" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-primary">My Profile</h1>
        </div>
        {!isEditing ? (
          <HueButton variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Edit className="w-5 h-5" />
          </HueButton>
        ) : (
          <div className="flex space-x-2">
            <HueButton variant="ghost" size="icon" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </HueButton>
            <HueButton size="icon" onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4" />
            </HueButton>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <HueCard>
        <HueCardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Avatar */}
            <Avatar className="w-20 h-20 mx-auto">
              {userProfile.avatar_url ? (
                <AvatarImage src={userProfile.avatar_url} alt="Profile avatar" />
              ) : (
                <AvatarFallback className="bg-hue-gradient text-white text-2xl">
                  {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              )}
            </Avatar>

            {/* Basic Info */}
            <div className="space-y-3">
              {isEditing ? (
                <div className="space-y-3 text-left">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="hue-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="university">University</Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="university"
                        value={editData.university}
                        onChange={(e) => setEditData({ ...editData, university: e.target.value })}
                        className="pl-10 hue-input"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      className="hue-input resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-primary">{userProfile.name}</h2>
                  <p className="text-muted-foreground">@{userProfile.username}</p>
                  {userProfile.bio && (
                    <p className="text-sm text-muted-foreground">{userProfile.bio}</p>
                  )}
                  {userProfile.university && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <GraduationCap className="w-4 h-4" />
                      <span>{userProfile.university}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </HueCardContent>
      </HueCard>

      {/* Aura Level Card */}
      <HueCard>
        <HueCardHeader>
          <HueCardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-accent-blue" />
            <span>Aura Level</span>
          </HueCardTitle>
        </HueCardHeader>
        <HueCardContent className="pt-0">
          <div className="space-y-4">
            {/* Level Badge */}
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-hue-gradient text-white px-4 py-2 rounded-2xl shadow-lg">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">
                  Level {userProfile.aura_level} - {getAuraLevelName(userProfile.aura_level)}
                </span>
              </div>
            </div>

            {/* Points & Progress */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Aura Points</span>
                <span className="font-semibold text-primary">{userProfile.aura_points}</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-accent-blue/20 rounded-full h-3">
                <div 
                  className="bg-accent-blue rounded-full h-3 transition-all duration-500"
                  style={{ width: `${getProgressToNextLevel()}%` }}
                />
              </div>
              
              <div className="text-center text-xs text-muted-foreground">
                {Math.round(getProgressToNextLevel())}% to Level {userProfile.aura_level + 1}
              </div>
            </div>

            {/* How to Gain Points */}
            <div className="bg-accent-yellow/20 p-4 rounded-2xl">
              <h4 className="font-semibold text-primary mb-2">Gain Aura Points by:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Sending messages (+5 points)</li>
                <li>• Replying to others (+3 points)</li>
                <li>• Getting upvoted by mods (+10 points)</li>
                <li>• Being helpful and positive (+15 points)</li>
              </ul>
            </div>
          </div>
        </HueCardContent>
      </HueCard>

      {/* Stats Card */}
      <HueCard>
        <HueCardHeader>
          <HueCardTitle>Your Stats</HueCardTitle>
        </HueCardHeader>
        <HueCardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Nests Joined</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">248</p>
              <p className="text-xs text-muted-foreground">Messages Sent</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">67</p>
              <p className="text-xs text-muted-foreground">Helpful Replies</p>
            </div>
          </div>
        </HueCardContent>
      </HueCard>

      {/* Anonymous Name Card */}
      <HueCard>
        <HueCardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-muted-foreground">Your anonymous name:</span>
              <span className="font-semibold text-primary bg-accent-blue/10 px-3 py-1 rounded-full text-sm">
                {userProfile.anonymous_name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              This is how you appear when posting anonymously
            </p>
          </div>
        </HueCardContent>
      </HueCard>
    </div>
  );
}