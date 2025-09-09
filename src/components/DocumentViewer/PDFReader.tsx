import React, { useState, useEffect } from 'react';

interface PDFReaderProps {
  file: File;
  onTextExtracted?: (text: string) => void;
}

export const PDFReader: React.FC<PDFReaderProps> = ({ file }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    // Créer une URL blob pour afficher le PDF
    const url = URL.createObjectURL(file);
    setPdfUrl(url);

    return () => {
      // Nettoyer l'URL du blob
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="w-full flex justify-center bg-gradient-to-br from-violet-100 to-purple-200 min-h-screen">
      <div className="w-1/2 p-4">
        {pdfUrl && (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&page=1&view=FitH`}
            className="w-full h-screen border-0 rounded-lg shadow-lg"
            title={`PDF - ${file.name}`}
          />
        )}
      </div>
    </div>
  );
};