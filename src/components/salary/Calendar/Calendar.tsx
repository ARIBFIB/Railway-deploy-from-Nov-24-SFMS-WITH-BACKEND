import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Statistic from '../Statistics/Statistic';
import Forums from '../Forums/Forums';
import Collection from '../Collection/Collection';

const Calendar = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Salary run state
  const [salaryRunTab, setSalaryRunTab] = useState<'salary-run' | 'paye-tax-return' | 'posting-basis'>('salary-run');

  const SalaryRunComponent = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('All periods');
    const [selectedEmployee, setSelectedEmployee] = useState('All employees');
    const [activeStatusFilter, setActiveStatusFilter] = useState('All');
    
    return (
      <div className="bg-white max-w-[360px] md:max-w-4xl mx-auto p-[12px]" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: '11px' }}>
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0" style={{ minHeight: '40px', padding: '8px 12px' }}>
          <div className="text-xs font-semibold text-[#212121] tracking-[0.6px] uppercase">
            SALARY RUN
          </div>
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-1.5 md:space-y-0">
            <button className="flex items-center text-[11px] font-semibold text-[#1F1F1F] bg-[#FFC107] px-[10px] py-[6px] rounded-[16px] h-[28px]">
              <span className="text-[12px] mr-[6px]">+</span>
              Create payslip
            </button>
            <button className="flex items-center text-[11px] font-semibold text-white bg-[#2E7D32] px-[10px] py-[6px] rounded-[16px] h-[28px]">
              Send payslip digitally
            </button>
          </div>
        </div>

        {/* Secondary Action Toolbar */}
        <div className="flex flex-wrap items-center py-[6px] px-[12px]" style={{ minHeight: '36px', borderBottom: '1px solid #E0E0E0' }}>
          <div className="flex items-center text-[11px] text-[#424242] mr-[14px] mb-1 md:mb-0">
            <span className="text-[14px] text-[#616161] mr-[6px]">✉️</span>
            Show scheduled
          </div>
          <div className="flex items-center text-[11px] text-[#BDBDBD] mr-[14px] mb-1 md:mb-0">
            <span className="text-[14px] mr-[6px]">💬</span>
            Comments
          </div>
          <div className="flex items-center text-[14px] text-[#616161] mr-[14px] mb-1 md:mb-0">
            <span className="mr-[6px]">🔄</span>
          </div>
          <div className="flex items-center text-[14px] text-[#616161]">
            <span className="mr-[6px]">🗑️</span>
          </div>
        </div>

        {/* Tab Navigation Section */}
        <div className="flex flex-wrap" style={{ padding: '0 12px', minHeight: '36px', borderBottom: '1px solid #E0E0E0' }}>
          <button 
            onClick={() => setSalaryRunTab('salary-run')} 
            className={`text-[11px] font-medium mr-[24px] pb-[2px] mb-1 md:mb-0 ${salaryRunTab === 'salary-run' ? 'text-[#2E7D32]' : 'text-[#757575]'}`}
          >
            Salary run
            {salaryRunTab === 'salary-run' && <div className="h-[2px] bg-[#2E7D32] mt-[1px]"></div>}
          </button>
          <button 
            onClick={() => setSalaryRunTab('paye-tax-return')} 
            className={`text-[11px] font-medium mr-[24px] pb-[2px] mb-1 md:mb-0 ${salaryRunTab === 'paye-tax-return' ? 'text-[#2E7D32]' : 'text-[#757575]'}`}
          >
            PAYE tax return
            {salaryRunTab === 'paye-tax-return' && <div className="h-[2px] bg-[#2E7D32] mt-[1px]"></div>}
          </button>
          <button 
            onClick={() => setSalaryRunTab('posting-basis')} 
            className={`text-[11px] font-medium pb-[2px] ${salaryRunTab === 'posting-basis' ? 'text-[#2E7D32]' : 'text-[#757575]'}`}
          >
            Posting basis
            {salaryRunTab === 'posting-basis' && <div className="h-[2px] bg-[#2E7D32] mt-[1px]"></div>}
          </button>
        </div>

        {/* Main Call-to-Action Card */}
        <div className="bg-[#7E7A8F] rounded-[12px] p-[12px] mt-[12px] flex flex-col md:flex-row items-start md:items-start">
          <div className="text-white flex-1 mb-4 md:mb-0 md:mr-6">
            <h3 className="font-semibold text-[13px] mb-[6px]">Time to pay salary.</h3>
            <p className="text-[11px] text-[#F5F5F5] leading-[16px] mb-[6px]">
              Click Create pay slip at the top right to create the pay run. You can also activate our help guide under Create pay slip that will guide you all the way through the payrun.
            </p>
            <p className="text-[11px] text-[#E0E0E0] leading-[16px] mb-[10px]">
              If you need to review any of the different settings that you can make in Fortnox's salary, you will find more information under Read more settings.
            </p>
            <div className="flex flex-wrap">
              <button className="text-[11px] font-semibold text-[#1F1F1F] bg-white px-[12px] py-[6px] rounded-[18px] h-[28px]">
                Create Salary run
              </button>
              <button className="text-[11px] text-white border border-white px-[12px] py-[6px] rounded-[18px] h-[28px] ml-2 mt-2 md:mt-0 md:ml-[8px]">
                Read more
              </button>
            </div>
          </div>
          {/* Hidden on XS, visible on larger screens */}
          <div className="hidden md:flex items-center justify-center bg-[#607D8B] rounded-lg w-32 h-32">
            <div className="text-center">
              <div className="text-[#4CAF50] text-xl mb-1">💰</div>
              <div className="text-[#FBC02D] text-lg">🪙</div>
              <div className="text-white text-xs mt-2">→</div>
            </div>
          </div>
        </div>
        
        {/* NEW: Informational Notice Card */}
        <div className="w-full bg-white border border-[#BDBDBD] rounded-[12px] p-[12px] mb-[12px] mt-[12px]">
          <div className="flex items-start">
            <div className="flex-1 max-w-[240px]">
              <p className="text-[11px] text-[#212121] leading-[16px]">
                Fortnox Lön now supports sending a payment file directly to Danske Bank according to the new Pain.001 format. What you need is to activate a bank connection. Read more{' '}
                <a href="#" className="text-[#1976D2] font-medium">here</a>
                {' '}about how to get started.
              </p>
            </div>
            <div className="ml-2 flex-shrink-0">
              <div className="w-[36px] h-[36px] rounded-full border-[3px] border-[#0B3D2E] flex items-center justify-center">
                <span className="text-[16px] font-bold text-[#0B3D2E]">i</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* NEW: Search Input Field */}
        <div className="w-full mb-[12px] relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Employment ID, name, pay period"
              className="w-full h-[32px] border border-[#E0E0E0] rounded-[6px] pl-[28px] pr-[8px] py-[6px] bg-white text-[11px] text-[#212121] placeholder-[#9E9E9E] focus:outline-none"
            />
            <span className="absolute left-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#757575]">🔍</span>
          </div>
        </div>
        
        {/* NEW: Filter Controls Section */}
        <div className="flex flex-col gap-[8px] mb-[12px]">
          {/* Salary Period Dropdown */}
          <div>
            <label className="text-[11px] text-[#616161] mb-[4px] block">Salary period</label>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full h-[32px] border border-[#E0E0E0] rounded-[6px] px-[8px] py-[6px] text-[11px] bg-white text-[#212121] appearance-none focus:outline-none"
              >
                <option>All periods</option>
                <option>Period 1</option>
                <option>Period 2</option>
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[#757575] pointer-events-none">▼</span>
            </div>
          </div>
          
          {/* Employee Dropdown */}
          <div>
            <label className="text-[11px] text-[#616161] mb-[4px] block">Employee</label>
            <div className="relative">
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="w-full h-[32px] border border-[#E0E0E0] rounded-[6px] px-[8px] py-[6px] text-[11px] bg-white text-[#212121] appearance-none focus:outline-none"
              >
                <option>All employees</option>
                <option>Employee 1</option>
                <option>Employee 2</option>
              </select>
              <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[#757575] pointer-events-none">▼</span>
            </div>
          </div>
          
          {/* Clear Selection Button */}
          <div className="flex justify-start">
            <button className="text-[11px] font-medium text-white bg-[#BDBDBD] h-[28px] px-[12px] rounded-[16px]">
              Clear selection
            </button>
          </div>
        </div>
        
        {/* NEW: Status Filter Tabs */}
        <div className="flex overflow-x-auto pb-[2px] mb-[10px] gap-[6px]">
          {['All', 'Created', 'Approved', 'Late', 'Paid out'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveStatusFilter(tab)}
              className={`h-[28px] px-[10px] text-[11px] rounded-[4px] whitespace-nowrap ${
                activeStatusFilter === tab
                  ? tab === 'All'
                    ? 'bg-white border border-[#E0E0E0] text-[#424242]'
                    : tab === 'Created'
                    ? 'bg-[#F5F5F5] border border-[#9E9E9E] text-[#212121]'
                    : tab === 'Approved'
                    ? 'bg-[#FFF9C4] text-[#212121] border-0'
                    : tab === 'Late'
                    ? 'bg-[#E1F5FE] text-[#212121] border-0'
                    : 'bg-[#E8F5E9] text-[#212121] border-0'
                  : 'bg-white border border-[#E0E0E0] text-[#424242]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        {/* NEW: Table Controls */}
        <div className="flex justify-end gap-[6px] mb-[12px]">
          <button className="w-[28px] h-[28px] bg-[#F5F5F5] flex items-center justify-center">
            <span className="text-[16px] text-[#424242]">📋</span>
          </button>
          <div className="w-[28px] h-[28px] bg-[#F5F5F5] rounded-[4px] flex items-center justify-center">
            <span className="text-[11px] text-[#424242]">0</span>
          </div>
        </div>
        
        {/* NEW: Salary Table */}
        <div className="w-full overflow-x-auto mb-[12px] border border-[#E0E0E0] rounded-[8px]">
          <table className="w-full">
            <thead>
              <tr className="h-[36px] bg-white border-b-[2px] border-b-[#9E9E9E]">
                {['Checkbox', 'PAYMENT DAY', 'PERIOD', 'EMPLOYEE ID', 'FIRST NAME', 'SURNAME', 'GROSS SALARY', 'DACHSUND', 'TAX-FREE', 'TO PAY', 'ALLOWANCE', 'STATUS', 'READY'].map((header) => (
                  <th 
                    key={header}
                    className="px-[8px] text-[10px] font-semibold text-[#424242] uppercase text-left"
                    style={{ fontSize: '10px' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="h-[36px] bg-white border-b border-[#E0E0E0]">
                {Array(13).fill(0).map((_, idx) => (
                  <td key={idx} className="px-[8px] text-[11px] text-[#424242]">
                    {idx >= 3 && idx <= 9 ? '0.00' : ''}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* NEW: Bottom Action Bar */}
        <div className="pb-[70px] bg-white">
          <div className="max-w-[360px] mx-auto flex items-center justify-between">
            <button className="text-[11px] text-white bg-[#BDBDBD] h-[32px] px-[12px] rounded-[16px]">
              Delete (0 selected)
            </button>
            
            <div className="flex overflow-x-auto gap-[6px] pb-[2px]">
              <button className="text-[11px] text-white bg-[#9E9E9E] h-[32px] px-[12px] rounded-[16px] whitespace-nowrap">
                Checklist
              </button>
              <button className="text-[11px] text-white bg-[#BDBDBD] h-[32px] px-[12px] rounded-[16px] whitespace-nowrap">
                Preview
              </button>
              <button className="text-[11px] text-white bg-[#BDBDBD] h-[32px] px-[12px] rounded-[16px] whitespace-nowrap">
                Print authorization list
              </button>
              <button className="text-[11px] text-white bg-[#81C784] h-[32px] px-[12px] rounded-[16px] whitespace-nowrap">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const HolidayCalculationComponent = () => {
    const [activeTab, setActiveTab] = useState('All');
    const [staffType, setStaffType] = useState('All employee types');
    const [employee, setEmployee] = useState('-- All employees');
    const [year, setYear] = useState('Every year');
    const [period, setPeriod] = useState('All periods');
    
    return (
      <div className="bg-white max-w-[360px] md:max-w-6xl mx-auto" style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px' }}>
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-[8px] p-[12px]">
          <div className="text-[13px] font-semibold text-[#212121] tracking-[0.4px] uppercase">
            HOLIDAY CALCULATION
          </div>
          
          <div className="flex items-center gap-[8px] w-full md:w-auto">
            <div className="relative flex-1 max-w-[160px]">
              <input
                type="text"
                placeholder="ID, Name, Date"
                className="w-full h-[32px] border border-[#C8E6C9] rounded-[6px] pl-[28px] pr-[8px] py-[6px] bg-[#F1F8F4] text-[11px] text-[#212121] placeholder-[#9E9E9E] focus:outline-none"
              />
              <span className="absolute left-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#616161]">🔍</span>
            </div>
            
            <button className="flex items-center text-[11px] font-semibold text-[#1F1F1F] bg-[#FFC107] px-[12px] py-[6px] rounded-[16px] h-[28px] whitespace-nowrap">
              <span className="text-[12px] mr-[6px]">+</span>
              Create Holiday processing
            </button>
          </div>
        </div>
        
        {/* Main Instructional Card (Purple Panel) */}
        <div className="w-full bg-[#7E7A8F] rounded-[14px] p-[14px] m-[12px] flex flex-col md:flex-row items-start">
          <div className="text-white flex-1 mb-[14px] md:mb-0 md:mr-[14px]">
            <h3 className="font-semibold text-[13px] mb-[6px]">Get started with holiday processing</h3>
            <p className="text-[11px] text-[#F5F5F5] leading-[16px] mb-[6px]">
              Do you need to get the holiday debt out for the employees or is it time to close the holiday year?
            </p>
            <p className="text-[11px] text-[#E0E0E0] leading-[16px] mb-[6px]">
              Regardless of which, you first need to create a holiday processing, then you get a basis for the holiday debt but can also create the end of the holiday year.
            </p>
            <p className="text-[11px] text-[#E0E0E0] leading-[16px] mb-[10px]">
              Click on Create new at the top right to first create the holiday processing. Click Read more for more information.
            </p>
            <div className="flex flex-wrap md:flex-nowrap md:space-x-2">
              <button className="text-[11px] font-semibold text-[#1F1F1F] bg-white px-[14px] py-[6px] rounded-[18px] h-[28px] mr-[8px] mb-[4px] md:mb-0">
                Create Holiday processing
              </button>
              <button className="text-[11px] text-white border border-white px-[14px] py-[6px] rounded-[18px] h-[28px]">
                Read more
              </button>
            </div>
          </div>
          
          {/* Right Illustration Section - Hidden on small screens */}
          <div className="hidden xs:block w-[90px] flex-shrink-0">
            <div className="relative w-full h-[90px]">
              {/* Island base */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[70px] h-[40px] bg-[#BFD3C1] rounded-full"></div>
              
              {/* Palm trunk */}
              <div className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2 w-[4px] h-[30px] bg-[#8FAF9C]"></div>
              
              {/* Palm leaves */}
              <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 -rotate-12 w-[20px] h-[4px] bg-[#4F7F6A] rounded-full"></div>
              <div className="absolute bottom-[50px] left-1/2 transform -translate-x-1/2 rotate-12 w-[20px] h-[4px] bg-[#4F7F6A] rounded-full"></div>
              <div className="absolute bottom-[55px] left-1/2 transform -translate-x-1/2 w-[4px] h-[15px] bg-[#4F7F6A] rounded-full"></div>
              
              {/* Water shadow */}
              <div className="absolute top-[70px] left-0 w-full h-[5px] bg-[#6C6A7C] opacity-30 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Top Filter Bar */}
        <div className="p-[12px] bg-white border-b border-[#E6E6E6]">
          <div className="flex flex-col gap-[8px]">
            {/* Dropdown Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[8px]">
              <div>
                <label className="text-[12px] text-[#6B7280] block mb-[4px]">Staff type</label>
                <div className="relative">
                  <select
                    value={staffType}
                    onChange={(e) => setStaffType(e.target.value)}
                    className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] appearance-none px-[10px] pr-[28px] focus:outline-none"
                  >
                    <option>All employee types</option>
                    <option>Type 1</option>
                    <option>Type 2</option>
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
                    <option>-- All employees</option>
                    <option>Employee 1</option>
                    <option>Employee 2</option>
                  </select>
                  <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6B7280] pointer-events-none">▼</span>
                </div>
              </div>
              
              <div>
                <label className="text-[12px] text-[#6B7280] block mb-[4px]">Year</label>
                <div className="relative">
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] appearance-none px-[10px] pr-[28px] focus:outline-none"
                  >
                    <option>Every year</option>
                    <option>2024</option>
                    <option>2025</option>
                  </select>
                  <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6B7280] pointer-events-none">▼</span>
                </div>
              </div>
              
              <div>
                <label className="text-[12px] text-[#6B7280] block mb-[4px]">Period</label>
                <div className="relative">
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full h-[32px] border border-[#D1D5DB] rounded-[6px] bg-white text-[12px] text-[#111827] appearance-none px-[10px] pr-[28px] focus:outline-none"
                  >
                    <option>All periods</option>
                    <option>Period 1</option>
                    <option>Period 2</option>
                  </select>
                  <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#6B7280] pointer-events-none">▼</span>
                </div>
              </div>
            </div>
            
            {/* Clear Button */}
            <div className="flex justify-start">
              <button className="h-[32px] px-[14px] text-[12px] font-medium text-white bg-[#9CA3AF] rounded-[16px]">
                Clear
              </button>
            </div>
          </div>
        </div>
        
        {/* Secondary Filter Tabs */}
        <div className="p-[8px] bg-white border-b border-[#E5E7EB]">
          <div className="flex overflow-x-auto md:overflow-visible gap-[4px] pb-[2px]">
            {['All', 'Created documents', 'Basis posted holiday debt', 'Included in end holiday year'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-[28px] px-[10px] text-[11px] font-medium rounded-[6px] whitespace-nowrap relative ${
                  activeTab === tab
                    ? 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151]'
                    : 'bg-[#F9FAFB] border border-[#E5E7EB] text-[#374151]'
                }`}
              >
                {tab}
                {activeTab === 'Created documents' && tab === 'Created documents' && (
                  <div className="absolute left-0 top-0 h-full w-[4px] bg-[#7DD3FC] rounded-l-[2px]"></div>
                )}
                {activeTab === 'Basis posted holiday debt' && tab === 'Basis posted holiday debt' && (
                  <div className="absolute left-0 top-0 h-full w-[4px] bg-[#67E8F9] rounded-l-[2px]"></div>
                )}
                {activeTab === 'Included in end holiday year' && tab === 'Included in end holiday year' && (
                  <div className="absolute left-0 top-0 h-full w-[4px] bg-[#A7F3D0] rounded-l-[2px]"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Data Table Section */}
        <div className="w-full overflow-x-auto bg-white border-t border-[#E5E7EB]">
          <table className="w-full min-w-[800px] lg:min-w-full">
            <thead>
              <tr className="h-[36px] bg-[#F3F4F6]">
                {['☐', 'ANST. ID', 'FIRST NAME', 'SURNAME', 'DATE', 'PAID DAYS', 'UNPAID DAYS', 'SALARY/PAID DAY', 'SALARY/SAVED DAY', 'HOLIDAY PAY (NOT DAYS)', 'PERIOD', 'VERIFIED ID', 'LIABILITY (INCLUDING EMPLOYER CONTRIBUTIONS)'].map((header) => (
                  <th 
                    key={header}
                    className="px-[8px] text-[10.5px] font-semibold text-[#374151] uppercase text-left border-r border-[#E5E7EB] last:border-r-0"
                    style={{ fontSize: '10.5px' }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="h-[48px] bg-white border-t border-[#E5E7EB]">
                {Array(13).fill(0).map((_, idx) => (
                  <td key={idx} className="px-[8px] text-[11px] text-[#374151] border-r border-[#E5E7EB] last:border-r-0"></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Footer Action Bar */}
        <div className="sticky bottom-0 p-[10px] bg-[#F9FAFB] border-t border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-[8px]">
          <div className="flex items-center gap-[8px] flex-wrap">
            <button className="h-[30px] px-[12px] text-[11px] text-[#9CA3AF] bg-[#E5E7EB] rounded-[15px] opacity-60" disabled>
              Delete
            </button>
            <button className="h-[30px] px-[12px] text-[11px] text-[#9CA3AF] bg-[#E5E7EB] rounded-[15px] opacity-60" disabled>
              Revert holiday year-end
            </button>
            <span className="text-[11px] text-[#6B7280]">(0 selected)</span>
          </div>
          
          <div className="flex items-center gap-[6px] flex-wrap md:flex-nowrap">
            <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#86C5A4] rounded-[16px] shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
              End of the holiday year
            </button>
            <div className="relative">
              <button className="h-[32px] px-[12px] text-[12px] text-[#374151] border border-[#D1D5DB] rounded-[16px] bg-white">
                Holiday debt ▾
              </button>
            </div>
            <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#86C5A4] rounded-[16px]">
              Printout
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Determine active navigation item based on URL
  const getCurrentActiveNav = (navId: string) => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    
    switch(navId) {
      case 'calendar':
        return !tab || tab === 'calendar';
      case 'salary-run':
        return tab === 'payroll-processing' || tab === 'salary-run';
      case 'holiday':
        return tab === 'holiday-calculation';
      case 'statistic':
        return tab === 'statistics';
      case 'Forums':
        return tab === 'Forums';
      case 'Collection':
        return tab === 'Collection';
      default:
        return false;
    }
  };

  const navigationItems = [
    { id: 'calendar', label: 'Calendar', active: getCurrentActiveNav('calendar') },
    { id: 'salary-run', label: 'Salary run', active: getCurrentActiveNav('salary-run') },
    { id: 'holiday', label: 'Holiday calculation', active: getCurrentActiveNav('holiday') },
    { id: 'statistic', label: 'Statistic', active: getCurrentActiveNav('statistic') },
    { id: 'Forums', label: 'Forums', active: getCurrentActiveNav('Forums') },
    { id: 'Collection', label: 'Collection', active: getCurrentActiveNav('Collection') }
  ];

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'inactive', label: 'Inactive' }
  ];

  const tableHeaders = [
    'ANST. ID',
    'FIRST NAME',
    'SURNAME',
    'PERSONAL IDENTITY NUMBER',
    'STAFF TYPE',
    'SALARY FORM'
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <div className="h-12 flex items-center justify-between px-3 border-b border-[#E6E6E6] bg-white">
        <div className="flex items-center">
          {navigationItems.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                if (item.id === 'calendar') {
                  navigate('/salary');
                } else if (item.id === 'salary-run') {
                  navigate('/salary?tab=salary-run');
                } else if (item.id === 'holiday') {
                  navigate('/salary?tab=holiday-calculation');
                } else if (item.id === 'statistic') {
                  navigate('/salary?tab=statistics');
                } else if (item.id === 'Forums') {
                  navigate('/salary?tab=Forums');
                } else if (item.id === 'Collection') {
                  navigate('/salary?tab=Collection');
                }
              }}
              className={`text-xs font-medium mr-3 cursor-pointer ${
                item.active 
                  ? 'text-[#2E7D32] border-b-2 border-[#2E7D32] pb-1' 
                  : 'text-[#4A4A4A]'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Salary Year Selector */}
          <div className="flex items-center px-2 py-1 text-xs text-[#4A4A4A] border border-[#DADADA] rounded">
            <span>2024</span>
            <span className="ml-1 text-[#9E9E9E]">▼</span>
          </div>
          
          {/* Reports Dropdown */}
          <div className="flex items-center px-2 py-1 text-xs text-[#4A4A4A] border border-[#DADADA] rounded">
            <span>Reports</span>
            <span className="ml-1 text-[#9E9E9E]">▼</span>
          </div>
          
          {/* Register Dropdown */}
          <div className="flex items-center px-2 py-1 text-xs text-[#4A4A4A] border border-[#DADADA] rounded">
            <span>Register</span>
            <span className="ml-1 text-[#9E9E9E]">▼</span>
          </div>
        </div>
      </div>

      {/* Conditional rendering based on active tab */}
      {getCurrentActiveNav('holiday') ? (
        <HolidayCalculationComponent />
      ) : getCurrentActiveNav('salary-run') ? (
        <SalaryRunComponent />
      ) : getCurrentActiveNav('statistic') ? (
        <Statistic />
      ) : getCurrentActiveNav('Forums') ? (
        <Forums />
      ) : getCurrentActiveNav('Collection') ? (
        <Collection />
      ) : (
        <>
          {/* Page Header Area */}
          <div className="p-3">
            <h1 className="text-sm font-semibold text-[#2C2C2C] tracking-[0.5px] uppercase">
              CALENDAR - LIST
            </h1>
            
            {/* Search Input */}
            <div className="mt-2">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E]">
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Employment ID, First name, Last name, Persona"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 pl-10 pr-3 text-xs border border-[#DADADA] rounded-lg bg-white text-[#4A4A4A] placeholder-[#9E9E9E] focus:outline-none focus:border-[#2E7D32]"
                />
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="px-3 mb-3">
            <div className="flex flex-col space-y-2">
              <button className="flex items-center text-xs text-[#4A4A4A] bg-transparent px-2 py-1.5 hover:bg-[#F5F5F5] rounded">
                <span className="mr-1.5">📥</span>
                Import history
              </button>
              <button className="flex items-center text-xs text-[#4A4A4A] bg-transparent px-2 py-1.5 hover:bg-[#F5F5F5] rounded">
                <span className="mr-1.5">📤</span>
                Import salary record
              </button>
              <button className="flex items-center text-xs text-[#4A4A4A] bg-transparent px-2 py-1.5 hover:bg-[#F5F5F5] rounded">
                <span className="mr-1.5">📄</span>
                Export salary record
              </button>
              <button className="flex items-center text-xs text-[#4A4A4A] bg-transparent px-2 py-1.5 hover:bg-[#F5F5F5] rounded">
                <span className="mr-1.5">🔄</span>
                Retroactive salary
              </button>
            </div>
          </div>

          {/* Information Banner */}
          <div className="mx-3 mb-3 p-4 bg-[#7C7890] rounded-xl">
            <div className="mb-2">
              <h2 className="text-sm font-semibold text-white mb-2">
                Welcome to Fortnox Salary.
              </h2>
              <p className="text-xs text-[#F1F1F1] leading-normal">
                You are now in the calendar where you register attendance, absence and other information that must be included in the pay slip for the employees. But before you can start registering this, you need to register the employees in the staff register, you do this under Register - Staff.
              </p>
            </div>
            <div className="flex space-x-2">
              <button className="h-8 px-3.5 bg-white text-[#2C2C2C] text-xs font-medium rounded-full">
                Go to personnel register
              </button>
              <button className="h-8 px-3.5 bg-[#8F8AA5] text-white text-xs font-medium rounded-full">
                Read more
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 mb-3">
            <div className="flex space-x-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`h-8 px-3 text-xs font-medium rounded ${
                    activeTab === tab.id
                      ? 'bg-[#EDEDED] text-[#2C2C2C]'
                      : 'bg-white border border-[#DADADA] text-[#6F6F6F]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header - Empty State */}
          <div className="mx-3">
            <div className="border border-[#E0E0E0] rounded overflow-hidden">
              <div className="h-10 bg-[#F4F4F4] border-b border-[#E0E0E0] flex items-center">
                {tableHeaders.map((header, index) => (
                  <div 
                    key={index}
                    className="px-3 text-[11px] font-semibold text-[#4A4A4A] uppercase tracking-wide"
                    style={{ 
                      width: index === 0 ? '80px' : 
                             index === 1 ? '100px' : 
                             index === 2 ? '100px' : 
                             index === 3 ? '140px' : 
                             index === 4 ? '90px' : '100px'
                    }}
                  >
                    {header}
                  </div>
                ))}
              </div>
              
              {/* Empty State Message */}
              <div className="h-32 flex items-center justify-center text-[#6F6F6F] text-sm">
                No data available
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calendar;