import React from 'react';
import { PDFReader } from './PDFReader';
import { WordReader } from './WordReader';

interface DocumentViewerProps {
  file: File;
  onClose?: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ file }) => {
  // Vérifier si c'est un PDF
  if (file.type === 'application/pdf') {
    return <PDFReader file={file} />;
  }

  // Vérifier si c'est un fichier Word ou texte
  if (
    file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'text/plain'
  ) {
    return <WordReader file={file} />;
  }

  // Pour les autres types de fichiers, afficher un message simple
  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-violet-100 to-purple-200 min-h-screen">
      <div className="w-1/2 p-4 flex items-center justify-center">
        <div className="text-center bg-white rounded-lg p-6 shadow-lg">
          <p className="text-gray-600">Type de fichier non supporté pour l'affichage simplifié.</p>
          <p className="text-sm text-gray-500 mt-2">
            Formats supportés : PDF, DOC, DOCX, TXT
          </p>
        </div>
      </div>
    </div>
  );
};