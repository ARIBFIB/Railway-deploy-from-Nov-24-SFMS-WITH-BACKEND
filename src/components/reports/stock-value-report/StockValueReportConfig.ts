// Stock Value Report Configuration
// Opens the stock value report in a new window/tab

export const openStockValueReport = () => {
  // Import the component dynamically
  import('./StockValueReport')
    .then(module => {
      const StockValueReport = module.default;
      
      // Create a new window
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=720,height=400,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        // Write the HTML structure
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Stock Value Report</title>
            <style>
              body {
                margin: 0;
                padding: 12px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                color: #000000;
                background-color: #FFFFFF;
                overflow: hidden;
              }
              #root {
                width: 720px;
                min-height: 360px;
              }
              .grid {
                display: grid;
                grid-template-columns: 48% 48%;
                gap: 16px;
              }
              .mb-1 {
                margin-bottom: 4px;
              }
              .block {
                display: block;
              }
              .text-xs {
                font-size: 11px;
              }
              .w-40 {
                width: 160px;
              }
              .h-5\\.5 {
                height: 22px;
              }
              .border {
                border: 1px solid #9E9E9E;
              }
              .border-gray-500 {
                border-color: #9E9E9E;
              }
              .rounded {
                border-radius: 2px;
              }
              .px-1\\.5 {
                padding: 2px 6px;
              }
              .relative {
                position: relative;
              }
              .absolute {
                position: absolute;
              }
              .right-2 {
                right: 8px;
              }
              .top-1\\/2 {
                top: 50%;
              }
              .transform {
                transform: translateY(-50%);
              }
              .w-3\\.5 {
                width: 14px;
              }
              .h-3\\.5 {
                height: 14px;
              }
              .text-gray-500 {
                color: #6F6F6F;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .flex {
                display: flex;
              }
              .items-center {
                align-items: center;
              }
              .mt-4 {
                margin-top: 16px;
              }
              .w-50 {
                width: 200px;
              }
              .mb-1\\.5 {
                margin-bottom: 6px;
              }
              .font-bold {
                font-weight: bold;
              }
              .space-y-1 {
                display: flex;
                flex-direction: column;
                gap: 4px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .border-green-700 {
                border-color: #0A7A2F;
              }
              .mr-1\\.5 {
                margin-right: 6px;
              }
              .mt-3\\.5 {
                margin-top: 14px;
              }
              .px-0\\.75 {
                padding: 3px;
              }
              .h-full {
                height: 100%;
              }
              .mr-2 {
                margin-right: 8px;
              }
              .mr-3 {
                margin-right: 12px;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .justify-end {
                justify-content: flex-end;
              }
              .mt-6 {
                margin-top: 24px;
              }
              .h-7 {
                height: 28px;
              }
              .px-3\\.5 {
                padding: 0 14px;
              }
              .font-bold {
                font-weight: bold;
              }
              .rounded-full {
                border-radius: 14px;
              }
              .text-white {
                color: #FFFFFF;
              }
              .bg-gray-600 {
                background-color: #7A7A7A;
              }
              .bg-green-700 {
                background-color: #0A7A2F;
              }
              .mr-2 {
                margin-right: 8px;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            
            <script>
              // Inject the component content
              document.getElementById('root').innerHTML = \`
                <div class="grid">
                  <!-- LEFT COLUMN -->
                  <div>
                    <!-- Date Field -->
                    <div class="mb-1">
                      <label class="block text-xs mb-1">Date</label>
                      <div class="relative">
                        <input type="text" value="2026-01-20" class="w-40 h-5.5 border border-gray-500 rounded px-1.5 text-xs" />
                        <div class="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-500 cursor-pointer flex items-center justify-center">📅</div>
                      </div>
                    </div>

                    <!-- Stock Points -->
                    <div class="mt-4">
                      <label class="block text-xs mb-1">Stock points</label>
                      <select class="w-50 h-5.5 border border-gray-500 rounded px-1.5 text-xs">
                        <option>All</option>
                        <option>Stock Point 1</option>
                        <option>Stock Point 2</option>
                        <option>Stock Point 3</option>
                      </select>
                    </div>
                  </div>

                  <!-- RIGHT COLUMN -->
                  <div>
                    <!-- Filter Section -->
                    <div class="mb-1.5">
                      <div class="font-bold text-xs mb-1.5">Filter</div>
                      <div class="space-y-1">
                        <div class="flex items-center">
                          <input type="checkbox" id="positive-values" checked class="w-3 h-3 border border-green-700 mr-1.5" />
                          <label for="positive-values" class="text-xs">Positive values</label>
                        </div>
                        <div class="flex items-center">
                          <input type="checkbox" id="negative-values" checked class="w-3 h-3 border border-green-700 mr-1.5" />
                          <label for="negative-values" class="text-xs">Negative values</label>
                        </div>
                        <div class="flex items-center">
                          <input type="checkbox" id="zero-values" checked class="w-3 h-3 border border-green-700 mr-1.5" />
                          <label for="zero-values" class="text-xs">0-values</label>
                        </div>
                      </div>
                    </div>

                    <!-- Options Section -->
                    <div class="mt-3.5">
                      <div class="font-bold text-xs mb-1.5">Options</div>
                      <div class="border border-gray-500 rounded px-0.75" style="height: 26px;">
                        <div class="flex items-center h-full">
                          <label class="text-xs mr-2">Show one per row:</label>
                          <div class="flex items-center">
                            <input type="radio" id="show-item" name="show-one-per-row" checked class="w-3 h-3 border mr-1" />
                            <label for="show-item" class="text-xs mr-3">Item</label>
                            
                            <input type="radio" id="show-inbound" name="show-one-per-row" class="w-3 h-3 border mr-1" />
                            <label for="show-inbound" class="text-xs">Inbound delivery</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- ACTION BUTTONS -->
                <div class="flex justify-end mt-6">
                  <button class="h-7 px-3.5 text-xs font-bold rounded-full text-white mr-2 bg-gray-600">Close</button>
                  <button class="h-7 px-3.5 text-xs font-bold rounded-full text-white mr-2 bg-green-700">Show PDF</button>
                  <button class="h-7 px-3.5 text-xs font-bold rounded-full text-white bg-green-700">Export (CSV)</button>
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
      console.error('Error loading StockValueReport:', err);
      
      // Fallback implementation
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=720,height=400,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        newWindow.document.write(\`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Stock Value Report</title>
            <style>
              body {
                margin: 0;
                padding: 12px;
                font-family: Arial, Helvetica, sans-serif;
                font-size: 11px;
                color: #000000;
                background-color: #FFFFFF;
              }
              .container {
                width: 720px;
                min-height: 360px;
              }
              .grid {
                display: grid;
                grid-template-columns: 48% 48%;
                gap: 16px;
              }
              .mb-1 {
                margin-bottom: 4px;
              }
              .block {
                display: block;
              }
              .text-xs {
                font-size: 11px;
              }
              .w-40 {
                width: 160px;
              }
              .h-5\\\\.5 {
                height: 22px;
              }
              .border {
                border: 1px solid #9E9E9E;
              }
              .rounded {
                border-radius: 2px;
              }
              .px-1\\\\.5 {
                padding: 2px 6px;
              }
              .relative {
                position: relative;
              }
              .absolute {
                position: absolute;
              }
              .right-2 {
                right: 8px;
              }
              .top-1\\\\/2 {
                top: 50%;
              }
              .transform {
                transform: translateY(-50%);
              }
              .w-3\\\\.5 {
                width: 14px;
              }
              .h-3\\\\.5 {
                height: 14px;
              }
              .text-gray-500 {
                color: #6F6F6F;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .flex {
                display: flex;
              }
              .items-center {
                align-items: center;
              }
              .mt-4 {
                margin-top: 16px;
              }
              .w-50 {
                width: 200px;
              }
              .mb-1\\\\.5 {
                margin-bottom: 6px;
              }
              .font-bold {
                font-weight: bold;
              }
              .space-y-1 {
                display: flex;
                flex-direction: column;
                gap: 4px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .border-green-700 {
                border-color: #0A7A2F;
              }
              .mr-1\\\\.5 {
                margin-right: 6px;
              }
              .mt-3\\\\.5 {
                margin-top: 14px;
              }
              .px-0\\\\.75 {
                padding: 3px;
              }
              .h-full {
                height: 100%;
              }
              .mr-2 {
                margin-right: 8px;
              }
              .mr-3 {
                margin-right: 12px;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .justify-end {
                justify-content: flex-end;
              }
              .mt-6 {
                margin-top: 24px;
              }
              .h-7 {
                height: 28px;
              }
              .px-3\\\\.5 {
                padding: 0 14px;
              }
              .font-bold {
                font-weight: bold;
              }
              .rounded-full {
                border-radius: 14px;
              }
              .text-white {
                color: #FFFFFF;
              }
              .bg-gray-600 {
                background-color: #7A7A7A;
              }
              .bg-green-700 {
                background-color: #0A7A2F;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="grid">
                <!-- LEFT COLUMN -->
                <div>
                  <!-- Date Field -->
                  <div class="mb-1">
                    <label class="block text-xs mb-1">Date</label>
                    <div class="relative">
                      <input type="text" value="2026-01-20" class="w-40 h-5.5 border rounded px-1.5 text-xs" />
                      <div class="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-500 cursor-pointer">📅</div>
                    </div>
                  </div>

                  <!-- Stock Points -->
                  <div class="mt-4">
                    <label class="block text-xs mb-1">Stock points</label>
                    <select class="w-50 h-5.5 border rounded px-1.5 text-xs">
                      <option>All</option>
                      <option>Stock Point 1</option>
                      <option>Stock Point 2</option>
                      <option>Stock Point 3</option>
                    </select>
                  </div>
                </div>

                <!-- RIGHT COLUMN -->
                <div>
                  <!-- Filter Section -->
                  <div class="mb-1.5">
                    <div class="font-bold text-xs mb-1.5">Filter</div>
                    <div class="space-y-1">
                      <div class="flex items-center">
                        <input type="checkbox" id="positive-values" checked class="w-3 h-3 border border-green-700 mr-1.5" />
                        <label for="positive-values" class="text-xs">Positive values</label>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="negative-values" checked class="w-3 h-3 border border-green-700 mr-1.5" />
                        <label for="negative-values" class="text-xs">Negative values</label>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="zero-values" checked class="w-3 h-3 border border-green-700 mr-1.5" />
                        <label for="zero-values" class="text-xs">0-values</label>
                      </div>
                    </div>
                  </div>

                  <!-- Options Section -->
                  <div class="mt-3.5">
                    <div class="font-bold text-xs mb-1.5">Options</div>
                    <div class="border rounded px-0.75" style="height: 26px;">
                      <div class="flex items-center h-full">
                        <label class="text-xs mr-2">Show one per row:</label>
                        <div class="flex items-center">
                          <input type="radio" id="show-item" name="show-one-per-row" checked class="w-3 h-3 border mr-1" />
                          <label for="show-item" class="text-xs mr-3">Item</label>
                          
                          <input type="radio" id="show-inbound" name="show-one-per-row" class="w-3 h-3 border mr-1" />
                          <label for="show-inbound" class="text-xs">Inbound delivery</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ACTION BUTTONS -->
              <div class="flex justify-end mt-6">
                <button class="h-7 px-3.5 text-xs font-bold rounded-full text-white mr-2 bg-gray-600">Close</button>
                <button class="h-7 px-3.5 text-xs font-bold rounded-full text-white mr-2 bg-green-700">Show PDF</button>
                <button class="h-7 px-3.5 text-xs font-bold rounded-full text-white bg-green-700">Export (CSV)</button>
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

export default openStockValueReport;