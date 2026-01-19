const openAssetGroups = () => {
  // Open the Asset Groups filter & preview window
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
        <title>Asset Groups</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Inter, Arial, sans-serif; 
            font-size: 14px; 
            color: #003B2F; 
            background-color: #FFFFFF; 
            line-height: 1.4;
            width: 1440px;
            max-width: 1440px;
            overflow: auto;
          }
          .container { 
            display: flex; 
            height: 100vh;
            padding: 0 16px;
          }
          .left-panel { 
            width: 320px; 
            background-color: #FFFFFF; 
            padding: 16px 14px; 
            border-right: 1px solid #E0E0E0;
            overflow-y: auto;
          }
          .right-panel { 
            flex: 1; 
            background-color: #F3F7F5; 
            border-radius: 12px;
            margin-left: 16px;
            display: flex;
            flex-direction: column;
          }
          .preview-header { 
            padding: 16px; 
            background: #FFFFFF;
            border-bottom: 1px solid #E0E0E0;
            border-radius: 12px 12px 0 0;
          }
          .preview-content { 
            flex: 1;
            background-color: #EEF4F1;
            padding: 40px 24px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          }
          .preview-footer { 
            padding: 16px; 
            background: #FFFFFF;
            border-top: 1px solid #E0E0E0;
            border-radius: 0 0 12px 12px;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }
          .bold { font-weight: bold; }
          .text-13 { font-size: 13px; }
          .text-14 { font-size: 14px; }
          .text-16 { font-size: 16px; }
          .text-18 { font-size: 18px; }
          .text-20 { font-size: 20px; }
          .text-22 { font-size: 22px; }
          .font-semibold { font-weight: 600; }
          .font-bold { font-weight: 700; }
          .text-dark-green { color: #003B2F; }
          .text-muted { color: #2E4E43; }
          .text-link { color: #006E3B; }
          .text-disabled { color: #B0B7B3; }
          .mt-10 { margin-top: 10px; }
          .mt-12 { margin-top: 12px; }
          .mt-16 { margin-top: 16px; }
          .mt-20 { margin-top: 20px; }
          .mb-10 { margin-bottom: 10px; }
          .mb-12 { margin-bottom: 12px; }
          .mb-16 { margin-bottom: 16px; }
          .mb-20 { margin-bottom: 20px; }
          .ml-10 { margin-left: 10px; }
          .mx-auto { margin-left: auto; margin-right: auto; }
          .divider { 
            height: 1px; 
            background-color: #E5E5E5; 
            margin: 20px 0;
          }
          .date-input-container {
            position: relative;
            margin-bottom: 16px;
          }
          .date-input {
            width: 100%;
            height: 40px;
            border: 1px solid #BDBDBD;
            border-radius: 8px;
            padding: 0 40px 0 12px;
            font-size: 14px;
            font-family: Inter, Arial, sans-serif;
            background: #FFFFFF;
            color: #333333;
          }
          .date-input::placeholder {
            color: #9E9E9E;
          }
          .dropdown-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            width: 14px;
            height: 14px;
            color: #616161;
          }
          .checkbox-container {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          .checkbox {
            width: 18px;
            height: 18px;
            border: 1px solid #9E9E9E;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .checkbox.checked {
            background-color: #006E3B;
            border-color: #006E3B;
          }
          .checkmark {
            color: #FFFFFF;
            font-size: 12px;
            line-height: 1;
          }
          .segmented-control {
            height: 36px;
            border: 1px solid #006E3B;
            border-radius: 18px;
            display: flex;
            background: #FFFFFF;
          }
          .segment-button {
            flex: 1;
            padding: 6px 18px;
            text-align: center;
            font-size: 14px;
            cursor: pointer;
            border-radius: 18px;
            font-weight: 600;
          }
          .segment-button.active {
            background: #006E3B;
            color: #FFFFFF;
          }
          .segment-button.inactive {
            background: #FFFFFF;
            color: #006E3B;
          }
          .preview-title {
            font-size: 20px;
            font-weight: 700;
            color: #003B2F;
            margin-top: 20px;
          }
          .preview-description {
            font-size: 14px;
            color: #2E4E43;
            line-height: 1.6;
            max-width: 520px;
            margin: 12px auto;
          }
          .help-link {
            font-size: 13px;
            color: #006E3B;
            text-decoration: underline;
            margin-top: 10px;
          }
          .btn {
            height: 40px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;
            cursor: pointer;
          }
          .btn-export {
            border: 2px solid #C0C7C3;
            background: #FFFFFF;
            color: #B0B7B3;
            padding: 0 18px;
          }
          .btn-new-tab {
            background: #C9CFCC;
            color: #FFFFFF;
          }
          .svg-illustration {
            width: 140px;
            height: 140px;
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
            <h1 class="text-22 font-bold text-dark-green mb-16">Asset groups</h1>
            
            <div class="date-input-container">
              <input type="text" class="date-input text-14" placeholder="Enter date (yyyy-mm-dd)">
              <span class="dropdown-icon">▼</span>
            </div>
            
            <div class="divider"></div>
            
            <div class="status-section">
              <div class="text-16 font-semibold text-dark-green mb-12">Status</div>
              
              <div class="checkbox-container">
                <div class="checkbox checked">
                  <span class="checkmark">✓</span>
                </div>
                <span class="text-14 text-dark-green ml-10">Select all</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-14 text-dark-green ml-10">Not started</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-14 text-dark-green ml-10">Activated</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-14 text-dark-green ml-10">Fully depreciated</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-14 text-dark-green ml-10">Scrapped</span>
              </div>
              
              <div class="checkbox-container">
                <div class="checkbox">
                </div>
                <span class="text-14 text-dark-green ml-10">Sold</span>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="sort-by-section">
              <div class="text-16 font-semibold text-dark-green mb-10">Sort by</div>
              
              <div class="segmented-control">
                <div class="segment-button inactive">Description</div>
                <div class="segment-button active">Number</div>
              </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="orientation-section">
              <div class="text-16 font-semibold text-dark-green mb-10">Orientation</div>
              
              <div class="segmented-control">
                <div class="segment-button inactive">Portrait</div>
                <div class="segment-button active">Landscape</div>
              </div>
            </div>
          </div>
          
          <!-- Right Preview Panel -->
          <div class="right-panel">
            <div class="preview-header">
              <div class="text-18 font-semibold text-dark-green">Preview</div>
            </div>
            
            <div class="preview-content">
              <!-- SVG Illustration -->
              <svg class="svg-illustration" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                <circle cx="70" cy="70" r="65" fill="#EEF4F1" stroke="#006E3B" stroke-width="2"/>
                <rect x="30" y="40" width="80" height="60" rx="8" fill="#FFFFFF" stroke="#006E3B" stroke-width="2"/>
                <line x1="40" y1="55" x2="100" y2="55" stroke="#9E9E9E" stroke-width="2" stroke-linecap="round"/>
                <line x1="40" y1="70" x2="90" y2="70" stroke="#9E9E9E" stroke-width="2" stroke-linecap="round"/>
                <line x1="40" y1="85" x2="85" y2="85" stroke="#9E9E9E" stroke-width="2" stroke-linecap="round"/>
                <circle cx="20" cy="30" r="8" fill="#F28CB1" stroke="#006E3B" stroke-width="2"/>
                <circle cx="120" cy="30" r="8" fill="#F4B400" stroke="#006E3B" stroke-width="2"/>
                <path d="M50 110 L90 110" stroke="#006E3B" stroke-width="2" stroke-linecap="round"/>
                <path d="M70 110 L70 125" stroke="#006E3B" stroke-width="2" stroke-linecap="round"/>
              </svg>
              
              <div class="preview-title">Preview your report!</div>
              
              <div class="preview-description">
                You're almost there! Select your criteria and filters to see how your report will look. The preview of the report will be displayed here as soon as you've made your selections. You can also choose to open the report in a separate tab in your browser or export it to PDF, CSV, or Excel formats.
              </div>
              
              <div class="help-link">
                Read more at support.fortnox.se
              </div>
            </div>
            
            <div class="preview-footer">
              <button class="btn btn-export" disabled>
                Export
              </button>
              <button id="open-report" class="btn btn-new-tab">
                Open in new tab
              </button>
            </div>
          </div>
        </div>
        
        <script>
          // Handle the "Open in new tab" button
          document.getElementById('open-report').addEventListener('click', function() {
            // Create a new window with the actual asset groups report
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
                  <title>Asset Groups Report</title>
                  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
                  <style>
                    body { 
                      margin: 0; 
                      padding: 24px; 
                      font-family: Inter, Arial, sans-serif; 
                      font-size: 13px; 
                      color: #003B2F; 
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
                      color: #003B2F;
                    }
                    .right-header { 
                      text-align: right; 
                      color: #2E4E43; 
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
                      background-color: #E5E5E5; 
                      margin: 6px 0 6px 0;
                    }
                    .section-header { 
                      font-size: 14px; 
                      font-weight: bold; 
                      color: #003B2F;
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
                      color: #003B2F;
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                    .asset-groups-table {
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
                      Asset Groups Report
                    </div>

                    <!-- Right Header Block -->
                    <div class="right-header">
                      <div class="text-12">Printed 2026-01-19 16:45</div>
                      <div class="text-12">Latest version A6 B3 F3 M1</div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="divider"></div>

                  <!-- Asset Groups Table -->
                  <div class="asset-groups-table">
                    <div class="section-header">Asset Groups</div>
                    <div class="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th style="width: 60px;">Group</th>
                            <th style="width: 200px;">Description</th>
                            <th style="width: 100px;">Assets</th>
                            <th style="width: 120px;">Total Value</th>
                            <th style="width: 120px;">Acc. Depreciation</th>
                            <th style="width: 120px;">Net Book Value</th>
                            <th style="width: 100px;">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="row-data">100</td>
                            <td class="row-data">Vehicles</td>
                            <td class="row-data numeric-right">15</td>
                            <td class="row-data numeric-right">1 250 000,00</td>
                            <td class="row-data numeric-right">425 000,00</td>
                            <td class="row-data numeric-right">825 000,00</td>
                            <td class="row-data">Active</td>
                          </tr>
                          <tr>
                            <td class="row-data">200</td>
                            <td class="row-data">Machinery</td>
                            <td class="row-data numeric-right">22</td>
                            <td class="row-data numeric-right">2 100 000,00</td>
                            <td class="row-data numeric-right">890 000,00</td>
                            <td class="row-data numeric-right">1 210 000,00</td>
                            <td class="row-data">Active</td>
                          </tr>
                          <tr>
                            <td class="row-data">300</td>
                            <td class="row-data">Office Equipment</td>
                            <td class="row-data numeric-right">45</td>
                            <td class="row-data numeric-right">180 000,00</td>
                            <td class="row-data numeric-right">120 000,00</td>
                            <td class="row-data numeric-right">60 000,00</td>
                            <td class="row-data">Active</td>
                          </tr>
                          <tr>
                            <td class="row-data">400</td>
                            <td class="row-data">Furniture</td>
                            <td class="row-data numeric-right">32</td>
                            <td class="row-data numeric-right">240 000,00</td>
                            <td class="row-data numeric-right">180 000,00</td>
                            <td class="row-data numeric-right">60 000,00</td>
                            <td class="row-data">Fully depreciated</td>
                          </tr>
                          <tr>
                            <td class="row-data">500</td>
                            <td class="row-data">Computer Equipment</td>
                            <td class="row-data numeric-right">28</td>
                            <td class="row-data numeric-right">140 000,00</td>
                            <td class="row-data numeric-right">95 000,00</td>
                            <td class="row-data numeric-right">45 000,00</td>
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
              // Remove active class from all buttons in the same control
              const parentControl = this.parentElement;
              const buttonsInControl = parentControl.querySelectorAll('.segment-button');
              buttonsInControl.forEach(btn => {
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

export { openAssetGroups };