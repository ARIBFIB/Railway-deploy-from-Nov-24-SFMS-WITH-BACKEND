const openPerformanceReportAdvancedConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=600,height=420,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Performance Report Advanced Configuration</title>
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
          .justify-end { justify-content: flex-end; }
          .mb-10 { margin-bottom: 10px; }
          .mb-8 { margin-bottom: 8px; }
          .mb-6 { margin-bottom: 6px; }
          .mr-6 { margin-right: 6px; }
          .mr-8 { margin-right: 8px; }
          .ml-4 { margin-left: 4px; }
          .ml-6 { margin-left: 6px; }
          .mt-6 { margin-top: 6px; }
          .mt-8 { margin-top: 8px; }
          .mt-14 { margin-top: 14px; }
          .gap-8 { gap: 8px; }
          .w-90 { width: 90px; }
          .w-16 { width: 16px; }
          .w-260 { width: 260px; }
          .w-110 { width: 110px; }
          .w-560 { width: 560px; }
          .h-16 { height: 16px; }
          .h-24 { height: 24px; }
          .h-36 { height: 36px; }
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
          input[type="text"] {
            width: 260px;
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
            width: 560px;
            border: 1px solid #000000;
            padding: 8px 0 0 10px;
            margin-bottom: 10px;
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
          .comparison-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Report Title -->
          <div class="flex items-center mb-10">
            <label class="mr-6 text-12 text-[#000000]">Report title</label>
            <input type="text" id="report-title" value="Income Statement Report" class="text-12" />
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

          <!-- Columns Section -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-8">Columns</div>
            <div class="flex flex-wrap gap-8">
              <div class="flex items-center">
                <input type="checkbox" id="col-period" checked />
                <label for="col-period" class="ml-6 text-12 text-[#000000]">Period</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="col-accumulated" checked />
                <label for="col-accumulated" class="ml-6 text-12 text-[#000000]">Accumulated</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="col-period-last-year" />
                <label for="col-period-last-year" class="ml-6 text-12 text-[#000000]">Period last year</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="col-accumulated-last-year" />
                <label for="col-accumulated-last-year" class="ml-6 text-12 text-[#000000]">Accumulated last year</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="col-period-budget" />
                <label for="col-period-budget" class="ml-6 text-12 text-[#000000]">Period budget</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="col-accumulated-budget" />
                <label for="col-accumulated-budget" class="ml-6 text-12 text-[#000000]">Accumulated budget</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="col-year-budget" />
                <label for="col-year-budget" class="ml-6 text-12 text-[#000000]">Year budget</label>
              </div>
            </div>
          </div>

          <!-- Comparison Section -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-8">Comparison</div>
            <div class="comparison-options">
              <div class="flex items-center">
                <input type="checkbox" id="comp-period-lastyear" disabled />
                <label for="comp-period-lastyear" class="ml-6 text-12 text-[#000000]">Period / Period last year</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="comp-accumulated-lastyear" disabled />
                <label for="comp-accumulated-lastyear" class="ml-6 text-12 text-[#000000]">Accumulated / Accumulated last year</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="comp-period-budget" disabled />
                <label for="comp-period-budget" class="ml-6 text-12 text-[#000000]">Period / Period budget</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="comp-period-year-budget" disabled />
                <label for="comp-period-year-budget" class="ml-6 text-12 text-[#000000]">Period / Year budget</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="comp-accumulated-budget" disabled />
                <label for="comp-accumulated-budget" class="ml-6 text-12 text-[#000000]">Accumulated / Accumulated budget</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="comp-accumulated-year-budget" disabled />
                <label for="comp-accumulated-year-budget" class="ml-6 text-12 text-[#000000]">Accumulated / Year budget</label>
              </div>
            </div>
          </div>

          <!-- Orientation Section -->
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

          <!-- Content Section -->
          <div class="flex items-center mb-8">
            <div class="flex items-center mr-8">
              <input type="radio" id="complete" name="content" checked />
              <label for="complete" class="ml-6 text-12 text-[#000000]">Complete</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="compact" name="content" />
              <label for="compact" class="ml-6 text-12 text-[#000000]">Compact</label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end mt-14">
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
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            const contentMode = document.querySelector('input[name="content"]:checked').id;
            
            // Get column selections
            const colPeriod = document.getElementById('col-period').checked;
            const colAccumulated = document.getElementById('col-accumulated').checked;
            const colPeriodLastYear = document.getElementById('col-period-last-year').checked;
            const colAccumulatedLastYear = document.getElementById('col-accumulated-last-year').checked;
            
            // Open the performance report advanced in a new window
            const reportWindow = window.open(
              '', 
              '_blank', 
              'width=1200,height=800,scrollbars=yes,resizable=yes'
            );
            
            if (reportWindow) {
              // Build column headers based on selections
              let headerCols = '';
              let dataCols = '';
              
              if (colPeriod) {
                headerCols += '<th class="text-right" style="width: 120px;">Period</th>';
                dataCols += '<td class="text-right text-12">0,00</td>';
              }
              
              if (colAccumulated) {
                headerCols += '<th class="text-right" style="width: 120px;">Accumulated</th>';
                dataCols += '<td class="text-right text-12">0,00</td>';
              }
              
              if (colPeriodLastYear) {
                headerCols += '<th class="text-right" style="width: 120px;">Period last year</th>';
                dataCols += '<td class="text-right text-12">145,00</td>';
              }
              
              if (colAccumulatedLastYear) {
                headerCols += '<th class="text-right" style="width: 120px;">Accumulated last year</th>';
                dataCols += '<td class="text-right text-12">145,00</td>';
              }
              
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
                      font-size: 16px; 
                      font-weight: bold; 
                    }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-12 { font-size: 12px; }
                    .text-11 { font-size: 11px; }
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
                      padding-bottom: 6px; 
                      text-align: left; 
                      border-bottom: 1px solid #000000;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 2px 4px;
                    }
                    .section-header { 
                      font-weight: bold; 
                      font-size: 12px; 
                      text-transform: uppercase; 
                      padding-top: 14px; 
                      padding-bottom: 6px;
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
                    .uppercase-total { 
                      font-weight: bold; 
                      text-transform: uppercase; 
                      padding-top: 14px; 
                      padding-bottom: 6px;
                    }
                    .calculated-result { 
                      font-weight: bold; 
                      border-top: 1px solid #000000; 
                      padding-top: 6px; 
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                    .compact-spacing { 
                      \${contentMode === 'compact' ? 'padding-top: 3px; padding-bottom: 2px;' : ''}
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
                      <div class="text-11">Printed 2026-01-19 09:12</div>
                      <div class="text-11">Latest version A 6 B 3 F 3 M 1</div>
                    </div>
                  </div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 70px;"></th>
                          <th style="width: auto;"></th>
                          \${headerCols}
                        </tr>
                      </thead>
                      <tbody>
                        <!-- OPERATING INCOME SECTION -->
                        <tr>
                          <td colspan="\${4 + (colPeriodLastYear ? 1 : 0) + (colAccumulatedLastYear ? 1 : 0)}" class="section-header compact-spacing">OPERATING INCOME</td>
                        </tr>
                        
                        <tr class="compact-spacing">
                          <td class="account-number text-12">3001</td>
                          <td class="account-row text-12">Sales within Sweden, 25% VAT</td>
                          \${dataCols}
                        </tr>
                        
                        <tr class="compact-spacing">
                          <td class="text-right subtotal-row text-12">Total net sales</td>
                          <td class="text-right subtotal-row text-12"></td>
                          \${dataCols.replace(/0,00/g, '368,00')}
                        </tr>
                        
                        <tr class="compact-spacing">
                          <td class="text-right uppercase-total text-12">TOTAL OPERATING INCOME</td>
                          <td class="text-right uppercase-total text-12"></td>
                          \${dataCols.replace(/0,00/g, '368,00')}
                        </tr>
                        
                        <!-- GROSS PROFIT SECTION -->
                        <tr class="compact-spacing">
                          <td class="text-right section-header text-12">GROSS PROFIT</td>
                          <td class="text-right section-header text-12"></td>
                          \${dataCols.replace(/0,00/g, '388,20')}
                        </tr>
                        
                        <!-- OPERATING COSTS SECTION -->
                        <tr>
                          <td colspan="\${4 + (colPeriodLastYear ? 1 : 0) + (colAccumulatedLastYear ? 1 : 0)}" class="section-header compact-spacing">COSTS OF OPERATION</td>
                        </tr>
                        
                        <tr class="compact-spacing">
                          <td class="account-number text-12">5010</td>
                          <td class="account-row text-12">Office supplies</td>
                          \${dataCols}
                        </tr>
                        
                        <tr class="compact-spacing">
                          <td class="account-number text-12">5410</td>
                          <td class="account-row text-12">Consumables</td>
                          \${dataCols.replace(/0,00/g, '-8,80')}
                        </tr>
                        
                        <tr class="compact-spacing">
                          <td class="text-right subtotal-row text-12">Total other external costs</td>
                          <td class="text-right subtotal-row text-12"></td>
                          \${dataCols.replace(/0,00/g, '-96,80')}
                        </tr>
                        
                        <!-- OPERATING RESULTS SECTION -->
                        <tr class="compact-spacing">
                          <td class="text-right total-row text-12">TOTAL OPERATING COSTS</td>
                          <td class="text-right total-row text-12"></td>
                          \${dataCols.replace(/0,00/g, '-96,80')}
                        </tr>
                        
                        <tr class="compact-spacing">
                          <td class="text-right calculated-result text-12">CALCULATED RESULT</td>
                          <td class="text-right calculated-result text-12"></td>
                          \${dataCols.replace(/0,00/g, '-96,80')}
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
          
          // Update comparison checkboxes based on column selections
          function updateComparisonCheckboxes() {
            const periodChecked = document.getElementById('col-period').checked;
            const accumulatedChecked = document.getElementById('col-accumulated').checked;
            const periodLastYearChecked = document.getElementById('col-period-last-year').checked;
            const accumulatedLastYearChecked = document.getElementById('col-accumulated-last-year').checked;
            const periodBudgetChecked = document.getElementById('col-period-budget').checked;
            const accumulatedBudgetChecked = document.getElementById('col-accumulated-budget').checked;
            const yearBudgetChecked = document.getElementById('col-year-budget').checked;
            
            // Enable/disable comparison options based on column selections
            document.getElementById('comp-period-lastyear').disabled = !(periodChecked && periodLastYearChecked);
            document.getElementById('comp-accumulated-lastyear').disabled = !(accumulatedChecked && accumulatedLastYearChecked);
            document.getElementById('comp-period-budget').disabled = !(periodChecked && periodBudgetChecked);
            document.getElementById('comp-period-year-budget').disabled = !(periodChecked && yearBudgetChecked);
            document.getElementById('comp-accumulated-budget').disabled = !(accumulatedChecked && accumulatedBudgetChecked);
            document.getElementById('comp-accumulated-year-budget').disabled = !(accumulatedChecked && yearBudgetChecked);
          }
          
          // Add event listeners to column checkboxes
          document.querySelectorAll('[id^="col-"]').forEach(checkbox => {
            checkbox.addEventListener('change', updateComparisonCheckboxes);
          });
          
          // Initialize comparison checkboxes
          updateComparisonCheckboxes();
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openPerformanceReportAdvancedConfig };