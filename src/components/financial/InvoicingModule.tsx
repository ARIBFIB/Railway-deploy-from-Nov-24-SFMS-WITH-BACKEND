import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Loader2, RefreshCw, Plus, Send, Eye, Edit, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { ListManager } from '../ListManager';
// import { InvoiceService, type Invoice, type CreateInvoiceData } from '../../services/invoiceService'; // Commented out for demo mode
import { InvoicingList } from './InvoicingList';
import { PaymentsIn } from './PaymentsIn';
import { RemindersList } from './RemindersList';
import { RecurrentList } from './RecurrentList';
import { InvoiceServicesList } from './InvoiceServicesList';
import { CustomerInvoiceForm } from './CustomerInvoiceForm';

// Define Invoice type for demo
interface Invoice {
  id: string;
  invoice_number: string;
  customer_supplier_name: string;
  invoice_type: 'sales' | 'purchase';
  invoice_date: string;
  due_date: string;
  payment_terms: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  line_items: {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    line_total?: number;
  }[];
}

export const InvoicingModule: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load dummy data from localStorage or create initial data
      const storedInvoices = localStorage.getItem('demoInvoices');
      let invoicesData: Invoice[];
      
      if (storedInvoices) {
        invoicesData = JSON.parse(storedInvoices);
      } else {
        // Create initial dummy data
        invoicesData = [
          {
            id: '1',
            invoice_number: 'INV-001',
            customer_supplier_name: 'ABC Company',
            invoice_type: 'sales',
            invoice_date: '2025-01-15',
            due_date: '2025-02-15',
            payment_terms: 'Net 30',
            status: 'paid',
            subtotal: 10000,
            tax_amount: 2500,
            total_amount: 12500,
            currency: 'SEK',
            line_items: [
              {
                id: '1-1',
                description: 'Web Development Services',
                quantity: 1,
                unit_price: 10000,
                line_total: 10000
              }
            ]
          },
          {
            id: '2',
            invoice_number: 'INV-002',
            customer_supplier_name: 'XYZ Corporation',
            invoice_type: 'sales',
            invoice_date: '2025-01-20',
            due_date: '2025-02-20',
            payment_terms: 'Net 30',
            status: 'sent',
            subtotal: 15000,
            tax_amount: 3750,
            total_amount: 18750,
            currency: 'SEK',
            line_items: [
              {
                id: '2-1',
                description: 'Consulting Services',
                quantity: 1,
                unit_price: 15000,
                line_total: 15000
              }
            ]
          },
          {
            id: '3',
            invoice_number: 'INV-003',
            customer_supplier_name: 'Tech Solutions Ltd',
            invoice_type: 'purchase',
            invoice_date: '2025-01-22',
            due_date: '2025-02-22',
            payment_terms: 'Net 30',
            status: 'overdue',
            subtotal: 8000,
            tax_amount: 2000,
            total_amount: 10000,
            currency: 'SEK',
            line_items: [
              {
                id: '3-1',
                description: 'Software License',
                quantity: 2,
                unit_price: 4000,
                line_total: 8000
              }
            ]
          },
          {
            id: '4',
            invoice_number: 'INV-004',
            customer_supplier_name: 'Global Services Inc',
            invoice_type: 'sales',
            invoice_date: '2025-01-25',
            due_date: '2025-02-25',
            payment_terms: 'Net 30',
            status: 'draft',
            subtotal: 5000,
            tax_amount: 1250,
            total_amount: 6250,
            currency: 'SEK',
            line_items: [
              {
                id: '4-1',
                description: 'Design Services',
                quantity: 1,
                unit_price: 5000,
                line_total: 5000
              }
            ]
          },
          {
            id: '5',
            invoice_number: 'INV-005',
            customer_supplier_name: 'Local Business Co',
            invoice_type: 'purchase',
            invoice_date: '2025-01-28',
            due_date: '2025-02-28',
            payment_terms: 'Net 30',
            status: 'paid',
            subtotal: 12000,
            tax_amount: 3000,
            total_amount: 15000,
            currency: 'SEK',
            line_items: [
              {
                id: '5-1',
                description: 'Office Equipment',
                quantity: 1,
                unit_price: 12000,
                line_total: 12000
              }
            ]
          }
        ];
        
        // Save to localStorage
        localStorage.setItem('demoInvoices', JSON.stringify(invoicesData));
      }
      
      setInvoices(invoicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, typeFilter]);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'sent':
        return <Send className="w-5 h-5 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const totalOutstanding = filteredInvoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const totalPaid = filteredInvoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total_amount, 0);

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    setIsFilterMenuOpen(false);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const handleCreateSuccess = () => {
    fetchInvoices();
    setShowCreateModal(false);
  };

  // New state for customer invoices view
  const [activeTab, setActiveTab] = useState('customer invoices');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  // For customer invoices, we'll only show sales invoices
  const customerInvoices = invoices.filter(invoice => invoice.invoice_type === 'sales');
  const filteredCustomerInvoices = customerInvoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
      invoice.customer_supplier_name.toLowerCase().includes(customerSearchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate customer invoice totals
  const customerInvoiceTotals = {
    totalSEK: filteredCustomerInvoices.reduce((sum, inv) => sum + inv.total_amount, 0),
    notPosted: filteredCustomerInvoices.filter(inv => inv.status === 'draft').length,
    unpaid: filteredCustomerInvoices.filter(inv => inv.status === 'sent').length,
    unpaidDue: filteredCustomerInvoices.filter(inv => {
      const dueDate = new Date(inv.due_date);
      const today = new Date();
      return inv.status === 'sent' && dueDate < today;
    }).length,
    paidInFull: filteredCustomerInvoices.filter(inv => inv.status === 'paid').length,
    voided: 0, // Assuming no voided invoices in demo data
    failed: 0  // Assuming no failed invoices in demo data
  };

  // New state for payments in view
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [addedPayments, setAddedPayments] = useState<any[]>([]);
  const [selectedPaymentCount, setSelectedPaymentCount] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [paymentInvoice, setPaymentInvoice] = useState<any>(null);

  // Function to add a payment
  const addPayment = () => {
    if (!paymentInvoice || !paidAmount) {
      return; // Don't add if no invoice or amount specified
    }
    
    const newPayment = {
      id: `payment-${Date.now()}`,
      payment_date: paymentDate,
      invoice_number: paymentInvoice.invoice_number,
      customer_name: paymentInvoice.customer_supplier_name,
      amount: parseFloat(paidAmount),
      currency: paymentInvoice.currency,
      status: 'pending'
    };
    
    setAddedPayments([...addedPayments, newPayment]);
    
    // Update total
    setTotalPaymentAmount(totalPaymentAmount + parseFloat(paidAmount));
    
    // Clear form
    setInvoiceSearch('');
    setPaidAmount('');
    setPaymentInvoice(null);
  };

  // Function to clear the payment form
  const clearPaymentForm = () => {
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setInvoiceSearch('');
    setPaidAmount('');
    setPaymentInvoice(null);
  };

  // Function to search for an invoice
  const searchInvoice = () => {
    // Find invoice by number or customer name
    const foundInvoice = invoices.find(inv => 
      inv.invoice_number.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      inv.customer_supplier_name.toLowerCase().includes(invoiceSearch.toLowerCase())
    );
    
    if (foundInvoice) {
      setPaymentInvoice(foundInvoice);
      setPaidAmount(foundInvoice.total_amount.toString());
    }
  };

  // Function to remove a payment
  const removePayment = (id: string) => {
    const paymentToRemove = addedPayments.find(p => p.id === id);
    if (paymentToRemove) {
      setAddedPayments(addedPayments.filter(p => p.id !== id));
      setTotalPaymentAmount(totalPaymentAmount - paymentToRemove.amount);
    }
  };

  // Function to post payments
  const postPayments = () => {
    // In demo mode, we'll just show a success message
    alert('Payments posted successfully!');
    
    // Clear added payments
    setAddedPayments([]);
    setTotalPaymentAmount(0);
  };

  // Update selected payment count when payments are selected/unselected
  const handlePaymentSelection = (id: string) => {
    const payment = addedPayments.find(p => p.id === id);
    if (payment) {
      if (payment.selected) {
        setSelectedPaymentCount(selectedPaymentCount - 1);
      } else {
        setSelectedPaymentCount(selectedPaymentCount + 1);
      }
      
      // Update the payment selection status
      setAddedPayments(addedPayments.map(p => 
        p.id === id ? { ...p, selected: !p.selected } : p
      ));
    }
  };

  // Function to unmark all payments
  const unmarkAllPayments = () => {
    setAddedPayments(addedPayments.map(p => ({ ...p, selected: false })));
    setSelectedPaymentCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-[#E0E0E0] bg-white px-4 py-2 h-14">
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => {
              setActiveTab('customer invoices');
              setShowCreateModal(false);
            }} 
            className={`text-sm font-medium ${activeTab === 'customer invoices' ? 'text-black font-semibold border-b-[3px] border-[#0F9D58]' : 'text-[#5F6368]'}`}
          >
            Customer invoices
          </button>
          <button 
            onClick={() => setActiveTab('payments in')} 
            className={`text-sm font-medium ${activeTab === 'payments in' ? 'text-black font-semibold border-b-[3px] border-[#0F9D58]' : 'text-[#5F6368]'}`}
          >
            Payments in
          </button>
          <button 
            onClick={() => setActiveTab('reminders')} 
            className={`text-sm font-medium ${activeTab === 'reminders' ? 'text-black font-semibold border-b-[3px] border-[#0F9D58]' : 'text-[#5F6368]'}`}
          >
            Reminders
          </button>
          <button 
            onClick={() => setActiveTab('recurrent')} 
            className={`text-sm font-medium ${activeTab === 'recurrent' ? 'text-black font-semibold border-b-[3px] border-[#0F9D58]' : 'text-[#5F6368]'}`}
          >
            Recurrent
          </button>
          <button 
            onClick={() => setActiveTab('invoice-services')} 
            className={`text-sm font-medium ${activeTab === 'invoice-services' ? 'text-black font-semibold border-b-[3px] border-[#0F9D58]' : 'text-[#5F6368]'}`}
          >
            Invoice services
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium text-[#202124]">Reports</button>
          <button className="text-sm font-medium text-[#202124]">Register ▼</button>
        </div>
      </div>

      {/* Customer Invoices Tab */}
      {activeTab === 'customer invoices' && (
        <>
          {showCreateModal ? (
            <CustomerInvoiceForm 
              onCancel={() => {
                setShowCreateModal(false);
                fetchInvoices();
              }} 
              onSave={(invoiceData: any) => {
                handleCreateSuccess();
                setShowCreateModal(false);
              }} 
            />
          ) : (
            <InvoicingList
              invoices={invoices}
              loading={loading}
              error={error}
              fetchInvoices={fetchInvoices}
              searchTerm={customerSearchTerm}
              setSearchTerm={setCustomerSearchTerm}
              statusFilter={customerStatusFilter}
              setStatusFilter={setCustomerStatusFilter}
              showCreateModal={showCreateModal}
              setShowCreateModal={setShowCreateModal}
              selectedInvoice={selectedInvoice}
              setSelectedInvoice={setSelectedInvoice}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              totalOutstanding={totalOutstanding}
              totalPaid={totalPaid}
              handleCreateSuccess={handleCreateSuccess}
              showListUI={true}
            />
          )}
        </>
      )}

      {/* Payments In Tab */}
      {activeTab === 'payments in' && (
        <PaymentsIn invoices={invoices} />
      )}

      {/* Sticky Bottom Action Bar */}
      {activeTab === 'payments in' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] h-16 flex items-center px-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={unmarkAllPayments}
              disabled={selectedPaymentCount === 0}
              className={`rounded-full px-4 py-2 text-sm ${selectedPaymentCount === 0 ? 'bg-[#E0E0E0] opacity-60' : 'bg-[#E0E0E0] hover:bg-[#D0D0D0]'}`}
            >
              Unmark All
            </button>
            <span className="text-sm text-[#5F6368]">({selectedPaymentCount} selected)</span>
          </div>
          
          <div className="ml-auto flex items-center space-x-6">
            <span className="text-base font-semibold text-[#5F6368]">Total SEK: {totalPaymentAmount.toLocaleString('sv-SE')}</span>
            
            <select className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm">
              <option>Bankgiro (1930)</option>
              <option>Plusgiro (1234)</option>
            </select>
            
            <button 
              onClick={postPayments}
              className="bg-[#A5D6B2] hover:bg-[#0F9D58] text-white font-semibold rounded-full px-6 py-2.5 text-sm"
            >
              Post
            </button>
          </div>
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <RemindersList />
      )}

      {/* Recurrent Tab */}
      {activeTab === 'recurrent' && (
        <RecurrentList />
      )}

      {/* Invoice Services Tab */}
      {activeTab === 'invoice-services' && (
        <InvoiceServicesList />
      )}

      {/* Sticky Bottom Action Bar */}
      {activeTab === 'reminders' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] h-18 flex items-center px-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-[#5F6368]">(0 selected)</span>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm text-[#5F6368]">Change reminder date to</label>
              <input
                type="date"
                className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm text-[#5F6368]">Printout template</label>
              <select className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm">
                <option>Påminnelse</option>
                <option>Reminder</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm text-[#5F6368]">Language</label>
              <select className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm">
                <option>Swedish</option>
                <option>English</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm text-[#5F6368]">Distribution method</label>
              <select className="h-9 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm">
                <option>Default</option>
                <option>Email</option>
                <option>Post</option>
              </select>
            </div>
          </div>
          
          <div className="ml-auto flex items-center space-x-3">
            <button className="bg-[#9E9E9E] text-white font-semibold rounded-full px-5 py-2.5 text-sm">
              Preview
            </button>
            <button className="bg-[#9FD3B5] hover:bg-[#0F9D58] text-white font-semibold rounded-full px-5 py-2.5 text-sm">
              Send
            </button>
          </div>
        </div>
      )}



      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Invoice Details"
        size="lg"
      >
        {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} />}
      </Modal>
    </div>
  );
};



const InvoiceDetails: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{invoice.invoice_number}</h3>
          <p className="text-sm text-gray-600">{invoice.customer_supplier_name}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
          invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
            invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
          }`}>
          {invoice.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Invoice Information</h4>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Invoice Date:</dt>
              <dd className="text-gray-900">{new Date(invoice.invoice_date).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Due Date:</dt>
              <dd className="text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Payment Terms:</dt>
              <dd className="text-gray-900">{invoice.payment_terms}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Amount Summary</h4>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal:</dt>
              <dd className="text-gray-900">{invoice.subtotal.toLocaleString('sv-SE')} {invoice.currency}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Tax:</dt>
              <dd className="text-gray-900">{invoice.tax_amount.toLocaleString('sv-SE')} {invoice.currency}</dd>
            </div>
            <div className="flex justify-between font-semibold">
              <dt className="text-gray-900">Total:</dt>
              <dd className="text-gray-900">{invoice.total_amount.toLocaleString('sv-SE')} {invoice.currency}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Line Items</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Unit Price
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.line_items.map((line) => (
                <tr key={line.id}>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {line.description}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {line.quantity}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {line.unit_price.toLocaleString('sv-SE')}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {line.line_total?.toLocaleString('sv-SE')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};