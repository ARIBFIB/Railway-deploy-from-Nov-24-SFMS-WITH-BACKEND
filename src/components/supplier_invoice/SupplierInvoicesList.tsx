import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Printer, 
  Download, 
  Mail,
  MoreHorizontal,
  ChevronDown,
  X,
  User,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SupplierInvoiceForm from './SupplierInvoiceForm';
import PaymentsOut from './PaymentsOut';
import InvoicesReceived from './InvoicesReceived';
import SendForInterpretation from './SendForInterpretation';

const SupplierInvoicesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('supplier-invoices');
  const [isLoading, setIsLoading] = useState(false);
  const [gifError, setGifError] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; // Example total pages

  // Dummy data for supplier invoices
  const supplierInvoices = [
    {
      id: 1,
      serialNo: 1,
      type: 'F',
      supplierNo: '1',
      name: 'supplier name',
      ocr: '12',
      invoiceNumber: '133',
      invoiceDate: '2026-01-16',
      dueDate: '2026-02-15',
      total: '0,00',
      balance: '0,00',
      vat: '0,00',
      currency: 'SEK',
      status: 'paid' // Options: 'topost', 'unpaid', 'unpaiddue', 'beingpaid', 'paid', 'voided'
    },
    {
      id: 2,
      serialNo: 2,
      type: 'F',
      supplierNo: '2',
      name: 'ABC Company',
      ocr: '45',
      invoiceNumber: '134',
      invoiceDate: '2026-01-15',
      dueDate: '2026-02-14',
      total: '1500,00',
      balance: '1500,00',
      vat: '300,00',
      currency: 'SEK',
      status: 'unpaid'
    },
    {
      id: 3,
      serialNo: 3,
      type: 'F',
      supplierNo: '3',
      name: 'XYZ Services',
      ocr: '78',
      invoiceNumber: '135',
      invoiceDate: '2026-01-14',
      dueDate: '2026-02-13',
      total: '2500,00',
      balance: '0,00',
      vat: '500,00',
      currency: 'SEK',
      status: 'paid'
    },
    {
      id: 4,
      serialNo: 4,
      type: 'F',
      supplierNo: '4',
      name: 'Tech Solutions',
      ocr: '99',
      invoiceNumber: '136',
      invoiceDate: '2026-01-13',
      dueDate: '2026-02-12',
      total: '3200,00',
      balance: '1200,00',
      vat: '640,00',
      currency: 'SEK',
      status: 'beingpaid'
    }
  ];

  // Calculate totals
  const totalSEK = supplierInvoices.reduce((sum, inv) => sum + parseFloat(inv.total.replace(/,/g, '')), 0).toFixed(2).replace(/\.([0-9]*)$/, ',$1');
  const totalBalance = supplierInvoices.reduce((sum, inv) => sum + parseFloat(inv.balance.replace(/,/g, '')), 0).toFixed(2).replace(/\.([0-9]*)$/, ',$1');
  const totalVat = supplierInvoices.reduce((sum, inv) => sum + parseFloat(inv.vat.replace(/,/g, '')), 0).toFixed(2).replace(/\.([0-9]*)$/, ',$1');

  // Function to get status button styles
  const getStatusButtonStyle = (status: string) => {
    switch(status) {
      case 'topost':
        return 'bg-[#EDEDED] border-[#BDBDBD] text-[#2C2C2C]'; // To handle (ACTIVE)
      case 'unpaid':
        return 'bg-white border-[#DADADA] text-[#4A4A4A] border-l-4 border-l-[#FFCDD2]'; // Unpaid
      case 'unpaiddue':
        return 'bg-white border-[#DADADA] text-[#4A4A4A] border-l-4 border-l-[#FFABAB]'; // Unpaid due
      case 'beingpaid':
        return 'bg-white border-[#DADADA] text-[#4A4A4A] border-l-4 border-l-[#B3E5FC]'; // Being paid
      case 'paid':
        return 'bg-white border-[#DADADA] text-[#4A4A4A] border-l-4 border-l-[#C8E6C9]'; // Paid in full
      case 'voided':
        return 'bg-white border-[#DADADA] text-[#4A4A4A] border-l-4 border-l-[#E0E0E0]'; // Voided
      default:
        return 'bg-white border-[#DADADA] text-[#4A4A4A]'; // Default
    }
  };

  // State for extended search
  const [showExtendedSearch, setShowExtendedSearch] = useState(false);
  
  // Function to handle status filter
  const handleStatusFilter = (status: string) => {
    console.log(`Filtering by status: ${status}`);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* Top Navigation Bar - Sticky */}
      <div className="h-12 bg-white border-b border-[#E0E0E0] flex items-center sticky top-0 z-40 w-full">
        <div className="flex items-center h-[48px]">
          {/* Primary Tabs */}
          <div className="flex">
            <button 
              className={`h-[48px] px-4 flex items-center text-[13px] font-medium cursor-pointer relative ${
                activeTab === 'supplier-invoices' 
                  ? 'text-[#111827] font-medium' 
                  : 'text-[#374151] hover:text-[#111827]'
              }`}
              onClick={() => setActiveTab('supplier-invoices')}
            >
              <span>Supplier invoices</span>
              {activeTab === 'supplier-invoices' && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F9D58]"></div>
              )}
            </button>
            
            <button 
              className={`h-[48px] px-4 flex items-center text-[13px] font-medium cursor-pointer relative ${
                activeTab === 'payments-out' 
                  ? 'text-[#111827] font-medium' 
                  : 'text-[#374151] hover:text-[#111827]'
              }`}
              onClick={() => {
                setIsLoading(true);
                // Set the active tab to payments-out
                setActiveTab('payments-out');
                // Simulate loading for 2 seconds then stop loading
                setTimeout(() => {
                  setIsLoading(false);
                }, 2000);
              }}
            >
              <span>Payments out</span>
              {activeTab === 'payments-out' && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F9D58]"></div>
              )}
            </button>
            
            <button 
              className={`h-[48px] px-4 flex items-center text-[13px] font-medium cursor-pointer relative ${
                activeTab === 'invoices-received' 
                  ? 'text-[#111827] font-medium' 
                  : 'text-[#374151] hover:text-[#111827]'
              }`}
              onClick={() => {
                setIsLoading(true);
                setActiveTab('invoices-received');
                // Simulate loading for 2 seconds then stop loading
                setTimeout(() => {
                  setIsLoading(false);
                }, 2000);
              }}
            >
              <span>Invoices received</span>
              {activeTab === 'invoices-received' && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F9D58]"></div>
              )}
            </button>
            
            <button 
              className={`h-[48px] px-4 flex items-center text-[13px] font-medium cursor-pointer relative ${
                activeTab === 'send-for-interpretation' 
                  ? 'text-[#111827] font-medium' 
                  : 'text-[#374151] hover:text-[#111827]'
              }`}
              onClick={() => {
                setIsLoading(true);
                setActiveTab('send-for-interpretation');
                // Simulate loading for 2 seconds then stop loading
                setTimeout(() => {
                  setIsLoading(false);
                }, 2000);
              }}
            >
              <span>Send for interpretation</span>
              {activeTab === 'send-for-interpretation' && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F9D58]"></div>
              )}
            </button>
          </div>
        </div>
        
        {/* Right aligned items */}
        <div className="ml-auto flex items-center space-x-6">
          <div className="text-sm text-[#374151] hover:text-[#111827] cursor-pointer">Reports</div>
          <div className="text-sm text-[#374151] hover:text-[#111827] cursor-pointer relative">
            Register
            <ChevronDown size={14} className="absolute top-0.5 right-[-18px] text-[#374151]" />
          </div>
        </div>
      </div>

      {/* Page Header Section - Only show for supplier invoices */}
      {activeTab === 'supplier-invoices' && !showCreateForm && (
        <div className="h-16 flex items-center justify-between px-4">
          <h1 className="text-lg font-bold text-[#1F2937] tracking-[0.3px] uppercase">SUPPLIER INVOICES – LIST</h1>
          <button 
            className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold rounded-full h-8 px-3.5 flex items-center text-sm"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus size={14} className="mr-2" />
            Create supplier invoice
          </button>
        </div>
      )}

      {/* Search and Extended Search Section - Only show for supplier invoices */}
      {activeTab === 'supplier-invoices' && !showCreateForm && (
        <div className="flex items-center px-4 space-x-4">
          <div className="relative w-[320px]">
            <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#9CA3AF]" />
            <input
              placeholder="Serial no., Supplier no., Name, OCR/Invoice…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 border border-[#D1D5DB] rounded pl-8 pr-3 text-sm bg-white text-[#374151] placeholder-[#9CA3AF]"
            />
          </div>
          <button 
            className="text-[#2563EB] text-xs hover:underline cursor-pointer"
            onClick={() => setShowExtendedSearch(!showExtendedSearch)}
          >
            {showExtendedSearch ? 'Close extended search' : 'Extended search'}
          </button>
        </div>
      )}

      {/* Status Filter Buttons and Pagination - Only show for supplier invoices */}
      {activeTab === 'supplier-invoices' && !showCreateForm && (
        <div className="flex items-center justify-between px-4 py-2">
          {/* Status Filter Buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button 
              className={`h-8 px-2.5 text-xs font-medium border rounded ${getStatusButtonStyle('topost')}`}
              onClick={() => handleStatusFilter('topost')}
            >
              To handle
            </button>
            <button 
              className={`h-8 px-2.5 text-xs font-medium border rounded ${getStatusButtonStyle('all')}`}
              onClick={() => handleStatusFilter('all')}
            >
              All
            </button>
            <button 
              className={`h-8 px-2.5 text-xs font-medium border rounded ${getStatusButtonStyle('topost')}`}
              onClick={() => handleStatusFilter('topost')}
            >
              Not posted
            </button>
            <button 
              className={`h-8 px-2.5 text-xs font-medium border rounded ${getStatusButtonStyle('unpaid')}`}
              onClick={() => handleStatusFilter('unpaid')}
            >
              Unpaid
            </button>
            <button 
              className={`h-8 px-2.5 text-xs font-medium border rounded ${getStatusButtonStyle('unpaiddue')}`}
              onClick={() => handleStatusFilter('unpaiddue')}
            >
              Unpaid due
            </button>
            <button 
              className={`h-8 px-2.5 text-xs font-medium border rounded ${getStatusButtonStyle('beingpaid')}`}
              onClick={() => handleStatusFilter('beingpaid')}
            >
              Being paid
            </button>
            <button 
              className={`h-8 px-2.5 text-xs font-medium border rounded ${getStatusButtonStyle('paid')}`}
              onClick={() => handleStatusFilter('paid')}
            >
              Paid in full
            </button>
            <button 
              className={`h-8 px-2.5 text-xs font-medium border rounded ${getStatusButtonStyle('voided')}`}
              onClick={() => handleStatusFilter('voided')}
            >
              Voided
            </button>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5">
            <button className="w-7 h-7 flex items-center justify-center text-[#9E9E9E]">
              <MoreHorizontal size={16} />
            </button>
            <div className="flex items-center gap-1">
              <button 
                className="w-7 h-7 flex items-center justify-center rounded text-xs"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                className="w-7 h-7 flex items-center justify-center rounded text-xs bg-[#0B7D2A] text-white"
              >
                {currentPage}
              </button>
              <span className="text-xs">of</span>
              <button 
                className="w-7 h-7 flex items-center justify-center rounded text-xs"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              >
                {totalPages}
              </button>
              <button 
                className="w-7 h-7 flex items-center justify-center rounded text-xs"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Extended Search Panel - Only show when toggled */}
      {activeTab === 'supplier-invoices' && !showCreateForm && showExtendedSearch && (
        <div className="px-4 py-4 bg-white border-t border-b border-[#E0E0E0]">
          {/* Basic Details Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between h-10 py-2 border-b border-[#E0E0E0] mb-4">
              <span className="text-sm font-semibold text-[#2C2C2C]">Basic details</span>
              <ChevronDown size={16} className="text-[#2E7D32]" />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Serial number</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter serial number"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Supplier number</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter supplier number"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Supplier</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter supplier name"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">OCR</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter OCR number"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Invoice number</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter invoice number"
                />
              </div>
              
              {/* Toggle Groups */}
              <div className="mt-2">
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Show payment file</label>
                <div className="flex h-8 border border-[#DADADA] rounded overflow-hidden">
                  <button className="flex-1 bg-[#E0E0E0] text-[#4A4A4A] text-xs py-2">Can be created</button>
                  <button className="flex-1 bg-[#E0E0E0] text-[#4A4A4A] text-xs py-2">Has been created</button>
                  <button className="flex-1 bg-white text-[#2C2C2C] text-xs font-medium py-2 border-l border-[#DADADA]">All</button>
                </div>
              </div>
              
              <div className="mt-2">
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Assets</label>
                <div className="flex h-8 border border-[#DADADA] rounded overflow-hidden">
                  <button className="flex-1 bg-[#E0E0E0] text-[#4A4A4A] text-xs py-2">Can be created</button>
                  <button className="flex-1 bg-[#E0E0E0] text-[#4A4A4A] text-xs py-2">Has been created</button>
                  <button className="flex-1 bg-white text-[#2C2C2C] text-xs font-medium py-2 border-l border-[#DADADA]">All</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoice Details Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between h-10 py-2 border-b border-[#E0E0E0] mb-4">
              <span className="text-sm font-semibold text-[#2C2C2C]">Invoice details</span>
              <ChevronDown size={16} className="text-[#2E7D32]" />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Our reference</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter our reference"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Supplier's reference</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter supplier's reference"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Comment</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter comment"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Date selector</label>
                <div className="relative">
                  <select className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] appearance-none pr-6 focus:border-[#2E7D32] focus:outline-none">
                    <option>Invoice date</option>
                    <option>Due date</option>
                    <option>Payment date</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <span className="text-[#9E9E9E] text-xs">▼</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">From</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] focus:border-[#2E7D32] focus:outline-none pr-8"
                    />
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[#9E9E9E] pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">To</label>
                  <div className="relative">
                    <input 
                      type="date" 
                      className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] focus:border-[#2E7D32] focus:outline-none pr-8"
                    />
                    <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[#9E9E9E] pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Type of VAT</label>
                <div className="flex h-8 border border-[#DADADA] rounded overflow-hidden">
                  <button className="flex-1 bg-[#E0E0E0] text-[#4A4A4A] text-xs py-2">Normal</button>
                  <button className="flex-1 bg-[#E0E0E0] text-[#4A4A4A] text-xs py-2">UIF</button>
                  <button className="flex-1 bg-[#E0E0E0] text-[#4A4A4A] text-xs py-2">Rev. Tax</button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Invoice Type</label>
                <div className="relative">
                  <select className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] appearance-none pr-6 focus:border-[#2E7D32] focus:outline-none">
                    <option>All invoices</option>
                    <option>Regular</option>
                    <option>Credit</option>
                    <option>Proforma</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <span className="text-[#9E9E9E] text-xs">▼</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Currency</label>
                <div className="relative">
                  <select className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] appearance-none pr-6 focus:border-[#2E7D32] focus:outline-none">
                    <option>All currencies</option>
                    <option>SEK</option>
                    <option>EUR</option>
                    <option>USD</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <span className="text-[#9E9E9E] text-xs">▼</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoice Content Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between h-10 py-2 border-b border-[#E0E0E0] mb-4">
              <span className="text-sm font-semibold text-[#2C2C2C]">Invoice content</span>
              <ChevronDown size={16} className="text-[#2E7D32]" />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Item number</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter item number"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Item name</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter item name"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Account from</label>
                  <input 
                    type="text" 
                    className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                    placeholder="From account"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Account to</label>
                  <input 
                    type="text" 
                    className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                    placeholder="To account"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Transaction information</label>
                <input 
                  type="text" 
                  className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                  placeholder="Enter transaction info"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Amount</label>
                <div className="relative">
                  <select className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] appearance-none pr-6 focus:border-[#2E7D32] focus:outline-none">
                    <option>Total</option>
                    <option>Net</option>
                    <option>VAT</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <span className="text-[#9E9E9E] text-xs">▼</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">From</label>
                  <input 
                    type="number" 
                    className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                    placeholder="From amount"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">To</label>
                  <input 
                    type="number" 
                    className="w-full h-9 px-2.5 py-2 border border-[#D0D0D0] rounded text-xs text-[#2C2C2C] placeholder-[#9E9E9E] focus:border-[#2E7D32] focus:outline-none"
                    placeholder="To amount"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button className="h-9 px-4 bg-[#9E9E9E] text-white text-xs rounded-full font-medium">
              Clear
            </button>
            <button className="h-9 px-4 bg-[#6F6F6F] text-white text-xs rounded-full font-semibold">
              Search
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area - Conditional Rendering */}
      <div className="flex-grow max-w-[1100px] mx-auto w-full pb-12">
        {activeTab === 'supplier-invoices' ? (
          <div className="p-4">
            {showCreateForm ? (
              <div className="bg-white rounded-lg shadow-sm">
                <SupplierInvoiceForm onGoBackToList={() => {
                  setShowCreateForm(false);
                  // Optionally refresh the list after creation
                }} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Table Container */}
                <div className="border border-[#E0E0E0] rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="h-10 bg-white border-b border-[#E0E0E0] flex">
                    <div className="w-8 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      <input type="checkbox" className="w-4 h-4 border border-[#9E9E9E] rounded" />
                    </div>
                    <div className="w-16 flex items-center px-2 text-[11px] font-semibold text-[#FFFFFF] uppercase bg-[#BDBDBD]">
                      SERIAL NO
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      TYPE
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      SUPPLIER NO
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      NAME
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      OCR
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      INVOICE NUMBER
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      INVOICE DATE
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      DUE DATE
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      TOTAL
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      BALANCE
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      VAT
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      CURRENCY
                    </div>
                    <div className="flex-1 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      PAID IN FULL
                    </div>
                    <div className="w-16 flex items-center px-2 text-[11px] font-semibold text-[#4A4A4A] uppercase">
                      ACTION
                    </div>
                  </div>
                  
                  {/* Table Rows */}
                  {supplierInvoices.map((invoice) => (
                    <div 
                      key={invoice.id}
                      className="h-11 bg-white border-b border-[#E0E0E0] flex items-center"
                    >
                      <div className="w-8 flex items-center px-2">
                        <input type="checkbox" className="w-4 h-4 border border-[#9E9E9E] rounded" />
                      </div>
                      <div className="w-16 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.serialNo}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.type}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.supplierNo}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.name}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.ocr}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.invoiceNumber}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.invoiceDate}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.dueDate}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C] text-right">
                        {invoice.total}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C] text-right">
                        {invoice.balance}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C] text-right">
                        {invoice.vat}
                      </div>
                      <div className="flex-1 flex items-center px-2 text-xs text-[#2C2C2C]">
                        {invoice.currency}
                      </div>
                      <div className="flex-1 flex items-center px-2 justify-center">
                        <User size={16} className="text-[#6F6F6F]" />
                      </div>
                      <div className="w-16 flex items-center px-2 justify-center">
                        <FileText size={16} className="text-[#6F6F6F] hover:text-[#2E7D32] cursor-pointer" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Total Summary Row */}
                <div className="h-10 bg-white border-t border-[#E0E0E0] flex mt-1">
                  <div className="w-8 flex items-center px-2"></div>
                  <div className="w-16 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A] text-right">
                    Total SEK: {totalSEK}
                  </div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A] text-right">
                    {totalBalance}
                  </div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A] text-right">
                    {totalVat}
                  </div>
                  <div className="flex-1 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                  <div className="w-16 flex items-center px-2 text-xs font-semibold text-[#4A4A4A]"></div>
                </div>
                
                {/* Bottom Pagination */}
                <div className="flex justify-end mt-2">
                  <div className="flex items-center gap-1">
                    <button className="w-7 h-7 flex items-center justify-center rounded text-xs bg-[#0B7D2A] text-white">
                      1
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded text-xs border border-[#E0E0E0] text-[#9E9E9E]">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            {activeTab === 'payments-out' && (
              <div>
                <PaymentsOut />
              </div>
            )}
            {activeTab === 'invoices-received' && (
              <div>
                <InvoicesReceived />
              </div>
            )}
            {activeTab === 'send-for-interpretation' && (
              <div>
                <SendForInterpretation />
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Bottom Payment Action Toolbar - Sticky - Only show for supplier invoices */}
      {activeTab === 'supplier-invoices' && !showCreateForm && (
        <div className="
          w-full 
          max-w-[3100px] 
          mx-auto 
          sticky 
          bottom-0 
          bg-white 
          border-t border-[#E5E7EB] 
          px-4
          py-3 
          flex 
          items-center 
          justify-between
          z-40
        ">
          {/* Left Section - Selection Status */}
          <div className="flex flex-col">
            <div className="text-xs font-medium text-[#374151]">
              (0 selected)
            </div>
            <div className="text-[11px] text-[#6B7280]">
              (Total SEK selected: 0 <a href="#" className="text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer">i different currencies</a> eller <a href="#" className="text-[#2563EB] hover:text-[#1D4ED8] cursor-pointer">different suppliers</a>)
            </div>
          </div>
          
          {/* Right Section - Action Controls */}
          <div className="flex items-center gap-2">
            <button className="h-8 px-3 bg-[#9CA3AF] text-white text-xs font-medium rounded-full opacity-85 cursor-not-allowed">
              Print voucher
            </button>
            <button className="h-8 px-3 bg-[#A7D7B9] text-white text-xs font-medium rounded-full hover:bg-[#86C5A5]">
              Post
            </button>
            <div className="relative">
              <select className="h-8 px-3 border border-[#D1D5DB] text-xs text-[#374151] rounded-full appearance-none pr-8">
                <option>Account</option>
                <option>Account 1</option>
                <option>Account 2</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
            </div>
            <button className="h-8 px-4 bg-[#15803D] text-white text-xs font-bold rounded-full hover:bg-[#166534] active:bg-[#14532D]">
              Pay
            </button>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center">
            {!gifError ? (
              <img 
                src="/src/assets/loading/200.gif" 
                alt="Loading..." 
                className="w-16 h-16"
                onError={() => setGifError(true)}
              />
            ) : (
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            )}
            <p className="mt-4 text-gray-700">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplierInvoicesList;