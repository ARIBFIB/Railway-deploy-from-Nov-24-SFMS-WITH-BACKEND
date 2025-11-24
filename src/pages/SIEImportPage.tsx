import React, { useEffect, useState } from 'react';
import { FileText, Upload, ChevronDown, Copy, ArrowRight, Plus, Check, Search, List } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { sieService } from '../services/sieService';

export const SIEImportPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('History');
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState('Assets');
  const [currentStep, setCurrentStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('All');
  const [imports, setImports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await sieService.getImports();
        setImports(data);
      } catch (e) {
        console.error('Failed to load SIE imports', e);
        setError('Failed to load SIE imports');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    void uploadFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    void uploadFiles(files);
  };

  const handleUndoSIE = () => {
    console.log('Undo SIE clicked');
  };

  const handleLoadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sie';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      void uploadFiles(files);
    };
    input.click();
  };

  const handleTemplates = () => {
    console.log('Templates clicked');
  };

  const handleNext = () => {
    console.log('Next clicked, selected register:', selectedRegister);
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    console.log('Previous clicked');
    setCurrentStep(1);
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
    setCurrentStep(1);
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.sie,.txt,.csv';
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      void uploadFiles(files);
    };
    input.click();
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    void uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    try {
      setLoading(true);
      setError(null);
      for (const file of files) {
        const text = await file.text();
        await sieService.createImport({
          file_name: file.name,
          file_content: text
        } as any, '');
      }
      const data = await sieService.getImports();
      setImports(data);
      setActiveTab('History');
    } catch (e) {
      console.error('Failed to upload SIE file', e);
      setError('Failed to upload SIE file');
    } finally {
      setLoading(false);
    }
  };

  const registerOptions = [
    'Select register...',
    'Assets',
    'Articles',
    'Customers',
    'Suppliers'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('SIE-import')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'SIE-import'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              SIE import
            </button>
            <button
              onClick={() => setActiveTab('Register-import')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Register-import'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              Register import
            </button>
            <button
              onClick={() => setActiveTab('History')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'History'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('File-conversion')}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'File-conversion'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              File conversion
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'SIE-import' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">IMPORT - SIE</h1>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mb-6">
                <Button
                  onClick={handleUndoSIE}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Undo SIE</span>
                </Button>
                <Button
                  onClick={handleLoadFile}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4" />
                  <span>Load file</span>
                </Button>
              </div>

              {/* Drag and Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 bg-white'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg text-gray-700 mb-2">
                    Drag and drop a SIE file here or click Load File in the top right.
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: .sie files
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Register-import' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">IMPORT - REGISTER</h1>

              {/* Progress Stepper */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {/* Step 1 */}
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep > 1 ? 'bg-green-500 text-white' : currentStep === 1 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                      {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${currentStep > 1 ? 'text-gray-500' : currentStep === 1 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                      Select register
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-0.5 bg-gray-300"></div>

                  {/* Step 2 */}
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                      2
                    </div>
                    <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                      Select file
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="w-8 h-0.5 bg-gray-300"></div>

                  {/* Step 3 */}
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 3 ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                      3
                    </div>
                    <span className={`ml-2 text-sm font-medium ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                      Link fields
                    </span>
                  </div>
                </div>
              </div>

              {/* Templates Button */}
              <div className="flex justify-end mb-6">
                <Button
                  onClick={handleTemplates}
                  variant="secondary"
                  className="flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Templates</span>
                </Button>
              </div>

              {/* Main Content */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">What do you want to import?</h2>

                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <select
                          value={selectedRegister}
                          onChange={(e) => setSelectedRegister(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {registerOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <Button
                        onClick={handleNext}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-6 py-3"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div className="max-w-2xl mx-auto">
                    {/* File Upload Area */}
                    <div
                      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragOver
                          ? 'border-green-400 bg-green-50'
                          : 'border-green-300 bg-white'
                        }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleFileDrop}
                    >
                      <div className="max-w-md mx-auto">
                        <p className="text-lg text-gray-700 mb-4">Drag and drop a file here</p>
                        <p className="text-lg text-gray-700 mb-6">Or...</p>

                        <Button
                          onClick={handleFileUpload}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 text-lg font-medium flex items-center space-x-2 mx-auto"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Select file</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Link Fields</h2>
                    <p className="text-gray-500">Link fields functionality coming soon...</p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8">
                <Button
                  onClick={handleCancel}
                  variant="secondary"
                  className="px-6 py-3"
                >
                  Cancel
                </Button>

                <div className="flex space-x-4">
                  {currentStep > 1 && (
                    <Button
                      onClick={handlePrevious}
                      variant="secondary"
                      className="px-6 py-3"
                    >
                      Previous
                    </Button>
                  )}

                  {currentStep < 3 && (
                    <Button
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === 'History' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">IMPORTS - HISTORY</h1>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="File, Date"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Filter and Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <select
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="SIE">SIE</option>
                    <option value="Register">Register</option>
                    <option value="File">File</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="0">0</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>

              {/* History Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          REGISTER
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FILE
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IMPORTED
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          UPDATED
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          EXCLUDED
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FAILED
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-200">
                          DATE
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          No import history records found
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'File-conversion' && (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">File Conversion</h2>
              <p className="text-gray-500">File conversion functionality coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
