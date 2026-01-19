import React, { useState } from 'react';

const AverageEmployees = () => {
  const [hiddenEmployees, setHiddenEmployees] = useState<number[]>([]);
  const [compilationOption, setCompilationOption] = useState('Compilation');
  const [manualSsgValues, setManualSsgValues] = useState<{[key: number]: string}>({});

  const toggleHideEmployee = (index: number) => {
    if (hiddenEmployees.includes(index)) {
      setHiddenEmployees(hiddenEmployees.filter(id => id !== index));
    } else {
      setHiddenEmployees([...hiddenEmployees, index]);
    }
  };

  const handleManualSsgChange = (index: number, value: string) => {
    setManualSsgValues(prev => ({
      ...prev,
      [index]: value
    }));
  };

  const handlePrint = () => {
    // Create a new window with print-optimized layout
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Calculate visible employees for print
      const visibleEmployees = employeeData.filter((_, index) => !hiddenEmployees.includes(index));
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Average Number of Employees - Print</title>
          <style>
            body { 
              margin: 20px; 
              font-family: Arial, Helvetica, sans-serif; 
              font-size: 13px; 
              color: #1F2933; 
              background-color: #FFFFFF; 
              line-height: 1.2;
            }
            .header-area { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              margin-bottom: 16px;
            }
            .left-header { 
              font-size: 13px; 
              font-weight: 500;
              text-align: left; 
            }
            .center-title { 
              position: absolute; 
              left: 50%; 
              transform: translateX(-50%); 
              font-size: 24px; 
              font-weight: bold; 
              text-align: center;
            }
            .right-header { 
              font-size: 11px; 
              text-align: right; 
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .table-header {
              font-size: 13px;
              font-weight: 600;
              background-color: #FFFFFF;
              color: #1F2933;
              height: 44px;
            }
            .employment-id-header {
              background-color: #BDBDBD !important;
              color: #FFFFFF !important;
              border-right: 1px solid #E5E7EB;
            }
            .table-row {
              font-size: 13px;
              color: #1F2933;
              height: 42px;
            }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            .bold { font-weight: 500; }
            .py-3 { padding-top: 12px; padding-bottom: 12px; }
            .px-4 { padding-left: 16px; padding-right: 16px; }
            .border-b { border-bottom: 1px solid #E5E7EB; }
            .summary-row {
              font-weight: 600;
              border-top: 1px solid #000000;
              padding-top: 6px;
            }
          </style>
        </head>
        <body>
          <!-- Header Area -->
          <div class="header-area">
            <div class="left-header">
              <div><b>Company Name</b></div>
              <div>Report: Average number of employees</div>
              <div>Date: ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
            <div class="center-title">
              Average number of employees
            </div>
            <div class="right-header">
              Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          <!-- Table -->
          <table>
            <thead class="table-header">
              <tr>
                <th class="employment-id-header text-left py-3 px-4" style="width: 130px;">EMPLOYMENT ID</th>
                <th class="text-left py-3 px-4" style="width: 120px;">FIRST NAME</th>
                <th class="text-left py-3 px-4" style="width: 120px;">SURNAME</th>
                <th class="text-left py-3 px-4" style="width: 180px;">SSG FROM THE CALENDAR</th>
                <th class="text-left py-3 px-4" style="width: 260px;">WORKED TIME ACCORDING TO PAY SLIP</th>
                <th class="text-left py-3 px-4" style="width: 340px;">CALCULATED SSG BASED ON ANNUAL WORKING HOURS</th>
                <th class="text-left py-3 px-4" style="width: 180px;">REGISTER SSG MANUALLY</th>
                <th class="text-left py-3 px-4" style="width: 300px;">SSG IN THE AVERAGE NUMBER OF EMPLOYEES</th>
                <th class="text-center py-3 px-4" style="width: 80px;">HIDE</th>
              </tr>
            </thead>
            <tbody>
              ${visibleEmployees.map((emp, index) => `
                <tr class="table-row">
                  <td class="text-left py-3 px-4" style="border-right: 1px solid #E5E7EB;">${emp.employmentId}</td>
                  <td class="text-left py-3 px-4">${emp.firstName}</td>
                  <td class="text-left py-3 px-4">${emp.surname}</td>
                  <td class="text-left py-3 px-4">${emp.ssgFromCalendar}</td>
                  <td class="text-left py-3 px-4">${emp.workedTime}</td>
                  <td class="text-left py-3 px-4">${emp.calculatedSsg}</td>
                  <td class="text-left py-3 px-4">${manualSsgValues[index] || emp.registeredSsg}</td>
                  <td class="text-left py-3 px-4">${emp.ssgInAverage}</td>
                  <td class="text-center py-3 px-4">${hiddenEmployees.includes(index) ? 'Yes' : 'No'}</td>
                </tr>
              `).join('')}
              <tr class="summary-row">
                <td colspan="7" class="text-right py-3 px-4"><b>Final average SSG value:</b></td>
                <td class="text-center py-3 px-4"><b>${calculateAverageSsg(visibleEmployees)}</b></td>
                <td class="text-center py-3 px-4"></td>
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

  // Helper function to calculate average SSG
  const calculateAverageSsg = (employees: typeof employeeData) => {
    if (employees.length === 0) return '0.00';
    const sum = employees.reduce((acc, emp, index) => {
      const value = parseFloat(manualSsgValues[index] || emp.ssgInAverage) || parseFloat(emp.ssgInAverage);
      return acc + value;
    }, 0);
    return (sum / employees.length).toFixed(2);
  };

  // Sample data
  const employeeData = [
    {
      employmentId: 'EMP001',
      firstName: 'John',
      surname: 'Doe',
      ssgFromCalendar: 'Full-time',
      workedTime: '176.5 hours',
      calculatedSsg: 'Based on annual hours',
      registeredSsg: '',
      ssgInAverage: '1.0'
    },
    {
      employmentId: 'EMP002',
      firstName: 'Jane',
      surname: 'Smith',
      ssgFromCalendar: 'Part-time',
      workedTime: '88.0 hours',
      calculatedSsg: 'Based on annual hours',
      registeredSsg: '',
      ssgInAverage: '0.5'
    },
    {
      employmentId: 'EMP003',
      firstName: 'Robert',
      surname: 'Johnson',
      ssgFromCalendar: 'Full-time',
      workedTime: '176.0 hours',
      calculatedSsg: 'Based on annual hours',
      registeredSsg: '',
      ssgInAverage: '1.0'
    },
    {
      employmentId: 'EMP004',
      firstName: 'Emily',
      surname: 'Williams',
      ssgFromCalendar: '3/4 time',
      workedTime: '132.0 hours',
      calculatedSsg: 'Based on annual hours',
      registeredSsg: '',
      ssgInAverage: '0.75'
    },
    {
      employmentId: 'EMP005',
      firstName: 'Michael',
      surname: 'Brown',
      ssgFromCalendar: 'Half-time',
      workedTime: '88.0 hours',
      calculatedSsg: 'Based on annual hours',
      registeredSsg: '',
      ssgInAverage: '0.5'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-white p-4">
      {/* Top Action Area */}
      <div className="flex justify-end mb-4 space-x-4">
        {/* Column/View Icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 bg-gray-100 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </div>

        {/* Hidden Counter Dropdown */}
        <div className="flex items-center bg-gray-100 px-2.5 py-1.5 rounded text-sm">
          <span>{hiddenEmployees.length}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full">
          <thead>
            <tr className="h-11 text-xs font-semibold text-gray-800 bg-white">
              <th className="w-32 h-11 px-4 py-3 text-left text-white bg-gray-600 border-r border-gray-200">
                EMPLOYMENT ID
              </th>
              <th className="w-32 h-11 px-4 py-3 text-left">FIRST NAME</th>
              <th className="w-32 h-11 px-4 py-3 text-left">SURNAME</th>
              <th className="w-44 h-11 px-4 py-3 text-left">SSG FROM THE CALENDAR</th>
              <th className="w-64 h-11 px-4 py-3 text-left">WORKED TIME ACCORDING TO PAY SLIP</th>
              <th className="w-84 h-11 px-4 py-3 text-left">CALCULATED SSG BASED ON ANNUAL WORKING HOURS</th>
              <th className="w-44 h-11 px-4 py-3 text-left">REGISTER SSG MANUALLY</th>
              <th className="w-72 h-11 px-4 py-3 text-left">SSG IN THE AVERAGE NUMBER OF EMPLOYEES</th>
              <th className="w-20 h-11 px-4 py-3 text-center">HIDE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employeeData.map((employee, index) => (
              <tr 
                key={index} 
                className="h-10 text-xs text-gray-800 hover:bg-gray-50"
              >
                <td className="px-4 py-3 text-left border-r border-gray-200">{employee.employmentId}</td>
                <td className="px-4 py-3 text-left">{employee.firstName}</td>
                <td className="px-4 py-3 text-left">{employee.surname}</td>
                <td className="px-4 py-3 text-left">{employee.ssgFromCalendar}</td>
                <td className="px-4 py-3 text-left">{employee.workedTime}</td>
                <td className="px-4 py-3 text-left">{employee.calculatedSsg}</td>
                <td className="px-4 py-3 text-left">
                  <input
                    type="text"
                    value={manualSsgValues[index] || employee.registeredSsg}
                    onChange={(e) => handleManualSsgChange(index, e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </td>
                <td className="px-4 py-3 text-left">{employee.ssgInAverage}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={hiddenEmployees.includes(index)}
                    onChange={() => toggleHideEmployee(index)}
                    className="form-checkbox h-4 w-4 text-green-600 rounded focus:ring-green-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Area */}
      <div className="mt-4 flex justify-between items-center">
        {/* Left Footer Text */}
        <div className="text-sm text-gray-600 ml-4">
          ( {hiddenEmployees.length} ) hidden from the report
        </div>

        {/* Right Footer Actions */}
        <div className="flex items-center">
          {/* Compilation Dropdown */}
          <div className="relative">
            <select
              value={compilationOption}
              onChange={(e) => setCompilationOption(e.target.value)}
              className="h-9 pl-4 pr-8 py-1 text-sm border border-gray-300 rounded-full appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="Compilation">Compilation</option>
              <option value="Annual">Annual</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Printout Button */}
          <button
            className="h-9 px-5.5 py-1 text-sm font-semibold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-200 ml-2"
            onClick={handlePrint}
          >
            Printout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AverageEmployees;