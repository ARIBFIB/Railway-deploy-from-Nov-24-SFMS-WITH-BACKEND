// VAT Report Configuration
// Opens the VAT report filter in a new window/tab

export const openVatReport = () => {
  // Import the component dynamically
  import('./VatReport')
    .then(module => {
      const VatReport = module.default;
      
      // Create a new window
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=720,height=300,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        // Write the HTML structure
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>VAT Report</title>
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
                width: 100%;
                max-width: 720px;
                margin: 0 auto;
              }
              .bg-white {
                background-color: #FFFFFF;
              }
              .p-3 {
                padding: 12px;
              }
              .border {
                border: 1px solid #9E9E9E;
              }
              .border-gray-500 {
                border-color: #9E9E9E;
              }
              .p-2 {
                padding: 8px;
              }
              .mb-2-5 {
                margin-bottom: 10px;
              }
              .mb-3 {
                margin-bottom: 12px;
              }
              .font-bold {
                font-weight: bold;
              }
              .text-xs {
                font-size: 11px;
              }
              .mb-1-5 {
                margin-bottom: 6px;
              }
              .flex {
                display: flex;
              }
              .items-center {
                align-items: center;
              }
              .gap-1-5 {
                gap: 6px;
              }
              .gap-2 {
                gap: 8px;
              }
              .gap-4 {
                gap: 16px;
              }
              .min-w-10 {
                min-width: 40px;
              }
              .w-30 {
                width: 120px;
              }
              .h-5-5 {
                height: 22px;
              }
              .border {
                border: 1px solid #9E9E9E;
              }
              .rounded {
                border-radius: 2px;
              }
              .px-1-5 {
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
              .top-1-2 {
                top: 50%;
              }
              .transform {
                transform: translateY(-50%);
              }
              .w-3-5 {
                width: 14px;
              }
              .h-3-5 {
                height: 14px;
              }
              .text-gray-500 {
                color: #6F6F6F;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .px-1 {
                padding: 0 4px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .mr-1-5 {
                margin-right: 6px;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .rounded-full {
                border-radius: 50%;
              }
              .bg-blue-500 {
                background-color: #2A78D2;
              }
              .text-white {
                color: #FFFFFF;
              }
              .h-4-5 {
                height: 18px;
              }
              .w-4-5 {
                width: 18px;
              }
              .flex {
                display: flex;
              }
              .items-center {
                align-items: center;
              }
              .gap-2 {
                gap: 8px;
              }
              .mb-3-5 {
                margin-bottom: 14px;
              }
              .h-6-5 {
                height: 26px;
              }
              .px-3 {
                padding: 0 12px;
              }
              .font-normal {
                font-weight: normal;
              }
              .border-green-700 {
                border-color: #6E8F5A;
              }
              .bg-green-300 {
                background-color: #DFF0D0;
              }
              .text-black {
                color: #000000;
              }
            </style>
          </head>
          <body>
            <div id="root"></div>
            
            <script>
              // Inject the component content
              document.getElementById('root').innerHTML = '<!-- SECTION 1: INTERVAL --><div class="border p-2 mb-2-5"><div class="font-bold text-xs mb-1-5">Interval</div><div class="flex items-center gap-1-5"><span class="text-xs min-w-10">Date</span><div class="relative"><input type="text" value="2026-04-01" class="w-30 h-5-5 border border-gray-500 rounded px-1-5 text-xs" /><div class="absolute right-2 top-1-2 transform -translate-y-1-2 w-3-5 h-3-5 text-gray-500 cursor-pointer flex items-center justify-center">📅</div></div><span class="text-xs px-1">-</span><div class="relative"><input type="text" value="2026-06-30" class="w-30 h-5-5 border border-gray-500 rounded px-1-5 text-xs" /><div class="absolute right-2 top-1-2 transform -translate-y-1-2 w-3-5 h-3-5 text-gray-500 cursor-pointer flex items-center justify-center">📅</div></div></div></div><!-- SECTION 2: ORIENTATION --><div class="border p-2 mb-3"><div class="font-bold text-xs mb-1-5">Orientation</div><div class="flex gap-4"><div class="flex items-center"><input type="radio" id="orientation-portrait" name="orientation" checked class="w-3 h-3 border border-gray-500 mr-1-5" /><label for="orientation-portrait" class="text-xs mr-1-5">Portrait</label></div><div class="flex items-center"><input type="radio" id="orientation-landscape" name="orientation" class="w-3 h-3 border border-gray-500 mr-1-5" /><label for="orientation-landscape" class="text-xs mr-1-5">Landscape</label></div></div></div><!-- INFO MESSAGE --><div class="flex items-center gap-2 mb-3-5"><div class="w-4-5 h-4-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">i</div><span class="text-xs">Check that the VAT codes in your accounts chart match</span></div><!-- ACTION BUTTONS --><div class="flex gap-2"><button class="h-6-5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer">Show on screen</button><button class="h-6-5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer">Show PDF</button><button class="h-6-5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer">Show TXT</button><button class="h-6-5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer">Cancel</button></div>';
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
      console.error('Error loading VatReport:', err);
      
      // Fallback implementation
      const newWindow = window.open(
        '', 
        '_blank', 
        'width=720,height=300,scrollbars=no,resizable=yes'
      );
      
      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8" />
            <title>VAT Report</title>
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
                width: 100%;
                max-width: 720px;
                margin: 0 auto;
              }
              .border {
                border: 1px solid #9E9E9E;
              }
              .p-2 {
                padding: 8px;
              }
              .mb-2-5 {
                margin-bottom: 10px;
              }
              .mb-3 {
                margin-bottom: 12px;
              }
              .font-bold {
                font-weight: bold;
              }
              .text-xs {
                font-size: 11px;
              }
              .mb-1-5 {
                margin-bottom: 6px;
              }
              .flex {
                display: flex;
              }
              .items-center {
                align-items: center;
              }
              .gap-1-5 {
                gap: 6px;
              }
              .gap-2 {
                gap: 8px;
              }
              .gap-4 {
                gap: 16px;
              }
              .min-w-10 {
                min-width: 40px;
              }
              .w-30 {
                width: 120px;
              }
              .h-5-5 {
                height: 22px;
              }
              .border {
                border: 1px solid #9E9E9E;
              }
              .rounded {
                border-radius: 2px;
              }
              .px-1-5 {
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
              .top-1-2 {
                top: 50%;
              }
              .transform {
                transform: translateY(-50%);
              }
              .w-3-5 {
                width: 14px;
              }
              .h-3-5 {
                height: 14px;
              }
              .text-gray-500 {
                color: #6F6F6F;
              }
              .cursor-pointer {
                cursor: pointer;
              }
              .px-1 {
                padding: 0 4px;
              }
              .w-3 {
                width: 12px;
              }
              .h-3 {
                height: 12px;
              }
              .mr-1-5 {
                margin-right: 6px;
              }
              .mr-1 {
                margin-right: 4px;
              }
              .rounded-full {
                border-radius: 50%;
              }
              .bg-blue-500 {
                background-color: #2A78D2;
              }
              .text-white {
                color: #FFFFFF;
              }
              .h-4-5 {
                height: 18px;
              }
              .w-4-5 {
                width: 18px;
              }
              .mb-3-5 {
                margin-bottom: 14px;
              }
              .h-6-5 {
                height: 26px;
              }
              .px-3 {
                padding: 0 12px;
              }
              .font-normal {
                font-weight: normal;
              }
              .border-green-700 {
                border-color: #6E8F5A;
              }
              .bg-green-300 {
                background-color: #DFF0D0;
              }
              .text-black {
                color: #000000;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- SECTION 1: INTERVAL -->
              <div class="border p-2 mb-2-5">
                <div class="font-bold text-xs mb-1-5">Interval</div>
                <div class="flex items-center gap-1-5">
                  <span class="text-xs min-w-10">Date</span>
                  <div class="relative">
                    <input type="text" value="2026-04-01" class="w-30 h-5-5 border rounded px-1-5 text-xs" />
                    <div class="absolute right-2 top-1-2 transform -translate-y-1-2 w-3-5 h-3-5 text-gray-500 cursor-pointer">
                      📅
                    </div>
                  </div>
                  <span class="text-xs px-1">-</span>
                  <div class="relative">
                    <input type="text" value="2026-06-30" class="w-30 h-5-5 border rounded px-1-5 text-xs" />
                    <div class="absolute right-2 top-1-2 transform -translate-y-1-2 w-3-5 h-3-5 text-gray-500 cursor-pointer">
                      📅
                    </div>
                  </div>
                </div>
              </div>

              <!-- SECTION 2: ORIENTATION -->
              <div class="border p-2 mb-3">
                <div class="font-bold text-xs mb-1-5">Orientation</div>
                <div class="flex gap-4">
                  <div class="flex items-center">
                    <input type="radio" id="orientation-portrait" name="orientation" checked class="w-3 h-3 border mr-1-5" />
                    <label for="orientation-portrait" class="text-xs mr-1-5">Portrait</label>
                  </div>
                  <div class="flex items-center">
                    <input type="radio" id="orientation-landscape" name="orientation" class="w-3 h-3 border mr-1-5" />
                    <label for="orientation-landscape" class="text-xs mr-1-5">Landscape</label>
                  </div>
                </div>
              </div>

              <!-- INFO MESSAGE -->
              <div class="flex items-center gap-2 mb-3-5">
                <div class="w-4-5 h-4-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  i
                </div>
                <span class="text-xs">Check that the VAT codes in your accounts chart match</span>
              </div>

              <!-- ACTION BUTTONS -->
              <div class="flex gap-2">
                <button class="h-6-5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer">Show on screen</button>
                <button class="h-6-5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer">Show PDF</button>
                <button class="h-6-5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer">Show TXT</button>
                <button class="h-6-5 px-3 text-xs font-normal rounded border border-green-700 bg-green-300 text-black cursor-pointer">Cancel</button>
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

export default openVatReport;