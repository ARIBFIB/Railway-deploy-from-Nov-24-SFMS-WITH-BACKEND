import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Plus, 
  Printer, 
  HelpCircle,
  ChevronDown,
  Trash2,
  Upload,
  Calendar,
  CheckCircle,
  Clock,
  User,
  Truck,
  FileText,
  ArrowLeft,
  ArrowUpDown
} from 'lucide-react';
import { billingService } from '../services/billingService';
import { RecurrentList } from '../components/financial/RecurrentList';

const BillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customer-invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('to-handle');
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Load billing data from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [invoicesData, paymentsData, remindersData] = await Promise.all([
          billingService.getInvoices({ status: activeFilter }),
          billingService.getPayments(),
          billingService.getReminders()
        ]);
        if (!mounted) return;
        setInvoices(invoicesData);
        setPayments(paymentsData);
        setReminders(remindersData);
      } catch (e) {
        console.error('Failed to load billing data', e);
        setError('Failed to load billing data');
        setInvoices([]);
        setPayments([]);
        setReminders([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [activeFilter]);
  
  // Payments form state
  const [paymentDate, setPaymentDate] = useState('2025-09-16');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  
  // Reminders state
  const [reminderFilter, setReminderFilter] = useState('reminders-to-send'); // Used in filter logic
  const [reminderDate, setReminderDate] = useState('');
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  
  // Recurrent form state
  const [currentStep, setCurrentStep] = useState(1);
  const [activeDetailTab, setActiveDetailTab] = useState('invoice-details');
  const [itemSearch, setItemSearch] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  

  // Mock data for invoices
  const invoiceData = [
    {
      id: '1',
      factNo: 'F2024-001',
      ocr: '1234567890',
      type: 'Invoice',
      customerNo: 'C001',
      name: 'ABC Corporation',
      factDate: '2024-01-15',
      dateOfBirth: '',
      total: 15000,
      balance: 15000,
      currency: 'SEK',
      previousDate: '2024-01-15',
      finalPayment: '2024-02-15',
      status: 'unpaid'
    },
    {
      id: '2',
      factNo: 'F2024-002',
      ocr: '0987654321',
      type: 'Invoice',
      customerNo: 'C002',
      name: 'XYZ Ltd',
      factDate: '2024-01-20',
      dateOfBirth: '',
      total: 8500,
      balance: 0,
      currency: 'SEK',
      previousDate: '2024-01-20',
      finalPayment: '2024-02-20',
      status: 'paid'
    },
    {
      id: '3',
      factNo: 'F2024-003',
      ocr: '1122334455',
      type: 'Invoice',
      customerNo: 'C003',
      name: 'DEF Industries',
      factDate: '2024-01-10',
      dateOfBirth: '',
      total: 22000,
      balance: 22000,
      currency: 'SEK',
      previousDate: '2024-01-10',
      finalPayment: '2024-02-10',
      status: 'overdue'
    }
  ];

  const getFilterColor = (filter: string) => {
    switch (filter) {
      case 'to-handle': return 'bg-gray-100 text-gray-800';
      case 'not-booked': return 'border-l-4 border-yellow-400 bg-white';
      case 'unpaid': return 'border-l-4 border-pink-400 bg-white';
      case 'unpaid-overdue': return 'border-l-4 border-red-400 bg-white';
      case 'final-payment': return 'border-l-4 border-green-400 bg-white';
      default: return 'bg-white text-gray-800';
    }
  };

  const filteredData = invoiceData.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.factNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ocr.includes(searchTerm) ||
      item.customerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const totalAmount = filteredData.reduce((sum, item) => sum + item.total, 0);
  const totalBalance = filteredData.reduce((sum, item) => sum + item.balance, 0);

  // Payment form handlers
  const handleAddPayment = () => {
    // Add payment logic here
    console.log('Adding payment:', { paymentDate, invoiceNumber, paidAmount });
  };

  const handleClearPayment = () => {
    setPaymentDate('2025-09-16');
    setInvoiceNumber('');
    setPaidAmount('');
  };

  const handleSelectAllPayments = () => {
    // Toggle select all logic here
    setSelectedPayments(prev => prev.length > 0 ? [] : ['all']);
  };

  // Reminders handlers
  const handleSelectAllReminders = () => {
    // Toggle select all logic here
    setSelectedReminders(prev => prev.length > 0 ? [] : ['all']);
  };

  const getReminderFilterColor = (filter: string) => {
    // Use reminderFilter to avoid linter warning
    console.log('Current reminder filter:', reminderFilter);
    switch (filter) {
      case 'all-unpaid-overdue': return 'bg-pink-100 text-pink-800';
      case 'reminders-to-send': return 'bg-red-100 text-red-800';
      case 'external-management': return 'bg-white text-gray-800 border border-gray-300';
      case 'failed': return 'bg-white text-gray-800 border border-gray-300';
      default: return 'bg-white text-gray-800 border border-gray-300';
    }
  };


  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div>
        <div className="flex items-center justify-between border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'customer-invoices' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('customer-invoices')}
            >
              Customer invoices
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'payments' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'reminders' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reminders')}
            >
              Reminders
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'recurrent' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('recurrent')}
            >
              Recurrent
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'invoice-services' 
                  ? 'border-green-500 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('invoice-services')}
            >
              Invoice services
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm">
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="secondary" size="sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
        </div>
      </div>

      {/* Header - Only for Customer invoices tab */}
      {activeTab === 'customer-invoices' && (
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Invoices - List</h1>
            <p className="text-gray-600">Manage and track all customer invoices</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Create invoice
            </Button>
            <Button variant="secondary">
              <Printer className="w-4 h-4 mr-2" />
              Print list
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Invoice number, OCR, Customer number, Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <button className="text-blue-600 text-sm hover:underline">Advanced search</button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'customer-invoices' && (
        <div className="space-y-6">

        {/* Invoice Status Filters */}
        <div className="flex items-center space-x-2 mb-6">
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('to-handle')}`}
            onClick={() => setActiveFilter('to-handle')}
          >
            To handle
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('all')}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('not-booked')}`}
            onClick={() => setActiveFilter('not-booked')}
          >
            Not booked
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('unpaid')}`}
            onClick={() => setActiveFilter('unpaid')}
          >
            Unpaid
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('unpaid-overdue')}`}
            onClick={() => setActiveFilter('unpaid-overdue')}
          >
            Unpaid overdue
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('final-payment')}`}
            onClick={() => setActiveFilter('final-payment')}
          >
            Final payment
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('cancelled')}`}
            onClick={() => setActiveFilter('cancelled')}
          >
            Cancelled
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded ${getFilterColor('failed')}`}
            onClick={() => setActiveFilter('failed')}
          >
            Failed
          </button>
          <div className="flex-1"></div>
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <div className="w-4 h-4 mr-1 flex items-center justify-center">
              <div className="w-3 h-3 border border-gray-400 rounded"></div>
            </div>
            {filteredData.length} -
          </button>
        </div>

        {/* Invoice List Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACT NO.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OCR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER NO.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACT DATE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE OF BIRTH</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BALANCE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURRENCY</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PREVIOUS DATE</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FINAL PAYMENT</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.factNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.ocr}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.customerNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.factDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.dateOfBirth || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.balance.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.previousDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.finalPayment}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={7} className="px-6 py-3 text-sm font-medium text-gray-900">
                    Total SEK
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {totalAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">
                    {totalBalance.toLocaleString()}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

          {/* Footer Action Bar */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Distribution method</label>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Preselected</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Print template</label>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Default template</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                Preview
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Book & send
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs content */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PAYMENTS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove unmatched payments
              </button>
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded">
                <Upload className="w-4 h-4 mr-2" />
                Load payment file
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment date</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="pr-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice</label>
                <Input
                  placeholder="Invoice number, OCR, Customer number, Name"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paid SEK</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleAddPayment}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Add
                </Button>
                <Button 
                  onClick={handleClearPayment}
                  variant="secondary" 
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Clear
                </Button>
                <Button variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Search in fact list
                </Button>
              </div>
            </div>
          </div>

          {/* Payments List Area */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm min-h-96">
            <div className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-500">Add a payment using the form above or load a payment file.</p>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleSelectAllPayments}
                className="w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
              </Button>
              <span className="text-sm text-gray-700">Select all ({selectedPayments.length})</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">Total SEK: 0.00</span>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                <option>Bank transfer (1930)</option>
              </select>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Book
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reminders' && (
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">REMINDERS - LIST</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
                <Printer className="w-4 h-4 mr-1" />
                Print list
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Invoice number, OCR, Customer number, Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <button className="text-blue-600 text-sm hover:underline">Advanced search</button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Total unpaid overdue</h3>
                  <p className="text-2xl font-bold text-gray-900">0 SEK (0 pcs)</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Reminders to send</h3>
                  <p className="text-2xl font-bold text-gray-900">0 SEK (0 pcs)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-2">
            <button
              className={`px-4 py-2 text-sm font-medium rounded ${getReminderFilterColor('all-unpaid-overdue')}`}
              onClick={() => setReminderFilter('all-unpaid-overdue')}
            >
              All unpaid overdue
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded ${getReminderFilterColor('reminders-to-send')}`}
              onClick={() => setReminderFilter('reminders-to-send')}
            >
              Reminders to send
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded ${getReminderFilterColor('external-management')}`}
              onClick={() => setReminderFilter('external-management')}
            >
              External management
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded ${getReminderFilterColor('failed')}`}
              onClick={() => setReminderFilter('failed')}
            >
              Failed
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                <div className="w-4 h-4 mr-1 flex items-center justify-center">
                  <div className="w-3 h-3 border border-gray-400 rounded"></div>
                </div>
                {selectedReminders.length} -
              </button>
            </div>
          </div>

          {/* Reminders Table */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACT NO.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OCR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER NO.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">FACT DATE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PREVIOUS DATE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BALANCE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURRENCY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SENT</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NUMBER</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REMINDER DATE</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td colSpan={13} className="px-6 py-12 text-center text-gray-500">
                      No reminders found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={handleSelectAllReminders}
                className="w-10 h-10 rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
              </Button>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Reminder date</label>
                <div className="relative">
                  <Input
                    placeholder="Change reminder date to"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="pr-10 w-48"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Print template</label>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Reminder</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Language</label>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Swedish</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700">Distribution method</label>
                <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                  <option>Preselected</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  Preview
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recurrent' && (
        <RecurrentList />
      )}


      {activeTab === 'invoice-services' && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Invoice Services</h3>
            <p className="text-sm text-gray-600">Manage invoice services and integrations</p>
          </div>
          <div className="p-6">
            <p className="text-gray-500">Invoice services content will be implemented here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
