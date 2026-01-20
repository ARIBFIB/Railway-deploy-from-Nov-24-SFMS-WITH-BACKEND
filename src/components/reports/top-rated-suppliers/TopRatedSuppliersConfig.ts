// Top Rated Suppliers Configuration
// Opens the top rated suppliers in a new window/tab

export const openTopRatedSuppliers = () => {
  // Import the component dynamically
  import('./TopRatedSuppliers')
    .then(module => {
      const TopRatedSuppliers = module.default;
      
      // Create a new window
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=720,height=500,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        // Write the HTML structure
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Top Rated Suppliers</title>
            <style>
              body {
                margin: 0;
                padding: 8px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                line-height: 1.3;
                color: #000000;
                background-color: #FFFFFF;
                overflow: hidden;
              }
              #root {
                width: 100%;
                max-width: 720px;
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
              .mr-2 {
                margin-right: 8px;
              }
              .mb-2 {
                margin-bottom: 8px;
              }
              .border {
                border: 1px solid #7A7A7A;
              }
              .p-2 {
                padding: 8px;
              }
              .font-bold {
                font-weight: bold;
              }
              .mb-1 {
                margin-bottom: 4px;
              }
              .flex-col {
                flex-direction: column;
              }
              .gap-1 {
                gap: 4px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .border-gray-600 {
                border-color: #5A5A5A;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .mr-3 {
                margin-right: 12px;
              }
              .w-27\\.5 {
                width: 110px;
              }
              .h-5 {
                height: 20px;
              }
              .border-gray-500 {
                border-color: #7A7A7A;
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
              .bg-gray-200 {
                background-color: #EDEDED;
              }
              .text-blue-600 {
                color: #1E88E5;
              }
              .ml-1 {
                margin-left: 4px;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .mx-1\\.5 {
                margin: 0 6px;
              }
              .w-40 {
                width: 160px;
              }
              .h-5\\.5 {
                height: 22px;
              }
              .w-15 {
                width: 60px;
              }
              .mb-3 {
                margin-bottom: 12px;
              }
              .mt-3 {
                margin-top: 12px;
              }
              .justify-center {
                justify-content: center;
              }
              .h-6 {
                height: 24px;
              }
              .px-2\\.5 {
                padding: 4px 10px;
              }
              .border-green-700 {
                border-color: #6FAE63;
              }
              .bg-green-300 {
                background-color: #CDEAC0;
              }
              .hover\\:bg-green-400:hover {
                background-color: #BFE3B0;
              }
              .active\\:bg-green-500:active {
                background-color: #AED89C;
              }
              .mr-1\\.5 {
                margin-right: 6px;
              }
              .min-w-22\\.5 {
                min-width: 90px;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            
            <script>
              // Inject the component content
              document.getElementById('root').innerHTML = \`
                <!-- Interval Section -->
                <div class="border p-2 mb-2">
                  <div class="font-bold mb-1">Interval</div>
                  <div class="flex flex-col gap-1">
                    <div class="flex items-center">
                      <input type="radio" id="interval-all" name="interval" checked class="w-3 h-3 border border-gray-600 mr-1" />
                      <label for="interval-all" class="text-xs mr-3">All</label>
                    </div>
                    
                    <div class="flex items-center">
                      <input type="radio" id="interval-date" name="interval" class="w-3 h-3 border border-gray-600 mr-1" />
                      <label for="interval-date" class="text-xs mr-2">Date</label>
                      
                      <div class="flex items-center">
                        <input type="text" value="2026-01-01" disabled class="w-27.5 h-5 border border-gray-500 px-1 text-xs" />
                        <div class="w-4 h-4 bg-gray-200 ml-1 flex items-center justify-center text-blue-600 cursor-pointer">📅</div>
                        <span class="mx-1.5">-</span>
                        <input type="text" value="2026-12-31" disabled class="w-27.5 h-5 border border-gray-500 px-1 text-xs" />
                        <div class="w-4 h-4 bg-gray-200 ml-1 flex items-center justify-center text-blue-600 cursor-pointer">📅</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Invoice Filter Section -->
                <div class="flex items-center mb-2">
                  <label class="text-xs mr-2">Invoice Filter</label>
                  <select class="w-40 h-5.5 border border-gray-500 text-xs">
                    <option>Show All</option>
                    <option>Paid</option>
                    <option>Unpaid</option>
                    <option>Overdue</option>
                  </select>
                </div>

                <!-- Number of Suppliers Section -->
                <div class="flex items-center mb-2">
                  <label class="text-xs mr-2">Number of Supplier</label>
                  <select class="w-15 h-5.5 border border-gray-500 text-xs">
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                    <option>25</option>
                  </select>
                </div>

                <!-- Orientation Section -->
                <div class="flex items-center mb-3">
                  <input type="radio" id="orientation-portrait" name="orientation" checked class="w-3 h-3 border border-gray-600 mr-1" />
                  <label for="orientation-portrait" class="text-xs mr-3">Portrait</label>
                  
                  <input type="radio" id="orientation-landscape" name="orientation" class="w-3 h-3 border border-gray-600 mr-1" />
                  <label for="orientation-landscape" class="text-xs">Landscape</label>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-center mt-3">
                  <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5 min-w-22.5">Show on screen</button>
                  <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5 min-w-22.5">Show PDF</button>
                  <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5 min-w-22.5">Show TXT</button>
                  <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 min-w-22.5">Cancel</button>
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
      console.error('Error loading TopRatedSuppliers:', err);
      
      // Fallback implementation
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=720,height=500,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        newWindow.document.write(\`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Top Rated Suppliers</title>
            <style>
              body {
                margin: 0;
                padding: 8px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                line-height: 1.3;
                color: #000000;
                background-color: #FFFFFF;
              }
              .container {
                max-width: 720px;
                margin: 0 auto;
              }
              .flex {
                display: flex;
              }
              .items-center {
                align-items: center;
              }
              .mb-2 {
                margin-bottom: 8px;
              }
              .border {
                border: 1px solid #7A7A7A;
              }
              .p-2 {
                padding: 8px;
              }
              .font-bold {
                font-weight: bold;
              }
              .mb-1 {
                margin-bottom: 4px;
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
              .w-27\\\\.5 {
                width: 110px;
              }
              .h-5 {
                height: 20px;
              }
              .border-gray-500 {
                border-color: #7A7A7A;
              }
              .px-1 {
                padding: 2px 4px;
              }
              .text-xs {
                font-size: 11px;
              }
              .w-4 {
                width: 16px;
              }
              .h-4 {
                height: 16px;
              }
              .bg-gray-200 {
                background-color: #EDEDED;
              }
              .text-blue-600 {
                color: #1E88E5;
              }
              .ml-1 {
                margin-left: 4px;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .mx-1\\\\.5 {
                margin: 0 6px;
              }
              .w-40 {
                width: 160px;
              }
              .h-5\\\\.5 {
                height: 22px;
              }
              .w-15 {
                width: 60px;
              }
              .mb-3 {
                margin-bottom: 12px;
              }
              .mt-3 {
                margin-top: 12px;
              }
              .justify-center {
                justify-content: center;
              }
              .h-6 {
                height: 24px;
              }
              .px-2\\\\.5 {
                padding: 4px 10px;
              }
              .border-green-700 {
                border-color: #6FAE63;
              }
              .bg-green-300 {
                background-color: #CDEAC0;
              }
              .hover\\\\:bg-green-400:hover {
                background-color: #BFE3B0;
              }
              .active\\\\:bg-green-500:active {
                background-color: #AED89C;
              }
              .mr-1\\\\.5 {
                margin-right: 6px;
              }
              .min-w-22\\\\.5 {
                min-width: 90px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Interval Section -->
              <div class="border p-2 mb-2">
                <div class="font-bold mb-1">Interval</div>
                <div class="flex">
                  <input type="radio" id="interval-all" name="interval" checked class="w-3 h-3 border mr-1" />
                  <label for="interval-all" class="text-xs mr-3">All</label>
                </div>
                <div class="flex">
                  <input type="radio" id="interval-date" name="interval" class="w-3 h-3 border mr-1" />
                  <label for="interval-date" class="text-xs mr-2">Date</label>
                  <div class="flex">
                    <input type="text" value="2026-01-01" disabled class="w-27.5 h-5 border px-1 text-xs" />
                    <div class="w-4 h-4 bg-gray-200 ml-1 flex items-center justify-center text-blue-600 cursor-pointer">📅</div>
                    <span class="mx-1.5">-</span>
                    <input type="text" value="2026-12-31" disabled class="w-27.5 h-5 border px-1 text-xs" />
                    <div class="w-4 h-4 bg-gray-200 ml-1 flex items-center justify-center text-blue-600 cursor-pointer">📅</div>
                  </div>
                </div>
              </div>

              <!-- Invoice Filter Section -->
              <div class="flex items-center mb-2">
                <label class="text-xs mr-2">Invoice Filter</label>
                <select class="w-40 h-5.5 border text-xs">
                  <option>Show All</option>
                  <option>Paid</option>
                  <option>Unpaid</option>
                  <option>Overdue</option>
                </select>
              </div>

              <!-- Number of Suppliers Section -->
              <div class="flex items-center mb-2">
                <label class="text-xs mr-2">Number of Supplier</label>
                <select class="w-15 h-5.5 border text-xs">
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                  <option>25</option>
                </select>
              </div>

              <!-- Orientation Section -->
              <div class="flex items-center mb-3">
                <input type="radio" id="orientation-portrait" name="orientation" checked class="w-3 h-3 border mr-1" />
                <label for="orientation-portrait" class="text-xs mr-3">Portrait</label>
                
                <input type="radio" id="orientation-landscape" name="orientation" class="w-3 h-3 border mr-1" />
                <label for="orientation-landscape" class="text-xs">Landscape</label>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center mt-3">
                <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5 min-w-22.5">Show on screen</button>
                <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5 min-w-22.5">Show PDF</button>
                <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 mr-1.5 min-w-22.5">Show TXT</button>
                <button class="h-6 px-2.5 text-xs border border-green-700 bg-green-300 hover:bg-green-400 active:bg-green-500 min-w-22.5">Cancel</button>
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

export default openTopRatedSuppliers;