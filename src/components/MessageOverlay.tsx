import React from 'react';
import { X } from 'lucide-react';

interface MessageOverlayProps {
  message: string;
  onClose: () => void;
}

const MessageOverlay: React.FC<MessageOverlayProps> = ({ message, onClose }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium">Message</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

export default MessageOverlay;