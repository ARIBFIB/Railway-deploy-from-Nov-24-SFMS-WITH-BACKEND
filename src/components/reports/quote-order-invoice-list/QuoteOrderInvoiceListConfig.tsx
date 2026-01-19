const openQuoteOrderInvoiceList = () => {
  // Open the Quote/Order/Invoice List configuration screen
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
            background-color: #C6E3B4; 
            line-height: 1.2;
            overflow: auto;
          }
          .container {
            max-width: 980px;
            margin: 0 auto;
            padding: 16px;
          }
          .header {
            font-size: 18px;
            font-weight: bold;
            color: #0B5E2B;
            padding: 8px 0 8px 10px;
            text-align: left;
          }
          .section-title {
            font-size: 13px;
            font-weight: bold;
            margin-bottom: 6px;
            color: #000000;
          }
          .section {
            border: 1px solid #8FB28F;
            background-color: #CDE8BD;
            border-radius: 2px;
            padding: 8px;
            margin-bottom: 8px;
          }
          .field-label {
            font-size: 11px;
            color: #000000;
            margin-bottom: 4px;
          }
          input[type="text"] {
            width: 260px;
            height: 18px;
            border: 1px solid #8FAF8F;
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
            width: 11px;
            height: 11px;
            margin-right: 4px;
            accent-color: #000000;
          }
          .customer-input-row {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .customer-input {
            width: 160px;
            height: 18px;
            border: 1px solid #8FAF8F;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            margin-right: 4px;
          }
          .search-icon {
            width: 16px;
            height: 16px;
            background-color: #FFD966;
            border: 1px solid #A6A600;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            cursor: pointer;
          }
          .extended-search {
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: #CDE8BD;
            border: 1px solid #8FB28F;
            padding: 4px 8px;
            font-size: 11px;
            cursor: pointer;
            margin-top: 6px;
          }
          .magnifier-icon {
            width: 16px;
            height: 16px;
            color: #2E75B6;
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
          input[type="checkbox"] {
            width: 11px;
            height: 11px;
            margin-right: 6px;
            accent-color: #000000;
          }
          select {
            width: 110px;
            height: 18px;
            border: 1px solid #8FAF8F;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          select:disabled {
            background-color: #E6E6E6;
          }
          .date-inputs {
            display: flex;
            align-items: center;
            margin-top: 4px;
          }
          .date-input {
            width: 95px;
            height: 18px;
            border: 1px solid #8FAF8F;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
            margin-right: 4px;
          }
          .calendar-icon {
            width: 16px;
            height: 16px;
            background-color: #D9EDF7;
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
          .format-dropdown {
            width: 80px;
            height: 18px;
            border: 1px solid #8FAF8F;
            padding: 2px 4px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          .run-button {
            width: 60px;
            height: 22px;
            background-color: #D9F0C2;
            border: 1px solid #7FAF7F;
            font-weight: bold;
            font-size: 11px;
            color: #000000;
            border-radius: 2px;
            cursor: pointer;
            margin-top: 12px;
          }
          .run-button:hover {
            background-color: #BFE6A5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">Reports - Reports</div>
          
          <!-- Create Report Section -->
          <div class="section-title">Create Report</div>
          <div class="field-label">Reportname</div>
          <input type="text" value="Offer/Order/Invoice List" />
          
          <!-- Customer Section -->
          <div class="section">
            <div class="section-title">Customer</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="customer" value="specific" checked />
                <label>Customer</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="customer" value="all" />
                <label>All customers</label>
              </div>
            </div>
            <div class="customer-input-row">
              <input type="text" class="customer-input" placeholder="Enter customer" />
              <div class="search-icon">🔍</div>
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
              <input type="checkbox" id="offer" checked />
              <label for="offer">Offer</label>
              <select>
                <option>Show all</option>
              </select>
            </div>
            <div class="type-row">
              <input type="checkbox" id="order" checked />
              <label for="order">Order</label>
              <select>
                <option>Show all</option>
              </select>
            </div>
            <div class="type-row">
              <input type="checkbox" id="invoice" checked />
              <label for="invoice">Invoice</label>
              <select>
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
                <label>Current financial year (2026-01-01 – 2026-12-31)</label>
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
          
          <!-- Order By Section -->
          <div class="section">
            <div class="section-title">Order by</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" name="order-by" value="type" checked />
                <label>Type</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="order-by" value="date" />
                <label>Date</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="order-by" value="customer" />
                <label>Customer</label>
              </div>
              <div class="radio-option">
                <input type="radio" name="order-by" value="reference" />
                <label>Our Reference</label>
              </div>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="show-articles" checked />
              <label for="show-articles">Show article rows</label>
            </div>
          </div>
          
          <!-- Currency & VAT Section -->
          <div class="section">
            <div class="section-title">Currency & VAT</div>
            <div class="checkbox-group">
              <input type="checkbox" id="show-sek" checked />
              <label for="show-sek">Show in SEK</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="incl-vat" />
              <label for="incl-vat">Incl. VAT</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="incl-freight" checked />
              <label for="incl-freight">Incl. freight fee</label>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="incl-discount" checked />
              <label for="incl-discount">Incl. invoice discount</label>
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
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
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
            const orderBy = document.querySelector('input[name="order-by"]:checked').value;
            
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
                  <title>Offer/Order/Invoice List</title>
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
                    .center-header { 
                      font-size: 20px; 
                      font-weight: bold; 
                      text-align: center; 
                      position: absolute;
                      left: 50%;
                      transform: translateX(-50%);
                    }
                    .right-header { 
                      font-size: 10px; 
                      text-align: right; 
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
                      padding: 3px 0;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .bold { font-weight: bold; }
                    .totals-section {
                      margin-top: 20px;
                      font-size: 11px;
                      line-height: 16px;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="center-header">Offer/Order/Invoice List</div>
                    <div class="right-header">Printed 2026-01-19 17:59</div>
                  </div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">Serial Number</div>
                      <div class="text-left" style="width: 70px;">Cust No.</div>
                      <div class="text-left" style="width: 160px;">Customer</div>
                      <div class="text-center" style="width: 90px;">Creation Date</div>
                      <div class="text-center" style="width: 90px;">Two dates</div>
                      <div class="text-left" style="width: 80px;">Type</div>
                      <div class="text-left" style="width: 100px;">Status</div>
                      <div class="text-left" style="width: 140px;">Our Reference</div>
                      <div class="text-right" style="width: 90px;">Amount</div>
                    </div>
                  </div>

                  <!-- Data Rows -->
                  <div class="table-row bold">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">1</div>
                      <div class="text-left" style="width: 70px;">1001</div>
                      <div class="text-left" style="width: 160px;">Customer ABC</div>
                      <div class="text-center" style="width: 90px;">2026-01-15</div>
                      <div class="text-center" style="width: 90px;">2026-01-20</div>
                      <div class="text-left" style="width: 80px;">Offer</div>
                      <div class="text-left" style="width: 100px;">Open</div>
                      <div class="text-left" style="width: 140px;">REF-001</div>
                      <div class="text-right" style="width: 90px;">1 200,00</div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex; margin-left: 290px;">
                      <div class="text-center" style="width: 90px;">Item 1</div>
                      <div class="text-center" style="width: 90px;"></div>
                      <div class="text-left" style="width: 80px;">Chair</div>
                      <div class="text-left" style="width: 100px;">5 pcs</div>
                      <div class="text-left" style="width: 140px;"></div>
                      <div class="text-right" style="width: 90px;">600,00</div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex; margin-left: 290px;">
                      <div class="text-center" style="width: 90px;">Item 2</div>
                      <div class="text-center" style="width: 90px;"></div>
                      <div class="text-left" style="width: 80px;">Desk</div>
                      <div class="text-left" style="width: 100px;">2 pcs</div>
                      <div class="text-left" style="width: 140px;"></div>
                      <div class="text-right" style="width: 90px;">600,00</div>
                    </div>
                  </div>

                  <div class="table-row bold">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">2</div>
                      <div class="text-left" style="width: 70px;">1002</div>
                      <div class="text-left" style="width: 160px;">Customer XYZ</div>
                      <div class="text-center" style="width: 90px;">2026-01-18</div>
                      <div class="text-center" style="width: 90px;">2026-01-25</div>
                      <div class="text-left" style="width: 80px;">Order</div>
                      <div class="text-left" style="width: 100px;">Confirmed</div>
                      <div class="text-left" style="width: 140px;">REF-002</div>
                      <div class="text-right" style="width: 90px;">1 257,40</div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex; margin-left: 290px;">
                      <div class="text-center" style="width: 90px;">Item 1</div>
                      <div class="text-center" style="width: 90px;"></div>
                      <div class="text-left" style="width: 80px;">Lamp</div>
                      <div class="text-left" style="width: 100px;">3 pcs</div>
                      <div class="text-left" style="width: 140px;"></div>
                      <div class="text-right" style="width: 90px;">450,00</div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex; margin-left: 290px;">
                      <div class="text-center" style="width: 90px;">Item 2</div>
                      <div class="text-center" style="width: 90px;"></div>
                      <div class="text-left" style="width: 80px;">Monitor</div>
                      <div class="text-left" style="width: 100px;">1 pcs</div>
                      <div class="text-left" style="width: 140px;"></div>
                      <div class="text-right" style="width: 90px;">807,40</div>
                    </div>
                  </div>

                  <!-- Totals Section -->
                  <div class="totals-section">
                    <div><span class="bold">Offer Total sum:</span>&nbsp;&nbsp;&nbsp;2 457,40</div>
                    <div><span class="bold">Order Total sum:</span>&nbsp;&nbsp;&nbsp;0,00</div>
                    <div><span class="bold">Invoice Total sum:</span>&nbsp;&nbsp;&nbsp;0,00</div>
                    <div><span class="bold">Number:</span> 1</div>
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

export { openQuoteOrderInvoiceList };