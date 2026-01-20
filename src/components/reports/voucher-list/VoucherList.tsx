import React, { useState } from 'react';

const VoucherList = () => {
  const [seriesOption, setSeriesOption] = useState('all'); // 'all' or 'one'
  const [seriesValue, setSeriesValue] = useState('A - Accounting');
  const [pageBreak, setPageBreak] = useState(false);
  const [intervalOption, setIntervalOption] = useState('all'); // 'all', 'date', 'voucher-no'
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [startVoucher, setStartVoucher] = useState('');
  const [endVoucher, setEndVoucher] = useState('');
  const [orderBy, setOrderBy] = useState('voucher-no'); // 'voucher-no', 'registration-date', 'date'
  const [showCrossedOut, setShowCrossedOut] = useState(false);
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' or 'landscape'

  const handleSubmit = (action: string) => {
    if (action === 'show-on-screen') {
      // Create report window with the actual voucher list report
      const reportWindow = window.open('', '_blank', 'width=1200,height=800');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Voucher List</title>
            <style>
              body { 
                margin: 20mm; 
                font-family: Arial, sans-serif; 
                font-size: 10px; 
                color: #000000; 
                background-color: #FFFFFF; 
                line-height: 14px;
                width: 100%;
                overflow: auto;
              }
              .header-area { 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                margin-bottom: 10px;
              }
              .header-left { 
                font-size: 10px; 
                font-weight: bold; 
                margin-bottom: 5px;
              }
              .header-center { 
                font-size: 18px; 
                font-weight: bold; 
                text-align: center; 
                margin: 10px 0;
              }
              .header-right { 
                font-size: 9px; 
                text-align: right;
              }
              .sub-header { 
                text-align: center; 
                font-size: 11px; 
                margin-bottom: 12px;
              }
              .filters-box { 
                border: 2px solid #000000; 
                padding: 8px; 
                margin-bottom: 10px;
              }
              .filters-title { 
                font-weight: bold; 
                font-size: 10px; 
                border-bottom: 1px solid #000000; 
                padding-bottom: 4px; 
                margin-bottom: 6px;
              }
              .filters-content { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 8px;
              }
              .filter-item { 
                font-size: 9px; 
                line-height: 14px;
              }
              .table-container { 
                width: 100%; 
                overflow-x: auto; 
                margin-bottom: 10px;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                font-size: 10px;
              }
              th { 
                border: 2px solid #000000; 
                padding: 6px; 
                font-weight: bold; 
                font-size: 10px;
              }
              td { 
                border: 1px solid #000000; 
                padding: 4px; 
                font-size: 10px;
              }
              .total-row { 
                background-color: #D0D0D0; 
                font-weight: bold;
              }
              .footer { 
                display: flex; 
                justify-content: space-between; 
                font-size: 10px;
              }
            </style>
          </head>
          <body>
            <div class="header-area">
              <div class="header-left">Test company</div>
              <div class="header-center">Voucher list</div>
              <div class="header-right">
                Page 1 (1)<br>
                Printed: 2026-01-20 06:31<br>
                Printed by: test test<br>
                Period: 2026-01-01 - 2026-12-31
              </div>
            </div>
            
            <div class="sub-header">2026-01-01 - 2026-12-31</div>
            
            <div class="filters-box">
              <div class="filters-title">Filters and options</div>
              <div class="filters-content">
                <div>
                  <div class="filter-item">Series → ${seriesOption === 'all' ? 'All' : seriesValue}</div>
                  <div class="filter-item">Interval → ${intervalOption}</div>
                  <div class="filter-item">Order by → ${orderBy.replace('-', ' ')}</div>
                </div>
                <div>
                  <div class="filter-item">Page break after each series: ${pageBreak ? 'Yes' : 'No'}</div>
                  <div class="filter-item">Show crossed out lines: ${showCrossedOut ? 'Yes' : 'No'}</div>
                  <div class="filter-item">Orientation: ${orientation}</div>
                </div>
              </div>
            </div>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>SERIE</th>
                    <th>VOUCHER NO.</th>
                    <th>DATE</th>
                    <th>REGISTRATION DATE</th>
                    <th>TEXT</th>
                    <th>ACCOUNT</th>
                    <th>AMOUNT</th>
                    <th>CURRENCY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>0.00</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="footer">
              <div>Total: 0.00</div>
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
    } else if (action === 'export-excel') {
      alert('Excel export would happen here');
    }
  };

  return (
    <div 
      style={{
        width: '760px',
        minHeight: '420px',
        padding: '12px',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '11px',
        color: '#000000',
      }}
    >
      {/* Series Selection */}
      <div style={{ marginBottom: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* All Series Row */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="all-series"
              name="series-option"
              checked={seriesOption === 'all'}
              onChange={() => setSeriesOption('all')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="all-series" style={{ fontSize: '11px', marginRight: '16px' }}>All Series</label>
            
            <input
              type="checkbox"
              id="page-break"
              checked={pageBreak}
              onChange={(e) => setPageBreak(e.target.checked)}
              style={{ width: '12px', height: '12px' }}
            />
            <label htmlFor="page-break" style={{ fontSize: '11px', marginLeft: '6px' }}>Page break after each series</label>
          </div>
          
          {/* One Series Row */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="one-series"
              name="series-option"
              checked={seriesOption === 'one'}
              onChange={() => setSeriesOption('one')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="one-series" style={{ fontSize: '11px', marginRight: '6px' }}>One Series</label>
            
            <select
              value={seriesValue}
              onChange={(e) => setSeriesValue(e.target.value)}
              disabled={seriesOption !== 'one'}
              style={{
                width: '220px',
                height: '22px',
                border: '1px solid #9E9E9E',
                borderRadius: '2px',
                fontSize: '11px',
                backgroundColor: seriesOption === 'one' ? '#FFFFFF' : '#F2F2F2',
                color: seriesOption === 'one' ? '#000000' : '#7A7A7A',
                cursor: seriesOption === 'one' ? 'pointer' : 'not-allowed'
              }}
            >
              <option>A - Accounting</option>
              <option>B - Sales</option>
              <option>C - Purchases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interval */}
      <div style={{ border: '1px solid #9E9E9E', padding: '8px', marginTop: '8px', marginBottom: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>Interval</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* All option */}
          <div>
            <input
              type="radio"
              id="interval-all"
              name="interval-option"
              checked={intervalOption === 'all'}
              onChange={() => setIntervalOption('all')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="interval-all" style={{ fontSize: '11px' }}>All</label>
          </div>
          
          {/* Date option */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="interval-date"
              name="interval-option"
              checked={intervalOption === 'date'}
              onChange={() => setIntervalOption('date')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="interval-date" style={{ fontSize: '11px', marginRight: '6px' }}>Date</label>
            
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={intervalOption !== 'date'}
              style={{
                width: '120px',
                height: '22px',
                padding: '2px 6px',
                border: '1px solid #9E9E9E',
                borderRadius: '2px',
                fontSize: '11px',
                backgroundColor: intervalOption === 'date' ? '#FFFFFF' : '#F2F2F2',
                color: intervalOption === 'date' ? '#000000' : '#7A7A7A',
                cursor: intervalOption === 'date' ? 'text' : 'not-allowed'
              }}
            />
            <span style={{ padding: '0 4px', fontSize: '11px' }}>-</span>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={intervalOption !== 'date'}
              style={{
                width: '120px',
                height: '22px',
                padding: '2px 6px',
                border: '1px solid #9E9E9E',
                borderRadius: '2px',
                fontSize: '11px',
                backgroundColor: intervalOption === 'date' ? '#FFFFFF' : '#F2F2F2',
                color: intervalOption === 'date' ? '#000000' : '#7A7A7A',
                cursor: intervalOption === 'date' ? 'text' : 'not-allowed'
              }}
            />
            <div style={{ width: '14px', height: '14px', backgroundColor: '#6F6F6F', marginLeft: '4px', cursor: intervalOption === 'date' ? 'pointer' : 'not-allowed' }}></div>
          </div>
          
          {/* Voucher no option */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="interval-voucher"
              name="interval-option"
              checked={intervalOption === 'voucher-no'}
              onChange={() => setIntervalOption('voucher-no')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="interval-voucher" style={{ fontSize: '11px', marginRight: '6px' }}>Voucher no.</label>
            
            <input
              type="text"
              value={startVoucher}
              onChange={(e) => setStartVoucher(e.target.value)}
              disabled={intervalOption !== 'voucher-no'}
              placeholder="Start"
              style={{
                width: '100px',
                height: '22px',
                padding: '2px 6px',
                border: '1px solid #9E9E9E',
                borderRadius: '2px',
                fontSize: '11px',
                backgroundColor: intervalOption === 'voucher-no' ? '#FFFFFF' : '#F2F2F2',
                color: intervalOption === 'voucher-no' ? '#000000' : '#7A7A7A',
                cursor: intervalOption === 'voucher-no' ? 'text' : 'not-allowed'
              }}
            />
            <span style={{ padding: '0 4px', fontSize: '11px' }}>-</span>
            <input
              type="text"
              value={endVoucher}
              onChange={(e) => setEndVoucher(e.target.value)}
              disabled={intervalOption !== 'voucher-no'}
              placeholder="End"
              style={{
                width: '100px',
                height: '22px',
                padding: '2px 6px',
                border: '1px solid #9E9E9E',
                borderRadius: '2px',
                fontSize: '11px',
                backgroundColor: intervalOption === 'voucher-no' ? '#FFFFFF' : '#F2F2F2',
                color: intervalOption === 'voucher-no' ? '#000000' : '#7A7A7A',
                cursor: intervalOption === 'voucher-no' ? 'text' : 'not-allowed'
              }}
            />
          </div>
        </div>
      </div>

      {/* Order By */}
      <div style={{ border: '1px solid #9E9E9E', padding: '8px', marginBottom: '10px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>Order by</div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="order-voucher"
              name="order-by"
              checked={orderBy === 'voucher-no'}
              onChange={() => setOrderBy('voucher-no')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="order-voucher" style={{ fontSize: '11px' }}>Voucher no.</label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="order-reg"
              name="order-by"
              checked={orderBy === 'registration-date'}
              onChange={() => setOrderBy('registration-date')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="order-reg" style={{ fontSize: '11px' }}>Registration date</label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="order-date"
              name="order-by"
              checked={orderBy === 'date'}
              onChange={() => setOrderBy('date')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="order-date" style={{ fontSize: '11px' }}>Date</label>
          </div>
        </div>
      </div>

      {/* Show Options */}
      <div style={{ border: '1px solid #9E9E9E', padding: '8px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <input
            type="checkbox"
            id="show-crossed-out"
            checked={showCrossedOut}
            onChange={(e) => setShowCrossedOut(e.target.checked)}
            style={{ width: '12px', height: '12px' }}
          />
          <label htmlFor="show-crossed-out" style={{ fontSize: '11px' }}>Show crossed out lines</label>
          <div 
            style={{ 
              width: '14px', 
              height: '14px', 
              borderRadius: '50%', 
              backgroundColor: '#2A78D2', 
              color: 'white', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              fontSize: '10px',
              cursor: 'help'
            }}
            title="Show crossed out lines"
          >
            i
          </div>
        </div>
      </div>

      {/* Orientation */}
      <div style={{ border: '1px solid #9E9E9E', padding: '8px', width: '220px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '6px' }}>Orientation</div>
        
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="orient-portrait"
              name="orientation"
              checked={orientation === 'portrait'}
              onChange={() => setOrientation('portrait')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="orient-portrait" style={{ fontSize: '11px' }}>Portrait</label>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="radio"
              id="orient-landscape"
              name="orientation"
              checked={orientation === 'landscape'}
              onChange={() => setOrientation('landscape')}
              style={{ width: '12px', height: '12px', marginRight: '6px' }}
            />
            <label htmlFor="orient-landscape" style={{ fontSize: '11px' }}>Landscape</label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleSubmit('show-on-screen')}
          style={{
            height: '26px',
            padding: '0 12px',
            fontSize: '11px',
            fontWeight: 'normal',
            borderRadius: '2px',
            border: '1px solid #6E8F5A',
            backgroundColor: '#DFF0D0',
            color: '#000000',
            cursor: 'pointer'
          }}
        >
          Show on screen
        </button>
        <button
          onClick={() => handleSubmit('show-pdf')}
          style={{
            height: '26px',
            padding: '0 12px',
            fontSize: '11px',
            fontWeight: 'normal',
            borderRadius: '2px',
            border: '1px solid #6E8F5A',
            backgroundColor: '#DFF0D0',
            color: '#000000',
            cursor: 'pointer'
          }}
        >
          Show PDF
        </button>
        <button
          onClick={() => handleSubmit('show-txt')}
          style={{
            height: '26px',
            padding: '0 12px',
            fontSize: '11px',
            fontWeight: 'normal',
            borderRadius: '2px',
            border: '1px solid #6E8F5A',
            backgroundColor: '#DFF0D0',
            color: '#000000',
            cursor: 'pointer'
          }}
        >
          Show TXT
        </button>
        <button
          onClick={() => handleSubmit('export-excel')}
          style={{
            height: '26px',
            padding: '0 12px',
            fontSize: '11px',
            fontWeight: 'normal',
            borderRadius: '2px',
            border: '1px solid #6E8F5A',
            backgroundColor: '#DFF0D0',
            color: '#000000',
            cursor: 'pointer'
          }}
        >
          Export Excel
        </button>
        <button
          onClick={() => window.close()}
          style={{
            height: '26px',
            padding: '0 12px',
            fontSize: '11px',
            fontWeight: 'normal',
            borderRadius: '2px',
            border: '1px solid #6E8F5A',
            backgroundColor: '#DFF0D0',
            color: '#000000',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VoucherList;