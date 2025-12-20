import React, { useState, useEffect } from 'react';
import { X, Save, List, HelpCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Printer, FileText, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountData: any) => void;
}

const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    account: '',
    name: '',
    accountType: 'asset',
    openingBalance: '0,00',
    isActive: 'yes',
    sru: '',
    vatCode: '',
    automaticAccounting: '',
    suggestDebitCredit: 'debit',
    transactionInfo: 'mandatory',
    suggestTransactionInfo: '',
    budgetDistribution: 'sek',
    budgetRows: [
      {
        id: 1,
        costCenter: 'Unspecified',
        annualBudget: '0,00',
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
  });

  const [showAdditionalInfo, setShowAdditionalInfo] = useState(true);
  const [showBudget, setShowBudget] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Ensure budgetRows is always initialized
  useEffect(() => {
    if (!formData.budgetRows || formData.budgetRows.length === 0) {
      setFormData(prev => ({
        ...prev,
        budgetRows: [
          {
            id: 1,
            costCenter: 'Unspecified',
            annualBudget: '0,00',
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
    }
  }, []);

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
      budgetRows: (prev.budgetRows || []).map(row =>
        row.id === rowId
          ? { ...row, [field]: value }
          : row
      )
    }));
  };

  const handleBudgetMonthChange = (rowId: number, month: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      budgetRows: (prev.budgetRows || []).map(row =>
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
    const currentRows = formData.budgetRows || [];
    const newId = currentRows.length > 0 ? Math.max(...currentRows.map(r => r.id)) + 1 : 1;
    setFormData(prev => ({
      ...prev,
      budgetRows: [
        ...(prev.budgetRows || []),
        {
          id: newId,
          costCenter: 'Unspecified',
          annualBudget: '0,00',
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
      budgetRows: (prev.budgetRows || []).filter(row => row.id !== rowId)
    }));
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.account.trim()) {
      newErrors.account = 'Account number is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    setFormData({
      account: '',
      name: '',
      accountType: 'asset',
      vatCode: '',
      sru: '',
      openingBalance: '0,00',
      isActive: 'yes',
      automaticAccounting: '',
      suggestDebitCredit: 'debit',
      transactionInfo: 'mandatory',
      suggestTransactionInfo: '',
      budgetDistribution: 'sek',
      budgetRows: [
        {
          id: 1,
          costCenter: 'Unspecified',
          annualBudget: '0,00',
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
    });
    setErrors({});
    onClose();
  };

  const handleShowList = () => {
    onClose();
    navigate('/account-plan');
  };

  if (!isOpen) return null;

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
              <h2 className="text-xl font-bold text-gray-900">ACCOUNT - CREATE NEW</h2>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account number</label>
                  <input
                    type="text"
                    value={formData.account}
                    onChange={(e) => handleInputChange('account', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.account ? 'border-red-500' : 'border-red-300'
                      }`}
                    placeholder="Enter account number"
                  />
                  {errors.account && (
                    <p className="mt-1 text-sm text-red-600">{errors.account}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Enter account name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opening balance</label>
                  <input
                    type="text"
                    value={formData.openingBalance}
                    onChange={(e) => handleInputChange('openingBalance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active</label>
                  <div className="flex rounded border border-gray-300">
                    <button
                      onClick={() => handleInputChange('isActive', 'yes')}
                      className={`flex-1 px-3 py-2 text-sm ${formData.isActive === 'yes'
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleInputChange('isActive', 'no')}
                      className={`flex-1 px-3 py-2 text-sm border-l border-gray-300 ${formData.isActive === 'no'
                        ? 'bg-white text-gray-900'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                  </select>
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
                      value={formData.vatCode}
                      onChange={(e) => handleInputChange('vatCode', e.target.value)}
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
                      value={formData.automaticAccounting}
                      onChange={(e) => handleInputChange('automaticAccounting', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suggest debit/credit</label>
                    <div className="flex rounded border border-gray-300">
                      <button
                        onClick={() => handleInputChange('suggestDebitCredit', 'debit')}
                        className={`flex-1 px-3 py-2 text-sm ${formData.suggestDebitCredit === 'debit'
                          ? 'bg-gray-200 text-gray-900'
                          : 'bg-white text-gray-700'
                          }`}
                      >
                        Debit
                      </button>
                      <button
                        onClick={() => handleInputChange('suggestDebitCredit', 'credit')}
                        className={`flex-1 px-3 py-2 text-sm border-l border-gray-300 ${formData.suggestDebitCredit === 'credit'
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
                        onClick={() => handleInputChange('transactionInfo', 'mandatory')}
                        className={`px-3 py-2 text-sm rounded ${formData.transactionInfo === 'mandatory'
                          ? 'bg-white text-gray-900 border border-gray-300'
                          : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        Mandatory
                      </button>
                      <button
                        onClick={() => handleInputChange('transactionInfo', 'allowed')}
                        className={`px-3 py-2 text-sm rounded ${formData.transactionInfo === 'allowed'
                          ? 'bg-white text-gray-900 border border-gray-300'
                          : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        Allowed
                      </button>
                      <button
                        onClick={() => handleInputChange('transactionInfo', 'not_allowed')}
                        className={`px-3 py-2 text-sm rounded ${formData.transactionInfo === 'not_allowed'
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
                      value={formData.suggestTransactionInfo}
                      onChange={(e) => handleInputChange('suggestTransactionInfo', e.target.value)}
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
                        onClick={() => handleInputChange('budgetDistribution', 'sek')}
                        className={`flex-1 px-3 py-2 text-sm ${formData.budgetDistribution === 'sek'
                          ? 'bg-gray-200 text-gray-900'
                          : 'bg-white text-gray-700'
                          }`}
                      >
                        SEK
                      </button>
                      <button
                        onClick={() => handleInputChange('budgetDistribution', 'percent')}
                        className={`flex-1 px-3 py-2 text-sm border-l border-gray-300 ${formData.budgetDistribution === 'percent'
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
                            COST<br />CENTER
                          </th>
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[100px]">
                            ANNUAL<br />BUDGET
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
                          <th className="px-3 py-3 text-xs font-medium text-gray-700 border-b border-gray-300 text-center min-w-[100px]">CHRISTMAS</th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-700 border-b border-gray-300 min-w-[60px]">
                            <Trash2 className="w-4 h-4 mx-auto" />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(formData.budgetRows || []).map((row) => (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.costCenter}
                                onChange={(e) => handleBudgetRowChange(row.id, 'costCenter', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="Cost center"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.annualBudget}
                                onChange={(e) => handleBudgetRowChange(row.id, 'annualBudget', e.target.value)}
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
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.jan}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'jan', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.feb}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'feb', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.mar}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'mar', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.apr}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'apr', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.may}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'may', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.jun}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'jun', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.jul || '0,00'}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'jul', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.aug}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'aug', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.sep}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'sep', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.oct}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'oct', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.nov}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'nov', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.dec}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'dec', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="px-3 py-2 border-b border-gray-200">
                              <input
                                type="text"
                                value={row.months.christmas || '0,00'}
                                onChange={(e) => handleBudgetMonthChange(row.id, 'christmas', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                                placeholder="0,00"
                              />
                            </td>
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

export default CreateAccountModal;
