const openCustomerStatistics = () => {
  // Open the Customer Statistics filter/setup screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=1400,height=800,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Customer Statistics - Report Setup</title>
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 12px;
          }
          .panel {
            background-color: #C6E0B4;
            border: 1px solid #6E8B5E;
            border-radius: 2px;
            padding: 8px;
            margin-bottom: 6px;
          }
          .panel-header {
            background: linear-gradient(to bottom, #E9F5E3, #C6E0B4);
            height: 22px;
            font-weight: bold;
            font-size: 11px;
            color: #000000;
            padding: 4px 8px;
            margin: -8px -8px 8px -8px;
            border-bottom: 1px solid #6E8B5E;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-between { justify-content: space-between; }
          .justify-center { justify-content: center; }
          .gap-6 { gap: 6px; }
          .mb-6 { margin-bottom: 6px; }
          .mb-8 { margin-bottom: 8px; }
          .mr-6 { margin-right: 6px; }
          .ml-6 { margin-left: 6px; }
          .w-90 { width: 90px; }
          .w-200 { width: 200px; }
          .w-260 { width: 260px; }
          .w-60 { width: 60px; }
          .h-20 { height: 20px; }
          .h-22 { height: 22px; }
          .text-10 { font-size: 10px; }
          .text-11 { font-size: 11px; }
          .text-18 { font-size: 18px; }
          .text-bold { font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .border { border: 1px solid #7F9DB9; }
          .border-green { border: 1px solid #6E8B5E; }
          .bg-white { background-color: #FFFFFF; }
          .bg-light-green { background-color: #D9EAD3; }
          .bg-pale-green { background-color: #E2F0D9; }
          .bg-gray { background-color: #EFEFEF; }
          .bg-blue { background-color: #9DC3E6; }
          input[type="text"] {
            height: 20px;
            padding: 2px 6px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            border: 1px solid #7F9DB9;
            background-color: #FFFFFF;
            color: #000000;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
            border: 1px solid #000000;
            accent-color: #000000;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            border: 1px solid #000000;
            accent-color: #000000;
          }
          select {
            height: 20px;
            padding: 2px 6px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            border: 1px solid #7F9DB9;
            background-color: #FFFFFF;
            color: #000000;
          }
          .btn {
            height: 22px;
            padding: 2px 8px;
            border: 1px solid #6E8B5E;
            font-size: 11px;
            color: #000000;
            cursor: pointer;
            background-color: #D9EAD3;
          }
          .btn-action {
            padding: 2px 10px;
            margin: 0 4px;
          }
          .calendar-icon {
            width: 14px;
            height: 14px;
            background-color: #EFEFEF;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            margin: 0 4px;
            cursor: pointer;
          }
          .info-icon {
            width: 14px;
            height: 14px;
            background-color: #9DC3E6;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: bold;
            margin-left: 6px;
          }
          .lookup-icon {
            width: 16px;
            height: 16px;
            background-color: #FFD700;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            margin-left: 4px;
            cursor: pointer;
          }
          .search-btn {
            display: flex;
            align-items: center;
            gap: 4px;
            background-color: #D9EAD3;
            border: 1px solid #6E8B5E;
            padding: 2px 8px;
            font-size: 11px;
            cursor: pointer;
          }
          .panel-content {
            display: flex;
            justify-content: space-between;
          }
          .panel-half {
            width: 48%;
          }
          .radio-group {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 16px;
          }
          .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
          }
          .date-row {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .date-input-group {
            display: flex;
            align-items: center;
          }
          .separator {
            margin: 0 8px;
            font-size: 11px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Top Header Area -->
          <div class="panel">
            <div class="panel-header">Report title</div>
            <div class="flex justify-between mb-6">
              <div class="flex items-center">
                <label class="w-90 text-11">Report title</label>
                <input type="text" value="Kundstatistik" class="w-260 border" />
              </div>
              <div class="flex items-center">
                <label class="mr-6 text-11">Saved reports</label>
                <select class="w-200 border">
                  <option value="">Select saved report</option>
                  <option value="report1">Customer Report 1</option>
                  <option value="report2">Customer Report 2</option>
                </select>
                <button class="btn ml-6">Save report selection</button>
              </div>
            </div>
            <div class="date-row">
              <label class="w-90 text-11">Date</label>
              <div class="date-input-group">
                <input type="text" value="2026-01-01" class="w-100 border" />
                <div class="calendar-icon">📅</div>
                <span class="separator">-</span>
                <input type="text" value="2026-12-31" class="w-100 border" />
                <div class="calendar-icon">📅</div>
              </div>
            </div>
          </div>

          <!-- Report Type Panel -->
          <div class="panel">
            <div class="panel-header">Report type</div>
            <div class="panel-content">
              <div class="panel-half">
                <div class="checkbox-group">
                  <input type="checkbox" id="offer-order-invoice" checked />
                  <label for="offer-order-invoice" class="ml-6 text-11">Offer/Order/Invoice</label>
                </div>
                <div class="checkbox-group">
                  <input type="checkbox" id="item" checked />
                  <label for="item" class="ml-6 text-11">Item</label>
                </div>
              </div>
              <div class="panel-half">
                <div class="radio-group">
                  <input type="radio" id="quote-date" name="date-type" checked />
                  <label for="quote-date" class="ml-6 text-11">Quote/Order/Invoice date</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="delivery-date" name="date-type" />
                  <label for="delivery-date" class="ml-6 text-11">Delivery date</label>
                  <div class="info-icon">ⓘ</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Selection Panel -->
          <div class="panel">
            <div class="panel-header">Selection</div>
            <div class="panel-content">
              <div class="panel-half">
                <div class="radio-group">
                  <input type="radio" id="all-customers" name="customer-select" checked />
                  <label for="all-customers" class="ml-6 text-11">All customers</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="customer" name="customer-select" />
                  <label for="customer" class="ml-6 text-11">Customer</label>
                  <input type="text" class="ml-6 bg-pale-green" disabled />
                  <div class="lookup-icon">🔍</div>
                </div>
                <div class="radio-group">
                  <input type="radio" id="show-interval" name="customer-select" />
                  <label for="show-interval" class="ml-6 text-11">Show interval</label>
                  <input type="text" class="w-60 ml-6 border" />
                  <input type="text" class="w-60 ml-6 border" />
                </div>
                <div class="radio-group">
                  <input type="radio" id="show-customers" name="customer-select" />
                  <label for="show-customers" class="ml-6 text-11">Show customers</label>
                  <div class="info-icon">ⓘ</div>
                </div>
                <button class="search-btn">
                  <span>🔍</span>
                  <span>Extended search</span>
                </button>
              </div>
              <div class="panel-half">
                <div class="radio-group">
                  <input type="radio" id="all-articles" name="item-select" checked />
                  <label for="all-articles" class="ml-6 text-11">All articles</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="item-select" name="item-select" />
                  <label for="item-select" class="ml-6 text-11">Item</label>
                  <input type="text" class="ml-6 bg-pale-green" disabled />
                  <div class="lookup-icon">🔍</div>
                </div>
                <div class="radio-group">
                  <input type="radio" id="show-item-interval" name="item-select" />
                  <label for="show-item-interval" class="ml-6 text-11">Show interval</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="show-items" name="item-select" />
                  <label for="show-items" class="ml-6 text-11">Show items</label>
                  <div class="info-icon">ⓘ</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Type Panel -->
          <div class="panel">
            <div class="panel-header">Type</div>
            <div class="flex justify-between">
              <div class="flex items-center">
                <input type="checkbox" id="offer" />
                <label for="offer" class="ml-6 mr-6 text-11">Offer</label>
                <select>
                  <option>Show all</option>
                </select>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="order" />
                <label for="order" class="ml-6 mr-6 text-11">Order</label>
                <select>
                  <option>Show all</option>
                </select>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="invoice" checked />
                <label for="invoice" class="ml-6 mr-6 text-11">Invoice</label>
                <select>
                  <option>Show all</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Our Reference Panel -->
          <div class="panel">
            <div class="panel-header">Our reference</div>
            <div class="radio-group">
              <input type="radio" id="all-references" name="reference" checked />
              <label for="all-references" class="ml-6 text-11">All references</label>
            </div>
            <div class="radio-group">
              <input type="radio" id="reference" name="reference" />
              <label for="reference" class="ml-6 text-11">Reference</label>
              <input type="text" class="ml-6 bg-pale-green" disabled />
              <div class="lookup-icon">🔍</div>
            </div>
          </div>

          <!-- Sorting / Summaries Panel -->
          <div class="panel">
            <div class="panel-header">Sorting / Summaries</div>
            <div class="panel-content">
              <div class="panel-half">
                <div class="text-bold mb-6">Sorting</div>
                <div class="radio-group">
                  <input type="radio" id="cust-no" name="sorting" checked />
                  <label for="cust-no" class="ml-6 text-11">Cust No.</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="item-no" name="sorting" />
                  <label for="item-no" class="ml-6 text-11">Item no.</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="doc-number" name="sorting" checked />
                  <label for="doc-number" class="ml-6 text-11">Quote/Order/Invoice number</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="name" name="sorting" />
                  <label for="name" class="ml-6 text-11">Name</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="designation" name="sorting" />
                  <label for="designation" class="ml-6 text-11">Designation</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="date-sort" name="sorting" />
                  <label for="date-sort" class="ml-6 text-11">Date</label>
                </div>
              </div>
              <div class="panel-half">
                <div class="text-bold mb-6">Sums</div>
                <div class="checkbox-group">
                  <input type="checkbox" id="vat-included" />
                  <label for="vat-included" class="ml-6 text-11">VAT included</label>
                </div>
                <div class="checkbox-group">
                  <input type="checkbox" id="incl-shipping" checked />
                  <label for="incl-shipping" class="ml-6 text-11">Incl. shipping and invoice fee</label>
                </div>
                <div class="checkbox-group">
                  <input type="checkbox" id="sek-conversion" checked />
                  <label for="sek-conversion" class="ml-6 text-11">Show converted in SEK</label>
                </div>
                <div class="checkbox-group">
                  <input type="checkbox" id="tb-tg" />
                  <label for="tb-tg" class="ml-6 text-11">Show TB and TG</label>
                </div>
                <div class="checkbox-group">
                  <input type="checkbox" id="tb-tg-negative" disabled />
                  <label for="tb-tg-negative" class="ml-6 text-11">Show TB and TG in case of negative sum</label>
                </div>
                <div class="checkbox-group">
                  <input type="checkbox" id="our-reference-sum" />
                  <label for="our-reference-sum" class="ml-6 text-11">Our Reference</label>
                  <div class="info-icon">ⓘ</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Object Accounting Panel -->
          <div class="panel">
            <div class="panel-header">Object accounting</div>
            <div class="panel-content">
              <div class="panel-half">
                <div class="text-bold mb-6">Cost center</div>
                <div class="radio-group">
                  <input type="radio" id="cost-all" name="cost-center" checked />
                  <label for="cost-all" class="ml-6 text-11">Show all</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="cost-interval" name="cost-center" />
                  <label for="cost-interval" class="ml-6 text-11">Show interval</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="cost-location" name="cost-center" />
                  <label for="cost-location" class="ml-6 text-11">Show location</label>
                  <div class="info-icon">ⓘ</div>
                </div>
              </div>
              <div class="panel-half">
                <div class="text-bold mb-6">Projects</div>
                <div class="radio-group">
                  <input type="radio" id="project-all" name="projects" checked />
                  <label for="project-all" class="ml-6 text-11">Show all</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="project-interval" name="projects" />
                  <label for="project-interval" class="ml-6 text-11">Show interval</label>
                </div>
                <div class="radio-group">
                  <input type="radio" id="project-project" name="projects" />
                  <label for="project-project" class="ml-6 text-11">Show project</label>
                  <div class="info-icon">ⓘ</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="flex justify-center mt-8">
            <button id="show-on-screen" class="btn btn-action">Show on screen</button>
            <button id="show-pdf" class="btn btn-action">Show PDF</button>
            <button id="export-excel" class="btn btn-action">Export Excel</button>
            <button id="cancel" class="btn btn-action">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get form values
            const reportTitle = document.querySelector('input[value="Kundstatistik"]').value;
            const fromDate = document.querySelectorAll('input[type="text"]')[1].value;
            const toDate = document.querySelectorAll('input[type="text"]')[2].value;
            
            // Open the customer statistics report in a new window
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
                  <title>Customer Statistics</title>
                  <style>
                    body { 
                      margin: 24px 32px; 
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
                      margin-bottom: 12px;
                    }
                    .left-header { text-align: left; }
                    .right-header { text-align: right; }
                    .report-title { 
                      text-align: center; 
                      font-size: 18px; 
                      font-weight: bold; 
                      margin-bottom: 8px;
                    }
                    .meta-info { 
                      text-align: left; 
                      margin-bottom: 16px;
                      font-size: 11px;
                    }
                    .table-container { margin-top: 16px; }
                    table { 
                      width: 100%; 
                      border-collapse: collapse; 
                      font-size: 11px;
                    }
                    th { 
                      font-weight: bold; 
                      padding: 4px 2px; 
                      text-align: left; 
                      border-bottom: 2px solid #000000;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 4px 2px;
                      font-size: 11px;
                    }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .text-left { text-align: left; }
                    .subtotal-row td {
                      font-weight: bold;
                      border-top: 1px solid #000000;
                    }
                    .customer-total-row td {
                      font-weight: bold;
                      border-top: 2px solid #000000;
                    }
                    .grand-total-row td {
                      font-weight: bold;
                      text-align: right;
                    }
                    .group-separator {
                      border-top: 2px solid #000000;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">
                      <div class="text-11">Test Company</div>
                    </div>
                    <div class="right-header">
                      <div class="text-10">Printed 2026-01-19 17:31</div>
                    </div>
                  </div>

                  <!-- Report Title -->
                  <div class="report-title">Customer statistics</div>

                  <!-- Meta Information -->
                  <div class="meta-info">
                    Financial Year \${fromDate} - \${toDate}<br>
                    Quote/Order/Invoice Date \${fromDate} - \${toDate}
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th>Customer no.</th>
                          <th>Name</th>
                          <th>Document number (Type)</th>
                          <th>Datum</th>
                          <th>Item no.</th>
                          <th>Name</th>
                          <th>Number</th>
                          <th>Unit</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- Customer 1 Data -->
                        <tr>
                          <td>1</td>
                          <td>Customer01</td>
                          <td>2 (F)</td>
                          <td class="text-center">2026-01-12</td>
                          <td>1</td>
                          <td>Chair</td>
                          <td class="text-right">1</td>
                          <td class="text-center">st</td>
                          <td class="text-right">120,00</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>2</td>
                          <td>Desk</td>
                          <td class="text-right">2</td>
                          <td class="text-center">st</td>
                          <td class="text-right">232,00</td>
                        </tr>
                        <tr class="subtotal-row">
                          <td colspan="6"></td>
                          <td class="text-right">3</td>
                          <td></td>
                          <td class="text-right">352,00</td>
                        </tr>
                        
                        <!-- Customer 2 Data -->
                        <tr class="group-separator">
                          <td>2</td>
                          <td>Customer02</td>
                          <td>5 (O)</td>
                          <td class="text-center">2026-01-15</td>
                          <td>3</td>
                          <td>Lamp</td>
                          <td class="text-right">1</td>
                          <td class="text-center">st</td>
                          <td class="text-right">45,00</td>
                        </tr>
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>4</td>
                          <td>Monitor</td>
                          <td class="text-right">3</td>
                          <td class="text-center">st</td>
                          <td class="text-right">427,00</td>
                        </tr>
                        <tr class="subtotal-row">
                          <td colspan="6"></td>
                          <td class="text-right">4</td>
                          <td></td>
                          <td class="text-right">472,00</td>
                        </tr>
                        
                        <!-- Customer Totals -->
                        <tr class="customer-total-row">
                          <td>1</td>
                          <td>Customer01</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="text-right">7</td>
                          <td></td>
                          <td class="text-right">824,00</td>
                        </tr>
                        <tr class="customer-total-row">
                          <td>2</td>
                          <td>Customer02</td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td class="text-right">4</td>
                          <td></td>
                          <td class="text-right">472,00</td>
                        </tr>
                        
                        <!-- Grand Total -->
                        <tr class="grand-total-row group-separator">
                          <td colspan="6">Total:</td>
                          <td class="text-right">11</td>
                          <td></td>
                          <td class="text-right">1 296,00</td>
                        </tr>
                      </tbody>
                    </table>
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
            alert('Excel export would happen here');
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Set focus to the report title input on load
          window.onload = function() {
            document.querySelector('input[value="Kundstatistik"]').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openCustomerStatistics };