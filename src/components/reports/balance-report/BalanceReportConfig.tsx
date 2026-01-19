// Export a function that opens the balance report configuration window
const openBalanceReportConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=440,height=240,scrollbars=no,resizable=yes'
  );
  
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Balance Report Configuration</title>
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
          .mb-6 { margin-bottom: 6px; }
          .mr-8 { margin-right: 8px; }
          .mr-6 { margin-right: 6px; }
          .mx-6 { margin-left: 6px; margin-right: 6px; }
          .ml-4 { margin-left: 4px; }
          .mt-6 { margin-top: 6px; }
          .w-90 { width: 90px; }
          .w-14 { width: 14px; }
          .w-16 { width: 16px; }
          .h-18 { height: 18px; }
          .h-14 { height: 14px; }
          .h-16 { height: 16px; }
          .h-24 { height: 24px; }
          .h-36 { height: 36px; }
          .w-410 { width: 410px; }
          .text-12 { font-size: 12px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-[#000000] { color: #000000; }
          .border { border: 1px solid #000000; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#E6F0FA] { background-color: #E6F0FA; }
          .bg-[#DFF0D8] { background-color: #DFF0D8; }
          .border-[#6AA84F] { border-color: #6AA84F; }
          .rounded-2px { border-radius: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-2 { padding-top: 2px; padding-bottom: 2px; }
          .pt-6 { padding-top: 6px; }
          .pl-10 { padding-left: 10px; }
          .gap-20 { gap: 20px; }
          .gap-6 { gap: 6px; }
          .gap-12 { gap: 12px; }
          input[type="text"] {
            width: 90px;
            height: 18px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            padding: 4px;
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
            width: 410px;
            border: 1px solid #000000;
            padding: 6px 10px 0 10px;
            margin-bottom: 10px;
          }
          .info-icon {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: #E6F0FA;
            border: 1px solid #7AA7D9;
            color: #2B6CB0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            margin-top: 6px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Date Range Row -->
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
                <input type="radio" id="portrait" name="orientation" checked />
                <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="landscape" name="orientation" />
                <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
              </div>
            </div>
          </div>

          <!-- Compact Option -->
          <div class="flex items-center mt-6">
            <input type="checkbox" id="compact" />
            <label for="compact" class="ml-6 text-12 text-[#000000]">Compact</label>
          </div>

          <!-- Information Icon -->
          <div class="flex justify-center">
            <div class="info-icon">i</div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center mt-10">
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
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            const compact = document.getElementById('compact').checked;
            
            // Open the balance report in a new window
            const reportWindow = window.open(
              '', 
              '_blank', 
              'width=1200,height=800,scrollbars=yes,resizable=yes'
            );
            
            if (reportWindow) {
              reportWindow.document.write("<!DOCTYPE html>\\n<html>\\n<head>\\n  <meta charset=\\\"utf-8\\\" />\\n  <title>Annual Balance Sheet Report</title>\\n  <style>\\n    body { \\n      margin: 0; \\n      padding: 0; \\n      font-family: Arial, Helvetica, sans-serif; \\n      font-size: 12px; \\n      color: #000000; \\n      background-color: #FFFFFF; \\n      line-height: 1.2;\\n      overflow: auto;\\n    }\\n    .header-area { \\n      display: flex; \\n      justify-content: space-between; \\n      align-items: flex-start; \\n      padding: 12px; \\n    }\\n    .left-header { text-align: left; }\\n    .center-title { \\n      position: absolute; \\n      left: 50%; \\n      transform: translateX(-50%); \\n      font-size: 24px; \\n      font-weight: bold; \\n    }\\n    .right-header { text-align: right; }\\n    .bold { font-weight: bold; }\\n    .text-12 { font-size: 12px; }\\n    .text-11 { font-size: 11px; }\\n    .text-13 { font-size: 13px; }\\n    .text-24 { font-size: 24px; }\\n    .mt-12 { margin-top: 12px; }\\n    .mt-6 { margin-top: 6px; }\\n    .text-center { text-align: center; }\\n    .text-right { text-align: right; }\\n    .text-left { text-align: left; }\\n    .table-container { padding: 0 12px 12px 12px; }\\n    table { \\n      width: 100%; \\n      border-collapse: collapse; \\n    }\\n    th { \\n      font-weight: normal; \\n      padding-bottom: 6px; \\n      text-align: left; \\n    }\\n    td { \\n      vertical-align: top; \\n    }\\n    .section-header { \\n      font-weight: bold; \\n      font-size: 13px; \\n      text-transform: uppercase; \\n      padding-top: 14px; \\n      padding-bottom: 6px;\\n    }\\n    .subsection { \\n      font-size: 12px; \\n      padding-left: 16px; \\n      padding-top: 6px; \\n      padding-bottom: 4px;\\n    }\\n    .account-row { \\n      padding-left: 32px; \\n    }\\n    .total-row { \\n      font-weight: bold; \\n      border-top: 1px solid #000000; \\n      padding-top: 6px; \\n    }\\n    .numeric-right { \\n      text-align: right; \\n    }\\n  </style>\\n</head>\\n<body>\\n  <!-- Header Area -->\\n  <div class=\\\"header-area\\\">\\n    <!-- Left Header Block -->\\n    <div class=\\\"left-header\\\">\\n      <div class=\\\"bold text-12\\\">Test Company</div>\\n      <div class=\\\"text-12\\\">Financial Year 2026-01-01 - 2026-12-31</div>\\n      <div class=\\\"text-12\\\">Period: 2026-01-01 - 2026-12-31</div>\\n    </div>\\n\\n    <!-- Center Title -->\\n    <div class=\\\"center-title\\\">\\n      Annual balance sheet report\\n    </div>\\n\\n    <!-- Right Header Block -->\\n    <div class=\\\"right-header\\\">\\n      <div class=\\\"text-11\\\">Printed 2026-01-19 08:23</div>\\n      <div class=\\\"text-11\\\">Latest version A 6 B 3 F 3 M 1</div>\\n    </div>\\n  </div>\\n\\n  <!-- Table Structure -->\\n  <div class=\\\"table-container\\\">\\n    <table>\\n      <thead>\\n        <tr>\\n          <th style=\\\"width: 70px;\\\">Account</th>\\n          <th style=\\\"width: 260px;\\\">Account name</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 120px;\\\">The balance</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 120px;\\\">Ing balance</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 120px;\\\">Period</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 140px;\\\">Outgoing balance</th>\\n        </tr>\\n      </thead>\\n      <tbody>\\n        <!-- ASSETS SECTION -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"section-header\\\">ASSETS</div>\\n          </td>\\n        </tr>\\n        \\n        <!-- Fixed Assets -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Fixed assets</div>\\n          </td>\\n        </tr>\\n        \\n        <!-- Intangible Fixed Assets -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Intangible fixed assets</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">1000</td>\\n          <td class=\\\"account-row text-12\\\">Motor Vehicle</td>\\n          <td class=\\\"text-right text-12\\\">100 998,00</td>\\n          <td class=\\\"text-right text-12\\\">100 998,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">100 998,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">1010</td>\\n          <td class=\\\"account-row text-12\\\">Office Equipment</td>\\n          <td class=\\\"text-right text-12\\\">25 500,00</td>\\n          <td class=\\\"text-right text-12\\\">25 500,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">25 500,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">Total intangible assets</td>\\n          <td class=\\\"text-right total-row text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">126 498,00</td>\\n        </tr>\\n        \\n        <!-- Tangible Fixed Assets -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Tangible fixed assets</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">1200</td>\\n          <td class=\\\"account-row text-12\\\">Buildings</td>\\n          <td class=\\\"text-right text-12\\\">500 000,00</td>\\n          <td class=\\\"text-right text-12\\\">500 000,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">500 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">Total tangible fixed assets</td>\\n          <td class=\\\"text-right total-row text-12\\\">500 000,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">500 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">TOTAL ASSETS</td>\\n          <td class=\\\"text-right total-row text-12\\\">626 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">626 498,00</td>\\n        </tr>\\n        \\n        <!-- EQUITY, PROVISIONS AND LIABILITIES SECTION -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"section-header\\\">EQUITY, PROVISIONS AND LIABILITIES</div>\\n          </td>\\n        </tr>\\n        \\n        <!-- Equity -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Equity</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">2000</td>\\n          <td class=\\\"account-row text-12\\\">Share Capital</td>\\n          <td class=\\\"text-right text-12\\\">400 000,00</td>\\n          <td class=\\\"text-right text-12\\\">400 000,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">400 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">2010</td>\\n          <td class=\\\"account-row text-12\\\">Retained Earnings</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">TOTAL EQUITY</td>\\n          <td class=\\\"text-right total-row text-12\\\">526 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">526 498,00</td>\\n        </tr>\\n        \\n        <!-- Provisions and Liabilities -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Provisions and liabilities</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">2400</td>\\n          <td class=\\\"account-row text-12\\\">Long-term Debt</td>\\n          <td class=\\\"text-right text-12\\\">100 000,00</td>\\n          <td class=\\\"text-right text-12\\\">100 000,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">100 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">TOTAL PROVISIONS AND LIABILITIES</td>\\n          <td class=\\\"text-right total-row text-12\\\">100 000,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">100 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">TOTAL EQUITY, PROVISIONS AND LIABILITIES</td>\\n          <td class=\\\"text-right total-row text-12\\\">626 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">626 498,00</td>\\n        </tr>\\n        \\n        <!-- CALCULATED RESULT SECTION -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"section-header\\\">CALCULATED RESULT</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">3000</td>\\n          <td class=\\\"account-row text-12\\\">Net Profit</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">CALCULATED RESULT</td>\\n          <td class=\\\"text-right total-row text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">126 498,00</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n  </div>\\n</body>\\n</html>");
              
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
          
          // Set focus to the start date field on load
          window.onload = function() {
            document.getElementById('start-date').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export default openBalanceReportConfig;