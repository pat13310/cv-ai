-- Migration pour créer la table skills avec catégorisation et intégration IA
-- Créée le 2025-09-11

-- Création de la table skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  description TEXT,
  level VARCHAR(50) CHECK (level IN ('débutant', 'intermédiaire', 'avancé', 'expert')),
  keywords TEXT[], -- Mots-clés pour la recherche et l'IA
  is_ai_generated BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0, -- Popularité de la compétence
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte d'unicité pour éviter les doublons
  CONSTRAINT unique_skill_per_category UNIQUE(name, category)
);

-- Index pour optimiser les requêtes par catégorie
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_subcategory ON skills(category, subcategory);
CREATE INDEX IF NOT EXISTS idx_skills_usage ON skills(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_skills_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER trigger_update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_skills_updated_at();

-- Insertion de quelques compétences de base pour commencer
INSERT INTO skills (name, category, subcategory, description, level, keywords, is_ai_generated, usage_count) VALUES
-- Compétences techniques
('JavaScript', 'technique', 'langages', 'Langage de programmation pour le développement web', 'intermédiaire', ARRAY['js', 'frontend', 'backend', 'web'], false, 100),
('React', 'technique', 'frameworks', 'Bibliothèque JavaScript pour créer des interfaces utilisateur', 'intermédiaire', ARRAY['frontend', 'ui', 'components'], false, 95),
('Node.js', 'technique', 'runtime', 'Environnement d''exécution JavaScript côté serveur', 'intermédiaire', ARRAY['backend', 'server', 'api'], false, 80),
('Python', 'technique', 'langages', 'Langage de programmation polyvalent', 'avancé', ARRAY['data', 'ai', 'backend', 'automation'], false, 90),
('SQL', 'technique', 'bases-donnees', 'Langage de requête pour bases de données', 'avancé', ARRAY['database', 'query', 'data'], false, 85),

-- Soft skills
('Communication', 'soft-skills', 'interpersonnel', 'Capacité à communiquer efficacement', 'avancé', ARRAY['presentation', 'ecoute', 'expression'], false, 75),
('Leadership', 'soft-skills', 'management', 'Capacité à diriger et motiver une équipe', 'intermédiaire', ARRAY['equipe', 'motivation', 'direction'], false, 60),
('Travail d''équipe', 'soft-skills', 'collaboration', 'Capacité à travailler efficacement en équipe', 'avancé', ARRAY['collaboration', 'cooperation', 'synergie'], false, 80),
('Résolution de problèmes', 'soft-skills', 'analytique', 'Capacité à analyser et résoudre des problèmes complexes', 'avancé', ARRAY['analyse', 'solution', 'creativite'], false, 70),

-- Outils
('Git', 'outils', 'versionning', 'Système de contrôle de version', 'avancé', ARRAY['version', 'collaboration', 'code'], false, 85),
('Docker', 'outils', 'containerisation', 'Plateforme de containerisation', 'intermédiaire', ARRAY['container', 'deployment', 'devops'], false, 65),
('Figma', 'outils', 'design', 'Outil de design d''interface', 'intermédiaire', ARRAY['ui', 'ux', 'design', 'prototype'], false, 55),

-- Langues
('Anglais', 'langues', 'internationale', 'Langue internationale', 'avancé', ARRAY['business', 'technique', 'communication'], false, 90),
('Espagnol', 'langues', 'internationale', 'Langue espagnole', 'intermédiaire', ARRAY['communication', 'culture'], false, 40);

-- Commentaires pour la documentation
COMMENT ON TABLE skills IS 'Table des compétences avec catégorisation et support IA';
COMMENT ON COLUMN skills.category IS 'Catégorie principale : technique, soft-skills, langues, certifications, outils';
COMMENT ON COLUMN skills.subcategory IS 'Sous-catégorie pour une classification plus fine';
COMMENT ON COLUMN skills.keywords IS 'Mots-clés pour améliorer la recherche et les suggestions IA';
COMMENT ON COLUMN skills.is_ai_generated IS 'Indique si la compétence a été générée par IA';
COMMENT ON COLUMN skills.usage_count IS 'Nombre d''utilisations pour mesurer la popularité';