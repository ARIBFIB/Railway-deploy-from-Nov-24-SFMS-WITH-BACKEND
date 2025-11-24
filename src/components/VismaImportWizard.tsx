import React, { useState, useEffect } from 'react';
import { X, Info, FileText } from 'lucide-react';
import { Button } from './Button';

interface VismaImportWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
}

export const VismaImportWizard: React.FC<VismaImportWizardProps> = ({ isOpen, onClose, onNext }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onNext();
    }
  };

  const handleCancel = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    onClose();
  };

  const steps = [
    { id: 1, title: 'Import schedule', description: 'Import working hours schedules from Visma' },
    { id: 2, title: 'Import staff', description: 'Import staff information from Visma' },
    { id: 3, title: 'Summation', description: 'Review and complete the import process' }
  ];

  // Prevent body scrolling and hide browser UI when modal is open
  useEffect(() => {
    if (isOpen) {
      const bodyElement = window.document.querySelector('body');
      const htmlElement = window.document.querySelector('html');
      
      if (bodyElement) {
        bodyElement.style.overflow = 'hidden';
        bodyElement.style.margin = '0';
        bodyElement.style.padding = '0';
      }
      
      if (htmlElement) {
        htmlElement.style.overflow = 'hidden';
        htmlElement.style.margin = '0';
        htmlElement.style.padding = '0';
      }
      
      return () => {
        if (bodyElement) {
          bodyElement.style.overflow = 'unset';
          bodyElement.style.margin = '';
          bodyElement.style.padding = '';
        }
        
        if (htmlElement) {
          htmlElement.style.overflow = 'unset';
          htmlElement.style.margin = '';
          htmlElement.style.padding = '';
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">VISMA IMPORT</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    currentStep >= step.id ? 'bg-pink-500' : 'bg-gray-400'
                  }`}>
                    {step.id}
                  </div>
                  <div className="ml-2">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-pink-500' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Information Box */}
              <div className="bg-gray-100 p-4 rounded-lg flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-green-800 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-green-800" />
                </div>
                <p className="text-gray-700 text-sm">
                  Before importing personnel from Visma, we recommend that you import schedules first so that the import works as well as possible.
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700">
                    In Visma Lön 300/600 there is a printout called Working hours schedule. Using this printout, you can import the schedules that you use for your employees. We recommend that you do this import before importing the employee information.
                  </p>
                  <p className="text-gray-700">
                    In Visma Payroll 300/600 you will find the printout under <strong>Prints and tracking - Personnel - Work time schedule</strong>. Select <strong>All</strong> and select <strong>Work time schedule</strong>, deselect <strong>Full day schedule</strong> and <strong>Print also inactive work time schedules</strong>. Then select <strong>Print to PDF file</strong> and click <strong>Print</strong> to save the file.
                  </p>
                  <p className="text-gray-700">
                    Now you can select the saved PDF file on the Choose File button and click Next.
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select PDF File
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">
                          {selectedFile ? selectedFile.name : 'No file uploaded'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <Button
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                  >
                    Select File
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700">
                    Now you can read in the personnel information from Visma Lön 300/600. For this you need the PDF printout Personnel card. You can find it in Visma Lön 300/600 under <strong>Prints and tracking - Personnel - Personnel card</strong>. Print to PDF file and Print to save the file.
                  </p>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Select PDF File
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload-staff"
                    />
                    <label
                      htmlFor="file-upload-staff"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">
                          {selectedFile ? selectedFile.name : 'No file uploaded'}
                        </span>
                      </div>
                    </label>
                  </div>
                  <Button
                    onClick={() => document.getElementById('file-upload-staff')?.click()}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                  >
                    Select File
                  </Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Summation</h3>
                <p className="text-gray-600">Review and complete the import process.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <Button
                onClick={handleBack}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleCancel}
              variant="secondary"
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Cancel
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            {currentStep < 3 && (
              <Button
                onClick={handleSkip}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Skip
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedFile}
              className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
