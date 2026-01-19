import React, { useState } from 'react';

const GrossSalaryList = () => {
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [fromEmploymentId, setFromEmploymentId] = useState('');
  const [toEmploymentId, setToEmploymentId] = useState('');

  const handlePrint = () => {
    // Create a new window with print-optimized layout
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Gross Salary List - Print</title>
          <style>
            body { 
              margin: 20px; 
              font-family: Inter, Arial, sans-serif; 
              font-size: 13px; 
              color: #2B2B2B; 
              background-color: #FFFFFF; 
              line-height: 1.4;
            }
            .header-area { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              margin-bottom: 16px;
              border-bottom: 2px solid #0A8F3C;
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
              color: #1F1F1F;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }
            .table-header {
              font-size: 13px;
              font-weight: 500;
              background-color: #F5F5F5;
              color: #2B2B2B;
              border: 1px solid #D9D9D9;
            }
            .table-row {
              font-size: 13px;
              color: #2B2B2B;
              border: 1px solid #D9D9D9;
            }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            .bold { font-weight: 500; }
            .no-print {
              display: none;
            }
          </style>
        </head>
        <body>
          <!-- Header Area -->
          <div class="header-area">
            <div class="left-header">Company Name</div>
            <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <!-- Report Title -->
          <div class="report-title">Gross Salary List</div>

          <!-- Filters Summary -->
          <div style="margin-bottom: 16px; font-size: 12px;">
            <strong>Filters:</strong> Payment date: ${fromDate} to ${toDate}
            ${fromEmploymentId || toEmploymentId ? `, Employment ID: ${fromEmploymentId || '-'} to ${toEmploymentId || '-'}` : ''}
          </div>

          <!-- Table -->
          <table>
            <thead class="table-header">
              <tr>
                <th class="text-center" style="padding: 8px;">Employee ID</th>
                <th class="text-left" style="padding: 8px;">Name</th>
                <th class="text-left" style="padding: 8px;">Department</th>
                <th class="text-center" style="padding: 8px;">Payment Date</th>
                <th class="text-right" style="padding: 8px;">Gross Salary</th>
                <th class="text-right" style="padding: 8px;">Tax</th>
                <th class="text-right" style="padding: 8px;">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-row">
                <td class="text-center" style="padding: 8px;">EMP001</td>
                <td class="text-left" style="padding: 8px;">John Doe</td>
                <td class="text-left" style="padding: 8px;">IT</td>
                <td class="text-center" style="padding: 8px;">2026-01-31</td>
                <td class="text-right" style="padding: 8px;">35,000.00</td>
                <td class="text-right" style="padding: 8px;">8,750.00</td>
                <td class="text-right" style="padding: 8px;">26,250.00</td>
              </tr>
              <tr class="table-row">
                <td class="text-center" style="padding: 8px;">EMP002</td>
                <td class="text-left" style="padding: 8px;">Jane Smith</td>
                <td class="text-left" style="padding: 8px;">Finance</td>
                <td class="text-center" style="padding: 8px;">2026-01-31</td>
                <td class="text-right" style="padding: 8px;">42,000.00</td>
                <td class="text-right" style="padding: 8px;">10,500.00</td>
                <td class="text-right" style="padding: 8px;">31,500.00</td>
              </tr>
              <tr class="table-row">
                <td class="text-center" style="padding: 8px;">EMP003</td>
                <td class="text-left" style="padding: 8px;">Mike Johnson</td>
                <td class="text-left" style="padding: 8px;">Operations</td>
                <td class="text-center" style="padding: 8px;">2026-01-31</td>
                <td class="text-right" style="padding: 8px;">38,500.00</td>
                <td class="text-right" style="padding: 8px;">9,625.00</td>
                <td class="text-right" style="padding: 8px;">28,875.00</td>
              </tr>
              <tr class="table-row">
                <td class="text-center" style="padding: 8px;">EMP004</td>
                <td class="text-left" style="padding: 8px;">Sarah Williams</td>
                <td class="text-left" style="padding: 8px;">Marketing</td>
                <td class="text-center" style="padding: 8px;">2026-01-31</td>
                <td class="text-right" style="padding: 8px;">36,200.00</td>
                <td class="text-right" style="padding: 8px;">9,050.00</td>
                <td class="text-right" style="padding: 8px;">27,150.00</td>
              </tr>
              <tr class="table-row">
                <td class="text-center" style="padding: 8px;">EMP005</td>
                <td class="text-left" style="padding: 8px;">Robert Brown</td>
                <td class="text-left" style="padding: 8px;">Sales</td>
                <td class="text-center" style="padding: 8px;">2026-01-31</td>
                <td class="text-right" style="padding: 8px;">41,000.00</td>
                <td class="text-right" style="padding: 8px;">10,250.00</td>
                <td class="text-right" style="padding: 8px;">30,750.00</td>
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

  return (
    <div className="max-w-[1200px] mx-auto p-6 bg-white">
      {/* Page Title */}
      <div className="mb-3">
        <h1 className="text-lg font-semibold text-gray-900">REPORTS</h1>
      </div>

      {/* Top Navigation Tabs */}
      <div className="border-b border-gray-300 mb-4">
        <nav className="flex items-center space-x-5">
          <a href="/reports/salary-statistics" className="text-sm font-medium text-gray-600 py-2.5 hover:text-gray-900 transition-colors">
            Salary statistics
          </a>
          <a href="/reports/personnel-list" className="text-sm font-medium text-gray-600 py-2.5 hover:text-gray-900 transition-colors">
            Personnel list
          </a>
          <a href="/reports/employee-card" className="text-sm font-medium text-gray-600 py-2.5 hover:text-gray-900 transition-colors">
            Employee card
          </a>
          <a href="/reports/salary-type-list" className="text-sm font-medium text-gray-600 py-2.5 hover:text-gray-900 transition-colors">
            Salary type list
          </a>
          <span className="text-sm font-medium text-black pb-2.5 border-b-2 border-green-600">
            Gross salary list
          </span>
          <a href="/reports/salary-survey" className="text-sm font-medium text-gray-600 py-2.5 hover:text-gray-900 transition-colors">
            Salary survey
          </a>
          <a href="/reports/average-number-of-employees" className="text-sm font-medium text-gray-600 py-2.5 hover:text-gray-900 transition-colors">
            the average number of employees
          </a>
        </nav>
      </div>

      {/* Section Header */}
      <div className="mt-4 mb-3.5">
        <div className="flex items-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600 mr-2">
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-base font-medium text-gray-900">Gross salary list</span>
        </div>
      </div>

      {/* Filter Form */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
        {/* Payment Date Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment date</label>
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-9 pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                placeholder="YYYY-MM-DD"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M12 3H4V13H12V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 1V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 1V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="self-center text-gray-500">-</span>
            <div className="relative flex-1">
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-9 pl-3 pr-10 py-2 border border-gray-300 rounded-md bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                placeholder="YYYY-MM-DD"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M12 3H4V13H12V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 1V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 1V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Employment ID Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Employment ID</label>
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <select
                value={fromEmploymentId}
                onChange={(e) => setFromEmploymentId(e.target.value)}
                className="w-full h-9 pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="">-</option>
                <option value="EMP001">EMP001</option>
                <option value="EMP002">EMP002</option>
                <option value="EMP003">EMP003</option>
                <option value="EMP004">EMP004</option>
                <option value="EMP005">EMP005</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="self-center text-gray-500">-</span>
            <div className="relative flex-1">
              <select
                value={toEmploymentId}
                onChange={(e) => setToEmploymentId(e.target.value)}
                className="w-full h-9 pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                <option value="">-</option>
                <option value="EMP001">EMP001</option>
                <option value="EMP002">EMP002</option>
                <option value="EMP003">EMP003</option>
                <option value="EMP004">EMP004</option>
                <option value="EMP005">EMP005</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handlePrint}
          className="h-9 px-5.5 text-sm font-medium text-white bg-green-600 border-none rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default GrossSalaryList;