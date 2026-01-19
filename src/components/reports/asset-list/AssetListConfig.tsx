const openAssetList = () => {
  // Open the Asset List filter page window
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
        <title>Asset List - Report Criteria</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 12px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.3;
            width: 1024px;
            overflow: auto;
          }
          .container {
            padding: 16px;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .justify-end { justify-content: flex-end; }
          .mb-6 { margin-bottom: 6px; }
          .mb-8 { margin-bottom: 8px; }
          .mr-6 { margin-right: 6px; }
          .ml-4 { margin-left: 4px; }
          .mt-6 { margin-top: 6px; }
          .mt-8 { margin-top: 8px; }
          .gap-4 { gap: 4px; }
          .gap-6 { gap: 6px; }
          .w-12 { width: 12px; }
          .w-14 { width: 14px; }
          .w-120 { width: 120px; }
          .w-180 { width: 180px; }
          .h-12 { height: 12px; }
          .h-14 { height: 14px; }
          .h-22 { height: 22px; }
          .h-26 { height: 26px; }
          .text-10 { font-size: 10px; }
          .text-11 { font-size: 11px; }
          .text-12 { font-size: 12px; }
          .text-18 { font-size: 18px; }
          .text-bold { font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .text-[#000000] { color: #000000; }
          .text-[#333333] { color: #333333; }
          .border { border: 1px solid #9E9E9E; }
          .border-[#9E9E9E] { border-color: #9E9E9E; }
          .border-[#6AA84F] { border-color: #6AA84F; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#C6E6B8] { background-color: #C6E6B8; }
          input[type="text"],
          select {
            height: 22px;
            border: 1px solid #9E9E9E;
            padding: 0 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          input[type="text"] {
            width: 120px;
          }
          select {
            width: 180px;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            accent-color: #2F6FDE;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
            accent-color: #2F6FDE;
          }
          .btn {
            height: 26px;
            padding: 6px 10px;
            border: 1px solid #6AA84F;
            background-color: #C6E6B8;
            color: #000000;
            font-size: 12px;
            cursor: pointer;
            border-radius: 0;
          }
          .btn:hover {
            background-color: #B7DDA6;
          }
          .mr-6-btn { margin-right: 6px; }
          .radio-group {
            display: flex;
            align-items: center;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 16px;
          }
          .checkbox-group {
            display: flex;
            align-items: center;
          }
          .calendar-icon {
            width: 14px;
            height: 14px;
            color: #2F6FDE;
            margin-left: 4px;
          }
          .arrow-icon {
            color: #333333;
            font-size: 8px;
          }
          .divider {
            height: 1px;
            background-color: #9E9E9E;
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Date Field -->
          <div class="mb-6">
            <div class="text-11 text-[#000000] mb-6">Date</div>
            <div class="flex items-center">
              <input type="text" id="date-field" value="2026-01-19" class="text-12" />
              <span class="calendar-icon">📅</span>
            </div>
          </div>

          <!-- One Series -->
          <div class="mb-6">
            <div class="text-11 text-[#000000] mb-6">One Series</div>
            <select id="one-series" class="text-12">
              <option>Active & Fully Depreciated</option>
              <option>All</option>
              <option>Active</option>
              <option>Fully Depreciated</option>
            </select>
          </div>

          <!-- Order by -->
          <div class="mb-6">
            <div class="text-11 text-[#000000] mb-6">Order by</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="order-number" name="order-by" checked />
                <label for="order-number" class="ml-4 text-12 text-[#000000]">Number</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="order-name" name="order-by" />
                <label for="order-name" class="ml-4 text-12 text-[#000000]">Name</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="order-account" name="order-by" />
                <label for="order-account" class="ml-4 text-12 text-[#000000]">Account</label>
              </div>
            </div>
          </div>

          <!-- Grouped by account -->
          <div class="mb-6">
            <div class="checkbox-group">
              <input type="checkbox" id="grouped-by-account" checked />
              <label for="grouped-by-account" class="ml-4 text-12 text-[#000000]">Grouped by account</label>
            </div>
          </div>

          <div class="divider"></div>

          <!-- Asset type -->
          <div class="mb-6">
            <div class="text-11 text-[#000000] mb-6">Asset type</div>
            <select id="asset-type" class="text-12">
              <option value="">All</option>
              <option value="vehicles">Vehicles</option>
              <option value="machinery">Machinery</option>
              <option value="equipment">Equipment</option>
              <option value="furniture">Furniture</option>
            </select>
          </div>

          <!-- Orientation -->
          <div class="mb-6">
            <div class="text-11 text-[#000000] mb-6">Orientation</div>
            <div class="radio-group">
              <div class="radio-option">
                <input type="radio" id="portrait" name="orientation" checked />
                <label for="portrait" class="ml-4 text-12 text-[#000000]">Portrait</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="landscape" name="orientation" />
                <label for="landscape" class="ml-4 text-12 text-[#000000]">Landscape</label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex mt-8">
            <button id="show-on-screen" class="btn mr-6-btn">Show on screen</button>
            <button id="show-pdf" class="btn mr-6-btn">Show PDF</button>
            <button id="show-txt" class="btn mr-6-btn">Show TXT</button>
            <button id="cancel" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get values from the form
            const dateValue = document.getElementById('date-field').value;
            const oneSeries = document.getElementById('one-series').value;
            const orderBy = document.querySelector('input[name="order-by"]:checked').id.replace('order-', '');
            const groupedByAccount = document.getElementById('grouped-by-account').checked;
            const assetType = document.getElementById('asset-type').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the asset list report in a new window
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
                  <title>Asset List</title>
                  <style>
                    body { 
                      margin: 20mm 15mm; 
                      font-family: Arial, Helvetica, sans-serif; 
                      font-size: 11px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.3;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      margin-bottom: 20px;
                    }
                    .left-header { text-align: left; }
                    .center-header { 
                      position: absolute; 
                      left: 50%; 
                      transform: translateX(-50%); 
                      font-size: 18px; 
                      font-weight: bold; 
                    }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-10 { font-size: 10px; }
                    .text-11 { font-size: 11px; }
                    .text-12 { font-size: 12px; }
                    .text-18 { font-size: 18px; }
                    .mt-6 { margin-top: 6px; }
                    .mb-6 { margin-bottom: 6px; }
                    .pb-4 { padding-bottom: 4px; }
                    .pt-6 { padding-top: 6px; }
                    .pt-16 { padding-top: 16px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .table-container { margin-top: 20px; }
                    table { 
                      width: 100%; 
                      border-collapse: collapse; 
                    }
                    th { 
                      font-weight: bold; 
                      padding: 4px; 
                      text-align: left; 
                      border-bottom: 1px solid #000000;
                      font-size: 11px;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 4px;
                      font-size: 11px;
                    }
                    .account-header {
                      font-weight: bold;
                      padding: 6px 4px 4px 4px;
                      border-top: 1px solid #000000;
                      font-size: 11px;
                    }
                    .account-total {
                      font-weight: bold;
                      padding: 6px 4px;
                      border-top: 1px solid #000000;
                      font-size: 11px;
                    }
                    .final-summary {
                      font-weight: bold;
                      font-size: 12px;
                      border-top: 2px solid #000000;
                      padding-top: 16px;
                      margin-top: 16px;
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <!-- Left Header Block -->
                    <div class="left-header">
                      <div class="text-11">Test company</div>
                      <div class="text-11 mt-6">Period 2026-01-01 - 2026-01-19</div>
                      <div class="text-11">Selection: \${oneSeries}</div>
                    </div>

                    <!-- Center Title -->
                    <div class="center-header">
                      Asset list
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-10">Printed</div>
                      <div class="text-10 mt-6">2026-01-19 17:10</div>
                    </div>
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 70px;">Asset no.</th>
                          <th style="width: 220px;">Designation</th>
                          <th class="text-right" style="width: 100px;">Acq. value</th>
                          <th style="width: 90px;">Acq. date</th>
                          <th class="text-right" style="width: 110px;">Acc. write-off</th>
                          <th class="text-right" style="width: 100px;">Book value</th>
                          <th style="width: 80px;">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- Account 1000 - Motor Vehicles -->
                        <tr>
                          <td colspan="7" class="account-header">Account   1000   Motor Vehicle</td>
                        </tr>
                        <tr>
                          <td class="text-11">1</td>
                          <td class="text-11">Brand Logo</td>
                          <td class="text-11 numeric-right">8 000,00</td>
                          <td class="text-11">2025-01-01</td>
                          <td class="text-11 numeric-right">1 833,00</td>
                          <td class="text-11 numeric-right">6 167,00</td>
                          <td class="text-11">Active</td>
                        </tr>
                        <tr>
                          <td class="text-11">2</td>
                          <td class="text-11">Honda CIVIC</td>
                          <td class="text-11 numeric-right">10 000,00</td>
                          <td class="text-11">2025-01-01</td>
                          <td class="text-11 numeric-right">950,00</td>
                          <td class="text-11 numeric-right">9 050,00</td>
                          <td class="text-11">Active</td>
                        </tr>
                        <tr>
                          <td colspan="2" class="account-total">Total</td>
                          <td class="account-total numeric-right">18 000,00</td>
                          <td class="account-total"></td>
                          <td class="account-total numeric-right">2 783,00</td>
                          <td class="account-total numeric-right">15 217,00</td>
                          <td class="account-total"></td>
                        </tr>
                        
                        <!-- Account 1030 - Patents -->
                        <tr>
                          <td colspan="7" class="account-header">Account   1030   Patents</td>
                        </tr>
                        <tr>
                          <td class="text-11">3</td>
                          <td class="text-11">car</td>
                          <td class="text-11 numeric-right">2 000,00</td>
                          <td class="text-11">2025-01-01</td>
                          <td class="text-11 numeric-right">0,00</td>
                          <td class="text-11 numeric-right">2 000,00</td>
                          <td class="text-11">Active</td>
                        </tr>
                        <tr>
                          <td colspan="2" class="account-total">Total</td>
                          <td class="account-total numeric-right">2 000,00</td>
                          <td class="account-total"></td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">2 000,00</td>
                          <td class="account-total"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <!-- Final Summary Section -->
                  <div class="final-summary">
                    <div>Total sum for the period</div>
                    <div class="mt-6">
                      <span style="display: inline-block; width: 100px;">Acq. value</span>
                      <span style="display: inline-block; width: 110px;">Acc. write-off</span>
                      <span style="display: inline-block; width: 100px;">Book value</span>
                    </div>
                    <div>
                      <span style="display: inline-block; width: 100px;" class="numeric-right">20 000,00</span>
                      <span style="display: inline-block; width: 110px;" class="numeric-right">2 783,00</span>
                      <span style="display: inline-block; width: 100px;" class="numeric-right">17 217,00</span>
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
            alert('PDF generation would happen here');
          };
          
          document.getElementById('show-txt').onclick = function() {
            alert('TXT generation would happen here');
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Set focus to the date field on load
          window.onload = function() {
            document.getElementById('date-field').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openAssetList };