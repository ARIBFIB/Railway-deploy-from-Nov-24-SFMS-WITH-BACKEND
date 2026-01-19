const openExportAssets = () => {
  // Open the Export Assets window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=400,height=200,scrollbars=no,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Export Assets</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 12px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 1.3;
            overflow: hidden;
          }
          .container {
            padding: 16px;
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .justify-end { justify-content: flex-end; }
          .mb-10 { margin-bottom: 10px; }
          .mb-8 { margin-bottom: 8px; }
          .mb-6 { margin-bottom: 6px; }
          .mr-6 { margin-right: 6px; }
          .mr-8 { margin-right: 8px; }
          .ml-4 { margin-left: 4px; }
          .ml-6 { margin-left: 6px; }
          .mt-6 { margin-top: 6px; }
          .mt-8 { margin-top: 8px; }
          .mt-16 { margin-top: 16px; }
          .gap-8 { gap: 8px; }
          .gap-10 { gap: 10px; }
          .w-95 { width: 95px; }
          .w-16 { width: 16px; }
          .w-120 { width: 120px; }
          .w-220 { width: 220px; }
          .w-110 { width: 110px; }
          .w-368 { width: 368px; }
          .h-16 { height: 16px; }
          .h-24 { height: 24px; }
          .h-36 { height: 36px; }
          .text-12 { font-size: 12px; }
          .text-11 { font-size: 11px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-[#000000] { color: #000000; }
          .border { border: 1px solid #000000; }
          .bg-white { background-color: #FFFFFF; }
          .bg-[#E6F0FA] { background-color: #E6F0FA; }
          .bg-[#DFF0D8] { background-color: #DFF0D8; }
          .border-[#6AA84F] { border-color: #6AA84F; }
          .rounded-2px { border-radius: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-2 { padding-top: 2px; padding-bottom: 2px; }
          .pl-10 { padding-left: 10px; }
          .pt-8 { padding-top: 8px; }
          input[type="text"] {
            width: 220px;
            height: 18px;
            border: 1px solid #000000;
            background-color: #FFFFFF;
            padding: 2px 4px;
            font-size: 12px;
            font-family: Arial, Helvetica, sans-serif;
          }
          input[type="checkbox"] {
            width: 12px;
            height: 12px;
          }
          input[type="radio"] {
            width: 12px;
            height: 12px;
          }
          .btn {
            width: 95px;
            height: 24px;
            background-color: #DFF0D8;
            border: 1px solid #6AA84F;
            border-radius: 2px;
            font-size: 12px;
            color: #000000;
            cursor: pointer;
          }
          .btn:hover {
            background-color: #CDE8C6;
          }
          .mr-8-btn { margin-right: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="flex items-center mb-10">
            <span class="text-12 text-[#000000]">Export assets to Excel file</span>
          </div>
          
          <div class="flex justify-end mt-auto">
            <button id="export-btn" class="btn mr-8-btn">Export</button>
            <button id="cancel-btn" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle Export button click
          document.getElementById('export-btn').onclick = function() {
            // Create sample data for the Excel file
            const headers = ['Asset ID', 'Description', 'Acquisition Date', 'Cost', 'Accumulated Depreciation', 'Net Book Value', 'Status'];
            const sampleData = [
              ['101', 'Delivery Truck', '2024-05-15', '450000,00', '90000,00', '360000,00', 'Active'],
              ['102', 'Office Computer', '2025-03-10', '25000,00', '8333,33', '16666,67', 'Active'],
              ['103', 'Furniture Set', '2023-11-22', '75000,00', '56250,00', '18750,00', 'Fully depreciated'],
              ['104', 'Cash Register', '2025-08-05', '12000,00', '3000,00', '9000,00', 'Active'],
              ['105', 'Printer', '2024-01-18', '8000,00', '5333,33', '2666,67', 'Active']
            ];
            
            // Create CSV content
            let csvContent = headers.join('\\t') + '\\r\\n';
            sampleData.forEach(row => {
              csvContent += row.join('\\t') + '\\r\\n';
            });
            
            // Convert to Excel format using data URI
            const blob = new Blob(['\\uFEFF' + csvContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'assets_export_' + new Date().toISOString().slice(0, 10) + '.xls';
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            // Close the window after export
            window.close();
          };
          
          // Handle Cancel button click
          document.getElementById('cancel-btn').onclick = function() {
            window.close();
          };
          
          // Set focus to the export button on load
          window.onload = function() {
            document.getElementById('export-btn').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openExportAssets };