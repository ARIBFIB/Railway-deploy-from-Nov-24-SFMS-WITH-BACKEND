const openPerformanceBudgetConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=520,height=420,scrollbars=no,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Performance Budget Report Configuration</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 12px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.3;
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
          .mt-14 { margin-top: 14px; }
          .gap-8 { gap: 8px; }
          .w-90 { width: 90px; }
          .w-14 { width: 14px; }
          .w-16 { width: 16px; }
          .w-48 { width: 48px; }
          .w-70 { width: 70px; }
          .w-200 { width: 200px; }
          .w-480 { width: 480px; }
          .h-14 { height: 14px; }
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
            width: 200px;
            height: 18px;
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
          input[type="checkbox"] {
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
            width: 480px;
            border: 1px solid #000000;
            padding: 8px 0 0 10px;
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
            margin-left: 4px;
          }
          .month-grid {
            display: grid;
            grid-template-columns: 48px 70px 70px 70px;
            gap: 4px;
            margin-bottom: 10px;
          }
          .month-header {
            font-weight: bold;
            text-align: center;
          }
          .month-row {
            display: contents;
          }
          .month-cell {
            padding: 2px;
            text-align: center;
          }
          .month-label {
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Report Title Field -->
          <div class="flex items-center mb-10">
            <label class="mr-6 text-12 text-[#000000]">Report title</label>
            <input type="text" id="report-title" value="Result Budget" class="text-12" />
            <div class="info-icon" title="Title printed on report header">i</div>
          </div>

          <!-- Show Section -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-8">Show</div>
            <div class="flex items-center">
              <div class="flex items-center mr-8">
                <input type="radio" id="per-month" name="show" checked />
                <label for="per-month" class="ml-6 text-12 text-[#000000]">Per month</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="only-accumulated" name="show" />
                <label for="only-accumulated" class="ml-6 text-12 text-[#000000]">Only accumulated</label>
              </div>
            </div>
          </div>

          <!-- Month Selection Grid -->
          <div class="mb-10">
            <div class="month-grid">
              <div class="month-header text-12 text-[#000000]">Month</div>
              <div class="month-header text-12 text-[#000000]">Prognos</div>
              <div class="month-header text-12 text-[#000000]">Budget</div>
              <div class="month-header text-12 text-[#000000]">Utfall</div>
            </div>
            <div class="month-selection">
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2601</div>
                <div class="month-cell"><input type="checkbox" id="2601-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2601-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2601-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2602</div>
                <div class="month-cell"><input type="checkbox" id="2602-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2602-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2602-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2603</div>
                <div class="month-cell"><input type="checkbox" id="2603-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2603-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2603-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2604</div>
                <div class="month-cell"><input type="checkbox" id="2604-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2604-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2604-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2605</div>
                <div class="month-cell"><input type="checkbox" id="2605-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2605-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2605-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2606</div>
                <div class="month-cell"><input type="checkbox" id="2606-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2606-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2606-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2607</div>
                <div class="month-cell"><input type="checkbox" id="2607-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2607-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2607-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2608</div>
                <div class="month-cell"><input type="checkbox" id="2608-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2608-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2608-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2609</div>
                <div class="month-cell"><input type="checkbox" id="2609-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2609-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2609-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2610</div>
                <div class="month-cell"><input type="checkbox" id="2610-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2610-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2610-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2611</div>
                <div class="month-cell"><input type="checkbox" id="2611-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2611-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2611-utfall" /></div>
              </div>
              <div class="month-row">
                <div class="month-cell month-label text-12 text-[#000000]">2612</div>
                <div class="month-cell"><input type="checkbox" id="2612-prognos" /></div>
                <div class="month-cell"><input type="checkbox" id="2612-budget" checked /></div>
                <div class="month-cell"><input type="checkbox" id="2612-utfall" /></div>
              </div>
            </div>
          </div>

          <!-- Hide Sums Option -->
          <div class="flex items-center mt-6">
            <input type="checkbox" id="hide-sums" />
            <label for="hide-sums" class="ml-6 text-12 text-[#000000]">Hide sums</label>
          </div>

          <!-- Orientation Section -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-8">Orientation</div>
            <div class="flex items-center">
              <div class="flex items-center mr-8">
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
          <div class="flex justify-center mt-14">
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
            const showOption = document.querySelector('input[name="show"]:checked').id;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            const hideSums = document.getElementById('hide-sums').checked;
            
            // Collect selected months
            const selectedMonths = [];
            for (let i = 1; i <= 12; i++) {
              const monthPrefix = i < 10 ? '260' + i : '26' + i;
              const budgetChecked = document.getElementById(monthPrefix + '-budget').checked;
              if (budgetChecked) {
                selectedMonths.push(monthPrefix);
              }
            }
            
            // Open the performance budget report in a new window
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
                      text-align: center; 
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
                    .numeric-center { 
                      text-align: center; 
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                    .info-line {
                      font-size: 11px;
                      margin-bottom: 6px;
                      text-align: left;
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
                      <div class="text-11">Printed 2026-01-19 08:58</div>
                      <div class="text-11">Latest version A 6 B 3 F 3 M 1</div>
                    </div>
                  </div>

                  <!-- Information Line -->
                  <div class="info-line">Amounts are expressed in thousands of kronor.</div>

                  <!-- Table Structure -->
                  <div class="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th style="width: 200px; text-align: left;"></th>
                          <th class="text-center" style="width: 40px;">2601</th>
                          <th class="text-center" style="width: 40px;">2602</th>
                          <th class="text-center" style="width: 40px;">2603</th>
                          <th class="text-center" style="width: 40px;">2604</th>
                          <th class="text-center" style="width: 40px;">2605</th>
                          <th class="text-center" style="width: 40px;">2606</th>
                          <th class="text-center" style="width: 40px;">2607</th>
                          <th class="text-center" style="width: 40px;">2608</th>
                          <th class="text-center" style="width: 40px;">2609</th>
                          <th class="text-center" style="width: 40px;">2610</th>
                          <th class="text-center" style="width: 40px;">2611</th>
                          <th class="text-center" style="width: 40px;">2612</th>
                          <th class="text-center" style="width: 60px;">Ack</th>
                        </tr>
                        <tr>
                          <th style="text-align: left;"></th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                          <th class="text-center" style="font-weight: normal;">Budget</th>
                        </tr>
                      </thead>
                      <tbody>
                        <!-- OPERATING INCOME SECTION -->
                        <tr>
                          <td colspan="14" class="section-header">OPERATING INCOME</td>
                        </tr>
                        
                        <tr>
                          <td class="account-row text-12">Sales revenue</td>
                          <td class="numeric-center text-12">100,0</td>
                          <td class="numeric-center text-12">105,0</td>
                          <td class="numeric-center text-12">98,0</td>
                          <td class="numeric-center text-12">110,0</td>
                          <td class="numeric-center text-12">108,0</td>
                          <td class="numeric-center text-12">112,0</td>
                          <td class="numeric-center text-12">107,0</td>
                          <td class="numeric-center text-12">115,0</td>
                          <td class="numeric-center text-12">120,0</td>
                          <td class="numeric-center text-12">118,0</td>
                          <td class="numeric-center text-12">125,0</td>
                          <td class="numeric-center text-12">130,0</td>
                          <td class="numeric-right text-12">1 348,0</td>
                        </tr>
                        
                        <tr>
                          <td class="text-right subtotal-row text-12">TOTAL OPERATING INCOME</td>
                          <td class="numeric-center subtotal-row text-12">100,0</td>
                          <td class="numeric-center subtotal-row text-12">105,0</td>
                          <td class="numeric-center subtotal-row text-12">98,0</td>
                          <td class="numeric-center subtotal-row text-12">110,0</td>
                          <td class="numeric-center subtotal-row text-12">108,0</td>
                          <td class="numeric-center subtotal-row text-12">112,0</td>
                          <td class="numeric-center subtotal-row text-12">107,0</td>
                          <td class="numeric-center subtotal-row text-12">115,0</td>
                          <td class="numeric-center subtotal-row text-12">120,0</td>
                          <td class="numeric-center subtotal-row text-12">118,0</td>
                          <td class="numeric-center subtotal-row text-12">125,0</td>
                          <td class="numeric-center subtotal-row text-12">130,0</td>
                          <td class="numeric-right subtotal-row text-12">1 348,0</td>
                        </tr>
                        
                        <!-- COSTS OF OPERATION SECTION -->
                        <tr>
                          <td colspan="14" class="section-header">COSTS OF OPERATION</td>
                        </tr>
                        
                        <tr>
                          <td class="account-row text-12">Other external costs</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-right text-12">0,0</td>
                        </tr>
                        
                        <tr>
                          <td class="account-row text-12">5410 Consumables</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-right text-12">0,0</td>
                        </tr>
                        
                        <tr>
                          <td class="account-row text-12">6110 Office supplies</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-right text-12">0,0</td>
                        </tr>
                        
                        <tr>
                          <td class="text-right subtotal-row text-12">Total other external costs</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-right subtotal-row text-12">0,0</td>
                        </tr>
                        
                        <tr>
                          <td class="account-row text-12">Personnel costs</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-center text-12">-</td>
                          <td class="numeric-right text-12">0,0</td>
                        </tr>
                        
                        <tr>
                          <td class="text-right subtotal-row text-12">TOTAL OPERATING COSTS</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-center subtotal-row text-12">0,0</td>
                          <td class="numeric-right subtotal-row text-12">0,0</td>
                        </tr>
                        
                        <!-- CALCULATED RESULT SECTION -->
                        <tr>
                          <td class="text-right total-row text-12">CALCULATED RESULT</td>
                          <td class="numeric-center total-row text-12">100,0</td>
                          <td class="numeric-center total-row text-12">105,0</td>
                          <td class="numeric-center total-row text-12">98,0</td>
                          <td class="numeric-center total-row text-12">110,0</td>
                          <td class="numeric-center total-row text-12">108,0</td>
                          <td class="numeric-center total-row text-12">112,0</td>
                          <td class="numeric-center total-row text-12">107,0</td>
                          <td class="numeric-center total-row text-12">115,0</td>
                          <td class="numeric-center total-row text-12">120,0</td>
                          <td class="numeric-center total-row text-12">118,0</td>
                          <td class="numeric-center total-row text-12">125,0</td>
                          <td class="numeric-center total-row text-12">130,0</td>
                          <td class="numeric-right total-row text-12">1 348,0</td>
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

export { openPerformanceBudgetConfig };