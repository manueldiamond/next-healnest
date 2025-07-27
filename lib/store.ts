import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  userProfile: any | null;
  isAnonymous: boolean;
  setUser: (user: User | null) => void;
  setUserProfile: (profile: any) => void;
  setAnonymous: (anonymous: boolean) => void;
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
}));

export const useChatStore = create<ChatState>((set) => ({
  selectedNest: null,
  messages: [],
  setSelectedNest: (nest) => set({ selectedNest: nest }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));