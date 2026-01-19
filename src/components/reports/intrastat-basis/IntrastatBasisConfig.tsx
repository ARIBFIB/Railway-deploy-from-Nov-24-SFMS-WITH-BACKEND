const openIntrastatBasis = () => {
  // Open the Intrastat Basis report setup page
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=800,height=700,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Intrastat Basis - Report Setup</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Inter, Arial, system-ui, sans-serif; 
            font-size: 12px; 
            color: #1F2937; 
            background-color: #FFFFFF; 
            line-height: 1.4;
            overflow: hidden;
          }
          .container {
            width: 100%;
            max-width: 720px;
            margin: 0 auto;
            padding: 48px 0 64px 0;
          }
          .section {
            margin-bottom: 48px;
          }
          .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #064E3B;
            text-align: center;
            margin-bottom: 8px;
          }
          .section-description {
            font-size: 12px;
            font-weight: 400;
            line-height: 18px;
            color: #374151;
            max-width: 560px;
            text-align: center;
            margin: 0 auto 20px auto;
          }
          .toggle-container {
            width: 320px;
            height: 40px;
            border: 1px solid #D1D5DB;
            border-radius: 20px;
            padding: 2px;
            margin: 0 auto;
          }
          .toggle-options {
            display: flex;
            width: 100%;
            height: 100%;
          }
          .toggle-option {
            flex: 1;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            border-radius: 18px;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .toggle-option.selected {
            background: #047857;
            color: #FFFFFF;
            font-weight: 600;
          }
          .toggle-option:not(.selected) {
            background: transparent;
            color: #111827;
            font-weight: 500;
          }
          .dropdown-container {
            width: 360px;
            height: 44px;
            border: 1px solid #D1D5DB;
            border-radius: 8px;
            padding: 0 14px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            cursor: pointer;
          }
          .dropdown-placeholder {
            font-size: 12px;
            color: #6B7280;
            flex: 1;
          }
          .dropdown-icon {
            width: 14px;
            height: 14px;
            color: #374151;
            margin-left: 8px;
          }
          .primary-button {
            width: 240px;
            height: 44px;
            border-radius: 22px;
            font-size: 13px;
            font-weight: 600;
            margin: 36px auto 0 auto;
            display: block;
            cursor: not-allowed;
            background: #D1D5DB;
            color: #FFFFFF;
            border: none;
            text-align: center;
            line-height: 44px;
          }
          .primary-button.enabled {
            background: #047857;
            cursor: pointer;
          }
          .primary-button.enabled:hover {
            background: #065F46;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Choose report type section -->
          <div class="section">
            <div class="section-title">Choose report type</div>
            <div class="section-description">
              We recommend the summarized report data, which contain only the required information.<br>
              For a detailed preview of the entire report data, choose the detailed report basis.
            </div>
            <div class="toggle-container">
              <div class="toggle-options">
                <div class="toggle-option selected" id="summarized-option">
                  Summarized
                </div>
                <div class="toggle-option" id="detailed-option">
                  Detailed
                </div>
              </div>
            </div>
          </div>
          
          <!-- Choose period section -->
          <div class="section">
            <div class="section-title">Choose period</div>
            <div class="section-description">
              For the chosen period, report data for trade in goods within the EU will be fetched.
            </div>
            <div class="dropdown-container" id="interval-dropdown">
              <div class="dropdown-placeholder">Interval</div>
              <div class="dropdown-icon">▼</div>
            </div>
          </div>
          
          <!-- Primary action button -->
          <button id="fetch-report" class="primary-button" disabled>
            Fetch report basis
          </button>
        </div>
        
        <script>
          // State variables
          let reportType = 'summarized';
          let interval = '';
          
          // Toggle functionality
          document.getElementById('summarized-option').addEventListener('click', function() {
            document.querySelectorAll('.toggle-option').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            reportType = 'summarized';
            checkButtonState();
          });
          
          document.getElementById('detailed-option').addEventListener('click', function() {
            document.querySelectorAll('.toggle-option').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            reportType = 'detailed';
            checkButtonState();
          });
          
          // Dropdown functionality
          document.getElementById('interval-dropdown').addEventListener('click', function() {
            const selectedInterval = prompt('Enter interval (e.g., January 2026, Q1 2026, etc.):', '');
            if (selectedInterval !== null && selectedInterval.trim() !== '') {
              document.querySelector('.dropdown-placeholder').textContent = selectedInterval;
              interval = selectedInterval;
              checkButtonState();
            }
          });
          
          // Check if button should be enabled
          function checkButtonState() {
            const button = document.getElementById('fetch-report');
            if (interval.trim() !== '') {
              button.disabled = false;
              button.classList.add('enabled');
            } else {
              button.disabled = true;
              button.classList.remove('enabled');
            }
          }
          
          // Fetch report button functionality
          document.getElementById('fetch-report').addEventListener('click', function() {
            if (!this.disabled) {
              // Open the report preview in a new window
              const previewWindow = window.open(
                '', 
                '_blank', 
                'width=1200,height=800,scrollbars=yes,resizable=yes'
              );
              
              if (previewWindow) {
                previewWindow.document.write(\`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8" />
                    <title>Intrastat Report Preview - \${reportType} (\${interval})</title>
                    <style>
                      body { 
                        margin: 24px 30px; 
                        font-family: Inter, Arial, system-ui, sans-serif; 
                        font-size: 12px; 
                        color: #1F2937; 
                        background-color: #FFFFFF; 
                        line-height: 1.4;
                        overflow: auto;
                      }
                      .header-area { 
                        display: flex; 
                        justify-content: space-between; 
                        align-items: flex-start; 
                        margin-bottom: 16px;
                      }
                      .left-header { 
                        font-size: 12px; 
                        font-weight: 600;
                        text-align: left; 
                        color: #064E3B;
                      }
                      .right-header { 
                        font-size: 11px; 
                        color: #374151;
                        text-align: right; 
                      }
                      .report-title {
                        text-align: center;
                        font-size: 24px;
                        font-weight: 600;
                        color: #064E3B;
                        margin: 10px 0 22px 0;
                      }
                      .report-subtitle {
                        text-align: center;
                        font-size: 14px;
                        color: #374151;
                        margin-bottom: 24px;
                      }
                      .table-header {
                        font-size: 12px;
                        font-weight: 600;
                        color: #1F2937;
                        border-bottom: 2px solid #047857;
                        padding-bottom: 6px;
                        margin-bottom: 8px;
                      }
                      .table-row {
                        height: 20px;
                        font-size: 12px;
                        padding: 3px 0;
                      }
                      .text-left { text-align: left; }
                      .text-right { text-align: right; }
                      .text-center { text-align: center; }
                      .bold { font-weight: 600; }
                      .preview-info {
                        text-align: center;
                        color: #374151;
                        margin: 40px 0;
                        font-style: italic;
                      }
                      .action-buttons {
                        text-align: center;
                        margin-top: 30px;
                      }
                      .action-button {
                        height: 40px;
                        padding: 0 24px;
                        font-size: 13px;
                        font-weight: 600;
                        border-radius: 20px;
                        background-color: #047857;
                        color: #FFFFFF;
                        border: none;
                        margin: 0 10px;
                        cursor: pointer;
                      }
                      .action-button:hover {
                        background-color: #065F46;
                      }
                    </style>
                  </head>
                  <body>
                    <!-- Header Area -->
                    <div class="header-area">
                      <div class="left-header">Intrastat Report</div>
                      <div class="right-header">Generated: \${new Date().toLocaleString()}</div>
                    </div>

                    <!-- Report Title -->
                    <div class="report-title">Intrastat Report Preview</div>
                    <div class="report-subtitle">\${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report for \${interval}</div>

                    <!-- Table Header -->
                    <div class="table-header">
                      <div style="display: flex;">
                        <div class="text-left" style="width: 100px;">Period</div>
                        <div class="text-left" style="width: 120px;">Partner</div>
                        <div class="text-left" style="width: 150px;">Commodity Code</div>
                        <div class="text-left" style="width: 200px;">Description</div>
                        <div class="text-right" style="width: 100px;">Value (€)</div>
                        <div class="text-right" style="width: 80px;">Weight (kg)</div>
                        <div class="text-center" style="width: 80px;">Quantity</div>
                      </div>
                    </div>

                    <!-- Data Rows -->
                    <div class="table-row">
                      <div style="display: flex;">
                        <div class="text-left" style="width: 100px;">Jan 2026</div>
                        <div class="text-left" style="width: 120px;">DE123456789</div>
                        <div class="text-left" style="width: 150px;">8471.30.00</div>
                        <div class="text-left" style="width: 200px;">Laptop Computers</div>
                        <div class="text-right" style="width: 100px;">25,000.00</div>
                        <div class="text-right" style="width: 80px;">120.5</div>
                        <div class="text-center" style="width: 80px;">50</div>
                      </div>
                    </div>
                    <div class="table-row">
                      <div style="display: flex;">
                        <div class="text-left" style="width: 100px;">Jan 2026</div>
                        <div class="text-left" style="width: 120px;">FR987654321</div>
                        <div class="text-left" style="width: 150px;">8517.12.00</div>
                        <div class="text-left" style="width: 200px;">Mobile Phones</div>
                        <div class="text-right" style="width: 100px;">18,500.00</div>
                        <div class="text-right" style="width: 80px;">85.2</div>
                        <div class="text-center" style="width: 80px;">35</div>
                      </div>
                    </div>
                    <div class="table-row">
                      <div style="display: flex;">
                        <div class="text-left" style="width: 100px;">Jan 2026</div>
                        <div class="text-left" style="width: 120px;">NL567891234</div>
                        <div class="text-left" style="width: 150px;">8466.20.00</div>
                        <div class="text-left" style="width: 200px;">Industrial Machinery</div>
                        <div class="text-right" style="width: 100px;">42,300.00</div>
                        <div class="text-right" style="width: 80px;">1,250.0</div>
                        <div class="text-center" style="width: 80px;">8</div>
                      </div>
                    </div>

                    <!-- Preview Info -->
                    <div class="preview-info">
                      This is a preview of the \${reportType} Intrastat report for \${interval}.<br>
                      Actual data will be fetched when you run the full report.
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                      <button class="action-button" onclick="alert('CSV export would be triggered here')">Export CSV</button>
                      <button class="action-button" onclick="alert('PDF export would be triggered here')">Export PDF</button>
                    </div>
                  </body>
                  </html>
                \`);
                
                previewWindow.focus();
              }
              
              // Close the setup window
              window.close();
            }
          });
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openIntrastatBasis };