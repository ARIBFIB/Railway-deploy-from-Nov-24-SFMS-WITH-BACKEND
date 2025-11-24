import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Printer, FileText, Trash2, Check, List } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import type { Account, UpdateAccountData } from '../services/accountService';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: UpdateAccountData) => void;
  account: Account | null;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  account
}) => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    account_number: '',
    account_name: '',
    opening_balance: '0,00',
    is_active: 'yes',
    sru: '',
    vat_code: '',
    automatic_accounting: '',
    suggest_debit_credit: 'debit',
    transaction_info: 'mandatory',
    suggest_transaction_info: '',
    budget_distribution: 'sek',
    budget_rows: [
      {
        id: 1,
        cost_center: 'Unspecified',
        annual_budget: '0,00',
        percentage: '0.00',
        months: {
          jan: '0,00',
          feb: '0,00',
          mar: '0,00',
          apr: '0,00',
          may: '0,00',
          jun: '0,00',
          jul: '0,00',
          aug: '0,00',
          sep: '0,00',
          oct: '0,00',
          nov: '0,00',
          dec: '0,00'
        }
      }
    ]
  });

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(true);
  const [showBudget, setShowBudget] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when account prop changes
  useEffect(() => {
    if (account) {
      setFormData({
        account_number: account.account_number || '',
        account_name: account.account_name || '',
        opening_balance: account.opening_balance?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
        is_active: account.is_active ? 'yes' : 'no',
        sru: account.sru || '',
        vat_code: account.vat_code || '',
        automatic_accounting: account.automatic_accounting || '',
        suggest_debit_credit: account.suggest_debit_credit || 'debit',
        transaction_info: account.transaction_info || 'mandatory',
        suggest_transaction_info: account.suggest_transaction_info || '',
        budget_distribution: account.budget_distribution || 'sek',
        budget_rows: account.budget_rows?.map((row, index) => ({
          id: index + 1,
          cost_center: row.cost_center,
          annual_budget: row.annual_budget?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
          percentage: row.percentage?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0.00',
          months: {
            jan: row.jan?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            feb: row.feb?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            mar: row.mar?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            apr: row.apr?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            may: row.may?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            jun: row.jun?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            jul: row.jul?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            aug: row.aug?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            sep: row.sep?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            oct: row.oct?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            nov: row.nov?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00',
            dec: row.dec?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00'
          }
        })) || [{
          id: 1,
          cost_center: 'Unspecified',
          annual_budget: '0,00',
          percentage: '0.00',
          months: {
            jan: '0,00',
            feb: '0,00',
            mar: '0,00',
            apr: '0,00',
            may: '0,00',
            jun: '0,00',
            jul: '0,00',
            aug: '0,00',
            sep: '0,00',
            oct: '0,00',
            nov: '0,00',
            dec: '0,00'
          }
        }]
      });
    }
  }, [account]);

  // Prevent body scrolling and hide browser UI when modal is open
  useEffect(() => {
    if (isOpen) {
      const body = window.document.querySelector('body');
      const html = window.document.querySelector('html');
      if (body) {
        body.style.overflow = 'hidden';
        body.style.margin = '0';
        body.style.padding = '0';
      }
      if (html) {
        html.style.overflow = 'hidden';
        html.style.margin = '0';
        html.style.padding = '0';
      }
    } else {
      const body = window.document.querySelector('body');
      const html = window.document.querySelector('html');
      if (body) {
        body.style.overflow = 'unset';
        body.style.margin = 'unset';
        body.style.padding = 'unset';
      }
      if (html) {
        html.style.overflow = 'unset';
        html.style.margin = 'unset';
        html.style.padding = 'unset';
      }
    }

    return () => {
      const body = window.document.querySelector('body');
      const html = window.document.querySelector('html');
      if (body) {
        body.style.overflow = 'unset';
        body.style.margin = 'unset';
        body.style.padding = 'unset';
      }
      if (html) {
        html.style.overflow = 'unset';
        html.style.margin = 'unset';
        html.style.padding = 'unset';
      }
    };
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBudgetRowChange = (rowId: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      budget_rows: (prev.budget_rows || []).map(row => 
        row.id === rowId 
          ? { ...row, [field]: value }
          : row
      )
    }));
  };

  const handleBudgetMonthChange = (rowId: number, month: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      budget_rows: (prev.budget_rows || []).map(row => 
        row.id === rowId 
          ? { 
              ...row, 
              months: { ...row.months, [month]: value }
            }
          : row
      )
    }));
  };

  const addBudgetRow = () => {
    const currentRows = formData.budget_rows || [];
    const newId = currentRows.length > 0 ? Math.max(...currentRows.map(r => r.id)) + 1 : 1;
    setFormData(prev => ({
      ...prev,
      budget_rows: [
        ...(prev.budget_rows || []),
        {
          id: newId,
          cost_center: 'Unspecified',
          annual_budget: '0,00',
          percentage: '0.00',
          months: {
            jan: '0,00',
            feb: '0,00',
            mar: '0,00',
            apr: '0,00',
            may: '0,00',
            jun: '0,00',
            jul: '0,00',
            aug: '0,00',
            sep: '0,00',
            oct: '0,00',
            nov: '0,00',
            dec: '0,00',
            christmas: '0,00'
          }
        }
      ]
    }));
  };

  const removeBudgetRow = (rowId: number) => {
    setFormData(prev => ({
      ...prev,
      budget_rows: (prev.budget_rows || []).filter(row => row.id !== rowId)
    }));
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.account_number.trim()) {
      newErrors.account_number = 'Account number is required';
    }
    if (!formData.account_name.trim()) {
      newErrors.account_name = 'Account name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!account?.id) {
      setErrors({ general: 'Account ID is missing' });
      return;
    }

    const updateData: UpdateAccountData = {
      id: account.id,
      account_number: formData.account_number,
      account_name: formData.account_name,
      vat_code: formData.vat_code,
      sru: formData.sru,
      // atm: '', // Add ATM field if needed
      opening_balance: parseFloat(formData.opening_balance?.replace(',', '.') || '0'),
      budget: 0, // Add budget field if needed
      is_active: formData.is_active === 'yes',
      automatic_accounting: formData.automatic_accounting,
      suggest_debit_credit: formData.suggest_debit_credit as 'debit' | 'credit',
      transaction_info: formData.transaction_info as 'mandatory' | 'allowed' | 'not_allowed',
      suggest_transaction_info: formData.suggest_transaction_info,
      budget_distribution: formData.budget_distribution as 'sek' | 'percent',
      budget_rows: formData.budget_rows?.map((row) => ({
        cost_center: row.cost_center,
        annual_budget: parseFloat(row.annual_budget?.replace(',', '.') || '0'),
        percentage: parseFloat(row.percentage?.replace(',', '.') || '0'),
        jan: parseFloat(row.months.jan?.replace(',', '.') || '0'),
        feb: parseFloat(row.months.feb?.replace(',', '.') || '0'),
        mar: parseFloat(row.months.mar?.replace(',', '.') || '0'),
        apr: parseFloat(row.months.apr?.replace(',', '.') || '0'),
        may: parseFloat(row.months.may?.replace(',', '.') || '0'),
        jun: parseFloat(row.months.jun?.replace(',', '.') || '0'),
        jul: parseFloat(row.months.jul?.replace(',', '.') || '0'),
        aug: parseFloat(row.months.aug?.replace(',', '.') || '0'),
        sep: parseFloat(row.months.sep?.replace(',', '.') || '0'),
        oct: parseFloat(row.months.oct?.replace(',', '.') || '0'),
        nov: parseFloat(row.months.nov?.replace(',', '.') || '0'),
        dec: parseFloat(row.months.dec?.replace(',', '.') || '0'),
        christmas: 0
      }))
    };

    onSave(updateData);
  };

  const handleCancel = () => {
    setFormData({
      account_number: '',
      account_name: '',
      vat_code: '',
      sru: '',
      opening_balance: '0,00',
      is_active: 'yes',
      automatic_accounting: '',
      suggest_debit_credit: 'debit',
      transaction_info: 'mandatory',
      suggest_transaction_info: '',
      budget_distribution: 'sek',
      budget_rows: []
    });
    setErrors({});
    onClose();
  };

  // const handleShowList = () => {
  //   onClose();
  //   navigate('/account-plan');
  // };

  if (!isOpen || !account) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden">
        {/* Header Navigation */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300">
              <Plus className="w-4 h-4" />
              <span>Create account</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-400 text-gray-800 rounded text-sm hover:bg-yellow-500">
              <List className="w-4 h-4" />
              <span>Show list</span>
            </button>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex items-center space-x-4 p-4 border-b border-gray-200">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <Printer className="w-4 h-4" />
            <span>Account analysis</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
            <FileText className="w-4 h-4" />
            <span>Copy account</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="space-y-6">
            {/* Main Account Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">ACCOUNT - EDIT</h2>
              
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account number</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => handleInputChange('account_number', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.account_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter account number"
                  />
                  {errors.account_number && (
                    <p className="mt-1 text-sm text-red-600">{errors.account_number}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => handleInputChange('account_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.account_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter account name"
                  />
                  {errors.account_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.account_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening balance</label>
                  <input
                    type="text"
                    value={formData.opening_balance}
                    onChange={(e) => handleInputChange('opening_balance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active</label>
                  <div className="flex rounded border border-gray-300">
                    <button
                      onClick={() => handleInputChange('is_active', 'yes')}
                      className={`flex-1 px-3 py-2 text-sm ${
                        formData.is_active === 'yes'
                          ? 'bg-white text-gray-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleInputChange('is_active', 'no')}
                      className={`flex-1 px-3 py-2 text-sm border-l border-gray-300 ${
                        formData.is_active === 'no'
                          ? 'bg-white text-gray-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <button
                onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
                className="flex items-center space-x-2 text-lg font-semibold text-gray-900"
              >
                <Check className="w-5 h-5 text-green-500" />
                <span>Additional information</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showAdditionalInfo ? 'rotate-90' : ''}`} />
              </button>

              {showAdditionalInfo && (
                <div className="grid grid-cols-3 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SRU</label>
                    <input
                      type="text"
                      value={formData.sru}
                      onChange={(e) => handleInputChange('sru', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">VAT code (VAT box)</label>
                    <select
                      value={formData.vat_code}
                      onChange={(e) => handleInputChange('vat_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select VAT code</option>
                      <option value="7201">7201</option>
                      <option value="7202">7202</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Automatic accounting</label>
                    <input
                      type="text"
                      value={formData.automatic_accounting}
                      onChange={(e) => handleInputChange('automatic_accounting', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suggest debit/credit</label>
                    <div className="flex rounded border border-gray-300">
                      <button
                        onClick={() => handleInputChange('suggest_debit_credit', 'debit')}
                        className={`flex-1 px-3 py-2 text-sm ${
                          formData.suggest_debit_credit === 'debit'
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        Debit
                      </button>
                      <button
                        onClick={() => handleInputChange('suggest_debit_credit', 'credit')}
                        className={`flex-1 px-3 py-2 text-sm border-l border-gray-300 ${
                          formData.suggest_debit_credit === 'credit'
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        Credit
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction info</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleInputChange('transaction_info', 'mandatory')}
                        className={`px-3 py-2 text-sm rounded ${
                          formData.transaction_info === 'mandatory'
                            ? 'bg-white text-gray-900 border border-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Mandatory
                      </button>
                      <button
                        onClick={() => handleInputChange('transaction_info', 'allowed')}
                        className={`px-3 py-2 text-sm rounded ${
                          formData.transaction_info === 'allowed'
                            ? 'bg-white text-gray-900 border border-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Allowed
                      </button>
                      <button
                        onClick={() => handleInputChange('transaction_info', 'not_allowed')}
                        className={`px-3 py-2 text-sm rounded ${
                          formData.transaction_info === 'not_allowed'
                            ? 'bg-white text-gray-900 border border-gray-300'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        Not allowed
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suggest transaction info</label>
                    <input
                      type="text"
                      value={formData.suggest_transaction_info}
                      onChange={(e) => handleInputChange('suggest_transaction_info', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Budget Section */}
            <div className="space-y-4">
              <button
                onClick={() => setShowBudget(!showBudget)}
                className="flex items-center space-x-2 text-lg font-semibold text-gray-900"
              >
                <Check className="w-5 h-5 text-green-500" />
                <span>Budget (Account number 3000-8999)</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showBudget ? 'rotate-90' : ''}`} />
              </button>

              {showBudget && (
                <div className="pl-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distribution</label>
                    <div className="flex rounded border border-gray-300 w-32">
                      <button
                        onClick={() => handleInputChange('budget_distribution', 'sek')}
                        className={`flex-1 px-3 py-2 text-sm ${
                          formData.budget_distribution === 'sek'
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        SEK
                      </button>
                      <button
                        onClick={() => handleInputChange('budget_distribution', 'percent')}
                        className={`flex-1 px-3 py-2 text-sm border-l border-gray-300 ${
                          formData.budget_distribution === 'percent'
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-white text-gray-700'
                        }`}
                      >
                        %
                      </button>
                    </div>
                  </div>

                  {/* Budget Table */}
                  <div className="overflow-x-auto border border-gray-300 rounded-lg">
                    <table className="w-full min-w-[1200px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[120px]">
                            COST<br/>CENTER
                          </th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[100px]">
                            ANNUAL<br/>BUDGET
                          </th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[60px]">
                            %
                          </th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">JAN</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">FEB</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">MAR</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">APR</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">MAY</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">JUN</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">JUL</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">AUG</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">SEP</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">OCT</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">NOV</th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[80px]">DEC</th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-700 border-b border-gray-300 min-w-[60px]">
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(formData.budget_rows || []).map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.cost_center}
                                onChange={(e) => handleBudgetRowChange(row.id, 'cost_center', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="Cost center"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.annual_budget}
                                onChange={(e) => handleBudgetRowChange(row.id, 'annual_budget', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.percentage}
                                onChange={(e) => handleBudgetRowChange(row.id, 'percentage', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map((month) => (
                              <td key={month} className="px-3 py-2 border-b border-gray-200">
                                <input
                                  type="text"
                                  value={row.months[month as keyof typeof row.months]}
                                  onChange={(e) => handleBudgetMonthChange(row.id, month, e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                  placeholder="0,00"
                                />
                              </td>
                            ))}
                            <td className="px-3 py-2 border-b border-gray-200 text-center">
                              <button
                                onClick={() => removeBudgetRow(row.id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <button
                      onClick={addBudgetRow}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Row</span>
                    </button>
                    <span className="text-xs text-gray-500">
                      Use comma (,) as decimal separator for Swedish format
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Delete
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAccountModal;
