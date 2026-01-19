const openDueList = () => {
  // Open the Customer Due List filter screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=800,height=700,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Customer Due List - Filter</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, sans-serif; 
            font-size: 12px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.2;
            overflow: auto;
          }
          .container {
            width: 740px;
            margin: 12px;
            padding: 0;
          }
          .section {
            border: 1px solid #6E6E6E;
            padding: 8px;
            margin-top: 10px;
          }
          .section-label {
            font-size: 12px;
            color: #000000;
            font-weight: normal;
            margin-bottom: 6px;
          }
          .date-row {
            display: flex;
            align-items: center;
          }
          .date-input {
            width: 110px;
            height: 22px;
            border: 1px solid #6E6E6E;
            background-color: #FFFFFF;
            color: #000000;
            padding: 2px 4px;
            font-size: 12px;
          }
          .calendar-icon {
            width: 16px;
            height: 16px;
            margin-left: 4px;
            font-size: 10px;
          }
          .date-spacing {
            margin: 0 8px;
          }
          .checkbox-option {
            margin-top: 8px;
          }
          input[type="checkbox"] {
            width: 14px;
            height: 14px;
            margin-right: 6px;
          }
          .radio-group {
            display: flex;
            align-items: center;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 12px;
          }
          input[type="radio"] {
            width: 14px;
            height: 14px;
            margin-right: 4px;
            accent-color: #1A73E8;
          }
          .info-icon {
            width: 14px;
            height: 14px;
            background-color: #2B6CB0;
            color: #FFFFFF;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            margin-left: 4px;
          }
          .action-buttons {
            margin-top: 16px;
            display: flex;
            align-items: center;
          }
          .action-button {
            height: 26px;
            min-width: 110px;
            background-color: #C6E6B5;
            border: 1px solid #6E6E6E;
            color: #000000;
            font-size: 12px;
            margin-right: 8px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Date Section -->
          <div class="section">
            <div class="section-label">Date</div>
            <div class="date-row">
              <input type="text" class="date-input" value="2026-01-01" />
              <div class="calendar-icon">📅</div>
              <div class="date-spacing">-</div>
              <input type="text" class="date-input" value="2026-12-31" />
              <div class="calendar-icon">📅</div>
            </div>
            <div class="checkbox-option">
              <input type="checkbox" id="include-invoices" />
              <label for="include-invoices">Inkludera fakturor under betalning</label>
            </div>
          </div>
          
          <!-- Order by Section -->
          <div class="section">
            <div class="section-label">Order by</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="order-by" id="inv-no" value="inv-no" checked />
                <label for="inv-no">Inv. no.</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="order-by" id="company-name" value="company-name" />
                <label for="company-name">Company Name</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="order-by" id="due-date" value="due-date" />
                <label for="due-date">Due date</label>
              </div>
            </div>
          </div>
          
          <!-- Orientation Section -->
          <div class="section">
            <div class="section-label">Orientation</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="orientation" id="portrait" value="portrait" />
                <label for="portrait">Portrait</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="orientation" id="landscape" value="landscape" checked />
                <label for="landscape">Landscape</label>
                <div class="info-icon">i</div>
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
                  <title>Customer Due List</title>
                  <style>
                    body { 
                      margin: 20px; 
                      font-family: Arial, sans-serif; 
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
                      margin-bottom: 16px;
                    }
                    .left-header { 
                      font-size: 12px; 
                      text-align: left; 
                    }
                    .right-header { 
                      font-size: 11px; 
                      color: #333333;
                      text-align: right; 
                    }
                    .report-title {
                      text-align: center;
                      font-size: 28px;
                      font-weight: bold;
                      margin: 10px 0 14px 0;
                    }
                    .subheader {
                      text-align: left;
                      font-size: 13px;
                      margin-bottom: 16px;
                    }
                    .table-header {
                      font-size: 12px;
                      font-weight: bold;
                      margin-bottom: 10px;
                    }
                    .table-row {
                      height: 22px;
                      font-size: 12px;
                      padding: 2px 0;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .bold { font-weight: bold; }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="right-header">Printed 2026-01-19 18:31</div>
                  </div>

                  <!-- Report Title -->
                  <div class="report-title">Customer due list</div>

                  <!-- Subheader -->
                  <div class="subheader">As of date 2026-01-19</div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 80px;">Fakt.nr</div>
                      <div class="text-left" style="width: 150px;">Customer</div>
                      <div class="text-left" style="width: 60px;">Prev.</div>
                      <div class="text-left" style="width: 80px;">Ver.nr</div>
                      <div class="text-left" style="width: 80px;">Datum</div>
                      <div class="text-left" style="width: 80px;">Currency</div>
                      <div class="text-right" style="width: 100px;">Amount</div>
                      <div class="text-right" style="width: 100px;">Amount in SEK</div>
                      <div class="text-right" style="width: 100px;">Balance</div>
                      <div class="text-right" style="width: 100px;">Balance in SEK</div>
                    </div>
                  </div>

                  <!-- Data Rows (Empty State) -->

                  <!-- Summary Section -->
                  <div style="margin-top: 18px; font-size: 13px; font-weight: bold;">
                    <div>Total in SEK</div>
                    <div>Number of invoices: 0</div>
                    <div>0,00</div>
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

export { openDueList };