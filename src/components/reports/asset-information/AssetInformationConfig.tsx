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
              <input type="text" id="date-field" value="2026-01-20" class="text-11" />
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
              var reportHtml = '<!DOCTYPE html>' +
                '<html>' +
                '<head>' +
                '<meta charset="utf-8" />' +
                '<title>Assets - Report</title>' +
                '<style>' +
                'body { ' +
                'margin: 12px 16px 14px 16px; ' +
                'font-family: Arial, Helvetica, Sans-serif; ' +
                'font-size: 8px; ' +
                'color: #000000; ' +
                'background-color: #FFFFFF; ' +
                'line-height: 1.4;' +
                'overflow: auto;' +
                '}' +
                '.header-area { ' +
                'display: flex; ' +
                'justify-content: space-between; ' +
                'align-items: center; ' +
                'height: 48px;' +
                'margin-bottom: 0;' +
                '}' +
                '.left-header { ' +
                'font-size: 9px;' +
                'font-weight: normal;' +
                'color: #000000;' +
                'padding-top: 4px;' +
                'padding-left: 0;' +
                'text-align: left;' +
                '}' +
                '.center-header { ' +
                'font-size: 18px;' +
                'font-weight: bold;' +
                'color: #000000;' +
                'text-align: center;' +
                'vertical-align: middle;' +
                'letter-spacing: 0px;' +
                '}' +
                '.right-header { ' +
                'font-size: 8px;' +
                'font-weight: normal;' +
                'color: #000000;' +
                'text-align: right;' +
                'line-height: 10px;' +
                '}' +
                '.asset-block {' +
                'width: 100%;' +
                'padding-top: 8px;' +
                'padding-bottom: 8px;' +
                'background-color: #FFFFFF;' +
                '}' +
                '.asset-data-grid {' +
                'display: grid;' +
                'grid-template-columns: 34% 33% 33%;' +
                'column-gap: 8px;' +
                '}' +
                '.label {' +
                'font-size: 8px;' +
                'font-weight: bold;' +
                'color: #000000;' +
                'text-align: left;' +
                '}' +
                '.value {' +
                'font-size: 8px;' +
                'font-weight: normal;' +
                'color: #000000;' +
                'text-align: left;' +
                '}' +
                '.label-value-container {' +
                'display: flex;' +
                'align-items: flex-start;' +
                'margin-bottom: 2px;' +
                '}' +
                '.divider {' +
                'width: 100%;' +
                'height: 1px;' +
                'background-color: #000000;' +
                'margin-top: 6px;' +
                'margin-bottom: 6px;' +
                '}' +
                '.secondary-info {' +
                'font-size: 8px;' +
                'font-weight: normal;' +
                'color: #000000;' +
                'line-height: 10px;' +
                '}' +
                '.info-section {' +
                'display: grid;' +
                'grid-template-columns: repeat(3, 1fr);' +
                'gap: 0;' +
                '}' +
                '.info-field {' +
                'margin-bottom: 10px;' +
                '}' +
                '.info-field:last-child {' +
                'margin-bottom: 0;' +
                '}' +
                '</style>' +
                '</head>' +
                '<body>' +
                '<!-- Header Area -->' +
                '<div class="header-area">' +
                '<div class="left-header">Test company</div>' +
                '<div class="center-header">Assets</div>' +
                '<div class="right-header">' +
                'Printed: Printed 2026-01-20 09:02<br>' +
                'Date info: Date up to and including 2026-01-20' +
                '</div>' +
                '</div>' +
                '<!-- Asset 1 -->' +
                '<div class="asset-block">' +
                '<div class="asset-data-grid">' +
                '<div>' +
                '<div class="label-value-container">' +
                '<span class="label">Asset number</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">3</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Designation</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">"car"</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Asset type</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">1030 - Patent</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Acquisition value</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">10,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Acquisition date</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">2025-10-18</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write-off start</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">2025-10-01</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write off to residual value</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">5,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Status</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">Not activated</span>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div class="label-value-container">' +
                '<span class="label">Depreciable amount</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">5,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write-off basis</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">10,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Written off to</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">2035-09-30</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Accumulated write-off brought forward</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">0,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write-off during year</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">0,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Book value</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">10,00</span>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div class="label-value-container">' +
                '<span class="label">Remaining useful life</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">10 years and 0 months</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Useful life</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">10 years and 0 months</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write-off method</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">Straight</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Cost center</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">-</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Project</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">-</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<!-- Secondary Information Row -->' +
                '<div class="info-section">' +
                '<div class="info-field">' +
                '<span class="secondary-info">ID number</span><br>' +
                '<span class="secondary-info">Manufacturer/Brand</span><br>' +
                '<span class="secondary-info">Insured with</span><br>' +
                '<span class="secondary-info">Insurance number</span><br>' +
                '</div>' +
                '<div class="info-field">' +
                '<span class="secondary-info">Group</span><br>' +
                '<span class="secondary-info">Notes</span><br>' +
                '<span class="secondary-info">Room</span><br>' +
                '<span class="secondary-info">Location</span><br>' +
                '</div>' +
                '<div class="info-field">' +
                '<span class="secondary-info">Section</span><br>' +
                '<span class="secondary-info">Style</span><br>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<!-- Divider between assets -->' +
                '<div class="divider"></div>' +
                '<!-- Asset 2 -->' +
                '<div class="asset-block">' +
                '<div class="asset-data-grid">' +
                '<div>' +
                '<div class="label-value-container">' +
                '<span class="label">Asset number</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">4</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Designation</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">Building</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Asset type</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">1020 - Building</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Acquisition value</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">500,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Acquisition date</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">2025-05-15</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write-off start</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">2025-06-01</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write off to residual value</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">50,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Status</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">Active</span>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div class="label-value-container">' +
                '<span class="label">Depreciable amount</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">450,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write-off basis</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">450,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Written off to</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">2045-05-15</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Accumulated write-off brought forward</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">25,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write-off during year</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">25,00</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Book value</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">425,00</span>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<div class="label-value-container">' +
                '<span class="label">Remaining useful life</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">15 years and 6 months</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Useful life</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">20 years and 0 months</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Write-off method</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">Straight</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Cost center</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">Facilities</span>' +
                '</div>' +
                '<div class="label-value-container">' +
                '<span class="label">Project</span>' +
                '<span style="margin-left: 8px;"></span>' +
                '<span class="value">Construction</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<!-- Secondary Information Row -->' +
                '<div class="info-section">' +
                '<div class="info-field">' +
                '<span class="secondary-info">ID number</span><br>' +
                '<span class="secondary-info">Manufacturer/Brand</span><br>' +
                '<span class="secondary-info">Insured with</span><br>' +
                '<span class="secondary-info">Insurance number</span><br>' +
                '</div>' +
                '<div class="info-field">' +
                '<span class="secondary-info">Group</span><br>' +
                '<span class="secondary-info">Notes</span><br>' +
                '<span class="secondary-info">Room</span><br>' +
                '<span class="secondary-info">Location</span><br>' +
                '</div>' +
                '<div class="info-field">' +
                '<span class="secondary-info">Section</span><br>' +
                '<span class="secondary-info">Style</span><br>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</body>' +
                '</html>';
                
              reportWindow.document.write(reportHtml);
              
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