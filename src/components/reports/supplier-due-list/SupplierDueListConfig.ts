// Supplier Due List Configuration
// Opens the supplier due list in a new window/tab

export const openSupplierDueList = () => {
  // Import the component dynamically
  import('./SupplierDueList')
    .then(module => {
      const SupplierDueList = module.default;
      
      // Create a new window
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=960,height=600,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        // Write the HTML structure
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Supplier Due List</title>
            <style>
              body {
                margin: 0;
                padding: 8px 12px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                line-height: 1.3;
                color: #000000;
                background-color: #FFFFFF;
                overflow: hidden;
              }
              #root {
                width: 100%;
                max-width: 960px;
                margin: 0 auto;
              }
              .border {
                border: 1px solid #000000;
              }
              .border-black {
                border-color: #000000;
              }
              .p-2 {
                padding: 8px;
              }
              .mb-1\\.5 {
                margin-bottom: 6px;
              }
              .mb-3 {
                margin-bottom: 12px;
              }
              .flex {
                display: flex;
              }
              .items-center {
                align-items: center;
              }
              .w-10 {
                width: 40px;
              }
              .text-xs {
                font-size: 12px;
              }
              .text-black {
                color: #000000;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .w-28 {
                width: 110px;
              }
              .h-5 {
                height: 20px;
              }
              .border-gray-500 {
                border-color: #7F7F7F;
              }
              .px-1 {
                padding: 2px 4px;
              }
              .w-4 {
                width: 16px;
              }
              .h-4 {
                height: 16px;
              }
              .ml-1 {
                margin-left: 4px;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .mx-1\\.5 {
                margin-left: 6px;
                margin-right: 6px;
              }
              .mt-1\\.5 {
                margin-top: 6px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .mr-4 {
                margin-right: 16px;
              }
              .font-bold {
                font-weight: bold;
              }
              .mb-1 {
                margin-bottom: 4px;
              }
              .w-3\\.5 {
                width: 14px;
              }
              .h-3\\.5 {
                height: 14px;
              }
              .bg-blue-500 {
                background-color: #5B9BD5;
              }
              .rounded-full {
                border-radius: 50%;
              }
              .text-white {
                color: #FFFFFF;
              }
              .ml-1\\.5 {
                margin-left: 6px;
              }
              .mt-3 {
                margin-top: 12px;
              }
              .justify-center {
                justify-content: center;
              }
              .h-5\\.5 {
                height: 22px;
              }
              .px-2\\.5 {
                padding: 2px 10px;
              }
              .bg-green-300 {
                background-color: #C6E0B4;
              }
              .hover\\:bg-green-400:hover {
                background-color: #B7D7A8;
              }
              .mr-1\\.5 {
                margin-right: 6px;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            
            <script>
              // Inject the component content
              document.getElementById('root').innerHTML = \`
                <!-- Date Range Section -->
                <div class="border border-black p-2 mb-1.5">
                  <div class="flex items-center mb-1.5">
                    <label class="w-10 text-xs text-black mr-1">Date</label>
                    <div class="flex items-center">
                      <input type="text" value="2026-01-01" class="w-28 h-5 border border-gray-500 px-1 text-xs" />
                      <div class="w-4 h-4 ml-1 cursor-pointer flex items-center justify-center text-xs">📅</div>
                    </div>
                    <span class="mx-1.5">-</span>
                    <div class="flex items-center">
                      <input type="text" value="2026-12-31" class="w-28 h-5 border border-gray-500 px-1 text-xs" />
                      <div class="w-4 h-4 ml-1 cursor-pointer flex items-center justify-center text-xs">📅</div>
                    </div>
                  </div>
                  
                  <div class="flex items-center mt-1.5">
                    <input type="checkbox" id="include-during-payment" class="w-3 h-3 border border-gray-500 mr-1" />
                    <label for="include-during-payment" class="text-xs text-black">Include invoices during payment</label>
                  </div>
                </div>

                <!-- Order By Section -->
                <div class="border border-black p-2 mb-1.5">
                  <div class="text-xs font-bold mb-1">Order by</div>
                  <div class="flex items-center">
                    <div class="flex items-center mr-4">
                      <input type="radio" id="order-serial" name="order-by" checked class="w-3 h-3 border border-gray-500 mr-1" />
                      <label for="order-serial" class="text-xs mr-1">Serial No.</label>
                    </div>
                    <div class="flex items-center mr-4">
                      <input type="radio" id="order-company" name="order-by" class="w-3 h-3 border border-gray-500 mr-1" />
                      <label for="order-company" class="text-xs mr-1">Company Name</label>
                    </div>
                    <div class="flex items-center">
                      <input type="radio" id="order-due" name="order-by" class="w-3 h-3 border border-gray-500 mr-1" />
                      <label for="order-due" class="text-xs mr-1">Due date</label>
                    </div>
                  </div>
                </div>

                <!-- Orientation Section -->
                <div class="border border-black p-2 mb-3">
                  <div class="flex items-center">
                    <div class="flex items-center mr-4">
                      <input type="radio" id="orientation-portrait" name="orientation" class="w-3 h-3 border border-gray-500 mr-1" />
                      <label for="orientation-portrait" class="text-xs mr-1">Portrait</label>
                    </div>
                    <div class="flex items-center">
                      <input type="radio" id="orientation-landscape" name="orientation" checked class="w-3 h-3 border border-gray-500 mr-1" />
                      <label for="orientation-landscape" class="text-xs mr-1">Landscape</label>
                    </div>
                    <div class="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs ml-1.5">i</div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-center mt-3">
                  <button class="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5">Show on screen</button>
                  <button class="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5">Show PDF</button>
                  <button class="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5">Show TXT</button>
                  <button class="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400">Cancel</button>
                </div>
              \`;
            </script>
          </body>
          </html>
        \`);
        
        // Close the current document and focus the new window
        newWindow.document.close();
        newWindow.focus();
      }
    })
    .catch(err => {
      console.error('Error loading SupplierDueList:', err);
      
      // Fallback implementation
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=960,height=600,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        newWindow.document.write(\`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Supplier Due List</title>
            <style>
              body {
                margin: 0;
                padding: 8px 12px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 12px;
                line-height: 1.3;
                color: #000000;
                background-color: #FFFFFF;
              }
              .container {
                max-width: 960px;
                margin: 0 auto;
              }
              .section {
                border: 1px solid #000000;
                padding: 8px;
                margin-bottom: 6px;
              }
              .flex {
                display: flex;
                align-items: center;
              }
              .items-center {
                align-items: center;
              }
              .mb-1\\.5 {
                margin-bottom: 6px;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .ml-1 {
                margin-left: 4px;
              }
              .mx-1\\.5 {
                margin-left: 6px;
                margin-right: 6px;
              }
              .mt-1\\.5 {
                margin-top: 6px;
              }
              .mr-4 {
                margin-right: 16px;
              }
              .mb-1 {
                margin-bottom: 4px;
              }
              .ml-1\\.5 {
                margin-left: 6px;
              }
              .mt-3 {
                margin-top: 12px;
              }
              .justify-center {
                justify-content: center;
              }
              .w-10 {
                width: 40px;
              }
              .w-28 {
                width: 110px;
              }
              .h-5 {
                height: 20px;
              }
              .w-4 {
                width: 16px;
              }
              .h-4 {
                height: 16px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .w-3\\.5 {
                width: 14px;
              }
              .h-3\\.5 {
                height: 14px;
              }
              .h-5\\.5 {
                height: 22px;
              }
              .px-2\\.5 {
                padding: 2px 10px;
              }
              .text-xs {
                font-size: 12px;
              }
              .text-black {
                color: #000000;
              }
              .font-bold {
                font-weight: bold;
              }
              .border {
                border: 1px solid #7F7F7F;
              }
              .border-gray-500 {
                border-color: #7F7F7F;
              }
              .px-1 {
                padding: 2px 4px;
              }
              .bg-blue-500 {
                background-color: #5B9BD5;
              }
              .bg-green-300 {
                background-color: #C6E0B4;
              }
              .text-white {
                color: #FFFFFF;
              }
              .rounded-full {
                border-radius: 50%;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .hover\\\\:bg-green-400:hover {
                background-color: #B7D7A8;
              }
              .mr-1\\.5 {
                margin-right: 6px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Date Range Section -->
              <div class="section">
                <div class="flex items-center mb-1.5">
                  <label class="w-10 text-xs text-black mr-1">Date</label>
                  <div class="flex items-center">
                    <input type="text" value="2026-01-01" class="w-28 h-5 border border-gray-500 px-1 text-xs" />
                    <div class="w-4 h-4 ml-1 cursor-pointer flex items-center justify-center text-xs">📅</div>
                  </div>
                  <span class="mx-1.5">-</span>
                  <div class="flex items-center">
                    <input type="text" value="2026-12-31" class="w-28 h-5 border border-gray-500 px-1 text-xs" />
                    <div class="w-4 h-4 ml-1 cursor-pointer flex items-center justify-center text-xs">📅</div>
                  </div>
                </div>
                
                <div class="flex items-center mt-1.5">
                  <input type="checkbox" id="include-during-payment" class="w-3 h-3 border border-gray-500 mr-1" />
                  <label for="include-during-payment" class="text-xs text-black">Include invoices during payment</label>
                </div>
              </div>

              <!-- Order By Section -->
              <div class="section">
                <div class="text-xs font-bold mb-1">Order by</div>
                <div class="flex items-center">
                  <div class="flex items-center mr-4">
                    <input type="radio" id="order-serial" name="order-by" checked class="w-3 h-3 border border-gray-500 mr-1" />
                    <label for="order-serial" class="text-xs mr-1">Serial No.</label>
                  </div>
                  <div class="flex items-center mr-4">
                    <input type="radio" id="order-company" name="order-by" class="w-3 h-3 border border-gray-500 mr-1" />
                    <label for="order-company" class="text-xs mr-1">Company Name</label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" id="order-due" name="order-by" class="w-3 h-3 border border-gray-500 mr-1" />
                    <label for="order-due" class="text-xs mr-1">Due date</label>
                  </div>
                </div>
              </div>

              <!-- Orientation Section -->
              <div class="section">
                <div class="flex items-center">
                  <div class="flex items-center mr-4">
                    <input type="radio" id="orientation-portrait" name="orientation" class="w-3 h-3 border border-gray-500 mr-1" />
                    <label for="orientation-portrait" class="text-xs mr-1">Portrait</label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" id="orientation-landscape" name="orientation" checked class="w-3 h-3 border border-gray-500 mr-1" />
                    <label for="orientation-landscape" class="text-xs mr-1">Landscape</label>
                  </div>
                  <div class="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs ml-1.5">i</div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center mt-3">
                <button class="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5">Show on screen</button>
                <button class="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5">Show PDF</button>
                <button class="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400 mr-1.5">Show TXT</button>
                <button class="h-5.5 px-2.5 text-xs border border-gray-500 bg-green-300 hover:bg-green-400">Cancel</button>
              </div>
            </div>
          </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.focus();
      }
    });
};

export default openSupplierDueList;