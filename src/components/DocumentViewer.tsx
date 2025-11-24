import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Image, File } from 'lucide-react';
import { Button } from './Button';
import { API_BASE_URL } from '../utils/api';

interface DocumentViewerProps {
  document: {
    id: string;
    file_name: string;
    file_path: string;
    mime_type?: string;
    file_size?: number;
    document_type: string;
    status: string;
    created_at: string;
    uploaded_by?: string;
    profiles?: { full_name?: string };
  };
  onClose: () => void;
  onDownload: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  onDownload
}) => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isImage = document.mime_type?.startsWith('image/');
  const isPDF = document.mime_type === 'application/pdf';
  const isPlainText = document.mime_type?.startsWith('text/');
  const isOfficeDocument =
    document.mime_type === 'application/msword' ||
    document.mime_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  const supportsInlinePreview = Boolean(isImage || isPDF || isPlainText || isOfficeDocument);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let isActive = true;

    if (!supportsInlinePreview) {
      setDocumentUrl(null);
      setError(null);
      setLoading(false);
      return () => {
        isActive = false;
      };
    }

    const fetchDocumentUrl = async () => {
      setLoading(true);
      setError(null);
      setDocumentUrl(null);

      try {
        const userDataRaw = localStorage.getItem('user_data') || '{}';
        const userData = JSON.parse(userDataRaw);
        const foundationId = userData.foundationId || userData.foundation_id || userData.foundation?.id || '';

        const response = await fetch(`${API_BASE_URL}/api/documents/${document.id}/download?purpose=view`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'X-Foundation-ID': foundationId
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Document fetch failed:', response.status, errorText);
          throw new Error(`Failed to fetch document: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        if (!result?.view_url) {
          throw new Error('View URL missing in response');
        }

        let previewUrl = result.view_url as string;
        if (isOfficeDocument) {
          previewUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`;
        }

        if (isActive) {
          setDocumentUrl(previewUrl);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        if (isActive) {
          setError(`Failed to load document: ${errorMessage}`);
        }
        console.error('Error fetching document:', err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchDocumentUrl();

    return () => {
      isActive = false;
    };
  }, [document.id, document.mime_type, supportsInlinePreview, isOfficeDocument, reloadToken]);

  // Prevent body scroll when modal is open and hide any potential white bars
  useEffect(() => {
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
  }, []);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getFileIcon = () => {
    if (isImage) return <Image className="w-8 h-8 text-blue-500" />;
    if (isPDF) return <FileText className="w-8 h-8 text-red-500" />;
    if (isPlainText) return <File className="w-8 h-8 text-green-500" />;
    if (isOfficeDocument) return <FileText className="w-8 h-8 text-indigo-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
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
        padding: '16px',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 99999
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.file_name}</h2>
              <p className="text-sm text-gray-600">
                {document.document_type.replace('_', ' ')} • {formatFileSize(document.file_size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={Download}
              onClick={onDownload}
            >
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Document Info */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                  {document.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Document ID:</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                    {document.id}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(document.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy Document ID"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-gray-700">Uploaded:</span>
                <span className="ml-2 text-gray-600">{formatDate(document.created_at)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600 capitalize">{document.document_type.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">By:</span>
                <span className="ml-2 text-gray-600">{document.profiles?.full_name || 'Unknown'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-3 min-h-0 bg-gray-50">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading document...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Document</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button icon={Download} onClick={onDownload}>
                  Download Document
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setReloadToken((prev) => prev + 1);
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : !supportsInlinePreview ? (
            <div className="text-center py-8">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {getFileIcon()}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Preview Unavailable</h3>
              <p className="text-gray-600 mb-4">
                This file type cannot be previewed in the browser. Use the download button to open it locally.
              </p>
              <Button icon={Download} onClick={onDownload}>
                Download Document
              </Button>
            </div>
          ) : !documentUrl ? (
            <div className="text-center py-8">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {getFileIcon()}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Document Ready</h3>
              <p className="text-gray-600 mb-4">Click download to view this document</p>
              <Button icon={Download} onClick={onDownload}>
                Download Document
              </Button>
            </div>
          ) : isImage ? (
            <div className="text-center">
              {documentUrl ? (
                <img
                  src={documentUrl}
                  alt={document.file_name}
                  className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                  }}
                />
              ) : (
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-16 h-16 text-blue-500" />
                </div>
              )}
              <div className="hidden mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">Image preview not available</p>
                <p className="text-sm text-gray-500">Use download button to view the file</p>
              </div>
            </div>
          ) : isPDF ? (
            <div className="h-full flex flex-col">
              {documentUrl ? (
                <div className="flex-1 flex flex-col">
                  <div className="mb-3 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      PDF Preview - If the document doesn't display properly, use the download button below.
                    </p>
                  </div>
                  <div className="flex-1 w-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
                    <iframe
                      src={`${documentUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                      className="w-full h-full"
                      title={document.file_name}
                      style={{ border: 'none', minHeight: '400px' }}
                      onLoad={() => {
                        console.log('PDF iframe loaded successfully');
                      }}
                      onError={(e) => {
                        console.error('PDF iframe error:', e);
                        // Show fallback message instead of changing src
                        const iframe = e.currentTarget;
                        iframe.style.display = 'none';
                        const fallback = iframe.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="hidden w-full h-full flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">PDF preview not available in this browser</p>
                        <Button icon={Download} onClick={onDownload}>
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center space-y-2">
                    <p className="text-sm text-gray-500">
                      Having trouble viewing? Try downloading the PDF to open in your default PDF reader.
                    </p>
                    <Button icon={Download} onClick={onDownload}>
                      Download PDF
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-16 h-16 text-red-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Document</h3>
                  <p className="text-gray-600 mb-4">
                    This is a PDF document. Use the download button to view it in your PDF reader.
                  </p>
                  <Button icon={Download} onClick={onDownload}>
                    Download PDF
                  </Button>
                </div>
              )}
            </div>
          ) : isPlainText ? (
            <div className="h-full flex flex-col">
              {documentUrl ? (
                <div className="flex-1 flex flex-col">
                  <div className="mb-3 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Text Document Preview - If the document doesn't display properly, use the download button below.
                    </p>
                  </div>
                  <div className="flex-1 w-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
                    <iframe
                      src={documentUrl}
                      className="w-full h-full"
                      title={document.file_name}
                      style={{ border: 'none', minHeight: '400px' }}
                      onError={(e) => {
                        console.error('Text iframe error:', e);
                        // Fallback to download
                        onDownload();
                      }}
                    />
                  </div>
                  <div className="mt-3 text-center space-y-2">
                    <p className="text-sm text-gray-500">
                      Having trouble viewing? Try downloading the document to open in your default text editor.
                    </p>
                    <Button icon={Download} onClick={onDownload}>
                      Download Document
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <File className="w-16 h-16 text-green-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Text Document</h3>
                  <p className="text-gray-600 mb-4">
                    This is a text document. Use the download button to view it in your text editor.
                  </p>
                  <Button icon={Download} onClick={onDownload}>
                    Download Document
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {documentUrl ? (
                <div className="flex-1 flex flex-col">
                  <div className="mb-3 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Document Preview - If the document doesn't display properly, use the download button below.
                    </p>
                  </div>
                  <div className="flex-1 w-full border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
                    <iframe
                      src={documentUrl}
                      className="w-full h-full"
                      title={document.file_name}
                      style={{ border: 'none', minHeight: '400px' }}
                      onError={(e) => {
                        console.error('Document iframe error:', e);
                        // Fallback to download
                        onDownload();
                      }}
                    />
                  </div>
                  <div className="mt-3 text-center space-y-2">
                    <p className="text-sm text-gray-500">
                      Having trouble viewing? Try downloading the document to open in your default application.
                    </p>
                    <Button icon={Download} onClick={onDownload}>
                      Download File
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <File className="w-16 h-16 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
                  <p className="text-gray-600 mb-4">
                    Preview not available for this file type. Use the download button to view the file.
                  </p>
                  <Button icon={Download} onClick={onDownload}>
                    Download File
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


