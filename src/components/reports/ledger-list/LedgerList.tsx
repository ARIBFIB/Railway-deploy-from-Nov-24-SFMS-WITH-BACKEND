import React, { useState } from 'react';

const LedgerList = () => {
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [supplierOption, setSupplierOption] = useState('all'); // 'all' or 'specific'
  const [supplierNumber, setSupplierNumber] = useState('');
  const [supplierDescription, setSupplierDescription] = useState('');
  const [orderBy, setOrderBy] = useState('supplier-no'); // 'supplier-no', 'invoice-no', 'company-name'
  const [showUnpaid, setShowUnpaid] = useState(false);
  const [showZeroBalance, setShowZeroBalance] = useState(false);
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
            <title>Ledger List</title>
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
                margin-bottom: 10px;
              }
              .left-header {
                font-size: 11px;
                font-weight: bold;
                text-align: left;
              }
              .as-of-date {
                font-size: 10.5px;
                margin-top: 2px;
                text-align: left;
              }
              .center-title {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                font-size: 22px;
                font-weight: normal;
                text-align: center;
                margin-bottom: 10px;
              }
              .right-header {
                font-size: 10px;
                text-align: right;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 10.5px;
                margin-top: 20px;
              }
              th {
                font-size: 10.5px;
                font-weight: bold;
                color: #000000;
                padding-bottom: 4px;
                border-bottom: 1px solid #000000;
                text-align: left;
              }
              td {
                font-size: 10.5px;
                height: 14px;
                text-align: left;
              }
              .numeric {
                text-align: right;
              }
              .summary-section {
                margin-top: 20px;
                font-size: 11px;
              }
              .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2px;
              }
              .summary-label {
                font-weight: normal;
              }
              .summary-value {
                font-weight: bold;
                text-align: right;
              }
            </style>
          </head>
          <body>
            <div class="page-container">
              <!-- Header Area -->
              <div class="header-area">
                <div class="left-header">
                  Test company<br>
                  <div class="as-of-date">As of date ${new Date().toISOString().split('T')[0]}</div>
                </div>
                <div class="center-title">Accounts payable list</div>
                <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              
              <!-- Table -->
              <table>
                <thead>
                  <tr>
                    <th>Delivery number</th>
                    <th>Supplier</th>
                    <th>Serial number</th>
                    <th>OCR/Invoice number</th>
                    <th>Factdate</th>
                    <th>Formerly</th>
                    <th>Protection</th>
                    <th>Currency</th>
                    <th class="numeric">Amount</th>
                    <th class="numeric">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Empty state - no invoices -->
                </tbody>
              </table>
              
              <!-- Summary Section -->
              <div class="summary-section">
                <div class="summary-row">
                  <span class="summary-label">Number of invoices</span>
                  <span class="summary-value">0</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Summa i SEK</span>
                  <span class="summary-value">0,00</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">Total in SEK</span>
                  <span class="summary-value">0,00</span>
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
    <div className="bg-white p-2" style={{ maxWidth: '640px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Date Section */}
      <div className="flex items-center mb-1.5">
        <label className="text-xs text-black mr-1.5" style={{ fontSize: '11px', marginRight: '6px' }}>Date</label>
        <div className="flex items-center">
          <input
            type="text"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-22.5 h-5 border border-gray-500 px-1 text-xs"
            style={{ width: '90px', height: '20px', padding: '2px 4px', fontSize: '11px' }}
          />
          <div className="w-4 h-4 ml-0.75 cursor-pointer flex items-center justify-center text-xs">📅</div>
        </div>
        <span className="mx-1" style={{ margin: '0 4px' }}>-</span>
        <div className="flex items-center">
          <input
            type="text"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-22.5 h-5 border border-gray-500 px-1 text-xs"
            style={{ width: '90px', height: '20px', padding: '2px 4px', fontSize: '11px' }}
          />
          <div className="w-4 h-4 ml-0.75 cursor-pointer flex items-center justify-center text-xs">📅</div>
        </div>
      </div>

      {/* Supplier Section */}
      <div className="border border-black p-1.5 mt-1.5" style={{ borderWidth: '1px', padding: '6px', marginTop: '6px' }}>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            id="supplier-all"
            name="supplier-option"
            checked={supplierOption === 'all'}
            onChange={() => setSupplierOption('all')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="supplier-all" className="text-xs mr-3" style={{ fontSize: '11px', marginLeft: '4px' }}>All suppliers</label>
          
          <input
            type="radio"
            id="supplier-specific"
            name="supplier-option"
            checked={supplierOption === 'specific'}
            onChange={() => setSupplierOption('specific')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="supplier-specific" className="text-xs" style={{ fontSize: '11px', marginLeft: '4px' }}>Supplier</label>
        </div>
        
        <div className="flex items-center">
          <input
            type="text"
            value={supplierNumber}
            onChange={(e) => setSupplierNumber(e.target.value)}
            disabled={supplierOption === 'all'}
            className="w-30 h-5 border bg-gray-200 text-gray-500 px-1 text-xs"
            style={{ width: '120px', height: '20px', backgroundColor: '#F0F0F0', borderColor: '#B0B0B0', color: '#777777', padding: '2px 4px', fontSize: '11px' }}
          />
          <div className="w-4 h-4 bg-yellow-300 border border-yellow-600 ml-0.75 flex items-center justify-center text-xs cursor-pointer"
               style={{ width: '16px', height: '16px', backgroundColor: '#FFD966', borderColor: '#C9A400', marginLeft: '3px' }}>?</div>
          
          <input
            type="text"
            value={supplierDescription}
            onChange={(e) => setSupplierDescription(e.target.value)}
            disabled={supplierOption === 'all'}
            className="w-55 h-5 border bg-gray-200 text-gray-500 px-1 text-xs ml-2"
            style={{ width: '220px', height: '20px', backgroundColor: '#F0F0F0', borderColor: '#B0B0B0', color: '#777777', padding: '2px 4px', fontSize: '11px', marginLeft: '8px' }}
          />
        </div>
      </div>

      {/* Order By Section */}
      <div className="border border-black p-1.5 mt-1.5" style={{ borderWidth: '1px', padding: '6px', marginTop: '6px' }}>
        <div className="flex items-center">
          <input
            type="radio"
            id="order-supplier-no"
            name="order-by"
            checked={orderBy === 'supplier-no'}
            onChange={() => setOrderBy('supplier-no')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="order-supplier-no" className="text-xs mr-3" style={{ fontSize: '11px', marginLeft: '4px' }}>Supplier No.</label>
          
          <input
            type="radio"
            id="order-invoice-no"
            name="order-by"
            checked={orderBy === 'invoice-no'}
            onChange={() => setOrderBy('invoice-no')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="order-invoice-no" className="text-xs mr-3" style={{ fontSize: '11px', marginLeft: '4px' }}>Invoice no.</label>
          
          <input
            type="radio"
            id="order-company-name"
            name="order-by"
            checked={orderBy === 'company-name'}
            onChange={() => setOrderBy('company-name')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="order-company-name" className="text-xs" style={{ fontSize: '11px', marginLeft: '4px' }}>Company Name</label>
        </div>
      </div>

      {/* Options Section */}
      <div className="mt-1.5">
        <div className="flex items-center mb-1">
          <input
            type="checkbox"
            id="show-unpaid"
            checked={showUnpaid}
            onChange={(e) => setShowUnpaid(e.target.checked)}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="show-unpaid" className="text-xs" style={{ fontSize: '11px' }}>Show unpaid invoices</label>
          <div className="w-3.5 h-3.5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs ml-1"
               style={{ width: '14px', height: '14px', backgroundColor: '#E6F0FA', color: '#1E73BE', borderRadius: '50%', marginLeft: '4px' }}>i</div>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-zero-balance"
            checked={showZeroBalance}
            onChange={(e) => setShowZeroBalance(e.target.checked)}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="show-zero-balance" className="text-xs" style={{ fontSize: '11px' }}>Show zero balance</label>
        </div>
      </div>

      {/* Orientation Section */}
      <div className="mt-1.5">
        <div className="flex items-center">
          <input
            type="radio"
            id="orientation-portrait"
            name="orientation"
            checked={orientation === 'portrait'}
            onChange={() => setOrientation('portrait')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="orientation-portrait" className="text-xs mr-3" style={{ fontSize: '11px', marginLeft: '4px' }}>Portrait</label>
          
          <input
            type="radio"
            id="orientation-landscape"
            name="orientation"
            checked={orientation === 'landscape'}
            onChange={() => setOrientation('landscape')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="orientation-landscape" className="text-xs" style={{ fontSize: '11px', marginLeft: '4px' }}>Landscape</label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center mt-2.5" style={{ marginTop: '10px' }}>
        <button
          onClick={() => handleSubmit('show-on-screen')}
          className="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5"
          style={{ height: '24px', padding: '2px 10px', fontSize: '11px', borderRadius: '2px' }}
        >
          Show on screen
        </button>
        <button
          onClick={() => handleSubmit('show-pdf')}
          className="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5"
          style={{ height: '24px', padding: '2px 10px', fontSize: '11px', borderRadius: '2px' }}
        >
          Show PDF
        </button>
        <button
          onClick={() => handleSubmit('show-txt')}
          className="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5"
          style={{ height: '24px', padding: '2px 10px', fontSize: '11px', borderRadius: '2px' }}
        >
          Show TXT
        </button>
        <button
          onClick={() => window.close()}
          className="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400"
          style={{ height: '24px', padding: '2px 10px', fontSize: '11px', borderRadius: '2px' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LedgerList;