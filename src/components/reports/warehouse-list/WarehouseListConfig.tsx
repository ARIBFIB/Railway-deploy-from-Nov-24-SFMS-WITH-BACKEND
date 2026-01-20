const openWarehouseList = () => {
  // Open the Warehouse List filter screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=860,height=600,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Stock List - Filter</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.2;
            overflow: auto;
          }
          .container {
            width: 820px;
            margin: 0 auto;
            padding: 16px;
          }
          .section {
            border: 1px solid #7F7F7F;
            border-radius: 0;
            margin-bottom: 8px;
          }
          .section-title {
            font-size: 11px;
            font-weight: normal;
            padding: 8px 10px;
            border-top: 1px solid #7F7F7F;
          }
          .checkbox-group {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
            margin-right: 6px;
            accent-color: #000000;
          }
          .radio-group {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            margin-right: 6px;
            accent-color: #000000;
          }
          .action-buttons {
            text-align: center;
            margin-top: 14px;
          }
          .action-button {
            height: 24px;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: normal;
            border: 1px solid #6F6F6F;
            border-radius: 0;
            background-color: #D9F0C2;
            color: #000000;
            margin: 0 5px;
            cursor: pointer;
          }
          .action-button:hover {
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Show Section -->
          <div class="section">
            <div class="section-title">Show</div>
            <div style="padding: 8px 10px;">
              <div class="checkbox-group">
                <input type="checkbox" id="show-available" />
                <label for="show-available">Show available amount</label>
              </div>
              <div class="checkbox-group">
                <input type="checkbox" id="show-low-stock" />
                <label for="show-low-stock">Only show items with a low stock balance</label>
              </div>
            </div>
          </div>
          
          <!-- Orientation Section -->
          <div class="section">
            <div class="section-title">Orientation</div>
            <div style="padding: 8px 10px;">
              <div class="radio-group">
                <input type="radio" name="orientation" id="portrait" value="portrait" checked />
                <label for="portrait">Portrait</label>
              </div>
              <div class="radio-group">
                <input type="radio" name="orientation" id="landscape" value="landscape" />
                <label for="landscape">Landscape</label>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button id="show-on-screen" class="action-button">Show on screen</button>
            <button id="show-pdf" class="action-button">Show PDF</button>
            <button id="show-txt" class="action-button">Show TXT</button>
            <button id="cancel" class="action-button">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Open the report output in a new window
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
                  <title>Stock list</title>
                  <style>
                    body { 
                      margin: 24px 30px; 
                      font-family: Arial, sans-serif; 
                      font-size: 11px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.2;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      margin-bottom: 16px;
                    }
                    .left-header { 
                      font-size: 11px; 
                      font-weight: normal;
                      text-align: left; 
                    }
                    .right-header { 
                      font-size: 10px; 
                      color: #000000;
                      text-align: right; 
                    }
                    .report-title {
                      text-align: center;
                      font-size: 28px;
                      font-weight: normal;
                      margin: 10px 0 22px 0;
                    }
                    .table-header {
                      font-size: 11px;
                      font-weight: normal;
                      color: #000000;
                      border-bottom: 2px solid #000000;
                      padding-bottom: 4px;
                      margin-bottom: 6px;
                    }
                    .table-row {
                      height: 18px;
                      font-size: 11px;
                      padding: 2px 4px 2px 0;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .total-section {
                      text-align: right;
                      margin-top: 14px;
                      font-size: 14px;
                      font-weight: bold;
                      color: #000000;
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="right-header">Printed 2026-01-19 18:16</div>
                  </div>

                  <!-- Report Title -->
                  <div class="report-title">Stock list</div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">Item no.</div>
                      <div class="text-left" style="width: 180px;">Name</div>
                      <div class="text-left" style="width: 130px;">Storage location</div>
                      <div class="text-center" style="width: 90px;">Stock alert</div>
                      <div class="text-right" style="width: 110px;">Quantity in stock</div>
                      <div class="text-right" style="width: 130px;">Available quantity</div>
                      <div class="text-right" style="width: 110px;">Estimated cost</div>
                      <div class="text-right" style="width: 110px;">Stock value</div>
                    </div>
                  </div>

                  <!-- Data Rows -->
                  <div class="table-row">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">1001</div>
                      <div class="text-left" style="width: 180px;">Office Chair</div>
                      <div class="text-left" style="width: 130px;">Warehouse A</div>
                      <div class="text-center" style="width: 90px;">Low</div>
                      <div class="text-right" style="width: 110px;">5</div>
                      <div class="text-right" style="width: 130px;">5</div>
                      <div class="text-right" style="width: 110px;">120.00</div>
                      <div class="text-right" style="width: 110px;">600.00</div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">1002</div>
                      <div class="text-left" style="width: 180px;">Desk Lamp</div>
                      <div class="text-left" style="width: 130px;">Warehouse B</div>
                      <div class="text-center" style="width: 90px;"></div>
                      <div class="text-right" style="width: 110px;">15</div>
                      <div class="text-right" style="width: 130px;">15</div>
                      <div class="text-right" style="width: 110px;">25.50</div>
                      <div class="text-right" style="width: 110px;">382.50</div>
                    </div>
                  </div>
                  <div class="table-row">
                    <div style="display: flex;">
                      <div class="text-left" style="width: 60px;">1003</div>
                      <div class="text-left" style="width: 180px;">Computer Monitor</div>
                      <div class="text-left" style="width: 130px;">Warehouse A</div>
                      <div class="text-center" style="width: 90px;">Low</div>
                      <div class="text-right" style="width: 110px;">3</div>
                      <div class="text-right" style="width: 130px;">2</div>
                      <div class="text-right" style="width: 110px;">150.00</div>
                      <div class="text-right" style="width: 110px;">450.00</div>
                    </div>
                  </div>

                  <!-- Total Section -->
                  <div class="total-section">
                    Total 1432.50
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
            alert('PDF export would be triggered here');
          };
          
          document.getElementById('show-txt').onclick = function() {
            alert('TXT export would be triggered here');
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
        </script>
      </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
  }
};

export { openWarehouseList };