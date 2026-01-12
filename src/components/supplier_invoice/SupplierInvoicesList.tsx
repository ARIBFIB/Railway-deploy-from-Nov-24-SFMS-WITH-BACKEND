import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Printer, 
  Download, 
  Mail,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import PaymentsOut from './PaymentsOut';
import InvoicesReceived from './InvoicesReceived';
import SendForInterpretation from './SendForInterpretation';

const SupplierInvoicesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('supplier-invoices');
  const [isLoading, setIsLoading] = useState(false);
  const [gifError, setGifError] = useState(false);

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation Bar - Sticky */}
<div className="
  h-12 
  bg-white 
  border-b border-[#E5E7EB] 
  flex items-center 
  sticky 
  top-[-25px] 
  z-40 
  w-full
">
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
      {activeTab !== 'invoices-received' && activeTab !== 'send-for-interpretation' && (
        <div className="h-16 flex items-center justify-between px-4">
          <h1 className="text-lg font-bold text-[#1F2937] tracking-[0.3px] uppercase">SUPPLIER INVOICES – LIST</h1>
          <div className="flex items-center space-x-4">
            <button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold rounded-full h-8 px-3.5 flex items-center text-sm">
              <Plus size={14} className="mr-2" />
              Create supplier invoice
            </button>
          </div>
        </div>
      )}

      {/* Search and Extended Search Section - Only show for supplier invoices */}
      {activeTab !== 'invoices-received' && activeTab !== 'send-for-interpretation' && (
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
          <button className="text-[#2563EB] text-xs hover:underline cursor-pointer">
            Extended search
          </button>
        </div>
      )}

      {/* Utility Action Bar - Only show for supplier invoices */}
      {activeTab !== 'invoices-received' && activeTab !== 'send-for-interpretation' && (
        <div className="h-10 bg-white border-b border-[#E5E7EB] flex items-center px-4">
          <div className="flex items-center text-xs text-[#374151]">
            <Mail size={14} className="mr-2" />
            Email documents: inbox.lev.1520105@arkivplats.se
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <button className="flex items-center text-xs text-[#374151] hover:text-[#2563EB]">
              <Download size={14} className="mr-1" />
              Download linked pictures
            </button>
            <button className="flex items-center text-xs text-[#374151] hover:text-[#2563EB]">
              <Printer size={14} className="mr-1" />
              Print list
            </button>
            <button className="flex items-center text-xs text-[#374151] hover:text-[#2563EB]">
              Process payment files
            </button>
            <button className="flex items-center text-xs text-[#374151] hover:text-[#2563EB]">
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area - Conditional Rendering */}
      <div className="flex-grow max-w-[1100px] mx-auto w-full pb-12">
        {activeTab === 'payments-out' ? (
          <div className="p-4">
            <PaymentsOut />
          </div>
        ) : activeTab === 'invoices-received' ? (
          <div className="p-4">
            <InvoicesReceived />
          </div>
        ) : activeTab === 'send-for-interpretation' ? (
          <div className="p-4">
            <SendForInterpretation />
          </div>
        ) : (
          <div className="p-4">
            <div className="flex flex-col md:flex-row items-center gap-8 p-6 bg-[#F9FAFB]">
              {/* Illustration */}
              <div className="flex-shrink-0">
                <img 
                  src="/src/assets/images/human_documents.png" 
                  alt="Human with documents illustration" 
                  className="w-40 h-auto object-contain"
                />
              </div>
              
              {/* Text Content */}
              <div>
                <h2 className="text-xl font-bold text-[#111827] mb-2">
                  Start your accounting journey with SFMS
                </h2>
                <p className="text-sm text-[#374151] leading-6 max-w-md">
                  A good start is to create your first supplier invoice. You receive a supplier invoice when you have made a purchase from a supplier, when you post the supplier invoice in SFMS, you get a good and quick overview of your invoices quickly and easily.
                </p>
              </div>
            </div>
            
            {/* Option Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Card 1 - Digital Interpretation */}
              <div className="bg-white rounded-xl p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-bold text-[#111827] mb-3">
                  Simplest & most digital way of working
                </h3>
                <p className="text-sm text-[#374151] leading-6 mb-5">
                  Use SFMS Invoice Interpretation with accounting suggestions and get your supplier invoices interpreted in an instant! All you need to do is double check the numbers.
                </p>
                <button className="h-11 rounded-[22px] bg-[#0F7A3A] text-white text-sm font-bold hover:bg-[#0B5E2D] w-full transition-colors">
                  Read more about the interpretation
                </button>
              </div>
              
              {/* Card 2 - Manual Operation */}
              <div className="bg-white rounded-xl p-6 shadow-[0_4px_10px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-bold text-[#111827] mb-3">
                  Manual operation
                </h3>
                <p className="text-sm text-[#374151] leading-6">
                  Of course, it is also possible to work manually, then you simply click on the "Create supplier invoice" button in the upper right corner.
                  In this <a href="#" className="text-[#2563EB] font-medium hover:underline">help section</a> you can read more about how to create a supplier invoice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom Payment Action Toolbar - Sticky - Only show for supplier invoices */}
      {activeTab !== 'payments-out' && activeTab !== 'invoices-received' && activeTab !== 'send-for-interpretation' && (
        <div className="
          w-full 
          max-w-[3100px] 
          mx-auto 
          sticky 
          bottom-[-2rem] 
          bg-white 
          border-t border-[#E5E7EB] 
          px-23
          py-5 
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