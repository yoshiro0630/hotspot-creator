import React, { useRef } from 'react';
import type { Hotspot } from '../types/hotspot';
import DraggableHotspot from './DraggableHotspot';

interface HotspotOverlayProps {
  hotspots: Hotspot[];
  videoWidth: number;
  videoHeight: number;
  currentTime: number;
  isEditMode: boolean;
  selectedHotspot: string | null;
  onHotspotClick: (id: string) => void;
  onHotspotUpdate: (hotspot: Hotspot) => void;
  onHotspotSelect: (id: string | null) => void;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  scale: number;
}

const HotspotOverlay: React.FC<HotspotOverlayProps> = ({
  hotspots,
  videoWidth,
  videoHeight,
  currentTime,
  isEditMode,
  selectedHotspot,
  onHotspotClick,
  onHotspotUpdate,
  onHotspotSelect,
  previewMode,
  scale
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleDrag = (id: string, deltaX: number, deltaY: number) => {
    const hotspot = hotspots.find(h => h.id === id);
    if (hotspot) {
      const newX = Math.max(0, Math.min(hotspot.x + deltaX, videoWidth - hotspot.width));
      const newY = Math.max(0, Math.min(hotspot.y + deltaY, videoHeight - hotspot.height));
      
      onHotspotUpdate({
        ...hotspot,
        x: newX,
        y: newY
      });
    }
  };

  const handleResize = (id: string, width: number, height: number) => {
    const hotspot = hotspots.find(h => h.id === id);
    if (hotspot) {
      onHotspotUpdate({
        ...hotspot,
        width,
        height
      });
    }
  };

  if (!videoWidth || !videoHeight) return null;

  const activeHotspots = hotspots.filter(h => h.isActive !== false);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: videoWidth, height: videoHeight }}
    >
      {activeHotspots.map((hotspot) => {
        const isVisible = currentTime >= hotspot.startTime && currentTime <= hotspot.endTime;
        if (!isEditMode && !isVisible) return null;

        return (
          <DraggableHotspot
            key={hotspot.id}
            ref={(el) => hotspotRefs.current[hotspot.id] = el}
            hotspot={hotspot}
            isEditMode={isEditMode}
            isSelected={selectedHotspot === hotspot.id}
            videoWidth={videoWidth}
            videoHeight={videoHeight}
            onDrag={(deltaX, deltaY) => handleDrag(hotspot.id, deltaX, deltaY)}
            onResize={(width, height) => handleResize(hotspot.id, width, height)}
            onClick={() => onHotspotClick(hotspot.id)}
          />
        );
      })}
    </div>
  );
};

export default HotspotOverlay;