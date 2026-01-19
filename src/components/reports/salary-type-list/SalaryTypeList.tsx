import React, { useState } from 'react';

const SalaryTypeList = () => {
  const [staffType, setStaffType] = useState('white-collar');
  const [agreementTemplate, setAgreementTemplate] = useState('white-collar');
  const [salaryTypeTable, setSalaryTypeTable] = useState('standard-tjansteman');

  const handlePrint = () => {
    // Create a new window with print-optimized layout
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Salary Type List - Print</title>
          <style>
            body { 
              margin: 20px; 
              font-family: Inter, Arial, sans-serif; 
              font-size: 13px; 
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
              font-size: 13px;
              font-weight: 500;
              background-color: #F5F5F5;
              color: #1F2933;
              border: 1px solid #D1D5DB;
            }
            .table-row {
              font-size: 13px;
              color: #1F2933;
              border: 1px solid #D1D5DB;
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
            .border-b { border-bottom: 1px solid #D1D5DB; }
          </style>
        </head>
        <body>
          <!-- Header Area -->
          <div class="header-area">
            <div class="left-header">Company Name</div>
            <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <!-- Report Title -->
          <div class="report-title">Salary Type List</div>

          <!-- Filters Summary -->
          <div style="margin-bottom: 16px; font-size: 12px;">
            <strong>Filters:</strong> Staff type: ${staffType}, Agreement template: ${agreementTemplate}, Salary type table: ${salaryTypeTable}
          </div>

          <!-- Table -->
          <table>
            <thead class="table-header">
              <tr>
                <th class="text-left py-2 px-3 border-b">Salary Type</th>
                <th class="text-left py-2 px-3 border-b">Description</th>
                <th class="text-center py-2 px-3 border-b">Category</th>
                <th class="text-center py-2 px-3 border-b">Frequency</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-row">
                <td class="py-2 px-3">Basic Salary</td>
                <td class="py-2 px-3">Monthly basic salary for white-collar workers</td>
                <td class="text-center py-2 px-3">Fixed</td>
                <td class="text-center py-2 px-3">Monthly</td>
              </tr>
              <tr class="table-row">
                <td class="py-2 px-3">Overtime Pay</td>
                <td class="py-2 px-3">Compensation for hours worked beyond standard schedule</td>
                <td class="text-center py-2 px-3">Variable</td>
                <td class="text-center py-2 px-3">Per hour</td>
              </tr>
              <tr class="table-row">
                <td class="py-2 px-3">Bonus</td>
                <td class="py-2 px-3">Performance-based bonus payment</td>
                <td class="text-center py-2 px-3">Variable</td>
                <td class="text-center py-2 px-3">Quarterly</td>
              </tr>
              <tr class="table-row">
                <td class="py-2 px-3">Health Insurance</td>
                <td class="py-2 px-3">Employer contribution to health insurance</td>
                <td class="text-center py-2 px-3">Benefits</td>
                <td class="text-center py-2 px-3">Monthly</td>
              </tr>
              <tr class="table-row">
                <td class="py-2 px-3">Pension Contribution</td>
                <td class="py-2 px-3">Employer pension contribution</td>
                <td class="text-center py-2 px-3">Benefits</td>
                <td class="text-center py-2 px-3">Monthly</td>
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
    <div className="bg-white p-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33337 2.5L3.75004 7.08333L1.66671 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-gray-800 ml-1.5">Salary type list</h1>
        </div>
        <div className="h-px bg-gray-200 w-full mt-2 mb-4.5"></div>
      </div>

      {/* Filter Form Section */}
      <div className="max-w-[520px]">
        {/* Staff Type Field */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Staff type</label>
          <div className="relative">
            <select
              value={staffType}
              onChange={(e) => {
                setStaffType(e.target.value);
                // Reset dependent fields when staff type changes
                setAgreementTemplate(e.target.value);
                setSalaryTypeTable('standard-tjansteman');
              }}
              className="w-full h-8 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-600 appearance-none"
            >
              <option value="white-collar">White-collar</option>
              <option value="blue-collar">Blue-collar</option>
              <option value="managerial">Managerial</option>
              <option value="executive">Executive</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Agreement Template Field */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Agreement template</label>
          <div className="relative">
            <select
              value={agreementTemplate}
              onChange={(e) => {
                setAgreementTemplate(e.target.value);
                // Reset dependent field when agreement template changes
                setSalaryTypeTable('standard-tjansteman');
              }}
              className="w-full h-8 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-600 appearance-none"
            >
              <option value="white-collar">White-collar</option>
              <option value="blue-collar">Blue-collar</option>
              <option value="managerial">Managerial</option>
              <option value="executive">Executive</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Salary Type Table Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Salary type table</label>
          <div className="relative">
            <select
              value={salaryTypeTable}
              onChange={(e) => setSalaryTypeTable(e.target.value)}
              className="w-full h-8 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-600 appearance-none"
            >
              <option value="standard-tjansteman">Standard tjänstemän</option>
              <option value="standard-lonarbetare">Standard lönarbetare</option>
              <option value="management">Management</option>
              <option value="executive">Executive</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-end mr-6">
        <button
          className="h-10 px-5.5 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default SalaryTypeList;