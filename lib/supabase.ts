import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          username: string;
          bio: string | null;
          university: string | null;
          aura_points: number;
          aura_level: number;
          is_anonymous: boolean;
          anonymous_name: string | null;
          avatar_url: string | null;
          role: 'user' | 'moderator' | 'admin' | 'super_admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          username: string;
          bio?: string | null;
          university?: string | null;
          aura_points?: number;
          aura_level?: number;
          is_anonymous?: boolean;
          anonymous_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'moderator' | 'admin' | 'super_admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          username?: string;
          bio?: string | null;
          university?: string | null;
          aura_points?: number;
          aura_level?: number;
          is_anonymous?: boolean;
          anonymous_name?: string | null;
          avatar_url?: string | null;
          role?: 'user' | 'moderator' | 'admin' | 'super_admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      nests: {
        Row: {
          id: string;
          name: string;
          description: string;
          avatar_url: string | null;
          is_private: boolean;
          member_count: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          avatar_url?: string | null;
          is_private?: boolean;
          member_count?: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          avatar_url?: string | null;
          is_private?: boolean;
          member_count?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      nest_members: {
        Row: {
          id: string;
          nest_id: string;
          user_id: string;
          role: 'member' | 'moderator' | 'admin';
          joined_at: string;
        };
        Insert: {
          id?: string;
          nest_id: string;
          user_id: string;
          role?: 'member' | 'moderator' | 'admin';
          joined_at?: string;
        };
        Update: {
          id?: string;
          nest_id?: string;
          user_id?: string;
          role?: 'member' | 'moderator' | 'admin';
          joined_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          nest_id: string;
          user_id: string;
          content: string;
          reply_to_id: string | null;
          is_anonymous: boolean;
          anonymous_name: string | null;
          upvotes: number;
          downvotes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nest_id: string;
          user_id: string;
          content: string;
          reply_to_id?: string | null;
          is_anonymous?: boolean;
          anonymous_name?: string | null;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nest_id?: string;
          user_id?: string;
          content?: string;
          reply_to_id?: string | null;
          is_anonymous?: boolean;
          anonymous_name?: string | null;
          upvotes?: number;
          downvotes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      message_reactions: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          reaction_type: 'upvote' | 'downvote';
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          reaction_type: 'upvote' | 'downvote';
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          user_id?: string;
          reaction_type?: 'upvote' | 'downvote';
          created_at?: string;
        };
      };
    };
  };
};