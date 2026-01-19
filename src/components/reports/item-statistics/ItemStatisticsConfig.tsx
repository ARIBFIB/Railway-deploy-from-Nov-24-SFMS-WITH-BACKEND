const openItemStatistics = () => {
  // Open the Item Statistics report selection screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=1024,height=600,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Item Statistics - Report Selection</title>
        <style>
          body { 
            margin: 0; 
            padding: 8px; 
            font-family: Arial, Segoe UI, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 14px;
            overflow: auto;
          }
          .container {
            max-width: 1024px;
            margin: 0 auto;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
          }
          .report-title-group {
            display: flex;
            align-items: center;
          }
          .label {
            font-size: 11px;
            color: #000000;
            margin-right: 6px;
          }
          input[type="text"] {
            width: 260px;
            height: 18px;
            border: 1px solid #9E9E9E;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Segoe UI, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          .main-content {
            display: flex;
            gap: 6px;
            margin-top: 6px;
          }
          .left-column {
            width: 33%;
          }
          .center-column {
            width: 33%;
          }
          .right-column {
            width: 33%;
          }
          .section {
            border: 1px solid #7F7F7F;
            padding: 6px;
            margin-bottom: 6px;
          }
          .section-title {
            font-size: 11px;
            font-weight: bold;
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
            margin-right: 4px;
            accent-color: #000000;
          }
          select {
            width: 110px;
            height: 18px;
            border: 1px solid #9E9E9E;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Segoe UI, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          .date-inputs {
            display: flex;
            align-items: center;
            margin-top: 4px;
          }
          .date-input {
            width: 90px;
            height: 18px;
            border: 1px solid #9E9E9E;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Segoe UI, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          .calendar-icon {
            width: 14px;
            height: 14px;
            background-color: #1E88E5;
            margin: 0 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 10px;
          }
          .interval-inputs {
            display: flex;
            align-items: center;
            margin-top: 4px;
          }
          .small-input {
            width: 60px;
            height: 18px;
            border: 1px solid #9E9E9E;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Segoe UI, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            margin-right: 4px;
          }
          .medium-input {
            width: 140px;
            height: 18px;
            border: 1px solid #9E9E9E;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Segoe UI, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          .separator {
            margin: 0 4px;
          }
          .info-icon {
            width: 14px;
            height: 14px;
            background-color: #4A90E2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: bold;
            margin-left: 4px;
          }
          .checkbox-group {
            display: flex;
            flex-direction: column;
          }
          .checkbox-option {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            accent-color: #000000;
          }
          .action-buttons {
            text-align: center;
            margin-top: 12px;
          }
          .btn {
            width: 96px;
            height: 22px;
            border: 1px solid #6E8B3D;
            background-color: #CDEAC0;
            color: #000000;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
            margin: 0 3px;
          }
          .btn:hover {
            background-color: #B9D99A;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Section -->
          <div class="header-row">
            <div class="report-title-group">
              <span class="label">Report title</span>
              <input type="text" value="Item Statistics" />
            </div>
          </div>

          <!-- Main Content -->
          <div class="main-content">
            <!-- Left Column -->
            <div class="left-column">
              <!-- Interval Section -->
              <div class="section">
                <div class="section-title">Interval</div>
                <div class="radio-group">
                  <div class="radio-option">
                    <input type="radio" name="interval" value="all-years" />
                    <label>All years</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="interval" value="current-year" checked />
                    <label>Current financial year (2026-01-01 - 2026-12-31)</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="interval" value="date" />
                    <label>Date</label>
                  </div>
                  <div class="date-inputs">
                    <input type="text" class="date-input" value="2026-01-01" />
                    <div class="calendar-icon">📅</div>
                    <span class="separator">-</span>
                    <input type="text" class="date-input" value="2026-12-31" />
                    <div class="calendar-icon">📅</div>
                  </div>
                </div>
              </div>

              <!-- Order By Section -->
              <div class="section">
                <div class="section-title">Order by</div>
                <div class="radio-group">
                  <div class="radio-option">
                    <input type="radio" name="order-by" value="amount" checked />
                    <label>Amount</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="order-by" value="number" />
                    <label>Number</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="order-by" value="item-no" />
                    <label>Item no</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="order-by" value="designation" />
                    <label>Designation</label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Center Column -->
            <div class="center-column">
              <!-- Type Section -->
              <div class="section">
                <div class="section-title">Type</div>
                <select>
                  <option>Invoice</option>
                  <option>Cash</option>
                  <option>Both</option>
                </select>
                <div class="radio-group" style="margin-top: 6px;">
                  <div class="radio-option">
                    <input type="radio" name="type-detail" value="invoice" checked />
                    <label>Invoice</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="type-detail" value="cash" />
                    <label>Cash</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="type-detail" value="both" />
                    <label>Both</label>
                  </div>
                </div>
              </div>

              <!-- Item Filter Section -->
              <div class="section">
                <div class="section-title">Item filter</div>
                <div class="radio-group">
                  <div class="radio-option">
                    <input type="radio" name="item-filter" value="all" checked />
                    <label>Show all</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="item-filter" value="interval" />
                    <label>Show interval</label>
                  </div>
                  <div class="interval-inputs">
                    <input type="text" class="small-input" />
                    <span class="separator">-</span>
                    <input type="text" class="small-input" />
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="item-filter" value="items" />
                    <label>Show items</label>
                    <input type="text" class="medium-input" style="margin-left: 4px;" />
                    <div class="info-icon">i</div>
                  </div>
                  <div class="checkbox-group">
                    <div class="checkbox-option">
                      <input type="checkbox" id="show-descr" />
                      <label for="show-descr">Show descr.</label>
                    </div>
                    <div class="checkbox-option">
                      <input type="checkbox" id="show-cust-no" />
                      <label for="show-cust-no">Show cust no.</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="right-column">
              <!-- No of Items Section -->
              <div class="section">
                <div class="section-title">No of items</div>
                <div style="display: flex; align-items: center;">
                  <select style="width: 60px;">
                    <option>100</option>
                    <option>50</option>
                    <option>200</option>
                  </select>
                  <div class="info-icon">i</div>
                </div>
              </div>

              <!-- Statistics Section -->
              <div class="section">
                <div class="section-title">Statistics</div>
                <div class="radio-group">
                  <div class="radio-option">
                    <input type="radio" name="statistics" value="yes" checked />
                    <label>Yes</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="statistics" value="no" />
                    <label>No</label>
                  </div>
                </div>
              </div>

              <!-- Orientation Section -->
              <div class="section">
                <div class="section-title">Orientation</div>
                <div style="display: flex; align-items: center;">
                  <div class="radio-option" style="margin-right: 16px;">
                    <input type="radio" name="orientation" value="portrait" checked />
                    <label>Portrait</label>
                  </div>
                  <div class="radio-option">
                    <input type="radio" name="orientation" value="landscape" />
                    <label>Landscape</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button id="show-on-screen" class="btn">Show on screen</button>
            <button id="show-pdf" class="btn">Show PDF</button>
            <button id="show-txt" class="btn">Show TXT</button>
            <button id="cancel" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get form values
            const reportTitle = document.querySelector('input[type="text"]').value;
            const interval = document.querySelector('input[name="interval"]:checked').value;
            const orderBy = document.querySelector('input[name="order-by"]:checked').value;
            const type = document.querySelector('select').value;
            const itemFilter = document.querySelector('input[name="item-filter"]:checked').value;
            
            // Open the item statistics report in a new window
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
                  <title>Item Statistics</title>
                  <style>
                    body { 
                      margin: 20px; 
                      font-family: Arial, Segoe UI, Helvetica, sans-serif; 
                      font-size: 11px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 14px;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      margin-bottom: 8px;
                    }
                    .left-header { 
                      font-size: 11px; 
                      font-weight: bold;
                      text-align: left; 
                    }
                    .center-header { 
                      font-size: 22px; 
                      font-weight: bold; 
                      text-align: center; 
                      position: absolute;
                      left: 50%;
                      transform: translateX(-50%);
                    }
                    .right-header { 
                      text-align: right; 
                    }
                    .right-header div {
                      text-align: right;
                    }
                    .sub-header {
                      text-align: center;
                      font-size: 11px;
                      margin-bottom: 10px;
                    }
                    .table-header {
                      font-size: 11px;
                      font-weight: bold;
                      color: #000000;
                      border-bottom: 2px solid #000000;
                      padding-bottom: 4px;
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
                    .bar-container {
                      height: 12px;
                      background-color: #0000FF;
                      display: inline-block;
                    }
                    .summary-section {
                      font-weight: bold;
                      font-size: 11px;
                      margin-top: 12px;
                      border-top: 2px solid #000000;
                      padding-top: 6px;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="center-header">Item Statistics</div>
                    <div class="right-header">
                      <div style="font-size: 11px;">Printed 2026-01-19 17:49</div>
                      <div style="font-size: 10px;">Item filter - All</div>
                    </div>
                  </div>

                  <!-- Sub-header -->
                  <div class="sub-header">Period 2026-01-01 - 2026-12-31</div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 10%;">Art.nr</div>
                      <div class="text-left" style="width: 30%;">Name</div>
                      <div class="text-right" style="width: 10%;">Number</div>
                      <div class="text-right" style="width: 15%;">Amount</div>
                      <div class="text-right" style="width: 10%;">% share</div>
                      <div class="text-left" style="width: 25%;">Bar</div>
                    </div>
                  </div>

                  <!-- Data Rows -->
                  <div class="table-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 10%;">1</div>
                      <div class="text-left" style="width: 30%;">Chair</div>
                      <div class="text-right" style="width: 10%;">5</div>
                      <div class="text-right" style="width: 15%;">600,00</div>
                      <div class="text-right" style="width: 10%;">72,8%</div>
                      <div class="text-left" style="width: 25%;">
                        <div class="bar-container" style="width: 100%;"></div>
                      </div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 10%;">2</div>
                      <div class="text-left" style="width: 30%;">Desk</div>
                      <div class="text-right" style="width: 10%;">2</div>
                      <div class="text-right" style="width: 15%;">224,00</div>
                      <div class="text-right" style="width: 10%;">27,2%</div>
                      <div class="text-left" style="width: 25%;">
                        <div class="bar-container" style="width: 37%;"></div>
                      </div>
                    </div>
                  </div>

                  <!-- Summary Section -->
                  <div class="summary-section">
                    <div>Invoiced items for the period</div>
                    <div>Number: 7</div>
                    <div>Amount: 824,00</div>
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
            alert('PDF generation would happen here');
          };
          
          document.getElementById('show-txt').onclick = function() {
            alert('TXT generation would happen here');
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Set focus to the report title input on load
          window.onload = function() {
            document.querySelector('input[type="text"]').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openItemStatistics };