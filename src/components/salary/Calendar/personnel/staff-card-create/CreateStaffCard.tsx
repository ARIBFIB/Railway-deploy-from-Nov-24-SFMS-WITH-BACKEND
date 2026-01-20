import React, { useState } from 'react';
import { Plus, Menu, Printer, Copy, FileText, RotateCcw } from 'lucide-react';
import StaffInformationTab from './StaffInformationTab';
import TaxTab from './TaxTab';
import EmploymentTab from './EmploymentTab';
import SalaryDetailsTab from './SalaryDetailsTab';
import HolidayTab from './HolidayTab';
import ATFATKTab from './ATFATKTab';
import ReportsTab from './ReportsTab';
import BalanceBroughtForwardTab from './BalanceBroughtForwardTab';

const CreateStaffCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('staff-information');
  const [searchTerm, setSearchTerm] = useState('');

  const tabs = [
    { id: 'staff-information', label: 'Staff information' },
    { id: 'tax', label: 'Tax' },
    { id: 'employment', label: 'Employment' },
    { id: 'salary-details', label: 'Salary details' },
    { id: 'holiday', label: 'Holiday' },
    { id: 'atf-atk', label: 'ATF/ATK' },
    { id: 'reports', label: 'Reports' },
    { id: 'balance-brought-forward', label: 'Balance brought forward' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'staff-information':
        return <StaffInformationTab />;
      case 'tax':
        return <TaxTab />;
      case 'employment':
        return <EmploymentTab />;
      case 'salary-details':
        return <SalaryDetailsTab />;
      case 'holiday':
        return <HolidayTab />;
      case 'atf-atk':
        return <ATFATKTab />;
      case 'reports':
        return <ReportsTab />;
      case 'balance-brought-forward':
        return <BalanceBroughtForwardTab />;
      default:
        return <StaffInformationTab />;
    }
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen p-4">
      <div className="max-w-[1280px] mx-auto bg-white rounded shadow-sm p-4">
        {/* Page Title */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xs font-semibold tracking-[0.3px] text-[#2B2B2B]">
            STAFF CARD - CREATE NEW
          </h1>
          <div className="flex space-x-2">
            <button className="flex items-center bg-[#9E9E9E] text-white text-xs font-medium px-3 py-1.5 rounded-[16px]">
              <Plus size={12} className="mr-1.5 text-white" />
              Create employee
            </button>
            <button className="flex items-center bg-[#FFC107] text-black text-xs font-semibold px-3 py-1.5 rounded-[16px]">
              <Menu size={12} className="mr-1.5 text-black" />
              Show list
            </button>
          </div>
        </div>

        {/* Secondary Navigation (Pills) */}
        <div className="flex mb-4">
          <div className="flex space-x-2">
            <button className="h-7 px-3.5 text-xs font-medium bg-[#CFCFCF] text-white rounded-[14px]">
              Calendar
            </button>
            <button className="h-7 px-3.5 text-xs font-medium bg-[#CFCFCF] text-white rounded-[14px]">
              Personnel card
            </button>
            <button className="h-7 px-3.5 text-xs font-medium bg-[#7A7A7A] text-white rounded-[14px]">
              Salary run
            </button>
          </div>
        </div>

        {/* Search Field */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Employment ID, First name, Last name, Persona"
            className="w-full h-7 pl-7 pr-2.5 text-xs border border-[#DADADA] rounded text-[#2B2B2B] bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-2 top-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#9E9E9E]"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Icon Toolbar (Right Side) */}
        <div className="flex justify-end mb-4 space-x-5">
          <div className="flex flex-col items-center">
            <FileText size={14} className="text-[#4A4A4A]" />
            <span className="text-[11px] text-[#4A4A4A] mt-1">Employer certificate</span>
          </div>
          <div className="flex flex-col items-center">
            <Copy size={14} className="text-[#4A4A4A]" />
            <span className="text-[11px] text-[#4A4A4A] mt-1">Copy</span>
          </div>
          <div className="flex flex-col items-center">
            <FileText size={14} className="text-[#4A4A4A]" />
            <span className="text-[11px] text-[#4A4A4A] mt-1">Save as template</span>
          </div>
          <div className="flex flex-col items-center">
            <Printer size={14} className="text-[#4A4A4A]" />
            <span className="text-[11px] text-[#4A4A4A] mt-1">Printout</span>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw size={14} className="text-[#4A4A4A]" />
            <span className="text-[11px] text-[#4A4A4A] mt-1">Reconstruct holiday</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-[#E0E0E0] mb-4">
          <div className="flex space-x-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-3 py-2 text-xs font-medium relative ${
                  activeTab === tab.id
                    ? 'text-[#2B2B2B]'
                    : 'text-[#6F6F6F]'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2E7D32]"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-4">
          {renderTabContent()}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center text-xs text-[#2E7D32] mb-4">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Active
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between">
          <button className="bg-[#BDBDBD] text-white h-7.5 px-3.5 text-xs font-medium rounded-[16px]">
            Delete
          </button>
          <div className="flex space-x-2">
            <button className="bg-[#9E9E9E] text-white h-7.5 px-3.5 text-xs font-medium rounded-[16px]">
              Cancel
            </button>
            <button className="bg-[#2E7D32] text-white h-7.5 px-4 text-xs font-semibold rounded-[16px]">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStaffCard;