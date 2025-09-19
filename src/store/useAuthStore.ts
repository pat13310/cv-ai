import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import type { Session, User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  date_of_birth?: string;
  nationality?: string;
  linkedin?: string;
  website?: string;
  profession?: string;
  company?: string;
  openai_api_key?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;

  // actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (value: boolean) => void;
  setError: (message: string | null) => void;
  reset: () => void;
}

const INITIAL_STATE: Pick<AuthState, 'session' | 'user' | 'profile' | 'loading' | 'error'> = {
  session: null,
  user: null,
  profile: null,
  loading: false,
  error: null,
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...INITIAL_STATE,
        setSession: (session) => set({ session }),
        setUser: (user) => set({ user }),
        setProfile: (profile) => set({ profile }),
        setLoading: (value) => set({ loading: value }),
        setError: (message) => set({ error: message }),
        reset: () => set({ ...INITIAL_STATE }),
      }),
      {
        name: 'auth-store',
        version: 1,
        storage: createJSONStorage(() => localStorage),
        // Do not persist errors or loading flags
        partialize: (state) => ({
          session: state.session,
          user: state.user,
          profile: state.profile,
        }),
      }
    )
  )
);
