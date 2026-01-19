const openDepreciation = () => {
  // Open the Depreciation report window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=1024,height=700,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Depreciation</title>
        <style>
          body { 
            margin: 0; 
            padding: 8px 12px 12px 12px; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 14px;
            width: 980px;
            max-width: 980px;
            overflow: auto;
          }
          .header-area { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
          }
          .left-header { 
            text-align: left; 
            line-height: 14px;
          }
          .center-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #000000;
            margin: 4px 0 10px 0;
          }
          .right-header { 
            text-align: right; 
            color: #000000; 
            font-size: 11px;
          }
          .bold { font-weight: bold; }
          .text-11 { font-size: 11px; }
          .text-20 { font-size: 20px; }
          .mt-2 { margin-top: 2px; }
          .mt-4 { margin-top: 4px; }
          .mt-6 { margin-top: 6px; }
          .mt-8 { margin-top: 8px; }
          .mt-12 { margin-top: 12px; }
          .mb-2 { margin-bottom: 2px; }
          .mb-6 { margin-bottom: 6px; }
          .mb-8 { margin-bottom: 8px; }
          .mb-10 { margin-bottom: 10px; }
          .pb-4 { padding-bottom: 4px; }
          .pt-2 { padding-top: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-3 { padding-top: 3px; padding-bottom: 3px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .divider { 
            height: 1px; 
            background-color: #000000; 
            margin: 6px 0 6px 0;
          }
          .section-header { 
            font-size: 11px; 
            font-weight: bold; 
            color: #000000;
            padding-bottom: 4px;
            margin-top: 16px;
          }
          .table-container { width: 100%; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
          }
          th { 
            font-weight: bold; 
            padding: 3px 4px; 
            text-align: left; 
            border-bottom: 1px solid #000000;
            font-size: 11px;
            color: #000000;
          }
          td { 
            vertical-align: top; 
            padding: 3px 4px;
            font-size: 11px;
            color: #000000;
            height: 18px;
          }
          .account-header {
            font-weight: bold;
            font-size: 11px;
            color: #000000;
            margin: 6px 0 2px 0;
          }
          .account-total {
            font-weight: bold;
            font-size: 11px;
            color: #000000;
            margin: 2px 0 8px 0;
          }
          .final-summary {
            font-weight: bold;
            font-size: 11px;
            margin-top: 12px;
          }
          .numeric-right { 
            text-align: right; 
          }
          .row-divider {
            height: 1px;
            background-color: #000000;
            margin: 4px 0;
          }
        </style>
      </head>
      <body>
        <!-- Header Area -->
        <div class="header-area">
          <!-- Left Header Block -->
          <div class="left-header">
            <div class="text-11">Calculation date 2026-01-19</div>
            <div class="text-11 mt-2">Selection: Active & fully depreciated assets</div>
          </div>

          <!-- Center Title -->
          <div class="center-title">
            Depreciation
          </div>

          <!-- Right Header Block -->
          <div class="right-header">
            <div class="text-11">Printed 2026-01-19 17:15</div>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Table Structure -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 8%;">Asset no.</th>
                <th style="width: 22%;">Designation</th>
                <th class="text-right" style="width: 12%;">Write-off basis</th>
                <th class="text-right" style="width: 14%;">Write-off brought forward</th>
                <th class="text-right" style="width: 14%;">Write-off during year</th>
                <th class="text-right" style="width: 14%;">Acc. write-off</th>
                <th class="text-right" style="width: 16%;">Book value</th>
              </tr>
            </thead>
            <tbody>
              <!-- Account 1000 - Motor Vehicles -->
              <tr>
                <td colspan="7" class="account-header">Account     1000     Motor Vehicle</td>
              </tr>
              <tr>
                <td class="text-11">1</td>
                <td class="text-11">Brand Logo</td>
                <td class="text-11 numeric-right">7 000,00</td>
                <td class="text-11 numeric-right">1 833,00</td>
                <td class="text-11 numeric-right">1 833,00</td>
                <td class="text-11 numeric-right">3 666,00</td>
                <td class="text-11 numeric-right">3 334,00</td>
              </tr>
              <tr>
                <td class="text-11">2</td>
                <td class="text-11">Honda CIVIC</td>
                <td class="text-11 numeric-right">9 500,00</td>
                <td class="text-11 numeric-right">950,00</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">950,00</td>
                <td class="text-11 numeric-right">9 050,00</td>
              </tr>
              <tr>
                <td colspan="2" class="account-total">Total</td>
                <td class="account-total numeric-right">16 500,00</td>
                <td class="account-total numeric-right">2 783,00</td>
                <td class="account-total numeric-right">1 833,00</td>
                <td class="account-total numeric-right">4 616,00</td>
                <td class="account-total numeric-right">12 384,00</td>
              </tr>
              
              <!-- Account 1030 - Patents -->
              <tr>
                <td colspan="7" class="account-header">Account     1030     Patents</td>
              </tr>
              <tr>
                <td class="text-11">3</td>
                <td class="text-11">car</td>
                <td class="text-11 numeric-right">2 000,00</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">2 000,00</td>
              </tr>
              <tr>
                <td colspan="2" class="account-total">Total</td>
                <td class="account-total numeric-right">2 000,00</td>
                <td class="account-total numeric-right">0,00</td>
                <td class="account-total numeric-right">0,00</td>
                <td class="account-total numeric-right">0,00</td>
                <td class="account-total numeric-right">2 000,00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Final Summary Section -->
        <div class="final-summary">
          Total sum for the period
        </div>
        <div class="mt-6">
          <table style="width: 100%;">
            <tr>
              <td style="width: 8%;"></td>
              <td style="width: 22%;"></td>
              <td class="text-right bold" style="width: 12%;">18 500,00</td>
              <td class="text-right bold" style="width: 14%;">2 783,00</td>
              <td class="text-right bold" style="width: 14%;">1 833,00</td>
              <td class="text-right bold" style="width: 14%;">4 616,00</td>
              <td class="text-right bold" style="width: 16%;">14 384,00</td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openDepreciation };