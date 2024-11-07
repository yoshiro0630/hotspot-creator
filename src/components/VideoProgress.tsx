import React, { useState, useRef, useCallback } from 'react';

interface VideoProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export default function VideoProgress({ currentTime, duration, onSeek }: VideoProgressProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePosition = useCallback((e: React.MouseEvent) => {
    if (!progressRef.current) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, position));
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const position = calculatePosition(e);
    setHoverPosition(position);
    if (isDragging) {
      onSeek(position * duration);
    }
  }, [isDragging, duration, calculatePosition, onSeek]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const position = calculatePosition(e);
    onSeek(position * duration);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
    setIsDragging(false);
  };

  const progress = (currentTime / duration) * 100;
  const hoverTime = hoverPosition !== null ? duration * hoverPosition : null;

  return (
    <div className="relative">
      {/* Time Preview */}
      {hoverPosition !== null && (
        <div 
          className="absolute bottom-full mb-2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded"
          style={{ left: `${hoverPosition * 100}%` }}
        >
          {formatTime(hoverTime || 0)}
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Time Display */}
        <div className="text-xs text-white/90 tabular-nums">
          {formatTime(currentTime)}
        </div>

        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="flex-1 h-1.5 bg-gray-600/50 rounded-full overflow-hidden cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="h-full bg-white transition-all relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transform scale-0 hover:scale-100 transition-transform" />
          </div>
        </div>

        {/* Duration */}
        <div className="text-xs text-white/90 tabular-nums">
          {formatTime(duration)}
        </div>
      </div>
    </div>
  );
}