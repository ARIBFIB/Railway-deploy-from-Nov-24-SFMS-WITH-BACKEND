import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { AccountReconciliation } from './AccountReconciliation';
import { VerificationForm } from './VerificationForm';
import { CashReconciliation } from './CashReconciliation';
import { VatReportingPeriods } from './VatReportingPeriods';
import { VatPeriodDetail } from './VatPeriodDetail';
import { VerificationService, type Verification } from '../../services/verificationService';
import { AccountService, type Account } from '../../services/accountService';
import {
  Search,
  Plus,
  Printer,
  User,
  MessageSquare,
  Image,
  ExternalLink,
  Grid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Pin,
  X,
  Paperclip,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  CheckCircle
} from 'lucide-react';
import { RegistrationTemplateService, type RegistrationTemplate } from '../../services/registrationTemplateService';
import { AttachmentSidePanel } from './AttachmentSidePanel';
import { ExtendedSearchPanel } from './ExtendedSearchPanel';
import { TablePagination, type RowDensity } from '../TablePagination';
import { verificationSeriesService, type VerificationSeriesItem } from '../../services/verificationSeriesService';
import { toast } from 'react-hot-toast';

// Remove the old interface as we're now using the one from the service

// Remove mock data as we'll load from API

export const VerificationsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationSeries, setVerificationSeries] = useState('all'); // Original series state

  // Extended Search State
  const [showExtendedSearch, setShowExtendedSearch] = useState(false);
  const [extendedFilters, setExtendedFilters] = useState<any>(null);

  // Pagination & Display State
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('verifications');
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedVerifications, setSelectedVerifications] = useState<string[]>([]);

  // Search amount state
  const [searchAmountFrom, setSearchAmountFrom] = useState('');
  const [searchAmountTo, setSearchAmountTo] = useState('');
  const [searchDateFrom, setSearchDateFrom] = useState('');
  const [searchDateTo, setSearchDateTo] = useState('');
  const [searchAccount, setSearchAccount] = useState('');
  const [searchSeries, setSearchSeries] = useState('all');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchResultsDensity, setSearchResultsDensity] = useState<'compact' | 'normal' | 'expanded'>('normal');
  const [searchResultsPage, setSearchResultsPage] = useState(1);
  const [searchResultsRowsPerPage, setSearchResultsRowsPerPage] = useState(10);
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [editingVerification, setEditingVerification] = useState<Verification | null>(null);

  // New State for Refinements
  const [rowDensity, setRowDensity] = useState<RowDensity>('compact');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [seriesList, setSeriesList] = useState<VerificationSeriesItem[]>([]);
  const [wasVerificationJustCreated, setWasVerificationJustCreated] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showGalleryPanel, setShowGalleryPanel] = useState(false);
  const [currentVerification, setCurrentVerification] = useState<Verification | null>(null);

  // Attachment Panel State
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [linkedFiles, setLinkedFiles] = useState<any[]>([]);
  const [selectedVerificationForAttachment, setSelectedVerificationForAttachment] = useState<Verification | null>(null);

  // Reset attachment state when changing tabs
  useEffect(() => {
    setIsAttachmentOpen(false);
    setLinkedFiles([]);
  }, [activeTab]);

  // VAT state
  const [vatPeriods] = useState([
    {
      id: '1',
      name: 'March',
      period: '2025-03-01 to 2025-03-31',
      lastReportingDate: '2025-05-12',
      status: 'Delayed'
    },
    {
      id: '2',
      name: 'Second quarter',
      period: '2025-04-01 to 2025-06-30',
      lastReportingDate: '2025-08-18',
      status: 'Delayed'
    }
  ]);

  // Registration templates state
  const [registrationTemplates, setRegistrationTemplates] = useState<RegistrationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<RegistrationTemplate | null>(null);
  const [selectedReceiptTemplate, setSelectedReceiptTemplate] = useState<RegistrationTemplate | null>(null);
  const [selectedVatPeriod, setSelectedVatPeriod] = useState<any | null>(null);

  // Daily cash register form state
  const [cashRegisterData, setCashRegisterData] = useState({
    templateId: '',
    accountingDate: new Date().toISOString().split('T')[0],
    verificationDescription: '',
    entryValues: {} as Record<string, string>,
    comment: ''
  });

  // Register receipt form state
  const [receiptData, setReceiptData] = useState({
    templateId: '',
    accountingDate: new Date().toISOString().split('T')[0],
    verificationDescription: '',
    entryValues: {} as Record<string, string>,
    comment: ''
  });

  // Load verifications from API
  const loadVerifications = async () => {
    console.log('🔄 VerificationsList.loadVerifications - Starting');
    setLoading(true);
    setError(null);
    try {
      const cleanSearchTerm = debouncedSearchTerm.trim() || undefined;

      console.log('📊 Loading ALL verifications without filters');

      // Prepare filters
      const filters: any = {};
      if (cleanSearchTerm) filters.search = cleanSearchTerm;
      if (verificationSeries !== 'all') filters.verification_series = verificationSeries;

      // Apply extended filters if they exist
      if (extendedFilters) {
        if (extendedFilters.verificationNumber) filters.verification_number = extendedFilters.verificationNumber;
        if (extendedFilters.description) filters.description = extendedFilters.description;
        if (extendedFilters.dateFrom) filters.date_from = extendedFilters.dateFrom;
        if (extendedFilters.dateTo) filters.date_to = extendedFilters.dateTo;
        if (extendedFilters.amountFrom) filters.min_amount = parseFloat(extendedFilters.amountFrom);
        if (extendedFilters.amountTo) filters.max_amount = parseFloat(extendedFilters.amountTo);
        if (extendedFilters.accountNumber) filters.account_number = extendedFilters.accountNumber;
        if (extendedFilters.comment) filters.comment = extendedFilters.comment;
        if (extendedFilters.createdBy) filters.created_by = extendedFilters.createdBy;
        if (extendedFilters.status && extendedFilters.status !== 'all') filters.status = extendedFilters.status;
      }

      console.log('🔍 Applying filters:', filters);

      const response = await VerificationService.getVerifications(filters);

      console.log('📋 VerificationService.getVerifications response:', {
        success: response.success,
        dataCount: response.data?.length || 0
      });

      if (response.success) {
        setVerifications(response.data);
        setTotalItems(response.pagination?.total || response.data.length);
        setTotalPages(response.pagination?.pages || 1);
        console.log('✅ Verifications state updated');
      } else {
        console.error('❌ Failed to load verifications - response not successful:', response);
        setError(response.message || 'Unable to load verifications. Please check your connection and try again.');
      }
    } catch (err) {
      console.error('❌ Error loading verifications:', err);
      if (err instanceof Error) {
        if (err.message.includes('Network') || err.message.includes('fetch')) {
          setError('Network error: Please check your internet connection and try again.');
        } else if (err.message.includes('timeout')) {
          setError('Request timeout: The server is taking too long to respond. Please try again.');
        } else {
          setError(`Error loading verifications: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred while loading verifications. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load verifications when component mounts or filters change
  useEffect(() => {
    if (activeTab === 'verifications') {
      loadVerifications();
    }
  }, [activeTab, debouncedSearchTerm, verificationSeries, currentPage, extendedFilters]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm !== '') {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Debug effect to log when verifications state changes
  useEffect(() => {
    console.log('🔄 VerificationsList - verifications state updated:', {
      count: verifications.length,
      verifications: verifications.map(v => ({ id: v.id, number: v.verification_number, description: v.description }))
    });
  }, [verifications]);

  // Clear cache and force fresh data load when component mounts
  useEffect(() => {
    console.log('🔄 VerificationsList - Component mounted, clearing cache and loading fresh data');
    // Clear any cached data and force fresh load
    setVerifications([]);
    setTotalItems(0);
    setCurrentPage(1);
    // Load fresh data
    loadVerifications();
  }, []);

  // Force refresh when user context changes (e.g., different foundation)
  useEffect(() => {
    console.log('🔄 VerificationsList - User context changed, forcing refresh');
    // Clear all state and reload
    setVerifications([]);
    setTotalItems(0);
    setCurrentPage(1);
    setError(null);
    setSuccessMessage(null);
    // Force fresh data load
    setTimeout(() => {
      loadVerifications();
    }, 100);
  }, [activeTab]); // Refresh when tab changes (indicates user navigation)

  // Add a refresh function that can be called manually
  const refreshVerifications = async () => {
    console.log('🔄 Refreshing verifications...');
    await loadVerifications();
  };

  const loadSeries = async () => {
    try {
      const response = await verificationSeriesService.getSettings('accounting');
      if (response.success && response.data?.accounting?.series) {
        setSeriesList(response.data.accounting.series);
      }
    } catch (err) {
      console.error('Failed to load series settings:', err);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success('The address was copied to the clipboard.', {
      position: 'bottom-center',
      duration: 3000,
      style: {
        background: '#333',
        color: '#fff',
        borderRadius: '4px',
        fontSize: '14px'
      }
    });
  };

  const loadTemplates = async () => {
    try {
      const templates = await RegistrationTemplateService.getTemplates();
      const dailyCashTemplates = templates.filter(t => t.templateType === 'Daily cash register');
      const receiptTemplates = templates.filter(t => t.templateType === 'Receipt');

      setRegistrationTemplates(templates);

      // If there are daily cash templates and none selected, select the first one
      if (dailyCashTemplates.length > 0 && !cashRegisterData.templateId) {
        handleTemplateSelection(dailyCashTemplates[0].id, templates);
      }

      // If there are receipt templates and none selected, select the first one
      if (receiptTemplates.length > 0 && !receiptData.templateId) {
        handleReceiptTemplateSelection(receiptTemplates[0].id, templates);
      }
    } catch (err) {
      console.error('Failed to load registration templates:', err);
    }
  };

  const loadAccounts = async () => {
    try {
      const response = await AccountService.getAccounts({ limit: 1000 });
      if (response.success) {
        setAccounts(response.data);
      }
    } catch (err) {
      console.error('Failed to load accounts:', err);
    }
  };

  useEffect(() => {
    loadTemplates();
    loadAccounts();
    loadSeries();
  }, []);

  const handleTemplateSelection = (templateId: string, templatesList = registrationTemplates) => {
    const template = templatesList.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setCashRegisterData(prev => ({
        ...prev,
        templateId,
        verificationDescription: template.verificationDescription || prev.verificationDescription,
        // Initialize entry values for all sale entries in the template
        entryValues: template.saleEntries.reduce((acc, entry) => {
          acc[entry.id] = '';
          return acc;
        }, {} as Record<string, string>)
      }));
    }
  };

  const handleReceiptTemplateSelection = (templateId: string, templatesList = registrationTemplates) => {
    const template = templatesList.find(t => t.id === templateId);
    if (template) {
      setSelectedReceiptTemplate(template);
      setReceiptData(prev => ({
        ...prev,
        templateId,
        verificationDescription: template.verificationDescription || prev.verificationDescription,
        // Initialize entry values for all sale entries in the template
        entryValues: template.saleEntries.reduce((acc, entry) => {
          acc[entry.id] = '';
          return acc;
        }, {} as Record<string, string>)
      }));
    }
  };

  // Real-time data synchronization function
  const syncVerificationsData = async () => {
    console.log('🔄 Syncing verifications data');
    // Just call loadVerifications, which now handles filtering and params properly
    await loadVerifications();
  };

  const handleCreateVerification = () => {
    setEditingVerification(null);
    setShowVerificationForm(true);
  };

  const handleVerificationCreated = () => {
    console.log('🔄 VerificationsList.handleVerificationCreated - Called');
    setWasVerificationJustCreated(true);
    setSuccessMessage('Verification created successfully!');
    // Use sync to ensure data is loaded
    syncVerificationsData();
  };

  const handleSelectVerification = (verificationId: string) => {
    setSelectedVerifications(prev =>
      prev.includes(verificationId)
        ? prev.filter(id => id !== verificationId)
        : [...prev, verificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVerifications.length === currentVerifications.length) {
      setSelectedVerifications([]);
    } else {
      setSelectedVerifications(currentVerifications.map(v => v.id!));
    }
  };

  const handleBulkStatusUpdate = async (status: 'draft' | 'posted' | 'cancelled') => {
    if (selectedVerifications.length === 0) {
      setError('Please select at least one verification to update.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await VerificationService.bulkUpdateStatus(selectedVerifications, status);
      if (response.success) {
        setSelectedVerifications([]);
        setSuccessMessage(`Successfully updated ${selectedVerifications.length} verification(s) to ${status}.`);
        setTimeout(() => setSuccessMessage(null), 5000);
        // Use sync instead of loadVerifications for better consistency
        syncVerificationsData();
      } else {
        setError(response.message || `Failed to update verification status to ${status}. Please try again.`);
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      if (err instanceof Error) {
        if (err.message.includes('Network') || err.message.includes('fetch')) {
          setError('Network error: Please check your internet connection and try again.');
        } else if (err.message.includes('timeout')) {
          setError('Request timeout: The server is taking too long to respond. Please try again.');
        } else {
          setError(`Error updating verification status: ${err.message}`);
        }
      } else {
        setError('An unexpected error occurred while updating verification status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedVerifications.length === 0) {
      setError('Please select at least one verification to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedVerifications.length} verification(s)? This action cannot be undone.`)) {
      try {
        setLoading(true);
        setError(null);
        const response = await VerificationService.bulkDelete(selectedVerifications);
        if (response.success) {
          setSelectedVerifications([]);
          setSuccessMessage(`Successfully deleted ${selectedVerifications.length} verification(s).`);
          setTimeout(() => setSuccessMessage(null), 5000);
          // Use sync instead of loadVerifications for better consistency
          syncVerificationsData();
        } else {
          setError(response.message || 'Failed to delete verifications. Please try again.');
        }
      } catch (err) {
        console.error('Failed to delete verifications:', err);
        if (err instanceof Error) {
          if (err.message.includes('Network') || err.message.includes('fetch')) {
            setError('Network error: Please check your internet connection and try again.');
          } else if (err.message.includes('timeout')) {
            setError('Request timeout: The server is taking too long to respond. Please try again.');
          } else {
            setError(`Error deleting verifications: ${err.message}`);
          }
        } else {
          setError('An unexpected error occurred while deleting verifications. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrintList = () => {
    // Create a printable version of the verifications list
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verifications List</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #000;
            }
            h1 {
              text-align: center;
              margin-bottom: 20px;
              font-size: 24px;
            }
            .info {
              margin-bottom: 20px;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
              font-size: 11px;
            }
            th {
              background-color: #f3f4f6;
              font-weight: bold;
              text-transform: uppercase;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            @media print {
              body { padding: 10px; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>VERIFICATIONS LIST</h1>
          <div class="info">
            <p><strong>Print Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Verifications:</strong> ${currentVerifications.length}</p>
            ${verificationSeries !== 'all' ? `<p><strong>Series Filter:</strong> ${verificationSeries}</p>` : ''}
            ${debouncedSearchTerm ? `<p><strong>Search:</strong> ${debouncedSearchTerm}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th>Verification Number</th>
                <th>Accounting Date</th>
                <th>Description</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${currentVerifications.map(v => `
                <tr>
                  <td>${v.verification_number}</td>
                  <td>${v.accounting_date}</td>
                  <td>${v.description || 'No description'}</td>
                  <td>${v.status}</td>
                  <td>${v.amount?.toFixed(2) || '0.00'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();

    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleSearchAmount = async () => {
    console.log('Searching with filters:', {
      searchAmountFrom,
      searchAmountTo,
      searchSeries,
      searchDateFrom,
      searchDateTo,
      searchAccount
    });

    setLoading(true);
    try {
      const response = await VerificationService.searchEntries({
        min_amount: searchAmountFrom ? parseFloat(searchAmountFrom) : undefined,
        max_amount: searchAmountTo ? parseFloat(searchAmountTo) : undefined,
        verification_series: searchSeries !== 'all' ? searchSeries : undefined,
        date_from: searchDateFrom || undefined,
        date_to: searchDateTo || undefined,
        account_number: searchAccount || undefined
      });

      if (response.success) {
        setSearchResults(response.data);
      } else {
        setError(response.message || 'Failed to search verification entries');
      }
    } catch (err) {
      console.error('Search amount error:', err);
      setError('An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchAmountFrom('');
    setSearchAmountTo('');
    setSearchDateFrom('');
    setSearchDateTo('');
    setSearchAccount('');
    setSearchSeries('all');
    setSearchResults([]);
    setSearchResultsPage(1);
  };

  const cycleViewDensity = () => {
    setSearchResultsDensity(prev => {
      if (prev === 'compact') return 'normal';
      if (prev === 'normal') return 'expanded';
      return 'compact';
    });
  };

  const handlePrintSearchResults = () => {
    if (searchResults.length === 0) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Search Amount Results</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            h1 { text-align: center; margin-bottom: 20px; font-size: 18px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background-color: #f3f4f6; font-weight: bold; }
            .right { text-align: right; }
          </style>
        </head>
        <body>
          <h1>SEARCH AMOUNT RESULTS</h1>
          <p>Filtered by: Amount ${searchAmountFrom || '0'} to ${searchAmountTo || '0'}</p>
          <table>
            <thead>
              <tr>
                <th>Verification no.</th>
                <th>Posting date</th>
                <th>Description</th>
                <th>Account</th>
                <th>Transaction information</th>
                <th class="right">Debit</th>
                <th class="right">Credit</th>
              </tr>
            </thead>
            <tbody>
              ${searchResults.map(r => `
                <tr>
                  <td>${r.verification_number}</td>
                  <td>${r.accounting_date}</td>
                  <td>${r.description || ''}</td>
                  <td>${r.account_number}</td>
                  <td>${r.transaction_info || ''}</td>
                  <td class="right">${r.debit.toLocaleString('sv-SE', { minimumFractionDigits: 2 })}</td>
                  <td class="right">${r.credit.toLocaleString('sv-SE', { minimumFractionDigits: 2 })}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleReadMoreAboutKivra = () => {
    console.log('Read more about Kivra migration clicked');
    // Navigate to more information about the migration
  };

  const handleGoToCorporateMailbox = () => {
    console.log('Navigate to Corporate Mailbox clicked');
    // Navigate to Corporate Mailbox section
  };

  const handleVatPeriodClick = (id: string) => {
    const vatPeriods = [
      {
        id: 'dec-2025',
        name: 'December',
        startDate: '2025-12-01',
        endDate: '2025-12-31',
        dueDate: '2026-02-12',
        status: 'Future'
      },
      {
        id: 'nov-2025',
        name: 'November',
        startDate: '2025-11-01',
        endDate: '2025-11-30',
        dueDate: '2026-01-19',
        status: 'Open'
      },
      {
        id: 'mar-2025',
        name: 'March',
        startDate: '2025-03-01',
        endDate: '2025-03-31',
        dueDate: '2025-05-12',
        status: 'Delayed'
      },
      {
        id: 'q2-2025',
        name: 'Second quarter',
        startDate: '2025-04-01',
        endDate: '2025-06-30',
        dueDate: '2025-08-18',
        status: 'Delayed'
      }
    ];

    const period = vatPeriods.find(p => p.id === id);
    if (period) {
      setSelectedVatPeriod(period);
    }
  };


  const handleDeleteVerification = async (verificationId: string) => {
    if (!window.confirm('Are you sure you want to delete this verification? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await VerificationService.deleteVerification(verificationId);
      if (response.success) {
        setSuccessMessage('Verification deleted successfully');
        // Remove the deleted verification from the local state
        setVerifications(prev => prev.filter(v => v.id !== verificationId));
        setTotalItems(prev => prev - 1);
      } else {
        setError(response.message || 'Failed to delete verification');
      }
    } catch (err) {
      console.error('Error deleting verification:', err);
      setError('An error occurred while deleting the verification');
    }
  };

  const handleVerificationClick = async (verification: Verification) => {
    console.log('Verification clicked:', verification);
    try {
      const fullDetails = await VerificationService.getVerificationById(verification.id!);
      if (fullDetails.success) {
        // Use the complete verification data which has the correct has_gallery value
        const completeVerification = fullDetails.data;
        
        // Set the selected verification for attachment panel
        setSelectedVerificationForAttachment(completeVerification);
        
        // If verification has images, show gallery panel instead of edit form
        if (completeVerification.has_gallery) {
          setCurrentVerification(completeVerification);
          setShowGalleryPanel(true);
        } else {
          setEditingVerification(completeVerification);
          setShowVerificationForm(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch details for edit", err);
      setError("Failed to load verification details");
    }
  };

  const handleCashRegisterChange = (field: string, value: string) => {
    setCashRegisterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearForm = () => {
    if (selectedTemplate) {
      setCashRegisterData({
        templateId: selectedTemplate.id,
        accountingDate: new Date().toISOString().split('T')[0],
        verificationDescription: selectedTemplate.verificationDescription || '',
        entryValues: selectedTemplate.saleEntries.reduce((acc, entry) => {
          acc[entry.id] = '';
          return acc;
        }, {} as Record<string, string>),
        comment: ''
      });
    } else {
      setCashRegisterData({
        templateId: '',
        accountingDate: new Date().toISOString().split('T')[0],
        verificationDescription: '',
        entryValues: {},
        comment: ''
      });
    }
  };

  const handleBookAndPrint = () => {
    console.log('Book and print clicked');
  };

  const handleBook = () => {
    console.log('Book clicked', { data: cashRegisterData, attachments: linkedFiles });
    // TODO: Implement actual booking logic with attachments
  };

  const handleReceiptChange = (field: string, value: string) => {
    setReceiptData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClearReceiptForm = () => {
    if (selectedReceiptTemplate) {
      setReceiptData({
        templateId: selectedReceiptTemplate.id,
        accountingDate: new Date().toISOString().split('T')[0],
        verificationDescription: selectedReceiptTemplate.verificationDescription || '',
        entryValues: selectedReceiptTemplate.saleEntries.reduce((acc, entry) => {
          acc[entry.id] = '';
          return acc;
        }, {} as Record<string, string>),
        comment: ''
      });
    } else {
      setReceiptData({
        templateId: '',
        accountingDate: new Date().toISOString().split('T')[0],
        verificationDescription: '',
        entryValues: {},
        comment: ''
      });
    }
  };

  const handleBookReceipt = () => {
    console.log('Book receipt clicked', { data: receiptData, attachments: linkedFiles });
    // TODO: Implement actual booking logic with attachments
  };

  // No local filtering anymore

  // Sort Logic
  const sortedVerifications = React.useMemo(() => {
    if (!sortConfig) return verifications;

    return [...verifications].sort((a, b) => {
      let aValue: any = a[sortConfig.key as keyof Verification];
      let bValue: any = b[sortConfig.key as keyof Verification];

      // Handle specific fields
      if (sortConfig.key === 'amount') {
        // Amount might be calculated or direct
        aValue = a.amount || 0;
        bValue = b.amount || 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [verifications, sortConfig]);

  const currentVerifications = sortedVerifications;

  const totalPagesSearch = Math.ceil(searchResults.length / searchResultsRowsPerPage);
  const paginatedSearchResults = searchResults.slice(
    (searchResultsPage - 1) * searchResultsRowsPerPage,
    searchResultsPage * searchResultsRowsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('verifications')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'verifications'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Verifications
            </button>
            <button
              onClick={() => setActiveTab('register-daily-cash')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'register-daily-cash'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Register daily Recipts
            </button>
            <button
              onClick={() => setActiveTab('register-receipt')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'register-receipt'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Register receipt
            </button>
            <button
              onClick={() => setActiveTab('reconcile-account')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'reconcile-account'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Reconcile account
            </button>
            <button
              onClick={() => setActiveTab('search-amount')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'search-amount'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Search amount
            </button>
            <button
              onClick={() => setActiveTab('incoming-documents')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'incoming-documents'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              Incoming documents
            </button>
            <button
              onClick={() => setActiveTab('vat')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === 'vat'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              VAT
            </button>
          </div>
        </div>
      </div>

      {/* Header - Only for Verifications tab */}
      {activeTab === 'verifications' && (
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">VERIFICATIONS - LIST</h1>
          </div>
        </div>
      )}

      {/* Conditional Content Based on Active Tab */}
      {activeTab === 'verifications' ? (
        <>
          {/* Search and Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Verification number, Description"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setDebouncedSearchTerm(e.currentTarget.value);
                    }
                  }}
                  className="pl-10 w-80"
                />
              </div>
              <button
                onClick={() => setShowExtendedSearch(!showExtendedSearch)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium min-w-[160px] text-left"
              >
                {showExtendedSearch ? 'Close Extended Search' : 'Extended Search'}
              </button>
            </div>
            <div className="flex items-center gap-4">
              {selectedVerifications.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{selectedVerifications.length} selected</span>
                  <Button
                    onClick={() => handleBulkStatusUpdate('posted')}
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled={loading}
                  >
                    Post
                  </Button>
                  <Button
                    onClick={() => handleBulkStatusUpdate('cancelled')}
                    className="bg-red-600 text-white hover:bg-red-700"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    className="bg-red-500 text-white hover:bg-red-600"
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              )}
              <Button
                onClick={syncVerificationsData}
                className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500 mr-3"
              >
                <Grid className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button
                onClick={() => {
                  console.log('🔄 Force refresh clicked');
                  syncVerificationsData();
                }}
                className="bg-green-500 text-white hover:bg-green-600 border-green-500 mr-3"
              >
                Force Refresh
              </Button>
              <Button
                onClick={() => {
                  console.log('🗑️ Clear cache clicked');
                  // Clear all state
                  setVerifications([]);
                  setTotalItems(0);
                  setCurrentPage(1);
                  setError(null);
                  setSuccessMessage(null);
                  // Force fresh data load
                  setTimeout(() => {
                    loadVerifications();
                  }, 100);
                }}
                className="bg-red-500 text-white hover:bg-red-600 border-red-500 mr-3"
              >
                Clear Cache
              </Button>
              {selectedVerifications.length > 0 ? (
                <Button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white hover:bg-red-700 border-red-600 mr-3"
                >
                  <X className="w-4 h-4 mr-2" />
                  Delete ({selectedVerifications.length})
                </Button>
              ) : (
                <Button
                  onClick={handleCreateVerification}
                  className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create verification
                </Button>
              )}
            </div>
          </div>

          {/* Extended Search Panel - Inline */}
          {showExtendedSearch && (
            <ExtendedSearchPanel
              onClose={() => setShowExtendedSearch(false)}
              seriesList={seriesList}
              accounts={accounts}
              onSearch={(filters) => {
                setExtendedFilters(filters);
                // Don't close on search, allow refinement? User didn't specify, but usually search closes or updates list.
                // User said "input text which I will do input also save and when I do search again do the previous..."
                // Keeping it open might be annoying if it takes up space. Let's keep existing behavior (close on search) unless requested otherwise.
                // Wait, "when click the extended serch then the text will change to close extended search". implies toggle.
                // If I click Search, does it close? The previous logic closed it.
                // Refactor: kept logic to close on search for now.
                setShowExtendedSearch(false);
                setCurrentPage(1);
              }}
              onClear={() => {
                setExtendedFilters(null);
                // setShowExtendedSearch(false); // Maybe don't close on clear? existing logic did.
                setCurrentPage(1);
              }}
            />
          )}

          {/* Email and Print Links */}
          <div className="mb-6">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span
                className="text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1 group"
                onClick={() => handleCopyEmail('inbox.ver.1520105@erkivplats.se')}
                title="Click to copy email address"
              >
                E-mail supporting documents: inbox.ver.1520105@erkivplats.se
                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              <button
                onClick={handlePrintList}
                className="flex items-center gap-2 hover:text-gray-800"
              >
                <Printer className="w-4 h-4" />
                Print list
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Series:</label>
                <select
                  value={verificationSeries}
                  onChange={(e) => setVerificationSeries(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[100px]"
                >
                  <option value="all">All</option>
                  {seriesList.map(series => (
                    <option key={series.id} value={series.code}>{series.code} - {series.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Top Pagination Control */}
          <div className="mb-4">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowDensity={rowDensity}
              onRowDensityChange={setRowDensity}
              totalItems={totalItems}
            />
          </div>

          {/* Success Message Display */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-red-600 text-sm font-medium">{error}</div>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 ml-4"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}



          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      <input
                        type="checkbox"
                        checked={selectedVerifications.length === currentVerifications.length && currentVerifications.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 group select-none ${sortConfig?.key === 'verification_number' ? 'text-gray-900 bg-gray-100' : 'text-gray-500'}`}
                      onClick={() => handleSort('verification_number')}
                    >
                      <div className="flex items-center gap-1">
                        VERIFICATION NUMBER
                        {sortConfig?.key === 'verification_number' && (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortConfig?.key !== 'verification_number' && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                      </div>
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 group select-none ${sortConfig?.key === 'accounting_date' ? 'text-gray-900 bg-gray-100' : 'text-gray-500'}`}
                      onClick={() => handleSort('accounting_date')}
                    >
                      <div className="flex items-center gap-1">
                        ACCOUNTING DATE
                        {sortConfig?.key === 'accounting_date' && (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortConfig?.key !== 'accounting_date' && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                      </div>
                    </th>
                    <th
                      className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 group select-none ${sortConfig?.key === 'description' ? 'text-gray-900 bg-gray-100' : 'text-gray-500'}`}
                      onClick={() => handleSort('description')}
                    >
                      <div className="flex items-center gap-1">
                        DESCRIPTION
                        {sortConfig?.key === 'description' && (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortConfig?.key !== 'description' && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                      </div>
                    </th>
                    <th
                      className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100 group select-none ${sortConfig?.key === 'amount' ? 'text-gray-900 bg-gray-100' : 'text-gray-500'}`}
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center justify-end gap-1">
                        AMOUNT
                        {sortConfig?.key === 'amount' && (
                          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                        )}
                        {sortConfig?.key !== 'amount' && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ACTIONS
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LINKS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        Loading verifications...
                      </td>
                    </tr>
                  ) : currentVerifications.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No verifications found
                      </td>
                    </tr>
                  ) : (
                    currentVerifications.map((verification) => (
                      <tr
                        key={verification.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedVerifications.includes(verification.id!)}
                            onChange={() => handleSelectVerification(verification.id!)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td
                          className={`px-6 whitespace-nowrap text-sm font-medium text-gray-900 cursor-pointer ${rowDensity === 'compact' ? 'py-1.5 text-[13px]' :
                            rowDensity === 'expanded' ? 'py-3.5 text-[15px]' : 'py-2.5 text-[14px]'
                            }`}
                          onClick={() => handleVerificationClick(verification)}
                        >
                          {verification.verification_number}
                        </td>
                        <td
                          className={`px-6 whitespace-nowrap text-sm text-gray-500 cursor-pointer ${rowDensity === 'compact' ? 'py-1.5 text-[13px]' :
                            rowDensity === 'expanded' ? 'py-3.5 text-[15px]' : 'py-2.5 text-[14px]'
                            }`}
                          onClick={() => handleVerificationClick(verification)}
                        >
                          {verification.accounting_date}
                        </td>
                        <td
                          className={`px-6 text-sm text-gray-900 cursor-pointer ${rowDensity === 'compact' ? 'py-1.5 text-[13px]' :
                            rowDensity === 'expanded' ? 'py-3.5 text-[15px]' : 'py-2.5 text-[14px]'
                            }`}
                          onClick={() => handleVerificationClick(verification)}
                        >
                          {verification.description || 'No description'}
                        </td>
                        <td
                          className={`px-6 text-sm text-gray-900 text-right cursor-pointer font-mono ${rowDensity === 'compact' ? 'py-1.5 text-[13px]' :
                            rowDensity === 'expanded' ? 'py-3.5 text-[15px]' : 'py-2.5 text-[14px]'
                            }`}
                          onClick={() => handleVerificationClick(verification)}
                        >
                          {/* Assuming total_debit or amount is the value to show. Using generic amount if available or calculated */}
                          {(verification.amount || verification.total_debit || 0).toLocaleString('sv-SE', { minimumFractionDigits: 2 })}
                        </td>
                        <td className={`px-6 whitespace-nowrap text-center ${rowDensity === 'compact' ? 'py-1.5' :
                          rowDensity === 'expanded' ? 'py-3.5' : 'py-2.5'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-2">
                            {/* Man icon - always show for all entries */}
                            <div className="relative group">
                              <User className="w-4 h-4 text-gray-600 cursor-pointer" />
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                Created by: {verification.created_by || 'Unknown User'}
                              </div>
                            </div>
                            {/* Comment icon - show when verification has comments */}
                            {verification.comment && verification.comment.trim() && (
                              <div className="relative group">
                                <MessageSquare className="w-4 h-4 text-gray-600 cursor-pointer" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 max-w-xs min-w-48">
                                  <div className="font-medium mb-1">Comment:</div>
                                  <div className="break-words whitespace-normal">{verification.comment}</div>
                                </div>
                              </div>
                            )}
                            {/* Gallery icon - show when verification has images */}
                            {verification.has_gallery && (
                              <button
                                type="button"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    // Fetch full verification details with images
                                    const fullVerification = await VerificationService.getVerificationById(verification.id!);
                                    if (fullVerification.success) {
                                      setCurrentVerification(fullVerification.data);
                                      setShowGalleryPanel(true);
                                    } else {
                                      console.error('Failed to fetch verification details:', fullVerification.message);
                                      // Fallback to the verification data we already have
                                      setCurrentVerification(verification);
                                      setShowGalleryPanel(true);
                                    }
                                  } catch (error) {
                                    console.error('Error fetching verification details:', error);
                                    // Fallback to the verification data we already have
                                    setCurrentVerification(verification);
                                    setShowGalleryPanel(true);
                                  }
                                }}
                                className="p-1 text-gray-600 hover:text-[#5c6f2b] transition-colors"
                                title="View gallery"
                              >
                                <Image className="w-4 h-4" />
                              </button>
                            )}
                            {/* Delete icon - always show for all entries */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteVerification(verification.id!);
                              }}
                              className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                              title="Delete verification"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className={`px-6 whitespace-nowrap text-center ${rowDensity === 'compact' ? 'py-1.5' :
                          rowDensity === 'expanded' ? 'py-3.5' : 'py-2.5'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <a
                            href={`/financial/account-analysis?verificationId=${verification.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block hover:text-blue-600 transition-colors"
                            title="Open Account Analysis Report"
                          >
                            <ExternalLink className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Pagination */}
          <div className="flex justify-center mt-6">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              rowDensity={rowDensity}
              onRowDensityChange={setRowDensity}
              totalItems={totalItems}
            />
          </div>
        </>
      ) : activeTab === 'register-daily-cash' ? (
        <div className="space-y-6">
          {/* Main Title/Status Bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase">
                {selectedTemplate ? selectedTemplate.name : 'REGISTER DAILY CASH'}
              </h1>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              VERSION NO.: {selectedTemplate ? selectedTemplate.verificationSeries : 'F'} *
            </div>
          </div>

          {/* Form Content Area */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
              <select
                value={cashRegisterData.templateId}
                onChange={(e) => handleTemplateSelection(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a template</option>
                {registrationTemplates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </div>

            {/* Date and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Posting date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={cashRegisterData.accountingDate}
                    onChange={(e) => handleCashRegisterChange('accountingDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification description</label>
                <Input
                  value={cashRegisterData.verificationDescription}
                  onChange={(e) => handleCashRegisterChange('verificationDescription', e.target.value)}
                />
              </div>
            </div>

            {/* Sales Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedTemplate ? selectedTemplate.headingSales : 'Title Sales'}
              </h3>
              <div className="space-y-4">
                {selectedTemplate ? (
                  selectedTemplate.saleEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 min-w-[120px]">{entry.text}</label>
                      <div className="flex-1 relative">
                        <Input
                          value={cashRegisterData.entryValues[entry.id] || ''}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setCashRegisterData(prev => ({
                              ...prev,
                              entryValues: {
                                ...prev.entryValues,
                                [entry.id]: newValue
                              }
                            }));
                          }}
                          className="pr-10"
                        />
                        <Pin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No template selected or no entries found.</div>
                )}
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">
                    {Object.values(cashRegisterData.entryValues)
                      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedTemplate ? selectedTemplate.headingPaymentMethod : 'Title Payment'}
              </h3>
              {/* Since the template only seems to have saleEntries, we might just show a static placeholder or entries tagged for payment if that existed.
                  For now we'll stick to the heading being dynamic as per User Request. */}
            </div>

            {/* Difference */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Difference</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-gray-900">0.00</span>
                  <Pin className="text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Withdrawal Section */}
            <div className="bg-white rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedTemplate ? selectedTemplate.headingWithdrawal : 'Title Withdrawal'}
              </h3>
            </div>

            {/* Cash Reconciliation */}
            <CashReconciliation defaultExpanded={false} />

            {/* Linked Images Section */}
            {linkedFiles.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Linked Images</h3>
                <div className="space-y-2">
                  {linkedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Section */}
            <div className="bg-white rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={cashRegisterData.comment}
                onChange={(e) => handleCashRegisterChange('comment', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your comments here..."
              />
            </div>
          </div>


          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between bg-white border-t border-gray-200 p-4">
            <Button
              variant="secondary"
              onClick={handleClearForm}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleBookAndPrint}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Book and print
              </Button>
              <Button
                onClick={handleBook}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Book
              </Button>
            </div>
          </div>
        </div>
      ) : activeTab === 'register-receipt' ? (
        <div className="space-y-6">
          {/* Main Title and Version */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase">
                {selectedReceiptTemplate ? selectedReceiptTemplate.name : 'REGISTER RECEIPT'}
              </h1>
            </div>
            <div className="text-sm font-semibold text-gray-700">
              VERSION NO.: {selectedReceiptTemplate ? selectedReceiptTemplate.verificationSeries : 'K'} *
            </div>
          </div>

          {/* Form Content Area */}
          <div className="bg-white rounded-lg p-6 space-y-6">
            {/* Template Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
              <select
                value={receiptData.templateId}
                onChange={(e) => handleReceiptTemplateSelection(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a template</option>
                {registrationTemplates.filter(t => t.templateType === 'Receipt').map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
            </div>

            {/* Accounting Date and Verification Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accounting date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={receiptData.accountingDate}
                    onChange={(e) => handleReceiptChange('accountingDate', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification description</label>
                <Input
                  value={receiptData.verificationDescription}
                  onChange={(e) => handleReceiptChange('verificationDescription', e.target.value)}
                />
              </div>
            </div>


            {/* Costs incl. VAT Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedReceiptTemplate ? selectedReceiptTemplate.headingSales : 'Costs incl. VAT'}
              </h3>
              <div className="space-y-4">
                {selectedReceiptTemplate ? (
                  selectedReceiptTemplate.saleEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 min-w-[120px]">{entry.text}</label>
                      <div className="flex-1 relative">
                        <Input
                          value={receiptData.entryValues[entry.id] || ''}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setReceiptData(prev => ({
                              ...prev,
                              entryValues: {
                                ...prev.entryValues,
                                [entry.id]: newValue
                              }
                            }));
                          }}
                          className="pr-10"
                        />
                        <Pin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-500">No template selected or no entries found.</div>
                )}
                <div className="text-right">
                  <span className="text-lg font-semibold text-gray-900">
                    {Object.values(receiptData.entryValues)
                      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Linked Images Section */}
            {linkedFiles.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Linked Images</h3>
                <div className="space-y-2">
                  {linkedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Linked Images Section */}
            {linkedFiles.length > 0 && (
              <div className="bg-white rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Linked Images</h3>
                <div className="space-y-2">
                  {linkedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 text-sm text-gray-700">
                      <Paperclip className="w-4 h-4 text-gray-500" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Section */}
            <div className="bg-white rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={receiptData.comment}
                onChange={(e) => handleReceiptChange('comment', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your comments here..."
              />
            </div>
          </div>


          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between bg-white border-t border-gray-200 p-4">
            <Button
              variant="secondary"
              onClick={handleClearReceiptForm}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button
              onClick={handleBookReceipt}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Book
            </Button>
          </div>
        </div>
      ) : activeTab === 'reconcile-account' ? (
        <AccountReconciliation />
      ) : activeTab === 'search-amount' ? (
        <div className="space-y-6">
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Verifications</h1>
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="flex items-center gap-2"
                onClick={() => setShowExtendedSearch(true)}
              >
                <Search className="w-4 h-4" />
                Extended Search
              </Button>
              <Button
                className="bg-[#FFFF00] text-black hover:bg-[#FFFF00]/90 flex items-center gap-2"
                onClick={() => setShowVerificationForm(true)}
              >
                <Plus className="w-4 h-4" />
                Create verification
              </Button>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <Input
                  placeholder="Amount from"
                  value={searchAmountFrom}
                  onChange={(e) => setSearchAmountFrom(e.target.value)}
                  className="w-40"
                />
                <Input
                  placeholder="Amount to"
                  value={searchAmountTo}
                  onChange={(e) => setSearchAmountTo(e.target.value)}
                  className="w-40"
                />
              </div>
              <button
                onClick={() => setShowExtendedSearch(!showExtendedSearch)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
              >
                {showExtendedSearch ? 'Hide search' : 'Extended Search'}
                {showExtendedSearch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <div className="flex-1"></div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={handleClearSearch}
                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Clear
                </Button>
                <Button
                  onClick={handleSearchAmount}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
                >
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>

            {/* Extended Search Panel */}
            {showExtendedSearch && (
              <div className="pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Verification Series</label>
                  <select
                    value={searchSeries}
                    onChange={(e) => setSearchSeries(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All series</option>
                    <option value="A">Series A (General)</option>
                    <option value="B">Series B (Bank)</option>
                    <option value="C">Series C (Cash)</option>
                    <option value="D">Series D (Daily Sales)</option>
                    <option value="K">Series K (Receipts)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Date from</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={searchDateFrom}
                      onChange={(e) => setSearchDateFrom(e.target.value)}
                      className="pl-10 h-[38px] w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Date to</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="date"
                      value={searchDateTo}
                      onChange={(e) => setSearchDateTo(e.target.value)}
                      className="pl-10 h-[38px] w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Account</label>
                  <select
                    value={searchAccount}
                    onChange={(e) => setSearchAccount(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All accounts</option>
                    {accounts.map(acc => (
                      <option key={acc.id} value={acc.account_number}>
                        {acc.account_number} - {acc.account_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Search Results Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification no.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posting date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction information
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debit
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {searchResults.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        {loading ? 'Searching for entries...' : 'No search results found. Enter filters and click Search.'}
                      </td>
                    </tr>
                  ) : (
                    paginatedSearchResults.map((result) => {
                      const rowPadding = searchResultsDensity === 'compact' ? 'py-1' : searchResultsDensity === 'expanded' ? 'py-6' : 'py-4';

                      return (
                        <tr
                          key={result.id}
                          className="hover:bg-gray-100 transition-colors cursor-pointer group"
                          onClick={() => handleVerificationClick({ id: result.verification_id } as Verification)}
                        >
                          <td className={`px-6 ${rowPadding} whitespace-nowrap text-sm font-semibold text-gray-900 border-r border-gray-100 group-hover:text-blue-600`}>
                            {result.verification_number}
                          </td>
                          <td className={`px-6 ${rowPadding} whitespace-nowrap text-sm text-gray-600`}>
                            {result.accounting_date}
                          </td>
                          <td className={`px-6 ${rowPadding} text-sm text-gray-600 max-w-xs truncate`}>
                            {result.description}
                          </td>
                          <td className={`px-6 ${rowPadding} whitespace-nowrap text-sm text-gray-900 font-medium`}>
                            {result.account_number} <span className="text-gray-400 font-normal">| {result.account_name}</span>
                          </td>
                          <td className={`px-6 ${rowPadding} text-sm text-gray-600 truncate`}>
                            {result.transaction_info}
                          </td>
                          <td className={`px-6 ${rowPadding} whitespace-nowrap text-sm text-right font-mono text-gray-900`}>
                            {result.debit > 0 ? result.debit.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) : '0,00'}
                          </td>
                          <td className={`px-6 ${rowPadding} whitespace-nowrap text-sm text-right font-mono text-gray-900`}>
                            {result.credit > 0 ? result.credit.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) : '0,00'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination and View Density Control */}
            {searchResults.length > 0 && (
              <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      cycleViewDensity();
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    title="Toggle Row Height (Compact -> Normal -> Expanded)"
                  >
                    <Grid className={`w-5 h-5 transition-transform ${searchResultsDensity === 'compact' ? 'scale-75' : searchResultsDensity === 'expanded' ? 'scale-125' : 'scale-100'}`} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Rows per page:</span>
                    <select
                      value={searchResultsRowsPerPage}
                      onChange={(e) => {
                        setSearchResultsRowsPerPage(Number(e.target.value));
                        setSearchResultsPage(1);
                      }}
                      className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer text-gray-700"
                    >
                      {[10, 20, 50, 100].map(val => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-sm text-gray-600">
                    {Math.min(searchResults.length, (searchResultsPage - 1) * searchResultsRowsPerPage + 1)}-
                    {Math.min(searchResults.length, searchResultsPage * searchResultsRowsPerPage)} of {searchResults.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSearchResultsPage(p => Math.max(1, p - 1))}
                      disabled={searchResultsPage === 1}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPagesSearch }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPagesSearch || Math.abs(p - searchResultsPage) <= 1)
                        .map((p, i, arr) => (
                          <React.Fragment key={p}>
                            {i > 0 && arr[i - 1] !== p - 1 && <span className="text-gray-400 px-1">...</span>}
                            <button
                              onClick={() => setSearchResultsPage(p)}
                              className={`px-3 py-1 text-sm font-semibold rounded transition-colors ${searchResultsPage === p
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        ))
                      }
                    </div>
                    <button
                      onClick={() => setSearchResultsPage(p => Math.min(totalPagesSearch, p + 1))}
                      disabled={searchResultsPage === totalPagesSearch}
                      className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed text-gray-600"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'incoming-documents' ? (
        <div className="space-y-6">
          {/* Decorative Lines */}
          <div className="flex space-x-1">
            <div className="h-1 w-16 bg-green-500 rounded"></div>
            <div className="h-1 w-16 bg-yellow-400 rounded"></div>
            <div className="h-1 w-16 bg-green-500 rounded"></div>
          </div>

          {/* Main Announcement */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-green-800">
              Kivra letters have moved to Corporate Mailbox
            </h1>
            <div className="text-gray-700 space-y-2">
              <p>
                As previously announced, you will now find your letters from Kivra in{' '}
                <strong>Business Mailbox</strong> under{' '}
                <strong>Incoming letters & supporting documents</strong>. There you will also find{' '}
                <strong>Supporting documents</strong> and{' '}
                <strong>Emails</strong> without supporting documents.
              </p>
              <button
                onClick={handleReadMoreAboutKivra}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                Read more about the move of Kivra letters &gt;
              </button>
            </div>
          </div>

          {/* What happens now? Card */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-green-800">What happens now?</h2>

              <div className="space-y-4">
                <div className="text-6xl font-bold text-green-300 tracking-wider">
                  KIVRA
                </div>

                <p className="text-gray-700">
                  You who previously received attachments to{' '}
                  <strong>Incoming documents</strong> will now read mail from Kivra under{' '}
                  <strong>Menu &gt; Incoming letters & documents &gt; Company mailbox</strong>.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleGoToCorporateMailbox}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium"
                >
                  To Corporate Mailbox
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'vat' ? (
        selectedVatPeriod ? (
          <VatPeriodDetail
            period={selectedVatPeriod}
            onBack={() => setSelectedVatPeriod(null)}
          />
        ) : (
          <VatReportingPeriods onPeriodClick={handleVatPeriodClick} />
        )
      ) : null}

      {/* Verification Form Modal */}
      <VerificationForm
        isOpen={showVerificationForm}
        initialData={editingVerification}
        onClose={() => {
          setShowVerificationForm(false);
          setEditingVerification(null);
          // Only sync data when form is closed if it wasn't just created
          // (create operations are handled by onVerificationCreated)
          if (!wasVerificationJustCreated) {
            setTimeout(() => {
              syncVerificationsData();
            }, 500);
          } else {
            // Reset the flag after a short delay
            setTimeout(() => {
              setWasVerificationJustCreated(false);
            }, 1000);
          }
        }}
        onSave={(data) => {
          console.log('Verification data saved:', data);
        }}
        onVerificationCreated={loadVerifications}
        linkedFiles={linkedFiles}
      />
      {/* Gallery Panel - Slide out from right */}
      {showGalleryPanel && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowGalleryPanel(false)}></div>
          <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#9bbb48]/20">
                <h3 className="text-lg font-semibold text-gray-800">Linked Images</h3>
                <button
                  type="button"
                  onClick={() => setShowGalleryPanel(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                {currentVerification && currentVerification.images && currentVerification.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {currentVerification.images.map((image: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                        <div className="text-sm text-gray-700 mb-2 truncate" title={image.image_name || `Image ${index + 1}`}>
                          {image.image_name || `Image ${index + 1}`}
                        </div>
                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                          {image.image_url ? (
                            <img 
                              src={image.image_url} 
                              alt={image.image_name || `Verification image ${index + 1}`}
                              className="object-contain max-h-32"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // prevents infinite loop
                                target.src = '/placeholder-image.svg'; // fallback image
                              }}
                            />
                          ) : (
                            <div className="text-gray-400 text-xs text-center p-2">Image preview not available</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No images available for this verification.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <button
                  type="button"
                  onClick={() => setShowGalleryPanel(false)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#5c6f2b] hover:bg-[#4a5a25] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5c6f2b]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Conditional Attachment Panel */}
      {(activeTab === 'register-daily-cash' || activeTab === 'register-receipt' || showVerificationForm || showGalleryPanel) && (
        <AttachmentSidePanel
          isOpen={isAttachmentOpen}
          onToggle={() => setIsAttachmentOpen(!isAttachmentOpen)}
          onClose={() => setIsAttachmentOpen(false)}
          onLink={(files) => setLinkedFiles(files)}
          verificationId={selectedVerificationForAttachment?.id}
          onAttachToVerification={(success, message) => {
            if (success) {
              // Refresh the current verification to show updated images
              if (selectedVerificationForAttachment?.id) {
                VerificationService.getVerificationById(selectedVerificationForAttachment.id)
                  .then(response => {
                    if (response.success) {
                      setCurrentVerification(response.data);
                      // Update the verification in the list as well
                      setVerifications(prev => 
                        prev.map(v => 
                          v.id === response.data.id ? response.data : v
                        )
                      );
                    }
                  })
                  .catch(err => {
                    console.error('Failed to refresh verification after attachment:', err);
                  });
              }
            }
          }}
        />
      )}
    </div>
  );
};