import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Statistic from '../Statistics/Statistic';
import Forums from '../Forums/Forums';
import Collection from '../Collection/Collection';
import SalaryRun from '../SalaryRun/SalaryRun';
import ImportHistoryCalendar from './ImportHistoryCalendar';
import ExportSalaryRecord from './ExportSalaryRecord';
import RetroactiveSalary from './RetroactiveSalary';
import MassUpdateSalaries from './MassUpdateSalaries';
import CalendarList from './CalendarList';
import PersonnelRegister from './personnel/PersonnelRegister';
import NewPersonnelRegisterList from './personnel/NewPersonnelRegisterList';
import CreateStaffCard from './personnel/staff-card-create/CreateStaffCard';

// Import image assets
import generalCalendarClock from '../../../assets/images/general_calendar_clock.png';

const Calendar = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isImportHistoryOpen, setIsImportHistoryOpen] = useState(false);
  const [isExportSalaryRecordOpen, setIsExportSalaryRecordOpen] = useState(false);
  const [showPersonnelRegister, setShowPersonnelRegister] = useState(false);
  const [showCreateStaffCard, setShowCreateStaffCard] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  

  
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
            <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#86C5A4]">
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
        return tab === 'salary-run';
      case 'holiday':
        return tab === 'holiday-calculation';
      case 'statistic':
        return tab === 'statistics';
      case 'Forums':
        return tab === 'Forums';
      case 'Collection':
        return tab === 'Collection';
      case 'RetroactiveSalary':
        return tab === 'retroactive-salary';
      case 'MassUpdate':
        return tab === 'mass-update';
      case 'personnel-register':
        return tab === 'personnel-register';
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
    { id: 'Collection', label: 'Collection', active: getCurrentActiveNav('Collection') },
    { id: 'RetroactiveSalary', label: 'Retroactive salary', active: getCurrentActiveNav('RetroactiveSalary') },
    { id: 'MassUpdate', label: 'Mass update salaries', active: getCurrentActiveNav('MassUpdate') }
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
                } else if (item.id === 'personnel-register') {
                  navigate('/salary?tab=personnel-register');
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
                } else if (item.id === 'RetroactiveSalary') {
                  navigate('/salary?tab=retroactive-salary');
                } else if (item.id === 'MassUpdate') {
                  navigate('/salary?tab=mass-update');
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
        <SalaryRun />
      ) : getCurrentActiveNav('statistic') ? (
        <Statistic />
      ) : getCurrentActiveNav('Forums') ? (
        <Forums />
      ) : getCurrentActiveNav('Collection') ? (
        <Collection />
      ) : getCurrentActiveNav('RetroactiveSalary') ? (
        <RetroactiveSalary />
      ) : getCurrentActiveNav('MassUpdate') ? (
        <MassUpdateSalaries />
      ) : showCreateStaffCard ? (
        <div className="p-4">
          <button 
            className="text-[#2E7D32] hover:underline text-xs font-medium mb-4"
            onClick={() => setShowCreateStaffCard(false)}
          >
            ← Back to Personnel Register
          </button>
          <CreateStaffCard />
        </div>
      ) : showPersonnelRegister ? (
        <div className="p-4">
          <button 
            className="text-[#2E7D32] hover:underline text-xs font-medium mb-4"
            onClick={() => {
              setShowPersonnelRegister(false);
              setShowCreateStaffCard(false);
            }}
          >
            ← Back to Calendar
          </button>
          <NewPersonnelRegisterList onCreateStaffCard={() => setShowCreateStaffCard(true)} />
        </div>
      ) : (
        <>
          {/* Welcome Banner */}
          <div 
            className="w-full h-[118px] rounded-[14px] bg-[#7E7A8F] p-[16px] pl-[20px] pr-[140px] shadow-[0px_4px_14px_rgba(0,0,0,0.14)] relative mb-[16px]"
            style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            <div>
              <h2 className="text-[13px] font-semibold text-white mb-[6px] leading-[16px]">Welcome to Fortnox Salary.</h2>
              <p className="text-[11px] leading-[15px] text-[#F2F2F2] max-w-[560px]">
                You are now in the calendar where you register attendance, absence and other information that must be included in the pay slip for the employees. But before you can start registering this, you need to register the employees in the staff register, you do this under Register - Staff.
              </p>
            </div>
            
            <div className="flex mt-[12px] gap-[8px]">
              <button 
                className="h-[28px] px-[16px] bg-white text-[#4A4A4A] text-[11px] font-medium rounded-[16px] hover:bg-[#F4F4F4] transition-colors"
                onClick={() => {
                  setShowPersonnelRegister(true);
                  setShowCreateStaffCard(false);
                }}
              >
                Go to personnel register
              </button>
              {/* <button 
                className="h-[28px] px-[16px] bg-[#FACC15] text-[#111827] text-[11px] font-medium rounded-[16px] hover:bg-[#EAB308] transition-colors"
                onClick={() => {
                  setShowPersonnelRegister(true);
                  setShowCreateStaffCard(true);
                }}
              >
                <span className="mr-[6px]">+</span>Create employee
              </button> */}
              <button className="h-[28px] px-[16px] bg-transparent border border-[#E5E5E5] text-white text-[11px] font-medium rounded-[16px] hover:bg-[rgba(255,255,255,0.08)] transition-colors">
                Read more
              </button>
            </div>
            
            {/* Illustration */}
            <div className="absolute right-[24px] top-1/2 transform -translate-y-1/2 w-[110px] h-[86px] pointer-events-none">
              <img 
                src={generalCalendarClock} 
                alt="Calendar and clock illustration" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <CalendarList 
            onImportHistoryClick={() => setIsImportHistoryOpen(true)}
            onExportSalaryRecordClick={() => setIsExportSalaryRecordOpen(true)}
          />
        </>
      )}
      <ImportHistoryCalendar 
        isOpen={isImportHistoryOpen} 
        onClose={() => setIsImportHistoryOpen(false)} 
      />
      <ExportSalaryRecord 
        isOpen={isExportSalaryRecordOpen} 
        onClose={() => setIsExportSalaryRecordOpen(false)} 
      />
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

export default Calendar;