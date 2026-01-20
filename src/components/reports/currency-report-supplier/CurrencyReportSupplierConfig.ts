// Currency Report Supplier Configuration
// Opens the currency report supplier in a new window/tab

export const openCurrencyReportSupplier = () => {
  // Import the component dynamically
  import('./CurrencyReportSupplier')
    .then(module => {
      const CurrencyReportSupplier = module.default;
      
      // Create a new window
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=920,height=600,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        // Write the HTML structure
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Currency Report Supplier</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: Segoe UI, Arial, Helvetica, sans-serif;
                font-size: 12px;
                line-height: 16px;
                color: #000000;
                background-color: #FFFFFF;
                overflow: hidden;
              }
              #root {
                width: 100%;
                height: 100vh;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            
            <script>
              // This would be where React would mount the component
              // For now, we'll inject the component content directly
              document.getElementById('root').innerHTML = '<div>Loading...</div>';
            </script>
          </body>
          </html>
        `);
        
        // Close the current document and focus the new window
        newWindow.document.close();
        newWindow.focus();
      }
    })
    .catch(err => {
      console.error('Error loading CurrencyReportSupplier:', err);
      
      // Fallback implementation
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=920,height=600,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>Currency Report Supplier</title>
            <style>
              body {
                margin: 0;
                padding: 16px;
                font-family: Segoe UI, Arial, Helvetica, sans-serif;
                font-size: 12px;
                line-height: 16px;
                color: #000000;
                background-color: #FFFFFF;
              }
              .container {
                max-width: 920px;
                margin: 0 auto;
              }
              .section {
                border: 1px solid #3A3A3A;
                border-radius: 0px;
                padding: 8px 10px;
                margin-bottom: 8px;
                background: #FFFFFF;
              }
              .section-title {
                font-size: 12px;
                font-weight: bold;
                color: #000000;
                margin-bottom: 6px;
              }
              .flex {
                display: flex;
                align-items: center;
              }
              .items-center {
                align-items: center;
              }
              .mr-1\.5 {
                margin-right: 6px;
              }
              .mr-4 {
                margin-right: 16px;
              }
              .mb-1\.5 {
                margin-bottom: 6px;
              }
              .mb-1 {
                margin-bottom: 4px;
              }
              .mb-3 {
                margin-bottom: 12px;
              }
              .ml-2\.5 {
                margin-left: 10px;
              }
              .mx-1\.5 {
                margin-left: 6px;
                margin-right: 6px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .w-3\.5 {
                width: 14px;
              }
              .h-3\.5 {
                height: 14px;
              }
              .w-4 {
                width: 16px;
              }
              .h-4 {
                height: 16px;
              }
              .w-32 {
                width: 120px;
              }
              .h-5\.5 {
                height: 22px;
              }
              .w-35 {
                width: 140px;
              }
              .p-0\.5 {
                padding: 2px 6px;
              }
              .border {
                border: 1px solid #8F8F8F;
              }
              .border-gray-700 {
                border-color: #3A3A3A;
              }
              .border-gray-600 {
                border-color: #8F8F8F;
              }
              .border-blue-400 {
                border-color: #7FAADF;
              }
              .border-yellow-600 {
                border-color: #C9A200;
              }
              .bg-blue-200 {
                background-color: #E6F1FF;
              }
              .bg-yellow-300 {
                background-color: #FFD966;
              }
              .bg-blue-100 {
                background-color: #D9EDF7;
              }
              .rounded-full {
                border-radius: 50%;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .text-xs {
                font-size: 12px;
              }
              .text-blue-700 {
                color: #2F6FB2;
              }
              .text-yellow-800 {
                color: #000000;
              }
              .text-blue-800 {
                color: #31708F;
              }
              .justify-center {
                justify-content: center;
              }
              .mt-3 {
                margin-top: 12px;
              }
              .min-w-\[110px\] {
                min-width: 110px;
              }
              .px-3 {
                padding-left: 12px;
                padding-right: 12px;
              }
              .py-1 {
                padding-top: 4px;
                padding-bottom: 4px;
              }
              .h-7 {
                height: 28px;
              }
              .border-green-700 {
                border-color: #6E8B5E;
              }
              .bg-green-300 {
                background-color: #C6E0B4;
              }
              .hover\:bg-green-400:hover {
                background-color: #B7D7A8;
              }
              .mr-2 {
                margin-right: 8px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Section 1 - Interval -->
              <div class="section">
                <div class="section-title">Interval</div>
                
                <div class="flex items-center">
                  <label class="mr-1.5">Date</label>
                  <div class="flex items-center mr-1.5">
                    <input type="text" value="2026-01-01" class="w-32 h-5.5 border border-gray-600 p-0.5 mr-0.5" />
                    <div class="w-4 h-4 bg-blue-200 border border-blue-400 flex items-center justify-center text-xs cursor-pointer">📅</div>
                  </div>
                  <span class="mx-1.5">-</span>
                  <div class="flex items-center">
                    <input type="text" value="2026-12-31" class="w-32 h-5.5 border border-gray-600 p-0.5 mr-0.5" />
                    <div class="w-4 h-4 bg-blue-200 border border-blue-400 flex items-center justify-center text-xs cursor-pointer">📅</div>
                  </div>
                </div>
              </div>

              <!-- Section 2 - Supplier -->
              <div class="section">
                <div class="flex items-center mb-1.5">
                  <input type="radio" id="all-suppliers" name="supplier-option" checked class="w-3 h-3 mr-1.5" />
                  <label for="all-suppliers" class="mr-4">All suppliers</label>
                  
                  <input type="radio" id="specific-supplier" name="supplier-option" class="w-3 h-3 mr-1.5" />
                  <label for="specific-supplier">Supplier</label>
                </div>
                
                <div class="flex items-center">
                  <input type="text" placeholder="From" class="w-35 h-5.5 border border-gray-600 p-0.5 mr-1.5" />
                  <div class="w-3.5 h-3.5 bg-yellow-300 border border-yellow-600 flex items-center justify-center text-xs cursor-pointer mr-1.5">?</div>
                  
                  <input type="text" placeholder="To" class="w-35 h-5.5 border border-gray-600 p-0.5 mr-1.5" />
                  <div class="w-3.5 h-3.5 bg-yellow-300 border border-yellow-600 flex items-center justify-center text-xs cursor-pointer">?</div>
                </div>
              </div>

              <!-- Section 3 - Options -->
              <div class="section">
                <div class="flex items-center mb-1.5">
                  <label class="mr-2">Currency</label>
                  <select class="w-35 h-5.5 border border-gray-600 p-0.5">
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>SEK</option>
                    <option>NOK</option>
                    <option>DKK</option>
                  </select>
                </div>
                
                <div class="flex items-center mb-1">
                  <input type="checkbox" id="show-currency-diff" class="w-3 h-3 mr-1.5" />
                  <label for="show-currency-diff">Show currency difference</label>
                  
                  <div class="w-3.5 h-3.5 bg-blue-100 border border-blue-400 rounded-full flex items-center justify-center text-xs ml-2.5">i</div>
                </div>
                
                <div class="flex items-center">
                  <input type="checkbox" id="compare-prev-year" class="w-3 h-3 mr-1.5" />
                  <label for="compare-prev-year">Compare to previous year</label>
                </div>
              </div>

              <!-- Section 4 - Orientation -->
              <div class="section">
                <div class="flex items-center">
                  <input type="radio" id="portrait" name="orientation" checked class="w-3 h-3 mr-1.5" />
                  <label for="portrait" class="mr-4">Portrait</label>
                  
                  <input type="radio" id="landscape" name="orientation" class="w-3 h-3 mr-1.5" />
                  <label for="landscape">Landscape</label>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-center mt-3">
                <button class="h-7 min-w-[110px] px-3 py-1 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2">Show on screen</button>
                <button class="h-7 min-w-[110px] px-3 py-1 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2">Show PDF</button>
                <button class="h-7 min-w-[110px] px-3 py-1 text-xs border border-green-700 bg-green-300 hover:bg-green-400">Cancel</button>
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

export default openCurrencyReportSupplier;