import React, { useCallback } from 'react';
import type { Hotspot } from '../types/hotspot';

interface HotspotTimelineProps {
  duration: number;
  currentTime: number;
  hotspots: Hotspot[];
  selectedHotspot: string | null;
  onUpdateHotspot: (hotspot: Hotspot) => void;
  isEditMode: boolean;
}

const HotspotTimeline: React.FC<HotspotTimelineProps> = ({
  duration,
  currentTime,
  hotspots,
  selectedHotspot,
  onUpdateHotspot,
  isEditMode,
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMarkerDrag = useCallback((
    e: React.MouseEvent,
    hotspot: Hotspot,
    type: 'start' | 'end'
  ) => {
    if (!isEditMode) return;
    e.preventDefault();
    const timeline = e.currentTarget.parentElement;
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const startX = e.clientX;
    const initialTime = type === 'start' ? hotspot.startTime : hotspot.endTime;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const timelineWidth = rect.width;
      const pixelsPerSecond = timelineWidth / duration;
      const deltaTime = deltaX / pixelsPerSecond;
      const newTime = Math.max(0, Math.min(duration, initialTime + deltaTime));

      if (type === 'start' && newTime < hotspot.endTime) {
        onUpdateHotspot({
          ...hotspot,
          startTime: Math.max(0, newTime),
        });
      } else if (type === 'end' && newTime > hotspot.startTime) {
        onUpdateHotspot({
          ...hotspot,
          endTime: Math.min(duration, newTime),
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [duration, isEditMode, onUpdateHotspot]);

  return (
    <div className="mt-2 px-4">
      <div className="relative h-8 bg-gray-800/50 rounded">
        {/* Time markers */}
        <div className="absolute -top-6 left-0 right-0 flex justify-between text-xs text-gray-500">
          <span>{formatTime(0)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Current Time Indicator */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white"
          style={{ 
            left: `${(currentTime / duration) * 100}%`,
            transition: 'left 0.1s linear'
          }}
        />

        {/* Hotspot Timing Bars */}
        {hotspots.map((hotspot) => {
          const startPercent = (hotspot.startTime / duration) * 100;
          const endPercent = (hotspot.endTime / duration) * 100;
          const width = endPercent - startPercent;

          return (
            <div
              key={hotspot.id}
              className={`absolute h-full ${
                selectedHotspot === hotspot.id
                  ? 'bg-blue-500/50'
                  : 'bg-gray-500/30'
              } transition-all duration-200`}
              style={{
                left: `${startPercent}%`,
                width: `${width}%`,
              }}
            >
              {isEditMode && selectedHotspot === hotspot.id && (
                <>
                  {/* Start Time Handle */}
                  <div
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded cursor-ew-resize hover:bg-blue-200 transition-colors"
                    onMouseDown={(e) => handleMarkerDrag(e, hotspot, 'start')}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black/75 text-white px-1.5 py-0.5 rounded">
                      {formatTime(hotspot.startTime)}
                    </div>
                  </div>
                  {/* End Time Handle */}
                  <div
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-6 bg-white rounded cursor-ew-resize hover:bg-blue-200 transition-colors"
                    onMouseDown={(e) => handleMarkerDrag(e, hotspot, 'end')}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-black/75 text-white px-1.5 py-0.5 rounded">
                      {formatTime(hotspot.endTime)}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HotspotTimeline;