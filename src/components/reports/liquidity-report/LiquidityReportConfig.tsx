const openLiquidityReportConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=520,height=520,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Liquidity Report Configuration</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 12px; 
            color: #000000; 
            background-color: #FFFFFF; 
            overflow-x: hidden;
          }
          .container {
            margin: 20px;
            max-width: 480px;
          }
          .group-box {
            width: 480px;
            border: 1px solid #000000;
            padding: 10px;
            margin-bottom: 10px;
          }
          .text-12 {
            font-size: 12px;
          }
          .text-[#000000] {
            color: #000000;
          }
          .mb-6 {
            margin-bottom: 6px;
          }
          .mb-10 {
            margin-bottom: 10px;
          }
          .w-140 {
            width: 140px;
          }
          .w-120 {
            width: 120px;
          }
          .w-90 {
            width: 90px;
          }
          .w-110 {
            width: 110px;
          }
          .w-480 {
            width: 480px;
          }
          .h-20 {
            height: 20px;
          }
          .ml-6 {
            margin-left: 6px;
          }
          .flex {
            display: flex;
          }
          .items-center {
            align-items: center;
          }
          .items-end {
            align-items: flex-end;
          }
          .justify-between {
            justify-content: space-between;
          }
          .flex-col {
            flex-direction: column;
          }
          .opening-liquidity-input {
            width: 120px;
            height: 20px;
            text-align: right;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #000000;
          }
          .date-input {
            width: 90px;
            height: 20px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #000000;
          }
          .amount-input {
            width: 110px;
            height: 20px;
            text-align: right;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
            color: #000000;
          }
          .button-container {
            display: flex;
            gap: 10px;
            margin-top: 10px;
          }
          .action-button {
            width: 90px;
            height: 24px;
            background-color: #DFF0D8;
            border: 1px solid #6AA84F;
            border-radius: 2px;
            font-size: 12px;
            cursor: pointer;
          }
          .calendar-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-left: 5px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="1" ry="1" fill="none" stroke="%23000000" stroke-width="1"/><line x1="6" y1="0" x2="6" y2="4" stroke="%23000000" stroke-width="1"/><line x1="10" y1="0" x2="10" y2="4" stroke="%23000000" stroke-width="1"/></svg>');
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Type Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-6">Type</div>
            <div class="flex flex-col">
              <div class="flex items-center mb-6">
                <input type="radio" id="both" name="type" value="both" checked />
                <label for="both" class="ml-6 text-12 text-[#000000]">Accounts receivable and accounts payable</label>
              </div>
              <div class="flex items-center mb-6">
                <input type="radio" id="receivable" name="type" value="receivable" />
                <label for="receivable" class="ml-6 text-12 text-[#000000]">Only accounts receivable</label>
              </div>
              <div class="flex items-center mb-6">
                <input type="radio" id="payable" name="type" value="payable" />
                <label for="payable" class="ml-6 text-12 text-[#000000]">Only accounts payable</label>
              </div>
            </div>
          </div>
          
          <!-- Opening Liquidity Section -->
          <div class="flex items-center mb-10">
            <label class="w-140 text-12 text-[#000000]">Opening liquidity</label>
            <input type="text" id="opening-liquidity" class="opening-liquidity-input" placeholder="0.00" />
          </div>
          
          <!-- Two Dates Section -->
          <div class="text-12 text-[#000000] mb-6" style="font-weight: bold;">Two dates</div>
          
          <div class="flex justify-between mb-6">
            <div style="width: 120px; text-align: left;" class="text-12 text-[#000000]">Cutoff date</div>
            <div style="width: 130px; text-align: right;" class="text-12 text-[#000000]">Other payments out</div>
            <div style="width: 130px; text-align: right;" class="text-12 text-[#000000]">Other payments in</div>
          </div>
          
          <div class="mb-6">
            <div class="flex items-center mb-6">
              <label class="w-140 text-12 text-[#000000]" style="width: auto;">Cutoff date 1</label>
              <input type="date" id="cutoff-date-1" value="2026-01-19" class="date-input" />
              <span class="calendar-icon"></span>
              <input type="text" id="other-payments-out-1" class="amount-input ml-6" placeholder="0.00" />
              <input type="text" id="other-payments-in-1" class="amount-input ml-6" placeholder="0.00" />
            </div>
            <div class="flex items-center mb-6">
              <label class="w-140 text-12 text-[#000000]" style="width: auto;">Cutoff date 2</label>
              <input type="date" id="cutoff-date-2" value="2026-01-26" class="date-input" />
              <span class="calendar-icon"></span>
              <input type="text" id="other-payments-out-2" class="amount-input ml-6" placeholder="0.00" />
              <input type="text" id="other-payments-in-2" class="amount-input ml-6" placeholder="0.00" />
            </div>
            <div class="flex items-center mb-6">
              <label class="w-140 text-12 text-[#000000]" style="width: auto;">Cutoff date 3</label>
              <input type="date" id="cutoff-date-3" value="2026-02-02" class="date-input" />
              <span class="calendar-icon"></span>
              <input type="text" id="other-payments-out-3" class="amount-input ml-6" placeholder="0.00" />
              <input type="text" id="other-payments-in-3" class="amount-input ml-6" placeholder="0.00" />
            </div>
            <div class="flex items-center mb-6">
              <label class="w-140 text-12 text-[#000000]" style="width: auto;">Cutoff date 4</label>
              <input type="date" id="cutoff-date-4" value="2026-02-09" class="date-input" />
              <span class="calendar-icon"></span>
              <input type="text" id="other-payments-out-4" class="amount-input ml-6" placeholder="0.00" />
              <input type="text" id="other-payments-in-4" class="amount-input ml-6" placeholder="0.00" />
            </div>
            <div class="flex items-center mb-6">
              <label class="w-140 text-12 text-[#000000]" style="width: auto;">Cutoff date 5</label>
              <input type="date" id="cutoff-date-5" value="2026-02-16" class="date-input" />
              <span class="calendar-icon"></span>
              <input type="text" id="other-payments-out-5" class="amount-input ml-6" placeholder="0.00" />
              <input type="text" id="other-payments-in-5" class="amount-input ml-6" placeholder="0.00" />
            </div>
          </div>
          
          <!-- Order By Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-6">Order by</div>
            <div class="flex flex-col">
              <div class="flex items-center mb-6">
                <input type="radio" id="serial-no" name="order-by" value="serial-no" checked />
                <label for="serial-no" class="ml-6 text-12 text-[#000000]">Serial No</label>
              </div>
              <div class="flex items-center mb-6">
                <input type="radio" id="company-name" name="order-by" value="company-name" />
                <label for="company-name" class="ml-6 text-12 text-[#000000]">Company Name</label>
              </div>
              <div class="flex items-center mb-6">
                <input type="radio" id="cust-supplier-no" name="order-by" value="cust-supplier-no" />
                <label for="cust-supplier-no" class="ml-6 text-12 text-[#000000]">Cust No./Supplier No.</label>
              </div>
            </div>
          </div>
          
          <!-- Layout Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-6">Layout</div>
            <div class="flex flex-col">
              <div class="flex items-center mb-6">
                <input type="radio" id="standard" name="layout" value="standard" checked />
                <label for="standard" class="ml-6 text-12 text-[#000000]">Standard</label>
              </div>
              <div class="flex items-center mb-6">
                <input type="radio" id="customer-supplier" name="layout" value="customer-supplier" />
                <label for="customer-supplier" class="ml-6 text-12 text-[#000000]">Specified by customer/supplier</label>
              </div>
              <div class="flex items-center mb-6">
                <input type="radio" id="customer-invoice" name="layout" value="customer-invoice" />
                <label for="customer-invoice" class="ml-6 text-12 text-[#000000]">Specified by customer invoice/supplier invoice</label>
              </div>
            </div>
          </div>
          
          <!-- Orientation Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-6">Orientation</div>
            <div class="flex flex-col">
              <div class="flex items-center mb-6">
                <input type="radio" id="portrait" name="orientation" value="portrait" checked />
                <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
              </div>
              <div class="flex items-center mb-6">
                <input type="radio" id="landscape" name="orientation" value="landscape" />
                <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="button-container">
            <button id="show-on-screen" class="action-button">Show on screen</button>
            <button id="show-pdf" class="action-button">Show PDF</button>
            <button id="show-txt" class="action-button">Show TXT</button>
            <button id="cancel" class="action-button">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle cancel button
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Handle show on screen button
          document.getElementById('show-on-screen').onclick = function() {
            // Get form values
            const type = document.querySelector('input[name="type"]:checked').value;
            const openingLiquidity = document.getElementById('opening-liquidity').value || '0.00';
            
            // Get cutoff dates and payment values
            const cutoffDates = [];
            const otherPaymentsOut = [];
            const otherPaymentsIn = [];
            
            for (let i = 1; i <= 5; i++) {
              cutoffDates.push(document.getElementById(\`cutoff-date-\${i}\`).value);
              otherPaymentsOut.push(document.getElementById(\`other-payments-out-\${i}\`).value || '0.00');
              otherPaymentsIn.push(document.getElementById(\`other-payments-in-\${i}\`).value || '0.00');
            }
            
            const orderBy = document.querySelector('input[name="order-by"]:checked').value;
            const layout = document.querySelector('input[name="layout"]:checked').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').value;
            
            // Open the liquidity report in a new window
            const reportWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
            
            if (reportWindow) {
              // Format dates for the report header (YYYYMMDD format)
              const formattedDates = cutoffDates.map(date => {
                const d = new Date(date);
                return d.getFullYear().toString() + 
                       String(d.getMonth() + 1).padStart(2, '0') + 
                       String(d.getDate()).padStart(2, '0');
              });
              
              // Format amounts with comma decimal separator and space thousand separator
              function formatAmount(amount) {
                if (!amount) return '';
                let num = parseFloat(amount);
                if (isNaN(num)) return '';
                
                // Format with 2 decimal places, comma as decimal separator, space as thousand separator
                return num.toLocaleString('de-DE', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                }).replace(/\./g, ' ').replace(/,/g, ',');
              }
              
              // Calculate closing liquidity for each date column
              const openingLiqNum = parseFloat(openingLiquidity) || 0;
              const otherPayOutNums = otherPaymentsOut.map(val => parseFloat(val) || 0);
              const otherPayInNums = otherPaymentsIn.map(val => parseFloat(val) || 0);
              
              // For simplicity in this example, we'll use sample data for due accounts
              // In a real implementation, this would come from the backend
              const dueReceivable = [100.00, 150.00, 200.00, 0.00, 0.00]; // Sample data
              const duePayable = [50.00, 75.00, 100.00, 0.00, 0.00]; // Sample data
              
              // Calculate closing liquidity for each column
              const closingLiquidity = [];
              for (let i = 0; i < 5; i++) {
                const closing = openingLiqNum + (dueReceivable[i] || 0) + otherPayInNums[i] - (duePayable[i] || 0) - otherPayOutNums[i];
                closingLiquidity.push(closing);
              }
              
              reportWindow.document.write(\`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8" />
                  <title>Liquidity Report</title>
                  <style>
                    body { 
                      margin: 0; 
                      padding: 20px; 
                      font-family: Arial, Helvetica, sans-serif; 
                      font-size: 12px; 
                      color: #000000; 
                      background-color: #FFFFFF;
                    }
                    .header {
                      display: flex;
                      justify-content: space-between;
                      margin-bottom: 20px;
                    }
                    .top-left {
                      text-align: left;
                    }
                    .top-right {
                      text-align: right;
                    }
                    .company-name {
                      font-weight: bold;
                      font-size: 12px;
                    }
                    .financial-year {
                      font-size: 12px;
                    }
                    .report-title {
                      font-weight: bold;
                      font-size: 12px;
                      margin-bottom: 5px;
                    }
                    .printed-info {
                      font-size: 11px;
                    }
                    .version-info {
                      font-size: 11px;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                      margin-top: 20px;
                    }
                    th {
                      width: 110px;
                      text-align: right;
                      border-bottom: 1px solid #000000;
                      padding: 5px 5px 5px 5px;
                    }
                    td {
                      text-align: right;
                      padding: 5px 5px 5px 5px;
                    }
                    .row-label {
                      text-align: left !important;
                      font-weight: normal;
                    }
                    .empty-cell {
                      text-align: right;
                    }
                    .right-aligned {
                      text-align: right;
                    }
                    .no-background {
                      background-color: transparent;
                    }
                    .white-background {
                      background-color: #FFFFFF;
                    }
                    .no-zebra {
                      background-color: #FFFFFF;
                    }
                    .no-vertical-grid {
                      border-left: none;
                      border-right: none;
                    }
                    .header-underline {
                      border-bottom: 1px solid #000000;
                    }
                  </style>
                </head>
                <body>
                  <div class="header">
                    <div class="top-left">
                      <div class="company-name">Test Company</div>
                      <div class="financial-year">Financial Year 2026-01-01 - 2026-12-31</div>
                      <div class="report-title">Liquidity report</div>
                    </div>
                    <div class="top-right">
                      <div class="printed-info">Printed 2026-01-19 08:52</div>
                      <div class="version-info">Latest version A 6 B 3 F 3 M 1</div>
                    </div>
                  </div>
                  
                  <table>
                    <thead>
                      <tr>
                        <th class="row-label">\\&nbsp;</th>
                        \${formattedDates.map(date => \`<th class="header-underline">\${date}</th>\`).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="row-label">Opening liquidity</td>
                        \${Array(5).fill('').map(() => '<td class="empty-cell">&nbsp;</td>').join('')}
                      </tr>
                      <tr>
                        <td class="row-label">Due accounts receivable</td>
                        \${dueReceivable.map(amt => \`<td class="right-aligned">\${formatAmount(amt.toFixed(2))}</td>\`).join('')}
                      </tr>
                      <tr>
                        <td class="row-label">Other payments in</td>
                        \${otherPayInNums.map(amt => \`<td class="right-aligned">\${formatAmount(amt.toFixed(2))}</td>\`).join('')}
                      </tr>
                      <tr>
                        <td class="row-label">Due accounts payable</td>
                        \${duePayable.map(amt => \`<td class="right-aligned">\${formatAmount(amt.toFixed(2))}</td>\`).join('')}
                      </tr>
                      <tr>
                        <td class="row-label">Other payments out</td>
                        \${otherPayOutNums.map(amt => \`<td class="right-aligned">\${formatAmount(amt.toFixed(2))}</td>\`).join('')}
                      </tr>
                      <tr>
                        <td class="row-label">Closing liquidity</td>
                        \${closingLiquidity.map(amt => \`<td class="right-aligned">\${formatAmount(amt.toFixed(2))}</td>\`).join('')}
                      </tr>
                    </tbody>
                  </table>
                </body>
                </html>
              \`);
              
              reportWindow.focus();
            }
            
            // Close the parameter window
            window.close();
          };
          
          // Handle other action buttons (PDF, TXT)
          document.getElementById('show-pdf').onclick = function() {
            alert('PDF functionality would be implemented here');
          };
          
          document.getElementById('show-txt').onclick = function() {
            alert('TXT functionality would be implemented here');
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openLiquidityReportConfig };