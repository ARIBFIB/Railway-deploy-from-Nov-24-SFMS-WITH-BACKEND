import React, { useState } from 'react';

interface HistoryProps {
  onClose?: () => void;
}

const History: React.FC<HistoryProps> = ({ onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('All employees');
  const [selectedCategory, setSelectedCategory] = useState('Staff information');
  const [selectedField, setSelectedField] = useState('All fields');
  const [pageSize, setPageSize] = useState('25');

  // Sample employees for dropdown
  const employees = ['All employees', 'John Doe', 'Jane Smith', 'Robert Johnson'];
  
  // Sample categories for dropdown
  const categories = ['Staff information', 'Salary details', 'Employment terms', 'Personal details'];
  
  // Sample fields for dropdown
  const fields = ['All fields', 'Name', 'Address', 'Salary', 'Start date', 'End date'];

  return (
    <div 
      className="min-h-screen bg-[#F3F3F3] p-[16px]"
      style={{ 
        fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '12px',
        lineHeight: '1.4'
      }}
    >
      {/* Page Header */}
      <div className="h-[48px] px-[16px] py-[12px] bg-white border-b border-[#E5E7EB] flex items-center">
        <div className="text-[14px] font-semibold text-[#1F2937] tracking-[0.6px] uppercase">
          HISTORY
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-[16px] border-b border-[#E5E7EB]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-[12px] items-end">
          {/* From Date */}
          <div>
            <label className="block text-[11px] text-[#374151] mb-[4px]">From</label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] pr-[32px] focus:outline-none"
              />
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#9CA3AF]">📅</span>
            </div>
          </div>

          {/* To Date */}
          <div>
            <label className="block text-[11px] text-[#374151] mb-[4px]">To</label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] pr-[32px] focus:outline-none"
              />
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#9CA3AF]">📅</span>
            </div>
          </div>

          {/* Employee Dropdown */}
          <div>
            <label className="block text-[11px] text-[#374151] mb-[4px]">Employee</label>
            <div className="relative">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] pr-[24px] focus:outline-none appearance-none"
              >
                {employees.map((emp) => (
                  <option key={emp} value={emp}>{emp}</option>
                ))}
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6B7280]">▼</span>
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] text-[#374151] mb-[4px]">Category</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] pr-[24px] focus:outline-none appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6B7280]">▼</span>
            </div>
          </div>

          {/* Field Dropdown */}
          <div>
            <label className="block text-[11px] text-[#374151] mb-[4px]">Field</label>
            <div className="relative">
              <select
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] px-[10px] pr-[24px] focus:outline-none appearance-none"
              >
                {fields.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6B7280]">▼</span>
            </div>
          </div>
        </div>

        {/* Clear Selection Button */}
        <div className="flex justify-end mt-[12px]">
          <button className="h-[32px] px-[16px] bg-[#8E8E8E] text-white text-[12px] font-semibold rounded-[16px] hover:bg-[#7A7A7A] transition-colors">
            Clear selection
          </button>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex justify-end items-center gap-[8px] mt-[16px] mr-[16px]">
        <div className="w-[32px] h-[32px] bg-[#EFEFEF] rounded-[6px] flex items-center justify-center">
          <span className="text-[14px] text-[#6B7280]">☰</span>
        </div>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            className="w-[56px] h-[32px] bg-[#EFEFEF] rounded-[6px] text-[12px] text-[#111827] pl-[8px] pr-[20px] focus:outline-none appearance-none"
          >
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[12px] text-[#6B7280]">▼</span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-[8px] mx-[16px] mt-[16px]">
        <div className="h-[36px] bg-white border-b border-[#E5E7EB] grid grid-cols-[160px_160px_220px_220px_32px_140px_240px_240px]">
          {[
            { name: 'TIME', bg: 'bg-[#BDBDBD]', color: 'text-white' },
            { name: 'USERS', bg: '', color: 'text-[#374151]' },
            { name: 'EMPLOYEE', bg: '', color: 'text-[#374151]' },
            { name: 'CATEGORY', bg: '', color: 'text-[#374151]' },
            { name: '', bg: '', color: '' }, // Spacer
            { name: 'FIELD', bg: '', color: 'text-[#374151]' },
            { name: 'NEW VALUE', bg: '', color: 'text-[#374151]' },
            { name: 'OLD VALUE', bg: '', color: 'text-[#374151]' },
          ].map((header, index) => (
            <div 
              key={index}
              className={`text-[11px] font-semibold uppercase px-[8px] flex items-center tracking-[0.5px] ${header.bg} ${header.color}`}
            >
              {header.name}
            </div>
          ))}
        </div>
        
        {/* Empty Table State */}
        <div className="h-[140px] bg-white flex items-center justify-center">
          {/* Intentionally left empty */}
        </div>
      </div>

      {/* Load More Button */}
      <div className="ml-[16px] mt-[12px]">
        <button className="h-[32px] px-[18px] bg-[#9AC9A2] text-white text-[12px] font-semibold rounded-[16px] hover:bg-[#87B893] transition-colors">
          Get more
        </button>
      </div>

      {/* Footer Bar */}
      <div className="h-[56px] bg-white border-t border-[#E5E7EB] px-[16px] py-[12px] flex justify-end items-center sticky bottom-0">
        <button 
          className="h-[32px] px-[18px] bg-[#8E8E8E] text-white text-[12px] font-semibold rounded-[16px] hover:bg-[#7A7A7A] transition-colors"
          onClick={() => onClose && onClose()}
        >
          Close history
        </button>
      </div>
    </div>
  );
};

export default History;