import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { RotateCcw, Move } from 'lucide-react';
import { useCVSections } from '../../hooks/useCVSections';
import {
  NameSection,
  ProfileSection,
  ContactSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
} from './sections';
import type { CVContent, CVExperience, CVSkill, CVLanguage, CVEducation, SectionConfig } from './types';

interface DraggableSectionsProps {
  editableContent: CVContent;
  setEditableContent: React.Dispatch<React.SetStateAction<CVContent>>;
  experiences: CVExperience[];
  setExperiences: React.Dispatch<React.SetStateAction<CVExperience[]>>;
  skills: CVSkill[];
  setSkills: React.Dispatch<React.SetStateAction<CVSkill[]>>;
  languages: CVLanguage[];
  setLanguages: React.Dispatch<React.SetStateAction<CVLanguage[]>>;
  educations: CVEducation[];
  setEducations: React.Dispatch<React.SetStateAction<CVEducation[]>>;
  editingField: string | null;
  setEditingField: React.Dispatch<React.SetStateAction<string | null>>;
  customColor: string;
  titleColor: string;
  addExperience: () => void;
  removeExperience: (id: number) => void;
  addSkill: () => void;
  removeSkill: (id: number) => void;
  addLanguage: () => void;
  removeLanguage: (id: number) => void;
  addEducation: () => void;
  removeEducation: (id: number) => void;
  generateWithAI: (field: string, currentContent?: string) => Promise<void>;
  isLoading: boolean;
  nameAlignment: 'left' | 'center' | 'right';
}

export const DraggableSections: React.FC<DraggableSectionsProps> = ({
  editableContent,
  setEditableContent,
  experiences,
  setExperiences,
  skills,
  setSkills,
  languages,
  setLanguages,
  educations,
  setEducations,
  editingField,
  setEditingField,
  customColor,
  titleColor,
  addExperience,
  removeExperience,
  addSkill,
  removeSkill,
  addLanguage,
  removeLanguage,
  addEducation,
  removeEducation,
  generateWithAI,
  isLoading,
  nameAlignment
}) => {
  const { sections, resetSectionsOrder, setSectionsOrder } = useCVSections();
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(null);
  const [hoveredLayer, setHoveredLayer] = React.useState<string | number | null>(null);
  const [hoveredSection, setHoveredSection] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    setActiveSection(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setIsDragging(false);
    setActiveSection(null);

    if (over) {
      // Vérifier si on drop sur une zone inter-layer
      if (typeof over.id === 'string' && over.id.startsWith('inter-layer-drop-zone-')) {
        const layerIndex = parseInt(over.id.split('-')[4]);
        const activeSection = sections.find(s => s.id === active.id);
        if (activeSection) {
          // Insérer dans un nouveau layer à la position spécifiée
          const newSections: SectionConfig[] = sections.map(section => {
            if (section.id === active.id) {
              return { ...section, layer: layerIndex + 1, width: 'full' as const };
            } else if (section.layer && section.layer > layerIndex) {
              // Décaler les layers suivants
              return { ...section, layer: section.layer + 1 };
            }
            return section;
          });

          const cleanedSections = cleanupLayers(newSections);
          setSectionsOrder(cleanedSections);
        }
        return;
      }

      // Vérifier si on drop sur une zone de drop spécifique
      if (typeof over.id === 'string' && over.id.startsWith('drop-zone-layer-')) {
        const layerNumber = parseInt(over.id.split('-')[3]);
        const position = over.id.split('-')[4]; // 'left', 'right', ou 'middle'

        const activeSection = sections.find(s => s.id === active.id);
        if (activeSection) {
          if (position === 'middle') {
            // Insérer au milieu - créer un nouveau layer et décaler les suivants
            const newSections: SectionConfig[] = sections.map(section => {
              if (section.id === active.id) {
                return { ...section, layer: layerNumber + 0.5, width: 'full' as const };
              } else if (section.layer && section.layer > layerNumber) {
                return { ...section, layer: section.layer + 1 };
              }
              return section;
            });

            const cleanedSections = cleanupLayers(newSections);
            setSectionsOrder(cleanedSections);
          } else {
            // Insérer dans le layer existant
            const newSections: SectionConfig[] = sections.map(section => {
              if (section.id === active.id) {
                return { ...section, layer: layerNumber, width: 'half' as const };
              }
              return section;
            });

            const cleanedSections = cleanupLayers(newSections);
            setSectionsOrder(cleanedSections);
          }
        }
        return;
      }

      // Logique existante pour le drop sur une autre section
      if (active.id !== over.id) {
        const activeSection = sections.find(s => s.id === active.id);
        const overSection = sections.find(s => s.id === over.id);

        if (activeSection && overSection) {
          // Si les sections sont dans le même layer, faire un swap
          if (activeSection.layer === overSection.layer) {
            // Swap des positions dans le même layer
            const newSections: SectionConfig[] = sections.map(section => {
              if (section.id === active.id) {
                return { ...activeSection, id: overSection.id, name: overSection.name, component: overSection.component };
              } else if (section.id === over.id) {
                return { ...overSection, id: activeSection.id, name: activeSection.name, component: activeSection.component };
              }
              return section;
            });

            setSectionsOrder(newSections);
          } else {
            // Déplacer la section vers le layer de destination
            const targetLayer = overSection.layer;
            const sectionsInTargetLayer = sections.filter(s => s.layer === targetLayer && s.id !== active.id);

            const newSections: SectionConfig[] = sections.map(section => {
              if (section.id === active.id) {
                // Déterminer la largeur appropriée pour la section déplacée
                let newWidth: 'full' | 'half';
                if (sectionsInTargetLayer.length === 0) {
                  // Le layer de destination est vide, la section prend toute la largeur
                  newWidth = 'full';
                } else {
                  // Il y a déjà une ou plusieurs sections dans le layer
                  newWidth = 'half';
                }

                return { ...section, layer: targetLayer, width: newWidth };
              }

              // Ajuster la largeur des sections existantes dans le layer de destination
              if (section.layer === targetLayer) {
                if (sectionsInTargetLayer.length === 0) {
                  // Si le layer était vide, la section existante garde sa taille
                  return section;
                } else if (sectionsInTargetLayer.length === 1) {
                  // Il y avait une section seule, elle doit se réduire
                  if (section.width === 'full') {
                    // Si c'est Contact qui arrive, la section existante devient 3/4
                    if (active.id === 'contact') {
                      return { ...section, width: 'half' as const }; // Pour l'instant on garde half
                    } else {
                      // Sinon, elle devient half
                      return { ...section, width: 'half' as const };
                    }
                  }
                }
              }

              return section;
            });

            // Appliquer le nettoyage des layers
            const cleanedSections = cleanupLayers(newSections);
            setSectionsOrder(cleanedSections);
          }
        }
      }
    }
  };

  // Fonction pour nettoyer les layers avec gestion automatique des largeurs
  const cleanupLayers = (sections: SectionConfig[]): SectionConfig[] => {
    const layerGroups = new Map<number, SectionConfig[]>();

    sections.forEach(section => {
      const layer = section.layer || 1;
      if (!layerGroups.has(layer)) {
        layerGroups.set(layer, []);
      }
      layerGroups.get(layer)!.push(section);
    });

    const sortedLayers = Array.from(layerGroups.keys()).sort((a, b) => a - b);
    const newSections: SectionConfig[] = [];

    sortedLayers.forEach((oldLayer, index) => {
      const newLayer = index + 1;
      const sectionsInLayer = layerGroups.get(oldLayer)!;
      const limitedSections = sectionsInLayer.slice(0, 2);

      limitedSections.forEach((section) => {
        // Gestion automatique des largeurs simplifiée
        let width: 'full' | 'half' = section.width || 'full';
        if (limitedSections.length === 1) {
          // Seule dans le layer = full
          width = 'full';
        } else if (limitedSections.length === 2) {
          // Deux sections dans le layer = half chacune
          width = 'half';
        }

        newSections.push({
          ...section,
          layer: newLayer,
          width: width
        });
      });

      if (sectionsInLayer.length > 2) {
        sectionsInLayer.slice(2).forEach((section, extraIndex) => {
          newSections.push({
            ...section,
            layer: sortedLayers.length + extraIndex + 1,
            width: 'full' as const // Nouvelle section seule = full
          });
        });
      }
    });

    return newSections;
  };

  // Props communes pour toutes les sections
  const commonSectionProps = {
    editableContent,
    setEditableContent,
    editingField,
    setEditingField,
    customColor,
    titleColor,
    generateWithAI,
    isLoading,
  };

  // Composant pour l'overlay de drag personnalisé
  const DragOverlayContent = () => {
    if (!activeSection) return null;

    const section = sections.find(s => s.id === activeSection);
    if (!section) return null;

    return (
      <div className="bg-white border-2 border-violet-500 rounded-lg p-4 shadow-lg flex items-center gap-3 min-w-[200px]">
        <Move className="w-5 h-5 text-violet-600" />
        <span className="font-medium text-gray-800">{section.name}</span>
      </div>
    );
  };

  // Composant pour la zone de drop entre layers
  const InterLayerDropZone: React.FC<{ layerIndex: number }> = ({ layerIndex }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: `inter-layer-drop-zone-${layerIndex}`,
    });

    return (
      <div
        ref={setNodeRef}
        className={`
          h-2 w-full transition-all duration-200 my-1
          ${isDragging ? 'opacity-100' : 'opacity-0'}
          ${isOver ? 'bg-violet-400 scale-y-150' : 'bg-gray-300'}
        `}
      />
    );
  };

  // Composant pour les zones de drop
  const DropZone: React.FC<{
    id: string;
    className: string;
    label: string;
  }> = ({ id, className, label }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
      <div
        ref={setNodeRef}
        className={`${className} ${isOver ? 'opacity-100 scale-105' : ''} transition-all duration-200`}
      >
        <span className="text-xs font-medium text-violet-700">{label}</span>
      </div>
    );
  };

  return (
    <div className="w-full space-y-1">
      {/* Bouton de réinitialisation de l'ordre */}
      <div className="flex justify-end mb-2">
        <button
          onClick={resetSectionsOrder}
          className="flex items-center gap-1 px-2 py-0 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-all duration-200"
          title="Réinitialiser l'ordre des sections"
        >
          <RotateCcw className="w-3 h-3" />
          Réinitialiser l'ordre
        </button>
      </div>

      {/* Sections déplaçables empilées verticalement */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.filter(s => s.visible).map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {(() => {
              const visibleSections = sections.filter(section => section.visible);
              const groupedSections = new Map<string | number, SectionConfig[]>();

              // Grouper les sections par layer (si disponible)
              visibleSections.forEach(section => {
                const layer = section.layer || section.id;
                if (!groupedSections.has(layer)) {
                  groupedSections.set(layer, []);
                }
                groupedSections.get(layer)!.push(section);
              });

              return Array.from(groupedSections.entries()).map(([layer, layerSections]) => {
                // Si plusieurs sections dans le même layer OU si on survole une section seule, les afficher côte à côte
                const isHorizontalLayout = layerSections.length > 1 || (layerSections.length === 1 && hoveredSection && layerSections.some(s => s.id === hoveredSection));

                return (
                  <div
                    key={layer}
                    className={`group relative w-full ${isHorizontalLayout ? "flex gap-3 items-stretch" : ""} rounded-lg p-2 transition-all duration-200 min-h-[60px] ${isDragging
                        ? 'border-2 border-green-400 border-dashed bg-green-50 hover:border-green-500 hover:bg-green-100'
                        : 'hover:border-2 hover:border-violet-500 hover:border-dashed'
                      }`}
                    onMouseEnter={() => isDragging && setHoveredLayer(layer)}
                    onMouseLeave={() => setHoveredLayer(null)}
                  >
                    {layerSections.map((section: SectionConfig) => {
                      const sectionComponent = (() => {
                        switch (section.id) {
                          case 'name':
                            return (
                              <NameSection
                                key={section.id}
                                {...commonSectionProps}
                                nameAlignment={nameAlignment}
                              />
                            );
                          case 'profile':
                            return (
                              <ProfileSection
                                key={section.id}
                                {...commonSectionProps}
                              />
                            );
                          case 'contact':
                            return (
                              <ContactSection
                                key={section.id}
                                {...commonSectionProps}
                              />
                            );
                          case 'experience':
                            return (
                              <ExperienceSection
                                key={section.id}
                                {...commonSectionProps}
                                experiences={experiences}
                                setExperiences={setExperiences}
                                addExperience={addExperience}
                                removeExperience={removeExperience}
                              />
                            );
                          case 'education':
                            return (
                              <EducationSection
                                key={section.id}
                                {...commonSectionProps}
                                educations={educations}
                                setEducations={setEducations}
                                addEducation={addEducation}
                                removeEducation={removeEducation}
                              />
                            );
                          case 'skills':
                            return (
                              <SkillsSection
                                key={section.id}
                                {...commonSectionProps}
                                skills={skills}
                                setSkills={setSkills}
                                addSkill={addSkill}
                                removeSkill={removeSkill}
                              />
                            );
                          case 'languages':
                            return (
                              <LanguagesSection
                                key={section.id}
                                {...commonSectionProps}
                                languages={languages}
                                setLanguages={setLanguages}
                                addLanguage={addLanguage}
                                removeLanguage={removeLanguage}
                              />
                            );
                          default:
                            return null;
                        }
                      })();

                      // Gestion des différentes largeurs avec redimensionnement automatique
                      let widthClass = '';
                      if (isHorizontalLayout && layerSections.length > 1) {
                        // Formation et Langues prennent toujours exactement la moitié
                        if (section.id === 'education' || section.id === 'languages') {
                          widthClass = 'w-1/2 flex-shrink-0';
                        } else {
                          // Les autres sections prennent l'espace restant
                          widthClass = 'flex-1';
                        }
                      } else {
                        // En layout vertical, largeur complète
                        widthClass = 'w-full';
                      }

                      return (
                        <div
                          key={section.id}
                          className={`${widthClass} ${isDragging && activeSection !== section.id ? 'pointer-events-none' : ''} ${isHorizontalLayout ? 'border border-gray-200 rounded-md p-2 hover:border-violet-300 transition-colors relative' : ''
                            }`}
                          style={{
                            minHeight: isHorizontalLayout ? '120px' : '60px',
                            height: isHorizontalLayout ? '100%' : 'auto',
                            display: isHorizontalLayout ? 'flex' : 'block',
                            flexDirection: isHorizontalLayout ? 'column' : undefined,
                            transform: isDragging && activeSection === section.id ? 'none' : undefined,
                            position: isDragging && activeSection === section.id ? 'static' : undefined
                          }}
                          onMouseEnter={() => setHoveredSection(section.id)}
                          onMouseLeave={() => setHoveredSection(null)}
                        >
                          <div style={{ flex: 1 }}>
                            {sectionComponent}
                          </div>

                          {/* Contour gris pour montrer les dimensions au hover */}
                          {hoveredSection === section.id && (
                            <div className="absolute inset-0 border-2 border-gray-500 rounded-md pointer-events-none"></div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Rectangle gris vide pour montrer l'espace disponible quand une seule section */}
                    {isHorizontalLayout && layerSections.length === 1 && hoveredSection && layerSections.some(s => s.id === hoveredSection) && (
                      <div className="w-1/2 border border-dashed border-gray-300 rounded-md bg-gray-50 opacity-40 flex items-center justify-center text-gray-400 text-xs" style={{ minHeight: '120px' }}>
                        Espace disponible
                      </div>
                    )}
                    
                    {/* Zone de drop au milieu pour insérer dans le layer - seulement si 2+ sections */}
                    {isHorizontalLayout && isDragging && hoveredLayer === layer && layerSections.length >= 2 && (
                      <DropZone
                        id={`drop-zone-layer-${layer}-middle`}
                        className="absolute left-1/2 top-1/2 w-20 h-8 -ml-10 -mt-4 bg-violet-200 opacity-80 border-2 border-dashed border-violet-500 rounded-md flex items-center justify-center"
                        label="Insérer"
                      />
                    )}
                  </div>
                );
              }).reduce((acc, layerElement, index, array) => {
                acc.push(layerElement);
                // Ajouter une zone de drop entre chaque layer (sauf après le dernier)
                if (index < array.length - 1) {
                  acc.push(
                    <InterLayerDropZone key={`inter-${index}`} layerIndex={index + 1} />
                  );
                }
                return acc;
              }, [] as React.ReactNode[]);
            })()}
          </div>
        </SortableContext>

        <DragOverlay>
          <DragOverlayContent />
        </DragOverlay>
      </DndContext>
    </div>
  );
};