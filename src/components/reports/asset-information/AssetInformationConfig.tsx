const openAssetInformation = () => {
  // Open the Asset Information parameter panel window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=720,height=400,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Asset Information - Parameter Panel</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Tahoma, Segoe UI, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.3;
            overflow: hidden;
          }
          .container {
            width: 720px;
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
          .gap-8 { gap: 8px; }
          .gap-10 { gap: 10px; }
          .gap-16 { gap: 16px; }
          .w-12 { width: 12px; }
          .w-14 { width: 14px; }
          .w-110 { width: 110px; }
          .w-160 { width: 160px; }
          .w-90 { width: 90px; }
          .w-75 { width: 75px; }
          .w-65 { width: 65px; }
          .h-12 { height: 12px; }
          .h-14 { height: 14px; }
          .h-20 { height: 20px; }
          .h-22 { height: 22px; }
          .text-10 { font-size: 10px; }
          .text-11 { font-size: 11px; }
          .text-12 { font-size: 12px; }
          .text-18 { font-size: 18px; }
          .text-bold { font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .text-[#000000] { color: #000000; }
          .border { border: 1px solid #7F9DB9; }
          .border-[#7F9DB9] { border-color: #7F9DB9; }
          .border-[#6AA84F] { border-color: #6AA84F; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#C6E0B4] { background-color: #C6E0B4; }
          input[type="text"],
          select {
            height: 20px;
            border: 1px solid #7F9DB9;
            padding: 0 4px;
            font-size: 11px;
            font-family: Arial, Tahoma, Segoe UI, sans-serif;
            background-color: #FFFFFF;
            color: #000000;
          }
          input[type="text"] {
            width: 110px;
          }
          select {
            width: 160px;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            border: 1px solid #000000;
            accent-color: #000000;
          }
          .btn {
            height: 22px;
            border: 1px solid #6AA84F;
            background-color: #C6E0B4;
            color: #000000;
            font-size: 11px;
            cursor: pointer;
            border-radius: 0;
          }
          .btn-show-screen { width: 90px; }
          .btn-show-pdf { width: 75px; }
          .btn-cancel { width: 65px; }
          .radio-group {
            display: flex;
            align-items: center;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 16px;
          }
          .calendar-icon {
            width: 14px;
            height: 14px;
            color: #4F81BD;
            margin-left: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Date Field -->
          <div class="mb-10">
            <div class="text-11 text-[#000000] mb-6">Date</div>
            <div class="flex items-center">
              <input type="text" id="date-field" value="2026-01-19" class="text-11" />
              <span class="calendar-icon">📅</span>
            </div>
          </div>

          <!-- One Series Dropdown -->
          <div class="mb-10">
            <div class="text-11 text-[#000000] mb-6">One Series</div>
            <select id="one-series" class="text-11">
              <option>All</option>
              <option>Series A</option>
              <option>Series B</option>
              <option>Series C</option>
            </select>
          </div>

          <!-- Orientation Selector -->
          <div class="mb-10">
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
          <div class="flex">
            <button id="show-on-screen" class="btn btn-show-screen mr-8">Show on screen</button>
            <button id="show-pdf" class="btn btn-show-pdf mr-8">Show PDF</button>
            <button id="cancel" class="btn btn-cancel">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get values from the form
            const dateValue = document.getElementById('date-field').value;
            const oneSeries = document.getElementById('one-series').value;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the asset information report in a new window
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
                  <title>Assets - Report</title>
                  <style>
                    body { 
                      margin: 20px 24px; 
                      font-family: Arial, Tahoma, Segoe UI, sans-serif; 
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
                      margin-bottom: 20px;
                    }
                    .left-header { text-align: left; }
                    .center-header { text-align: center; }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-10 { font-size: 10px; }
                    .text-11 { font-size: 11px; }
                    .text-12 { font-size: 12px; }
                    .text-18 { font-size: 18px; }
                    .mt-6 { margin-top: 6px; }
                    .mb-12 { margin-bottom: 12px; }
                    .block-divider { 
                      height: 1px; 
                      background-color: #000000; 
                      margin: 12px 0;
                    }
                    .asset-block {
                      padding: 10px 0;
                    }
                    .asset-grid {
                      display: grid;
                      grid-template-columns: 35% 30% 35%;
                      gap: 10px;
                    }
                    .field-label {
                      font-weight: bold;
                      font-size: 11px;
                      color: #000000;
                      margin-bottom: 4px;
                    }
                    .field-value {
                      font-weight: normal;
                      font-size: 11px;
                      color: #000000;
                      margin-bottom: 4px;
                    }
                    .numeric-right {
                      text-align: right;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">
                      <div class="bold text-12">Test company</div>
                    </div>
                    <div class="center-header">
                      <div class="bold text-18">Assets</div>
                    </div>
                    <div class="right-header">
                      <div class="text-10">Printed 2026-01-19 17:05</div>
                      <div class="text-10 mt-6">Date up to and including \${dateValue}</div>
                    </div>
                  </div>

                  <!-- Asset Detail Blocks -->
                  <div class="asset-block">
                    <div class="asset-grid">
                      <!-- Left Column: Identity & Acquisition -->
                      <div>
                        <div class="field-label">Asset number</div>
                        <div class="field-value">101</div>
                        
                        <div class="field-label">Designation</div>
                        <div class="field-value">Delivery Truck</div>
                        
                        <div class="field-label">Asset type</div>
                        <div class="field-value">Vehicle</div>
                        
                        <div class="field-label">Acquisition value</div>
                        <div class="field-value numeric-right">450 000,00</div>
                        
                        <div class="field-label">Acquisition date</div>
                        <div class="field-value">2024-05-15</div>
                        
                        <div class="field-label">Write-off start</div>
                        <div class="field-value">2024-05-15</div>
                        
                        <div class="field-label">Write off to residual value</div>
                        <div class="field-value">45 000,00</div>
                        
                        <div class="field-label">Status</div>
                        <div class="field-value">Active</div>
                      </div>
                      
                      <!-- Middle Column: Depreciation Values -->
                      <div>
                        <div class="field-label">Depreciable amount</div>
                        <div class="field-value numeric-right">405 000,00</div>
                        
                        <div class="field-label">Write-off basis</div>
                        <div class="field-value numeric-right">405 000,00</div>
                        
                        <div class="field-label">Written off to</div>
                        <div class="field-value numeric-right">45 000,00</div>
                        
                        <div class="field-label">Fully written-off</div>
                        <div class="field-value numeric-right">No</div>
                        
                        <div class="field-label">Accumulated write-off brought forward</div>
                        <div class="field-value numeric-right">45 000,00</div>
                        
                        <div class="field-label">Write-off during year</div>
                        <div class="field-value numeric-right">45 000,00</div>
                        
                        <div class="field-label">Book value</div>
                        <div class="field-value numeric-right">360 000,00</div>
                      </div>
                      
                      <!-- Right Column: Lifetime & Meta -->
                      <div>
                        <div class="field-label">Remaining useful life</div>
                        <div class="field-value">8 years</div>
                        
                        <div class="field-label">Useful life</div>
                        <div class="field-value">10 years</div>
                        
                        <div class="field-label">Write-off method</div>
                        <div class="field-value">Straight line</div>
                        
                        <div class="field-label">Cost center</div>
                        <div class="field-value">Transport</div>
                        
                        <div class="field-label">Project</div>
                        <div class="field-value">Logistics</div>
                        
                        <div class="field-label">ID number</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Manufacturer/Brand</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Insured with</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Insurance number</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Group</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Notes</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Room</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Location</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Section</div>
                        <div class="field-value"></div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Divider -->
                  <div class="block-divider"></div>
                  
                  <!-- Second Asset Block -->
                  <div class="asset-block">
                    <div class="asset-grid">
                      <!-- Left Column -->
                      <div>
                        <div class="field-label">Asset number</div>
                        <div class="field-value">102</div>
                        
                        <div class="field-label">Designation</div>
                        <div class="field-value">Office Computer</div>
                        
                        <div class="field-label">Asset type</div>
                        <div class="field-value">Equipment</div>
                        
                        <div class="field-label">Acquisition value</div>
                        <div class="field-value numeric-right">25 000,00</div>
                        
                        <div class="field-label">Acquisition date</div>
                        <div class="field-value">2025-03-10</div>
                        
                        <div class="field-label">Write-off start</div>
                        <div class="field-value">2025-03-10</div>
                        
                        <div class="field-label">Write off to residual value</div>
                        <div class="field-value">2 500,00</div>
                        
                        <div class="field-label">Status</div>
                        <div class="field-value">Active</div>
                      </div>
                      
                      <!-- Middle Column -->
                      <div>
                        <div class="field-label">Depreciable amount</div>
                        <div class="field-value numeric-right">22 500,00</div>
                        
                        <div class="field-label">Write-off basis</div>
                        <div class="field-value numeric-right">22 500,00</div>
                        
                        <div class="field-label">Written off to</div>
                        <div class="field-value numeric-right">2 500,00</div>
                        
                        <div class="field-label">Fully written-off</div>
                        <div class="field-value numeric-right">No</div>
                        
                        <div class="field-label">Accumulated write-off brought forward</div>
                        <div class="field-value numeric-right">7 500,00</div>
                        
                        <div class="field-label">Write-off during year</div>
                        <div class="field-value numeric-right">7 500,00</div>
                        
                        <div class="field-label">Book value</div>
                        <div class="field-value numeric-right">15 000,00</div>
                      </div>
                      
                      <!-- Right Column -->
                      <div>
                        <div class="field-label">Remaining useful life</div>
                        <div class="field-value">2 years</div>
                        
                        <div class="field-label">Useful life</div>
                        <div class="field-value">3 years</div>
                        
                        <div class="field-label">Write-off method</div>
                        <div class="field-value">Straight line</div>
                        
                        <div class="field-label">Cost center</div>
                        <div class="field-value">IT</div>
                        
                        <div class="field-label">Project</div>
                        <div class="field-value">Office Upgrade</div>
                        
                        <div class="field-label">ID number</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Manufacturer/Brand</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Insured with</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Insurance number</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Group</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Notes</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Room</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Location</div>
                        <div class="field-value"></div>
                        
                        <div class="field-label">Section</div>
                        <div class="field-value"></div>
                      </div>
                    </div>
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
          
          // Set focus to the date field on load
          window.onload = function() {
            document.getElementById('date-field').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openAssetInformation };