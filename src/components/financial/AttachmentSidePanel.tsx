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

export interface AttachedFile {
    id: string;
    name: string;
    url: string;
    file: File;
    date: Date;
}

interface AttachmentSidePanelProps {
    isOpen: boolean;
    onToggle: () => void;
    onClose: () => void;
    onLink?: (files: AttachedFile[]) => void;
}

export const AttachmentSidePanel: React.FC<AttachmentSidePanelProps> = ({ isOpen, onToggle, onClose, onLink }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<AttachedFile[]>([]);
    const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
    const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false);
    const [isLinked, setIsLinked] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [showFileDropdown, setShowFileDropdown] = useState(false);

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

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.url));
        };
    }, []);

    // Handle File Upload
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const newFiles = Array.from(event.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                url: URL.createObjectURL(file),
                file: file,
                date: new Date()
            }));

            setFiles(prev => [...prev, ...newFiles]);
            setSelectedFileIndex(files.length);
            setIsLinked(false);
        }
    };

    const handleDelete = () => {
        if (files.length === 0) return;

        // URL.revokeObjectURL(files[selectedFileIndex].url); // Avoid revoking if we want to restore later, but fine here
        const newFiles = files.filter((_, index) => index !== selectedFileIndex);
        setFiles(newFiles);

        if (newFiles.length === 0) {
            setSelectedFileIndex(0);
            setIsLinked(false);
            if (onLink) onLink([]); // Notify parent that links are gone
        } else if (selectedFileIndex >= newFiles.length) {
            setSelectedFileIndex(newFiles.length - 1);
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

    const handleLink = () => {
        if (files.length === 0) return;
        setIsLinked(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        if (onLink) onLink(files); // Pass all files or just linked? Usually all linked context.
    };

    const handleCancelLink = () => {
        setIsLinked(false);
        if (onLink) onLink([]); // Clear links
    };

    const toggleMoveMenu = () => {
        setIsMoveMenuOpen(!isMoveMenuOpen);
    };

    const currentFile = files[selectedFileIndex];

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
                        {isLinked ? `Linked images ${files.length}` : 'CHOOSE PICTURE'}
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
                                        {currentFile?.file.type.startsWith('image/') ? (
                                            <img
                                                src={currentFile.url}
                                                alt={currentFile.name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                                <Image className="w-16 h-16" />
                                                <span className="text-[13px]">{currentFile?.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* 7. Bottom Action Buttons (Sticky at bottom of drawer) */}
                {files.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-4 z-20 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        {/* Only show Delete if NOT linked */}
                        {!isLinked ? (
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2 bg-[#BDBDBD] text-white text-[14px] font-medium rounded-full hover:bg-[#A0A0A0] transition-colors"
                            >
                                Delete
                            </button>
                        ) : <div></div>} {/* Spacer to keep right alignment */}

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                {/* Only show Move if NOT linked */}
                                {!isLinked && (
                                    <>
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
                                            className={`flex items-center gap-1.5 px-5 py-2 text-white text-[14px] font-medium rounded-full transition-colors ${isMoveMenuOpen ? 'bg-[#808080]' : 'bg-[#9E9E9E] hover:bg-[#808080]'}`}
                                        >
                                            <ArrowUp size={14} />
                                            Move
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                {isLinked && (
                                    <button
                                        onClick={handleCancelLink}
                                        className="text-[#5F6368] text-[13px] font-medium hover:text-[#202124] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    onClick={handleLink}
                                    className="px-6 py-2 bg-[#0F9D58] text-white text-[14px] font-semibold rounded-full hover:bg-[#0B8548] transition-colors shadow-sm"
                                >
                                    {isLinked ? 'Linked' : 'Link'}
                                </button>
                            </div>
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
