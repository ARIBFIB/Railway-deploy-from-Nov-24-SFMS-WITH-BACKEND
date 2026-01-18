import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeesSVG from '../../../../assets/images/employees.svg';
import History from './History';
import CreateNewTemplate from './CreateNewTemplate';
import ImportPersonnel from './ImportPersonnel';
import ExportPersonnel from './ExportPersonnel';
import PrintOutReport from './PrintOutReport';
import CreateFosRequest from './CreateFosRequest';

const PersonnelRegister = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Track which modals are open
  const [modals, setModals] = useState({
    history: false,
    createTemplate: false,
    importPersonnel: false,
    exportPersonnel: false,
    printOutReport: false,
    createFosRequest: false,
  });

  const tabs = ['All', 'Active', 'Not complete', 'Inactive'];

  return (
    <div 
      className="min-h-screen bg-[#F5F5F5] p-[16px]"
      style={{ 
        fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '12px',
        lineHeight: '1.4'
      }}
    >
      <>
        {/* Render main Personnel Register content */}
        <>
          {/* Top Header Area */}
          <div className="h-[48px] px-[16px] py-[8px] bg-white border-b border-[#E5E7EB] flex items-center justify-between">
            <div className="text-[14px] font-semibold text-[#1F2937] tracking-[0.4px]">
              PERSONNEL REGISTER - LIST
            </div>
            
            <div className="flex items-center gap-[16px]">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Employment ID, First name, Last name, Personal identity number"
                  className="w-[320px] h-[32px] border border-[#D1D5DB] rounded-[6px] pl-[32px] pr-[8px] py-[6px] bg-white text-[12px] text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="absolute left-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#9CA3AF]">🔍</span>
              </div>
              
              {/* Primary CTA */}
              <button className="h-[32px] px-[14px] bg-[#FACC15] text-[#111827] text-[12px] font-semibold rounded-[16px] hover:bg-[#EAB308] transition-colors flex items-center">
                <span className="text-[12px] mr-[6px]">+</span>
                Create employee
              </button>
            </div>
          </div>

          {/* Secondary Action Toolbar */}
          <div className="h-[40px] px-[16px] py-[8px] bg-white border-b border-[#E5E7EB] flex items-center">
            <div className="flex items-center gap-[20px]">
              {[
                { icon: '🕘', label: 'History' },
                { icon: '➕', label: 'Create new from template' },
                { icon: '👥', label: 'Import personnel' },
                { icon: '⬇️', label: 'Export personnel' },
                { icon: '🖨️', label: 'Printout' },
                { icon: '📄', label: 'Create FOS request' },
                { icon: '📬', label: 'Read the FOS answer' },
                { icon: '📊', label: 'Mass update salaries' },
                { icon: '🔁', label: 'Retroactive salary' },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center text-[12px] text-[#374151] cursor-pointer hover:text-[#2F3A40]"
                  onClick={() => {
                    if (item.label === 'History') {
                      setModals(prev => ({ ...prev, history: true }));
                    } else if (item.label === 'Create new from template') {
                      setModals(prev => ({ ...prev, createTemplate: true }));
                    } else if (item.label === 'Import personnel') {
                      setModals(prev => ({ ...prev, importPersonnel: true }));
                    } else if (item.label === 'Export personnel') {
                      setModals(prev => ({ ...prev, exportPersonnel: true }));
                    } else if (item.label === 'Printout') {
                      setModals(prev => ({ ...prev, printOutReport: true }));
                    } else if (item.label === 'Create FOS request') {
                      setModals(prev => ({ ...prev, createFosRequest: true }));
                    } else if (item.label === 'Read the FOS answer') {
                      // Create a file input element to simulate file explorer
                      const fileInput = document.createElement('input');
                      fileInput.type = 'file';
                      fileInput.accept = '.xml,.txt,.pdf,.doc,.docx'; // Accept common document formats
                      fileInput.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files.length > 0) {
                          // Handle selected file
                          console.log('Selected FOS answer file:', files[0].name);
                        }
                      };
                      fileInput.click();
                    } else if (item.label === 'Mass update salaries') {
                      // Navigate to the MassUpdateSalaries component
                      navigate('/salary?tab=mass-update');
                    } else if (item.label === 'Retroactive salary') {
                      // Navigate to the RetroactiveSalary component
                      navigate('/salary?tab=retroactive-salary');
                    }
                  }}
                >
                  <span className="text-[14px] text-[#6B7280] mr-[4px]">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Empty State Card */}
          <div className="max-w-[720px] h-[180px] bg-[#7C768C] rounded-[12px] p-[24px] mx-auto mt-[24px] flex">
            <div className="flex-1">
              <h2 className="text-[14px] font-semibold text-white mb-[8px]">
                Welcome to start registering employees in Fortnox's salary.
              </h2>
              <p className="text-[12px] text-[#E5E7EB] leading-[1.5]">
                Now you are in the staff register in Fortnox's salary, but here is pretty empty at the moment. At the top right, you can click Create Employee to start registering your first employee. A faster way to get employees is by importing them via file. You can also create new staff from templates that you upload yourself with the settings that are to apply.
              </p>
              
              <div className="flex mt-[16px]">
                <button className="h-[28px] px-[16px] bg-white text-[#374151] text-[12px] font-medium rounded-[14px]">
                  Add employees
                </button>
                <button className="h-[28px] px-[16px] bg-transparent border border-white text-white text-[12px] rounded-[14px] ml-[12px]">
                  Read more
                </button>
              </div>
            </div>
            
            {/* Illustration */}
            <div className="flex items-center justify-center">
              <img 
                src={EmployeesSVG} 
                alt="Employees illustration" 
                className="w-[120px] h-[120px] object-contain"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="p-[16px] bg-[#F5F5F5]">
            <div className="flex gap-[8px]">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`h-[28px] px-[12px] text-[12px] rounded-[6px] border border-[#D1D5DB] ${
                    activeTab === tab
                      ? 'bg-white text-[#374151] font-semibold border-[#9CA3AF]'
                      : 'bg-white text-[#374151]'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-[#E5E7EB] rounded-[8px] mx-[16px]">
            <div className="h-[36px] bg-[#F9FAFB] border-b border-[#E5E7EB] grid grid-cols-[36px_80px_120px_120px_200px_120px_200px_180px_120px_140px_180px]">
              {[
                'Checkbox',
                'ANST. ID',
                'FIRST NAME',
                'SURNAME',
                'PERSONAL IDENTITY NUMBER',
                'STAFF TYPE',
                'AGREEMENT FOR SALARIES',
                'AGREEMENT TEMPLATE',
                'SALARY FORM',
                'TYPE OF PAY SLIP',
                'CALENDAR PERMISSIONS'
              ].map((header) => (
                <div 
                  key={header}
                  className="text-[11px] font-semibold text-[#374151] uppercase px-[8px] flex items-center tracking-[0.5px]"
                >
                  {header}
                </div>
              ))}
            </div>
            
            {/* Empty Table State */}
            <div className="h-[120px] bg-white flex items-center justify-center">
              <div className="text-center text-[#757575]">
                <p>No employees found</p>
                <p className="text-[12px] mt-[4px]">Add employees to get started</p>
              </div>
            </div>
          </div>

          {/* Footer Bulk Actions */}
          <div className="h-[64px] px-[16px] flex justify-between items-center bg-white mt-[16px]">
            <div className="flex items-center">
              <button 
                className="h-[32px] px-[16px] bg-[#D1D5DB] text-white text-[12px] rounded-[16px] opacity-40"
                disabled
              >
                Deactivate
              </button>
              <button 
                className="h-[32px] px-[16px] bg-[#D1D5DB] text-white text-[12px] rounded-[16px] opacity-40 ml-[8px]"
                disabled
              >
                Delete
              </button>
              <span className="text-[12px] text-[#6B7280] ml-[12px]">(0 selected)</span>
            </div>
            
            <div className="flex items-center">
              <button 
                className="h-[32px] px-[16px] bg-[#D1D5DB] text-white text-[12px] rounded-[16px] mr-[8px]"
                disabled
              >
                Change selected
              </button>
              <button className="h-[32px] px-[16px] bg-[#9AC9A2] text-white text-[12px] font-semibold rounded-[16px]">
                Activate
              </button>
            </div>
          </div>
        </>
        
        {/* Render modals if open */}
        {modals.history && (
          <History onClose={() => setModals(prev => ({ ...prev, history: false }))} />
        )}
        {modals.createTemplate && (
          <>
            <CreateNewTemplate onClose={() => setModals(prev => ({ ...prev, createTemplate: false }))} />
            <div className="fixed inset-0 bg-black bg-opacity-30 z-[999]" onClick={() => setModals(prev => ({ ...prev, createTemplate: false }))}></div>
          </>
        )}
        {modals.importPersonnel && (
          <>
            <ImportPersonnel onClose={() => setModals(prev => ({ ...prev, importPersonnel: false }))} />
            <div className="fixed inset-0 bg-black bg-opacity-30 z-[999]" onClick={() => setModals(prev => ({ ...prev, importPersonnel: false }))}></div>
          </>
        )}
        {modals.exportPersonnel && (
          <>
            <ExportPersonnel onClose={() => setModals(prev => ({ ...prev, exportPersonnel: false }))} />
            <div className="fixed inset-0 bg-black bg-opacity-30 z-[999]" onClick={() => setModals(prev => ({ ...prev, exportPersonnel: false }))}></div>
          </>
        )}
        {modals.printOutReport && (
          <>
            <PrintOutReport />
            <div className="fixed inset-0 bg-black bg-opacity-30 z-[999]" onClick={() => setModals(prev => ({ ...prev, printOutReport: false }))}></div>
          </>
        )}
        {modals.createFosRequest && (
          <>
            <CreateFosRequest onClose={() => setModals(prev => ({ ...prev, createFosRequest: false }))} />
            <div className="fixed inset-0 bg-black bg-opacity-30 z-[999]" onClick={() => setModals(prev => ({ ...prev, createFosRequest: false }))}></div>
          </>
        )}
      </>
    </div>
  );
};

export default PersonnelRegister;