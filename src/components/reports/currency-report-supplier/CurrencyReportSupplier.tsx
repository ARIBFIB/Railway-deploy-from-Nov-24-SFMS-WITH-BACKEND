import React, { useState } from 'react';

const CurrencyReportSupplier = () => {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [supplierOption, setSupplierOption] = useState('all'); // 'all' or 'specific'
  const [fromSupplier, setFromSupplier] = useState('');
  const [toSupplier, setToSupplier] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showCurrencyDiff, setShowCurrencyDiff] = useState(false);
  const [comparePrevYear, setComparePrevYear] = useState(false);
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' or 'landscape'
  
  const currencies = ['USD', 'EUR', 'GBP', 'SEK', 'NOK', 'DKK'];

  const handleSubmit = (action: string) => {
    if (action === 'show-on-screen') {
      // Create a new window for the report output
      const reportWindow = window.open('', '_blank');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Currency Report Supplier</title>
            <style>
              body {
                margin: 20px;
                font-family: Arial, Times New Roman, sans-serif;
                font-size: 11px;
                color: #000000;
                background-color: #FFFFFF;
                line-height: 1.2;
              }
              .header-area {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 10px;
              }
              .left-header {
                font-size: 12px;
                font-weight: bold;
                text-align: left;
              }
              .center-title {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                font-size: 28px;
                font-weight: bold;
                text-align: center;
                line-height: 1.1;
              }
              .center-subtitle {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                top: 50px;
                font-size: 26px;
                font-weight: bold;
                text-align: center;
                line-height: 1.1;
              }
              .right-header {
                font-size: 11px;
                text-align: right;
              }
              .period-line {
                font-size: 11px;
                margin-top: 6px;
                margin-bottom: 16px;
                text-align: center;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th {
                font-size: 11px;
                font-weight: bold;
                color: #000000;
                border-bottom: 1px solid #000000;
                padding: 4px 6px;
                text-align: left;
              }
              td {
                font-size: 11px;
                color: #000000;
                padding: 4px 6px;
                text-align: left;
              }
              .numeric-right {
                text-align: right;
              }
            </style>
          </head>
          <body>
            <!-- Header Area -->
            <div class="header-area">
              <div class="left-header">Test company</div>
              <div>
                <div class="center-title">Currency report</div>
                <div class="center-subtitle">supplier</div>
              </div>
              <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>

            <!-- Period Line -->
            <div class="period-line">Period ${startDate} - ${endDate}</div>

            <!-- Table -->
            <table>
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Number of transactions</th>
                  <th>Turnover in currency</th>
                  <th>Turnover in SEKSEK</th>
                  <th>% of total turnover</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total</td>
                  <td class="numeric-right">0</td>
                  <td class="numeric-right">0</td>
                  <td class="numeric-right">0 000,00</td>
                  <td class="numeric-right">0,00%</td>
                </tr>
              </tbody>
            </table>
            
            <script>
              window.onload = function() {
                // Optionally trigger print dialog
                // window.print();
              };
            </script>
          </body>
          </html>
        `);
        reportWindow.document.close();
        reportWindow.focus();
      }
    } else if (action === 'show-pdf') {
      alert('PDF generation would happen here');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-4">
      {/* Filter Screen */}
      <div className="bg-white font-sans text-xs text-black" style={{ maxWidth: '920px', margin: '0 auto' }}>
        {/* Section 1 - Interval */}
        <div className="border border-gray-700 p-2 mb-2" style={{ padding: '8px 10px', backgroundColor: '#FFFFFF' }}>
          <div className="font-bold mb-1.5" style={{ fontSize: '12px' }}>Interval</div>
          
          <div className="flex items-center">
            <label className="mr-1.5" style={{ fontSize: '12px' }}>Date</label>
            <div className="flex items-center mr-1.5">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-32 h-5.5 border border-gray-600 p-0.5 mr-0.5"
                style={{ width: '120px', height: '22px', padding: '2px 6px' }}
              />
              <div className="w-4 h-4 bg-blue-200 border border-blue-400 flex items-center justify-center text-xs cursor-pointer"
                   style={{ width: '16px', height: '16px', backgroundColor: '#E6F1FF', borderColor: '#7FAADF' }}>
                📅
              </div>
            </div>
            <span className="mx-1.5">-</span>
            <div className="flex items-center">
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-32 h-5.5 border border-gray-600 p-0.5 mr-0.5"
                style={{ width: '120px', height: '22px', padding: '2px 6px' }}
              />
              <div className="w-4 h-4 bg-blue-200 border border-blue-400 flex items-center justify-center text-xs cursor-pointer"
                   style={{ width: '16px', height: '16px', backgroundColor: '#E6F1FF', borderColor: '#7FAADF' }}>
                📅
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 - Supplier */}
        <div className="border border-gray-700 p-2 mb-2" style={{ padding: '8px 10px', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center mb-1.5">
            <input
              type="radio"
              id="all-suppliers"
              name="supplier-option"
              checked={supplierOption === 'all'}
              onChange={() => setSupplierOption('all')}
              className="w-3 h-3 mr-1.5"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="all-suppliers" className="mr-4" style={{ fontSize: '12px' }}>All suppliers</label>
            
            <input
              type="radio"
              id="specific-supplier"
              name="supplier-option"
              checked={supplierOption === 'specific'}
              onChange={() => setSupplierOption('specific')}
              className="w-3 h-3 mr-1.5"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="specific-supplier" style={{ fontSize: '12px' }}>Supplier</label>
          </div>
          
          {supplierOption === 'specific' && (
            <div className="flex items-center">
              <input
                type="text"
                value={fromSupplier}
                onChange={(e) => setFromSupplier(e.target.value)}
                placeholder="From"
                className="w-35 h-5.5 border border-gray-600 p-0.5 mr-1.5"
                style={{ width: '140px', height: '22px' }}
              />
              <div className="w-3.5 h-3.5 bg-yellow-300 border border-yellow-600 flex items-center justify-center text-xs cursor-pointer mr-1.5"
                   style={{ width: '14px', height: '14px', backgroundColor: '#FFD966', borderColor: '#C9A200' }}>
                ?
              </div>
              
              <input
                type="text"
                value={toSupplier}
                onChange={(e) => setToSupplier(e.target.value)}
                placeholder="To"
                className="w-35 h-5.5 border border-gray-600 p-0.5 mr-1.5"
                style={{ width: '140px', height: '22px' }}
              />
              <div className="w-3.5 h-3.5 bg-yellow-300 border border-yellow-600 flex items-center justify-center text-xs cursor-pointer"
                   style={{ width: '14px', height: '14px', backgroundColor: '#FFD966', borderColor: '#C9A200' }}>
                ?
              </div>
            </div>
          )}
        </div>

        {/* Section 3 - Options */}
        <div className="border border-gray-700 p-2 mb-2" style={{ padding: '8px 10px', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center mb-1.5">
            <label className="mr-2" style={{ fontSize: '12px' }}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-35 h-5.5 border border-gray-600 p-0.5"
              style={{ width: '140px', height: '22px' }}
            >
              {currencies.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center mb-1">
            <input
              type="checkbox"
              id="show-currency-diff"
              checked={showCurrencyDiff}
              onChange={(e) => setShowCurrencyDiff(e.target.checked)}
              className="w-3 h-3 mr-1.5"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="show-currency-diff" style={{ fontSize: '12px' }}>Show currency difference</label>
            
            <div className="w-3.5 h-3.5 bg-blue-100 border border-blue-400 rounded-full flex items-center justify-center text-xs ml-2.5"
                 style={{ width: '14px', height: '14px', backgroundColor: '#D9EDF7', color: '#31708F' }}>
              i
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="compare-prev-year"
              checked={comparePrevYear}
              onChange={(e) => setComparePrevYear(e.target.checked)}
              className="w-3 h-3 mr-1.5"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="compare-prev-year" style={{ fontSize: '12px' }}>Compare to previous year</label>
          </div>
        </div>

        {/* Section 4 - Orientation */}
        <div className="border border-gray-700 p-2 mb-3" style={{ padding: '8px 10px', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-center">
            <input
              type="radio"
              id="portrait"
              name="orientation"
              checked={orientation === 'portrait'}
              onChange={() => setOrientation('portrait')}
              className="w-3 h-3 mr-1.5"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="portrait" className="mr-4" style={{ fontSize: '12px' }}>Portrait</label>
            
            <input
              type="radio"
              id="landscape"
              name="orientation"
              checked={orientation === 'landscape'}
              onChange={() => setOrientation('landscape')}
              className="w-3 h-3 mr-1.5"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="landscape" style={{ fontSize: '12px' }}>Landscape</label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-3">
          <button
            onClick={() => handleSubmit('show-on-screen')}
            className="h-7 min-w-[110px] px-3 py-1 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2"
            style={{ height: '28px', minHeight: '28px', minWidth: '110px', padding: '4px 12px' }}
          >
            Show on screen
          </button>
          <button
            onClick={() => handleSubmit('show-pdf')}
            className="h-7 min-w-[110px] px-3 py-1 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2"
            style={{ height: '28px', minHeight: '28px', minWidth: '110px', padding: '4px 12px' }}
          >
            Show PDF
          </button>
          <button
            onClick={() => window.close()}
            className="h-7 min-w-[110px] px-3 py-1 text-xs border border-green-700 bg-green-300 hover:bg-green-400"
            style={{ height: '28px', minHeight: '28px', minWidth: '110px', padding: '4px 12px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyReportSupplier;