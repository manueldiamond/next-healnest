import React, { useState, useEffect } from 'react';
import { Users, Crown } from 'lucide-react';
import { HueButton } from './hue-button';
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
import { supabase } from '@/lib/supabase';

interface ModeratorSelectorProps {
  nestId: string;
  onModeratorAdded: () => void;
  existingModerators: string[];
}

export const ModeratorSelector = ({ nestId, onModeratorAdded, existingModerators }: ModeratorSelectorProps) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [nestId]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('nest_members')
        .select(`
          *,
          user:users(name, username, avatar_url, aura_level)
        `)
        .eq('nest_id', nestId)
        .eq('role', 'member');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handlePromoteToModerator = async () => {
    if (!selectedMember) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('nest_members')
        .update({ role: 'moderator' })
        .eq('id', selectedMember);

      if (error) throw error;

      setSelectedMember(null);
      onModeratorAdded();
    } catch (error) {
      console.error('Error promoting to moderator:', error);
      alert('Failed to promote member to moderator');
    } finally {
      setLoading(false);
    }
  };

  const eligibleMembers = members.filter(member => !existingModerators.includes(member.user_id));

  return (
    <div className="space-y-3">
      {eligibleMembers.length > 0 ? (
        <>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {eligibleMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedMember === member.id
                    ? 'border-accent-pink bg-accent-pink/10'
                    : 'border-gray-200 hover:border-accent-pink/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    {member.user?.avatar_url ? (
                      <AvatarImage src={member.user.avatar_url} alt="Member avatar" />
                    ) : (
                      <AvatarFallback className="bg-hue-gradient text-white text-xs">
                        {member.user?.name?.charAt(0)?.toUpperCase() || 'M'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{member.user?.name}</p>
                    <p className="text-xs text-muted-foreground">@{member.user?.username}</p>
                    <p className="text-xs text-muted-foreground">Level {member.user?.aura_level}</p>
                  </div>
                  <Crown className="w-4 h-4 text-accent-pink" />
                </div>
              </div>
            ))}
          </div>
          
          {selectedMember && (
            <HueButton
              onClick={handlePromoteToModerator}
              disabled={loading}
              size="sm"
              className="w-full"
            >
              <Crown className="w-4 h-4 mr-2" />
              Promote to Moderator
            </HueButton>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <Users className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No eligible members to promote</p>
        </div>
      )}
    </div>
  );
}; 