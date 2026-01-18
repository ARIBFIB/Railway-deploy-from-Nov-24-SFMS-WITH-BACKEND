import React, { useState } from 'react';
import MassUpdateSalaries from './MassUpdateSalaries';

const RetroactiveSalary = () => {
  const [activeTab, setActiveTab] = useState('retroactive-salary');
  const [toggles, setToggles] = useState({
    holiday: true,
    absenceSickness: false,
    careSickChild: false,
    otherAbsence: false,
    overtimeOB: false
  });
  
  const [filters, setFilters] = useState({
    employee: 'All',
    salaryForm: 'All',
    employeeType: 'All employee types',
    salaryFromDate: ''
  });

  const handleToggleChange = (key: keyof typeof toggles) => {
    setToggles(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, Roboto, system-ui' }}>
      {/* Page Header */}
      <div className="h-[48px] px-[16px] flex items-center justify-between bg-white border-b border-[#E6E6E6]">
        <div className="text-[14px] font-semibold text-[#333333] tracking-[0.4px] uppercase">
          MASS UPDATE SALARIES
        </div>
      </div>

      {/* Tabs Section */}
      <div className="h-[40px] px-[16px] flex gap-[24px] items-end border-b border-[#D0D0D0] bg-white">
        <button
          className={`text-[13px] font-medium pb-[10px] ${
            activeTab === 'mass-update' 
              ? 'text-[#000000] font-semibold border-b-2 border-[#0A8F3C]' 
              : 'text-[#6F6F6F] hover:text-[#333333]'
          }`}
          onClick={() => setActiveTab('mass-update')}
        >
          Mass update salaries
        </button>
        <button
          className={`text-[13px] font-semibold pb-[10px] border-b-2 border-[#0A8F3C] ${
            activeTab === 'retroactive-salary' 
              ? 'text-[#000000]' 
              : 'text-[#6F6F6F] hover:text-[#333333]'
          }`}
          onClick={() => setActiveTab('retroactive-salary')}
        >
          Retroactive salary
        </button>
      </div>

      {/* Render the appropriate tab content */}
      {activeTab === 'mass-update' ? (
        <MassUpdateSalaries />
      ) : (
        <>
          {/* Additions & Deductions Section */}
          <div className="mt-[16px]">
            <div className="mx-[16px] text-[13px] font-semibold text-[#333333] flex items-center">
              Additions & deductions included in the calculation
              <span className="ml-[6px] text-[14px] text-[#6F6F6F]">ⓘ</span>
            </div>
            
            <div className="p-[16px] flex flex-wrap gap-[32px]">
              {Object.entries(toggles).map(([key, value]) => {
                const labels: Record<string, string> = {
                  holiday: 'Holiday',
                  absenceSickness: 'Absence due to sickness',
                  careSickChild: 'Care of a sick child',
                  otherAbsence: 'Other absence',
                  overtimeOB: 'Overtime & OB'
                };
                
                return (
                  <div key={key}>
                    <div className="text-[12px] font-medium text-[#333333] mb-[4px]">
                      {labels[key]}
                    </div>
                    <div 
                      className={`w-[72px] h-[28px] border border-[#D0D0D0] rounded-[3px] flex overflow-hidden cursor-pointer ${
                        value ? 'bg-[#0A8F3C]' : 'bg-white'
                      }`}
                      onClick={() => handleToggleChange(key as keyof typeof toggles)}
                    >
                      <div 
                        className={`flex-1 flex items-center justify-center text-[12px] font-semibold ${
                          value ? 'text-white' : 'text-[#6F6F6F]'
                        }`}
                      >
                        {value ? 'On' : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Controls Section */}
          <div className="p-[16px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-[16px] items-end">
            <div>
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-[4px]">
                Select employee
              </label>
              <select
                value={filters.employee}
                onChange={(e) => setFilters({...filters, employee: e.target.value})}
                className="w-full h-[32px] px-[8px] text-[13px] border border-[#CFCFCF] rounded-[3px] bg-white"
              >
                <option>All</option>
                <option>Employee 1</option>
                <option>Employee 2</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-[4px]">
                Select salary form
              </label>
              <select
                value={filters.salaryForm}
                onChange={(e) => setFilters({...filters, salaryForm: e.target.value})}
                className="w-full h-[32px] px-[8px] text-[13px] border border-[#CFCFCF] rounded-[3px] bg-white"
              >
                <option>All</option>
                <option>Form 1</option>
                <option>Form 2</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-[4px]">
                Select employee type
              </label>
              <select
                value={filters.employeeType}
                onChange={(e) => setFilters({...filters, employeeType: e.target.value})}
                className="w-full h-[32px] px-[8px] text-[13px] border border-[#CFCFCF] rounded-[3px] bg-white"
              >
                <option>All employee types</option>
                <option>Type 1</option>
                <option>Type 2</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-[4px]">
                New salary from date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={filters.salaryFromDate}
                  onChange={(e) => setFilters({...filters, salaryFromDate: e.target.value})}
                  className="w-full h-[32px] px-[8px] text-[13px] border border-[#CFCFCF] rounded-[3px] bg-white pr-[28px]"
                />
                <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#6F6F6F]">📅</span>
              </div>
            </div>
            
            <button className="h-[32px] px-[16px] text-[13px] font-semibold text-white bg-[#8C8C8C] rounded-[16px] hover:bg-[#7A7A7A] self-end">
              Clear
            </button>
          </div>

          {/* Status Legend Buttons */}
          <div className="px-[16px] flex gap-[8px]">
            <div className="h-[32px] px-[12px] text-[12px] border border-[#D0D0D0] rounded-[3px] bg-white flex items-center">
              <div className="w-3 h-3 bg-[#B3E5FC] rounded-sm mr-[6px]"></div>
              To be calculated
            </div>
            <div className="h-[32px] px-[12px] text-[12px] border border-[#D0D0D0] rounded-[3px] bg-white flex items-center">
              <div className="w-3 h-3 bg-[#C8E6C9] rounded-sm mr-[6px]"></div>
              Transferred to salary
            </div>
          </div>

          {/* Density / View Controls (Top Right) - Positioned using absolute or relative */}
          <div className="flex justify-end mr-[16px] mt-[8px]">
            <button className="w-[28px] h-[28px] bg-[#F0F0F0] rounded-[3px] flex items-center justify-center text-[12px] text-[#4F4F4F]">
              <span>List</span>
            </button>
          </div>

          {/* Data Table */}
          <div className="m-[16px] border border-[#E0E0E0] rounded-[6px] overflow-hidden">
            <div className="h-[36px] bg-[#F5F5F5] border-b-[2px] border-b-[#BDBDBD] grid grid-cols-[36px_90px_180px_160px_200px_200px_160px_140px_140px_120px]">
              <div className="flex items-center justify-center">
                <div className="w-[14px] h-[14px] border border-[#9E9E9E] rounded-[2px]"></div>
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                ANST. ID
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                First Name
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                Surname
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                Payment Period
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                Salary Form
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                Staff Type
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                Salary From
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                New Salary
              </div>
              <div className="text-[12px] font-semibold text-[#333333] uppercase px-[8px] flex items-center">
                Total
              </div>
            </div>
            
            {/* Empty table rows */}
            <div className="h-[40px] border-b border-[#E0E0E0] grid grid-cols-[36px_90px_180px_160px_200px_200px_160px_140px_140px_120px]">
              {Array(10).fill(0).map((_, idx) => (
                <div key={idx} className="px-[8px] flex items-center border-r border-[#E0E0E0] last:border-r-0"></div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RetroactiveSalary;