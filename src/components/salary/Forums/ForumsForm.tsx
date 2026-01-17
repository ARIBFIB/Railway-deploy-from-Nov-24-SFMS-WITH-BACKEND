import React, { useState, useRef, useEffect } from 'react';

interface ForumsFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForumsForm: React.FC<ForumsFormProps> = ({ isOpen, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('January');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Reset position when modal opens
  useEffect(() => {
    if (isOpen) {
      // Center the modal initially
      if (modalRef.current) {
        const rect = modalRef.current.getBoundingClientRect();
        const centerX = (window.innerWidth - rect.width) / 2;
        const centerY = (window.innerHeight - rect.height) / 2;
        setPosition({ x: centerX, y: centerY });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[999]" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div
        ref={modalRef}
        className="fixed bg-white rounded-lg shadow-lg z-[1000] w-[400px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
        {/* Modal Header (Top Bar) - Draggable */}
        <div
          className="bg-[#006400] text-white font-bold text-center py-[12px] rounded-t-lg cursor-move flex justify-between items-center"
          onMouseDown={handleMouseDown}
        >
          <div className="flex-1 text-center">SALARY REPORTING FORUMS</div>
          <button
            className="text-white text-xl mr-[12px] hover:text-gray-300"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-[20px]">
          {/* Dropdown Section (Select Month) */}
          <div className="mb-[20px]">
            <label className="block text-[11px] text-[#333333] mb-[4px]">Select month</label>
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              className="cancel-btn h-[40px] bg-[#D3D3D3] text-white rounded-[6px] px-[24px] font-medium hover:bg-[#C1C1C1] transition-colors duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="create-btn h-[40px] bg-[#28a745] text-white rounded-[6px] px-[24px] font-bold hover:bg-[#218838] transition-colors duration-300"
              onClick={() => {
                // Handle create action
                console.log('Creating forum for month:', selectedMonth);
                onClose();
              }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForumsForm;