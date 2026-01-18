import React, { useState, useRef, useEffect } from 'react';

interface ExportPersonnelProps {
  onClose?: () => void;
}

const ExportPersonnel: React.FC<ExportPersonnelProps> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: (window.innerWidth - 960) / 2, y: (window.innerHeight - 400) / 2 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const [staffType, setStaffType] = useState('all');
  const [status, setStatus] = useState('all');
  const [rowsCount, setRowsCount] = useState('25');

  const staffTypes = [
    { id: 'all', label: 'All' },
    { id: 'blue-collar', label: 'Blue-collar' },
    { id: 'white-collar', label: 'White-collar' },
  ];

  const statuses = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' },
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
        width: '960px',
        minHeight: '300px',
        maxHeight: '560px',
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
          EXPORT PERSONNEL
        </div>
        <button 
          className="w-[32px] h-[32px] flex items-center justify-center rounded-[6px] hover:bg-[rgba(255,255,255,0.12)] transition-colors mr-[12px]"
          onClick={() => onClose && onClose()}
        >
          <span className="text-[14px] text-white">×</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-[20px_24px]">
        {/* Filter Section */}
        <div className="flex justify-between items-start">
          {/* Left Column: Filters */}
          <div className="flex space-x-[64px]">
            {/* Staff Type Filter */}
            <div>
              <div className="text-[12px] font-semibold text-[#4A4A4A] mb-[8px]">
                Staff type
              </div>
              <div className="h-[32px] bg-[#E6E6E6] rounded-[4px] flex">
                {staffTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`h-[32px] px-[16px] text-[12px] font-normal rounded-[4px] ${
                      staffType === type.id
                        ? 'bg-white text-[#333333] border border-[#D0D0D0]'
                        : 'bg-[#E6E6E6] text-[#8A8A8A]'
                    }`}
                    onClick={() => setStaffType(type.id)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <div className="text-[12px] font-semibold text-[#4A4A4A] mb-[8px]">
                Status
              </div>
              <div className="h-[32px] bg-[#E6E6E6] rounded-[4px] flex">
                {statuses.map((statusOption) => (
                  <button
                    key={statusOption.id}
                    className={`h-[32px] px-[16px] text-[12px] font-normal rounded-[4px] ${
                      status === statusOption.id
                        ? 'bg-white text-[#333333] border border-[#D0D0D0]'
                        : 'bg-[#E6E6E6] text-[#8A8A8A]'
                    }`}
                    onClick={() => setStatus(statusOption.id)}
                  >
                    {statusOption.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Utility Controls */}
          <div className="flex items-center space-x-[8px]">
            <div className="w-[32px] h-[32px] bg-[#F2F2F2] rounded-[4px] flex items-center justify-center">
              <span className="text-[14px] text-[#4A4A4A]">☰</span>
            </div>
            <div className="relative">
              <select
                value={rowsCount}
                onChange={(e) => setRowsCount(e.target.value)}
                className="h-[32px] w-[48px] bg-[#F2F2F2] text-[12px] text-[#4A4A4A] pl-[8px] pr-[20px] focus:outline-none appearance-none"
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6A6A6A]">▼</span>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="mt-[24px] border border-[#E0E0E0] rounded-[8px] overflow-hidden">
          {/* Table Header Row */}
          <div className="h-[40px] bg-white grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
            {/* Checkbox Column */}
            <div className="flex items-center justify-center">
              <div className="w-[14px] h-[14px] border border-[#9E9E9E] rounded-[3px]"></div>
            </div>
            
            {/* EMPLOYMENT ID (Selected Column) */}
            <div className="bg-[#BDBDBD] text-white text-[12px] font-semibold uppercase px-[12px] flex items-center">
              EMPLOYMENT ID
            </div>
            
            {/* Other Headers */}
            {['FIRST NAME', 'SURNAME', 'PERSONAL IDENTITY NUMBER', 'STAFF TYPE', 'AGREEMENT FOR SALARIES', 'AGREEMENT TEMPLATE', 'SALARY FORM', 'TYPE OF PAY SLIP', 'CALENDAR PERMISSIONS'].map((header) => (
              <div 
                key={header}
                className="bg-white text-[#4A4A4A] text-[12px] font-semibold px-[12px] flex items-center border-l border-[#E6E6E6]"
              >
                {header}
              </div>
            ))}
          </div>
          
          {/* Table Body (Empty State) */}
          <div className="min-h-[120px] bg-white flex items-center justify-center">
            <div className="text-center text-[#757575]">
              <p>No employees found</p>
              <p className="text-[12px] mt-[4px]">Adjust filters to find employees</p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="px-[24px] pb-[20px] flex justify-end">
        <button 
          className="h-[36px] min-w-[96px] px-[20px] bg-[#9BC9A8] text-white text-[13px] font-semibold rounded-[18px] hover:bg-[#89BE98] active:bg-[#78B089] transition-colors"
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default ExportPersonnel;