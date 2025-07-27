"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, Crown, Eye, MessageCircle } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent, HueCardHeader, HueCardTitle } from '@/components/ui/hue-card';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

interface NestDetails {
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  member_count: number;
  is_private: boolean;
  created_at: string;
}

export default function NestProfilePage() {
  const router = useRouter();
  const params = useParams();
  const nestId = params.id as string;
  const { user } = useAuthStore();
  const [nest, setNest] = useState<NestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    fetchNestDetails();
  }, [nestId, user, router]);

  const fetchNestDetails = async () => {
    try {
      const { data: nestData, error } = await supabase
        .from('nests')
        .select('*')
        .eq('id', nestId)
        .single();

      if (error) throw error;
      setNest(nestData);

      // Check if user is a member
      const { data: memberData } = await supabase
        .from('nest_members')
        .select('*')
        .eq('nest_id', nestId)
        .eq('user_id', user?.id)
        .single();

      setIsMember(!!memberData);
    } catch (error) {
      console.error('Error fetching nest details:', error);
      router.push('/chats');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinNest = async () => {
    if (!user || !nest) return;

    try {
      const { error } = await supabase
        .from('nest_members')
        .insert({
          nest_id: nest.id,
          user_id: user.id,
          role: 'member',
        });

      if (error) throw error;

      // Update member count
      await supabase
        .from('nests')
        .update({ member_count: nest.member_count + 1 })
        .eq('id', nest.id);

      setIsMember(true);
      setNest({ ...nest, member_count: nest.member_count + 1 });
    } catch (error) {
      console.error('Error joining nest:', error);
    }
  };

  const handleEnterChat = () => {
    router.push(`/nest/${nestId}/chat`);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-hue-gradient mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading nest...</p>
        </div>
      </div>
    );
  }

  if (!nest) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-2">Nest not found</h2>
          <p className="text-muted-foreground mb-4">This nest might have been removed or doesn't exist.</p>
          <HueButton onClick={() => router.push('/chats')}>
            Back to Chats
          </HueButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <HueButton variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </HueButton>
        <h1 className="text-xl font-bold text-primary">Nest Profile</h1>
      </div>

      {/* Nest Profile Card */}
      <HueCard>
        <HueCardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Avatar */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-hue-gradient shadow-xl">
              <span className="text-white font-bold text-xl">
                {getInitials(nest.name.replace(/[^\w\s]/g, ''))}
              </span>
            </div>

            {/* Name & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">{nest.name}</h2>
              <p className="text-muted-foreground">{nest.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-accent-blue/10 mx-auto mb-1">
                  <Crown className="w-5 h-5 text-accent-blue" />
                </div>
                <p className="text-sm font-semibold text-primary">2</p>
                <p className="text-xs text-muted-foreground">Mods Online</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-accent-blue/10 mx-auto mb-1">
                  <Eye className="w-5 h-5 text-accent-blue" />
                </div>
                <p className="text-sm font-semibold text-primary">{Math.floor(nest.member_count * 0.3)}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-accent-blue/10 mx-auto mb-1">
                  <Users className="w-5 h-5 text-accent-blue" />
                </div>
                <p className="text-sm font-semibold text-primary">{nest.member_count}</p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
            </div>

            {/* Engagement Score */}
            <div className="bg-accent-yellow/20 p-4 rounded-2xl">
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="font-semibold text-primary">
                  Engagement Score: {Math.floor(Math.random() * 30) + 70}/100
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Very active community with positive vibes
              </p>
            </div>
          </div>
        </HueCardContent>
      </HueCard>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isMember ? (
          <HueButton onClick={handleEnterChat} size="lg" className="w-full">
            <MessageCircle className="w-5 h-5 mr-2" />
            Enter Chat
          </HueButton>
        ) : (
          <HueButton onClick={handleJoinNest} size="lg" className="w-full">
            <Users className="w-5 h-5 mr-2" />
            Join Nest
          </HueButton>
        )}
        
        <HueButton variant="outline" onClick={() => router.back()} className="w-full">
          Back to Chats
        </HueButton>
      </div>

      {/* Community Guidelines */}
      <HueCard>
        <HueCardHeader>
          <HueCardTitle className="text-lg">Community Guidelines</HueCardTitle>
        </HueCardHeader>
        <HueCardContent className="pt-0">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Be kind and respectful to all members</li>
            <li>• Use anonymous mode if you need to express sensitive thoughts</li>
            <li>• Report any inappropriate behavior to moderators</li>
            <li>• Focus on wellness and positive interactions</li>
            <li>• Help others level up their aura through support</li>
          </ul>
        </HueCardContent>
      </HueCard>
    </div>
  );
}