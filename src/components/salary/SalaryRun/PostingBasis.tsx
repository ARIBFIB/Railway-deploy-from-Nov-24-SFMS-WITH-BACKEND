import React, { useState } from 'react';

interface TableData {
  anstId: string;
  firstName: string;
  surname: string;
  voucherId: string;
  postingDate: string;
  salaryPeriod: string;
  postedSeries: string;
  postedVoucherNo: string;
}

const PostingBasis = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const tabs = ['All', 'Not posted', 'Posted'];

  const tableData: TableData[] = [];

  const toggleRowSelection = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  return (
    <div className="w-full">
      {/* Information Banner */}
      <div 
        className="w-full h-[112px] rounded-[12px] bg-[#7B768C] p-[16px] pr-[120px] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] relative"
        style={{ fontFamily: 'Inter, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
      >
        <div>
          <h2 className="text-[13px] font-semibold text-white mb-[6px]">Time to post</h2>
          <p className="text-[11px] leading-[15px] text-[#F1F1F1] max-w-[560px]">
            Click on Create accounting documents on the right to create the documentation you need to post the salaries and employer contributions. You can also choose to read more about the accounting documents and the settings available for accounting in Payroll.
          </p>
        </div>
        
        <div className="flex mt-[8px]">
          <button className="h-[28px] px-[14px] bg-white text-[#4A4A4A] text-[11px] font-medium rounded-[16px] mr-[8px]">
            Create underlying accounting information
          </button>
          <button className="h-[28px] px-[14px] bg-transparent border border-[#E6E6E6] text-white text-[11px] rounded-[16px]">
            Read more
          </button>
        </div>
        
        {/* Illustration */}
        <div className="absolute right-[16px] top-1/2 transform -translate-y-1/2">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            {/* Stamp outline */}
            <rect x="10" y="20" width="60" height="40" rx="4" stroke="#6B6B6B" strokeWidth="2" fill="none" opacity="0.85"/>
            
            {/* Inner stamp details */}
            <rect x="15" y="25" width="50" height="30" rx="2" stroke="#9DB7AE" strokeWidth="1" fill="none" opacity="0.85"/>
            
            {/* Checkmark */}
            <path d="M25 35 L32 42 L45 29" stroke="#6B6B6B" strokeWidth="2" fill="none" opacity="0.85"/>
            
            {/* Decorative elements */}
            <circle cx="50" cy="35" r="3" stroke="#6B6B6B" strokeWidth="1" fill="none" opacity="0.85"/>
            <circle cx="55" cy="40" r="2" stroke="#6B6B6B" strokeWidth="1" fill="none" opacity="0.85"/>
          </svg>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="mt-[12px]">
        <div className="relative">
          <input
            type="text"
            placeholder="Employment ID, Voucher ID, Salary period/tax period"
            className="w-[360px] h-[32px] border border-[#DADADA] rounded-[6px] pl-[28px] pr-[8px] py-[6px] bg-white text-[11px] text-[#212121] placeholder-[#9E9E9E] focus:outline-none"
          />
          <span className="absolute left-[8px] top-1/2 transform -translate-y-1/2 text-[14px] text-[#9E9E9E]">🔍</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex mt-[12px] gap-[6px]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-[28px] px-[12px] text-[11px] rounded-[6px] ${
              activeTab === tab
                ? 'bg-[#FFF3B0] border border-[#F2D675] text-[#333333] font-medium'
                : 'bg-white border border-[#E0E0E0] text-[#5F5F5F]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="w-full overflow-x-auto border border-[#E6E6E6] rounded-[8px] bg-white mt-[12px]">
        <table className="w-full min-w-[1000px]">
          {/* Table Header */}
          <thead>
            <tr className="h-[36px] bg-[#FAFAFA] border-b border-[#E6E6E6]">
              {[
                'Checkbox',
                'ANST. ID',
                'FIRST NAME',
                'SURNAME',
                'VOUCHER ID',
                'POSTING DATE',
                'SALARY PERIOD / TAX PERIOD',
                'POSTED: SERIES',
                'POSTED: VOUCHER NO.'
              ].map((header) => (
                <th 
                  key={header}
                  className="px-[8px] text-[10.5px] font-semibold text-[#555555] uppercase text-left"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody>
            {tableData.length > 0 ? (
              tableData.map((row, index) => (
                <tr 
                  key={index} 
                  className="h-[34px] border-b border-[#EEEEEE] hover:bg-[#F8F8F8]"
                >
                  {[
                    '',
                    row.anstId,
                    row.firstName,
                    row.surname,
                    row.voucherId,
                    row.postingDate,
                    row.salaryPeriod,
                    row.postedSeries,
                    row.postedVoucherNo
                  ].map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="px-[8px] text-[11px] text-[#333333]"
                    >
                      {cellIndex === 0 ? ( // Checkbox column
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(index)}
                          onChange={() => toggleRowSelection(index)}
                          className="w-[14px] h-[14px] border border-[#BDBDBD]"
                        />
                      ) : (
                        cell || ''
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty state - create empty rows
              <tr className="h-[34px] border-b border-[#EEEEEE] hover:bg-[#F8F8F8]">
                {Array(9).fill(0).map((_, cellIndex) => (
                  <td 
                    key={cellIndex} 
                    className="px-[8px] text-[11px] text-[#333333]"
                  >
                    {cellIndex === 0 ? ( // Checkbox column
                      <input
                        type="checkbox"
                        className="w-[14px] h-[14px] border border-[#BDBDBD]"
                      />
                    ) : (
                      ''
                    )}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Action Bar */}
      <div className="sticky bottom-0 h-[48px] bg-white border-t border-[#E6E6E6] px-[16px] flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="h-[28px] px-[14px] bg-[#E0E0E0] text-[#9E9E9E] text-[11px] rounded-[14px]"
            disabled
          >
            Delete
          </button>
          <span className="text-[11px] text-[#777777] ml-[8px]">(0 selected)</span>
        </div>
        
        <div className="flex items-center">
          <button className="h-[28px] px-[16px] bg-[#8BC8A8] text-white text-[11px] rounded-[14px] mr-[8px]">
            Printout
          </button>
          <button className="h-[28px] px-[18px] bg-[#6FBF9B] text-white text-[11px] font-semibold rounded-[14px]">
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostingBasis;