import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface CalendarListProps {
  onImportHistoryClick?: () => void;
  onExportSalaryRecordClick?: () => void;
}

const CalendarList = ({ onImportHistoryClick, onExportSalaryRecordClick }: CalendarListProps) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleImportSalaryRecordClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Page Header */}
      <div className="px-[16px] py-[16px] border-b border-[#E6E6E6]">
        <h1 className="text-[18px] font-semibold text-[#333333]">Salary Calendar</h1>
        <p className="text-[12px] text-[#666666] mt-[4px]">Manage and organize your salary records</p>
      </div>
      {/* Top Filter / Action Bar */}
      <div className="h-[48px] px-[16px] py-[8px] flex items-center justify-between bg-white border-b border-[#E6E6E6]">
        {/* Filter Buttons */}
        <div className="flex gap-[6px]">
          <button
            className={`h-[32px] min-w-[64px] px-[12px] text-[12px] font-medium rounded-[4px] ${
              activeFilter === 'all'
                ? 'bg-[#6F6F6F] border border-[#6F6F6F] text-white'
                : 'bg-white border border-[#D0D0D0] text-[#4A4A4A]'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`h-[32px] min-w-[64px] px-[12px] text-[12px] font-medium rounded-[4px] ${
              activeFilter === 'active'
                ? 'bg-[#6F6F6F] border border-[#6F6F6F] text-white'
                : 'bg-white border border-[#D0D0D0] text-[#4A4A4A]'
            }`}
            onClick={() => setActiveFilter('active')}
          >
            Active
          </button>
          <button
            className={`h-[32px] min-w-[64px] px-[12px] text-[12px] font-medium rounded-[4px] ${
              activeFilter === 'inactive'
                ? 'bg-[#6F6F6F] border border-[#6F6F6F] text-white'
                : 'bg-white border border-[#D0D0D0] text-[#4A4A4A]'
            }`}
            onClick={() => setActiveFilter('inactive')}
          >
            Inactive
          </button>
        </div>

        {/* Right-Side Controls */}
        <div className="flex items-center gap-[8px]">
          <div className="w-[32px] h-[32px] bg-[#F5F5F5] rounded-[4px] flex items-center justify-center">
            <span className="text-[16px] text-[#4A4A4A]">☰</span>
          </div>
          <div className="flex items-center px-[8px] py-[6px] text-[12px] font-medium text-[#4A4A4A] bg-[#F5F5F5] rounded-[4px]">
            <span>0</span>
            <span className="ml-[4px] text-[8px]">▼</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-[16px] py-[16px] flex gap-[24px] items-center flex-wrap md:flex-nowrap border-b border-[#E6E6E6]">
        <button 
          className="flex items-center text-[13px] font-medium text-[#4A4F55] cursor-pointer hover:text-[#2F3A40] py-[6px] px-[8px] rounded-[4px] hover:bg-[#F5F5F5] transition-colors"
          onClick={onImportHistoryClick}
        >
          <span className="text-[18px] mr-[8px]">📥</span>
          Import history
        </button>
        <button 
          className="flex items-center text-[13px] font-medium text-[#4A4F55] cursor-pointer hover:text-[#2F3A40] py-[6px] px-[8px] rounded-[4px] hover:bg-[#F5F5F5] transition-colors"
          onClick={handleImportSalaryRecordClick}
        >
          <span className="text-[18px] mr-[8px]">📤</span>
          Import salary record
        </button>
        <button 
          className="flex items-center text-[13px] font-medium text-[#4A4F55] cursor-pointer hover:text-[#2F3A40] py-[6px] px-[8px] rounded-[4px] hover:bg-[#F5F5F5] transition-colors"
          onClick={onExportSalaryRecordClick}
        >
          <span className="text-[18px] mr-[8px]">📄</span>
          Export salary record
        </button>
        <button 
          className="flex items-center text-[13px] font-medium text-[#4A4F55] cursor-pointer hover:text-[#2F3A40] py-[6px] px-[8px] rounded-[4px] hover:bg-[#F5F5F5] transition-colors"
          onClick={() => navigate('/salary?tab=retroactive-salary')}
        >
          <span className="text-[18px] mr-[8px]">🔄</span>
          Retroactive salary
        </button>
        <button 
          className="flex items-center text-[13px] font-medium text-[#4A4F55] cursor-pointer hover:text-[#2F3A40] py-[6px] px-[8px] rounded-[4px] hover:bg-[#F5F5F5] transition-colors"
          onClick={() => navigate('/salary?tab=mass-update')}
        >
          <span className="text-[18px] mr-[8px]">✏️</span>
          Mass update salaries
        </button>
      </div>

      {/* Table Container */}
      <div className="mt-[12px] mx-[16px] border border-[#E0E0E0] rounded-[6px] overflow-hidden">
        {/* Table Header Row */}
        <div className="h-[40px] bg-[#F8F8F8] border-b border-[#E0E0E0] grid grid-cols-[80px_140px_140px_240px_140px_140px] md:grid-cols-[100px_160px_160px_280px_160px_160px]" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
          <div 
            className="text-[12px] font-semibold text-white uppercase px-[12px] flex items-center bg-[#BDBDBD] rounded-l-[6px] border-r border-[#E0E0E0]"
            style={{ whiteSpace: 'nowrap' }}
          >
            ANST. ID
          </div>
          <div 
            className="text-[12px] font-semibold text-[#3F3F3F] uppercase px-[12px] flex items-center"
            style={{ whiteSpace: 'nowrap' }}
          >
            FIRST NAME
          </div>
          <div 
            className="text-[12px] font-semibold text-[#3F3F3F] uppercase px-[12px] flex items-center"
            style={{ whiteSpace: 'nowrap' }}
          >
            SURNAME
          </div>
          <div 
            className="text-[12px] font-semibold text-[#3F3F3F] uppercase px-[12px] flex items-center"
            style={{ whiteSpace: 'nowrap' }}
          >
            PERSONAL IDENTITY NUMBER
          </div>
          <div 
            className="text-[12px] font-semibold text-[#3F3F3F] uppercase px-[12px] flex items-center"
            style={{ whiteSpace: 'nowrap' }}
          >
            STAFF TYPE
          </div>
          <div 
            className="text-[12px] font-semibold text-[#3F3F3F] uppercase px-[12px] flex items-center"
            style={{ whiteSpace: 'nowrap' }}
          >
            SALARY FORM
          </div>
        </div>

        {/* Table Body (Empty State) */}
        <div className="bg-white h-[200px] flex items-center justify-center">
          <div className="text-center text-[#757575]">
            <div className="text-[24px] mb-[8px]">📋</div>
            <p className="text-[14px] font-medium">No salary records found</p>
            <p className="text-[12px] mt-[4px]">Add new salary records to get started</p>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            // Process the imported salary record file here
            console.log('Imported salary record:', file.name);
          }
        }}
      />
    </div>
  );
};

export default CalendarList;