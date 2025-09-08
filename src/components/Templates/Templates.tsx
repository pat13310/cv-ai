import React, { useState } from 'react';
import { Download, Eye, Star, FileText, Award, TrendingUp, Users, Search, Sparkles } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  atsScore: number;
  downloads: string;
  rating: number;
  tags: string[];
  wordFile: string;
  isPremium: boolean;
  industry: string;
}

export const Templates: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  
  const { templates, loading, error } = useSupabase();

  // Adapter les données Supabase au format attendu par le composant
  const adaptedTemplates = React.useMemo(() => templates.map(template => ({
    id: template.id,
    name: template.name,
    category: template.category,
    description: template.description,
    preview: template.preview_color,
    atsScore: template.ats_score,
    downloads: template.downloads,
    rating: template.rating,
    tags: template.tags,
    wordFile: `${template.name.toLowerCase().replace(/\s+/g, '_')}.docx`,
    isPremium: template.is_premium,
    industry: template.industry
  })), [templates]);

  // Fallback vers des données statiques si pas de templates Supabase
  const fallbackTemplates = React.useMemo(() => [
    {
      id: '1',
      name: 'CV Tech Senior Pro',
      category: 'Développement',
      description: 'Template optimisé pour les développeurs seniors avec sections dédiées aux projets techniques',
      preview: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      atsScore: 96,
      downloads: '3.2k',
      rating: 4.9,
      tags: ['Senior', 'Full Stack', 'ATS Optimisé', 'Projets'],
      wordFile: 'cv-tech-senior-pro.docx',
      isPremium: true,
      industry: 'Tech'
    },
    {
      id: '2',
      name: 'CV Marketing Digital Elite',
      category: 'Marketing',
      description: 'Design moderne pour les professionnels du marketing digital avec focus sur les KPIs',
      preview: 'bg-gradient-to-br from-pink-100 to-rose-100',
      atsScore: 94,
      downloads: '2.8k',
      rating: 4.8,
      tags: ['Marketing', 'Digital', 'KPIs', 'Créatif'],
      wordFile: 'cv-marketing-digital-elite.docx',
      isPremium: true,
      industry: 'Marketing'
    },
    {
      id: '3',
      name: 'CV Executive Premium',
      category: 'Management',
      description: 'Template élégant pour postes de direction avec mise en avant du leadership',
      preview: 'bg-gradient-to-br from-gray-100 to-slate-100',
      atsScore: 95,
      downloads: '1.9k',
      rating: 4.9,
      tags: ['Executive', 'Leadership', 'Premium', 'Direction'],
      wordFile: 'cv-executive-premium.docx',
      isPremium: true,
      industry: 'Management'
    },
    {
      id: '4',
      name: 'CV Designer UX/UI',
      category: 'Design',
      description: 'Template créatif pour designers avec espace portfolio et projets visuels',
      preview: 'bg-gradient-to-br from-violet-100 to-purple-100',
      atsScore: 91,
      downloads: '4.1k',
      rating: 4.7,
      tags: ['UX/UI', 'Portfolio', 'Créatif', 'Projets'],
      wordFile: 'cv-designer-ux-ui.docx',
      isPremium: false,
      industry: 'Design'
    },
    {
      id: '5',
      name: 'CV Data Scientist',
      category: 'Data Science',
      description: 'Optimisé pour les data scientists avec sections techniques et certifications',
      preview: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      atsScore: 97,
      downloads: '1.5k',
      rating: 4.8,
      tags: ['Data Science', 'Analytics', 'Python', 'ML'],
      wordFile: 'cv-data-scientist.docx',
      isPremium: true,
      industry: 'Data'
    },
    {
      id: '6',
      name: 'CV Finance Corporate',
      category: 'Finance',
      description: 'Template professionnel pour le secteur financier avec focus sur les résultats',
      preview: 'bg-gradient-to-br from-amber-100 to-orange-100',
      atsScore: 93,
      downloads: '2.1k',
      rating: 4.6,
      tags: ['Finance', 'Corporate', 'Résultats', 'Professionnel'],
      wordFile: 'cv-finance-corporate.docx',
      isPremium: true,
      industry: 'Finance'
    },
    {
      id: '7',
      name: 'CV Startup Founder',
      category: 'Startup',
      description: 'Pour entrepreneurs et fondateurs avec focus sur l\'innovation et les réalisations',
      preview: 'bg-gradient-to-br from-red-100 to-pink-100',
      atsScore: 92,
      downloads: '1.3k',
      rating: 4.7,
      tags: ['Startup', 'Innovation', 'Leadership', 'Entrepreneuriat'],
      wordFile: 'cv-startup-founder.docx',
      isPremium: true,
      industry: 'Startup'
    },
    {
      id: '8',
      name: 'CV Consultant Senior',
      category: 'Conseil',
      description: 'Template pour consultants avec focus sur les missions et résultats',
      preview: 'bg-gradient-to-br from-cyan-100 to-blue-100',
      atsScore: 94,
      downloads: '1.7k',
      rating: 4.8,
      tags: ['Conseil', 'Senior', 'Missions', 'Résultats'],
      wordFile: 'cv-consultant-senior.docx',
      isPremium: true,
      industry: 'Conseil'
    }
  ], []);

  // Utiliser les templates Supabase ou fallback
  const displayTemplates = adaptedTemplates.length > 0 ? adaptedTemplates : fallbackTemplates;

  // Générer les catégories dynamiquement depuis les templates
  const categories = React.useMemo(() => {
    if (!displayTemplates || displayTemplates.length === 0) return ['Tous'];
    
    const uniqueCategories = Array.from(new Set(displayTemplates.map(template => template.category)));
    return ['Tous', ...uniqueCategories.sort()];
  }, [displayTemplates]);

  const filteredTemplates = displayTemplates
    .filter(template => {
      const matchesCategory = selectedCategory === 'Tous' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'ats':
          return b.atsScore - a.atsScore;
        case 'downloads':
          return parseInt(b.downloads.replace('k', '')) - parseInt(a.downloads.replace('k', ''));
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
        default:
          return parseInt(b.downloads.replace('k', '')) - parseInt(a.downloads.replace('k', ''));
      }
    });

 // Afficher un état de chargement
 if (loading) {
   return (
     <div className="space-y-8">
       <div className="text-center">
         <h2 className="heading-gradient">Templates CV Word</h2>
         <p className="text-gray-600 max-w-2xl mx-auto">Chargement des templates...</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {[1, 2, 3, 4, 5, 6].map((i) => (
           <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 overflow-hidden animate-pulse">
             <div className="h-48 bg-gray-200" />
             <div className="p-6 space-y-4">
               <div className="h-4 bg-gray-200 rounded w-3/4" />
               <div className="h-3 bg-gray-200 rounded w-full" />
               <div className="h-3 bg-gray-200 rounded w-1/2" />
             </div>
           </div>
         ))}
       </div>
     </div>
   );
 }

 // Afficher une erreur si nécessaire
 if (error && adaptedTemplates.length === 0) {
   return (
     <div className="space-y-8">
       <div className="text-center">
         <h2 className="heading-gradient">Templates CV Word</h2>
         <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
           <p className="text-red-600">Erreur lors du chargement des templates: {error}</p>
           <p className="text-sm text-red-500 mt-2">Utilisation des templates par défaut.</p>
         </div>
       </div>
     </div>
   );
 }

 const handleDownloadFormat = (template: Template, format: 'word' | 'html' | 'txt' | 'pdf') => {
    try {
      let content = '';
      let filename = '';
      let mimeType = '';

      // Contenu de base adapté selon la catégorie
      const getSkillsByCategory = (category: string) => {
        switch (category) {
          case 'Développement':
            return ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python', 'SQL', 'Git', 'Docker'];
          case 'Marketing':
            return ['Google Analytics', 'SEO/SEM', 'Social Media', 'Content Marketing', 'Email Marketing', 'CRM'];
          case 'Management':
            return ['Leadership', 'Gestion d\'équipe', 'Planification stratégique', 'Budget', 'Négociation'];
          case 'Data Science':
            return ['Python', 'R', 'Machine Learning', 'SQL', 'Tableau', 'TensorFlow', 'Statistics'];
          case 'Finance':
            return ['Excel avancé', 'Modélisation financière', 'Analyse de risque', 'Bloomberg', 'SAP'];
          default:
            return ['Communication', 'Travail d\'équipe', 'Résolution de problèmes', 'Adaptabilité'];
        }
      };

      const skills = getSkillsByCategory(template.category);
      const templateName = template.name.replace(/\s+/g, '_').toLowerCase();

      switch (format) {
        case 'word':
          content = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
            <head>
              <meta charset="utf-8">
              <title>${template.name}</title>
              <style>
                body { font-family: 'Calibri', sans-serif; margin: 40px; line-height: 1.6; color: #333; }
                .header { text-align: center; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
                .name { font-size: 28px; font-weight: bold; color: #6366f1; margin-bottom: 10px; }
                .contact { font-size: 14px; color: #666; }
                .section { margin-bottom: 25px; }
                .section-title { font-size: 18px; font-weight: bold; color: #6366f1; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
                .job-title { font-wegight: bold; color: #374151; }
                .company { color: #6366f1; font-style: italic; }
                .date { color: #6b7280; font-size: 14px; }
                .skills { display: flex; flex-wrap: wrap; gap: 8px; }
                .skill { background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
                ul { padding-left: 20px; }
                li { margin-bottom: 5px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="name">[VOTRE NOM]</div>
                <div class="contact">
                  [Votre Email] • [Votre Téléphone] • [Votre Ville] • [LinkedIn]
                </div>
              </div>

              <div class="section">
                <div class="section-title">PROFIL PROFESSIONNEL</div>
                <p>[Décrivez votre profil professionnel en 2-3 lignes, en mettant l'accent sur vos compétences clés et votre expérience dans le domaine ${template.category.toLowerCase()}.]</p>
              </div>

              <div class="section">
                <div class="section-title">EXPÉRIENCE PROFESSIONNELLE</div>
                <div style="margin-bottom: 20px;">
                  <div class="job-title">[Titre du Poste]</div>
                  <div class="company">[Nom de l'Entreprise] • <span class="date">[Dates]</span></div>
                  <ul>
                    <li>Réalisation majeure avec impact quantifiable (ex: +25% de performance)</li>
                    <li>Projet important utilisant les technologies ${skills.slice(0, 3).join(', ')}</li>
                    <li>Leadership d'équipe ou initiative stratégique</li>
                  </ul>
                </div>
                <div>
                  <div class="job-title">[Poste Précédent]</div>
                  <div class="company">[Entreprise Précédente] • <span class="date">[Dates]</span></div>
                  <ul>
                    <li>Accomplissement significatif avec métriques précises</li>
                    <li>Amélioration de processus ou innovation</li>
                  </ul>
                </div>
              </div>

              <div class="section">
                <div class="section-title">COMPÉTENCES TECHNIQUES</div>
                <div class="skills">
                  ${skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                </div>
              </div>

              <div class="section">
                <div class="section-title">FORMATION</div>
                <div class="job-title">[Diplôme]</div>
                <div class="company">[École/Université] • <span class="date">[Année]</span></div>
              </div>

              <div class="section">
                <div class="section-title">LANGUES</div>
                <p>Français (Natif) • Anglais (Courant) • [Autre langue]</p>
              </div>
            </body>
            </html>
          `;
          filename = `${templateName}.doc`;
          mimeType = 'application/msword';
          break;

        case 'pdf':
          // Pour PDF, on utilise HTML qui peut être converti
          content = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <title>${template.name}</title>
              <style>
                @page { margin: 2cm; }
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { text-align: center; border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 30px; }
                .name { font-size: 24px; font-weight: bold; color: #6366f1; margin-bottom: 10px; }
                .contact { font-size: 12px; color: #666; }
                .section { margin-bottom: 20px; page-break-inside: avoid; }
                .section-title { font-size: 16px; font-weight: bold; color: #6366f1; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 10px; }
                .job-title { font-weight: bold; color: #374151; }
                .company { color: #6366f1; font-style: italic; }
                .date { color: #6b7280; font-size: 12px; }
                .skills { display: flex; flex-wrap: wrap; gap: 5px; }
                .skill { background: #f3f4f6; padding: 2px 8px; border-radius: 10px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="name">[VOTRE NOM]</div>
                <div class="contact">[Email] • [Téléphone] • [Ville] • [LinkedIn]</div>
              </div>
              <div class="section">
                <div class="section-title">PROFIL PROFESSIONNEL</div>
                <p>Professionnel expérimenté en ${template.category.toLowerCase()} avec expertise en ${skills.slice(0, 3).join(', ')}.</p>
              </div>
            </body>
            </html>
          `;
          filename = `${templateName}.html`;
          mimeType = 'text/html';
          break;

        case 'html':
          content = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${template.name}</title>
              <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
                .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                .name { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
                .contact { font-size: 16px; color: #666; }
                .section { margin-bottom: 30px; }
                .section-title { font-size: 20px; font-weight: bold; color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px; }
                .job { margin-bottom: 20px; }
                .job-title { font-weight: bold; font-size: 18px; }
                .company { color: #666; font-style: italic; }
                .skills { display: flex; flex-wrap: wrap; gap: 10px; }
                .skill { background: #f0f0f0; padding: 5px 15px; border-radius: 20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="name">[VOTRE NOM]</div>
                <div class="contact">[Email] • [Téléphone] • [Ville] • [LinkedIn]</div>
              </div>
              
              <div class="section">
                <div class="section-title">PROFIL PROFESSIONNEL</div>
                <p>[Décrivez votre profil professionnel en 2-3 lignes]</p>
              </div>
              
              <div class="section">
                <div class="section-title">EXPÉRIENCE PROFESSIONNELLE</div>
                <div class="job">
                  <div class="job-title">[Titre du Poste]</div>
                  <div class="company">[Entreprise] • [Dates]</div>
                  <ul>
                    <li>Réalisation majeure avec impact quantifiable</li>
                    <li>Projet utilisant ${skills.slice(0, 2).join(', ')}</li>
                  </ul>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">COMPÉTENCES</div>
                <div class="skills">
                  ${skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                </div>
              </div>
            </body>
            </html>
          `;
          filename = `${templateName}.html`;
          mimeType = 'text/html';
          break;

        case 'txt':
          content = `
${template.name.toUpperCase()}

[VOTRE NOM]
[Email] • [Téléphone] • [Ville] • [LinkedIn]

PROFIL PROFESSIONNEL
[Décrivez votre profil professionnel en 2-3 lignes, en mettant l'accent sur vos compétences clés et votre expérience dans le domaine ${template.category.toLowerCase()}.]

EXPÉRIENCE PROFESSIONNELLE

[Titre du Poste]
[Nom de l'Entreprise] • [Dates]
• Réalisation majeure avec impact quantifiable (ex: +25% de performance)
• Projet important utilisant les technologies ${skills.slice(0, 3).join(', ')}
• Leadership d'équipe ou initiative stratégique

[Poste Précédent]
[Entreprise Précédente] • [Dates]
• Accomplissement significatif avec métriques précises
• Amélioration de processus ou innovation

COMPÉTENCES TECHNIQUES
${skills.join(' • ')}

FORMATION
[Diplôme]
[École/Université] • [Année]

LANGUES
Français (Natif) • Anglais (Courant) • [Autre langue]
          `;
          filename = `${templateName}.txt`;
          mimeType = 'text/plain';
          break;
      }

      // Créer et télécharger le fichier
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };


  const handlePreview = (template: Template) => {
    // In a real app, this would open a preview modal
    console.log(`Aperçu du template: ${template.name}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-600';
    if (score >= 90) return 'text-blue-600';
    if (score >= 85) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 95) return 'bg-emerald-500';
    if (score >= 90) return 'bg-blue-500';
    if (score >= 85) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="heading-gradient">
          Templates CV Word
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Collection de templates professionnels au format Word, optimisés ATS et prêts à télécharger
        </p>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-br from-purple-600 via-violet-600 to-pink-600 rounded-3xl p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-black/10 rounded-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">Templates Word Premium</h3>
                  <p className="text-white/80 text-lg">Collection professionnelle optimisée ATS</p>
                </div>
              </div>
              
              <p className="text-white/90 mb-8 max-w-2xl text-lg leading-relaxed">
                Téléchargez nos templates optimisés au format Word (.docx) et personnalisez-les selon vos besoins. 
                Conçus par des experts RH et validés par notre IA.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-4xl font-bold mb-2">95%</div>
                  <div className="text-white/90 font-medium">Score ATS moyen</div>
                  <div className="text-white/70 text-sm mt-1">Taux de passage optimisé</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-4xl font-bold mb-2">15k+</div>
                  <div className="text-white/90 font-medium">Téléchargements</div>
                  <div className="text-white/70 text-sm mt-1">Par des professionnels</div>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                  <div className="text-4xl font-bold mb-2">8</div>
                  <div className="text-white/90 font-medium">Secteurs couverts</div>
                  <div className="text-white/70 text-sm mt-1">Spécialisations métiers</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-medium">Mise à jour continue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-medium">Support inclus</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="w-40 h-40 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                <div className="relative">
                  <FileText className="w-20 h-20 text-white/90" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Features */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/30 shadow-lg">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Pourquoi choisir nos templates ?</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Des templates conçus par des experts RH et optimisés par notre IA pour maximiser vos chances de succès
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Certifié ATS</h4>
            <p className="text-sm text-gray-600">Compatibilité garantie avec tous les systèmes de recrutement</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Validé RH</h4>
            <p className="text-sm text-gray-600">Approuvé par des professionnels du recrutement</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Performance</h4>
            <p className="text-sm text-gray-600">+40% de réponses positives en moyenne</p>
          </div>
          
          <div className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">IA Optimisé</h4>
            <p className="text-sm text-gray-600">Amélioration continue basée sur les données</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
          >
            <option value="popular">Plus populaires</option>
            <option value="rating">Mieux notés</option>
            <option value="ats">Score ATS</option>
            <option value="downloads">Plus téléchargés</option>
            <option value="name">Nom A-Z</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/30 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
          >
            {/* Preview */}
            <div className={"h-48 " + template.preview + " relative overflow-hidden"}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              
              {/* Premium Badge */}
              {template.isPremium && (
                <div className="absolute top-4 left-4">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 text-xs font-bold">
                    <Star className="w-3 h-3" />
                    <span>Premium</span>
                  </div>
                </div>
              )}

              {/* ATS Score */}
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                  <div className={"w-2 h-2 rounded-full " + getScoreBadgeColor(template.atsScore)} />
                  <span className="text-xs font-bold text-gray-800">{template.atsScore}%</span>
                </div>
              </div>
              
              {/* Mock Document Preview */}
              <div className="absolute inset-4 bg-white/80 rounded-lg p-4 shadow-lg">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded w-full mt-4" />
                  <div className="h-2 bg-gray-200 rounded w-4/5" />
                  <div className="h-2 bg-gray-200 rounded w-3/5" />
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded" />
                      <div className="h-2 bg-gray-200 rounded w-3/4" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded" />
                      <div className="h-2 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center space-x-4">
                <button
                  onClick={() => handlePreview(template)}
                  className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors hover:scale-110"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownloadFormat(template, 'word')}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                    title="Télécharger Word"
                  >
                    DOC
                  </button>
                  <button
                    onClick={() => handleDownloadFormat(template, 'html')}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium"
                    title="Télécharger HTML"
                  >
                    HTML
                  </button>
                  <button
                    onClick={() => handleDownloadFormat(template, 'txt')}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium"
                    title="Télécharger TXT"
                  >
                    TXT
                  </button>
                </div>
              </div>
            </div>
            
            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 truncate">{template.name}</h4>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">{template.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs font-medium px-2 py-1 bg-violet-100 text-violet-700 rounded-full">
                    {tag}
                  </span>
                ))}
                {template.tags.length > 3 && (
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    +{template.tags.length - 3}
                  </span>
                )}
              </div>
              
              {/* Stats */}
              <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Download className="w-3 h-3" />
                    <span>{template.downloads}</span>
                  </span>
                  <span className={"font-semibold " + getScoreColor(template.atsScore)}>
                    {template.atsScore}% ATS
                  </span>
                </div>
                <span className="font-medium text-gray-600">{template.category}</span>
              </div>
              
              {/* Download Button */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleDownloadFormat(template, 'word')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Word</span>
                </button>
                <button
                  onClick={() => handleDownloadFormat(template, 'html')}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>HTML</span>
                </button>
                <button
                  onClick={() => handleDownloadFormat(template, 'txt')}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-3 rounded-lg text-xs font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-1"
                >
                  <Download className="w-3 h-3" />
                  <span>TXT</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun template trouvé</h3>
          <p className="text-gray-600 mb-6">
            Essayez de modifier vos critères de recherche ou de filtrage
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Tous');
            }}
            className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/30">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Besoin d'un template personnalisé ?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Notre IA peut créer un template sur mesure basé sur votre profil et vos objectifs professionnels
          </p>
          
          <button className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-8 py-4 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105">
            Créer un template personnalisé
          </button>
        </div>
      </div>
    </div>
  );
};
