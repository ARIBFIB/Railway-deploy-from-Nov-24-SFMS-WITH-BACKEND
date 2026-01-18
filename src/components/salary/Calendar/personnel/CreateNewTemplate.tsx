import React, { useState, useRef, useEffect } from 'react';

interface CreateNewTemplateProps {
  onClose?: () => void;
}

const CreateNewTemplate: React.FC<CreateNewTemplateProps> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const [downloadSource, setDownloadSource] = useState('');
  const [employmentId, setEmploymentId] = useState('1');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const sources = ['Option 1', 'Option 2', 'Option 3'];

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
      className="fixed bg-white rounded-[8px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden"
      style={{
        width: '520px',
        height: '360px',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 1000,
        cursor: dragging ? 'grabbing' : 'default'
      }}
    >
      {/* Draggable Header Bar */}
      <div 
        className="h-[44px] bg-[#063F2E] px-[16px] flex items-center justify-between cursor-grab"
        onMouseDown={handleMouseDown}
        style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      >
        <div className="text-[13px] font-semibold text-white tracking-[0.6px] uppercase">
          CREATE NEW STAFF FROM TEMPLATE
        </div>
        <button 
          className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] hover:bg-[rgba(255,255,255,0.12)] transition-colors"
          onClick={() => onClose && onClose()}
        >
          <span className="text-[14px] text-white">×</span>
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-[16px] bg-white">
        <div className="space-y-[12px]">
          {/* Download from */}
          <div>
            <label className="block text-[11px] font-medium text-[#374151] mb-[4px]">Download from *</label>
            <div className="relative">
              <select
                value={downloadSource}
                onChange={(e) => setDownloadSource(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] pr-[24px] focus:outline-none focus:border-[#6AAE8A] appearance-none cursor-pointer"
              >
                <option value="">Select source</option>
                {sources.map((source, index) => (
                  <option key={index} value={source}>{source}</option>
                ))}
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6B7280]">▼</span>
            </div>
          </div>

          {/* Employment ID */}
          <div>
            <label className="block text-[11px] font-medium text-[#374151] mb-[4px]">Employment ID *</label>
            <input
              type="text"
              value={employmentId}
              onChange={(e) => setEmploymentId(e.target.value)}
              className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] focus:outline-none focus:border-[#6AAE8A]"
            />
          </div>

          {/* First Name / Last Name Row */}
          <div className="flex gap-[16px]">
            <div className="flex-1">
              <label className="block text-[11px] font-medium text-[#374151] mb-[4px]">First name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] focus:outline-none focus:border-[#6AAE8A]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[11px] font-medium text-[#374151] mb-[4px]">Last name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] focus:outline-none focus:border-[#6AAE8A]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-medium text-[#374151] mb-[4px]">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] focus:outline-none focus:border-[#6AAE8A]"
            />
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="px-[16px] py-[12px] bg-white flex justify-between items-center border-t border-[#E5E7EB]">
        <div className="flex gap-[8px]">
          {/* Delete (Disabled) */}
          <button 
            className="h-[32px] px-[18px] bg-[#D1D5DB] text-white text-[12px] font-semibold rounded-[16px] opacity-60 cursor-not-allowed"
            disabled
          >
            Delete
          </button>
          
          {/* Cancel */}
          <button 
            className="h-[32px] px-[18px] bg-[#7A7A7A] text-white text-[12px] font-semibold rounded-[16px] hover:bg-[#6B6B6B] transition-colors"
            onClick={() => onClose && onClose()}
          >
            Cancel
          </button>
        </div>
        
        {/* Create */}
        <button 
          className="h-[32px] px-[22px] bg-[#9AC9A2] text-white text-[12px] font-semibold rounded-[16px] hover:bg-[#87B893] transition-colors"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateNewTemplate;