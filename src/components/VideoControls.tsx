import React from 'react';
import { Play, Pause, Plus, Check, Edit3 } from 'lucide-react';
import VideoProgress from './VideoProgress';

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentTime: number;
  duration: number;
  showHotspots: boolean;
  setShowHotspots: (show: boolean) => void;
  isCreatingHotspot: boolean;
  setIsCreatingHotspot: (creating: boolean) => void;
  onSaveHotspots: () => void;
  onEditHotspots: () => void;
  hasHotspots: boolean;
  isEditMode: boolean;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  videoRef,
  isPlaying,
  setIsPlaying,
  currentTime,
  duration,
  showHotspots,
  setShowHotspots,
  isCreatingHotspot,
  setIsCreatingHotspot,
  onSaveHotspots,
  onEditHotspots,
  hasHotspots,
  isEditMode,
}) => {
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/40 p-4 rounded-b-lg">
      <VideoProgress
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
      />
      
      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={togglePlay}
          className="text-white hover:text-blue-400 transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        <div className="flex-1" />

        {isEditMode ? (
          <div className="flex items-center gap-3">
            <div className="text-sm text-white/90">
              {isCreatingHotspot ? 'Click on video to add hotspot' : 'Edit mode'}
            </div>
            
            <button
              onClick={() => setIsCreatingHotspot(!isCreatingHotspot)}
              className={`p-1.5 rounded-full transition-colors ${
                isCreatingHotspot 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'text-white hover:bg-white/10'
              }`}
              title={isCreatingHotspot ? 'Cancel Adding Hotspot' : 'Add Hotspot'}
            >
              <Plus size={20} />
            </button>

            <button
              onClick={onSaveHotspots}
              className="p-1.5 rounded-full text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              title="Save Changes"
            >
              <Check size={20} />
              <span className="text-sm">Save Changes</span>
            </button>
          </div>
        ) : (
          hasHotspots && (
            <button
              onClick={onEditHotspots}
              className="p-1.5 rounded-full text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              title="Edit Hotspots"
            >
              <Edit3 size={20} />
              <span className="text-sm">Edit Hotspots</span>
            </button>
          )
        )}

        {!hasHotspots && !isEditMode && (
          <button
            onClick={onEditHotspots}
            className="p-1.5 rounded-full text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            title="Add Hotspots"
          >
            <Plus size={20} />
            <span className="text-sm">Add Hotspots</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoControls;