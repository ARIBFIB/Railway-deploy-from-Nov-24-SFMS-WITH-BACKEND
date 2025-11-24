import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (feedback: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSend
}) => {
  const [feedback, setFeedback] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Check if feedback is valid (not empty and has meaningful content)
  useEffect(() => {
    const trimmedFeedback = feedback.trim();
    setIsValid(trimmedFeedback.length > 10); // Require at least 10 characters
  }, [feedback]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSend = () => {
    if (isValid) {
      onSend(feedback);
      setFeedback('');
      onClose();
    }
  };

  const handleCancel = () => {
    setFeedback('');
    onClose();
  };

  const handleSupportClick = () => {
    // Open support in a new tab
    window.open('https://support.example.com/', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-green-700">What do you think about Type of purchase?</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">
              Is there anything missing or would you like to see done differently? Please describe it in as much detail as possible so we can use your feedback in the best possible way. Please do not provide any personal information.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Unfortunately, we are unable to respond to all submitted comments. For help or questions, please contact{' '}
              <button
                onClick={handleSupportClick}
                className="text-green-700 hover:text-green-800 underline font-medium"
              >
                support.
              </button>
              {' > >'}
            </p>
          </div>

          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your views
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your views"
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              aria-label="Feedback input"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-green-700 bg-white border-2 border-green-700 rounded-lg hover:bg-green-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!isValid}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isValid
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;

