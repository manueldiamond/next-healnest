"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, Crown, Eye, MessageCircle, Trash2, Edit, Plus, MoreVertical } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent, HueCardHeader, HueCardTitle } from '@/components/ui/hue-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { MemberActions } from '@/components/ui/member-actions';
import { ModeratorSelector } from '@/components/ui/moderator-selector';

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
  const { user, userProfile } = useAuthStore();
  const [nest, setNest] = useState<NestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModeratorModal, setShowModeratorModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    avatar_url: '',
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Nest avatar options - Fancy icons for different nest types
  const nestAvatarOptions = [
    // Mental Health & Wellness
    'https://api.dicebear.com/7.x/icons/svg?seed=anxiety&backgroundColor=ffe2f1&icon=heart',
    'https://api.dicebear.com/7.x/icons/svg?seed=depression&backgroundColor=a5c8e4&icon=cloud',
    'https://api.dicebear.com/7.x/icons/svg?seed=stress&backgroundColor=f9f0c1&icon=zap',
    'https://api.dicebear.com/7.x/icons/svg?seed=burnout&backgroundColor=ff6b6b&icon=flame',
    'https://api.dicebear.com/7.x/icons/svg?seed=overthinking&backgroundColor=4ecdc4&icon=brain',
    'https://api.dicebear.com/7.x/icons/svg?seed=loneliness&backgroundColor=45b7d1&icon=users',
    
    // Academic & Study
    'https://api.dicebear.com/7.x/icons/svg?seed=study&backgroundColor=96ceb4&icon=book',
    'https://api.dicebear.com/7.x/icons/svg?seed=exam&backgroundColor=ffeaa7&icon=target',
    'https://api.dicebear.com/7.x/icons/svg?seed=deadline&backgroundColor=dda0dd&icon=clock',
    'https://api.dicebear.com/7.x/icons/svg?seed=procrastination&backgroundColor=fdcb6e&icon=hourglass',
    
    // Financial & Money
    'https://api.dicebear.com/7.x/icons/svg?seed=money&backgroundColor=00b894&icon=dollar-sign',
    'https://api.dicebear.com/7.x/icons/svg?seed=budget&backgroundColor=74b9ff&icon=calculator',
    'https://api.dicebear.com/7.x/icons/svg?seed=debt&backgroundColor=e17055&icon=credit-card',
    'https://api.dicebear.com/7.x/icons/svg?seed=investing&backgroundColor=6c5ce7&icon=trending-up',
    
    // Relationships & Social
    'https://api.dicebear.com/7.x/icons/svg?seed=heartbreak&backgroundColor=fd79a8&icon=heart-off',
    'https://api.dicebear.com/7.x/icons/svg?seed=friendship&backgroundColor=a29bfe&icon=users',
    'https://api.dicebear.com/7.x/icons/svg?seed=family&backgroundColor=fd79a8&icon=home',
    'https://api.dicebear.com/7.x/icons/svg?seed=dating&backgroundColor=00cec9&icon=heart',
    
    // Career & Work
    'https://api.dicebear.com/7.x/icons/svg?seed=career&backgroundColor=636e72&icon=briefcase',
    'https://api.dicebear.com/7.x/icons/svg?seed=interview&backgroundColor=2d3436&icon=user-check',
    'https://api.dicebear.com/7.x/icons/svg?seed=workplace&backgroundColor=0984e3&icon=building',
    'https://api.dicebear.com/7.x/icons/svg?seed=entrepreneur&backgroundColor=fdcb6e&icon=zap',
    
    // Physical Health
    'https://api.dicebear.com/7.x/icons/svg?seed=fitness&backgroundColor=00b894&icon=activity',
    'https://api.dicebear.com/7.x/icons/svg?seed=nutrition&backgroundColor=fdcb6e&icon=apple',
    'https://api.dicebear.com/7.x/icons/svg?seed=sleep&backgroundColor=6c5ce7&icon=moon',
    'https://api.dicebear.com/7.x/icons/svg?seed=meditation&backgroundColor=00cec9&icon=feather',
    
    // Creative & Hobbies
    'https://api.dicebear.com/7.x/icons/svg?seed=art&backgroundColor=e84393&icon=palette',
    'https://api.dicebear.com/7.x/icons/svg?seed=music&backgroundColor=a29bfe&icon=music',
    'https://api.dicebear.com/7.x/icons/svg?seed=writing&backgroundColor=74b9ff&icon=pen-tool',
    'https://api.dicebear.com/7.x/icons/svg?seed=gaming&backgroundColor=6c5ce7&icon=gamepad-2',
    
    // Support & Recovery
    'https://api.dicebear.com/7.x/icons/svg?seed=recovery&backgroundColor=00b894&icon=leaf',
    'https://api.dicebear.com/7.x/icons/svg?seed=support&backgroundColor=fd79a8&icon=shield',
    'https://api.dicebear.com/7.x/icons/svg?seed=therapy&backgroundColor=74b9ff&icon=heart-pulse',
    'https://api.dicebear.com/7.x/icons/svg?seed=growth&backgroundColor=fdcb6e&icon=sprout',
  ];
  const [moderators, setModerators] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

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

      // Fetch moderators
      const { data: moderatorsData, error: moderatorsError } = await supabase
        .from('nest_members')
        .select(`
          *,
          user:users(name, username, avatar_url)
        `)
        .eq('nest_id', nestId)
        .in('role', ['moderator', 'admin']);

      if (!moderatorsError) {
        setModerators(moderatorsData || []);
      }

      // Fetch all members
      const { data: membersData, error: membersError } = await supabase
        .from('nest_members')
        .select(`
          *,
          user:users(name, username, avatar_url, aura_level)
        `)
        .eq('nest_id', nestId);

      if (!membersError) {
        setMembers(membersData || []);
      }

      // Initialize edit data
      setEditData({
        name: nestData.name,
        description: nestData.description,
        avatar_url: nestData.avatar_url || '',
      });
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

  const handleEditNest = async () => {
    if (!nest || !userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'super_admin')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('nests')
        .update({
          name: editData.name,
          description: editData.description,
          avatar_url: editData.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', nestId);

      if (error) throw error;

      if (nest) {
        setNest({ ...nest, ...editData });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating nest:', error);
      alert('Failed to update nest. Please try again.');
    }
  };

  const handleDeleteNest = async () => {
    if (!userProfile || (userProfile.role !== 'admin' && userProfile.role !== 'super_admin')) {
      return;
    }

    if (!confirm('Are you sure you want to delete this nest? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete all messages in the nest
      await supabase
        .from('messages')
        .delete()
        .eq('nest_id', nestId);

      // Delete all nest members
      await supabase
        .from('nest_members')
        .delete()
        .eq('nest_id', nestId);

      // Delete the nest
      await supabase
        .from('nests')
        .delete()
        .eq('id', nestId);

      router.push('/chats');
    } catch (error) {
      console.error('Error deleting nest:', error);
      alert('Failed to delete nest. Please try again.');
    }
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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <HueButton variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </HueButton>
          <h1 className="text-xl font-bold text-primary">Nest Profile</h1>
        </div>
        
        {/* Admin Edit Button */}
        {(userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
          <HueButton 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-5 h-5" />
          </HueButton>
        )}
      </div>

      {/* Nest Profile Card */}
      <HueCard>
        <HueCardContent className="pt-6">
          <div className="text-center space-y-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-20 h-20 mx-auto">
                {nest.avatar_url ? (
                  <AvatarImage src={nest.avatar_url} alt="Nest avatar" />
                ) : (
                  <AvatarFallback className="bg-hue-gradient text-white text-xl">
                    {getInitials(nest.name.replace(/[^\w\s]/g, ''))}
                  </AvatarFallback>
                )}
              </Avatar>
              {isEditing && (
                <HueButton
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                >
                  <Edit className="w-3 h-3" />
                </HueButton>
              )}
            </div>

            {/* Name & Description */}
            <div className="space-y-2">
              {isEditing ? (
                <div className="space-y-3 text-left">
                  <div>
                    <Label htmlFor="nest-name">Nest Name</Label>
                    <Input
                      id="nest-name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="hue-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nest-description">Description</Label>
                    <Textarea
                      id="nest-description"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                      className="hue-input resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <HueButton 
                      size="sm" 
                      onClick={handleEditNest}
                      className="flex-1"
                    >
                      Save Changes
                    </HueButton>
                    <HueButton 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                    >
                      Cancel
                    </HueButton>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-primary">{nest.name}</h2>
                  <p className="text-muted-foreground">{nest.description}</p>
                </>
              )}
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

        {/* Admin Actions */}
        {(userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
          <>
            <HueButton 
              variant="outline" 
              onClick={() => setShowModeratorModal(true)}
              className="w-full"
            >
              <Plus className="w-5 h-5 mr-2" />
              Manage Moderators
            </HueButton>
            
            <HueButton 
              variant="destructive" 
              onClick={handleDeleteNest} 
              className="w-full"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Nest
            </HueButton>
          </>
        )}

        {/* Moderator Actions */}
        {(userProfile?.role === 'moderator' || userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
          <HueButton 
            variant="outline" 
            onClick={() => setShowMemberModal(true)}
            className="w-full"
          >
            <Users className="w-5 h-5 mr-2" />
            Manage Members
          </HueButton>
        )}
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
            <li>• Help others level up their points through support</li>
          </ul>
        </HueCardContent>
      </HueCard>

      {/* Moderator Management Modal */}
      <Dialog open={showModeratorModal} onOpenChange={setShowModeratorModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Moderators</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Moderators */}
            <div>
              <h3 className="font-semibold text-primary mb-2">Current Moderators</h3>
              <div className="space-y-2">
                {moderators.length > 0 ? (
                  moderators.map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between p-2 bg-accent-blue/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          {mod.user?.avatar_url ? (
                            <AvatarImage src={mod.user.avatar_url} alt="Moderator avatar" />
                          ) : (
                            <AvatarFallback className="bg-hue-gradient text-white text-xs">
                              {mod.user?.name?.charAt(0)?.toUpperCase() || 'M'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{mod.user?.name}</p>
                          <p className="text-xs text-muted-foreground">@{mod.user?.username}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded-full">
                        {mod.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No moderators assigned</p>
                )}
              </div>
            </div>

            {/* Add New Moderator */}
            <div>
              <h3 className="font-semibold text-primary mb-2">Add Moderator</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Select a member to promote to moderator
              </p>
              <ModeratorSelector 
                nestId={nestId} 
                onModeratorAdded={fetchNestDetails}
                existingModerators={moderators.map(m => m.user_id)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Member Management Modal */}
      <Dialog open={showMemberModal} onOpenChange={setShowMemberModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Members</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Members List */}
            <div>
              <h3 className="font-semibold text-primary mb-2">Nest Members</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {members.length > 0 ? (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-2 bg-accent-blue/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          {member.user?.avatar_url ? (
                            <AvatarImage src={member.user.avatar_url} alt="Member avatar" />
                          ) : (
                            <AvatarFallback className="bg-hue-gradient text-white text-xs">
                              {member.user?.name?.charAt(0)?.toUpperCase() || 'M'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.user?.name}</p>
                          <p className="text-xs text-muted-foreground">@{member.user?.username}</p>
                          <p className="text-xs text-muted-foreground">Level {member.user?.aura_level}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded-full">
                          {member.role}
                        </span>
                        {(userProfile?.role === 'moderator' || userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && member.role === 'member' && (
                          <MemberActions member={member} nestId={nestId} onAction={fetchNestDetails} />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No members found</p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Avatar Selection Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Nest Icon</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
            {nestAvatarOptions.map((avatar, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setEditData({ ...editData, avatar_url: avatar });
                  setShowAvatarModal(false);
                }}
                className={`w-16 h-16 rounded-full border-2 transition-all hover:scale-110 ${
                  editData.avatar_url === avatar
                    ? 'border-primary scale-110'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <img
                  src={avatar}
                  alt={`Nest Avatar ${index + 1}`}
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