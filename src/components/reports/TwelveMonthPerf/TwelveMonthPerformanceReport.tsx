import React, { useState, useEffect } from 'react';

const TwelveMonthPerformanceReport = () => {
  const [showChart, setShowChart] = useState(false);
  const [orientation, setOrientation] = useState('landscape'); // Default to landscape

  const handleShowOnScreen = () => {
    // Open financial report in a new window
    const newWindow = window.open(
      '', 
      '_blank', 
      'width=1280,height=720,scrollbars=yes,resizable=yes'
    );
    
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Financial Report - Results per month</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: Arial, Helvetica, sans-serif; 
              font-size: 12px; 
              color: #000000; 
              background-color: #FFFFFF; 
              line-height: 1.2;
              overflow: auto;
            }
            .header-area { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start; 
              padding: 12px; 
            }
            .left-header { text-align: left; }
            .center-title { 
              position: absolute; 
              left: 50%; 
              transform: translateX(-50%); 
              top: 16px; 
              font-size: 26px; 
              font-weight: bold; 
            }
            .right-header { text-align: right; }
            .bold { font-weight: bold; }
            .uppercase { text-transform: uppercase; }
            .text-13 { font-size: 13px; }
            .text-12 { font-size: 12px; }
            .text-11 { font-size: 11px; }
            .text-26 { font-size: 26px; }
            .mt-4 { margin-top: 4px; }
            .pt-14 { padding-top: 14px; }
            .pb-6 { padding-bottom: 6px; }
            .pt-6 { padding-top: 6px; }
            .pb-4 { padding-bottom: 4px; }
            .pl-16 { padding-left: 16px; }
            .pl-32 { padding-left: 32px; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .text-left { text-align: left; }
            .table-container { padding: 0 12px 12px 12px; }
            table { 
              width: 100%; 
              table-layout: fixed; 
              border-collapse: collapse; 
            }
            th { 
              font-weight: bold; 
              padding-bottom: 6px; 
              text-align: left; 
            }
            td { 
              vertical-align: top; 
            }
            .account-link { 
              color: #0000EE; 
              text-decoration: underline; 
            }
            .total-row { font-weight: bold; }
            .section-header { 
              font-size: 13px; 
              font-weight: bold; 
              text-transform: uppercase; 
              padding: 14px 0 6px 0; 
            }
            .subsection-header { 
              font-size: 12px; 
              padding: 6px 0 4px 16px; 
            }
            .account-row { padding-left: 32px; }
          </style>
        </head>
        <body>
          <!-- Header Area -->
          <div class="header-area">
            <!-- Left Header Block -->
            <div class="left-header">
              <div class="bold text-13">Test company</div>
              <div class="text-12">Financial Year 2026-01-01 - 2026-12-31</div>
              <div class="text-12">Period 2026-01-01 - 2026-12-31</div>
              <div class="text-12 mt-4">Amounts are expressed in thousands of kronor.</div>
            </div>

            <!-- Center Title -->
            <div class="center-title">
              Results per month
            </div>

            <!-- Right Header Block -->
            <div class="right-header">
              <div class="text-11">Printed 2026-01-18 09:21</div>
              <div class="text-11">Latest version A 6 B 3 F 3 M 1</div>
            </div>
          </div>

          <!-- Table Structure -->
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th style="width: 320px;">Account / Description</th>
                  <th class="text-center" style="width: 70px;">2601</th>
                  <th class="text-center" style="width: 70px;">2602</th>
                  <th class="text-center" style="width: 70px;">2603</th>
                  <th class="text-center" style="width: 70px;">2604</th>
                  <th class="text-center" style="width: 70px;">2605</th>
                  <th class="text-center" style="width: 70px;">2606</th>
                  <th class="text-center" style="width: 70px;">2607</th>
                  <th class="text-center" style="width: 70px;">2608</th>
                  <th class="text-center" style="width: 70px;">2609</th>
                  <th class="text-center" style="width: 70px;">2610</th>
                  <th class="text-center" style="width: 70px;">2611</th>
                  <th class="text-center" style="width: 70px;">2612</th>
                  <th class="text-center" style="width: 70px;">Ack</th>
                </tr>
              </thead>
              <tbody>
                <!-- OPERATING INCOME -->
                <tr>
                  <td colspan="14">
                    <div class="section-header">OPERATING INCOME</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="account-row">
                      <a href="#" class="account-link">3000 Sales revenue</a>
                    </div>
                  </td>
                  <td class="text-right">150,5</td>
                  <td class="text-right">145,2</td>
                  <td class="text-right">158,7</td>
                  <td class="text-right">162,3</td>
                  <td class="text-right">149,8</td>
                  <td class="text-right">155,1</td>
                  <td class="text-right">160,4</td>
                  <td class="text-right">157,9</td>
                  <td class="text-right">163,2</td>
                  <td class="text-right">159,6</td>
                  <td class="text-right">165,3</td>
                  <td class="text-right">161,7</td>
                  <td class="text-right total-row">1&nbsp;875,4</td>
                </tr>
                <tr>
                  <td>
                    <div class="account-row">
                      <a href="#" class="account-link">3100 Service income</a>
                    </div>
                  </td>
                  <td class="text-right">25,3</td>
                  <td class="text-right">28,7</td>
                  <td class="text-right">22,1</td>
                  <td class="text-right">30,5</td>
                  <td class="text-right">27,9</td>
                  <td class="text-right">24,6</td>
                  <td class="text-right">29,8</td>
                  <td class="text-right">26,4</td>
                  <td class="text-right">31,2</td>
                  <td class="text-right">28,7</td>
                  <td class="text-right">32,5</td>
                  <td class="text-right">29,1</td>
                  <td class="text-right total-row">336,8</td>
                </tr>
                <tr>
                  <td>
                    <div class="total-row">Total operating income</div>
                  </td>
                  <td class="text-right total-row">175,8</td>
                  <td class="text-right total-row">173,9</td>
                  <td class="text-right total-row">180,8</td>
                  <td class="text-right total-row">192,8</td>
                  <td class="text-right total-row">177,7</td>
                  <td class="text-right total-row">179,7</td>
                  <td class="text-right total-row">190,2</td>
                  <td class="text-right total-row">184,3</td>
                  <td class="text-right total-row">194,4</td>
                  <td class="text-right total-row">188,3</td>
                  <td class="text-right total-row">197,8</td>
                  <td class="text-right total-row">190,8</td>
                  <td class="text-right total-row">2&nbsp;212,2</td>
                </tr>
                
                <!-- COSTS OF OPERATION -->
                <tr>
                  <td colspan="14">
                    <div class="section-header">COSTS OF OPERATION</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="14">
                    <div class="subsection-header">Other external costs</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="account-row">
                      <a href="#" class="account-link">5410 Consumables</a>
                    </div>
                  </td>
                  <td class="text-right">12,4</td>
                  <td class="text-right">11,8</td>
                  <td class="text-right">13,2</td>
                  <td class="text-right">14,1</td>
                  <td class="text-right">12,7</td>
                  <td class="text-right">13,5</td>
                  <td class="text-right">14,3</td>
                  <td class="text-right">13,8</td>
                  <td class="text-right">14,6</td>
                  <td class="text-right">14,2</td>
                  <td class="text-right">15,1</td>
                  <td class="text-right">13,9</td>
                  <td class="text-right total-row">163,6</td>
                </tr>
                <tr>
                  <td>
                    <div class="account-row">
                      <a href="#" class="account-link">6110 Office supplies</a>
                    </div>
                  </td>
                  <td class="text-right">8,2</td>
                  <td class="text-right">7,9</td>
                  <td class="text-right">8,5</td>
                  <td class="text-right">9,1</td>
                  <td class="text-right">8,3</td>
                  <td class="text-right">8,7</td>
                  <td class="text-right">9,2</td>
                  <td class="text-right">8,9</td>
                  <td class="text-right">9,4</td>
                  <td class="text-right">9,1</td>
                  <td class="text-right">9,7</td>
                  <td class="text-right">9,0</td>
                  <td class="text-right total-row">107,1</td>
                </tr>
                <tr>
                  <td>
                    <div class="total-row">Total other external costs</div>
                  </td>
                  <td class="text-right total-row">20,6</td>
                  <td class="text-right total-row">19,7</td>
                  <td class="text-right total-row">21,7</td>
                  <td class="text-right total-row">23,2</td>
                  <td class="text-right total-row">21,0</td>
                  <td class="text-right total-row">22,2</td>
                  <td class="text-right total-row">23,5</td>
                  <td class="text-right total-row">22,7</td>
                  <td class="text-right total-row">24,0</td>
                  <td class="text-right total-row">23,3</td>
                  <td class="text-right total-row">24,8</td>
                  <td class="text-right total-row">22,9</td>
                  <td class="text-right total-row">270,7</td>
                </tr>
                
                <!-- TOTAL OPERATING COSTS -->
                <tr>
                  <td>
                    <div class="section-header">TOTAL OPERATING COSTS</div>
                  </td>
                  <td class="text-right total-row">20,6</td>
                  <td class="text-right total-row">19,7</td>
                  <td class="text-right total-row">21,7</td>
                  <td class="text-right total-row">23,2</td>
                  <td class="text-right total-row">21,0</td>
                  <td class="text-right total-row">22,2</td>
                  <td class="text-right total-row">23,5</td>
                  <td class="text-right total-row">22,7</td>
                  <td class="text-right total-row">24,0</td>
                  <td class="text-right total-row">23,3</td>
                  <td class="text-right total-row">24,8</td>
                  <td class="text-right total-row">22,9</td>
                  <td class="text-right total-row">270,7</td>
                </tr>
                
                <!-- CALCULATED RESULT -->
                <tr>
                  <td>
                    <div class="section-header">CALCULATED RESULT</div>
                  </td>
                  <td class="text-right total-row">155,2</td>
                  <td class="text-right total-row">154,2</td>
                  <td class="text-right total-row">159,1</td>
                  <td class="text-right total-row">169,6</td>
                  <td class="text-right total-row">156,7</td>
                  <td class="text-right total-row">157,5</td>
                  <td class="text-right total-row">166,7</td>
                  <td class="text-right total-row">161,6</td>
                  <td class="text-right total-row">170,4</td>
                  <td class="text-right total-row">165,0</td>
                  <td class="text-right total-row">173,0</td>
                  <td class="text-right total-row">167,9</td>
                  <td class="text-right total-row">1&nbsp;941,5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </body>
        </html>
      `);
      
      newWindow.focus();
    }
  };

  const handleShowPDF = () => {
    // Generate PDF view
    console.log('Generating PDF with chart:', showChart, 'orientation:', orientation);
  };

  const handleShowTXT = () => {
    // Generate plain text
    console.log('Generating TXT with chart:', showChart, 'orientation:', orientation);
  };

  const handleCancel = () => {
    // Close the window
    window.close();
  };

  // Prevent the window from being closed if it's the main window
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // This will prompt user before closing
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div 
      className="w-[420px] h-[260px] bg-white overflow-hidden"
      style={{ 
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '12px',
        color: '#000000'
      }}
    >
      {/* Top Section - "Show Chart" Checkbox */}
      <div className="flex items-center mt-[12px] ml-[12px]">
        <input
          type="checkbox"
          id="showChart"
          checked={showChart}
          onChange={(e) => setShowChart(e.target.checked)}
          className="w-[12px] h-[12px] border border-[#000000] bg-white"
        />
        <label htmlFor="showChart" className="ml-[6px] text-[12px] text-[#000000]">
          Show Chart
        </label>
      </div>

      {/* Divider Section - Orientation Group */}
      <div className="ml-[12px] mt-[10px]">
        <div className="text-[12px] text-[#000000] mb-[6px]">Orientation</div>
        <div className="w-[380px] h-[36px] border border-[#000000] rounded-none p-[6px_10px]">
          <div className="flex items-center h-full">
            <div className="flex items-center mr-[20px]">
              <input
                type="radio"
                id="portrait"
                name="orientation"
                checked={orientation === 'portrait'}
                onChange={() => setOrientation('portrait')}
                className="w-[12px] h-[12px] border border-[#000000] bg-white appearance-none checked:after:content-[''] checked:after:block checked:after:w-[6px] checked:after:h-[6px] checked:after:bg-[#0078D7] checked:after:rounded-full"
              />
              <label htmlFor="portrait" className="ml-[6px] text-[12px] text-[#000000]">
                Portrait
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="landscape"
                name="orientation"
                checked={orientation === 'landscape'}
                onChange={() => setOrientation('landscape')}
                className="w-[12px] h-[12px] border border-[#000000] bg-white appearance-none checked:after:content-[''] checked:after:block checked:after:w-[6px] checked:after:h-[6px] checked:after:bg-[#0078D7] checked:after:rounded-full"
              />
              <label htmlFor="landscape" className="ml-[6px] text-[12px] text-[#000000]">
                Landscape
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Information Icon */}
      <div className="flex justify-center mt-[6px]">
        <div className="w-[14px] h-[14px] rounded-full bg-[#E6F0FA] border border-[#7AA7D9] flex items-center justify-center">
          <span className="text-[10px] text-[#2B6CB0] font-bold">i</span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="ml-[12px] mt-[8px]">
        <div className="flex">
          <button
            onClick={handleShowOnScreen}
            className="w-[90px] h-[24px] bg-[#DFF0D8] border border-[#6AA84F] rounded-[2px] text-[12px] text-[#000000] hover:bg-[#CDE8C6] cursor-pointer mr-[6px]"
          >
            Show on screen
          </button>
          <button
            onClick={handleShowPDF}
            className="w-[90px] h-[24px] bg-[#DFF0D8] border border-[#6AA84F] rounded-[2px] text-[12px] text-[#000000] hover:bg-[#CDE8C6] cursor-pointer mr-[6px]"
          >
            Show PDF
          </button>
          <button
            onClick={handleShowTXT}
            className="w-[90px] h-[24px] bg-[#DFF0D8] border border-[#6AA84F] rounded-[2px] text-[12px] text-[#000000] hover:bg-[#CDE8C6] cursor-pointer mr-[6px]"
          >
            Show TXT
          </button>
          <button
            onClick={handleCancel}
            className="w-[90px] h-[24px] bg-[#DFF0D8] border border-[#6AA84F] rounded-[2px] text-[12px] text-[#000000] hover:bg-[#CDE8C6] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwelveMonthPerformanceReport;