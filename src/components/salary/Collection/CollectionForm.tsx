import React, { useState, useRef, useEffect } from 'react';

interface CollectionFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollectionForm: React.FC<CollectionFormProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('All');
  const [selectedMonth, setSelectedMonth] = useState<string>('January');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const types = ['All', 'Type A', 'Type B', 'Type C'];
  const employees = ['All', 'Employee 1', 'Employee 2', 'Employee 3'];
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
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-[999]"
        onClick={onClose}
      ></div>

      {/* Draggable Modal Container */}
      <div
        ref={modalRef}
        className="fixed bg-white rounded-[6px] border border-[#E6E6E6] shadow-[0px_8px_24px_rgba(0,0,0,0.18)] z-[1000] w-[640px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: isDragging ? 'grabbing' : 'default',
          transition: isDragging ? 'none' : 'transform 120ms ease-out'
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Draggable Header Bar */}
        <div
          className="h-[48px] bg-[#0B4D2E] rounded-t-[6px] px-[16px] flex items-center justify-between cursor-grab"
          onMouseDown={handleMouseDown}
          aria-grabbed={isDragging}
        >
          <div className="text-[14px] font-semibold text-white tracking-[0.6px] uppercase">
            CREATE A NEW PREPARATION
          </div>
          <button
            className="text-white hover:bg-white hover:bg-opacity-12 rounded-[4px] w-[24px] h-[24px] flex items-center justify-center"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body Section */}
        <div className="p-[16px_16px_20px] bg-white">
          {/* Form Grid */}
          <div className="grid grid-cols-3 gap-[12px] gap-y-[6px]">
            {/* Type Field */}
            <div>
              <label className="block text-[12px] font-medium text-[#5F6368] mb-[4px]">
                Type
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-[32px] border border-[#DADCE0] rounded-[4px] bg-white text-[12px] text-[#202124] px-[10px] pr-[32px] focus:outline-none focus:border-[#0B8F3C] focus:shadow-[0_0_0_2px_rgba(11,143,60,0.15)]"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <span className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#5F6368] pointer-events-none">▼</span>
              </div>
            </div>

            {/* Employee Field */}
            <div>
              <label className="block text-[12px] font-medium text-[#5F6368] mb-[4px]">
                Employee
              </label>
              <div className="relative">
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full h-[32px] border border-[#DADCE0] rounded-[4px] bg-white text-[12px] text-[#202124] px-[10px] pr-[32px] focus:outline-none focus:border-[#0B8F3C] focus:shadow-[0_0_0_2px_rgba(11,143,60,0.15)]"
                >
                  {employees.map(employee => (
                    <option key={employee} value={employee}>{employee}</option>
                  ))}
                </select>
                <span className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#5F6368] pointer-events-none">▼</span>
              </div>
            </div>

            {/* Month Field */}
            <div>
              <label className="block text-[12px] font-medium text-[#5F6368] mb-[4px]">
                Month
              </label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-[32px] border border-[#DADCE0] rounded-[4px] bg-white text-[12px] text-[#202124] px-[10px] pr-[32px] focus:outline-none focus:border-[#0B8F3C] focus:shadow-[0_0_0_2px_rgba(11,143,60,0.15)]"
                >
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <span className="absolute right-[10px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#5F6368] pointer-events-none">▼</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-[1px] bg-[#EAEAEA] my-[16px_0_12px]"></div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-[10px]">
            <button
              className="h-[32px] min-w-[84px] px-[14px] text-[12px] font-medium text-white bg-[#9E9E9E] rounded-[16px] border-none cursor-pointer hover:bg-[#8A8A8A] active:bg-[#7A7A7A] transition-colors duration-150"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="h-[32px] min-w-[84px] px-[16px] text-[12px] font-semibold text-white bg-[#0B8F3C] rounded-[16px] border-none cursor-pointer hover:bg-[#0A7F35] active:bg-[#096F2E] transition-colors duration-150"
              onClick={() => {
                console.log('Creating collection with:', { selectedType, selectedEmployee, selectedMonth });
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

export default CollectionForm;