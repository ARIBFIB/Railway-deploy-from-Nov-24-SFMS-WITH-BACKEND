import React, { useState } from 'react';
import CollectionForm from './CollectionForm';

const Collection = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [activeTab, setActiveTab] = useState('Tab 1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div className="bg-white max-w-[360px] md:max-w-6xl mx-auto" style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', fontSize: '11px' }}>
      {/* Header with Title, Search and Action Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-[8px] p-[12px] border-b border-[#E5E7EB]">
        <div className="flex items-center gap-[8px] w-full md:w-auto">
          <div className="text-[14px] font-bold text-[#333333] tracking-[0.2px]">
            COLLECTUM - LIST
          </div>
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="Employee, Cost centre"
              className="w-full h-[32px] pl-[30px] pr-[10px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] focus:outline-none"
            />
            <span className="absolute left-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#B5B5B5]">🔍</span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-[8px] w-full md:w-auto justify-end">
          <button className="h-[32px] px-[12px] text-[11px] text-[#FFFFFF] bg-[#D3D3D3] rounded-[6px] flex items-center gap-[4px]">
            <span>🗑️</span> Delete events
          </button>
          <button className="create-collection-btn h-[32px] px-[12px] bg-[#FFCC00] text-[#333333] font-medium text-[12px] rounded-[6px] border-none cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#FFB300] active:bg-[#FFA000] flex items-center gap-[4px]" onClick={() => setIsModalOpen(true)}>
            <span>+</span> Create collection
          </button>
          <button className="h-[32px] px-[12px] bg-[#D3D3D3] text-[#333333] font-medium text-[12px] rounded-[6px] border-none cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#C1C1C1] flex items-center gap-[4px]">
            Add ITP1 event
          </button>
          <button className="h-[32px] px-[12px] bg-[#D3D3D3] text-[#333333] font-medium text-[12px] rounded-[6px] border-none cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#C1C1C1] flex items-center gap-[4px]">
            Add ITP2 event
          </button>
        </div>
      </div>
      
      {/* Notification/Message Box */}
      {showNotification && (
        <div className="p-[12px] bg-[#F6E0B3] border border-[#F6E0B3] rounded-[6px] flex items-start justify-between mb-[12px]">
          <div className="text-[11px] text-[#006400]">
            Currently, reporting via API is not supported. Work to support this will begin in the fall of 2025.
          </div>
          <button 
            className="text-[#006400] hover:text-[#004d00] cursor-pointer"
            onClick={() => setShowNotification(false)}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Tabs */}
      <div className="p-[12px] bg-white border-b border-[#E5E7EB]">
        <div className="flex gap-[24px]">
          <button
            onClick={() => setActiveTab('Tab 1')}
            className={`pb-[4px] text-[12px] font-medium ${
              activeTab === 'Tab 1'
                ? 'text-[#333333] border-b-2 border-[#7BC141]'
                : 'text-[#757575]'
            }`}
          >
            Tab 1
          </button>
          <button
            onClick={() => setActiveTab('Tab 2')}
            className={`pb-[4px] text-[12px] font-medium ${
              activeTab === 'Tab 2'
                ? 'text-[#333333] border-b-2 border-[#7BC141]'
                : 'text-[#757575]'
            }`}
          >
            Tab 2
          </button>
          <button
            onClick={() => setActiveTab('Tab 3')}
            className={`pb-[4px] text-[12px] font-medium ${
              activeTab === 'Tab 3'
                ? 'text-[#333333] border-b-2 border-[#7BC141]'
                : 'text-[#757575]'
            }`}
          >
            Tab 3
          </button>
        </div>
      </div>
      
      {/* Content Area - Different content for each tab */}
      <div className="p-[12px]">
        {activeTab === 'Tab 1' && (
          <div>
            {/* Filter Section */}
            <div className="mb-[12px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[10px] mb-[12px]">
                <div>
                  <label className="text-[11px] text-[#333333] block mb-[4px]">Type</label>
                  <div className="relative">
                    <select className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none">
                      <option>All</option>
                      <option>Type A</option>
                      <option>Type B</option>
                      <option>Type C</option>
                    </select>
                    <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-[11px] text-[#333333] block mb-[4px]">Events</label>
                  <div className="relative">
                    <select className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none">
                      <option>All</option>
                      <option>Event 1</option>
                      <option>Event 2</option>
                      <option>Event 3</option>
                    </select>
                    <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
                  </div>
                </div>
                
                <div>
                  <label className="text-[11px] text-[#333333] block mb-[4px]">Month</label>
                  <div className="relative">
                    <select className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none">
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
                  <label className="text-[11px] text-[#333333] block mb-[4px]">Employee</label>
                  <div className="relative">
                    <select className="w-full h-[32px] border border-[#D3D3D3] rounded bg-white text-[11px] text-[#333333] appearance-none px-[10px] pr-[28px] focus:outline-none">
                      <option>All</option>
                      <option>Employee 1</option>
                      <option>Employee 2</option>
                      <option>Employee 3</option>
                    </select>
                    <span className="absolute right-[8px] top-1/2 transform -translate-y-1/2 text-[10px] text-[#B5B5B5] pointer-events-none">▼</span>
                  </div>
                </div>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-[8px] mb-[12px]">
                <button className="h-[28px] px-[12px] text-[11px] font-medium rounded bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]">
                  All
                </button>
                <button className="h-[28px] px-[12px] text-[11px] font-medium rounded bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]">
                  Created
                </button>
                <button className="h-[28px] px-[12px] text-[11px] font-medium rounded bg-[#5E9BC2] text-white">
                  Printed
                </button>
                <button className="h-[28px] px-[12px] text-[11px] font-medium rounded bg-[#F5F5F5] text-[#333333] border border-[#D3D3D3]">
                  File created
                </button>
                <button className="h-[28px] px-[12px] text-[11px] font-medium bg-[#D3D3D3] text-[#FFFFFF] rounded">
                  Clear filters
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-[6px] mb-[12px]">
                <button className="h-[32px] px-[12px] text-[11px] text-[#FFFFFF] bg-[#D3D3D3] rounded-[6px]">
                  Delete
                </button>
                <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#7BC141] rounded-[6px]">
                  Create file
                </button>
                <button className="h-[32px] px-[14px] text-[12px] font-semibold text-white bg-[#7BC141] rounded-[6px]">
                  Printout salary report
                </button>
              </div>
            </div>
            
            {/* Table Section */}
            <div className="w-full overflow-x-auto bg-white border border-[#E5E7EB] rounded-[4px]">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="h-[38px] bg-white border-b border-[#E5E7EB]">
                    {[
                      'TYPE', 'YEAR', 'MONTH', 'EMPLOYEE ID', 'FIRST NAME', 
                      'SURNAME', 'PERSONAL ID NUMBER', 'DATE OF BIRTH', 'TOTAL'
                    ].map((header, index) => (
                      <th 
                        key={header}
                        className={`px-[8px] text-[11px] font-bold text-[#333333] uppercase text-center ${index === 0 ? 'bg-[#D3D3D3] text-[#333333]' : ''} border-r border-[#E5E7EB] last:border-r-0`}
                        style={{ fontSize: '11px' }}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="h-[48px] bg-white border-t border-[#E5E7EB] hover:bg-[#F2F2F2]">
                    {Array(9).fill(0).map((_, idx) => (
                      <td 
                        key={idx} 
                        className={`px-[8px] text-[11px] text-[#333333] border-r border-[#E5E7EB] last:border-r-0 ${
                          idx === 8 ? 'text-right' : 'text-center'
                        }`}
                      >
                        {idx === 0 && (
                          <div className="flex items-center">
                            <input type="checkbox" className="mr-[8px]" />
                            Event A
                          </div>
                        )}
                        {idx === 1 && '2025'}
                        {idx === 2 && 'Jan'}
                        {idx === 3 && '001'}
                        {idx === 4 && 'John'}
                        {idx === 5 && 'Doe'}
                        {idx === 6 && '19800101-1234'}
                        {idx === 7 && '1980-01-01'}
                        {idx === 8 && '25,000'}
                      </td>
                    ))}
                  </tr>
                  <tr className="h-[48px] bg-white border-t border-[#E5E7EB] hover:bg-[#F2F2F2]">
                    {Array(9).fill(0).map((_, idx) => (
                      <td 
                        key={idx} 
                        className={`px-[8px] text-[11px] text-[#333333] border-r border-[#E5E7EB] last:border-r-0 ${
                          idx === 8 ? 'text-right' : 'text-center'
                        }`}
                      >
                        {idx === 0 && (
                          <div className="flex items-center">
                            <input type="checkbox" className="mr-[8px]" />
                            Event B
                          </div>
                        )}
                        {idx === 1 && '2025'}
                        {idx === 2 && 'Feb'}
                        {idx === 3 && '002'}
                        {idx === 4 && 'Jane'}
                        {idx === 5 && 'Smith'}
                        {idx === 6 && '19900202-5678'}
                        {idx === 7 && '1990-02-02'}
                        {idx === 8 && '28,000'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'Tab 2' && (
          <div className="text-center py-12">
            <p className="text-[#6F6F6F]">Content for Tab 2</p>
          </div>
        )}
        {activeTab === 'Tab 3' && (
          <div className="text-center py-12">
            <p className="text-[#6F6F6F]">Content for Tab 3</p>
          </div>
        )}
      </div>
      
      {/* Collection Form Modal */}
      <CollectionForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Collection;