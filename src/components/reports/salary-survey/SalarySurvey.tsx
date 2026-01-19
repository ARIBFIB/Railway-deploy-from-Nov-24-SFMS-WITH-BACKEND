import React, { useState } from 'react';

const SalarySurvey = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [countValue, setCountValue] = useState('0');

  const handlePrint = () => {
    // Create a new window with print-optimized layout
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Salary Survey - Print</title>
          <style>
            body { 
              margin: 20px; 
              font-family: Inter, Arial, sans-serif; 
              font-size: 12px; 
              color: #1F2933; 
              background-color: #FFFFFF; 
              line-height: 1.4;
            }
            .header-area { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              margin-bottom: 16px;
              border-bottom: 2px solid #0A7A3C;
              padding-bottom: 10px;
            }
            .left-header { 
              font-size: 14px; 
              font-weight: 500;
              text-align: left; 
            }
            .right-header { 
              font-size: 14px; 
              text-align: right; 
            }
            .report-title {
              text-align: center;
              font-size: 18px;
              font-weight: 600;
              margin: 16px 0;
              color: #1F2933;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }
            .table-header {
              font-size: 11px;
              font-weight: 600;
              text-transform: uppercase;
              background-color: #FFFFFF;
              color: #1F2933;
              border: 1px solid #E5E7EB;
            }
            .category-header {
              background-color: #BDBDBD !important;
              color: #FFFFFF !important;
              font-weight: 700;
              text-transform: uppercase;
            }
            .table-row {
              font-size: 12px;
              color: #1F2933;
              border: 1px solid #E5E7EB;
            }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            .bold { font-weight: 500; }
            .no-print {
              display: none;
            }
            .py-2 { padding-top: 8px; padding-bottom: 8px; }
            .px-3 { padding-left: 12px; padding-right: 12px; }
            .border-b { border-bottom: 1px solid #E5E7EB; }
          </style>
        </head>
        <body>
          <!-- Header Area -->
          <div class="header-area">
            <div class="left-header">Company Name</div>
            <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <!-- Report Title -->
          <div class="report-title">Salary Survey</div>

          <!-- Filters Summary -->
          <div style="margin-bottom: 16px; font-size: 12px;">
            <strong>Filter:</strong> Status: ${statusFilter}
          </div>

          <!-- Table -->
          <table>
            <thead class="table-header">
              <tr>
                <th class="category-header text-left py-2 px-3" style="width: 140px;">CATEGORY</th>
                <th class="text-center py-2 px-3">NUMBER OF WOMEN</th>
                <th class="text-center py-2 px-3">NUMBER OF MEN</th>
                <th class="text-center py-2 px-3">PROPORTION OF WOMEN</th>
                <th class="text-center py-2 px-3">TOTAL NUMBER</th>
                <th class="text-center py-2 px-3">AVERAGE WAGE WOMEN</th>
                <th class="text-center py-2 px-3">AVERAGE WAGE MEN</th>
                <th class="text-center py-2 px-3">AVERAGE WAGE EVERYBODY</th>
                <th class="text-center py-2 px-3">WOMEN'S WAGES IN % OF MEN'S</th>
                <th class="text-center py-2 px-3">LOWEST PAY WOMEN</th>
                <th class="text-center py-2 px-3">HIGHEST PAY WOMEN</th>
                <th class="text-center py-2 px-3">LOWEST PAY MEN</th>
                <th class="text-center py-2 px-3">HIGHEST PAY MEN</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-row">
                <td class="text-left py-2 px-3">Management</td>
                <td class="text-center py-2 px-3">3</td>
                <td class="text-center py-2 px-3">7</td>
                <td class="text-center py-2 px-3">30%</td>
                <td class="text-center py-2 px-3">10</td>
                <td class="text-center py-2 px-3">€4,250</td>
                <td class="text-center py-2 px-3">€4,750</td>
                <td class="text-center py-2 px-3">€4,500</td>
                <td class="text-center py-2 px-3">89.5%</td>
                <td class="text-center py-2 px-3">€3,800</td>
                <td class="text-center py-2 px-3">€4,800</td>
                <td class="text-center py-2 px-3">€4,200</td>
                <td class="text-center py-2 px-3">€5,500</td>
              </tr>
              <tr class="table-row">
                <td class="text-left py-2 px-3">Development</td>
                <td class="text-center py-2 px-3">5</td>
                <td class="text-center py-2 px-3">15</td>
                <td class="text-center py-2 px-3">25%</td>
                <td class="text-center py-2 px-3">20</td>
                <td class="text-center py-2 px-3">€3,500</td>
                <td class="text-center py-2 px-3">€3,750</td>
                <td class="text-center py-2 px-3">€3,625</td>
                <td class="text-center py-2 px-3">93.3%</td>
                <td class="text-center py-2 px-3">€3,000</td>
                <td class="text-center py-2 px-3">€4,200</td>
                <td class="text-center py-2 px-3">€3,200</td>
                <td class="text-center py-2 px-3">€4,500</td>
              </tr>
              <tr class="table-row">
                <td class="text-left py-2 px-3">Sales</td>
                <td class="text-center py-2 px-3">8</td>
                <td class="text-center py-2 px-3">12</td>
                <td class="text-center py-2 px-3">40%</td>
                <td class="text-center py-2 px-3">20</td>
                <td class="text-center py-2 px-3">€3,200</td>
                <td class="text-center py-2 px-3">€3,400</td>
                <td class="text-center py-2 px-3">€3,300</td>
                <td class="text-center py-2 px-3">94.1%</td>
                <td class="text-center py-2 px-3">€2,800</td>
                <td class="text-center py-2 px-3">€3,800</td>
                <td class="text-center py-2 px-3">€3,000</td>
                <td class="text-center py-2 px-3">€4,000</td>
              </tr>
              <tr class="table-row">
                <td class="text-left py-2 px-3">HR</td>
                <td class="text-center py-2 px-3">6</td>
                <td class="text-center py-2 px-3">4</td>
                <td class="text-center py-2 px-3">60%</td>
                <td class="text-center py-2 px-3">10</td>
                <td class="text-center py-2 px-3">€3,100</td>
                <td class="text-center py-2 px-3">€3,300</td>
                <td class="text-center py-2 px-3">€3,200</td>
                <td class="text-center py-2 px-3">93.9%</td>
                <td class="text-center py-2 px-3">€2,700</td>
                <td class="text-center py-2 px-3">€3,600</td>
                <td class="text-center py-2 px-3">€2,900</td>
                <td class="text-center py-2 px-3">€3,800</td>
              </tr>
            </tbody>
          </table>
          
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
        </html>
      `);
      printWindow.focus();
    }
  };

  // Sample data for the table
  const tableData = [
    {
      category: 'Management',
      womenCount: 3,
      menCount: 7,
      womenProportion: '30%',
      totalCount: 10,
      avgWageWomen: '€4,250',
      avgWageMen: '€4,750',
      avgWageAll: '€4,500',
      womenWagesPercentOfMen: '89.5%',
      lowestPayWomen: '€3,800',
      highestPayWomen: '€4,800',
      lowestPayMen: '€4,200',
      highestPayMen: '€5,500',
    },
    {
      category: 'Development',
      womenCount: 5,
      menCount: 15,
      womenProportion: '25%',
      totalCount: 20,
      avgWageWomen: '€3,500',
      avgWageMen: '€3,750',
      avgWageAll: '€3,625',
      womenWagesPercentOfMen: '93.3%',
      lowestPayWomen: '€3,000',
      highestPayWomen: '€4,200',
      lowestPayMen: '€3,200',
      highestPayMen: '€4,500',
    },
    {
      category: 'Sales',
      womenCount: 8,
      menCount: 12,
      womenProportion: '40%',
      totalCount: 20,
      avgWageWomen: '€3,200',
      avgWageMen: '€3,400',
      avgWageAll: '€3,300',
      womenWagesPercentOfMen: '94.1%',
      lowestPayWomen: '€2,800',
      highestPayWomen: '€3,800',
      lowestPayMen: '€3,000',
      highestPayMen: '€4,000',
    },
    {
      category: 'HR',
      womenCount: 6,
      menCount: 4,
      womenProportion: '60%',
      totalCount: 10,
      avgWageWomen: '€3,100',
      avgWageMen: '€3,300',
      avgWageAll: '€3,200',
      womenWagesPercentOfMen: '93.9%',
      lowestPayWomen: '€2,700',
      highestPayWomen: '€3,600',
      lowestPayMen: '€2,900',
      highestPayMen: '€3,800',
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Top Control Bar */}
      <div className="flex justify-between items-center mb-4 px-4">
        {/* Status Filter Toggle */}
        <div className="flex">
          <button
            className={`h-7 px-3.5 text-xs font-semibold ${
              statusFilter === 'all'
                ? 'border border-gray-400 bg-gray-50 text-gray-800'
                : 'border border-gray-200 bg-white text-gray-500'
            } rounded-md mr-1.5`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`h-7 px-3.5 text-xs font-semibold ${
              statusFilter === 'complete'
                ? 'border border-gray-400 bg-gray-50 text-gray-800'
                : 'border border-gray-200 bg-white text-gray-500'
            } rounded-md`}
            onClick={() => setStatusFilter('complete')}
          >
            Complete
          </button>
        </div>

        {/* Utility Icons */}
        <div className="flex items-center space-x-2">
          <button className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7.5H13M3 10.5H9M6 4.5H10C10.5523 4.5 11 4.94772 11 5.5V12.5C11 13.0523 10.5523 13.5 10 13.5H6C5.44772 13.5 5 13.0523 5 12.5V5.5C5 4.94772 5.44772 4.5 6 4.5Z" stroke="#1F2933" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="h-8 border border-gray-200 rounded-md flex items-center px-2.5">
            <span className="text-xs text-gray-700 mr-1">{countValue}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="#1F2933" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="mx-4 mb-4 border border-gray-200 rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="h-10.5">
              <th className="bg-gray-400 text-white font-bold text-[11px] uppercase w-[140px] py-2 px-3 text-left">
                CATEGORY
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                NUMBER OF WOMEN
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                NUMBER OF MEN
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                PROPORTION OF WOMEN
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                TOTAL NUMBER
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                AVERAGE WAGE WOMEN
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                AVERAGE WAGE MEN
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                AVERAGE WAGE EVERYBODY
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                WOMEN'S WAGES IN % OF MEN'S
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                LOWEST PAY WOMEN
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                HIGHEST PAY WOMEN
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                LOWEST PAY MEN
              </th>
              <th className="bg-white text-gray-800 font-semibold text-[11px] uppercase text-center py-2 px-2.5 min-w-[110px]">
                HIGHEST PAY MEN
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index} className="h-10 border-b border-gray-200">
                <td className="text-gray-800 text-sm text-left py-1.5 px-3">{row.category}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.womenCount}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.menCount}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.womenProportion}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.totalCount}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.avgWageWomen}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.avgWageMen}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.avgWageAll}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.womenWagesPercentOfMen}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.lowestPayWomen}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.highestPayWomen}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.lowestPayMen}</td>
                <td className="text-gray-800 text-sm text-center py-1.5 px-2.5">{row.highestPayMen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Action Button */}
      <div className="flex justify-end mr-2 mt-4">
        <button
          className="h-9 px-4.5 text-sm font-semibold text-white bg-green-400 rounded-full hover:bg-green-600"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default SalarySurvey;