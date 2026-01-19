const openSystemDocumentationConfig = () => {
  // Open the parameter selection window
  const newWindow = window.open(
    '', 
    '_blank', 
    'width=620,height=380,scrollbars=yes,resizable=yes'
  );

  if (newWindow) {
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>System Documentation Configuration</title>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 12px; 
            color: #000000; 
            background-color: #FFFFFF; 
            overflow: hidden;
          }
          .container {
            padding: 12px;
          }
          .flex { display: flex; }
          .items-center { align-items: center; }
          .justify-center { justify-content: center; }
          .mb-10 { margin-bottom: 10px; }
          .mb-8 { margin-bottom: 8px; }
          .mb-6 { margin-bottom: 6px; }
          .mr-6 { margin-right: 6px; }
          .mr-8 { margin-right: 8px; }
          .ml-4 { margin-left: 4px; }
          .ml-6 { margin-left: 6px; }
          .mt-6 { margin-top: 6px; }
          .mt-8 { margin-top: 8px; }
          .mt-18 { margin-top: 18px; }
          .gap-8 { gap: 8px; }
          .gap-10 { gap: 10px; }
          .w-95 { width: 95px; }
          .w-16 { width: 16px; }
          .w-120 { width: 120px; }
          .w-220 { width: 220px; }
          .w-110 { width: 110px; }
          .w-580 { width: 580px; }
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
          .group-box {
            width: 580px;
            border: 1px solid #000000;
            padding: 8px 0 0 10px;
            margin-bottom: 10px;
          }
          .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Content Selection -->
          <div class="group-box">
            <div class="text-12 text-[#000000] mb-8">Content</div>
            <div class="checkbox-group">
              <div class="flex items-center">
                <input type="checkbox" id="orientation" checked />
                <label for="orientation" class="ml-6 text-12 text-[#000000]">Orientation</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="chart-of-accounts" checked />
                <label for="chart-of-accounts" class="ml-6 text-12 text-[#000000]">Chart of Accounts</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="collection-plan" checked />
                <label for="collection-plan" class="ml-6 text-12 text-[#000000]">Samlingsplan (Collection plan)</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="processing-rules" checked />
                <label for="processing-rules" class="ml-6 text-12 text-[#000000]">Behandlingsregler (Processing rules)</label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="documentation" checked />
                <label for="documentation" class="ml-6 text-12 text-[#000000]">Documentation</label>
              </div>
            </div>
          </div>

          <!-- Company Information -->
          <div class="flex items-center mb-8">
            <input type="checkbox" id="company-info" checked />
            <label for="company-info" class="ml-6 text-12 text-[#000000]">Company Information: Print</label>
          </div>

          <!-- Orientation -->
          <div class="flex items-center mb-8">
            <div class="flex items-center mr-8">
              <input type="radio" id="portrait" name="orientation" />
              <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
            </div>
            <div class="flex items-center">
              <input type="radio" id="landscape" name="orientation" checked />
              <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-center mt-18">
            <button id="show-on-screen" class="btn mr-8-btn">Show on screen</button>
            <button id="show-pdf" class="btn mr-8-btn">Show PDF</button>
            <button id="cancel" class="btn">Cancel</button>
          </div>
        </div>
        
        <script>
          // Handle button clicks
          document.getElementById('show-on-screen').onclick = function() {
            // Get values from the form
            const orientationChecked = document.getElementById('orientation').checked;
            const chartOfAccountsChecked = document.getElementById('chart-of-accounts').checked;
            const collectionPlanChecked = document.getElementById('collection-plan').checked;
            const processingRulesChecked = document.getElementById('processing-rules').checked;
            const documentationChecked = document.getElementById('documentation').checked;
            const companyInfoChecked = document.getElementById('company-info').checked;
            const orientation = document.querySelector('input[name="orientation"]:checked').id;
            
            // Open the system documentation report in a new window
            const reportWindow = window.open(
              '', 
              '_blank', 
              'width=1200,height=800,scrollbars=yes,resizable=yes'
            );
            
            if (reportWindow) {
              reportWindow.document.write(\`
                <!DOCTYPE html>
                <html>
                <head>
                  <meta charset="utf-8" />
                  <title>System Documentation – Fortnox</title>
                  <style>
                    body { 
                      margin: 0; 
                      padding: 20px; 
                      font-family: Arial, Helvetica, sans-serif; 
                      font-size: 11px; 
                      color: #000000; 
                      background-color: #FFFFFF; 
                      line-height: 1.2;
                      overflow: auto;
                    }
                    .header-area { 
                      display: flex; 
                      justify-content: space-between; 
                      align-items: flex-start; 
                      padding: 12px; 
                    }
                    .left-header { text-align: left; }
                    .center-title { 
                      position: absolute; 
                      left: 50%; 
                      transform: translateX(-50%); 
                      top: 10px; 
                      font-size: 14px; 
                      font-weight: bold; 
                    }
                    .right-header { text-align: right; }
                    .bold { font-weight: bold; }
                    .text-12 { font-size: 12px; }
                    .text-11 { font-size: 11px; }
                    .text-14 { font-size: 14px; }
                    .mt-12 { margin-top: 12px; }
                    .mt-6 { margin-top: 6px; }
                    .ml-12 { margin-left: 12px; }
                    .mr-12 { margin-right: 12px; }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .text-left { text-align: left; }
                    .table-container { padding: 0 12px 12px 12px; }
                    table { 
                      width: 100%; 
                      border-collapse: collapse; 
                    }
                    th { 
                      font-weight: bold; 
                      padding: 4px; 
                      text-align: left; 
                      border: 1px solid #000000;
                    }
                    td { 
                      vertical-align: top; 
                      padding: 4px;
                      border: 1px solid #000000;
                    }
                    .chapter-heading { 
                      font-size: 14px; 
                      font-weight: bold; 
                      margin-top: 14px; 
                      margin-bottom: 6px; 
                    }
                    .subheading { 
                      font-weight: bold; 
                      margin-top: 8px; 
                      margin-bottom: 4px; 
                    }
                    .list-item { 
                      margin-left: 16px; 
                      margin-bottom: 4px; 
                    }
                    .numeric-right { 
                      text-align: right; 
                    }
                  </style>
                </head>
                <body>
                  <!-- Header Area -->
                  <div class="header-area">
                    <!-- Left Header Block -->
                    <div class="left-header">
                      <div class="bold text-11">cloud</div>
                      <div class="bold text-11">System documentation Fortnox</div>
                      \${companyInfoChecked ? \`
                      <div class="text-11">Test company</div>
                      <div class="text-11">Financial Year 2026-01-01 - 2026-12-31</div>
                      <div class="text-11">Printed 2026-01-19</div>
                      \` : ''}
                    </div>
                  </div>

                  <div class="mt-12">
                    <!-- Chapter 1: Introduction -->
                    <div class="chapter-heading">1. Introduction</div>
                    <p>
                      This system documentation explains the legal basis under the Accounting Act and describes the purpose of system documentation.
                      It references REKO 140 Documentation and states the target audience:
                    </p>
                    <ul class="list-item">
                      <li>Business owner</li>
                      <li>Accounting consultant</li>
                      <li>Auditor</li>
                      <li>Tax authority</li>
                      <li>Bankruptcy trustee</li>
                    </ul>

                    <!-- Chapter 2: Chart of Accounts -->
                    \${chartOfAccountsChecked ? \`
                    <div class="chapter-heading">2. Chart of accounts</div>
                    <p>
                      Refers to Appendix 1 which shows the current chart of accounts that updates automatically when accounts change.
                      The processing history contains change date, user, and type of change.
                    </p>
                    <p>
                      The explanation section includes explanations of VAT code, D/K (Debit/Credit suggestion), AK (Automatic postings),
                      cost center rules, project rules, and transaction info rules.
                    </p>
                    \` : ''}

                    <!-- Chapter 3: Collection Plan -->
                    \${collectionPlanChecked ? \`
                    <div class="chapter-heading">3. Collection plan</div>
                    <p>
                      Overview of the accounting system structure with a visual system diagram.
                      Description of each module and accounting impact:
                    </p>
                    <div class="subheading">Fortnox Accounting</div>
                    <p>
                      Core accounting module that handles basic ledger, general ledger, and financial reports.
                      Receives postings from all verification series.
                    </p>
                    <div class="subheading">Fortnox Invoicing</div>
                    <p>
                      Creates customer invoices and generates postings for revenue, output VAT, and accounts receivable.
                      Uses verification series B and C.
                    </p>
                    <div class="subheading">Fortnox Facility Register</div>
                    <p>
                      Fixed assets and depreciation using verification series G.
                    </p>
                    <div class="subheading">Fortnox Order</div>
                    <p>
                      Pre-system for invoicing with no accounting entries created.
                    </p>
                    \` : ''}

                    <!-- Chapter 4: Processing Rules -->
                    \${processingRulesChecked ? \`
                    <div class="chapter-heading">4. Processing rules</div>
                    <div class="subheading">4.1 Verification Series</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Name</th>
                          <th>Manual posting allowed</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>A</td>
                          <td>Accounting</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>B</td>
                          <td>Customer invoices</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>C</td>
                          <td>Payments from customers</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>D</td>
                          <td>Supplier invoices</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>E</td>
                          <td>Payments to suppliers</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>F</td>
                          <td>Cash</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>G</td>
                          <td>Depreciation</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>H</td>
                          <td>Periodization</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>I</td>
                          <td>Financial statements</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>J</td>
                          <td>Cash invoice</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>K</td>
                          <td>Receipt</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>L</td>
                          <td>Salary</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>M</td>
                          <td>VAT report</td>
                          <td>Yes</td>
                        </tr>
                        <tr>
                          <td>N</td>
                          <td>Stock</td>
                          <td>Yes</td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="subheading">4.2 Default Accounts</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Accounting event</th>
                          <th>Account number</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Plusgiro</td>
                          <td>1920</td>
                        </tr>
                        <tr>
                          <td>Bank transfer</td>
                          <td>1930</td>
                        </tr>
                        <tr>
                          <td>Incoming VAT</td>
                          <td>2641</td>
                        </tr>
                        <tr>
                          <td>Output VAT 25%</td>
                          <td>2611</td>
                        </tr>
                        <tr>
                          <td>Supplier debt</td>
                          <td>2440</td>
                        </tr>
                        <tr>
                          <td>Customer receivable</td>
                          <td>1510</td>
                        </tr>
                        <tr>
                          <td>Period allocation income</td>
                          <td>3990</td>
                        </tr>
                        <tr>
                          <td>Period allocation expense</td>
                          <td>1790</td>
                        </tr>
                      </tbody>
                    </table>

                    <div class="subheading">4.3 Automatic Postings</div>
                    <p>
                      Displayed as a structured table with number, name, account, linked accounts, percentage, and amount.
                      Includes VAT, salary, leasing, EU VAT, and test rules. Percent-based postings shown per linked account.
                      Zero-value rules included if configured.
                    </p>
                    \` : ''}

                    <!-- Chapter 5: Documentation -->
                    \${documentationChecked ? \`
                    <div class="chapter-heading">5. Documentation</div>
                    <p>
                      Links to Fortnox Help Center and module-specific documentation URLs.
                      Explains that manuals provide deeper functional detail.
                    </p>

                    <div class="subheading">5.1 Changing an Accounting Entry</div>
                    <p>
                      Lists editable fields: Description, Project, Cost center, Date, and Transaction info.
                      Rules: Deleted rows remain visible in history and all changes are logged.
                    </p>

                    <div class="subheading">5.2 Processing History</div>
                    <p>
                      Every change is logged with user, time, and affected series.
                      Searchable by series, date changes, and user.
                      Mandatory annual printing according to REKO 140.
                    </p>
                    \` : ''}

                    <!-- Appendix 1: Current Chart of Accounts -->
                    \${chartOfAccountsChecked ? \`
                    <div class="chapter-heading">Appendix 1 — Current Chart of Accounts</div>
                    <table>
                      <thead>
                        <tr>
                          <th>Account</th>
                          <th>Name</th>
                          <th>VAT code</th>
                          <th>SRU</th>
                          <th>D/K</th>
                          <th>AK</th>
                          <th>Cost center</th>
                          <th>Project</th>
                          <th>Transaction info</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1010</td>
                          <td>Development expenses</td>
                          <td>-</td>
                          <td>-</td>
                          <td>D</td>
                          <td>-</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                        </tr>
                        <tr>
                          <td>1020</td>
                          <td>Patent</td>
                          <td>-</td>
                          <td>-</td>
                          <td>D</td>
                          <td>-</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                        </tr>
                        <tr>
                          <td>1030</td>
                          <td>Goodwill</td>
                          <td>-</td>
                          <td>-</td>
                          <td>D</td>
                          <td>-</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                        </tr>
                        <tr>
                          <td>1510</td>
                          <td>Customer receivable</td>
                          <td>-</td>
                          <td>-</td>
                          <td>D</td>
                          <td>-</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                        </tr>
                        <tr>
                          <td>1920</td>
                          <td>Plusgiro</td>
                          <td>-</td>
                          <td>-</td>
                          <td>D</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>1930</td>
                          <td>Bank</td>
                          <td>-</td>
                          <td>-</td>
                          <td>D</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>2440</td>
                          <td>Supplier debt</td>
                          <td>-</td>
                          <td>-</td>
                          <td>K</td>
                          <td>-</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                        </tr>
                        <tr>
                          <td>2611</td>
                          <td>Output VAT 25%</td>
                          <td>-</td>
                          <td>-</td>
                          <td>K</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>2641</td>
                          <td>Input VAT</td>
                          <td>-</td>
                          <td>-</td>
                          <td>D</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                        <tr>
                          <td>3001</td>
                          <td>Sales within Sweden</td>
                          <td>25%</td>
                          <td>-</td>
                          <td>K</td>
                          <td>-</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                          <td>Sometimes</td>
                        </tr>
                        <tr>
                          <td>4010</td>
                          <td>Salary</td>
                          <td>-</td>
                          <td>-</td>
                          <td>D</td>
                          <td>-</td>
                          <td>Sometimes</td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                      </tbody>
                    </table>
                    \` : ''}

                    <!-- Archive Plan Reference -->
                    <div class="chapter-heading">Archive Plan</div>
                    <p>
                      Referenced as a separate appendix and not printed inline.
                    </p>
                  </div>
                </body>
                </html>
              \`);
              
              reportWindow.focus();
            }
            
            // Close the parameter window
            window.close();
          };
          
          document.getElementById('show-pdf').onclick = function() {
            alert('PDF generation would happen here');
          };
          
          document.getElementById('cancel').onclick = function() {
            window.close();
          };
          
          // Set focus to the first checkbox on load
          window.onload = function() {
            document.getElementById('orientation').focus();
          };
        </script>
      </body>
      </html>
    `);
    
    newWindow.focus();
  }
};

export { openSystemDocumentationConfig };