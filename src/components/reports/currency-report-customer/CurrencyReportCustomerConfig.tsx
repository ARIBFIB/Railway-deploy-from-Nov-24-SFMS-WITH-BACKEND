const openCurrencyReportCustomer = () => {
  // Open the Currency Report Customer filter screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=860,height=700,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Currency Report - Filter</title>
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
            width: 820px;
            margin: 12px auto;
            padding: 0;
          }
          .section {
            border: 1px solid #6F6F6F;
            padding: 8px;
            margin-bottom: 10px;
            border-radius: 0;
          }
          .section-title {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 6px;
          }
          .interval-row {
            display: flex;
            align-items: center;
          }
          .date-input {
            width: 95px;
            height: 20px;
            padding: 2px 4px;
            border: 1px solid #6F6F6F;
            background-color: #FFFFFF;
            font-size: 12px;
          }
          .calendar-icon {
            width: 16px;
            height: 16px;
            background-color: #E6E6E6;
            border: 1px solid #6F6F6F;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 4px;
            font-size: 10px;
          }
          .hyphen {
            margin: 0 6px;
          }
          .radio-group {
            display: flex;
            align-items: center;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 14px;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            accent-color: #005C2E;
          }
          .customer-row {
            display: flex;
            align-items: center;
            margin-top: 4px;
          }
          .customer-input {
            width: 240px;
            height: 20px;
            background-color: #F2F2F2;
            border: 1px solid #A0A0A0;
            padding: 2px 4px;
            font-size: 12px;
            margin-right: 4px;
          }
          .lookup-icon {
            width: 16px;
            height: 16px;
            background-color: #FFD966;
            border: 1px solid #A0A0A0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
          }
          .options-row {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .currency-dropdown {
            width: 120px;
            height: 22px;
            border: 1px solid #6F6F6F;
            padding: 2px 4px;
            font-size: 11px;
          }
          .checkbox-group {
            display: flex;
            align-items: center;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            accent-color: #005C2E;
          }
          .info-icon {
            width: 14px;
            height: 14px;
            background-color: #EAF2FF;
            color: #2F80ED;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            margin-left: 4px;
          }
          .orientation-row {
            display: flex;
            align-items: center;
          }
          .action-buttons {
            text-align: center;
            margin-top: 16px;
          }
          .action-button {
            height: 26px;
            border: 1px solid #6F6F6F;
            font-size: 11px;
            color: #000000;
            background-color: #C6E0B4;
            margin: 0 4px;
            cursor: pointer;
          }
          .action-button:hover {
            background-color: #A9D08E;
          }
          .show-on-screen {
            width: 96px;
          }
          .show-pdf {
            width: 86px;
          }
          .cancel {
            width: 70px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Interval Section -->
          <div class="section">
            <div class="section-title">Interval</div>
            <div class="interval-row">
              <input type="text" class="date-input" value="2026-01-01" />
              <div class="calendar-icon">📅</div>
              <div class="hyphen">-</div>
              <input type="text" class="date-input" value="2026-01-19" />
              <div class="calendar-icon">📅</div>
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
            <div class="customer-row">
              <input type="text" class="customer-input" disabled />
              <div class="lookup-icon">🔍</div>
            </div>
          </div>
          
          <!-- Options Section -->
          <div class="section">
            <div class="section-title">Options</div>
            <div class="options-row">
              <select class="currency-dropdown">
                <option>SEK</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
              <div class="checkbox-group">
                <input type="checkbox" id="show-currency-diff" />
                <label for="show-currency-diff">Show currency difference</label>
                <div class="info-icon">i</div>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="compare-prev-year" />
                <label for="compare-prev-year">Compare to previous year</label>
              </div>
            </div>
          </div>
          
          <!-- Orientation Section -->
          <div class="section">
            <div class="section-title">Orientation</div>
            <div class="orientation-row">
              <div class="radio-option">
                <input type="radio" name="orientation" id="portrait" value="portrait" checked />
                <label for="portrait">Portrait</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="orientation" id="landscape" value="landscape" />
                <label for="landscape">Landscape</label>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button id="show-on-screen" class="action-button show-on-screen">Show on screen</button>
            <button id="show-pdf" class="action-button show-pdf">Show PDF</button>
            <button id="cancel" class="action-button cancel">Cancel</button>
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
                  <title>Currency Report Customer</title>
                  <style>
                    body { 
                      margin: 24px; 
                      font-family: Arial, sans-serif; 
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
                      color: #000000;
                      text-align: left; 
                    }
                    .center-header { 
                      font-size: 26px; 
                      font-weight: bold; 
                      color: #000000;
                      text-align: center; 
                      position: absolute;
                      left: 50%;
                      transform: translateX(-50%);
                    }
                    .right-header { 
                      font-size: 10px; 
                      color: #000000;
                      text-align: right; 
                    }
                    .subheader { 
                      text-align: center; 
                      font-size: 11px; 
                      margin-bottom: 18px;
                    }
                    .table-header {
                      font-size: 11px;
                      font-weight: bold;
                      padding-bottom: 6px;
                      margin-bottom: 6px;
                    }
                    .table-row {
                      height: 18px;
                      font-size: 11px;
                      padding: 2px 0;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .bold { font-weight: bold; }
                    .total-row {
                      padding-top: 10px;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="center-header">Currency report customer</div>
                    <div class="right-header">Printed 2026-01-19 18:24</div>
                  </div>

                  <!-- Subheader -->
                  <div class="subheader">Period 2026-01-01 - 2026-01-19</div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 80px;">Currency</div>
                      <div class="text-center" style="width: 140px;">Number of transactions</div>
                      <div class="text-right" style="width: 140px;">Turnover in currency</div>
                      <div class="text-right" style="width: 160px;">Turnover in SEK SEK</div>
                      <div class="text-right" style="width: 140px;">% of total turnover</div>
                    </div>
                  </div>

                  <!-- Data Rows -->
                  <div class="table-row">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 80px;">SEK</div>
                      <div class="text-center" style="width: 140px;">3</div>
                      <div class="text-right" style="width: 140px;">352,00</div>
                      <div class="text-right" style="width: 160px;">352,00</div>
                      <div class="text-right" style="width: 140px;">100,00%</div>
                    </div>
                  </div>

                  <!-- Total Row -->
                  <div class="table-row total-row bold">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 80px;">Total</div>
                      <div class="text-center" style="width: 140px;">3</div>
                      <div class="text-right" style="width: 140px;">352,00</div>
                      <div class="text-right" style="width: 160px;">352,00</div>
                      <div class="text-right" style="width: 140px;">100,00%</div>
                    </div>
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

export { openCurrencyReportCustomer };