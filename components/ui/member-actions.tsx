import React, { useState } from 'react';
import { MoreVertical, UserX, Ban } from 'lucide-react';
import { HueButton } from './hue-button';
import { supabase } from '@/lib/supabase';

interface Member {
  id: string;
  user_id: string;
  role: string;
  user?: {
    name: string;
    username: string;
    aura_level: number;
    avatar_url?: string;
  };
}

interface MemberActionsProps {
  member: Member;
  nestId: string;
  onAction: () => void;
}

export const MemberActions = ({ member, nestId, onAction }: MemberActionsProps) => {
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleKickMember = async () => {
    if (!confirm(`Are you sure you want to kick ${member.user?.name} from this nest?`)) {
      return;
    }

    setLoading(true);
    try {
      // Remove member from nest
      const { error } = await supabase
        .from('nest_members')
        .delete()
        .eq('id', member.id);

      if (error) throw error;

      // Log the action
      await supabase
        .from('nest_actions')
        .insert({
          nest_id: nestId,
          target_user_id: member.user_id,
          action_by: member.user_id, // This should be the current user's ID
          action_type: 'kick',
          reason: 'Kicked by moderator',
        });

      onAction();
    } catch (error) {
      console.error('Error kicking member:', error);
      alert('Failed to kick member');
    } finally {
      setLoading(false);
    }
  };

  const handleBanMember = async () => {
    if (!confirm(`Are you sure you want to ban ${member.user?.name} from this nest?`)) {
      return;
    }

    setLoading(true);
    try {
      // Remove member from nest
      const { error } = await supabase
        .from('nest_members')
        .delete()
        .eq('id', member.id);

      if (error) throw error;

      // Add to ban list
      await supabase
        .from('nest_bans')
        .insert({
          nest_id: nestId,
          user_id: member.user_id,
          banned_by: member.user_id, // This should be the current user's ID
          reason: 'Banned by moderator',
          is_permanent: true,
        });

      // Log the action
      await supabase
        .from('nest_actions')
        .insert({
          nest_id: nestId,
          target_user_id: member.user_id,
          action_by: member.user_id, // This should be the current user's ID
          action_type: 'ban',
          reason: 'Banned by moderator',
        });

      onAction();
    } catch (error) {
      console.error('Error banning member:', error);
      alert('Failed to ban member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowActions(!showActions)}
        disabled={loading}
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      
      {showActions && (
        <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
          <button
            onClick={handleKickMember}
            disabled={loading}
            className="w-full px-3 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 disabled:opacity-50 flex items-center space-x-2"
          >
            <UserX className="w-3 h-3" />
            <span>Kick Member</span>
          </button>
          <button
            onClick={handleBanMember}
            disabled={loading}
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 flex items-center space-x-2"
          >
            <Ban className="w-3 h-3" />
            <span>Ban Member</span>
          </button>
        </div>
      )}
    </div>
  );
}; 