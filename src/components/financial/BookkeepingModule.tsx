import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Calculator } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { AccountService, type CreateAccountData } from '../../services/accountService';
import { VerificationService, type CreateVerificationData } from '../../services/verificationService';

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  currency: string;
  is_active: boolean;
}

interface JournalEntry {
  id: string;
  entry_number: string;
  entry_date: string;
  description: string;
  total_debit: number;
  total_credit: number;
  status: 'draft' | 'posted' | 'reversed';
  line_items: JournalEntryLine[];
}

interface JournalEntryLine {
  id: string;
  account_name: string;
  description: string;
  debit_amount: number;
  credit_amount: number;
}

// Mocks removed

export const BookkeepingModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'journal'>('accounts');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editingJournalEntry, setEditingJournalEntry] = useState<JournalEntry | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'accounts') {
        const result = await AccountService.getAccounts();
        // Map backend Account to local Account interface
        const mappedAccounts: Account[] = result.data.map((a: any) => ({
          id: a.id,
          account_number: a.account_number,
          account_name: a.account_name,
          account_type: a.account_type || 'expense', // fallback
          balance: a.opening_balance || 0,
          currency: 'SEK',
          is_active: a.is_active
        }));
        setAccounts(mappedAccounts);
      } else {
        const result = await VerificationService.getVerifications({ limit: 100 });
        // Map backend Verification to local JournalEntry interface
        const mappedEntries: JournalEntry[] = result.data.map((v: any) => ({
          id: v.id,
          entry_number: v.verification_number || 'Draft', // Fallback
          entry_date: v.accounting_date,
          description: v.description,
          total_debit: v.total_debit || (v.entries || []).reduce((s: number, e: any) => s + Number(e.debit || 0), 0),
          total_credit: v.total_credit || (v.entries || []).reduce((s: number, e: any) => s + Number(e.credit || 0), 0),
          status: v.status,
          line_items: (v.entries || []).map((e: any) => ({
            id: e.id,
            account_name: e.account_name ? `${e.account_number} - ${e.account_name}` : e.account_number,
            description: e.transaction_info,
            debit_amount: e.debit,
            credit_amount: e.credit
          }))
        }));
        setJournalEntries(mappedEntries);

        // Also ensure accounts are loaded for the form
        if (accounts.length === 0) {
          const accResult = await AccountService.getAccounts();
          const mappedAccounts: Account[] = accResult.data.map((a: any) => ({
            id: a.id,
            account_number: a.account_number,
            account_name: a.account_name,
            account_type: a.account_type || 'expense',
            balance: a.opening_balance || 0,
            currency: 'SEK',
            is_active: a.is_active
          }));
          setAccounts(mappedAccounts);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleSaveAccount = async (data: any) => {
    setIsProcessing(true);
    try {
      if (editingAccount && editingAccount.id) {
        await AccountService.updateAccount(editingAccount.id, data);
      } else {
        await AccountService.createAccount(data);
      }
      await loadData();
      setShowAccountModal(false);
      setEditingAccount(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save account');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    setIsProcessing(true);
    try {
      await AccountService.deleteAccount(id);
      await loadData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete account');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveJournalEntry = async (data: any) => {
    setIsProcessing(true);
    try {
      // Calculate totals
      const debit = data.line_items.reduce((s: number, i: any) => s + Number(i.debit_amount || 0), 0);
      const credit = data.line_items.reduce((s: number, i: any) => s + Number(i.credit_amount || 0), 0);

      let vNum = editingJournalEntry?.entry_number;
      // If creating new, and we don't have a number, fetch next one
      if (!editingJournalEntry) {
        try {
          const numRes = await VerificationService.getNextVerificationNumber('A');
          if (numRes.success && numRes.data.verification_number && !numRes.data.verification_number.includes('NaN')) {
            vNum = numRes.data.verification_number;
          }
        } catch (e) {
          console.warn('Could not fetch next number', e);
        }

        // Fallback: Generate a unique number if API fails to prevent save failure
        if (!vNum || vNum.includes('NaN')) {
          const timestamp = Math.floor(Date.now() / 1000).toString().slice(-6);
          vNum = `A-${timestamp}`;
        }
      }

      // Map form data to Backend structure
      const verificationData: any = { // CreateVerificationData type partial
        accounting_date: data.entry_date,
        description: data.description,
        verification_series: 'A', // Default
        verification_number: vNum, // Include the number
        total_debit: debit,
        total_credit: credit,
        entries: data.line_items.map((l: any) => ({
          account_number: l.account_name, // Mapping input 'Account' to account_number
          transaction_info: l.description || data.description,
          debit: Number(l.debit_amount),
          credit: Number(l.credit_amount)
        }))
      };

      if (editingJournalEntry && editingJournalEntry.id) {
        await VerificationService.updateVerification(editingJournalEntry.id, verificationData);
      } else {
        await VerificationService.createVerification(verificationData);
      }
      await loadData();
      setShowJournalModal(false);
      setEditingJournalEntry(null);
    } catch (err) {
      console.error(err);
      setError('Failed to save journal entry');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditJournalEntry = async (entry: JournalEntry) => {
    setIsProcessing(true);
    try {
      const res = await VerificationService.getVerificationById(entry.id);
      if (res.success && res.data) {
        // Map back to local format for form population
        const v = res.data;
        const mapped: JournalEntry = {
          id: v.id || '',
          entry_number: v.verification_number || '',
          entry_date: v.accounting_date || new Date().toISOString(),
          description: v.description || '',
          total_debit: v.total_debit || 0,
          total_credit: v.total_credit || 0,
          status: (v.status as 'draft' | 'posted' | 'reversed') || 'draft',
          line_items: (v.entries || []).map((e: any) => ({
            id: e.id || '',
            account_name: e.account_number || '',
            description: e.transaction_info || '',
            debit_amount: e.debit || 0,
            credit_amount: e.credit || 0
          }))
        };
        setEditingJournalEntry(mapped);
        setShowJournalModal(true);
      }
    } catch (e) {
      setError('Failed to load entry for editing');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteJournalEntry = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    setIsProcessing(true);
    try {
      await VerificationService.deleteVerification(id);
      await loadData();
    } catch (e) {
      setError('Failed to delete entry');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAllAccounts = async () => {
    if (accounts.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ALL ${accounts.length} accounts? This action cannot be undone.`)) return;

    setIsProcessing(true);
    try {
      const ids = accounts.map(a => a.id);
      await AccountService.bulkDelete(ids);
      await loadData();
    } catch (e) {
      console.error(e);
      setError('Failed to delete all accounts');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAllJournalEntries = async () => {
    if (journalEntries.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ALL ${journalEntries.length} journal entries? This action cannot be undone.`)) return;

    setIsProcessing(true);
    try {
      const ids = journalEntries.map(e => e.id);
      await VerificationService.bulkDelete(ids);
      await loadData();
    } catch (e) {
      console.error(e);
      setError('Failed to delete all journal entries');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.account_number.includes(searchTerm)
  );

  const filteredJournalEntries = journalEntries.filter(entry =>
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.entry_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.line_items.some(line => line.account_name.toLowerCase().includes(searchTerm.toLowerCase()) || line.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'asset': return 'bg-green-100 text-green-800';
      case 'liability': return 'bg-red-100 text-red-800';
      case 'equity': return 'bg-blue-100 text-blue-800';
      case 'revenue': return 'bg-purple-100 text-purple-800';
      case 'expense': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'posted': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'reversed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bookkeeping</h2>
          <p className="text-gray-600 mt-1">Manage chart of accounts and journal entries.</p>
        </div>
        <div className="flex items-center space-x-2">
          {activeTab === 'journal' && (
            <Button
              icon={Calculator}
              variant="secondary"
              onClick={() => {
                setEditingJournalEntry(null);
                setShowJournalModal(true);
              }}
            >
              New Journal Entry
            </Button>
          )}
          {activeTab === 'journal' && journalEntries.length > 0 && (
            <Button
              icon={Trash2}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteAllJournalEntries}
            >
              Delete All
            </Button>
          )}
          {activeTab === 'accounts' && (
            <Button
              icon={Plus}
              onClick={() => {
                setEditingAccount(null);
                setShowAccountModal(true);
              }}
            >
              New Account
            </Button>
          )}
          {activeTab === 'accounts' && accounts.length > 0 && (
            <Button
              icon={Trash2}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteAllAccounts}
            >
              Delete All
            </Button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('accounts')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'accounts'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Chart of Accounts
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'journal'
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            Journal Entries
          </button>
        </nav>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder={`Search ${activeTab === 'accounts' ? 'accounts' : 'journal entries'}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
      </Card>

      {/* Chart of Accounts */}
      {activeTab === 'accounts' && (
        <Card title="Chart of Accounts" subtitle="Manage your accounting structure">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {account.account_number} - {account.account_name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeColor(account.account_type)}`}>
                        {account.account_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {account.balance.toLocaleString('sv-SE')} {account.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {account.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" icon={Edit} onClick={() => {
                          setEditingAccount(account);
                          setShowAccountModal(true);
                        }}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDeleteAccount(account.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Journal Entries */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          {filteredJournalEntries.map((entry) => (
            <Card key={entry.id}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-700">{entry.entry_number}</span>
                    <span className="text-xs text-gray-500">Date: {new Date(entry.entry_date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(entry.status)}`}>
                    {entry.status}
                  </span>
                  <Button variant="ghost" size="sm" icon={Edit} onClick={() => handleEditJournalEntry(entry)}>
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" icon={Trash2} onClick={() => handleDeleteJournalEntry(entry.id)}>
                    Delete
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Account
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Description
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Debit
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                        Credit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entry.line_items.map((line) => (
                      <tr key={line.id}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {(() => {
                            const acc = accounts.find(a => a.account_number === line.account_name);
                            return acc ? `${acc.account_number} - ${acc.account_name}` : line.account_name;
                          })()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-600">
                          {line.description}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          {line.debit_amount > 0 ? line.debit_amount.toLocaleString('sv-SE') : '-'}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          {line.credit_amount > 0 ? line.credit_amount.toLocaleString('sv-SE') : '-'}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                      <td className="px-4 py-2 text-sm text-gray-900" colSpan={2}>
                        Total
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {entry.total_debit.toLocaleString('sv-SE')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {entry.total_credit.toLocaleString('sv-SE')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Account Modal */}
      <Modal
        isOpen={showAccountModal}
        onClose={() => {
          setShowAccountModal(false);
          setEditingAccount(null);
        }}
        title={editingAccount ? "Edit Account" : "Create New Account"}
        size="md"
      >
        <AccountForm
          onClose={() => {
            setShowAccountModal(false);
            setEditingAccount(null);
          }}
          onSubmit={handleSaveAccount}
          initialData={editingAccount}
        />
      </Modal>

      {/* Journal Entry Modal */}
      <Modal
        isOpen={showJournalModal}
        onClose={() => {
          setShowJournalModal(false);
          setEditingJournalEntry(null);
        }}
        title={editingJournalEntry ? "Edit Journal Entry" : "Create Journal Entry"}
        size="lg"
      >
        <JournalEntryForm
          onClose={() => {
            setShowJournalModal(false);
            setEditingJournalEntry(null);
          }}
          onSubmit={handleSaveJournalEntry}
          initialData={editingJournalEntry}
          accounts={accounts}
        />
      </Modal>


      {/* Loading Overlay */}
      {
        isProcessing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center animate-pulse">
              <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-900 font-medium">Processing...</p>
            </div>
          </div>
        )
      }
    </div >
  );
};

const AccountForm: React.FC<{ onClose: () => void; onSubmit: (data: any) => void; initialData?: Account | null }> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    account_number: '',
    account_name: '',
    account_type: '',
    currency: 'SEK'
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        account_number: initialData.account_number,
        account_name: initialData.account_name,
        account_type: initialData.account_type || '',
        currency: 'SEK'
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Account Number"
          value={formData.account_number}
          onChange={(e) => setFormData(prev => ({ ...prev, account_number: e.target.value }))}
          placeholder="e.g., 1010"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Type
          </label>
          <select
            value={formData.account_type}
            onChange={(e) => setFormData(prev => ({ ...prev, account_type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          >
            <option value="">Select Type</option>
            <option value="asset">Asset</option>
            <option value="liability">Liability</option>
            <option value="equity">Equity</option>
            <option value="revenue">Revenue</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      <Input
        label="Account Name"
        value={formData.account_name}
        onChange={(e) => setFormData(prev => ({ ...prev, account_name: e.target.value }))}
        placeholder="e.g., Cash"
        required
      />

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Account
        </Button>
      </div>
    </form>
  );
};

const JournalEntryForm: React.FC<{ onClose: () => void; onSubmit: (data: any) => void; initialData?: any; accounts?: Account[] }> = ({ onClose, onSubmit, initialData, accounts = [] }) => {
  const [formData, setFormData] = useState({
    entry_date: new Date().toISOString().split('T')[0],
    description: '',
    line_items: [
      { account_name: '', description: '', debit_amount: 0, credit_amount: 0 },
      { account_name: '', description: '', debit_amount: 0, credit_amount: 0 }
    ]
  });

  const totalDebit = formData.line_items.reduce((sum, item) => sum + (Number(item.debit_amount) || 0), 0);
  const totalCredit = formData.line_items.reduce((sum, item) => sum + (Number(item.credit_amount) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        entry_date: initialData.entry_date ? initialData.entry_date.split('T')[0] : new Date().toISOString().split('T')[0],
        description: initialData.description || '',
        line_items: (initialData.line_items && initialData.line_items.length > 0)
          ? initialData.line_items.map((i: any) => ({
            account_name: i.account_name || '',
            description: i.description || '',
            debit_amount: i.debit_amount || 0,
            credit_amount: i.credit_amount || 0
          }))
          : [
            { account_name: '', description: '', debit_amount: 0, credit_amount: 0 },
            { account_name: '', description: '', debit_amount: 0, credit_amount: 0 }
          ]
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Function to add a line item
  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      line_items: [...prev.line_items, { account_name: '', description: '', debit_amount: 0, credit_amount: 0 }]
    }));
  };

  // Function to remove a line item
  const removeLineItem = (index: number) => {
    if (formData.line_items.length > 2) {
      setFormData(prev => ({
        ...prev,
        line_items: prev.line_items.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Entry Date"
          type="date"
          value={formData.entry_date}
          onChange={(e) => setFormData(prev => ({ ...prev, entry_date: e.target.value }))}
          required
        />
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Journal entry description"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Line Items
          </label>
          <Button type="button" size="sm" onClick={addLineItem}>
            Add Line
          </Button>
        </div>

        <div className="space-y-2">
          {formData.line_items.map((line, index) => (
            <div key={index} className="flex gap-2 p-2 border rounded items-center">
              <div className="grid grid-cols-4 gap-2 flex-grow">
                <select
                  className="px-2 py-1 border rounded text-sm w-full"
                  value={line.account_name}
                  onChange={(e) => {
                    const newLines = [...formData.line_items];
                    newLines[index].account_name = e.target.value;
                    setFormData(prev => ({ ...prev, line_items: newLines }));
                  }}
                >
                  <option value="">Select Account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.account_number}>
                      {acc.account_number} - {acc.account_name}
                    </option>
                  ))}
                </select>
                <input
                  placeholder="Description"
                  className="px-2 py-1 border rounded text-sm"
                  value={line.description}
                  onChange={(e) => {
                    const newLines = [...formData.line_items];
                    newLines[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, line_items: newLines }));
                  }}
                />
                <input
                  type="number"
                  placeholder="Debit"
                  className="px-2 py-1 border rounded text-sm text-right"
                  value={line.debit_amount || ''}
                  onChange={(e) => {
                    const newLines = [...formData.line_items];
                    newLines[index].debit_amount = parseFloat(e.target.value) || 0;
                    newLines[index].credit_amount = 0; // Clear credit if debit is set
                    setFormData(prev => ({ ...prev, line_items: newLines }));
                  }}
                />
                <input
                  type="number"
                  placeholder="Credit"
                  className="px-2 py-1 border rounded text-sm text-right"
                  value={line.credit_amount || ''}
                  onChange={(e) => {
                    const newLines = [...formData.line_items];
                    newLines[index].credit_amount = parseFloat(e.target.value) || 0;
                    newLines[index].debit_amount = 0; // Clear debit if credit is set
                    setFormData(prev => ({ ...prev, line_items: newLines }));
                  }}
                />
              </div>
              {formData.line_items.length > 2 && (
                <button type="button" onClick={() => removeLineItem(index)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 mt-2 text-sm font-medium">
          <div className={totalDebit !== totalCredit ? 'text-red-600' : 'text-green-600'}>
            Total Debit: {totalDebit.toLocaleString('sv-SE')}
          </div>
          <div className={totalDebit !== totalCredit ? 'text-red-600' : 'text-green-600'}>
            Total Credit: {totalCredit.toLocaleString('sv-SE')}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isBalanced || totalDebit === 0}>
          {initialData ? 'Update Entry' : 'Create Entry'}
        </Button>
      </div>
    </form>
  );
};