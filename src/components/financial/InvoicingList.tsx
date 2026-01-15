import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Eye, Edit, Download, Send, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

import { Button } from '../Button';
import { Input } from '../Input';
import { Modal } from '../Modal';
import { ListManager } from '../ListManager';

// Define Invoice type for demo
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

interface InvoicingListProps {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  fetchInvoices: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  getStatusIcon: (status: string) => React.ReactElement;
  getStatusColor: (status: string) => string;
  totalOutstanding: number;
  totalPaid: number;
  handleCreateSuccess: () => void;
  showListUI?: boolean;
}

export const InvoicingList: React.FC<InvoicingListProps> = ({
  invoices,
  loading,
  error,
  fetchInvoices,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  showCreateModal,
  setShowCreateModal,
  selectedInvoice,
  setSelectedInvoice,
  getStatusIcon,
  getStatusColor,
  totalOutstanding,
  totalPaid,
  handleCreateSuccess,
  showListUI = true
}) => {
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [distributionMethod, setDistributionMethod] = useState('Default');
  const [printoutTemplate, setPrintoutTemplate] = useState('Default template');
  const [extendedSearchOpen, setExtendedSearchOpen] = useState(false);
  const [basicDetailsExpanded, setBasicDetailsExpanded] = useState(true);
  const [invoiceDetailsExpanded, setInvoiceDetailsExpanded] = useState(true);
  const [invoiceContentExpanded, setInvoiceContentExpanded] = useState(true);
  // For customer invoices, we'll only show sales invoices
  const customerInvoices = invoices.filter(invoice => invoice.invoice_type === 'sales');
  const filteredInvoices = customerInvoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    if (statusFilter !== 'all') {
      switch (statusFilter) {
        case 'not-posted':
          return matchesSearch && invoice.status === 'draft';
        case 'unpaid':
          return matchesSearch && invoice.status === 'sent';
        case 'unpaid-due':
          const dueDate = new Date(invoice.due_date);
          const today = new Date();
          return matchesSearch && invoice.status === 'sent' && dueDate < today;
        case 'paid-in-full':
          return matchesSearch && invoice.status === 'paid';
        case 'voided':
          // Assuming voided invoices are cancelled
          return matchesSearch && invoice.status === 'cancelled';
        case 'failed':
          // Assuming failed invoices are a special case
          return matchesSearch && invoice.status === 'overdue';
        default:
          return matchesSearch;
      }
    }
    return matchesSearch;
  });

  // Calculate customer invoice totals
  const customerInvoiceTotals = {
    totalSEK: filteredInvoices.reduce((sum, inv) => sum + inv.total_amount, 0),
    notPosted: filteredInvoices.filter(inv => inv.status === 'draft').length,
    unpaid: filteredInvoices.filter(inv => inv.status === 'sent').length,
    unpaidDue: filteredInvoices.filter(inv => {
      const dueDate = new Date(inv.due_date);
      const today = new Date();
      return inv.status === 'sent' && dueDate < today;
    }).length,
    paidInFull: filteredInvoices.filter(inv => inv.status === 'paid').length,
    voided: 0, // Assuming no voided invoices in demo data
    failed: 0  // Assuming no failed invoices in demo data
  };

  return (
    <div className="space-y-6 bg-[#F7F7F7] min-h-screen py-6">
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">CUSTOMER INVOICES – LIST</h2>
            
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Invoice no., OCR, Cust. no., Name"
                  className="h-9 w-full pl-10 border border-[#DADADA] rounded text-[#2E2E2E] text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                          onClick={() => setExtendedSearchOpen(!extendedSearchOpen)}
                          className="text-sm text-[#1976D2] hover:underline flex items-center"
                        >
                          {extendedSearchOpen ? 'Close Extended Search' : 'Extended Search'}
                          <svg 
                            className={`ml-1 w-3 h-3 transition-transform duration-200 ${extendedSearchOpen ? 'rotate-180' : ''}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {/* Extended Search Panel */}
                        {extendedSearchOpen && (
                          <div className="mt-4 p-6 bg-white border border-[#E0E0E0] rounded shadow-sm">
                            {/* Basic Details Section */}
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setBasicDetailsExpanded(!basicDetailsExpanded)}>
                                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                                  <span className="text-[#2E7D32] mr-2">
                                    {basicDetailsExpanded ? (
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" transform="rotate(-90)" />
                                      </svg>
                                    )}
                                  </span>
                                  Basic details
                                </h3>
                              </div>
                              {basicDetailsExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Invoice number</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Customer number</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Invoice type</label>
                                    <select className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]">
                                      <option>Select</option>
                                      <option>Sales</option>
                                      <option>Purchase</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Customer name</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="h-px bg-[#E6E6E6] my-6"></div>
                            
                            {/* Invoice Details Section */}
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setInvoiceDetailsExpanded(!invoiceDetailsExpanded)}>
                                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                                  <span className="text-[#2E7D32] mr-2">
                                    {invoiceDetailsExpanded ? (
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" transform="rotate(-90)" />
                                      </svg>
                                    )}
                                  </span>
                                  Invoice details
                                </h3>
                              </div>
                              {invoiceDetailsExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Our reference</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Comment</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Your reference</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Your order number</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Currency</label>
                                    <select className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]">
                                      <option>Select</option>
                                      <option>SEK</option>
                                      <option>USD</option>
                                      <option>EUR</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">From</label>
                                    <input 
                                      type="date" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">To</label>
                                    <input 
                                      type="date" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Delivery address</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Delivery address 2</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="h-px bg-[#E6E6E6] my-6"></div>
                            
                            {/* Invoice Content Section */}
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setInvoiceContentExpanded(!invoiceContentExpanded)}>
                                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                                  <span className="text-[#2E7D32] mr-2">
                                    {invoiceContentExpanded ? (
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" transform="rotate(-90)" />
                                      </svg>
                                    )}
                                  </span>
                                  Invoice content
                                </h3>
                              </div>
                              {invoiceContentExpanded && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Item number</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Account (From)</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Account (To)</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Amount type</label>
                                    <select className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]">
                                      <option>Select</option>
                                      <option>Gross</option>
                                      <option>Net</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Item name</label>
                                    <input 
                                      type="text" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Amount From</label>
                                    <input 
                                      type="number" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="0" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-[#555555] mb-1">Amount To</label>
                                    <input 
                                      type="number" 
                                      className="w-full h-9 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] bg-white focus:outline-none focus:border-[#4CAF50]" 
                                      placeholder="0" 
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex justify-end gap-2 pt-3">
                              <button
                                className="h-8 min-w-[80px] px-4 rounded-full bg-[#8F8F8F] text-white text-[13px] font-semibold hover:bg-[#7F7F7F]"
                              >
                                Clear
                              </button>
                              <button
                                className="h-8 min-w-[80px] px-4 rounded-full bg-[#8F8F8F] text-white text-[13px] font-semibold hover:bg-[#7F7F7F]"
                              >
                                Search
                              </button>
                            </div>
                          </div>
                        )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold rounded-full px-4 py-2.5 text-sm h-10"
          >
            + Create invoice
          </button>
          
          <button className="text-[#4A4A4A] hover:text-[#000000] flex items-center gap-1">
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 5H7v8h6v-8z" clipRule="evenodd" />
            </svg>
            <span className="ml-1 text-sm">Print list</span>
          </button>
        </div>
        
        {/* Status Filter Bar */}
        <div className="flex space-x-2 px-6 mb-4">
          {[
            { value: 'all', label: 'All', color: 'bg-white border-[#DADADA]' },
            { value: 'not-posted', label: 'Not posted', color: 'bg-[#FFF59D] border-[#DADADA]' },
            { value: 'unpaid', label: 'Unpaid', color: 'bg-[#FFCDD2] border-[#DADADA]' },
            { value: 'unpaid-due', label: 'Unpaid due', color: 'bg-[#EF9A9A] border-[#DADADA]' },
            { value: 'paid-in-full', label: 'Paid in full', color: 'bg-[#C8E6C9] border-[#DADADA]' },
            { value: 'voided', label: 'Voided', color: 'bg-[#E0E0E0] border-[#DADADA]' },
            { value: 'failed', label: 'Failed', color: 'bg-[#BDBDBD] border-[#DADADA]' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-2 text-sm border rounded ${filter.color} ${statusFilter === filter.value ? 'ring-2 ring-[#2E7D32]' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>



      <div className="mx-6 mb-4">
        <div className="border border-[#E0E0E0] rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#FAFAFA] border-b-2 border-[#BDBDBD]">
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Checkbox</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Invoice Number</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">OCR</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Type</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Customer No.</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Name</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Invoice Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Delivery Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-right">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-right">Balance</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-center">Currency</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Due Date</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-center">Paid in Full</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-4 py-24 text-center text-[#9E9E9E]">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={13} className="px-4 py-24 text-center text-[#9E9E9E]">
                    {error}
                  </td>
                </tr>
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-12 text-center text-[#9E9E9E]">
                    No invoices found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t border-[#EEEEEE] hover:bg-[#F9F9F9] h-10">
                    <td className="px-4 py-2.5 text-center">
                      <input 
                        type="checkbox" 
                        className="text-[#1976D2]"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedInvoices([...selectedInvoices, invoice.id]);
                          } else {
                            setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                          }
                        }}
                      />
                    </td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]">{invoice.invoice_number}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]">{invoice.ocr_number || '-'}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]">{invoice.invoice_type.charAt(0).toUpperCase() + invoice.invoice_type.slice(1)}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]">{invoice.customer_number || '-'}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]">{invoice.customer_supplier_name}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]">{new Date(invoice.invoice_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]">-</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E] text-right">{invoice.total_amount.toLocaleString('sv-SE')}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E] text-right">{invoice.total_amount.toLocaleString('sv-SE')}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E] text-center">{invoice.currency}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]">{new Date(invoice.due_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E] text-center">
                      {invoice.status === 'paid' ? '✓' : '○'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Table Footer Summary */}
      <div className="mx-6 mb-6">
        <div className="bg-[#FAFAFA] border-t border-[#BDBDBD] p-3">
          <div className="font-semibold text-[#1A1A1A]">
            Total SEK: {customerInvoiceTotals.totalSEK.toLocaleString('sv-SE')}
          </div>
        </div>
      </div>



      <Modal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title="Invoice Details"
        size="lg"
      >
        {selectedInvoice && <InvoiceDetails invoice={selectedInvoice} />}
      </Modal>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] h-14 flex items-center px-6">
        <div className="flex items-center">
          <span className="text-xs text-[#757575]">({selectedInvoices.length} selected)</span>
        </div>
        
        <div className="flex items-center space-x-4 ml-8">
          <div>
            <label className="block text-xs font-medium text-[#4A4A4A] mb-1 flex items-center">
              Distribution method
              <svg className="w-3.5 h-3.5 ml-1 text-[#1976D2]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </label>
            <select 
              className="h-8 w-40 border border-[#DADADA] rounded text-sm text-[#2E2E2E] bg-white"
              value={distributionMethod}
              onChange={(e) => setDistributionMethod(e.target.value)}
            >
              <option>Default</option>
              <option>Bankgiro</option>
              <option>Plusgiro</option>
              <option>Email</option>
              <option>Post</option>
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-[#4A4A4A] mb-1 flex items-center">
              Printout template
              <svg className="w-3.5 h-3.5 ml-1 text-[#1976D2]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </label>
            <select 
              className="h-8 w-48 border border-[#DADADA] rounded text-sm text-[#2E2E2E] bg-white"
              value={printoutTemplate}
              onChange={(e) => setPrintoutTemplate(e.target.value)}
            >
              <option>Default template</option>
              <option>Reminder template</option>
              <option>Invoice template</option>
              <option>Custom template</option>
            </select>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-3">
          <button 
            className={`rounded-full px-4 py-2.5 text-sm min-w-[96px] font-semibold ${selectedInvoices.length > 0 ? 'bg-[#E0E0E0] hover:bg-[#D6D6D6] text-[#2E2E2E]' : 'bg-[#D6D6D6] text-white opacity-60 cursor-not-allowed'}`}
            disabled={selectedInvoices.length === 0}
          >
            Preview
          </button>
          <div className="relative">
            <button 
              className={`rounded-full px-5 py-2.5 text-sm font-semibold flex items-center ${selectedInvoices.length > 0 ? 'bg-[#81C784] hover:bg-[#66BB6A] text-white' : 'bg-[#D6D6D6] text-white opacity-60 cursor-not-allowed'}`}
              disabled={selectedInvoices.length === 0}
            >
              Post & send
              <svg className="w-3 h-3 ml-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
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