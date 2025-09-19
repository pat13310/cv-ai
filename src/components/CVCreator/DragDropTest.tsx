import React from 'react';
import { useCVSections } from '../../hooks/useCVSections';

// Composant de test simple pour vérifier le fonctionnement du drag & drop
export const DragDropTest: React.FC = () => {
  const { sections, reorderSections, resetSectionsOrder } = useCVSections();

  const handleTestReorder = () => {
    // Test : déplacer la première section à la fin
    if (sections.length >= 2) {
      reorderSections(sections[0].id, sections[sections.length - 1].id);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg bg-white">
      <h3 className="text-lg font-bold mb-4">Test du système de drag & drop</h3>
      
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Ordre actuel des sections :</h4>
        <ol className="list-decimal list-inside space-y-1">
          {sections.map((section) => (
            <li key={section.id} className="text-sm">
              {section.name} {section.visible ? '✅' : '❌'}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleTestReorder}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Test réorganisation
        </button>
        <button
          onClick={resetSectionsOrder}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Réinitialiser
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p>✅ = Section visible | ❌ = Section masquée</p>
        <p>L'ordre est sauvegardé dans localStorage</p>
      </div>
    </div>
  );
};