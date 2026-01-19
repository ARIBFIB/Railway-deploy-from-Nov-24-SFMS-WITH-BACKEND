// Export a function that opens the general ledger configuration window
const openGeneralLedgerConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=420,height=240,scrollbars=no,resizable=yes'
  );
  
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>General Ledger Configuration</title>
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
            padding: 12px;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .mb-10 { margin-bottom: 10px; }
          .mb-8 { margin-bottom: 8px; }
          .mr-6 { margin-right: 6px; }
          .mr-8 { margin-right: 8px; }
          .ml-6 { margin-left: 6px; }
          .mt-10 { margin-top: 10px; }
          .gap-6 { gap: 6px; }
          .gap-20 { gap: 20px; }
          .w-60 { width: 60px; }
          .w-70 { width: 70px; }
          .w-90 { width: 90px; }
          .w-16 { width: 16px; }
          .w-380 { width: 380px; }
          .h-20 { height: 20px; }
          .h-16 { height: 16px; }
          .h-24 { height: 24px; }
          .h-42 { height: 42px; }
          .text-12 { font-size: 12px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-[#000000] { color: #000000; }
          .border { border: 1px solid #000000; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#FFF2CC] { background-color: #FFF2CC; }
          .bg-[#E6F0FA] { background-color: #E6F0FA; }
          .bg-[#DFF0D8] { background-color: #DFF0D8; }
          .border-[#6AA84F] { border-color: #6AA84F; }
          .rounded-2px { border-radius: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-2 { padding-top: 2px; padding-bottom: 2px; }
          .pl-10 { padding-left: 10px; }
          .pt-8 { padding-top: 8px; }
          input[type="text"] {
            height: 20px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            padding: 2px 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
          }
          .from-account-input {
            width: 70px;
          }
          .to-account-input {
            width: 70px;
          }
          .from-date-input {
            width: 90px;
          }
          .to-date-input {
            width: 90px;
          }
          .lookup-btn {
            width: 16px;
            height: 16px;
            background-color: #FFF2CC;
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
            width: 380px;
            border: 1px solid #000000;
            padding: 8px 0 0 10px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Account Interval Section -->
          <div class="flex items-center mb-10">
            <label class="w-60 text-12 text-[#000000]">Account</label>
            <div class="flex items-center">
              <input type="text" id="from-account" value="100" class="from-account-input" />
              <button class="lookup-btn">🔍</button>
              <span class="mx-6">-</span>
              <input type="text" id="to-account" value="8999" class="to-account-input" />
              <button class="lookup-btn">🔍</button>
            </div>
          </div>

          <!-- Date Interval Section -->
          <div class="flex items-center mb-10">
            <label class="w-60 text-12 text-[#000000]">Date</label>
            <div class="flex items-center">
              <input type="text" id="from-date" value="2026-01-01" class="from-date-input" />
              <button class="calendar-btn">📅</button>
              <span class="mx-6">-</span>
              <input type="text" id="to-date" value="2026-12-31" class="to-date-input" />
              <button class="calendar-btn">📅</button>
            </div>
          </div>

          <!-- Show Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-8">Show</div>
            <div class="flex items-center">
              <input type="checkbox" id="show-crossed-out" />
              <label for="show-crossed-out" class="ml-6 text-12 text-[#000000]">Show crossed out lines</label>
            </div>
          </div>

          <!-- Orientation Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-8">Orientation</div>
            <div class="flex items-center gap-20">
              <div class="flex items-center">
                <input type="radio" id="portrait" name="orientation" checked />
                <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="landscape" name="orientation" />
                <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-10">
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
            const fromAccount = document.getElementById('from-account').value;
            const toAccount = document.getElementById('to-account').value;
            const fromDate = document.getElementById('from-date').value;
            const toDate = document.getElementById('to-date').value;
            const showCrossedOut = document.getElementById('show-crossed-out').checked;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the general ledger report in a new window
            const reportWindow = window.open(
              '', 
              '_blank', 
              'width=1200,height=800,scrollbars=yes,resizable=yes'
            );
            
            if (reportWindow) {
              reportWindow.document.write("<!DOCTYPE html>\\\\n<html>\\\\n<head>\\\\n  <meta charset=\\\\\\"utf-8\\\\\\" />\\\\n  <title>General Ledger Report</title>\\\\n  <style>\\\\n    body { \\\\\\\\n      margin: 0; \\\\\\\\n      padding: 0; \\\\\\\\n      font-family: Arial, Helvetica, sans-serif; \\\\\\\\n      font-size: 12px; \\\\\\\\n      color: #000000; \\\\\\\\n      background-color: #FFFFFF; \\\\\\\\n      line-height: 1.2;\\\\\\\\n      overflow: auto;\\\\\\\\n    }\\\\n    .header-area { \\\\\\\\n      display: flex; \\\\\\\\n      justify-content: space-between; \\\\\\\\n      align-items: flex-start; \\\\\\\\n      padding: 12px; \\\\\\\\n    }\\\\n    .left-header { text-align: left; }\\\\n    .right-header { text-align: right; }\\\\n    .bold { font-weight: bold; }\\\\n    .text-12 { font-size: 12px; }\\\\n    .text-11 { font-size: 11px; }\\\\n    .mt-12 { margin-top: 12px; }\\\\n    .text-right { text-align: right; }\\\\n    .text-left { text-align: left; }\\\\n    .table-container { padding: 0 12px 12px 12px; }\\\\n    table { \\\\\\\\n      width: 100%; \\\\\\\\n      border-collapse: collapse; \\\\\\\\n    }\\\\n    th { \\\\\\\\n      font-weight: normal; \\\\\\\\n      padding-bottom: 6px; \\\\\\\\n      text-align: left; \\\\\\\\n      border-bottom: 1px solid #000000;\\\\\\\\n    }\\\\n    td { \\\\\\\\n      vertical-align: top; \\\\\\\\n    }\\\\n    .account-header { \\\\\\\\n      font-weight: bold; \\\\\\\\n      font-size: 12px; \\\\\\\\n      padding-top: 10px;\\\\\\\\n    }\\\\n    .numeric-right { \\\\\\\\n      text-align: right; \\\\\\\\n    }\\\\n  </style>\\\\n</head>\\\\n<body>\\\\n  <!-- Header Area -->\\\\n  <div class=\\\\\\"header-area\\\\\\">\\\\n    <!-- Left Header Block -->\\\\n    <div class=\\\\\\"left-header\\\\\\">\\\\n      <div class=\\\\\\"bold text-12\\\\\\">Test company</div>\\\\n      <div class=\\\\\\"text-12\\\\\\">Financial Year 2026-01-01 - 2026-12-31</div>\\\\n      <div class=\\\\\\"text-12\\\\\\">Period 2026-01-01 - 2026-12-31</div>\\\\n      <div class=\\\\\\"text-12\\\\\\">Ledger</div>\\\\n    </div>\\\\n\\\\n    <!-- Right Header Block -->\\\\n    <div class=\\\\\\"right-header\\\\\\">\\\\n      <div class=\\\\\\"text-11\\\\\\">Printed 2026-01-19 08:48</div>\\\\n      <div class=\\\\\\"text-11\\\\\\">Latest version A 6 B 3 F 3 M 1</div>\\\\n    </div>\\\\n  </div>\\\\n\\\\n  <!-- Table Structure -->\\\\n  <div class=\\\\\\"table-container\\\\\\">\\\\n    <table>\\\\n      <thead>\\\\n        <tr>\\\\n          <th style=\\\\\\"width: 80px;\\\\\\">Account</th>\\\\n          <th style=\\\\\\"width: 200px;\\\\\\">Name</th>\\\\n          <th style=\\\\\\"width: 60px;\\\\\\">Vernr</th>\\\\n          <th style=\\\\\\"width: 50px;\\\\\\">Ks</th>\\\\n          <th style=\\\\\\"width: 90px;\\\\\\">Date</th>\\\\n          <th style=\\\\\\"width: auto;\\\\\\">Text</th>\\\\n          <th style=\\\\\\"width: 100px;\\\\\\" class=\\\\\\"text-right\\\\\\">Debit</th>\\\\n          <th style=\\\\\\"width: 100px;\\\\\\" class=\\\\\\"text-right\\\\\\">Credit</th>\\\\n          <th style=\\\\\\"width: 110px;\\\\\\" class=\\\\\\"text-right\\\\\\">Balance</th>\\\\n        </tr>\\\\n      </thead>\\\\n      <tbody>\\\\n        <!-- Account Group 1 -->\\\\n        <tr>\\\\n          <td colspan=\\\\\\"9\\\\\\" class=\\\\\\"account-header\\\\\\">\\\\n            450    Cash 450\\\\n          </td>\\\\n        </tr>\\\\n        \\\\n        <!-- Opening Balance -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Opening balance</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Transaction Rows -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>A 4</td>\\\\n          <td></td>\\\\n          <td>2026-01-01</td>\\\\n          <td>Cash n car 450 451 desc</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">1.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\"></td>\\\\n          <td class=\\\\\\"text-right\\\\\\">1.00</td>\\\\n        </tr>\\\\n        \\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>A 5</td>\\\\n          <td></td>\\\\n          <td>2026-01-02</td>\\\\n          <td>Bank transfer</td>\\\\n          <td class=\\\\\\"text-right\\\\\\"></td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.50</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.50</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Enclosure Row -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Enclosure</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">1.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.50</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.50</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Closing Balance -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Closing balance</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">1.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.50</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.50</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Account Group 2 -->\\\\n        <tr>\\\\n          <td colspan=\\\\\\"9\\\\\\" class=\\\\\\"account-header\\\\\\">\\\\n            1030    Patent\\\\n          </td>\\\\n        </tr>\\\\n        \\\\n        <!-- Opening Balance -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Opening balance</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">12,000.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Transaction Rows -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>F 3</td>\\\\n          <td></td>\\\\n          <td>2026-01-15</td>\\\\n          <td>Patent registration fee</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">12,000.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\"></td>\\\\n          <td class=\\\\\\"text-right\\\\\\">24,000.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Enclosure Row -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Enclosure</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">12,000.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">12,000.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Closing Balance -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Closing balance</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">12,000.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">0.00</td>\\\\n          <td class=\\\\\\"text-right\\\\\\">24,000.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- General Ledger Total -->\\\\n        <tr>\\\\n          <td colspan=\\\\\\"6\\\\\\" class=\\\\\\"bold text-12\\\\\\">General ledger total</td>\\\\n          <td class=\\\\\\"text-right bold text-12\\\\\\">25,299.00</td>\\\\n          <td class=\\\\\\"text-right bold text-12\\\\\\">25,299.00</td>\\\\n          <td></td>\\\\n        </tr>\\\\n      </tbody>\\\\n    </table>\\\\n  </div>\\\\n</body>\\\\n</html>");
              
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
          
          // Set focus to the from account field on load
          window.onload = function() {
            document.getElementById('from-account').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export default openGeneralLedgerConfig;