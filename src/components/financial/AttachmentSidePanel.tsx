import React, { useState, useEffect, useRef } from 'react';
import {
    Image,
    Upload,
    Info,
    X,
    RotateCw,
    Mail,
    ExternalLink,
    Download,
    ArrowUpDown,
    Trash2,
    Link as LinkIcon,
    ArrowUp,
    ChevronDown,
    Check,
    ChevronRight,
    Paperclip
} from 'lucide-react';
import { VerificationService } from '../../services/verificationService';

export interface AttachedFile {
    id: string;
    name: string;
    url: string;
    file: File;
    date: Date;
    isPersistent?: boolean; // Flag to indicate if this is a persistent image
}

interface AttachmentSidePanelProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onLink?: (files: AttachedFile[]) => void;
    verificationId?: string; // Optional verification ID for attaching images directly to a verification
    onAttachToVerification?: (success: boolean, message?: string) => void; // Callback for when images are attached to a verification
}

export const AttachmentSidePanel: React.FC<AttachmentSidePanelProps> = ({ isOpen, onToggle, onClose, onLink, verificationId, onAttachToVerification }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<AttachedFile[]>([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
    const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);
    const [isLinked, setIsLinked] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showFileDropdown, setShowFileDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle ESC key to close the panel
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Load images when panel opens
    useEffect(() => {
        if (isOpen) {
            const loadImages = async () => {
                try {
                    setLoading(true);
                    
                    let images = [];
                    
                    if (verificationId) {
                        // 🔥 Load linked images for the specific verification
                        console.log('🔍 AttachmentSidePanel - Loading linked images for verification:', verificationId);
                        const response = await VerificationService.getVerificationImages(verificationId);
                        console.log('📥 AttachmentSidePanel - getVerificationImages response:', response);
                        if (response.success && response.data) {
                            console.log('📊 AttachmentSidePanel - Found', response.data.length, 'linked images');
                            images = response.data;
                        } else {
                            console.log('❌ AttachmentSidePanel - getVerificationImages failed or returned no data:', response);
                            images = [];
                        }
                    } else {
                        // Load unlinked images
                        console.log('🔍 AttachmentSidePanel - Loading unlinked images...');
                        const response = await VerificationService.getUnlinkedImages();
                        console.log('📥 AttachmentSidePanel - getUnlinkedImages response:', response);
                        if (response.success && response.data) {
                            console.log('📊 AttachmentSidePanel - Found', response.data.length, 'unlinked images');
                            images = response.data;
                        } else {
                            console.log('❌ AttachmentSidePanel - getUnlinkedImages failed or returned no data:', response);
                            images = [];
                        }
                    }
                    
                    // Convert images to AttachedFile format
                    const attachedFiles: AttachedFile[] = images.map((img: any) => ({
                        id: img.id,
                        name: img.image_name || img.name,
                        url: img.image_url || img.url,
                        file: new File([], img.image_name || img.name || 'image', { type: img.mime_type || img.type }), // Placeholder file
                        date: new Date(img.uploaded_at || img.date || Date.now()),
                        isPersistent: true,
                    }));
                    
                    console.log('📁 AttachmentSidePanel - Converted files:', attachedFiles);
                    setFiles(attachedFiles);
                    
                    // Set linked state if we're loading linked images
                    if (verificationId) {
                        setIsLinked(true);
                    }
                } catch (err) {
                    console.error('Error loading images:', err);
                    setError('Failed to load images');
                } finally {
                    setLoading(false);
                }
            };
            
            loadImages();
        }
    }, [isOpen, verificationId]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            files.forEach(file => {
                // Only revoke object URLs (not regular image URLs from the server)
                if (file.url.startsWith('blob:')) {
                    console.log('🧹 AttachmentSidePanel - Revoking object URL:', file.url);
                    URL.revokeObjectURL(file.url);
                }
            });
        };
    }, [files]);

    // Handle File Upload
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setLoading(true);
            try {
                for (const file of Array.from(event.target.files)) {
                    try {
                        console.log('📤 AttachmentSidePanel - Uploading file:', file.name, 'size:', file.size, 'type:', file.type);
                        
                        // Upload to persistent gallery
                        const result = await VerificationService.uploadImage(file);
                        console.log('💾 AttachmentSidePanel - Upload result:', result);
                        
                        if (result.success) {
                            console.log('✅ AttachmentSidePanel - Upload successful, refreshing unlinked images...');
                            
                            // Small delay to ensure the image is saved before fetching
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            // Refresh the list of images based on verificationId
                            let response;
                            if (verificationId) {
                                response = await VerificationService.getVerificationImages(verificationId);
                                console.log('📥 AttachmentSidePanel - Refresh verification images response:', response);
                            } else {
                                response = await VerificationService.getUnlinkedImages();
                                console.log('📥 AttachmentSidePanel - Refresh unlinked images response:', response);
                            }
                            
                            if (response.success && response.data) {
                                console.log('📊 AttachmentSidePanel - After upload, found', response.data.length, 'images');
                                
                                // Convert images to AttachedFile format
                                const attachedFiles: AttachedFile[] = response.data.map((img: any) => ({
                                    id: img.id,
                                    name: img.image_name || img.name,
                                    url: img.image_url || img.url,
                                    file: new File([], img.image_name || img.name || 'image', { type: img.mime_type || img.type }), // Placeholder file with correct type
                                    date: new Date(img.uploaded_at || img.date || Date.now()),
                                    isPersistent: true,
                                }));
                                
                                console.log('📁 AttachmentSidePanel - Set files to:', attachedFiles);
                                setFiles(attachedFiles);
                                
                                // Find the index of the newly uploaded image and set it as selected
                                const newImageIndex = attachedFiles.findIndex(f => f.name === result.data.image_name);
                                console.log('🔍 AttachmentSidePanel - Looking for new image:', result.data.image_name, 'Found at index:', newImageIndex);
                                
                                if (newImageIndex !== -1) {
                                    setSelectedFileIndex(newImageIndex);
                                    console.log('✅ AttachmentSidePanel - Set selected file index to:', newImageIndex);
                                } else if (attachedFiles.length > 0) {
                                    // Fallback to the last item if the specific image isn't found
                                    setSelectedFileIndex(attachedFiles.length - 1);
                                    console.log('🔄 AttachmentSidePanel - Set selected file index to last item:', attachedFiles.length - 1);
                                }
                                
                                // Update linked state if we're in a verification context
                                if (verificationId) {
                                    setIsLinked(true);
                                }
                            } else {
                                console.log('❌ AttachmentSidePanel - Failed to refresh images after upload');
                            }
                        } else {
                            // If upload failed, show error
                            console.log('❌ AttachmentSidePanel - Upload failed:', result.message);
                            setError(result.message || 'Failed to upload image');
                        }
                    } catch (error) {
                        console.error('Error uploading file:', error);
                        setError('Failed to upload file');
                    }
                }
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async () => {
        if (files.length === 0) return;
        
        const selectedFile = files[selectedFileIndex];
        
        try {
            setLoading(true);
            await VerificationService.deleteUnlinkedImage(selectedFile.id);
            
            // Refresh the list of images based on verificationId
            let response;
            if (verificationId) {
                response = await VerificationService.getVerificationImages(verificationId);
            } else {
                response = await VerificationService.getUnlinkedImages();
            }
            
            if (response.success && response.data) {
                // Convert images to AttachedFile format
                const attachedFiles: AttachedFile[] = response.data.map((img: any) => ({
                    id: img.id,
                    name: img.image_name || img.name,
                    url: img.image_url || img.url,
                    file: new File([], img.image_name || img.name || 'image', { type: img.mime_type || img.type }), // Placeholder file with correct type
                    date: new Date(img.uploaded_at || img.date || Date.now()),
                    isPersistent: true,
                }));
                setFiles(attachedFiles);
                
                if (attachedFiles.length === 0) {
                    setSelectedFileIndex(0);
                    setIsLinked(false);
                    if (onLink) onLink([]); // Notify parent that links are gone
                } else if (selectedFileIndex >= attachedFiles.length) {
                    setSelectedFileIndex(attachedFiles.length - 1);
                }
            }
        } catch (error) {
            console.error('Error deleting file:', error);
            setError('Failed to delete file');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (files.length === 0) return;
        const file = files[selectedFileIndex];
        const a = document.createElement('a');
        a.href = file.url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleLink = async () => {
        if (files.length === 0 || !verificationId) return;
        
        const selectedFile = files[selectedFileIndex];
        
        try {
            setLoading(true);
            await VerificationService.linkImageToVerification(selectedFile.id, verificationId);
            setIsLinked(true);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            
            // Refresh the list of images for the verification
            const response = await VerificationService.getVerificationImages(verificationId);
            if (response.success && response.data) {
                // Convert images to AttachedFile format
                const attachedFiles: AttachedFile[] = response.data.map((img: any) => ({
                    id: img.id,
                    name: img.image_name || img.name,
                    url: img.image_url || img.url,
                    file: new File([], img.image_name || img.name || 'image', { type: img.mime_type || img.type }), // Placeholder file with correct type
                    date: new Date(img.uploaded_at || img.date || Date.now()),
                    isPersistent: true,
                }));
                setFiles(attachedFiles);
                
                // Set the first image as selected
                if (attachedFiles.length > 0) {
                    setSelectedFileIndex(0);
                }
            }
        } catch (error) {
            console.error('Error linking file:', error);
            setError('Failed to link file');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelLink = () => {
        setIsLinked(false);
        if (onLink) onLink([]); // Clear links
    };

    const toggleMoveMenu = () => {
        setIsMoveMenuOpen(!isMoveMenuOpen);
    };

    const currentFile = files.length > 0 ? files[selectedFileIndex] : null;
    
    // Debug effect for state changes
    useEffect(() => {
        console.log('📋 AttachmentSidePanel - Files state changed:', files.length, 'files');
        console.log('📋 AttachmentSidePanel - Files:', files);
    }, [files]);
    
    useEffect(() => {
        console.log('🔍 AttachmentSidePanel - Selected file index changed:', selectedFileIndex);
        console.log('🔍 AttachmentSidePanel - Current file:', currentFile);
    }, [selectedFileIndex, currentFile]);

    // Function to attach images to a specific verification
    const attachToVerification = async () => {
        if (!verificationId) {
            console.error('No verification ID provided for attachment');
            return;
        }

        if (files.length === 0) {
            console.warn('No files to attach');
            return;
        }

        try {
            setLoading(true);
            // Link the selected file to the verification
            const selectedFile = files[selectedFileIndex];
            if (selectedFile) {
                const result = await VerificationService.linkImageToVerification(selectedFile.id, verificationId);
                if (result.success) {
                    console.log('✅ Image linked successfully:', result.data);
                    
                    // Refresh the list of images for the verification
                    const response = await VerificationService.getVerificationImages(verificationId);
                    if (response.success && response.data) {
                        // Convert images to AttachedFile format
                        const attachedFiles: AttachedFile[] = response.data.map((img: any) => ({
                            id: img.id,
                            name: img.image_name || img.name,
                            url: img.image_url || img.url,
                            file: new File([], img.image_name || img.name || 'image', { type: img.mime_type || img.type }), // Placeholder file
                            date: new Date(img.uploaded_at || img.date || Date.now()),
                            isPersistent: true,
                        }));
                        setFiles(attachedFiles);
                                        
                        // Set the first image as selected
                        if (attachedFiles.length > 0) {
                            setSelectedFileIndex(0);
                        }
                    }
                    
                    // Call the callback to notify parent component
                    if (onAttachToVerification) {
                        onAttachToVerification(true, `Successfully attached image to verification`);
                    }
                } else {
                    console.error('❌ Failed to link image:', result.message);
                    setError(result.message || 'Failed to link image');
                }
            }
        } catch (error) {
            console.error('❌ Error linking image to verification:', error);
            setError('Failed to attach image to verification');
        } finally {
            setLoading(false);
        }
    };

    const moveOptions = [
        "Asset register",
        "Daily takings",
        "Supplier invoices",
        "Vouchers",
        "Customer invoices",
        "Orders",
        "Quotes"
    ];

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,application/pdf"
            />

            {/* Sticky Yellow Gallery Button */}
            {/* Animates with the drawer */}
            <button
                onClick={onToggle}
                style={{ right: isOpen ? '420px' : '0' }}
                className={`fixed top-1/2 -translate-y-1/2 z-[100] w-12 h-24 bg-[#FFC107] hover:bg-[#FFB300] hover:scale-110 hover:w-14 rounded-l-lg flex items-center justify-center shadow-lg transition-all duration-350 ease-in-out group ${isOpen ? '' : 'active:scale-95'}`}
                aria-expanded={isOpen}
                aria-label="Toggle attachments"
            >
                {isOpen ? (
                    <ChevronRight className="w-6 h-6 text-black" />
                ) : (
                    <Image className="w-5 h-5 text-black" />
                )}
            </button>

            {/* Sliding Drawer */}
            <div
                role="dialog"
                aria-modal="true"
                className={`fixed top-0 right-0 h-screen w-[420px] bg-white border-l border-gray-200 z-[90] shadow-2xl transition-transform duration-350 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } flex flex-col font-sans`}
            >
                {/* 2. Header Section */}
                <div className="h-16 px-4 border-b border-[#E5E7EB] flex items-center justify-between shrink-0 bg-white z-10">
                    <h2 className="text-[16px] font-semibold text-[#2B2B2B] tracking-[0.5px]">
                        {files.length > 0 ? `Images (${files.length})` : 'CHOOSE PICTURE'}
                    </h2>

                    {/* Action Icons Row */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => { setFiles([]); setIsLinked(false); if (onLink) onLink([]); }} className="text-[#6B6B6B] hover:text-[#1A73E8] transition-colors" title="Reload (Clear All)">
                            <RotateCw size={18} />
                        </button>
                        <button className="text-[#6B6B6B] hover:text-[#1A73E8] transition-colors" title="Email image">
                            <Mail size={14} />
                        </button>
                        <button onClick={handleUploadClick} className="text-[#6B6B6B] hover:text-[#1A73E8] transition-colors" title="Upload">
                            <Upload size={14} />
                        </button>
                        <button className="text-[#1A73E8] hover:text-[#1557B0] transition-colors" title="Manage in Inbox">
                            <ExternalLink size={14} />
                        </button>
                        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 pb-24 flex flex-col relative">
                    {loading && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-30">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-sm text-gray-600">Loading...</p>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {files.length === 0 ? (
                        /* EMPTY STATE */
                        <div className="flex flex-col h-full">
                            {/* Upload Area */}
                            <div
                                onClick={handleUploadClick}
                                className="border-2 border-dashed border-[#DADCE0] rounded-lg h-[260px] w-full bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-[#F8F9FA] transition-colors mb-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center mb-3">
                                    <Upload className="w-8 h-8 text-[#0F5132]" />
                                </div>
                                <p className="text-[14px] font-medium text-[#202124] mt-3">
                                    There are no available documents to attach.
                                </p>
                                <p className="text-[13px] text-[#5F6368] mt-1.5">
                                    Drag and drop a document here or click Upload.
                                </p>
                            </div>

                            {/* Information Alert Box */}
                            <div className="bg-[#9CC9DD] rounded-md p-3 flex gap-3 items-start mt-auto">
                                <Info className="w-[18px] h-[18px] text-[#0B3C5D] shrink-0 mt-0.5" />
                                <p className="text-[13px] text-[#0B3C5D] leading-[1.4]">
                                    Once the document has been uploaded, it is saved and archived,
                                    and you may discard the original. From July 1 2024, digital
                                    storage of documents will be sufficient.
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* SELECTED STATE */
                        <div className="flex flex-col h-full">
                            {/* File Selector Header */}
                            <div className="mb-3 relative">
                                <div
                                    onClick={() => setShowFileDropdown(!showFileDropdown)}
                                    className="border border-[#DADCE0] rounded-md px-2.5 py-1.5 bg-white flex items-center justify-between cursor-pointer hover:border-gray-400"
                                >
                                    <span className="text-[13px] text-[#202124] truncate pr-2">
                                        {currentFile?.name}
                                    </span>
                                    <ChevronDown size={14} className="text-[#5F6368]" />
                                </div>

                                {/* File Dropdown */}
                                {showFileDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DADCE0] rounded-md shadow-lg z-20 max-h-48 overflow-y-auto">
                                        {files.map((file, index) => (
                                            <div
                                                key={file.id}
                                                onClick={() => {
                                                    setSelectedFileIndex(index);
                                                    setShowFileDropdown(false);
                                                }}
                                                className={`px-3 py-2 text-[13px] hover:bg-gray-50 cursor-pointer truncate flex items-center justify-between ${index === selectedFileIndex ? 'bg-blue-50 text-blue-700' : 'text-[#202124]'}`}
                                            >
                                                <span className="truncate">{file.name}</span>
                                                {index === selectedFileIndex && <Check size={12} />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* File Count & Sort */}
                            <div className="flex items-center justify-between mb-3 px-1">
                                <span className="text-[12px] text-[#5F6368]">
                                    {selectedFileIndex + 1} ( {files.length} )
                                </span>
                                <button className="flex items-center gap-1 text-[12px] text-[#5F6368] hover:text-[#202124]">
                                    <ArrowUpDown size={12} />
                                    <span>Sort by oldest first</span>
                                </button>
                            </div>

                            {/* Action Toolbar */}
                            <div className="flex items-center gap-4 mb-4 px-1 py-2 border-b border-[#F1F3F4]">
                                <button onClick={handleDownload} className="flex items-center gap-1.5 text-[#5F6368] hover:text-[#1A73E8] transition-colors">
                                    <Download size={14} />
                                    <span className="text-[13px]">Download</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-[#5F6368] hover:text-[#1A73E8] transition-colors">
                                    <Mail size={14} />
                                    <span className="text-[13px]">Email</span>
                                </button>
                                <button onClick={handleUploadClick} className="flex items-center gap-1.5 text-[#5F6368] hover:text-[#1A73E8] transition-colors">
                                    <Upload size={14} />
                                    <span className="text-[13px]">Upload</span>
                                </button>
                                <button className="flex items-center gap-1.5 text-[#1A73E8] hover:text-[#1557B0] transition-colors">
                                    <ExternalLink size={14} />
                                    <span className="text-[13px]">Inbox</span>
                                </button>
                            </div>

                            {/* Image Preview Area */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8F9FA] rounded-lg p-2 mb-4 border border-[#E5E7EB] min-h-[300px]">
                                <div className="grid grid-cols-1 gap-2 h-full">
                                    <div className="h-full bg-white rounded-md shadow-sm border border-gray-200 flex items-center justify-center relative overflow-hidden">
                                        {(() => {
                                            console.log('🖼️ AttachmentSidePanel - Current file for preview:', currentFile);
                                            if (currentFile) {
                                                console.log('🖼️ AttachmentSidePanel - Current file URL:', currentFile.url);
                                                console.log('🖼️ AttachmentSidePanel - Current file name:', currentFile.name);
                                                console.log('🖼️ AttachmentSidePanel - Current file type check - includes image:', currentFile.url.toLowerCase().includes('image'));
                                                console.log('🖼️ AttachmentSidePanel - Current file name extension check:', currentFile.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i));
                                                console.log('🖼️ AttachmentSidePanel - Current file blob check:', currentFile.url.startsWith('blob:'));
                                                
                                                return (
                                                    currentFile.file?.type?.startsWith('image/') ||
                                                    currentFile.url.toLowerCase().includes('image') || 
                                                    currentFile.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i) ||
                                                    currentFile.url.startsWith('blob:') ? (
                                                        <img
                                                            src={currentFile.url}
                                                            alt={currentFile.name}
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                                            <Image className="w-16 h-16" />
                                                            <span className="text-[13px]">{currentFile.name}</span>
                                                        </div>
                                                    )
                                                );
                                            } else {
                                                console.log('🖼️ AttachmentSidePanel - No current file to preview');
                                                return (
                                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                                        <Image className="w-16 h-16" />
                                                        <span className="text-[13px]">No image selected</span>
                                                    </div>
                                                );
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* 7. Bottom Action Buttons (Sticky at bottom of drawer) */}
                {files.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-4 z-20 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        {/* Left side buttons */}
                        <div className="flex items-center gap-3">
                            {/* Link button - available when verificationId is provided */}
                            {verificationId && (
                                <button
                                    onClick={handleLink}
                                    disabled={loading}
                                    className="px-5 py-2 bg-[#0F9D58] text-white text-[14px] font-medium rounded-full hover:bg-[#0B8548] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <LinkIcon size={16} />
                                    Link
                                </button>
                            )}
                            
                            {/* Delete button - available when not linked */}
                            {!isLinked && (
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-5 py-2 bg-[#F44336] text-white text-[14px] font-medium rounded-full hover:bg-[#D32F2F] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            )}
                            
                            {/* Move button */}
                            {!isLinked && (
                                <div className="relative">
                                    {isMoveMenuOpen && (
                                        <div className="absolute bottom-full mb-2 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30">
                                            {moveOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() => setIsMoveMenuOpen(false)}
                                                    className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50"
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <button
                                        onClick={toggleMoveMenu}
                                        disabled={loading}
                                        className={`flex items-center gap-1.5 px-5 py-2 text-white text-[14px] font-medium rounded-full transition-colors ${isMoveMenuOpen ? 'bg-[#808080]' : 'bg-[#9E9E9E] hover:bg-[#808080]'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <ArrowUp size={14} />
                                        Move
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Right side buttons */}
                        <div className="flex items-center gap-3">
                            {isLinked && (
                                <button
                                    onClick={handleCancelLink}
                                    className="text-[#5F6368] text-[13px] font-medium hover:text-[#202124] transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                            
                            {/* Attach to Verification button - when verificationId is provided */}
                            {verificationId && (
                                <button
                                    onClick={attachToVerification}
                                    disabled={loading}
                                    className="px-5 py-2 bg-[#4285F4] text-white text-[14px] font-medium rounded-full hover:bg-[#3367D6] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <LinkIcon size={16} />
                                    Attach to Verification
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/5 z-[80]"
                />
            )}

            {/* Toast Message */}
            {showToast && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-[#323232] text-white text-[14px] px-6 py-3 rounded-md shadow-lg z-[200] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    The image has been linked.
                </div>
            )}
        </>
    );
};
