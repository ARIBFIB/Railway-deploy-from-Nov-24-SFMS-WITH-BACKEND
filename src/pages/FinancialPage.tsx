import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Calculator, FileText, CreditCard, Users, Shield, Building, TrendingUp, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '../components/Card';
import { BookkeepingModule } from '../components/financial/BookkeepingModule';
import { InvoicingModule } from '../components/financial/InvoicingModule';
import SupplierInvoicesList from '../components/supplier_invoice/SupplierInvoicesList';
import { BankIDAuthentication } from '../components/financial/BankIDAuthentication';
import { PayrollModule } from '../components/financial/PayrollModule';
import { BankIntegration } from '../components/financial/BankIntegration';
import { VerificationsList } from '../components/financial/VerificationsList';
import { FinancialService, type DashboardStats } from '../services/financialService';

type FinancialTab = 'bookkeeping' | 'invoicing' | 'supplier-invoices' | 'payroll' | 'bank-integration' | 'bankid' | 'accounting' | 'expense-management';

const CURRENT_FOUNDATION_ID = 'foundation-1';

export const FinancialPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') as FinancialTab;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'bookkeeping':
        return <BookkeepingModule />;
      case 'invoicing':
        return <InvoicingModule />;
      case 'supplier-invoices':
        return <SupplierInvoicesList />;
      case 'payroll':
        return <PayrollModule />;
      case 'bank-integration':
        return <BankIntegration />;
      case 'bankid':
        return <BankIDAuthentication />;
      case 'accounting':
        return <VerificationsList />;
      case 'expense-management':
        return <ExpenseManagementPlaceholder />;
      default:
        return <FinancialOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {!activeTab && (
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">Comprehensive financial tools for Swedish foundations.</p>
        </div>
      )}

      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

const FinancialOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await FinancialService.getDashboardStats(CURRENT_FOUNDATION_ID);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch financial stats:', err);
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-1">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.total_assets.toLocaleString('sv-SE')} {stats?.currency}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Outstanding Invoices</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.outstanding_invoices.amount.toLocaleString('sv-SE')} {stats?.currency}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.pending_approvals}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Payroll</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.monthly_payroll.toLocaleString('sv-SE')} {stats?.currency}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Bookkeeping & Accounting" subtitle="Double-entry bookkeeping with Swedish standards">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calculator className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Chart of Accounts</p>
                  <p className="text-sm text-gray-600">BAS-compliant account structure</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">View Accounts</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Journal Entries</p>
                  <p className="text-sm text-gray-600">Automated and manual entries</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">View Entries</span>
            </div>
          </div>
        </Card>

        <Card title="Invoicing System" subtitle="Professional invoicing with Swedish tax compliance">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
              <div>
                <p className="font-medium text-gray-900">Sales Invoices</p>
                <p className="text-sm text-gray-600">
                  {stats?.outstanding_invoices.count} sent, {stats?.outstanding_invoices.amount.toLocaleString('sv-SE')} {stats?.currency} outstanding
                </p>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 border-l-4 border-green-400 bg-green-50 rounded-r-lg">
              <div>
                <p className="font-medium text-gray-900">Purchase Invoices</p>
                <p className="text-sm text-gray-600">Automated processing & approval</p>
              </div>
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Automated
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* BankID & Security */}
      <Card title="Security & Authentication" subtitle="BankID integration for secure financial operations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900">BankID Authentication</h3>
            <p className="text-sm text-gray-600">Secure user verification for financial transactions</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900">Digital Signatures</h3>
            <p className="text-sm text-gray-600">Legally binding signatures for invoices and contracts</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900">Audit Trails</h3>
            <p className="text-sm text-gray-600">Complete financial activity logging and compliance</p>
          </div>
        </div>
      </Card>

      {/* Bank Integration */}
      <Card title="Bank Integration" subtitle="Connect with Swedish banks for automated transaction import">
        <div className="space-y-4">
          {stats?.bank_accounts && stats.bank_accounts.length > 0 ? (
            stats.bank_accounts.map((account: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 ${account.is_active ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                  <span className="text-sm text-gray-900">{account.bank_name || account.bank} - {account.name || account.account_name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Number(account.current_balance).toLocaleString('sv-SE')} {account.currency}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No bank accounts connected.</p>
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-900">Reconciliation Status</span>
            </div>
            <span className="text-xs text-gray-500">Check Bank Integration tab</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

const ExpenseManagementPlaceholder: React.FC = () => {
  return (
    <div className="text-center py-12">
      <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Expense Management</h3>
      <p className="text-gray-600 mb-4">
        Enhanced expense management module will be integrated here, building upon the existing expense tracking functionality.
      </p>
      <p className="text-sm text-gray-500">
        This will include receipt scanning, automated categorization, approval workflows, and integration with the bookkeeping system.
      </p>
    </div>
  );
};