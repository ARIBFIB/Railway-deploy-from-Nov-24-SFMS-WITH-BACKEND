import React, { useState } from 'react';
import { X, MessageCircle, Star, FileText } from 'lucide-react';
import AccountAnalysisConfig from './account-analysis/AccountAnalysisConfig';
import BalanceReportConfig from './balance-report/BalanceReportConfig';
import DeletedVouchersConfig from './deleted-vouchers/DeletedVouchersConfig';
import GeneralLedgerConfig from './general-ledger/GeneralLedgerConfig';


interface ReportItem {
  id: string;
  title: string;
  isFavorite: boolean;
  component: React.ComponentType;
}

interface ReportsProps {
  onClose?: () => void;
}

const Reports: React.FC<ReportsProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'all'>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'balance-report': true,
    'performance-report': true,
  });

  // Function to open Balance report in a new window
  const openBalanceReport = () => {
    // Dynamically import and execute the BalanceReportConfig
    import('./balance-report/BalanceReportConfig')
      .then(module => {
        // Execute the default export which should open the window
        if (module.default && typeof module.default === 'function') {
          module.default();
        } else {
          console.error('BalanceReportConfig does not export a callable function');
        }
      })
      .catch(err => {
        console.error('Error loading BalanceReportConfig:', err);
        
        // Fallback implementation in case dynamic import fails
        const newWindow = window.open(
          '', 
          '_blank', 
          'width=440,height=240,scrollbars=no,resizable=yes'
        );
        
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8" />
              <title>Balance Report Configuration</title>
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
                .mb-6 { margin-bottom: 6px; }
                .mr-8 { margin-right: 8px; }
                .mr-6 { margin-right: 6px; }
                .mx-6 { margin-left: 6px; margin-right: 6px; }
                .ml-4 { margin-left: 4px; }
                .mt-6 { margin-top: 6px; }
                .w-90 { width: 90px; }
                .w-14 { width: 14px; }
                .w-16 { width: 16px; }
                .h-18 { height: 18px; }
                .h-14 { height: 14px; }
                .h-16 { height: 16px; }
                .h-24 { height: 24px; }
                .h-36 { height: 36px; }
                .w-410 { width: 410px; }
                .text-12 { font-size: 12px; }
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
                .pt-6 { padding-top: 6px; }
                .pl-10 { padding-left: 10px; }
                .gap-20 { gap: 20px; }
                .gap-6 { gap: 6px; }
                .gap-12 { gap: 12px; }
                input[type="text"] {
                  width: 90px;
                  height: 18px;
                  border: 1px solid #000000;
                  background-color: #FFFFFF;
                  padding: 4px;
                  font-size: 12px;
                  font-family: Arial, Helvetica, sans-serif;
                }
                .date-input {
                  width: 90px;
                  height: 18px;
                  border: 1px solid #000000;
                  background-color: #FFFFFF;
                  padding: 4px;
                  font-size: 12px;
                  font-family: Arial, Helvetica, sans-serif;
                }
                .calendar-btn {
                  width: 16px;
                  height: 16px;
                  background-color: #E6F0FA;
                  border: 1px solid #000000;
                  color: #000000;
                  margin-left: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                }
                .btn {
                  width: 90px;
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
                .mr-6-btn { margin-right: 6px; }
                .group-box {
                  width: 410px;
                  border: 1px solid #000000;
                  padding: 6px 10px 0 10px;
                  margin-bottom: 10px;
                }
                .info-icon {
                  width: 14px;
                  height: 14px;
                  border-radius: 50%;
                  background-color: #E6F0FA;
                  border: 1px solid #7AA7D9;
                  color: #2B6CB0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  font-weight: bold;
                  margin-top: 6px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <!-- Date Range Row -->
                <div class="flex items-center mb-10">
                  <label class="mr-8 text-12 text-[#000000]">Date</label>
                  <div class="flex items-center">
                    <div class="flex items-center mr-6">
                      <input type="text" id="start-date" value="2026-01-01" class="date-input" />
                      <button class="calendar-btn">📅</button>
                    </div>
                    <span class="mx-6">-</span>
                    <div class="flex items-center">
                      <input type="text" id="end-date" value="2026-12-31" class="date-input" />
                      <button class="calendar-btn">📅</button>
                    </div>
                  </div>
                </div>

                <!-- Orientation Group Box -->
                <div class="group-box">
                  <div class="text-12 text-[#000000] mb-6">Orientation</div>
                  <div class="flex items-center gap-20">
                    <div class="flex items-center">
                      <input type="radio" id="portrait" name="orientation" checked />
                      <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
                    </div>
                    <div class="flex items-center">
                      <input type="radio" id="landscape" name="orientation" />
                      <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
                    </div>
                  </div>
                </div>

                <!-- Compact Option -->
                <div class="flex items-center mt-6">
                  <input type="checkbox" id="compact" />
                  <label for="compact" class="ml-6 text-12 text-[#000000]">Compact</label>
                </div>

                <!-- Information Icon -->
                <div class="flex justify-center">
                  <div class="info-icon">i</div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-center mt-10">
                  <button id="show-on-screen" class="btn mr-6-btn">Show on screen</button>
                  <button id="show-pdf" class="btn mr-6-btn">Show PDF</button>
                  <button id="show-txt" class="btn mr-6-btn">Show TXT</button>
                  <button id="cancel" class="btn">Cancel</button>
                </div>
              </div>
              
              <script>
                // Handle button clicks
                document.getElementById('show-on-screen').onclick = function() {
                  // Get values from the form
                  const startDate = document.getElementById('start-date').value;
                  const endDate = document.getElementById('end-date').value;
                  const orientation = document.querySelector('input[name="orientation"]:checked').id;
                  const compact = document.getElementById('compact').checked;
                  
                  // Open the balance report in a new window
                  const reportWindow = window.open(
                    '', 
                    '_blank', 
                    'width=1200,height=800,scrollbars=yes,resizable=yes'
                  );
                  
                  if (reportWindow) {
                    reportWindow.document.write("<!DOCTYPE html>\\n<html>\\n<head>\\n  <meta charset=\\\"utf-8\\\" />\\n  <title>Annual Balance Sheet Report</title>\\n  <style>\\n    body { \\n      margin: 0; \\n      padding: 0; \\n      font-family: Arial, Helvetica, sans-serif; \\n      font-size: 12px; \\n      color: #000000; \\n      background-color: #FFFFFF; \\n      line-height: 1.2;\\n      overflow: auto;\\n    }\\n    .header-area { \\n      display: flex; \\n      justify-content: space-between; \\n      align-items: flex-start; \\n      padding: 12px; \\n    }\\n    .left-header { text-align: left; }\\n    .center-title { \\n      position: absolute; \\n      left: 50%; \\n      transform: translateX(-50%); \\n      font-size: 24px; \\n      font-weight: bold; \\n    }\\n    .right-header { text-align: right; }\\n    .bold { font-weight: bold; }\\n    .text-12 { font-size: 12px; }\\n    .text-11 { font-size: 11px; }\\n    .text-13 { font-size: 13px; }\\n    .text-24 { font-size: 24px; }\\n    .mt-12 { margin-top: 12px; }\\n    .mt-6 { margin-top: 6px; }\\n    .text-center { text-align: center; }\\n    .text-right { text-align: right; }\\n    .text-left { text-align: left; }\\n    .table-container { padding: 0 12px 12px 12px; }\\n    table { \\n      width: 100%; \\n      border-collapse: collapse; \\n    }\\n    th { \\n      font-weight: normal; \\n      padding-bottom: 6px; \\n      text-align: left; \\n    }\\n    td { \\n      vertical-align: top; \\n    }\\n    .section-header { \\n      font-weight: bold; \\n      font-size: 13px; \\n      text-transform: uppercase; \\n      padding-top: 14px; \\n      padding-bottom: 6px;\\n    }\\n    .subsection { \\n      font-size: 12px; \\n      padding-left: 16px; \\n      padding-top: 6px; \\n      padding-bottom: 4px;\\n    }\\n    .account-row { \\n      padding-left: 32px; \\n    }\\n    .total-row { \\n      font-weight: bold; \\n      border-top: 1px solid #000000; \\n      padding-top: 6px; \\n    }\\n    .numeric-right { \\n      text-align: right; \\n    }\\n  </style>\\n</head>\\n<body>\\n  <!-- Header Area -->\\n  <div class=\\\"header-area\\\">\\n    <!-- Left Header Block -->\\n    <div class=\\\"left-header\\\">\\n      <div class=\\\"bold text-12\\\">Test Company</div>\\n      <div class=\\\"text-12\\\">Financial Year 2026-01-01 - 2026-12-31</div>\\n      <div class=\\\"text-12\\\">Period: 2026-01-01 - 2026-12-31</div>\\n    </div>\\n\\n    <!-- Center Title -->\\n    <div class=\\\"center-title\\\">\\n      Annual balance sheet report\\n    </div>\\n\\n    <!-- Right Header Block -->\\n    <div class=\\\"right-header\\\">\\n      <div class=\\\"text-11\\\">Printed 2026-01-19 08:23</div>\\n      <div class=\\\"text-11\\\">Latest version A 6 B 3 F 3 M 1</div>\\n    </div>\\n  </div>\\n\\n  <!-- Table Structure -->\\n  <div class=\\\"table-container\\\">\\n    <table>\\n      <thead>\\n        <tr>\\n          <th style=\\\"width: 70px;\\\">Account</th>\\n          <th style=\\\"width: 260px;\\\">Account name</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 120px;\\\">The balance</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 120px;\\\">Ing balance</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 120px;\\\">Period</th>\\n          <th class=\\\"text-right\\\" style=\\\"width: 140px;\\\">Outgoing balance</th>\\n        </tr>\\n      </thead>\\n      <tbody>\\n        <!-- ASSETS SECTION -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"section-header\\\">ASSETS</div>\\n          </td>\\n        </tr>\\n        \\n        <!-- Fixed Assets -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Fixed assets</div>\\n          </td>\\n        </tr>\\n        \\n        <!-- Intangible Fixed Assets -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Intangible fixed assets</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">1000</td>\\n          <td class=\\\"account-row text-12\\\">Motor Vehicle</td>\\n          <td class=\\\"text-right text-12\\\">100 998,00</td>\\n          <td class=\\\"text-right text-12\\\">100 998,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">100 998,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">1010</td>\\n          <td class=\\\"account-row text-12\\\">Office Equipment</td>\\n          <td class=\\\"text-right text-12\\\">25 500,00</td>\\n          <td class=\\\"text-right text-12\\\">25 500,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">25 500,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">Total intangible assets</td>\\n          <td class=\\\"text-right total-row text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">126 498,00</td>\\n        </tr>\\n        \\n        <!-- Tangible Fixed Assets -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Tangible fixed assets</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">1200</td>\\n          <td class=\\\"account-row text-12\\\">Buildings</td>\\n          <td class=\\\"text-right text-12\\\">500 000,00</td>\\n          <td class=\\\"text-right text-12\\\">500 000,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">500 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">Total tangible fixed assets</td>\\n          <td class=\\\"text-right total-row text-12\\\">500 000,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">500 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">TOTAL ASSETS</td>\\n          <td class=\\\"text-right total-row text-12\\\">626 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">626 498,00</td>\\n        </tr>\\n        \\n        <!-- EQUITY, PROVISIONS AND LIABILITIES SECTION -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"section-header\\\">EQUITY, PROVISIONS AND LIABILITIES</div>\\n          </td>\\n        </tr>\\n        \\n        <!-- Equity -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Equity</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">2000</td>\\n          <td class=\\\"account-row text-12\\\">Share Capital</td>\\n          <td class=\\\"text-right text-12\\\">400 000,00</td>\\n          <td class=\\\"text-right text-12\\\">400 000,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">400 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">2010</td>\\n          <td class=\\\"account-row text-12\\\">Retained Earnings</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">TOTAL EQUITY</td>\\n          <td class=\\\"text-right total-row text-12\\\">526 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">526 498,00</td>\\n        </tr>\\n        \\n        <!-- Provisions and Liabilities -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"subsection\\\">Provisions and liabilities</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">2400</td>\\n          <td class=\\\"account-row text-12\\\">Long-term Debt</td>\\n          <td class=\\\"text-right text-12\\\">100 000,00</td>\\n          <td class=\\\"text-right text-12\\\">100 000,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">100 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">TOTAL PROVISIONS AND LIABILITIES</td>\\n          <td class=\\\"text-right total-row text-12\\\">100 000,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">100 000,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">TOTAL EQUITY, PROVISIONS AND LIABILITIES</td>\\n          <td class=\\\"text-right total-row text-12\\\">626 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">626 498,00</td>\\n        </tr>\\n        \\n        <!-- CALCULATED RESULT SECTION -->\\n        <tr>\\n          <td colspan=\\\"6\\\">\\n            <div class=\\\"section-header\\\">CALCULATED RESULT</div>\\n          </td>\\n        </tr>\\n        \\n        <tr>\\n          <td class=\\\"account-row text-12\\\">3000</td>\\n          <td class=\\\"account-row text-12\\\">Net Profit</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right text-12\\\">0,00</td>\\n          <td class=\\\"text-right text-12\\\">126 498,00</td>\\n        </tr>\\n        \\n        <tr>\\n          <td colspan=\\\"4\\\" class=\\\"total-row\\\">CALCULATED RESULT</td>\\n          <td class=\\\"text-right total-row text-12\\\">126 498,00</td>\\n          <td class=\\\"text-right total-row text-12\\\">126 498,00</td>\\n        </tr>\\n      </tbody>\\n    </table>\\n  </div>\\n</body>\\n</html>");
                    
                    reportWindow.focus();
                  }
                  
                  // Close the parameter window
                  window.close();
                };
                
                document.getElementById('show-pdf').onclick = function() {
                  alert('PDF generation would happen here');
                };
                
                document.getElementById('show-txt').onclick = function() {
                  alert('TXT generation would happen here');
                };
                
                document.getElementById('cancel').onclick = function() {
                  window.close();
                };
                
                // Set focus to the start date field on load
                window.onload = function() {
                  document.getElementById('start-date').focus();
                };
              </script>
            </body>
            </html>
          `);
          
          newWindow.focus();
        }
      });
  };

  // Function to open Deleted Vouchers report in a new window
  const openDeletedVouchers = () => {
    // Dynamically import and execute the DeletedVouchersConfig
    import('./deleted-vouchers/DeletedVouchersConfig')
      .then(module => {
        // Execute the default export which should open the window
        if (module.default && typeof module.default === 'function') {
          module.default();
        } else {
          console.error('DeletedVouchersConfig does not export a callable function');
        }
      })
      .catch(err => {
        console.error('Error loading DeletedVouchersConfig:', err);
        
        // Fallback implementation in case dynamic import fails
        const newWindow = window.open(
          '', 
          '_blank', 
          'width=480,height=300,scrollbars=no,resizable=yes'
        );
        
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8" />
              <title>Deleted Vouchers Configuration</title>
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
                .mb-6 { margin-bottom: 6px; }
                .mr-6 { margin-right: 6px; }
                .mr-8 { margin-right: 8px; }
                .ml-6 { margin-left: 6px; }
                .ml-8 { margin-left: 8px; }
                .mt-12 { margin-top: 12px; }
                .gap-6 { gap: 6px; }
                .gap-8 { gap: 8px; }
                .gap-12 { gap: 12px; }
                .gap-20 { gap: 20px; }
                .w-12 { width: 12px; }
                .w-16 { width: 16px; }
                .w-90 { width: 90px; }
                .w-160 { width: 160px; }
                .w-440 { width: 440px; }
                .h-12 { height: 12px; }
                .h-16 { height: 16px; }
                .h-20 { height: 20px; }
                .h-24 { height: 24px; }
                .h-36 { height: 36px; }
                .h-54 { height: 54px; }
                .text-12 { font-size: 12px; }
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
                .pt-6 { padding-top: 6px; }
                .pl-10 { padding-left: 10px; }
                input[type="radio"], input[type="checkbox"] {
                  width: 12px;
                  height: 12px;
                }
                select {
                  width: 160px;
                  height: 20px;
                  border: 1px solid #000000;
                  background-color: #FFFFFF;
                  font-size: 12px;
                  font-family: Arial, Helvetica, sans-serif;
                }
                input[type="text"] {
                  width: 90px;
                  height: 18px;
                  border: 1px solid #000000;
                  background-color: #FFFFFF;
                  padding: 4px;
                  font-size: 12px;
                  font-family: Arial, Helvetica, sans-serif;
                }
                .calendar-btn {
                  width: 16px;
                  height: 16px;
                  background-color: #E6F0FA;
                  border: 1px solid #000000;
                  color: #000000;
                  margin-left: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                }
                .btn {
                  width: 90px;
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
                .mr-6-btn { margin-right: 6px; }
                .group-box {
                  width: 440px;
                  border: 1px solid #000000;
                  padding: 6px 10px 0 10px;
                  margin-bottom: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <!-- Series Selection Section -->
                <div class="mb-10">
                  <!-- All Series Radio -->
                  <div class="flex items-center mb-6">
                    <input type="radio" id="all-series" name="series" checked />
                    <label for="all-series" class="ml-6 text-12 text-[#000000]">All Series</label>
                    
                    <!-- Page Break Option -->
                    <div class="flex items-center ml-12">
                      <input type="checkbox" id="page-break" />
                      <label for="page-break" class="ml-6 text-12 text-[#000000]">Page break after each series</label>
                    </div>
                  </div>
                  
                  <!-- One Series Radio + Dropdown -->
                  <div class="flex items-center">
                    <input type="radio" id="one-series" name="series" />
                    <label for="one-series" class="ml-6 text-12 text-[#000000] mr-8">One Series</label>
                    <select id="series-dropdown">
                      <option value="A">A - Accounting</option>
                      <option value="B">B - Banking</option>
                      <option value="F">F - Financial</option>
                      <option value="M">M - Management</option>
                    </select>
                  </div>
                </div>

                <!-- Interval Group Box -->
                <div class="group-box">
                  <div class="text-12 text-[#000000] mb-6">Interval</div>
                  
                  <!-- All Radio -->
                  <div class="flex items-center mb-6">
                    <input type="radio" id="interval-all" name="interval" checked />
                    <label for="interval-all" class="ml-6 text-12 text-[#000000]">All</label>
                  </div>
                  
                  <!-- Date Range -->
                  <div class="flex items-center">
                    <input type="radio" id="interval-range" name="interval" />
                    <label for="interval-range" class="ml-6 text-12 text-[#000000] mr-6">Date</label>
                    
                    <div class="flex items-center mr-6">
                      <input type="text" id="start-date" value="2026-01-01" />
                      <button class="calendar-btn">📅</button>
                    </div>
                    <span class="mr-6">-</span>
                    <div class="flex items-center">
                      <input type="text" id="end-date" value="2026-12-31" />
                      <button class="calendar-btn">📅</button>
                    </div>
                  </div>
                </div>

                <!-- Orientation Group Box -->
                <div class="group-box">
                  <div class="text-12 text-[#000000] mb-6">Orientation</div>
                  <div class="flex items-center gap-20">
                    <div class="flex items-center">
                      <input type="radio" id="portrait" name="orientation" />
                      <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
                    </div>
                    <div class="flex items-center">
                      <input type="radio" id="landscape" name="orientation" checked />
                      <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex justify-center mt-12">
                  <button id="show-on-screen" class="btn mr-6-btn">Show on screen</button>
                  <button id="show-pdf" class="btn mr-6-btn">Show PDF</button>
                  <button id="show-txt" class="btn mr-6-btn">Show TXT</button>
                  <button id="cancel" class="btn">Cancel</button>
                </div>
              </div>
              
              <script>
                // Handle button clicks
                document.getElementById('show-on-screen').onclick = function() {
                  // Get values from the form
                  const allSeries = document.getElementById('all-series').checked;
                  const oneSeries = document.getElementById('one-series').checked;
                  const seriesValue = document.getElementById('series-dropdown').value;
                  const pageBreak = document.getElementById('page-break').checked;
                  const intervalAll = document.getElementById('interval-all').checked;
                  const intervalRange = document.getElementById('interval-range').checked;
                  const startDate = document.getElementById('start-date').value;
                  const endDate = document.getElementById('end-date').value;
                  const orientation = document.querySelector('input[name="orientation"]:checked').id;
                  
                  // Open the deleted vouchers report in a new window
                  const reportWindow = window.open(
                    '', 
                    '_blank', 
                    'width=1200,height=800,scrollbars=yes,resizable=yes'
                  );
                  
                  if (reportWindow) {
                    reportWindow.document.write("<!DOCTYPE html>\\\\n<html>\\\\n<head>\\\\n  <meta charset=\\\\\"utf-8\\\\\" />\\\\n  <title>Deleted Vouchers Report</title>\\\\n  <style>\\\\n    body { \\\\n      margin: 0; \\\\n      padding: 0; \\\\n      font-family: Arial, Helvetica, sans-serif; \\\\n      font-size: 12px; \\\\n      color: #000000; \\\\n      background-color: #FFFFFF; \\\\n      line-height: 1.2;\\\\n      overflow: auto;\\\\n    }\\\\n    .header-area { \\\\n      display: flex; \\\\n      justify-content: space-between; \\\\n      align-items: flex-start; \\\\n      padding: 12px; \\\\n    }\\\\n    .left-header { text-align: left; }\\\\n    .right-header { text-align: right; }\\\\n    .bold { font-weight: bold; }\\\\n    .text-12 { font-size: 12px; }\\\\n    .text-11 { font-size: 11px; }\\\\n    .mt-12 { margin-top: 12px; }\\\\n    .mt-10 { margin-top: 10px; }\\\\n    .text-right { text-align: right; }\\\\n    .text-left { text-align: left; }\\\\n    .table-container { padding: 0 12px 12px 12px; }\\\\n    table { \\\\n      width: 100%; \\\\n      border-collapse: collapse; \\\\n    }\\\\n    th { \\\\n      font-weight: normal; \\\\n      padding-bottom: 6px; \\\\n      text-align: left; \\\\n      border-bottom: 1px solid #000000;\\\\n    }\\\\n    td { \\\\n      vertical-align: top; \\\\n    }\\\\n    .voucher-header { \\\\n      font-weight: bold; \\\\n      font-size: 12px; \\\\n      padding-top: 10px;\\\\n    }\\\\n    .protection-section { \\\\n      font-size: 12px; \\\\n      font-weight: normal;\\\\n    }\\\\n    .numeric-right { \\\\n      text-align: right; \\\\n    }\\\\n  </style>\\\\n</head>\\\\n<body>\\\\n  <!-- Header Area -->\\\\n  <div class=\\\\\"header-area\\\\\">\\\\n    <!-- Left Header Block -->\\\\n    <div class=\\\\\"left-header\\\\\">\\\\n      <div class=\\\\\"bold text-12\\\\\">Test company</div>\\\\n      <div class=\\\\\"text-12\\\\\">Financial Year 2026-01-01 - 2026-12-31</div>\\\\n      <div class=\\\\\"text-12\\\\\">Period 2026-01-01 - 2026-12-31</div>\\\\n      <div class=\\\\\"text-12\\\\\">Deleted vouchers</div>\\\\n    </div>\\\\n\\\\n    <!-- Right Header Block -->\\\\n    <div class=\\\\\"right-header\\\\\">\\\\n      <div class=\\\\\"text-11\\\\\">Printed 2026-01-19 08:40</div>\\\\n      <div class=\\\\\"text-11\\\\\">Senaste vernr A 6 B 3 F 3 M 1</div>\\\\n    </div>\\\\n  </div>\\\\n\\\\n  <!-- Table Structure -->\\\\n  <div class=\\\\\"table-container\\\\\">\\\\n    <table>\\\\n      <thead>\\\\n        <tr>\\\\n          <th style=\\\\\"width: 70px;\\\\\">Account</th>\\\\n          <th style=\\\\\"width: 50px;\\\\\">Ks</th>\\\\n          <th style=\\\\\"width: 60px;\\\\\">Proj</th>\\\\n          <th style=\\\\\"width: auto;\\\\\">Text</th>\\\\n          <th style=\\\\\"width: 90px;\\\\\" class=\\\\\"text-right\\\\\">Debit</th>\\\\n          <th style=\\\\\"width: 90px;\\\\\" class=\\\\\"text-right\\\\\">Credit</th>\\\\n        </tr>\\\\n      </thead>\\\\n      <tbody>\\\\n        <!-- Voucher Group 1 -->\\\\n        <tr>\\\\n          <td colspan=\\\\\"6\\\\\" class=\\\\\"voucher-header\\\\\">\\\\n            F3 (1)    2026-01-01        adasd        2026-01-02 test test\\\\n          </td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td colspan=\\\\\"6\\\\\" class=\\\\\"protection-section\\\\\">\\\\n            Protection\\\\n                Booked\\\\n          </td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\"text-12\\\\\">1030</td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\">Patent</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">0,00</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">12,00</td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\"text-12\\\\\">1040</td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\">Software License</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">8,50</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">0,00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Voucher Group 2 -->\\\\n        <tr>\\\\n          <td colspan=\\\\\"6\\\\\" class=\\\\\"voucher-header\\\\\">\\\\n            A6 (15)    2026-02-15        Office Supplies        2026-02-16 Monthly purchase\\\\n          </td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td colspan=\\\\\"6\\\\\" class=\\\\\"protection-section\\\\\">\\\\n            Protection\\\\n                Booked\\\\n          </td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\"text-12\\\\\">5010</td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\">Printer Ink</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">3,25</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">0,00</td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\"text-12\\\\\">5020</td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\">Paper</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">1,75</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">0,00</td>\\\\n        </tr>\\\\n        <tr>\\\\n          <td class=\\\\\"text-12\\\\\">2610</td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\"></td>\\\\n          <td class=\\\\\"text-12\\\\\">Accounts Payable</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">0,00</td>\\\\n          <td class=\\\\\"text-right text-12\\\\\">5,00</td>\\\\n        </tr>\\\\n      </tbody>\\\\n    </table>\\\\n  </div>\\\\n</body>\\\\n</html>");
                    
                    reportWindow.focus();
                  }
                  
                  // Close the parameter window
                  window.close();
                };
                
                document.getElementById('show-pdf').onclick = function() {
                  alert('PDF generation would happen here');
                };
                
                document.getElementById('show-txt').onclick = function() {
                  alert('TXT generation would happen here');
                };
                
                document.getElementById('cancel').onclick = function() {
                  window.close();
                };
                
                // Set focus to the start date field on load
                window.onload = function() {
                  document.getElementById('start-date').focus();
                };
                
                // Enable/disable date fields based on interval selection
                document.getElementById('interval-all').addEventListener('change', function() {
                  document.getElementById('start-date').disabled = this.checked;
                  document.getElementById('end-date').disabled = this.checked;
                });
                
                document.getElementById('interval-range').addEventListener('change', function() {
                  document.getElementById('start-date').disabled = !this.checked;
                  document.getElementById('end-date').disabled = !this.checked;
                });
                
                // Enable/disable series dropdown based on selection
                document.getElementById('all-series').addEventListener('change', function() {
                  document.getElementById('series-dropdown').disabled = this.checked;
                });
                
                document.getElementById('one-series').addEventListener('change', function() {
                  document.getElementById('series-dropdown').disabled = !this.checked;
                });
              </script>
            </body>
            </html>
          `);
          
          newWindow.focus();
        }
      });
  };

  // Function to open General Ledger report in a new window
  const openGeneralLedger = () => {
    // Dynamically import and execute the GeneralLedgerConfig
    import('./general-ledger/GeneralLedgerConfig')
      .then(module => {
        // Execute the default export which should open the window
        if (module.default && typeof module.default === 'function') {
          module.default();
        } else {
          console.error('GeneralLedgerConfig does not export a callable function');
        }
      })
      .catch(err => {
        console.error('Error loading GeneralLedgerConfig:', err);
        
        // Fallback implementation in case dynamic import fails
        const newWindow = window.open(
          '', 
          '_blank', 
          'width=420,height=240,scrollbars=no,resizable=yes'
        );
        
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8" />
              <title>General Ledger Configuration</title>
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
                .mr-6 { margin-right: 6px; }
                .mr-8 { margin-right: 8px; }
                .ml-6 { margin-left: 6px; }
                .mt-10 { margin-top: 10px; }
                .gap-6 { gap: 6px; }
                .gap-20 { gap: 20px; }
                .w-60 { width: 60px; }
                .w-70 { width: 70px; }
                .w-90 { width: 90px; }
                .w-16 { width: 16px; }
                .w-380 { width: 380px; }
                .h-20 { height: 20px; }
                .h-16 { height: 16px; }
                .h-24 { height: 24px; }
                .h-42 { height: 42px; }
                .text-12 { font-size: 12px; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-[#000000] { color: #000000; }
                .border { border: 1px solid #000000; }
                .bg-white { background-color: #FFFFFF; }
                .bg-[#FFF2CC] { background-color: #FFF2CC; }
                .bg-[#E6F0FA] { background-color: #E6F0FA; }
                .bg-[#DFF0D8] { background-color: #DFF0D8; }
                .border-[#6AA84F] { border-color: #6AA84F; }
                .rounded-2px { border-radius: 2px; }
                .px-4 { padding-left: 4px; padding-right: 4px; }
                .py-2 { padding-top: 2px; padding-bottom: 2px; }
                .pl-10 { padding-left: 10px; }
                .pt-8 { padding-top: 8px; }
                input[type="text"] {
                  height: 20px;
                  border: 1px solid #000000;
                  background-color: #FFFFFF;
                  padding: 2px 4px;
                  font-size: 12px;
                  font-family: Arial, Helvetica, sans-serif;
                }
                .from-account-input {
                  width: 70px;
                }
                .to-account-input {
                  width: 70px;
                }
                .from-date-input {
                  width: 90px;
                }
                .to-date-input {
                  width: 90px;
                }
                .lookup-btn {
                  width: 16px;
                  height: 16px;
                  background-color: #FFF2CC;
                  border: 1px solid #000000;
                  color: #000000;
                  margin-left: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                }
                .calendar-btn {
                  width: 16px;
                  height: 16px;
                  background-color: #E6F0FA;
                  border: 1px solid #000000;
                  color: #000000;
                  margin-left: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                }
                .btn {
                  width: 90px;
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
                .mr-6-btn { margin-right: 6px; }
                .group-box {
                  width: 380px;
                  border: 1px solid #000000;
                  padding: 8px 0 0 10px;
                  margin-bottom: 10px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <!-- Account Interval Section -->
                <div class="flex items-center mb-10">
                  <label class="w-60 text-12 text-[#000000]">Account</label>
                  <div class="flex items-center">
                    <input type="text" id="from-account" value="100" class="from-account-input" />
                    <button class="lookup-btn">🔍</button>
                    <span class="mx-6">-</span>
                    <input type="text" id="to-account" value="8999" class="to-account-input" />
                    <button class="lookup-btn">🔍</button>
                  </div>
                </div>

                <!-- Date Interval Section -->
                <div class="flex items-center mb-10">
                  <label class="w-60 text-12 text-[#000000]">Date</label>
                  <div class="flex items-center">
                    <input type="text" id="from-date" value="2026-01-01" class="from-date-input" />
                    <button class="calendar-btn">📅</button>
                    <span class="mx-6">-</span>
                    <input type="text" id="to-date" value="2026-12-31" class="to-date-input" />
                    <button class="calendar-btn">📅</button>
                  </div>
                </div>

                <!-- Show Group Box -->
                <div class="group-box">
                  <div class="text-12 text-[#000000] mb-8">Show</div>
                  <div class="flex items-center">
                    <input type="checkbox" id="show-crossed-out" />
                    <label for="show-crossed-out" class="ml-6 text-12 text-[#000000]">Show crossed out lines</label>
                  </div>
                </div>

                <!-- Orientation Group Box -->
                <div class="group-box">
                  <div class="text-12 text-[#000000] mb-8">Orientation</div>
                  <div class="flex items-center gap-20">
                    <div class="flex items-center">
                      <input type="radio" id="portrait" name="orientation" checked />
                      <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
                    </div>
                    <div class="flex items-center">
                      <input type="radio" id="landscape" name="orientation" />
                      <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="mt-10">
                  <button id="show-on-screen" class="btn mr-6-btn">Show on screen</button>
                  <button id="show-pdf" class="btn mr-6-btn">Show PDF</button>
                  <button id="show-txt" class="btn mr-6-btn">Show TXT</button>
                  <button id="cancel" class="btn">Cancel</button>
                </div>
              </div>
              
              <script>
                // Handle button clicks
                document.getElementById('show-on-screen').onclick = function() {
                  // Get values from the form
                  const fromAccount = document.getElementById('from-account').value;
                  const toAccount = document.getElementById('to-account').value;
                  const fromDate = document.getElementById('from-date').value;
                  const toDate = document.getElementById('to-date').value;
                  const showCrossedOut = document.getElementById('show-crossed-out').checked;
                  const orientation = document.querySelector('input[name="orientation"]:checked').id;
                  
                  // Open the general ledger report in a new window
                  const reportWindow = window.open(
                    '', 
                    '_blank', 
                    'width=1200,height=800,scrollbars=yes,resizable=yes'
                  );
                  
                  if (reportWindow) {
                    reportWindow.document.write("<!DOCTYPE html>\\\\n<html>\\\\n<head>\\\\n  <meta charset=\\\\\"utf-8\\\\\" />\\\\n  <title>General Ledger Report</title>\\\\n  <style>\\\\n    body { \\\\\\n      margin: 0; \\\\\\n      padding: 0; \\\\\\n      font-family: Arial, Helvetica, sans-serif; \\\\\\n      font-size: 12px; \\\\\\n      color: #000000; \\\\\\n      background-color: #FFFFFF; \\\\\\n      line-height: 1.2;\\\\n      overflow: auto;\\\\n    }\\\\n    .header-area { \\\\\\n      display: flex; \\\\\\n      justify-content: space-between; \\\\\\n      align-items: flex-start; \\\\\\n      padding: 12px; \\\\\\n    }\\\\n    .left-header { text-align: left; }\\\\n    .right-header { text-align: right; }\\\\n    .bold { font-weight: bold; }\\\\n    .text-12 { font-size: 12px; }\\\\n    .text-11 { font-size: 11px; }\\\\n    .mt-12 { margin-top: 12px; }\\\\n    .text-right { text-align: right; }\\\\n    .text-left { text-align: left; }\\\\n    .table-container { padding: 0 12px 12px 12px; }\\\\n    table { \\\\\\n      width: 100%; \\\\\\n      border-collapse: collapse; \\\\\\n    }\\\\n    th { \\\\\\n      font-weight: normal; \\\\\\n      padding-bottom: 6px; \\\\\\n      text-align: left; \\\\\\n      border-bottom: 1px solid #000000;\\\\n    }\\\\n    td { \\\\\\n      vertical-align: top; \\\\\\n    }\\\\n    .account-header { \\\\\\n      font-weight: bold; \\\\\\n      font-size: 12px; \\\\\\n      padding-top: 10px;\\\\n    }\\\\n    .numeric-right { \\\\\\n      text-align: right; \\\\\\n    }\\\\n  </style>\\\\n</head>\\\\n<body>\\\\n  <!-- Header Area -->\\\\n  <div class=\\\\\"header-area\\\\\">\\\\n    <!-- Left Header Block -->\\\\n    <div class=\\\\\"left-header\\\\\">\\\\n      <div class=\\\\\"bold text-12\\\\\">Test company</div>\\\\n      <div class=\\\\\"text-12\\\\\">Financial Year 2026-01-01 - 2026-12-31</div>\\\\n      <div class=\\\\\"text-12\\\\\">Period 2026-01-01 - 2026-12-31</div>\\\\n      <div class=\\\\\"text-12\\\\\">Ledger</div>\\\\n    </div>\\\\n\\\\n    <!-- Right Header Block -->\\\\n    <div class=\\\\\"right-header\\\\\">\\\\n      <div class=\\\\\"text-11\\\\\">Printed 2026-01-19 08:48</div>\\\\n      <div class=\\\\\"text-11\\\\\">Latest version A 6 B 3 F 3 M 1</div>\\\\n    </div>\\\\n  </div>\\\\n\\\\n  <!-- Table Structure -->\\\\n  <div class=\\\\\"table-container\\\\\">\\\\n    <table>\\\\n      <thead>\\\\n        <tr>\\\\n          <th style=\\\\\"width: 80px;\\\\\">Account</th>\\\\n          <th style=\\\\\"width: 200px;\\\\\">Name</th>\\\\n          <th style=\\\\\"width: 60px;\\\\\">Vernr</th>\\\\n          <th style=\\\\\"width: 50px;\\\\\">Ks</th>\\\\n          <th style=\\\\\"width: 90px;\\\\\">Date</th>\\\\n          <th style=\\\\\"width: auto;\\\\\">Text</th>\\\\n          <th style=\\\\\"width: 100px;\\\\\" class=\\\\\"text-right\\\\\">Debit</th>\\\\n          <th style=\\\\\"width: 100px;\\\\\" class=\\\\\"text-right\\\\\">Credit</th>\\\\n          <th style=\\\\\"width: 110px;\\\\\" class=\\\\\"text-right\\\\\">Balance</th>\\\\n        </tr>\\\\n      </thead>\\\\n      <tbody>\\\\n        <!-- Account Group 1 -->\\\\n        <tr>\\\\n          <td colspan=\\\\\"9\\\\\" class=\\\\\"account-header\\\\\">\\\\n            450    Cash 450\\\\n          </td>\\\\n        </tr>\\\\n        \\\\n        <!-- Opening Balance -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Opening balance</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Transaction Rows -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>A 4</td>\\\\n          <td></td>\\\\n          <td>2026-01-01</td>\\\\n          <td>Cash n car 450 451 desc</td>\\\\n          <td class=\\\\\"text-right\\\\\">1.00</td>\\\\n          <td class=\\\\\"text-right\\\\\"></td>\\\\n          <td class=\\\\\"text-right\\\\\">1.00</td>\\\\n        </tr>\\\\n        \\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>A 5</td>\\\\n          <td></td>\\\\n          <td>2026-01-02</td>\\\\n          <td>Bank transfer</td>\\\\n          <td class=\\\\\"text-right\\\\\"></td>\\\\n          <td class=\\\\\"text-right\\\\\">0.50</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.50</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Enclosure Row -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Enclosure</td>\\\\n          <td class=\\\\\"text-right\\\\\">1.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.50</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.50</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Closing Balance -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Closing balance</td>\\\\n          <td class=\\\\\"text-right\\\\\">1.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.50</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.50</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Account Group 2 -->\\\\n        <tr>\\\\n          <td colspan=\\\\\"9\\\\\" class=\\\\\"account-header\\\\\">\\\\n            1030    Patent\\\\n          </td>\\\\n        </tr>\\\\n        \\\\n        <!-- Opening Balance -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Opening balance</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">12,000.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Transaction Rows -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>F 3</td>\\\\n          <td></td>\\\\n          <td>2026-01-15</td>\\\\n          <td>Patent registration fee</td>\\\\n          <td class=\\\\\"text-right\\\\\">12,000.00</td>\\\\n          <td class=\\\\\"text-right\\\\\"></td>\\\\n          <td class=\\\\\"text-right\\\\\">24,000.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Enclosure Row -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Enclosure</td>\\\\n          <td class=\\\\\"text-right\\\\\">12,000.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">12,000.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- Closing Balance -->\\\\n        <tr>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td></td>\\\\n          <td>Closing balance</td>\\\\n          <td class=\\\\\"text-right\\\\\">12,000.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">0.00</td>\\\\n          <td class=\\\\\"text-right\\\\\">24,000.00</td>\\\\n        </tr>\\\\n        \\\\n        <!-- General Ledger Total -->\\\\n        <tr>\\\\n          <td colspan=\\\\\"6\\\\\" class=\\\\\"bold text-12\\\\\">General ledger total</td>\\\\n          <td class=\\\\\"text-right bold text-12\\\\\">25,299.00</td>\\\\n          <td class=\\\\\"text-right bold text-12\\\\\">25,299.00</td>\\\\n          <td></td>\\\\n        </tr>\\\\n      </tbody>\\\\n    </table>\\\\n  </div>\\\\n</body>\\\\n</html>");
                    
                    reportWindow.focus();
                  }
                  
                  // Close the parameter window
                  window.close();
                };
                
                document.getElementById('show-pdf').onclick = function() {
                  alert('PDF generation would happen here');
                };
                
                document.getElementById('show-txt').onclick = function() {
                  alert('TXT generation would happen here');
                };
                
                document.getElementById('cancel').onclick = function() {
                  window.close();
                };
                
                // Set focus to the from account field on load
                window.onload = function() {
                  document.getElementById('from-account').focus();
                };
              </script>
            </body>
            </html>
          `);
          
          newWindow.focus();
        }
      });
  };

  // Function to open Account Analysis report in a new window
  const openAccountAnalysis = () => {
    // Dynamically import and execute the AccountAnalysisConfig
    import('./account-analysis/AccountAnalysisConfig')
      .then(module => {
        // Execute the default export which should open the window
        if (module.default && typeof module.default === 'function') {
          module.default();
        } else {
          console.error('AccountAnalysisConfig does not export a callable function');
        }
      })
      .catch(err => {
        console.error('Error loading AccountAnalysisConfig:', err);
        
        // Fallback implementation in case dynamic import fails
        const newWindow = window.open(
          '', 
          '_blank', 
          'width=460,height=320,scrollbars=no,resizable=yes'
        );
        
        if (newWindow) {
          newWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8" />
              <title>Account Analysis Report Configuration</title>
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
                  padding: 10px 12px 12px 12px;
                }
                .flex { display: flex; }
                .items-center { align-items: center; }
                .justify-center { justify-content: center; }
                .mb-10 { margin-bottom: 10px; }
                .mb-12 { margin-bottom: 12px; }
                .mr-8 { margin-right: 8px; }
                .mr-6 { margin-right: 6px; }
                .mx-6 { margin-left: 6px; margin-right: 6px; }
                .ml-4 { margin-left: 4px; }
                .w-60 { width: 60px; }
                .w-90 { width: 90px; }
                .w-14 { width: 14px; }
                .w-16 { width: 16px; }
                .h-18 { height: 18px; }
                .h-14 { height: 14px; }
                .h-16 { height: 16px; }
                .h-24 { height: 24px; }
                .h-36 { height: 36px; }
                .h-54 { height: 54px; }
                .w-420 { width: 420px; }
                .text-12 { font-size: 12px; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-[#000000] { color: #000000; }
                .border { border: 1px solid #000000; }
                .bg-white { background-color: #FFFFFF; }
                .bg-[#FFEB3B] { background-color: #FFEB3B; }
                .bg-[#E6F0FA] { background-color: #E6F0FA; }
                .bg-[#DFF0D8] { background-color: #DFF0D8; }
                .border-[#6AA84F] { border-color: #6AA84F; }
                .rounded-2px { border-radius: 2px; }
                .px-4 { padding-left: 4px; padding-right: 4px; }
                .py-2 { padding-top: 2px; padding-bottom: 2px; }
                .px-12 { padding-left: 12px; padding-right: 12px; }
                .pt-6 { padding-top: 6px; }
                .pl-10 { padding-left: 10px; }
                .gap-20 { gap: 20px; }
                .gap-6 { gap: 6px; }
                .gap-12 { gap: 12px; }
                input[type="text"] {
                  width: 60px;
                  height: 18px;
                  border: 1px solid #000000;
                  background-color: #FFFFFF;
                  padding: 2px 4px;
                  font-size: 12px;
                  font-family: Arial, Helvetica, sans-serif;
                }
                .date-input {
                  width: 90px;
                  height: 18px;
                  border: 1px solid #000000;
                  background-color: #FFFFFF;
                  padding: 4px;
                  font-size: 12px;
                  font-family: Arial, Helvetica, sans-serif;
                }
                .lookup-btn {
                  width: 14px;
                  height: 14px;
                  background-color: #FFEB3B;
                  border: 1px solid #000000;
                  color: #000000;
                  margin-left: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                }
                .calendar-btn {
                  width: 16px;
                  height: 16px;
                  background-color: #E6F0FA;
                  border: 1px solid #000000;
                  color: #000000;
                  margin-left: 4px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 8px;
                }
                .btn {
                  width: 90px;
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
                .mr-6-btn { margin-right: 6px; }
                .group-box {
                  width: 420px;
                  border: 1px solid #000000;
                  padding: 6px 10px 0 10px;
                  margin-bottom: 10px;
                }
                .sub-group-box {
                  width: 420px;
                  border: 1px solid #000000;
                  padding: 6px 10px 0 10px;
                  margin-bottom: 12px;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <!-- Account Field -->
                <div class="flex items-center mb-10">
                  <label class="mr-8 text-12 text-[#000000]">Account</label>
                  <div class="flex items-center">
                    <input type="text" id="account" value="" placeholder="" class="w-60 h-18 border bg-white px-4 py-2 text-12" />
                    <button class="lookup-btn" onclick="document.getElementById('account').focus()">?</button>
                  </div>
                </div>

                <!-- Date Range Section -->
                <div class="flex items-center mb-10">
                  <label class="mr-8 text-12 text-[#000000]">Date</label>
                  <div class="flex items-center">
                    <div class="flex items-center mr-6">
                      <input type="text" id="start-date" value="2026-01-01" class="date-input" />
                      <button class="calendar-btn">📅</button>
                    </div>
                    <span class="mx-6">-</span>
                    <div class="flex items-center">
                      <input type="text" id="end-date" value="2026-12-31" class="date-input" />
                      <button class="calendar-btn">📅</button>
                    </div>
                  </div>
                </div>

                <!-- Orientation Group Box -->
                <div class="group-box">
                  <div class="text-12 text-[#000000] mb-6">Orientation</div>
                  <div class="flex items-center gap-20">
                    <div class="flex items-center">
                      <input type="radio" id="portrait" name="orientation" />
                      <label for="portrait" class="ml-6 text-12 text-[#000000]">Portrait</label>
                    </div>
                    <div class="flex items-center">
                      <input type="radio" id="landscape" name="orientation" checked />
                      <label for="landscape" class="ml-6 text-12 text-[#000000]">Landscape</label>
                    </div>
                  </div>
                </div>

                <!-- Balanced Transactions Group Box -->
                <div class="sub-group-box">
                  <div class="text-12 text-[#000000] mb-6">Balanced transactions</div>
                  <div class="flex flex-col">
                    <div class="flex items-center mb-6">
                      <input type="checkbox" id="balanced" />
                      <label for="balanced" class="ml-6 text-12 text-[#000000]">Balanced transactions</label>
                    </div>
                    <div class="flex items-center">
                      <input type="checkbox" id="non-balanced" />
                      <label for="non-balanced" class="ml-6 text-12 text-[#000000]">Non-balanced transactions</label>
                    </div>
                  </div>
                </div>

                <!-- Show Group Box -->
                <div class="sub-group-box">
                  <div class="text-12 text-[#000000] mb-6">Show</div>
                  <div class="flex items-center">
                    <input type="checkbox" id="show-checked" />
                    <label for="show-checked" class="ml-6 text-12 text-[#000000]">Visa strukna rader</label>
                  </div>
                </div>

                <!-- Action Buttons Row -->
                <div class="flex justify-center">
                  <button id="show-on-screen" class="btn mr-6-btn">Show on screen</button>
                  <button id="show-pdf" class="btn mr-6-btn">Show PDF</button>
                  <button id="show-txt" class="btn mr-6-btn">Show TXT</button>
                  <button id="cancel" class="btn">Cancel</button>
                </div>
              </div>
              
              <script>
                // Handle button clicks
                document.getElementById('show-on-screen').onclick = function() {
                  // Get values from the form
                  const account = document.getElementById('account').value;
                  const startDate = document.getElementById('start-date').value;
                  const endDate = document.getElementById('end-date').value;
                  
                  // Open the account analysis report in a new window
                  const reportWindow = window.open(
                    '', 
                    '_blank', 
                    'width=1100,height=700,scrollbars=yes,resizable=yes'
                  );
                  
                  if (reportWindow) {
                    reportWindow.document.write("<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"utf-8\" />\n  <title>Account Analysis Report</title>\n  <style>\n    body { \n      margin: 0; \n      padding: 0; \n      font-family: Arial, Helvetica, sans-serif; \n      font-size: 12px; \n      color: #000000; \n      background-color: #FFFFFF; \n      line-height: 1.2;\n      overflow: auto;\n    }\n    .header-area { \n      display: flex; \n      justify-content: space-between; \n      align-items: flex-start; \n      padding: 12px; \n    }\n    .left-header { text-align: left; }\n    .center-title { \n      position: absolute; \n      left: 50%; \n      transform: translateX(-50%); \n      top: 10px; \n      font-size: 32px; \n      font-weight: normal; \n    }\n    .center-subtitle { \n      position: absolute; \n      left: 50%; \n      transform: translateX(-50%); \n      top: 50px; \n      font-size: 14px; \n      font-weight: normal; \n      text-align: center;\n      margin-top: 6px;\n    }\n    .right-header { text-align: right; }\n    .bold { font-weight: bold; }\n    .text-13 { font-size: 13px; }\n    .text-12 { font-size: 12px; }\n    .text-11 { font-size: 11px; }\n    .text-14 { font-size: 14px; }\n    .text-32 { font-size: 32px; }\n    .mt-12 { margin-top: 12px; }\n    .mt-6 { margin-top: 6px; }\n    .ml-12 { margin-left: 12px; }\n    .mr-12 { margin-right: 12px; }\n    .text-center { text-align: center; }\n    .text-right { text-align: right; }\n    .text-left { text-align: left; }\n    .table-container { padding: 0 12px 12px 12px; }\n    table { \n      width: 100%; \n      border-collapse: collapse; \n    }\n    th { \n      font-weight: normal; \n      padding-bottom: 6px; \n      text-align: left; \n      border-bottom: 1px solid #000000;\n    }\n    td { \n      vertical-align: top; \n    }\n    .account-header { \n      font-weight: bold; \n      padding-top: 6px; \n      font-size: 12px;\n    }\n    .opening-balance { \n      font-size: 12px; \n    }\n    .separator-line { \n      height: 1px; \n      background-color: #000000; \n      margin: 6px 0;\n    }\n    .enclosure-row { \n      font-size: 12px; \n    }\n    .closing-balance { \n      font-size: 12px; \n    }\n    .account-total { \n      font-weight: bold; \n      border-top: 1px solid #000000; \n      padding-top: 6px; \n      font-size: 12px;\n    }\n    .numeric-right { \n      text-align: right; \n    }\n  </style>\n</head>\n<body>\n  <!-- Header Area -->\n  <div class=\"header-area\">\n    <!-- Left Header Block -->\n    <div class=\"left-header\">\n      <div class=\"bold text-13\">Test company</div>\n      <div class=\"text-12\">Financial Year 2026-01-01 - 2026-12-31</div>\n      <div class=\"text-12\">Period 2026-01-01 - 2026-12-31</div>\n    </div>\n\n    <!-- Center Title Block -->\n    <div class=\"center-title\">\n      Account<br>analysis\n    </div>\n    <div class=\"center-subtitle\">\n      1000 - Motor Vehicle\n    </div>\n\n    <!-- Right Header Block -->\n    <div class=\"right-header\">\n      <div class=\"text-11\">Printed 2026-01-18 10:09</div>\n      <div class=\"text-11\">Latest version A 6 B 3 F 3 M 1</div>\n    </div>\n  </div>\n\n  <!-- Table Structure -->\n  <div class=\"table-container\">\n    <table>\n      <thead>\n        <tr>\n          <th style=\"width: 80px;\">Account</th>\n          <th style=\"width: 160px;\">Name</th>\n          <th style=\"width: 90px;\">Date</th>\n          <th>Text</th>\n          <th class=\"text-right\" style=\"width: 90px;\">Debit</th>\n          <th class=\"text-right\" style=\"width: 90px;\">Credit</th>\n          <th class=\"text-right\" style=\"width: 110px;\">Balance</th>\n        </tr>\n      </thead>\n      <tbody>\n        <!-- Account Section -->\n        <tr>\n          <td colspan=\"7\">\n            <div class=\"account-header\">1000 Motor Vehicle</div>\n          </td>\n        </tr>\n        \n        <!-- Opening Balance Rows -->\n        <tr>\n          <td class=\"text-12\">1000</td>\n          <td class=\"text-12\">Motor Vehicle</td>\n          <td class=\"text-12\">2026-01-01</td>\n          <td class=\"text-12\">Opening balance</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">50,000.00</td>\n        </tr>\n        <tr>\n          <td class=\"text-12\">1000</td>\n          <td class=\"text-12\">Motor Vehicle</td>\n          <td class=\"text-12\">2026-01-01</td>\n          <td class=\"text-12\">Opening balance</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">50,000.00</td>\n        </tr>\n        \n        <!-- Separator Line -->\n        <tr>\n          <td colspan=\"7\">\n            <div class=\"separator-line\"></div>\n          </td>\n        </tr>\n        \n        <!-- Transaction Rows -->\n        <tr>\n          <td class=\"text-12\">1000</td>\n          <td class=\"text-12\">Motor Vehicle</td>\n          <td class=\"text-12\">2026-03-15</td>\n          <td class=\"text-12\">Purchase of vehicle</td>\n          <td class=\"text-right text-12\">10,000.00</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">60,000.00</td>\n        </tr>\n        <tr>\n          <td class=\"text-12\">1000</td>\n          <td class=\"text-12\">Motor Vehicle</td>\n          <td class=\"text-12\">2026-06-20</td>\n          <td class=\"text-12\">Maintenance</td>\n          <td class=\"text-right text-12\">2,500.00</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">62,500.00</td>\n        </tr>\n        \n        <!-- Closing Section -->\n        <tr>\n          <td class=\"text-12\">1000</td>\n          <td class=\"text-12\">Motor Vehicle</td>\n          <td class=\"text-12\">2026-12-31</td>\n          <td class=\"text-12\">Enclosure</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">0.00</td>\n        </tr>\n        <tr>\n          <td class=\"text-12\">1000</td>\n          <td class=\"text-12\">Motor Vehicle</td>\n          <td class=\"text-12\">2026-12-31</td>\n          <td class=\"text-12\">Closing balance</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">0.00</td>\n          <td class=\"text-right text-12\">62,500.00</td>\n        </tr>\n        \n        <!-- Totals Section -->\n        <tr>\n          <td class=\"account-total\" colspan=\"4\">Account total</td>\n          <td class=\"text-right account-total text-12\">12,500.00</td>\n          <td class=\"text-right account-total text-12\">0.00</td>\n          <td class=\"text-right account-total text-12\">62,500.00</td>\n        </tr>\n      </tbody>\n    </table>\n  </div>\n</body>\n</html>");
                    
                    reportWindow.focus();
                  }
                  
                  // Close the parameter window
                  window.close();
                };
                
                document.getElementById('show-pdf').onclick = function() {
                  alert('PDF generation would happen here');
                };
                
                document.getElementById('show-txt').onclick = function() {
                  alert('TXT generation would happen here');
                };
                
                document.getElementById('cancel').onclick = function() {
                  window.close();
                };
                
                // Set focus to the account field on load
                window.onload = function() {
                  document.getElementById('account').focus();
                };
              </script>
            </body>
            </html>
          `);
          
          newWindow.focus();
        }
      });
  };

  // Function to open 12-month Performance Report in a new window
  const openTwelveMonthPerformanceReport = () => {
    const newWindow = window.open(
      '', 
      '_blank', 
      'width=420,height=260,scrollbars=no,resizable=yes'
    );
    
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>12-month Performance Report</title>
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
          </style>
        </head>
        <body>
          <div id="container" style="
            width: 420px; 
            height: 260px; 
            background-color: #FFFFFF; 
            overflow: hidden; 
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 12px; 
            color: #000000;
          ">
            <!-- Top Section - "Show Chart" Checkbox -->
            <div style="
              margin-top: 12px; 
              margin-left: 12px; 
              display: flex; 
              align-items: center;
            ">
              <input 
                type="checkbox" 
                id="showChart" 
                style="
                  width: 12px; 
                  height: 12px; 
                  border: 1px solid #000000; 
                  background-color: #FFFFFF;
                " 
              /> 
              <label 
                for="showChart" 
                style="
                  margin-left: 6px; 
                  font-size: 12px; 
                  color: #000000;
                "
              >
                Show Chart
              </label>
            </div>
            
            <!-- Orientation Section -->
            <div style="
              margin-left: 12px; 
              margin-top: 10px;
            ">
              <div style="
                font-size: 12px; 
                color: #000000; 
                margin-bottom: 6px;
              ">
                Orientation
              </div>
              
              <div style="
                width: 380px; 
                height: 36px; 
                border: 1px solid #000000; 
                border-radius: 0px; 
                padding: 6px 10px; 
                display: flex; 
                align-items: center;
              ">
                <div style="
                  display: flex; 
                  align-items: center; 
                  margin-right: 20px;
                ">
                  <input 
                    type="radio" 
                    id="portrait" 
                    name="orientation" 
                    style="
                      width: 12px; 
                      height: 12px; 
                      border: 1px solid #000000; 
                      background-color: #FFFFFF;
                    " 
                  /> 
                  <label 
                    for="portrait" 
                    style="
                      margin-left: 6px; 
                      font-size: 12px; 
                      color: #000000;
                    "
                  >
                    Portrait
                  </label>
                </div>
                
                <div style="
                  display: flex; 
                  align-items: center;
                ">
                  <input 
                    type="radio" 
                    id="landscape" 
                    name="orientation" 
                    checked 
                    style="
                      width: 12px; 
                      height: 12px; 
                      border: 1px solid #000000; 
                      background-color: #FFFFFF;
                    " 
                  /> 
                  <label 
                    for="landscape" 
                    style="
                      margin-left: 6px; 
                      font-size: 12px; 
                      color: #000000;
                    "
                  >
                    Landscape
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Info icon -->
            <div style="
              display: flex; 
              justify-content: center; 
              margin-top: 6px;
            ">
              <div style="
                width: 14px; 
                height: 14px; 
                border-radius: 50%; 
                background-color: #E6F0FA; 
                border: 1px solid #7AA7D9; 
                display: flex; 
                align-items: center; 
                justify-content: center;
              ">
                <span style="
                  font-size: 10px; 
                  color: #2B6CB0; 
                  font-weight: bold;
                ">i</span>
              </div>
            </div>
            
            <!-- Action buttons -->
            <div style="
              margin-left: 12px; 
              margin-top: 8px;
            ">
              <div style="
                display: flex;
              ">
                <button 
                  onclick="window.opener && window.opener.openTwelveMonthPerformanceReport && window.opener.openTwelveMonthPerformanceReport(); window.close();"
                  style="
                    width: 90px; 
                    height: 24px; 
                    background-color: #DFF0D8; 
                    border: 1px solid #6AA84F; 
                    border-radius: 2px; 
                    font-size: 12px; 
                    color: #000000; 
                    margin-right: 6px; 
                    cursor: pointer;
                  "
                >
                  Show on screen
                </button>
                <button 
                  onclick="alert('PDF generation would happen here')"
                  style="
                    width: 90px; 
                    height: 24px; 
                    background-color: #DFF0D8; 
                    border: 1px solid #6AA84F; 
                    border-radius: 2px; 
                    font-size: 12px; 
                    color: #000000; 
                    margin-right: 6px; 
                    cursor: pointer;
                  "
                >
                  Show PDF
                </button>
                <button 
                  onclick="alert('TXT generation would happen here')"
                  style="
                    width: 90px; 
                    height: 24px; 
                    background-color: #DFF0D8; 
                    border: 1px solid #6AA84F; 
                    border-radius: 2px; 
                    font-size: 12px; 
                    color: #000000; 
                    margin-right: 6px; 
                    cursor: pointer;
                  "
                >
                  Show TXT
                </button>
                <button 
                  onclick="window.close()"
                  style="
                    width: 90px; 
                    height: 24px; 
                    background-color: #DFF0D8; 
                    border: 1px solid #6AA84F; 
                    border-radius: 2px; 
                    font-size: 12px; 
                    color: #000000; 
                    cursor: pointer;
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </body>
        </html>
      `);
      
      newWindow.focus();
    }
  };

  // Function to open Liquidity Report in a new window
  const openLiquidityReport = () => {
    // Dynamically import and execute the LiquidityReportConfig
    import('./liquidity-report/LiquidityReportConfig')
      .then(module => {
        // Execute the openLiquidityReportConfig function
        if (module.openLiquidityReportConfig && typeof module.openLiquidityReportConfig === 'function') {
          module.openLiquidityReportConfig();
        } else {
          console.error('LiquidityReportConfig does not export openLiquidityReportConfig function');
        }
      })
      .catch(err => {
        console.error('Error loading LiquidityReportConfig:', err);
      });
  };

  // Get favorite reports
  const favoriteReports = [
    { id: 'balance-report', title: 'Balance report', subtitle: 'Accounting', section: 'Accounting' },
    { id: 'performance-report', title: 'Performance report', subtitle: 'Accounting', section: 'Accounting' },
    // Add other favorites here as they are marked
  ].filter(report => favorites[report.id]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const AccountingReports = () => (
    <div className="mb-8">
      <h3 className="text-[15px] font-semibold text-[#065F46] mb-2">Accounting</h3>
      <div className="space-y-1">
        {[
          { id: '12-month-performance', title: '12-month Performance report', isSpecial: true },
          { id: 'account-analysis', title: 'Account analysis', isSpecial: true },
          { id: 'balance-report', title: 'Balance report', isSpecial: true },
          { id: 'deleted-vouchers', title: 'Deleted vouchers', isSpecial: true },
          { id: 'general-ledger', title: 'General ledger', isSpecial: true },
          { id: 'liquidity-report', title: 'Liquidity report', isSpecial: true },
          { id: 'opening-balance', title: 'Opening balance' },
          { id: 'performance-budget', title: 'Performance budget' },
          { id: 'performance-report', title: 'Performance report' },
          { id: 'performance-report-advanced', title: 'Performance report advanced' },
          { id: 'period-allocations', title: 'Period allocations' },
        ].map(report => (
          <div 
            key={report.id} 
            className="flex items-center justify-between h-9 px-2 hover:bg-gray-50 hover:underline"
            onClick={() => {
              if (report.isSpecial && report.id === '12-month-performance') {
                openTwelveMonthPerformanceReport();
              } else if (report.isSpecial && report.id === 'account-analysis') {
                openAccountAnalysis();
              } else if (report.isSpecial && report.id === 'balance-report') {
                openBalanceReport();
              } else if (report.isSpecial && report.id === 'deleted-vouchers') {
                openDeletedVouchers();
              } else if (report.isSpecial && report.id === 'general-ledger') {
                openGeneralLedger();
              } else if (report.isSpecial && report.id === 'liquidity-report') {
                openLiquidityReport();
              } else {
                toggleFavorite(report.id);
              }
            }}
          >
            <span className="text-[14px] text-[#111827]">{report.title}</span>
            <Star 
              className={`w-4 h-4 cursor-pointer \${favorites[report.id] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB]'}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(report.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const AssetSupplierWarehouseReports = () => (
    <div className="mb-8">
      {/* Top Row (Ungrouped Items) */}
      <div className="space-y-1 mb-4">
        {[
          { id: 'voucher-list', title: 'Voucher list' },
          { id: 'supplier-directory', title: 'Supplier directory' },
          { id: 'ledger-list', title: 'Ledger list' },
          { id: 'warehouse-list', title: 'Warehouse list' },
          { id: 'supplier-statistics', title: 'Supplier statistics' },
          { id: 'top-rated-suppliers', title: 'Top rated suppliers' },
        ].map(report => (
          <div 
            key={report.id} 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group hover:underline"
            onClick={() => toggleFavorite(report.id)}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              {report.title}
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 \${favorites[report.id] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'}`}
            />
          </div>
        ))}
      </div>

      {/* Asset register Section */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#065F46] my-4">Asset register</h3>
        <div className="space-y-1">
          {[
            { id: 'asset-groups', title: 'Asset groups (New)', isNew: true },
            { id: 'asset-information', title: 'Asset information' },
            { id: 'asset-list', title: 'Asset list' },
            { id: 'depreciation', title: 'Depreciation' },
            { id: 'depreciation-per-month', title: 'Depreciation per month' },
          ].map(report => (
            <div 
              key={report.id} 
              className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group hover:underline"
              onClick={() => toggleFavorite(report.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
                  {report.title}
                </span>
                {report.isNew && (
                  <span className="text-[12px] text-[#16A34A] font-medium">(New)</span>
                )}
              </div>
              <Star 
                className={`w-4 h-4 transition-all duration-200 \${favorites[report.id] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Intrastat Section */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#065F46] mt-4">Intrastat</h3>
        <div className="space-y-1">
          <div 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group hover:underline"
            onClick={() => toggleFavorite('intrastat-basis')}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              Intrastat basis
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 \${favorites['intrastat-basis'] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'}`}
            />
          </div>
        </div>
      </div>

      {/* Invoicing Section */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#065F46]">Invoicing</h3>
        <div className="space-y-1">
          <div 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group hover:underline"
            onClick={() => toggleFavorite('currency-report-customer')}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              Currency report customer
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 \${favorites['currency-report-customer'] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'}`}
            />
          </div>
        </div>
      </div>

      {/* Warehouse Section */}
      <div>
        <h3 className="text-[15px] font-semibold text-[#065F46]">Warehouse</h3>
        <div className="space-y-1">
          <div 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group hover:underline"
            onClick={() => toggleFavorite('stock-value-report')}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              Stock value report
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 \${favorites['stock-value-report'] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const DirectoriesListsReports = () => (
    <div className="mb-8">
      <h3 className="text-[15px] font-semibold text-[#065F46] mb-2">Directories and lists</h3>
      <div className="space-y-1">
        {[
          { id: 'account-plan', title: 'Account plan' },
          { id: 'customer-directory', title: 'Customer directory' },
          { id: 'customer-statistics', title: 'Customer statistics' },
          { id: 'item-directory', title: 'Item directory' },
          { id: 'item-statistics', title: 'Item statistics' },
          { id: 'item-statistics-advanced', title: 'Item statistics advanced' },
        ].map(report => (
          <div key={report.id} className="flex items-center justify-between h-9 px-2 hover:bg-gray-50 hover:underline">
            <span className="text-[14px] text-[#111827]">{report.title}</span>
            <Star 
              className={`w-4 h-4 cursor-pointer \${favorites[report.id] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB]'}`}
              onClick={() => toggleFavorite(report.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const SalaryReports = () => (
    <div className="mb-8">
      <h3 className="text-[15px] font-semibold text-[#065F46] mb-2">Salary</h3>
      <div className="space-y-1">
        {[
          { id: 'gross-salary-list', title: 'Gross salary list' },
          { id: 'personnel-list', title: 'Personnel list' },
          { id: 'salary-statistics', title: 'Salary statistics' },
          { id: 'salary-survey', title: 'Salary survey' },
          { id: 'salary-type-list', title: 'Salary type list' },
          { id: 'staff-card', title: 'Staff card' },
          { id: 'average-employees', title: 'The average number of employees' },
        ].map(report => (
          <div key={report.id} className="flex items-center justify-between h-9 px-2 hover:bg-gray-50 hover:underline">
            <span className="text-[14px] text-[#111827]">{report.title}</span>
            <Star 
              className={`w-4 h-4 cursor-pointer \${favorites[report.id] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB]'}`}
              onClick={() => toggleFavorite(report.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[70vh] overflow-auto">
        {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
        <h1 className="text-[22px] font-semibold text-[#064E3B]">Reports</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-3 py-1.5 text-[14px] font-medium text-[#16A34A] border border-[#16A34A] rounded-full bg-white hover:bg-gray-50 hover:underline">
            <MessageCircle className="w-4 h-4" />
            Leave feedback
          </button>
          <button 
            className="text-[#374151] hover:text-gray-700 hover:underline"
            onClick={() => onClose && onClose()}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Information Banner */}
      <div className="mx-6 my-4 bg-[#ECFDF5] rounded-lg p-3">
        <div className="flex items-start gap-2">
          <FileText className="w-4.5 h-4.5 text-[#16A34A] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[14px] text-[#065F46] mb-1">
              Create extended and more customized reports!
            </p>
            <button className="text-[14px] font-medium text-[#16A34A] hover:underline">
              Read more about Report & Analysis ›
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="flex gap-6">
          <button
            className={`text-[14px] font-medium ${
              activeTab === 'favorites' 
                ? 'text-[#111827] font-semibold relative' 
                : 'text-[#6B7280]'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
            {activeTab === 'favorites' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FACC15]"></div>
            )}
          </button>
          <button
            className={`text-[14px] font-medium ${
              activeTab === 'all' 
                ? 'text-[#111827] font-semibold relative' 
                : 'text-[#6B7280]'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All reports
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FACC15]"></div>
            )}
          </button>
        </div>
      </div>

      {/* Reports Content */}
      <div>
        {activeTab === 'favorites' ? (
          <div className="py-4">
            {favoriteReports.length > 0 ? (
              <div className="space-y-4">
                {/* Pinned Favorite Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteReports.map(report => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between bg-[#F3F6F4] p-4 rounded-xl h-18 cursor-pointer hover:bg-[#E9F5EF] transition-colors duration-200"
                      onClick={() => toggleFavorite(report.id)}
                    >
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#064E3B] leading-6">{report.title}</h3>
                        <p className="text-[13px] font-normal text-[#065F46] mt-0.5">{report.subtitle}</p>
                      </div>
                      <Star 
                        className={`w-4.5 h-4.5 ${favorites[report.id] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB]'}`}
                      />
                    </div>
                  ))}
                </div>
                
                {/* All reports section */}
                <div className="mt-8">
                  <AccountingReports />
                  <AssetSupplierWarehouseReports />
                  <DirectoriesListsReports />
                  <SalaryReports />
                </div>
              </div>
            ) : (
              /* Favorites Empty State */
              <div className="flex flex-col items-center py-4 px-2">
                {/* Empty State Illustration */}
                <div className="w-24 h-24 flex items-center justify-center">
                  <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
                    <path d="M48 12L60 24L48 36L36 24L48 12Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M48 36V12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 48C24 44.6863 26.6863 42 30 42H66C69.3137 42 72 44.6863 72 48V72C72 75.3137 69.3137 78 66 78H30C26.6863 78 24 75.3137 24 72V48Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M36 60H48" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M60 60H66" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="42" cy="54" r="1" fill="#22C55E"/>
                    <circle cx="54" cy="54" r="1" fill="#22C55E"/>
                    <circle cx="60" cy="54" r="1" fill="#22C55E"/>
                  </svg>
                </div>
                
                {/* Primary Heading */}
                <h2 className="text-[24px] font-semibold text-[#064E3B] text-center mt-5">
                  Your tailored report view
                </h2>
                
                {/* Supporting Description */}
                <p className="text-[14px] text-[#374151] text-center max-w-[520px] mt-2 leading-5">
                  You decide! Here you'll find the reports you want easily accessible.
                  Add or update your favorites anytime under the tab 
                  <span 
                    className="text-[#065F46] font-medium cursor-pointer hover:underline"
                    onClick={() => setActiveTab('all')}
                  >
                    All reports ›
                  </span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
              <AccountingReports />
              <AssetSupplierWarehouseReports />
            </div>
            <div>
              <DirectoriesListsReports />
            </div>
            <div>
              <SalaryReports />
            </div>
          </div>
        )}
      </div>
      </div> {/* Close the main container div */}
    </div>
  );
};

export default Reports;