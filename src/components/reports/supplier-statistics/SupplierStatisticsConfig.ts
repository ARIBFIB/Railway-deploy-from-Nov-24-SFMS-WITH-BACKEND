// Supplier Statistics Configuration
// Opens the supplier statistics in a new window/tab

export const openSupplierStatistics = () => {
  // Create a new window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=820,height=600,scrollbars=no,resizable=yes'
  );
  
  if (newWindow) {
    // Write the HTML structure directly
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Supplier Statistics</title>
        <style>
          body {
            margin: 0;
            padding: 8px;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            color: #000000;
            background-color: #FFFFFF;
          }
          .container {
            max-width: 820px;
            margin: 0 auto;
          }
          .flex {
            display: flex;
            align-items: center;
          }
          .mb-3 {
            margin-bottom: 10px;
          }
          .mr-2\\.5 {
            margin-right: 10px;
          }
          .w-30 {
            width: 120px;
          }
          .h-5 {
            height: 20px;
          }
          .border {
            border: 1px solid #7F7F7F;
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
          .w-4\\.5 {
            width: 18px;
          }
          .h-4\\.5 {
            height: 18px;
          }
          .bg-yellow-300 {
            background-color: #FFE066;
          }
          .border-gray-500 {
            border-color: #7F7F7F;
          }
          .ml-1 {
            margin-left: 4px;
          }
          .cursor-pointer {
            cursor: pointer;
          }
          .w-65 {
            width: 260px;
          }
          .bg-gray-200 {
            background-color: #F2F2F2;
          }
          .ml-1\\.5 {
            margin-left: 6px;
          }
          .p-1\\.5 {
            padding: 6px;
          }
          .w-3 {
            width: 12px;
          }
          .h-3 {
            height: 12px;
          }
          .border-gray-600 {
            border-color: #7F7F7F;
          }
          .mr-1 {
            margin-right: 4px;
          }
          .mr-6 {
            margin-right: 24px;
          }
          .w-25 {
            width: 100px;
          }
          .mx-1\\.5 {
            margin: 0 6px;
          }
          .w-45 {
            width: 180px;
          }
          .h-5\\.5 {
            height: 22px;
          }
          .mb-4 {
            margin-bottom: 16px;
          }
          .pt-2 {
            padding-top: 8px;
          }
          .justify-center {
            justify-content: center;
          }
          .h-6\\.5 {
            height: 26px;
          }
          .px-3 {
            padding: 4px 12px;
          }
          .border-green-700 {
            border-color: #6FA25C;
          }
          .bg-green-300 {
            background-color: #CFEAC1;
          }
          .hover\\:bg-green-400:hover {
            background-color: #B8D8A8;
          }
          .mr-2 {
            margin-right: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Supplier Section -->
          <div class="flex mb-3">
            <label class="text-xs text-black mr-2.5">Supplier</label>
            <div class="flex">
              <input type="text" value="" class="w-30 h-5 border px-1 text-xs" />
              <div class="w-4.5 h-4.5 bg-yellow-300 border border-gray-500 ml-1 flex items-center justify-center cursor-pointer">⬛</div>
              <input type="text" value="" readonly class="w-65 h-5 border bg-gray-200 ml-1.5 px-1 text-xs" />
            </div>
          </div>

          <!-- Interval Section -->
          <div class="border border-gray-500 p-1.5 mb-3">
            <div class="flex">
              <input type="radio" id="interval-all" name="interval" checked class="w-3 h-3 border mr-1" />
              <label for="interval-all" class="text-xs mr-6">All</label>
              
              <input type="radio" id="interval-date" name="interval" class="w-3 h-3 border mr-1" />
              <label for="interval-date" class="text-xs mr-2">Date</label>
              
              <div class="flex">
                <input type="text" value="2026-01-01" disabled class="w-25 h-5 border px-1 text-xs" />
                <div class="w-4.5 h-4.5 ml-1 cursor-pointer flex items-center justify-center text-xs">📅</div>
                <span class="mx-1.5">-</span>
                <input type="text" value="2026-12-31" disabled class="w-25 h-5 border px-1 text-xs" />
                <div class="w-4.5 h-4.5 ml-1 cursor-pointer flex items-center justify-center text-xs">📅</div>
              </div>
            </div>
          </div>

          <!-- Invoice Filter Section -->
          <div class="flex mb-3">
            <label class="text-xs text-black mr-2.5">Invoice Filter</label>
            <select class="w-45 h-5.5 border text-xs">
              <option>Show All</option>
              <option>Paid</option>
              <option>Unpaid</option>
              <option>Overdue</option>
            </select>
          </div>

          <!-- Orientation Section -->
          <div class="flex mb-3">
            <input type="radio" id="orientation-portrait" name="orientation" checked class="w-3 h-3 border mr-1" />
            <label for="orientation-portrait" class="text-xs mr-6">Portrait</label>
            
            <input type="radio" id="orientation-landscape" name="orientation" class="w-3 h-3 border mr-1" />
            <label for="orientation-landscape" class="text-xs">Landscape</label>
          </div>

          <!-- Currency Section -->
          <div class="flex mb-3">
            <input type="checkbox" id="show-in-sek" class="w-3 h-3 border mr-1" />
            <label for="show-in-sek" class="text-xs">Show in SEK SEK</label>
          </div>

          <!-- Show Amount Section -->
          <div class="flex mb-4">
            <input type="radio" id="excl-vat" name="amount-option" checked class="w-3 h-3 border mr-1" />
            <label for="excl-vat" class="text-xs mr-6">Excl. VAT</label>
            
            <input type="radio" id="vat-included" name="amount-option" class="w-3 h-3 border mr-1" />
            <label for="vat-included" class="text-xs">VAT included</label>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center pt-2">
            <button class="h-6.5 px-3 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2">Show on screen</button>
            <button class="h-6.5 px-3 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2">Show PDF</button>
            <button class="h-6.5 px-3 text-xs border border-green-700 bg-green-300 hover:bg-green-400 mr-2">Show TXT</button>
            <button class="h-6.5 px-3 text-xs border border-green-700 bg-green-300 hover:bg-green-400">Cancel</button>
          </div>
        </div>
      </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
  }
};

export default openSupplierStatistics;