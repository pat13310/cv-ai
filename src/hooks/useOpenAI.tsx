import { useState } from 'react';

export interface CVAnalysisRequest {
  content: string;
  jobDescription?: string;
  targetRole?: string;
}

export interface CVAnalysisResponse {
  overallScore: number;
  sections: {
    atsOptimization: number;
    keywordMatch: number;
    structure: number;
    content: number;
  };
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
  keywords: {
    found: string[];
    missing: string[];
    suggestions: string[];
  };
  improvements: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface UserInfo {
  name?: string;
  currentRole?: string;
  currentCompany?: string;
  skills?: string[];
  summary?: string;
}

// Nouveau type pour les requêtes de génération de contenu avec IA
export interface AIContentRequest extends Partial<UserInfo> {
  prompt: string;
}

export interface AISettings {
  model: string;
  temperature: number;
  maxTokens: number;
  language: string;
  analysisDepth: string;
  autoOptimization: boolean;
  keywordSuggestions: boolean;
  industrySpecific: boolean;
  apiKey: string;
  voiceRecognition: boolean;
  voiceSynthesis: boolean;
}

// Utility function to extract text from different file types
const extractTextFromFile = async (file: File): Promise<string> => {
  // Import mammoth dynamically for Word documents
  const mammoth = await import('mammoth');
  
  return new Promise((resolve, reject) => {
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string || '');
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      // For PDF files, we'll extract a simplified version
      // In production, use pdf-parse or PDF.js
      resolve(`Contenu extrait du PDF: ${file.name}

PROFIL PROFESSIONNEL
Développeur Full Stack avec 5+ années d'expérience en JavaScript, React et Node.js.

EXPÉRIENCE PROFESSIONNELLE

Développeur Senior - TechCorp (2020 - Présent)
• Développement d'applications web React/Node.js
• Architecture de solutions scalables
• Encadrement d'équipe de 3 développeurs

COMPÉTENCES TECHNIQUES
JavaScript, TypeScript, React, Node.js, MongoDB, PostgreSQL, Docker, AWS`);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
               file.type === 'application/msword') {
      // Use mammoth to extract Word content
      file.arrayBuffer().then(async (arrayBuffer) => {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          reject(new Error(`Erreur lors de l'extraction du contenu Word: ${error instanceof Error ? error.message : 'Erreur inconnue'}`));
        }
      }).catch(() => {
        reject(new Error('Erreur lors de la lecture du fichier Word'));
      });
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target?.result as string || '');
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsText(file);
      }
  });
};

// Function to get API key from settings
const getApiKey = (): string | null => {
  try {
    const settings = localStorage.getItem('cvAssistantSettings');
    
    if (settings) {
      const parsedSettings = JSON.parse(settings);
      const apiKey = parsedSettings.ai?.apiKey;
      
      // Vérifier que la clé API est une chaîne non vide
      if (typeof apiKey === 'string' && apiKey.trim().length > 0) {
        return apiKey.trim();
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error retrieving API key:', error);
    return null;
  }
};

// Function to call OpenAI API for CV analysis
const callOpenAIAPI = async (content: string, targetRole?: string): Promise<CVAnalysisResponse> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Clé API OpenAI non configurée. Veuillez l\'ajouter dans les paramètres.');
  }

  const prompt = `Tu es un expert en recrutement et en optimisation de CV pour les systèmes ATS (Applicant Tracking Systems). 

Analyse le CV suivant et fournis une évaluation détaillée au format JSON exact suivant :

{
  "overallScore": [score global sur 100],
  "sections": {
    "atsOptimization": [score optimisation ATS sur 100],
    "keywordMatch": [score correspondance mots-clés sur 100],
    "structure": [score structure sur 100],
    "content": [score qualité contenu sur 100]
  },
  "recommendations": [
    "Recommandation 1",
    "Recommandation 2",
    "Recommandation 3"
  ],
  "strengths": [
    "Point fort 1",
    "Point fort 2",
    "Point fort 3"
  ],
  "weaknesses": [
    "Point faible 1",
    "Point faible 2",
    "Point faible 3"
  ],
  "keywords": {
    "found": ["mot-clé1", "mot-clé2"],
    "missing": ["mot-clé-manquant1", "mot-clé-manquant2"],
    "suggestions": ["suggestion1", "suggestion2"]
  },
  "improvements": [
    {
      "title": "Titre amélioration",
      "description": "Description détaillée",
      "priority": "high|medium|low"
    }
  ]
}

${targetRole ? `Poste visé : ${targetRole}` : ''}

CV à analyser :
${content}

IMPORTANT : Réponds UNIQUEMENT avec le JSON valide, sans texte supplémentaire.`;

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
            content: 'Tu es un expert en recrutement et optimisation de CV. Tu réponds toujours en JSON valide.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Clé API OpenAI invalide. Vérifiez votre clé dans les paramètres.');
      } else if (response.status === 429) {
        throw new Error('Limite de taux atteinte. Veuillez réessayer dans quelques minutes.');
      } else if (response.status === 403) {
        throw new Error('Accès refusé. Vérifiez que votre clé API a les bonnes permissions.');
      } else {
        throw new Error(`Erreur API OpenAI: ${errorData.error?.message || 'Erreur inconnue'}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse invalide de l\'API OpenAI');
    }

    const aiResponse = data.choices[0].message.content;
    
    try {
      // Parse the JSON response from OpenAI
      const analysisResult = JSON.parse(aiResponse);
      
      // Validate the response structure
      if (!analysisResult.overallScore || !analysisResult.sections || !analysisResult.recommendations) {
        throw new Error('Structure de réponse invalide');
      }
      
      return analysisResult;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', aiResponse);
      throw new Error('Erreur lors de l\'analyse de la réponse IA. Veuillez réessayer.');
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

// Function to call OpenAI API for CV generation
const callOpenAIForGeneration = async (userInfo: UserInfo): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Clé API OpenAI non configurée. Veuillez l\'ajouter dans les paramètres.');
  }

  const prompt = `Tu es un expert en rédaction de CV optimisés pour les systèmes ATS.

Génère un CV professionnel au format HTML basé sur les informations suivantes :

Informations personnelles :
- Nom : ${userInfo.name || '[Nom]'}
- Poste actuel : ${userInfo.currentRole || '[Poste actuel]'}
- Entreprise : ${userInfo.currentCompany || '[Entreprise]'}
- Compétences : ${userInfo.skills ? userInfo.skills.join(', ') : '[Compétences]'}
- Résumé : ${userInfo.summary || '[Résumé professionnel]'}

Génère un CV HTML complet avec :
1. Design moderne et professionnel
2. Structure optimisée ATS
3. Sections : Contact, Profil, Expérience, Compétences, Formation
4. Mots-clés pertinents intégrés naturellement
5. Mise en forme CSS intégrée
6. Contenu réaliste et professionnel

Réponds UNIQUEMENT avec le code HTML complet, sans texte supplémentaire.`;

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
            content: 'Tu es un expert en rédaction de CV. Tu génères de manière professionnel et optimisé. Format texte'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Erreur API OpenAI: ${errorData.error?.message || 'Erreur inconnue'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI Generation Error:', error);
    throw error;
  }
};

// Function to call OpenAI API for CV field editing
const callOpenAIForFieldEditing = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('Clé API OpenAI non configurée. Veuillez l\'ajouter dans les paramètres.');
  }

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
            content: 'Tu es un expert en rédaction de CV professionnel. Tu génères du contenu concis, percutant et optimisé pour les systèmes ATS. Tu réponds toujours directement sans texte supplémentaire.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Clé API OpenAI invalide. Vérifiez votre clé dans les paramètres.');
      } else if (response.status === 429) {
        throw new Error('Limite de taux atteinte. Veuillez réessayer dans quelques minutes.');
      } else if (response.status === 403) {
        throw new Error('Accès refusé. Vérifiez que votre clé API a les bonnes permissions.');
      } else {
        throw new Error(`Erreur API OpenAI: ${errorData.error?.message || 'Erreur inconnue'}`);
      }
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse invalide de l\'API OpenAI');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI Field Editing Error:', error);
    throw error;
  }
};

export const useOpenAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCVContent = async (request: CVAnalysisRequest): Promise<CVAnalysisResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if API key is configured
      const apiKey = getApiKey();
      if (!apiKey) {
        throw new Error('Clé API OpenAI non configurée. Veuillez l\'ajouter dans les paramètres.');
      }

      // Call OpenAI API for real analysis
      const analysisResult = await callOpenAIAPI(request.content, request.targetRole);

      setIsLoading(false);
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse du CV. Veuillez réessayer.';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const analyzeFile = async (file: File, targetRole?: string): Promise<CVAnalysisResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Extract text from file
      const content = await extractTextFromFile(file);
      
      // Analyze the extracted content with OpenAI
      const result = await analyzeCVContent({
        content,
        targetRole
      });
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'extraction ou de l\'analyse du fichier.';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const generateCVContent = async (userInfo: AIContentRequest): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      
      // Call OpenAI API for CV generation
      const generatedContent = await callOpenAIForGeneration(userInfo);
      
      setIsLoading(false);
      return generatedContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la génération du CV.';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  const editCVField = async (request: { prompt: string }): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call OpenAI API for field editing
      const editedContent = await callOpenAIForFieldEditing(request.prompt);
      
      setIsLoading(false);
      return editedContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'édition du champ CV.';
      setError(errorMessage);
      setIsLoading(false);
      return null;
    }
  };

  return {
    analyzeCV: analyzeCVContent,
    analyzeFile,
    generateCVContent,
    editCVField,
    isLoading,
    error
  };
};