import React, { useState } from 'react';

const PersonnelList = () => {
  const [selectedColumns, setSelectedColumns] = useState({
    employmentId: true,
    name: true,
    personalIdentityNumber: true,
    address: false,
    address2: false,
    zipCode: false,
    city: false,
    country: false,
    telephone: false,
    mobile: false,
    email: false,
    jobTitle: false,
    salaryForm: false,
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

  const handleExportCsv = () => {
    // Create CSV content
    const headers = Object.entries(selectedColumns)
      .filter(([_, isSelected]) => isSelected)
      .map(([key]) => {
        switch(key) {
          case 'employmentId': return 'Employment ID';
          case 'personalIdentityNumber': return 'Personal Identity Number';
          case 'zipCode': return 'ZIP Code';
          case 'mobile': return 'Mobile Number';
          case 'jobTitle': return 'Job Title';
          case 'salaryForm': return 'Salary Form';
          default: return key.charAt(0).toUpperCase() + key.slice(1);
        }
      });

    const csvContent = [
      headers.join(','),
      // Sample data rows
      '"EMP001","John Doe","198001011234","123 Main St","","12345","New York","USA","555-1234","555-5678","john@example.com","Manager","Monthly"',
      '"EMP002","Jane Smith","198502021234","456 Oak Ave","","54321","Los Angeles","USA","555-5678","555-9012","jane@example.com","Developer","Monthly"',
      '"EMP003","Bob Johnson","197803031234","789 Pine Rd","","67890","Chicago","USA","555-9012","555-3456","bob@example.com","Analyst","Weekly"'
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'personnel_list.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    // Create a new window with print-optimized layout
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Build table based on selected columns
      const selectedHeaders = Object.entries(selectedColumns)
        .filter(([_, isSelected]) => isSelected)
        .map(([key]) => {
          switch(key) {
            case 'employmentId': return 'Employment ID';
            case 'personalIdentityNumber': return 'Personal Identity Number';
            case 'zipCode': return 'ZIP Code';
            case 'mobile': return 'Mobile Number';
            case 'jobTitle': return 'Job Title';
            case 'salaryForm': return 'Salary Form';
            default: return key.charAt(0).toUpperCase() + key.slice(1);
          }
        });

      const tableHeaders = selectedHeaders.map(header => `<th class="text-left py-2 px-3 border-b">${header}</th>`).join('');
      
      const tableRows = [
        '<tr>',
        selectedColumns.employmentId ? '<td class="py-2 px-3">EMP001</td>' : '',
        selectedColumns.name ? '<td class="py-2 px-3">John Doe</td>' : '',
        selectedColumns.personalIdentityNumber ? '<td class="py-2 px-3">198001011234</td>' : '',
        selectedColumns.address ? '<td class="py-2 px-3">123 Main St</td>' : '',
        selectedColumns.address2 ? '<td class="py-2 px-3"></td>' : '',
        selectedColumns.zipCode ? '<td class="py-2 px-3">12345</td>' : '',
        selectedColumns.city ? '<td class="py-2 px-3">New York</td>' : '',
        selectedColumns.country ? '<td class="py-2 px-3">USA</td>' : '',
        selectedColumns.telephone ? '<td class="py-2 px-3">555-1234</td>' : '',
        selectedColumns.mobile ? '<td class="py-2 px-3">555-5678</td>' : '',
        selectedColumns.email ? '<td class="py-2 px-3">john@example.com</td>' : '',
        selectedColumns.jobTitle ? '<td class="py-2 px-3">Manager</td>' : '',
        selectedColumns.salaryForm ? '<td class="py-2 px-3">Monthly</td>' : '',
        '</tr>',
        '<tr>',
        selectedColumns.employmentId ? '<td class="py-2 px-3">EMP002</td>' : '',
        selectedColumns.name ? '<td class="py-2 px-3">Jane Smith</td>' : '',
        selectedColumns.personalIdentityNumber ? '<td class="py-2 px-3">198502021234</td>' : '',
        selectedColumns.address ? '<td class="py-2 px-3">456 Oak Ave</td>' : '',
        selectedColumns.address2 ? '<td class="py-2 px-3"></td>' : '',
        selectedColumns.zipCode ? '<td class="py-2 px-3">54321</td>' : '',
        selectedColumns.city ? '<td class="py-2 px-3">Los Angeles</td>' : '',
        selectedColumns.country ? '<td class="py-2 px-3">USA</td>' : '',
        selectedColumns.telephone ? '<td class="py-2 px-3">555-5678</td>' : '',
        selectedColumns.mobile ? '<td class="py-2 px-3">555-9012</td>' : '',
        selectedColumns.email ? '<td class="py-2 px-3">jane@example.com</td>' : '',
        selectedColumns.jobTitle ? '<td class="py-2 px-3">Developer</td>' : '',
        selectedColumns.salaryForm ? '<td class="py-2 px-3">Monthly</td>' : '',
        '</tr>',
        '<tr>',
        selectedColumns.employmentId ? '<td class="py-2 px-3">EMP003</td>' : '',
        selectedColumns.name ? '<td class="py-2 px-3">Bob Johnson</td>' : '',
        selectedColumns.personalIdentityNumber ? '<td class="py-2 px-3">197803031234</td>' : '',
        selectedColumns.address ? '<td class="py-2 px-3">789 Pine Rd</td>' : '',
        selectedColumns.address2 ? '<td class="py-2 px-3"></td>' : '',
        selectedColumns.zipCode ? '<td class="py-2 px-3">67890</td>' : '',
        selectedColumns.city ? '<td class="py-2 px-3">Chicago</td>' : '',
        selectedColumns.country ? '<td class="py-2 px-3">USA</td>' : '',
        selectedColumns.telephone ? '<td class="py-2 px-3">555-9012</td>' : '',
        selectedColumns.mobile ? '<td class="py-2 px-3">555-3456</td>' : '',
        selectedColumns.email ? '<td class="py-2 px-3">bob@example.com</td>' : '',
        selectedColumns.jobTitle ? '<td class="py-2 px-3">Analyst</td>' : '',
        selectedColumns.salaryForm ? '<td class="py-2 px-3">Weekly</td>' : '',
        '</tr>'
      ].join('');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Personnel List - Print</title>
          <style>
            body { 
              margin: 20px; 
              font-family: Inter, Arial, sans-serif; 
              font-size: 13px; 
              color: #2C2C2C; 
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
              color: #2C2C2C;
              border: 1px solid #D9D9D9;
            }
            .table-row {
              font-size: 13px;
              color: #2C2C2C;
              border: 1px solid #D9D9D9;
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
            .border-b { border-bottom: 1px solid #D9D9D9; }
          </style>
        </head>
        <body>
          <!-- Header Area -->
          <div class="header-area">
            <div class="left-header">Company Name</div>
            <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>

          <!-- Report Title -->
          <div class="report-title">Personnel List</div>

          <!-- Filters Summary -->
          <div style="margin-bottom: 16px; font-size: 12px;">
            <strong>Filters:</strong> Employment ID: ${employmentIdFrom || '-'} to ${employmentIdTo || '-'}, Status: ${status}
          </div>

          <!-- Table -->
          <table>
            <thead class="table-header">
              ${tableHeaders}
            </thead>
            <tbody>
              ${tableRows}
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
    <div className="max-w-[1280px] mx-auto p-5 bg-white">
      {/* Info Message */}
      <div className="flex items-center mb-2.5">
        <div className="w-3.5 h-3.5 rounded-full bg-blue-600 flex items-center justify-center mr-1.5">
          <span className="text-white text-xs">i</span>
        </div>
        <span className="text-xs text-gray-500">
          The number of columns printed is limited by the page width of the printout.
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-2 gap-9">
        {/* Left Panel - Column Selection */}
        <div>
          <div className="w-full h-[420px] border border-gray-300 rounded-sm bg-white overflow-y-auto">
            {[
              { key: 'employmentId', label: 'Employment ID' },
              { key: 'name', label: 'Name' },
              { key: 'personalIdentityNumber', label: 'Personal identity number' },
              { key: 'address', label: 'Address' },
              { key: 'address2', label: 'Address 2' },
              { key: 'zipCode', label: 'ZIP code' },
              { key: 'city', label: 'City' },
              { key: 'country', label: 'Country' },
              { key: 'telephone', label: 'Telephone number' },
              { key: 'mobile', label: 'Mobile number' },
              { key: 'email', label: 'E-mail' },
              { key: 'jobTitle', label: 'Job title' },
              { key: 'salaryForm', label: 'Salary form' },
            ].map((item, index) => (
              <div key={item.key}>
                <div className="flex items-center h-8 px-3 hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedColumns[item.key as keyof typeof selectedColumns]}
                    onChange={() => toggleColumn(item.key as keyof typeof selectedColumns)}
                    className="w-3.5 h-3.5 border border-gray-400 rounded-sm bg-white checked:bg-green-600 checked:border-green-600 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="ml-3 text-sm text-gray-700">{item.label}</span>
                </div>
                {index < 12 && (
                  <div className="h-px bg-gray-200 w-full"></div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={toggleAllColumns}
            className="h-8 px-4 mt-2.5 text-sm font-medium text-white bg-green-600 border-none rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
          >
            Select all
          </button>
        </div>

        {/* Right Panel - Filters */}
        <div>
          {/* Employment ID (From/To) */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employment ID</label>
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <select
                  value={employmentIdFrom}
                  onChange={(e) => setEmploymentIdFrom(e.target.value)}
                  className="w-full h-8.5 pl-2.5 pr-7 py-1.5 border border-gray-300 rounded-sm bg-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none"
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
                  value={employmentIdTo}
                  onChange={(e) => setEmploymentIdTo(e.target.value)}
                  className="w-full h-8.5 pl-2.5 pr-7 py-1.5 border border-gray-300 rounded-sm bg-white text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none"
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

          {/* Status Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <div className="inline-flex h-7.5 border border-gray-300 rounded-sm overflow-hidden">
              <button
                className={`px-3 h-full text-sm font-medium ${
                  status === 'all' 
                    ? 'bg-white text-gray-700 font-bold' 
                    : 'bg-gray-100 text-gray-500'
                }`}
                onClick={() => setStatus('all')}
              >
                All
              </button>
              <button
                className={`px-3 h-full text-sm font-medium ${
                  status === 'active' 
                    ? 'bg-white text-gray-700 font-bold' 
                    : 'bg-gray-100 text-gray-500'
                }`}
                onClick={() => setStatus('active')}
              >
                Active
              </button>
              <button
                className={`px-3 h-full text-sm font-medium ${
                  status === 'inactive' 
                    ? 'bg-white text-gray-700 font-bold' 
                    : 'bg-gray-100 text-gray-500'
                }`}
                onClick={() => setStatus('inactive')}
              >
                Inactive
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-300 flex justify-end items-center px-5 gap-2.5">
        <button
          onClick={handleExportCsv}
          className="h-8 px-4 text-sm font-medium text-white bg-green-600 border-none rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
        >
          Export .csv
        </button>
        <button
          onClick={handlePrint}
          className="h-8 px-4 text-sm font-medium text-white bg-green-600 border-none rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default PersonnelList;