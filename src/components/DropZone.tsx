import React from 'react';
import { Upload } from 'lucide-react';

interface DropZoneProps {
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DropZone({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileInput,
}: DropZoneProps) {
  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-lg p-12 transition-all duration-200 ease-in-out ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input
        type="file"
        accept="video/mp4"
        onChange={onFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Upload video file"
      />
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-lg font-medium text-gray-700">
          Drag and drop your video here
        </p>
        <p className="mt-2 text-sm text-gray-500">or click to browse</p>
        <p className="mt-1 text-xs text-gray-400">MP4 files only, max 100MB</p>
      </div>
    </div>
  );
}