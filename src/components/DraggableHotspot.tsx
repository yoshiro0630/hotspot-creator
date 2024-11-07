import React, { forwardRef, useRef, useEffect, useState } from 'react';
import type { Hotspot } from '../types/hotspot';
import { Link, MessageSquare, Plus } from 'lucide-react';

interface DraggableHotspotProps {
  hotspot: Hotspot;
  isEditMode: boolean;
  isSelected: boolean;
  videoWidth: number;
  videoHeight: number;
  onDrag: (deltaX: number, deltaY: number) => void;
  onResize: (width: number, height: number) => void;
  onClick: () => void;
}

const DraggableHotspot = forwardRef<HTMLDivElement, DraggableHotspotProps>(({
  hotspot,
  isEditMode,
  isSelected,
  videoWidth,
  videoHeight,
  onDrag,
  onResize,
  onClick
}, ref) => {
  const [hoveredCTA, setHoveredCTA] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef<{ isDragging: boolean; startX: number; startY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.isDragging) return;
      
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      
      onDrag(deltaX, deltaY);
      
      dragRef.current.startX = e.clientX;
      dragRef.current.startY = e.clientY;
    };

    const handleMouseUp = () => {
      dragRef.current.isDragging = false;
    };

    if (isEditMode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isEditMode, onDrag]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isEditMode) return;
    e.preventDefault();
    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY
    };
  };

  const renderActionIcon = (type: string) => {
    switch (type) {
      case 'url':
        return <Link className="w-4 h-4" />;
      case 'message':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getActionLabel = (cta: { type: string; value: string; label?: string }) => {
    if (cta.label) return cta.label;
    
    switch (cta.type) {
      case 'url':
        return 'Visit Link';
      case 'message':
        return 'Show Message';
      default:
        return '';
    }
  };

  const getHotspotName = () => {
    if (hotspot.name) return hotspot.name;
    const firstCTA = hotspot.ctas?.[0];
    if (firstCTA?.label) return firstCTA.label;
    if (firstCTA?.type === 'message') return 'Message Hotspot';
    if (firstCTA?.type === 'url') return 'Link Hotspot';
    return `Hotspot ${hotspot.id.split('-')[1]}`;
  };

  const handleResize = (corner: 'nw' | 'ne' | 'sw' | 'se', e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = hotspot.width;
    const startHeight = hotspot.height;

    const handleMouseMove = (e: MouseEvent) => {
      let deltaX = e.clientX - startX;
      let deltaY = e.clientY - startY;

      switch (corner) {
        case 'nw':
          deltaX = -deltaX;
          deltaY = -deltaY;
          break;
        case 'ne':
          deltaY = -deltaY;
          break;
        case 'sw':
          deltaX = -deltaX;
          break;
        case 'se':
          break;
      }

      onResize(
        Math.max(50, Math.min(startWidth + deltaX, videoWidth - hotspot.x)),
        Math.max(50, Math.min(startHeight + deltaY, videoHeight - hotspot.y))
      );
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const hotspotStyle = {
    width: `${hotspot.width}px`,
    height: `${hotspot.height}px`,
    transform: `translate(${hotspot.x}px, ${hotspot.y}px)`,
    backgroundColor: isEditMode ? hotspot.style.backgroundColor : 'transparent',
    borderColor: hotspot.style.borderColor,
    borderWidth: `${hotspot.style.borderWidth}px`,
    borderStyle: 'solid',
    borderRadius: hotspot.shape === 'circle' ? '50%' : '4px',
    opacity: hotspot.opacity || 1,
    pointerEvents: 'auto',
    cursor: isEditMode ? 'move' : 'pointer',
    transition: 'all 0.2s ease-in-out'
  };

  return (
    <div
      ref={ref}
      className="absolute flex items-center justify-center"
      style={hotspotStyle}
      onMouseDown={handleMouseDown}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
          <div className="bg-black/75 text-white text-sm px-2 py-1 rounded">
            {getHotspotName()}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/75" />
        </div>
      )}

      {(!hotspot.ctas || hotspot.ctas.length === 0) ? (
        <div className={`rounded-full p-2 shadow-lg ${isEditMode ? 'bg-white/90' : 'bg-white'}`}>
          <Plus className="w-4 h-4" />
        </div>
      ) : (
        <div className="flex gap-2">
          {hotspot.ctas.map((cta, index) => (
            <div
              key={`${hotspot.id}-cta-${index}`}
              className="relative group"
              onMouseEnter={() => setHoveredCTA(index)}
              onMouseLeave={() => setHoveredCTA(null)}
            >
              <div className={`rounded-full p-2 shadow-lg ${isEditMode ? 'bg-white/90' : 'bg-white'}`}>
                {renderActionIcon(cta.type)}
              </div>
              {hoveredCTA === index && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
                  <div className="bg-black/75 text-white text-sm px-2 py-1 rounded">
                    {getActionLabel(cta)}
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/75" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditMode && isSelected && (
        <>
          <div
            className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full cursor-nw-resize shadow-md"
            onMouseDown={(e) => handleResize('nw', e)}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full cursor-ne-resize shadow-md"
            onMouseDown={(e) => handleResize('ne', e)}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 bg-white rounded-full cursor-sw-resize shadow-md"
            onMouseDown={(e) => handleResize('sw', e)}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full cursor-se-resize shadow-md"
            onMouseDown={(e) => handleResize('se', e)}
          />
        </>
      )}
    </div>
  );
});

DraggableHotspot.displayName = 'DraggableHotspot';

export default DraggableHotspot;