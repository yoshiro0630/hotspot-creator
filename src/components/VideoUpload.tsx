import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import type { Hotspot } from '../types/hotspot';
import DropZone from './DropZone';

const VideoUpload: React.FC = () => {
  const [videoSrc, setVideoSrc] = useState<string>('');
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  return (
    <div className="p-4">
      {!videoSrc ? (
        <DropZone
          isDragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onFileInput={handleFileChange}
        />
      ) : (
        <VideoPlayer
          src={videoSrc}
          hotspots={hotspots}
          onHotspotsChange={setHotspots}
        />
      )}
    </div>
  );
};

export default VideoUpload;