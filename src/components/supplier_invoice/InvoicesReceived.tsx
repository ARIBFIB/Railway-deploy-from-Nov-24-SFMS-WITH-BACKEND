import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  Printer, 
  Plus, 
  ChevronDown
} from 'lucide-react';

const InvoicesReceived: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [isInviteLoading, setIsInviteLoading] = useState(false);

  // Dummy data for invoices received
  const invoicesReceived = [
    {
      id: 1,
      type: 'F',
      supplierName: 'ABC Company',
      reference: 'INV-001',
      invoiceDate: '2026-01-15',
      dueDate: '2026-02-15',
      total: '15,000',
      vat: '2,500',
      estVat: '2,500',
      currency: 'SEK',
      account: '2440',
      source: 'Email',
      received: '2026-01-14',
      status: 'ready-to-be-created' // Options: 'interpretation-failed', 'requires-editing', 'ready-to-be-created'
    },
    {
      id: 2,
      type: 'F',
      supplierName: 'XYZ Services',
      reference: 'INV-002',
      invoiceDate: '2026-01-14',
      dueDate: '2026-02-14',
      total: '22,500',
      vat: '3,750',
      estVat: '3,750',
      currency: 'SEK',
      account: '2440',
      source: 'E-invoice',
      received: '2026-01-13',
      status: 'requires-editing'
    },
    {
      id: 3,
      type: 'F',
      supplierName: 'Tech Solutions Ltd',
      reference: 'INV-003',
      invoiceDate: '2026-01-13',
      dueDate: '2026-02-13',
      total: '8,750',
      vat: '1,458',
      estVat: '1,458',
      currency: 'SEK',
      account: '2440',
      source: 'Upload',
      received: '2026-01-12',
      status: 'interpretation-failed'
    },
    {
      id: 4,
      type: 'F',
      supplierName: 'Global Supplies',
      reference: 'INV-004',
      invoiceDate: '2026-01-12',
      dueDate: '2026-02-12',
      total: '31,200',
      vat: '5,200',
      estVat: '5,200',
      currency: 'SEK',
      account: '2440',
      source: 'Email',
      received: '2026-01-11',
      status: 'ready-to-be-created'
    },
    {
      id: 5,
      type: 'F',
      supplierName: 'Office Essentials',
      reference: 'INV-005',
      invoiceDate: '2026-01-11',
      dueDate: '2026-02-11',
      total: '5,400',
      vat: '900',
      estVat: '900',
      currency: 'SEK',
      account: '2440',
      source: 'E-invoice',
      received: '2026-01-10',
      status: 'ready-to-be-created'
    }
  ];

  useEffect(() => {
    // Simulate loading for 0.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectAll = () => {
    if (selectedInvoices.length === invoicesReceived.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(invoicesReceived.map(invoice => invoice.id));
    }
  };

  const handleCreateInvoices = () => {
    // Handle creating invoices logic
    console.log('Creating invoices...');
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-[#4F4F4F]">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="h-12 flex items-center px-4">
            <h1 className="text-sm font-semibold text-[#1F1F1F]">INVOICES RECEIVED</h1>
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative w-[260px]">
                <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-[#757575]" />
                <input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-7 border border-[#DADADA] rounded px-8 text-xs bg-white text-[#4F4F4F] placeholder-[#9E9E9E]"
                />
              </div>
              <button className="text-xs text-[#1A73E8] hover:underline cursor-pointer">
                Extended search
              </button>
            </div>
          </div>

      {/* Action Row (Top Right) */}
      <div className="px-4 py-2 flex items-center justify-end space-x-4 text-xs text-[#4F4F4F]">
        <button className="flex items-center space-x-1 hover:text-[#1F1F1F]">
          <Mail size={14} className="text-[#6F6F6F]" />
          <span>Email documents</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-[#1F1F1F]">
          <Printer size={14} className="text-[#6F6F6F]" />
          <span>Print list</span>
        </button>
        <button 
          className="flex items-center space-x-1 hover:text-[#1F1F1F]"
          onClick={() => {
            setIsInviteLoading(true);
            // Simulate loading for 0.5 seconds
            setTimeout(() => {
              setIsInviteLoading(false);
              setShowInviteDialog(true);
            }, 500);
          }}
          disabled={isInviteLoading}
        >
          {isInviteLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#1F1F1F] border-t-transparent rounded-full animate-spin mr-1"></div>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <Plus size={14} className="text-[#6F6F6F]" />
              <span>Invite suppliers to e-invoice</span>
            </>
          )}
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="px-4 py-2 flex space-x-2">
        <button
          className={`h-8 px-3 text-xs border border-[#DADADA] rounded ${
            activeFilter === 'all' ? 'bg-white font-medium' : 'bg-white'
          }`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button
          className={`h-8 px-3 text-xs flex items-center space-x-2 ${
            activeFilter === 'interpretation-failed' 
              ? 'bg-white font-medium' 
              : 'bg-white'
          }`}
          onClick={() => setActiveFilter('interpretation-failed')}
        >
          <div className="w-1 h-6 bg-[#F28B82] rounded"></div>
          <span>Interpretation failed</span>
        </button>
        <button
          className={`h-8 px-3 text-xs flex items-center space-x-2 ${
            activeFilter === 'requires-editing' 
              ? 'bg-white font-medium' 
              : 'bg-white'
          }`}
          onClick={() => setActiveFilter('requires-editing')}
        >
          <div className="w-1 h-6 bg-[#FFF475] rounded"></div>
          <span>Requires editing</span>
        </button>
        <button
          className={`h-8 px-3 text-xs flex items-center space-x-2 ${
            activeFilter === 'ready-to-be-created' 
              ? 'bg-white font-medium' 
              : 'bg-white'
          }`}
          onClick={() => setActiveFilter('ready-to-be-created')}
        >
          <div className="w-1 h-6 bg-[#A7D88B] rounded"></div>
          <span>Ready to be created</span>
        </button>
      </div>

      {/* Table Header */}
      <div className="mx-4">
        <div className="h-9 bg-white border-b border-[#E0E0E0] flex items-center">
          <div className="w-8 flex items-center">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded text-[#1A73E8] focus:ring-[#1A73E8]"
              onChange={handleSelectAll}
            />
          </div>
          <div className="w-[70px] text-xs font-semibold uppercase tracking-wider text-[#424242] bg-[#BDBDBD] text-center py-1 rounded mx-1">
            Type
          </div>
          <div className="flex-1 text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Supplier name
          </div>
          <div className="w-[180px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Reference/Serial No
          </div>
          <div className="w-[110px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Invoice date
          </div>
          <div className="w-[110px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Due date
          </div>
          <div className="w-[80px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2 text-right">
            Total
          </div>
          <div className="w-[60px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            VAT
          </div>
          <div className="w-[80px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Est VAT
          </div>
          <div className="w-[80px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Currency
          </div>
          <div className="w-[90px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Account
          </div>
          <div className="w-[100px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Source
          </div>
          <div className="w-[110px] text-xs font-semibold uppercase tracking-wider text-[#424242] px-2">
            Received
          </div>
        </div>

        {/* Table Body - Invoice Records */}
        <div className="bg-white border border-[#E0E0E0] rounded-b">
          {invoicesReceived
            .filter(invoice => {
              if (activeFilter === 'all') return true;
              return invoice.status === activeFilter;
            })
            .map((invoice) => (
            <div 
              key={invoice.id}
              className="h-12 border-b border-[#E0E0E0] flex items-center hover:bg-[#F5F5F5]"
            >
              <div className="w-8 flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded text-[#1A73E8] focus:ring-[#1A73E8]"
                  checked={selectedInvoices.includes(invoice.id)}
                  onChange={() => {
                    if (selectedInvoices.includes(invoice.id)) {
                      setSelectedInvoices(selectedInvoices.filter(id => id !== invoice.id));
                    } else {
                      setSelectedInvoices([...selectedInvoices, invoice.id]);
                    }
                  }}
                />
              </div>
              <div className="w-[70px] text-xs text-center text-[#424242] px-2 bg-[#BDBDBD] rounded mx-1 py-1">
                {invoice.type}
              </div>
              <div className="flex-1 text-xs text-[#424242] px-2 truncate">
                {invoice.supplierName}
              </div>
              <div className="w-[180px] text-xs text-[#424242] px-2">
                {invoice.reference}
              </div>
              <div className="w-[110px] text-xs text-[#424242] px-2">
                {invoice.invoiceDate}
              </div>
              <div className="w-[110px] text-xs text-[#424242] px-2">
                {invoice.dueDate}
              </div>
              <div className="w-[80px] text-xs text-[#424242] px-2 text-right">
                {invoice.total}
              </div>
              <div className="w-[60px] text-xs text-[#424242] px-2">
                {invoice.vat}
              </div>
              <div className="w-[80px] text-xs text-[#424242] px-2">
                {invoice.estVat}
              </div>
              <div className="w-[80px] text-xs text-[#424242] px-2">
                {invoice.currency}
              </div>
              <div className="w-[90px] text-xs text-[#424242] px-2">
                {invoice.account}
              </div>
              <div className="w-[100px] text-xs text-[#424242] px-2">
                {invoice.source}
              </div>
              <div className="w-[110px] text-xs text-[#424242] px-2">
                {invoice.received}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="h-14 bg-white border-t border-[#E0E0E0] px-4 flex items-center justify-between sticky bottom-0 z-10">
        <div className="flex items-center space-x-3">
          <button 
            disabled={selectedInvoices.length === 0}
            className={`h-8 px-3 text-xs rounded-full ${selectedInvoices.length > 0 ? 'bg-[#F28B82] text-white hover:bg-[#E57373]' : 'bg-[#E0E0E0] text-[#9E9E9E] cursor-not-allowed'}`}
            onClick={() => {
              // Handle delete action
              console.log('Deleting invoices:', selectedInvoices);
              setSelectedInvoices([]);
            }}
          >
            Delete
          </button>
          <div className="text-xs text-[#757575]">({selectedInvoices.length} selected)</div>
        </div>
        <div>
          <button 
            className="h-8 bg-[#9AD0A8] text-white text-xs rounded-full px-4 hover:bg-opacity-90"
            onClick={handleCreateInvoices}
          >
            Create invoices
          </button>
        </div>
      </div>
        </>
      )}
      
      {/* Invite Suppliers Dialog */}
      {showInviteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <h3 className="text-xl font-semibold text-[#0B4F2F] mb-4">You have no suppliers to activate!</h3>
            <p className="text-[#1F1F1F] mb-7">
              You can view the status of your e-invoice requests in your supplier directory.
            </p>
            <button 
              className="bg-[#0F7F3E] text-white font-semibold rounded-full h-10 min-w-[120px] px-7 hover:bg-[#0B6E35] active:bg-[#095E2D]"
              onClick={() => setShowInviteDialog(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesReceived;