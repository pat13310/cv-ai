/*
  # Ajouter le champ openai_api_key à la table profiles

  1. Modifications
    - Ajouter la colonne `openai_api_key` (text, chiffrée)
    - Ajouter un index pour les performances
    - Mettre à jour les politiques de sécurité

  2. Sécurité
    - Le champ sera chiffré côté client avant stockage
    - Seul l'utilisateur propriétaire peut lire/modifier sa clé
*/

-- Ajouter la colonne openai_api_key à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS openai_api_key text;

-- Ajouter un commentaire pour documenter le champ
COMMENT ON COLUMN profiles.openai_api_key IS 'Clé API OpenAI chiffrée de l''utilisateur';

-- Créer un index pour les performances (optionnel)
CREATE INDEX IF NOT EXISTS profiles_openai_key_idx ON profiles(openai_api_key) 
WHERE openai_api_key IS NOT NULL;

-- Les politiques RLS existantes couvrent déjà ce nouveau champ
-- car elles s'appliquent à toute la table profiles

-- Vérification finale
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'openai_api_key'
  ) THEN
    RAISE EXCEPTION 'La colonne openai_api_key n''a pas été ajoutée correctement';
  END IF;
  
  RAISE NOTICE 'Migration openai_api_key appliquée avec succès !';
END $$;