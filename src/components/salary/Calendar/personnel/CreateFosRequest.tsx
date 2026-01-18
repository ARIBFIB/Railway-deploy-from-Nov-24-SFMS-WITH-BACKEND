import React, { useState, useRef, useEffect } from 'react';

interface CreateFosRequestProps {
  onClose?: () => void;
}

const CreateFosRequest: React.FC<CreateFosRequestProps> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: (window.innerWidth - 520) / 2, y: (window.innerHeight - 240) / 2 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedPeriod, setSelectedPeriod] = useState('current-year');

  const periods = [
    { id: 'current-year', label: 'Current year' },
    { id: 'previous-year', label: 'Previous year' },
    { id: 'first-half', label: 'First half of year' },
    { id: 'second-half', label: 'Second half of year' },
    { id: 'custom', label: 'Custom period' },
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      const newX = e.clientX - offset.x;
      const newY = e.clientY - offset.y;
      
      // Constrain to viewport with 24px margins
      const clampedX = Math.max(24, Math.min(window.innerWidth - 24 - (modalRef.current?.offsetWidth || 0), newX));
      const clampedY = Math.max(24, Math.min(window.innerHeight - 24 - (modalRef.current?.offsetHeight || 0), newY));
      
      setPosition({ x: clampedX, y: clampedY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, offset]);

  return (
    <div 
      ref={modalRef}
      className="fixed bg-white rounded-[8px] shadow-[0_6px_20px_rgba(0,0,0,0.16)] overflow-hidden"
      style={{
        width: '520px',
        minHeight: '200px',
        maxHeight: '280px',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        cursor: dragging ? 'grabbing' : 'default'
      }}
    >
      {/* Draggable Top Bar */}
      <div 
        className="h-[44px] bg-[#0B4F3A] rounded-t-[8px] flex items-center justify-between cursor-grab"
        onMouseDown={handleMouseDown}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <div className="text-[13px] font-semibold text-white tracking-[0.6px] uppercase pl-[16px]">
          CREATE FOS REQUEST
        </div>
        <button 
          className="w-[28px] h-[28px] flex items-center justify-center rounded-[50%] hover:bg-[rgba(255,255,255,0.15)] transition-colors mr-[12px]"
          onClick={() => onClose && onClose()}
        >
          <span className="text-[14px] text-white">×</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-[20px_24px]">
        {/* Form Section */}
        <div className="mb-[6px]">
          <div className="text-[12px] font-semibold text-[#4A4A4A] mb-[6px]">
            Select period
          </div>
          
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full h-[32px] bg-[#F9FFF9] border border-[#B8D2C2] rounded-[4px] text-[12px] text-[#333333] pl-[10px] pr-[28px] py-[7px] focus:outline-none focus:ring-2 focus:ring-[#0B8F5A] appearance-none"
            >
              {periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
            <span className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6A6A6A]">▼</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-[24px] pb-[20px] flex justify-end">
        <button 
          className="h-[32px] min-w-[72px] px-[18px] bg-[#0B8F5A] text-white text-[12px] font-semibold rounded-[16px] hover:bg-[#0AA06A] active:bg-[#08784C] transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default CreateFosRequest;