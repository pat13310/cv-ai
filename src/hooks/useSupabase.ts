import { useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types pour les templates
export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_color: string;
  ats_score: number;
  downloads: string;
  rating: number;
  tags: string[];
  word_content: string;
  html_content: string;
  is_premium: boolean;
  industry: string;
  created_at?: string;
  updated_at?: string;
}

// Types pour les activités
export interface Activity {
  id: string;
  user_id: string;
  type: string;
  title: string;
  description?: string;
  score?: number;
  status: 'success' | 'warning' | 'info' | 'error';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Types pour les profils utilisateur
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  country: string;
  date_of_birth: string;
  nationality: string;
  linkedin: string;
  website: string;
  profession: string;
  company: string;
  created_at?: string;
  updated_at?: string;
}

// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

// Initialiser Supabase seulement si les variables d'environnement sont disponibles
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// Hook pour gérer les données Supabase
export const useSupabase = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour charger les activités depuis Supabase
  const loadActivities = async () => {
    if (!supabase) {
      setActivities([]);
      setActivitiesLoading(false);
      return;
    }

    try {
      setActivitiesLoading(true);
      
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw error;
      }

      setActivities(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des activités:', err);
      setError('Erreur lors du chargement des activités');
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Fonction pour ajouter une nouvelle activité
  const addActivity = async (activity: Omit<Activity, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Erreur d\'authentification:', authError);
        throw new Error('Utilisateur non authentifié');
      }
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Ajouter le user_id à l'activité
      const activityWithUserId = {
        ...activity,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('activities')
        .insert([activityWithUserId])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Mettre à jour la liste locale
      setActivities(prev => [data, ...prev.slice(0, 9)]);
      return data;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'activité:', err);
      throw err;
    }
  };

  // Fonction pour charger le profil utilisateur (stabilisée avec useCallback)
  const loadProfile = useCallback(async (userId?: string) => {
    console.log('useSupabase - loadProfile appelé, supabase:', !!supabase);
    
    if (!supabase) {
      console.log('useSupabase - Supabase non configuré');
      setProfile(null);
      setProfileLoading(false);
      return null;
    }

    try {
      setProfileLoading(true);
      setError(null);
      console.log('useSupabase - Chargement du profil en cours...');
      
      // Si pas d'userId fourni, essayer de récupérer l'utilisateur actuel
      let currentUserId = userId;
      if (!currentUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        currentUserId = user?.id;
        console.log('useSupabase - Utilisateur actuel:', currentUserId);
      }

      if (!currentUserId) {
        console.log('useSupabase - Pas d\'utilisateur connecté');
        setProfile(null);
        setProfileLoading(false);
        return null;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserId)
        .single();

      console.log('useSupabase - Données du profil récupérées:', data);
      console.log('useSupabase - Erreur éventuelle:', error);

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      const profileData = data || null;
      setProfile(profileData);
      return profileData;
    } catch (err) {
      console.error('Erreur lors du chargement du profil:', err);
      setError('Erreur lors du chargement du profil');
      return null;
    } finally {
      setProfileLoading(false);
      console.log('useSupabase - Chargement du profil terminé');
    }
  }, []);

  // Fonction pour sauvegarder le profil utilisateur
  const saveProfile = async (profileData: Partial<UserProfile>) => {
    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      setError(null);
      console.log('Vérification de l\'authentification...');
      
      // Vérifier d'abord s'il y a une session active
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erreur de session:', sessionError);
        throw new Error('Erreur de session: ' + sessionError.message);
      }
      
      if (!session) {
        console.error('Aucune session active');
        throw new Error('🔐 Vous devez être connecté pour sauvegarder votre profil.\n\n👉 Cliquez sur "Se connecter" en haut à droite de l\'écran pour vous authentifier.');
      }
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Erreur d\'authentification:', authError);
        if (authError.message.includes('Auth session missing')) {
          throw new Error('🔐 Session d\'authentification expirée.\n\n👉 Veuillez vous reconnecter en cliquant sur "Se connecter".');
        }
        throw new Error('Erreur d\'authentification: ' + authError.message);
      }
      
      if (!user) {
        console.error('Aucun utilisateur connecté');
        throw new Error('🔐 Vous devez être connecté pour sauvegarder votre profil.\n\n👉 Cliquez sur "Se connecter" en haut à droite de l\'écran.');
      }

      console.log('Utilisateur connecté:', user.id);

      // Nettoyer les données avant l'insertion
      const cleanProfileData = Object.fromEntries(
        Object.entries(profileData).filter(([, value]) => value !== undefined)
      );

      console.log('Données à sauvegarder:', cleanProfileData);

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...cleanProfileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase:', error);
        if (error.code === '42P01') {
          throw new Error('La table des profils n\'existe pas. Veuillez appliquer les migrations d\'abord.');
        }
        throw error;
      }

      setProfile(data);
      console.log('Profil sauvegardé avec succès:', data);
      return { success: true, data };
    } catch (err: unknown) {
      console.error('Erreur lors de la sauvegarde du profil:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde du profil';
      setError(errorMessage);
      return { success: false, error: err, message: errorMessage };
    }
  };

  // Fonction pour créer un nouveau profil
  const createProfile = async (profileData: Partial<UserProfile>) => {
    if (!supabase) {
      return { success: false, error: 'Supabase non configuré' };
    }

    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
      console.log('Profil créé avec succès:', data);
      return { success: true, data };
    } catch (err) {
      console.error('Erreur lors de la création du profil:', err);
      setError('Erreur lors de la création du profil');
      return { success: false, error: err };
    }
  };

  // Fonction pour supprimer le profil
  const deleteProfile = async () => {
    if (!supabase) {
      return { success: false, error: 'Supabase non configuré' };
    }

    try {
      setError(null);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setProfile(null);
      console.log('Profil supprimé avec succès');
      return { success: true };
    } catch (err) {
      console.error('Erreur lors de la suppression du profil:', err);
      setError('Erreur lors de la suppression du profil');
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    // Chargement des données
    const loadTemplates = async () => {
      try {
        setLoading(true);
        
        if (!supabase) {
          console.log('Supabase non configuré - aucun template disponible');
          setTemplates([]);
        } else {
          // Charger depuis Supabase
          const { data, error } = await supabase
            .from('templates')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            throw error;
          }

          setTemplates(data || []);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des templates:', err);
        setError('Erreur lors du chargement des templates');
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
    loadActivities();
  }, []);

  return {
    templates,
    activities,
    profile,
    loading,
    activitiesLoading,
    profileLoading,
    error,
    addActivity,
    refreshActivities: loadActivities,
    loadProfile,
    saveProfile,
    createProfile,
    deleteProfile
  };
};