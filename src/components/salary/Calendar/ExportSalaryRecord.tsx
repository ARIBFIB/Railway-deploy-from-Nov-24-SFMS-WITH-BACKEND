import React, { useState, useRef, useEffect } from 'react';

interface ExportSalaryRecordProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportSalaryRecord: React.FC<ExportSalaryRecordProps> = ({ isOpen, onClose }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState('all');
  const [exportType, setExportType] = useState('Select..');
  const [saveExport, setSaveExport] = useState(false);

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
        className={`absolute bg-white border border-[#E6E6E6] rounded-[6px] shadow-[0_6px_20px_rgba(0,0,0,0.18)] w-[920px] min-h-[420px] max-h-[80vh] flex flex-col overflow-hidden ${
          isDragging ? 'shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition-none' : 'transition-transform duration-150 ease-out'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default',
          transform: isDragging ? 'none' : undefined,
          zIndex: 1050
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Draggable Header */}
        <div
          ref={headerRef}
          className="h-[44px] bg-[#0B3D2E] px-[16px] flex items-center justify-center cursor-move select-none rounded-t-[6px]"
          onMouseDown={handleMouseDown}
        >
          <div className="text-[13px] font-semibold text-white tracking-[0.4px] uppercase">
            EXPORT SALARY RECORD
          </div>
          <button
            className="absolute right-[16px] w-[24px] h-[24px] flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[rgba(11,61,46,0.25)]"
            onClick={onClose}
            aria-label="Close"
          >
            <span className="text-[14px]">✕</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-[16px] flex flex-col gap-[16px] bg-white overflow-auto flex-grow">
          {/* Export Type Field */}
          <div>
            <label className="text-[12px] font-medium text-[#4F4F4F] mb-[4px] block">
              Export type
            </label>
            <div className="relative inline-block">
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="h-[32px] w-[240px] pl-[8px] pr-[24px] text-[13px] border border-[#CFCFCF] rounded-[3px] bg-[#F6FBF7] appearance-none focus:outline-none focus:border-[#0A8F3C]"
              >
                <option>Select..</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6F6F6F] pointer-events-none">▼</span>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-[8px] mt-[8px]">
            <button
              className={`h-[28px] px-[12px] text-[12px] font-medium border border-[#D0D0D0] rounded-[3px] ${
                activeTab === 'all' 
                  ? 'bg-white text-[#4F4F4F]' 
                  : 'bg-white text-[#4F4F4F]'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </button>
            <button
              className={`h-[28px] px-[12px] text-[12px] font-medium border border-[#D0D0D0] rounded-[3px] ${
                activeTab === 'active' 
                  ? 'bg-white text-[#4F4F4F]' 
                  : 'bg-[#F0F0F0] text-[#4F4F4F]'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              className={`h-[28px] px-[12px] text-[12px] font-medium border border-[#D0D0D0] rounded-[3px] ${
                activeTab === 'inactive' 
                  ? 'bg-white text-[#4F4F4F]' 
                  : 'bg-[#F0F0F0] text-[#4F4F4F]'
              }`}
              onClick={() => setActiveTab('inactive')}
            >
              Inactive
            </button>
          </div>

          {/* Table Section */}
          <div className="mt-[12px] border border-[#E0E0E0] rounded-[6px] overflow-hidden">
            <div className="h-[36px] bg-[#F5F5F5] border-b-[2px] border-b-[#BDBDBD] grid grid-cols-[36px_260px_200px_1fr]">
              <div className="flex items-center justify-center">
                <div className="w-[14px] h-[14px] border border-[#9E9E9E] rounded-[2px]"></div>
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                Employment ID
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                First Name
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                Surname
              </div>
            </div>
          </div>

          {/* Pagination / Density Controls */}
          <div className="flex justify-end">
            <button className="w-[28px] h-[28px] bg-[#F0F0F0] rounded-[3px] flex items-center justify-center text-[12px] text-[#4F4F4F]">
              <span>List</span>
            </button>
          </div>

          {/* Save Export Section */}
          <div className="mt-[16px] flex items-center justify-between">
            <div>
              <label className="text-[12px] font-medium text-[#4F4F4F] mb-[4px] block">
                Save export
              </label>
              <div className="flex items-center gap-[8px]">
                <div className="relative">
                  <button
                    className={`h-[30px] w-[120px] border border-[#D0D0D0] rounded-[3px] flex items-center justify-center ${
                      saveExport ? 'bg-[#E0E0E0]' : 'bg-white'
                    }`}
                    onClick={() => setSaveExport(true)}
                  >
                    <span className={`${saveExport ? 'text-white' : 'text-[#4F4F4F]'}`}>Yes</span>
                  </button>
                  {saveExport && (
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-[#0A8F3C] rounded-[3px] z-[-1]"></div>
                  )}
                </div>
                
                <div className="relative">
                  <button
                    className={`h-[30px] w-[120px] border border-[#D0D0D0] rounded-[3px] flex items-center justify-center ${
                      !saveExport ? 'bg-[#E0E0E0]' : 'bg-white'
                    }`}
                    onClick={() => setSaveExport(false)}
                  >
                    <span className={`${!saveExport ? 'text-white' : 'text-[#4F4F4F]'}`}>No</span>
                  </button>
                  {!saveExport && (
                    <div className="absolute top-0 left-1/2 w-1/2 h-full bg-[#0A8F3C] rounded-[3px] z-[-1]"></div>
                  )}
                </div>
              </div>
            </div>
            
            <button 
              className="h-[32px] px-[18px] text-[13px] font-semibold text-white bg-[#9CCFB0] rounded-[16px] border-none cursor-pointer hover:bg-[#87BFA1] transition-colors"
              onClick={() => {
                // Handle export action
                console.log("Exporting salary records...");
                onClose();
              }}
            >
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportSalaryRecord;