import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface DraggableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string;
  maxWidth?: string;
  headerHeight?: string;
  headerBg?: string;
  headerPadding?: string;
  boxShadow?: string;
  draggingBoxShadow?: string;
  titleFontSize?: string;
  titleLetterSpacing?: string;
  contentPadding?: string;
}

const DraggableModal: React.FC<DraggableModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  width = '640px',
  maxWidth = '90vw',
  headerHeight = '48px',
  headerBg = '#0B3D2E',
  headerPadding = '0 16px',
  boxShadow = '0 12px 28px rgba(0,0,0,0.18)',
  draggingBoxShadow = '0 16px 36px rgba(0,0,0,0.22)',
  titleFontSize = '13px',
  titleLetterSpacing = '0.3px',
  contentPadding = '20px'
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Center the modal when it opens
      const modal = modalRef.current;
      if (modal) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const modalRect = modal.getBoundingClientRect();
        
        const x = (viewportWidth - modalRect.width) / 2;
        const y = (viewportHeight - modalRect.height) / 2;
        
        setPosition({ x, y });
      }
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (headerRef.current && headerRef.current.contains(e.target as Node)) {
      setIsDragging(true);
      const modalRect = modalRef.current?.getBoundingClientRect();
      if (modalRect) {
        setDragOffset({
          x: e.clientX - modalRect.left,
          y: e.clientY - modalRect.top
        });
      }
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && modalRef.current) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const modalRect = modalRef.current.getBoundingClientRect();
      
      // Calculate new position with bounds checking
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;
      
      // Keep modal within viewport bounds
      newX = Math.max(0, Math.min(newX, viewportWidth - modalRect.width));
      newY = Math.max(0, Math.min(newY, viewportHeight - modalRect.height));
      
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div
        ref={modalRef}
        className="absolute bg-white rounded-2xl overflow-hidden"
        style={{
          width,
          maxWidth,
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'auto',
          boxShadow: isDragging ? draggingBoxShadow : boxShadow
        }}
      >
        {/* Draggable Header */}
        <div
          ref={headerRef}
          className="flex items-center justify-between cursor-grab select-none"
          style={{
            height: headerHeight,
            backgroundColor: headerBg,
            padding: headerPadding
          }}
          onMouseDown={handleMouseDown}
        >
          <h2 
            className="text-white font-semibold uppercase"
            style={{
              fontSize: titleFontSize,
              letterSpacing: titleLetterSpacing,
              lineHeight: '20px'
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-12 transition-colors"
            style={{
              width: '28px',
              height: '28px',
              position: 'absolute',
              right: '20px'
            }}
            aria-label="Close modal"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
        
        {/* Modal Content */}
        <div style={{ padding: contentPadding }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DraggableModal;