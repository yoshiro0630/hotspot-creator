import React, { useState, useRef, useEffect } from 'react';
import type { Hotspot } from '../types/hotspot';
import HotspotOverlay from './HotspotOverlay';
import HotspotControls from './HotspotControls';
import VideoControls from './VideoControls';
import HotspotTimeline from './HotspotTimeline';
import MessageOverlay from './MessageOverlay';
import HotspotTable from './HotspotTable';

interface VideoPlayerProps {
  src: string;
  hotspots: Hotspot[];
  onHotspotsChange: (hotspots: Hotspot[]) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  hotspots = [],
  onHotspotsChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreatingHotspot, setIsCreatingHotspot] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showHotspots, setShowHotspots] = useState(true);
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [manualPause, setManualPause] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeHotspotRef = useRef<string | null>(null);
  const triggeredHotspotsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearPauseTimeout();
    };
  }, []);

  const clearPauseTimeout = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const newTime = videoRef.current.currentTime;
    setCurrentTime(newTime);

    if (!isEditMode && !manualPause) {
      const activeHotspot = hotspots.find(h => 
        h.isActive !== false && 
        newTime >= h.startTime && 
        newTime <= h.endTime &&
        !triggeredHotspotsRef.current.has(h.id)
      );

      if (activeHotspot) {
        const pauseDuration = activeHotspot.ctas?.[0]?.pauseDuration;
        
        if (pauseDuration && parseInt(pauseDuration) > 0) {
          triggeredHotspotsRef.current.add(activeHotspot.id);
          activeHotspotRef.current = activeHotspot.id;
          videoRef.current.pause();
          setIsPlaying(false);
          clearPauseTimeout();
          
          if (!manualPause) {
            pauseTimeoutRef.current = setTimeout(() => {
              if (videoRef.current && !manualPause) {
                videoRef.current.play()
                  .then(() => {
                    setIsPlaying(true);
                  })
                  .catch(console.error);
              }
            }, parseInt(pauseDuration) * 1000);
          }
        }
      }
    }
  };

  const handlePlay = async () => {
    try {
      setManualPause(false);
      clearPauseTimeout();
      
      if (videoRef.current) {
        await videoRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing video:', error);
      setIsPlaying(false);
    }
  };

  const handlePause = () => {
    clearPauseTimeout();
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      setManualPause(true);
    }
  };

  const handleHotspotClick = (hotspotId: string) => {
    if (isEditMode) {
      setSelectedHotspot(hotspotId);
      return;
    }

    const hotspot = hotspots.find(h => h.id === hotspotId);
    if (!hotspot) return;

    const messageCTA = hotspot.ctas?.find(cta => cta.type === 'message');
    const urlCTA = hotspot.ctas?.find(cta => cta.type === 'url');
    
    clearPauseTimeout();
    setManualPause(true);
    
    if (messageCTA?.value) {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
        setMessage(messageCTA.value);
      }
    } else if (urlCTA?.value) {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      window.open(urlCTA.value, '_blank');
    }
  };

  const handleHotspotUpdate = (updatedHotspot: Hotspot) => {
    const newHotspots = hotspots.map((h) =>
      h.id === updatedHotspot.id ? updatedHotspot : h
    );
    onHotspotsChange(newHotspots);
  };

  const handleHotspotDelete = (hotspotId: string) => {
    const newHotspots = hotspots.filter(h => h.id !== hotspotId);
    onHotspotsChange(newHotspots);
    setSelectedHotspot(null);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedHotspot(null);
    setIsCreatingHotspot(false);
    triggeredHotspotsRef.current.clear();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!isEditMode || !isCreatingHotspot || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}`,
      name: `Hotspot ${hotspots.length + 1}`,
      x: centerX - 25,
      y: centerY - 25,
      width: 50,
      height: 50,
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, videoRef.current?.duration || currentTime + 5),
      shape: 'circle',
      opacity: 0.8,
      isActive: true,
      ctas: [],
      style: {
        backgroundColor: '#ef4444',
        borderColor: '#ffffff',
        borderWidth: 2,
      }
    };

    onHotspotsChange([...hotspots, newHotspot]);
    setSelectedHotspot(newHotspot.id);
    setIsCreatingHotspot(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {isEditMode && (
        <HotspotTable
          hotspots={hotspots}
          selectedHotspot={selectedHotspot}
          onSelect={setSelectedHotspot}
          onDelete={handleHotspotDelete}
          onUpdate={handleHotspotUpdate}
        />
      )}
      
      <div 
        className="relative bg-black rounded-lg overflow-hidden shadow-xl aspect-video"
        ref={containerRef}
        onClick={handleOverlayClick}
      >
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onSeeked={() => {
            triggeredHotspotsRef.current.clear();
            activeHotspotRef.current = null;
          }}
        />
        
        <HotspotOverlay
          hotspots={hotspots.filter(h => h.isActive !== false)}
          videoWidth={containerDimensions.width}
          videoHeight={containerDimensions.height}
          currentTime={currentTime}
          isEditMode={isEditMode}
          selectedHotspot={selectedHotspot}
          onHotspotClick={handleHotspotClick}
          onHotspotUpdate={handleHotspotUpdate}
          onHotspotSelect={setSelectedHotspot}
          previewMode={previewMode}
          scale={1}
        />

        <VideoControls
          videoRef={videoRef}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          currentTime={currentTime}
          duration={videoRef.current?.duration || 0}
          showHotspots={showHotspots}
          setShowHotspots={setShowHotspots}
          isCreatingHotspot={isCreatingHotspot}
          setIsCreatingHotspot={setIsCreatingHotspot}
          onSaveHotspots={toggleEditMode}
          onEditHotspots={toggleEditMode}
          hasHotspots={hotspots.length > 0}
          isEditMode={isEditMode}
        />

        {message && (
          <MessageOverlay
            message={message}
            onClose={() => {
              setMessage(null);
              setManualPause(false);
              handlePlay();
            }}
          />
        )}
      </div>

      {isEditMode && (
        <div className="flex gap-4">
          <div className="flex-1">
            <HotspotTimeline
              duration={videoRef.current?.duration || 0}
              currentTime={currentTime}
              hotspots={hotspots.filter(h => h.isActive !== false)}
              selectedHotspot={selectedHotspot}
              onUpdateHotspot={handleHotspotUpdate}
              isEditMode={isEditMode}
            />
          </div>
          
          {selectedHotspot && (
            <div className="w-80">
              <HotspotControls
                hotspot={hotspots.find((h) => h.id === selectedHotspot)!}
                onUpdate={handleHotspotUpdate}
                onDelete={handleHotspotDelete}
                duration={videoRef.current?.duration || 0}
                hotspots={hotspots}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;