import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { X, Plus, Calendar, Trash2, Copy, Paperclip, ChevronDown, Upload, Image as ImageIcon, GripVertical } from 'lucide-react';
import { AccountService, type Account } from '../../services/accountService';
import { VerificationService, type CreateVerificationData, type VerificationEntry } from '../../services/verificationService';
import { accountingViewSettingsService, type AccountingViewSettings } from '../../services/accountingViewSettingsService';
import { verificationSeriesService, type VerificationSeriesItem } from '../../services/verificationSeriesService';
import type { AccountingTemplate } from '../../services/verificationService';

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
  initialData?: any; // Consider typing this properly if possible, but 'any' allows flexibility for now
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  onVerificationCreated,
  initialData
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
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [showAccountDropdown, setShowAccountDropdown] = useState<{ [key: string]: boolean }>({});
  const [accountingViewSettings, setAccountingViewSettings] = useState<AccountingViewSettings>({
    enable_transaction_info: true,
    include_transaction_info_when_tab_entering: false,
    show_account_balance_column_in_posting_view: true
  });
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // State for description dropdown
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [showDescriptionDropdown, setShowDescriptionDropdown] = useState(false);
  const [filteredDescriptions, setFilteredDescriptions] = useState<string[]>([]);

  // Ref for description dropdown
  const descriptionDropdownRef = React.useRef<HTMLDivElement>(null);

  // State for verification series
  const [verificationSeries, setVerificationSeries] = useState<VerificationSeriesItem[]>([]);

  // State for accounting templates
  const [accountingTemplates, setAccountingTemplates] = useState<AccountingTemplate[]>([]);

  // Load accounts and settings when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load accounts
        const accountsResponse = await AccountService.getAccounts({ is_active: true });
        if (accountsResponse.success) {
          setAccounts(accountsResponse.data);
        }

        // Load accounting view settings
        const settings = await accountingViewSettingsService.getSettings();
        setAccountingViewSettings(settings);
        setSettingsLoaded(true);

        // Load descriptions for dropdown
        try {
          const descriptionResponse = await VerificationService.getUniqueDescriptions();
          if (descriptionResponse.success) {
            setDescriptions(descriptionResponse.data);
            // Set filtered descriptions to all descriptions when loaded
            setFilteredDescriptions(descriptionResponse.data);
          }
        } catch (descErr) {
          console.error('Failed to load descriptions:', descErr);
        }

        // Load verification series from settings (only selected ones)
        try {
          const selectedSeries = await verificationSeriesService.getSelectedSeries('accounting');
          setVerificationSeries(selectedSeries);
        } catch (seriesErr) {
          console.error('Failed to load verification series:', seriesErr);
          // Fallback to default series if API fails
          setVerificationSeries([
            { id: '1', code: 'A - Accounting', name: 'Accounting', manualAccounting: true, position: 0 },
            { id: '2', code: 'C - Cash', name: 'Cash', manualAccounting: true, position: 1 },
            { id: '3', code: 'F - Finance', name: 'Finance', manualAccounting: true, position: 2 },
            { id: '4', code: 'G - General', name: 'General', manualAccounting: true, position: 3 },
            { id: '5', code: 'K - Kreditor', name: 'Kreditor', manualAccounting: true, position: 4 }
          ]);
        }

        // Load accounting templates
        try {
          const templatesResponse = await VerificationService.getAccountingTemplates();
          if (templatesResponse.success) {
            setAccountingTemplates(templatesResponse.data);
          }
        } catch (templateErr) {
          console.error('Failed to load accounting templates:', templateErr);
          setAccountingTemplates([]);
        }
      } catch (err) {
        console.error('Failed to load data:', err);
        setSettingsLoaded(true); // Still set to true to prevent hanging
      }
    };

    if (isOpen) {
      loadData();
    } else {
      setSettingsLoaded(false); // Reset when closed
    }
  }, [isOpen]);

  // Populate form with initial data if provided (Editing mode)
  useEffect(() => {
    if (settingsLoaded && verificationSeries.length > 0 && isOpen && initialData) {
      console.log('🔄 VerificationForm - Populating with initialData:', initialData);
      setFormData({
        description: initialData.description || '',
        verificationSeries: initialData.verification_series || (verificationSeries.length > 0 ? verificationSeries[0].code : 'A - Accounting'),
        accountingDate: initialData.accounting_date || new Date().toISOString().split('T')[0],
        accountingTemplate: initialData.accounting_template || '',
        amount: initialData.amount ? initialData.amount.toString() : '',
        comment: initialData.comment || ''
      });

      // Populate entries if available
      if (initialData.entries && initialData.entries.length > 0) {
        const mappedEntries = initialData.entries.map((entry: any) => ({
          id: entry.id || Date.now().toString() + Math.random(),
          account: entry.account_number || '',
          name: entry.account_name || '',
          transactionInfo: accountingViewSettings.enable_transaction_info ? (entry.transaction_info || '') : '',
          debit: entry.debit ? entry.debit.toString() : '0.00',
          credit: entry.credit ? entry.credit.toString() : '0.00',
          balance: accountingViewSettings.show_account_balance_column_in_posting_view ? (entry.balance ? entry.balance.toString() : '0.00') : '0.00'
        }));
        setAccountEntries(mappedEntries);
      }

      // Populate images if available
      if (initialData.images && initialData.images.length > 0) {
        setExistingImages(initialData.images);
      } else {
        setExistingImages([]);
      }
    } else if (settingsLoaded && verificationSeries.length > 0 && isOpen && !initialData) {
      // Reset form if opening in create mode
      setFormData({
        description: '',
        verificationSeries: verificationSeries.length > 0 ? verificationSeries[0].code : 'A - Accounting',
        accountingDate: new Date().toISOString().split('T')[0],
        accountingTemplate: '',
        amount: '',
        comment: ''
      });
      setAccountEntries([
        { id: '1', account: '', name: '', transactionInfo: accountingViewSettings.enable_transaction_info ? '' : '', debit: '0.00', credit: '', balance: accountingViewSettings.show_account_balance_column_in_posting_view ? '0.00' : '0.00' },
        { id: '2', account: '', name: '', transactionInfo: accountingViewSettings.enable_transaction_info ? '' : '', debit: '0.00', credit: '', balance: accountingViewSettings.show_account_balance_column_in_posting_view ? '0.00' : '0.00' }
      ]);
      setSelectedImages([]);
    }
  }, [isOpen, initialData, settingsLoaded, descriptions, verificationSeries]);

  // Watch for changes in amount and template to update account entries
  useEffect(() => {
    if (formData.accountingTemplate && formData.amount) {
      const template = accountingTemplates.find(t => t.id === formData.accountingTemplate);
      if (template) {
        updateAccountEntriesFromTemplate(template, parseFloat(formData.amount));
      }
    }
  }, [formData.accountingTemplate, formData.amount, accountingTemplates]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Filter descriptions when typing in description field
    if (field === 'description') {
      const filtered = descriptions.filter(desc =>
        desc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDescriptions(filtered);
      // Show dropdown if there are filtered results
      if (value.length > 0) {
        setShowDescriptionDropdown(filtered.length > 0);
      }
    }
  };

  const handleDescriptionSelect = (description: string) => {
    setFormData(prev => ({
      ...prev,
      description
    }));
    setShowDescriptionDropdown(false);
  };



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (descriptionDropdownRef.current && !descriptionDropdownRef.current.contains(event.target as Node)) {
        setShowDescriptionDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAccountEntryChange = (id: string, field: string, value: string) => {
    setAccountEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updatedEntry = { ...entry, [field]: value };

        // If account number is changed, try to find matching account
        if (field === 'account' && value) {
          const matchingAccount = accounts.find(acc => acc.account_number === value);
          if (matchingAccount) {
            updatedEntry.name = (matchingAccount && typeof matchingAccount.account_name === 'string') ? matchingAccount.account_name : value;
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
        ? { ...entry, account: account.account_number, name: (account && typeof account.account_name === 'string') ? account.account_name : account.account_number }
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

  const removeExistingImage = (id: string) => {
    setExistingImages(prev => prev.filter(img => img.id !== id));
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = accountingTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        accountingTemplate: templateId, // Store the template ID
        description: template.description,
        verificationSeries: template.verificationSeries
      }));
      
      // If there's an amount entered, update the account entries based on the template
      if (formData.amount) {
        updateAccountEntriesFromTemplate(template, parseFloat(formData.amount));
      }
    }
  };

  const updateAccountEntriesFromTemplate = (template: AccountingTemplate, amount: number) => {
    const newEntries: AccountEntry[] = [];
    
    template.transactions.forEach((transaction, index) => {
      // Calculate the value based on the formula
      let calculatedValue = 0;
      if (transaction.formula) {
        // Simple formula evaluation - in a real implementation, you might want to use a proper formula parser
        // For now, we'll support both fixed formulas and formulas that use the amount variable
        try {
          // Check if the formula contains the word "amount" to decide how to process it
          let formula = transaction.formula;
          if (formula.includes('amount')) {
            // If the formula contains "amount", replace it with the actual amount value
            formula = formula.replace(/\bamount\b/g, amount.toString());
          } else {
            // If the formula doesn't contain "amount", multiply the entire formula result by the amount
            // For example, if formula is "2+2" and amount is 2, result should be (2+2)*2 = 8
            if (amount && amount !== 0) {
              formula = '(' + formula + ')*' + amount;
            }
          }
          
          // For more complex formulas, a proper parser would be needed
          formula = formula.replace(/\s/g, ''); // Remove spaces
          
          // Simple evaluation for basic operations
          if (formula.includes('+') || formula.includes('-') || formula.includes('*') || formula.includes('/')) {
            // Use Function constructor as a safer alternative to eval for simple expressions
            calculatedValue = Function('"use strict"; return (' + formula + ')')();
          } else {
            calculatedValue = parseFloat(formula) || 0;
          }
        } catch (e) {
          console.error('Error evaluating formula:', transaction.formula, e);
          calculatedValue = 0;
        }
      }
      
      // Determine if it's a debit or credit based on the calculated value
      const isDebit = calculatedValue > 0;
      
      // Extract account number from the transaction.account field
      // The transaction.account might be a string like "1 - car" or just "1", or an object
      let accountNumber = '';
      if (typeof transaction.account === 'string') {
        // If it's in format like "1 - car", extract just the number part
        if (transaction.account.includes(' - ')) {
          accountNumber = transaction.account.split(' - ')[0];
        } else {
          accountNumber = transaction.account;
        }
      } else if (typeof transaction.account === 'object' && transaction.account !== null) {
        // If transaction.account is an object, it might have an account_number property
        if (transaction.account.account_number) {
          accountNumber = transaction.account.account_number;
        } else if (transaction.account.id) {
          // Or it might have an id property
          accountNumber = transaction.account.id;
        } else {
          // Try to get any string representation
          accountNumber = String(transaction.account) || '';
        }
      } else {
        // If transaction.account is neither string nor object, convert to string
        accountNumber = String(transaction.account || '');
      }
      
      // Find account details if available
      const accountDetails = accounts.find(acc => acc.account_number === accountNumber);
      
      const newEntry: AccountEntry = {
        id: `template-${template.id}-entry-${index}`,
        account: accountNumber, // Use the extracted account number
        name: (accountDetails && typeof accountDetails.account_name === 'string') ? accountDetails.account_name : (accountNumber || ''), // Ensure name is always a string
        transactionInfo: transaction.transactionInfo || transaction.transaction_info || transaction.description || '', // Ensure transaction info is set properly - checking multiple possible field names
        debit: isDebit ? Math.abs(calculatedValue).toFixed(2) : '0.00', // Use absolute value to ensure positive in debit
        credit: isDebit ? '0.00' : Math.abs(calculatedValue).toFixed(2), // Credit gets absolute value if calculatedValue is negative
        balance: accountingViewSettings.show_account_balance_column_in_posting_view ? '0.00' : '0.00'
      };
      
      newEntries.push(newEntry);
    });
    
    setAccountEntries(newEntries);
  };

  const addAccountEntry = () => {
    const newEntry: AccountEntry = {
      id: Date.now().toString(),
      account: '',
      name: '',
      transactionInfo: accountingViewSettings.enable_transaction_info ? '' : '',
      debit: '0.00',
      credit: '',
      balance: accountingViewSettings.show_account_balance_column_in_posting_view ? '0.00' : '0.00'
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
        id: Date.now().toString(),
        transactionInfo: accountingViewSettings.enable_transaction_info ? entryToDuplicate.transactionInfo : '',
        balance: accountingViewSettings.show_account_balance_column_in_posting_view ? entryToDuplicate.balance : '0.00'
      };
      setAccountEntries(prev => [...prev, newEntry]);
    }
  };

  // Drag and drop handlers
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const onDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newEntries = [...accountEntries];
    const draggedItem = newEntries[draggedItemIndex];
    newEntries.splice(draggedItemIndex, 1);
    newEntries.splice(index, 0, draggedItem);

    setDraggedItemIndex(index);
    setAccountEntries(newEntries);
  };

  const onDragEnd = () => {
    setDraggedItemIndex(null);
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
      const validEntries = accountEntries.filter(entry => (entry.account || '').toString().trim() && (entry.name || '').toString().trim());
      const invalidEntries = accountEntries.filter(entry => !(entry.account || '').toString().trim() || !(entry.name || '').toString().trim());

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
          transaction_info: accountingViewSettings.enable_transaction_info ? entry.transactionInfo : '',
          debit: parseFloat(entry.debit) || 0,
          credit: parseFloat(entry.credit) || 0,
          balance: accountingViewSettings.show_account_balance_column_in_posting_view ? parseFloat(entry.balance) || 0 : 0
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

      // Get verification number
      const series = formData.verificationSeries.split(' - ')[0];
      let verificationNumber = '';
      if (initialData && initialData.verification_number) {
        verificationNumber = initialData.verification_number;
      } else {
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
        has_gallery: (selectedImages.length + existingImages.length) > 0,
        entries,
        images: [...existingImages, ...uploadedImages]
      };

      let response;
      if (initialData && initialData.id) {
        console.log('🔄 VerificationForm - Updating existing verification:', initialData.id);
        response = await VerificationService.updateVerification(initialData.id, verificationData);
      } else {
        console.log('🔄 VerificationForm - Creating new verification');
        response = await VerificationService.createVerification(verificationData);
      }

      if (response.success) {
        console.log('✅ VerificationForm - Operation successful:', response.data);

        // Close form first
        onClose();

        // Call sync callback to ensure data is loaded
        if (onVerificationCreated) {
          console.log('🔄 VerificationForm - Calling callback');
          onVerificationCreated();
        }

        if (onSave) {
          onSave(response.data);
        }
      } else {
        console.error('❌ VerificationForm - Failed:', response);
        setError(response.message || 'Operation failed. Please check your data and try again.');
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
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? `VERIFICATION ${initialData.verification_number}` : 'NEW VERIFICATION'}
          </h2>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              {initialData ? 'Edit Verification' : 'Create verification'}
            </Button>
            <Button
              variant="secondary"
              className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
              onClick={onClose}
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
            <div className="relative" ref={descriptionDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onClick={() => {
                    if (formData.description.trim() === '') {
                      setFilteredDescriptions(descriptions);
                      setShowDescriptionDropdown(true);
                    } else {
                      const filtered = descriptions.filter(desc =>
                        desc.toLowerCase().includes(formData.description.toLowerCase())
                      );
                      setFilteredDescriptions(filtered);
                      setShowDescriptionDropdown(filtered.length > 0);
                    }
                  }}
                  className="w-full pr-10"
                  placeholder="Enter description or select from previous..."
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.description.trim() === '') {
                      setFilteredDescriptions(descriptions);
                      setShowDescriptionDropdown(!showDescriptionDropdown);
                    } else {
                      const filtered = descriptions.filter(desc =>
                        desc.toLowerCase().includes(formData.description.toLowerCase())
                      );
                      setFilteredDescriptions(filtered);
                      setShowDescriptionDropdown(!showDescriptionDropdown && filtered.length > 0);
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              {/* Description Dropdown */}
              {showDescriptionDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredDescriptions.map((desc, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleDescriptionSelect(desc)}
                    >
                      {desc}
                    </div>
                  ))}
                </div>
              )}
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
                {verificationSeries.map((series) => (
                  <option key={series.id} value={series.code}>
                    {series.code} - {series.name}
                  </option>
                ))}
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
                Coding template
              </label>
              <select
                value={formData.accountingTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a coding template</option>
                {accountingTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.code} - {template.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('amount', value);
                }}
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
                    {accountingViewSettings.enable_transaction_info && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TRANSACTION INFO
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      DEBIT
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CREDIT
                    </th>
                    {accountingViewSettings.show_account_balance_column_in_posting_view && (
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACCOUNT BALANCE
                      </th>
                    )}
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accountEntries.map((entry, index) => (
                    <tr
                      key={entry.id}
                      draggable
                      onDragStart={() => onDragStart(index)}
                      onDragEnd={onDragEnd}
                      onDragOver={(e) => onDragOver(e, index)}
                      className={`hover:bg-gray-50 transition-colors ${draggedItemIndex === index ? 'opacity-50' : ''}`}
                    >
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
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                              {/* Create Account Button - Top Right */}
                              <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-3 py-2 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Select Account</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Close the dropdown
                                    setShowAccountDropdown({});
                                    // Close the verification form
                                    onClose();
                                    // Navigate to Financial page with bookkeeping tab
                                    // Use setTimeout to ensure form closes first
                                    setTimeout(() => {
                                      const currentPath = window.location.pathname;
                                      if (currentPath !== '/financial') {
                                        window.location.href = '/financial?tab=bookkeeping';
                                      } else {
                                        // If already on financial page, just update the tab
                                        const url = new URL(window.location.href);
                                        url.searchParams.set('tab', 'bookkeeping');
                                        window.history.pushState({}, '', url);
                                        window.location.reload();
                                      }
                                    }, 100);
                                  }}
                                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  New Account
                                </button>
                              </div>

                              {/* Account List */}
                              <div className="max-h-48 overflow-auto">
                                {accounts
                                  .filter(acc =>
                                    acc.account_number.toLowerCase().includes((entry.account || '').toLowerCase()) ||
                                    acc.account_name.toLowerCase().includes((entry.account || '').toLowerCase())
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
                                  acc.account_number.toLowerCase().includes((entry.account || '').toLowerCase()) ||
                                  acc.account_name.toLowerCase().includes((entry.account || '').toLowerCase())
                                ).length === 0 && (
                                    <div className="px-3 py-2 text-sm text-gray-500">No accounts found</div>
                                  )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700 px-3 py-2 bg-gray-50/50 rounded-md border border-transparent truncate" title={typeof entry.name === 'string' ? entry.name : ''}>
                          {typeof entry.name === 'string' && entry.name ? entry.name : <span className="text-gray-400 italic text-xs">Auto-filled</span>}
                        </div>
                      </td>
                      {accountingViewSettings.enable_transaction_info && (
                        <td className="px-4 py-3">
                          <Input
                            type="text"
                            value={entry.transactionInfo}
                            onChange={(e) => handleAccountEntryChange(entry.id, 'transactionInfo', e.target.value)}
                            className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.debit}
                          onChange={(e) => handleAccountEntryChange(entry.id, 'debit', e.target.value)}
                          className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          step="0.01"
                          value={entry.credit}
                          onChange={(e) => handleAccountEntryChange(entry.id, 'credit', e.target.value)}
                          className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      {accountingViewSettings.show_account_balance_column_in_posting_view && (
                        <td className="px-4 py-3">
                          <Input
                            type="number"
                            step="0.01"
                            value={entry.balance}
                            onChange={(e) => handleAccountEntryChange(entry.id, 'balance', e.target.value)}
                            className="w-full border-0 focus:ring-1 focus:ring-blue-500"
                            readOnly
                          />
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <div
                            className="cursor-move text-gray-400 hover:text-gray-600"
                            title="Drag to reorder"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
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

              {(selectedImages.length > 0 || existingImages.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative">
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-gray-300">
                        <img
                          src={image.image_url}
                          alt={image.image_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-gray-600 mt-1 truncate">{image.image_name}</p>
                    </div>
                  ))}

                  {/* Newly Selected Images */}
                  {selectedImages.map((image, index) => (
                    <div key={`new-${index}`} className="relative">
                      <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center border border-blue-300">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 shadow-sm"
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
            {loading ? 'Processing...' : (initialData ? 'Update' : 'Book')}
          </Button>
        </div>
      </div>
    </div>
  );
};
