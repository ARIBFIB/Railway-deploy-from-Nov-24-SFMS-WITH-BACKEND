import React, { useState, useRef, useEffect } from 'react';

interface ImportPersonnelProps {
  onClose?: () => void;
}

const ImportPersonnel: React.FC<ImportPersonnelProps> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: (window.innerWidth - 640) / 2, y: (window.innerHeight - 360) / 2 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedImportType, setSelectedImportType] = useState<string | null>(null);
  const [selectedSetting, setSelectedSetting] = useState('skip'); // Default to "Skip the import..."

  const importTypes = [
    { id: 'paxml', label: 'PAXml file' },
    { id: 'schedule', label: 'Schedule and staff information from Visma Salary 300/600 (pdf)' }
  ];

  const settings = [
    { id: 'cancel', label: 'Cancel the import when a person who has a PIN as Employer ID is found.' },
    { id: 'skip', label: 'Skip the import of people who have a PIN as Employment ID.' }
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
      className="fixed bg-white rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.18)] overflow-hidden"
      style={{
        width: '640px',
        minHeight: '360px',
        maxHeight: '520px',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        cursor: dragging ? 'grabbing' : 'default'
      }}
    >
      {/* Draggable Top Bar */}
      <div 
        className="h-[48px] bg-[#0B4F3A] rounded-t-[8px] flex items-center justify-between cursor-grab"
        onMouseDown={handleMouseDown}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <div className="text-[14px] font-semibold text-white tracking-[0.6px] uppercase pl-[16px]">
          IMPORT PERSONNEL
        </div>
        <button 
          className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] hover:bg-[rgba(255,255,255,0.12)] transition-colors mr-[12px]"
          onClick={() => onClose && onClose()}
        >
          <span className="text-[14px] text-white">×</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="p-[16px_20px]">
        {/* Import Type Selection */}
        <div className="mb-[12px]">
          <div className="text-[12px] font-medium text-[#2E2E2E] mb-[12px]">
            Select the type of import that you would like to perform
          </div>
          
          <div className="space-y-[8px]">
            {importTypes.map((type) => (
              <div key={type.id} className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="importType"
                    checked={selectedImportType === type.id}
                    onChange={() => setSelectedImportType(type.id)}
                    className="appearance-none w-[16px] h-[16px] border-[1.5px] border-[#9E9E9E] rounded-full flex items-center justify-center mr-[8px] focus:outline-none focus:ring-2 focus:ring-[#0B8F5A] relative"
                  />
                  <span className={`absolute w-[8px] h-[8px] rounded-full ${selectedImportType === type.id ? 'bg-[#0B4F3A]' : 'bg-transparent'}`}></span>
                  <span className="text-[12px] text-[#333333]">{type.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#E0E0E0] my-[16px]"></div>

        {/* Settings Section */}
        <div>
          <div className="text-[13px] font-semibold text-[#2B2B2B] mb-[8px]">
            Settings
          </div>
          
          <div className="text-[11px] text-[#5A5A5A] leading-[16px] mb-[12px]">
            According to GDPR, a PIN is not allowed as an Employment ID. Choose how the program will handle the import when it is detected in the import file that a PIN has been set as Employment ID.
          </div>
          
          <div className="space-y-[8px]">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-start">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="radio"
                    name="gdprSetting"
                    checked={selectedSetting === setting.id}
                    onChange={() => setSelectedSetting(setting.id)}
                    className="appearance-none w-[16px] h-[16px] border-[1.5px] border-[#9E9E9E] rounded-full flex items-center justify-center mt-[2px] focus:outline-none focus:ring-2 focus:ring-[#0B8F5A] relative"
                  />
                  <span className={`absolute w-[8px] h-[8px] rounded-full mt-[2px] ${selectedSetting === setting.id ? 'bg-[#0B4F3A]' : 'bg-transparent'}`}></span>
                  <span className="text-[12px] text-[#333333] ml-[8px]">{setting.label}</span>
                </label>
              </div>
            ))}
          </div>
          
          {/* Validation Note */}
          <div className="text-[11px] text-[#6B6B6B] mt-[12px]">
            Employment ID may not contain the following invalid characters: *!~()
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-[20px] pb-[16px] flex justify-end">
        <button 
          className="h-[32px] min-w-[72px] px-[16px] bg-[#0B8F5A] text-white text-[12px] font-semibold rounded-[16px] hover:bg-[#0AA06A] active:bg-[#08784C] transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ImportPersonnel;