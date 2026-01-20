// Ledger List Configuration
// Opens the ledger list in a new window/tab

export const openLedgerList = () => {
  // Import the component dynamically
  import('./LedgerList')
    .then(module => {
      const LedgerList = module.default;
      
      // Create a new window
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=640,height=500,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        // Write the HTML structure
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Ledger List</title>
            <style>
              body {
                margin: 0;
                padding: 8px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                line-height: 14px;
                color: #000000;
                background-color: #FFFFFF;
                overflow: hidden;
              }
              #root {
                width: 100%;
                max-width: 640px;
                margin: 0 auto;
              }
              .flex {
                display: flex;
              }
              .items-center {
                align-items: center;
              }
              .text-xs {
                font-size: 11px;
              }
              .text-black {
                color: #000000;
              }
              .mr-1\\.5 {
                margin-right: 6px;
              }
              .w-22\\.5 {
                width: 90px;
              }
              .h-5 {
                height: 20px;
              }
              .border {
                border: 1px solid #8A8A8A;
              }
              .border-gray-500 {
                border-color: #8A8A8A;
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
              .ml-0\\.75 {
                margin-left: 3px;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .mx-1 {
                margin: 0 4px;
              }
              .mb-1\\.5 {
                margin-bottom: 6px;
              }
              .border-black {
                border-color: #000000;
              }
              .p-1\\.5 {
                padding: 6px;
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
              .border-gray-600 {
                border-color: #555555;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .mr-3 {
                margin-right: 12px;
              }
              .w-30 {
                width: 120px;
              }
              .bg-gray-200 {
                background-color: #F0F0F0;
              }
              .text-gray-500 {
                color: #777777;
              }
              .border-gray-400 {
                border-color: #B0B0B0;
              }
              .w-55 {
                width: 220px;
              }
              .ml-2 {
                margin-left: 8px;
              }
              .bg-yellow-300 {
                background-color: #FFD966;
              }
              .border-yellow-600 {
                border-color: #C9A400;
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
              .bg-blue-100 {
                background-color: #E6F0FA;
              }
              .text-blue-700 {
                color: #1E73BE;
              }
              .rounded-full {
                border-radius: 50%;
              }
              .ml-1 {
                margin-left: 4px;
              }
              .mt-2\\.5 {
                margin-top: 10px;
              }
              .justify-center {
                justify-content: center;
              }
              .h-6 {
                height: 24px;
              }
              .px-2\\.5 {
                padding: 2px 10px;
              }
              .border-green-700 {
                border-color: #6AA84F;
              }
              .bg-green-300 {
                background-color: #CFE8B0;
              }
              .hover\\:bg-green-400:hover {
                background-color: #B7DB8A;
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
                <!-- Date Section -->
                <div class="flex items-center mb-1.5">
                  <label class="text-xs text-black mr-1.5">Date</label>
                  <div class="flex items-center">
                    <input type="text" value="2026-01-01" class="w-22.5 h-5 border border-gray-500 px-1 text-xs" />
                    <div class="w-4 h-4 ml-0.75 cursor-pointer flex items-center justify-center text-xs">📅</div>
                  </div>
                  <span class="mx-1">-</span>
                  <div class="flex items-center">
                    <input type="text" value="2026-12-31" class="w-22.5 h-5 border border-gray-500 px-1 text-xs" />
                    <div class="w-4 h-4 ml-0.75 cursor-pointer flex items-center justify-center text-xs">📅</div>
                  </div>
                </div>

                <!-- Supplier Section -->
                <div class="border border-black p-1.5 mt-1.5">
                  <div class="flex items-center mb-1">
                    <input type="radio" id="supplier-all" name="supplier-option" checked class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="supplier-all" class="text-xs mr-3">All suppliers</label>
                    
                    <input type="radio" id="supplier-specific" name="supplier-option" class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="supplier-specific" class="text-xs">Supplier</label>
                  </div>
                  
                  <div class="flex items-center">
                    <input type="text" value="" disabled class="w-30 h-5 border bg-gray-200 text-gray-500 px-1 text-xs" />
                    <div class="w-4 h-4 bg-yellow-300 border border-yellow-600 ml-0.75 flex items-center justify-center text-xs cursor-pointer">?</div>
                    
                    <input type="text" value="" disabled class="w-55 h-5 border bg-gray-200 text-gray-500 px-1 text-xs ml-2" />
                  </div>
                </div>

                <!-- Order By Section -->
                <div class="border border-black p-1.5 mt-1.5">
                  <div class="flex items-center">
                    <input type="radio" id="order-supplier-no" name="order-by" checked class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="order-supplier-no" class="text-xs mr-3">Supplier No.</label>
                    
                    <input type="radio" id="order-invoice-no" name="order-by" class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="order-invoice-no" class="text-xs mr-3">Invoice no.</label>
                    
                    <input type="radio" id="order-company-name" name="order-by" class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="order-company-name" class="text-xs">Company Name</label>
                  </div>
                </div>

                <!-- Options Section -->
                <div class="mt-1.5">
                  <div class="flex items-center mb-1">
                    <input type="checkbox" id="show-unpaid" class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="show-unpaid" class="text-xs">Show unpaid invoices</label>
                    <div class="w-3.5 h-3.5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs ml-1">i</div>
                  </div>
                  
                  <div class="flex items-center">
                    <input type="checkbox" id="show-zero-balance" class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="show-zero-balance" class="text-xs">Show zero balance</label>
                  </div>
                </div>

                <!-- Orientation Section -->
                <div class="mt-1.5">
                  <div class="flex items-center">
                    <input type="radio" id="orientation-portrait" name="orientation" class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="orientation-portrait" class="text-xs mr-3">Portrait</label>
                    
                    <input type="radio" id="orientation-landscape" name="orientation" checked class="w-3 h-3 border border-gray-600 mr-1" />
                    <label for="orientation-landscape" class="text-xs">Landscape</label>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-center mt-2.5">
                  <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5">Show on screen</button>
                  <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5">Show PDF</button>
                  <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5">Show TXT</button>
                  <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400">Cancel</button>
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
      console.error('Error loading LedgerList:', err);
      
      // Fallback implementation
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=640,height=500,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        newWindow.document.write(\`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Ledger List</title>
            <style>
              body {
                margin: 0;
                padding: 8px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                line-height: 14px;
                color: #000000;
                background-color: #FFFFFF;
              }
              .container {
                max-width: 640px;
                margin: 0 auto;
              }
              .flex {
                display: flex;
                align-items: center;
              }
              .items-center {
                align-items: center;
              }
              .mb-1\\\\.5 {
                margin-bottom: 6px;
              }
              .mr-1\\\\.5 {
                margin-right: 6px;
              }
              .w-22\\\\.5 {
                width: 90px;
              }
              .h-5 {
                height: 20px;
              }
              .border {
                border: 1px solid #8A8A8A;
              }
              .px-1 {
                padding: 2px 4px;
              }
              .text-xs {
                font-size: 11px;
              }
              .text-black {
                color: #000000;
              }
              .w-4 {
                width: 16px;
              }
              .h-4 {
                height: 16px;
              }
              .ml-0\\\\.75 {
                margin-left: 3px;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .mx-1 {
                margin: 0 4px;
              }
              .border-black {
                border-color: #000000;
              }
              .p-1\\\\.5 {
                padding: 6px;
              }
              .mt-1\\\\.5 {
                margin-top: 6px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .mr-3 {
                margin-right: 12px;
              }
              .w-30 {
                width: 120px;
              }
              .bg-gray-200 {
                background-color: #F0F0F0;
              }
              .text-gray-500 {
                color: #777777;
              }
              .border-gray-400 {
                border-color: #B0B0B0;
              }
              .w-55 {
                width: 220px;
              }
              .ml-2 {
                margin-left: 8px;
              }
              .bg-yellow-300 {
                background-color: #FFD966;
              }
              .border-yellow-600 {
                border-color: #C9A400;
              }
              .mb-1 {
                margin-bottom: 4px;
              }
              .w-3\\\\.5 {
                width: 14px;
              }
              .h-3\\\\.5 {
                height: 14px;
              }
              .bg-blue-100 {
                background-color: #E6F0FA;
              }
              .text-blue-700 {
                color: #1E73BE;
              }
              .rounded-full {
                border-radius: 50%;
              }
              .ml-1 {
                margin-left: 4px;
              }
              .mt-2\\\\.5 {
                margin-top: 10px;
              }
              .justify-center {
                justify-content: center;
              }
              .h-6 {
                height: 24px;
              }
              .px-2\\\\.5 {
                padding: 2px 10px;
              }
              .border-green-700 {
                border-color: #6AA84F;
              }
              .bg-green-300 {
                background-color: #CFE8B0;
              }
              .hover\\\\:bg-green-400:hover {
                background-color: #B7DB8A;
              }
              .mr-1\\\\.5 {
                margin-right: 6px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Date Section -->
              <div class="flex items-center mb-1.5">
                <label class="text-xs text-black mr-1.5">Date</label>
                <div class="flex items-center">
                  <input type="text" value="2026-01-01" class="w-22.5 h-5 border px-1 text-xs" />
                  <div class="w-4 h-4 ml-0.75 cursor-pointer flex items-center justify-center text-xs">📅</div>
                </div>
                <span class="mx-1">-</span>
                <div class="flex items-center">
                  <input type="text" value="2026-12-31" class="w-22.5 h-5 border px-1 text-xs" />
                  <div class="w-4 h-4 ml-0.75 cursor-pointer flex items-center justify-center text-xs">📅</div>
                </div>
              </div>

              <!-- Supplier Section -->
              <div class="border border-black p-1.5 mt-1.5">
                <div class="flex items-center mb-1">
                  <input type="radio" id="supplier-all" name="supplier-option" checked class="w-3 h-3 border mr-1" />
                  <label for="supplier-all" class="text-xs mr-3">All suppliers</label>
                  
                  <input type="radio" id="supplier-specific" name="supplier-option" class="w-3 h-3 border mr-1" />
                  <label for="supplier-specific" class="text-xs">Supplier</label>
                </div>
                
                <div class="flex items-center">
                  <input type="text" value="" disabled class="w-30 h-5 border bg-gray-200 text-gray-500 px-1 text-xs" />
                  <div class="w-4 h-4 bg-yellow-300 border border-yellow-600 ml-0.75 flex items-center justify-center text-xs cursor-pointer">?</div>
                  
                  <input type="text" value="" disabled class="w-55 h-5 border bg-gray-200 text-gray-500 px-1 text-xs ml-2" />
                </div>
              </div>

              <!-- Order By Section -->
              <div class="border border-black p-1.5 mt-1.5">
                <div class="flex items-center">
                  <input type="radio" id="order-supplier-no" name="order-by" checked class="w-3 h-3 border mr-1" />
                  <label for="order-supplier-no" class="text-xs mr-3">Supplier No.</label>
                  
                  <input type="radio" id="order-invoice-no" name="order-by" class="w-3 h-3 border mr-1" />
                  <label for="order-invoice-no" class="text-xs mr-3">Invoice no.</label>
                  
                  <input type="radio" id="order-company-name" name="order-by" class="w-3 h-3 border mr-1" />
                  <label for="order-company-name" class="text-xs">Company Name</label>
                </div>
              </div>

              <!-- Options Section -->
              <div class="mt-1.5">
                <div class="flex items-center mb-1">
                  <input type="checkbox" id="show-unpaid" class="w-3 h-3 border mr-1" />
                  <label for="show-unpaid" class="text-xs">Show unpaid invoices</label>
                  <div class="w-3.5 h-3.5 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs ml-1">i</div>
                </div>
                
                <div class="flex items-center">
                  <input type="checkbox" id="show-zero-balance" class="w-3 h-3 border mr-1" />
                  <label for="show-zero-balance" class="text-xs">Show zero balance</label>
                </div>
              </div>

              <!-- Orientation Section -->
              <div class="mt-1.5">
                <div class="flex items-center">
                  <input type="radio" id="orientation-portrait" name="orientation" class="w-3 h-3 border mr-1" />
                  <label for="orientation-portrait" class="text-xs mr-3">Portrait</label>
                  
                  <input type="radio" id="orientation-landscape" name="orientation" checked class="w-3 h-3 border mr-1" />
                  <label for="orientation-landscape" class="text-xs">Landscape</label>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center mt-2.5">
                <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5">Show on screen</button>
                <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5">Show PDF</button>
                <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-1.5">Show TXT</button>
                <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400">Cancel</button>
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

export default openLedgerList;