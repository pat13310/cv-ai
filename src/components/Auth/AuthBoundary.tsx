import React, { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { qk } from '../../query/keys';

/**
 * AuthBoundary keeps the centralized auth store (Zustand) in sync with Supabase auth.
 * It does not render any UI; it just hydrates `useAuthStore` with session/user/profile.
 * This can live alongside the existing SupabaseAuthProvider for a progressive migration.
 */
export const AuthBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setSession = useAuthStore(s => s.setSession);
  const setUser = useAuthStore(s => s.setUser);
  const setLoading = useAuthStore(s => s.setLoading);
  const setError = useAuthStore(s => s.setError);
  const reset = useAuthStore(s => s.reset);
  const setProfile = useAuthStore(s => s.setProfile);

  useEffect(() => {
    if (!supabase) {
      // If Supabase is not configured, ensure store is reset and not loading
      reset();
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    // Fetch initial session
    const init = async () => {
      try {
        const { data, error } = await supabase!.auth.getSession();
        if (!isMounted) return;
        if (error) {
          setError(error.message);
          setSession(null);
          setUser(null);
        } else {
          const session: Session | null = data.session ?? null;
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown auth error';
        setError(message);
        setSession(null);
        setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    // Subscribe to auth changes
    const { data: listener } = supabase!.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [reset, setError, setLoading, setSession, setUser]);

  // React Query: load profile when session/user is available
  const userId = useAuthStore(s => s.user?.id);
  const { data: profileData, error: profileError } = useQuery({
    queryKey: qk.profile(userId),
    enabled: !!supabase && !!userId,
    queryFn: async () => {
      const { data, error } = await supabase!.from('profiles').select('*').eq('id', userId as string).single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data ?? null;
    },
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (profileError) {
      const message = profileError instanceof Error ? profileError.message : 'Erreur chargement profil';
      setError(message);
      setProfile(null);
    } else if (profileData !== undefined) {
      // profileData can be null if not found; keep that as-is
      setProfile(profileData);
    }
  }, [profileData, profileError, setError, setProfile]);

  return <>{children}</>;
};
