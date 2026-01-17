import React, { useState } from 'react';

const SwedishIndustrySalaryStatistics = () => {
  const [interval, setInterval] = useState('All');
  const [cfrNumber, setCfrNumber] = useState('All');
  const [employee, setEmployee] = useState('All');
  
  return (
    <div className="bg-white max-w-[360px] md:max-w-6xl mx-auto" style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px' }}>
      {/* Filter Section */}
      <div className="p-[12px] bg-white border-b border-[#E5E7EB]" style={{ gap: '10px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
          <div>
            <label className="text-[12px] text-[#374151] block mb-[4px]">Interval</label>
            <div className="relative">
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] appearance-none px-[10px] pr-[28px] focus:outline-none"
              >
                <option>All</option>
                <option>Interval 1</option>
                <option>Interval 2</option>
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6B7280] pointer-events-none">▼</span>
            </div>
          </div>
          
          <div>
            <label className="text-[12px] text-[#374151] block mb-[4px]">CFAR number</label>
            <div className="relative">
              <select
                value={cfrNumber}
                onChange={(e) => setCfrNumber(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] appearance-none px-[10px] pr-[28px] focus:outline-none"
              >
                <option>All</option>
                <option>CFAR 1</option>
                <option>CFAR 2</option>
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6B7280] pointer-events-none">▼</span>
            </div>
          </div>
          
          <div>
            <label className="text-[12px] text-[#374151] block mb-[4px]">Employee</label>
            <div className="relative">
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] appearance-none px-[10px] pr-[28px] focus:outline-none"
              >
                <option>All</option>
                <option>Employee 1</option>
                <option>Employee 2</option>
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6B7280] pointer-events-none">▼</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Utility Controls */}
      <div className="flex justify-end p-[12px] mt-[8px] bg-white">
        <div className="flex items-center gap-[6px]">
          <button className="w-[32px] h-[32px] border border-[#E5E7EB] rounded-[6px] bg-[#F3F4F6] flex items-center justify-center">
            <span className="text-[14px] text-[#374151]">📋</span>
          </button>
          <div className="relative">
            <span className="text-[12px] font-medium text-[#111827]">0</span>
            <span className="text-[10px] text-[#6B7280] ml-[4px]">▼</span>
          </div>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="w-full overflow-x-auto bg-white border-t border-[#E5E7EB] mt-[8px]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="h-[38px] bg-white border-b border-[#E5E7EB]">
              {['☐', 'FIRST DAY', 'LAST DAY', 'ANST. ID', 'FIRST NAME', 'SURNAME', 'OCCUPATIONAL CODE', 'CFAR NUMBER', 'FEDERATION NUMBER', 'AGREEMENT CODE', 'TOTAL HOURS WORKED'].map((header, index) => (
                <th 
                  key={header}
                  className={`px-[8px] text-[11px] font-bold text-[#374151] uppercase text-left ${
                    index === 3 
                      ? 'bg-[#BDBDBD] text-white font-bold' 
                      : ''
                  } border-r border-[#E5E7EB] last:border-r-0`}
                  style={{ fontSize: '11px', lineHeight: '1.2' }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="h-[56px] bg-white border-t border-[#E5E7EB]">
              {Array(11).fill(0).map((_, idx) => (
                <td key={idx} className="px-[8px] text-[11px] text-[#374151] border-r border-[#E5E7EB] last:border-r-0"></td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SwedishIndustrySalaryStatistics;