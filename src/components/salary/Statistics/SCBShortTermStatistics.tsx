import React, { useState } from 'react';

const SCBShortTermStatistics = () => {
  const [month, setMonth] = useState('All');
  const [cfrNumber, setCfrNumber] = useState('All');
  
  return (
    <div className="bg-white max-w-[360px] md:max-w-6xl mx-auto" style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px' }}>
      {/* Header Row with Labels */}
      <div className="flex justify-between items-center p-[16px] border-b border-[#D3D3D3]">
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            MONTH
          </div>
        </div>
        <div className="w-[1px] h-4 bg-[#D3D3D3] mx-[4px]"></div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            CFAR NUMBER
          </div>
        </div>
        <div className="flex items-center gap-[8px] ml-[16px]">
          <div className="text-[16px] text-[#B5B5B5]">☰</div>
          <div className="text-[12px] text-[#B5B5B5]">0</div>
        </div>
      </div>
      
      {/* Dropdown Menus */}
      <div className="flex px-[16px] py-[12px] gap-[8px]">
        <div className="flex-1">
          <label className="text-[11px] text-[#333333] block mb-[4px]">Month</label>
          <div className="relative">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none hover:bg-[#F2F2F2]"
            >
              <option>All</option>
              <option>January</option>
              <option>February</option>
              <option>March</option>
              <option>April</option>
              <option>May</option>
              <option>June</option>
              <option>July</option>
              <option>August</option>
              <option>September</option>
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
            <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
          </div>
        </div>
        
        <div className="flex-1">
          <label className="text-[11px] text-[#333333] block mb-[4px]">CFAR number</label>
          <div className="relative">
            <select
              value={cfrNumber}
              onChange={(e) => setCfrNumber(e.target.value)}
              className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none hover:bg-[#F2F2F2]"
            >
              <option>All</option>
              <option>CFAR 1</option>
              <option>CFAR 2</option>
              <option>CFAR 3</option>
            </select>
            <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SCBShortTermStatistics;