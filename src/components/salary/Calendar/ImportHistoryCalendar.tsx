import React, { useState, useRef, useEffect } from 'react';

interface ImportHistoryCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportHistoryCalendar: React.FC<ImportHistoryCalendarProps> = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState('salary-transactions');

  // Handle dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!headerRef.current) return;
    
    const rect = headerRef.current.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !panelRef.current) return;

    const panelRect = panelRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate new position with boundaries
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;

    // Constrain to viewport
    newX = Math.max(0, Math.min(newX, viewportWidth - panelRect.width));
    newY = Math.max(0, Math.min(newY, viewportHeight - panelRect.height));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Reset position when opening
  useEffect(() => {
    if (isOpen) {
      // Center the panel initially
      if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        setPosition({
          x: (window.innerWidth - rect.width) / 2,
          y: (window.innerHeight - rect.height) / 2
        });
      }
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={panelRef}
        className="absolute bg-white border border-[#E6E6E6] rounded-b-[6px] shadow-[0_6px_20px_rgba(0,0,0,0.18)] max-w-[1280px] w-full"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default',
          transform: isDragging ? 'none' : undefined,
          zIndex: 1100,
          maxWidth: '1280px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Draggable Header */}
        <div
          ref={headerRef}
          className="h-[48px] bg-[#0B3D2E] px-[16px] flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <div className="text-[13px] font-semibold text-white tracking-[0.8px] uppercase">
            IMPORT HISTORY
          </div>
          <button
            className="absolute right-[16px] w-[24px] h-[24px] flex items-center justify-center text-white hover:bg-white hover:bg-opacity-12 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[rgba(11,61,46,0.25)]"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-[14px]">✕</span>
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="p-[14px_16px] bg-white">
          {/* Filter Tabs Row */}
          <div className="flex items-center">
            <div className="flex gap-[6px]">
              <button
                className={`h-[32px] px-[12px] text-[12px] font-medium border border-[#BDBDBD] bg-[#F3F3F3] text-[#5F6368] rounded-[3px] flex items-center ${
                  activeTab === 'all' ? 'bg-[#F3F3F3]' : ''
                }`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`h-[32px] px-[12px] text-[12px] font-medium border border-[#DADCE0] bg-white text-[#5F6368] rounded-[3px] flex items-center ${
                  activeTab === 'salary-transactions' ? 'border-l-[4px] border-l-[#B7E4A2]' : ''
                }`}
                onClick={() => setActiveTab('salary-transactions')}
              >
                Salary transactions
              </button>
              <button
                className={`h-[32px] px-[12px] text-[12px] font-medium border border-[#DADCE0] bg-white text-[#5F6368] rounded-[3px] flex items-center ${
                  activeTab === 'time-transactions' ? 'border-l-[4px] border-l-[#B6E3F7]' : ''
                }`}
                onClick={() => setActiveTab('time-transactions')}
              >
                Time transactions
              </button>
            </div>

            {/* Right Action Controls */}
            <div className="ml-auto flex gap-[6px]">
              <button className="w-[32px] h-[32px] bg-[#F3F3F3] flex items-center justify-center text-[#4A4F55] rounded-[4px] hover:bg-gray-300">
                <span className="text-[14px]">☰</span>
              </button>
              <div className="h-[32px] px-[10px] text-[12px] font-semibold bg-[#F3F3F3] text-[#4A4F55] rounded-[4px] flex items-center">
                0
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="h-[1px] bg-[#E6E6E6] my-[12px]"></div>

          {/* Data Table Header */}
          <div className="border border-[#E0E0E0] rounded-[6px] overflow-hidden">
            <div className="h-[40px] bg-white grid grid-cols-[160px_1fr_220px_160px]">
              <div className="bg-[#BFBFBF] text-white text-[12px] font-semibold p-0 flex items-center justify-center">
                DATE
              </div>
              <div className="text-[#4A4F55] text-[12px] font-semibold p-0 flex items-center px-[12px]">
                IMPORT FILE
              </div>
              <div className="text-[#4A4F55] text-[12px] font-semibold p-0 flex items-center px-[12px]">
                TYPE
              </div>
              <div className="text-[#4A4F55] text-[12px] font-semibold p-0 flex items-center px-[12px]">
                QUANTITY
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportHistoryCalendar;