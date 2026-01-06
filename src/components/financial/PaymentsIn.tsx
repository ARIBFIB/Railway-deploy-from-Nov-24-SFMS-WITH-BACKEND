import React, { useState } from 'react';
import { Search } from 'lucide-react';

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

interface PaymentsInProps {
  invoices: Invoice[];
}

export const PaymentsIn: React.FC<PaymentsInProps> = ({ invoices }) => {
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
            <div className="relative">
              <input
                type="text"
                placeholder="Invoice no., OCR, Cust. no., Name"
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                className="h-9 w-80 border border-[#DADCE0] rounded px-3 text-[#202124] text-sm"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E] w-4 h-4 pointer-events-none" />
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

      {/* Main Content Area (Empty State when no payments) */}
      {addedPayments.length === 0 ? (
        <div className="mx-4 mb-24 text-center py-12 text-[#9E9E9E] bg-white">
          <p>No payments added yet. Use the form above to add payments.</p>
        </div>
      ) : (
        <div className="mx-4 mb-24">
          <div className="border border-[#E0E0E0] rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-[#F1F3F4]">
                  <th className="px-4 py-2 text-xs font-semibold text-[#5F6368] uppercase text-left">Checkbox</th>
                  <th className="px-4 py-2 text-xs font-semibold text-[#5F6368] uppercase text-left">Payment Date</th>
                  <th className="px-4 py-2 text-xs font-semibold text-[#5F6368] uppercase text-left">Invoice Number</th>
                  <th className="px-4 py-2 text-xs font-semibold text-[#5F6368] uppercase text-left">Customer Name</th>
                  <th className="px-4 py-2 text-xs font-semibold text-[#5F6368] uppercase text-right">Amount</th>
                  <th className="px-4 py-2 text-xs font-semibold text-[#5F6368] uppercase text-center">Currency</th>
                  <th className="px-4 py-2 text-xs font-semibold text-[#5F6368] uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {addedPayments.map((payment) => (
                  <tr key={payment.id} className="border-t border-[#E0E0E0] hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        className="text-[#1A73E8]"
                        checked={payment.selected || false}
                        onChange={() => handlePaymentSelection(payment.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">{payment.invoice_number}</td>
                    <td className="px-4 py-3 text-sm">{payment.customer_name}</td>
                    <td className="px-4 py-3 text-sm text-right">{payment.amount.toLocaleString('sv-SE')}</td>
                    <td className="px-4 py-3 text-sm text-center">{payment.currency}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <button 
                        onClick={() => removePayment(payment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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