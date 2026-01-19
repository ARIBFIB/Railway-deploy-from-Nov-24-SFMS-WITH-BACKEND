const openQuoteOrderInvoiceListTotalLed = () => {
  // Open the Quote/Order/Invoice List Total Led configuration screen
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
        <title>Reports - Reports</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #C7E3B4; 
            line-height: 1.2;
            overflow: auto;
          }
          .container {
            width: 1024px;
            margin: 0 auto;
            padding: 16px;
          }
          .page-header {
            font-size: 18px;
            font-weight: bold;
            color: #1E7F3B;
            text-align: left;
            padding: 10px 0 8px 12px;
          }
          .section-title {
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #000000;
          }
          .section {
            background-color: #C7E3B4;
            border: 1px solid #9DC68A;
            padding: 8px;
            margin-bottom: 10px;
            border-radius: 0;
          }
          .field-label {
            font-size: 11px;
            color: #000000;
            margin-bottom: 4px;
          }
          input[type="text"] {
            width: 280px;
            height: 18px;
            border: 1px solid #8FBF7A;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
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
            accent-color: #1E5DB8;
          }
          .customer-row {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .customer-input {
            width: 110px;
            height: 18px;
            border: 1px solid #8FBF7A;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            margin-right: 4px;
          }
          .lookup-icon {
            width: 14px;
            height: 14px;
            background-color: #FFD84D;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
          }
          .extended-search {
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: #C7E3B4;
            border: 1px solid #9DC68A;
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
            margin-top: 6px;
          }
          .magnifier-icon {
            width: 14px;
            height: 14px;
            color: #3A6EA5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
          }
          .type-row {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          select {
            width: 110px;
            height: 18px;
            border: 1px solid #8FBF7A;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          select:disabled {
            background-color: #E6E6E6;
            color: #7A7A7A;
          }
          .date-inputs {
            display: flex;
            align-items: center;
            margin-top: 4px;
          }
          .date-input {
            width: 90px;
            height: 18px;
            border: 1px solid #8FBF7A;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            margin-right: 4px;
          }
          .calendar-icon {
            width: 14px;
            height: 14px;
            background-color: #3A6EA5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            margin: 0 4px;
          }
          .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
          }
          .charges-container {
            display: flex;
            justify-content: space-between;
          }
          .charges-column {
            width: 48%;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            accent-color: #1E5DB8;
          }
          .format-dropdown {
            width: 80px;
            height: 18px;
            border: 1px solid #8FBF7A;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          .run-button {
            width: 50px;
            height: 22px;
            background-color: #E6F2D5;
            border: 1px solid #7FB36A;
            font-size: 11px;
            color: #000000;
            cursor: pointer;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Page Header -->
          <div class="page-header">Reports - Reports</div>
          
          <!-- Create Report Section -->
          <div class="section-title">Create Report</div>
          <div class="field-label">Reportname</div>
          <input type="text" value="Offer/Order/Invoice list totalled" />
          
          <!-- Customer Section -->
          <div class="section">
            <div class="section-title">Customer</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="customer" value="specific" />
                <label>Customer</label>
              </div>
            </div>
            <div class="customer-row">
              <input type="text" class="customer-input" />
              <div class="lookup-icon">🔍</div>
            </div>
            <div class="radio-option">
              <input type="radio" name="customer" value="all" checked />
              <label>All customers</label>
            </div>
            <div class="extended-search">
              <div class="magnifier-icon">🔍</div>
              <span>Extended search</span>
            </div>
          </div>
          
          <!-- Type Section -->
          <div class="section">
            <div class="section-title">Type</div>
            <div class="type-row">
              <input type="radio" name="type" value="offer" checked />
              <label>Offer</label>
              <select>
                <option>Show active</option>
              </select>
            </div>
            <div class="type-row">
              <input type="radio" name="type" value="order" />
              <label>Order</label>
              <select disabled>
                <option>Show all</option>
              </select>
            </div>
            <div class="type-row">
              <input type="radio" name="type" value="invoice" />
              <label>Invoice</label>
              <select disabled>
                <option>Show all</option>
              </select>
            </div>
          </div>
          
          <!-- Interval Section -->
          <div class="section">
            <div class="section-title">Interval</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="interval" value="all" />
                <label>All</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="interval" value="current-year" checked />
                <label>Current financial year (2026-01-01 - 2026-12-31)</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="interval" value="date" />
                <label>Date</label>
              </div>
            </div>
            <div class="date-inputs">
              <input type="text" class="date-input" value="2026-01-01" />
              <div class="calendar-icon">📅</div>
              <span style="margin: 0 4px;">-</span>
              <input type="text" class="date-input" value="2026-12-31" />
              <div class="calendar-icon">📅</div>
            </div>
          </div>
          
          <!-- VAT Section -->
          <div class="section">
            <div class="section-title">VAT</div>
            <div class="checkbox-group">
              <input type="checkbox" id="incl-vat" />
              <label for="incl-vat">Incl. VAT</label>
            </div>
          </div>
          
          <!-- Charges Section -->
          <div class="section">
            <div class="section-title">Charges</div>
            <div class="charges-container">
              <div class="charges-column">
                <div class="checkbox-group">
                  <input type="checkbox" id="incl-freight" checked />
                  <label for="incl-freight">Incl. freight fee</label>
                </div>
              </div>
              <div class="charges-column">
                <div class="checkbox-group">
                  <input type="checkbox" id="incl-discount" checked />
                  <label for="incl-discount">Incl. invoice discount</label>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Orientation Section -->
          <div class="section">
            <div class="section-title">Orientation</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="orientation" value="portrait" checked />
                <label>Portrait</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="orientation" value="landscape" />
                <label>Landscape</label>
              </div>
            </div>
          </div>
          
          <!-- File Format Section -->
          <div class="section">
            <div class="section-title">File format</div>
            <select class="format-dropdown">
              <option>HTML</option>
              <option>PDF</option>
              <option>Excel</option>
            </select>
          </div>
          
          <!-- Run Button -->
          <button id="run-report" class="run-button">Run</button>
        </div>
        
        <script>
          // Handle run button click
          document.getElementById('run-report').onclick = function() {
            // Get form values
            const reportName = document.querySelector('input[type="text"]').value;
            const customerOption = document.querySelector('input[name="customer"]:checked').value;
            const intervalOption = document.querySelector('input[name="interval"]:checked').value;
            
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
                  <title>Offer/Order/Invoice list totalled</title>
                  <style>
                    body { 
                      margin: 25px 30px; 
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
                      font-weight: bold;
                      text-align: left; 
                    }
                    .right-header { 
                      font-size: 10px; 
                      text-align: right; 
                    }
                    .period-block {
                      text-align: center;
                      font-size: 11px;
                      line-height: 1.2;
                      margin: 16px 0;
                    }
                    .main-title {
                      text-align: center;
                      font-size: 22px;
                      font-weight: bold;
                      margin: 20px 0 15px 0;
                    }
                    .table-header {
                      font-size: 11px;
                      font-weight: bold;
                      border-bottom: 2px solid #000000;
                      padding-bottom: 4px;
                      margin-bottom: 8px;
                    }
                    .data-area {
                      min-height: 200px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      color: #666666;
                    }
                    .summary-section {
                      margin-top: 30px;
                      font-size: 11px;
                      font-weight: bold;
                    }
                    .summary-row {
                      margin-bottom: 6px;
                      display: flex;
                      justify-content: space-between;
                    }
                    .footer-count {
                      font-size: 11px;
                      font-weight: normal;
                      margin-top: 12px;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .bold { font-weight: bold; }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="right-header">Printed 2026-01-19 18:02</div>
                  </div>

                  <!-- Period Block -->
                  <div class="period-block">
                    Period 2026-01-01 - 2026-12-31<br>
                    Selection
                  </div>

                  <!-- Main Title -->
                  <div class="main-title">Offer/Order/Invoice list totalled</div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 100px;">Cust No.</div>
                      <div class="text-left" style="width: 300px;">Customer</div>
                      <div class="text-right" style="width: 150px;">Amount</div>
                    </div>
                  </div>

                  <!-- Data Area (Empty) -->
                  <div class="data-area">
                    No data available
                  </div>

                  <!-- Summary Section -->
                  <div class="summary-section">
                    <div class="summary-row">
                      <span>Offer Total sum:</span>
                      <span>0,00</span>
                    </div>
                    <div class="summary-row">
                      <span>Order Total sum:</span>
                      <span>0,00</span>
                    </div>
                    <div class="summary-row">
                      <span>Invoice Total sum:</span>
                      <span>0,00</span>
                    </div>
                    <div class="footer-count">
                      Number: 0
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
          
          // Set focus to the report name input on load
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

export { openQuoteOrderInvoiceListTotalLed };