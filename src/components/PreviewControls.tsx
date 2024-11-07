import React from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';

interface PreviewControlsProps {
  mode: 'desktop' | 'tablet' | 'mobile';
  onModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({ mode, onModeChange }) => {
  return (
    <div className="flex justify-center gap-4 mb-4">
      <button
        onClick={() => onModeChange('desktop')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          mode === 'desktop'
            ? 'bg-blue-100 text-blue-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Desktop Preview"
      >
        <Monitor size={20} />
        <span>Desktop</span>
      </button>
      
      <button
        onClick={() => onModeChange('tablet')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          mode === 'tablet'
            ? 'bg-blue-100 text-blue-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Tablet Preview"
      >
        <Tablet size={20} />
        <span>Tablet</span>
      </button>
      
      <button
        onClick={() => onModeChange('mobile')}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          mode === 'mobile'
            ? 'bg-blue-100 text-blue-600'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Mobile Preview"
      >
        <Smartphone size={20} />
        <span>Mobile</span>
      </button>
    </div>
  );
};

export default PreviewControls;