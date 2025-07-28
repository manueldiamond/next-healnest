"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Users, Sparkles, ChevronRight } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent } from '@/components/ui/hue-card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Nest {
  id: string;
  name: string;
  description: string;
  avatar_url: string | null;
  member_count: number;
  last_message?: {
    content: string;
    created_at: string;
    user_name: string;
  };
}

export default function ChatsPage() {
  const router = useRouter();
  const { user, setUser, userProfile, setUserProfile } = useAuthStore();
  const [nests, setNests] = useState<Nest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  // Console log user role (if available in userProfile)
  useEffect(() => {
    if (userProfile && userProfile.role) {
      console.log('User role:', userProfile.role);
    } else if (userProfile) {
      console.log('User profile loaded, but no role property found:', userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);

      // Get user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (!profile) {
        router.push('/onboarding');
        return;
      }
      
      setUserProfile(profile);
      fetchNests();
    };

    checkAuth();
  }, [router, setUser, setUserProfile]);

  const fetchNests = async () => {
    try {
      // For demo purposes, create some sample nests if none exist
      const { data: existingNests } = await supabase.from('nests').select('*');


      if (!existingNests || existingNests.length === 0) {
        // Create sample nests
        const sampleNests = [
          {
            name: 'Study Buddies 📚',
            description: 'Find study partners and share tips for academic success',
            is_private: false,
            member_count: 24,
            created_by: user?.id || '',
          },
          {
            name: 'Mental Health Support 💜',
            description: 'A safe space to talk about mental health and wellness',
            is_private: false,
            member_count: 18,
            created_by: user?.id || '',
          },
        ];

        await supabase.from('nests').insert(sampleNests);
      }

      // Fetch all nests
      const { data: nestsData, error } = await supabase
        .from('nests')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNests(nestsData || []);
    } catch (error) {
      console.error('Error fetching nests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNests = nests.filter(nest =>
    nest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nest.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading your nests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-hue-gradient shadow-lg overflow-hidden mx-auto">
          <img src="/logo.png" alt="HealNest Logo" className="w-12 h-12 object-contain" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-heading font-bold text-primary">Your Nests</h1>
          <p className="text-body text-muted-foreground">
            Welcome back, {userProfile?.name || 'friend'}! 
            {userProfile && (
              <span className="block text-sm text-accent-blue">
                Aura Level {userProfile.aura_level} • {userProfile.aura_points} points
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search nests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 hue-input"
        />
      </div>

      {/* Nests List */}
      <div className="flex gap-3 flex-col">
        {filteredNests.map((nest) => (
          <Link key={nest.id} href={`/nest/${nest.id}`}>
            <HueCard className="p-4 cursor-pointer hover:scale-[1.02] transition-transform">
              <HueCardContent className="pt-0">
                <div className="flex items-center space-x-4">
                  {/* Avatar */}
                  <Avatar className="w-12 h-12 flex-shrink-0">
                    {nest.avatar_url ? (
                      <AvatarImage src={nest.avatar_url} alt="Nest avatar" />
                    ) : (
                      <AvatarFallback className="bg-hue-gradient text-white font-bold text-sm">
                        {getInitials(nest.name.replace(/[^\w\s]/g, ''))}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary truncate">
                      {nest.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {nest?.last_message?.content || nest.description}
                    </p>
                  </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
              </HueCardContent>
            </HueCard>
          </Link>
        ))}
      </div>

      {filteredNests.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-primary mb-2">No nests found</h3>
          <p className="text-muted-foreground text-sm">
            {searchQuery ? 'Try a different search term' : 'Create your first nest to get started'}
          </p>
        </div>
      )}

      {/* Create Nest FAB */}
 {(userProfile.role === 'admin' || userProfile.role === 'super_admin') &&
      <div className="fixed bottom-32 right-4 z-50">
        <HueButton 
          size="icon" 
          className="w-14 h-14 rounded-full shadow-xl hover:scale-110 transition-transform"
          onClick={() => router.push('/chats/create')}
        >
          <Plus className="w-6 h-6" />
        </HueButton>
      </div>}
    </div>
  );
}