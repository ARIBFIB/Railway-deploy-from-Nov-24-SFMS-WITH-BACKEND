import React, { useState, useEffect } from 'react';

const BalanceBroughtForwardTab = () => {
  const [initialHolidayValuesExpanded, setInitialHolidayValuesExpanded] = useState(true);
  const [startingSalaryExpanded, setStartingSalaryExpanded] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
  // Event handlers for draggable modal
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const modalRect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - modalRect.left,
      y: e.clientY - modalRect.top
    });
  };
    
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
        
      // Calculate new position with constraints
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;
        
      // Prevent dragging completely off-screen
      newX = Math.max(-200, Math.min(newX, viewportWidth - 120));
      newY = Math.max(-100, Math.min(newY, viewportHeight - 100));
        
      setModalPosition({ x: newX, y: newY });
    }
  };
    
  const handleMouseUp = () => {
    setIsDragging(false);
  };
    
  // Add mouse event listeners when dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
        
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
    
  // Center modal when it first opens
  useEffect(() => {
    if (showErrorModal) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      setModalPosition({
        x: (viewportWidth - 320) / 2,
        y: (viewportHeight - 200) / 2
      });
    }
  }, [showErrorModal]);
    
  // State for top input grid
  const [openingFlextime, setOpeningFlextime] = useState('');
  const [changeDuringYearFlextime, setChangeDuringYearFlextime] = useState('');
  
  const [openingCompTime, setOpeningCompTime] = useState('');
  const [changeDuringYearCompTime, setChangeDuringYearCompTime] = useState('');
  
  // State for accordion sections
  const [initialHolidayValues, setInitialHolidayValues] = useState('');
  const [startingSalary, setStartingSalary] = useState('');

  return (
    <div className="bg-[#F7F7F7] p-[16px] pb-[80px] font-sans text-[12px]" style={{ fontFamily: 'Inter, system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Opening flextime and Opening comp time */}
      <div className="grid grid-cols-3 gap-[12px] mb-[16px]">
        {/* Opening flextime */}
        <div>
          <label className="block text-[12px] text-[#2E2E2E] mb-[4px]">Opening flextime</label>
          <input
            type="number"
            className="h-[32px] w-full px-[8px] py-[6px] text-[13px] text-[#2E2E2E] border border-[#CFCFCF] rounded-[4px] bg-white"
            value={openingFlextime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpeningFlextime(e.target.value)}
          />
        </div>
        
        {/* Change during the year - flextime */}
        <div>
          <label className="block text-[12px] text-[#2E2E2E] mb-[4px]">Change during the year</label>
          <input
            type="number"
            className="h-[32px] w-full px-[8px] py-[6px] text-[13px] text-[#2E2E2E] border border-[#CFCFCF] rounded-[4px] bg-white"
            value={changeDuringYearFlextime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChangeDuringYearFlextime(e.target.value)}
          />
        </div>
        
        {/* Current balance - flextime */}
        <div>
          <label className="block text-[12px] text-[#2E2E2E] mb-[4px]">Current balance</label>
          <input
            type="text"
            className="h-[32px] w-full px-[8px] py-[6px] text-[13px] text-[#6E6E6E] border border-[#CFCFCF] rounded-[4px] bg-[#F7F7F7] cursor-not-allowed"
            value={parseFloat(openingFlextime || '0') + parseFloat(changeDuringYearFlextime || '0')}
            readOnly
          />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-[12px] mb-[16px]">
        {/* Opening comp time */}
        <div>
          <label className="block text-[12px] text-[#2E2E2E] mb-[4px]">Opening comp time</label>
          <input
            type="number"
            className="h-[32px] w-full px-[8px] py-[6px] text-[13px] text-[#2E2E2E] border border-[#CFCFCF] rounded-[4px] bg-white"
            value={openingCompTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOpeningCompTime(e.target.value)}
          />
        </div>
        
        {/* Change during the year - comp time */}
        <div>
          <label className="block text-[12px] text-[#2E2E2E] mb-[4px]">Change during the year</label>
          <input
            type="number"
            className="h-[32px] w-full px-[8px] py-[6px] text-[13px] text-[#2E2E2E] border border-[#CFCFCF] rounded-[4px] bg-white"
            value={changeDuringYearCompTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setChangeDuringYearCompTime(e.target.value)}
          />
        </div>
        
        {/* Current balance - comp time */}
        <div>
          <label className="block text-[12px] text-[#2E2E2E] mb-[4px]">Current balance</label>
          <input
            type="text"
            className="h-[32px] w-full px-[8px] py-[6px] text-[13px] text-[#6E6E6E] border border-[#CFCFCF] rounded-[4px] bg-[#F7F7F7] cursor-not-allowed"
            value={parseFloat(openingCompTime || '0') + parseFloat(changeDuringYearCompTime || '0')}
            readOnly
          />
        </div>
      </div>
      
      {/* Initial holiday values – Basis for calculation (accordion) */}
      <div className="w-full bg-white">
        <div 
          className="h-[36px] py-[0px] px-[12px] flex items-center gap-[8px] border-t border-[#E6E6E6] cursor-pointer"
          onClick={() => setInitialHolidayValuesExpanded(!initialHolidayValuesExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' || e.key === ' ' ? setInitialHolidayValuesExpanded(!initialHolidayValuesExpanded) : null}
          aria-expanded={initialHolidayValuesExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 ${initialHolidayValuesExpanded ? 'rotate-0' : '-rotate-90'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#2E2E2E] leading-[20px]">
            Initial holiday values – Basis for calculation
          </h3>
        </div>
        
        {initialHolidayValuesExpanded && (
          <div className="p-[24px] bg-white">
            {/* Page Title */}
            <h2 className="text-[14px] font-semibold text-[#1E88E5] leading-[20px] mb-[16px]">
              Explanations and calculations
            </h2>
            
            {/* Desktop grid: 4 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-[32px]">
              {/* Column 1: Holiday-entitled salary */}
              <div>
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Holiday-entitled salary
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Total salary
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Of which pay variable supplement
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Salary for time worked
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
              </div>
              
              {/* Column 2: Holiday-entitled attendance */}
              <div>
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Holiday-entitled attendance
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Attendance in days
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Attendance in hours
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
              </div>
              
              {/* Column 3: Absence days */}
              <div>
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Absence days
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Holiday pay-entitled
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Not holiday pay-entitled
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
              </div>
              
              {/* Column 4: Absence in hours */}
              <div>
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Absence in hours
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Holiday pay-entitled
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Not holiday pay-entitled
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            
            {/* Second row of sections */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-[32px] mt-[28px]">
              {/* Column 1: Average pay per day */}
              <div>
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Average pay per day
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Calculated average salary per day
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Calculated variable per day
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
              </div>
              
              {/* Column 2: Average salary per hour */}
              <div>
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Average salary per hour
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Calculated average salary per hour
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Calculated variable per hour
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
              </div>
              
              {/* Column 3: Non-holiday-entitled calendar days */}
              <div>
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Non-holiday-entitled calendar days
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Full days that affect the number of holiday days
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Part of the day that affects the employment rate
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
              </div>
              
              {/* Column 4: Holiday-entitled calendar days */}
              <div>
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Holiday-entitled calendar days
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Full days that do not affect the number of holiday days
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            
            {/* Taken holidays section - spans 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-[32px] mt-[28px]">
              <div className="sm:col-span-2">
                <h3 className="text-[13px] font-bold text-[#333333] mb-[28px]">
                  Taken holidays
                </h3>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Vacation days taken
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Number of paid holiday allowances (days)
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                    placeholder=""
                  />
                </div>
                
                <div className="mb-[28px]">
                  <label className="block text-[12px] font-normal text-[#5F6368] mb-[12px]">
                    Calculated value
                    <svg 
                      className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    className="w-full h-[40px] px-[12px] py-[10px] text-[13px] text-[#5F6368] border border-[#DADCE0] rounded-[4px] bg-[#FAFAFA] cursor-not-allowed text-right"
                    value="0,00"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Starting salary section */}
      <div className="w-full bg-white">
        {/* Section Header (Dropdown Trigger) */}
        <div 
          className="h-[48px] px-[16px] flex items-center cursor-pointer"
          onClick={() => setStartingSalaryExpanded(!startingSalaryExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' || e.key === ' ' ? setStartingSalaryExpanded(!startingSalaryExpanded) : null}
          aria-expanded={startingSalaryExpanded}
        >
          <svg 
            className={`w-[14px] h-[14px] text-[#1A7F37] transition-transform duration-200 mr-[8px] ${startingSalaryExpanded ? 'rotate-90' : 'rotate-0'}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
          <svg className="w-[16px] h-[16px] text-[#2E7D32] mr-[8px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-[14px] font-bold text-[#333333] mr-[8px]">
            Starting salary
          </h3>
          <svg 
            className="w-[16px] h-[16px] text-[#1E88E5] cursor-help"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        
        {/* Content Area (Expanded State) */}
        {startingSalaryExpanded && (
          <div className="p-[12px] bg-white">
            {/* Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr className="h-[44px] bg-[#FAFAFA] border-b border-[#E0E0E0]">
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-left py-[12px] px-[12px]" style={{width: '160px'}}>
                      SALARY TYPE
                    </th>
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-left py-[12px] px-[12px]" style={{width: '260px'}}>
                      NAME
                    </th>
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-center py-[12px] px-[12px]" style={{width: '90px'}}>
                      QUANTITY
                    </th>
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-center py-[12px] px-[12px]" style={{width: '80px'}}>
                      UNIT
                    </th>
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-right py-[12px] px-[12px]" style={{width: '110px'}}>
                      AMOUNT
                    </th>
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-right py-[12px] px-[12px]" style={{width: '110px'}}>
                      TOTAL
                    </th>
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-right py-[12px] px-[12px]" style={{width: '120px'}}>
                      EXPENSES
                    </th>
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-center py-[12px] px-[12px]" style={{width: '90px'}}>
                      VAT
                    </th>
                    <th className="text-[12px] font-bold text-[#555555] uppercase text-left py-[12px] px-[12px]" style={{width: '140px'}}>
                      TEXT ROW
                    </th>
                  </tr>
                </thead>
                <tbody className="border-t border-[#E0E0E0]">
                  <tr>
                    <td className="py-[12px] px-[12px] align-top" style={{width: '160px'}}>
                      <div>
                        <label className="text-[12px] text-[#555555]">
                          Preliminary tax deducted
                          <svg 
                            className="w-[14px] h-[14px] text-[#1E88E5] inline ml-[6px] align-middle"
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 16v-4m0-4h.01" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </label>
                        <input
                          type="text"
                          className="block w-[240px] h-[36px] mt-[6px] px-[12px] py-[8px] text-[13px] text-[#000000] border border-[#DADCE0] rounded-[4px] bg-white"
                          placeholder=""
                        />
                      </div>
                    </td>
                    <td className="py-[12px] px-[12px]" style={{width: '260px'}}></td>
                    <td className="py-[12px] px-[12px] text-center" style={{width: '90px'}}></td>
                    <td className="py-[12px] px-[12px] text-center" style={{width: '80px'}}></td>
                    <td className="py-[12px] px-[12px] text-right" style={{width: '110px'}}></td>
                    <td className="py-[12px] px-[12px] text-right" style={{width: '110px'}}></td>
                    <td className="py-[12px] px-[12px] text-right" style={{width: '120px'}}></td>
                    <td className="py-[12px] px-[12px] text-center" style={{width: '90px'}}></td>
                    <td className="py-[12px] px-[12px]" style={{width: '140px'}}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-[#E0E0E0] flex justify-between items-center px-[24px] z-[1000]">
        <button 
          className="h-[36px] px-[20px] bg-[#D6D6D6] text-white text-[13px] font-bold rounded-[18px] cursor-not-allowed"
          disabled
          aria-label="Delete record"
        >
          Delete
        </button>
        <div className="flex items-center space-x-[12px]">
          <button 
            className="h-[36px] px-[20px] bg-[#8E8E8E] text-white text-[13px] font-bold rounded-[18px] cursor-pointer"
            aria-label="Cancel changes"
          >
            Cancel
          </button>
          <button 
            className="h-[36px] px-[22px] bg-[#007A33] text-white text-[13px] font-bold rounded-[18px] cursor-pointer hover:bg-[#00662A]"
            aria-label="Save changes"
            onClick={() => setShowErrorModal(true)}
          >
            Save
          </button>
        </div>
      </div>
      
      {/* Draggable Error Modal */}
      {showErrorModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]"
          onClick={() => setShowErrorModal(false)}
        >
          <div 
            className="modal-container w-[320px] max-w-[90vw] min-h-[180px] bg-white rounded-[8px] overflow-hidden shadow-[0px_8px_24px_rgba(0,0,0,0.18)]"
            style={{
              position: 'fixed',
              left: `${modalPosition.x}px`,
              top: `${modalPosition.y}px`,
              transform: 'translate(0, 0)',
            }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Top Bar (Drag Handle) */}
            <div 
              className="modal-header h-[48px] w-full bg-[#757575] flex items-center justify-center cursor-grab active:cursor-grabbing px-[12px]"
              onMouseDown={handleMouseDown}
            >
              <span className="text-[14px] font-bold text-[#FFFFFF] tracking-[0.8px] uppercase">
                TO HANDLE
              </span>
              <button 
                className="absolute right-[12px] top-[12px] w-[16px] h-[16px] flex items-center justify-center cursor-pointer"
                onClick={() => setShowErrorModal(false)}
                aria-label="Close modal"
              >
                <svg className="w-[16px] h-[16px] text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Divider */}
            <div className="h-[1px] w-full bg-[#E0E0E0]"></div>
            
            {/* Content Area */}
            <div className="p-[16px] bg-white">
              <p className="text-[13px] text-[#555555] leading-[20px] mb-[12px]">
                Email and digital pay slip: When the print selection is Digital, a valid email address must be entered.
              </p>
              <p className="text-[13px] text-[#555555] leading-[20px] mb-[12px]">
                Employment date: Date of employment missing.
              </p>
              <p className="text-[13px] text-[#555555] leading-[20px]">
                The errors block the following functions: Create payslip, Create holiday calculation.
              </p>
            </div>
            
            {/* Action Button Row */}
            <div className="flex justify-between items-center px-[16px] py-[12px] pt-[16px]">
              <button 
                className="h-[36px] min-w-[88px] px-[16px] bg-[#9E9E9E] text-white text-[13px] rounded-[18px] border-none cursor-pointer"
                onClick={() => setShowErrorModal(false)}
              >
                Cancel
              </button>
              <button 
                className="h-[36px] min-w-[88px] px-[16px] bg-[#0B7A3B] text-white text-[13px] font-bold rounded-[18px] border-none cursor-pointer"
                onClick={() => setShowErrorModal(false)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceBroughtForwardTab;