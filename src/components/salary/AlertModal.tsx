import React from 'react';
import { X, AlertCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-start">
          {/* Red Alert Section */}
          <div className="bg-red-600 flex items-center justify-center p-4 rounded-tl-lg rounded-bl-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          
          {/* Message Section */}
          <div className="flex-1 p-4 flex items-center justify-between">
            <p className="text-white text-sm pr-8">{message}</p>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 ml-4 flex-shrink-0"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

