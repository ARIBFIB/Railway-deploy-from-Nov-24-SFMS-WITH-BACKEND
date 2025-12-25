import React, { useState, useRef, useEffect } from 'react';
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
  BarChart3,
  Grid,
  X
} from 'lucide-react';
import { verificationSeriesService, type VerificationSeriesItem } from '../../services/verificationSeriesService';

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

  const [selectAllAccounting, setSelectAllAccounting] = useState(false);
  const [selectAllLoaded, setSelectAllLoaded] = useState(false);

  const [verificationSeries, setVerificationSeries] = useState<VerificationSeriesItem[]>([]);
  const [loadingSeries, setLoadingSeries] = useState(true);

  const [hideMatched, setHideMatched] = useState(false);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [showBatchReconciliationPopup, setShowBatchReconciliationPopup] = useState(false);
  const [showAccountAnalysisPopup, setShowAccountAnalysisPopup] = useState(false);
  const [showReconciliationReportPopup, setShowReconciliationReportPopup] = useState(false);
  const [activeTransactionFilter, setActiveTransactionFilter] = useState('Reconciled');
  const [customerPaymentsFilter, setCustomerPaymentsFilter] = useState('Yes');
  const [supplierPaymentsFilter, setSupplierPaymentsFilter] = useState('Yes');
  const [otherItemsFilter, setOtherItemsFilter] = useState('Yes');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setShowHistoryPopup(true);
  };

  const handleMassReconciliation = () => {
    setShowBatchReconciliationPopup(true);
  };

  const handleAccountAnalysis = () => {
    setShowAccountAnalysisPopup(true);
  };

  const handleReconciliationReport = () => {
    setShowReconciliationReportPopup(true);
  };

  const handleLoadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Load verification series from settings
  useEffect(() => {
    const loadVerificationSeries = async () => {
      try {
        setLoadingSeries(true);
        const selectedSeries = await verificationSeriesService.getSelectedSeries('accounting');
        setVerificationSeries(selectedSeries);
        
        // If there are series and none is selected yet, select the first one
        if (selectedSeries.length > 0 && !data.verificationSeries) {
          setData(prev => ({
            ...prev,
            verificationSeries: selectedSeries[0].code
          }));
        }
      } catch (error) {
        console.error('Failed to load verification series:', error);
        // Set some default series if API fails
        setVerificationSeries([
          { id: '1', code: 'A - Accounting', name: 'Accounting', manualAccounting: true, position: 0 },
          { id: '2', code: 'C - Cash', name: 'Cash', manualAccounting: true, position: 1 },
          { id: '3', code: 'F - Finance', name: 'Finance', manualAccounting: true, position: 2 },
          { id: '4', code: 'G - General', name: 'General', manualAccounting: true, position: 3 },
          { id: '5', code: 'K - Kreditor', name: 'Kreditor', manualAccounting: true, position: 4 }
        ]);
      } finally {
        setLoadingSeries(false);
      }
    };

    loadVerificationSeries();
  }, []);

  // Handle select all for accounting transactions
  const handleSelectAllAccounting = () => {
    const allSelected = !selectAllAccounting;
    setSelectAllAccounting(allSelected);
    
    setData(prev => ({
      ...prev,
      accountingTransactions: prev.accountingTransactions.map(t => ({
        ...t,
        selected: allSelected
      }))
    }));
  };

  // Handle select all for loaded transactions
  const handleSelectAllLoaded = () => {
    const allSelected = !selectAllLoaded;
    setSelectAllLoaded(allSelected);
    
    setData(prev => ({
      ...prev,
      loadedTransactions: prev.loadedTransactions.map(t => ({
        ...t,
        selected: allSelected
      }))
    }));
  };

  // Update select all states when transactions change
  useEffect(() => {
    const allAccountingSelected = data.accountingTransactions.length > 0 && 
      data.accountingTransactions.every(t => t.selected);
    setSelectAllAccounting(allAccountingSelected);
    
    const allLoadedSelected = data.loadedTransactions.length > 0 && 
      data.loadedTransactions.every(t => t.selected);
    setSelectAllLoaded(allLoadedSelected);
  }, [data.accountingTransactions, data.loadedTransactions]);

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
            onClick={() => console.log('View all clicked')}
            className="flex items-center space-x-1 text-xs text-gray-700 hover:text-blue-600 p-1 h-8"
          >
            <Grid className="w-3 h-3" />
            <span>View all</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleHideMatched}
            className="flex items-center space-x-1 text-xs text-gray-700 hover:text-blue-600 p-1 h-8"
          >
            {hideMatched ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>Hide matched</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleLoadHistory}
            className="flex items-center space-x-1 text-xs text-gray-700 hover:text-blue-600 p-1 h-8"
          >
            <FileText className="w-3 h-3" />
            <span>Reading history</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleMassReconciliation}
            className="flex items-center space-x-1 text-xs text-gray-700 hover:text-blue-600 p-1 h-8"
          >
            <BarChart3 className="w-3 h-3" />
            <span>Batch reconciliation</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleAccountAnalysis}
            className="flex items-center space-x-1 text-xs text-gray-700 hover:text-blue-600 p-1 h-8"
          >
            <Printer className="w-3 h-3" />
            <span>Account analysis</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleReconciliationReport}
            className="flex items-center space-x-1 text-xs text-gray-700 hover:text-blue-600 p-1 h-8"
          >
            <Printer className="w-3 h-3" />
            <span>Reconciliation report</span>
          </Button>
          <Button
            variant="ghost"
            onClick={handleLoadFile}
            className="flex items-center space-x-1 text-xs text-gray-700 hover:text-blue-600 p-1 h-8"
          >
            <Upload className="w-3 h-3" />
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
              {loadingSeries ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                  Loading...
                </div>
              ) : (
                <select
                  value={data.verificationSeries}
                  onChange={(e) => handleInputChange('verificationSeries', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {verificationSeries.map((series) => (
                    <option key={series.id} value={series.code}>
                      {series.code} - {series.name}
                    </option>
                  ))}
                </select>
              )}
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
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          checked={selectAllAccounting}
                          onChange={handleSelectAllAccounting}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher no.</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.accountingTransactions.map((transaction) => (
                      <tr 
                        key={transaction.id}
                        className={`hover:bg-[#dddddd] bg-white ${transaction.selected ? 'bg-blue-100' : ''}`}
                        onClick={() => handleTransactionSelect('accounting', transaction.id)}
                      >
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 w-12">
                          <input
                            type="checkbox"
                            checked={transaction.selected}
                            onChange={() => handleTransactionSelect('accounting', transaction.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransactionSelect('accounting', transaction.id);
                            }}
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{transaction.description === 'Other' ? '&nbsp;' : transaction.description === 'Cash Sale' ? 'F 8' : transaction.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{transaction.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">{transaction.amount < 0 ? `- ${Math.abs(transaction.amount).toLocaleString('sv-SE', { minimumFractionDigits: 2 }).replace('.', ' ')} ` : `+ ${transaction.amount.toLocaleString('sv-SE', { minimumFractionDigits: 2 }).replace('.', ' ')} `}</td>
                      </tr>
                    ))}
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
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                        <input
                          type="checkbox"
                          checked={selectAllLoaded}
                          onChange={handleSelectAllLoaded}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voucher no.</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.loadedTransactions.map((transaction) => (
                      <tr 
                        key={transaction.id}
                        className={`hover:bg-[#dddddd] bg-white ${transaction.selected ? 'bg-blue-100' : ''}`}
                        onClick={() => handleTransactionSelect('loaded', transaction.id)}
                      >
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 w-12">
                          <input
                            type="checkbox"
                            checked={transaction.selected}
                            onChange={() => handleTransactionSelect('loaded', transaction.id)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTransactionSelect('loaded', transaction.id);
                            }}
                          />
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{transaction.description === 'Bank Deposit' ? '&nbsp;' : transaction.description === 'Supplier Payment' ? 'B 12' : transaction.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{transaction.description}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900">{transaction.amount < 0 ? `- ${Math.abs(transaction.amount).toLocaleString('sv-SE', { minimumFractionDigits: 2 }).replace('.', ' ')} ` : `+ ${transaction.amount.toLocaleString('sv-SE', { minimumFractionDigits: 2 }).replace('.', ' ')} `}</td>
                      </tr>
                    ))}
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
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
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
      
      {/* Reading History Popup */}
      {showHistoryPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-2/3 max-w-2xl p-0 relative">
            <div className="bg-blue-100 px-6 py-4 rounded-t-lg border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Reading History</h2>
                <button 
                  onClick={() => setShowHistoryPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-600 text-center">No history available</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Batch Reconciliation Popup */}
      {showBatchReconciliationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-2/3 max-w-2xl p-0 relative">
            <div className="bg-blue-100 px-6 py-4 rounded-t-lg border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">MASS-RECONCILE ACCOUNTING TRANSACTIONS</h2>
                <button 
                  onClick={() => setShowBatchReconciliationPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      className="pl-10 w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                  <Input
                    value="1030"
                    className="w-full"
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <Button className="flex-1 bg-[#9bbb48] hover:bg-[#8bb243] text-white">
                    Undo reconciliation
                  </Button>
                  <Button className="flex-1 bg-[#5c6f2b] hover:bg-[#637e2f] text-white">
                    Reconcile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Account Analysis Popup */}
      {showAccountAnalysisPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-2/3 max-w-2xl p-0 relative">
            <div className="bg-blue-100 px-6 py-4 rounded-t-lg border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">ACCOUNT ANALYSIS</h2>
                <button 
                  onClick={() => setShowAccountAnalysisPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Show Transactions</h3>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden mb-6">
                    <Button 
                      className={`flex-1 ${activeTransactionFilter === 'Reconciled' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} border-r border-gray-300 rounded-none`}
                      onClick={() => setActiveTransactionFilter('Reconciled')}
                    >
                      Reconciled
                    </Button>
                    <Button 
                      className={`flex-1 ${activeTransactionFilter === 'Not reconciled' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} border-r border-gray-300 rounded-none`}
                      onClick={() => setActiveTransactionFilter('Not reconciled')}
                    >
                      Not reconciled
                    </Button>
                    <Button 
                      className={`flex-1 ${activeTransactionFilter === 'All' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} rounded-none`}
                      onClick={() => setActiveTransactionFilter('All')}
                    >
                      All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date from</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date to</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="date"
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="flex-1 bg-[#5c6f2b] hover:bg-[#637e2f] text-white">
                    Show on screen
                  </Button>
                  <Button className="flex-1 bg-[#9bbb48] hover:bg-[#8bb243] text-white">
                    Show PDF
                  </Button>
                  <Button className="flex-1 bg-[#637e2f] hover:bg-[#5c6f2b] text-white">
                    Show TXT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reconciliation Report Popup */}
      {showReconciliationReportPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-2/3 max-w-2xl p-0 relative">
            <div className="bg-blue-100 px-6 py-4 rounded-t-lg border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">RECONCILIATION REPORT</h2>
                <button 
                  onClick={() => setShowReconciliationReportPopup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-medium mb-4">Total customer payments in</h3>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden mb-6">
                    <Button 
                      className={`flex-1 h-10 ${customerPaymentsFilter === 'Yes' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} border-r border-gray-300 rounded-none text-sm`}
                      onClick={() => setCustomerPaymentsFilter('Yes')}
                    >
                      Yes
                    </Button>
                    <Button 
                      className={`flex-1 h-10 ${customerPaymentsFilter === 'No' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} rounded-none text-sm`}
                      onClick={() => setCustomerPaymentsFilter('No')}
                    >
                      No
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium mb-4">Total supplier payments</h3>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden mb-6">
                    <Button 
                      className={`flex-1 h-10 ${supplierPaymentsFilter === 'Yes' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} border-r border-gray-300 rounded-none text-sm`}
                      onClick={() => setSupplierPaymentsFilter('Yes')}
                    >
                      Yes
                    </Button>
                    <Button 
                      className={`flex-1 h-10 ${supplierPaymentsFilter === 'No' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} rounded-none text-sm`}
                      onClick={() => setSupplierPaymentsFilter('No')}
                    >
                      No
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-medium mb-4">Total other items</h3>
                  <div className="flex rounded-lg border border-gray-300 overflow-hidden mb-6">
                    <Button 
                      className={`flex-1 h-10 ${otherItemsFilter === 'Yes' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} border-r border-gray-300 rounded-none text-sm`}
                      onClick={() => setOtherItemsFilter('Yes')}
                    >
                      Yes
                    </Button>
                    <Button 
                      className={`flex-1 h-10 ${otherItemsFilter === 'No' ? 'bg-[#5c6f2b] text-white hover:bg-[#637e2f]' : 'bg-[#9bbb48] text-gray-700 hover:bg-[#8bb243]'} rounded-none text-sm`}
                      onClick={() => setOtherItemsFilter('No')}
                    >
                      No
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="flex-1 bg-[#5c6f2b] hover:bg-[#637e2f] text-white">
                    Show on screen
                  </Button>
                  <Button className="flex-1 bg-[#9bbb48] hover:bg-[#8bb243] text-white">
                    Show PDF
                  </Button>
                  <Button className="flex-1 bg-[#637e2f] hover:bg-[#5c6f2b] text-white">
                    Show TXT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={() => {}} // Add file handling logic here if needed
      />
    </div>
  );
};
