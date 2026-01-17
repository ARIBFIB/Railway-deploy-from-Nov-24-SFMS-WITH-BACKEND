import React, { useState } from 'react';

const SickPayPeriodStats = () => {
  const [month, setMonth] = useState('All');
  const [employee, setEmployee] = useState('All');
  
  return (
    <div className="bg-white max-w-[360px] md:max-w-6xl mx-auto" style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px' }}>
      {/* Header Row with Labels */}
      <div className="flex justify-between items-center p-[16px] border-b border-[#D3D3D3]">
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            MONTH
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            ANST. ID
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            FIRST NAME
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            SURNAME
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            PERSONAL ID NUMBER
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            START DATE
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            STOP DAY
          </div>
        </div>
        <div className="flex-1">
          <div className="text-[10px] md:text-[12px] font-bold text-[#333333] uppercase">
            NUMBER OF DAYS
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
          <label className="text-[11px] text-[#333333] block mb-[4px]">Employee</label>
          <div className="relative">
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none hover:bg-[#F2F2F2]"
            >
              <option>All</option>
              <option>Employee 1</option>
              <option>Employee 2</option>
              <option>Employee 3</option>
            </select>
            <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="w-full overflow-x-auto bg-white border-t border-[#D3D3D3] mt-[8px]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="h-[38px] bg-white border-b border-[#D3D3D3]">
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                MONTH
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center bg-[#B8B8B8] border-r border-[#D3D3D3]">
                ANST. ID
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                FIRST NAME
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                SURNAME
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                PERSONAL ID NUMBER
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                START DATE
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                STOP DAY
              </th>
              <th className="px-[8px] text-[10px] md:text-[12px] font-bold text-[#333333] uppercase text-center border-r border-[#D3D3D3]">
                NUMBER OF DAYS
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-[48px] bg-white border-t border-[#D3D3D3] hover:bg-[#F2F2F2]">
              {Array(8).fill(0).map((_, idx) => (
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
          <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#5DBB63] rounded-[6px]">
            Create File
          </button>
        </div>
      </div>
    </div>
  );
};

export default SickPayPeriodStats;