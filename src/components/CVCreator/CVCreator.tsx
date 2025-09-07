import React, { useState } from 'react';
import { Document, Packer, Paragraph, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { useOpenAI } from '../../hooks/useOpenAI';
import { Sparkles, Plus, Minus } from 'lucide-react';
import { StyleControls } from './StyleControls';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  image: string;
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
  const [error, setError] = useState<string | null>(null);
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
  const { editCVField, isLoading, error: openAIError } = useOpenAI();

  const generateWithAI = async (field: string, currentContent?: string) => {
    // Ne pas générer avec l'IA si le champ est déjà en cours d'édition
    if (editingField === field) return;

    // Réinitialiser l'erreur au début de la fonction
    setError(null);

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
          prompt = "Génère un résumé professionnel très concis en un seul paragraphe de maximum 2 phrases pour un CV. Le résumé doit être percutant et synthétique. Réponds uniquement avec le texte du résumé, sans balises HTML, sans <p>, sans texte supplémentaire.";
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

      // Si du contenu actuel est fourni, combiner avec le prompt
      if (currentContent && currentContent.trim()) {
        prompt = `${prompt} Voici le contenu actuel à améliorer ou modifier : "${currentContent}"`;
      }

      // Appeler l'API OpenAI
      const aiResponse = await editCVField({ prompt });

      if (aiResponse) {
        // Gérer les différents types de champs
        if (field === 'experienceContent' && currentContent) {
          // Trouver l'expérience correspondante et la mettre à jour
          const expToUpdate = experiences.find(exp => exp.content === currentContent);
          if (expToUpdate) {
            setExperiences(prev => prev.map(exp =>
              exp.id === expToUpdate.id ? { ...exp, content: aiResponse } : exp
            ));
          }
        } else if (field === 'experienceDetails' && currentContent) {
          // Trouver l'expérience correspondante et mettre à jour les détails
          const expToUpdate = experiences.find(exp => exp.details === currentContent);
          if (expToUpdate) {
            setExperiences(prev => prev.map(exp =>
              exp.id === expToUpdate.id ? { ...exp, details: aiResponse } : exp
            ));
          }
        } else if (field === 'skillContent' && currentContent) {
          // Trouver la compétence correspondante et la mettre à jour
          const skillToUpdate = skills.find(skill => skill.content === currentContent);
          if (skillToUpdate) {
            setSkills(prev => prev.map(skill =>
              skill.id === skillToUpdate.id ? { ...skill, content: aiResponse } : skill
            ));
          }
        } else if (field.startsWith('languageLevel-') && currentContent) {
          // Extraire l'ID de la langue et mettre à jour le niveau
          const langId = parseInt(field.split('-')[1]);
          setLanguages(prev => prev.map(lang =>
            lang.id === langId ? { ...lang, level: aiResponse } : lang
          ));
        } else {
          // Mettre à jour le contenu éditable avec la réponse de l'IA
          setEditableContent(prev => ({ ...prev, [field]: aiResponse }));
        }
      } else {
        // En cas d'erreur, définir un message d'erreur
        setError('Erreur lors de la génération avec IA. Veuillez vérifier votre clé API OpenAI dans les paramètres.');
      }
    } catch (error) {
      console.error('Erreur lors de la génération avec IA:', error);
      // En cas d'erreur, on affiche un message à l'utilisateur
      setError('Erreur lors de la génération avec IA: ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
      // Réinitialiser le message d'erreur après 5 secondes
      setTimeout(() => setError(null), 5000);
    }
  };


  const templates = [
    {
      id: "1",
      name: "Minimaliste",
      description: "CV clair et sobre, idéal pour les profils tech.",
      category: "Moderne",
      atsScore: 90,
      preview: "bg-gradient-to-br from-violet-100 to-indigo-100",
      image: "/images/minimalist.jpg",
      theme: { primaryColor: "2E3A59", font: "Calibri" },
    },
    {
      id: "2",
      name: "Créatif",
      description: "Un modèle visuel et audacieux pour les métiers artistiques.",
      category: "Créatif",
      atsScore: 70,
      preview: "bg-gradient-to-br from-pink-100 to-rose-100",
      image: "/images/creatif.jpg",
      theme: { primaryColor: "2563EB", font: "Helvetica" },
    },
    {
      id: "3",
      name: "Corporate",
      description: "Pour les candidatures sérieuses et formelles.",
      category: "Classique",
      atsScore: 85,
      preview: "bg-gradient-to-br from-gray-100 to-slate-100",
      image: "/images/corporate.jpg",
      theme: { primaryColor: "111827", font: "Times New Roman" },
    },
    {
      id: "4",
      name: "Moderne Coloré",
      description: "Design contemporain avec des touches de couleur vive.",
      category: "Moderne",
      atsScore: 88,
      preview: "bg-gradient-to-br from-violet-100 to-purple-100",
      image: "/images/modern.jpg",
      theme: { primaryColor: "7C3AED", font: "Calibri" },
    },
    {
      id: "5",
      name: "Élégant B&W",
      description: "Style sobre en noir et blanc pour un look professionnel raffiné.",
      category: "Classique",
      atsScore: 92,
      preview: "bg-gradient-to-br from-gray-100 to-gray-200",
      image: "/images/elegant-bw.jpg",
      theme: { primaryColor: "0F172A", font: "Georgia" },
    },
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

  // Composant d'animation de chargement avec trois points
  const LoadingDots = () => (
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

  return (
    <div className='w-full'>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-4 text-center">Créateur de CV</h1>

      <div className="p-4 flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-1/2">
          {/* Aperçu dynamique en temps réel */}
          <div className="w-full" style={{ aspectRatio: '1 / 1.414' }}>
            <div className="border border-violet-500 rounded-lg p-4 bg-gray-50 h-full overflow-auto shadow-md" style={{
              fontFamily: customFont,
              boxSizing: 'border-box'
            }}>
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
        </div>

        <div className="w-full lg:w-1/2 bg-gray-50 p-0 rounded-xl border border-violet-300 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`
      m-2 rounded-xl border shadow-md transition-all duration-300 ease-in-out relative flex flex-col h-full min-h-[200px] overflow-hidden
      ${selectedTemplate === template.id
                    ? 'border-violet-500 bg-pink-500'
                    : 'border-gray-200 bg-white'}
      hover:cursor-pointer hover:border-violet-600 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
    `}
                style={{
                  backgroundImage: `url(${template.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Overlay flou blanc par-dessus l'image */}
                <div className="absolute inset-0 bg-white/40 z-0"></div>

                {/* Bandeau en haut */}
                <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-violet-500/60 to-purple-500/50  px-4 py-2 z-10 ">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="text-md font-bold text-white drop-shadow-lg">{template.name}</h3>
                      <p className="text-sm text-white/90 leading-snug drop-shadow-md">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contenu principal sous le bandeau */}
                <div className="relative z-10 flex flex-col h-full pt-20 px-4 pb-4">
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-auto gap-2 sm:gap-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full w-fit">
                        {template.category}
                      </span>

                      {/* Barre ATS */}
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                          style={{ width: `${template.atsScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Bouton Télécharger */}
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all relative z-10 center-below-1156px"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateDocx(template);
                      }}
                    >
                      Télécharger
                    </button>
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
