import React, { useState } from 'react';

const TopRatedSuppliers = () => {
  const [intervalOption, setIntervalOption] = useState('all'); // 'all' or 'date'
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [invoiceFilter, setInvoiceFilter] = useState('Show All');
  const [numberOfSuppliers, setNumberOfSuppliers] = useState('10');
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' or 'landscape'

  const handleSubmit = (action: string) => {
    if (action === 'show-on-screen') {
      // Create report window
      const reportWindow = window.open('', '_blank', 'width=800,height=600');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Top Suppliers</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 20px 24px 24px 24px;
              }
              body {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                color: #000000;
                background-color: #FFFFFF;
                margin: 0;
                padding: 0;
              }
              .page-container {
                width: 100%;
                min-height: 100vh;
              }
              .header-area {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
              }
              .left-header {
                font-size: 11px;
                font-weight: normal;
                text-align: left;
              }
              .center-title {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                font-size: 26px;
                font-weight: normal;
                text-align: center;
                margin-top: 10px;
              }
              .right-header {
                font-size: 10px;
                text-align: right;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                margin-top: 22px;
              }
              th {
                font-size: 11px;
                font-weight: normal;
                color: #000000;
                text-align: left;
                padding-bottom: 4px;
              }
              th:last-child,
              td:last-child {
                text-align: right;
              }
              td {
                font-size: 11px;
                color: #000000;
                height: 18px;
                text-align: left;
              }
              td:last-child {
                text-align: right;
              }
              .summary-section {
                margin-top: 20px;
                text-align: center;
                font-size: 11px;
              }
              .summary-row {
                display: flex;
                justify-content: center;
                margin-bottom: 6px;
              }
              .summary-label {
                margin-right: 10px;
              }
              .summary-value {
                text-align: right;
                min-width: 60px;
              }
            </style>
          </head>
          <body>
            <div class="page-container">
              <!-- Header Area -->
              <div class="header-area">
                <div class="left-header">Test company</div>
                <div class="center-title">Top suppliers</div>
                <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              
              <!-- Table -->
              <table>
                <thead>
                  <tr>
                    <th style="width: auto;">Lev.nr</th>
                    <th style="width: auto; padding-left: 40px;">Name</th>
                    <th style="width: auto; padding-left: 40px;">Total invoice amount excluding VAT</th>
                    <th style="width: auto; padding-left: 40px;">% share of total turnover</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td style="padding-left: 40px;"></td>
                    <td style="padding-left: 40px;">0,00</td>
                    <td style="padding-left: 40px;">0,0%</td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Summary Section -->
              <div class="summary-section">
                <div class="summary-row">
                  <span class="summary-label">Total leaderboard:</span>
                  <span class="summary-value">0,00</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Totally:</span>
                  <span class="summary-value">100,0%</span>
                </div>
              </div>
            </div>
          </body>
          </html>
        `);
        reportWindow.document.close();
        reportWindow.focus();
      }
    } else if (action === 'show-pdf') {
      alert('PDF generation would happen here');
    } else if (action === 'show-txt') {
      alert('TXT generation would happen here');
    }
  };

  return (
    <div className="bg-white p-2" style={{ maxWidth: '720px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px' }}>
      {/* Interval Section */}
      <div className="border border-gray-500 p-2 mb-2" style={{ borderWidth: '1px', borderColor: '#7A7A7A', padding: '8px', marginBottom: '8px' }}>
        <div className="font-bold mb-1" style={{ fontWeight: 'bold', fontSize: '11px', color: '#000000', marginBottom: '4px' }}>Interval</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <input
              type="radio"
              id="interval-all"
              name="interval"
              checked={intervalOption === 'all'}
              onChange={() => setIntervalOption('all')}
              className="w-3 h-3 border border-gray-600 mr-1"
              style={{ width: '12px', height: '12px', borderColor: '#5A5A5A' }}
            />
            <label htmlFor="interval-all" className="text-xs mr-3" style={{ fontSize: '11px', marginRight: '12px' }}>All</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="interval-date"
              name="interval"
              checked={intervalOption === 'date'}
              onChange={() => setIntervalOption('date')}
              className="w-3 h-3 border border-gray-600 mr-1"
              style={{ width: '12px', height: '12px', borderColor: '#5A5A5A' }}
            />
            <label htmlFor="interval-date" className="text-xs mr-2" style={{ fontSize: '11px', marginRight: '8px' }}>Date</label>
            
            <div className="flex items-center">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                disabled={intervalOption === 'all'}
                className="w-27.5 h-5 border border-gray-500 px-1 text-xs"
                style={{ width: '110px', height: '20px', padding: '2px 4px', fontSize: '11px', borderColor: '#7A7A7A' }}
              />
              <div 
                className="w-4 h-4 bg-gray-200 ml-1 flex items-center justify-center text-blue-600 cursor-pointer"
                style={{ width: '16px', height: '16px', backgroundColor: '#EDEDED', color: '#1E88E5', marginLeft: '4px' }}
              >
                📅
              </div>
              <span className="mx-1.5" style={{ margin: '0 6px', color: '#000000' }}>-</span>
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                disabled={intervalOption === 'all'}
                className="w-27.5 h-5 border border-gray-500 px-1 text-xs"
                style={{ width: '110px', height: '20px', padding: '2px 4px', fontSize: '11px', borderColor: '#7A7A7A' }}
              />
              <div 
                className="w-4 h-4 bg-gray-200 ml-1 flex items-center justify-center text-blue-600 cursor-pointer"
                style={{ width: '16px', height: '16px', backgroundColor: '#EDEDED', color: '#1E88E5', marginLeft: '4px' }}
              >
                📅
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Filter Section */}
      <div className="flex items-center mb-2" style={{ marginBottom: '8px' }}>
        <label className="text-xs mr-2" style={{ fontSize: '11px', marginRight: '8px' }}>Invoice Filter</label>
        <select
          value={invoiceFilter}
          onChange={(e) => setInvoiceFilter(e.target.value)}
          className="w-40 h-5.5 border border-gray-500 text-xs"
          style={{ width: '160px', height: '22px', fontSize: '11px', padding: '2px 4px', borderColor: '#7A7A7A' }}
        >
          <option>Show All</option>
          <option>Paid</option>
          <option>Unpaid</option>
          <option>Overdue</option>
        </select>
      </div>

      {/* Number of Suppliers Section */}
      <div className="flex items-center mb-2" style={{ marginBottom: '8px' }}>
        <label className="text-xs mr-2" style={{ fontSize: '11px', marginRight: '8px' }}>Number of Supplier</label>
        <select
          value={numberOfSuppliers}
          onChange={(e) => setNumberOfSuppliers(e.target.value)}
          className="w-15 h-5.5 border border-gray-500 text-xs"
          style={{ width: '60px', height: '22px', fontSize: '11px', borderColor: '#7A7A7A' }}
        >
          <option>5</option>
          <option>10</option>
          <option>15</option>
          <option>20</option>
          <option>25</option>
        </select>
      </div>

      {/* Orientation Section */}
      <div className="flex items-center mb-3" style={{ marginBottom: '12px' }}>
        <input
          type="radio"
          id="orientation-portrait"
          name="orientation"
          checked={orientation === 'portrait'}
          onChange={() => setOrientation('portrait')}
          className="w-3 h-3 border border-gray-600 mr-1"
          style={{ width: '12px', height: '12px', borderColor: '#5A5A5A' }}
        />
        <label htmlFor="orientation-portrait" className="text-xs mr-3" style={{ fontSize: '11px', marginRight: '12px' }}>Portrait</label>
        
        <input
          type="radio"
          id="orientation-landscape"
          name="orientation"
          checked={orientation === 'landscape'}
          onChange={() => setOrientation('landscape')}
          className="w-3 h-3 border border-gray-600 mr-1"
          style={{ width: '12px', height: '12px', borderColor: '#5A5A5A' }}
        />
        <label htmlFor="orientation-landscape" className="text-xs" style={{ fontSize: '11px' }}>Landscape</label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-3" style={{ marginTop: '12px' }}>
        <button
          onClick={() => handleSubmit('show-on-screen')}
          className="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5"
          style={{ height: '24px', minWidth: '90px', padding: '4px 10px', fontSize: '11px', borderRadius: '2px', borderColor: '#6FAE63', backgroundColor: '#CDEAC0' }}
        >
          Show on screen
        </button>
        <button
          onClick={() => handleSubmit('show-pdf')}
          className="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5"
          style={{ height: '24px', minWidth: '90px', padding: '4px 10px', fontSize: '11px', borderRadius: '2px', borderColor: '#6FAE63', backgroundColor: '#CDEAC0' }}
        >
          Show PDF
        </button>
        <button
          onClick={() => handleSubmit('show-txt')}
          className="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5"
          style={{ height: '24px', minWidth: '90px', padding: '4px 10px', fontSize: '11px', borderRadius: '2px', borderColor: '#6FAE63', backgroundColor: '#CDEAC0' }}
        >
          Show TXT
        </button>
        <button
          onClick={() => window.close()}
          className="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500"
          style={{ height: '24px', minWidth: '90px', padding: '4px 10px', fontSize: '11px', borderRadius: '2px', borderColor: '#6FAE63', backgroundColor: '#CDEAC0' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TopRatedSuppliers;