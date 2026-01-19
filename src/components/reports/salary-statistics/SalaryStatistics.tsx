import React, { useState } from 'react';

const SalaryStatistics = () => {
  // State for toggles
  const [detailedPrintout, setDetailedPrintout] = useState(true);
  const [summaryPrintout, setSummaryPrintout] = useState(true);
  const [subtotalsPrintout, setSubtotalsPrintout] = useState(true);
  const [selectedInfoPrintout, setSelectedInfoPrintout] = useState(true);
  const [leftEmployees, setLeftEmployees] = useState(false);

  // State for selections
  const [reportType, setReportType] = useState('');
  const [sortOrder, setSortOrder] = useState('salary-type-class-period');
  const [mainClassesMode, setMainClassesMode] = useState(true);
  const [periodFrom, setPeriodFrom] = useState('');
  const [periodTo, setPeriodTo] = useState('');
  const [paymentDateFrom, setPaymentDateFrom] = useState('');
  const [paymentDateTo, setPaymentDateTo] = useState('');
  const [employmentIdFrom, setEmploymentIdFrom] = useState('');
  const [employmentIdTo, setEmploymentIdTo] = useState('');
  const [staffType, setStaffType] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [salaryType, setSalaryType] = useState('');
  const [personnelCategories, setPersonnelCategories] = useState<string[]>([]);

  // State for main classes checkboxes
  const [mainClasses, setMainClasses] = useState({
    workingHours: true,
    otherSalary: true,
    nonCashBenefit: true,
    travelCompensation: true,
    netSalary: true,
    absenceDueToIllness: true,
    absence: true,
    holiday: true,
    miscellaneous: true,
  });

  // State for salary type classes checkboxes
  const [salaryTypeClasses, setSalaryTypeClasses] = useState({
    workingHours: {
      normal: false,
      additionalHours: false,
      overtime: false,
      travelTime: false,
    },
    otherSalary: {
      retroactive: false,
      bonus: false,
    },
    nonCashBenefit: {
      car: false,
      meals: false,
      accommodation: false,
    },
    travelCompensation: {
      allowance: false,
      mileage: false,
    },
    netSalary: {
      advance: false,
      deduction: false,
    },
    absence: {
      sickPay: false,
      parentalBenefit: false,
      holidayPay: false,
    }
  });

  // Toggle all main classes
  const toggleAllMainClasses = () => {
    const allSelected = Object.values(mainClasses).every(value => value);
    const newSelection = {} as Record<keyof typeof mainClasses, boolean>;
    (Object.keys(mainClasses) as (keyof typeof mainClasses)[]).forEach(key => {
      newSelection[key] = !allSelected;
    });
    setMainClasses(newSelection);
  };

  // Toggle all salary type classes
  const toggleAllSalaryTypeClasses = () => {
    const newSelection = { ...salaryTypeClasses };
    Object.keys(newSelection).forEach(category => {
      const categoryObj = newSelection[category as keyof typeof salaryTypeClasses];
      Object.keys(categoryObj).forEach(subItem => {
        (categoryObj as any)[subItem] = true;
      });
    });
    setSalaryTypeClasses(newSelection);
  };

  // Handle adding a personnel category
  const addPersonnelCategory = () => {
    setPersonnelCategories([...personnelCategories, '']);
  };

  // Handle export CSV
  const handleExportCsv = () => {
    // Create CSV content
    const csvContent = [
      'Employee ID,Name,Salary Type,Amount,Period',
      'EMP001,John Doe,Working Hours,2500.00,2026-01',
      'EMP001,John Doe,Overtime,300.00,2026-01',
      'EMP002,Jane Smith,Bonus,500.00,2026-01',
      'EMP003,Bob Johnson,Travel Allowance,150.00,2026-01'
    ].join('\n');

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'salary_statistics.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle print
  const handlePrint = () => {
    // Create a new window with print-optimized layout
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Salary Statistics - Print</title>
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
          <div class="report-title">Salary Statistics</div>

          <!-- Filters Summary -->
          <div style="margin-bottom: 16px; font-size: 12px;">
            <strong>Filters:</strong> Period: ${periodFrom || '-'} to ${periodTo || '-'}, Payment Date: ${paymentDateFrom || '-'} to ${paymentDateTo || '-'}
          </div>

          <!-- Table -->
          <table>
            <thead class="table-header">
              <tr>
                <th class="text-left py-2 px-3 border-b">Employee ID</th>
                <th class="text-left py-2 px-3 border-b">Name</th>
                <th class="text-left py-2 px-3 border-b">Salary Type</th>
                <th class="text-right py-2 px-3 border-b">Amount</th>
                <th class="text-left py-2 px-3 border-b">Period</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-row">
                <td class="py-2 px-3">EMP001</td>
                <td class="py-2 px-3">John Doe</td>
                <td class="py-2 px-3">Working Hours</td>
                <td class="text-right py-2 px-3">2500.00</td>
                <td class="py-2 px-3">2026-01</td>
              </tr>
              <tr class="table-row">
                <td class="py-2 px-3">EMP001</td>
                <td class="py-2 px-3">John Doe</td>
                <td class="py-2 px-3">Overtime</td>
                <td class="text-right py-2 px-3">300.00</td>
                <td class="py-2 px-3">2026-01</td>
              </tr>
              <tr class="table-row">
                <td class="py-2 px-3">EMP002</td>
                <td class="py-2 px-3">Jane Smith</td>
                <td class="py-2 px-3">Bonus</td>
                <td class="text-right py-2 px-3">500.00</td>
                <td class="py-2 px-3">2026-01</td>
              </tr>
              <tr class="table-row">
                <td class="py-2 px-3">EMP003</td>
                <td class="py-2 px-3">Bob Johnson</td>
                <td class="py-2 px-3">Travel Allowance</td>
                <td class="text-right py-2 px-3">150.00</td>
                <td class="py-2 px-3">2026-01</td>
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
    <div className="max-w-[1440px] mx-auto p-6 bg-white">
      {/* Section A: Export of salary transaction to .csv file */}
      <div className="mb-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center mr-2">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.33337 2.5L3.75004 7.08333L1.66671 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Export of salary transaction to .csv file</h3>
              <p className="text-xs text-gray-500 mt-1">
                Export of all payroll transactions for all employees during the selected payroll year to a file in CSV format
              </p>
            </div>
          </div>
          <button 
            className="h-8 px-4 text-xs font-semibold text-white bg-green-600 rounded-full hover:bg-green-700"
            onClick={handleExportCsv}
          >
            Export
          </button>
        </div>
        <div className="h-px bg-gray-200 w-full mt-2"></div>
      </div>

      {/* Section B: PDF print of salary statistics */}
      <div className="mb-6">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <div className="w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center mr-2">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.33337 2.5L3.75004 7.08333L1.66671 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">PDF print of salary statistics</h3>
            </div>
          </div>
        </div>
        <div className="h-px bg-gray-200 w-full mt-2"></div>
      </div>

      {/* PDF Print Configuration Area */}
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        {/* Row 1 - Dropdowns & Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name of report</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
            >
              <option value="">Select Report</option>
              <option value="salary-statistics">Salary Statistics</option>
              <option value="detailed-payroll">Detailed Payroll</option>
              <option value="summary-report">Summary Report</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center">
              <label className="text-xs text-gray-500 mr-2">Detailed printout</label>
              <div 
                className={`w-12 h-7 flex items-center rounded-md cursor-pointer transition-colors ${
                  detailedPrintout ? 'bg-green-600' : 'bg-gray-200'
                }`}
                onClick={() => setDetailedPrintout(!detailedPrintout)}
              >
                <div 
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    detailedPrintout ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </div>
              <span className={`ml-1 text-xs ${detailedPrintout ? 'text-white' : 'text-gray-500'}`}>
                {detailedPrintout ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center">
              <label className="text-xs text-gray-500 mr-2">Printout of summary</label>
              <div 
                className={`w-12 h-7 flex items-center rounded-md cursor-pointer transition-colors ${
                  summaryPrintout ? 'bg-green-600' : 'bg-gray-200'
                }`}
                onClick={() => setSummaryPrintout(!summaryPrintout)}
              >
                <div 
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    summaryPrintout ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </div>
              <span className={`ml-1 text-xs ${summaryPrintout ? 'text-white' : 'text-gray-500'}`}>
                {summaryPrintout ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center">
              <label className="text-xs text-gray-500 mr-2">Printout of subtotals</label>
              <div 
                className={`w-12 h-7 flex items-center rounded-md cursor-pointer transition-colors ${
                  subtotalsPrintout ? 'bg-green-600' : 'bg-gray-200'
                }`}
                onClick={() => setSubtotalsPrintout(!subtotalsPrintout)}
              >
                <div 
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    subtotalsPrintout ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </div>
              <span className={`ml-1 text-xs ${subtotalsPrintout ? 'text-white' : 'text-gray-500'}`}>
                {subtotalsPrintout ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center">
              <label className="text-xs text-gray-500 mr-2">Printout of selected information</label>
              <div 
                className={`w-12 h-7 flex items-center rounded-md cursor-pointer transition-colors ${
                  selectedInfoPrintout ? 'bg-green-600' : 'bg-gray-200'
                }`}
                onClick={() => setSelectedInfoPrintout(!selectedInfoPrintout)}
              >
                <div 
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                    selectedInfoPrintout ? 'translate-x-6' : 'translate-x-1'
                  }`}
                ></div>
              </div>
              <span className={`ml-1 text-xs ${selectedInfoPrintout ? 'text-white' : 'text-gray-500'}`}>
                {selectedInfoPrintout ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* Row 2 - Sort Order */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-1">Sort order</label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-64 h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
          >
            <option value="salary-type-class-period">Salary type class, Period</option>
            <option value="employee-name">Employee Name</option>
            <option value="period-employee">Period, Employee</option>
            <option value="salary-type-employee">Salary Type, Employee</option>
          </select>
        </div>
      </div>

      {/* Salary Classes Selection */}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <input
            type="radio"
            id="main-classes"
            checked={mainClassesMode}
            onChange={() => setMainClassesMode(true)}
            className="w-3.5 h-3.5 text-green-600 focus:ring-green-500 border-gray-300"
          />
          <label htmlFor="main-classes" className="ml-2 text-sm font-medium text-gray-700">Main classes</label>
          <button
            onClick={toggleAllMainClasses}
            className="ml-4 h-7 px-3 text-xs font-medium text-white bg-green-600 rounded-full hover:bg-green-700"
          >
            Select all
          </button>
        </div>

        {/* Main Classes Checkboxes */}
        <div className="grid grid-cols-3 gap-1.5 mb-6">
          {Object.entries(mainClasses).map(([key, value]) => {
            const labelMap: Record<string, string> = {
              workingHours: 'Working hours',
              otherSalary: 'Other salary',
              nonCashBenefit: 'Non-cash benefit',
              travelCompensation: 'Travel compensation',
              netSalary: 'Net salary',
              absenceDueToIllness: 'Absence due to illness',
              absence: 'Absence',
              holiday: 'Holiday',
              miscellaneous: 'Miscellaneous'
            };
            
            return (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={() => setMainClasses({...mainClasses, [key]: !value})}
                  className="w-3.5 h-3.5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                />
                <label htmlFor={key} className="ml-2 text-sm text-gray-700">{labelMap[key]}</label>
              </div>
            );
          })}
        </div>

        <div className="flex items-center mb-3">
          <input
            type="radio"
            id="salary-type-classes"
            checked={!mainClassesMode}
            onChange={() => setMainClassesMode(false)}
            className="w-3.5 h-3.5 text-green-600 focus:ring-green-500 border-gray-300"
          />
          <label htmlFor="salary-type-classes" className="ml-2 text-sm font-medium text-gray-700">Salary type classes</label>
          <button
            onClick={toggleAllSalaryTypeClasses}
            className="ml-4 h-7 px-3 text-xs font-medium text-white bg-green-600 rounded-full hover:bg-green-700"
          >
            Select all
          </button>
        </div>

        {/* Salary Type Classes Grid */}
        {!mainClassesMode && (
          <div className="grid grid-cols-6 gap-6">
            {Object.entries(salaryTypeClasses).map(([category, subItems]) => {
              const categoryLabels: Record<string, string> = {
                workingHours: 'Working hours',
                otherSalary: 'Other salary',
                nonCashBenefit: 'Non-cash benefit',
                travelCompensation: 'Travel compensation',
                netSalary: 'Net salary',
                absence: 'Absence'
              };
              
              return (
                <div key={category}>
                  <div className="font-medium text-sm mb-2">{categoryLabels[category]}</div>
                  <div className="space-y-1">
                    {Object.entries(subItems).map(([subKey, subValue]) => {
                      const subLabels: Record<string, string> = {
                        normal: 'Normal',
                        additionalHours: 'Additional hours',
                        overtime: 'Overtime',
                        travelTime: 'Travel time',
                        retroactive: 'Retroactive',
                        bonus: 'Bonus',
                        car: 'Car',
                        meals: 'Meals',
                        accommodation: 'Accommodation',
                        allowance: 'Allowance',
                        mileage: 'Mileage',
                        advance: 'Advance',
                        deduction: 'Deduction',
                        sickPay: 'Sick pay',
                        parentalBenefit: 'Parental benefit',
                        holidayPay: 'Holiday pay'
                      };
                      
                      return (
                        <div key={subKey} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${category}-${subKey}`}
                            checked={subValue}
                            onChange={() => setSalaryTypeClasses({
                              ...salaryTypeClasses,
                              [category]: {
                                ...(salaryTypeClasses[category as keyof typeof salaryTypeClasses]),
                                [subKey]: !subValue
                              }
                            })}
                            className="w-3.5 h-3.5 text-green-600 rounded focus:ring-green-500 border-gray-300"
                          />
                          <label htmlFor={`${category}-${subKey}`} className="ml-2 text-xs text-gray-700">{subLabels[subKey]}</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selection Section */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center mr-2">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33337 2.5L3.75004 7.08333L1.66671 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-800">Selection</h3>
        </div>
        <div className="h-px bg-gray-200 w-full mb-4"></div>

        {/* Print out employees who have left */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <label className="text-sm text-gray-700 mr-3">Print out employees who have left</label>
            <div 
              className={`w-12 h-7 flex items-center rounded-md cursor-pointer transition-colors ${
                leftEmployees ? 'bg-green-600' : 'bg-gray-200'
              }`}
              onClick={() => setLeftEmployees(!leftEmployees)}
            >
              <div 
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  leftEmployees ? 'translate-x-6' : 'translate-x-1'
                }`}
              ></div>
            </div>
            <span className={`ml-1 text-sm ${leftEmployees ? 'text-white' : 'text-gray-500'}`}>
              {leftEmployees ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {/* Period (From / To) */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Period</label>
            <div className="flex space-x-2">
              <select
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
                className="flex-1 h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">From</option>
                <option value="2026-01">2026-01</option>
                <option value="2026-02">2026-02</option>
                <option value="2026-03">2026-03</option>
              </select>
              <select
                value={periodTo}
                onChange={(e) => setPeriodTo(e.target.value)}
                className="flex-1 h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">To</option>
                <option value="2026-12">2026-12</option>
                <option value="2026-11">2026-11</option>
                <option value="2026-10">2026-10</option>
              </select>
            </div>
          </div>

          {/* Payment date (From / To) */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Payment date</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={paymentDateFrom}
                onChange={(e) => setPaymentDateFrom(e.target.value)}
                placeholder="From"
                className="flex-1 h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
              <input
                type="text"
                value={paymentDateTo}
                onChange={(e) => setPaymentDateTo(e.target.value)}
                placeholder="To"
                className="flex-1 h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Employment ID (From / To) */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Employment ID</label>
            <div className="flex space-x-2">
              <select
                value={employmentIdFrom}
                onChange={(e) => setEmploymentIdFrom(e.target.value)}
                className="flex-1 h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">From</option>
                <option value="EMP001">EMP001</option>
                <option value="EMP002">EMP002</option>
                <option value="EMP003">EMP003</option>
              </select>
              <select
                value={employmentIdTo}
                onChange={(e) => setEmploymentIdTo(e.target.value)}
                className="flex-1 h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">To</option>
                <option value="EMP001">EMP001</option>
                <option value="EMP002">EMP002</option>
                <option value="EMP003">EMP003</option>
              </select>
            </div>
          </div>

          {/* Staff type */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Staff type</label>
            <select
              value={staffType}
              onChange={(e) => setStaffType(e.target.value)}
              className="w-full h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
            >
              <option value="">Select</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Cost center */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Cost center</label>
            <select
              value={costCenter}
              onChange={(e) => setCostCenter(e.target.value)}
              className="w-full h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
            >
              <option value="">Select</option>
              <option value="admin">Administration</option>
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
            </select>
          </div>

          {/* Salary type */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Salary type</label>
            <select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
              className="w-full h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
            >
              <option value="">Select</option>
              <option value="monthly">Monthly</option>
              <option value="hourly">Hourly</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Personnel categories */}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Personnel categories</label>
            <div className="flex">
              <select
                value=""
                onChange={() => {}}
                className="flex-1 h-7.5 px-2.5 py-1.5 text-sm border border-gray-300 rounded-l focus:ring-1 focus:ring-green-500 focus:border-green-500 appearance-none bg-white"
              >
                <option value="">Select</option>
                <option value="manager">Manager</option>
                <option value="developer">Developer</option>
                <option value="analyst">Analyst</option>
              </select>
              <button
                onClick={addPersonnelCategory}
                className="w-7 h-7.5 flex items-center justify-center bg-yellow-400 text-gray-800 rounded-r hover:bg-yellow-500"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex justify-end gap-2 pt-4 pb-6">
        <button className="h-8 px-4 text-sm font-medium text-white bg-gray-400 rounded-md cursor-not-allowed">
          Delete
        </button>
        <button 
          className="h-8 px-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
        >
          Save
        </button>
        <button 
          className="h-8 px-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          onClick={handlePrint}
        >
          Print
        </button>
        <button 
          className="h-8 px-4 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          onClick={handleExportCsv}
        >
          Export.csv
        </button>
      </div>
    </div>
  );
};

export default SalaryStatistics;