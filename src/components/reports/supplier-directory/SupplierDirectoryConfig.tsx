const openSupplierDirectory = () => {
  // Open the Supplier Directory export panel
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=480,height=600,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Supplier Directory</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Inter, Arial, Helvetica, sans-serif; 
            font-size: 13px; 
            color: #0F2E24; 
            background-color: #FFFFFF; 
            line-height: 1.4;
            overflow: auto;
          }
          .container {
            width: 420px;
            margin: 0 auto;
            padding: 24px;
          }
          .title {
            font-size: 18px;
            font-weight: 700;
            color: #0E3A2F;
            text-align: left;
            margin-bottom: 12px;
          }
          .description {
            font-size: 13px;
            color: #2F4F45;
            max-width: 360px;
            margin-bottom: 18px;
          }
          .section-text {
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 10px;
          }
          .bullet-list {
            margin-bottom: 26px;
          }
          .bullet-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 6px;
          }
          .bullet {
            color: #0E3A2F;
            margin-right: 12px;
            margin-top: 4px;
          }
          .bullet-text {
            font-size: 13px;
            color: #0F2E24;
            flex: 1;
          }
          .primary-button {
            width: 180px;
            height: 44px;
            background-color: #0B7A3E;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 600;
            border: none;
            border-radius: 999px;
            cursor: pointer;
            display: block;
            margin: 0 auto;
          }
          .primary-button:hover {
            background-color: #096B36;
          }
          .primary-button:active {
            background-color: #075C2F;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">Supplier register</div>
          
          <div class="description">
            You can export your suppliers to a CSV file
            that is compatible with, for example, Google
            Sheets and Microsoft Excel.
          </div>
          
          <div class="section-text">
            The file will contain the following information:
          </div>
          
          <div class="bullet-list">
            <div class="bullet-item">
              <div class="bullet">●</div>
              <div class="bullet-text">Supplier details</div>
            </div>
            <div class="bullet-item">
              <div class="bullet">●</div>
              <div class="bullet-text">Address details</div>
            </div>
            <div class="bullet-item">
              <div class="bullet">●</div>
              <div class="bullet-text">Supplier settings</div>
            </div>
          </div>
          
          <button id="download-file" class="primary-button">Download file</button>
        </div>
        
        <script>
          // Handle download file button click
          document.getElementById('download-file').onclick = function() {
            // Generate CSV content
            const csvContent = \`
"Supplier No","Supplier Name","Address","Postal Code","City","Country","Phone","Email","Currency","Payment Terms","VAT Number","Status"
"1001","ABC Supplies Ltd","Main Street 12","12345","Stockholm","SE","+461234567","info@abc.com","SEK","30 days","SE123456789","Active"
"1002","XYZ Materials Inc","Oak Avenue 45","54321","Gothenburg","SE","+469876543","contact@xyz.com","EUR","60 days","SE987654321","Active"
"1003","DEF Components AB","Park Lane 78","98765","Malmö","SE","+465551234","orders@def.com","SEK","Net cash","SE567891234","Inactive"
\`.trim();
            
            // Create blob with UTF-8 encoding
            const blob = new Blob([csvContent], { 
              type: 'text/csv;charset=utf-8;' 
            });
            
            // Create download link
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            const filename = 'supplier_register_' + new Date().toISOString().split('T')[0] + '.csv';
            
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openSupplierDirectory };