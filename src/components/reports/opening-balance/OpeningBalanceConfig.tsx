const openOpeningBalanceConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=420,height=220,scrollbars=no,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Opening Balance Report Configuration</title>
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
          .mb-14 { margin-bottom: 14px; }
          .mr-6 { margin-right: 6px; }
          .mr-8 { margin-right: 8px; }
          .ml-6 { margin-left: 6px; }
          .mt-10 { margin-top: 10px; }
          .gap-8 { gap: 8px; }
          .gap-16 { gap: 16px; }
          .w-90 { width: 90px; }
          .w-16 { width: 16px; }
          .w-380 { width: 380px; }
          .h-16 { height: 16px; }
          .h-24 { height: 24px; }
          .h-42 { height: 42px; }
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
          .pl-10 { padding-left: 10px; }
          .pt-8 { padding-top: 8px; }
          input[type="radio"] {
            width: 12px;
            height: 12px;
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
          .mr-8-btn { margin-right: 8px; }
          .group-box {
            width: 380px;
            border: 1px solid #000000;
            padding: 8px 0 0 10px;
            margin-bottom: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Orientation Group Box -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-8">Orientation</div>
            <div class="flex items-center gap-16">
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

          <!-- Action Buttons Row -->
          <div class="flex justify-center mt-10">
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
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the opening balance report in a new window
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
                  <title>Opening Balance Report</title>
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
                      font-size: 14px; 
                      font-weight: bold; 
                    }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-12 { font-size: 12px; }
                    .text-11 { font-size: 11px; }
                    .text-14 { font-size: 14px; }
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
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                    .total-row { 
                      font-weight: bold; 
                      border-top: 1px solid #000000; 
                      padding-top: 6px; 
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
                      Opening balance
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-11">Printed 2026-01-19 08:56</div>
                      <div class="text-11">Latest version A 6 B 3 F 3 M 1</div>
                    </div>
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 80px;">Account</th>
                          <th style="width: auto;">Name</th>
                          <th class="text-right" style="width: 140px;">Opening balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-12">1000</td>
                          <td class="text-12">Motor Vehicle</td>
                          <td class="text-right text-12">100 998,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1002</td>
                          <td class="text-12">Cash</td>
                          <td class="text-right text-12">399 101,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1010</td>
                          <td class="text-12">Development expenses</td>
                          <td class="text-right text-12">950,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1019</td>
                          <td class="text-12">Accumulated depreciation on capitalized expenses</td>
                          <td class="text-right text-12">-950,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1030</td>
                          <td class="text-12">Patent</td>
                          <td class="text-right text-12">-1 003,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1039</td>
                          <td class="text-12">Accumulated amortization of patents</td>
                          <td class="text-right text-12">-1 833,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1069</td>
                          <td class="text-12">Accumulated depreciation on rental properties</td>
                          <td class="text-right text-12">2 000,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1070</td>
                          <td class="text-12">Goodwill</td>
                          <td class="text-right text-12">3,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1078</td>
                          <td class="text-12">Accumulated impairment losses on goodwill</td>
                          <td class="text-right text-12">-250,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1110</td>
                          <td class="text-12">Buildings</td>
                          <td class="text-right text-12">-500 000,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1220</td>
                          <td class="text-12">Equipment and tools</td>
                          <td class="text-right text-12">40,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1910</td>
                          <td class="text-12">Box</td>
                          <td class="text-right text-12">185,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">1930</td>
                          <td class="text-12">Business account/checking account</td>
                          <td class="text-right text-12">-108 815,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">2611</td>
                          <td class="text-12">Output VAT on sales within Sweden, 25%</td>
                          <td class="text-right text-12">-89,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">2621</td>
                          <td class="text-12">Output VAT on sales within Sweden, 12%</td>
                          <td class="text-right text-12">-15,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">2631</td>
                          <td class="text-12">Output VAT on sales within Sweden, 6%</td>
                          <td class="text-right text-12">-29,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">2641</td>
                          <td class="text-12">Input VAT charged</td>
                          <td class="text-right text-12">21 619,12</td>
                        </tr>
                        
                        <!-- Total Row -->
                        <tr>
                          <td colspan="2" class="total-row text-right text-12">Total opening balance</td>
                          <td class="text-right total-row text-12">-88 087,88</td>
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
          
          // Set focus to the portrait radio button on load
          window.onload = function() {
            document.getElementById('portrait').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openOpeningBalanceConfig };