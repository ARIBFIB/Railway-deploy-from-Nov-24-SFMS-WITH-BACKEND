const openDepreciations = () => {
  // Open the Depreciations report in a new window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=1440,height=900,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Depreciations</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Inter, Segoe UI, Arial, sans-serif; 
            font-size: 13px; 
            color: #0B3D2E; 
            background-color: #FFFFFF; 
            line-height: 18px;
            width: 1440px;
            min-width: 1280px;
            overflow: auto;
          }
          .container { 
            display: flex; 
            height: 100vh;
          }
          .left-panel { 
            width: 360px; 
            background-color: #FFFFFF; 
            padding: 24px; 
            border-right: 1px solid #E3E7E4;
            overflow-y: auto;
          }
          .right-panel { 
            flex: 1; 
            background-color: #FFFFFF; 
            display: flex;
            flex-direction: column;
          }
          .preview-header { 
            padding: 24px; 
            border-bottom: 1px solid #E3E7E4;
          }
          .preview-content { 
            flex: 1;
            background-color: #E9F0EC;
            padding: 48px 32px;
            min-height: 480px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .preview-footer { 
            padding: 16px 24px; 
            border-top: 1px solid #E3E7E4;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          .bold { font-weight: bold; }
          .text-13 { font-size: 13px; }
          .text-14 { font-size: 14px; }
          .text-18 { font-size: 18px; }
          .text-20 { font-size: 20px; }
          .text-24 { font-size: 24px; }
          .text-primary { color: #0B3D2E; }
          .text-secondary { color: #4F5D57; }
          .text-disabled { color: #9AA7A0; }
          .mt-20 { margin-top: 20px; }
          .mt-24 { margin-top: 24px; }
          .mt-28 { margin-top: 28px; }
          .mb-10 { margin-bottom: 10px; }
          .mb-12 { margin-bottom: 12px; }
          .mb-20 { margin-bottom: 20px; }
          .mb-24 { margin-bottom: 24px; }
          .divider { 
            height: 1px; 
            background-color: #E3E7E4; 
            margin: 24px 0 24px 0;
          }
          .date-input-container {
            position: relative;
            margin-bottom: 24px;
          }
          .date-input {
            width: 100%;
            height: 40px;
            border: 1px solid #C7D1CB;
            border-radius: 8px;
            padding: 0 40px 0 12px;
            font-size: 13px;
            font-family: Inter, Segoe UI, Arial, sans-serif;
          }
          .date-input::placeholder {
            color: #9AA7A0;
          }
          .dropdown-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            color: #4F5D57;
          }
          .checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          .checkbox {
            width: 18px;
            height: 18px;
            border: 1px solid #9AA7A0;
            border-radius: 4px;
            margin-right: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .checkbox.checked {
            background-color: #0B7A5A;
            border-color: #0B7A5A;
          }
          .checkmark {
            color: #FFFFFF;
            font-size: 10px;
            line-height: 1;
          }
          .segmented-control {
            height: 36px;
            border: 1px solid #C7D1CB;
            border-radius: 18px;
            display: flex;
            background: #FFFFFF;
          }
          .segment-button {
            flex: 1;
            padding: 8px 16px;
            text-align: center;
            font-size: 13px;
            cursor: pointer;
            border-radius: 18px;
            font-weight: 600;
          }
          .segment-button.active {
            background: #0B7A5A;
            color: #FFFFFF;
          }
          .segment-button.inactive {
            background: #FFFFFF;
            color: #0B3D2E;
          }
          .preview-headline {
            font-size: 20px;
            font-weight: 700;
            color: #0B3D2E;
            margin: 24px 0 12px 0;
          }
          .preview-description {
            font-size: 14px;
            color: #4F5D57;
            line-height: 22px;
            max-width: 520px;
            margin: 0 auto 16px auto;
          }
          .support-link {
            font-size: 13px;
            color: #0B3D2E;
          }
          .support-link a {
            color: #0B7A5A;
            text-decoration: none;
          }
          .support-link a:hover {
            text-decoration: underline;
          }
          .btn {
            height: 40px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
          }
          .btn-export {
            border: 1px solid #C7D1CB;
            background: #FFFFFF;
            color: #9AA7A0;
            padding: 0 16px;
          }
          .btn-new-tab {
            background: #C7D1CB;
            color: #FFFFFF;
          }
          .svg-illustration {
            width: 180px;
            height: 180px;
          }
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #B7C4BD;
            border-radius: 3px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Left Filter Panel -->
          <div class="left-panel">
            <h1 class="text-24 bold text-primary mb-20">Depreciations</h1>
            
            <div class="date-input-container">
              <input type="text" class="date-input text-13 text-primary" placeholder="Enter date (yyyy-mm-dd)">
              <span class="dropdown-icon">▼</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="status-section">
              <div class="text-14 bold text-primary mb-12">Status</div>
              
              <div class="checkbox-container">
                <div class="checkbox checked">
                  <span class="checkmark">✓</span>
                </div>
                <span class="text-13 text-primary">Select all</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-13 text-primary">Not started</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-13 text-primary">Activated</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-13 text-primary">Fully depreciated</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-13 text-primary">Scrapped</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-13 text-primary">Sold</span>
              </div>
            </div>
            
            <div class="sort-by-section mt-28">
              <div class="text-14 bold text-primary mb-12">Sort by</div>
              
              <div class="segmented-control">
                <div class="segment-button active">Number</div>
                <div class="segment-button inactive">Description</div>
              </div>
            </div>
          </div>
          
          <!-- Right Preview Panel -->
          <div class="right-panel">
            <div class="preview-header">
              <div class="text-18 bold text-primary">Preview</div>
            </div>
            
            <div class="preview-content">
              <!-- SVG Illustration -->
              <svg class="svg-illustration" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
                <circle cx="90" cy="90" r="80" fill="#BFD8CC" stroke="#0B7A5A" stroke-width="2"/>
                <rect x="40" y="50" width="100" height="80" rx="8" fill="#FFFFFF" stroke="#0B7A5A" stroke-width="2"/>
                <line x1="50" y1="70" x2="130" y2="70" stroke="#9AA7A0" stroke-width="2" stroke-linecap="round"/>
                <line x1="50" y1="90" x2="120" y2="90" stroke="#9AA7A0" stroke-width="2" stroke-linecap="round"/>
                <line x1="50" y1="110" x2="110" y2="110" stroke="#9AA7A0" stroke-width="2" stroke-linecap="round"/>
                <circle cx="30" cy="40" r="10" fill="#F3A6B1" stroke="#0B7A5A" stroke-width="2"/>
                <circle cx="150" cy="40" r="10" fill="#F4C430" stroke="#0B7A5A" stroke-width="2"/>
                <path d="M60 150 L120 150" stroke="#0B7A5A" stroke-width="2" stroke-linecap="round"/>
                <path d="M90 150 L90 170" stroke="#0B7A5A" stroke-width="2" stroke-linecap="round"/>
              </svg>
              
              <div class="preview-headline">Preview your report!</div>
              
              <div class="preview-description">
                You're almost there! Select your criteria and filters to see how your report will look. The preview of the report will be displayed here as soon as you've made your selections. You can also choose to open the report in a separate tab in your browser or export it to PDF, CSV, or Excel formats.
              </div>
              
              <div class="support-link">
                Would you like to learn more about how to work with reports? Read more at <a href="#" onclick="event.preventDefault();">support.fortnox.se</a>
              </div>
            </div>
            
            <div class="preview-footer">
              <button class="btn btn-export" disabled>
                Export <span>▼</span>
              </button>
              <button class="btn btn-new-tab">
                Open in new tab
              </button>
            </div>
          </div>
        </div>
        
        <script>
          // Handle the "Open in new tab" button
          document.querySelector('.btn-new-tab').addEventListener('click', function() {
            // Create a new window with the actual deprecations report
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
                  <title>Depreciations Report</title>
                  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                  <style>
                    body { 
                      margin: 0; 
                      padding: 24px; 
                      font-family: Inter, Segoe UI, Arial, sans-serif; 
                      font-size: 13px; 
                      color: #0B3D2E; 
                      background-color: #FFFFFF; 
                      line-height: 18px;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      padding: 0 12px 0 12px; 
                    }
                    .left-header { 
                      text-align: left; 
                      margin-bottom: 6px;
                    }
                    .center-title { 
                      position: absolute; 
                      left: 50%; 
                      transform: translateX(-50%); 
                      top: 40px; 
                      font-size: 18px; 
                      font-weight: bold; 
                      color: #0B3D2E;
                    }
                    .right-header { 
                      text-align: right; 
                      color: #4F5D57; 
                      font-size: 12px;
                    }
                    .bold { font-weight: bold; }
                    .text-13 { font-size: 13px; }
                    .text-12 { font-size: 12px; }
                    .text-18 { font-size: 18px; }
                    .mt-6 { margin-top: 6px; }
                    .mb-6 { margin-bottom: 6px; }
                    .mb-8 { margin-bottom: 8px; }
                    .pb-4 { padding-bottom: 4px; }
                    .pt-2 { padding-top: 2px; }
                    .px-4 { padding-left: 4px; padding-right: 4px; }
                    .py-2 { padding-top: 2px; padding-bottom: 2px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .divider { 
                      height: 1px; 
                      background-color: #E3E7E4; 
                      margin: 6px 0 6px 0;
                    }
                    .section-header { 
                      font-size: 14px; 
                      font-weight: bold; 
                      color: #0B3D2E;
                      padding-bottom: 4px;
                      margin-top: 16px;
                    }
                    .table-container { padding: 0 12px 12px 12px; }
                    table { 
                      width: 100%; 
                      border-collapse: collapse; 
                    }
                    th { 
                      background-color: #F2F2F2;
                      font-weight: bold; 
                      padding: 8px 4px; 
                      text-align: left; 
                      border-bottom: 1px solid #CFCFCF;
                      font-size: 13px;
                      color: #333333;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 8px 4px;
                      border-bottom: 1px solid #EAEAEA;
                    }
                    .row-data {
                      font-size: 13px;
                      color: #0B3D2E;
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                    .depreciation-table {
                      margin-top: 16px;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <!-- Left Header Block -->
                    <div class="left-header">
                      <div class="bold text-13">Test company</div>
                      <div class="text-13">Financial Year 2026-01-01 – 2026-12-31</div>
                      <div class="text-13">Period 2026-01-01 – 2026-12-31</div>
                    </div>

                    <!-- Center Title -->
                    <div class="center-title">
                      Depreciations Report
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-12">Printed 2026-01-19 14:15</div>
                      <div class="text-12">Latest version A6 B3 F3 M1</div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="divider"></div>

                  <!-- Depreciations Table -->
                  <div class="depreciation-table">
                    <div class="section-header">Depreciations</div>
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
                            <td class="row-data">101</td>
                            <td class="row-data">Delivery Truck</td>
                            <td class="row-data">2024-05-15</td>
                            <td class="row-data numeric-right">450 000,00</td>
                            <td class="row-data numeric-right">90 000,00</td>
                            <td class="row-data numeric-right">360 000,00</td>
                            <td class="row-data numeric-right">45 000,00</td>
                            <td class="row-data">Active</td>
                          </tr>
                          <tr>
                            <td class="row-data">102</td>
                            <td class="row-data">Office Computer</td>
                            <td class="row-data">2025-03-10</td>
                            <td class="row-data numeric-right">25 000,00</td>
                            <td class="row-data numeric-right">8 333,33</td>
                            <td class="row-data numeric-right">16 666,67</td>
                            <td class="row-data numeric-right">8 333,33</td>
                            <td class="row-data">Active</td>
                          </tr>
                          <tr>
                            <td class="row-data">103</td>
                            <td class="row-data">Furniture Set</td>
                            <td class="row-data">2023-11-22</td>
                            <td class="row-data numeric-right">75 000,00</td>
                            <td class="row-data numeric-right">56 250,00</td>
                            <td class="row-data numeric-right">18 750,00</td>
                            <td class="row-data numeric-right">18 750,00</td>
                            <td class="row-data">Fully depreciated</td>
                          </tr>
                          <tr>
                            <td class="row-data">104</td>
                            <td class="row-data">Cash Register</td>
                            <td class="row-data">2025-08-05</td>
                            <td class="row-data numeric-right">12 000,00</td>
                            <td class="row-data numeric-right">3 000,00</td>
                            <td class="row-data numeric-right">9 000,00</td>
                            <td class="row-data numeric-right">3 000,00</td>
                            <td class="row-data">Active</td>
                          </tr>
                          <tr>
                            <td class="row-data">105</td>
                            <td class="row-data">Printer</td>
                            <td class="row-data">2024-01-18</td>
                            <td class="row-data numeric-right">8 000,00</td>
                            <td class="row-data numeric-right">5 333,33</td>
                            <td class="row-data numeric-right">2 666,67</td>
                            <td class="row-data numeric-right">2 666,67</td>
                            <td class="row-data">Active</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </body>
                </html>
              \`);
              
              reportWindow.focus();
            }
          });
          
          // Handle checkbox interactions
          const checkboxes = document.querySelectorAll('.checkbox');
          checkboxes.forEach((checkbox, index) => {
            if (index !== 0) { // Skip the "Select all" checkbox for individual interaction
              checkbox.addEventListener('click', function() {
                this.classList.toggle('checked');
                if (this.classList.contains('checked')) {
                  this.innerHTML = '<span class="checkmark">✓</span>';
                } else {
                  this.innerHTML = '';
                }
              });
            }
          });
          
          // Handle "Select all" checkbox
          const selectAllCheckbox = document.querySelectorAll('.checkbox')[0];
          selectAllCheckbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            if (this.classList.contains('checked')) {
              this.innerHTML = '<span class="checkmark">✓</span>';
              // Check all other checkboxes
              for (let i = 1; i < checkboxes.length; i++) {
                checkboxes[i].classList.add('checked');
                checkboxes[i].innerHTML = '<span class="checkmark">✓</span>';
              }
            } else {
              this.innerHTML = '';
              // Uncheck all other checkboxes
              for (let i = 1; i < checkboxes.length; i++) {
                checkboxes[i].classList.remove('checked');
                checkboxes[i].innerHTML = '';
              }
            }
          });
          
          // Handle segmented control buttons
          const segmentButtons = document.querySelectorAll('.segment-button');
          segmentButtons.forEach(button => {
            button.addEventListener('click', function() {
              // Remove active class from all buttons
              segmentButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('inactive');
              });
              
              // Add active class to clicked button
              this.classList.remove('inactive');
              this.classList.add('active');
            });
          });
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openDepreciations };