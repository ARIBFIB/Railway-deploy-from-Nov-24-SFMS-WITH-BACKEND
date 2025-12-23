import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X, Search } from 'lucide-react';
// Import useNavigate
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  is_active: boolean;
}

interface AccountSelectorProps {
  value: string;
  onChange: (accountNumber: string, accountName: string) => void;
  placeholder?: string;
  className?: string;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Enter account',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const navigate = useNavigate();

  // Fetch active accounts when dropdown opens
  useEffect(() => {
    if (isOpen && accounts.length === 0) {
      fetchAccounts();
    }
  }, [isOpen]);

  // Filter accounts based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = accounts.filter(account =>
        account.account_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.account_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAccounts(filtered);
    } else {
      setFilteredAccounts(accounts);
    }
  }, [searchTerm, accounts]);

  // Find selected account when value changes
  useEffect(() => {
    if (value && accounts.length > 0) {
      const account = accounts.find(acc => acc.account_number === value);
      if (account) {
        setSelectedAccount(account);
      }
    } else {
      setSelectedAccount(null);
    }
  }, [value, accounts]);

  // Calculate dropdown position for fixed positioning (viewport-relative)
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const updatePosition = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + 4, // Use viewport coordinates for fixed positioning
            left: rect.left,
            width: rect.width
          });
        }
      };
      updatePosition();
      // Update on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
        containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await apiFetch('/api/accounts?is_active=true', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      if (data.success && data.data) {
        // Filter only active accounts
        const activeAccounts = data.data.filter((acc: Account) => acc.is_active === true);
        setAccounts(activeAccounts);
        setFilteredAccounts(activeAccounts);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    onChange(account.account_number, account.account_name);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAccount(null);
    onChange('', '');
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setSearchTerm(inputValue);

    // Update value immediately for manual entry
    onChange(inputValue, '');
    setSelectedAccount(null);

    // If dropdown is open, update search filter
    if (isOpen) {
      // Search term is already updated, filteredAccounts will update via useEffect
    }
  };

  const handleCreateNewAccount = () => {
    // Determine the route based on the current context or fixed route
    // The user requested navigating to "create new" which usually means the bookkeeping module
    navigate('/financial?tab=bookkeeping');
    setIsOpen(false);
  };

  return (
    <>
      <div ref={containerRef} className={`relative ${className}`}>
        {/* ... (existing input code) ... */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={selectedAccount ? `${selectedAccount.account_number} - ${selectedAccount.account_name}` : value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 pr-20 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-200 hover:bg-gray-300 rounded p-1 transition-colors"
            >
              <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden flex flex-col"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            minWidth: '200px'
          }}
        >
          {/* Create new button - Sticky top */}
          <div className="p-2 border-b border-gray-200 bg-gray-50 flex justify-end">
            <button
              onClick={handleCreateNewAccount}
              className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors flex items-center"
            >
              + Create new
            </button>
          </div>

          {/* Search input */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search accounts..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
            </div>
          </div>

          {/* Accounts list */}
          <div className="overflow-y-auto max-h-64 flex-grow">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading accounts...</div>
            ) : filteredAccounts.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                {searchTerm ? 'No accounts found' : 'No active accounts available'}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Account</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account) => (
                    <tr
                      key={account.id}
                      onClick={() => handleSelectAccount(account)}
                      className={`cursor-pointer hover:bg-green-50 ${selectedAccount?.id === account.id ? 'bg-green-100' : ''
                        }`}
                    >
                      <td className="px-4 py-2 text-sm border-b border-gray-100">{account.account_number}</td>
                      <td className="px-4 py-2 text-sm border-b border-gray-100">{account.account_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
};

