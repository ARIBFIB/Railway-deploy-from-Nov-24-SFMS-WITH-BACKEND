const openDepreciationPerMonth = () => {
  // Open the Depreciation per Month filter panel window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=420,height=300,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Depreciation per Month - Filter Panel</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Segoe UI, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.3;
            overflow: hidden;
          }
          .container {
            width: 420px;
            padding: 12px;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .justify-end { justify-content: flex-end; }
          .mb-8 { margin-bottom: 8px; }
          .mb-10 { margin-bottom: 10px; }
          .mb-12 { margin-bottom: 12px; }
          .mr-6 { margin-right: 6px; }
          .ml-6 { margin-left: 6px; }
          .mt-2 { margin-top: 2px; }
          .mt-4 { margin-top: 4px; }
          .gap-6 { gap: 6px; }
          .gap-16 { gap: 16px; }
          .w-12 { width: 12px; }
          .w-14 { width: 14px; }
          .w-110 { width: 110px; }
          .h-12 { height: 12px; }
          .h-14 { height: 14px; }
          .h-20 { height: 20px; }
          .h-22 { height: 22px; }
          .text-10 { font-size: 10px; }
          .text-11 { font-size: 11px; }
          .text-12 { font-size: 12px; }
          .text-18 { font-size: 18px; }
          .text-bold { font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .text-[#000000] { color: #000000; }
          .border { border: 1px solid #000000; }
          .border-[#000000] { border-color: #000000; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#CDE6B8] { background-color: #CDE6B8; }
          .bg-[#E6E6E6] { background-color: #E6E6E6; }
          .rounded-2px { border-radius: 2px; }
          input[type="text"] {
            width: 110px;
            height: 20px;
            border: 1px solid #000000;
            padding: 2px 6px;
            font-size: 11px;
            font-family: Arial, Segoe UI, sans-serif;
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
          .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
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
          .calendar-icon {
            width: 14px;
            height: 14px;
            color: #000000;
            margin-left: 6px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Current financial year -->
          <div class="checkbox-group">
            <input type="checkbox" id="current-year" checked />
            <label for="current-year" class="ml-6 text-11 text-[#000000]">Current financial year</label>
          </div>

          <!-- Date range -->
          <div class="mb-10">
            <div class="text-11 text-[#000000] mb-10">Date</div>
            <div class="flex items-center">
              <input type="text" id="from-date" value="2026-01-01" class="text-11" />
              <span class="calendar-icon">📅</span>
              <span class="mx-6">-</span>
              <input type="text" id="to-date" value="2026-12-31" class="text-11" />
              <span class="calendar-icon">📅</span>
            </div>
          </div>

          <!-- Orientation selector -->
          <div class="mb-12">
            <div class="text-11 text-[#000000] mb-4">Orientation</div>
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
            const currentYear = document.getElementById('current-year').checked;
            const fromDate = document.getElementById('from-date').value;
            const toDate = document.getElementById('to-date').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the depreciation per month report in a new window
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
                  <title>Write-offs per month</title>
                  <style>
                    body { 
                      margin: 24px 32px; 
                      font-family: Arial, Segoe UI, sans-serif; 
                      font-size: 10.5px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.3;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      margin-bottom: 16px;
                    }
                    .left-header { text-align: left; }
                    .center-header { 
                      position: absolute; 
                      left: 50%; 
                      transform: translateX(-50%); 
                      font-size: 18px; 
                    }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-10 { font-size: 10px; }
                    .text-11 { font-size: 11px; }
                    .text-12 { font-size: 12px; }
                    .text-18 { font-size: 18px; }
                    .mt-2 { margin-top: 2px; }
                    .mt-20 { margin-top: 20px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .table-container { margin-top: 16px; }
                    table { 
                      width: 100%; 
                      border-collapse: collapse; 
                    }
                    th { 
                      font-weight: normal; 
                      padding: 0 4px 4px 4px; 
                      text-align: left; 
                      border-bottom: 1px solid #000000;
                      font-size: 10.5px;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 4px;
                      font-size: 10.5px;
                      height: 22px;
                    }
                    .account-header {
                      font-weight: bold;
                      padding: 6px 4px 4px 4px;
                      border-bottom: 1px solid #000000;
                      font-size: 10.5px;
                    }
                    .account-total {
                      font-weight: normal;
                      padding: 4px 4px 4px 4px;
                      border-top: 1px solid #000000;
                      padding-top: 4px;
                      font-size: 10.5px;
                    }
                    .final-total {
                      font-weight: normal;
                      font-size: 10.5px;
                      margin-top: 20px;
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                    .month-col {
                      width: 52px;
                      text-align: right;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <!-- Left Header Block -->
                    <div class="left-header">
                      <div class="text-12">Test company</div>
                      <div class="text-11 mt-2">Period \${fromDate} - \${toDate}</div>
                    </div>

                    <!-- Center Title -->
                    <div class="center-header">
                      Write-offs per month
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-10">Printed 2026-01-19 17:20</div>
                    </div>
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 60px;">Asset no.</th>
                          <th style="width: 180px;">Designation</th>
                          <th class="month-col">Jan</th>
                          <th class="month-col">Feb</th>
                          <th class="month-col">Mar</th>
                          <th class="month-col">Apr</th>
                          <th class="month-col">May</th>
                          <th class="month-col">Jun</th>
                          <th class="month-col">Jul</th>
                          <th class="month-col">Aug</th>
                          <th class="month-col">Sep</th>
                          <th class="month-col">Oct</th>
                          <th class="month-col">Nov</th>
                          <th class="month-col">Dec</th>
                          <th class="month-col">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- Account 1000 - Motor Vehicles -->
                        <tr>
                          <td colspan="15" class="account-header">Account    1000    Motor Vehicle</td>
                        </tr>
                        <tr>
                          <td class="text-10.5">1</td>
                          <td class="text-10.5">Brand Logo</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">152,78</td>
                          <td class="text-10.5 numeric-right">1 833,33</td>
                        </tr>
                        <tr>
                          <td class="text-10.5">2</td>
                          <td class="text-10.5">Honda CIVIC</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">79,17</td>
                          <td class="text-10.5 numeric-right">950,00</td>
                        </tr>
                        <tr>
                          <td class="account-total">Total</td>
                          <td class="account-total"></td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">231,95</td>
                          <td class="account-total numeric-right">2 783,33</td>
                        </tr>
                        
                        <!-- Account 1030 - Patents -->
                        <tr>
                          <td colspan="15" class="account-header mt-20">Account    1030    Patents</td>
                        </tr>
                        <tr>
                          <td class="text-10.5">3</td>
                          <td class="text-10.5">car</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                          <td class="text-10.5 numeric-right">0,00</td>
                        </tr>
                        <tr>
                          <td class="account-total">Total</td>
                          <td class="account-total"></td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                          <td class="account-total numeric-right">0,00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <!-- Final Total Section -->
                  <div class="final-total">
                    Total sum for the period
                  </div>
                  <div class="mt-20">
                    <table style="width: 100%;">
                      <tr>
                        <td style="width: 240px;"></td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">231,95</td>
                        <td class="numeric-right" style="width: 52px;">2 783,33</td>
                      </tr>
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

export { openDepreciationPerMonth };