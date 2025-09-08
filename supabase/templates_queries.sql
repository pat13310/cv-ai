-- =====================================================
-- REQUÊTES SQL POUR LA TABLE TEMPLATES
-- =====================================================

-- 1. SÉLECTIONNER TOUS LES TEMPLATES
-- =====================================
SELECT 
    id,
    name,
    category,
    description,
    preview_color,
    ats_score,
    downloads,
    rating,
    tags,
    is_premium,
    industry,
    created_at,
    updated_at
FROM templates
ORDER BY created_at DESC;

-- 2. SÉLECTIONNER LES TEMPLATES PAR CATÉGORIE
-- ===========================================
SELECT * FROM templates 
WHERE category = 'Développement'
ORDER BY ats_score DESC;

-- 3. SÉLECTIONNER LES TEMPLATES PREMIUM
-- ====================================
SELECT * FROM templates 
WHERE is_premium = true
ORDER BY rating DESC, downloads DESC;

-- 4. SÉLECTIONNER LES TEMPLATES GRATUITS
-- =====================================
SELECT * FROM templates 
WHERE is_premium = false
ORDER BY downloads DESC;

-- 5. RECHERCHER TEMPLATES PAR MOT-CLÉ
-- ==================================
SELECT * FROM templates 
WHERE 
    name ILIKE '%tech%' 
    OR description ILIKE '%tech%'
    OR 'Tech' = ANY(tags)
ORDER BY ats_score DESC;

-- 6. TEMPLATES AVEC SCORE ATS ÉLEVÉ (>= 90)
-- ========================================
SELECT 
    name,
    category,
    ats_score,
    rating,
    downloads,
    is_premium
FROM templates 
WHERE ats_score >= 90
ORDER BY ats_score DESC;

-- 7. STATISTIQUES PAR CATÉGORIE
-- =============================
SELECT 
    category,
    COUNT(*) as nombre_templates,
    AVG(ats_score) as score_moyen,
    AVG(rating) as note_moyenne,
    COUNT(CASE WHEN is_premium THEN 1 END) as templates_premium
FROM templates
GROUP BY category
ORDER BY score_moyen DESC;

-- 8. TOP 5 TEMPLATES LES PLUS TÉLÉCHARGÉS
-- =======================================
SELECT 
    name,
    category,
    downloads,
    rating,
    ats_score
FROM templates
ORDER BY 
    CAST(REPLACE(downloads, 'k', '') AS DECIMAL) DESC
LIMIT 5;

-- 9. INSÉRER UN NOUVEAU TEMPLATE
-- =============================
INSERT INTO templates (
    name,
    category,
    description,
    preview_color,
    ats_score,
    downloads,
    rating,
    tags,
    word_content,
    html_content,
    is_premium,
    industry
) VALUES (
    'CV Data Scientist Pro',
    'Data Science',
    'Template spécialisé pour data scientists avec sections techniques avancées',
    'bg-gradient-to-br from-emerald-100 to-teal-100',
    97,
    '1.5k',
    4.8,
    ARRAY['Data Science', 'Python', 'Machine Learning', 'Analytics'],
    '<!DOCTYPE html><html><!-- Contenu HTML complet --></html>',
    '<html>Data Science template HTML content</html>',
    true,
    'Data'
);

-- 10. METTRE À JOUR UN TEMPLATE
-- ============================
UPDATE templates 
SET 
    ats_score = 98,
    downloads = '3.5k',
    rating = 4.9,
    updated_at = NOW()
WHERE name = 'CV Tech Senior Pro';

-- 11. SUPPRIMER UN TEMPLATE
-- ========================
DELETE FROM templates 
WHERE id = 'uuid-du-template-à-supprimer';

-- 12. TEMPLATES PAR INDUSTRIE
-- ==========================
SELECT 
    industry,
    COUNT(*) as nombre_templates,
    STRING_AGG(name, ', ') as templates_disponibles
FROM templates
GROUP BY industry
ORDER BY nombre_templates DESC;

-- 13. RECHERCHE AVANCÉE AVEC FILTRES
-- =================================
SELECT * FROM templates 
WHERE 
    category = $1  -- Paramètre pour la catégorie
    AND ats_score >= $2  -- Paramètre pour le score minimum
    AND is_premium = $3  -- Paramètre pour premium/gratuit
    AND (
        name ILIKE '%' || $4 || '%' 
        OR description ILIKE '%' || $4 || '%'
        OR $4 = ANY(tags)
    )
ORDER BY ats_score DESC, rating DESC;

-- 14. OBTENIR LE CONTENU COMPLET D'UN TEMPLATE
-- ===========================================
SELECT 
    name,
    word_content,
    html_content
FROM templates 
WHERE id = $1;

-- 15. TEMPLATES RÉCEMMENT AJOUTÉS (7 derniers jours)
-- =================================================
SELECT 
    name,
    category,
    ats_score,
    created_at
FROM templates 
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;

-- 16. MISE À JOUR DES STATISTIQUES DE TÉLÉCHARGEMENT
-- =================================================
UPDATE templates 
SET 
    downloads = CASE 
        WHEN downloads LIKE '%k' THEN 
            CAST(REPLACE(downloads, 'k', '') AS DECIMAL) + 0.1 || 'k'
        ELSE 
            CAST(downloads AS INTEGER) + 1
    END,
    updated_at = NOW()
WHERE id = $1;

-- 17. TEMPLATES SIMILAIRES (même catégorie, score proche)
-- ======================================================
WITH template_info AS (
    SELECT category, ats_score 
    FROM templates 
    WHERE id = $1
)
SELECT t.* 
FROM templates t, template_info ti
WHERE 
    t.category = ti.category 
    AND ABS(t.ats_score - ti.ats_score) <= 5
    AND t.id != $1
ORDER BY ABS(t.ats_score - ti.ats_score);

-- 18. VÉRIFIER L'EXISTENCE D'UN TEMPLATE
-- =====================================
SELECT EXISTS(
    SELECT 1 FROM templates 
    WHERE name = $1
) as template_exists;

-- 19. OBTENIR LES TAGS UNIQUES
-- ===========================
SELECT DISTINCT UNNEST(tags) as tag
FROM templates
ORDER BY tag;

-- 20. TEMPLATES AVEC PERFORMANCE (score + note)
-- ============================================
SELECT 
    name,
    category,
    ats_score,
    rating,
    (ats_score * 0.7 + rating * 20 * 0.3) as score_performance
FROM templates
ORDER BY score_performance DESC;

-- =====================================================
-- VUES UTILES
-- =====================================================

-- Vue pour les templates avec statistiques calculées
CREATE OR REPLACE VIEW templates_stats AS
SELECT 
    t.*,
    (ats_score * 0.7 + rating * 20 * 0.3) as performance_score,
    CASE 
        WHEN ats_score >= 95 THEN 'Excellent'
        WHEN ats_score >= 90 THEN 'Très bon'
        WHEN ats_score >= 85 THEN 'Bon'
        ELSE 'À améliorer'
    END as ats_grade
FROM templates t;

-- Vue pour les templates par catégorie avec compteurs
CREATE OR REPLACE VIEW templates_by_category AS
SELECT 
    category,
    COUNT(*) as total_templates,
    COUNT(CASE WHEN is_premium THEN 1 END) as premium_count,
    COUNT(CASE WHEN NOT is_premium THEN 1 END) as free_count,
    AVG(ats_score) as avg_ats_score,
    AVG(rating) as avg_rating
FROM templates
GROUP BY category;

-- =====================================================
-- FONCTIONS UTILES
-- =====================================================

-- Fonction pour rechercher des templates
CREATE OR REPLACE FUNCTION search_templates(
    search_term TEXT DEFAULT '',
    category_filter TEXT DEFAULT '',
    min_ats_score INTEGER DEFAULT 0,
    premium_only BOOLEAN DEFAULT FALSE
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    category TEXT,
    description TEXT,
    ats_score INTEGER,
    rating NUMERIC,
    is_premium BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.name,
        t.category,
        t.description,
        t.ats_score,
        t.rating,
        t.is_premium
    FROM templates t
    WHERE 
        (search_term = '' OR 
         t.name ILIKE '%' || search_term || '%' OR 
         t.description ILIKE '%' || search_term || '%' OR
         search_term = ANY(t.tags))
        AND (category_filter = '' OR t.category = category_filter)
        AND t.ats_score >= min_ats_score
        AND (NOT premium_only OR t.is_premium = TRUE)
    ORDER BY t.ats_score DESC, t.rating DESC;
END;
$$ LANGUAGE plpgsql;

-- Exemple d'utilisation de la fonction de recherche :
-- SELECT * FROM search_templates('Tech', 'Développement', 90, true);