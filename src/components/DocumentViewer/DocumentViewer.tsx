import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, AlertCircle, Loader2 } from 'lucide-react';
import * as mammoth from 'mammoth';

interface DocumentViewerProps {
  file: File;
  onClose?: () => void;
}

interface ParsedDocument {
  content: string;
  type: 'html' | 'text';
  title?: string;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ file, onClose }) => {
  const [parsedDoc, setParsedDoc] = useState<ParsedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    parseDocument();
  }, [file]);

  const parseDocument = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mimeType = file.type;
      
      if (mimeType === 'application/pdf') {
        await parsePDF();
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                 mimeType === 'application/msword') {
        await parseWord();
      } else if (mimeType === 'text/plain') {
        await parseText();
      } else {
        throw new Error('Type de fichier non supporté');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la lecture du fichier');
    } finally {
      setIsLoading(false);
    }
  };

  const parsePDF = async () => {
    try {
      // Pour PDF, nous utilisons une approche simplifiée
      // En production, vous devriez utiliser pdf-parse ou PDF.js
      const arrayBuffer = await file.arrayBuffer();
      
      // Simulation d'extraction PDF - en réalité, vous utiliseriez pdf-parse
      const text = await extractPDFText(arrayBuffer);
      
      setParsedDoc({
        content: formatTextContent(text),
        type: 'html',
        title: file.name
      });
    } catch (error) {
      throw new Error('Erreur lors de la lecture du PDF');
    }
  };

  const parseWord = async () => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Utilisation de mammoth pour extraire le contenu Word
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      if (result.messages.length > 0) {
        console.warn('Avertissements lors de la conversion:', result.messages);
      }
      
      setParsedDoc({
        content: cleanWordHTML(result.value),
        type: 'html',
        title: file.name
      });
    } catch (error) {
      throw new Error('Erreur lors de la lecture du document Word');
    }
  };

  const parseText = async () => {
    try {
      const text = await file.text();
      setParsedDoc({
        content: formatTextContent(text),
        type: 'html',
        title: file.name
      });
    } catch (error) {
      throw new Error('Erreur lors de la lecture du fichier texte');
    }
  };

  // Fonction simulée pour l'extraction PDF (remplacez par pdf-parse en production)
  const extractPDFText = async (arrayBuffer: ArrayBuffer): Promise<string> => {
    // Simulation d'extraction PDF - en production, utilisez pdf-parse
    return `MARIE DUBOIS
Développeuse Full Stack Senior

📧 marie.dubois@email.com
📱 +33 6 12 34 56 78
📍 Paris, France
💼 linkedin.com/in/marie-dubois

PROFIL PROFESSIONNEL
Développeuse Full Stack avec 5+ années d'expérience en JavaScript, React et Node.js. Spécialisée dans l'architecture d'applications web scalables et l'optimisation des performances. Passionnée par les technologies modernes et le mentoring d'équipes techniques.
      
EXPÉRIENCE PROFESSIONNELLE

Lead Developer Full Stack
TechCorp • Janvier 2020 - Présent
• Architecture et développement d'une plateforme SaaS générant 2M€ de CA annuel
• Management technique d'une équipe de 5 développeurs
• Réduction de 40% du temps de chargement via optimisation React/Next.js
• Mise en place CI/CD avec Docker/Kubernetes (99.9% uptime)

Senior Full Stack Developer
StartupXYZ • Mars 2018 - Décembre 2019
• Développement d'une API REST utilisée par 10k+ utilisateurs quotidiens
• Migration legacy vers architecture microservices
• Amélioration des performances de 60% via optimisation base de données

COMPÉTENCES TECHNIQUES
JavaScript, TypeScript, React, Vue.js, Node.js, Express, MongoDB, PostgreSQL, Docker, Kubernetes, AWS, Git, Jest, Cypress

PROJETS OPEN SOURCE
• ReactFlow - Bibliothèque de diagrammes interactifs (2.5k+ stars GitHub)
• NodeAPI-Boilerplate - Template API Node.js (800+ stars GitHub)

FORMATION
Master en Informatique - Spécialité Développement Web
Université Paris-Saclay • 2018

LANGUES
Français (Natif) • Anglais (Courant) • Espagnol (Intermédiaire)`;
  };

  const cleanWordHTML = (html: string): string => {
    return html
      // Nettoyer les styles inline inutiles
      .replace(/style="[^"]*"/g, '')
      .replace(/<o:p[^>]*>.*?<\/o:p>/gi, '')
      .replace(/<span[^>]*>\s*<\/span>/gi, '')
      // Améliorer la structure
      .replace(/<p[^>]*>/gi, '<p>')
      .replace(/<div[^>]*>/gi, '<div>')
      // Améliorer les listes
      .replace(/<ul[^>]*>/gi, '<ul>')
      .replace(/<ol[^>]*>/gi, '<ol>');
  };

  const formatTextContent = (text: string): string => {
    // Clean up HTML content and convert to readable text
    const formatted = text
      // Remove all HTML structure
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      
      // Extract text content from HTML tags
      .replace(/<div class="name"[^>]*>(.*?)<\/div>/gi, '\n\n$1\n')
      .replace(/<div class="title"[^>]*>(.*?)<\/div>/gi, '$1\n')
      .replace(/<div class="section-title"[^>]*>(.*?)<\/div>/gi, '\n\n$1\n')
      .replace(/<div class="job-title"[^>]*>(.*?)<\/div>/gi, '\n$1\n')
      .replace(/<div class="company"[^>]*>(.*?)<\/div>/gi, '$1\n')
      .replace(/<div class="date"[^>]*>(.*?)<\/div>/gi, '$1\n')
      .replace(/<div class="achievement"[^>]*>(.*?)<\/div>/gi, '• $1\n')
      .replace(/<div class="contact-item"[^>]*>(.*?)<\/div>/gi, '$1\n')
      .replace(/<span class="tech-tag"[^>]*>(.*?)<\/span>/gi, '$1, ')
      .replace(/<span class="skill-tag"[^>]*>(.*?)<\/span>/gi, '$1, ')

      // Remove all remaining HTML tags
      .replace(/<[^>]*>/g, '')
      
      // Clean up HTML entities
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      
      // Replace placeholders with readable text
      .replace(/\[VOTRE PRÉNOM\] \[NOM\]/g, '[Votre Nom]')
      .replace(/\[votre\.email@email\.com\]/g, '[votre.email@email.com]')
      .replace(/\[Nom de l\'Entreprise\]/g, '[Nom de l\'Entreprise]')
      .replace(/\[Date début\]/g, '[Date début]')
      .replace(/\[Date fin\]/g, '[Date fin]')
      .replace(/\[Votre Ville, France\]/g, '[Votre Ville, France]')
      .replace(/\[linkedin\.com\/in\/votre-profil\]/g, '[linkedin.com/in/votre-profil]')

      // Clean up excessive whitespace and line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\s+/g, ' ')
      .replace(/,\s*,/g, ',')
      .replace(/,\s*$/gm, '')
      .trim();
    
    // Convert to formatted HTML for display
    return formatted
      .split('\n')
      .map(line => {
        line = line.trim();
        if (!line) return '';
        
        // Detect main titles (all caps or specific patterns)
        if (line.match(/^[A-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ\s&]+$/) && line.length > 3 && line.length < 50) {
          return `<h2 style="font-size: 1.25rem; font-weight: bold; margin: 1.5rem 0 0.75rem 0; color: #1f2937; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #6366f1; padding-bottom: 0.5rem;">${line}</h2>`;
        }
        
        // Detect job titles and company names
        if (line.includes('•') || line.includes('-') && line.length < 100) {
          return `<li style="margin: 0.5rem 0; padding-left: 0.5rem; line-height: 1.6; color: #374151;">${line.replace(/^[•\-]\s*/, '')}</li>`;
        }
        
        // Detect dates and company info
        if (line.match(/\d{4}/) || line.includes('(') || line.includes('Présent')) {
          return `<p style="font-size: 0.9rem; color: #6b7280; margin: 0.25rem 0; font-style: italic;">${line}</p>`;
        }
        
        // Detect section headers
        if (line.length < 80 && (line.includes('Développeur') || line.includes('Manager') || line.includes('Responsable'))) {
          return `<h3 style="font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem 0; color: #1f2937;">${line}</h3>`;
        }
        
        // Regular paragraphs
        return `<p style="margin: 0.75rem 0; line-height: 1.6; color: #374151; text-align: justify;">${line}</p>`;
      })
      .filter(line => line !== '')
      .join('')
      // Wrap consecutive list items in ul tags
      .replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g, '<ul style="margin: 1rem 0; padding-left: 1.5rem; list-style-type: disc;">$&</ul>')
      .replace(/<\/li>\s*<\/ul>\s*<ul[^>]*>\s*<li/g, '</li>\n<li');
  };

  const getFileInfo = () => {
    const mimeType = file.type;
    if (mimeType === 'application/pdf') {
      return { label: 'Document PDF', color: 'from-red-500 to-red-600', icon: FileText };
    } else if (mimeType.includes('word')) {
      return { label: 'Document Word', color: 'from-blue-500 to-blue-600', icon: FileText };
    } else {
      return { label: 'Document Texte', color: 'from-gray-500 to-gray-600', icon: FileText };
    }
  };

  const fileInfo = getFileInfo();
  const Icon = fileInfo.icon;

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/30 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lecture du document {fileInfo.label}
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            Extraction et formatage du contenu en cours...
          </p>
          
          <div className="mt-4 bg-gray-100 rounded-full h-2 w-64">
            <div className="bg-gradient-to-r from-violet-500 to-pink-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/30 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Erreur de lecture
          </h3>
          <p className="text-gray-600 text-center max-w-md mb-6">
            {error}
          </p>
          
          <button
            onClick={parseDocument}
            className="bg-gradient-to-r from-violet-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-violet-700 hover:to-pink-700 transition-all duration-200 hover:scale-105"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${fileInfo.color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-600">
                {fileInfo.label} • {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200">
              <Download className="w-4 h-4" />
              <span>Télécharger</span>
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center space-x-2 bg-violet-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-violet-700 transition-all duration-200"
              >
                <Eye className="w-4 h-4" />
                <span>Analyser</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {parsedDoc?.type === 'html' ? (
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: parsedDoc.content }}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                lineHeight: '1.6',
                color: '#374151'
              }}
            />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
              {parsedDoc?.content}
            </pre>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-50/50 p-4 border-t border-gray-200/30">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Document traité avec succès</span>
          <span>Prêt pour l'analyse IA</span>
        </div>
      </div>
    </div>
  );
};