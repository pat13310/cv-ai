// Configuration Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Hook pour vérifier si Supabase est configuré
export const useSupabaseConfig = () => {
  return {
    isConfigured: !!(supabaseUrl && supabaseKey),
    supabaseUrl,
    hasKeys: !!(supabaseUrl && supabaseKey)
  };
};