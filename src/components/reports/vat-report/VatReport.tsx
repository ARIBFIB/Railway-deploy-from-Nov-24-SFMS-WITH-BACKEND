import React, { useState } from 'react';

const VatReport = () => {
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2026-06-30');
  const [orientation, setOrientation] = useState('portrait'); // 'portrait' or 'landscape'

  const handleSubmit = (action: string) => {
    if (action === 'show-on-screen') {
      // Create report window with the actual VAT report
      const reportWindow = window.open('', '_blank', 'width=1200,height=800');
      if (reportWindow) {
        reportWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>VAT Report</title>
            <style>
              body { 
                margin: 0; 
                padding: 8px; 
                font-family: Segoe UI, Arial, sans-serif; 
                font-size: 11px; 
                color: #000000; 
                background-color: #FFFFFF; 
                line-height: 14px;
                width: 1024px;
                max-width: 1024px;
                overflow: auto;
              }
              .header-area { 
                display: flex; 
                justify-content: space-between; 
                align-items: flex-start; 
                padding: 0 12px 0 12px; 
              }
              .left-header { 
                text-align: left; 
                margin-bottom: 6px;
              }
              .center-title { 
                position: absolute; 
                left: 50%; 
                transform: translateX(-50%); 
                top: 40px; 
                font-size: 18px; 
                font-weight: bold; 
                margin-bottom: 8px;
              }
              .right-header { 
                text-align: right; 
                color: #555555; 
                font-size: 10px;
              }
              .bold { font-weight: bold; }
              .text-11 { font-size: 11px; }
              .text-10 { font-size: 10px; }
              .text-12 { font-size: 12px; }
              .text-18 { font-size: 18px; }
              .mt-6 { margin-top: 6px; }
              .mb-6 { margin-bottom: 6px; }
              .mb-8 { margin-bottom: 8px; }
              .pb-4 { padding-bottom: 4px; }
              .pt-2 { padding-top: 2px; }
              .px-4 { padding-left: 4px; padding-right: 4px; }
              .py-2 { padding-top: 2px; padding-bottom: 2px; }
              .text-center { text-align: center; }
              .text-right { text-align: right; }
              .text-left { text-align: left; }
              .divider { 
                height: 1px; 
                background-color: #CFCFCF; 
                margin: 6px 0 6px 0;
              }
              .section-header { 
                font-size: 12px; 
                font-weight: bold; 
                padding-bottom: 4px;
              }
              .table-container { padding: 0 12px 12px 12px; }
              table { 
                width: 100%; 
                border-collapse: collapse; 
              }
              th { 
                background-color: #F2F2F2;
                font-weight: bold; 
                padding: 2px 4px; 
                text-align: left; 
                border-bottom: 1px solid #CFCFCF;
                font-size: 11px;
                color: #333333;
              }
              td { 
                vertical-align: top; 
                padding: 2px 4px;
                border-bottom: 1px solid #E5E5E5;
                height: 18px;
              }
              .row-data {
                font-size: 11px;
              }
              .numeric-right { 
                text-align: right; 
              }
              .control-label { 
                font-size: 11px; 
                font-weight: bold; 
                margin-top: 6px;
              }
              .formula-text { 
                font-size: 10px; 
                color: #666666; 
              }
              .footer-help { 
                padding: 12px; 
                font-size: 10px; 
                color: #0066CC;
              }
              .help-link { 
                color: #0066CC; 
                cursor: pointer;
              }
              .help-link:hover { 
                color: #004999; 
              }
              .action-link { 
                display: inline-flex; 
                align-items: center; 
                color: #0066CC; 
                font-size: 10px;
              }
              .arrow-icon { 
                font-size: 8px; 
                margin-left: 4px; 
                color: #0066CC;
              }
              .info-icon { 
                width: 10px; 
                height: 10px; 
                color: #666666; 
                margin-left: 4px;
              }
            </style>
          </head>
          <body>
            <!-- Header Area -->
            <div class="header-area">
              <!-- Left Header Block -->
              <div class="left-header">
                <div class="bold text-12">Test company</div>
                <div class="text-11">Financial Year 2026-01-01 – 2026-12-31</div>
                <div class="text-11">Period ${startDate} – ${endDate}</div>
              </div>

              <!-- Center Title -->
              <div class="center-title">
                VAT report
              </div>

              <!-- Right Header Block -->
              <div class="right-header">
                <div class="text-10">Printed ${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div class="text-10">Latest version A 6 B 3 F 3 M 1</div>
              </div>
            </div>

            <!-- Divider -->
            <div class="divider"></div>

            <!-- Section A -->
            <div class="section-header">A. Sales subject to VAT or withdrawals excluding VAT</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">3001</td>
                    <td class="row-data">Sales within Sweden, 25% VAT</td>
                    <td class="row-data numeric-right">125 000,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">3002</td>
                    <td class="row-data">Sales within Sweden, 12% VAT</td>
                    <td class="row-data numeric-right">45 500,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">3003</td>
                    <td class="row-data">Sales within Sweden, 6% VAT</td>
                    <td class="row-data numeric-right">12 300,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">3004</td>
                    <td class="row-data">Exports outside EU, VAT 0%</td>
                    <td class="row-data numeric-right">8 900,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section B -->
            <div class="section-header">B. Sales subject to VAT or withdrawals including VAT</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">3010</td>
                    <td class="row-data">Sales within Sweden, 25% VAT included</td>
                    <td class="row-data numeric-right">156 250,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">3011</td>
                    <td class="row-data">Sales within Sweden, 12% VAT included</td>
                    <td class="row-data numeric-right">50 960,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section C -->
            <div class="section-header">C. Other taxable transactions</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">3020</td>
                    <td class="row-data">Services within EU</td>
                    <td class="row-data numeric-right">23 400,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">3021</td>
                    <td class="row-data">Acquisition of services from EU</td>
                    <td class="row-data numeric-right">15 600,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section D -->
            <div class="section-header">D. Purchases with input tax deduction</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">4001</td>
                    <td class="row-data">Purchase within Sweden, 25% VAT</td>
                    <td class="row-data numeric-right">67 800,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">4002</td>
                    <td class="row-data">Purchase within Sweden, 12% VAT</td>
                    <td class="row-data numeric-right">23 400,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">4003</td>
                    <td class="row-data">Purchase within Sweden, 6% VAT</td>
                    <td class="row-data numeric-right">8 900,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section E -->
            <div class="section-header">E. Purchases with partial input tax deduction</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">4010</td>
                    <td class="row-data">Car expenses, 50% deduction</td>
                    <td class="row-data numeric-right">12 500,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">4011</td>
                    <td class="row-data">Entertainment, 0% deduction</td>
                    <td class="row-data numeric-right">3 200,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section F -->
            <div class="section-header">F. Purchases without input tax deduction</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">4020</td>
                    <td class="row-data">Private use of company car</td>
                    <td class="row-data numeric-right">2 800,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">4021</td>
                    <td class="row-data">Gifts to customers</td>
                    <td class="row-data numeric-right">1 500,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section G -->
            <div class="section-header">G. Imports with VAT paid to customs</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">4030</td>
                    <td class="row-data">Import from outside EU</td>
                    <td class="row-data numeric-right">34 500,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section H -->
            <div class="section-header">H. VAT to be paid/deducted</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">2611</td>
                    <td class="row-data">Output VAT 25%</td>
                    <td class="row-data numeric-right">31 250,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">2612</td>
                    <td class="row-data">Output VAT 12%</td>
                    <td class="row-data numeric-right">5 460,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">2613</td>
                    <td class="row-data">Output VAT 6%</td>
                    <td class="row-data numeric-right">738,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">2641</td>
                    <td class="row-data">Input VAT 25%</td>
                    <td class="row-data numeric-right">-16 950,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">2642</td>
                    <td class="row-data">Input VAT 12%</td>
                    <td class="row-data numeric-right">-2 925,00</td>
                  </tr>
                  <tr>
                    <td class="row-data">2643</td>
                    <td class="row-data">Input VAT 6%</td>
                    <td class="row-data numeric-right">-534,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Section I -->
            <div class="section-header">I. VAT for the period</div>
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th style="width: 40px;">Code</th>
                    <th style="width: auto;">Description</th>
                    <th class="text-right" style="width: 80px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="row-data">2640</td>
                    <td class="row-data">VAT to be paid</td>
                    <td class="row-data numeric-right">14 989,00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Control Sections -->
            <div class="control-label">Control calculations:</div>
            <div class="formula-text">A (Sales excl. VAT) + B (Sales incl. VAT) = Sales base for VAT calculation</div>
            <div class="formula-text">D (Input tax purchases) + E (Partial input tax) = Total input tax base</div>
            <div class="formula-text">H (VAT to pay/deduct) = Output VAT - Input VAT</div>
            <div class="formula-text">I (VAT for period) = Net VAT liability for the reporting period</div>

            <!-- Footer Help -->
            <div class="footer-help">
              <div class="help-link">What do I do if the VAT report is incorrect?</div>
              <div class="action-link">
                Run VAT discrepancy report <span class="arrow-icon">▶</span>
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
    <div className="bg-white p-3" style={{ width: '720px', minHeight: '260px', padding: '12px', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px', color: '#000000' }}>
      {/* SECTION 1: INTERVAL */}
      <div className="border border-gray-500 p-2 mb-2.5" style={{ border: '1px solid #9E9E9E', padding: '8px', marginBottom: '10px' }}>
        <div className="font-bold text-xs mb-1.5" style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>Interval</div>
        <div className="flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="text-xs min-w-10" style={{ fontSize: '11px', minWidth: '40px' }}>Date</span>
          <div className="relative">
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-30 h-5.5 border border-gray-500 rounded px-1.5 text-xs"
              style={{ width: '120px', height: '22px', padding: '2px 6px', fontSize: '11px', borderColor: '#9E9E9E', borderRadius: '2px' }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-500 cursor-pointer flex items-center justify-center"
                 style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#6F6F6F', cursor: 'pointer' }}>
              📅
            </div>
          </div>
          <span className="text-xs px-1" style={{ fontSize: '11px', padding: '0 4px' }}>-</span>
          <div className="relative">
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-30 h-5.5 border border-gray-500 rounded px-1.5 text-xs"
              style={{ width: '120px', height: '22px', padding: '2px 6px', fontSize: '11px', borderColor: '#9E9E9E', borderRadius: '2px' }}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-500 cursor-pointer flex items-center justify-center"
                 style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', width: '14px', height: '14px', color: '#6F6F6F', cursor: 'pointer' }}>
              📅
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ORIENTATION */}
      <div className="border border-gray-500 p-2 mb-3" style={{ border: '1px solid #9E9E9E', padding: '8px', marginBottom: '12px' }}>
        <div className="font-bold text-xs mb-1.5" style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: '6px' }}>Orientation</div>
        <div className="flex gap-4" style={{ display: 'flex', gap: '16px' }}>
          <div className="flex items-center">
            <input
              type="radio"
              id="orientation-portrait"
              name="orientation"
              checked={orientation === 'portrait'}
              onChange={() => setOrientation('portrait')}
              className="w-3 h-3 border border-gray-500 mr-1.5"
              style={{ width: '12px', height: '12px', borderColor: orientation === 'portrait' ? '#2E9E38' : '#9E9E9E', backgroundColor: orientation === 'portrait' ? '#2E9E38' : 'transparent' }}
            />
            <label htmlFor="orientation-portrait" className="text-xs mr-1.5" style={{ fontSize: '11px', marginRight: '6px' }}>Portrait</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="orientation-landscape"
              name="orientation"
              checked={orientation === 'landscape'}
              onChange={() => setOrientation('landscape')}
              className="w-3 h-3 border border-gray-500 mr-1.5"
              style={{ width: '12px', height: '12px', borderColor: orientation === 'landscape' ? '#2E9E38' : '#9E9E9E', backgroundColor: orientation === 'landscape' ? '#2E9E38' : 'transparent' }}
            />
            <label htmlFor="orientation-landscape" className="text-xs mr-1.5" style={{ fontSize: '11px', marginRight: '6px' }}>Landscape</label>
          </div>
        </div>
      </div>

      {/* INFO MESSAGE */}
      <div className="flex items-center gap-2 mb-3.5" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <div className="w-4.5 h-4.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs"
             style={{ width: '18px', height: '18px', backgroundColor: '#2A78D2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '11px' }}>
          i
        </div>
        <span className="text-xs" style={{ fontSize: '11px', color: '#000000' }}>Check that the VAT codes in your accounts chart match</span>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2" style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => handleSubmit('show-on-screen')}
          className="h-6.5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer"
          style={{ height: '26px', padding: '0 12px', fontSize: '11px', fontWeight: 'normal', borderRadius: '2px', border: '1px solid #6E8F5A', backgroundColor: '#DFF0D0', color: '#000000', cursor: 'pointer' }}
        >
          Show on screen
        </button>
        <button
          onClick={() => handleSubmit('show-pdf')}
          className="h-6.5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer"
          style={{ height: '26px', padding: '0 12px', fontSize: '11px', fontWeight: 'normal', borderRadius: '2px', border: '1px solid #6E8F5A', backgroundColor: '#DFF0D0', color: '#000000', cursor: 'pointer' }}
        >
          Show PDF
        </button>
        <button
          onClick={() => handleSubmit('show-txt')}
          className="h-6.5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer"
          style={{ height: '26px', padding: '0 12px', fontSize: '11px', fontWeight: 'normal', borderRadius: '2px', border: '1px solid #6E8F5A', backgroundColor: '#DFF0D0', color: '#000000', cursor: 'pointer' }}
        >
          Show TXT
        </button>
        <button
          onClick={() => window.close()}
          className="h-6.5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer"
          style={{ height: '26px', padding: '0 12px', fontSize: '11px', fontWeight: 'normal', borderRadius: '2px', border: '1px solid #6E8F5A', backgroundColor: '#DFF0D0', color: '#000000', cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VatReport;