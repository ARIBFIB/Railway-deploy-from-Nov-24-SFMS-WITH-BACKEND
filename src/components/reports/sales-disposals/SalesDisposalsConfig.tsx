const openSalesDisposals = () => {
  // Open the Sales & Disposals parameter panel window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=680,height=500,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Sales & Disposals – Report Parameter Panel</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.3;
            overflow: hidden;
          }
          .container {
            width: 680px;
            padding: 12px;
            margin-top: 8px;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .justify-end { justify-content: flex-end; }
          .mb-10 { margin-bottom: 10px; }
          .mb-8 { margin-bottom: 8px; }
          .mb-6 { margin-bottom: 6px; }
          .mb-4 { margin-bottom: 4px; }
          .mr-6 { margin-right: 6px; }
          .mr-8 { margin-right: 8px; }
          .ml-4 { margin-left: 4px; }
          .ml-6 { margin-left: 6px; }
          .mt-6 { margin-top: 6px; }
          .mt-8 { margin-top: 8px; }
          .mt-10 { margin-top: 10px; }
          .mt-14 { margin-top: 14px; }
          .gap-8 { gap: 8px; }
          .gap-10 { gap: 10px; }
          .gap-14 { gap: 14px; }
          .gap-16 { gap: 16px; }
          .w-13 { width: 13px; }
          .w-12 { width: 12px; }
          .w-110 { width: 110px; }
          .w-120 { width: 120px; }
          .w-240 { width: 240px; }
          .w-92 { width: 92px; }
          .min-w-92 { min-width: 92px; }
          .h-13 { height: 13px; }
          .h-12 { height: 12px; }
          .h-22 { height: 22px; }
          .h-26 { height: 26px; }
          .text-9 { font-size: 9px; }
          .text-10 { font-size: 10px; }
          .text-11 { font-size: 11px; }
          .text-12 { font-size: 12px; }
          .text-bold { font-weight: bold; }
          .font-medium { font-weight: 500; }
          .font-semibold { font-weight: 600; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .text-[#000000] { color: #000000; }
          .text-[#333333] { color: #333333; }
          .text-[#1A73E8] { color: #1A73E8; }
          .border { border: 1px solid #9E9E9E; }
          .border-[#9E9E9E] { border-color: #9E9E9E; }
          .border-[#7FBF7F] { border-color: #7FBF7F; }
          .border-b-solid-black { border-bottom: 1px solid #000000; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#DFF0D8] { background-color: #DFF0D8; }
          .rounded-2px { border-radius: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-2 { padding-top: 2px; padding-bottom: 2px; }
          .pl-6 { padding-left: 6px; }
          .pt-8 { padding-top: 8px; }
          input[type="text"],
          select {
            height: 22px;
            border: 1px solid #9E9E9E;
            border-radius: 2px;
            padding: 2px 6px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          input[type="text"] {
            width: 110px;
          }
          select {
            width: 120px;
          }
          input[type="checkbox"] {
            width: 13px;
            height: 13px;
            accent-color: #1A73E8;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            accent-color: #1A73E8;
          }
          .btn {
            height: 26px;
            min-width: 92px;
            padding: 0 10px;
            border-radius: 2px;
            font-size: 11px;
            font-weight: 600;
            color: #000000;
            border: 1px solid #7FBF7F;
            background-color: #DFF0D8;
            cursor: pointer;
          }
          .btn:hover {
            background-color: #C8E6C9;
            border: 1px solid #6FB06F;
          }
          .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .radio-group {
            display: flex;
            align-items: center;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 16px;
          }
          .asset-type-select {
            width: 240px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Field Group 1: Current Financial Year -->
          <div class="checkbox-group">
            <input type="checkbox" id="current-year" />
            <label for="current-year" class="ml-6 text-11 text-[#000000]">Current financial year</label>
          </div>

          <!-- Field Group 2: Date Range -->
          <div class="mb-10">
            <div class="text-11 mb-4">Date</div>
            <div class="flex items-center">
              <input type="text" id="from-date" value="2026-01-01" class="text-11" />
              <span class="mx-6">-</span>
              <input type="text" id="to-date" value="2026-12-31" class="text-11" />
            </div>
          </div>

          <!-- Field Group 3: One Series -->
          <div class="mb-10">
            <div class="text-11 mb-4">One Series</div>
            <select id="one-series" class="text-11">
              <option>All</option>
              <option>Series A</option>
              <option>Series B</option>
              <option>Series C</option>
            </select>
          </div>

          <!-- Field Group 4: Order By -->
          <div class="mb-10">
            <div class="text-11 mb-4">Order by</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="order-number" name="order-by" checked />
                <label for="order-number" class="ml-6 text-11 text-[#000000]">Number</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="order-name" name="order-by" />
                <label for="order-name" class="ml-6 text-11 text-[#000000]">Name</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="order-date" name="order-by" />
                <label for="order-date" class="ml-6 text-11 text-[#000000]">Sale date</label>
              </div>
            </div>
          </div>

          <!-- Field Group 5: Asset Type -->
          <div class="mb-10">
            <div class="text-11 mb-4">Asset type</div>
            <select id="asset-type" class="asset-type-select text-11">
              <option value="">All</option>
              <option value="machinery">Machinery</option>
              <option value="vehicles">Vehicles</option>
              <option value="equipment">Equipment</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>

          <!-- Field Group 6: Orientation -->
          <div class="mb-10">
            <div class="text-11 mb-4">Orientation</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="portrait" name="orientation" checked />
                <label for="portrait" class="ml-6 text-11 text-[#000000]">Portrait</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="landscape" name="orientation" />
                <label for="landscape" class="ml-6 text-11 text-[#000000]">Landscape</label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex mt-14">
            <button id="show-on-screen" class="btn mr-8">Show on screen</button>
            <button id="show-pdf" class="btn mr-8">Show PDF</button>
            <button id="show-txt" class="btn mr-8">Show TXT</button>
            <button id="cancel" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get values from the form
            const currentYear = document.getElementById('current-year').checked;
            const fromDate = document.getElementById('from-date').value;
            const toDate = document.getElementById('to-date').value;
            const oneSeries = document.getElementById('one-series').value;
            const orderBy = document.querySelector('input[name="order-by"]:checked').id.replace('order-', '');
            const assetType = document.getElementById('asset-type').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the sales and disposals report in a new window
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
                  <title>Sales and Disposals Report</title>
                  <style>
                    body { 
                      margin: 20px 16px; 
                      font-family: Arial, Helvetica, sans-serif; 
                      font-size: 10px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.2;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      margin-bottom: 6px;
                    }
                    .left-header { text-align: left; }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .font-semibold { font-weight: 600; }
                    .text-9 { font-size: 9px; }
                    .text-10 { font-size: 10px; }
                    .text-12 { font-size: 12px; }
                    .mt-6 { margin-top: 6px; }
                    .ml-12 { margin-left: 12px; }
                    .mr-12 { margin-right: 12px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .divider { 
                      height: 1px; 
                      background-color: #000000; 
                      margin: 6px 0;
                    }
                    .table-container { margin-top: 12px; }
                    table { 
                      width: 100%; 
                      border-collapse: collapse; 
                    }
                    th { 
                      font-weight: 600; 
                      font-size: 9px;
                      padding: 4px 6px; 
                      text-align: left; 
                      border-bottom: 1px solid #000000;
                      background-color: #FFFFFF;
                    }
                    td { 
                      vertical-align: top; 
                      font-size: 9px;
                      padding: 4px 6px;
                      background-color: #FFFFFF;
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                    .totals-row {
                      border-top: 1px solid #000000;
                      padding-top: 4px;
                    }
                    .final-summary {
                      margin-top: 6px;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <!-- Left Header Block -->
                    <div class="left-header">
                      <div class="bold text-12">Test company</div>
                      <div class="text-10">Period \${fromDate} – \${toDate}</div>
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-9 font-semibold">Sales and disposals</div>
                      <div class="text-9">Printed 2026-01-19 16:38</div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="divider"></div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th class="text-left" style="width: 90px;">Disposal date</th>
                          <th class="text-left" style="width: 60px;">Asset no.</th>
                          <th class="text-left" style="width: 160px;">Designation</th>
                          <th class="text-left" style="width: 90px;">Acq. date</th>
                          <th class="text-right" style="width: 90px;">Acq. value</th>
                          <th class="text-right" style="width: 100px;">Acc. write-off</th>
                          <th class="text-right" style="width: 90px;">Sale price</th>
                          <th class="text-left" style="width: 70px;">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-9">2026-03-15</td>
                          <td class="text-9">101</td>
                          <td class="text-9">Delivery Truck</td>
                          <td class="text-9">2024-05-15</td>
                          <td class="text-9 numeric-right">450 000,00</td>
                          <td class="text-9 numeric-right">90 000,00</td>
                          <td class="text-9 numeric-right">320 000,00</td>
                          <td class="text-9">Sold</td>
                        </tr>
                        <tr>
                          <td class="text-9">2026-04-22</td>
                          <td class="text-9">102</td>
                          <td class="text-9">Office Computer</td>
                          <td class="text-9">2025-03-10</td>
                          <td class="text-9 numeric-right">25 000,00</td>
                          <td class="text-9 numeric-right">8 333,33</td>
                          <td class="text-9 numeric-right">15 000,00</td>
                          <td class="text-9">Sold</td>
                        </tr>
                        <tr>
                          <td class="text-9">2026-06-10</td>
                          <td class="text-9">103</td>
                          <td class="text-9">Furniture Set</td>
                          <td class="text-9">2023-11-22</td>
                          <td class="text-9 numeric-right">75 000,00</td>
                          <td class="text-9 numeric-right">56 250,00</td>
                          <td class="text-9 numeric-right">18 000,00</td>
                          <td class="text-9">Sold</td>
                        </tr>
                        <tr>
                          <td class="text-9">2026-08-05</td>
                          <td class="text-9">104</td>
                          <td class="text-9">Cash Register</td>
                          <td class="text-9">2025-08-05</td>
                          <td class="text-9 numeric-right">12 000,00</td>
                          <td class="text-9 numeric-right">3 000,00</td>
                          <td class="text-9 numeric-right">8 000,00</td>
                          <td class="text-9">Sold</td>
                        </tr>
                        <tr>
                          <td class="text-9">2026-09-18</td>
                          <td class="text-9">105</td>
                          <td class="text-9">Printer</td>
                          <td class="text-9">2024-01-18</td>
                          <td class="text-9 numeric-right">8 000,00</td>
                          <td class="text-9 numeric-right">5 333,33</td>
                          <td class="text-9 numeric-right">2 500,00</td>
                          <td class="text-9">Sold</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr class="totals-row">
                          <td class="text-9 font-semibold" colspan="4">Total</td>
                          <td class="text-9 font-semibold numeric-right">570 000,00</td>
                          <td class="text-9 font-semibold numeric-right">162 916,66</td>
                          <td class="text-9 font-semibold numeric-right">363 500,00</td>
                          <td class="text-9"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  <!-- Final Summary Line -->
                  <div class="final-summary text-9 font-semibold">
                    Total sum for the period: Acq. value: 570 000,00 | Acc. write-off: 162 916,66 | Sale price: 363 500,00
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
          
          // Set focus to the current year checkbox on load
          window.onload = function() {
            document.getElementById('current-year').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openSalesDisposals };