import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Types pour les compétences
export interface Skill {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  level?: 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
  keywords: string[];
  is_ai_generated: boolean;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface SkillsByCategory {
  [category: string]: Skill[];
}

export interface AISkillGenerationRequest {
  category: string;
  context?: string; // Contexte professionnel pour générer des compétences pertinentes
  count?: number; // Nombre de compétences à générer
}

// Fonction pour obtenir la clé API OpenAI
const getApiKey = (): string | null => {
  try {
    const settings = localStorage.getItem('cvAssistantSettings');
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      const apiKey = parsedSettings.ai?.apiKey;
      if (typeof apiKey === 'string' && apiKey.trim().length > 0) {
        return apiKey.trim();
      }
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la clé API:', error);
    return null;
  }
};

// Fonction pour générer des compétences avec l'IA
const generateSkillsWithAI = async (request: AISkillGenerationRequest): Promise<Skill[]> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Clé API OpenAI non configurée. Veuillez l\'ajouter dans les paramètres.');
  }

  const prompt = `Tu es un expert en ressources humaines et en développement professionnel.

Génère ${request.count || 5} compétences professionnelles pour la catégorie "${request.category}".

${request.context ? `Contexte professionnel : ${request.context}` : ''}

Pour chaque compétence, fournis :
- Un nom précis et professionnel
- Une sous-catégorie appropriée
- Une description courte (1-2 phrases)
- Un niveau suggéré (débutant, intermédiaire, avancé, expert)
- 3-5 mots-clés pertinents

Réponds UNIQUEMENT en JSON valide avec ce format :
{
  "skills": [
    {
      "name": "Nom de la compétence",
      "subcategory": "Sous-catégorie",
      "description": "Description courte et professionnelle",
      "level": "intermédiaire",
      "keywords": ["mot1", "mot2", "mot3", "mot4", "mot5"]
    }
  ]
}

IMPORTANT : Réponds UNIQUEMENT avec le JSON, aucun autre texte.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en compétences professionnelles. Tu réponds TOUJOURS et UNIQUEMENT en JSON valide. Jamais de texte explicatif.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('Clé API OpenAI invalide. Vérifiez votre clé dans les paramètres.');
      } else if (response.status === 429) {
        throw new Error('Limite de taux atteinte. Veuillez réessayer dans quelques minutes.');
      } else {
        throw new Error(`Erreur API OpenAI: ${errorData.error?.message || 'Erreur inconnue'}`);
      }
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      const parsedResponse = JSON.parse(aiResponse);
      
      if (!parsedResponse.skills || !Array.isArray(parsedResponse.skills)) {
        throw new Error('Format de réponse invalide');
      }

      // Transformer les compétences générées par l'IA en format Skill
      const generatedSkills: Skill[] = parsedResponse.skills.map((skill: {
        name: string;
        subcategory: string;
        description: string;
        level: 'débutant' | 'intermédiaire' | 'avancé' | 'expert';
        keywords: string[];
      }) => ({
        id: crypto.randomUUID(), // Générer un ID temporaire
        name: skill.name,
        category: request.category,
        subcategory: skill.subcategory,
        description: skill.description,
        level: skill.level as 'débutant' | 'intermédiaire' | 'avancé' | 'expert',
        keywords: skill.keywords || [],
        is_ai_generated: true,
        usage_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      return generatedSkills;
    } catch (parseError) {
      console.error('Erreur lors du parsing de la réponse IA:', parseError);
      console.error('Réponse brute:', aiResponse);
      throw new Error('Erreur lors de l\'analyse de la réponse IA. Veuillez réessayer.');
    }
  } catch (error) {
    console.error('Erreur lors de la génération de compétences avec IA:', error);
    throw error;
  }
};

// Hook principal pour la gestion des compétences
export const useSkills = () => {
  const [skillsByCategory, setSkillsByCategory] = useState<SkillsByCategory>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction principale : getSkillsByCategory avec intégration IA
  const getSkillsByCategory = useCallback(async (
    category: string,
    options?: {
      generateIfEmpty?: boolean;
      context?: string;
      count?: number;
    }
  ): Promise<Skill[]> => {
    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Recherche des compétences pour la catégorie: ${category}`);

      // 1. Chercher les compétences existantes dans Supabase
      const { data: existingSkills, error: fetchError } = await supabase
        .from('skills')
        .select('*')
        .eq('category', category)
        .order('usage_count', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      console.log(`Compétences trouvées: ${existingSkills?.length || 0}`);

      // 2. Si des compétences existent, les retourner
      if (existingSkills && existingSkills.length > 0) {
        // Incrémenter le compteur d'usage pour les compétences consultées
        const skillsData = existingSkills as Skill[];
        
        // Mise à jour asynchrone du compteur d'usage (sans attendre)
        skillsData.forEach(async (skill) => {
          try {
            await supabase!
              .from('skills')
              .update({
                usage_count: skill.usage_count + 1,
                updated_at: new Date().toISOString()
              })
              .eq('id', skill.id);
          } catch (updateError) {
            console.warn('Erreur lors de la mise à jour du compteur d\'usage:', updateError);
          }
        });
        
        // Mettre à jour le state local
        setSkillsByCategory(prev => ({
          ...prev,
          [category]: skillsData
        }));

        return skillsData;
      }

      // 3. Si aucune compétence n'existe et que generateIfEmpty est true, générer avec l'IA
      if (options?.generateIfEmpty) {
        console.log(`Génération de compétences avec IA pour la catégorie: ${category}`);
        
        const generatedSkills = await generateSkillsWithAI({
          category,
          context: options.context,
          count: options.count || 5
        });

        // 4. Sauvegarder les compétences générées dans Supabase
        const skillsToInsert = generatedSkills.map(skill => ({
          name: skill.name,
          category: skill.category,
          subcategory: skill.subcategory,
          description: skill.description,
          level: skill.level,
          keywords: skill.keywords,
          is_ai_generated: skill.is_ai_generated,
          usage_count: 1 // Première utilisation
        }));

        const { data: insertedSkills, error: insertError } = await supabase!
          .from('skills')
          .insert(skillsToInsert)
          .select();

        if (insertError) {
          console.error('Erreur lors de l\'insertion des compétences:', insertError);
          // Retourner les compétences générées même si l'insertion échoue
          return generatedSkills;
        }

        const finalSkills = insertedSkills as Skill[];
        
        // Mettre à jour le state local
        setSkillsByCategory(prev => ({
          ...prev,
          [category]: finalSkills
        }));

        console.log(`${finalSkills.length} compétences générées et sauvegardées`);
        return finalSkills;
      }

      // 5. Aucune compétence trouvée et pas de génération demandée
      return [];

    } catch (err) {
      console.error('Erreur dans getSkillsByCategory:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des compétences';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour obtenir toutes les catégories disponibles
  const getAvailableCategories = useCallback(async (): Promise<string[]> => {
    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data, error } = await supabase!
        .from('skills')
        .select('category')
        .order('category');

      if (error) {
        throw error;
      }

      // Extraire les catégories uniques
      const categories = [...new Set(data?.map((item: { category: string }) => item.category) || [])];
      return categories;
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories:', err);
      throw err;
    }
  }, []);

  // Fonction pour ajouter une nouvelle compétence
  const addSkill = useCallback(async (skillData: Omit<Skill, 'id' | 'created_at' | 'updated_at'>): Promise<Skill> => {
    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data, error } = await supabase!
        .from('skills')
        .insert([skillData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newSkill = data as Skill;
      
      // Mettre à jour le state local
      setSkillsByCategory(prev => ({
        ...prev,
        [newSkill.category]: [...(prev[newSkill.category] || []), newSkill]
      }));

      return newSkill;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la compétence:', err);
      throw err;
    }
  }, []);

  // Fonction pour rechercher des compétences par mots-clés
  const searchSkills = useCallback(async (query: string): Promise<Skill[]> => {
    if (!supabase) {
      throw new Error('Supabase non configuré');
    }

    try {
      const { data, error } = await supabase!
        .from('skills')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,keywords.cs.{${query}}`)
        .order('usage_count', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }

      return data as Skill[];
    } catch (err) {
      console.error('Erreur lors de la recherche de compétences:', err);
      throw err;
    }
  }, []);

  return {
    skillsByCategory,
    loading,
    error,
    getSkillsByCategory,
    getAvailableCategories,
    addSkill,
    searchSkills
  };
};