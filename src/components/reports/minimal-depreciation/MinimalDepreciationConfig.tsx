const openMinimalDepreciation = () => {
  // Open the Minimal Depreciation Parameter Panel window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=620,height=400,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Depreciation Date - Parameter Panel</title>
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
            width: 620px;
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
          .w-24 { width: 24px; }
          .w-14 { width: 14px; }
          .w-110 { width: 110px; }
          .w-92 { width: 92px; }
          .min-w-92 { min-width: 92px; }
          .h-14 { height: 14px; }
          .h-22 { height: 22px; }
          .h-26 { height: 26px; }
          .text-11 { font-size: 11px; }
          .text-12 { font-size: 12px; }
          .text-bold { font-weight: bold; }
          .font-medium { font-weight: 500; }
          .font-semibold { font-weight: 600; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-[#000000] { color: #000000; }
          .text-[#1A73E8] { color: #1A73E8; }
          .text-[#7A7A7A] { color: #7A7A7A; }
          .text-[#9E9E9E] { color: #9E9E9E; }
          .border { border: 1px solid #9E9E9E; }
          .border-[#9E9E9E] { border-color: #9E9E9E; }
          .border-[#7FBF7F] { border-color: #7FBF7F; }
          .border-[#D0D0D0] { border-color: #D0D0D0; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#DFF0D8] { background-color: #DFF0D8; }
          .bg-[#F2F2F2] { background-color: #F2F2F2; }
          .rounded-2px { border-radius: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-2 { padding-top: 2px; padding-bottom: 2px; }
          .pl-6 { padding-left: 6px; }
          .pt-8 { padding-top: 8px; }
          input[type="text"] {
            width: 110px;
            height: 22px;
            border: 1px solid #9E9E9E;
            border-radius: 2px;
            padding: 2px 6px;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            accent-color: #1A73E8;
            border-color: #7A7A7A;
          }
          .btn {
            height: 26px;
            min-width: 92px;
            padding: 4px 10px;
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
          .calendar-icon {
            width: 14px;
            height: 14px;
            color: #F4C430;
            margin-left: 4px;
            cursor: pointer;
          }
          .radio-group {
            display: flex;
            align-items: center;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Field Group 1: Depreciation Date -->
          <div class="mb-10">
            <div class="text-11 font-medium text-[#000000] mb-4">Depreciation date (2026-01-01 – 2026-12-31)</div>
            <div class="flex items-center">
              <input type="text" id="from-date" value="2026-01-01" class="text-11 text-[#000000]" />
              <span class="calendar-icon">📅</span>
              <span class="mx-6">-</span>
              <input type="text" id="to-date" value="2026-12-31" class="text-11 text-[#000000]" />
              <span class="calendar-icon">📅</span>
            </div>
          </div>

          <!-- Field Group 2: Orientation -->
          <div class="mt-10">
            <div class="text-11 font-medium text-[#000000] mb-4">Orientation</div>
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
            const fromDate = document.getElementById('from-date').value;
            const toDate = document.getElementById('to-date').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the depreciation report in a new window
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
                  <title>Depreciation Report</title>
                  <style>
                    body { 
                      margin: 0; 
                      padding: 16px; 
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
                      padding: 12px; 
                    }
                    .left-header { text-align: left; }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-11 { font-size: 11px; }
                    .text-12 { font-size: 12px; }
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
                      <div class="bold text-12">Test company</div>
                      <div class="text-11 mt-6">Financial Year: 2026-01-01 – 2026-12-31</div>
                      <div class="text-11">Period: \${fromDate} – \${toDate}</div>
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="bold text-12 mt-6">Depreciation Report</div>
                      <div class="text-11">Printed: 2026-01-19 16:20</div>
                    </div>
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 80px;">Asset</th>
                          <th style="width: 200px;">Description</th>
                          <th style="width: 100px;">Acquisition</th>
                          <th style="width: 100px;">Cost</th>
                          <th style="width: 100px;">Acc. dep.</th>
                          <th style="width: 100px;">Net book</th>
                          <th style="width: 100px;">Dep. year</th>
                          <th style="width: 100px;">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-11">101</td>
                          <td class="text-11">Delivery Truck</td>
                          <td class="text-11">2024-05-15</td>
                          <td class="text-11 numeric-right">450 000,00</td>
                          <td class="text-11 numeric-right">90 000,00</td>
                          <td class="text-11 numeric-right">360 000,00</td>
                          <td class="text-11 numeric-right">45 000,00</td>
                          <td class="text-11">Active</td>
                        </tr>
                        <tr>
                          <td class="text-11">102</td>
                          <td class="text-11">Office Computer</td>
                          <td class="text-11">2025-03-10</td>
                          <td class="text-11 numeric-right">25 000,00</td>
                          <td class="text-11 numeric-right">8 333,33</td>
                          <td class="text-11 numeric-right">16 666,67</td>
                          <td class="text-11 numeric-right">8 333,33</td>
                          <td class="text-11">Active</td>
                        </tr>
                        <tr>
                          <td class="text-11">103</td>
                          <td class="text-11">Furniture Set</td>
                          <td class="text-11">2023-11-22</td>
                          <td class="text-11 numeric-right">75 000,00</td>
                          <td class="text-11 numeric-right">56 250,00</td>
                          <td class="text-11 numeric-right">18 750,00</td>
                          <td class="text-11 numeric-right">18 750,00</td>
                          <td class="text-11">Fully depreciated</td>
                        </tr>
                        <tr>
                          <td class="text-11">104</td>
                          <td class="text-11">Cash Register</td>
                          <td class="text-11">2025-08-05</td>
                          <td class="text-11 numeric-right">12 000,00</td>
                          <td class="text-11 numeric-right">3 000,00</td>
                          <td class="text-11 numeric-right">9 000,00</td>
                          <td class="text-11 numeric-right">3 000,00</td>
                          <td class="text-11">Active</td>
                        </tr>
                        <tr>
                          <td class="text-11">105</td>
                          <td class="text-11">Printer</td>
                          <td class="text-11">2024-01-18</td>
                          <td class="text-11 numeric-right">8 000,00</td>
                          <td class="text-11 numeric-right">5 333,33</td>
                          <td class="text-11 numeric-right">2 666,67</td>
                          <td class="text-11 numeric-right">2 666,67</td>
                          <td class="text-11">Active</td>
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
          
          // Set focus to the from date field on load
          window.onload = function() {
            document.getElementById('from-date').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openMinimalDepreciation };