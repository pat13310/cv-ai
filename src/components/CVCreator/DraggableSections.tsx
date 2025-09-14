import React from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDroppable,
  rectIntersection,
  type CollisionDetection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { RotateCcw, Move, Maximize2, Minimize2 } from "lucide-react";
import { useCVSections } from "../../hooks/useCVSections";
import {
  NameSection,
  ProfileSection,
  ContactSection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  SectionWrapper,
} from "./sections";
import type {
  CVContent,
  CVExperience,
  CVSkill,
  CVLanguage,
  CVEducation,
  SectionConfig,
} from "./types";

/* ---------------- Helpers métier ---------------- */

function swapInSameLayer(
  sections: SectionConfig[],
  idA: string,
  idB: string
): SectionConfig[] {
  const a = sections.find((s) => s.id === idA);
  const b = sections.find((s) => s.id === idB);
  if (!a || !b || a.layer !== b.layer) return sections;

  return sections.map((s) =>
    s.id === a.id ? { ...s, order: b.order } : s.id === b.id ? { ...s, order: a.order } : s
  );
}

function moveToLayer(
  sections: SectionConfig[],
  id: string,
  targetLayer: number
): SectionConfig[] {
  const active = sections.find((s) => s.id === id);
  if (!active) return sections;

  const target = sections.filter((s) => s.layer === targetLayer && s.id !== id);

  if (target.length === 0) {
    return sections.map((s) =>
      s.id === id ? { ...s, layer: targetLayer, order: 0, width: "full" } : s
    );
  }

  if (target.length === 1) {
    return sections.map((s) => {
      if (s.id === id) return { ...s, layer: targetLayer, order: 1, width: "half" };
      if (s.id === target[0].id) return { ...s, order: 0, width: "half" };
      return s;
    });
  }

  return sections; // layer plein
}

/* --------- Collision : priorité aux sections --------- */

const preferSectionsCollision: CollisionDetection = (args) => {
  const collisions = rectIntersection(args);
  const onlySections = collisions.filter((c) => {
    const id = String(c.id);
    return !id.startsWith("layer-") && !id.startsWith("inter-layer-");
  });
  return onlySections.length ? onlySections : collisions;
};

/* ---------------- Containers droppables ---------------- */

const LayerContainer: React.FC<{
  layer: number;
  isDragging: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ layer, isDragging, disabled = false, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `layer-${layer}`, disabled });

  return (
    <div
      ref={setNodeRef}
      className={`
        group relative w-full rounded-lg p-2 transition-all duration-200
        ${isDragging && !disabled && isOver
          ? "border-2 border-green-400 border-dashed bg-green-50"
          : isDragging
            ? "border border-gray-200"
            : "hover:border-2 hover:border-violet-500 hover:border-dashed"
        }
      `}
      style={{ minHeight: "140px" }}
    >
      {children}
    </div>
  );
};

const InterLayerDropZone: React.FC<{ index: number; isDragging: boolean }> = ({
  index,
  isDragging,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: `inter-layer-${index}` });

  return (
    <div
      ref={setNodeRef}
      className={`
        h-2 w-full my-1 transition-all duration-200 rounded
        ${isDragging ? "opacity-100" : "opacity-0"}
        ${isOver ? "bg-violet-400 scale-y-150" : "bg-gray-300"}
      `}
    />
  );
};

/* ---------------- SectionDroppable ---------------- */

const SectionDroppable: React.FC<{
  section: SectionConfig;
  isDragging: boolean;
  activeSection: string | null;
  children: React.ReactNode;
  forceHalf?: boolean;
  onContract?: (id: string) => void;
}> = ({ section, isDragging, activeSection, children, forceHalf = false, onContract }) => {
  const { setNodeRef, isOver } = useDroppable({ id: section.id });

  const widthClass = forceHalf || section.width === "half" ? "w-1/2" : "w-full";

  return (
    <div
      ref={setNodeRef}
      className={`
        ${widthClass}
        relative rounded-md p-2 transition-colors border
        ${isOver ? "border-violet-500 bg-violet-50" : "border-gray-200"}
      `}
      style={{
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        opacity: isDragging && activeSection === section.id ? 0 : 1,
      }}
    >
      {children}

      {/* Bouton Contract si full */}
      {section.width === "full" && onContract && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onContract(section.id);
          }}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
          title="Revenir en deux colonnes"
        >
          <Minimize2 className="w-4 h-4 text-gray-500 hover:text-violet-600" />
        </button>
      )}
    </div>
  );
};

/* ---------------- EmptySlot ---------------- */

const EmptySlot: React.FC<{ half?: boolean; onExpand?: () => void }> = ({
  half = false,
  onExpand,
}) => {
  return (
    <div
      className={`
        ${half ? "w-1/2" : "w-full"}
        min-h-[120px] rounded-md border-2 border-dashed border-gray-300
        bg-gray-50 flex items-center justify-center
        text-gray-400 text-xs italic relative
      `}
    >
      Emplacement vide
      {onExpand && (
        <button
          onClick={onExpand}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"

          title="Étendre en pleine largeur"
        >
          <Maximize2 className="w-4 h-4 text-gray-500 hover:text-violet-600" />
        </button>
      )}
    </div>
  );
};

/* ---------------- Props ---------------- */

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
  nameAlignment: "left" | "center" | "right";
}

/* ---------------- Composant principal ---------------- */

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
  nameAlignment,
}) => {
  const { sections, setSectionsOrder, cleanupLayers, expandSection, contractSection } = useCVSections();
  const [isDragging, setIsDragging] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    setActiveSection(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setActiveSection(null);
    if (!over) return;

    let next: SectionConfig[] = [];

    if (typeof over.id === "string" && over.id.startsWith("inter-layer-")) {
      const idx = parseInt(over.id.replace("inter-layer-", ""), 10);
      next = sections.map((s) =>
        s.id === active.id ? { ...s, layer: idx + 1, order: 0, width: "full" } : s
      );
    } else if (typeof over.id === "string" && over.id.startsWith("layer-")) {
      const targetLayer = parseInt(over.id.replace("layer-", ""), 10);
      const a = sections.find((s) => s.id === active.id);
      const layerSections = sections.filter((s) => s.layer === targetLayer);

      if (a && a.layer === targetLayer && layerSections.length === 2) {
        const other = layerSections.find((s) => s.id !== a.id)!;
        next = sections.map((s) =>
          s.id === a.id ? { ...s, order: other.order } : s.id === other.id ? { ...s, order: a.order } : s
        );
      } else {
        next = moveToLayer(sections, active.id as string, targetLayer);
      }
    } else if (active.id !== over.id) {
      const a = sections.find((s) => s.id === active.id);
      const b = sections.find((s) => s.id === over.id);
      if (a && b) {
        next =
          a.layer === b.layer
            ? swapInSameLayer(sections, a.id, b.id)
            : moveToLayer(sections, a.id, b.layer);
      }
    }

    if (next.length > 0) {
      setSectionsOrder(cleanupLayers(next));
    }
  };

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

  const DragOverlayContent = () => {
    if (!activeSection) return null;
    const section = sections.find((s) => s.id === activeSection);
    if (!section) return null;
    return (
      <div
        className="bg-white border-2 border-violet-500 rounded-lg p-3 shadow-lg flex items-center gap-2 flex-1"
        style={{ minHeight: "120px" }}
      >
        <Move className="w-4 h-4 text-violet-600" />
        <span className="font-medium text-gray-800 text-sm whitespace-nowrap">
          {section.name}
        </span>
      </div>
    );
  };

  const visible = sections.filter((s) => s.visible);
  const layersMap = new Map<number, { capacity: number; sections: SectionConfig[] }>();

  visible.forEach((s) => {
    const key = s.layer ?? 1;
    if (!layersMap.has(key)) {
      layersMap.set(key, { capacity: 2, sections: [] }); // par défaut 2 slots
    }
    layersMap.get(key)!.sections.push(s);
  });

  // déduction automatique de la capacité
  layersMap.forEach((entry) => {
    if (entry.sections.some((s) => s.width === "full")) {
      entry.capacity = 1;
    }
  });

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setSectionsOrder(cleanupLayers(sections))}
          className="flex items-center gap-1 px-2 py-0 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-all duration-200"
          title="Réinitialiser l'ordre des sections"
        >
          <RotateCcw className="w-3 h-3" />
          Réinitialiser l'ordre
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={preferSectionsCollision}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-1">
          {Array.from(layersMap.entries())
            .sort(([a], [b]) => a - b)
            .map(([layer, { capacity, sections: layerSections }], index, arr) => {
              const sorted = [...layerSections].sort((a, b) => a.order - b.order);

              return (
                <React.Fragment key={layer}>
                  <LayerContainer
                    layer={layer}
                    isDragging={isDragging}
                    disabled={sorted.length >= capacity}
                  >
                    <SortableContext items={sorted.map((s) => s.id)} strategy={rectSortingStrategy}>
                      <div className={capacity === 2 ? "flex gap-3 items-stretch" : "flex"}>
                        {sorted.map((section) => {
                          const content = (() => {
                            switch (section.id) {
                              case "name":
                                return <NameSection {...commonSectionProps} nameAlignment={nameAlignment} />;
                              case "profile":
                                return <ProfileSection {...commonSectionProps} />;
                              case "contact":
                                return <ContactSection {...commonSectionProps} />;
                              case "experience":
                                return (
                                  <ExperienceSection
                                    {...commonSectionProps}
                                    experiences={experiences}
                                    setExperiences={setExperiences}
                                    addExperience={addExperience}
                                    removeExperience={removeExperience}
                                  />
                                );
                              case "education":
                                return (
                                  <EducationSection
                                    {...commonSectionProps}
                                    educations={educations}
                                    setEducations={setEducations}
                                    addEducation={addEducation}
                                    removeEducation={removeEducation}
                                  />
                                );
                              case "skills":
                                return (
                                  <SkillsSection
                                    {...commonSectionProps}
                                    skills={skills}
                                    setSkills={setSkills}
                                    addSkill={addSkill}
                                    removeSkill={removeSkill}
                                  />
                                );
                              case "languages":
                                return (
                                  <LanguagesSection
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

                          return (
                            <SectionDroppable
                              key={section.id}
                              section={section}
                              isDragging={isDragging}
                              activeSection={activeSection}
                              forceHalf={capacity === 2 && sorted.length === 1}
                              onContract={contractSection}
                            >
                              <SectionWrapper
                                id={section.id}
                                title={section.name}
                                position={section.order === 0 ? "left" : "right"}
                              >
                                {content}
                              </SectionWrapper>
                            </SectionDroppable>
                          );
                        })}

                        {/* slots vides */}
                        {capacity === 2 && sorted.length === 0 && <EmptySlot />}
                        {capacity === 2 && sorted.length === 1 && (
                          <EmptySlot half onExpand={() => expandSection(sorted[0].id)} />
                        )}
                        {capacity === 1 && sorted.length === 0 && <EmptySlot />}
                      </div>
                    </SortableContext>
                  </LayerContainer>

                  {index < arr.length - 1 && (
                    <InterLayerDropZone key={`inter-${index}`} index={index + 1} isDragging={isDragging} />
                  )}
                </React.Fragment>
              );
            })}
        </div>

        <DragOverlay>
          <DragOverlayContent />
        </DragOverlay>
      </DndContext>
    </div>
  );
};
