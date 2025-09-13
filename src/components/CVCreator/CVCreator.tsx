import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { useOpenAI } from '../../hooks/useOpenAI';
import { useSupabase } from '../../hooks/useSupabase';
import { useLocalStorageCV } from '../../hooks/useLocalStorageCV';
import { CVPreviewDragDrop } from './CVPreviewDragDrop';
import type { CVExperience, CVSkill, CVLanguage, CVContent, CVEducation } from './types';

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
  // Neutres
  { name: 'Noir', value: '000000', category: 'Neutres' },
  { name: 'Gris anthracite', value: '374151', category: 'Neutres' },
  { name: 'Gris ardoise', value: '64748B', category: 'Neutres' },
  { name: 'Gris clair', value: '94A3B8', category: 'Neutres' },
  
  // Bleus
  { name: 'Bleu nuit', value: '1E3A8A', category: 'Bleus' },
  { name: 'Bleu marine', value: '1E40AF', category: 'Bleus' },
  { name: 'Bleu royal', value: '2563EB', category: 'Bleus' },
  { name: 'Bleu ciel', value: '3B82F6', category: 'Bleus' },
  
  // Verts
  { name: 'Vert sapin', value: '064E3B', category: 'Verts' },
  { name: 'Vert forêt', value: '065F46', category: 'Verts' },
  { name: 'Émeraude', value: '059669', category: 'Verts' },
  { name: 'Vert menthe', value: '10B981', category: 'Verts' },
  
  // Violets
  { name: 'Violet profond', value: '581C87', category: 'Violets' },
  { name: 'Violet royal', value: '7C3AED', category: 'Violets' },
  { name: 'Violet clair', value: '8B5CF6', category: 'Violets' },
  { name: 'Lavande', value: 'A78BFA', category: 'Violets' },
  
  // Rouges
  { name: 'Bordeaux', value: '7F1D1D', category: 'Rouges' },
  { name: 'Rouge cardinal', value: 'DC2626', category: 'Rouges' },
  { name: 'Rouge corail', value: 'EF4444', category: 'Rouges' },
  { name: 'Rose', value: 'F87171', category: 'Rouges' },
  
  // Oranges
  { name: 'Orange brûlé', value: 'C2410C', category: 'Oranges' },
  { name: 'Orange vif', value: 'EA580C', category: 'Oranges' },
  { name: 'Orange clair', value: 'FB923C', category: 'Oranges' },
  { name: 'Pêche', value: 'FDBA74', category: 'Oranges' }
];

export const CVCreator: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customFont, setCustomFont] = useState<string>('Calibri');
  const [customColor, setCustomColor] = useState<string>('000000');
  const [titleColor, setTitleColor] = useState<string>('000000');
  const [layoutColumns, setLayoutColumns] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [editableContent, setEditableContent] = useState<CVContent>({
    name: '[VOTRE NOM]',
    contact: '[Votre Email] • [Votre Téléphone] • [LinkedIn]',
    profileTitle: 'PROFIL PROFESSIONNEL',
    profileContent: 'Résumé de votre profil et de vos objectifs.',
    experienceTitle: 'EXPÉRIENCE PROFESSIONNELLE',
    educationTitle: 'FORMATION',
    skillsTitle: 'COMPÉTENCES TECHNIQUES',
    languagesTitle: 'LANGUES'
  });

  // Hook pour récupérer les données du profil utilisateur
  const { profile, profileLoading } = useSupabase();

  // Hook pour la sauvegarde automatique dans localStorage
  const {
    saveToLocalStorage,
    loadFromLocalStorage,
    hasLocalData,
    lastSaved,
    autoSaveEnabled,
    setAutoSaveEnabled
  } = useLocalStorageCV();

  const [experiences, setExperiences] = useState<CVExperience[]>([
    { id: 1, content: '[Poste] - [Entreprise] (Dates)', details: '• Réalisation clé ou projet important.' }
  ]);

  const [skills, setSkills] = useState<CVSkill[]>([
    { id: 1, content: 'Compétence 1' },
    { id: 2, content: 'Compétence 2' },
    { id: 3, content: 'Compétence 3' }
  ]);

  const [languages, setLanguages] = useState<CVLanguage[]>([
    { id: 1, name: 'Français', level: 'Natif' },
    { id: 2, name: 'Anglais', level: 'Courant' }
  ]);

  const [educations, setEducations] = useState<CVEducation[]>([
    { id: 1, degree: '[Diplôme]', school: '[École]', year: '[Année]' }
  ]);

  const [editingField, setEditingField] = useState<string | null>(null);
  const { editCVField, isLoading, error: openAIError } = useOpenAI();

  // Effet pour pré-remplir le CV avec les données du profil utilisateur
  useEffect(() => {
    console.log('CVCreator useEffect - Profile:', profile);
    console.log('CVCreator useEffect - ProfileLoading:', profileLoading);
    
    // Essayer de récupérer les données depuis localStorage si pas de profil Supabase
    let profileData = profile;
    
    if (!profile && !profileLoading) {
      console.log('CVCreator - Pas de profil Supabase, tentative de récupération depuis localStorage');
      try {
        const savedSettings = localStorage.getItem('cvAssistantSettings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          console.log('CVCreator - Settings complets:', settings);
          if (settings.profile) {
            console.log('CVCreator - Données trouvées dans localStorage:', settings.profile);
            console.log('CVCreator - firstName:', settings.profile.firstName);
            console.log('CVCreator - lastName:', settings.profile.lastName);
            console.log('CVCreator - profession:', settings.profile.profession);
            console.log('CVCreator - company:', settings.profile.company);
            
            // Convertir le format localStorage vers le format Supabase
            profileData = {
              id: 'localStorage-profile',
              first_name: settings.profile.firstName || '',
              last_name: settings.profile.lastName || '',
              email: settings.profile.email || '',
              phone: settings.profile.phone || '',
              address: settings.profile.address || '',
              postal_code: settings.profile.postalCode || '',
              city: settings.profile.city || '',
              country: settings.profile.country || '',
              date_of_birth: settings.profile.dateOfBirth || '',
              nationality: settings.profile.nationality || '',
              linkedin: settings.profile.linkedIn || '',
              website: settings.profile.website || '',
              profession: settings.profile.profession || '',
              company: settings.profile.company || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            console.log('CVCreator - ProfileData converti:', profileData);
          }
        }
      } catch (error) {
        console.error('CVCreator - Erreur lors de la lecture du localStorage:', error);
      }
    }
    
    if (profileData) {
      console.log('CVCreator - Pré-remplissage avec les données du profil:', profileData);
      
      // Construire le nom complet
      const fullName = `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim();
      console.log('CVCreator - Nom complet:', fullName);
      
      // Construire la ligne de contact
      const contactParts = [];
      if (profileData.email) contactParts.push(profileData.email);
      if (profileData.phone) contactParts.push(profileData.phone);
      if (profileData.linkedin) contactParts.push(profileData.linkedin);
      const contactLine = contactParts.length > 0 ? contactParts.join(' • ') : '[Votre Email] • [Votre Téléphone] • [LinkedIn]';
      console.log('CVCreator - Ligne de contact:', contactLine);
      
      // Construire le contenu du profil professionnel
      let profileContent = 'Résumé de votre profil et de vos objectifs.';
      if (profileData.profession && profileData.company) {
        profileContent = `${profileData.profession} chez ${profileData.company}. Professionnel expérimenté avec une expertise dans mon domaine d'activité.`;
      } else if (profileData.profession) {
        profileContent = `${profileData.profession} expérimenté avec une solide expertise dans mon domaine d'activité.`;
      }
      console.log('CVCreator - Contenu profil:', profileContent);

      // Créer le nouveau contenu sans dépendre de l'état actuel editableContent
      // pour éviter la dépendance circulaire
      const defaultContent = {
        name: '[VOTRE NOM]',
        contact: '[Votre Email] • [Votre Téléphone] • [LinkedIn]',
        profileTitle: 'PROFIL PROFESSIONNEL',
        profileContent: 'Résumé de votre profil et de vos objectifs.',
        experienceTitle: 'EXPÉRIENCE PROFESSIONNELLE',
        educationTitle: 'FORMATION',
        skillsTitle: 'COMPÉTENCES TECHNIQUES',
        languagesTitle: 'LANGUES'
      };

      const newContent = {
        ...defaultContent,
        name: fullName || defaultContent.name,
        contact: contactLine,
        profileContent: profileContent
      };
      
      console.log('CVCreator - Nouveau contenu:', newContent);
      setEditableContent(newContent);

      // Mettre à jour l'expérience professionnelle si on a des infos
      if (profileData.profession && profileData.company) {
        const newExperience = [{
          id: 1,
          content: `${profileData.profession} - ${profileData.company} (Dates)`,
          details: '• Réalisation clé ou projet important dans ce poste.'
        }];
        console.log('CVCreator - Nouvelle expérience:', newExperience);
        setExperiences(newExperience);
      }

      // Mettre à jour la formation si on a des infos
      if (profileData.profession) {
        const newEducation = [{
          id: 1,
          degree: `Formation en ${profileData.profession}`,
          school: '[École]',
          year: '[Année]'
        }];
        console.log('CVCreator - Nouvelle formation:', newEducation);
        setEducations(newEducation);
      }
    } else {
      console.log('CVCreator - Aucune donnée de profil disponible');
    }
  }, [profile, profileLoading]);

  // Effet pour charger les données sauvegardées au démarrage
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData && !profile && !profileLoading) {
      console.log('Chargement des données CV depuis localStorage');
      
      if (savedData.editableContent) {
        setEditableContent(savedData.editableContent);
      }
      if (savedData.experiences) {
        setExperiences(savedData.experiences);
      }
      if (savedData.skills) {
        setSkills(savedData.skills);
      }
      if (savedData.languages) {
        setLanguages(savedData.languages);
      }
      if (savedData.educations) {
        setEducations(savedData.educations);
      }
      if (savedData.customFont) {
        setCustomFont(savedData.customFont);
      }
      if (savedData.customColor) {
        setCustomColor(savedData.customColor);
      }
      if (savedData.titleColor) {
        setTitleColor(savedData.titleColor);
      }
      if (savedData.layoutColumns) {
        setLayoutColumns(savedData.layoutColumns);
      }
    }
  }, [loadFromLocalStorage, profile, profileLoading]);

  // Effet pour sauvegarder automatiquement les modifications
  useEffect(() => {
    if (autoSaveEnabled) {
      const dataToSave = {
        editableContent,
        experiences,
        skills,
        languages,
        educations,
        customFont,
        customColor,
        titleColor,
        layoutColumns
      };
      
      saveToLocalStorage(dataToSave);
    }
  }, [
    editableContent,
    experiences,
    skills,
    languages,
    educations,
    customFont,
    customColor,
    titleColor,
    layoutColumns,
    saveToLocalStorage,
    autoSaveEnabled
  ]);

  const generateWithAI = async (field: string, currentContent?: string) => {
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
        case 'educationDegree':
          prompt = "Génère un nom de diplôme pour un CV. Réponds uniquement avec le nom du diplôme, sans texte supplémentaire.";
          break;
        case 'educationSchool':
          prompt = "Génère un nom d'école ou d'université pour un CV. Réponds uniquement avec le nom de l'établissement, sans texte supplémentaire.";
          break;
        case 'educationYear':
          prompt = "Génère une année ou période d'études pour un CV (ex: 2020, 2018-2020). Réponds uniquement avec l'année, sans texte supplémentaire.";
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
        } else if (field === 'educationDegree' && currentContent) {
          // Trouver la formation correspondante et mettre à jour le diplôme
          const eduToUpdate = educations.find(edu => edu.degree === currentContent);
          if (eduToUpdate) {
            setEducations(prev => prev.map(edu =>
              edu.id === eduToUpdate.id ? { ...edu, degree: aiResponse } : edu
            ));
          }
        } else if (field === 'educationSchool' && currentContent) {
          // Trouver la formation correspondante et mettre à jour l'école
          const eduToUpdate = educations.find(edu => edu.school === currentContent);
          if (eduToUpdate) {
            setEducations(prev => prev.map(edu =>
              edu.id === eduToUpdate.id ? { ...edu, school: aiResponse } : edu
            ));
          }
        } else if (field === 'educationYear' && currentContent) {
          // Trouver la formation correspondante et mettre à jour l'année
          const eduToUpdate = educations.find(edu => edu.year === currentContent);
          if (eduToUpdate) {
            setEducations(prev => prev.map(edu =>
              edu.id === eduToUpdate.id ? { ...edu, year: aiResponse } : edu
            ));
          }
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
      image: "/images/minimalist.png",
      theme: { primaryColor: "2E3A59", font: "Calibri" },
    },
    {
      id: "2",
      name: "Créatif",
      description: "Un modèle visuel et audacieux pour les métiers artistiques.",
      category: "Créatif",
      atsScore: 70,
      preview: "bg-gradient-to-br from-pink-100 to-rose-100",
      image: "/images/creatif.png",
      theme: { primaryColor: "2563EB", font: "Helvetica" },
    },
    {
      id: "3",
      name: "Corporate",
      description: "Pour les candidatures sérieuses et formelles.",
      category: "Classique",
      atsScore: 85,
      preview: "bg-gradient-to-br from-gray-100 to-slate-100",
      image: "/images/corporate.png",
      theme: { primaryColor: "111827", font: "Times New Roman" },
    },
    {
      id: "4",
      name: "Moderne Coloré",
      description: "Design contemporain avec des touches de couleur vive.",
      category: "Moderne",
      atsScore: 88,
      preview: "bg-gradient-to-br from-violet-100 to-purple-100",
      image: "/images/modern.png",
      theme: { primaryColor: "7C3AED", font: "Calibri" },
    },
    {
      id: "5",
      name: "Élégant B&W",
      description: "Style sobre en noir et blanc pour un look professionnel raffiné.",
      category: "Classique",
      atsScore: 92,
      preview: "bg-gradient-to-br from-gray-100 to-gray-200",
      image: "/images/elegant-bw.png",
      theme: { primaryColor: "0F172A", font: "Georgia" },
    },
    {
      id: "6",
      name: "Émeraude",
      description: "Style élégant avec des accents émeraude pour un look professionnel moderne.",
      category: "Moderne",
      atsScore: 94,
      preview: "bg-gradient-to-br from-emerald-100 to-green-100",
      image: "/images/emeraude.png",
      theme: { primaryColor: "10B981", font: "Georgia" },
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

    // Générer la chaîne de caractères pour les formations
    const educationsString = educations.map(edu => `${edu.degree} - ${edu.school} - ${edu.year}`).join('\n');

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
          new Paragraph({ text: educationsString }),
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

  const addEducation = () => {
    const newId = educations.length > 0 ? Math.max(...educations.map(edu => edu.id)) + 1 : 1;
    setEducations(prev => [...prev, { id: newId, degree: '[Diplôme]', school: '[École]', year: '[Année]' }]);
  };

  const removeEducation = (id: number) => {
    setEducations(prev => prev.filter(edu => edu.id !== id));
  };

  return (
    <div className='w-full'>
      <h1 className="heading-gradient text-center">Créateur de CV</h1>

      {/* Indicateur de sauvegarde automatique */}
      <div className="flex justify-center items-center gap-4 mb-0 p-1 bg-gray-50 rounded-lg mx-4">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => setAutoSaveEnabled(e.target.checked)}
              className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            Sauvegarde automatique
          </label>
        </div>
        
        {lastSaved && (
          <div className="text-xs text-gray-500">
            Dernière sauvegarde : {lastSaved.toLocaleTimeString()}
          </div>
        )}
        
        {hasLocalData() && (
          <div className="text-xs text-green-600 flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Données sauvegardées localement
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col lg:flex-row gap-6">

        <div className="w-full lg:w-1/2">
          {/* Aperçu dynamique en temps réel */}
          <CVPreviewDragDrop
            editableContent={editableContent}
            setEditableContent={setEditableContent}
            experiences={experiences}
            setExperiences={setExperiences}
            skills={skills}
            setSkills={setSkills}
            languages={languages}
            setLanguages={setLanguages}
            educations={educations}
            setEducations={setEducations}
            editingField={editingField}
            setEditingField={setEditingField}
            customFont={customFont}
            setCustomFont={setCustomFont}
            customColor={customColor}
            setCustomColor={setCustomColor}
            titleColor={titleColor}
            setTitleColor={setTitleColor}
            layoutColumns={layoutColumns}
            setLayoutColumns={setLayoutColumns}
            availableFonts={availableFonts}
            availableColors={availableColors}
            addExperience={addExperience}
            removeExperience={removeExperience}
            addSkill={addSkill}
            removeSkill={removeSkill}
            addLanguage={addLanguage}
            removeLanguage={removeLanguage}
            addEducation={addEducation}
            removeEducation={removeEducation}
            generateWithAI={generateWithAI}
            isLoading={isLoading}
            error={error}
            openAIError={openAIError}
          />
        </div>

        <div className="w-full lg:w-1/2 bg-gray-50 p-0 rounded-xl border border-violet-300 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  // Appliquer automatiquement le thème du template
                  setCustomColor(template.theme.primaryColor);
                  setTitleColor(template.theme.primaryColor);
                  setCustomFont(template.theme.font);
                }}
                className={`
      m-2 rounded-xl border shadow-md transition-all duration-300 ease-in-out relative flex flex-col overflow-hidden
      ${selectedTemplate === template.id
                    ? 'border-violet-500 bg-pink-500'
                    : 'border-gray-200 bg-white'}
      hover:cursor-pointer hover:border-violet-600 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
    `}
                style={{
                  backgroundImage: `url(${template.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  aspectRatio: '1 / 1.414' // Format A4
                }}
              >
                {/* Overlay flou blanc par-dessus l'image */}
                <div className="absolute inset-0 bg-white/40 z-0"></div>

                {/* Titre en diagonal avec fond rose semi-transparent */}
                <div className="absolute top-4 left-0 right-0 z-10 transform -rotate-12 origin-left">
                  <div className="bg-pink-500/70 text-white px-6 py-2 shadow-lg">
                    <h3 className="text-lg font-bold drop-shadow-lg">{template.name}</h3>
                  </div>
                </div>

                {/* Contenu principal en bas */}
                <div className="relative z-10 flex flex-col h-full justify-end p-4">
                  <div className="flex justify-center">
                    {/* Bouton Télécharger */}
                    <button
                      className="px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all relative z-10"
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
