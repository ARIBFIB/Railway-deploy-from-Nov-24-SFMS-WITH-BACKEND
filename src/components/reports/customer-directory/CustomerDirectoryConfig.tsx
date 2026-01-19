const openCustomerDirectory = () => {
  // Open the Customer Directory window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=520,height=400,scrollbars=no,resizable=no'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Customer Directory</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 13px; 
            color: #0F3D2E; 
            background-color: #FFFFFF; 
            line-height: 1.3;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            width: 520px;
            background-color: #FFFFFF;
            padding: 24px;
            border-radius: 6px;
            box-sizing: border-box;
          }
          .title {
            font-size: 20px;
            font-weight: 700;
            color: #0F3D2E;
            margin-bottom: 12px;
            text-align: left;
          }
          .description {
            font-size: 13px;
            line-height: 1.5;
            color: #2F4F3F;
            margin-bottom: 14px;
          }
          .description-2 {
            font-size: 13px;
            margin-bottom: 8px;
            color: #2F4F3F;
          }
          .bullet-list {
            font-size: 13px;
            color: #2F4F3F;
            padding-left: 20px;
            line-height: 1.5;
            margin-bottom: 28px;
          }
          .bullet-list li {
            margin-bottom: 6px;
            position: relative;
          }
          .bullet-list li:before {
            content: "•";
            color: #0F3D2E;
            position: absolute;
            left: -20px;
          }
          .download-btn {
            background-color: #0B7D3E;
            color: #FFFFFF;
            font-size: 14px;
            font-weight: 600;
            height: 44px;
            padding: 0 24px;
            border: none;
            border-radius: 22px;
            cursor: pointer;
            float: right;
            transition: background-color 0.2s ease;
          }
          .download-btn:hover {
            background-color: #096734;
          }
          .download-btn:active {
            background-color: #07592D;
          }
          .download-btn:focus {
            outline: 2px solid #0B7D3E;
            outline-offset: 2px;
          }
          .error-message {
            color: #B00020;
            font-size: 12px;
            margin-top: 12px;
            text-align: center;
            display: none;
          }
          ul {
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .clearfix::after {
            content: "";
            display: table;
            clear: both;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">Customer Directory</div>
          
          <p class="description">
            You can export your customers to a CSV file compatible
            with, for example, Google Sheets and Microsoft Excel.
          </p>
          
          <p class="description-2">
            The file will contain the following information:
          </p>
          
          <ul class="bullet-list">
            <li>Customer Information</li>
            <li>Address Information</li>
            <li>Customer Settings</li>
          </ul>
          
          <div class="clearfix">
            <button id="download-btn" class="download-btn">Download File</button>
          </div>
          
          <div id="error-message" class="error-message">
            Failed to generate file. Please try again.
          </div>
        </div>
        
        <script>
          document.getElementById('download-btn').addEventListener('click', function() {
            try {
              // Generate CSV content
              const csvContent = generateCSV();
              
              // Create blob and download
              const blob = new Blob(['\\uFEFF' + csvContent], { 
                type: 'text/csv;charset=utf-8;' 
              });
              
              const link = document.createElement('a');
              const url = URL.createObjectURL(blob);
              
              // Generate filename with current date
              const today = new Date();
              const dateString = today.toISOString().split('T')[0];
              const filename = \`customer_directory_\${dateString}.csv\`;
              
              link.setAttribute('href', url);
              link.setAttribute('download', filename);
              link.style.visibility = 'hidden';
              
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Show success feedback
              this.textContent = 'Downloaded!';
              setTimeout(() => {
                this.textContent = 'Download File';
              }, 2000);
              
            } catch (error) {
              console.error('Error generating CSV:', error);
              document.getElementById('error-message').style.display = 'block';
              setTimeout(() => {
                document.getElementById('error-message').style.display = 'none';
              }, 5000);
            }
          });
          
          // Make button accessible via keyboard
          document.getElementById('download-btn').addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.click();
            }
          });
          
          function generateCSV() {
            // CSV header
            const headers = [
              'CustomerID',
              'CustomerName', 
              'Email',
              'Phone',
              'AddressLine1',
              'AddressLine2',
              'City',
              'PostalCode',
              'Country',
              'CustomerType',
              'Status',
              'CreatedDate'
            ];
            
            // Sample data rows
            const dataRows = [
              [
                '1',
                '"Customer01"',
                '"customer01@email.com"',
                '"+46123456789"',
                '"Main Street 1"',
                '""',
                '"Stockholm"',
                '"11122"',
                '"Sweden"',
                '"Business"',
                '"Active"',
                '"2025-03-12"'
              ],
              [
                '2',
                '"Customer02"',
                '"info@customer02.com"',
                '"+4687654321"',
                '"Second Street 10"',
                '"Floor 2"',
                '"Gothenburg"',
                '"41101"',
                '"Sweden"',
                '"Private"',
                '"Active"',
                '"2025-06-01"'
              ],
              [
                '3',
                '"Customer03"',
                '"contact@customer03.se"',
                '"+46701234567"',
                '"Third Avenue 5"',
                '""',
                '"Malmö"',
                '"21111"',
                '"Sweden"',
                '"Business"',
                '"Inactive"',
                '"2025-09-15"'
              ]
            ];
            
            // Combine header and data
            const csvRows = [headers.join(',')];
            dataRows.forEach(row => {
              csvRows.push(row.join(','));
            });
            
            return csvRows.join('\\n');
          }
          
          // Set focus to download button on load
          window.onload = function() {
            document.getElementById('download-btn').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openCustomerDirectory };