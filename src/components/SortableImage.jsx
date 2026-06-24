import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';

export const SortableImage = ({ id, url, index, uploadOrder, onRemove }) => {
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
      className={`image-item ${isDragging ? 'dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <img src={url} alt={`Upload ${index}`} />
      <button 
        className="remove-btn" 
        onClick={(e) => {
          e.stopPropagation(); // prevent drag start
          // Need to manually call onRemove without triggering dnd
        }}
        onPointerDown={(e) => {
           e.stopPropagation(); // prevent dnd-kit taking over pointer down
           onRemove(id);
        }}
      >
        <X size={16} />
      </button>
      <div className="order-badge">#{uploadOrder}</div>
    </div>
  );
};
