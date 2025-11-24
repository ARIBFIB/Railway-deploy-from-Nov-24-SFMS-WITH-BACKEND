import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { X, Plus, Calendar, Trash2, Copy, Paperclip, ChevronDown, Upload, Image as ImageIcon } from 'lucide-react';
import { AccountService, type Account } from '../../services/accountService';
import { VerificationService, type CreateVerificationData, type VerificationEntry } from '../../services/verificationService';

interface AccountEntry {
  id: string;
  account: string;
  name: string;
  transactionInfo: string;
  debit: string;
  credit: string;
  balance: string;
}

interface VerificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  onVerificationCreated?: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  onVerificationCreated
}) => {
  const [formData, setFormData] = useState({
    description: '',
    verificationSeries: 'A - Accounting',
    accountingDate: '2025-03-04',
    accountingTemplate: '',
    amount: '',
    comment: ''
  });

  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>([
    {
      id: '1',
      account: '',
      name: '',
      transactionInfo: '',
      debit: '0.00',
      credit: '',
      balance: '0.00'
    },
    {
      id: '2',
      account: '',
      name: '',
      transactionInfo: '',
      debit: '0.00',
      credit: '',
      balance: '0.00'
    },
    {
      id: '3',
      account: '',
      name: '',
      transactionInfo: '',
      debit: '0.00',
      credit: '',
      balance: '0.00'
    }
  ]);

  // Calculate totals in real-time
  const totals = React.useMemo(() => {
    const totalDebit = accountEntries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
    const totalCredit = accountEntries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
    const difference = totalDebit - totalCredit;
    
    return {
      amount: Math.max(totalDebit, totalCredit).toFixed(2),
      difference: difference.toFixed(2)
    };
  }, [accountEntries]);

  // New state for accounts and enhanced functionality
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState<{ [key: string]: boolean }>({});

  // Load accounts when component mounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const response = await AccountService.getAccounts({ is_active: true });
        if (response.success) {
          setAccounts(response.data);
        }
      } catch (err) {
        console.error('Failed to load accounts:', err);
      }
    };

    if (isOpen) {
      loadAccounts();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAccountEntryChange = (id: string, field: string, value: string) => {
    setAccountEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };
        
        // If account number is changed, try to find matching account
        if (field === 'account' && value) {
          const matchingAccount = accounts.find(acc => acc.account_number === value);
          if (matchingAccount) {
            updatedEntry.name = matchingAccount.account_name;
          }
        }
        
        return updatedEntry;
      }
      return entry;
    }));
  };

  const handleAccountSelect = (entryId: string, account: Account) => {
    setAccountEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, account: account.account_number, name: account.account_name }
        : entry
    ));
    setShowAccountDropdown(prev => ({ ...prev, [entryId]: false }));
  };

  const toggleAccountDropdown = (entryId: string) => {
    setShowAccountDropdown(prev => ({ ...prev, [entryId]: !prev[entryId] }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedImages(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const addAccountEntry = () => {
    const newEntry: AccountEntry = {
      id: Date.now().toString(),
      account: '',
      name: '',
      transactionInfo: '',
      debit: '0.00',
      credit: '',
      balance: '0.00'
    };
    setAccountEntries(prev => [...prev, newEntry]);
  };

  const removeAccountEntry = (id: string) => {
    if (accountEntries.length > 1) {
      setAccountEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const duplicateAccountEntry = (id: string) => {
    const entryToDuplicate = accountEntries.find(entry => entry.id === id);
    if (entryToDuplicate) {
      const newEntry: AccountEntry = {
        ...entryToDuplicate,
        id: Date.now().toString()
      };
      setAccountEntries(prev => [...prev, newEntry]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.description.trim()) {
        setError('Please enter a description for the verification.');
        setLoading(false);
        return;
      }

      if (!formData.accountingDate) {
        setError('Please select an accounting date.');
        setLoading(false);
        return;
      }

      // Validate accounting date is not in the future
      const selectedDate = new Date(formData.accountingDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      if (selectedDate > today) {
        setError('Accounting date cannot be in the future.');
        setLoading(false);
        return;
      }

      // Calculate totals from entries
      const totalDebit = accountEntries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0);
      const totalCredit = accountEntries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0);
      const difference = totalDebit - totalCredit;

      // Validate account entries
      const validEntries = accountEntries.filter(entry => entry.account.trim() && entry.name.trim());
      const invalidEntries = accountEntries.filter(entry => !entry.account.trim() || !entry.name.trim());
      
      if (invalidEntries.length > 0) {
        setError('Please fill in both account number and account name for all entries.');
        setLoading(false);
        return;
      }

      // Convert account entries to the format expected by the API
      const entries: Omit<VerificationEntry, 'id' | 'verification_id' | 'created_at' | 'updated_at' | 'created_by' | 'updated_by'>[] = 
        validEntries.map(entry => ({
          account_number: entry.account,
          account_name: entry.name,
          transaction_info: entry.transactionInfo,
          debit: parseFloat(entry.debit) || 0,
          credit: parseFloat(entry.credit) || 0,
          balance: parseFloat(entry.balance) || 0
        }));

      if (entries.length === 0) {
        setError('Please add at least one account entry with valid account information.');
        setLoading(false);
        return;
      }

      // Validate that at least one entry has a non-zero amount
      const hasNonZeroAmount = entries.some(entry => entry.debit > 0 || entry.credit > 0);
      if (!hasNonZeroAmount) {
        setError('At least one account entry must have a debit or credit amount greater than zero.');
        setLoading(false);
        return;
      }

      // Upload images if any
      const uploadedImages = [];
      for (const image of selectedImages) {
        try {
          const uploadResult = await VerificationService.uploadImage(image);
          if (uploadResult.success) {
            uploadedImages.push(uploadResult.data);
          } else {
            console.warn('Failed to upload image:', image.name, uploadResult.message);
            // Continue with verification creation even if image upload fails
          }
        } catch (err) {
          console.error('Failed to upload image:', err);
          // Continue with verification creation even if image upload fails
          console.warn(`Skipping image "${image.name}" due to upload error, continuing with verification creation`);
        }
      }

      // Get next verification number
      const series = formData.verificationSeries.split(' - ')[0];
      let verificationNumber;
      try {
        const nextNumberResponse = await VerificationService.getNextVerificationNumber(series);
        if (nextNumberResponse.success) {
          verificationNumber = nextNumberResponse.data.verification_number;
        } else {
          setError('Failed to generate verification number. Please try again.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Failed to get next verification number:', err);
        setError('Failed to generate verification number. Please check your connection and try again.');
        setLoading(false);
        return;
      }

      // Prepare verification data
      const verificationData: CreateVerificationData = {
        verification_number: verificationNumber,
        verification_series: series,
        accounting_date: formData.accountingDate,
        description: formData.description,
        comment: formData.comment,
        accounting_template: formData.accountingTemplate,
        amount: Math.max(totalDebit, totalCredit),
        total_debit: totalDebit,
        total_credit: totalCredit,
        difference: difference,
        status: 'draft',
        has_person: false,
        has_comment: formData.comment && formData.comment.trim() ? true : false,
        has_gallery: selectedImages.length > 0,
        entries,
        images: uploadedImages
      };

      // Create verification
      const response = await VerificationService.createVerification(verificationData);
      
      if (response.success) {
        console.log('✅ VerificationForm - Verification created successfully:', response.data);
        
        // Close form first
        onClose();
        
        // Call sync callback to ensure data is loaded
        if (onVerificationCreated) {
          console.log('🔄 VerificationForm - Calling onVerificationCreated callback');
          onVerificationCreated();
        }
        
        if (onSave) {
          console.log('🔄 VerificationForm - Calling onSave callback');
          onSave(response.data);
        }
      } else {
        console.error('❌ VerificationForm - Failed to create verification:', response);
        setError(response.message || 'Failed to create verification. Please check your data and try again.');
      }
    } catch (err) {
      console.error('Error creating verification:', err);
      if (err instanceof Error) {
        if (err.message.includes('Network') || err.message.includes('fetch')) {
          setError('Network error: Please check your internet connection and try again.');
        } else if (err.message.includes('timeout')) {
          setError('Request timeout: The server is taking too long to respond. Please try again.');
        } else if (err.message.includes('validation') || err.message.includes('required')) {
          setError(`Validation error: ${err.message}`);
        } else {
          setError(`Error creating verification: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred while creating the verification. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">VERIFICATION A11*</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create verification
            </Button>
            <Button
              variant="secondary"
              className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
            >
              📋 Show list
            </Button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Top Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification series
              </label>
              <select
                value={formData.verificationSeries}
                onChange={(e) => handleInputChange('verificationSeries', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A - Accounting">A - Accounting</option>
                <option value="C - Cash">C - Cash</option>
                <option value="F - Finance">F - Finance</option>
                <option value="G - General">G - General</option>
                <option value="K - Kreditor">K - Kreditor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accounting date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={formData.accountingDate}
                  onChange={(e) => handleInputChange('accountingDate', e.target.value)}
                  className="w-full"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Comment Field */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment (Optional)
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional comments or notes..."
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accounting template
              </label>
              <Input
                type="text"
                placeholder="Code, Name"
                value={formData.accountingTemplate}
                onChange={(e) => handleInputChange('accountingTemplate', e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Account Entries Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACCOUNT
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TRANSACTION INFO
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DEBIT
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CREDIT
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACCOUNT BALANCE
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accountEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="relative">
                          <div className="flex">
                        <Input
                          type="text"
                          value={entry.account}
                          onChange={(e) => handleAccountEntryChange(entry.id, 'account', e.target.value)}
                              className="w-full border-0 focus:ring-1 focus:ring-blue-500 rounded-r-none"
                              placeholder="Enter account number"
                            />
                            <button
                              type="button"
                              onClick={() => toggleAccountDropdown(entry.id)}
                              className="px-2 py-1 border border-gray-300 border-l-0 rounded-r-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                          
                          {showAccountDropdown[entry.id] && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                              {accounts
                                .filter(acc => 
                                  acc.account_number.toLowerCase().includes(entry.account.toLowerCase()) ||
                                  acc.account_name.toLowerCase().includes(entry.account.toLowerCase())
                                )
                                .map((account) => (
                                  <div
                                    key={account.id}
                                    onClick={() => handleAccountSelect(entry.id, account)}
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="font-medium text-sm">{account.account_number}</div>
                                    <div className="text-xs text-gray-600">{account.account_name}</div>
                                  </div>
                                ))}
                              {accounts.filter(acc => 
                                acc.account_number.toLowerCase().includes(entry.account.toLowerCase()) ||
                                acc.account_name.toLowerCase().includes(entry.account.toLowerCase())
                              ).length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-500">No accounts found</div>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="text"
                          value={entry.name}
                          onChange={(e) => handleAccountEntryChange(entry.id, 'name', e.target.value)}
                          className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="text"
                          value={entry.transactionInfo}
                          onChange={(e) => handleAccountEntryChange(entry.id, 'transactionInfo', e.target.value)}
                          className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={entry.debit}
                            onChange={(e) => handleAccountEntryChange(entry.id, 'debit', e.target.value)}
                            className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                          />
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={entry.credit}
                            onChange={(e) => handleAccountEntryChange(entry.id, 'credit', e.target.value)}
                            className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                          />
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <Trash2 className="w-4 h-4 text-gray-400" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={entry.balance}
                            onChange={(e) => handleAccountEntryChange(entry.id, 'balance', e.target.value)}
                            className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                            readOnly
                          />
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <Trash2 className="w-4 h-4 text-gray-400" />
                          <Plus 
                            className="w-4 h-4 text-green-600 cursor-pointer hover:text-green-800"
                            onClick={addAccountEntry}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => duplicateAccountEntry(entry.id)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Duplicate row"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeAccountEntry(entry.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete row"
                            disabled={accountEntries.length <= 1}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Attach Images (Optional)</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-600">
                  {selectedImages.length} image(s) selected
                </span>
              </div>
              
              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{image.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Balance Check */}
          {parseFloat(totals.difference) !== 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-yellow-800 text-sm">
                  ⚠️ Verification is not balanced. Difference: {totals.difference}
                </div>
              </div>
            </div>
          )}

          {/* Totals Section */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Debit:</span>
                    <span>{accountEntries.reduce((sum, entry) => sum + (parseFloat(entry.debit) || 0), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Credit:</span>
                    <span>{accountEntries.reduce((sum, entry) => sum + (parseFloat(entry.credit) || 0), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Difference:</span>
                    <span className={parseFloat(totals.difference) === 0 ? 'text-green-600' : 'text-red-600'}>
                      {totals.difference}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Book'}
          </Button>
        </div>
      </div>
    </div>
  );
};
