import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, User } from 'lucide-react';
import type { CVContent } from '../types';

interface PhotoSectionProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  photoAlignment?: 'left' | 'center' | 'right';
  photoSize?: 'small' | 'medium' | 'large';
  photoShape?: 'circle' | 'square' | 'rounded';
  // Nouveaux props pour les ajustements d'image
  photoZoom?: number;
  photoPositionX?: number;
  photoPositionY?: number;
  photoRotation?: number;
}

export const PhotoSection: React.FC<PhotoSectionProps> = ({
  editableContent,
  setEditableContent,
  photoAlignment = 'center',
  photoSize = 'medium',
  photoShape = 'circle',
  photoZoom = 100,
  photoPositionX = 0,
  photoPositionY = 0,
  photoRotation = 0
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Tailles disponibles
  const sizes = {
    small: { width: '80px', height: '80px' },
    medium: { width: '120px', height: '120px' },
    large: { width: '160px', height: '160px' }
  };

  // Classes CSS pour les formes
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-lg'
  };

  // Classes CSS pour l'alignement
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Erreur lors de la conversion du fichier'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide (JPG, PNG, GIF, etc.)');
      return;
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Le fichier est trop volumineux. Taille maximale : 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const base64 = await convertFileToBase64(file);
      setEditableContent(prev => ({ ...prev, photo: base64 }));
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      alert('Erreur lors du téléchargement de l\'image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileChange(file || null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removePhoto = () => {
    setEditableContent(prev => ({ ...prev, photo: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmRemove = () => {
    removePhoto();
    setShowConfirmModal(false);
  };

  return (
    <>
      <div className={`mt-4 flex ${alignmentClasses[photoAlignment]}`}>
        <div className="relative">
          {/* Zone d'upload/preview */}
          <div
            className={`
              group relative border-2 border-dashed transition-all duration-200 cursor-pointer
              ${dragOver ? 'border-violet-400 bg-violet-50' : 'border-gray-300 hover:border-violet-400'}
              ${shapeClasses[photoShape]}
              ${isLoading ? 'opacity-50 pointer-events-none' : ''}
            `}
            style={{
              width: sizes[photoSize].width,
              height: sizes[photoSize].height,
            }}
            onClick={openFileDialog}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Champ de fichier caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            {editableContent.photo ? (
              /* Preview de l'image */
              <>
                <div className={`w-full h-full overflow-hidden ${shapeClasses[photoShape]}`}>
                  <img
                    src={editableContent.photo}
                    alt="Photo de profil"
                    className="w-full h-full object-contain transition-transform duration-200"
                    style={{
                      transform: `
                        scale(${photoZoom / 100}) 
                        translateX(${photoPositionX}px) 
                        translateY(${photoPositionY}px) 
                        rotate(${photoRotation}deg)
                      `.replace(/\s+/g, ' ').trim()
                    }}
                  />
                </div>
                {/* Overlay au survol */}
                <div className={`absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center ${shapeClasses[photoShape]}`}>
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              /* Zone d'upload vide */
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-violet-600 transition-colors">
                {isLoading ? (
                  <div className="animate-spin">
                    <Upload className="w-8 h-8" />
                  </div>
                ) : (
                  <>
                    <User className="w-8 h-8 mb-2" />
                    <span className="text-xs text-center px-2">
                      Cliquez ou glissez une photo
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Bouton de suppression */}
            {editableContent.photo && !isLoading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto();
                  setShowConfirmModal(true);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg z-10"
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-10 opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-200 ease-out"
                title="Supprimer la photo"
              >
                <X className="w-3 h-3" />
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Indicateur de chargement */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-lg shadow-lg px-3 py-2 text-sm text-gray-600">
                Chargement...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Formats acceptés : JPG, PNG, GIF • Taille max : 5MB
      </div>

      {/* Modale de confirmation */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200
          ${showConfirmModal ? 'bg-black bg-opacity-50 opacity-100' : 'opacity-0 pointer-events-none'}`
        }
        onClick={() => setShowConfirmModal(false)}
        aria-modal="true"
        role="dialog"
      >
        <div
          className={`bg-white rounded-lg p-6 shadow-xl transform transition-all duration-200
            ${showConfirmModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`
          }
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-medium text-gray-900">Confirmer la suppression</h3>
          <p className="mt-2 text-sm text-gray-600">
            Êtes-vous sûr de vouloir supprimer cette photo ? Cette action est irréversible.
          </p>
          <div className="mt-5 flex justify-end space-x-3">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmRemove}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
