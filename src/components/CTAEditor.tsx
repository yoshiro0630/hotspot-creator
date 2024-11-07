import React from 'react';
import { Link, MessageCircle, Trash2 } from 'lucide-react';
import type { CTA } from '../types/hotspot';

interface CTAEditorProps {
  ctas: CTA[];
  onUpdate: (ctas: CTA[]) => void;
}

const CTAEditor: React.FC<CTAEditorProps> = ({ ctas, onUpdate }) => {
  const addCTA = (type: 'url' | 'message') => {
    const defaultLabels = {
      url: 'Visit Link',
      message: 'Show Info'
    };

    const newCTA: CTA = {
      type,
      value: type === 'url' ? 'https://' : 'Enter your message here',
      label: defaultLabels[type],
      pauseDuration: '0'
    };
    onUpdate([...ctas, newCTA]);
  };

  const updateCTA = (index: number, updates: Partial<CTA>) => {
    const updatedCTAs = ctas.map((cta, i) => 
      i === index ? { ...cta, ...updates } : cta
    );
    onUpdate(updatedCTAs);
  };

  const deleteCTA = (index: number) => {
    onUpdate(ctas.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-700">Call-to-Action</h4>
        {ctas.length === 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => addCTA('url')}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="Add URL Link"
            >
              <Link size={16} />
              <span className="text-sm">Link</span>
            </button>
            <button
              onClick={() => addCTA('message')}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              title="Add Message"
            >
              <MessageCircle size={16} />
              <span className="text-sm">Message</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {ctas.map((cta, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {cta.type === 'url' && <Link size={16} className="text-blue-600" />}
                {cta.type === 'message' && <MessageCircle size={16} className="text-green-600" />}
                <span className="text-sm font-medium">
                  {cta.type === 'url' ? 'URL Link' : 'Message'}
                </span>
              </div>
              <button
                onClick={() => deleteCTA(index)}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Button Label</label>
                <input
                  type="text"
                  value={cta.label || ''}
                  onChange={(e) => updateCTA(index, { label: e.target.value })}
                  placeholder="Enter button label"
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  {cta.type === 'url' ? 'URL' : 'Message'}
                </label>
                {cta.type === 'message' ? (
                  <textarea
                    value={cta.value}
                    onChange={(e) => updateCTA(index, { value: e.target.value })}
                    placeholder="Enter message"
                    rows={3}
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                ) : (
                  <input
                    type="url"
                    value={cta.value}
                    onChange={(e) => updateCTA(index, { value: e.target.value })}
                    placeholder="https://"
                    className="w-full px-2 py-1 text-sm border rounded"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Auto-Pause Duration</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="60"
                    value={cta.pauseDuration || '0'}
                    onChange={(e) => updateCTA(index, { pauseDuration: e.target.value })}
                    className="w-24 px-2 py-1 text-sm border rounded"
                  />
                  <span className="text-sm text-gray-500">seconds</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Set to 0 to disable auto-pause
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTAEditor;