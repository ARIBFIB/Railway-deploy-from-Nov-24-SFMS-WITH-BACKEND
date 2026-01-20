import React, { useState } from 'react';

const StockValueReport = () => {
  const [date, setDate] = useState('2026-01-20');
  const [stockPoint, setStockPoint] = useState('All');
  const [showPositive, setShowPositive] = useState(true);
  const [showNegative, setShowNegative] = useState(true);
  const [showZeroValues, setShowZeroValues] = useState(true);
  const [showOnePerRow, setShowOnePerRow] = useState('item'); // 'item' or 'inbound-delivery'

  const handleSubmit = (action: string) => {
    if (action === 'show-pdf') {
      // Create PDF report window
      const reportWindow = window.open('', '_blank', 'width=800,height=600');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Stock Value Report</title>
            <style>
              @page {
                size: A4 portrait;
                margin: 20mm;
              }
              body {
                font-family: Arial, Helvetica, sans-serif;
                font-size: 10px;
                color: #000000;
                background-color: #FFFFFF;
                margin: 0;
                padding: 0;
              }
              .page-container {
                width: 100%;
                min-height: 100vh;
              }
              .header-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
              }
              .company-name {
                font-size: 10px;
                font-weight: bold;
                text-align: left;
              }
              .title {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                font-size: 18px;
                font-weight: bold;
                text-align: center;
              }
              .page-info {
                font-size: 9px;
                text-align: right;
              }
              .sub-header {
                text-align: center;
                font-size: 11px;
                margin-bottom: 12px;
              }
              .metadata-block {
                position: absolute;
                right: 0;
                font-size: 9px;
                line-height: 14px;
                text-align: right;
              }
              .filters-options-box {
                border: 2px solid #000000;
                padding: 8px;
                margin-bottom: 10px;
              }
              .filters-options-title {
                font-weight: bold;
                font-size: 10px;
                border-bottom: 1px solid #000000;
                padding-bottom: 4px;
                margin-bottom: 6px;
              }
              .filters-options-content {
                display: flex;
                font-size: 9px;
                line-height: 14px;
              }
              .filters-column {
                flex: 1;
              }
              .options-column {
                flex: 1;
                margin-left: 20px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 10px;
                margin-top: 10px;
              }
              th {
                border: 2px solid #000000;
                font-size: 10px;
                font-weight: bold;
                padding: 6px;
                text-align: left;
              }
              td {
                font-size: 10px;
                padding: 6px;
                text-align: left;
              }
              .total-row {
                background-color: #D0D0D0;
                height: 28px;
                padding: 6px 10px;
                font-weight: bold;
              }
              .total-label {
                float: left;
              }
              .total-value {
                float: right;
              }
            </style>
          </head>
          <body>
            <div class="page-container">
              <!-- Header Section -->
              <div class="header-row">
                <div class="company-name">Testföretag</div>
                <div class="title">Stock value</div>
                <div class="page-info">Page 1 (1)</div>
              </div>
              
              <!-- Sub-header -->
              <div class="sub-header">2026-01-20</div>
              
              <!-- Metadata Block -->
              <div class="metadata-block">
                Printed: 2026-01-20 06:23<br>
                Printed by: test test<br>
                Period: - 2026-01-20
              </div>
              
              <!-- Filters and Options Box -->
              <div class="filters-options-box">
                <div class="filters-options-title">Filters and options</div>
                <div class="filters-options-content">
                  <div class="filters-column">
                    Items: → All<br>
                    Stock point: → All
                  </div>
                  <div class="options-column">
                    Show positive values: Yes<br>
                    Show negative values: Yes<br>
                    Show 0-values: Yes<br>
                    Show one row per item
                  </div>
                </div>
              </div>
              
              <!-- Table -->
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty in stock</th>
                    <th>Avg cost/p SEK</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="4" style="text-align: center;">No data available</td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Total Row -->
              <div class="total-row">
                <span class="total-label">Total</span>
                <span class="total-value">0.00</span>
              </div>
            </div>
          </body>
          </html>
        `);
        reportWindow.document.close();
        reportWindow.focus();
      }
    } else if (action === 'export-csv') {
      // Create CSV export
      const csvContent = "Item,Qty in stock,Avg cost/p SEK,Value\n";
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "stock_value_report.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white p-3" style={{ width: '720px', minHeight: '360px', padding: '12px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px', color: '#000000' }}>
      <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: '48% 48%', gap: '16px' }}>
        {/* LEFT COLUMN */}
        <div>
          {/* Date Field */}
          <div className="mb-1" style={{ marginBottom: '4px' }}>
            <label className="block text-xs mb-1" style={{ display: 'block', fontSize: '11px', marginBottom: '4px' }}>Date</label>
            <div className="relative">
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-40 h-5.5 border border-gray-500 rounded px-1.5 text-xs"
                style={{ width: '160px', height: '22px', padding: '2px 6px', fontSize: '11px', borderColor: '#9E9E9E', borderRadius: '2px' }}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-500 cursor-pointer flex items-center justify-center"
                   style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#6F6F6F', cursor: 'pointer' }}>
                📅
              </div>
            </div>
          </div>

          {/* Stock Points */}
          <div className="mt-4" style={{ marginTop: '16px' }}>
            <label className="block text-xs mb-1" style={{ display: 'block', fontSize: '11px', marginBottom: '4px' }}>Stock points</label>
            <select
              value={stockPoint}
              onChange={(e) => setStockPoint(e.target.value)}
              className="w-50 h-5.5 border border-gray-500 rounded px-1.5 text-xs"
              style={{ width: '200px', height: '22px', padding: '2px 6px', fontSize: '11px', borderColor: '#9E9E9E', borderRadius: '2px' }}
            >
              <option>All</option>
              <option>Stock Point 1</option>
              <option>Stock Point 2</option>
              <option>Stock Point 3</option>
            </select>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* Filter Section */}
          <div className="mb-1.5" style={{ marginBottom: '6px' }}>
            <div className="font-bold text-xs mb-1.5" style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>Filter</div>
            <div className="space-y-1" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="positive-values"
                  checked={showPositive}
                  onChange={(e) => setShowPositive(e.target.checked)}
                  className="w-3 h-3 border border-green-700 mr-1.5"
                  style={{ width: '12px', height: '12px', borderColor: '#0A7A2F', backgroundColor: showPositive ? '#0A7A2F' : 'transparent' }}
                />
                <label htmlFor="positive-values" className="text-xs" style={{ fontSize: '11px' }}>Positive values</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="negative-values"
                  checked={showNegative}
                  onChange={(e) => setShowNegative(e.target.checked)}
                  className="w-3 h-3 border border-green-700 mr-1.5"
                  style={{ width: '12px', height: '12px', borderColor: '#0A7A2F', backgroundColor: showNegative ? '#0A7A2F' : 'transparent' }}
                />
                <label htmlFor="negative-values" className="text-xs" style={{ fontSize: '11px' }}>Negative values</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="zero-values"
                  checked={showZeroValues}
                  onChange={(e) => setShowZeroValues(e.target.checked)}
                  className="w-3 h-3 border border-green-700 mr-1.5"
                  style={{ width: '12px', height: '12px', borderColor: '#0A7A2F', backgroundColor: showZeroValues ? '#0A7A2F' : 'transparent' }}
                />
                <label htmlFor="zero-values" className="text-xs" style={{ fontSize: '11px' }}>0-values</label>
              </div>
            </div>
          </div>

          {/* Options Section */}
          <div className="mt-3.5" style={{ marginTop: '14px' }}>
            <div className="font-bold text-xs mb-1.5" style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>Options</div>
            <div className="border border-gray-500 rounded px-0.75" style={{ height: '26px', border: '1px solid #9E9E9E', borderRadius: '3px', padding: '3px' }}>
              <div className="flex items-center h-full">
                <label className="text-xs mr-2" style={{ fontSize: '11px', marginRight: '8px' }}>Show one per row:</label>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="show-item"
                    name="show-one-per-row"
                    checked={showOnePerRow === 'item'}
                    onChange={() => setShowOnePerRow('item')}
                    className="w-3 h-3 border border-gray-500 mr-1"
                    style={{ width: '12px', height: '12px', borderColor: showOnePerRow === 'item' ? '#2E9E38' : '#9E9E9E', backgroundColor: showOnePerRow === 'item' ? '#2E9E38' : 'transparent' }}
                  />
                  <label htmlFor="show-item" className="text-xs mr-3" style={{ fontSize: '11px', marginRight: '12px' }}>Item</label>
                  
                  <input
                    type="radio"
                    id="show-inbound"
                    name="show-one-per-row"
                    checked={showOnePerRow === 'inbound-delivery'}
                    onChange={() => setShowOnePerRow('inbound-delivery')}
                    className="w-3 h-3 border border-gray-500 mr-1"
                    style={{ width: '12px', height: '12px', borderColor: showOnePerRow === 'inbound-delivery' ? '#2E9E38' : '#9E9E9E', backgroundColor: showOnePerRow === 'inbound-delivery' ? '#2E9E38' : 'transparent' }}
                  />
                  <label htmlFor="show-inbound" className="text-xs" style={{ fontSize: '11px' }}>Inbound delivery</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end mt-6" style={{ justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          onClick={() => window.close()}
          className="h-7 px-3.5 text-xs font-bold rounded-full text-white mr-2"
          style={{ height: '28px', padding: '0 14px', fontSize: '11px', fontWeight: 'bold', borderRadius: '14px', backgroundColor: '#7A7A7A', color: '#FFFFFF', marginRight: '8px' }}
        >
          Close
        </button>
        <button
          onClick={() => handleSubmit('show-pdf')}
          className="h-7 px-3.5 text-xs font-bold rounded-full text-white mr-2"
          style={{ height: '28px', padding: '0 14px', fontSize: '11px', fontWeight: 'bold', borderRadius: '14px', backgroundColor: '#0A7A2F', color: '#FFFFFF', marginRight: '8px' }}
        >
          Show PDF
        </button>
        <button
          onClick={() => handleSubmit('export-csv')}
          className="h-7 px-3.5 text-xs font-bold rounded-full text-white"
          style={{ height: '28px', padding: '0 14px', fontSize: '11px', fontWeight: 'bold', borderRadius: '14px', backgroundColor: '#0A7A2F', color: '#FFFFFF' }}
        >
          Export (CSV)
        </button>
      </div>
    </div>
  );
};

export default StockValueReport;