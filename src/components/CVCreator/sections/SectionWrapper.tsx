import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  children,
  className = ""
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
      {/* Poignée de drag */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 p-2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 bg-white/80 rounded-md shadow-sm"
        title={`Déplacer la section ${title}`}
      >
        <GripVertical className="w-4 h-4 text-gray-500" />
      </div>
      
      {/* Contenu de la section */}
      <div className="pl-2">
        {children}
      </div>
    </div>
  );
};