import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Minus, Database, Search } from 'lucide-react';
import { SectionWrapper } from './SectionWrapper';
import type { CVContent, CVSkill } from '../CVPreview';
import { useSkills, type Skill } from '../../../hooks/useSkills';

interface SkillsSectionProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  skills: CVSkill[];
  setSkills: React.Dispatch<React.SetStateAction<CVSkill[]>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customColor: string;
  titleColor: string;
  addSkill: () => void;
  removeSkill: (id: number) => void;
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  isLoading: boolean;
}

const AIButton: React.FC<{
  isLoading: boolean;
  onClick: () => void;
  title: string;
  className?: string;
}> = ({ isLoading, onClick, title, className = "" }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50 ${className}`}
    title={title}
  >
    {isLoading ? (
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    ) : (
      <Sparkles className="w-4 h-4" />
    )}
  </button>
);

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  editableContent,
  setEditableContent,
  skills,
  setSkills,
  editingField,
  setEditingField,
  customColor,
  titleColor,
  addSkill,
  removeSkill,
  generateWithAI,
  isLoading
}) => {
  const { getSkillsByCategory, getAvailableCategories, searchSkills, loading: skillsLoading } = useSkills();
  const [showSkillsLibrary, setShowSkillsLibrary] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('technique');
  const [categorySkills, setCategorySkills] = useState<Skill[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Skill[]>([]);

  // Charger les catégories disponibles au montage
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getAvailableCategories();
        const defaultCategories = ['technique', 'soft-skills', 'outils', 'langues', 'certifications'];
        setAvailableCategories(categories.length > 0 ? categories : defaultCategories);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        setAvailableCategories(['technique', 'soft-skills', 'outils', 'langues', 'certifications']);
      }
    };

    // Charger immédiatement les catégories par défaut
    setAvailableCategories(['technique', 'soft-skills', 'outils', 'langues', 'certifications']);
    
    // Puis essayer de charger depuis la base de données
    loadCategories();
  }, [getAvailableCategories]);

  // Charger les compétences par catégorie
  const loadSkillsByCategory = async (category: string) => {
    try {
      const skills = await getSkillsByCategory(category, {
        generateIfEmpty: true,
        context: `Compétences ${category} pour un CV professionnel`,
        count: 8
      });
      setCategorySkills(skills);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
      setCategorySkills([]);
    }
  };

  // Rechercher des compétences
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 2) {
      try {
        const results = await searchSkills(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Ajouter une compétence depuis la bibliothèque
  const addSkillFromLibrary = (skill: Skill) => {
    const newSkill: CVSkill = {
      id: Date.now(),
      content: skill.name
    };
    setSkills(prev => [...prev, newSkill]);
    setShowSkillsLibrary(false);
  };

  // Charger les compétences de la catégorie sélectionnée
  useEffect(() => {
    if (showSkillsLibrary && selectedCategory) {
      loadSkillsByCategory(selectedCategory);
    }
  }, [selectedCategory, showSkillsLibrary]);

  return (
    <SectionWrapper id="skills" title="Compétences">
      <div className="mt-4">
        {editingField === 'skillsTitle' ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editableContent.skillsTitle}
              onChange={(e) => setEditableContent(prev => ({ ...prev, skillsTitle: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-md font-semibold border-b border-gray-400 focus:outline-none focus:border-violet-500 bg-transparent"
              style={{ width: `${Math.max(editableContent.skillsTitle.length * 8 + 20, 200)}px` }}
              autoFocus
            />
            <button
              onClick={() => setShowSkillsLibrary(!showSkillsLibrary)}
              className="p-1 text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-110"
              title="Bibliothèque de compétences"
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={addSkill}
              className="p-1 text-violet-600 hover:text-violet-800 transition-all duration-200 hover:scale-110"
              title="Ajouter une compétence"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="group flex items-center gap-2">
            <h4
              className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
              onClick={() => setEditingField('skillsTitle')}
              style={{ color: `#${titleColor}` }}
            >
              {editableContent.skillsTitle}
            </h4>
            <div className="flex gap-1 ml-auto">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI('skillsTitle', editableContent.skillsTitle)}
                  title="Modifier avec IA"
                />
              </div>
              <button
                onClick={() => setShowSkillsLibrary(!showSkillsLibrary)}
                className="p-1 text-blue-600 hover:text-blue-800 transition-all duration-200 hover:scale-110"
                title="Bibliothèque de compétences"
              >
                <Database className="w-4 h-4" />
              </button>
              <button
                onClick={addSkill}
                className="p-1 text-violet-600 hover:text-violet-800 transition-all duration-200 hover:scale-110"
                title="Ajouter une compétence"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {skills.map(skill => (
          <div key={skill.id} className="relative group flex items-start gap-2 mt-1">
            <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('skillContent', skill.content)}
                title="Modifier avec IA"
              />
              <button
                onClick={() => removeSkill(skill.id)}
                className="p-1 text-red-600 hover:text-red-800"
                title="Supprimer la compétence"
              >
                <Minus className="w-4 h-4" />
              </button>
            </div>

            {editingField === `skillContent-${skill.id}` ? (
              <input
                type="text"
                value={skill.content}
                onChange={(e) => setSkills(prev => prev.map(item => item.id === skill.id ? { ...item, content: e.target.value } : item))}
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                className="text-sm w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
                autoFocus
              />
            ) : (
              <p
                className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField(`skillContent-${skill.id}`)}
                style={{ color: `#${customColor}`, maxWidth: 'calc(100% - 80px)' }}
              >
                {skill.content}
              </p>
            )}
          </div>
        ))}

      {/* Bibliothèque de compétences */}
      {showSkillsLibrary && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-white shadow-lg relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-700">Bibliothèque de compétences</h5>
            <button
              onClick={() => setShowSkillsLibrary(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une compétence..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          {/* Résultats de recherche */}
          {searchResults.length > 0 && (
            <div className="mb-4">
              <h6 className="text-sm font-medium text-gray-600 mb-2">Résultats de recherche</h6>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {searchResults.map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => addSkillFromLibrary(skill)}
                    className="text-left p-2 text-sm border border-gray-200 rounded hover:bg-violet-50 hover:border-violet-300 transition-colors"
                    title={skill.description}
                  >
                    <div className="font-medium">{skill.name}</div>
                    {skill.level && (
                      <div className="text-xs text-gray-500">{skill.level}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sélecteur de catégorie */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie de compétences
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-violet-500 bg-white cursor-pointer"
              style={{ minHeight: '36px' }}
            >
              {availableCategories.length > 0 ? (
                availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'technique' ? 'Techniques' :
                     category === 'soft-skills' ? 'Soft Skills' :
                     category === 'outils' ? 'Outils' :
                     category === 'langues' ? 'Langues' :
                     category === 'certifications' ? 'Certifications' :
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))
              ) : (
                <>
                  <option value="technique">Techniques</option>
                  <option value="soft-skills">Soft Skills</option>
                  <option value="outils">Outils</option>
                  <option value="langues">Langues</option>
                  <option value="certifications">Certifications</option>
                </>
              )}
            </select>
          </div>

          {/* Compétences par catégorie */}
          {skillsLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {categorySkills.length === 0 ? 'Génération avec IA...' : 'Chargement...'}
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {categorySkills.map((skill) => (
                <button
                  key={skill.id}
                  onClick={() => addSkillFromLibrary(skill)}
                  className="text-left p-2 text-sm border border-gray-200 rounded hover:bg-violet-50 hover:border-violet-300 transition-colors"
                  title={skill.description}
                >
                  <div className="font-medium">{skill.name}</div>
                  {skill.level && (
                    <div className="text-xs text-gray-500">{skill.level}</div>
                  )}
                  {skill.is_ai_generated && (
                    <div className="text-xs text-violet-600 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      IA
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {categorySkills.length === 0 && !skillsLoading && (
            <div className="text-center py-4 text-gray-500 text-sm">
              <p>Aucune compétence trouvée pour cette catégorie</p>
              <button
                onClick={() => loadSkillsByCategory(selectedCategory)}
                className="mt-2 px-3 py-1 text-xs bg-violet-100 text-violet-700 rounded-md hover:bg-violet-200 transition-colors"
              >
                Générer avec IA
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  </SectionWrapper>
);
};