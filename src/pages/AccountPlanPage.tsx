import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Printer, RotateCcw, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Edit, Info, MessageCircle, Building, Car, Scale, Users, ShoppingBag, Wrench, Phone, Home, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import CreateAccountModal from '../components/CreateAccountModal';
import EditAccountModal from '../components/EditAccountModal';
import FeedbackModal from '../components/FeedbackModal';
import { AccountService } from '../services/accountService';
import type { Account, CreateAccountData, UpdateAccountData } from '../services/accountService';

// Account interface is now imported from accountService

interface PurchaseType {
  id: string;
  name: string;
  account: string;
  accountName: string;
  isLocked?: boolean;
}

interface PurchaseCategory {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
  isExpanded: boolean;
  isLocked?: boolean;
  purchaseTypes: PurchaseType[];
}

const AccountPlanPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'account-chart' | 'type-of-purchase'>('account-chart');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purchaseCategories, setPurchaseCategories] = useState<PurchaseCategory[]>([
    {
      id: '1',
      name: 'Bank and interest rate',
      icon: 'building',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '1', name: 'Card fees', account: '6040', accountName: 'Credit card fees' },
        { id: '2', name: 'Bank charges', account: '6570', accountName: 'Bank charges' },
      ],
    },
    {
      id: '2',
      name: 'Car and repair',
      icon: 'car',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '3', name: 'Gasoline and fuel', account: '5611', accountName: 'Fuel for passenger cars' },
        { id: '4', name: 'Car repair', account: '5613', accountName: 'Repair and maintenance of passenger cars' },
        { id: '5', name: 'Car leasing', account: '5615', accountName: 'Leasing of passenger cars' },
        { id: '6', name: 'Congestion tax', account: '5616', accountName: 'Congestion tax, deductible' },
        { id: '7', name: 'Other car costs', account: '5619', accountName: 'Other passenger car expenses' },
        { id: '8', name: 'Costs for other means of transport, not a car', account: '5690', accountName: 'Other costs for means of transport' },
        { id: '9', name: 'Rental car', account: '5820', accountName: 'Car rental costs' },
      ],
    },
    {
      id: '3',
      name: 'Events, food and coffee',
      icon: 'users',
      isActive: true,
      isExpanded: true,
      isLocked: true,
      purchaseTypes: [
        { id: '10', name: 'Representation', account: '6071', accountName: 'Entertainment, deductible and 3 more', isLocked: true },
      ],
    },
    {
      id: '4',
      name: 'Shipping and delivery',
      icon: 'scale',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '11', name: 'Shipping and transportation', account: '5710', accountName: 'Freight, transport and insurance in the distribution of goods' },
        { id: '12', name: 'Stamps', account: '6250', accountName: 'Postal forwarding' },
      ],
    },
    {
      id: '5',
      name: 'Association and service fee',
      icon: 'briefcase',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '13', name: 'Association fees, deductible', account: '6981', accountName: 'Association fees, deductible' },
        { id: '14', name: 'Association fees, non-deductible', account: '6982', accountName: 'Association fees, non-deductible' },
      ],
    },
    {
      id: '6',
      name: 'Sales and marketing',
      icon: 'users',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [],
    },
    {
      id: '7',
      name: 'Advertising',
      icon: 'users',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '15', name: 'Advertising', account: '5910', accountName: 'Advertising' },
        { id: '16', name: 'Advertising and PR', account: '5990', accountName: 'Other advertising and PR costs' },
      ],
    },
    {
      id: '8',
      name: 'Hotels and travel',
      icon: 'home',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '17', name: 'Trains, flights and public transport', account: '5810', accountName: 'Tickets' },
        { id: '18', name: 'Food and accommodation, domestic', account: '5831', accountName: 'Board and lodging in Sweden' },
        { id: '19', name: 'Food and accommodation, abroad', account: '5832', accountName: 'Board and lodging abroad' },
      ],
    },
    {
      id: '9',
      name: 'Purchase of goods',
      icon: 'shopping-bag',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '20', name: 'Purchase of goods', account: '4000', accountName: 'Purchase of goods from Sweden' },
        { id: '21', name: 'Consumables, such as mobile phones', account: '5410', accountName: 'Consumables' },
        { id: '22', name: 'Consumables (less value, short life)', account: '5460', accountName: 'Consumables' },
        { id: '23', name: 'Office supplies', account: '6110', accountName: 'Office supplies' },
        { id: '24', name: 'Non-fiction, newspapers', account: '6970', accountName: 'Newspapers, magazines and non-fiction' },
      ],
    },
    {
      id: '10',
      name: 'Internet and communication',
      icon: 'phone',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '25', name: 'Broadband and telephone, ongoing fees', account: '6210', accountName: 'Telecommunications' },
        { id: '26', name: 'Mobile phone charges', account: '6212', accountName: 'Mobile phone' },
        { id: '27', name: 'Broadband, email and domain name', account: '6230', accountName: 'Data communication' },
      ],
    },
    {
      id: '11',
      name: 'Premises and rent',
      icon: 'home',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '28', name: 'Other premises costs', account: '5090', accountName: 'Other premises costs' },
      ],
    },
    {
      id: '12',
      name: 'Staff',
      icon: 'users',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '29', name: 'Workwear and protective equipment', account: '5480', accountName: 'Workwear and protective equipment' },
        { id: '30', name: 'Training', account: '7610', accountName: 'Education' },
        { id: '31', name: 'Medical and health care, deductible', account: '7621', accountName: 'Medical and health care, deductible' },
      ],
    },
    {
      id: '13',
      name: 'Services',
      icon: 'wrench',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '32', name: 'Purchasing of services', account: '6590', accountName: 'Other external services' },
      ],
    },
    {
      id: '14',
      name: 'Equipment and software',
      icon: 'wrench',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '33', name: 'Equipment and tools, higher value', account: '1220', accountName: 'Equipment and tools' },
        { id: '34', name: 'Machine rental', account: '5210', accountName: 'Rental of machinery and other technical equipment' },
        { id: '35', name: 'Tool rental', account: '5220', accountName: 'Rental of equipment and tools' },
        { id: '36', name: 'Software', account: '5420', accountName: 'Software' },
        { id: '37', name: 'Repair of equipment, tools and computers', account: '5520', accountName: 'Repair and maintenance of equipment, tools and computers' },
      ],
    },
    {
      id: '15',
      name: 'Other',
      icon: 'users',
      isActive: true,
      isExpanded: true,
      purchaseTypes: [
        { id: '38', name: 'Private purchase with corporate card', account: '2893', accountName: 'Liabilities to related parties, current portion' },
      ],
    },
  ]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load accounts from API
  const loadAccounts = async () => {
    console.log('🔄 [DEBUG] loadAccounts called');
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 [DEBUG] Loading ALL accounts without filters');
      const response = await AccountService.getAccounts();
      console.log('📋 [DEBUG] Accounts response:', response);

      if (response.success) {
        console.log('✅ [DEBUG] Setting accounts:', response.data.length, 'accounts');
        console.log('📋 [DEBUG] Account data received:', response.data.map(acc => ({
          id: acc.id,
          name: acc.account_name,
          is_active: acc.is_active,
          account_number: acc.account_number
        })));

        // Apply frontend filtering
        let filteredAccounts = response.data;

        // Filter by status
        if (filter === 'active') {
          filteredAccounts = filteredAccounts.filter(acc => acc.is_active === true);
        } else if (filter === 'inactive') {
          filteredAccounts = filteredAccounts.filter(acc => acc.is_active === false);
        }

        // Filter by search term
        if (searchTerm) {
          filteredAccounts = filteredAccounts.filter(acc =>
            acc.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.account_number.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        console.log('📊 [DEBUG] Filtered accounts:', filteredAccounts.length);

        setAccounts(filteredAccounts);
        setTotalItems(filteredAccounts.length);
        setTotalPages(1); // No pagination needed

      } else {
        console.error('❌ [DEBUG] Failed to load accounts:', response);
        setError('Failed to load accounts');
      }
    } catch (err) {
      console.error('❌ [DEBUG] Error loading accounts:', err);
      setError('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  // Real-time data synchronization function
  const syncAccountsData = async () => {
    console.log('🔄 [DEBUG] Syncing accounts data');
    setLoading(true);
    setError(null);

    try {
      console.log('📊 Sync - Loading ALL accounts');
      const response = await AccountService.getAccounts();

      if (response.success) {
        console.log('✅ Sync - Successfully loaded:', response.data.length, 'accounts');

        // Apply frontend filtering
        let filteredAccounts = response.data;

        // Filter by status
        if (filter === 'active') {
          filteredAccounts = filteredAccounts.filter(acc => acc.is_active === true);
        } else if (filter === 'inactive') {
          filteredAccounts = filteredAccounts.filter(acc => acc.is_active === false);
        }

        // Filter by search term
        if (searchTerm) {
          filteredAccounts = filteredAccounts.filter(acc =>
            acc.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            acc.account_number.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        console.log('📊 Sync - Filtered accounts:', filteredAccounts.length);

        // Update state with new data
        setAccounts(filteredAccounts);
        setTotalItems(filteredAccounts.length);
        setTotalPages(1);
        setRefreshKey(prev => prev + 1);
      } else {
        console.error('❌ Sync - Failed to load accounts');
        setError('Failed to load accounts');
      }
    } catch (err) {
      console.error('❌ Sync - Error:', err);
      setError('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  // Load accounts when component mounts or filters change
  useEffect(() => {
    console.log('🔄 [DEBUG] useEffect triggered - loading accounts');
    loadAccounts();
  }, [filter, searchTerm, currentPage, itemsPerPage, refreshKey]);

  // Clear cache and force fresh data load when component mounts
  useEffect(() => {
    console.log('🔄 AccountPlanPage - Component mounted, clearing cache and loading fresh data');
    // Clear any cached data and force fresh load
    setAccounts([]);
    setTotalItems(0);
    setCurrentPage(1);
    // Load fresh data
    loadAccounts();
  }, []);

  const handleSelectAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map((account) => account.id!).filter(Boolean));
    }
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleEditAccount = (account: Account) => {
    // Find the most up-to-date account data from the current accounts array
    const currentAccount = accounts.find(acc => acc.id === account.id) || account;
    setEditingAccount(currentAccount);
    setShowEditModal(true);
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingAccount(null);
  };

  const handleEditModalSave = async (updateData: UpdateAccountData) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔧 [DEBUG] Updating account with data:', updateData);
      const response = await AccountService.updateAccount(updateData.id, updateData);
      console.log('📋 [DEBUG] Update response:', response);

      if (response.success) {
        console.log('✅ [DEBUG] Account updated successfully, reloading...');
        setShowEditModal(false);
        setEditingAccount(null);

        // Sync data after successful update
        console.log('🔄 [DEBUG] Syncing data after update...');
        await syncAccountsData();

        console.log('✅ [DEBUG] Accounts reloaded after update');
      } else {
        console.error('❌ [DEBUG] Account update failed:', response);
        setError('Failed to update account');
      }
    } catch (err) {
      console.error('❌ [Frontend] Error updating account:', err);
      setError('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModalSave = async (accountData: any) => {
    try {
      setLoading(true);
      setError(null);

      // Convert form data to API format
      const createData: CreateAccountData = {
        account_number: accountData.account,
        account_name: accountData.name,
        account_type: accountData.accountType,
        vat_code: accountData.vatCode,
        sru: accountData.sru,
        atm: accountData.atm,
        opening_balance: parseFloat(accountData.openingBalance?.replace(',', '.') || '0'),
        budget: parseFloat(accountData.budget?.replace(',', '.') || '0'),
        is_active: accountData.isActive === 'yes',
        automatic_accounting: accountData.automaticAccounting,
        suggest_debit_credit: accountData.suggestDebitCredit,
        transaction_info: accountData.transactionInfo,
        suggest_transaction_info: accountData.suggestTransactionInfo,
        budget_distribution: accountData.budgetDistribution,
        budget_rows: accountData.budgetRows?.map((row: any) => ({
          cost_center: row.costCenter,
          annual_budget: parseFloat(row.annualBudget?.replace(',', '.') || '0'),
          percentage: parseFloat(row.percentage?.replace(',', '.') || '0'),
          jan: parseFloat(row.months?.jan?.replace(',', '.') || '0'),
          feb: parseFloat(row.months?.feb?.replace(',', '.') || '0'),
          mar: parseFloat(row.months?.mar?.replace(',', '.') || '0'),
          apr: parseFloat(row.months?.apr?.replace(',', '.') || '0'),
          may: parseFloat(row.months?.may?.replace(',', '.') || '0'),
          jun: parseFloat(row.months?.jun?.replace(',', '.') || '0'),
          jul: parseFloat(row.months?.jul?.replace(',', '.') || '0'),
          aug: parseFloat(row.months?.aug?.replace(',', '.') || '0'),
          sep: parseFloat(row.months?.sep?.replace(',', '.') || '0'),
          oct: parseFloat(row.months?.oct?.replace(',', '.') || '0'),
          nov: parseFloat(row.months?.nov?.replace(',', '.') || '0'),
          dec: parseFloat(row.months?.dec?.replace(',', '.') || '0'),
          christmas: parseFloat(row.months?.christmas?.replace(',', '.') || '0'),
        }))
      };

      console.log('🔧 [DEBUG] Creating account with data:', createData);
      const response = await AccountService.createAccount(createData);
      console.log('📋 [DEBUG] Create response:', response);

      if (response.success) {
        console.log('✅ [DEBUG] Account created successfully, reloading...');
        setShowCreateModal(false);

        // Sync data after successful creation
        console.log('🔄 [DEBUG] Syncing data after creation...');
        await syncAccountsData();

        console.log('✅ [DEBUG] Accounts reloaded after creation');
      } else {
        console.error('❌ [DEBUG] Account creation failed:', response);
        setError('Failed to create account');
      }
    } catch (err) {
      console.error('❌ [Frontend] Error creating account:', err);
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackModalClose = () => {
    setShowFeedbackModal(false);
  };

  const handleFeedbackSend = (feedback: string) => {
    console.log('Feedback submitted:', feedback);
    // Here you would typically send the feedback to your backend
    // For now, we'll just log it
    alert('Thank you for your feedback!');
  };

  const handleDelete = async () => {
    if (selectedAccounts.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedAccounts.length} selected account(s)?`)) {
      try {
        setLoading(true);
        setError(null);

        const response = await AccountService.bulkDelete(selectedAccounts);
        if (response.success) {
          setSelectedAccounts([]);
          await loadAccounts();
        } else {
          setError('Failed to delete accounts');
        }
      } catch (err) {
        console.error('Error deleting accounts:', err);
        setError('Failed to delete accounts');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleActivate = async () => {
    if (selectedAccounts.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const response = await AccountService.bulkUpdateStatus(selectedAccounts, true);
      if (response.success) {
        setSelectedAccounts([]);
        await loadAccounts();
      } else {
        setError('Failed to activate accounts');
      }
    } catch (err) {
      console.error('Error activating accounts:', err);
      setError('Failed to activate accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (selectedAccounts.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      const response = await AccountService.bulkUpdateStatus(selectedAccounts, false);
      if (response.success) {
        setSelectedAccounts([]);
        await loadAccounts();
      } else {
        setError('Failed to disable accounts');
      }
    } catch (err) {
      console.error('Error disabling accounts:', err);
      setError('Failed to disable accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setPurchaseCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, isExpanded: !category.isExpanded }
          : category
      )
    );
  };

  const handleCategoryActiveToggle = (categoryId: string) => {
    setPurchaseCategories((prev) =>
      prev.map((category) =>
        category.id === categoryId
          ? { ...category, isActive: !category.isActive }
          : category
      )
    );
  };

  const handleEditPurchaseType = (categoryId: string, purchaseTypeId: string) => {
    console.log('Edit purchase type:', categoryId, purchaseTypeId);
    // TODO: Implement edit modal
  };

  const handleAddPurchaseType = (categoryId: string) => {
    console.log('Add purchase type to category:', categoryId);
    // TODO: Implement add modal
  };

  const hasActiveSelected = selectedAccounts.some((id) => {
    const account = accounts.find((acc) => acc.id === id);
    return account?.is_active;
  });

  const hasInactiveSelected = selectedAccounts.some((id) => {
    const account = accounts.find((acc) => acc.id === id);
    return !account?.is_active;
  });

  // Accounts are already filtered by the API, so we use them directly
  const filteredAccounts = accounts;

  const handleFilterChange = (newFilter: 'all' | 'active' | 'inactive') => {
    setFilter(newFilter);
    setSelectedAccounts([]);
  };

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      building: <Building className="w-5 h-5" />,
      car: <Car className="w-5 h-5" />,
      users: <Users className="w-5 h-5" />,
      scale: <Scale className="w-5 h-5" />,
      briefcase: <Briefcase className="w-5 h-5" />,
      'shopping-bag': <ShoppingBag className="w-5 h-5" />,
      phone: <Phone className="w-5 h-5" />,
      home: <Home className="w-5 h-5" />,
      wrench: <Wrench className="w-5 h-5" />,
    };
    return iconMap[iconName] || <Users className="w-5 h-5" />;
  };

  // Dynamic pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-2 py-1 text-sm ${currentPage === i
              ? 'bg-green-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">REGISTER - CHART OF ACCOUNTS</h1>
            <div className="flex items-center space-x-4">
              {activeTab === 'account-chart' && (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Account, Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                      aria-label="Search accounts"
                    />
                  </div>
                  <button
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    aria-label="Advanced search"
                  >
                    Advanced search
                  </button>
                  <Button
                    onClick={handleCreateNew}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
                    aria-label="Create new account"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create account</span>
                  </Button>
                  <Button
                    onClick={async () => {
                      console.log('🔄 [DEBUG] Manual sync triggered');
                      await syncAccountsData();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
                    aria-label="Refresh accounts"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Refresh</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('account-chart')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'account-chart'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              aria-label="View account chart"
            >
              Account chart
            </button>
            <button
              onClick={() => setActiveTab('type-of-purchase')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'type-of-purchase'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              aria-label="View type of purchase"
            >
              Type of purchase
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar - Only for Account Chart */}
      {activeTab === 'account-chart' && (
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFilterChange('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                      }`}
                    aria-label="Show all accounts"
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleFilterChange('active')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'active'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                      }`}
                    aria-label="Show active accounts"
                  >
                    Active
                  </button>
                  <button
                    onClick={() => handleFilterChange('inactive')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'inactive'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                      }`}
                    aria-label="Show inactive accounts"
                  >
                    Inactive
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                    aria-label="Mass processing"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="text-sm">Mass processing</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                    aria-label="Print list"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="text-sm">Print list</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                    aria-label="Carry over balances"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span className="text-sm">Carry over balances from previous years</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  <select
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    aria-label="Items per page"
                  >
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                  </select>
                  <span className="text-sm text-gray-600">of {totalItems}</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      aria-label="Go to first page"
                    >
                      {'<<'}
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      aria-label="Go to previous page"
                    >
                      {'<'}
                    </button>
                    {renderPaginationButtons()}
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      aria-label="Go to next page"
                    >
                      {'>'}
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                      aria-label="Go to last page"
                    >
                      {'>>'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      {activeTab === 'account-chart' ? (
        <div className="bg-white">
          {/* Error Display */}
          {error && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-200">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}

          {/* Filter Status Indicator */}
          <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {loading ? 'Loading accounts...' : (
                  <>
                    {filter === 'all' && `Showing all ${totalItems} accounts`}
                    {filter === 'active' && `Showing ${filteredAccounts.length} active accounts`}
                    {filter === 'inactive' && `Showing ${filteredAccounts.length} inactive accounts`}
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {selectedAccounts.length > 0 && `${selectedAccounts.length} selected`}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label="Select all accounts"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                    ACCOUNT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    VAT CODE (VAT BOX)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SRU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ATM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    OPENING BALANCE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    BUDGET
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                      Loading accounts...
                    </td>
                  </tr>
                ) : filteredAccounts.length > 0 ? (
                  filteredAccounts.map((account) => (
                    <tr key={account.id} className={!account.is_active ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedAccounts.includes(account.id!)}
                          onChange={() => handleSelectAccount(account.id!)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select account ${account.account_number}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.account_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {account.account_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.vat_code || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.sru || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.atm || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.opening_balance?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.budget?.toLocaleString('sv-SE', { minimumFractionDigits: 2 }) || '0,00'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${account.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {account.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="Edit account"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                      {filter === 'active' && 'No active accounts found'}
                      {filter === 'inactive' && 'No inactive accounts found'}
                      {filter === 'all' && 'No accounts found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6">
          {/* Type of Purchase Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-green-700">Type of purchase</h1>
              <Button
                onClick={() => setShowFeedbackModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                aria-label="Leave feedback"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Leave feedback</span>
              </Button>
            </div>
            <p className="text-gray-600 mb-4">
              Each category contains a collection of <strong>type of purchase</strong>, where everyone has a unique account connection.
              Categories provide good support when registering receipts with <strong>Business Card</strong> and <strong>Receipt & Expenses</strong>,
              which can ensure that the correct accounting account is used.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search category, type of purchase or accounting account"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Search purchase categories"
              />
            </div>
          </div>

          {/* Purchase Categories */}
          <div className="space-y-4">
            {purchaseCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Category Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        {getIcon(category.icon)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <button
                      onClick={() => handleCategoryToggle(category.id)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label={category.isExpanded ? `Collapse ${category.name}` : `Expand ${category.name}`}
                    >
                      {category.isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Category Content */}
                {category.isExpanded && (
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-600">
                          {category.isLocked
                            ? "NOTE: This category is always active because there are locked types of purchases that use the Swedish Tax Agency's standard calculation."
                            : "Only the active category and type of purchase will be visible when registering a receipt."
                          }
                        </p>
                        {category.purchaseTypes.some((pt) => pt.isLocked) && (
                          <Info className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Active category</span>
                        <button
                          onClick={() => handleCategoryActiveToggle(category.id)}
                          disabled={category.isLocked}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${category.isActive ? 'bg-green-600' : 'bg-gray-200'
                            } ${category.isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          aria-label={`Toggle active status for ${category.name}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${category.isActive ? 'translate-x-6' : 'translate-x-1'
                              }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Purchase Types Table */}
                    {category.purchaseTypes.length > 0 ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-500 border-b border-gray-200 pb-2">
                          <div>Type of purchase</div>
                          <div>Account</div>
                        </div>
                        {category.purchaseTypes.map((purchaseType) => (
                          <div
                            key={purchaseType.id}
                            className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-900">{purchaseType.name}</span>
                              {purchaseType.isLocked && <Info className="w-4 h-4 text-blue-500" />}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-900">
                                {purchaseType.account} - {purchaseType.accountName}
                              </span>
                              <button
                                onClick={() => handleEditPurchaseType(category.id, purchaseType.id)}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label={`Edit ${purchaseType.name}`}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No purchase types in this category
                      </div>
                    )}

                    {/* Add Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => handleAddPurchaseType(category.id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center space-x-1"
                        aria-label={`Add purchase type to ${category.name}`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Bar - Only for Account Chart */}
      {activeTab === 'account-chart' && (
        <div className="bg-white border-t border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDelete}
                  disabled={selectedAccounts.length === 0}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${selectedAccounts.length > 0
                      ? 'bg-gray-500 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  aria-label="Delete selected accounts"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                <span className="text-sm text-gray-600">
                  ({selectedAccounts.length} selected)
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleActivate}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${hasInactiveSelected
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={!hasInactiveSelected}
                  aria-label="Activate selected accounts"
                >
                  <Eye className="w-4 h-4" />
                  <span>Activate</span>
                </button>
                <button
                  onClick={handleDisable}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${hasActiveSelected
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  disabled={!hasActiveSelected}
                  aria-label="Disable selected accounts"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Disable</span>
                </button>
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-gray-400"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={showCreateModal}
        onClose={handleCreateModalClose}
        onSave={handleCreateModalSave}
      />

      {/* Edit Account Modal */}
      <EditAccountModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        onSave={handleEditModalSave}
        account={editingAccount}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackModalClose}
        onSend={handleFeedbackSend}
      />
    </div>
  );
};

export default AccountPlanPage;