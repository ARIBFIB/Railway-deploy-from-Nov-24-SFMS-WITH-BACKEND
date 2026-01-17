import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Calendar = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active navigation item based on URL
  const getCurrentActiveNav = (navId: string) => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams.get('tab');
    
    switch(navId) {
      case 'calendar':
        return !tab || tab === 'calendar';
      case 'salary-run':
        return tab === 'payroll-processing';
      case 'holiday':
        return tab === 'vacation-calculation';
      case 'statistic':
        return tab === 'statistics';
      case 'fora':
        return tab === 'fora';
      case 'collectum':
        return tab === 'collectum';
      default:
        return false;
    }
  };

  const navigationItems = [
    { id: 'calendar', label: 'Calendar', active: getCurrentActiveNav('calendar') },
    { id: 'salary-run', label: 'Salary run', active: getCurrentActiveNav('salary-run') },
    { id: 'holiday', label: 'Holiday calculation', active: getCurrentActiveNav('holiday') },
    { id: 'statistic', label: 'Statistic', active: getCurrentActiveNav('statistic') },
    { id: 'fora', label: 'Fora', active: getCurrentActiveNav('fora') },
    { id: 'collectum', label: 'Collectum', active: getCurrentActiveNav('collectum') }
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
                  navigate('/salary?tab=payroll-processing');
                } else if (item.id === 'holiday') {
                  navigate('/salary?tab=vacation-calculation');
                } else if (item.id === 'statistic') {
                  navigate('/salary?tab=statistics');
                } else if (item.id === 'fora') {
                  navigate('/salary?tab=fora');
                } else if (item.id === 'collectum') {
                  navigate('/salary?tab=collectum');
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
    </div>
  );
};

export default Calendar;