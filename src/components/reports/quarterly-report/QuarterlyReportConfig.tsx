const openQuarterlyReportConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=480,height=220,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Quarterly Report Configuration</title>
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
          .mb-6 { margin-bottom: 6px; }
          .mr-6 { margin-right: 6px; }
          .mr-8 { margin-right: 8px; }
          .ml-4 { margin-left: 4px; }
          .ml-6 { margin-left: 6px; }
          .mt-6 { margin-top: 6px; }
          .mt-8 { margin-top: 8px; }
          .mt-18 { margin-top: 18px; }
          .gap-8 { gap: 8px; }
          .gap-10 { gap: 10px; }
          .w-95 { width: 95px; }
          .w-16 { width: 16px; }
          .w-120 { width: 120px; }
          .w-220 { width: 220px; }
          .w-110 { width: 110px; }
          .w-440 { width: 440px; }
          .h-16 { height: 16px; }
          .h-24 { height: 24px; }
          .h-36 { height: 36px; }
          .text-12 { font-size: 12px; }
          .text-11 { font-size: 11px; }
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
          .pl-10 { padding-left: 10px; }
          .pt-8 { padding-top: 8px; }
          input[type="text"] {
            width: 220px;
            height: 18px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            padding: 2px 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
          }
          select {
            width: 120px;
            height: 22px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            padding: 2px 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
          }
          .btn {
            width: 95px;
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
          .mr-8-btn { margin-right: 8px; }
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
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Report Title -->
          <div class="flex items-center mb-10">
            <label class="mr-6 text-12 text-[#000000]">Report title</label>
            <input type="text" id="report-title" value="Quarterly report" class="text-12" />
          </div>

          <!-- Date Selection -->
          <div class="flex items-center mb-10">
            <label class="mr-8 text-12 text-[#000000]">Date</label>
            <div class="flex items-center">
              <div class="flex items-center mr-6">
                <input type="text" id="start-date" value="2026-01-01" class="text-12" />
                <button class="calendar-btn">📅</button>
              </div>
              <span class="mx-6">–</span>
              <div class="flex items-center">
                <input type="text" id="end-date" value="2026-12-31" class="text-12" />
                <button class="calendar-btn">📅</button>
              </div>
            </div>
          </div>

          <!-- Language Selection -->
          <div class="flex items-center mb-10">
            <label class="mr-6 text-12 text-[#000000]">Language</label>
            <select id="language" class="text-12">
              <option value="sv">Swedish</option>
              <option value="en">English</option>
            </select>
          </div>

          <!-- Orientation -->
          <div class="flex items-center mb-8">
            <div class="flex items-center mr-8">
              <input type="radio" id="portrait" name="orientation" checked />
              <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="landscape" name="orientation" />
              <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center mt-18">
            <button id="show-on-screen" class="btn mr-8-btn">Show on screen</button>
            <button id="show-pdf" class="btn mr-8-btn">Show PDF</button>
            <button id="show-txt" class="btn mr-8-btn">Show TXT</button>
            <button id="cancel" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get values from the form
            const reportTitle = document.getElementById('report-title').value;
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const language = document.getElementById('language').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the quarterly report in a new window
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
                  <title>\${reportTitle}</title>
                  <style>
                    body { 
                      margin: 0; 
                      padding: 20px; 
                      font-family: Arial, Helvetica, sans-serif; 
                      font-size: 12px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.2;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      padding: 12px; 
                    }
                    .left-header { text-align: left; }
                    .center-title { 
                      position: absolute; 
                      left: 50%; 
                      transform: translateX(-50%); 
                      top: 10px; 
                      font-size: 15px; 
                      font-weight: bold; 
                    }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-12 { font-size: 12px; }
                    .text-11 { font-size: 11px; }
                    .text-15 { font-size: 15px; }
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
                      padding-bottom: 6px; 
                      text-align: left; 
                      border-bottom: 1px solid #000000;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 2px 4px;
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
                      <div class="text-12">Financial Year 2026-01-01 - 2026-12-31</div>
                      <div class="text-12">Period 2026-01-01 - 2026-12-31</div>
                    </div>

                    <!-- Center Title -->
                    <div class="center-title">
                      \${reportTitle}
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-11">Printed 2026-01-19 13:28</div>
                    </div>
                  </div>

                  <!-- VAT Identification Section -->
                  <div class="mt-6">
                    <div class="text-11">VAT-nr</div>
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 150px;">Buyers VAT-no</th>
                          <th style="width: auto;">Recipient's name</th>
                          <th class="text-right" style="width: 120px;">Value of goods delivery</th>
                          <th class="text-right" style="width: 120px;">Value of third party trade</th>
                          <th class="text-right" style="width: 120px;">Value of services</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-12">SE1234567890</td>
                          <td class="text-12">Example AB</td>
                          <td class="text-right text-12">125 000,00</td>
                          <td class="text-right text-12">0,00</td>
                          <td class="text-right text-12">45 000,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">SE0987654321</td>
                          <td class="text-12">Sample Company Ltd</td>
                          <td class="text-right text-12">89 500,00</td>
                          <td class="text-right text-12">15 000,00</td>
                          <td class="text-right text-12">23 400,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">SE1122334455</td>
                          <td class="text-12">Demo Enterprises</td>
                          <td class="text-right text-12">67 200,00</td>
                          <td class="text-right text-12">0,00</td>
                          <td class="text-right text-12">32 100,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">SE5566778899</td>
                          <td class="text-12">Test Solutions Inc</td>
                          <td class="text-right text-12">156 800,00</td>
                          <td class="text-right text-12">42 000,00</td>
                          <td class="text-right text-12">78 900,00</td>
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
          
          // Set focus to the report title field on load
          window.onload = function() {
            document.getElementById('report-title').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openQuarterlyReportConfig };