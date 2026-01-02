import React, { useState } from 'react';
import { MessageSquare, Info, X } from 'lucide-react';
import { Button } from '../Button';

interface VatFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const VatFeedbackModal: React.FC<VatFeedbackModalProps> = ({ isOpen, onClose }) => {
    const [feedback, setFeedback] = useState('');
    const maxChars = 5000;

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (feedback.trim()) {
            console.log('Feedback submitted:', feedback);
            // Here you would typically call an API
            alert('Thank you for your feedback!');
            setFeedback('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[800px] overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F1F5F9] rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-[#2C3E50]" />
                        </div>
                        <h1 className="text-[24px] md:text-[28px] font-bold text-[#2C3E50]">
                            What do you think of the VAT reporting?
                        </h1>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                    {/* Description */}
                    <div className="space-y-4">
                        <p className="text-[16px] text-[#4A5568] leading-relaxed">
                            Is there anything you feel is missing or would like to work differently?
                            Please describe as detailed as possible so we can make the best use of your feedback.
                            Please do not provide any personal information.
                        </p>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-[#F7FAFC] border-l-4 border-[#CBD5E0] p-4 flex gap-3">
                        <Info className="w-5 h-5 text-[#7F8C8D] shrink-0 mt-0.5" />
                        <p className="text-[14px] italic text-[#7F8C8D]">
                            We unfortunately cannot respond to all submitted feedback.
                            For assistance or inquiries, please contact <strong>SFMS support</strong>.
                        </p>
                    </div>

                    {/* Feedback Input */}
                    <div className="space-y-3">
                        <label className="text-[16px] font-bold text-[#2C3E50] flex items-center gap-2">
                            Your feedback <span className="text-gray-400">↓</span>
                        </label>
                        <div className="relative">
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value.slice(0, maxChars))}
                                className="w-full h-[200px] p-4 bg-white border-2 border-[#CBD5E0] rounded-xl text-[16px] focus:outline-none focus:border-[#3498DB] focus:ring-4 focus:ring-[#3498DB]/10 transition-all placeholder:text-gray-400"
                                placeholder="Describe what you like, what could be improved, or any features you'd like to see..."
                            />
                            <div className="absolute bottom-4 right-4 text-[12px] font-medium text-gray-400">
                                {feedback.length}/{maxChars}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 md:p-8 bg-gray-50 flex flex-col md:flex-row items-center justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-7 py-3 text-[15px] font-semibold text-[#4A5568] bg-white border border-[#CBD5E0] rounded-lg hover:bg-[#E2E8F0] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!feedback.trim()}
                        className="w-full md:w-auto px-8 py-3 text-[15px] font-semibold text-white bg-[#3498DB] rounded-lg hover:bg-[#2980B9] shadow-lg shadow-[#3498DB]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send feedback
                    </button>
                </div>
            </div>
        </div>
    );
};
