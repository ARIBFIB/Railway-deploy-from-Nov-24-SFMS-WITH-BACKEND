import React, { useState } from 'react';

const ATFATKTab = () => {
  const [workingTimeEnum, setWorkingTimeEnum] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const workingTimeOptions = [
    'None',
    'Full time',
    'Part time',
    'Shift based',
    'Flexible hours',
    'Remote work',
    'Hybrid schedule'
  ];

  const handleSelect = (value: string) => {
    setWorkingTimeEnum(value);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-[#F7F7F7] p-[16px] pb-[80px] font-sans text-[12px]" style={{ fontFamily: 'Inter, Roboto, system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="bg-white mb-[16px]">
        {/* Working Time Enumeration Dropdown */}
        <div className="max-w-[420px] w-full mx-auto mt-[16px] mb-[24px]">
          <label className="block text-[13px] font-medium text-[#2B2B2B] leading-[18px] mb-[6px]">
            Working time enumeration
          </label>
          <div className="relative">
            <div
              className={`h-[36px] w-full min-w-[280px] px-[12px] py-[8px] pr-[36px] bg-white border border-[#CFCFCF] rounded-[4px] flex items-center justify-between cursor-pointer ${
                isDropdownOpen ? 'border-[#1A7F37] shadow-[0_0_0_1px_#1A7F37]' : ''
              }`}
              onClick={toggleDropdown}
              tabIndex={0}
              role="combobox"
              aria-expanded={isDropdownOpen}
              aria-controls="working-time-dropdown"
            >
              <span className={`${workingTimeEnum ? 'text-[#9B9B9B]' : 'text-[#B5B5B5]'}`}>
                {workingTimeEnum || 'None'}
              </span>
              <svg
                className={`w-[10px] h-[10px] text-[#7A7A7A] transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : 'rotate-0'
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            
            {isDropdownOpen && (
              <div
                id="working-time-dropdown"
                className="absolute top-[calc(100%+4px)] w-full bg-white border border-[#CFCFCF] rounded-[4px] z-[1000] shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
                role="listbox"
              >
                {workingTimeOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`h-[32px] px-[12px] py-[8px] text-[13px] text-[#2B2B2B] cursor-pointer ${
                      workingTimeEnum === option ? 'bg-[#E9F5EE] text-[#1A7F37]' : 'hover:bg-[#F3F3F3]'
                    }`}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={workingTimeEnum === option}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATFATKTab;