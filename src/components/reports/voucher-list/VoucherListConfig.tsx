const openVoucherList = () => {
  // Open the Voucher List report in a new window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=1200,height=800,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Checklist Report</title>
        <style>
          body { 
            margin: 0; 
            padding: 8px; 
            font-family: Segoe UI, Arial, sans-serif; 
            font-size: 11px; 
            color: #000000; 
            background-color: #FFFFFF; 
            line-height: 14px;
            width: 1024px;
            max-width: 1024px;
            overflow: auto;
          }
          .header-area { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            padding: 0 12px 0 12px; 
          }
          .left-header { 
            text-align: left; 
            margin-bottom: 6px;
          }
          .center-title { 
            position: absolute; 
            left: 50%; 
            transform: translateX(-50%); 
            top: 40px; 
            font-size: 16px; 
            font-weight: bold; 
            margin-top: 2px;
          }
          .right-header { 
            text-align: right; 
            color: #555555; 
            font-size: 10px;
          }
          .bold { font-weight: bold; }
          .text-11 { font-size: 11px; }
          .text-10 { font-size: 10px; }
          .text-12 { font-size: 12px; }
          .text-16 { font-size: 16px; }
          .mt-6 { margin-top: 6px; }
          .mb-6 { margin-bottom: 6px; }
          .pt-4 { padding-top: 4px; }
          .pb-4 { padding-bottom: 4px; }
          .pt-2 { padding-top: 2px; }
          .px-4 { padding-left: 4px; padding-right: 4px; }
          .py-2 { padding-top: 2px; padding-bottom: 2px; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .text-left { text-align: left; }
          .divider { 
            height: 1px; 
            background-color: #CFCFCF; 
            margin: 6px 0 6px 0;
          }
          .table-container { padding: 0 12px 12px 12px; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
          }
          th { 
            background-color: #F2F2F2;
            font-weight: bold; 
            padding: 2px 4px; 
            text-align: left; 
            border-bottom: 1px solid #CFCFCF;
            font-size: 11px;
            color: #333333;
          }
          td { 
            vertical-align: top; 
            padding: 2px 4px;
            height: 18px;
          }
          .voucher-header {
            background-color: #FAFAFA;
            border-top: 1px solid #E0E0E0;
            font-weight: bold;
            font-size: 11px;
          }
          .transaction-row {
            border-bottom: 1px solid #EAEAEA;
            font-size: 11px;
          }
          .numeric-right { 
            text-align: right; 
            padding-right: 6px;
          }
          .center-align { 
            text-align: center; 
          }
          .totals-section { 
            margin-top: 6px; 
            padding-top: 4px; 
            border-top: 1px solid #CFCFCF;
          }
          .info-icon { 
            width: 10px; 
            height: 10px; 
            color: #6B6B6B; 
            margin-left: 4px;
          }
        </style>
      </head>
      <body>
        <!-- Header Area -->
        <div class="header-area">
          <!-- Left Header Block -->
          <div class="left-header">
            <div class="bold text-12">Test company</div>
            <div class="text-11">Financial Year 2026-01-01 – 2026-12-31</div>
            <div class="text-11">Period 2026-01-01 – 2026-12-31</div>
          </div>

          <!-- Center Title -->
          <div class="center-title">
            Checklist
          </div>

          <!-- Right Header Block -->
          <div class="right-header">
            <div class="text-10">Printed 2026-01-19 14:11</div>
            <div class="text-10">Latest version A6 B3 F3 M1</div>
          </div>
        </div>

        <!-- Divider -->
        <div class="divider"></div>

        <!-- Table Structure -->
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th style="width: 48px;">Vernr</th>
                <th style="width: 80px;">Booked</th>
                <th style="width: 60px;">Account</th>
                <th style="width: 80px;">Regdat</th>
                <th class="center-align" style="width: 28px;">Ks</th>
                <th style="width: 220px;">Text</th>
                <th style="width: 220px;">Name</th>
                <th class="numeric-right" style="width: 90px;">Debit</th>
                <th class="numeric-right" style="width: 90px;">Credit</th>
              </tr>
            </thead>
            <tbody>
              <!-- Voucher Group 1 -->
              <tr class="voucher-header">
                <td class="text-11 bold" colspan="9">A 1   2026-03-05   2025-12-14   Payment to tax account</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11">A 1</td>
                <td class="text-11">2026-03-05</td>
                <td class="text-11">2641</td>
                <td class="text-11">2025-12-14</td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Payment to tax account</td>
                <td class="text-11">Swedish Tax Agency</td>
                <td class="text-11 numeric-right">12 500,00</td>
                <td class="text-11 numeric-right">0,00</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11"></td>
                <td class="text-11"></td>
                <td class="text-11">1930</td>
                <td class="text-11"></td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Payment to tax account</td>
                <td class="text-11">Swedish Tax Agency</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">12 500,00</td>
              </tr>

              <!-- Voucher Group 2 -->
              <tr class="voucher-header">
                <td class="text-11 bold" colspan="9">A 2   2026-03-06   2026-01-15   Invoice payment received</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11">A 2</td>
                <td class="text-11">2026-03-06</td>
                <td class="text-11">1510</td>
                <td class="text-11">2026-01-15</td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Invoice payment received</td>
                <td class="text-11">Client ABC AB</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">25 000,00</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11"></td>
                <td class="text-11"></td>
                <td class="text-11">1930</td>
                <td class="text-11"></td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Invoice payment received</td>
                <td class="text-11">Client ABC AB</td>
                <td class="text-11 numeric-right">25 000,00</td>
                <td class="text-11 numeric-right">0,00</td>
              </tr>

              <!-- Voucher Group 3 -->
              <tr class="voucher-header">
                <td class="text-11 bold" colspan="9">A 3   2026-03-07   2026-01-20   Office supplies purchase</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11">A 3</td>
                <td class="text-11">2026-03-07</td>
                <td class="text-11">5410</td>
                <td class="text-11">2026-01-20</td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Office supplies purchase</td>
                <td class="text-11">Office Depot AB</td>
                <td class="text-11 numeric-right">1 250,00</td>
                <td class="text-11 numeric-right">0,00</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11"></td>
                <td class="text-11"></td>
                <td class="text-11">1930</td>
                <td class="text-11"></td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Office supplies purchase</td>
                <td class="text-11">Office Depot AB</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">1 250,00</td>
              </tr>

              <!-- Voucher Group 4 -->
              <tr class="voucher-header">
                <td class="text-11 bold" colspan="9">A 4   2026-03-08   2026-02-01   Salary payment</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11">A 4</td>
                <td class="text-11">2026-03-08</td>
                <td class="text-11">4010</td>
                <td class="text-11">2026-02-01</td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Salary payment</td>
                <td class="text-11">Employee John Doe</td>
                <td class="text-11 numeric-right">28 500,00</td>
                <td class="text-11 numeric-right">0,00</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11"></td>
                <td class="text-11"></td>
                <td class="text-11">1930</td>
                <td class="text-11"></td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Salary payment</td>
                <td class="text-11">Employee John Doe</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">28 500,00</td>
              </tr>

              <!-- Voucher Group 5 -->
              <tr class="voucher-header">
                <td class="text-11 bold" colspan="9">A 5   2026-03-09   2026-02-05   Rent payment</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11">A 5</td>
                <td class="text-11">2026-03-09</td>
                <td class="text-11">5210</td>
                <td class="text-11">2026-02-05</td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Rent payment</td>
                <td class="text-11">Landlord Property Co</td>
                <td class="text-11 numeric-right">15 000,00</td>
                <td class="text-11 numeric-right">0,00</td>
              </tr>
              <tr class="transaction-row">
                <td class="text-11"></td>
                <td class="text-11"></td>
                <td class="text-11">1930</td>
                <td class="text-11"></td>
                <td class="text-11 center-align">-</td>
                <td class="text-11">Rent payment</td>
                <td class="text-11">Landlord Property Co</td>
                <td class="text-11 numeric-right">0,00</td>
                <td class="text-11 numeric-right">15 000,00</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Totals Section -->
        <div class="totals-section">
          <div class="text-11 bold">Number of vouchers: 13</div>
          <div class="text-11 bold">Number of transactions: 41</div>
          <div class="text-11 bold">Enclosure: 25,299.00  25,299.00</div>
        </div>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openVoucherList };