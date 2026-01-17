import React, { useState } from 'react';
import { Star, X, MessageCircle, FileText, BarChart3, ChevronDown } from 'lucide-react';

const ReportsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'all'>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    'balance-report': true,
    'performance-report': true,
  });

  // Get favorite reports
  const favoriteReports = [
    { id: 'balance-report', title: 'Balance report', subtitle: 'Accounting', section: 'Accounting' },
    { id: 'performance-report', title: 'Performance report', subtitle: 'Accounting', section: 'Accounting' },
    // Add other favorites here as they are marked
  ].filter(report => favorites[report.id]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const AccountingReports = () => (
    <div className="mb-8">
      <h3 className="text-[15px] font-semibold text-[#065F46] mb-2">Accounting</h3>
      <div className="space-y-1">
        {[
          { id: 'balance-sheet', title: 'Balance sheet' },
          { id: 'cash-flow', title: 'Cash flow' },
          { id: 'general-ledger', title: 'General ledger' },
          { id: 'profit-loss', title: 'Profit & loss' },
          { id: 'trial-balance', title: 'Trial balance' },
          { id: 'vat-report', title: 'VAT report' },
        ].map(report => (
          <div 
            key={report.id} 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group"
            onClick={() => toggleFavorite(report.id)}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              {report.title}
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 ${
                favorites[report.id] 
                  ? 'text-[#FACC15] fill-current' 
                  : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const AssetSupplierWarehouseReports = () => (
    <div className="mb-8">
      {/* Top Row (Ungrouped Items) */}
      <div className="space-y-1 mb-4">
        {[
          { id: 'voucher-list', title: 'Voucher list' },
          { id: 'supplier-directory', title: 'Supplier directory' },
          { id: 'ledger-list', title: 'Ledger list' },
          { id: 'warehouse-list', title: 'Warehouse list' },
          { id: 'supplier-statistics', title: 'Supplier statistics' },
          { id: 'top-rated-suppliers', title: 'Top rated suppliers' },
        ].map(report => (
          <div 
            key={report.id} 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group"
            onClick={() => toggleFavorite(report.id)}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              {report.title}
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 ${
                favorites[report.id] 
                  ? 'text-[#FACC15] fill-current' 
                  : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Asset register Section */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#065F46] my-4">Asset register</h3>
        <div className="space-y-1">
          {[
            { id: 'asset-groups', title: 'Asset groups (New)', isNew: true },
            { id: 'asset-information', title: 'Asset information' },
            { id: 'asset-list', title: 'Asset list' },
            { id: 'depreciation', title: 'Depreciation' },
            { id: 'depreciation-per-month', title: 'Depreciation per month' },
          ].map(report => (
            <div 
              key={report.id} 
              className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group"
              onClick={() => toggleFavorite(report.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
                  {report.title}
                </span>
                {report.isNew && (
                  <span className="text-[12px] text-[#16A34A] font-medium">(New)</span>
                )}
              </div>
              <Star 
                className={`w-4 h-4 transition-all duration-200 ${
                  favorites[report.id] 
                    ? 'text-[#FACC15] fill-current' 
                    : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Intrastat Section */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#065F46] mt-4">Intrastat</h3>
        <div className="space-y-1">
          <div 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group"
            onClick={() => toggleFavorite('intrastat-basis')}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              Intrastat basis
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 ${
                favorites['intrastat-basis'] 
                  ? 'text-[#FACC15] fill-current' 
                  : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Invoicing Section */}
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#065F46]">Invoicing</h3>
        <div className="space-y-1">
          <div 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group"
            onClick={() => toggleFavorite('currency-report-customer')}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              Currency report customer
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 ${
                favorites['currency-report-customer'] 
                  ? 'text-[#FACC15] fill-current' 
                  : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Warehouse Section */}
      <div>
        <h3 className="text-[15px] font-semibold text-[#065F46]">Warehouse</h3>
        <div className="space-y-1">
          <div 
            className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group"
            onClick={() => toggleFavorite('stock-value-report')}
          >
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              Stock value report
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 ${
                favorites['stock-value-report'] 
                  ? 'text-[#FACC15] fill-current' 
                  : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const DirectoriesListsReports = () => (
    <div className="mb-8">
      <h3 className="text-[15px] font-semibold text-[#065F46] mb-2">Directories and lists</h3>
      <div className="space-y-1">
        {[
          { id: 'account-plan', title: 'Account plan' },
          { id: 'customer-directory', title: 'Customer directory' },
          { id: 'customer-statistics', title: 'Customer statistics' },
          { id: 'item-directory', title: 'Item directory' },
          { id: 'item-statistics', title: 'Item statistics' },
          { id: 'item-statistics-advanced', title: 'Item statistics advanced' },
        ].map(report => (
          <div key={report.id} className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group">
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              {report.title}
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 ${
                favorites[report.id] 
                  ? 'text-[#FACC15] fill-current' 
                  : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(report.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const SalaryReports = () => (
    <div className="mb-8">
      <h3 className="text-[15px] font-semibold text-[#065F46] mb-2">Salary</h3>
      <div className="space-y-1">
        {[
          { id: 'gross-salary-list', title: 'Gross salary list' },
          { id: 'personnel-list', title: 'Personnel list' },
          { id: 'salary-statistics', title: 'Salary statistics' },
          { id: 'salary-survey', title: 'Salary survey' },
          { id: 'salary-type-list', title: 'Salary type list' },
          { id: 'staff-card', title: 'Staff card' },
          { id: 'average-employees', title: 'The average number of employees' },
        ].map(report => (
          <div key={report.id} className="flex items-center justify-between py-1.5 px-1 hover:bg-[#F9FAFB] cursor-pointer group">
            <span className="text-[14px] text-[#111827] group-hover:text-[#065F46] transition-colors duration-200">
              {report.title}
            </span>
            <Star 
              className={`w-4 h-4 transition-all duration-200 ${
                favorites[report.id] 
                  ? 'text-[#FACC15] fill-current' 
                  : 'text-[#D1D5DB] group-hover:text-[#9CA3AF]'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(report.id);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-semibold text-[#064E3B]">Reports</h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-3 py-1.5 text-[14px] font-medium text-[#16A34A] border border-[#16A34A] rounded-full bg-white hover:bg-gray-50">
            <MessageCircle className="w-4 h-4" />
            Leave feedback
          </button>
        </div>
      </div>

      {/* Information Banner */}
      <div className="mb-6 bg-[#ECFDF5] rounded-lg p-3">
        <div className="flex items-start gap-2">
          <FileText className="w-4.5 h-4.5 text-[#16A34A] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-[14px] text-[#065F46] mb-1">
              Create extended and more customized reports!
            </p>
            <button className="text-[14px] font-medium text-[#16A34A] hover:underline">
              Read more about Report & Analysis ›
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-6">
          <button
            className={`text-[14px] font-medium ${
              activeTab === 'favorites' 
                ? 'text-[#111827] font-semibold relative' 
                : 'text-[#6B7280]'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites
            {activeTab === 'favorites' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FACC15]"></div>
            )}
          </button>
          <button
            className={`text-[14px] font-medium ${
              activeTab === 'all' 
                ? 'text-[#111827] font-semibold relative' 
                : 'text-[#6B7280]'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All reports
            {activeTab === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FACC15]"></div>
            )}
          </button>
        </div>
      </div>

      {/* Reports Content */}
      <div>
        {activeTab === 'favorites' ? (
          <div className="py-4">
            {favoriteReports.length > 0 ? (
              <div className="space-y-4">
                {/* Pinned Favorite Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteReports.map(report => (
                    <div 
                      key={report.id}
                      className="flex items-center justify-between bg-[#F3F6F4] p-4 rounded-xl h-18 cursor-pointer hover:bg-[#E9F5EF] transition-colors duration-200"
                      onClick={() => toggleFavorite(report.id)}
                    >
                      <div>
                        <h3 className="text-[16px] font-semibold text-[#064E3B] leading-6">{report.title}</h3>
                        <p className="text-[13px] font-normal text-[#065F46] mt-0.5">{report.subtitle}</p>
                      </div>
                      <Star 
                        className={`w-4.5 h-4.5 ${favorites[report.id] ? 'text-[#FACC15] fill-current' : 'text-[#D1D5DB]'}`}
                      />
                    </div>
                  ))}
                </div>
                
                {/* All reports section */}
                <div className="mt-8">
                  <AccountingReports />
                  <AssetSupplierWarehouseReports />
                  <DirectoriesListsReports />
                  <SalaryReports />
                </div>
              </div>
            ) : (
              /* Favorites Empty State */
              <div className="flex flex-col items-center py-10 px-2">
                {/* Empty State Illustration */}
                <div className="w-24 h-24 flex items-center justify-center">
                  <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-24">
                    <path d="M48 12L60 24L48 36L36 24L48 12Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M48 36V12" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 48C24 44.6863 26.6863 42 30 42H66C69.3137 42 72 44.6863 72 48V72C72 75.3137 69.3137 78 66 78H30C26.6863 78 24 75.3137 24 72V48Z" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M36 60H48" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M60 60H66" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="42" cy="54" r="1" fill="#22C55E"/>
                    <circle cx="54" cy="54" r="1" fill="#22C55E"/>
                    <circle cx="60" cy="54" r="1" fill="#22C55E"/>
                  </svg>
                </div>
                
                {/* Primary Heading */}
                <h2 className="text-[24px] font-semibold text-[#064E3B] text-center mt-5">
                  Your tailored report view
                </h2>
                
                {/* Supporting Description */}
                <p className="text-[14px] text-[#374151] text-center max-w-[520px] mt-2 leading-5">
                  You decide! Here you'll find the reports you want easily accessible.
                  Add or update your favorites anytime under the tab 
                  <span 
                    className="text-[#065F46] font-medium cursor-pointer hover:underline"
                    onClick={() => setActiveTab('all')}
                  >
                    All reports ›
                  </span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div>
              <AccountingReports />
              <AssetSupplierWarehouseReports />
            </div>
            <div>
              <DirectoriesListsReports />
            </div>
            <div>
              <SalaryReports />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;