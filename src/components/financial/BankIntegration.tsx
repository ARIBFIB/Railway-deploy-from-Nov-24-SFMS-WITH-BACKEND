import React, { useState, useEffect } from 'react';
import { Plus, WifiSync as Sync, Eye, CheckCircle, AlertTriangle, CreditCard, Building, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { transactionAccountsService, type TransactionAccount, type BankTransaction } from '../../services/transactionAccountsService';

// Foundation ID to use (simulating selected foundation)
const CURRENT_FOUNDATION_ID = 'foundation-1';

export const BankIntegration: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<TransactionAccount[]>([]);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showReconcileModal, setShowReconcileModal] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const accounts = await transactionAccountsService.list({ foundation_id: CURRENT_FOUNDATION_ID });
      setBankAccounts(accounts);

      // Fetch transactions for all accounts (or selected)
      // Since getTransactions takes one ID, we might need to loop or just fetch for primary.
      // For 'all', we might just fetch for all and flatten.
      const allTransactions: BankTransaction[] = [];
      for (const acc of accounts) {
        try {
          const txs = await transactionAccountsService.getTransactions(acc.id, CURRENT_FOUNDATION_ID);
          // Attach account_id manually if not in response, but it is in interface
          allTransactions.push(...txs);
        } catch (e) {
          console.error(`Failed to fetch transactions for account ${acc.id}`, e);
        }
      }
      setTransactions(allTransactions);

    } catch (err) {
      console.error("Failed to load bank data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTransactions = selectedAccount === 'all'
    ? transactions
    : transactions.filter(t => t.transaction_account_id === selectedAccount); // Ensure key matches interface

  const totalBalance = bankAccounts.reduce((sum, account) => sum + (account.current_balance || 0), 0);
  const unreconciledCount = transactions.filter(t => !t.is_reconciled).length;
  const recentCredits = transactions.filter(t => t.transaction_type === 'credit').length;
  const recentDebits = transactions.filter(t => t.transaction_type === 'debit').length;

  const handleSync = async (accountId?: string) => {
    setSyncing(true);
    try {
      // In a real app, this triggers a backend sycn job.
      // We'll just reload data from backend for now.
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  const handleReconcile = async (transactionId: string) => {
    // Optimistic update
    setTransactions(prev => prev.map(transaction =>
      transaction.id === transactionId
        ? { ...transaction, is_reconciled: true }
        : transaction
    ));

    // TODO: Call API to persist reconciliation status
    // alert("Reconciliation API not fully connected yet.");
  };

  const handleAddAccount = async (data: any) => {
    try {
      await transactionAccountsService.create(data, CURRENT_FOUNDATION_ID);
      loadData();
      setShowAddAccountModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bank Integration</h2>
          <p className="text-gray-600 mt-1">Connect and sync with Swedish banks for automated transaction import.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            icon={Sync}
            variant="secondary"
            loading={syncing}
            onClick={() => handleSync()}
          >
            Sync All
          </Button>
          <Button
            icon={Plus}
            onClick={() => setShowAddAccountModal(true)}
          >
            Add Bank Account
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalBalance.toLocaleString('sv-SE')} SEK
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unreconciled</p>
                  <p className="text-2xl font-bold text-gray-900">{unreconciledCount}</p>
                </div>
              </div>
            </Card>

            {/* ... (Other cards) ... */}
            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Credits This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{recentCredits}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Debits This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{recentDebits}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Bank Accounts */}
          <Card title="Connected Bank Accounts" subtitle="Manage your bank account connections">
            <div className="space-y-4">
              {bankAccounts.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No bank accounts connected.</div>
              ) : (
                bankAccounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{account.name || account.account_name}</h3>
                          {/* Primary flag not in interface currently, removed condition */}
                        </div>
                        <p className="text-sm text-gray-600">{account.bank}</p>
                        <p className="text-xs text-gray-500">
                          {account.account_number} • {account.account_type || 'Business'}
                        </p>
                        {/* Last sync not in interface, using dummy conditional or removed */}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          {(account.current_balance || 0).toLocaleString('sv-SE')} {account.currency || 'SEK'}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {account.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Sync}
                          loading={syncing}
                          onClick={() => handleSync(account.id)}
                        >
                          Sync
                        </Button>
                        <Button variant="ghost" size="sm" icon={Eye}>
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                )))}
            </div>
          </Card>

          {/* Account Filter */}
          <Card>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by Account:</label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Accounts</option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name || account.account_name}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowReconcileModal(true)}
              >
                Reconcile Transactions
              </Button>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card title="Recent Transactions" subtitle="Latest bank transactions and reconciliation status">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.transaction_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          {transaction.description}
                          {transaction.reference_number && (
                            <div className="text-xs text-gray-500">
                              Ref: {transaction.reference_number}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {transaction.category || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <span className={`font-medium ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {transaction.transaction_type === 'credit' ? '+' : ''}
                          {transaction.amount.toLocaleString('sv-SE')} SEK
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {transaction.balance_after ? transaction.balance_after.toLocaleString('sv-SE') + ' SEK' : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {transaction.is_reconciled ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-yellow-500 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {!transaction.is_reconciled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReconcile(transaction.id)}
                          >
                            Reconcile
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Add Bank Account Modal */}
      <Modal
        isOpen={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
        title="Add Bank Account"
        size="lg"
      >
        <BankAccountForm onSuccess={handleAddAccount} onClose={() => setShowAddAccountModal(false)} />
      </Modal>

      {/* Reconcile Modal */}
      <Modal
        isOpen={showReconcileModal}
        onClose={() => setShowReconcileModal(false)}
        title="Reconcile Transactions"
        size="lg"
      >
        <ReconcileForm
          transactions={transactions.filter(t => !t.is_reconciled)}
          onReconcile={handleReconcile}
          onClose={() => setShowReconcileModal(false)}
        />
      </Modal>
    </div>
  );
};

const BankAccountForm: React.FC<{ onSuccess: (data: any) => void; onClose: () => void }> = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: '', // Use name instead of account_name to match backend/interface
    bank: '', // Use bank instead of bank_name
    account_number: '',
    iban: '',
    account_type: 'business',
    currency: 'SEK'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Building className="w-12 h-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Connect Bank Account</h3>
        <p className="text-sm text-gray-600">Add a Swedish bank account for automated transaction sync</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Account Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Foundation Operating Account"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name
          </label>
          <select
            value={formData.bank}
            onChange={(e) => setFormData(prev => ({ ...prev, bank: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select Bank</option>
            <option value="Swedbank">Swedbank</option>
            <option value="Handelsbanken">Handelsbanken</option>
            <option value="SEB">SEB</option>
            <option value="Nordea">Nordea</option>
            <option value="Danske Bank">Danske Bank</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Account Number"
          value={formData.account_number}
          onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
          placeholder="e.g., 8327-9,123 456 789-0"
          required
        />

        <Input
          label="IBAN (Optional)"
          value={formData.iban}
          onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
          placeholder="SE35 8000 0832 7912 3456 7890"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            value={formData.account_type}
            onChange={(e) => setFormData(prev => ({ ...prev, account_type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="business">Business Account</option>
            <option value="checking">Checking Account</option>
            <option value="savings">Savings Account</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="SEK">Swedish Krona (SEK)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">US Dollar (USD)</option>
          </select>
        </div>
      </div>

      {/* Feature list... */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Connect Account
        </Button>
      </div>
    </form>
  );
};

const ReconcileForm: React.FC<{
  transactions: BankTransaction[];
  onReconcile: (transactionId: string) => void;
  onClose: () => void;
}> = ({ transactions, onReconcile, onClose }) => {
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);

  const handleSelectAll = () => {
    if (selectedTransactions.length === transactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(transactions.map(t => t.id));
    }
  };

  const handleReconcileSelected = () => {
    selectedTransactions.forEach(id => onReconcile(id));
    onClose();
  };

  return (
    <div className="space-y-6">
      {/* ... keeping the same ReconcileForm UI ... */}
      {/* Shortened for brevity in this response, using exact previous structure */}
      <div className="text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Reconcile Transactions</h3>
        <p className="text-sm text-gray-600">Mark transactions as reconciled with your accounting records</p>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">All transactions are already reconciled!</p>
          <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTransactions.length === transactions.length}
                onChange={handleSelectAll}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Select All ({transactions.length} transactions)
              </span>
            </label>
            <Button
              disabled={selectedTransactions.length === 0}
              onClick={handleReconcileSelected}
            >
              Reconcile Selected ({selectedTransactions.length})
            </Button>
          </div>

          {/* ... List ... */}
          {/* Assume previous list implementation here */}
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(transaction.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTransactions(prev => [...prev, transaction.id]);
                      } else {
                        setSelectedTransactions(prev => prev.filter(id => id !== transaction.id));
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.amount} {transaction.transaction_type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={selectedTransactions.length === 0}
              onClick={handleReconcileSelected}
            >
              Reconcile Selected
            </Button>
          </div>
        </>
      )}
    </div>
  );
};