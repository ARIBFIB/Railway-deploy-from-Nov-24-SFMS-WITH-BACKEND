// Export a function that opens the account analysis configuration window
const openAccountAnalysisConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=460,height=320,scrollbars=no,resizable=yes'
  );
  
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Account Analysis Report Configuration</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 12px; 
            color: #000000; 
            background-color: #FFFFFF; 
            overflow: hidden;
          }
          .container {
            padding: 10px 12px 12px 12px;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .mb-10 { margin-bottom: 10px; }
          .mb-12 { margin-bottom: 12px; }
          .mr-8 { margin-right: 8px; }
          .mr-6 { margin-right: 6px; }
          .mx-6 { margin-left: 6px; margin-right: 6px; }
          .ml-4 { margin-left: 4px; }
          .w-60 { width: 60px; }
          .w-90 { width: 90px; }
          .w-14 { width: 14px; }
          .w-16 { width: 16px; }
          .h-18 { height: 18px; }
          .h-14 { height: 14px; }
          .h-16 { height: 16px; }
          .h-24 { height: 24px; }
          .h-36 { height: 36px; }
          .h-54 { height: 54px; }
          .w-420 { width: 420px; }
          .text-12 { font-size: 12px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-[#000000] { color: #000000; }
          .border { border: 1px solid #000000; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#FFEB3B] { background-color: #FFEB3B; }
          .bg-[#E6F0FA] { background-color: #E6F0FA; }
          .bg-[#DFF0D8] { background-color: #DFF0D8; }
          .border-[#6AA84F] { border-color: #6AA84F; }
          .rounded-2px { border-radius: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-2 { padding-top: 2px; padding-bottom: 2px; }
          .px-12 { padding-left: 12px; padding-right: 12px; }
          .pt-6 { padding-top: 6px; }
          .pl-10 { padding-left: 10px; }
          .gap-20 { gap: 20px; }
          .gap-6 { gap: 6px; }
          .gap-12 { gap: 12px; }
          input[type="text"] {
            width: 60px;
            height: 18px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            padding: 2px 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
          }
          .date-input {
            width: 90px;
            height: 18px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            padding: 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
          }
          .lookup-btn {
            width: 14px;
            height: 14px;
            background-color: #FFEB3B;
            border: 1px solid #000000;
            color: #000000;
            margin-left: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
          }
          .calendar-btn {
            width: 16px;
            height: 16px;
            background-color: #E6F0FA;
            border: 1px solid #000000;
            color: #000000;
            margin-left: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
          }
          .btn {
            width: 90px;
            height: 24px;
            background-color: #DFF0D8;
            border: 1px solid #6AA84F;
            border-radius: 2px;
            font-size: 12px;
            color: #000000;
            cursor: pointer;
          }
          .btn:hover {
            background-color: #CDE8C6;
          }
          .mr-6-btn { margin-right: 6px; }
          .group-box {
            width: 420px;
            border: 1px solid #000000;
            padding: 6px 10px 0 10px;
            margin-bottom: 10px;
          }
          .sub-group-box {
            width: 420px;
            border: 1px solid #000000;
            padding: 6px 10px 0 10px;
            margin-bottom: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Account Field -->
          <div class="flex items-center mb-10">
            <label class="mr-8 text-12 text-[#000000]">Account</label>
            <div class="flex items-center">
              <input type="text" id="account" value="" placeholder="" class="w-60 h-18 border bg-white px-4 py-2 text-12" />
              <button class="lookup-btn" onclick="document.getElementById('account').focus()">?</button>
            </div>
          </div>

          <!-- Date Range Section -->
          <div class="flex items-center mb-10">
            <label class="mr-8 text-12 text-[#000000]">Date</label>
            <div class="flex items-center">
              <div class="flex items-center mr-6">
                <input type="text" id="start-date" value="2026-01-01" class="date-input" />
                <button class="calendar-btn">📅</button>
              </div>
              <span class="mx-6">-</span>
              <div class="flex items-center">
                <input type="text" id="end-date" value="2026-12-31" class="date-input" />
                <button class="calendar-btn">📅</button>
              </div>
            </div>
          </div>

          <!-- Orientation Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-6">Orientation</div>
            <div class="flex items-center gap-20">
              <div class="flex items-center">
                <input type="radio" id="portrait" name="orientation" />
                <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="landscape" name="orientation" checked />
                <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
              </div>
            </div>
          </div>

          <!-- Balanced Transactions Group Box -->
          <div class="sub-group-box">
            <div class="text-12 text-[#000000] mb-6">Balanced transactions</div>
            <div class="flex flex-col">
              <div class="flex items-center mb-6">
                <input type="checkbox" id="balanced" />
                <label for="balanced" class="ml-6 text-12 text-[#000000]">Balanced transactions</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="non-balanced" />
                <label for="non-balanced" class="ml-6 text-12 text-[#000000]">Non-balanced transactions</label>
              </div>
            </div>
          </div>

          <!-- Show Group Box -->
          <div class="sub-group-box">
            <div class="text-12 text-[#000000] mb-6">Show</div>
            <div class="flex items-center">
              <input type="checkbox" id="show-checked" />
              <label for="show-checked" class="ml-6 text-12 text-[#000000]">Visa strukna rader</label>
            </div>
          </div>

          <!-- Action Buttons Row -->
          <div class="flex justify-center">
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
            const account = document.getElementById('account').value;
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            
            // Open the account analysis report in a new window
            const reportWindow = window.open(
              '', 
              '_blank', 
              'width=1100,height=700,scrollbars=yes,resizable=yes'
            );
            
            if (reportWindow) {
              reportWindow.document.write("<!DOCTYPE html>\\n<html>\\n<head>\\n  <meta charset=\\\"utf-8\\\" />\\n  <title>Account Analysis Report</title>\\n  <style>\\n    body { \\n      margin: 0; \\n      padding: 0; \\n      font-family: Arial, Helvetica, sans-serif; \\n      font-size: 12px; \\n      color: #000000; \\n      background-color: #FFFFFF; \\n      line-height: 1.2;\\n      overflow: auto;\\n    }\\n    .header-area { \\n      display: flex; \\n      justify-content: space-between; \\n      align-items: flex-start; \\n      padding: 12px; \\n    }\\n    .left-header { text-align: left; }\\n    .center-title { \\n      position: absolute; \\n      left: 50%; \\n      transform: translateX(-50%); \\n      top: 10px; \\n      font-size: 32px; \\n      font-weight: normal; \\n    }\\n    .center-subtitle { \\n      position: absolute; \\n      left: 50%; \\n      transform: translateX(-50%); \\n      top: 50px; \\n      font-size: 14px; \\n      font-weight: normal; \\n      text-align: center;\\n      margin-top: 6px;\\n    }\\n    .right-header { text-align: right; }\\n    .bold { font-weight: bold; }\\n    .text-13 { font-size: 13px; }\\n    .text-12 { font-size: 12px; }\\n    .text-11 { font-size: 11px; }\\n    .text-14 { font-size: 14px; }\\n    .text-32 { font-size: 32px; }\\n    .mt-12 { margin-top: 12px; }\\n    .mt-6 { margin-top: 6px; }\\n    .ml-12 { margin-left: 12px; }\\n    .mr-12 { margin-right: 12px; }\\n    .text-center { text-align: center; }\\n    .text-right { text-align: right; }\\n    .text-left { text-align: left; }\\n    .table-container { padding: 0 12px 12px 12px; }\\n    table { \\n      width: 100%; \\n      border-collapse: collapse; \\n    }\\n    th { \\n      font-weight: normal; \\n      padding-bottom: 6px; \\n      text-align: left; \\n      border-bottom: 1px solid #000000;\\n    }\\n    td { \\n      vertical-align: top; \\n    }\\n    .account-header { \\n      font-weight: bold; \\n      padding-top: 6px; \\n      font-size: 12px;\\n    }\\n    .opening-balance { \\n      font-size: 12px; \\n    }\\n    .separator-line { \\n      height: 1px; \\n      background-color: #000000; \\n      margin: 6px 0;\\n    }\\n    .enclosure-row { \\n      font-size: 12px; \\n    }\\n    .closing-balance { \\n      font-size: 12px; \\n    }\\n    .account-total { \\n      font-weight: bold; \\n      border-top: 1px solid #000000; \\n      padding-top: 6px; \\n      font-size: 12px;\\n    }\\n    .numeric-right { \\n      text-align: right; \\n    }\\n  </style>\\n</head>\\n<body>\\n  <!-- Header Area -->\\n  <div class=\\\"header-area\\\">\\n    <!-- Left Header Block -->\\n    <div class=\\\"left-header\\\">\\n      <div class=\\\"bold text-13\\\">Test company</div>\\n      <div class=\\\"text-12\\\">Financial Year 2026-01-01 - 2026-12-31</div>\\n      <div class=\\\"text-12\\\">Period 2026-01-01 - 2026-12-31</div>\\n    </div>\\n\\n    <!-- Center Title Block -->\\n    <div class=\\\"center-title\\\">\\n      Account<br>analysis\\n    </div>\\n    <div class=\\\"center-subtitle\\\">\\n      1000 - Motor Vehicle\\n    </div>\\n\\n    <!-- Right Header Block -->\\n    <div class=\\\"right-header\\\">\\n      <div class=\\\"text-11\\\">Printed 2026-01-18 10:09</div>\\n      <div class=\\\"text-11\\\">Latest version A 6 B 3 F 3 M 1</div>\\n    </div>\\n  </div>\\n\\n  <!-- Table Structure -->\\n  <div class=\\\"table-container\\\">\\n    <table>\\n      <thead>\\n        <tr>\\n          <th style=\\\"width: 80px;\\\">Account</th>\\n          <th style=\\\"width: 160px;\\\">Name</th>\\n          <th style=\\\"width: 90px;\\\">Date</th>\\n          <th>Text</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 90px;\\\">Debit</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 90px;\\\">Credit</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 110px;\\\">Balance</th>\\n        </tr>\\n      </thead>\\n      <tbody>\\n        <!-- Account Section -->\\n        <tr>\\n          <td colspan=\\\"7\\\">\\n            <div class=\\\"account-header\\\">1000 Motor Vehicle</div>\\n          </td>\\n        </tr>\\n        \\n        <!-- Opening Balance Rows -->\\n        <tr>\\n          <td class=\\\"text-12\\\">1000</td>\\n          <td class=\\\"text-12\\\">Motor Vehicle</td>\\n          <td class=\\\"text-12\\\">2026-01-01</td>\\n          <td class=\\\"text-12\\\">Opening balance</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">50,000.00</td>\\n        </tr>\\n        <tr>\\n          <td class=\\\"text-12\\\">1000</td>\\n          <td class=\\\"text-12\\\">Motor Vehicle</td>\\n          <td class=\\\"text-12\\\">2026-01-01</td>\\n          <td class=\\\"text-12\\\">Opening balance</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">50,000.00</td>\\n        </tr>\\n        \\n        <!-- Separator Line -->\\n        <tr>\\n          <td colspan=\\\"7\\\">\\n            <div class=\\\"separator-line\\\"></div>\\n          </td>\\n        </tr>\\n        \\n        <!-- Transaction Rows -->\\n        <tr>\\n          <td class=\\\"text-12\\\">1000</td>\\n          <td class=\\\"text-12\\\">Motor Vehicle</td>\\n          <td class=\\\"text-12\\\">2026-03-15</td>\\n          <td class=\\\"text-12\\\">Purchase of vehicle</td>\\n          <td class=\\\"text-right text-12\\\">10,000.00</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">60,000.00</td>\\n        </tr>\\n        <tr>\\n          <td class=\\\"text-12\\\">1000</td>\\n          <td class=\\\"text-12\\\">Motor Vehicle</td>\\n          <td class=\\\"text-12\\\">2026-06-20</td>\\n          <td class=\\\"text-12\\\">Maintenance</td>\\n          <td class=\\\"text-right text-12\\\">2,500.00</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">62,500.00</td>\\n        </tr>\\n        \\n        <!-- Closing Section -->\\n        <tr>\\n          <td class=\\\"text-12\\\">1000</td>\\n          <td class=\\\"text-12\\\">Motor Vehicle</td>\\n          <td class=\\\"text-12\\\">2026-12-31</td>\\n          <td class=\\\"text-12\\\">Enclosure</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n        </tr>\\n        <tr>\\n          <td class=\\\"text-12\\\">1000</td>\\n          <td class=\\\"text-12\\\">Motor Vehicle</td>\\n          <td class=\\\"text-12\\\">2026-12-31</td>\\n          <td class=\\\"text-12\\\">Closing balance</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">0.00</td>\\n          <td class=\\\"text-right text-12\\\">62,500.00</td>\\n        </tr>\\n        \\n        <!-- Totals Section -->\\n        <tr>\\n          <td class=\\\"account-total\\\" colspan=\\\"4\\\">Account total</td>\\n          <td class=\\\"text-right account-total text-12\\\">12,500.00</td>\\n          <td class=\\\"text-right account-total text-12\\\">0.00</td>\\n          <td class=\\\"text-right account-total text-12\\\">62,500.00</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n  </div>\\n</body>\\n</html>");
              
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
          
          // Set focus to the account field on load
          window.onload = function() {
            document.getElementById('account').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export default openAccountAnalysisConfig;