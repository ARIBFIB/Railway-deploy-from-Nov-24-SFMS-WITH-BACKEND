const openTopRatedCustomers = () => {
  // Open the Top Customers filter screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=1000,height=700,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Top Customers - Filter</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 14px;
            overflow: auto;
          }
          .container {
            max-width: 930px;
            margin: 0 12px;
            padding: 10px 0 16px 0;
          }
          .section {
            border: 1px solid #000000;
            border-radius: 0;
            padding: 8px;
            margin-bottom: 10px;
          }
          .section-title {
            font-size: 11px;
            font-weight: normal;
            margin-bottom: 6px;
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
            width: 12px;
            height: 12px;
            margin-right: 6px;
          }
          .date-row {
            display: flex;
            align-items: center;
            margin-top: 4px;
          }
          .date-input {
            width: 90px;
            height: 18px;
            padding: 2px 4px;
            border: 1px solid #7A7A7A;
            background-color: #FFFFFF;
            font-size: 11px;
          }
          .calendar-icon {
            width: 16px;
            height: 16px;
            margin: 0 4px;
            font-size: 10px;
          }
          .hyphen {
            margin: 0 4px;
          }
          .invoice-filter-row {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .invoice-dropdown {
            width: 140px;
            height: 18px;
            border: 1px solid #7A7A7A;
            padding: 2px 4px;
            font-size: 11px;
          }
          .customers-row {
            display: flex;
            align-items: center;
            margin-top: 4px;
          }
          .customers-label {
            margin-right: 6px;
          }
          .customers-dropdown {
            width: 60px;
            height: 18px;
            border: 1px solid #7A7A7A;
            padding: 2px 4px;
            font-size: 11px;
          }
          .orientation-row {
            display: flex;
            align-items: center;
          }
          .orientation-option {
            display: flex;
            align-items: center;
            margin-right: 14px;
          }
          .action-buttons {
            text-align: center;
            margin-top: 10px;
          }
          .action-button {
            height: 22px;
            padding: 0 12px;
            font-size: 11px;
            color: #000000;
            background-color: #CFE6B8;
            border: 1px solid #7A7A7A;
            border-radius: 0;
            margin: 0 4px;
            cursor: pointer;
          }
          .action-button:hover {
            background-color: #BDD5A7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Interval Section -->
          <div class="section">
            <div class="section-title">Interval</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="interval" id="all" value="all" checked />
                <label for="all">All</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="interval" id="date" value="date" />
                <label for="date">Date</label>
              </div>
            </div>
            <div class="date-row">
              <input type="text" class="date-input" value="2026-01-01" disabled />
              <div class="calendar-icon">📅</div>
              <div class="hyphen">-</div>
              <input type="text" class="date-input" value="2026-12-31" disabled />
              <div class="calendar-icon">📅</div>
            </div>
          </div>
          
          <!-- Invoice Filter Section -->
          <div class="section">
            <div class="section-title">Invoice Filter</div>
            <div class="invoice-filter-row">
              <select class="invoice-dropdown">
                <option>Show All</option>
                <option>Invoice</option>
                <option>Cash</option>
                <option>Both</option>
              </select>
            </div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="filter-type" id="invoice" value="invoice" />
                <label for="invoice">Invoice</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="filter-type" id="cash" value="cash" />
                <label for="cash">Cash</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="filter-type" id="both" value="both" checked />
                <label for="both">Both</label>
              </div>
            </div>
          </div>
          
          <!-- Number of Customers Section -->
          <div class="section">
            <div class="section-title">Number of Customers</div>
            <div class="customers-row">
              <div class="customers-label">Number of Customers</div>
              <select class="customers-dropdown">
                <option>10</option>
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>
          
          <!-- Orientation Section -->
          <div class="section">
            <div class="section-title">Orientation</div>
            <div class="orientation-row">
              <div class="orientation-option">
                <input type="radio" name="orientation" id="portrait" value="portrait" checked />
                <label for="portrait">Portrait</label>
              </div>
              <div class="orientation-option">
                <input type="radio" name="orientation" id="landscape" value="landscape" />
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
          // Enable/disable date inputs based on interval selection
          document.getElementById('date').addEventListener('change', function() {
            const dateInputs = document.querySelectorAll('.date-input');
            dateInputs.forEach(input => input.disabled = false);
          });
          
          document.getElementById('all').addEventListener('change', function() {
            const dateInputs = document.querySelectorAll('.date-input');
            dateInputs.forEach(input => input.disabled = true);
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
                  <title>Top Customers</title>
                  <style>
                    body { 
                      margin: 20px; 
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
                      text-align: left; 
                    }
                    .center-header { 
                      font-size: 28px; 
                      font-weight: bold; 
                      text-align: center; 
                      position: absolute;
                      left: 50%;
                      transform: translateX(-50%);
                    }
                    .right-header { 
                      font-size: 11px; 
                      text-align: right; 
                    }
                    .table-header {
                      font-size: 11px;
                      font-weight: normal;
                      color: #000000;
                      margin-bottom: 8px;
                    }
                    .table-row {
                      height: 20px;
                      font-size: 11px;
                      margin-bottom: 4px;
                    }
                    .customer-name {
                      font-size: 12px;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .bold { font-weight: bold; }
                    .percentage-bar-container {
                      width: 240px;
                      height: 14px;
                      background: transparent;
                      margin-top: 2px;
                    }
                    .percentage-bar-fill {
                      height: 14px;
                      background-color: #00FF00;
                      border-radius: 0;
                    }
                    .totals-section {
                      margin-top: 20px;
                      font-size: 11px;
                      font-weight: bold;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="center-header">Top customers</div>
                    <div class="right-header">Printed 2026-01-19 18:39</div>
                  </div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 100px;">Customer no.</div>
                      <div class="text-left" style="width: 200px;">Name</div>
                      <div class="text-right" style="width: 150px;">Total invoice amount excluding VAT</div>
                      <div class="text-left" style="width: 200px;">% share of total turnover</div>
                    </div>
                  </div>

                  <!-- Data Rows -->
                  <div class="table-row">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 100px;">1</div>
                      <div class="text-left customer-name" style="width: 200px;">Customer01</div>
                      <div class="text-right" style="width: 150px;">352,00</div>
                      <div class="text-left" style="width: 200px;">100,0%</div>
                    </div>
                    <div class="percentage-bar-container">
                      <div class="percentage-bar-fill" style="width: 100%;"></div>
                    </div>
                  </div>

                  <!-- Totals Section -->
                  <div class="totals-section">
                    <div>Total leaderboard: 352,00 100,0%</div>
                    <div>Totally: 352,00 100,0%</div>
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

export { openTopRatedCustomers };