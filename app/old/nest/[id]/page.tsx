"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Users, Crown, Eye, MessageCircle, Trash2, Edit, Plus, MoreVertical, Sparkles } from 'lucide-react';
import { HueButton } from '@/components/ui/hue-button';
import { HueCard, HueCardContent, HueCardHeader, HueCardTitle } from '@/components/ui/hue-card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NestIconSelector } from '@/components/ui/nest-icon-selector';
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
  const [showIconModal, setShowIconModal] = useState(false);
  const [moderators, setModerators] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [onlineMembers, setOnlineMembers] = useState(0);
  const [onlineModerators, setOnlineModerators] = useState(0);

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
          user:users(id, name, username, avatar_url, aura_level)
        `)
        .eq('nest_id', nestId)
        .in('role', ['moderator', 'admin']);

      if (moderatorsError) throw moderatorsError;
      setModerators(moderatorsData || []);

      // Fetch all members
      const { data: membersData, error: membersError } = await supabase
        .from('nest_members')
        .select(`
          *,
          user:users(id, name, username, avatar_url, aura_level)
        `)
        .eq('nest_id', nestId);

      if (membersError) throw membersError;
      setMembers(membersData || []);

      // Simulate online stats (in a real app, this would come from real-time data)
      setOnlineMembers(Math.floor(Math.random() * 10) + 5);
      setOnlineModerators(Math.floor(Math.random() * 3) + 1);

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

      setIsMember(true);
      fetchNestDetails(); // Refresh to update member count
    } catch (error) {
      console.error('Error joining nest:', error);
    }
  };

  const handleEnterChat = () => {
    router.push(`/nest/${nestId}/chat`);
  };

  const handleEditNest = async () => {
    if (!nest || !userProfile) return;

    try {
      const { error } = await supabase
        .from('nests')
        .update({
          name: editData.name,
          description: editData.description,
          avatar_url: editData.avatar_url,
        })
        .eq('id', nest.id);

      if (error) throw error;

      setNest({ ...nest, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating nest:', error);
    }
  };

  const handleDeleteNest = async () => {
    if (!nest || !confirm('Are you sure you want to delete this nest? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('nests')
        .delete()
        .eq('id', nest.id);

      if (error) throw error;

      router.push('/chats');
    } catch (error) {
      console.error('Error deleting nest:', error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading nest details...</p>
        </div>
      </div>
    );
  }

  if (!nest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Nest not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <HueButton variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </HueButton>
        <h1 className="text-xl font-heading font-bold text-primary">Nest Profile</h1>
        
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
            <Avatar className="w-20 h-20 mx-auto">
              {nest.avatar_url ? (
                <AvatarImage src={nest.avatar_url} alt="Nest avatar" />
              ) : (
                <AvatarFallback className="bg-hue-gradient text-white text-xl">
                  {getInitials(nest.name.replace(/[^\w\s]/g, ''))}
                </AvatarFallback>
              )}
            </Avatar>
            
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
                  
                  <div>
                    <Label className="text-sm font-medium text-primary">
                      Nest Icon
                    </Label>
                    <NestIconSelector
                      selectedIcon={editData.avatar_url}
                      onIconSelect={(iconUrl) => setEditData({ ...editData, avatar_url: iconUrl })}
                      showModal={showIconModal}
                      onModalChange={setShowIconModal}
                      title="Choose Nest Icon"
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
                  <h2 className="text-2xl font-heading font-bold text-primary">{nest.name}</h2>
                  <p className="text-body text-muted-foreground">{nest.description}</p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-3 bg-accent-blue/10 rounded-xl">
                <div className="text-2xl font-bold text-primary">{nest.member_count}</div>
                <div className="text-xs text-muted-foreground">Members</div>
                <div className="text-xs text-accent-blue">{onlineMembers} online</div>
              </div>
              <div className="text-center p-3 bg-accent-pink/10 rounded-xl">
                <div className="text-2xl font-bold text-primary">{moderators.length}</div>
                <div className="text-xs text-muted-foreground">Moderators</div>
                <div className="text-xs text-accent-pink">{onlineModerators} online</div>
              </div>
            </div>
          </div>
        </HueCardContent>
      </HueCard>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isMember ? (
          <HueButton onClick={handleJoinNest} className="w-full">
            <Users className="w-5 h-5 mr-2" />
            Join Nest
          </HueButton>
        ) : (
          <HueButton onClick={handleEnterChat} className="w-full">
            <MessageCircle className="w-5 h-5 mr-2" />
            Enter Chat
          </HueButton>
        )}

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
          <HueCardTitle className="text-lg font-heading">Community Guidelines</HueCardTitle>
        </HueCardHeader>
        <HueCardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-accent-blue rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-body text-sm text-muted-foreground">
              Be kind and supportive to all members
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-accent-pink rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-body text-sm text-muted-foreground">
              Respect privacy and maintain confidentiality
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-accent-yellow rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-body text-sm text-muted-foreground">
              No hate speech, bullying, or harmful content
            </p>
          </div>
        </HueCardContent>
      </HueCard>

      {/* Moderator Management Modal */}
      <Dialog open={showModeratorModal} onOpenChange={setShowModeratorModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Manage Moderators</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Current Moderators */}
            <div>
              <h3 className="font-semibold text-primary mb-2">Current Moderators</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {moderators.length > 0 ? (
                  moderators.map((moderator) => (
                    <div key={moderator.id} className="flex items-center justify-between p-2 bg-accent-pink/10 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          {moderator.user?.avatar_url ? (
                            <AvatarImage src={moderator.user.avatar_url} alt="Moderator avatar" />
                          ) : (
                            <AvatarFallback className="bg-hue-gradient text-white text-xs">
                              {moderator.user?.name?.charAt(0)?.toUpperCase() || 'M'}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{moderator.user?.name}</p>
                          <p className="text-xs text-muted-foreground">@{moderator.user?.username}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-accent-pink/20 text-accent-pink px-2 py-1 rounded-full">
                        {moderator.role}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No moderators found</p>
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
            <DialogTitle className="font-heading">Manage Members</DialogTitle>
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
    </div>
  );
}