import React, { useState } from 'react';
import { 
  Plus, 
  Menu, 
  FileText, 
  Copy, 
  DollarSign, 
  X, 
  Check, 
  MessageCircle,
  ChevronDown,
  Mail as MailIcon
} from 'lucide-react';

interface SupplierInvoiceFormProps {
  onGoBackToList?: () => void;
}

const SupplierInvoiceForm: React.FC<SupplierInvoiceFormProps> = ({ onGoBackToList }) => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [activeVatType, setActiveVatType] = useState<'normal' | 'uif' | 'rev_tax'>('normal');
  const [activeRegistrationTab, setActiveRegistrationTab] = useState<'account' | 'item'>('account');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    supplier: '',
    invoiceDate: '2026-01-16',
    dueDate: '2026-01-16',
    ocr: '',
    invoiceNumber: '',
    total: '0,00',
    vat: '0,00',
    currency: 'SEK',
    rate: '1',
    unit: '1',
    ourReference: '',
    codingTemplate: '',
    bankGiro: '',
    plusGiro: '',
    supplierReference: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVatTypeChange = (type: 'normal' | 'uif' | 'rev_tax') => {
    setActiveVatType(type);
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] p-6 relative">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Top Header Bar */}
        <div className="flex justify-between items-center p-6 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-[18px] font-bold text-[#2E2E2E]">SUPPLIER INVOICE 2</h1>
            <span className="text-[13px] text-[#6F6F6F] ml-4">VOUCHER NO: D1</span>
          </div>
          <div className="flex gap-3">
            <button 
              className="flex items-center gap-2 bg-[#0F7A3A] hover:bg-[#0B5E2D] active:bg-[#0A4E22] text-white px-4.5 py-2.5 rounded-full text-sm font-medium h-9 transition-colors"
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  // Simulate API call to create supplier invoice
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                  // Call the callback to go back to the list
                  if (onGoBackToList) {
                    onGoBackToList();
                  }
                } catch (error) {
                  console.error('Error creating supplier invoice:', error);
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create supplier invoice
                </>
              )}
            </button>
            <button 
              className="flex items-center gap-2 bg-[#FFC107] hover:bg-[#FFB300] active:bg-[#FFA000] text-black px-4.5 py-2.5 rounded-full text-sm font-medium h-9 transition-colors"
              onClick={onGoBackToList || (() => window.history.back())}
            >
              <Menu className="w-4 h-4" />
              Show list
            </button>
          </div>
        </div>

        {/* Secondary Action Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b border-[#E5E7EB]">
          <button className="text-[#C7C7C7] cursor-not-allowed" disabled>
            <FileText className="w-4.5 h-4.5" />
          </button>
          <button className="text-[#C7C7C7] cursor-not-allowed" disabled>
            <Copy className="w-4.5 h-4.5" />
          </button>
          <button className="text-[#C7C7C7] cursor-not-allowed" disabled>
            <DollarSign className="w-4.5 h-4.5" />
          </button>
          <button className="text-[#4A4A4A] hover:text-[#2F2F2F] cursor-pointer">
            <X className="w-4.5 h-4.5" />
          </button>
          <button className="text-[#4A4A4A] hover:text-[#2F2F2F] cursor-pointer">
            <Check className="w-4.5 h-4.5" />
          </button>
          <button className="text-[#4A4A4A] hover:text-[#2F2F2F] cursor-pointer">
            <MessageCircle className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Row 1 */}
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Supplier</label>
              <input
                type="text"
                name="supplier"
                placeholder="Supplier number, CIN/PIN, Name, Bg/Pg"
                value={formData.supplier}
                onChange={handleInputChange}
                className="w-full h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm placeholder-[#9E9E9E] focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Invoice date</label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleInputChange}
                className="w-full h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Due date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Row 2 */}
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">OCR</label>
              <input
                type="text"
                name="ocr"
                value={formData.ocr}
                onChange={handleInputChange}
                className="w-full h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Invoice number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                className="w-full h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Row 3 - Financial Summary */}
            <div className="ml-auto">
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Total</label>
              <input
                type="text"
                name="total"
                value={formData.total}
                readOnly
                className="w-32 h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm text-right focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="ml-auto">
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">VAT</label>
              <input
                type="text"
                name="vat"
                value={formData.vat}
                readOnly
                className="w-32 h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm text-right focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Row 4 */}
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Currency</label>
              <div className="relative">
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm appearance-none focus:border-[#2684FF] focus:outline-none transition-colors pr-8"
                >
                  <option value="SEK">SEK</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <span className="text-[#6F6F6F]">▼</span>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Rate</label>
              <input
                type="text"
                name="rate"
                value={formData.rate}
                onChange={handleInputChange}
                className="w-full h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full h-9 px-3 py-2 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="border-t border-[#E5E7EB] pt-6">
            <button
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              className="flex items-center gap-2 text-[#2E2E2E] font-semibold"
            >
              <span 
                className={`transform transition-transform duration-250 ${showAdditionalInfo ? 'rotate-0' : '-rotate-90'}`}
              >
                ▼
              </span>
              Additional information
            </button>

            {showAdditionalInfo && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Our reference</label>
                  <input
                    type="text"
                    name="ourReference"
                    placeholder="First name, Last name"
                    value={formData.ourReference}
                    onChange={handleInputChange}
                    className="w-full h-8 px-3 py-1.5 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm placeholder-[#9E9E9E] focus:border-[#2684FF] focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Coding template</label>
                  <input
                    type="text"
                    name="codingTemplate"
                    value={formData.codingTemplate}
                    onChange={handleInputChange}
                    className="w-full h-8 px-3 py-1.5 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Bank giro</label>
                  <input
                    type="text"
                    name="bankGiro"
                    value={formData.bankGiro}
                    onChange={handleInputChange}
                    className="w-full h-8 px-3 py-1.5 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Plusgiro</label>
                  <input
                    type="text"
                    name="plusGiro"
                    value={formData.plusGiro}
                    onChange={handleInputChange}
                    className="w-full h-8 px-3 py-1.5 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Supplier's reference</label>
                  <input
                    type="text"
                    name="supplierReference"
                    value={formData.supplierReference}
                    onChange={handleInputChange}
                    className="w-full h-8 px-3 py-1.5 border border-[#D9D9D9] rounded-md bg-white text-[#1F1F1F] text-sm focus:border-[#2684FF] focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Type of VAT</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleVatTypeChange('normal')}
                      className={`h-8 px-3 border border-[#D9D9D9] text-sm ${
                        activeVatType === 'normal'
                          ? 'bg-[#E9ECEF] text-[#1F1F1F]'
                          : 'text-[#6F6F6F]'
                      } hover:bg-[#F1F3F5] transition-colors`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => handleVatTypeChange('uif')}
                      className={`h-8 px-3 border border-[#D9D9D9] text-sm ${
                        activeVatType === 'uif'
                          ? 'bg-[#E9ECEF] text-[#1F1F1F]'
                          : 'text-[#6F6F6F]'
                      } hover:bg-[#F1F3F5] transition-colors`}
                    >
                      UIF
                    </button>
                    <button
                      onClick={() => handleVatTypeChange('rev_tax')}
                      className={`h-8 px-3 border border-[#D9D9D9] text-sm ${
                        activeVatType === 'rev_tax'
                          ? 'bg-[#E9ECEF] text-[#1F1F1F]'
                          : 'text-[#6F6F6F]'
                      } hover:bg-[#F1F3F5] transition-colors`}
                    >
                      Rev. Tax
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Distribution Section */}
          <div className="p-6 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[#2E7D32]">✔</span>
              <h2 className="text-[15px] font-semibold text-[#2E2E2E] bg-white">Account distribution from latest invoice</h2>
            </div>
            
            <p className="text-[13px] text-[#4F4F4F] leading-relaxed mb-4">
              Previous account distribution is based on how you have bookkept the latest invoice from the supplier.
            </p>
            
            {/* Tab Control */}
            <div className="flex mb-4 border-b border-[#D9D9D9]" role="tablist">
              <button 
                className={`${activeRegistrationTab === 'account' ? 'bg-white border border-[#D9D9D9] border-b-0 text-[#2E2E2E] font-semibold px-4 py-2 text-sm z-20' : 'bg-[#E5E5E5] text-[#7A7A7A] font-medium px-4 py-2 text-sm hover:bg-[#DADADA] cursor-pointer'} transition-colors duration-150`} 
                onClick={() => setActiveRegistrationTab('account')} 
                role="tab" 
                aria-selected={activeRegistrationTab === 'account'} 
                tabIndex={activeRegistrationTab === 'account' ? 0 : -1}
              >
                Account registration
              </button>
              <button 
                className={`${activeRegistrationTab === 'item' ? 'bg-white border border-[#D9D9D9] border-b-0 text-[#2E2E2E] font-semibold px-4 py-2 text-sm z-20' : 'bg-[#E5E5E5] text-[#7A7A7A] font-medium px-4 py-2 text-sm hover:bg-[#DADADA] cursor-pointer'} transition-colors duration-150`} 
                onClick={() => setActiveRegistrationTab('item')} 
                role="tab" 
                aria-selected={activeRegistrationTab === 'item'} 
                tabIndex={activeRegistrationTab === 'item' ? 0 : -1}
              >
                Item registration
              </button>
            </div>
            
            {/* Table Container */}
            <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-x-auto">
              {activeRegistrationTab === 'account' ? (
                <table className="w-full" role="tabpanel">
                  <thead>
                    <tr className="border-b-[2px] border-[#BDBDBD]">
                      <th className="text-left text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">ACCOUNT</th>
                      <th className="text-left text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">ACCOUNT TITLE</th>
                      <th className="text-left text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">TRANSACTION INFORMATION</th>
                      <th className="text-right text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">DEBIT</th>
                      <th className="text-right text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">CREDIT</th>
                      <th className="text-center text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E0E0E0] hover:bg-[#F9FAFB] transition-colors duration-150">
                      <td className="py-3 px-2.5 text-[14px] text-[#1F1F1F]">2440</td>
                      <td className="py-3 px-2.5 text-[14px] text-[#1F1F1F]">Leverantörsskulder</td>
                      <td className="py-3 px-2.5 text-[14px] text-[#1F1F1F]"></td>
                      <td className="py-3 px-2.5 text-right text-[14px] text-[#1F1F1F]">0,00</td>
                      <td className="py-3 px-2.5 text-right text-[14px] text-[#1F1F1F]">0,00</td>
                      <td className="py-3 px-2.5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Duplicate">
                            📄
                          </button>
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Delete">
                            🗑
                          </button>
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Move" style={{cursor: 'grab'}}>
                            ⤧
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Empty row for adding new entries */}
                    <tr className="border-b border-[#E0E0E0] hover:bg-[#F9FAFB] transition-colors duration-150">
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Account"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Account title"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Transaction info"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] text-right focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Debit"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] text-right focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Credit"
                        />
                      </td>
                      <td className="py-3 px-2.5 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Duplicate">
                            📄
                          </button>
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Delete">
                            🗑
                          </button>
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Move" style={{cursor: 'grab'}}>
                            ⤧
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="w-full" role="tabpanel">
                  <thead>
                    <tr className="border-b-[2px] border-[#BDBDBD]">
                      <th className="text-left text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">ITEM NO.</th>
                      <th className="text-left text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">ITEM NAME</th>
                      <th className="text-right text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">NUMBER</th>
                      <th className="text-left text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">UNIT</th>
                      <th className="text-right text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">PRICE PER UNIT</th>
                      <th className="text-right text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">TOTAL</th>
                      <th className="text-right text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">ACCOUNT</th>
                      <th className="text-left text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">ACCOUNT TITLE</th>
                      <th className="text-center text-[13px] font-semibold text-[#2E2E2E] py-3 px-2.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E0E0E0] hover:bg-[#F9FAFB] transition-colors duration-150">
                      <td className="py-3 px-2.5 text-[14px] text-[#1F1F1F]">2440</td>
                      <td className="py-3 px-2.5 text-[14px] text-[#1F1F1F]">Accounts payable</td>
                      <td className="py-3 px-2.5 text-right text-[14px] text-[#1F1F1F]"></td>
                      <td className="py-3 px-2.5 text-[14px] text-[#1F1F1F]"></td>
                      <td className="py-3 px-2.5 text-right text-[14px] text-[#1F1F1F]"></td>
                      <td className="py-3 px-2.5 text-right text-[14px] text-[#1F1F1F]">0.00</td>
                      <td className="py-3 px-2.5 text-right text-[14px] text-[#1F1F1F]"></td>
                      <td className="py-3 px-2.5 text-[14px] text-[#1F1F1F]"></td>
                      <td className="py-3 px-2.5 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Delete">
                            🗑
                          </button>
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Move" style={{cursor: 'grab'}}>
                            ⤧
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Empty row for adding new entries */}
                    <tr className="border-b border-[#E0E0E0] hover:bg-[#F9FAFB] transition-colors duration-150">
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Item no."
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Item name"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] text-right focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Number"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Unit"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] text-right focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Price per unit"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] text-right focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Total"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] text-right focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Account"
                        />
                      </td>
                      <td className="py-3 px-2.5">
                        <input 
                          type="text" 
                          className="w-full h-8 px-2 py-1 border border-[#D9D9D9] rounded text-[14px] focus:border-[#2684FF] focus:outline-none transition-colors"
                          placeholder="Account title"
                        />
                      </td>
                      <td className="py-3 px-2.5 text-center">
                        <div className="flex justify-center items-center gap-3">
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Delete">
                            🗑
                          </button>
                          <button className="text-[#6F6F6F] hover:text-[#2E2E2E] cursor-pointer" title="Move" style={{cursor: 'grab'}}>
                            ⤧
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            
            {/* Totals Section */}
            <div className="mt-4">
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="font-semibold text-[#2E2E2E] text-[14px]">Discrepancy</div>
                  <div className="font-semibold text-[#2E2E2E] text-[14px]">0.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E6E6E6] h-[120px] flex flex-col">
          {/* Top Summary Section */}
          <div className="flex justify-end items-center h-[60px] px-8 gap-[40px] border-b border-[#E6E6E6]">
            <div className="flex flex-col items-end">
              <label className="text-[14px] font-normal text-[#6B6B6B] mb-[6px]">Invoice charge</label>
              <input 
                type="text" 
                defaultValue="0,00" 
                className="w-[220px] h-[40px] border border-[#D0D0D0] rounded-[4px] bg-white text-right px-[12px] py-[8px] text-[16px] font-medium text-black"
              />
            </div>
            <div className="flex flex-col items-end">
              <label className="text-[14px] font-normal text-[#6B6B6B] mb-[6px]">Shipping</label>
              <input 
                type="text" 
                defaultValue="0,00" 
                className="w-[220px] h-[40px] border border-[#D0D0D0] rounded-[4px] bg-white text-right px-[12px] py-[8px] text-[16px] font-medium text-black"
              />
            </div>
            <div className="flex flex-col items-end">
              <label className="text-[14px] font-normal text-[#6B6B6B] mb-[6px]">Round-off</label>
              <input 
                type="text" 
                defaultValue="0,00" 
                className="w-[220px] h-[40px] border border-[#D0D0D0] rounded-[4px] bg-white text-right px-[12px] py-[8px] text-[16px] font-medium text-black"
              />
            </div>
          </div>
          
          {/* Middle Divider */}
          <div className="h-[1px] bg-[#E6E6E6] my-[24px] mx-8"></div>
          
          {/* Bottom Action Buttons Section */}
          <div className="flex items-center justify-between px-8 h-[60px]">
            {/* Left Side Buttons */}
            <div className="flex items-center">
              <button className="h-[40px] min-w-[88px] px-[20px] bg-[#8C8C8C] text-white text-[14px] font-medium rounded-full border-none hover:bg-[#7A7A7A] transition-all duration-200">
                Void
              </button>
              <button className="h-[40px] min-w-[170px] px-[24px] bg-[#D3D3D3] text-white text-[14px] font-medium rounded-full border-none ml-[12px] opacity-50 cursor-not-allowed">
                Create Credit Note
              </button>
            </div>
            
            {/* Right Side Buttons */}
            <div className="flex items-center gap-[12px]">
              <button 
                className="h-[40px] min-w-[96px] px-[22px] bg-[#8C8C8C] text-white text-[14px] font-medium rounded-full border-none hover:bg-[#7A7A7A] transition-all duration-200"
                onClick={onGoBackToList || (() => window.history.back())}
              >
                Cancel
              </button>
              <button 
                className="h-[40px] min-w-[88px] px-[22px] bg-[#0A8F3C] text-white text-[14px] font-semibold rounded-full border-none hover:bg-[#087A33] shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    // Simulate API call to save supplier invoice
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Call the callback to go back to the list
                    if (onGoBackToList) {
                      onGoBackToList();
                    }
                  } catch (error) {
                    console.error('Error saving supplier invoice:', error);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
              <button 
                className="h-[40px] min-w-[88px] px-[22px] bg-[#0A8F3C] text-white text-[14px] font-semibold rounded-full border-none hover:bg-[#087A33] shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200"
                onClick={async () => {
                  setIsSubmitting(true);
                  try {
                    // Simulate API call to send mail
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Call the callback to go back to the list
                    if (onGoBackToList) {
                      onGoBackToList();
                    }
                  } catch (error) {
                    console.error('Error sending mail:', error);
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Mail'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierInvoiceForm;