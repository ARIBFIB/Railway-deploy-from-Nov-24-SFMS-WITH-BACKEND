const openPeriodAllocationsConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=520,height=300,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Report of Period Allocations Configuration</title>
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
          .mt-16 { margin-top: 16px; }
          .gap-8 { gap: 8px; }
          .gap-10 { gap: 10px; }
          .w-95 { width: 95px; }
          .w-16 { width: 16px; }
          .w-160 { width: 160px; }
          .w-110 { width: 110px; }
          .w-480 { width: 480px; }
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
            width: 160px;
            height: 18px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            padding: 2px 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
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
          .lookup-btn {
            width: 16px;
            height: 16px;
            background-color: #FFFF00;
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
          .disabled {
            opacity: 0.5;
            pointer-events: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Period Allocation Account -->
          <div class="flex items-center mb-10">
            <label class="mr-6 text-12 text-[#000000]">Period allocation account</label>
            <div class="flex items-center">
              <input type="text" id="allocation-account" value="" class="text-12" />
              <button class="lookup-btn">🔍</button>
            </div>
          </div>

          <!-- To Date -->
          <div class="flex items-center mb-10">
            <label class="mr-6 text-12 text-[#000000]">To date (inc.)</label>
            <div class="flex items-center">
              <input type="text" id="to-date" value="2026-12-31" class="text-12" />
              <button class="calendar-btn">📅</button>
            </div>
          </div>

          <!-- Show Options -->
          <div class="flex items-center mb-8">
            <label class="mr-6 text-12 text-[#000000]">Show</label>
            <div class="flex items-center">
              <div class="flex items-center mr-8">
                <input type="radio" id="summed" name="show" checked />
                <label for="summed" class="ml-6 text-12 text-[#000000]">Summed</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="itemised" name="show" />
                <label for="itemised" class="ml-6 text-12 text-[#000000]">Itemised</label>
              </div>
            </div>
          </div>

          <!-- Status Filters (Only enabled for Itemised) -->
          <div class="flex items-center mb-10">
            <label class="mr-6 text-12 text-[#000000]">Status</label>
            <div class="flex items-center">
              <div class="flex items-center mr-8">
                <input type="checkbox" id="completed" checked disabled />
                <label for="completed" class="ml-6 text-12 text-[#000000]">Completed</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="not-completed" checked disabled />
                <label for="not-completed" class="ml-6 text-12 text-[#000000]">Not completed</label>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center mt-16">
            <button id="show-on-screen" class="btn mr-8-btn">Show on screen</button>
            <button id="show-pdf" class="btn mr-8-btn">Show PDF</button>
            <button id="cancel" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get values from the form
            const allocationAccount = document.getElementById('allocation-account').value;
            const toDate = document.getElementById('to-date').value;
            const showOption = document.querySelector('input[name="show"]:checked').id;
            const completedChecked = document.getElementById('completed').checked;
            const notCompletedChecked = document.getElementById('not-completed').checked;
            
            // Open the period allocations report in a new window
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
                  <title>Report of Period Allocations</title>
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
                    .italic { font-style: italic; }
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
                    .account-row { 
                      padding-left: 16px; 
                    }
                    .subtotal-row { 
                      font-weight: bold; 
                    }
                    .total-row { 
                      font-weight: bold; 
                      border-top: 1px solid #000000; 
                      padding-top: 6px; 
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
                      <div class="bold text-12">Testföretag</div>
                      <div class="text-12">Financial Year 2026-01-01 - 2026-12-31</div>
                      <div class="text-12">Date range: \${toDate}</div>
                    </div>

                    <!-- Center Title -->
                    <div class="center-title">
                      Report of period allocations
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-11">Printed 2026-01-19 09:15</div>
                      <div class="text-11">Latest version A 6 B 3 F 3 M 1</div>
                    </div>
                  </div>

                  <!-- Information Line -->
                  <div class="italic text-11 mt-6">
                    The summed report will disregard reverse period allocations.
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    \${showOption === 'summed' ? \`
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 70px;">Account</th>
                          <th style="width: auto;">Name</th>
                          <th class="text-right" style="width: 120px;">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-12">1790</td>
                          <td class="text-12">Prepaid expenses</td>
                          <td class="text-right text-12">12 500,00</td>
                        </tr>
                        <tr>
                          <td class="text-12">2990</td>
                          <td class="text-12">Accrued expenses</td>
                          <td class="text-right text-12">-8 200,00</td>
                        </tr>
                        <tr>
                          <td class="text-right total-row text-12">TOTAL</td>
                          <td class="text-right total-row text-12"></td>
                          <td class="text-right total-row text-12">4 300,00</td>
                        </tr>
                      </tbody>
                    </table>
                    \` : \`
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 80px;">Allocation no.</th>
                          <th style="width: 70px;">Account</th>
                          <th style="width: auto;">Text</th>
                          <th class="text-center" style="width: 80px;">Start date</th>
                          <th class="text-center" style="width: 80px;">End date</th>
                          <th class="text-right" style="width: 120px;">Amount</th>
                          <th class="text-center" style="width: 80px;">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td class="text-12">1</td>
                          <td class="text-12">1790</td>
                          <td class="text-12">Insurance premium</td>
                          <td class="text-center text-12">2026-01-01</td>
                          <td class="text-center text-12">2026-12-31</td>
                          <td class="text-right text-12">1 000,00</td>
                          <td class="text-center text-12">Completed</td>
                        </tr>
                        <tr>
                          <td class="text-12">2</td>
                          <td class="text-12">2990</td>
                          <td class="text-12">Rent expense</td>
                          <td class="text-center text-12">2026-01-01</td>
                          <td class="text-center text-12">2026-12-31</td>
                          <td class="text-right text-12">-2 000,00</td>
                          <td class="text-center text-12">Not completed</td>
                        </tr>
                        <tr>
                          <td class="text-12">3</td>
                          <td class="text-12">1790</td>
                          <td class="text-12">Software subscription</td>
                          <td class="text-center text-12">2026-06-01</td>
                          <td class="text-center text-12">2026-12-31</td>
                          <td class="text-right text-12">500,00</td>
                          <td class="text-center text-12">Completed</td>
                        </tr>
                      </tbody>
                    </table>
                    \`}
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
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Set focus to the allocation account field on load
          window.onload = function() {
            document.getElementById('allocation-account').focus();
          };
          
          // Update status filters based on show option
          function updateStatusFilters() {
            const showOption = document.querySelector('input[name="show"]:checked').id;
            const completedCheckbox = document.getElementById('completed');
            const notCompletedCheckbox = document.getElementById('not-completed');
            
            if (showOption === 'summed') {
              // In summed mode, disable status filters and check them by default
              completedCheckbox.checked = true;
              notCompletedCheckbox.checked = true;
              completedCheckbox.disabled = true;
              notCompletedCheckbox.disabled = true;
            } else {
              // In itemised mode, enable status filters
              completedCheckbox.disabled = false;
              notCompletedCheckbox.disabled = false;
            }
          }
          
          // Add event listeners to show radio buttons
          document.querySelectorAll('input[name="show"]').forEach(radio => {
            radio.addEventListener('change', updateStatusFilters);
          });
          
          // Initialize status filters
          updateStatusFilters();
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openPeriodAllocationsConfig };