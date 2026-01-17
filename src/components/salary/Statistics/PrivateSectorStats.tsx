import React, { useState } from 'react';

const PrivateSectorStats = () => {
  const [cfrNumber, setCfrNumber] = useState('All');
  
  return (
    <div className="bg-white max-w-[360px] md:max-w-6xl mx-auto" style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px' }}>
      {/* Header Row with Labels */}
      {/* <div className="flex justify-between items-center p-[16px] border-b border-[#D3D3D3]">
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            MEASUREMENT DAY
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            CFAR NUMBER
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            EMPLOYEES TOTAL
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            PERMANENT EMPLOYEES
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            TEMPORARY EMPLOYEES
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            ABSENCE TOTAL
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            ABSENCE SICK
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            ABSENCE HOLIDAY
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            ABSENCE OTHER
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            NEW EMPLOYEES TOTAL
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            NEW EMPLOYEES PERMANENT
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            NEW TEMPORARY EMPLOYEES
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            RETIRED TOTAL
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            RETIRED PERMANENT EMPLOYEES
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            RETIRED TEMPORARY EMPLOYEES
          </div>
        </div>
        <div className="flex items-center gap-[8px] ml-[16px]">
          <div className="text-[16px] text-[#B5B5B5]">☰</div>
          <div className="text-[12px] text-[#B5B5B5]">0</div>
        </div>
      </div> */}
      
      {/* CFAR Number Dropdown */}
      <div className="px-[16px] py-[12px]">
        <div className="w-full max-w-[200px]">
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
              <option>CFAR 4</option>
            </select>
            <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="w-full overflow-x-auto bg-white border-t border-[#D3D3D3] mt-[8px]">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="h-[38px] bg-white border-b border-[#D3D3D3]">
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3] bg-[#B8B8B8]">
                MEASUREMENT DAY
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                CFAR NUMBER
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                EMPLOYEES TOTAL
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                PERMANENT EMPLOYEES
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                TEMPORARY EMPLOYEES
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                ABSENCE TOTAL
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                ABSENCE SICK
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                ABSENCE HOLIDAY
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                ABSENCE OTHER
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                NEW EMPLOYEES TOTAL
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                NEW EMPLOYEES PERMANENT
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                NEW TEMPORARY EMPLOYEES
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                RETIRED TOTAL
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                RETIRED PERMANENT EMPLOYEES
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                RETIRED TEMPORARY EMPLOYEES
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-[48px] bg-white border-t border-[#D3D3D3] hover:bg-[#F2F2F2]">
              {Array(15).fill(0).map((_, idx) => (
                <td key={idx} className="px-[8px] text-[11px] text-[#333333] text-center border-r border-[#D3D3D3]"></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Action Bar (Bottom) */}
      <div className="sticky bottom-0 p-[10px] bg-white border-t border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-[8px]">
        <div className="text-[11px] text-[#6B7280]">
          (0 selected)
        </div>
        
        <div className="flex items-center gap-[6px] flex-wrap md:flex-nowrap">
          <button className="h-[32px] px-[12px] text-[11px] text-[#FFFFFF] bg-[#D3D3D3] rounded-[6px]">
            Delete
          </button>
          <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#7BC141] rounded-[6px]">
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateSectorStats;