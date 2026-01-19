import React, { useState } from 'react';

const StaffCard = () => {
  const [selectedColumns, setSelectedColumns] = useState({
    staffInformation: true,
    employment: true,
    salaryDetails: false,
    dachshund: false,
    holiday: false,
    reports: false,
    initialBalance: false,
  });

  const [employmentIdFrom, setEmploymentIdFrom] = useState('');
  const [employmentIdTo, setEmploymentIdTo] = useState('');
  const [status, setStatus] = useState('all');

  const toggleColumn = (column: keyof typeof selectedColumns) => {
    setSelectedColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const toggleAllColumns = () => {
    const allSelected = Object.values(selectedColumns).every(value => value);
    const newSelection = {} as Record<keyof typeof selectedColumns, boolean>;
    (Object.keys(selectedColumns) as (keyof typeof selectedColumns)[]).forEach(key => {
      newSelection[key] = !allSelected;
    });
    setSelectedColumns(newSelection);
  };

  const handlePrint = () => {
    // Create a new window with print-optimized layout
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Staff Card - Print</title>
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
            .employee-card {
              border: 1px solid #D1D5DB;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 20px;
            }
            .employee-header {
              border-bottom: 1px solid #E5E7EB;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .section-title {
              font-size: 14px;
              font-weight: 600;
              color: #1F2933;
              margin: 12px 0 8px 0;
            }
            .section-content {
              margin-bottom: 12px;
            }
            .data-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
            }
            .data-label {
              font-weight: 500;
              color: #1F2933;
            }
            .data-value {
              color: #1F2933;
            }
            .page-break {
              page-break-after: always;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            th, td {
              border: 1px solid #D1D5DB;
              padding: 6px;
              text-align: left;
            }
            th {
              background-color: #F3F4F6;
              font-weight: 500;
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
          <div class="report-title">Staff Card</div>

          <!-- Filters Summary -->
          <div style="margin-bottom: 16px; font-size: 12px;">
            <strong>Filters:</strong> Employment ID: ${employmentIdFrom || '-'} to ${employmentIdTo || '-'}, Status: ${status}
          </div>

          <!-- Employee Card -->
          <div class="employee-card">
            <div class="employee-header">
              <div style="font-size: 16px; font-weight: 600;">John Doe</div>
              <div style="font-size: 14px; color: #6B7280;">ID: EMP001 | Status: Active</div>
            </div>

            <!-- Staff Information Section -->
            ${selectedColumns.staffInformation ? `
            <div class="section-title">Staff Information</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Name:</span>
                <span class="data-value">John Doe</span>
              </div>
              <div class="data-row">
                <span class="data-label">Personal Identity Number:</span>
                <span class="data-value">198001011234</span>
              </div>
              <div class="data-row">
                <span class="data-label">Address:</span>
                <span class="data-value">123 Main Street, City, Country</span>
              </div>
              <div class="data-row">
                <span class="data-label">Phone:</span>
                <span class="data-value">+123 456 7890</span>
              </div>
              <div class="data-row">
                <span class="data-label">Email:</span>
                <span class="data-value">john.doe@company.com</span>
              </div>
            </div>
            ` : ''}

            <!-- Employment Section -->
            ${selectedColumns.employment ? `
            <div class="section-title">Employment</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Employment ID:</span>
                <span class="data-value">EMP001</span>
              </div>
              <div class="data-row">
                <span class="data-label">Start Date:</span>
                <span class="data-value">2020-01-15</span>
              </div>
              <div class="data-row">
                <span class="data-label">End Date:</span>
                <span class="data-value">-</span>
              </div>
              <div class="data-row">
                <span class="data-label">Department:</span>
                <span class="data-value">IT Department</span>
              </div>
              <div class="data-row">
                <span class="data-label">Position:</span>
                <span class="data-value">Software Developer</span>
              </div>
            </div>
            ` : ''}

            <!-- Salary Details Section -->
            ${selectedColumns.salaryDetails ? `
            <div class="section-title">Salary Details</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Salary Type:</span>
                <span class="data-value">Monthly</span>
              </div>
              <div class="data-row">
                <span class="data-label">Gross Salary:</span>
                <span class="data-value">€4,500</span>
              </div>
              <div class="data-row">
                <span class="data-label">Net Salary:</span>
                <span class="data-value">€3,200</span>
              </div>
            </div>
            ` : ''}

            <!-- Holiday Section -->
            ${selectedColumns.holiday ? `
            <div class="section-title">Holiday</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Annual Leave:</span>
                <span class="data-value">25 days</span>
              </div>
              <div class="data-row">
                <span class="data-label">Used:</span>
                <span class="data-value">8 days</span>
              </div>
              <div class="data-row">
                <span class="data-label">Remaining:</span>
                <span class="data-value">17 days</span>
              </div>
            </div>
            ` : ''}

            <!-- Reports Section -->
            ${selectedColumns.reports ? `
            <div class="section-title">Reports</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Last Report:</span>
                <span class="data-value">2026-01-15</span>
              </div>
              <div class="data-row">
                <span class="data-label">Next Review:</span>
                <span class="data-value">2026-04-15</span>
              </div>
            </div>
            ` : ''}
          </div>

          <!-- Second Employee Card -->
          <div class="employee-card">
            <div class="employee-header">
              <div style="font-size: 16px; font-weight: 600;">Jane Smith</div>
              <div style="font-size: 14px; color: #6B7280;">ID: EMP002 | Status: Active</div>
            </div>

            <!-- Staff Information Section -->
            ${selectedColumns.staffInformation ? `
            <div class="section-title">Staff Information</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Name:</span>
                <span class="data-value">Jane Smith</span>
              </div>
              <div class="data-row">
                <span class="data-label">Personal Identity Number:</span>
                <span class="data-value">198502021234</span>
              </div>
              <div class="data-row">
                <span class="data-label">Address:</span>
                <span class="data-value">456 Oak Avenue, City, Country</span>
              </div>
              <div class="data-row">
                <span class="data-label">Phone:</span>
                <span class="data-value">+123 456 7891</span>
              </div>
              <div class="data-row">
                <span class="data-label">Email:</span>
                <span class="data-value">jane.smith@company.com</span>
              </div>
            </div>
            ` : ''}

            <!-- Employment Section -->
            ${selectedColumns.employment ? `
            <div class="section-title">Employment</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Employment ID:</span>
                <span class="data-value">EMP002</span>
              </div>
              <div class="data-row">
                <span class="data-label">Start Date:</span>
                <span class="data-value">2021-03-10</span>
              </div>
              <div class="data-row">
                <span class="data-label">End Date:</span>
                <span class="data-value">-</span>
              </div>
              <div class="data-row">
                <span class="data-label">Department:</span>
                <span class="data-value">Finance Department</span>
              </div>
              <div class="data-row">
                <span class="data-label">Position:</span>
                <span class="data-value">Financial Analyst</span>
              </div>
            </div>
            ` : ''}

            <!-- Salary Details Section -->
            ${selectedColumns.salaryDetails ? `
            <div class="section-title">Salary Details</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Salary Type:</span>
                <span class="data-value">Monthly</span>
              </div>
              <div class="data-row">
                <span class="data-label">Gross Salary:</span>
                <span class="data-value">€4,200</span>
              </div>
              <div class="data-row">
                <span class="data-label">Net Salary:</span>
                <span class="data-value">€2,950</span>
              </div>
            </div>
            ` : ''}

            <!-- Holiday Section -->
            ${selectedColumns.holiday ? `
            <div class="section-title">Holiday</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Annual Leave:</span>
                <span class="data-value">25 days</span>
              </div>
              <div class="data-row">
                <span class="data-label">Used:</span>
                <span class="data-value">5 days</span>
              </div>
              <div class="data-row">
                <span class="data-label">Remaining:</span>
                <span class="data-value">20 days</span>
              </div>
            </div>
            ` : ''}

            <!-- Reports Section -->
            ${selectedColumns.reports ? `
            <div class="section-title">Reports</div>
            <div class="section-content">
              <div class="data-row">
                <span class="data-label">Last Report:</span>
                <span class="data-value">2026-01-10</span>
              </div>
              <div class="data-row">
                <span class="data-label">Next Review:</span>
                <span class="data-value">2026-04-10</span>
              </div>
            </div>
            ` : ''}
          </div>
          
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
      {/* Section: Columns */}
      <div className="mb-7">
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center mr-1.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33337 2.5L3.75004 7.08333L1.66671 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-800">Columns</h2>
        </div>
        <div className="h-px bg-gray-200 w-full mt-1.5 mb-3.5"></div>
        
        <button
          onClick={toggleAllColumns}
          className="h-8.5 px-4.5 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 mb-3"
        >
          Select all
        </button>

        <div className="ml-1">
          {([
            { key: 'staffInformation', label: 'Staff information' },
            { key: 'employment', label: 'Employment' },
            { key: 'salaryDetails', label: 'Salary details' },
            { key: 'dachshund', label: 'Dachshund' },
            { key: 'holiday', label: 'Holiday' },
            { key: 'reports', label: 'Reports' },
            { key: 'initialBalance', label: 'Initial balance' },
          ] as const).map((item) => (
            <div key={item.key} className="flex items-center mb-1.5">
              <input
                type="checkbox"
                id={item.key}
                checked={selectedColumns[item.key]}
                onChange={() => toggleColumn(item.key)}
                className="w-3.5 h-3.5 text-green-600 rounded focus:ring-green-500 border-gray-300"
              />
              <label htmlFor={item.key} className="ml-2 text-sm text-gray-800">
                {item.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Selection */}
      <div>
        <div className="flex items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center mr-1.5">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33337 2.5L3.75004 7.08333L1.66671 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-800">Selection</h2>
        </div>
        <div className="h-px bg-gray-200 w-full mt-1.5 mb-3.5"></div>

        {/* Employment ID Filter */}
        <div className="mb-2.5">
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Employment ID</label>
          <div className="flex space-x-2.5">
            <div className="relative flex-1 max-w-[140px]">
              <select
                value={employmentIdFrom}
                onChange={(e) => setEmploymentIdFrom(e.target.value)}
                className="w-full h-8 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-600 appearance-none"
              >
                <option value="">-</option>
                <option value="EMP001">EMP001</option>
                <option value="EMP002">EMP002</option>
                <option value="EMP003">EMP003</option>
                <option value="EMP004">EMP004</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <span className="self-center text-gray-500">-</span>
            <div className="relative flex-1 max-w-[140px]">
              <select
                value={employmentIdTo}
                onChange={(e) => setEmploymentIdTo(e.target.value)}
                className="w-full h-8 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-600 appearance-none"
              >
                <option value="">-</option>
                <option value="EMP001">EMP001</option>
                <option value="EMP002">EMP002</option>
                <option value="EMP003">EMP003</option>
                <option value="EMP004">EMP004</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1.5">Status</label>
          <div className="inline-flex h-8 border border-gray-300 rounded-sm overflow-hidden">
            <button
              className={`px-4 h-full text-sm font-medium ${
                status === 'all' 
                  ? 'bg-white text-gray-800' 
                  : 'bg-gray-100 text-gray-500'
              }`}
              onClick={() => setStatus('all')}
            >
              All
            </button>
            <button
              className={`px-4 h-full text-sm font-medium ${
                status === 'active' 
                  ? 'bg-white text-gray-800' 
                  : 'bg-gray-100 text-gray-500'
              }`}
              onClick={() => setStatus('active')}
            >
              Active
            </button>
            <button
              className={`px-4 h-full text-sm font-medium ${
                status === 'inactive' 
                  ? 'bg-white text-gray-800' 
                  : 'bg-gray-100 text-gray-500'
              }`}
              onClick={() => setStatus('inactive')}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Footer Action: Print Button */}
      <div className="fixed bottom-5 right-6">
        <button
          className="h-10 px-6 text-sm font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={handlePrint}
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default StaffCard;