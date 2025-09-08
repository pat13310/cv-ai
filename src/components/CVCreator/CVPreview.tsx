import React from 'react';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { StyleControls } from './StyleControls';

// Interfaces pour les données du CV
export interface CVExperience {
  id: number;
  content: string;
  details: string;
}

export interface CVSkill {
  id: number;
  content: string;
}

export interface CVLanguage {
  id: number;
  name: string;
  level: string;
}

export interface CVContent {
  name: string;
  contact: string;
  profileTitle: string;
  profileContent: string;
  experienceTitle: string;
  educationTitle: string;
  educationContent: string;
  skillsTitle: string;
  languagesTitle: string;
}

// Props du composant CVPreview
export interface CVPreviewProps {
  // Données du CV
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  experiences: CVExperience[];
  setExperiences: React.Dispatch<React.SetStateAction<CVExperience[]>>;
  skills: CVSkill[];
  setSkills: React.Dispatch<React.SetStateAction<CVSkill[]>>;
  languages: CVLanguage[];
  setLanguages: React.Dispatch<React.SetStateAction<CVLanguage[]>>;
  
  // État d'édition
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  
  // Styles (optionnels avec valeurs par défaut)
  customFont?: string;
  setCustomFont?: React.Dispatch<React.SetStateAction<string>>;
  customColor?: string;
  setCustomColor?: React.Dispatch<React.SetStateAction<string>>;
  titleColor?: string;
  setTitleColor?: React.Dispatch<React.SetStateAction<string>>;
  availableFonts?: string[];
  availableColors?: Array<{ name: string; value: string }>;
  
  // Fonctions de gestion
  addExperience: () => void;
  removeExperience: (id: number) => void;
  addSkill: () => void;
  removeSkill: (id: number) => void;
  addLanguage: () => void;
  removeLanguage: (id: number) => void;
  
  // IA
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  isLoading: boolean;
  
  // Erreurs
  error: string | null;
  openAIError: string | null;
}

// Composant d'animation de chargement avec trois points
const LoadingDots: React.FC = () => (
  <div className="flex space-x-1">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-violet-600 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

// Composant de bouton IA
interface AIButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  className?: string;
}

const AIButton: React.FC<AIButtonProps> = ({
  isLoading,
  onClick,
  disabled = false,
  title,
  className = ""
}) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50 ${className}`}
    title={title}
  >
    {isLoading ? <LoadingDots /> : <Sparkles className="w-4 h-4" />}
  </button>
);

// Composant principal CVPreview
export const CVPreview: React.FC<CVPreviewProps> = ({
  editableContent,
  setEditableContent,
  experiences,
  setExperiences,
  skills,
  setSkills,
  languages,
  setLanguages,
  editingField,
  setEditingField,
  customFont = 'Calibri',
  setCustomFont,
  customColor = '000000', // Noir par défaut
  setCustomColor,
  titleColor = '000000', // Noir par défaut
  setTitleColor,
  availableFonts = ['Calibri', 'Georgia', 'Helvetica', 'Consolas', 'Times New Roman', 'Arial'],
  availableColors = [
    { name: 'Noir', value: '000000' },
    { name: 'Bleu marine', value: '2E3A59' },
    { name: 'Bleu vif', value: '2563EB' },
    { name: 'Gris foncé', value: '111827' },
    { name: 'Vert foncé', value: '064E3B' },
    { name: 'Violet', value: '7C3AED' }
  ],
  addExperience,
  removeExperience,
  addSkill,
  removeSkill,
  addLanguage,
  removeLanguage,
  generateWithAI,
  isLoading,
  error,
  openAIError
}) => {
  return (
    <div className="w-full" style={{ aspectRatio: '1 / 1.414' }}>
      <div className="border border-violet-500 rounded-lg p-4 bg-gray-50 h-full overflow-auto shadow-md" style={{
        fontFamily: customFont,
        boxSizing: 'border-box'
      }}>
        {setCustomFont && setCustomColor && setTitleColor && (
          <StyleControls
            customFont={customFont}
            setCustomFont={setCustomFont}
            customColor={customColor}
            setCustomColor={setCustomColor}
            titleColor={titleColor}
            setTitleColor={setTitleColor}
            availableFonts={availableFonts}
            availableColors={availableColors}
          />
        )}

        {/* Affichage des erreurs */}
        {(error || openAIError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
            <strong className="font-bold">Erreur : </strong>
            <span className="block sm:inline">{error || openAIError}</span>
          </div>
        )}

        {/* Nom */}
        <div className="mt-4 text-center">
          {editingField === 'name' ? (
            <input
              type="text"
              value={editableContent.name}
              onChange={(e) => setEditableContent(prev => ({ ...prev, name: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-lg font-bold w-full text-center border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h3
                className="text-lg font-bold cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('name')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.name}
              </h3>
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('name', editableContent.name)}
                title="Modifier avec IA"
              />
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="text-center">
          {editingField === 'contact' ? (
            <input
              type="text"
              value={editableContent.contact}
              onChange={(e) => setEditableContent(prev => ({ ...prev, contact: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-sm w-full text-center border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <p
                className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('contact')}
                style={{ color: `#${customColor}` }}
              >
                {editableContent.contact}
              </p>
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('contact', editableContent.contact)}
                title="Modifier avec IA"
              />
            </div>
          )}
        </div>

        {/* Profil professionnel */}
        <div className="mt-4">
          {editingField === 'profileTitle' ? (
            <input
              type="text"
              value={editableContent.profileTitle}
              onChange={(e) => setEditableContent(prev => ({ ...prev, profileTitle: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h4
                className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('profileTitle')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.profileTitle}
              </h4>
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('profileTitle', editableContent.profileTitle)}
                title="Modifier avec IA"
              />
            </div>
          )}

          {editingField === 'profileContent' ? (
            <textarea
              value={editableContent.profileContent}
              onChange={(e) => setEditableContent(prev => ({ ...prev, profileContent: e.target.value }))}
              onBlur={() => setEditingField(null)}
              className="text-sm w-full border border-gray-400 focus:outline-none focus:border-violet-500 p-1 rounded"
              autoFocus
              rows={3}
            />
          ) : (
            <div className="flex items-start gap-2">
              <p
                className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105 line-clamp-3"
                onClick={() => setEditingField('profileContent')}
                style={{ color: `#${customColor}` }}
              >
                {editableContent.profileContent}
              </p>
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('profileContent', editableContent.profileContent)}
                title="Modifier avec IA"
                className="mt-1"
              />
            </div>
          )}
        </div>

        {/* Expérience professionnelle */}
        <div className="mt-4">
          {editingField === 'experienceTitle' ? (
            <input
              type="text"
              value={editableContent.experienceTitle}
              onChange={(e) => setEditableContent(prev => ({ ...prev, experienceTitle: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h4
                className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded whitespace-nowrap transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('experienceTitle')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.experienceTitle}
              </h4>
              <div className="flex gap-1 ml-auto">
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI('experienceTitle', editableContent.experienceTitle)}
                  title="Modifier avec IA"
                />
                <button
                  onClick={addExperience}
                  className="p-1 text-violet-600 hover:text-violet-800 transition-all duration-200 hover:scale-110"
                  title="Ajouter une expérience"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {experiences.map(exp => (
            <div key={exp.id} className="relative group">
              <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI('experienceContent', exp.content)}
                  title="Modifier avec IA"
                />
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Supprimer l'expérience"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {editingField === `experienceContent-${exp.id}` ? (
                <input
                  type="text"
                  value={exp.content}
                  onChange={(e) => setExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, content: e.target.value } : item))}
                  onBlur={() => setEditingField(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                  className="text-sm w-full border-b border-gray-400 focus:outline-none focus:border-violet-500 mt-2"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <p
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 font-bold transition-all duration-200 hover:scale-105"
                    onClick={() => setEditingField(`experienceContent-${exp.id}`)}
                    style={{ color: `#${customColor}` }}
                  >
                    {exp.content}
                  </p>
                </div>
              )}

              {editingField === `experienceDetails-${exp.id}` ? (
                <textarea
                  value={exp.details}
                  onChange={(e) => setExperiences(prev => prev.map(item => item.id === exp.id ? { ...item, details: e.target.value } : item))}
                  onBlur={() => setEditingField(null)}
                  className="text-sm w-full border border-gray-400 focus:outline-none focus:border-violet-500 p-1 rounded mt-1"
                  autoFocus
                  rows={2}
                />
              ) : (
                <div className="flex items-start gap-2 mt-1">
                  <p
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                    onClick={() => setEditingField(`experienceDetails-${exp.id}`)}
                    style={{ color: `#${customColor}` }}
                  >
                    {exp.details}
                  </p>
                  <AIButton
                    isLoading={isLoading}
                    onClick={() => generateWithAI('experienceDetails', exp.details)}
                    title="Modifier avec IA"
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formation */}
        <div className="mt-4">
          {editingField === 'educationTitle' ? (
            <input
              type="text"
              value={editableContent.educationTitle}
              onChange={(e) => setEditableContent(prev => ({ ...prev, educationTitle: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h4
                className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('educationTitle')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.educationTitle}
              </h4>
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('educationTitle', editableContent.educationTitle)}
                title="Modifier avec IA"
              />
            </div>
          )}

          {editingField === 'educationContent' ? (
            <input
              type="text"
              value={editableContent.educationContent}
              onChange={(e) => setEditableContent(prev => ({ ...prev, educationContent: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-sm w-full border-b border-gray-400 focus:outline-none focus:border-violet-500 mt-2"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <p
                className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('educationContent')}
                style={{ color: `#${customColor}` }}
              >
                {editableContent.educationContent}
              </p>
              <AIButton
                isLoading={isLoading}
                onClick={() => generateWithAI('educationContent', editableContent.educationContent)}
                title="Modifier avec IA"
              />
            </div>
          )}
        </div>

        {/* Compétences */}
        <div className="mt-4">
          {editingField === 'skillsTitle' ? (
            <input
              type="text"
              value={editableContent.skillsTitle}
              onChange={(e) => setEditableContent(prev => ({ ...prev, skillsTitle: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h4
                className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded transition-all duration-200 hover:scale-105"
                onClick={() => setEditingField('skillsTitle')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.skillsTitle}
              </h4>
              <div className="flex gap-1 ml-auto">
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI('skillsTitle', editableContent.skillsTitle)}
                  title="Modifier avec IA"
                />
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
              <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                  className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                  onClick={() => setEditingField(`skillContent-${skill.id}`)}
                  style={{ color: `#${customColor}` }}
                >
                  {skill.content}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Langues */}
        <div className="mt-4">
          {editingField === 'languagesTitle' ? (
            <input
              type="text"
              value={editableContent.languagesTitle}
              onChange={(e) => setEditableContent(prev => ({ ...prev, languagesTitle: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-violet-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h4
                className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setEditingField('languagesTitle')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.languagesTitle}
              </h4>
              <div className="flex gap-1 ml-auto">
                <AIButton
                  isLoading={isLoading}
                  onClick={() => generateWithAI('languagesTitle', editableContent.languagesTitle)}
                  title="Modifier avec IA"
                />
                <button
                  onClick={addLanguage}
                  className="p-1 text-violet-600 hover:text-violet-800"
                  title="Ajouter une langue"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Liste des langues */}
          <div className="mt-2">
            {languages.map(lang => (
              <div key={lang.id} className="relative group flex items-center gap-2 mt-1">
                <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AIButton
                    isLoading={isLoading}
                    onClick={() => generateWithAI(`languageLevel-${lang.id}`, lang.level)}
                    title="Générer le niveau avec IA"
                  />
                  <button
                    onClick={() => removeLanguage(lang.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Supprimer la langue"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>

                {editingField === `languageName-${lang.id}` ? (
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => setLanguages(prev => prev.map(item => item.id === lang.id ? { ...item, name: e.target.value } : item))}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                    className="text-sm w-1/2 border-b border-gray-400 focus:outline-none focus:border-violet-500"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                    onClick={() => setEditingField(`languageName-${lang.id}`)}
                    style={{ color: `#${customColor}` }}
                  >
                    {lang.name}
                  </p>
                )}

                {editingField === `languageLevel-${lang.id}` ? (
                  <input
                    type="text"
                    value={lang.level}
                    onChange={(e) => setLanguages(prev => prev.map(item => item.id === lang.id ? { ...item, level: e.target.value } : item))}
                    onBlur={() => setEditingField(null)}
                    onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
                    className="text-sm w-1/2 border-b border-gray-400 focus:outline-none focus:border-violet-500"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 transition-all duration-200 hover:scale-105"
                    onClick={() => setEditingField(`languageLevel-${lang.id}`)}
                    style={{ color: `#${customColor}` }}
                  >
                    ({lang.level})
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};