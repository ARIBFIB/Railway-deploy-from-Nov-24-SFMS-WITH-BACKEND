import React, { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import {
  Printer,
  Upload,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  BarChart3
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  selected: boolean;
  matched: boolean;
}

interface ReconciliationData {
  account: string;
  reconciliationPeriodStart: string;
  reconciliationPeriodEnd: string;
  openRecordsFrom: string;
  verificationSeries: string;
  accountingTransactions: Transaction[];
  loadedTransactions: Transaction[];
}

const mockAccountingTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-08-01',
    description: 'Opening balance',
    amount: -3.00,
    selected: false,
    matched: false
  },
  {
    id: '2',
    date: '2025-08-05',
    description: 'Office supplies purchase',
    amount: -150.00,
    selected: false,
    matched: true
  },
  {
    id: '3',
    date: '2025-08-10',
    description: 'Bank transfer received',
    amount: 500.00,
    selected: false,
    matched: true
  },
  {
    id: '4',
    date: '2025-08-15',
    description: 'Utility payment',
    amount: -75.50,
    selected: false,
    matched: false
  }
];

const mockLoadedTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-08-01',
    description: 'Opening balance',
    amount: 30.00,
    selected: false,
    matched: false
  },
  {
    id: '2',
    date: '2025-08-05',
    description: 'Office supplies purchase',
    amount: -150.00,
    selected: false,
    matched: true
  },
  {
    id: '3',
    date: '2025-08-10',
    description: 'Bank transfer received',
    amount: 500.00,
    selected: false,
    matched: true
  },
  {
    id: '4',
    date: '2025-08-20',
    description: 'Service fee',
    amount: -25.00,
    selected: false,
    matched: false
  }
];

export const AccountReconciliation: React.FC = () => {
  const [data, setData] = useState<ReconciliationData>({
    account: '1030',
    reconciliationPeriodStart: '2025-08-01',
    reconciliationPeriodEnd: '2025-08-31',
    openRecordsFrom: '2025-07-01',
    verificationSeries: '',
    accountingTransactions: mockAccountingTransactions,
    loadedTransactions: mockLoadedTransactions
  });

  const [hideMatched, setHideMatched] = useState(false);

  const handleInputChange = (field: keyof ReconciliationData, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTransactionSelect = (type: 'accounting' | 'loaded', transactionId: string) => {
    setData(prev => ({
      ...prev,
      [type === 'accounting' ? 'accountingTransactions' : 'loadedTransactions']:
        prev[type === 'accounting' ? 'accountingTransactions' : 'loadedTransactions'].map(t =>
          t.id === transactionId ? { ...t, selected: !t.selected } : t
        )
    }));
  };

  const handleSearch = () => {
    console.log('Searching with filters:', data);
  };


  const handleHideMatched = () => {
    setHideMatched(!hideMatched);
  };

  const handleLoadHistory = () => {
    console.log('Loading history...');
  };

  const handleMassReconciliation = () => {
    console.log('Mass reconciliation...');
  };

  const handleAccountAnalysis = () => {
    console.log('Account analysis...');
  };

  const handleReconciliationReport = () => {
    console.log('Reconciliation report...');
  };

  const handleLoadFile = () => {
    console.log('Load file...');
  };

  const handleSave = () => {
    console.log('Saving reconciliation...');
  };

  const handleCancel = () => {
    console.log('Canceling reconciliation...');
  };

  const calculateBalance = (transactions: Transaction[]) => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateSelectedTotal = (transactions: Transaction[]) => {
    return transactions
      .filter(t => t.selected)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const calculateClosingBalance = (transactions: Transaction[]) => {
    const balance = calculateBalance(transactions);
    const selected = calculateSelectedTotal(transactions);
    return balance + selected;
  };

  const filteredAccountingTransactions = hideMatched
    ? data.accountingTransactions.filter(t => !t.matched)
    : data.accountingTransactions;

  const filteredLoadedTransactions = hideMatched
    ? data.loadedTransactions.filter(t => !t.matched)
    : data.loadedTransactions;

  const accountingBalance = calculateBalance(data.accountingTransactions);
  const loadedBalance = calculateBalance(data.loadedTransactions);
  const accountingSelected = calculateSelectedTotal(data.accountingTransactions);
  const loadedSelected = calculateSelectedTotal(data.loadedTransactions);
  const accountingClosing = calculateClosingBalance(data.accountingTransactions);
  const loadedClosing = calculateClosingBalance(data.loadedTransactions);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 uppercase">RECONCILE ACCOUNT</h1>
      </div>

      {/* Action Buttons */}
      <div className="py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleHideMatched}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            {hideMatched ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>Hide matched</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleLoadHistory}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <FileText className="w-4 h-4" />
            <span>Reading history</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleMassReconciliation}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Batch reconciliation</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleAccountAnalysis}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <Printer className="w-4 h-4" />
            <span>Account analysis</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleReconciliationReport}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <Printer className="w-4 h-4" />
            <span>Reconciliation report</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleLoadFile}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
          >
            <Upload className="w-4 h-4" />
            <span>Read the file</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="py-4 bg-gray-50">
        <div className="grid grid-cols-5 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Account</label>
            <Input
              value={data.account}
              onChange={(e) => handleInputChange('account', e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Reconciliation period</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={data.reconciliationPeriodStart}
                onChange={(e) => handleInputChange('reconciliationPeriodStart', e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Reconciliation period to</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={data.reconciliationPeriodEnd}
                onChange={(e) => handleInputChange('reconciliationPeriodEnd', e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Open records from</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={data.openRecordsFrom}
                onChange={(e) => handleInputChange('openRecordsFrom', e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Verification series:</label>
            <div className="relative">
              <Input
                value={data.verificationSeries}
                onChange={(e) => handleInputChange('verificationSeries', e.target.value)}
                className="w-full pr-8"
              />
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button
              onClick={handleSearch}
              className="bg-gray-800 hover:bg-gray-900 text-white w-full mt-2"
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 py-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column - Accounting Transactions */}
          <div>
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-900 inline mr-4">Accounting transactions</h3>
              <span className="text-sm text-gray-600">Opening account balance: -3,00</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Date October 2025</div>
            <div className="border border-gray-300 rounded-lg">
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher no.</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-[#dddddd] bg-white" onClick={() => handleTransactionSelect('accounting', '1')}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">&nbsp;</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">2025-10-07</td>
                      <td className="px-4 py-2 text-sm text-gray-900">Other</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">-1 000,00</td>
                    </tr>
                    <tr className="hover:bg-[#dddddd] bg-white" onClick={() => handleTransactionSelect('accounting', '2')}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">F 8</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">2025-10-07</td>
                      <td className="px-4 py-2 text-sm text-gray-900">Cash Sale</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">-1 000,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border-t border-gray-300 mt-2">
              <div className="text-sm text-gray-600 text-right">
                Account balance per 2025-11-01: -1 003,00
              </div>
            </div>
          </div>

          {/* Right Column - Loaded Transactions */}
          <div>
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-900 inline mr-4">Loaded transactions</h3>
              <span className="text-sm text-gray-600">Opening account balance: 50,00</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">Date October 2025</div>
            <div className="border border-gray-300 rounded-lg">
              <div className="overflow-y-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher no.</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-[#dddddd] bg-white" onClick={() => handleTransactionSelect('loaded', '1')}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">&nbsp;</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">2025-10-08</td>
                      <td className="px-4 py-2 text-sm text-gray-900">Bank Deposit</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">+5 000,00</td>
                    </tr>
                    <tr className="hover:bg-[#dddddd] bg-white" onClick={() => handleTransactionSelect('loaded', '2')}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">B 12</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">2025-10-09</td>
                      <td className="px-4 py-2 text-sm text-gray-900">Supplier Payment</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">-2 500,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="border-t border-gray-300 mt-2">
              <div className="text-sm text-gray-600 text-right">
                Account balance per 2025-11-01: 2 550,00
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="flex justify-between items-center">
          {/* Left Side - Accounting Transactions Summary */}
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="text-gray-600">Balance: </span>
              <span className="font-medium">{accountingBalance.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Total selected: </span>
              <span className="font-medium">{accountingSelected.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Closing balance: </span>
              <span className="font-medium">{accountingClosing.toFixed(2)}</span>
            </div>
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>

          {/* Right Side - Loaded Transactions Summary */}
          <div className="flex items-center space-x-6">
            <div className="text-sm">
              <span className="text-gray-600">Balance: </span>
              <span className="font-medium">{loadedBalance.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Total selected: </span>
              <span className="font-medium">{loadedSelected.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Closing balance: </span>
              <span className="font-medium">{loadedClosing.toFixed(2)}</span>
            </div>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
