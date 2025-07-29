import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { Database, supabase } from './supabase';

interface AuthState {
  user: User | null;
  userProfile: Database['public']['Tables']['users']['Row'] | null;
  isAnonymous: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (data: Database['public']['Tables']['users']['Row'] | null) => void;
  setAnonymous: (anonymous: boolean) => void;
  loadUserProfile: () => Promise<void>;
}

interface ChatState {
  selectedNest: any | null;
  messages: any[];
  setSelectedNest: (nest: any) => void;
  setMessages: (messages: any[]) => void;
  addMessage: (message: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userProfile: null,
  isAnonymous: false,
  setUser: (user) => set({ user }),
  setUserProfile: (profile) => set({ userProfile: profile }),
  setAnonymous: (anonymous) => set({ isAnonymous: anonymous }),
  loadUserProfile: async () => {
    // Get user from supabase auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      set({ user: null, userProfile: null });
      return;
    }

    set({ user }); // set user in store

    // Fetch user profile from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      set({ userProfile: null });
      // Optionally, handle/log error here
    } else {
      set({ userProfile: data });
    }
  },
}));

export const useChatStore = create<ChatState>((set) => ({
  selectedNest: null,
  messages: [],
  setSelectedNest: (nest) => set({ selectedNest: nest }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));