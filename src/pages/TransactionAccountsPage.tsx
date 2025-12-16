import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ExternalLink, List, HelpCircle, Info } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { transactionAccountsService } from '../services/transactionAccountsService';

interface TransactionAccount {
  id: string;
  name: string;
  bankPaymentService: string;
  bankTransfer: string;
  plusgiro: string;
  iban: string;
  integration: string;
  swishNumber: string;
}

const mockTransactionAccounts: TransactionAccount[] = [
  {
    id: '1',
    name: 'Main Account',
    bankPaymentService: 'Danish bank',
    bankTransfer: '',
    plusgiro: '',
    iban: '',
    integration: '',
    swishNumber: ''
  }
];

export const TransactionAccountsPage: React.FC = () => {
  const [defaultAccounts, setDefaultAccounts] = useState({
    defaultMainAccount: 'Main Account',
    defaultAccountCustomerInvoice: 'Main Account',
    preselectedSalaryAccount: 'Main Account',
    preselectedAccountDirectDebit: 'Main Account',
    linkedToPaymentAccount: 'Main Account'
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [transactionAccounts, setTransactionAccounts] = useState<TransactionAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load transaction accounts from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const apiAccounts = await transactionAccountsService.list();
        if (!mounted) return;
        // Map API data to UI format
        const mapped: TransactionAccount[] = apiAccounts.map(a => ({
          id: a.id,
          name: a.account_name || a.name || 'Unnamed Account',
          bankPaymentService: '', // Not in API yet
          bankTransfer: '', // Not in API yet
          plusgiro: '', // Not in API yet
          iban: '', // Not in API yet
          integration: '', // Not in API yet
          swishNumber: '' // Not in API yet
        }));
        setTransactionAccounts(mapped);
      } catch (e) {
        console.error('Failed to load transaction accounts', e);
        setError('Failed to load transaction accounts');
        setTransactionAccounts([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDefaultAccountChange = (field: string, value: string) => {
    setDefaultAccounts(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving default accounts:', defaultAccounts);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-green-800 uppercase tracking-wide">REGISTER - TRANSACTION ACCOUNTS</h1>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create transaction account
        </Button>
      </div>

      {/* Default Account Configuration */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Default Account Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default main account</label>
              <div className="flex items-center gap-2">
                <select
                  value={defaultAccounts.defaultMainAccount}
                  onChange={(e) => handleDefaultAccountChange('defaultMainAccount', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Main Account">Main Account</option>
                  <option value="Secondary Account">Secondary Account</option>
                  <option value="Business Account">Business Account</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default account customer invoice</label>
              <div className="flex items-center gap-2">
                <select
                  value={defaultAccounts.defaultAccountCustomerInvoice}
                  onChange={(e) => handleDefaultAccountChange('defaultAccountCustomerInvoice', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Main Account">Main Account</option>
                  <option value="Secondary Account">Secondary Account</option>
                  <option value="Business Account">Business Account</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="mt-2">
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Go to: Manage currency account
                </a>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pre-selected salary account</label>
              <div className="flex items-center gap-2">
                <select
                  value={defaultAccounts.preselectedSalaryAccount}
                  onChange={(e) => handleDefaultAccountChange('preselectedSalaryAccount', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Main Account">Main Account</option>
                  <option value="Secondary Account">Secondary Account</option>
                  <option value="Business Account">Business Account</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pre-selected account direct debit</label>
              <div className="flex items-center gap-2">
                <select
                  value={defaultAccounts.preselectedAccountDirectDebit}
                  onChange={(e) => handleDefaultAccountChange('preselectedAccountDirectDebit', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Main Account">Main Account</option>
                  <option value="Secondary Account">Secondary Account</option>
                  <option value="Business Account">Business Account</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Linked to payment account</label>
              <div className="flex items-center gap-2">
                <select
                  value={defaultAccounts.linkedToPaymentAccount}
                  onChange={(e) => handleDefaultAccountChange('linkedToPaymentAccount', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Main Account">Main Account</option>
                  <option value="Secondary Account">Secondary Account</option>
                  <option value="Business Account">Business Account</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            className="bg-green-500 text-white hover:bg-green-600"
          >
            Save
          </Button>
        </div>
      </div>

      {/* Transaction Accounts Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">NAME</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">BANK/PAYMENT SERVICE</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">BANK TRANSFER</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">PLUSGIRO</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">IBAN</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">INTEGRATION</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">SWISH NUMBER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTransactionAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    {account.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {account.bankPaymentService}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {account.bankTransfer || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {account.plusgiro || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {account.iban || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {account.integration || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {account.swishNumber || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Transaction Account Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title=""
        size="xl"
      >
        <CreateTransactionAccountForm 
          onClose={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

const CreateTransactionAccountForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    accountName: '',
    accountWith: 'Other bank',
    bank: '',
    bankForInternationalPayments: '',
    bankTransfer: '',
    bankgirotCustomerNumber: '',
    clearingNumber: '',
    accountNumber: '',
    iban: '',
    bic: '',
    swishNumber: '',
    accountingAccount: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving transaction account:', formData);
    onClose();
  };

  return (
    <div className="bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-800 uppercase tracking-wide">TRANSACTION ACCOUNT - CREATE NEW</h2>
        <Button
          className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400 font-medium flex items-center gap-2"
        >
          <List className="w-4 h-4" />
          Show list
        </Button>
      </div>

      {/* Form Fields */}
      <div className="bg-white rounded-lg p-6 space-y-6">
        {/* Account name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            Account name
            <HelpCircle className="w-4 h-4 text-blue-500" />
          </label>
          <Input
            value={formData.accountName}
            onChange={(e) => handleInputChange('accountName', e.target.value)}
            placeholder="E.g. Main account"
            className="w-full"
          />
        </div>

        {/* Account with / Bank / Bank for international payments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Account with
              <HelpCircle className="w-4 h-4 text-blue-500" />
            </label>
            <div className="flex items-center gap-2">
              <select
                value={formData.accountWith}
                onChange={(e) => handleInputChange('accountWith', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Other bank">Other bank</option>
                <option value="Swedbank">Swedbank</option>
                <option value="SEB">SEB</option>
                <option value="Nordea">Nordea</option>
                <option value="Handelsbanken">Handelsbanken</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank</label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.bank}
                onChange={(e) => handleInputChange('bank', e.target.value)}
                placeholder="Fill in your bank"
                className="flex-1"
              />
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank for international payments</label>
            <div className="flex items-center gap-2">
              <Input
                value={formData.bankForInternationalPayments}
                onChange={(e) => handleInputChange('bankForInternationalPayments', e.target.value)}
                className="flex-1"
              />
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Bank transfer / Bankgirot customer number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bank transfer</label>
            <Input
              value={formData.bankTransfer}
              onChange={(e) => handleInputChange('bankTransfer', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bankgirot customer number</label>
            <Input
              value={formData.bankgirotCustomerNumber}
              onChange={(e) => handleInputChange('bankgirotCustomerNumber', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Clearing number / Account number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clearing number</label>
            <Input
              value={formData.clearingNumber}
              onChange={(e) => handleInputChange('clearingNumber', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account number</label>
            <Input
              value={formData.accountNumber}
              onChange={(e) => handleInputChange('accountNumber', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* IBAN / BIC */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
            <Input
              value={formData.iban}
              onChange={(e) => handleInputChange('iban', e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">BIC</label>
            <Input
              value={formData.bic}
              onChange={(e) => handleInputChange('bic', e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Swish number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Swish number</label>
          <Input
            value={formData.swishNumber}
            onChange={(e) => handleInputChange('swishNumber', e.target.value)}
            className="w-full"
          />
        </div>

        {/* Accounting account */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            Accounting account
            <HelpCircle className="w-4 h-4 text-blue-500" />
          </label>
          <div className="flex items-center gap-2">
            <Input
              value={formData.accountingAccount}
              onChange={(e) => handleInputChange('accountingAccount', e.target.value)}
              className="flex-1"
            />
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Informational Link */}
        <div className="pt-4 border-t border-gray-200">
          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
            <Info className="w-4 h-4" />
            Get.started.with.Annan.bank
          </a>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Save
        </Button>
      </div>
    </div>
  );
};
