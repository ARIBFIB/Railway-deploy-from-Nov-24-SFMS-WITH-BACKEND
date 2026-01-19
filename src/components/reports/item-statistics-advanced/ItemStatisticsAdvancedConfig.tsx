const openItemStatisticsAdvanced = () => {
  // Open the Item Statistics Advanced configuration screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=1280,height=800,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Article Statistics Advanced - Configuration</title>
        <style>
          body { 
            margin: 0; 
            padding: 8px; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #E9F4E1; 
            line-height: 1.2;
            overflow: auto;
          }
          .container {
            max-width: 1280px;
            margin: 0 auto;
          }
          .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .header-right {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .label {
            font-size: 11px;
            color: #000000;
          }
          input[type="text"] {
            height: 18px;
            padding: 2px 4px;
            border: 1px solid #7F9DB9;
            background-color: #FFFFFF;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            color: #000000;
          }
          .title-input {
            width: 260px;
          }
          .date-input {
            width: 90px;
          }
          select {
            height: 18px;
            padding: 2px 4px;
            border: 1px solid #7F9DB9;
            background-color: #FFFFFF;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            color: #000000;
          }
          .saved-reports {
            width: 160px;
          }
          .save-btn {
            height: 20px;
            padding: 4px 8px;
            border: 1px solid #7FBF7F;
            background-color: #DFF0D8;
            font-size: 11px;
            color: #000000;
            cursor: pointer;
          }
          .section {
            border: 1px solid #9AC48A;
            border-radius: 2px;
            margin-bottom: 8px;
            background-color: #FFFFFF;
          }
          .section-header {
            background-color: #CFE7BC;
            height: 18px;
            padding: 4px 8px;
            font-weight: bold;
            font-size: 11px;
            color: #000000;
          }
          .section-content {
            padding: 8px;
          }
          .two-column {
            display: flex;
            gap: 16px;
          }
          .column {
            flex: 1;
          }
          .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .radio-group {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 16px;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            accent-color: #3A6EA5;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            margin-right: 4px;
            accent-color: #3A6EA5;
          }
          .info-icon {
            width: 12px;
            height: 12px;
            background-color: #3A6EA5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 8px;
            font-weight: bold;
            margin-left: 4px;
          }
          .calendar-icon {
            width: 14px;
            height: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000000;
            font-size: 10px;
            margin: 0 4px;
          }
          .date-range {
            display: flex;
            align-items: center;
          }
          .separator {
            margin: 0 4px;
          }
          .input-row {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .small-input {
            height: 16px;
            padding: 2px 4px;
            border: 1px solid #AACCAA;
            background-color: #EEF6E9;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            color: #000000;
            width: 60px;
            margin-right: 4px;
          }
          .medium-input {
            height: 16px;
            padding: 2px 4px;
            border: 1px solid #AACCAA;
            background-color: #EEF6E9;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            color: #000000;
            width: 140px;
            margin-right: 4px;
          }
          .lookup-icon {
            width: 12px;
            height: 12px;
            background-color: #FFD966;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
            margin-left: 4px;
          }
          .search-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: #E2F0D9;
            border: 1px solid #7FBF7F;
            padding: 2px 8px;
            font-size: 11px;
            cursor: pointer;
            margin-top: 8px;
          }
          .magnifier-icon {
            width: 14px;
            height: 14px;
            color: #4A7EBB;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
          }
          .type-row {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .type-checkbox {
            width: 12px;
            height: 12px;
            margin-right: 6px;
          }
          .type-dropdown {
            height: 18px;
            padding: 2px 4px;
            border: 1px solid #7F9DB9;
            background-color: #FFFFFF;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            color: #000000;
            margin-left: 6px;
          }
          .action-buttons {
            text-align: center;
            margin-top: 16px;
          }
          .btn {
            height: 22px;
            padding: 6px 12px;
            border: 1px solid #7FBF7F;
            background-color: #E2F0D9;
            font-size: 11px;
            color: #000000;
            cursor: pointer;
            margin: 0 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header Bar -->
          <div class="header-bar">
            <div class="header-left">
              <span class="label">Report title</span>
              <input type="text" class="title-input" value="Artikelstatistik" />
              <div class="date-range">
                <input type="text" class="date-input" value="2026-01-01" />
                <div class="calendar-icon">📅</div>
                <span class="separator">-</span>
                <input type="text" class="date-input" value="2026-12-31" />
                <div class="calendar-icon">📅</div>
              </div>
            </div>
            <div class="header-right">
              <select class="saved-reports">
                <option>Select saved report</option>
                <option>Monthly Report</option>
                <option>Quarterly Report</option>
              </select>
              <button class="save-btn">Save report selection</button>
            </div>
          </div>

          <!-- Report Type Section -->
          <div class="section">
            <div class="section-header">Report type</div>
            <div class="section-content">
              <div class="two-column">
                <div class="column">
                  <div class="checkbox-group">
                    <input type="checkbox" id="customer" />
                    <label for="customer">Customer</label>
                  </div>
                  <div class="checkbox-group">
                    <input type="checkbox" id="offer-order-invoice" checked />
                    <label for="offer-order-invoice">Offer/Order/Invoice</label>
                  </div>
                </div>
                <div class="column">
                  <div class="radio-group">
                    <input type="radio" id="quote-date" name="date-type" checked />
                    <label for="quote-date">Quote/Order/Invoice date</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="delivery-date" name="date-type" />
                    <label for="delivery-date">Delivery date</label>
                    <div class="info-icon">i</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selection Section -->
          <div class="section">
            <div class="section-header">Selection</div>
            <div class="section-content">
              <div class="two-column">
                <div class="column">
                  <div class="radio-group">
                    <input type="radio" id="all-articles" name="item-select" checked />
                    <label for="all-articles">All articles</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="item" name="item-select" />
                    <label for="item">Item</label>
                    <input type="text" class="medium-input" />
                    <div class="lookup-icon">🔍</div>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="show-interval-item" name="item-select" />
                    <label for="show-interval-item">Show interval</label>
                    <input type="text" class="small-input" />
                    <input type="text" class="small-input" />
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="show-items" name="item-select" />
                    <label for="show-items">Show items</label>
                    <input type="text" class="medium-input" />
                    <div class="info-icon">i</div>
                  </div>
                </div>
                <div class="column">
                  <div class="radio-group">
                    <input type="radio" id="all-customers" name="customer-select" checked />
                    <label for="all-customers">All customers</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="customer-select" name="customer-select" />
                    <label for="customer-select">Customer</label>
                    <input type="text" class="medium-input" />
                    <div class="lookup-icon">🔍</div>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="show-interval-cust" name="customer-select" />
                    <label for="show-interval-cust">Show interval</label>
                    <input type="text" class="small-input" />
                    <input type="text" class="small-input" />
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="show-customers" name="customer-select" />
                    <label for="show-customers">Show customers</label>
                    <div class="info-icon">i</div>
                  </div>
                  <button class="search-btn">
                    <div class="magnifier-icon">🔍</div>
                    <span>Extended search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Type Section -->
          <div class="section">
            <div class="section-header">Type</div>
            <div class="section-content">
              <div class="type-row">
                <input type="checkbox" class="type-checkbox" id="offer-type" />
                <label for="offer-type">Offer</label>
                <select class="type-dropdown">
                  <option>Show all</option>
                </select>
              </div>
              <div class="type-row">
                <input type="checkbox" class="type-checkbox" id="order-type" />
                <label for="order-type">Order</label>
                <select class="type-dropdown">
                  <option>Show all</option>
                </select>
              </div>
              <div class="type-row">
                <input type="checkbox" class="type-checkbox" id="invoice-type" checked />
                <label for="invoice-type">Invoice</label>
                <select class="type-dropdown">
                  <option>Show all</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Sorting / Summaries Section -->
          <div class="section">
            <div class="section-header">Sorting / Summaries</div>
            <div class="section-content">
              <div class="two-column">
                <div class="column">
                  <div class="label" style="font-weight: bold; margin-bottom: 6px;">Sorting</div>
                  <div class="radio-group">
                    <input type="radio" id="cust-no" name="sorting" />
                    <label for="cust-no">Cust No.</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="item-no" name="sorting" checked />
                    <label for="item-no">Item no.</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="doc-number" name="sorting" />
                    <label for="doc-number">Quote/Order/Invoice number</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="name-sort" name="sorting" />
                    <label for="name-sort">Name</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="designation" name="sorting" />
                    <label for="designation">Designation</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="date-sort" name="sorting" />
                    <label for="date-sort">Date</label>
                  </div>
                </div>
                <div class="column">
                  <div class="label" style="font-weight: bold; margin-bottom: 6px;">Sums</div>
                  <div class="checkbox-group">
                    <input type="checkbox" id="vat-included" />
                    <label for="vat-included">VAT included</label>
                  </div>
                  <div class="checkbox-group">
                    <input type="checkbox" id="sek-conversion" checked />
                    <label for="sek-conversion">Show converted in SEK</label>
                  </div>
                  <div class="checkbox-group">
                    <input type="checkbox" id="tb-tg" />
                    <label for="tb-tg">Show TB and TG</label>
                  </div>
                  <div class="checkbox-group">
                    <input type="checkbox" id="tb-tg-negative" />
                    <label for="tb-tg-negative">Show TB and TG in case of negative sum</label>
                  </div>
                  <div class="checkbox-group">
                    <input type="checkbox" id="our-reference" />
                    <label for="our-reference">Our Reference</label>
                    <div class="info-icon">i</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Object Accounting Section -->
          <div class="section">
            <div class="section-header">Object accounting</div>
            <div class="section-content">
              <div class="two-column">
                <div class="column">
                  <div class="label" style="font-weight: bold; margin-bottom: 6px;">Cost center</div>
                  <div class="radio-group">
                    <input type="radio" id="cost-all" name="cost-center" checked />
                    <label for="cost-all">Show all</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="cost-interval" name="cost-center" />
                    <label for="cost-interval">Show interval</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="cost-location" name="cost-center" />
                    <label for="cost-location">Show location</label>
                    <div class="info-icon">i</div>
                  </div>
                </div>
                <div class="column">
                  <div class="label" style="font-weight: bold; margin-bottom: 6px;">Projects</div>
                  <div class="radio-group">
                    <input type="radio" id="project-all" name="projects" checked />
                    <label for="project-all">Show all</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="project-interval" name="projects" />
                    <label for="project-interval">Show interval</label>
                  </div>
                  <div class="radio-group">
                    <input type="radio" id="project-project" name="projects" />
                    <label for="project-project">Show project</label>
                    <div class="info-icon">i</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button id="show-on-screen" class="btn">Show on screen</button>
            <button id="show-pdf" class="btn">Show PDF</button>
            <button id="export-excel" class="btn">Export Excel</button>
            <button id="cancel" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get form values
            const reportTitle = document.querySelector('.title-input').value;
            const fromDate = document.querySelectorAll('.date-input')[0].value;
            const toDate = document.querySelectorAll('.date-input')[1].value;
            
            // Open the article statistics report in a new window
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
                  <title>Article Statistics</title>
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
                      font-size: 18px; 
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
                    .report-title {
                      text-align: center;
                      font-size: 18px;
                      font-weight: bold;
                      margin: 8px 0;
                    }
                    .table-header {
                      font-size: 11px;
                      font-weight: bold;
                      border-bottom: 2px solid #000000;
                      padding-bottom: 4px;
                      margin-bottom: 6px;
                    }
                    .table-row {
                      padding: 3px 0;
                      font-size: 11px;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .bold { font-weight: bold; }
                    .subtotal-row {
                      border-top: 1px solid #000000;
                      font-weight: bold;
                    }
                    .item-summary {
                      border-bottom: 2px solid #000000;
                      font-weight: bold;
                      margin: 8px 0;
                    }
                    .final-total {
                      text-align: right;
                      font-weight: bold;
                      border-top: 3px solid #000000;
                      padding-top: 6px;
                      margin-top: 12px;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">
                      Test Company<br>
                      Financial Year \${fromDate} - \${toDate}<br>
                      Quote/Order/Invoice Date \${fromDate} - \${toDate}
                    </div>
                    <div class="center-header">Article statistics</div>
                    <div class="right-header">Printed 2026-01-19 17:53</div>
                  </div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">Item no.</div>
                      <div class="text-left" style="width: 140px;">Name</div>
                      <div class="text-left" style="width: 90px;">Customer no.</div>
                      <div class="text-left" style="width: 140px;">Name</div>
                      <div class="text-left" style="width: 180px;">Document number (Type)</div>
                      <div class="text-center" style="width: 100px;">Datum</div>
                      <div class="text-right" style="width: 80px;">Number</div>
                      <div class="text-center" style="width: 50px;">Unit</div>
                      <div class="text-right" style="width: 100px;">Amount</div>
                    </div>
                  </div>

                  <!-- Data Rows -->
                  <!-- Item 1 -->
                  <div class="table-row">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">1</div>
                      <div class="text-left" style="width: 140px;">Chair</div>
                      <div class="text-left" style="width: 90px;">1</div>
                      <div class="text-left" style="width: 140px;">Customer01</div>
                      <div class="text-left" style="width: 180px;">2 (F)</div>
                      <div class="text-center" style="width: 100px;">2026-01-12</div>
                      <div class="text-right" style="width: 80px;">1</div>
                      <div class="text-center" style="width: 50px;">st</div>
                      <div class="text-right" style="width: 100px;">120,00</div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex; margin-left: 330px;">
                      <div class="text-left" style="width: 180px;">5 (O)</div>
                      <div class="text-center" style="width: 100px;">2026-01-15</div>
                      <div class="text-right" style="width: 80px;">2</div>
                      <div class="text-center" style="width: 50px;">st</div>
                      <div class="text-right" style="width: 100px;">232,00</div>
                    </div>
                  </div>
                  <div class="subtotal-row">
                    <div style="display: flex; margin-left: 510px;">
                      <div class="text-right" style="width: 80px;">3</div>
                      <div class="text-center" style="width: 50px;"></div>
                      <div class="text-right" style="width: 100px;">352,00</div>
                    </div>
                  </div>

                  <!-- Item 2 -->
                  <div class="table-row">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">2</div>
                      <div class="text-left" style="width: 140px;">Desk</div>
                      <div class="text-left" style="width: 90px;">2</div>
                      <div class="text-left" style="width: 140px;">Customer02</div>
                      <div class="text-left" style="width: 180px;">3 (F)</div>
                      <div class="text-center" style="width: 100px;">2026-01-18</div>
                      <div class="text-right" style="width: 80px;">1</div>
                      <div class="text-center" style="width: 50px;">st</div>
                      <div class="text-right" style="width: 100px;">180,00</div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex; margin-left: 330px;">
                      <div class="text-left" style="width: 180px;">7 (O)</div>
                      <div class="text-center" style="width: 100px;">2026-01-20</div>
                      <div class="text-right" style="width: 80px;">3</div>
                      <div class="text-center" style="width: 50px;">st</div>
                      <div class="text-right" style="width: 100px;">292,00</div>
                    </div>
                  </div>
                  <div class="subtotal-row">
                    <div style="display: flex; margin-left: 510px;">
                      <div class="text-right" style="width: 80px;">4</div>
                      <div class="text-center" style="width: 50px;"></div>
                      <div class="text-right" style="width: 100px;">472,00</div>
                    </div>
                  </div>

                  <!-- Item Summary Lines -->
                  <div class="item-summary">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 200px;">1 Chair</div>
                      <div class="text-right" style="width: 80px;">3</div>
                      <div class="text-center" style="width: 50px;"></div>
                      <div class="text-right" style="width: 100px;">352,00</div>
                    </div>
                  </div>
                  <div class="item-summary">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 200px;">2 Desk</div>
                      <div class="text-right" style="width: 80px;">4</div>
                      <div class="text-center" style="width: 50px;"></div>
                      <div class="text-right" style="width: 100px;">472,00</div>
                    </div>
                  </div>

                  <!-- Final Total -->
                  <div class="final-total">
                    Total:<br>
                    Quantity: 7<br>
                    Amount: 824,00
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
          
          document.getElementById('export-excel').onclick = function() {
            // Generate CSV content for export
            const csvContent = \`Item no.;Name;Customer no.;Name;Document number (Type);Datum;Number;Unit;Amount
1;Chair;1;Customer01;2 (F);2026-01-12;1;st;120,00
1;Chair;1;Customer01;5 (O);2026-01-15;2;st;232,00
2;Desk;2;Customer02;3 (F);2026-01-18;1;st;180,00
2;Desk;2;Customer02;7 (O);2026-01-20;3;st;292,00\`;
            
            const blob = new Blob(['\\uFEFF' + csvContent], { 
              type: 'text/csv;charset=utf-8;' 
            });
            
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            const filename = 'article_statistics_2026-01-19.csv';
            
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Set focus to the report title input on load
          window.onload = function() {
            document.querySelector('.title-input').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openItemStatisticsAdvanced };