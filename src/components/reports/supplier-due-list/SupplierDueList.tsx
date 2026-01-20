import React, { useState } from 'react';

const SupplierDueList = () => {
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [includeDuringPayment, setIncludeDuringPayment] = useState(false);
  const [orderBy, setOrderBy] = useState('serial'); // 'serial', 'company', 'due'
  const [orientation, setOrientation] = useState('landscape'); // 'portrait', 'landscape'

  const handleSubmit = (action: string) => {
    if (action === 'show-on-screen') {
      // Create landscape report window
      const reportWindow = window.open('', '_blank', 'width=1024,height=768');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Supplier Due List</title>
            <style>
              @page {
                size: A4 landscape;
                margin: 12mm;
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
                margin-bottom: 6px;
              }
              .left-header {
                font-size: 12px;
                text-align: left;
              }
              .right-header {
                font-size: 10px;
                color: #000000;
                text-align: right;
              }
              .report-title {
                font-size: 28px;
                font-weight: normal;
                text-align: center;
                margin: 6px 0 8px 0;
              }
              .subheading {
                font-size: 12px;
                text-align: left;
                margin-bottom: 10px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                margin-top: 10px;
              }
              th {
                font-weight: normal;
                color: #000000;
                border-bottom: 1px solid #000000;
                padding: 4px 6px;
                text-align: left;
              }
              td {
                padding: 3px 6px;
                color: #000000;
                text-align: left;
              }
              tr {
                height: 18px;
              }
              .totals-section {
                margin-top: 12px;
              }
              .total-row {
                font-size: 12px;
                font-weight: bold;
                margin-top: 12px;
              }
              .count-row {
                font-size: 12px;
                margin-top: 4px;
              }
            </style>
          </head>
          <body>
            <div class="page-container">
              <!-- Header Area -->
              <div class="header-area">
                <div class="left-header">Test company</div>
                <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              
              <!-- Report Title -->
              <div class="report-title">Supplier due list</div>
              
              <!-- Subheading -->
              <div class="subheading">As of date ${new Date().toISOString().split('T')[0]}</div>
              
              <!-- Table -->
              <table>
                <thead>
                  <tr>
                    <th>Serial number</th>
                    <th>Supplier</th>
                    <th>BG/PG number</th>
                    <th>OCR / Invoice reference</th>
                    <th>Prev.</th>
                    <th>Ver.nr</th>
                    <th>Datum</th>
                    <th>Currency</th>
                    <th>Amount</th>
                    <th>Amount in SEK</th>
                    <th>Balance</th>
                    <th>Balance in SEK</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Empty state - no invoices -->
                </tbody>
              </table>
              
              <!-- Totals Section -->
              <div class="totals-section">
                <div class="total-row">Total in SEK 0 000,00</div>
                <div class="count-row">Number of invoices: 0</div>
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
    <div className="bg-white p-3" style={{ maxWidth: '960px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Date Range Section */}
      <div className="border border-black p-2 mb-1.5" style={{ borderWidth: '1px', borderRadius: '0px', padding: '8px', marginBottom: '6px' }}>
        <div className="flex items-center mb-1.5">
          <label className="w-10 text-xs text-black mr-1" style={{ width: '40px', fontSize: '12px' }}>Date</label>
          <div className="flex items-center">
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-28 h-5 border border-gray-500 px-1 text-xs"
              style={{ width: '110px', height: '20px', padding: '2px 4px', fontSize: '12px' }}
            />
            <div className="w-4 h-4 ml-1 cursor-pointer flex items-center justify-center text-xs">📅</div>
          </div>
          <span className="mx-1.5">-</span>
          <div className="flex items-center">
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-28 h-5 border border-gray-500 px-1 text-xs"
              style={{ width: '110px', height: '20px', padding: '2px 4px', fontSize: '12px' }}
            />
            <div className="w-4 h-4 ml-1 cursor-pointer flex items-center justify-center text-xs">📅</div>
          </div>
        </div>
        
        <div className="flex items-center mt-1.5">
          <input
            type="checkbox"
            id="include-during-payment"
            checked={includeDuringPayment}
            onChange={(e) => setIncludeDuringPayment(e.target.checked)}
            className="w-3 h-3 border border-gray-500 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="include-during-payment" className="text-xs text-black" style={{ fontSize: '12px' }}>
            Include invoices during payment
          </label>
        </div>
      </div>

      {/* Order By Section */}
      <div className="border border-black p-2 mb-1.5" style={{ borderWidth: '1px', borderRadius: '0px', padding: '8px', marginBottom: '6px' }}>
        <div className="text-xs font-bold mb-1" style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Order by</div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <input
              type="radio"
              id="order-serial"
              name="order-by"
              checked={orderBy === 'serial'}
              onChange={() => setOrderBy('serial')}
              className="w-3 h-3 border border-gray-500 mr-1"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="order-serial" className="text-xs mr-1" style={{ fontSize: '12px' }}>Serial No.</label>
          </div>
          <div className="flex items-center mr-4">
            <input
              type="radio"
              id="order-company"
              name="order-by"
              checked={orderBy === 'company'}
              onChange={() => setOrderBy('company')}
              className="w-3 h-3 border border-gray-500 mr-1"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="order-company" className="text-xs mr-1" style={{ fontSize: '12px' }}>Company Name</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="order-due"
              name="order-by"
              checked={orderBy === 'due'}
              onChange={() => setOrderBy('due')}
              className="w-3 h-3 border border-gray-500 mr-1"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="order-due" className="text-xs mr-1" style={{ fontSize: '12px' }}>Due date</label>
          </div>
        </div>
      </div>

      {/* Orientation Section */}
      <div className="border border-black p-2 mb-3" style={{ borderWidth: '1px', borderRadius: '0px', padding: '8px', marginBottom: '6px' }}>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <input
              type="radio"
              id="orientation-portrait"
              name="orientation"
              checked={orientation === 'portrait'}
              onChange={() => setOrientation('portrait')}
              className="w-3 h-3 border border-gray-500 mr-1"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="orientation-portrait" className="text-xs mr-1" style={{ fontSize: '12px' }}>Portrait</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="orientation-landscape"
              name="orientation"
              checked={orientation === 'landscape'}
              onChange={() => setOrientation('landscape')}
              className="w-3 h-3 border border-gray-500 mr-1"
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="orientation-landscape" className="text-xs mr-1" style={{ fontSize: '12px' }}>Landscape</label>
          </div>
          <div className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs ml-1.5"
               style={{ width: '14px', height: '14px', backgroundColor: '#5B9BD5', color: '#FFFFFF', borderRadius: '50%' }}>
            i
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-3" style={{ marginTop: '12px' }}>
        <button
          onClick={() => handleSubmit('show-on-screen')}
          className="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5"
          style={{ height: '22px', padding: '2px 10px', fontSize: '12px', borderRadius: '0px' }}
        >
          Show on screen
        </button>
        <button
          onClick={() => handleSubmit('show-pdf')}
          className="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5"
          style={{ height: '22px', padding: '2px 10px', fontSize: '12px', borderRadius: '0px' }}
        >
          Show PDF
        </button>
        <button
          onClick={() => handleSubmit('show-txt')}
          className="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5"
          style={{ height: '22px', padding: '2px 10px', fontSize: '12px', borderRadius: '0px' }}
        >
          Show TXT
        </button>
        <button
          onClick={() => window.close()}
          className="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400"
          style={{ height: '22px', padding: '2px 10px', fontSize: '12px', borderRadius: '0px' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SupplierDueList;