import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  position?: 'left' | 'right';
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  children,
  className = "",
  position
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isDragging ? 'opacity-50' : ''} ${className}`}
    >
      {/* Poignée de drag positionnée selon l'alignement */}
      <div
        {...attributes}
        {...listeners}
        className={`absolute top-0 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-white/80 rounded-md shadow-sm ${
          position === 'right' ? 'right-0' : 'left-0'
        }`}
        title={`Déplacer la section ${title}`}
      >
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>
      
      {/* Contenu de la section */}
      <div className={position === 'right' ? 'pr-2' : 'pl-2'}>
        {children}
      </div>
    </div>
  );
};