import React, { useState, useRef, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Link,
  Image,
  Download,
  Eye,
  Save,
  Undo2,
  Redo2,
  Type,
  Palette,
  FileText,
  Printer
} from 'lucide-react';

interface LetterEditorProps {
  onSave?: (content: string) => void;
  onExport?: (content: string, format: 'pdf' | 'docx' | 'html') => void;
  initialContent?: string;
  formData?: {
    poste: string;
    entreprise: string;
    secteur: string;
    experience: string;
    motivation: string;
    competences: string;
  };
}

export const LetterEditor: React.FC<LetterEditorProps> = ({ 
  onSave, 
  onExport, 
  initialContent = '',
  formData 
}) => {
  const [content, setContent] = useState(initialContent);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState('moderne');
  const [isPreview, setIsPreview] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Commandes de formatage
  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  // Templates de lettres
  const templates = {
    moderne: {
      name: "Moderne",
      style: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '12pt',
        lineHeight: '1.6',
        color: '#333',
      },
      template: `
        <div style="max-width: 210mm; margin: 0 auto; padding: 20mm; font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6;">
          <div style="text-align: right; margin-bottom: 30px;">
            <strong>[Votre Prénom Nom]</strong><br>
            [Votre adresse]<br>
            [Code postal] [Ville]<br>
            [Téléphone]<br>
            [Email]
          </div>
          
          <div style="margin-bottom: 30px;">
            <strong>[Nom de l'entreprise]</strong><br>
            [Adresse de l'entreprise]<br>
            [Code postal] [Ville]
          </div>
          
          <div style="text-align: right; margin-bottom: 30px;">
            [Ville], le [Date]
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong>Objet :</strong> Candidature au poste de <strong>${formData?.poste || '[Intitulé du poste]'}</strong>
          </div>
          
          <div style="margin-bottom: 20px;">
            Madame, Monsieur,
          </div>
          
          <p>
            Actuellement à la recherche d'un nouveau défi professionnel, je me permets de vous adresser ma candidature pour le poste de <strong>${formData?.poste || '[Intitulé du poste]'}</strong> au sein de <strong>${formData?.entreprise || '[Nom de l\'entreprise]'}</strong>.
          </p>
          
          <p>
            ${formData?.experience || 'Fort(e) de [X années] d\'expérience dans [votre domaine], j\'ai développé une expertise solide qui me permettra de contribuer efficacement à vos objectifs.'}
          </p>
          
          <p>
            ${formData?.motivation || 'Votre entreprise m\'attire particulièrement par [mentionner ce qui vous motive chez cette entreprise]. Je suis convaincu(e) que mes compétences et mon parcours correspondent parfaitement à vos attentes.'}
          </p>
          
          <p>
            Mes principales compétences incluent : ${formData?.competences || '[lister vos compétences clés]'}.
          </p>
          
          <p>
            Je serais ravi(e) de vous rencontrer pour discuter de ma candidature et vous démontrer ma motivation lors d'un entretien.
          </p>
          
          <p>
            Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.
          </p>
          
          <div style="text-align: right; margin-top: 40px;">
            [Votre signature]<br>
            <strong>[Votre Prénom Nom]</strong>
          </div>
        </div>
      `
    },
    classique: {
      name: "Classique",
      style: {
        fontFamily: 'Times New Roman, serif',
        fontSize: '12pt',
        lineHeight: '1.8',
        color: '#000',
      },
      template: `
        <div style="max-width: 210mm; margin: 0 auto; padding: 25mm; font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.8;">
          <div style="text-align: center; margin-bottom: 40px; border-bottom: 2px solid #000; padding-bottom: 10px;">
            <h1 style="font-size: 16pt; margin: 0;">LETTRE DE MOTIVATION</h1>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div>
              <strong>[Votre Prénom Nom]</strong><br>
              [Votre adresse]<br>
              [Code postal] [Ville]<br>
              [Téléphone] | [Email]
            </div>
            <div style="text-align: right;">
              <strong>[Nom de l'entreprise]</strong><br>
              [Service RH]<br>
              [Adresse de l'entreprise]<br>
              [Code postal] [Ville]
            </div>
          </div>
          
          <div style="text-align: right; margin-bottom: 30px; font-style: italic;">
            [Ville], le [Date]
          </div>
          
          <div style="margin-bottom: 25px; text-decoration: underline;">
            <strong>Objet :</strong> Candidature au poste de ${formData?.poste || '[Intitulé du poste]'}
          </div>
          
          <div style="margin-bottom: 25px;">
            Madame, Monsieur,
          </div>
          
          <p style="text-align: justify; text-indent: 20px;">
            J'ai l'honneur de vous présenter ma candidature pour le poste de <strong>${formData?.poste || '[Intitulé du poste]'}</strong> proposé au sein de votre établissement <strong>${formData?.entreprise || '[Nom de l\'entreprise]'}</strong>.
          </p>
          
          <p style="text-align: justify; text-indent: 20px;">
            ${formData?.experience || 'Diplômé(e) de [formation] et fort(e) de [X années] d\'expérience professionnelle dans le domaine de [secteur], j\'ai acquis les compétences nécessaires pour exercer ce poste avec succès.'}
          </p>
          
          <p style="text-align: justify; text-indent: 20px;">
            ${formData?.motivation || 'Votre entreprise, reconnue pour [points forts de l\'entreprise], représente pour moi l\'opportunité idéale de mettre mes compétences au service d\'une organisation dynamique et innovante.'}
          </p>
          
          <p style="text-align: justify; text-indent: 20px;">
            Mes qualités principales sont : ${formData?.competences || '[énumérer vos principales qualités et compétences]'}.
          </p>
          
          <p style="text-align: justify; text-indent: 20px;">
            Je reste à votre disposition pour tout complément d'information et serais honoré(e) de vous rencontrer lors d'un entretien à votre convenance.
          </p>
          
          <p style="text-align: justify; text-indent: 20px;">
            Veuillez agréer, Madame, Monsieur, l'assurance de ma parfaite considération.
          </p>
          
          <div style="text-align: right; margin-top: 50px;">
            <div style="border-top: 1px solid #ccc; padding-top: 20px; display: inline-block;">
              [Signature manuscrite]<br><br>
              <strong>[Votre Prénom Nom]</strong>
            </div>
          </div>
        </div>
      `
    },
    creatif: {
      name: "Créatif",
      style: {
        fontFamily: 'Helvetica, sans-serif',
        fontSize: '11pt',
        lineHeight: '1.5',
        color: '#2c3e50',
      },
      template: `
        <div style="max-width: 210mm; margin: 0 auto; padding: 15mm; font-family: Helvetica, sans-serif; font-size: 11pt; line-height: 1.5; color: #2c3e50;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h1 style="margin: 0; font-size: 18pt; font-weight: 300;">Lettre de Motivation</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Candidature au poste de <strong>${formData?.poste || '[Intitulé du poste]'}</strong></p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
            <div style="background: #f8f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin: 0 0 10px 0; font-size: 12pt;">Candidat</h3>
              <strong>[Votre Prénom Nom]</strong><br>
              [Votre adresse]<br>
              [Code postal] [Ville]<br>
              <span style="color: #667eea;">[Téléphone]</span><br>
              <span style="color: #667eea;">[Email]</span>
            </div>
            <div style="background: #f8f9ff; padding: 15px; border-radius: 8px; border-left: 4px solid #764ba2;">
              <h3 style="color: #764ba2; margin: 0 0 10px 0; font-size: 12pt;">Destinataire</h3>
              <strong>${formData?.entreprise || '[Nom de l\'entreprise]'}</strong><br>
              [Service Recrutement]<br>
              [Adresse de l'entreprise]<br>
              [Code postal] [Ville]
            </div>
          </div>
          
          <div style="text-align: right; margin-bottom: 25px; color: #7f8c8d; font-style: italic;">
            [Ville], le [Date]
          </div>
          
          <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="margin-bottom: 20px;">
              <strong>Madame, Monsieur,</strong>
            </p>
            
            <p style="margin-bottom: 20px;">
              🎯 Je souhaite rejoindre <strong>${formData?.entreprise || '[Nom de l\'entreprise]'}</strong> en tant que <strong>${formData?.poste || '[Intitulé du poste]'}</strong>, un poste qui correspond parfaitement à mes aspirations professionnelles.
            </p>
            
            <p style="margin-bottom: 20px;">
              💼 <strong>Mon expérience :</strong><br>
              ${formData?.experience || '[Décrivez votre expérience pertinente et vos réalisations clés]'}
            </p>
            
            <p style="margin-bottom: 20px;">
              🚀 <strong>Ma motivation :</strong><br>
              ${formData?.motivation || '[Expliquez pourquoi cette entreprise vous attire et comment vous pouvez contribuer à ses objectifs]'}
            </p>
            
            <div style="background: #f1f3ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0;"><strong>🎖️ Mes atouts :</strong></p>
              <p style="margin: 10px 0 0 0;">${formData?.competences || '[Listez vos compétences et qualités principales avec des exemples concrets]'}</p>
            </div>
            
            <p style="margin-bottom: 20px;">
              Je serais ravi(e) d'échanger avec vous sur ma candidature et de vous démontrer ma motivation lors d'un entretien.
            </p>
            
            <p>
              Cordialement,
            </p>
          </div>
          
          <div style="text-align: right; margin-top: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 8px; display: inline-block;">
              [Signature numérique]<br>
              <strong>[Votre Prénom Nom]</strong>
            </div>
          </div>
        </div>
      `
    }
  };

  // Couleurs prédéfinies
  const colors = [
    '#000000', '#333333', '#666666', '#999999',
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#008000', '#800000', '#000080', '#808000'
  ];

  // Tailles de police
  const fontSizes = ['8pt', '9pt', '10pt', '11pt', '12pt', '14pt', '16pt', '18pt', '20pt', '24pt', '28pt', '32pt'];

  // Charger un template
  const loadTemplate = useCallback((templateKey: keyof typeof templates) => {
    setCurrentTemplate(templateKey);
    if (editorRef.current) {
      editorRef.current.innerHTML = templates[templateKey].template;
      setContent(templates[templateKey].template);
    }
    setShowTemplates(false);
  }, []);

  // Sauvegarder
  const handleSave = useCallback(() => {
    if (onSave && editorRef.current) {
      onSave(editorRef.current.innerHTML);
    }
  }, [onSave]);

  // Exporter
  const handleExport = useCallback((format: 'pdf' | 'docx' | 'html') => {
    if (onExport && editorRef.current) {
      onExport(editorRef.current.innerHTML, format);
    }
  }, [onExport]);

  // Basculer prévisualisation
  const togglePreview = useCallback(() => {
    setIsPreview(!isPreview);
  }, [isPreview]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Barre d'outils */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 p-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Section Fichier */}
            <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Templates"
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                title="Sauvegarder"
              >
                <Save className="w-4 h-4" />
              </button>
              <div className="relative">
                <button
                  onClick={() => handleExport('pdf')}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Exporter PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Section Édition */}
            <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
              <button
                onClick={() => document.execCommand('undo')}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                title="Annuler"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => document.execCommand('redo')}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                title="Rétablir"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Section Formatage */}
            <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
              <button
                onClick={() => execCommand('bold')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors font-bold"
                title="Gras"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('italic')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors italic"
                title="Italique"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('underline')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors underline"
                title="Souligné"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            {/* Section Police et taille */}
            <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
              <div className="relative">
                <button
                  onClick={() => setShowFontSize(!showFontSize)}
                  className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors flex items-center gap-1"
                  title="Taille de police"
                >
                  <Type className="w-4 h-4" />
                  <span className="text-xs">12pt</span>
                </button>
                {showFontSize && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10">
                    <div className="grid grid-cols-4 gap-1 p-2">
                      {fontSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            execCommand('fontSize', size);
                            setShowFontSize(false);
                          }}
                          className="p-2 text-xs hover:bg-gray-100 rounded"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={colorPickerRef}>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  title="Couleur du texte"
                >
                  <Palette className="w-4 h-4" />
                </button>
                {showColorPicker && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10">
                    <div className="grid grid-cols-8 gap-1 p-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            execCommand('foreColor', color);
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section Alignement */}
            <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
              <button
                onClick={() => execCommand('justifyLeft')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Aligner à gauche"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('justifyCenter')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Centrer"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('justifyRight')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Aligner à droite"
              >
                <AlignRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('justifyFull')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Justifier"
              >
                <AlignJustify className="w-4 h-4" />
              </button>
            </div>

            {/* Section Listes */}
            <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
              <button
                onClick={() => execCommand('insertUnorderedList')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Liste à puces"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('insertOrderedList')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Liste numérotée"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
            </div>

            {/* Section Aperçu */}
            <div className="flex items-center gap-1">
              <button
                onClick={togglePreview}
                className={`p-2 rounded transition-colors ${
                  isPreview 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                title="Aperçu"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="p-2 text-gray-700 hover:bg-gray-50 rounded transition-colors"
                title="Imprimer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Templates dropdown */}
          {showTemplates && (
            <div className="mt-3 p-3 bg-gray-50 rounded border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Templates de lettres</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(templates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => loadTemplate(key as keyof typeof templates)}
                    className={`p-3 text-left border rounded-lg transition-colors ${
                      currentTemplate === key
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {key === 'moderne' && 'Design épuré et professionnel'}
                      {key === 'classique' && 'Style traditionnel et élégant'}
                      {key === 'creatif' && 'Approche moderne et colorée'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Éditeur */}
        <div className="bg-white border-l border-r border-gray-200 min-h-[800px] relative">
          {isPreview ? (
            <div 
              className="p-8 min-h-full"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="p-8 min-h-full outline-none"
              style={{ 
                minHeight: '800px',
                fontFamily: templates[currentTemplate as keyof typeof templates].style.fontFamily,
                fontSize: templates[currentTemplate as keyof typeof templates].style.fontSize,
                lineHeight: templates[currentTemplate as keyof typeof templates].style.lineHeight,
                color: templates[currentTemplate as keyof typeof templates].style.color
              }}
              onInput={(e) => {
                setContent((e.target as HTMLDivElement).innerHTML);
              }}
              dangerouslySetInnerHTML={{ __html: content || templates[currentTemplate as keyof typeof templates].template }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 rounded-b-lg border border-gray-200 border-t-0 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Template: {templates[currentTemplate as keyof typeof templates].name}</span>
            <span>|</span>
            <span>{content.length} caractères</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600">✓ Sauvegarde automatique</span>
          </div>
        </div>
      </div>
    </div>
  );
};
