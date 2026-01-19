const openLedgerList = () => {
  // Open the Accounts Receivable filter screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=1024,height=700,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Accounts Receivable - Filter</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.2;
            overflow: auto;
          }
          .container {
            width: 1024px;
            margin: 12px;
            padding: 0;
          }
          .section {
            border: 1px solid #B5B5B5;
            border-radius: 0;
            margin-bottom: 6px;
            background-color: #F6F6F6;
            padding: 8px 10px;
          }
          .section-title {
            font-size: 12px;
            font-weight: bold;
            color: #000000;
            margin-bottom: 6px;
          }
          .date-row {
            display: flex;
            align-items: center;
          }
          .date-input {
            width: 90px;
            height: 18px;
            padding: 2px 4px;
            border: 1px solid #7F7F7F;
            background-color: #FFFFFF;
            font-size: 11px;
          }
          .date-picker {
            width: 14px;
            height: 14px;
            color: #666666;
            margin: 0 4px;
          }
          .hyphen {
            margin: 0 4px;
          }
          .customer-section {
            display: flex;
            flex-direction: column;
          }
          .radio-group {
            display: flex;
            flex-direction: column;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
          }
          input[type="radio"] {
            width: 10px;
            height: 10px;
            margin-right: 4px;
            accent-color: #2C6E49;
          }
          .customer-input {
            width: 60px;
            height: 18px;
            margin-top: 4px;
          }
          .lookup-icon {
            width: 14px;
            height: 14px;
            background-color: #F0C040;
            border: 1px solid #B5B5B5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            margin-left: 4px;
          }
          .order-by-row {
            display: flex;
            align-items: center;
          }
          .order-by-option {
            display: flex;
            align-items: center;
            margin-right: 12px;
          }
          .checkbox-group {
            display: flex;
            flex-direction: column;
          }
          .checkbox-option {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          input[type="checkbox"] {
            width: 10px;
            height: 10px;
            margin-right: 4px;
            accent-color: #2C6E49;
          }
          .orientation-row {
            display: flex;
            align-items: center;
          }
          .action-buttons {
            text-align: center;
            margin-top: 10px;
          }
          .action-button {
            height: 22px;
            min-width: 90px;
            padding: 4px 10px;
            font-size: 11px;
            font-weight: bold;
            border: 1px solid #5A8F5A;
            border-radius: 0;
            background-color: #CFE6C3;
            color: #000000;
            margin: 0 4px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Date Section -->
          <div class="section">
            <div class="section-title">Date</div>
            <div class="date-row">
              <input type="text" class="date-input" value="2026-01-01" />
              <div class="date-picker">📅</div>
              <div class="hyphen">-</div>
              <input type="text" class="date-input" value="2026-12-31" />
              <div class="date-picker">📅</div>
            </div>
          </div>
          
          <!-- Customer Section -->
          <div class="section">
            <div class="section-title">Customer</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="customer" id="all-customers" value="all" checked />
                <label for="all-customers">All customers</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="customer" id="specific-customer" value="specific" />
                <label for="specific-customer">Customer</label>
              </div>
            </div>
            <div style="display: flex; align-items: center; margin-top: 4px;">
              <input type="text" class="customer-input" disabled />
              <div class="lookup-icon">🔍</div>
            </div>
          </div>
          
          <!-- Order By Section -->
          <div class="section">
            <div class="section-title">Order by</div>
            <div class="order-by-row">
              <div class="order-by-option">
                <input type="radio" name="order-by" id="cust-no" value="cust-no" />
                <label for="cust-no">Cust No.</label>
              </div>
              <div class="order-by-option">
                <input type="radio" name="order-by" id="invoice-no" value="invoice-no" checked />
                <label for="invoice-no">Invoice no.</label>
              </div>
              <div class="order-by-option">
                <input type="radio" name="order-by" id="company-name" value="company-name" />
                <label for="company-name">Company Name</label>
              </div>
            </div>
          </div>
          
          <!-- Options Section -->
          <div class="section">
            <div class="section-title">Options</div>
            <div class="checkbox-group">
              <div class="checkbox-option">
                <input type="checkbox" id="show-instalments" />
                <label for="show-instalments">Show instalment payments</label>
              </div>
              <div class="checkbox-option">
                <input type="checkbox" id="show-paid" />
                <label for="show-paid">Show fully paid</label>
              </div>
              <div class="checkbox-option">
                <input type="checkbox" id="show-unposted" />
                <label for="show-unposted">Show unposted</label>
              </div>
            </div>
          </div>
          
          <!-- Orientation Section -->
          <div class="section">
            <div class="section-title">Orientation</div>
            <div class="orientation-row">
              <div class="radio-option">
                <input type="radio" name="orientation" id="portrait" value="portrait" />
                <label for="portrait">Portrait</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="orientation" id="landscape" value="landscape" checked />
                <label for="landscape">Landscape</label>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button id="show-on-screen" class="action-button">Show on screen</button>
            <button id="show-pdf" class="action-button">Show PDF</button>
            <button id="show-txt" class="action-button">Show TXT</button>
            <button id="cancel" class="action-button">Cancel</button>
          </div>
        </div>
        
        <script>
          // Enable/disable customer input based on radio selection
          document.getElementById('specific-customer').addEventListener('change', function() {
            const customerInput = document.querySelector('.customer-input');
            customerInput.disabled = !this.checked;
          });
          
          document.getElementById('all-customers').addEventListener('change', function() {
            const customerInput = document.querySelector('.customer-input');
            customerInput.disabled = true;
          });
          
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Open the report output in a new window
            const reportWindow = window.open(
              '', 
              '_blank', 
              'width=1200,height=800,scrollbars=yes,resizable=yes'
            );
            
            if (reportWindow) {
              reportWindow.document.write(\`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8" />
                  <title>Accounts Receivable List</title>
                  <style>
                    body { 
                      margin: 20px; 
                      font-family: Arial, Helvetica, sans-serif; 
                      font-size: 11px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.2;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      margin-bottom: 16px;
                    }
                    .left-header { 
                      font-size: 11px; 
                      text-align: left; 
                    }
                    .right-header { 
                      font-size: 11px; 
                      text-align: right; 
                    }
                    .report-title {
                      text-align: center;
                      font-size: 22px;
                      font-weight: bold;
                      margin: 12px 0 10px 0;
                    }
                    .sub-header {
                      text-align: left;
                      font-size: 11px;
                      margin-bottom: 10px;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    .table-header {
                      font-size: 11px;
                      font-weight: bold;
                      text-color: #000000;
                      border-bottom: 1px solid #000000;
                    }
                    .table-row {
                      height: 20px;
                      font-size: 11px;
                      color: #000000;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .bold { font-weight: bold; }
                    .divider {
                      height: 2px;
                      background-color: #000000;
                      margin-top: 12px;
                    }
                    .totals {
                      margin-top: 12px;
                      font-weight: bold;
                      font-size: 11px;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="right-header">Printed 2026-01-19 18:35</div>
                  </div>

                  <!-- Report Title -->
                  <div class="report-title">Accounts receivable list</div>

                  <!-- Sub-Header -->
                  <div class="sub-header">As of date 2026-01-19</div>

                  <!-- Table -->
                  <table>
                    <thead class="table-header">
                      <tr>
                        <th class="text-left" style="width: 80px;">Customer no.</th>
                        <th class="text-left" style="width: 100px;">Invoice number</th>
                        <th class="text-left" style="width: 150px;">Customer</th>
                        <th class="text-left" style="width: 80px;">Factdate</th>
                        <th class="text-left" style="width: 150px;">Former/Previous Protection</th>
                        <th class="text-left" style="width: 80px;">Currency</th>
                        <th class="text-right" style="width: 100px;">Amount</th>
                        <th class="text-right" style="width: 100px;">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="table-row">
                        <td class="text-left">1001</td>
                        <td class="text-left">INV-001</td>
                        <td class="text-left">Customer ABC</td>
                        <td class="text-left">2026-01-15</td>
                        <td class="text-left"></td>
                        <td class="text-left">SEK</td>
                        <td class="text-right">120,00</td>
                        <td class="text-right">120,00</td>
                      </tr>
                      <tr class="table-row">
                        <td class="text-left">1002</td>
                        <td class="text-left">INV-002</td>
                        <td class="text-left">Customer XYZ</td>
                        <td class="text-left">2026-01-16</td>
                        <td class="text-left"></td>
                        <td class="text-left">EUR</td>
                        <td class="text-right">85,50</td>
                        <td class="text-right">85,50</td>
                      </tr>
                      <tr class="table-row">
                        <td class="text-left">1003</td>
                        <td class="text-left">INV-003</td>
                        <td class="text-left">Customer DEF</td>
                        <td class="text-left">2026-01-17</td>
                        <td class="text-left"></td>
                        <td class="text-left">SEK</td>
                        <td class="text-right">200,00</td>
                        <td class="text-right">200,00</td>
                      </tr>
                      <tr class="table-row">
                        <td class="text-left">1004</td>
                        <td class="text-left">INV-004</td>
                        <td class="text-left">Customer GHI</td>
                        <td class="text-left">2026-01-18</td>
                        <td class="text-left"></td>
                        <td class="text-left">USD</td>
                        <td class="text-right">150,00</td>
                        <td class="text-right">150,00</td>
                      </tr>
                      <tr class="table-row">
                        <td class="text-left">1005</td>
                        <td class="text-left">INV-005</td>
                        <td class="text-left">Customer JKL</td>
                        <td class="text-left">2026-01-19</td>
                        <td class="text-left"></td>
                        <td class="text-left">SEK</td>
                        <td class="text-right">268,50</td>
                        <td class="text-right">268,50</td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Divider -->
                  <div class="divider"></div>

                  <!-- Totals Section -->
                  <div class="totals">
                    <div>Number of invoices: 5</div>
                    <div>Summa i SEK: 824,00</div>
                    <div>Total in SEK 824,00</div>
                  </div>
                </body>
                </html>
              \`);
              
              reportWindow.focus();
            }
            
            // Close the parameter window
            window.close();
          };
          
          document.getElementById('show-pdf').onclick = function() {
            alert('PDF export would be triggered here');
          };
          
          document.getElementById('show-txt').onclick = function() {
            alert('TXT export would be triggered here');
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openLedgerList };