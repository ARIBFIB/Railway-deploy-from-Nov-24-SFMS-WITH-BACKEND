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

      {/* Action Buttons */}
      <div className="py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={handleHideMatched}
            className="flex items-center space-x-2"
          >
            {hideMatched ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>Hide matched</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleLoadHistory}
            className="flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Loading history</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleMassReconciliation}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Mass reconciliation</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleAccountAnalysis}
            className="flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Account analysis</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleReconciliationReport}
            className="flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Reconciliation report</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleLoadFile}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Load file</span>
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="py-4 bg-gray-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Account:</label>
            <Input
              value={data.account}
              onChange={(e) => handleInputChange('account', e.target.value)}
              className="w-20"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Reconciliation period:</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={data.reconciliationPeriodStart}
                onChange={(e) => handleInputChange('reconciliationPeriodStart', e.target.value)}
                className="pl-10 w-40"
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={data.reconciliationPeriodEnd}
                onChange={(e) => handleInputChange('reconciliationPeriodEnd', e.target.value)}
                className="pl-10 w-40"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Open records from:</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={data.openRecordsFrom}
                onChange={(e) => handleInputChange('openRecordsFrom', e.target.value)}
                className="pl-10 w-40"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Verification series:</label>
            <div className="relative">
              <Input
                value={data.verificationSeries}
                onChange={(e) => handleInputChange('verificationSeries', e.target.value)}
                className="w-32 pr-8"
              />
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>
          <Button
            onClick={handleSearch}
            className="bg-gray-800 hover:bg-gray-900 text-white px-6"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 py-6">
        <div className="grid grid-cols-2 gap-6 h-96">
          {/* Left Column - Accounting Transactions */}
          <div className="border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <h3 className="text-sm font-medium text-gray-900">Accounting transactions</h3>
            </div>
            <div className="p-4 h-80 overflow-y-auto">
              <div className="space-y-2">
                {filteredAccountingTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      transaction.selected ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                    } ${transaction.matched ? 'opacity-50' : ''}`}
                    onClick={() => handleTransactionSelect('accounting', transaction.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.date}</div>
                        <div className="text-sm text-gray-600">{transaction.description}</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 py-2 border-t border-gray-300 bg-gray-50">
              <div className="text-sm text-gray-600">
                Opening account balance: {accountingBalance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Right Column - Loaded Transactions */}
          <div className="border border-gray-300 rounded-lg">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
              <h3 className="text-sm font-medium text-gray-900">Loaded transactions</h3>
            </div>
            <div className="p-4 h-80 overflow-y-auto">
              <div className="space-y-2">
                {filteredLoadedTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      transaction.selected ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                    } ${transaction.matched ? 'opacity-50' : ''}`}
                    onClick={() => handleTransactionSelect('loaded', transaction.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transaction.date}</div>
                        <div className="text-sm text-gray-600">{transaction.description}</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 py-2 border-t border-gray-300 bg-gray-50">
              <div className="text-sm text-gray-600">
                Opening account balance: {loadedBalance.toFixed(2)}
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
