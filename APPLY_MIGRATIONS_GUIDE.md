# 📋 Guide d'Application des Migrations Supabase (Version Corrigée)

## 🎯 Objectif
Appliquer manuellement la migration `create_profiles_fixed.sql` à votre projet Supabase via le dashboard.
Cette version corrigée résout les problèmes d'inscription et améliore la robustesse.

## 🚨 IMPORTANT
Si vous avez déjà appliqué l'ancienne migration, cette version corrigée va :
- Supprimer et recréer les fonctions problématiques
- Corriger la gestion d'erreur dans le trigger d'inscription
- Améliorer la robustesse du système

## 📝 Étapes à suivre

### 1. Accéder au Dashboard Supabase
1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet `cv-ats-ai` (ID: `yrdkgzpukotxsuukghvl`)

### 2. Ouvrir l'Éditeur SQL
1. Dans la barre latérale gauche, cliquez sur **"SQL Editor"**
2. Cliquez sur **"New query"** pour créer une nouvelle requête

### 3. Copier et Exécuter la Migration Corrigée
Copiez le contenu suivant dans l'éditeur SQL :

```sql
/*
  # Create profiles table for user profile information (Version corrigée)

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `postal_code` (text)
      - `city` (text)
      - `country` (text)
      - `date_of_birth` (date)
      - `nationality` (text)
      - `linkedin` (text)
      - `website` (text)
      - `profession` (text)
      - `company` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `profiles` table
    - Add policy for users to read their own profile
    - Add policy for users to update their own profile
    - Add policy for users to insert their own profile

  3. Functions
    - Create trigger to automatically create profile on user signup (version robuste)
    - Create function to update updated_at timestamp
*/

-- Drop existing trigger and function if they exist (pour éviter les conflits)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  phone text,
  address text,
  postal_code text,
  city text,
  country text DEFAULT 'France',
  date_of_birth date,
  nationality text DEFAULT 'Française',
  linkedin text,
  website text,
  profession text,
  company text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create profile on user signup (version robuste)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Utiliser un bloc BEGIN/EXCEPTION pour gérer les erreurs
  BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
      NEW.id,
      COALESCE(NEW.email, ''),
      COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
      COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
  EXCEPTION
    WHEN OTHERS THEN
      -- Log l'erreur mais ne pas faire échouer l'inscription
      RAISE WARNING 'Erreur lors de la création du profil pour l''utilisateur %: %', NEW.id, SQLERRM;
      -- Créer un profil minimal en cas d'erreur
      INSERT INTO public.profiles (id, email)
      VALUES (NEW.id, COALESCE(NEW.email, ''))
      ON CONFLICT (id) DO NOTHING;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);
CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON profiles(updated_at DESC);

-- Vérification finale : s'assurer que la table existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    RAISE EXCEPTION 'La table profiles n''a pas été créée correctement';
  END IF;
  
  RAISE NOTICE 'Migration profiles appliquée avec succès !';
END $$;
```

### 4. Exécuter la Migration Corrigée
1. Cliquez sur le bouton **"Run"** (ou utilisez Ctrl+Enter)
2. Vérifiez qu'il n'y a pas d'erreurs dans la console
3. Vous devriez voir le message **"Migration profiles appliquée avec succès !"**

### 5. Vérifier la Création de la Table
1. Allez dans **"Table Editor"** dans la barre latérale
2. Vous devriez voir la nouvelle table **"profiles"** dans la liste
3. Cliquez dessus pour voir sa structure

## 🔧 Améliorations de cette version

### Corrections apportées :
- **Gestion d'erreur robuste** : Le trigger ne fait plus échouer l'inscription en cas de problème
- **Nettoyage automatique** : Suppression des anciens triggers/fonctions avant recréation
- **Profil minimal de secours** : Création d'un profil basique même en cas d'erreur
- **Vérification finale** : Confirmation que la migration s'est bien déroulée
- **Logs d'erreur** : Les erreurs sont loggées sans bloquer le processus

## ✅ Vérification

### Vérifier que tout fonctionne :
1. La table `profiles` existe
2. Les politiques RLS sont activées
3. Les triggers sont créés
4. Les index sont en place

### Test rapide :
```sql
-- Vérifier la table
SELECT * FROM profiles LIMIT 1;

-- Vérifier les politiques
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Vérifier les triggers
SELECT * FROM information_schema.triggers WHERE event_object_table = 'profiles';
```

## 🚨 En cas d'erreur

### Erreur "relation already exists"
- C'est normal si vous relancez le script
- Les `IF NOT EXISTS` évitent les conflits

### Erreur de permissions
- Assurez-vous d'être connecté en tant qu'administrateur du projet
- Vérifiez que vous êtes dans le bon projet

### Erreur de syntaxe
- Vérifiez que vous avez copié tout le code SQL
- Assurez-vous qu'il n'y a pas de caractères manquants

## 📞 Support
Si vous rencontrez des problèmes :
1. Vérifiez les logs d'erreur dans le dashboard
2. Consultez la [documentation Supabase](https://supabase.com/docs)
3. Redémarrez votre application après l'application des migrations

---

**Une fois les migrations appliquées, votre application sera entièrement fonctionnelle avec Supabase !**