/*
  # Create activities table for recent activity tracking

  1. New Tables
    - `activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `type` (text) - Type of activity (analysis, match, warning, creation, etc.)
      - `title` (text) - Activity title/description
      - `description` (text) - Detailed description
      - `score` (integer) - ATS score if applicable
      - `status` (text) - success, warning, info, error
      - `metadata` (jsonb) - Additional data (file name, template used, etc.)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `activities` table
    - Add policy for users to read their own activities
    - Add policy for users to create their own activities
*/

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  score integer,
  status text NOT NULL DEFAULT 'info',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own activities"
  ON activities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS activities_user_id_created_at_idx 
  ON activities(user_id, created_at DESC);

-- Insert some sample activities for demonstration
INSERT INTO activities (user_id, type, title, description, score, status, metadata) VALUES
  (gen_random_uuid(), 'analysis', 'CV Analysé - Développeur Full Stack', 'Analyse complète avec recommandations IA', 92, 'success', '{"fileName": "CV_Marie_Dubois.pdf", "duration": "2.3s"}'),
  (gen_random_uuid(), 'match', 'Match trouvé - Lead Developer React', 'Correspondance élevée avec offre d''emploi', 87, 'success', '{"jobTitle": "Lead Developer React", "company": "TechCorp"}'),
  (gen_random_uuid(), 'warning', 'CV nécessite optimisation', 'Score ATS faible détecté', 64, 'warning', '{"fileName": "CV_ancien.docx", "issues": ["mots-clés manquants", "structure"]}'),
  (gen_random_uuid(), 'creation', 'Nouveau CV créé avec IA', 'Template Tech Senior appliqué', null, 'info', '{"template": "CV Tech Senior Pro", "method": "ai_assistant"}'),
  (gen_random_uuid(), 'optimization', 'CV optimisé automatiquement', 'Amélioration du score ATS', 89, 'success', '{"originalScore": 76, "newScore": 89, "improvements": 5});