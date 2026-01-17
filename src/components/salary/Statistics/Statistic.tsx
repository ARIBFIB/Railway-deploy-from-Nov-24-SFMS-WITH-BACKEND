import React, { useState } from 'react';
import SwedishIndustrySalaryStatistics from './SwedishIndustrySalaryStatistics';
import SCBShortTermStatistics from './SCBShortTermStatistics';
import SCBShortTermBusinessStatistics from './SCBShortTermBusinessStatistics';
import SickPayPeriodStats from './SickPayPeriodStats';
import PrivateSectorStats from './PrivateSectorStats';

const Statistic = () => {
  const [activeTab, setActiveTab] = useState('SCB Salary Structure Statistics (SLP)');
  const [month, setMonth] = useState('September 2026');
  const [cfrNumber, setCfrNumber] = useState('All');
  const [employee, setEmployee] = useState('All');
  
  const tabs = [
    'SCB Salary Structure Statistics (SLP)',
    'Swedish industry salary statistics',
    'SCB Short-term Statistics (KLP)',
    'SCB Short-term Business Statistics on Sick Pay (KSJU)',
    'Statistics Sweden Sickness absence during the sick-pay period (SUS)',
    'Statistics Sweden Short-term employment statistics for the private sector (KSP)'
  ];

  // Define all specialized tabs that have their own components
  const specializedTabs = [
    'Swedish industry salary statistics',
    'SCB Short-term Statistics (KLP)',
    'SCB Short-term Business Statistics on Sick Pay (KSJU)',
    'Statistics Sweden Sickness absence during the sick-pay period (SUS)',
    'Statistics Sweden Short-term employment statistics for the private sector (KSP)'
  ];

  return (
    <div className="bg-white max-w-[360px] md:max-w-6xl mx-auto" style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px' }}>
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-[8px] p-[12px] border-b border-[#E5E7EB]">
        <div className="text-[14px] font-bold text-[#111827] tracking-[0.2px]">
          {activeTab}
        </div>
        
        <div className="flex items-center gap-[8px] w-full md:w-auto">
          <div className="relative flex-1 max-w-[200px]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] pl-[32px] pr-[10px] py-[6px] bg-white text-[12px] text-[#111827] placeholder-[#6B7280] focus:outline-none"
            />
            <span className="absolute left-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#6B7280]">🔍</span>
          </div>
          
          <button className="flex items-center text-[12px] font-semibold text-[#111827] bg-[#FACC15] px-[14px] py-[6px] rounded-[16px] h-[32px] whitespace-nowrap">
            <span className="text-[12px] mr-[6px]">+</span>
            Create SLP
          </button>
        </div>
      </div>
      
      {/* Top Navigation Tabs */}
      <div className="p-[12px] bg-white border-b border-[#E5E7EB]">
        <div className="flex flex-wrap gap-[4px] pb-[2px]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-[36px] px-[10px] text-[12px] font-medium whitespace-nowrap ${
                activeTab === tab
                  ? 'text-[#111827] border-b-2 border-[#16A34A] font-bold'
                  : 'text-[#374151]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content based on active tab */}
      {activeTab === 'Swedish industry salary statistics' ? (
        <SwedishIndustrySalaryStatistics />
      ) : activeTab === 'SCB Short-term Statistics (KLP)' ? (
        <SCBShortTermStatistics />
      ) : activeTab === 'SCB Short-term Business Statistics on Sick Pay (KSJU)' ? (
        <SCBShortTermBusinessStatistics />
      ) : activeTab === 'Statistics Sweden Sickness absence during the sick-pay period (SUS)' ? (
        <SickPayPeriodStats />
      ) : activeTab === 'Statistics Sweden Short-term employment statistics for the private sector (KSP)' ? (
        <PrivateSectorStats />
      ) : (
        <div>
          {/* Default content for SCB Salary Structure Statistics (SLP) and other tabs */}
          
          {/* Filter Section */}
          <div className="p-[12px] bg-white" style={{ gap: '10px' }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px]">
              <div>
                <label className="text-[12px] text-[#6B7280] block mb-[4px]">Month</label>
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] appearance-none px-[10px] pr-[28px] focus:outline-none"
                  >
                    <option>September 2026</option>
                    <option>August 2026</option>
                    <option>July 2026</option>
                  </select>
                  <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6B7280] pointer-events-none">▼</span>
                </div>
              </div>
              
              <div>
                <label className="text-[12px] text-[#6B7280] block mb-[4px]">CFAR number</label>
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
                <label className="text-[12px] text-[#6B7280] block mb-[4px]">Employee</label>
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
          
          {/* Utility Icons */}
          <div className="flex justify-end p-[8px] bg-white">
            <div className="flex items-center gap-[6px]">
              <button className="w-[32px] h-[32px] border border-[#E5E7EB] rounded-[6px] bg-[#F3F4F6] flex items-center justify-center">
                <span className="text-[12px] text-[#374151]">📋</span>
              </button>
              <button className="w-[32px] h-[32px] border border-[#E5E7EB] rounded-[6px] bg-[#F3F4F6] flex items-center justify-center">
                <span className="text-[12px] text-[#374151]">📊</span>
              </button>
              <span className="text-[11px] text-[#374151]">0</span>
            </div>
          </div>
          
          {/* Data Table */}
          <div className="w-full overflow-x-auto bg-white border-t border-[#E5E7EB] mt-[8px]">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="h-[38px] bg-white">
                  {['☐', 'FIRST DAY', 'LAST DAY', 'EMPLOYEE ID', 'FIRST NAME', 'SURNAME', 'OCCUPATIONAL CODE', 'CFAR NUMBER', 'TOTAL HOURS WORKED'].map((header, index) => (
                    <th 
                      key={header}
                      className={`px-[8px] text-[11px] font-bold text-[#374151] uppercase text-left ${
                        index === 3 
                          ? 'bg-[#B8B8B8] text-white' 
                          : ''
                      } border-r border-[#E5E7EB] last:border-r-0`}
                      style={{ fontSize: '11px' }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="h-[48px] bg-white border-t border-[#E5E7EB]">
                  {Array(9).fill(0).map((_, idx) => (
                    <td key={idx} className="px-[8px] text-[11px] text-[#374151] border-r border-[#E5E7EB] last:border-r-0"></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Footer Action Bar */}
          <div className="sticky bottom-0 p-[10px] bg-white border-t border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-[8px]">
            <div className="text-[11px] text-[#6B7280]">
              (0 selected)
            </div>
            
            <div className="flex items-center gap-[6px] flex-wrap md:flex-nowrap">
              <button className="h-[30px] px-[12px] text-[11px] text-[#9CA3AF] bg-[#E5E7EB] rounded-[15px]" disabled>
                Delete
              </button>
              <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#9CCDB3] rounded-[16px]">
                Print
              </button>
              <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#86C5A4] rounded-[16px]">
                Create file
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistic;