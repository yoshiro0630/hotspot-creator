import React, { useState } from 'react';
import { Trash2, Square, Circle } from 'lucide-react';
import type { Hotspot } from '../types/hotspot';
import CTAEditor from './CTAEditor';

interface HotspotControlsProps {
  hotspot: Hotspot;
  onUpdate: (hotspot: Hotspot) => void;
  onDelete: (id: string) => void;
  duration: number;
  hotspots: Hotspot[];
}

const HotspotControls: React.FC<HotspotControlsProps> = ({
  hotspot,
  onUpdate,
  onDelete,
  duration,
  hotspots,
}) => {
  const [activeTab, setActiveTab] = useState<'style' | 'timing' | 'actions'>('style');

  const formatTimeInput = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseTimeInput = (value: string): number | null => {
    const [minutes, seconds] = value.split(':').map(Number);
    if (isNaN(minutes) || isNaN(seconds)) return null;
    return (minutes * 60) + seconds;
  };

  const handleTimeChange = (type: 'start' | 'end', value: string) => {
    const time = parseTimeInput(value);
    if (time === null) return;

    if (type === 'start' && time < hotspot.endTime) {
      onUpdate({
        ...hotspot,
        startTime: Math.max(0, time),
      });
    } else if (type === 'end' && time > hotspot.startTime) {
      onUpdate({
        ...hotspot,
        endTime: Math.min(duration, time),
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="space-y-2 flex-1 mr-4">
          <h3 className="text-lg font-semibold text-gray-800">Hotspot Settings</h3>
          <input
            type="text"
            value={hotspot.name}
            onChange={(e) => onUpdate({ ...hotspot, name: e.target.value })}
            className="w-full px-2 py-1 text-sm border rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Enter hotspot name"
          />
        </div>
        <button
          onClick={() => onDelete(hotspot.id)}
          className="text-red-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
          title="Delete Hotspot"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex">
          {(['style', 'timing', 'actions'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 space-y-4">
        {activeTab === 'style' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shape</label>
              <div className="flex gap-3">
                <button
                  onClick={() => onUpdate({ ...hotspot, shape: 'rectangle' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border ${
                    hotspot.shape === 'rectangle'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Square size={16} />
                  <span>Rectangle</span>
                </button>
                <button
                  onClick={() => onUpdate({ ...hotspot, shape: 'circle' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md border ${
                    hotspot.shape === 'circle'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Circle size={16} />
                  <span>Circle</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Background</label>
                  <input
                    type="color"
                    value={hotspot.style.backgroundColor}
                    onChange={(e) => onUpdate({
                      ...hotspot,
                      style: { ...hotspot.style, backgroundColor: e.target.value }
                    })}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Border</label>
                  <input
                    type="color"
                    value={hotspot.style.borderColor}
                    onChange={(e) => onUpdate({
                      ...hotspot,
                      style: { ...hotspot.style, borderColor: e.target.value }
                    })}
                    className="w-full h-8 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opacity: {Math.round((hotspot.opacity || 1) * 100)}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={(hotspot.opacity || 1) * 100}
                onChange={(e) => onUpdate({
                  ...hotspot,
                  opacity: parseInt(e.target.value) / 100
                })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Width: {hotspot.style.borderWidth}px
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={hotspot.style.borderWidth}
                onChange={(e) => onUpdate({
                  ...hotspot,
                  style: { ...hotspot.style, borderWidth: parseInt(e.target.value) }
                })}
                className="w-full"
              />
            </div>
          </>
        )}

        {activeTab === 'timing' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="text"
                value={formatTimeInput(hotspot.startTime)}
                onChange={(e) => handleTimeChange('start', e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="00:00"
                pattern="[0-9]{2}:[0-9]{2}"
              />
              <p className="mt-1 text-xs text-gray-500">Format: MM:SS</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="text"
                value={formatTimeInput(hotspot.endTime)}
                onChange={(e) => handleTimeChange('end', e.target.value)}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="00:00"
                pattern="[0-9]{2}:[0-9]{2}"
              />
              <p className="mt-1 text-xs text-gray-500">Format: MM:SS</p>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-500">
                Video Duration: {formatTimeInput(duration)}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <CTAEditor
            ctas={hotspot.ctas}
            onUpdate={(ctas) => onUpdate({ ...hotspot, ctas })}
          />
        )}
      </div>
    </div>
  );
};

export default HotspotControls;