import React, { useState, useEffect, useRef } from 'react'; // Add useRef for handling clicks outside
import { useDropzone } from 'react-dropzone';
import { Plus, Search, Filter, Eye, Download, History, FileText, Calendar, User, Tag, Upload, X } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { DocumentViewer } from '../components/DocumentViewer';
import { API_BASE_URL } from '../utils/api';
// Removed mock data imports - using real database only

// Local types (unchanged)
interface Document {
  id: string;
  foundation_id?: string;
  uploaded_by?: string;
  document_type: string;
  file_name: string;
  file_path: string;
  status: string;
  created_at: string;
  updated_at: string;
  current_version?: number;
  file_size?: number;
  mime_type?: string;
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  profiles?: { full_name?: string };
}

interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_name: string;
  created_at: string;
  profiles?: { full_name?: string };
  change_notes?: string;
  file_path?: string;
  uploaded_by?: string;
  file_size?: number;
  mime_type?: string;
}

export const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  // Removed useMockData - using real database only
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); // New state for filter menu
  const filterMenuRef = useRef<HTMLDivElement>(null); // Ref to handle clicks outside
  const [userData, setUserData] = useState<any>(null); // User data state

  // Load user data on component mount
  useEffect(() => {
    const userDataRaw = localStorage.getItem('user_data') || '{}';
    const parsedUserData = JSON.parse(userDataRaw);
    setUserData(parsedUserData);
  }, []);


  // Handle clicks outside the filter menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      // Get user data for tenant info
      const userDataRaw = localStorage.getItem('user_data') || '{}';
      const userData = JSON.parse(userDataRaw);

      // Extract foundation_id from user data - try different possible field names
      const foundationId = userData.foundationId || userData.foundation_id || userData.foundation?.id || '';

      if (!foundationId) {
        console.error('Foundation ID not found in user session');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'X-Foundation-ID': foundationId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVersionHistory = async (documentId: string) => {
    try {
      // Get user data for tenant info
      const userDataRaw = localStorage.getItem('user_data') || '{}';
      const userData = JSON.parse(userDataRaw);

      // Extract foundation_id from user data - try different possible field names
      const foundationId = userData.foundationId || userData.foundation_id || userData.foundation?.id || '';

      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/versions`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'X-Foundation-ID': foundationId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch version history');
      }

      const data = await response.json();
      setVersions(data.versions || []);
    } catch (error) {
      console.error('Error fetching version history:', error);
      setVersions([]);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false); // Close menu after selection
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleView = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    if (doc) {
      setSelectedDocument(doc);
      setShowViewer(true);
    }
  };

  const handleDownload = async (documentId: string, fileName: string, version?: number) => {
    try {
      // Get user data for tenant info
      const userDataRaw = localStorage.getItem('user_data') || '{}';
      const userData = JSON.parse(userDataRaw);

      // Extract foundation_id from user data - try different possible field names
      const foundationId = userData.foundationId || userData.foundation_id || userData.foundation?.id || '';

      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/download?purpose=download${version ? `&version=${version}` : ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'X-Foundation-ID': foundationId
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Download failed: ${response.status}`);
      }

      // Get the filename from Content-Disposition header or use the provided filename
      const contentDisposition = response.headers.get('Content-Disposition');
      let downloadFileName = fileName;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          downloadFileName = filenameMatch[1];
        }
      }

      // Ensure proper file extension
      if (!downloadFileName.includes('.')) {
        const mimeType = response.headers.get('Content-Type');
        if (mimeType) {
          const extension = mimeType.split('/')[1];
          if (extension) {
            downloadFileName = `${downloadFileName}.${extension}`;
          }
        }
      }

      // Create blob with proper MIME type
      const blob = await response.blob();
      const mimeType = response.headers.get('Content-Type') || 'application/octet-stream';

      // Ensure we have a valid blob
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }

      // Create proper blob with correct MIME type
      const properBlob = new Blob([blob], { type: mimeType });

      // Additional validation for PDF files
      if (mimeType === 'application/pdf') {
        // Check if the blob contains valid PDF data
        const arrayBuffer = await properBlob.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const header = String.fromCharCode(...uint8Array.slice(0, 4));

        if (header !== '%PDF') {
          console.warn('Downloaded file may not be a valid PDF');
        }
      }

      const url = window.URL.createObjectURL(properBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

    } catch (error) {
      console.error('Download failed:', error);

      // Handle specific download errors
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('Downloaded file is empty')) {
          errorMessage = 'The downloaded file is empty. The document may be corrupted or not properly uploaded.';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection and try again.';
        } else if (error.message.includes('Unauthorized')) {
          errorMessage = 'Access denied. Your session may have expired. Please refresh the page and try again.';
        } else if (error.message.includes('Not Found')) {
          errorMessage = 'Document not found. It may have been deleted or moved.';
        } else {
          errorMessage = error.message;
        }
      }

      alert(`Failed to download document: ${errorMessage}`);
    }
  };

  const handleViewHistory = (documentId: string) => {
    fetchVersionHistory(documentId);
    setShowHistoryModal(true);
  };

  const handleViewerDownload = () => {
    if (selectedDocument) {
      handleDownload(selectedDocument.id, selectedDocument.file_name);
    }
  };

  const handleCloseViewer = () => {
    setShowViewer(false);
    setSelectedDocument(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage and organize your foundation documents</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowUploadModal(true)}
            icon={Plus}
          >
            Upload Document
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={toggleFilterMenu}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <Filter className="w-4 h-4" />

            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-1">
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'uploaded', label: 'Uploaded' },
                    { value: 'pending_approval', label: 'Pending Approval' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusFilterChange(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${statusFilter === option.value ? 'bg-gray-100 font-medium' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {loading ? (
        <Card>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading documents...</p>
          </div>
        </Card>
      ) : filteredDocuments.length > 0 ? (
        <div className="grid gap-4">
          {filteredDocuments.map((document) => (
            <Card key={document.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-900">{document.file_name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                      {document.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span className="capitalize">{document.document_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(document.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{document.profiles?.full_name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Version {document.current_version || 1}</span>
                      {document.file_size && (
                        <span>• {formatFileSize(document.file_size)}</span>
                      )}
                    </div>
                  </div>

                  {document.approval_notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                      <strong>Approval Notes:</strong> {document.approval_notes}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={History}
                    onClick={() => handleViewHistory(document.id)}
                  >
                    History
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleView(document.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Download}
                    onClick={() => handleDownload(document.id, document.file_name)}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Document"
        size="lg"
      >
        <DocumentUploadForm
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={fetchDocuments}
          onViewDocument={(document) => {
            setSelectedDocument(document);
            setShowViewer(true);
          }}
          userData={userData}
        />
      </Modal>

      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="Document Version History"
        size="lg"
      >
        <DocumentVersionHistory
          versions={versions}
          onView={handleView}
          onDownload={handleDownload}
        />
      </Modal>

      {showViewer && selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={handleCloseViewer}
          onDownload={handleViewerDownload}
        />
      )}
    </div>
  );
};

// DocumentUploadForm and DocumentVersionHistory remain unchanged
// ... (include the unchanged DocumentUploadForm and DocumentVersionHistory components here)
const DocumentUploadForm: React.FC<{
  onClose: () => void;
  onUploadSuccess: () => void;
  onViewDocument: (document: any) => void;
  userData?: any;
}> = ({ onClose, onUploadSuccess, onViewDocument }) => {
  const [formData, setFormData] = useState({
    document_type: '',
    file: null as File | null,
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError('Invalid file type or size. Please upload a PDF, DOC, DOCX, JPG, or PNG file (max 10MB).');
        return;
      }
      if (acceptedFiles.length > 0) {
        setFormData((prev) => ({ ...prev, file: acceptedFiles[0] }));
        setError(null);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.file) {
      setError('Please select a file to upload.');
      setLoading(false);
      return;
    }

    if (!formData.document_type) {
      setError('Please enter a document type.');
      setLoading(false);
      return;
    }

    try {
      // Validate file before upload
      if (!formData.file || !formData.file.size || formData.file.size === 0) {
        setError('Invalid file: File size is 0 or undefined.');
        setLoading(false);
        return;
      }

      if (formData.file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size exceeds 10MB limit.');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append('document', formData.file); // Backend expects 'document' field
      uploadData.append('document_type', formData.document_type);
      uploadData.append('notes', formData.notes || '');
      uploadData.append('file_size', formData.file.size.toString());

      // Get user data for tenant info
      const userDataRaw = localStorage.getItem('user_data') || '{}';
      const userData = JSON.parse(userDataRaw);

      // Debug: Log user data to understand the structure
      console.log('User data from localStorage:', userData);

      // Extract foundation_id from user data - try different possible field names
      const foundationId = userData.foundationId || userData.foundation_id || userData.foundation?.id || '';

      if (!foundationId) {
        setError('Foundation ID not found in user session. Please refresh the page and try again.');
        setLoading(false);
        return;
      }

      // Always append foundation_id - it's required by the backend
      uploadData.append('foundation_id', foundationId);

      // Debug: Log upload data
      console.log('Upload data:', {
        fileName: formData.file.name,
        fileSize: formData.file.size,
        fileType: formData.file.type,
        documentType: formData.document_type,
        foundationId: userData.foundationId
      });

      // Call backend upload API
      const response = await fetch(`${API_BASE_URL}/api/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'X-Foundation-ID': userData.foundationId || ''
        },
        body: uploadData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);

        // Handle specific validation errors
        if (response.status === 400 && errorData.errors) {
          const validationErrors = errorData.errors.map((err: any) => err.message).join(', ');
          throw new Error(`Validation failed: ${validationErrors}`);
        }

        // Handle specific error messages
        if (errorData.message) {
          if (errorData.message.includes('Foundation ID is required')) {
            throw new Error('Foundation ID is missing. Please refresh the page and try again.');
          } else if (errorData.message.includes('No file uploaded')) {
            throw new Error('No file was uploaded. Please select a file and try again.');
          } else if (errorData.message.includes('Document type is required')) {
            throw new Error('Please select a document type.');
          } else if (errorData.message.includes('File Too Large')) {
            throw new Error('File size exceeds 10MB limit. Please choose a smaller file.');
          } else if (errorData.message.includes('Invalid file type')) {
            throw new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, and PNG files are allowed.');
          }
        }

        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);

      // Show the uploaded document in viewer
      if (result.document) {
        onViewDocument(result.document);
      }

      // Refresh the documents list to show the new document
      onUploadSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload document. Please try again.';
      setError(errorMessage);
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: null }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
          <input
            type="text"
            value={formData.document_type}
            onChange={(e) => setFormData((prev) => ({ ...prev, document_type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter document type (e.g., Bylaws, Articles of Association, Financial Statement, etc.)"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter a descriptive name for the document type
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Document File</label>
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'}
              hover:border-primary-400 hover:bg-primary-25 cursor-pointer`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              {isDragActive ? (
                <p className="text-sm text-gray-600">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Drag and drop your file here or{' '}
                    <span className="text-primary-600 font-medium">click to browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </p>
                </>
              )}
            </div>
          </div>

          {formData.file && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add any additional notes about this document"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Upload Document
        </Button>
      </div>
    </form>
  );
};

const DocumentVersionHistory: React.FC<{
  versions: DocumentVersion[];
  onView: (documentId: string, version?: number) => void;
  onDownload: (documentId: string, fileName: string, version?: number) => void;
}> = ({ versions, onView, onDownload }) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVersionStatus = (version: DocumentVersion, allVersions: DocumentVersion[]) => {
    const isLatest = version.version_number === Math.max(...allVersions.map(v => v.version_number));
    const isCurrent = version.version_number === Math.max(...allVersions.map(v => v.version_number));

    if (isCurrent) return 'bg-green-100 text-green-800 border-green-200';
    if (isLatest) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const sortedVersions = [...versions].sort((a, b) => b.version_number - a.version_number);

  return (
    <div className="space-y-6">
      {versions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No version history</h3>
          <p className="text-gray-500">This document has no previous versions</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            {sortedVersions.map((version, index) => (
              <div key={version.id} className="relative">
                {index < sortedVersions.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-16 bg-gray-200"></div>
                )}

                <div className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-sm ${getVersionStatus(version, versions)}`}>
                    v{version.version_number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 truncate">{version.file_name}</h4>
                        <p className="text-sm text-gray-500">
                          Uploaded {formatDate(version.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatFileSize(version.file_size)}
                        </span>
                        {version.version_number === Math.max(...versions.map(v => v.version_number)) && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    {version.change_notes && (
                      <div className="mb-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                        <p className="text-sm text-blue-800">
                          <strong>Changes:</strong> {version.change_notes}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">File Type:</span>
                        <span className="ml-1 capitalize">
                          {version.mime_type?.split('/')[1] || 'Unknown'}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Size:</span>
                        <span className="ml-1">{formatFileSize(version.file_size)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Uploaded By:</span>
                        <span className="ml-1">{version.profiles?.full_name || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Eye}
                      onClick={() => onView(version.document_id, version.version_number)}
                      className="w-full"
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={Download}
                      onClick={() => onDownload(version.document_id, version.file_name, version.version_number)}
                      className="w-full"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Version Summary</h4>
                <p className="text-sm text-gray-600">
                  {versions.length} version{versions.length !== 1 ? 's' : ''} •
                  Latest: v{Math.max(...versions.map(v => v.version_number))} •
                  First: v{Math.min(...versions.map(v => v.version_number))}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  Total Size: {formatFileSize(versions.reduce((sum, v) => sum + (v.file_size || 0), 0))}
                </p>
                <p className="text-xs text-gray-500">
                  Created: {formatDate(versions[versions.length - 1]?.created_at || '')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

