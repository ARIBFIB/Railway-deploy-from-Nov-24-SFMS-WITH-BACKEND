import React, { useState } from 'react';

const SupplierStatistics = () => {
  const [supplierCode, setSupplierCode] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [intervalOption, setIntervalOption] = useState('all'); // 'all' or 'date'
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-12-31');
  const [invoiceFilter, setInvoiceFilter] = useState('Show All');
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' or 'landscape'
  const [showInSEK, setShowInSEK] = useState(false);
  const [amountOption, setAmountOption] = useState('excl-vat'); // 'excl-vat' or 'vat-included'

  const handleSubmit = (action: string) => {
    if (action === 'show-on-screen') {
      // Create report window
      const reportWindow = window.open('', '_blank', 'width=1024,height=768');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Supplier Statistics</title>
            <style>
              @page {
                size: A4 ${orientation};
                margin: 20px;
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
                padding: 20px;
              }
              .header-area {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
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
                font-size: 30px;
                font-weight: normal;
                text-align: center;
              }
              .right-header {
                font-size: 10px;
                text-align: right;
              }
              .supplier-header {
                font-size: 16px;
                font-weight: bold;
                margin-top: 16px;
                margin-bottom: 10px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 11px;
                margin-top: 10px;
              }
              th {
                font-size: 11px;
                font-weight: normal;
                text-align: left;
                padding-bottom: 4px;
              }
              td {
                font-size: 11px;
                height: 20px;
                text-align: left;
              }
              .summary-section {
                margin-top: 20px;
                font-size: 12px;
                font-weight: bold;
              }
              .summary-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 2px;
                width: 200px;
              }
            </style>
          </head>
          <body>
            <div class="page-container">
              <!-- Header Area -->
              <div class="header-area">
                <div class="left-header">Test company</div>
                <div class="center-title">Supplier Statistics</div>
                <div class="right-header">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              
              <!-- Supplier Header -->
              <div class="supplier-header">1 supplier name</div>
              
              <!-- Table -->
              <table>
                <thead>
                  <tr>
                    <th style="width: 80px;">Serial No</th>
                    <th style="width: 110px;">Invoice date</th>
                    <th style="width: 110px;">Two dates</th>
                    <th style="width: 140px;">Status</th>
                    <th style="width: 120px;">Balance</th>
                    <th style="width: 120px;">Invoice amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>2026-01-16</td>
                    <td>2026-02-15</td>
                    <td>Unsettled</td>
                    <td>0,00</td>
                    <td>0,00</td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Summary Section -->
              <div class="summary-section">
                <div class="summary-row">
                  <span>Number invoices</span>
                  <span>1</span>
                </div>
                <div class="summary-row">
                  <span>Total balance</span>
                  <span>0,00</span>
                </div>
                <div class="summary-row">
                  <span>Total amount</span>
                  <span>0,00</span>
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
    <div className="bg-white p-2" style={{ maxWidth: '820px', margin: '0 auto', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px' }}>
      {/* Supplier Section */}
      <div className="flex items-center mb-3" style={{ marginBottom: '10-12px', marginLeft: '14px', marginRight: '14px' }}>
        <label className="text-xs text-black mr-2.5" style={{ fontSize: '11px', marginRight: '10px' }}>Supplier</label>
        <div className="flex items-center">
          <input
            type="text"
            value={supplierCode}
            onChange={(e) => setSupplierCode(e.target.value)}
            className="w-30 h-5 border border-gray-500 px-1 text-xs"
            style={{ width: '120px', height: '20px', padding: '2px 4px', fontSize: '11px', borderColor: '#7F7F7F' }}
          />
          <div 
            className="w-4.5 h-4.5 bg-yellow-300 border border-gray-500 ml-1 flex items-center justify-center cursor-pointer"
            style={{ width: '18px', height: '18px', backgroundColor: '#FFE066', borderColor: '#7F7F7F', marginLeft: '4px' }}
          >
            ⬛
          </div>
          <input
            type="text"
            value={supplierName}
            readOnly
            className="w-65 h-5 border border-gray-500 bg-gray-200 ml-1.5 px-1 text-xs"
            style={{ width: '260px', height: '20px', backgroundColor: '#F2F2F2', borderColor: '#7F7F7F', marginLeft: '6px', padding: '2px 4px', fontSize: '11px' }}
          />
        </div>
      </div>

      {/* Interval Section */}
      <div className="border border-gray-500 p-1.5 mb-3" style={{ borderWidth: '1px', borderColor: '#7F7F7F', padding: '6px', marginBottom: '10-12px', marginLeft: '14px', marginRight: '14px' }}>
        <div className="flex items-center">
          <input
            type="radio"
            id="interval-all"
            name="interval"
            checked={intervalOption === 'all'}
            onChange={() => setIntervalOption('all')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="interval-all" className="text-xs mr-6" style={{ fontSize: '11px', marginRight: '24px' }}>All</label>
          
          <input
            type="radio"
            id="interval-date"
            name="interval"
            checked={intervalOption === 'date'}
            onChange={() => setIntervalOption('date')}
            className="w-3 h-3 border border-gray-600 mr-1"
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="interval-date" className="text-xs mr-2" style={{ fontSize: '11px', marginRight: '8px' }}>Date</label>
          
          <div className="flex items-center">
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              disabled={intervalOption === 'all'}
              className="w-25 h-5 border border-gray-500 px-1 text-xs"
              style={{ width: '100px', height: '20px', padding: '2px 4px', fontSize: '11px', borderColor: '#7F7F7F' }}
            />
            <div className="w-4.5 h-4.5 ml-1 cursor-pointer flex items-center justify-center text-xs"
                 style={{ width: '18px', height: '18px', marginLeft: '4px' }}>📅</div>
            <span className="mx-1.5" style={{ margin: '0 6px' }}>-</span>
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              disabled={intervalOption === 'all'}
              className="w-25 h-5 border border-gray-500 px-1 text-xs"
              style={{ width: '100px', height: '20px', padding: '2px 4px', fontSize: '11px', borderColor: '#7F7F7F' }}
            />
            <div className="w-4.5 h-4.5 ml-1 cursor-pointer flex items-center justify-center text-xs"
                 style={{ width: '18px', height: '18px', marginLeft: '4px' }}>📅</div>
          </div>
        </div>
      </div>

      {/* Invoice Filter Section */}
      <div className="flex items-center mb-3" style={{ marginBottom: '10-12px', marginLeft: '14px', marginRight: '14px' }}>
        <label className="text-xs text-black mr-2.5" style={{ fontSize: '11px', marginRight: '10px' }}>Invoice Filter</label>
        <select
          value={invoiceFilter}
          onChange={(e) => setInvoiceFilter(e.target.value)}
          className="w-45 h-5.5 border border-gray-500 text-xs"
          style={{ width: '180px', height: '22px', fontSize: '11px', borderColor: '#7F7F7F' }}
        >
          <option>Show All</option>
          <option>Paid</option>
          <option>Unpaid</option>
          <option>Overdue</option>
        </select>
      </div>

      {/* Orientation Section */}
      <div className="flex items-center mb-3" style={{ marginBottom: '10-12px', marginLeft: '14px', marginRight: '14px' }}>
        <input
          type="radio"
          id="orientation-portrait"
          name="orientation"
          checked={orientation === 'portrait'}
          onChange={() => setOrientation('portrait')}
          className="w-3 h-3 border border-gray-600 mr-1"
          style={{ width: '12px', height: '12px' }}
        />
        <label htmlFor="orientation-portrait" className="text-xs mr-6" style={{ fontSize: '11px', marginRight: '24px' }}>Portrait</label>
        
        <input
          type="radio"
          id="orientation-landscape"
          name="orientation"
          checked={orientation === 'landscape'}
          onChange={() => setOrientation('landscape')}
          className="w-3 h-3 border border-gray-600 mr-1"
          style={{ width: '12px', height: '12px' }}
        />
        <label htmlFor="orientation-landscape" className="text-xs" style={{ fontSize: '11px' }}>Landscape</label>
      </div>

      {/* Currency Section */}
      <div className="flex items-center mb-3" style={{ marginBottom: '10-12px', marginLeft: '14px', marginRight: '14px' }}>
        <input
          type="checkbox"
          id="show-in-sek"
          checked={showInSEK}
          onChange={(e) => setShowInSEK(e.target.checked)}
          className="w-3 h-3 border border-gray-600 mr-1"
          style={{ width: '12px', height: '12px' }}
        />
        <label htmlFor="show-in-sek" className="text-xs" style={{ fontSize: '11px' }}>Show in SEK SEK</label>
      </div>

      {/* Show Amount Section */}
      <div className="flex items-center mb-4" style={{ marginBottom: '16px', marginLeft: '14px', marginRight: '14px' }}>
        <input
          type="radio"
          id="excl-vat"
          name="amount-option"
          checked={amountOption === 'excl-vat'}
          onChange={() => setAmountOption('excl-vat')}
          className="w-3 h-3 border border-gray-600 mr-1"
          style={{ width: '12px', height: '12px' }}
        />
        <label htmlFor="excl-vat" className="text-xs mr-6" style={{ fontSize: '11px', marginRight: '24px' }}>Excl. VAT</label>
        
        <input
          type="radio"
          id="vat-included"
          name="amount-option"
          checked={amountOption === 'vat-included'}
          onChange={() => setAmountOption('vat-included')}
          className="w-3 h-3 border border-gray-600 mr-1"
          style={{ width: '12px', height: '12px' }}
        />
        <label htmlFor="vat-included" className="text-xs" style={{ fontSize: '11px' }}>VAT included</label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center pt-2" style={{ paddingTop: '8px' }}>
        <button
          onClick={() => handleSubmit('show-on-screen')}
          className="h-6.5 px-3 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2"
          style={{ height: '26px', padding: '4px 12px', fontSize: '11px', borderRadius: '0px', borderColor: '#6FA25C', backgroundColor: '#CFEAC1' }}
        >
          Show on screen
        </button>
        <button
          onClick={() => handleSubmit('show-pdf')}
          className="h-6.5 px-3 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2"
          style={{ height: '26px', padding: '4px 12px', fontSize: '11px', borderRadius: '0px', borderColor: '#6FA25C', backgroundColor: '#CFEAC1' }}
        >
          Show PDF
        </button>
        <button
          onClick={() => handleSubmit('show-txt')}
          className="h-6.5 px-3 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2"
          style={{ height: '26px', padding: '4px 12px', fontSize: '11px', borderRadius: '0px', borderColor: '#6FA25C', backgroundColor: '#CFEAC1' }}
        >
          Show TXT
        </button>
        <button
          onClick={() => window.close()}
          className="h-6.5 px-3 text-xs border border-green-700 bg-green-300 hover:bg-green-400"
          style={{ height: '26px', padding: '4px 12px', fontSize: '11px', borderRadius: '0px', borderColor: '#6FA25C', backgroundColor: '#CFEAC1' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SupplierStatistics;