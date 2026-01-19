// Export a function that opens the deleted vouchers configuration window
const openDeletedVouchersConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=480,height=300,scrollbars=no,resizable=yes'
  );
  
  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Deleted Vouchers Configuration</title>
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
          .mr-6 { margin-right: 6px; }
          .mr-8 { margin-right: 8px; }
          .ml-6 { margin-left: 6px; }
          .ml-8 { margin-left: 8px; }
          .mt-12 { margin-top: 12px; }
          .gap-6 { gap: 6px; }
          .gap-8 { gap: 8px; }
          .gap-12 { gap: 12px; }
          .gap-20 { gap: 20px; }
          .w-12 { width: 12px; }
          .w-16 { width: 16px; }
          .w-90 { width: 90px; }
          .w-160 { width: 160px; }
          .w-440 { width: 440px; }
          .h-12 { height: 12px; }
          .h-16 { height: 16px; }
          .h-20 { height: 20px; }
          .h-24 { height: 24px; }
          .h-36 { height: 36px; }
          .h-54 { height: 54px; }
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
          input[type="radio"], input[type="checkbox"] {
            width: 12px;
            height: 12px;
          }
          select {
            width: 160px;
            height: 20px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
          }
          input[type="text"] {
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
            width: 440px;
            border: 1px solid #000000;
            padding: 6px 10px 0 10px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Series Selection Section -->
          <div class="mb-10">
            <!-- All Series Radio -->
            <div class="flex items-center mb-6">
              <input type="radio" id="all-series" name="series" checked />
              <label for="all-series" class="ml-6 text-12 text-[#000000]">All Series</label>
              
              <!-- Page Break Option -->
              <div class="flex items-center ml-12">
                <input type="checkbox" id="page-break" />
                <label for="page-break" class="ml-6 text-12 text-[#000000]">Page break after each series</label>
              </div>
            </div>
            
            <!-- One Series Radio + Dropdown -->
            <div class="flex items-center">
              <input type="radio" id="one-series" name="series" />
              <label for="one-series" class="ml-6 text-12 text-[#000000] mr-8">One Series</label>
              <select id="series-dropdown">
                <option value="A">A - Accounting</option>
                <option value="B">B - Banking</option>
                <option value="F">F - Financial</option>
                <option value="M">M - Management</option>
              </select>
            </div>
          </div>

          <!-- Interval Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-6">Interval</div>
            
            <!-- All Radio -->
            <div class="flex items-center mb-6">
              <input type="radio" id="interval-all" name="interval" checked />
              <label for="interval-all" class="ml-6 text-12 text-[#000000]">All</label>
            </div>
            
            <!-- Date Range -->
            <div class="flex items-center">
              <input type="radio" id="interval-range" name="interval" />
              <label for="interval-range" class="ml-6 text-12 text-[#000000] mr-6">Date</label>
              
              <div class="flex items-center mr-6">
                <input type="text" id="start-date" value="2026-01-01" />
                <button class="calendar-btn">📅</button>
              </div>
              <span class="mr-6">-</span>
              <div class="flex items-center">
                <input type="text" id="end-date" value="2026-12-31" />
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

          <!-- Action Buttons -->
          <div class="flex justify-center mt-12">
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
            const allSeries = document.getElementById('all-series').checked;
            const oneSeries = document.getElementById('one-series').checked;
            const seriesValue = document.getElementById('series-dropdown').value;
            const pageBreak = document.getElementById('page-break').checked;
            const intervalAll = document.getElementById('interval-all').checked;
            const intervalRange = document.getElementById('interval-range').checked;
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the deleted vouchers report in a new window
            const reportWindow = window.open(
              '', 
              '_blank', 
              'width=1200,height=800,scrollbars=yes,resizable=yes'
            );
            
            if (reportWindow) {
              reportWindow.document.write("<!DOCTYPE html>\\\\n<html>\\\\n<head>\\\\n  <meta charset=\\\\\\"utf-8\\\\\\" />\\\\n  <title>Deleted Vouchers Report</title>\\\\n  <style>\\\\n    body { \\\\n      margin: 0; \\\\n      padding: 0; \\\\n      font-family: Arial, Helvetica, sans-serif; \\\\n      font-size: 12px; \\\\n      color: #000000; \\\\n      background-color: #FFFFFF; \\\\n      line-height: 1.2;\\\\n      overflow: auto;\\\\n    }\\\\n    .header-area { \\\\n      display: flex; \\\\n      justify-content: space-between; \\\\n      align-items: flex-start; \\\\n      padding: 12px; \\\\n    }\\\\n    .left-header { text-align: left; }\\\\n    .right-header { text-align: right; }\\\\n    .bold { font-weight: bold; }\\\\n    .text-12 { font-size: 12px; }\\\\n    .text-11 { font-size: 11px; }\\\\n    .mt-12 { margin-top: 12px; }\\\\n    .mt-10 { margin-top: 10px; }\\\\n    .text-right { text-align: right; }\\\\n    .text-left { text-align: left; }\\\\n    .table-container { padding: 0 12px 12px 12px; }\\\\n    table { \\\\n      width: 100%; \\\\n      border-collapse: collapse; \\\\n    }\\\\n    th { \\\\n      font-weight: normal; \\\\n      padding-bottom: 6px; \\\\n      text-align: left; \\\\n      border-bottom: 1px solid #000000;\\\\n    }\\\\n    td { \\\\n      vertical-align: top; \\\\n    }\\\\n    .voucher-header { \\\\n      font-weight: bold; \\\\n      font-size: 12px; \\\\n      padding-top: 10px;\\\\n    }\\\\n    .protection-section { \\\\n      font-size: 12px; \\\\n      font-weight: normal;\\\\n    }\\\\n    .numeric-right { \\\\n      text-align: right; \\\\n    }\\\\n  </style>\\\\n</head>\\\\n<body>\\\\n  <!-- Header Area -->\\\\n  <div class=\\\\\\"header-area\\\\\\">\\\\n    <!-- Left Header Block -->\\\\n    <div class=\\\\\\"left-header\\\\\\">\\\\n      <div class=\\\\\\"bold text-12\\\\\\">Test company</div>\\\\n      <div class=\\\\\\"text-12\\\\\\">Financial Year 2026-01-01 - 2026-12-31</div>\\\\n      <div class=\\\\\\"text-12\\\\\\">Period 2026-01-01 - 2026-12-31</div>\\\\n      <div class=\\\\\\"text-12\\\\\\">Deleted vouchers</div>\\\\n    </div>\\\\n\\\\n    <!-- Right Header Block -->\\\\n    <div class=\\\\\\"right-header\\\\\\">\\\\n      <div class=\\\\\\"text-11\\\\\\">Printed 2026-01-19 08:40</div>\\\\n      <div class=\\\\\\"text-11\\\\\\">Senaste vernr A 6 B 3 F 3 M 1</div>\\\\n    </div>\\\\n  </div>\\\\n\\\\n  <!-- Table Structure -->\\\\n  <div class=\\\\\\"table-container\\\\\\">\\\\n    <table>\\\\n      <thead>\\\\n        <tr>\\\\n          <th style=\\\\\\"width: 70px;\\\\\\">Account</th>\\\\n          <th style=\\\\\\"width: 50px;\\\\\\">Ks</th>\\\\n          <th style=\\\\\\"width: 60px;\\\\\\">Proj</th>\\\\n          <th style=\\\\\\"width: auto;\\\\\\">Text</th>\\\\n          <th style=\\\\\\"width: 90px;\\\\\\" class=\\\\\\"text-right\\\\\\">Debit</th>\\\\n          <th style=\\\\\\"width: 90px;\\\\\\" class=\\\\\\"text-right\\\\\\">Credit</th>\\\\n        </tr>\\\\n      </thead>\\\\n      <tbody>\\\\n        <!-- Voucher Group 1 -->\\\\n        <tr>\\\\n          <td colspan=\\\\\\"6\\\\\\" class=\\\\\\"voucher-header\\\\\\">\\\\n            F3 (1)    2026-01-01        adasd        2026-01-02 test test\\\\n          </td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td colspan=\\\\\\"6\\\\\\" class=\\\\\\"protection-section\\\\\\">\\\\n            Protection\\\\n                Booked\\\\n          </td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\\"text-12\\\\\\">1030</td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\">Patent</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">0,00</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">12,00</td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\\"text-12\\\\\\">1040</td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\">Software License</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">8,50</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">0,00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Voucher Group 2 -->\\\\n        <tr>\\\\n          <td colspan=\\\\\\"6\\\\\\" class=\\\\\\"voucher-header\\\\\\">\\\\n            A6 (15)    2026-02-15        Office Supplies        2026-02-16 Monthly purchase\\\\n          </td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td colspan=\\\\\\"6\\\\\\" class=\\\\\\"protection-section\\\\\\">\\\\n            Protection\\\\n                Booked\\\\n          </td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\\"text-12\\\\\\">5010</td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\">Printer Ink</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">3,25</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">0,00</td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\\"text-12\\\\\\">5020</td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\">Paper</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">1,75</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">0,00</td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\\"text-12\\\\\\">2610</td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\"></td>\\\\n          <td class=\\\\\\"text-12\\\\\\">Accounts Payable</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">0,00</td>\\\\n          <td class=\\\\\\"text-right text-12\\\\\\">5,00</td>\\\\n        </tr>\\\\n      </tbody>\\\\n    </table>\\\\n  </div>\\\\n</body>\\\\n</html>");
              
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
          
          // Enable/disable date fields based on interval selection
          document.getElementById('interval-all').addEventListener('change', function() {
            document.getElementById('start-date').disabled = this.checked;
            document.getElementById('end-date').disabled = this.checked;
          });
          
          document.getElementById('interval-range').addEventListener('change', function() {
            document.getElementById('start-date').disabled = !this.checked;
            document.getElementById('end-date').disabled = !this.checked;
          });
          
          // Enable/disable series dropdown based on selection
          document.getElementById('all-series').addEventListener('change', function() {
            document.getElementById('series-dropdown').disabled = this.checked;
          });
          
          document.getElementById('one-series').addEventListener('change', function() {
            document.getElementById('series-dropdown').disabled = !this.checked;
          });
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export default openDeletedVouchersConfig;