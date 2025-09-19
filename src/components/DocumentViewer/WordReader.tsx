import React, { useState, useEffect, useCallback } from 'react';
import { FileText, AlertCircle, RefreshCw } from 'lucide-react';
import mammoth from 'mammoth';

interface WordReaderProps {
  file: File;
  onTextExtracted?: (text: string) => void;
}

export const WordReader: React.FC<WordReaderProps> = ({ file, onTextExtracted }) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const extractWordContent = useCallback(async (wordFile: File) => {
    try {
      if (wordFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Pour les fichiers .docx, utiliser mammoth
        const arrayBuffer = await wordFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        
        if (result.value && result.value.trim().length > 0) {
          setContent(result.value);
          onTextExtracted?.(result.value);
        } else {
          const fallbackText = `Document Word (.docx): ${wordFile.name}

Ce document Word ne contient pas de texte extractible ou est protégé.

Informations du fichier:
• Nom: ${wordFile.name}
• Taille: ${(wordFile.size / 1024).toFixed(1)} KB
• Type: Document Word (.docx)

Le contenu sera correctement analysé lors de l'analyse IA.`;
          setContent(fallbackText);
          onTextExtracted?.(fallbackText);
        }
        
        // Afficher les messages d'avertissement s'il y en a
        if (result.messages && result.messages.length > 0) {
          console.warn('Messages mammoth:', result.messages);
        }
        
      } else if (wordFile.type === 'application/msword') {
        // Pour les anciens fichiers .doc, utiliser une méthode de fallback
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
          const fileContent = e.target?.result as string;
          let extractedText = fileContent
            .replace(/[^\x20-\x7E\u00C0-\u017F\u0100-\u017F\u0180-\u024F]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
            
          if (!extractedText || extractedText.length < 50) {
            extractedText = `Document Word (.doc): ${wordFile.name}

Ce document Word ancien contient du formatage qui ne peut pas être affiché directement.

Informations du fichier:
• Nom: ${wordFile.name}
• Taille: ${(wordFile.size / 1024).toFixed(1)} KB
• Type: Document Word (.doc)

Le contenu sera correctement analysé lors de l'analyse IA.`;
          }
          
          setContent(extractedText);
          onTextExtracted?.(extractedText);
        };
        
        fileReader.onerror = () => {
          setError('Erreur lors de la lecture du fichier Word');
        };
        
        fileReader.readAsText(wordFile, 'UTF-8');
      } else {
        setError('Format de fichier Word non supporté');
      }
      
      setIsLoading(false);
      
    } catch (error) {
      console.error('Erreur lors de l\'extraction du contenu Word:', error);
      setError('Erreur lors de l\'extraction du contenu Word');
      setIsLoading(false);
    }
  }, [onTextExtracted]);

  useEffect(() => {
    const processFile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (file.type === 'text/plain') {
          // Pour les fichiers texte simples
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            const result = e.target?.result as string;
            setContent(result);
            onTextExtracted?.(result);
            setIsLoading(false);
          };
          fileReader.onerror = () => {
            setError('Erreur lors de la lecture du fichier');
            setIsLoading(false);
          };
          fileReader.readAsText(file);
        } else {
          // Pour les fichiers Word (.doc/.docx)
          await extractWordContent(file);
        }
      } catch {
        setError('Erreur lors du traitement du fichier');
        setIsLoading(false);
      }
    };

    processFile();
  }, [file, onTextExtracted, extractWordContent]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center bg-gradient-to-br from-violet-100 to-purple-200 min-h-screen">
        <div className="w-1/2 p-4 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-violet-600 mx-auto mb-4 animate-spin" />
            <p className="text-violet-600 font-medium">Traitement du document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center bg-gradient-to-br from-violet-100 to-purple-200 min-h-screen">
        <div className="w-1/2 p-4 flex items-center justify-center">
          <div className="text-center bg-white rounded-lg p-6 shadow-lg">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de traitement</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le contenu extrait
  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-violet-100 to-purple-200 min-h-screen">
      <div className="w-1/2 p-4 h-screen flex flex-col">
        <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden">
          {/* En-tête du document */}
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-4 flex items-center space-x-3 flex-shrink-0">
            <FileText className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">{file.name}</h3>
              <p className="text-sm opacity-90">
                {file.type === 'text/plain' ? 'Fichier texte' : 'Document Word'} • {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          
          {/* Contenu du document */}
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="prose max-w-none">
              {content ? (
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {content}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Aucun contenu textuel détecté dans ce document.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};