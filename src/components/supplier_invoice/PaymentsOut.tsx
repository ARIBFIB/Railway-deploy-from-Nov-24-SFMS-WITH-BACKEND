import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Upload, 
  Mail,
  ChevronDown
} from 'lucide-react';

const PaymentsOut: React.FC = () => {
  const [paymentDate, setPaymentDate] = useState('');
  const [invoice, setInvoice] = useState('');
  const [paidSEK, setPaidSEK] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ paymentDate, invoice, paidSEK });
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-white">
      {/* Top Navigation Bar */}
      {/* <div className="h-14 bg-white border-b border-[#E0E0E0] flex items-center px-4">
        <div className="flex items-center h-[56px]">
          <div className="flex">
            <button className="h-[56px] px-4 flex items-center text-[13px] font-medium cursor-pointer relative text-[#374151] hover:text-[#111827]">
              <span>Supplier invoices</span>
            </button>
            
            <button className="h-[56px] px-4 flex items-center text-[13px] font-medium cursor-pointer relative text-[#000000] font-semibold">
              <span>Payments out</span>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0F8F45]"></div>
            </button>
            
            <button className="h-[56px] px-4 flex items-center text-[13px] font-medium cursor-pointer relative text-[#374151] hover:text-[#111827]">
              <span>Invoices received</span>
            </button>
            
            <button className="h-[56px] px-4 flex items-center text-[13px] font-medium cursor-pointer relative text-[#374151] hover:text-[#111827]">
              <span>Send for interpretation</span>
            </button>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-6">
          <div className="text-sm text-[#4F4F4F] hover:text-[#111827] cursor-pointer">Reports</div>
          <div className="text-sm text-[#4F4F4F] hover:text-[#111827] cursor-pointer relative">
            Register
            <ChevronDown size={14} className="absolute top-0.5 right-[-18px] text-[#4F4F4F]" />
          </div>
        </div>
      </div> */}

      {/* Page Header Section */}
      <div className="h-16 flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold text-[#1F1F1F]">PAYMENTS OUT</h1>
        <div className="flex items-center space-x-3">
          <button className="flex items-center text-sm text-[#4F4F4F] hover:text-[#111827]">
            <span>Remove non-matching payments</span>
          </button>
          <button className="flex items-center text-sm text-[#4F4F4F] hover:text-[#111827]">
            <Upload size={16} className="mr-1" />
            <span>Load payment file</span>
          </button>
        </div>
      </div>

      {/* Form Section (Payment Entry) */}
      <div className="mx-6 my-4 p-4 border border-[#E0E0E0] rounded-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-[#4F4F4F]">Payment date</label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-[140px] h-9 border border-[#DADADA] rounded px-2 text-sm text-[#000000]"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-[#4F4F4F]">Invoice</label>
            <div className="relative">
              <input
                type="text"
                placeholder=""
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                className="w-[320px] h-9 border border-[#DADADA] rounded px-3 text-sm text-[#000000] placeholder-[#9E9E9E]"
              />
              <Search size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E]" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-[#4F4F4F]">Paid SEK</label>
            <input
              type="text"
              value={paidSEK}
              onChange={(e) => setPaidSEK(e.target.value)}
              className="w-[180px] h-9 border border-[#DADADA] rounded px-3 text-sm text-[#000000] text-right"
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              type="submit"
              className="h-9 bg-[#0F8F45] text-white text-sm font-medium rounded-full px-4 hover:bg-opacity-90"
            >
              Add
            </button>
            <button 
              type="button"
              className="h-9 bg-[#F2F2F2] text-[#333333] text-sm font-medium rounded-full px-4 hover:bg-opacity-90"
            >
              Clear
            </button>
            <button 
              type="button"
              className="h-9 bg-[#F2F2F2] text-[#333333] text-sm font-medium rounded-full px-4 hover:bg-opacity-90"
            >
              Search in the invoice list
            </button>
          </div>
        </form>
      </div>

      {/* Content Area - Empty State */}
      <div className="mx-6 flex-grow flex items-center justify-center">
        <div className="text-center py-12">
          <div className="text-lg text-[#616161]">No payments have been added yet</div>
          <p className="text-sm text-[#9E9E9E] mt-2">Match payments to invoices to reconcile them</p>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="h-16 bg-white border-t border-[#E0E0E0] px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            disabled
            className="h-8 px-3 bg-[#BDBDBD] text-white text-sm font-medium rounded opacity-50 cursor-not-allowed"
          >
            Unmark all
          </button>
          <div className="text-sm text-[#616161]">(0 selected)</div>
        </div>
        
        <div className="text-lg text-[#616161]">Total SEK: 0.00</div>
        
        <div className="flex items-center space-x-3">
          <select className="h-9 border border-[#DADADA] rounded px-3 text-sm text-[#000000]">
            <option>Bank transfer (1930)</option>
            <option>Other option</option>
          </select>
          <button className="h-9 bg-[#9AD0A8] text-white text-sm font-medium rounded-full px-4 hover:bg-opacity-90">
            <Mail size={14} className="inline mr-1" />
            Mail
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentsOut;