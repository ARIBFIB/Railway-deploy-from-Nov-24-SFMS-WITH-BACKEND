const openItemDirectory = () => {
  // Open the Item Directory filter/parameter screen
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=400,height=350,scrollbars=no,resizable=no'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Article Index - Filter Parameters</title>
        <style>
          body { 
            margin: 0; 
            padding: 8px; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.2;
            overflow: hidden;
          }
          .container {
            width: 100%;
          }
          .section {
            margin-bottom: 6px;
            width: 100%;
          }
          .field-label {
            font-size: 11px;
            color: #000000;
            margin-bottom: 2px;
            text-align: left;
          }
          select {
            width: 180px;
            height: 18px;
            padding: 2px 4px;
            border: 1px solid #6F6F6F;
            background-color: #FFFFFF;
            font-size: 11px;
            font-family: Arial, Helvetica, sans-serif;
            color: #000000;
            border-radius: 0;
          }
          .group-box {
            border: 1px solid #6F6F6F;
            padding: 6px;
            margin-top: 6px;
            background-color: #FFFFFF;
          }
          .legend {
            font-size: 11px;
            padding: 0 4px;
            color: #000000;
            position: relative;
            top: -14px;
            left: 8px;
            background-color: #FFFFFF;
          }
          .radio-group {
            display: flex;
            align-items: center;
          }
          .radio-option {
            display: flex;
            align-items: center;
            margin-right: 12px;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
            border: 1px solid #000000;
            accent-color: #1E5DB8;
            margin-right: 4px;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
            border: 1px solid #000000;
            accent-color: #1E5DB8;
            margin-right: 4px;
          }
          .checkbox-group {
            display: flex;
            align-items: center;
          }
          .btn-row {
            margin-top: 8px;
            text-align: center;
          }
          .btn {
            height: 22px;
            min-width: 90px;
            padding: 2px 10px;
            font-size: 11px;
            font-weight: normal;
            border: 1px solid #5F7F4F;
            background-color: #CFE6B8;
            color: #000000;
            border-radius: 0;
            cursor: pointer;
            margin: 0 3px;
          }
          .btn:hover {
            background-color: #B9D99A;
          }
          .btn:active {
            background-color: #A6CB84;
          }
          .mr-4 { margin-right: 4px; }
          .mt-6 { margin-top: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Pricelist Field -->
          <div class="section">
            <div class="field-label">Pricelist</div>
            <select id="pricelist">
              <option value="all">ALL</option>
              <option value="a">Price list A</option>
              <option value="b">Price list B</option>
              <option value="c">Price list C</option>
            </select>
          </div>

          <!-- Order by Group Box -->
          <div class="section">
            <fieldset class="group-box">
              <legend class="legend">Order by</legend>
              <div class="radio-group">
                <div class="radio-option">
                  <input type="radio" id="item-no" name="order-by" value="item-no" checked />
                  <label for="item-no" class="mr-4">Item No#</label>
                </div>
                <div class="radio-option">
                  <input type="radio" id="in-price" name="order-by" value="in-price" />
                  <label for="in-price" class="mr-4">In price</label>
                </div>
                <div class="radio-option">
                  <input type="radio" id="designation" name="order-by" value="designation" />
                  <label for="designation" class="mr-4">Designation</label>
                </div>
              </div>
            </fieldset>
          </div>

          <!-- Show Group Box -->
          <div class="section">
            <fieldset class="group-box">
              <legend class="legend">Show</legend>
              <div class="checkbox-group">
                <input type="checkbox" id="show-available" />
                <label for="show-available">Show available amount</label>
              </div>
            </fieldset>
          </div>

          <!-- Orientation Group Box -->
          <div class="section">
            <fieldset class="group-box">
              <legend class="legend">Orientation</legend>
              <div class="radio-group">
                <div class="radio-option">
                  <input type="radio" id="portrait" name="orientation" value="portrait" checked />
                  <label for="portrait" class="mr-4">Portrait</label>
                </div>
                <div class="radio-option">
                  <input type="radio" id="landscape" name="orientation" value="landscape" />
                  <label for="landscape" class="mr-4">Landscape</label>
                </div>
              </div>
            </fieldset>
          </div>

          <!-- Action Buttons -->
          <div class="btn-row">
            <button id="show-on-screen" class="btn">Show on screen</button>
            <button id="show-pdf" class="btn">Show PDF</button>
            <button id="show-txt" class="btn">Show TXT</button>
            <button id="cancel" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get form values
            const pricelist = document.getElementById('pricelist').value;
            const orderBy = document.querySelector('input[name="order-by"]:checked').value;
            const showAvailable = document.getElementById('show-available').checked;
            const orientation = document.querySelector('input[name="orientation"]:checked').value;
            
            // Open the article index report in a new window
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
                  <title>Article Index</title>
                  <style>
                    body { 
                      margin: 16px; 
                      font-family: Arial, Helvetica, sans-serif; 
                      font-size: 11px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.2;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: center; 
                      margin-bottom: 16px;
                    }
                    .left-header { 
                      font-size: 11px; 
                      text-align: left; 
                    }
                    .center-header { 
                      font-size: 22px; 
                      font-weight: bold; 
                      text-align: center; 
                      position: absolute;
                      left: 50%;
                      transform: translateX(-50%);
                    }
                    .right-header { 
                      font-size: 11px; 
                      text-align: right; 
                    }
                    .table-header {
                      font-size: 11px;
                      font-weight: bold;
                      padding-bottom: 4px;
                      border-bottom: 2px solid #000000;
                      margin: 6px 0;
                    }
                    .table-row {
                      padding: 4px 0;
                      font-size: 11px;
                    }
                    .sub-row {
                      padding: 2px 0;
                      font-size: 11px;
                      margin-left: 24px;
                    }
                    .text-left { text-align: left; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .bold { font-weight: bold; }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <div class="left-header">Test company</div>
                    <div class="center-header">Article index</div>
                    <div class="right-header">Printed 2026-01-19 17:39</div>
                  </div>

                  <!-- Table Header -->
                  <div class="table-header">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">Item no.</div>
                      <div class="text-left" style="width: 30%;">Name</div>
                      <div class="text-right" style="width: 15%;">Quantity in stock</div>
                      <div class="text-right" style="width: 15%;">Estimated cost</div>
                      <div class="text-right" style="width: 20%;">Stock value</div>
                    </div>
                  </div>

                  <!-- Data Rows -->
                  <!-- Item 1 -->
                  <div class="table-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">1</div>
                      <div class="text-left" style="width: 30%;">Chair</div>
                      <div class="text-right" style="width: 15%;">-</div>
                      <div class="text-right" style="width: 15%;">10,00</div>
                      <div class="text-right" style="width: 20%;">-</div>
                    </div>
                  </div>
                  <div class="sub-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">A</div>
                      <div class="text-left" style="width: 30%;">Price list A</div>
                      <div class="text-right" style="width: 15%;">0+</div>
                      <div class="text-right" style="width: 15%;">Price</div>
                      <div class="text-right" style="width: 20%;">120,00</div>
                    </div>
                  </div>

                  <!-- Item 2 -->
                  <div class="table-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">2</div>
                      <div class="text-left" style="width: 30%;">Desk</div>
                      <div class="text-right" style="width: 15%;">5</div>
                      <div class="text-right" style="width: 15%;">45,00</div>
                      <div class="text-right" style="width: 20%;">225,00</div>
                    </div>
                  </div>
                  <div class="sub-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">A</div>
                      <div class="text-left" style="width: 30%;">Price list A</div>
                      <div class="text-right" style="width: 15%;">0+</div>
                      <div class="text-right" style="width: 15%;">Price</div>
                      <div class="text-right" style="width: 20%;">180,00</div>
                    </div>
                  </div>

                  <!-- Item 3 -->
                  <div class="table-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">3</div>
                      <div class="text-left" style="width: 30%;">Lamp</div>
                      <div class="text-right" style="width: 15%;">12</div>
                      <div class="text-right" style="width: 15%;">8,50</div>
                      <div class="text-right" style="width: 20%;">102,00</div>
                    </div>
                  </div>
                  <div class="sub-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">A</div>
                      <div class="text-left" style="width: 30%;">Price list A</div>
                      <div class="text-right" style="width: 15%;">0+</div>
                      <div class="text-right" style="width: 15%;">Price</div>
                      <div class="text-right" style="width: 20%;">35,00</div>
                    </div>
                  </div>

                  <!-- Item 4 -->
                  <div class="table-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">4</div>
                      <div class="text-left" style="width: 30%;">Monitor</div>
                      <div class="text-right" style="width: 15%;">8</div>
                      <div class="text-right" style="width: 15%;">120,00</div>
                      <div class="text-right" style="width: 20%;">960,00</div>
                    </div>
                  </div>
                  <div class="sub-row">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-left" style="width: 20%;">A</div>
                      <div class="text-left" style="width: 30%;">Price list A</div>
                      <div class="text-right" style="width: 15%;">0+</div>
                      <div class="text-right" style="width: 15%;">Price</div>
                      <div class="text-right" style="width: 20%;">1 200,00</div>
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
          
          document.getElementById('show-txt').onclick = function() {
            alert('TXT generation would happen here');
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Set focus to the pricelist dropdown on load
          window.onload = function() {
            document.getElementById('pricelist').focus();
          };
        </script>
      </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
  }
};

export { openItemDirectory };