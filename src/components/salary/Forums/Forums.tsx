import React, { useState } from 'react';
import ForumsForm from './ForumsForm';

const Forums = () => {
  const [activeTab, setActiveTab] = useState('Monthly report');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedEmployee, setSelectedEmployee] = useState('All employees');
  const [selectedMarking, setSelectedMarking] = useState('Not signed');
  const [activeFilter, setActiveFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="bg-white max-w-[360px] md:max-w-6xl mx-auto" style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px' }}>
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-[8px] p-[12px] border-b border-[#E5E7EB]">
        <div className="text-[14px] font-bold text-[#333333] tracking-[0.2px]">
          FORUM MONTHLY REPORTING
        </div>
        
        <div className="flex items-center gap-[8px]">
          <div className="text-[16px] text-[#B5B5B5]">☰</div>
          <div className="text-[12px] text-[#B5B5B5]">0</div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="p-[12px] bg-white border-b border-[#E5E7EB]">
        <div className="flex gap-[24px]">
          <button
            onClick={() => setActiveTab('Monthly report')}
            className={`pb-[4px] text-[12px] font-medium ${
              activeTab === 'Monthly report'
                ? 'text-[#333333] border-b-2 border-[#7BC141]'
                : 'text-[#757575]'
            }`}
          >
            Monthly report
          </button>
          <button
            onClick={() => setActiveTab('Annual report')}
            className={`pb-[4px] text-[12px] font-medium ${
              activeTab === 'Annual report'
                ? 'text-[#333333] border-b-2 border-[#7BC141]'
                : 'text-[#757575]'
            }`}
          >
            Annual report
          </button>
        </div>
      </div>
      
      {/* Filters Section */}
      {activeTab === 'Monthly report' ? (
        <div className="p-[12px] bg-white" style={{ gap: '10px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] mb-[12px]">
            <div>
              <label className="text-[11px] text-[#333333] block mb-[4px]">Select month</label>
              <div className="relative">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none"
                >
                  <option>All</option>
                  <option>January</option>
                  <option>February</option>
                  <option>March</option>
                  <option>April</option>
                  <option>May</option>
                  <option>June</option>
                  <option>July</option>
                  <option>August</option>
                  <option>September</option>
                  <option>October</option>
                  <option>November</option>
                  <option>December</option>
                </select>
                <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
              </div>
            </div>
            
            <div>
              <label className="text-[11px] text-[#333333] block mb-[4px]">Select employee</label>
              <div className="relative">
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value.replace('All employees', 'All'))}
                  className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none"
                >
                  <option>All employees</option>
                  <option>Employee 1</option>
                  <option>Employee 2</option>
                  <option>Employee 3</option>
                </select>
                <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
              </div>
            </div>
            
            <div>
              <label className="text-[11px] text-[#333333] block mb-[4px]">Marking</label>
              <div className="relative">
                <select
                  value={selectedMarking}
                  onChange={(e) => setSelectedMarking(e.target.value.replace('Not signed', 'All'))}
                  className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none"
                >
                  <option>All</option>
                  <option>Marking 1</option>
                  <option>Marking 2</option>
                  <option>Marking 3</option>
                </select>
                <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
              </div>
            </div>
            
            {/* Create monthly report button */}
            <div className="sm:col-start-4 sm:row-start-1 flex items-end justify-end">
            <button 
                className="create-report-button w-[150px] h-[40px] bg-[#FFCC00] text-[#333333] font-bold text-[12px] py-[8px] px-[12px] rounded-full border-none cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center hover:bg-[#FFB300] active:bg-[#FFA000] hover:shadow-[0_4px_6px_rgba(0,0,0,0.1)]"
                onClick={() => setIsModalOpen(true)}
            >
                <span className="mr-[8px]">+</span>
                Create monthly report
            </button>
            </div>


          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-[8px] mb-[12px]">
            <button
              onClick={() => setActiveFilter('All')}
              className={`h-[28px] px-[12px] text-[11px] font-medium rounded ${
                activeFilter === 'All'
                  ? 'bg-[#7BC141] text-white'
                  : 'bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('Created')}
              className={`h-[28px] px-[12px] text-[11px] font-medium rounded ${
                activeFilter === 'Created'
                  ? 'bg-[#7BC141] text-white'
                  : 'bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]'
              }`}
            >
              Created
            </button>
            <button
              onClick={() => setActiveFilter('File created')}
              className={`h-[28px] px-[12px] text-[11px] font-medium rounded ${
                activeFilter === 'File created'
                  ? 'bg-[#7BC141] text-white'
                  : 'bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]'
              }`}
            >
              File created
            </button>
            <button className="h-[28px] px-[12px] text-[11px] font-medium bg-[#D3D3D3] text-[#FFFFFF] rounded">
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        /* Annual Report Filters */
        <div className="p-[12px] bg-white" style={{ gap: '10px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] mb-[12px]">
            <div>
              <label className="text-[11px] text-[#333333] block mb-[4px]">Select year</label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none"
                >
                  <option>2025</option>
                  <option>2024</option>
                  <option>2023</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>
                <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
              </div>
            </div>
            
            <div>
              <label className="text-[11px] text-[#333333] block mb-[4px]">Select employee</label>
              <div className="relative">
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none"
                >
                  <option>All employees</option>
                  <option>Employee 1</option>
                  <option>Employee 2</option>
                  <option>Employee 3</option>
                </select>
                <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
              </div>
            </div>
            
            <div>
              <label className="text-[11px] text-[#333333] block mb-[4px]">Marking</label>
              <div className="relative">
                <select
                  value={selectedMarking}
                  onChange={(e) => setSelectedMarking(e.target.value)}
                  className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none"
                >
                  <option>Not signed</option>
                  <option>Signed</option>
                  <option>In Progress</option>
                </select>
                <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
              </div>
            </div>
          </div>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-[8px] mb-[12px]">
            <button
              onClick={() => setActiveFilter('All')}
              className={`h-[28px] px-[12px] text-[11px] font-medium rounded ${
                activeFilter === 'All'
                  ? 'bg-[#7BC141] text-white'
                  : 'bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('Blue-collar')}
              className={`h-[28px] px-[12px] text-[11px] font-medium rounded ${
                activeFilter === 'Blue-collar'
                  ? 'bg-[#7BC141] text-white'
                  : 'bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]'
              }`}
            >
              Blue-collar
            </button>
            <button
              onClick={() => setActiveFilter('White-collar')}
              className={`h-[28px] px-[12px] text-[11px] font-medium rounded ${
                activeFilter === 'White-collar'
                  ? 'bg-[#7BC141] text-white'
                  : 'bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]'
              }`}
            >
              White-collar
            </button>
            <button className="h-[28px] px-[12px] text-[11px] font-medium bg-[#7BC141] text-white rounded">
              Add
            </button>
            <a href="#" className="text-[11px] text-[#7BC141] ml-auto">See help section</a>
          </div>
        </div>
      )}
      
      {/* Table Section */}
      <div className="w-full overflow-x-auto bg-white border-t border-[#E5E7EB] mt-[8px]">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="h-[38px] bg-white border-b border-[#E5E7EB]">
              {(activeTab === 'Monthly report' 
                ? ['MONTH', 'EMPLOYEE ID', 'FIRST NAME', 'SURNAME', 'PERSONAL ID NUMBER', 'MARKING', 'OPTIONAL', 'RELATED SALARY', 'TOTAL']
                : ['FORUM TYPE', 'EMPLOYEE ID', 'FIRST NAME', 'SURNAME', 'PERSONAL ID NUMBER', 'DATE OF BIRTH', 'CHANGED EMPLOYMENT', 'TOTAL']
              ).map((header, index) => (
                <th 
                  key={header}
                  className={`px-[8px] text-[11px] font-bold text-[#333333] uppercase text-center ${
                    (activeTab === 'Monthly report' && index === 1) || 
                    (activeTab === 'Annual report' && index === 1)
                      ? 'bg-[#D3D3D3] text-[#333333]' 
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
            <tr className="h-[48px] bg-white border-t border-[#E5E7EB] hover:bg-[#F2F2F2]">
              {(activeTab === 'Monthly report' 
                ? Array(9).fill(0)
                : Array(8).fill(0)
              ).map((_, idx) => (
                <td 
                  key={idx} 
                  className={`px-[8px] text-[11px] text-[#333333] border-r border-[#E5E7EB] last:border-r-0 ${
                    activeTab === 'Monthly report' 
                      ? (idx === 7 || idx === 8 ? 'text-right' : 'text-center')
                      : (idx === 7 ? 'text-right' : 'text-center')
                  }`}
                >
                  {activeTab === 'Monthly report' ? (
                    <>
                      {idx === 0 ? 'Jan 2024' : ''}
                      {idx === 1 ? '001' : ''}
                      {idx === 2 ? 'John' : ''}
                      {idx === 3 ? 'Doe' : ''}
                      {idx === 4 ? '19800101-1234' : ''}
                      {idx === 5 ? 'Marking A' : ''}
                      {idx === 6 ? '-' : ''}
                      {idx === 7 ? '15,000' : ''}
                      {idx === 8 ? '25,000' : ''}
                    </>
                  ) : (
                    <>
                      {idx === 0 ? 'Forum Type A' : ''}
                      {idx === 1 ? '001' : ''}
                      {idx === 2 ? 'John' : ''}
                      {idx === 3 ? 'Doe' : ''}
                      {idx === 4 ? '19800101-1234' : ''}
                      {idx === 5 ? '1980-01-01' : ''}
                      {idx === 6 ? 'Changed' : ''}
                      {idx === 7 ? '25,000' : ''}
                    </>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Action Buttons */}
      <div className="sticky bottom-0 p-[10px] bg-white border-t border-[#E5E7EB] flex flex-col md:flex-row items-center justify-between gap-[8px]">
        <div className="text-[11px] text-[#6B7280]">
          (0 selected)
        </div>
        
        <div className="flex items-center gap-[6px] flex-wrap md:flex-nowrap">
          {activeTab === 'Monthly report' ? (
            <>
              <button className="h-[32px] px-[12px] text-[11px] text-[#FFFFFF] bg-[#D3D3D3] rounded-[6px]">
                Delete
              </button>
              <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#7BC141] rounded-[6px]">
                Create file
              </button>
            </>
          ) : (
            <>
              <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#D3D3D3] rounded-[6px]">
                Printout Forum basis
              </button>
              <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#7BC141] rounded-[6px]">
                Printout salary report
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Navigation Link */}
      {activeTab === 'Annual report' && (
        <div className="p-[10px] text-center">
          <a href="#" className="text-[12px] text-[#B5B5B5]">Go to fora.se</a>
        </div>
      )}
      
      {/* Forums Form Modal */}
      <ForumsForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Forums;