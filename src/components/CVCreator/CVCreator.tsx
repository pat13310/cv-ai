import React, { useState } from 'react';
import { Document, Packer, Paragraph, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { useOpenAI } from '../../hooks/useOpenAI';
import { Sparkles, Plus, Minus } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  atsScore: number;
  theme: { primaryColor: string; font: string };
}

const availableFonts = ['Calibri', 'Georgia', 'Helvetica', 'Consolas', 'Times New Roman', 'Arial'];
const availableColors = [
  { name: 'Bleu marine', value: '2E3A59' },
  { name: 'Bleu vif', value: '2563EB' },
  { name: 'Gris foncé', value: '111827' },
  { name: 'Noir', value: '0F172A' },
  { name: 'Vert foncé', value: '064E3B' },
  { name: 'Violet', value: '7C3AED' }
];

export const CVCreator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customFont, setCustomFont] = useState<string>('Calibri');
  const [customColor, setCustomColor] = useState<string>('2E3A59');
  const [titleColor, setTitleColor] = useState<string>('2E3A59');
  const [editableContent, setEditableContent] = useState<Record<string, string>>({
    name: '[VOTRE NOM]',
    contact: '[Votre Email] • [Votre Téléphone] • [LinkedIn]',
    profileTitle: 'PROFIL PROFESSIONNEL',
    profileContent: 'Résumé de votre profil et de vos objectifs.',
    experienceTitle: 'EXPÉRIENCE PROFESSIONNELLE',
    educationTitle: 'FORMATION',
    educationContent: '[Diplôme] - [École] - [Année]',
    skillsTitle: 'COMPÉTENCES TECHNIQUES',
    languagesTitle: 'LANGUES'
  });

  const [experiences, setExperiences] = useState<Array<{ id: number; content: string; details: string }>>([
    { id: 1, content: '[Poste] - [Entreprise] (Dates)', details: '• Réalisation clé ou projet important.' }
  ]);
  
  const [skills, setSkills] = useState<Array<{ id: number; content: string }>>([
    { id: 1, content: 'Compétence 1' },
    { id: 2, content: 'Compétence 2' },
    { id: 3, content: 'Compétence 3' }
  ]);
  
  const [languages, setLanguages] = useState<Array<{ id: number; name: string; level: string }>>([
    { id: 1, name: 'Français', level: 'Natif' },
    { id: 2, name: 'Anglais', level: 'Courant' }
  ]);
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const { generateCVContent, isLoading } = useOpenAI();
  
  const generateWithAI = async (field: string) => {
    // Ne pas générer avec l'IA si le champ est déjà en cours d'édition
    if (editingField === field) return;
    
    try {
      // Déterminer le prompt en fonction du champ
      let prompt = '';
      switch (field) {
        case 'name':
          prompt = "Génère un nom professionnel pour un CV. Réponds uniquement avec le nom, sans texte supplémentaire.";
          break;
        case 'contact':
          prompt = "Génère une ligne de contact professionnelle pour un CV au format '[Email] • [Téléphone] • [LinkedIn]'. Réponds uniquement avec la ligne de contact, sans texte supplémentaire.";
          break;
        case 'profileTitle':
          prompt = "Génère un titre de section pour le profil professionnel dans un CV. Réponds uniquement avec le titre, sans texte supplémentaire.";
          break;
        case 'profileContent':
          prompt = "Génère un résumé professionnel concis et percutant pour un CV. Réponds uniquement avec le résumé, sans texte supplémentaire.";
          break;
        case 'experienceTitle':
          prompt = "Génère un titre de section pour l'expérience professionnelle dans un CV. Réponds uniquement avec le titre, sans texte supplémentaire.";
          break;
        case 'experienceContent':
          prompt = "Génère une entrée d'expérience professionnelle au format '[Poste] - [Entreprise] (Dates)'. Réponds uniquement avec l'entrée, sans texte supplémentaire.";
          break;
        case 'experienceDetails':
          prompt = "Génère une réalisation clé ou un projet important pour une expérience professionnelle dans un CV. Commence avec '• '. Réponds uniquement avec la réalisation, sans texte supplémentaire.";
          break;
        case 'educationTitle':
          prompt = "Génère un titre de section pour la formation dans un CV. Réponds uniquement avec le titre, sans texte supplémentaire.";
          break;
        case 'educationContent':
          prompt = "Génère une entrée de formation au format '[Diplôme] - [École] - [Année]'. Réponds uniquement avec l'entrée, sans texte supplémentaire.";
          break;
        case 'skillsTitle':
          prompt = "Génère un titre de section pour les compétences techniques dans un CV. Réponds uniquement avec le titre, sans texte supplémentaire.";
          break;
        case 'languagesTitle':
          prompt = "Génère un titre de section pour les langues dans un CV. Réponds uniquement avec le titre, sans texte supplémentaire.";
          break;
        case 'skillContent':
          prompt = "Génère une compétence technique pertinente pour un CV. Réponds uniquement avec la compétence, sans texte supplémentaire.";
          break;
        default:
          // Gérer les langues étrangères
          if (field.startsWith('languageName-')) {
            prompt = "Génère le nom d'une langue étrangère pour un CV. Réponds uniquement avec le nom de la langue, sans texte supplémentaire.";
          } else if (field.startsWith('languageLevel-')) {
            prompt = "Génère un niveau de compétence pour une langue étrangère dans un CV. Réponds uniquement avec le niveau (par exemple: Courant, Intermédiaire, Débutant), sans texte supplémentaire.";
          } else {
            return;
          }
      }
      
      // Appeler l'API OpenAI
      const aiResponse = await generateCVContent({ prompt });
      
      if (aiResponse) {
        // Mettre à jour le contenu éditable avec la réponse de l'IA
        setEditableContent(prev => ({ ...prev, [field]: aiResponse }));
      }
    } catch (error) {
      console.error('Erreur lors de la génération avec IA:', error);
      // En cas d'erreur, on pourrait afficher un message à l'utilisateur
    }
  };

  const templates: Template[] = [
    { id: '1', name: 'CV Professionnel', description: 'Design sobre et efficace', preview: 'bg-gradient-to-br from-violet-100 to-pink-100', category: 'Développement', atsScore: 94, theme: { primaryColor: '2E3A59', font: 'Calibri' } },
    { id: '2', name: 'CV Créatif', description: 'Pour profils artistiques', preview: 'bg-gradient-to-br from-blue-100 to-cyan-100', category: 'Marketing', atsScore: 89, theme: { primaryColor: '2563EB', font: 'Georgia' } },
    { id: '3', name: 'CV Minimaliste', description: 'Épuré et élégant', preview: 'bg-gradient-to-br from-pink-100 to-rose-100', category: 'Minimaliste', atsScore: 96, theme: { primaryColor: '111827', font: 'Helvetica' } },
    { id: '4', name: 'CV Technologie', description: 'Idéal profils tech', preview: 'bg-gradient-to-br from-gray-100 to-slate-100', category: 'Développement', atsScore: 97, theme: { primaryColor: '0F172A', font: 'Consolas' } },
    { id: '5', name: 'CV Finance', description: 'Sérieux et structuré', preview: 'bg-gradient-to-br from-emerald-100 to-teal-100', category: 'Finance', atsScore: 95, theme: { primaryColor: '064E3B', font: 'Times New Roman' } },
    { id: '6', name: 'CV Marketing', description: 'Dynamique et percutant', preview: 'bg-gradient-to-br from-indigo-100 to-purple-100', category: 'Marketing', atsScore: 93, theme: { primaryColor: '7C3AED', font: 'Arial' } }
  ];

  const getSkillsByCategory = (category: string) => {
    switch (category) {
      case 'Développement': return ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'SQL', 'Git', 'Docker'];
      case 'Marketing': return ['Google Analytics', 'SEO/SEM', 'Social Media', 'Content Marketing', 'Email Marketing', 'CRM'];
      case 'Finance': return ['Excel', 'Modélisation financière', 'Analyse de risque', 'Bloomberg', 'SAP'];
      default: return ['Communication', 'Travail d\'équipe', 'Résolution de problèmes', 'Adaptabilité'];
    }
  };

  const generateDocx = async (template: Template) => {
    const skills = getSkillsByCategory(template.category);

    // Générer la chaîne de caractères pour les langues
    const languagesString = languages.map(lang => `${lang.name} (${lang.level})`).join(' • ');

    const doc = new Document({
      styles: {
        default: {
          document: { run: { font: customFont } }
        },
        paragraphStyles: [
          {
            id: 'Title',
            name: 'Title',
            basedOn: 'Normal',
            run: { size: 48, bold: true, color: titleColor },
            paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 300 } }
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            basedOn: 'Normal',
            run: { size: 28, bold: true, color: titleColor },
            paragraph: { spacing: { before: 200, after: 100 } }
          }
        ]
      },
      sections: [{
        children: [
          new Paragraph({ text: editableContent.name, style: 'Title' }),
          new Paragraph({ text: editableContent.contact, alignment: AlignmentType.CENTER }),
          new Paragraph({ text: editableContent.profileTitle, style: 'Heading2' }),
          new Paragraph({ text: editableContent.profileContent }),
          new Paragraph({ text: editableContent.experienceTitle, style: 'Heading2' }),
          ...experiences.map(exp => [
            new Paragraph({ text: exp.content, run: { bold: true } }),
            new Paragraph({ text: exp.details })
          ]).flat(),
          new Paragraph({ text: editableContent.educationTitle, style: 'Heading2' }),
          new Paragraph({ text: editableContent.educationContent }),
          new Paragraph({ text: editableContent.skillsTitle, style: 'Heading2' }),
          ...skills.map(skill => new Paragraph({ text: `• ${skill}` })),
          new Paragraph({ text: editableContent.languagesTitle, style: 'Heading2' }),
          new Paragraph({ text: languagesString })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${template.name.replace(/\s+/g, '_').toLowerCase()}.docx`);
  };


  const addExperience = () => {
    const newId = experiences.length > 0 ? Math.max(...experiences.map(exp => exp.id)) + 1 : 1;
    setExperiences(prev => [...prev, { id: newId, content: '[Poste] - [Entreprise] (Dates)', details: '• Réalisation clé ou projet important.' }]);
  };

  const removeExperience = (id: number) => {
    setExperiences(prev => prev.filter(exp => exp.id !== id));
  };
  
  const addSkill = () => {
    const newId = skills.length > 0 ? Math.max(...skills.map(skill => skill.id)) + 1 : 1;
    setSkills(prev => [...prev, { id: newId, content: 'Nouvelle compétence' }]);
  };
  
  const removeSkill = (id: number) => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  const addLanguage = () => {
    const newId = languages.length > 0 ? Math.max(...languages.map(lang => lang.id)) + 1 : 1;
    setLanguages(prev => [...prev, { id: newId, name: 'Nouvelle langue', level: 'Niveau' }]);
  };

  const removeLanguage = (id: number) => {
    setLanguages(prev => prev.filter(lang => lang.id !== id));
  };

  return (
    <div>
    <h1 className="text-2xl font-bold mb-4">Créateur de CV</h1>
    
    <div className="p-4 flex flex-row gap-6">

      <div className="flex flex-row gap-2">
        {/* Aperçu dynamique en temps réel */}
        <div className="w-full" style={{ aspectRatio: '1 / 1.414' }}>
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 h-full overflow-auto shadow-sm" style={{
            fontFamily: customFont,
            boxSizing: 'border-box'
          }}>
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 -mt-2 -ml-2 -mr-2">
            <div className="flex gap-6 items-center">
              <div>
                <label className="block text-sm font-medium">Police</label>
                <select value={customFont} onChange={(e) => setCustomFont(e.target.value)} className="border rounded p-2">
                  {availableFonts.map(font => <option key={font} value={font}>{font}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Couleur principale</label>
                <select value={customColor} onChange={(e) => setCustomColor(e.target.value)} className="border rounded p-2">
                  {availableColors.map(color => <option key={color.value} value={color.value}>{color.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Couleur des titres</label>
                <select value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="border rounded p-2">
                  {availableColors.map(color => <option key={color.value} value={color.value}>{color.name}</option>)}
                </select>
              </div>
            </div>
          </div>

        
        {/* Nom */}
        <div className="mt-4 text-center">
          {editingField === 'name' ? (
            <input
              type="text"
              value={editableContent.name}
              onChange={(e) => setEditableContent(prev => ({ ...prev, name: e.target.value }))}
              onBlur={() => setEditingField(null)}
              onKeyDown={(e) => e.key === 'Enter' && setEditingField(null)}
              className="text-lg font-bold w-full text-center border-b border-gray-400 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h3
                className="text-lg font-bold cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setEditingField('name')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.name}
              </h3>
              <button
                onClick={() => generateWithAI('name')}
                disabled={isLoading}
                className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                title="Modifier avec IA"
              >
                <Sparkles className="w-4 h-4" />
              </button>
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
              className="text-sm w-full text-center border-b border-gray-400 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center justify-center gap-2">
              <p
                className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setEditingField('contact')}
                style={{ color: `#${customColor}` }}
              >
                {editableContent.contact}
              </p>
              <button
                onClick={() => generateWithAI('contact')}
                disabled={isLoading}
                className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                title="Modifier avec IA"
              >
                <Sparkles className="w-4 h-4" />
              </button>
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
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h4
                className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setEditingField('profileTitle')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.profileTitle}
              </h4>
              <button
                onClick={() => generateWithAI('profileTitle')}
                disabled={isLoading}
                className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                title="Modifier avec IA"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          )}
          
          {editingField === 'profileContent' ? (
            <textarea
              value={editableContent.profileContent}
              onChange={(e) => setEditableContent(prev => ({ ...prev, profileContent: e.target.value }))}
              onBlur={() => setEditingField(null)}
              className="text-sm w-full border border-gray-400 focus:outline-none focus:border-blue-500 p-1 rounded"
              autoFocus
              rows={3}
            />
          ) : (
            <div className="flex items-start gap-2">
              <p
                className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1"
                onClick={() => setEditingField('profileContent')}
                style={{ color: `#${customColor}` }}
              >
                {editableContent.profileContent}
              </p>
              <button
                onClick={() => generateWithAI('profileContent')}
                disabled={isLoading}
                className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50 mt-1"
                title="Modifier avec IA"
              >
                <Sparkles className="w-4 h-4" />
              </button>
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
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h4
                className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded whitespace-nowrap"
                onClick={() => setEditingField('experienceTitle')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.experienceTitle}
              </h4>
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={() => generateWithAI('experienceTitle')}
                  disabled={isLoading}
                  className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                  title="Modifier avec IA"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={addExperience}
                  className="p-1 text-blue-600 hover:text-blue-800"
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
                <button
                  onClick={() => generateWithAI('experienceContent')}
                  disabled={isLoading}
                  className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                  title="Modifier avec IA"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
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
                  className="text-sm w-full border-b border-gray-400 focus:outline-none focus:border-blue-500 mt-2"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-2 mt-2">
                  <p
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1 font-bold"
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
                  className="text-sm w-full border border-gray-400 focus:outline-none focus:border-blue-500 p-1 rounded mt-1"
                  autoFocus
                  rows={2}
                />
              ) : (
                <div className="flex items-start gap-2 mt-1">
                  <p
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1"
                    onClick={() => setEditingField(`experienceDetails-${exp.id}`)}
                    style={{ color: `#${customColor}` }}
                  >
                    {exp.details}
                  </p>
                  <button
                    onClick={() => generateWithAI('experienceDetails')}
                    disabled={isLoading}
                    className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50 mt-1"
                    title="Modifier avec IA"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
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
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-blue-500"
              autoFocus
            />
          ) : (
            <div className="flex items-center gap-2">
              <h4
                className="text-md font-semibold cursor-pointer hover:bg-gray-100 p-1 rounded"
                onClick={() => setEditingField('skillsTitle')}
                style={{ color: `#${titleColor}` }}
              >
                {editableContent.skillsTitle}
              </h4>
              <div className="flex gap-1 ml-auto">
                <button
                  onClick={() => generateWithAI('skillsTitle')}
                  disabled={isLoading}
                  className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                  title="Modifier avec IA"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={addSkill}
                  className="p-1 text-blue-600 hover:text-blue-800"
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
                <button
                  onClick={() => generateWithAI('skillContent')}
                  disabled={isLoading}
                  className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                  title="Modifier avec IA"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
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
                  className="text-sm w-full border-b border-gray-400 focus:outline-none focus:border-blue-500"
                  autoFocus
                />
              ) : (
                <p
                  className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1"
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
              className="text-md font-semibold w-full border-b border-gray-400 focus:outline-none focus:border-blue-500"
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
                <button
                  onClick={() => generateWithAI('languagesTitle')}
                  disabled={isLoading}
                  className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                  title="Modifier avec IA"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={addLanguage}
                  className="p-1 text-blue-600 hover:text-blue-800"
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
                  <button
                    onClick={() => generateWithAI(`languageLevel-${lang.id}`)}
                    disabled={isLoading}
                    className="p-1 text-violet-600 hover:text-violet-800 disabled:opacity-50"
                    title="Générer le niveau avec IA"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
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
                    className="text-sm w-1/2 border-b border-gray-400 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1"
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
                    className="text-sm w-1/2 border-b border-gray-400 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded flex-1"
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
  </div>
    
    {/* Modèles de CV */}
    <div className="w-full lg:w-1/2">
      <div className="space-y-4  overflow-y-auto">
        {templates.map(template => (
          <div key={template.id} className={`p-4 rounded-2xl shadow bg-white border ${selectedTemplate === template.id ? 'border-blue-500' : 'border-transparent'}`}>
            <div className="flex items-center gap-4 mb-3">
              <div className={`w-16 h-16 ${template.preview} rounded-lg`} />
              <div>
                <h3 className="text-lg font-semibold">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">{template.category}</span>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">ATS: {template.atsScore}%</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-500 text-white rounded-xl" onClick={() => setSelectedTemplate(template.id)}>Sélectionner</button>
                <button className="p-2 bg-green-500 text-white rounded-xl" onClick={() => generateDocx(template)}>Télécharger</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
  </div>
);
};
