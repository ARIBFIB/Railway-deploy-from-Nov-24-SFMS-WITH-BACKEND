const openFutureDepreciations = () => {
  // Open the Future Depreciations filter window
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
        <title>Future Depreciations - Report Setup</title>
        <style>
          body { 
            margin: 0; 
            padding: 16px; 
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
          .gap-6 { gap: 6px; }
          .gap-8 { gap: 8px; }
          .gap-10 { gap: 10px; }
          .w-24 { width: 24px; }
          .w-16 { width: 16px; }
          .w-110 { width: 110px; }
          .w-900 { width: 900px; }
          .h-16 { height: 16px; }
          .h-22 { height: 22px; }
          .h-24 { height: 24px; }
          .h-36 { height: 36px; }
          .text-12 { font-size: 12px; }
          .text-11 { font-size: 11px; }
          .text-14 { font-size: 14px; }
          .text-16 { font-size: 16px; }
          .text-bold { font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-[#000000] { color: #000000; }
          .border { border: 1px solid #7F9DB9; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#C6E3B5] { background-color: #C6E3B5; }
          .border-[#4F7F4F] { border-color: #4F7F4F; }
          .rounded-2px { border-radius: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-2 { padding-top: 2px; padding-bottom: 2px; }
          .pl-10 { padding-left: 10px; }
          .pt-8 { padding-top: 8px; }
          input[type="text"] {
            width: 110px;
            height: 22px;
            border: 1px solid #7F9DB9;
            background-color: #FFFFFF;
            padding: 2px 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
            text-align: left;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
          }
          .btn {
            height: 24px;
            padding: 0 10px;
            background-color: #C6E3B5;
            border: 1px solid #4F7F4F;
            border-radius: 2px;
            font-size: 12px;
            color: #000000;
            cursor: pointer;
          }
          .btn:hover {
            background-color: #B7D8A8;
          }
          .mr-6-btn { margin-right: 6px; }
          .orientation-group {
            border: 1px solid #7F9DB9;
            padding: 8px;
            margin-top: 10px;
          }
          .calendar-btn {
            width: 16px;
            height: 16px;
            background-color: #E6F0FA;
            border: 1px solid #7F9DB9;
            color: #000000;
            margin-left: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Date Range Section -->
          <div class="mb-10">
            <div class="text-12 text-[#000000] mb-4">Date</div>
            <div class="flex items-center">
              <input type="text" id="start-date" value="2026-01-01" class="text-12" />
              <button class="calendar-btn">📅</button>
              <span class="mx-6">-</span>
              <input type="text" id="end-date" value="2026-12-31" class="text-12" />
              <button class="calendar-btn">📅</button>
            </div>
          </div>

          <!-- Orientation Section -->
          <div class="orientation-group">
            <div class="flex items-center">
              <div class="flex items-center mr-8">
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
          <div class="flex justify-center mt-14">
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
            
            // Open the future depreciations report in a new window
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
                  <title>Upcoming depreciation – Report Output</title>
                  <style>
                    body { 
                      margin: 0; 
                      padding: 16px; 
                      font-family: Arial, Helvetica, sans-serif; 
                      font-size: 12px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.3;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      padding: 12px; 
                    }
                    .left-header { text-align: left; }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-12 { font-size: 12px; }
                    .text-11 { font-size: 11px; }
                    .text-14 { font-size: 14px; }
                    .text-16 { font-size: 16px; }
                    .mt-12 { margin-top: 12px; }
                    .mt-6 { margin-top: 6px; }
                    .ml-12 { margin-left: 12px; }
                    .mr-12 { margin-right: 12px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .table-container { padding: 0 12px 12px 12px; }
                    table { 
                      width: 100%; 
                      border-collapse: collapse; 
                    }
                    th { 
                      font-weight: bold; 
                      padding: 4px 6px; 
                      text-align: left; 
                      border-bottom: 2px solid #000000;
                      background-color: #FFFFFF;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 3px 6px;
                      border-bottom: 1px solid #C0C0C0;
                      background-color: #FFFFFF;
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
                      <div class="bold text-14">Test company</div>
                      <div class="text-12 mt-6">Fiscal year: 2026-01-01 - 2026-12-31</div>
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-16 bold mt-6">Upcoming depreciation</div>
                      <div class="text-11">Printed: 2026-01-19 16:17</div>
                    </div>
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 80px;">Asset number</th>
                          <th style="width: 180px;">Designation</th>
                          <th style="width: 160px;">Account</th>
                          <th style="width: 200px;">Depreciation period</th>
                          <th class="text-right" style="width: 120px;">Book value</th>
                          <th class="text-right" style="width: 140px;">Depreciation amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-12">3</td>
                          <td class="text-12">car</td>
                          <td class="text-12">1030 - Patent</td>
                          <td class="text-12">2026-01-19 - 2026-12-31</td>
                          <td class="text-12 numeric-right">10,00</td>
                          <td class="text-12 numeric-right">0,50</td>
                        </tr>
                        <tr>
                          <td class="text-12">1</td>
                          <td class="text-12">Brand Logo</td>
                          <td class="text-12">1030 - Patent</td>
                          <td class="text-12">2026-01-19 - 2026-12-31</td>
                          <td class="text-12 numeric-right">8 167,00</td>
                          <td class="text-12 numeric-right">2 000,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">2</td>
                          <td class="text-12">Honda CIVIC</td>
                          <td class="text-12">4500 - Motor Vehicles</td>
                          <td class="text-12">2026-01-19 - 2026-12-31</td>
                          <td class="text-12 numeric-right">9 050,00</td>
                          <td class="text-12 numeric-right">950,00</td>
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

export { openFutureDepreciations };