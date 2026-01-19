import React from 'react';

const FinancialReportScreen = () => {
  // Sample data for the financial report
  const reportData = {
    companyName: "Test company",
    financialYear: "2026-01-01 - 2026-12-31",
    period: "2026-01-01 - 2026-12-31",
    printedDate: "2026-01-18 09:21",
    version: "A 6 B 3 F 3 M 1"
  };

  // Sample account data
  const accountData = [
    { section: "OPERATING INCOME", isHeader: true, isTotal: false },
    { account: "3000", name: "Sales revenue", values: [150.5, 145.2, 158.7, 162.3, 149.8, 155.1, 160.4, 157.9, 163.2, 159.6, 165.3, 161.7, 1875.4], isLink: true },
    { account: "3100", name: "Service income", values: [25.3, 28.7, 22.1, 30.5, 27.9, 24.6, 29.8, 26.4, 31.2, 28.7, 32.5, 29.1, 336.8], isLink: true },
    { section: "Total operating income", isHeader: false, isTotal: true, values: [175.8, 173.9, 180.8, 192.8, 177.7, 179.7, 190.2, 184.3, 194.4, 188.3, 197.8, 190.8, 2212.2] },
    
    { section: "COSTS OF OPERATION", isHeader: true, isTotal: false },
    { subsection: "Other external costs", isSubHeader: true },
    { account: "5410", name: "Consumables", values: [12.4, 11.8, 13.2, 14.1, 12.7, 13.5, 14.3, 13.8, 14.6, 14.2, 15.1, 13.9, 163.6], isLink: true },
    { account: "6110", name: "Office supplies", values: [8.2, 7.9, 8.5, 9.1, 8.3, 8.7, 9.2, 8.9, 9.4, 9.1, 9.7, 9.0, 107.1], isLink: true },
    { section: "Total other external costs", isHeader: false, isTotal: true, values: [20.6, 19.7, 21.7, 23.2, 21.0, 22.2, 23.5, 22.7, 24.0, 23.3, 24.8, 22.9, 270.7] },
    
    { section: "TOTAL OPERATING COSTS", isHeader: true, isTotal: true, values: [20.6, 19.7, 21.7, 23.2, 21.0, 22.2, 23.5, 22.7, 24.0, 23.3, 24.8, 22.9, 270.7] },
    
    { section: "CALCULATED RESULT", isHeader: true, isTotal: true, values: [155.2, 154.2, 159.1, 169.6, 156.7, 157.5, 166.7, 161.6, 170.4, 165.0, 173.0, 167.9, 1941.5] }
  ];

  const months = ['2601', '2602', '2603', '2604', '2605', '2606', '2607', '2608', '2609', '2610', '2611', '2612'];

  const formatNumber = (num: number) => {
    return num.toLocaleString('sv-SE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  return (
    <div 
      className="w-full h-full bg-white overflow-auto"
      style={{ 
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '12px',
        color: '#000000',
        lineHeight: '1.2'
      }}
    >
      {/* Header Area */}
      <div className="flex justify-between items-start p-[12px]">
        {/* Left Header Block */}
        <div>
          <div className="font-bold text-[13px]">{reportData.companyName}</div>
          <div className="text-[12px]">Financial Year {reportData.financialYear}</div>
          <div className="text-[12px]">Period {reportData.period}</div>
          <div className="text-[12px] mt-[4px]">Amounts are expressed in thousands of kronor.</div>
        </div>

        {/* Center Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-[16px] font-bold text-[26px]">
          Results per month
        </div>

        {/* Right Header Block */}
        <div className="text-right">
          <div className="text-[11px]">Printed {reportData.printedDate}</div>
          <div className="text-[11px]">Latest version {reportData.version}</div>
        </div>
      </div>

      {/* Table Structure */}
      <div className="px-[12px] pb-[12px]">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="text-left font-bold pb-[6px]" style={{ width: '320px' }}>Account / Description</th>
              {months.map(month => (
                <th key={month} className="text-center font-bold pb-[6px]" style={{ width: '70px' }}>
                  {month}
                </th>
              ))}
              <th className="text-center font-bold pb-[6px]" style={{ width: '70px' }}>Ack</th>
            </tr>
          </thead>
          <tbody>
            {accountData.map((row, index) => (
              <tr key={index}>
                <td className="align-top">
                  {row.isHeader ? (
                    <div className="font-bold text-[13px] uppercase pt-[14px] pb-[6px]">
                      {row.section}
                    </div>
                  ) : row.isSubHeader ? (
                    <div className="text-[12px] pl-[16px] pt-[6px] pb-[4px]">
                      {row.subsection}
                    </div>
                  ) : (
                    <div className="pl-[32px]">
                      {row.isLink ? (
                        <a 
                          href="#" 
                          className="text-[#0000EE] underline"
                          style={{ fontSize: '12px' }}
                        >
                          {row.account} {row.name}
                        </a>
                      ) : (
                        <span className="text-[12px]">
                          {row.account} {row.name}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                
                {row.values && [...row.values].map((value, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`text-right align-top ${row.isTotal ? 'font-bold' : ''}`}
                    style={{ 
                      width: '70px',
                      paddingTop: row.isTotal ? '6px' : '0',
                      paddingBottom: row.isTotal ? '6px' : '0'
                    }}
                  >
                    {formatNumber(value)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialReportScreen;