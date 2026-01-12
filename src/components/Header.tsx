import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, BarChart3, ChevronDown, X, Settings } from 'lucide-react';
import { Button } from './Button';
import { LanguageSwitch } from './LanguageSwitch';
import { SettingsModal } from './SettingsModal';
import { mockUser } from '../data/mockData';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [reportsDropdownOpen, setReportsDropdownOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Get user data from localStorage for demo
  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const currentUser = {
    ...mockUser,
    ...userData
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setRegisterDropdownOpen(false);
        setReportsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Foundation Management</h1>
          <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Manage your foundations efficiently</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Reports and Register Buttons */}
          <div className="flex items-center space-x-3">
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setReportsDropdownOpen(!reportsDropdownOpen)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Reports
                <ChevronDown className="w-4 h-4" />
              </Button>

              {reportsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-700">Reports</h3>
                      <button
                        onClick={() => setReportsDropdownOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {/* Left Column */}
                      <div className="space-y-2">
                        <div className="font-semibold text-green-700 mb-2">Accounting</div>
                        <div className="space-y-1 pl-2">
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Balance sheet <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Deleted vouchers <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Ledger <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Opening balance <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Account analysis <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Liquidity report <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            VAT report <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Accruals <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Periodic compilation <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Profit budget <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Results report <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            12 Months Performance Report <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Advanced performance report <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            System documentation <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Checklist <span>{'>'}</span>
                          </div>
                        </div>

                        <div className="font-semibold text-green-700 mb-2 mt-4">Intrastat</div>
                        <div className="space-y-1 pl-2">
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Intrastat documents <span>{'>'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Column */}
                      <div className="space-y-2">
                        <div className="font-semibold text-green-700 mb-2">Supplier invoices</div>
                        <div className="space-y-1 pl-2">
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Due date list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Supplier statistics <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Ledger list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Top supplier list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Currency report provider <span>{'>'}</span>
                          </div>
                        </div>

                        <div className="font-semibold text-green-700 mb-2 mt-4">Billing</div>
                        <div className="space-y-1 pl-2">
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Due date list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Ledger list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Top customer list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Customer currency report <span>{'>'}</span>
                          </div>
                        </div>

                        <div className="font-semibold text-green-700 mb-2 mt-4">Registers and lists</div>
                        <div className="space-y-1 pl-2">
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Article index <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Article statistics <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Advanced article statistics <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Account chart <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Customer register <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Customer statistics <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Stock list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Supplier register <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Quote/Order/Invoice list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Quote/Order/Invoice list summarized <span>{'>'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-2">
                        <div className="font-semibold text-green-700 mb-2">Facility register</div>
                        <div className="space-y-1 pl-2">
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Depreciation <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Depreciation (New) <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Depreciation per month <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Export assets <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Sale and disposal <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Upcoming depreciation <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Asset information <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Asset list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Depreciation carried out <span>{'>'}</span>
                          </div>
                        </div>

                        <div className="font-semibold text-green-700 mb-2 mt-4">Salary</div>
                        <div className="space-y-1 pl-2">
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Gross payroll <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Salary type list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Salary survey <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Salary statistics <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Average number of employees <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Staff list <span>{'>'}</span>
                          </div>
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Identity card <span>{'>'}</span>
                          </div>
                        </div>

                        <div className="font-semibold text-green-700 mb-2 mt-4">Stock</div>
                        <div className="space-y-1 pl-2">
                          <div className="text-green-600 hover:text-green-800 cursor-pointer flex items-center justify-between">
                            Inventory value report <span>{'>'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                      <button
                        onClick={() => setReportsDropdownOpen(false)}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                className="flex items-center gap-2"
              >
                Register
                <ChevronDown className="w-4 h-4" />
              </Button>

              {registerDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigate('/working-hours-schedule');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Working hours schedule
                    </button>
                    <button
                      onClick={() => {
                        navigate('/articles');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Articles
                    </button>
                    <button
                      onClick={() => {
                        navigate('/salary-agreements');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Agreement for salaries
                    </button>
                    <button
                      onClick={() => {
                        navigate('/account-plan');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Chart of account
                    </button>
                    <button
                      onClick={() => {
                        navigate('/customers');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Customers
                    </button>
                    <button
                      onClick={() => {
                        navigate('/items');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Items
                    </button>
                    <button
                      onClick={() => {
                        navigate('/warehouses');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Warehouses
                    </button>
                    <button
                      onClick={() => {
                        navigate('/suppliers');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Suppliers
                    </button>
                    <button
                      onClick={() => {
                        navigate('/wage-types');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Wage types and codes
                    </button>
                    <button
                      onClick={() => {
                        navigate('/personnel-register');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Staff
                    </button>
                    <button
                      onClick={() => {
                        navigate('/personnel-register?tab=categories');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Staff - Categories
                    </button>
                    <button
                      onClick={() => {
                        console.log('Project button clicked, navigating to /project-management');
                        navigate('/project-management');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Project
                    </button>
                    <button
                      onClick={() => {
                        navigate('/transaction-accounts');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Transaction accounts
                    </button>
                    <button
                      onClick={() => {
                        navigate('/sie-export');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                    >
                      Export
                    </button>
                    <button
                      onClick={() => {
                        navigate('/sie-import');
                        setRegisterDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Import
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <LanguageSwitch />

          {/* Settings Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSettingsModalOpen(true)}
            className="flex items-center gap-2"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2">
              <img
                src={currentUser.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
                alt={currentUser.full_name}
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden lg:block">
                <p className="text-sm font-medium text-gray-900">{currentUser.full_name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-600">{currentUser.email}</p>
                  {currentUser.role && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${currentUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                        currentUser.role === 'foundation_owner' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {currentUser.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <img
              src={currentUser.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'}
              alt={currentUser.full_name}
              className="w-8 h-8 rounded-full sm:hidden"
            />

            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </header>
  );
};