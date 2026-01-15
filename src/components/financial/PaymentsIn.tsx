import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
type CreatePaymentData = {
  invoice_id: string;
  payment_date: string;
  amount: number;
  currency?: string;
  payment_method?: string;
  transaction_reference?: string;
  status?: 'completed' | 'pending' | 'failed' | 'cancelled';
  notes?: string;
};

interface Invoice {
  id: string;
  invoice_number: string;
  ocr_number?: string;
  customer_supplier_name: string;
  customer_number?: string;
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

interface PaymentsInProps {
  invoices: Invoice[];
}

export const PaymentsIn: React.FC<PaymentsInProps> = ({ invoices }) => {
  // Fetch existing payments when component mounts
  useEffect(() => {
    const fetchExistingPayments = async () => {
      try {
        const userDataRaw = localStorage.getItem('user_data');
        const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
        const foundationId = userData.foundationId || userData.foundation_id;
        
        if (!foundationId) {
          console.error('Foundation ID not found');
          return;
        }
        
        // Fetch all payments for this foundation
        const response = await paymentService.getPayments(foundationId);
        const paymentsWithInvoiceDetails = response.payments.map((payment: any) => ({
          id: payment.id,
          payment_date: payment.payment_date,
          invoice_number: payment.invoices?.invoice_number || 'N/A',
          ocr_number: payment.invoices?.invoice_number || '-',
          customer_number: payment.invoices?.customers?.customer_number || '-',
          customer_name: payment.invoices?.customers?.name || 'N/A',
          due_date: payment.invoices?.due_date || 'N/A',
          balance: payment.invoices?.total_amount || 0,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status
        }));
        
        setAddedPayments(paymentsWithInvoiceDetails);
        
        // Calculate total amount
        const total = paymentsWithInvoiceDetails.reduce((sum: number, payment: any) => sum + payment.amount, 0);
        setTotalPaymentAmount(total);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };
    
    fetchExistingPayments();
  }, []);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [addedPayments, setAddedPayments] = useState<any[]>([]);
  const [selectedPaymentCount, setSelectedPaymentCount] = useState(0);
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0);
  const [paymentInvoice, setPaymentInvoice] = useState<any>(null);
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to add a payment
  const addPayment = async () => {
    if (!paymentInvoice || !paidAmount) {
      return; // Don't add if no invoice or amount specified
    }
    
    try {
      // Get foundation ID from local storage
      const userDataRaw = localStorage.getItem('user_data');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      const foundationId = userData.foundationId || userData.foundation_id;
      
      if (!foundationId) {
        alert('Foundation ID not found. Please log in again.');
        return;
      }
      
      // Prepare payment data
      const paymentData: CreatePaymentData = {
        invoice_id: paymentInvoice.id,
        payment_date: paymentDate,
        amount: parseFloat(paidAmount),
        currency: paymentInvoice.currency || 'SEK',
        status: 'completed'
      };
      
      // Call backend API to create payment
      const createdPayment = await paymentService.createPayment(paymentData, foundationId);
      
      // Add to local state
      const newPayment = {
        id: createdPayment.id,
        payment_date: createdPayment.payment_date,
        invoice_number: paymentInvoice.invoice_number,
        ocr_number: paymentInvoice.ocr_number || '-',
        customer_number: paymentInvoice.customer_number || '-',
        customer_name: paymentInvoice.customer_supplier_name,
        due_date: paymentInvoice.due_date,
        balance: paymentInvoice.total_amount,
        amount: parseFloat(paidAmount),
        currency: paymentInvoice.currency,
        status: createdPayment.status
      };
      
      setAddedPayments([...addedPayments, newPayment]);
      
      // Update total
      setTotalPaymentAmount(totalPaymentAmount + parseFloat(paidAmount));
      
      // Clear form
      setInvoiceSearch('');
      setPaidAmount('');
      setPaymentInvoice(null);
      
      alert('Payment added successfully!');
    } catch (error) {
      console.error('Error creating payment:', error);
      alert('Failed to create payment. Please try again.');
    }
  };

  // Function to clear the payment form
  const clearPaymentForm = () => {
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setInvoiceSearch('');
    setPaidAmount('');
    setPaymentInvoice(null);
  };

  // Function to filter invoices for the dropdown
  const filterInvoices = (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredInvoices([]);
      return;
    }
    
    const filtered = invoices.filter(inv => 
      inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.customer_supplier_name && inv.customer_supplier_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.ocr_number && inv.ocr_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (inv.customer_number && inv.customer_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredInvoices(filtered);
    setShowInvoiceDropdown(true);
  };
  
  // Function to handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInvoiceSearch(value);
    filterInvoices(value);
  };
  
  // Function to handle invoice selection from dropdown
  const handleInvoiceSelect = (invoice: Invoice) => {
    setPaymentInvoice(invoice);
    setInvoiceSearch(invoice.invoice_number);
    setPaidAmount(invoice.total_amount.toString());
    setShowInvoiceDropdown(false);
    setFilteredInvoices([]);
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
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowInvoiceDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to remove a payment
  const removePayment = async (id: string) => {
    try {
      const userDataRaw = localStorage.getItem('user_data');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      const foundationId = userData.foundationId || userData.foundation_id;
      
      if (!foundationId) {
        alert('Foundation ID not found. Please log in again.');
        return;
      }
      
      // Call backend API to delete payment
      await paymentService.deletePayment(id, foundationId);
      
      // Update local state
      const paymentToRemove = addedPayments.find(p => p.id === id);
      if (paymentToRemove) {
        setAddedPayments(addedPayments.filter(p => p.id !== id));
        setTotalPaymentAmount(totalPaymentAmount - paymentToRemove.amount);
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Failed to delete payment. Please try again.');
    }
  };

  // Function to post payments
  const postPayments = async () => {
    try {
      const userDataRaw = localStorage.getItem('user_data');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      const foundationId = userData.foundationId || userData.foundation_id;
      
      if (!foundationId) {
        alert('Foundation ID not found. Please log in again.');
        return;
      }
      
      // In a real implementation, this would update all selected payments
      alert('Payments posted successfully!');
      
      // Refresh the payments list
      const response = await paymentService.getPayments(foundationId);
      const paymentsWithInvoiceDetails = response.payments.map((payment: any) => ({
        id: payment.id,
        payment_date: payment.payment_date,
        invoice_number: payment.invoices?.invoice_number || 'N/A',
        ocr_number: payment.invoices?.invoice_number || '-',
        customer_number: payment.invoices?.customers?.customer_number || '-',
        customer_name: payment.invoices?.customers?.name || 'N/A',
        due_date: payment.invoices?.due_date || 'N/A',
        balance: payment.invoices?.total_amount || 0,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status
      }));
      
      setAddedPayments(paymentsWithInvoiceDetails);
      
      // Calculate total amount
      const total = paymentsWithInvoiceDetails.reduce((sum: number, payment: any) => sum + payment.amount, 0);
      setTotalPaymentAmount(total);
    } catch (error) {
      console.error('Error posting payments:', error);
      alert('Failed to post payments. Please try again.');
    }
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
      {/* Page Title Section */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-[#202124] mb-4 mt-6">PAYMENTS IN</h2>
        
        {/* Utility Actions (Top Right) */}
        <div className="flex justify-end mb-4 space-x-6">
          <button className="text-[#5F6368] hover:text-[#202124] flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-sm">Remove non-matching payments</span>
          </button>
          <button className="text-[#5F6368] hover:text-[#202124] flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-sm">Load payment file</span>
          </button>
        </div>
        
        {/* Payment Entry Form */}
        <div className="flex items-center justify-center mb-6 space-x-6">
          <div className="flex flex-col">
            <label className="text-xs font-medium text-[#5F6368] mb-1">Payment date</label>
            <div className="relative">
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="h-9 w-40 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9E9E9E] pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 4a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-medium text-[#5F6368] mb-1">Invoice</label>
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                placeholder="Invoice no., OCR, Cust. no., Name"
                value={invoiceSearch}
                onChange={handleSearchInputChange}
                onFocus={() => invoiceSearch && setShowInvoiceDropdown(true)}
                className="h-9 w-80 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E] w-4 h-4 pointer-events-none" />
              
              {/* Invoice Dropdown */}
              {showInvoiceDropdown && filteredInvoices.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-[#DADCE0] rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-xs font-semibold text-[#2E2E2E] uppercase text-left">Invoice number</th>
                        <th className="px-3 py-2 text-xs font-semibold text-[#2E2E2E] uppercase text-left">OCR</th>
                        <th className="px-3 py-2 text-xs font-semibold text-[#2E2E2E] uppercase text-left">Customer no.</th>
                        <th className="px-3 py-2 text-xs font-semibold text-[#2E2E2E] uppercase text-left">Balance</th>
                        <th className="px-3 py-2 text-xs font-semibold text-[#2E2E2E] uppercase text-left">Currency</th>
                        <th className="px-3 py-2 text-xs font-semibold text-[#2E2E2E] uppercase text-left">Due date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredInvoices.map((invoice) => (
                        <tr 
                          key={invoice.id} 
                          className="hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleInvoiceSelect(invoice)}
                        >
                          <td className="px-3 py-2 text-sm text-[#2E2E2E]">{invoice.invoice_number}</td>
                          <td className="px-3 py-2 text-sm text-[#2E2E2E]">{invoice.ocr_number || '-'}</td>
                          <td className="px-3 py-2 text-sm text-[#2E2E2E]">{invoice.customer_number || '-'}</td>
                          <td className="px-3 py-2 text-sm text-[#2E2E2E]">{invoice.total_amount.toLocaleString('sv-SE')}</td>
                          <td className="px-3 py-2 text-sm text-[#2E2E2E]">{invoice.currency}</td>
                          <td className="px-3 py-2 text-sm text-[#2E2E2E]">{new Date(invoice.due_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col">
            <label className="text-xs font-medium text-[#5F6368] mb-1">Paid SEK</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="h-9 w-44 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm text-right"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button 
              onClick={addPayment}
              className="bg-[#0F9D58] hover:bg-[#0B8548] text-white font-semibold rounded-full px-5 py-2 text-sm h-9"
            >
              Add
            </button>
            <button 
              onClick={clearPaymentForm}
              className="bg-[#F1F3F4] hover:bg-[#E0E0E0] text-[#202124] font-medium rounded-full px-5 py-2 text-sm h-9"
            >
              Clear
            </button>
            <button 
              onClick={searchInvoice}
              className="bg-[#EEEEEE] hover:bg-[#E0E0E0] text-[#202124] font-medium rounded-full px-5 py-2 text-sm h-9"
            >
              Search in invoice list
            </button>
          </div>
        </div>
      </div>

      {/* Manual Payments – Table Section */}
      <div className="mx-4 mb-24">
        {/* Section Header (Expandable Row) */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E6E6E6]">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="w-3.5 h-3.5 text-[#0B8F3C] border-[#9E9E9E] mr-2"
              aria-label="Select payment"
            />
            <svg className="w-3.5 h-3.5 text-[#0B8F3C] mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold text-[#1F1F1F]">
              {new Date().toISOString().split('T')[0]} Manual payments
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-sm font-semibold text-[#1F1F1F]">
              Total {addedPayments.length} payments: {totalPaymentAmount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK
            </span>
            <button className="w-3.5 h-3.5 text-[#9E9E9E] ml-2 hover:text-[#D32F2F] cursor-pointer">
              🗑
            </button>
          </div>
        </div>
        
        {/* Table Container */}
        <div className="border border-[#E0E0E0] rounded-lg mt-2 overflow-x-auto bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-white border-b-2 border-[#B8B8B8] h-10">
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-left">INVOICE NUMBER</th>
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-left">OCR</th>
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-left">CUSTOMER NO.</th>
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-left">NAME</th>
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-left">DUE DATE</th>
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-left">PAYMENT DATE</th>
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-right">BALANCE SEK</th>
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-right">PAID SEK</th>
                <th className="px-3 py-2 text-xs font-bold text-[#2E2E2E] uppercase text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {addedPayments.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-[#9E9E9E]">
                    No payments added yet. Use the form above to add payments.
                  </td>
                </tr>
              ) : (
                addedPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-[#EEEEEE] h-11 hover:bg-[#F9F9F9] cursor-default">
                    <td className="px-3 py-2.5 text-sm">
                      <span className="text-[#1E88E5] font-semibold hover:underline cursor-pointer">
                        {payment.invoice_number}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-[#1F1F1F]">{payment.ocr_number}</td>
                    <td className="px-3 py-2.5 text-sm text-[#1F1F1F]">{payment.customer_number}</td>
                    <td className="px-3 py-2.5 text-sm text-[#1F1F1F]">{payment.customer_name}</td>
                    <td className="px-3 py-2.5 text-sm text-[#1F1F1F]">{new Date(payment.due_date).toLocaleDateString()}</td>
                    <td className="px-3 py-2.5 text-sm text-[#1F1F1F]">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="px-3 py-2.5 text-sm font-semibold text-right text-[#1F1F1F]">{payment.balance.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-3 py-2.5 text-sm font-semibold text-right text-[#1F1F1F]">{payment.amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-3 py-2.5 text-center">
                      <div className="flex justify-center space-x-2">
                        <button className="w-3.5 h-3.5 text-[#616161] hover:text-[#1E88E5] cursor-pointer" title="Bookkeeping / voucher">
                          B
                        </button>
                        <button className="w-3.5 h-3.5 text-[#616161] hover:text-[#1E88E5] cursor-pointer" title="View / print">
                          📄
                        </button>
                        <button 
                          onClick={() => removePayment(payment.id)}
                          className="w-3.5 h-3.5 text-[#616161] hover:text-[#D32F2F] cursor-pointer" 
                          title="Delete payment"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
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
    </div>
  );
};