const openAccountPlan = () => {
  // Open the Account Plan filter panel window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=420,height=250,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Chart of accounts - Filter Panel</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Segoe UI, system-ui, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.3;
            overflow: hidden;
          }
          .container {
            max-width: 420px;
            padding: 12px;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-between { justify-content: space-between; }
          .mb-6 { margin-bottom: 6px; }
          .mb-8 { margin-bottom: 8px; }
          .mb-10 { margin-bottom: 10px; }
          .mr-6 { margin-right: 6px; }
          .ml-6 { margin-left: 6px; }
          .gap-6 { gap: 6px; }
          .gap-18 { gap: 18px; }
          .w-12 { width: 12px; }
          .w-14 { width: 14px; }
          .w-20 { width: 20px; }
          .w-120 { min-width: 120px; }
          .h-12 { height: 12px; }
          .h-14 { height: 14px; }
          .h-20 { height: 20px; }
          .h-22 { height: 22px; }
          .text-10 { font-size: 10px; }
          .text-11 { font-size: 11px; }
          .text-12 { font-size: 12px; }
          .text-18 { font-size: 18px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .text-[#000000] { color: #000000; }
          .border { border: 1px solid #000000; }
          .border-[#000000] { border-color: #000000; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#CDE6B8] { background-color: #CDE6B8; }
          .bg-[#E6E6E6] { background-color: #E6E6E6; }
          .bg-[#6FA8DC] { background-color: #6FA8DC; }
          .rounded-2px { border-radius: 2px; }
          select {
            height: 20px;
            min-width: 120px;
            padding: 2px 6px;
            font-size: 11px;
            font-family: Arial, Segoe UI, system-ui, sans-serif;
            border: 1px solid #000000;
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
          .btn {
            height: 22px;
            padding: 0 10px;
            border: 1px solid #000000;
            border-radius: 2px;
            font-size: 11px;
            color: #000000;
            cursor: pointer;
          }
          .btn-show-screen { background-color: #CDE6B8; }
          .btn-show-pdf { background-color: #CDE6B8; }
          .btn-show-txt { background-color: #CDE6B8; }
          .btn-cancel { background-color: #E6E6E6; }
          .mr-6-btn { margin-right: 6px; }
          .accounts-selector {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          .itemised-group {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
          }
          .info-icon {
            width: 14px;
            height: 14px;
            background-color: #6FA8DC;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-size: 10px;
            font-weight: bold;
            margin-left: 6px;
          }
          .radio-group {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 18px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Accounts selector -->
          <div class="accounts-selector">
            <label class="text-11 text-[#000000] mr-6">Accounts</label>
            <select id="accounts-select">
              <option value="all">All</option>
              <option value="assets">Assets</option>
              <option value="liabilities">Liabilities</option>
              <option value="equity">Equity</option>
              <option value="revenue">Revenue</option>
              <option value="expenses">Expenses</option>
            </select>
          </div>

          <!-- Itemised checkbox -->
          <div class="itemised-group">
            <input type="checkbox" id="itemised" />
            <label for="itemised" class="ml-6 text-11 text-[#000000]">Itemised</label>
            <div class="info-icon">i</div>
          </div>

          <!-- Orientation radio buttons -->
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

          <!-- Action buttons -->
          <div class="flex">
            <button id="show-on-screen" class="btn btn-show-screen mr-6-btn">Show on screen</button>
            <button id="show-pdf" class="btn btn-show-pdf mr-6-btn">Show PDF</button>
            <button id="show-txt" class="btn btn-show-txt mr-6-btn">Show TXT</button>
            <button id="cancel" class="btn btn-cancel">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get values from the form
            const accountsValue = document.getElementById('accounts-select').value;
            const itemised = document.getElementById('itemised').checked;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the chart of accounts report in a new window
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
                  <title>Chart of accounts</title>
                  <style>
                    body { 
                      margin: 24px 32px; 
                      font-family: Arial, Segoe UI, system-ui, sans-serif; 
                      font-size: 10.5px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.25;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      margin-bottom: 18px;
                    }
                    .left-header { text-align: left; }
                    .center-header { 
                      position: absolute; 
                      left: 50%; 
                      transform: translateX(-50%); 
                      font-size: 18px; 
                    }
                    .right-header { text-align: right; }
                    .text-10 { font-size: 10px; }
                    .text-11 { font-size: 11px; }
                    .text-12 { font-size: 12px; }
                    .text-18 { font-size: 18px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .table-container { margin-top: 18px; }
                    table { 
                      width: 100%; 
                      border-collapse: collapse; 
                    }
                    th { 
                      font-weight: normal; 
                      padding: 0 0 4px 0; 
                      text-align: left; 
                      border-bottom: 1px solid #000000;
                      font-size: 10.5px;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 4px 0;
                      font-size: 10.5px;
                      height: 22px;
                    }
                    .account-col { width: 70px; text-align: left; }
                    .designation-col { text-align: left; }
                    .vat-code-col { width: 60px; text-align: center; }
                    .sru-col { width: 60px; text-align: right; }
                    .numeric-right { text-align: right; }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <!-- Left Header Block -->
                    <div class="left-header">
                      <div class="text-12">Test company</div>
                    </div>

                    <!-- Center Title -->
                    <div class="center-header">
                      Chart of accounts
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-10">Printed 2026-01-19 17:24</div>
                    </div>
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th class="account-col">Account</th>
                          <th class="designation-col">Designation</th>
                          <th class="vat-code-col">VAT Code</th>
                          <th class="sru-col">SRU</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="account-col">100</td>
                          <td class="designation-col">Cash100</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">101</td>
                          <td class="designation-col">Bank account</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">102</td>
                          <td class="designation-col">Accounts receivable</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">103</td>
                          <td class="designation-col">Inventory</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">104</td>
                          <td class="designation-col">Prepaid expenses</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">110</td>
                          <td class="designation-col">Short-term investments</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">120</td>
                          <td class="designation-col">Equipment</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">121</td>
                          <td class="designation-col">Furniture</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">122</td>
                          <td class="designation-col">Vehicles</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">130</td>
                          <td class="designation-col">Buildings</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">131</td>
                          <td class="designation-col">Land</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">1311</td>
                          <td class="designation-col">Shares in listed Swedish group companies</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col">7230</td>
                        </tr>
                        <tr>
                          <td class="account-col">200</td>
                          <td class="designation-col">Accounts payable</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">201</td>
                          <td class="designation-col">Short-term debt</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">210</td>
                          <td class="designation-col">Long-term debt</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">300</td>
                          <td class="designation-col">Share capital</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">310</td>
                          <td class="designation-col">Retained earnings</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">400</td>
                          <td class="designation-col">Sales revenue</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">401</td>
                          <td class="designation-col">Service revenue</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">500</td>
                          <td class="designation-col">Cost of goods sold</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">510</td>
                          <td class="designation-col">Salaries and wages</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">520</td>
                          <td class="designation-col">Rent expense</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">530</td>
                          <td class="designation-col">Utilities</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">540</td>
                          <td class="designation-col">Marketing expenses</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
                        </tr>
                        <tr>
                          <td class="account-col">550</td>
                          <td class="designation-col">Office supplies</td>
                          <td class="vat-code-col"></td>
                          <td class="sru-col"></td>
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
          
          document.getElementById('show-txt').onclick = function() {
            alert('TXT generation would happen here');
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Set focus to the accounts dropdown on load
          window.onload = function() {
            document.getElementById('accounts-select').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openAccountPlan };