import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Wand2, Download, Copy, CheckCircle, AlertTriangle, Lightbulb, Target, Sparkles, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { CVAnalysisResponse } from '../../hooks/useOpenAI';

interface CVOptimizationProps {
  analysisResults: CVAnalysisResponse;
  originalContent: string;
  fileName: string;
  onBack: () => void;
}

interface OptimizationSuggestion {
  id: string;
  section: string;
  type: 'replace' | 'add' | 'remove' | 'rewrite';
  priority: 'high' | 'medium' | 'low';
  original: string;
  improved: string;
  explanation: string;
  applied: boolean;
}

export const CVOptimization: React.FC<CVOptimizationProps> = ({
  analysisResults,
  originalContent,
  fileName,
  onBack
}) => {
  const [optimizedContent, setOptimizedContent] = useState(originalContent);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  const generateOptimizationSuggestions = useCallback(() => {
    setIsGenerating(true);
    // Génération de suggestions d'optimisation basées sur l'analyse
    // TODO: Remplacer par un appel API réel vers le service d'optimisation IA
    setTimeout(() => {
      // Utilisation des résultats d'analyse pour générer des suggestions personnalisées
      const baseScore = analysisResults.overallScore || 0;
      const weaknesses = analysisResults.weaknesses || [];
      const improvements = analysisResults.improvements || [];

      const generatedSuggestions: OptimizationSuggestion[] = [
        {
          id: '1',
          section: 'Profil professionnel',
          type: 'rewrite',
          priority: 'high',
          original: 'Développeur avec de l\'expérience en JavaScript',
          improved: 'Développeur Full Stack Senior avec 5+ années d\'expertise en JavaScript/TypeScript, React et Node.js. Spécialisé dans l\'architecture d\'applications web scalables et l\'optimisation des performances.',
          explanation: 'Ajout de mots-clés techniques spécifiques, quantification de l\'expérience et mise en avant des compétences recherchées.',
          applied: false
        },
        {
          id: '2',
          section: 'Expérience professionnelle',
          type: 'replace',
          priority: 'high',
          original: 'Développement d\'applications web',
          improved: 'Développement et déploiement de 15+ applications web React/Node.js, générant une amélioration de 40% des performances utilisateur et une réduction de 25% du temps de chargement',
          explanation: 'Quantification des réalisations avec des métriques précises et impact business mesurable.',
          applied: false
        },
        {
          id: '3',
          section: 'Compétences techniques',
          type: 'add',
          priority: 'medium',
          original: '',
          improved: 'Technologies: JavaScript (ES6+), TypeScript, React, Vue.js, Node.js, Express, MongoDB, PostgreSQL, Docker, Kubernetes, AWS, Git, Jest, Cypress',
          explanation: 'Ajout de mots-clés techniques essentiels pour améliorer la compatibilité ATS et montrer l\'étendue des compétences.',
          applied: false
        },
        {
          id: '4',
          section: 'Réalisations',
          type: 'add',
          priority: 'high',
          original: '',
          improved: '• Architecture et développement d\'une plateforme e-commerce générant 2M€ de CA annuel\n• Réduction de 60% du temps de build via optimisation CI/CD avec Docker\n• Mentoring de 3 développeurs junior, amélioration de 35% de leur productivité',
          explanation: 'Ajout de réalisations quantifiées avec impact business et leadership technique.',
          applied: false
        },
        {
          id: '5',
          section: 'Formation',
          type: 'replace',
          priority: 'low',
          original: 'Master en Informatique',
          improved: 'Master en Informatique - Spécialité Développement Web et Mobile\nCertifications: AWS Solutions Architect, Google Cloud Professional',
          explanation: 'Précision de la spécialité et ajout de certifications valorisantes.',
          applied: false
        }
      ];

      // Ajouter des suggestions basées sur les faiblesses détectées dans l'analyse
      if (weaknesses.length > 0) {
        weaknesses.forEach((weakness, index) => {
          generatedSuggestions.push({
            id: `weakness-${index + 6}`,
            section: 'Points faibles identifiés',
            type: 'replace',
            priority: 'high',
            original: `Faiblesse détectée: ${weakness}`,
            improved: `Amélioration suggérée pour: ${weakness}`,
            explanation: `Correction recommandée basée sur l'analyse IA: ${weakness}`,
            applied: false
          });
        });
      }

      // Ajouter des suggestions basées sur les améliorations recommandées
      if (improvements.length > 0) {
        improvements.forEach((improvement, index) => {
          generatedSuggestions.push({
            id: `improvement-${index + 10}`,
            section: improvement.title || 'Amélioration générale',
            type: 'add',
            priority: improvement.priority || 'medium',
            original: '',
            improved: improvement.description || '',
            explanation: `Amélioration recommandée: ${improvement.title}`,
            applied: false
          });
        });
      }

      // Ajouter des suggestions basées sur les recommandations générales
      if (analysisResults.recommendations && analysisResults.recommendations.length > 0) {
        analysisResults.recommendations.forEach((recommendation, index) => {
          generatedSuggestions.push({
            id: `recommendation-${index + 20}`,
            section: 'Recommandations générales',
            type: 'add',
            priority: 'medium',
            original: '',
            improved: recommendation,
            explanation: 'Recommandation basée sur l\'analyse complète du CV',
            applied: false
          });
        });
      }

      // Ajouter des suggestions basées sur les mots-clés manquants
      if (analysisResults.keywords?.missing && analysisResults.keywords.missing.length > 0) {
        const keywordSuggestion = {
          id: 'keywords-missing',
          section: 'Mots-clés manquants',
          type: 'add' as const,
          priority: 'high' as const,
          original: '',
          improved: `Mots-clés à ajouter: ${analysisResults.keywords.missing.join(', ')}`,
          explanation: 'Ajout de mots-clés importants pour améliorer la compatibilité ATS',
          applied: false
        };
        generatedSuggestions.push(keywordSuggestion);
      }

      // Utiliser le score de base pour ajuster les priorités si nécessaire
      if (baseScore < 50) {
        // Si le score est faible, augmenter la priorité des suggestions critiques
        generatedSuggestions.forEach(suggestion => {
          if (suggestion.priority === 'medium' && (suggestion.section.includes('Profil') || suggestion.section.includes('Expérience'))) {
            suggestion.priority = 'high';
          }
        });
      }

      setSuggestions(generatedSuggestions);
      setIsGenerating(false);
    }, 2000);
  }, [analysisResults]);

  useEffect(() => {
    generateOptimizationSuggestions();
  }, [analysisResults, generateOptimizationSuggestions]);

  const applySuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === suggestionId ? { ...s, applied: !s.applied } : s
    ));
    
    // Mise à jour du contenu optimisé
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (suggestion) {
      if (!suggestion.applied) {
        // Appliquer la suggestion
        let newContent = optimizedContent;
        if (suggestion.type === 'replace' || suggestion.type === 'rewrite') {
          newContent = newContent.replace(suggestion.original, suggestion.improved);
        } else if (suggestion.type === 'add') {
          newContent += '\n\n' + suggestion.improved;
        }
        setOptimizedContent(newContent);
      } else {
        // Annuler la suggestion
        let newContent = optimizedContent;
        if (suggestion.type === 'replace' || suggestion.type === 'rewrite') {
          newContent = newContent.replace(suggestion.improved, suggestion.original);
        } else if (suggestion.type === 'add') {
          newContent = newContent.replace('\n\n' + suggestion.improved, '');
        }
        setOptimizedContent(newContent);
      }
    }
  };

  const applyAllSuggestions = () => {
    suggestions.forEach(suggestion => {
      if (!suggestion.applied) {
        applySuggestion(suggestion.id);
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-amber-500 to-orange-500';
      case 'low': return 'from-emerald-500 to-teal-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité Haute';
      case 'medium': return 'Priorité Moyenne';
      case 'low': return 'Priorité Basse';
      default: return 'Normal';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'replace': return RefreshCw;
      case 'add': return Target;
      case 'remove': return AlertTriangle;
      case 'rewrite': return Wand2;
      default: return Lightbulb;
    }
  };

  const formatWordContent = (content: string): string => {
    if (!content) return '';
    
    // Clean up HTML and format for better display
    let formatted = content
      // Remove DOCTYPE and html tags
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<\/?html[^>]*>/gi, '')
      .replace(/<\/?head[^>]*>/gi, '')
      .replace(/<title[^>]*>.*?<\/title>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      
      // Clean up style tags but keep the content structure
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      
      // Replace body tag with div
      .replace(/<\/?body[^>]*>/gi, '')
      
      // Improve text formatting
      .replace(/font-family:\s*[^;]+;?/gi, '') // Remove font-family
      .replace(/font-size:\s*[^;]+;?/gi, '') // Remove font-size
      .replace(/color:\s*[^;]+;?/gi, '') // Remove colors
      
      // Clean up empty style attributes
      .replace(/style="\s*"/gi, '')
      .replace(/style=''/gi, '')
      
      // Improve spacing and structure
      .replace(/margin:\s*[^;]+;?/gi, 'margin: 0.5rem 0;')
      .replace(/padding:\s*[^;]+;?/gi, 'padding: 0.25rem 0;')
      
      // Convert common Word elements to better HTML
      .replace(/<div class="name"[^>]*>/gi, '<h1 style="font-size: 1.5rem; font-weight: bold; margin: 1rem 0; color: #1f2937;">')
      .replace(/<div class="title"[^>]*>/gi, '<h2 style="font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0; color: #4b5563;">')
      .replace(/<div class="section-title"[^>]*>/gi, '<h3 style="font-size: 1rem; font-weight: bold; margin: 1rem 0 0.5rem 0; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.25rem;">')
      .replace(/<div class="job-title"[^>]*>/gi, '<h4 style="font-size: 0.95rem; font-weight: 600; margin: 0.75rem 0 0.25rem 0; color: #1f2937;">')
      .replace(/<div class="company"[^>]*>/gi, '<p style="font-weight: 500; color: #6366f1; margin: 0.25rem 0;">')
      .replace(/<div class="date"[^>]*>/gi, '<p style="font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0;">')
      .replace(/<div class="achievement"[^>]*>/gi, '<li style="margin: 0.5rem 0; padding-left: 0.5rem;">')
      
      // Convert contact items
      .replace(/<div class="contact-item"[^>]*>/gi, '<p style="margin: 0.25rem 0; display: flex; align-items: center;">')
      
      // Convert skill tags
      .replace(/<span class="tech-tag"[^>]*>/gi, '<span style="background: #e5e7eb; color: #374151; padding: 0.125rem 0.5rem; border-radius: 0.75rem; font-size: 0.75rem; margin: 0.125rem; display: inline-block;">')
      .replace(/<span class="skill-tag"[^>]*>/gi, '<span style="background: #ddd6fe; color: #5b21b6; padding: 0.125rem 0.5rem; border-radius: 0.75rem; font-size: 0.75rem; margin: 0.125rem; display: inline-block;">')
      
      // Clean up common Word artifacts
      .replace(/\[VOTRE PRÉNOM\] \[NOM\]/g, '<strong>[Votre Nom]</strong>')
      .replace(/\[votre\.email@email\.com\]/g, '[votre.email@email.com]')
      .replace(/\[Nom de l'Entreprise\]/g, '[Nom de l\'Entreprise]')
      .replace(/\[Date début\]/g, '[Date début]')
      .replace(/\[Date fin\]/g, '[Date fin]')
      
      // Improve paragraph spacing
      .replace(/<p([^>]*)>/gi, '<p$1 style="margin: 0.5rem 0; line-height: 1.6;">')
      
      // Clean up excessive whitespace
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
    
    // If content is still mostly HTML, extract text content and format it nicely
    if (formatted.includes('<div class="container">') || formatted.includes('<!DOCTYPE')) {
      // Extract key sections from HTML
      const sections = [];
      
      // Extract name
      const nameMatch = formatted.match(/<div class="name"[^>]*>(.*?)<\/div>/i);
      if (nameMatch) {
        sections.push(`<h1 style="font-size: 1.5rem; font-weight: bold; margin: 1rem 0; color: #1f2937;">${nameMatch[1]}</h1>`);
      }
      
      // Extract title
      const titleMatch = formatted.match(/<div class="title"[^>]*>(.*?)<\/div>/i);
      if (titleMatch) {
        sections.push(`<h2 style="font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0; color: #4b5563;">${titleMatch[1]}</h2>`);
      }
      
      // Extract contact info
      const contactMatches = formatted.match(/<div class="contact-item"[^>]*>(.*?)<\/div>/gi);
      if (contactMatches) {
        sections.push('<div style="margin: 1rem 0;">');
        contactMatches.forEach(contact => {
          const content = contact.replace(/<div class="contact-item"[^>]*>(.*?)<\/div>/i, '$1');
          sections.push(`<p style="margin: 0.25rem 0;">${content}</p>`);
        });
        sections.push('</div>');
      }
      
      // Extract sections
      const sectionMatches = formatted.match(/<div class="section"[^>]*>(.*?)<\/div>/gi);
      if (sectionMatches) {
        sectionMatches.forEach(section => {
          const titleMatch = section.match(/<div class="section-title"[^>]*>(.*?)<\/div>/i);
          if (titleMatch) {
            sections.push(`<h3 style="font-size: 1rem; font-weight: bold; margin: 1rem 0 0.5rem 0; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.25rem;">${titleMatch[1]}</h3>`);
          }
          
          // Extract paragraphs
          const paragraphs = section.match(/<p[^>]*>(.*?)<\/p>/gi);
          if (paragraphs) {
            paragraphs.forEach(p => {
              const content = p.replace(/<p[^>]*>(.*?)<\/p>/i, '$1');
              sections.push(`<p style="margin: 0.5rem 0; line-height: 1.6;">${content}</p>`);
            });
          }
        });
      }
      
      if (sections.length > 0) {
        formatted = sections.join('');
      }
    }
    
    return formatted;
  };

  const appliedSuggestions = suggestions.filter(s => s.applied).length;
  const totalSuggestions = suggestions.length;
  const improvementScore = totalSuggestions > 0 ? Math.round((appliedSuggestions / totalSuggestions) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'analyse</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
          >
            {showOriginal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showOriginal ? 'Masquer original' : 'Voir original'}</span>
          </button>
          
          <button
            onClick={applyAllSuggestions}
            className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          >
            <Wand2 className="w-4 h-4" />
            <span>Appliquer tout</span>
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h2 className="heading-gradient">
          Optimisation Automatique IA
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Améliorez votre CV avec des suggestions personnalisées basées sur l'analyse IA
        </p>
      </div>

      {/* Progress Card */}
      <div className="bg-gradient-to-br from-violet-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 rounded-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Progression de l'optimisation</h3>
              <p className="text-white/90">{fileName}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{improvementScore}%</div>
              <div className="text-white/80">Améliorations appliquées</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold mb-1">{appliedSuggestions}/{totalSuggestions}</div>
              <div className="text-white/80 text-sm">Suggestions appliquées</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold mb-1">+{Math.min(appliedSuggestions * 3, 15)}</div>
              <div className="text-white/80 text-sm">Points ATS estimés</div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold mb-1">{suggestions.filter(s => s.priority === 'high').length}</div>
              <div className="text-white/80 text-sm">Améliorations critiques</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Suggestions Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/30 p-6 sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-violet-600" />
              <span>Suggestions d'amélioration</span>
            </h3>
            
            {isGenerating ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Génération des suggestions...</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => {
                  const Icon = getTypeIcon(suggestion.type);
                  return (
                    <div
                      key={suggestion.id}
                      className={`p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                        suggestion.applied
                          ? 'bg-emerald-50 border-emerald-200'
                          : selectedSuggestion === suggestion.id
                          ? 'bg-violet-50 border-violet-300'
                          : 'bg-gray-50 border-gray-200 hover:border-violet-300'
                      }`}
                      onClick={() => setSelectedSuggestion(selectedSuggestion === suggestion.id ? null : suggestion.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 bg-gradient-to-br ${getPriorityColor(suggestion.priority)} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">{suggestion.section}</h4>
                            <span className="text-xs text-gray-500">{getPriorityLabel(suggestion.priority)}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            applySuggestion(suggestion.id);
                          }}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            suggestion.applied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-violet-200 hover:text-violet-700'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {selectedSuggestion === suggestion.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-3">{suggestion.explanation}</p>
                          
                          {suggestion.original && (
                            <div className="mb-3">
                              <h5 className="text-xs font-semibold text-red-600 mb-1">Avant:</h5>
                              <p className="text-xs bg-red-50 p-2 rounded border-l-2 border-red-300">{suggestion.original}</p>
                            </div>
                          )}
                          
                          <div>
                            <h5 className="text-xs font-semibold text-emerald-600 mb-1">Après:</h5>
                            <p className="text-xs bg-emerald-50 p-2 rounded border-l-2 border-emerald-300">{suggestion.improved}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* CV Content */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/30 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200/30">
              {showOriginal && (
                <button
                  className="flex-1 px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors"
                >
                  CV Original
                </button>
              )}
              <button
                className="flex-1 px-6 py-4 text-sm font-medium text-violet-600 border-b-2 border-violet-500 bg-violet-50/50"
              >
                CV Optimisé
              </button>
            </div>
            
            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 gap-8">
                {showOriginal && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <span>Version originale</span>
                    </h4>
                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                        {originalContent}
                      </pre>
                    </div>
                  </div>
                )}
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span>Version optimisée</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      +{Math.min(appliedSuggestions * 3, 15)} points ATS
                    </span>
                  </h4>
                  <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                    <div className="prose prose-sm max-w-none">
                      <div 
                        className="text-gray-700 leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: formatWordContent(optimizedContent) 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="p-6 border-t border-gray-200/30 bg-gray-50/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {appliedSuggestions} amélioration{appliedSuggestions !== 1 ? 's' : ''} appliquée{appliedSuggestions !== 1 ? 's' : ''}
                </div>
                
                <div className="flex space-x-3">
                  <button className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200">
                    <Copy className="w-4 h-4" />
                    <span>Copier</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-2 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105">
                    <Download className="w-4 h-4" />
                    <span>Télécharger CV optimisé</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
