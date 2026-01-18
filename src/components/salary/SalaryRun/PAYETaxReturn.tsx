import React, { useState } from 'react';

interface TableData {
  taxPeriod: string;
  totalDocumentation: string | number;
  totalEmployerContribution: string | number;
  documentationTaxDeduction: string | number;
  deductedTax: string | number;
  toPay: string | number;
  personalInformation: string;
  absenceInformation: string;
  adjustment: string;
  limitAthlete: string;
  status: string;
}

const PAYETaxReturn = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Mock data for the table - in a real app this would come from props or API
  const tableData: TableData[] = [];

  const tabs = ['All', 'Created', 'Preliminary', 'Submitted', 'Changed', 'Invalid'];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Created':
        return { backgroundColor: '#E0E0E0', color: '#333333' };
      case 'Preliminary':
        return { backgroundColor: '#E3F2FD', color: '#1565C0' };
      case 'Submitted':
        return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
      case 'Changed':
        return { backgroundColor: '#FFF3E0', color: '#EF6C00' };
      case 'Invalid':
        return { backgroundColor: '#FDECEA', color: '#C62828' };
      default:
        return { backgroundColor: '#E0E0E0', color: '#333333' };
    }
  };

  const getIndicatorColor = (tab: string) => {
    switch(tab) {
      case 'Preliminary':
        return '#B3E5FC'; // light blue
      case 'Submitted':
        return '#C8E6C9'; // light green
      case 'Changed':
        return '#FFE0B2'; // light orange
      case 'Invalid':
        return '#FFCDD2'; // light red
      default:
        return 'transparent';
    }
  };

  const toggleRowSelection = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto pb-[2px] sticky top-[56px] z-10 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`h-[32px] px-[12px] text-[12px] font-medium rounded-[4px] whitespace-nowrap mr-[8px] relative ${
              activeTab === tab
                ? 'bg-[#EDEDED] text-[#2F2F2F]'
                : 'bg-white text-[#555555] border border-[#DADADA]'
            }`}
            style={{
              transition: 'all 150ms ease-in-out',
            }}
          >
            {tab}
            {activeTab === tab && (
              <div 
                className="h-[2px] absolute bottom-0 left-0 right-0"
                style={{ backgroundColor: getIndicatorColor(tab) }}
              ></div>
            )}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto bg-white border border-[#E0E0E0] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-[12px] mt-[8px]">
        <table className="w-full min-w-[900px]">
          {/* Table Header */}
          <thead>
            <tr className="h-[40px] bg-[#FAFAFA] border-b-[2px] border-b-[#D0D0D0]">
              {[
                'TAX PERIOD',
                'TOTAL DOCUMENTATION',
                'TOTAL EMPLOYER\'S CONTRIBUTION',
                'DOCUMENTATION TAX DEDUCTION',
                'DEDUCTED TAX',
                'TO PAY',
                'PERSONAL INFORMATION',
                'ABSENCE INFORMATION',
                'ADJUSTMENT',
                'LIMIT / ATHLETE',
                'STATUS'
              ].map((header) => (
                <th 
                  key={header}
                  className="px-[8px] py-[10px] text-[11px] font-semibold text-[#333333] uppercase text-left"
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
                <tr key={index} className="h-[48px] bg-white border-b border-[#E0E0E0]">
                  {[
                    row.taxPeriod,
                    row.totalDocumentation,
                    row.totalEmployerContribution,
                    row.documentationTaxDeduction,
                    row.deductedTax,
                    row.toPay,
                    row.personalInformation,
                    row.absenceInformation,
                    row.adjustment,
                    row.limitAthlete,
                    row.status
                  ].map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="px-[8px] py-[10px] text-[12px] text-[#333333]"
                    >
                      {cellIndex === 10 ? ( // Status column
                        <span 
                          className="inline-block h-[20px] px-[8px] text-[11px] font-medium rounded-full"
                          style={getStatusStyle(row.status)}
                        >
                          {row.status}
                        </span>
                      ) : (
                        cell || '0'
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td colSpan={11} className="text-center py-[24px] text-[14px] text-[#444444]">
                  Here you will see your created declaration periods
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#F5F5F5] border-t border-[#DADADA] h-[56px] flex items-center px-[16px] flex-wrap">
        <div className="flex items-center gap-[8px] mr-[16px]">
          <button 
            className={`h-[32px] px-[16px] rounded-[18px] ${
              selectedRows.length > 0 
                ? 'bg-[#CFCFCF] text-white' 
                : 'bg-[#CFCFCF] text-white opacity-50 cursor-not-allowed'
            }`}
            disabled={selectedRows.length === 0}
          >
            Delete
          </button>
          <button className="h-[32px] px-[16px] bg-[#D0D0D0] text-white rounded-[18px]">
            Recreate
          </button>
        </div>

        <div className="flex items-center gap-[8px] ml-auto flex-wrap">
          <div className="relative">
            <button className="h-[32px] px-[12px] bg-white border border-[#CCCCCC] rounded-[18px] flex items-center">
              PAYE tax return <span className="ml-[6px]">▼</span>
            </button>
          </div>
          <button className="h-[32px] px-[12px] bg-[#A5D6A7] text-[#1B5E20] rounded-[18px] flex items-center">
            <span className="mr-[6px]">🖨️</span> Print
          </button>
          <div className="relative">
            <button className="h-[32px] px-[12px] bg-white border border-[#CCCCCC] rounded-[18px] text-[12px]">
              Automatic submission of data for PAYE tax returns per employee to Skatteverket ▾
            </button>
          </div>
          <button className="h-[32px] px-[18px] bg-[#2E7D32] text-white rounded-[18px]">
            Execute
          </button>
        </div>
      </div>
    </div>
  );
};

export default PAYETaxReturn;