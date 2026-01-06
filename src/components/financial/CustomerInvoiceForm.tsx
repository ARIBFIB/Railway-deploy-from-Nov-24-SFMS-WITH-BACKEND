import React, { useState } from 'react';
import { Plus, List, FileText, Wallet, Copy, Check, Lock, MessageCircle, Printer, ChevronDown, ChevronRight, Calendar, Image } from 'lucide-react';

interface CustomerInvoiceFormProps {
  onCancel: () => void;
  onSave: (invoiceData: any) => void;
}

export const CustomerInvoiceForm: React.FC<CustomerInvoiceFormProps> = ({ onCancel, onSave }) => {
  const [invoiceDetailsExpanded, setInvoiceDetailsExpanded] = useState(false);
  const [customerDetailsExpanded, setCustomerDetailsExpanded] = useState(false);
  const [deliveryInfoExpanded, setDeliveryInfoExpanded] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    customer: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    invoiceType: 'invoice',
    creditNote: 'no',
    paymentTerms: '30 dagar',
    ourReference: 'test test',
    priceList: 'Prislista A',
    pricesInclVat: 'yes',
    yourOrderNumber: '',
    yourReference: '',
    currency: 'SEK',
    rate: '1.0000',
    unit: '1',
    typeOfVat: '',
    name: '',
    invoiceAddress: '',
    postcode: '',
    city: '',
    cin: '',
    invoiceAddress2: '',
    country: '',
    phone: '',
    email: '',
    emailForReminders: '',
    deliveryName: '',
    deliveryAddress: '',
    deliveryPostcode: '',
    deliveryCity: '',
    deliveryMethod: '',
    deliveryDate: '',
    deliveryAddress2: '',
    deliveryCountry: '',
    deliveryTerms: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(invoiceData);
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      {/* Top Navigation */}
      {/* <div className="bg-white border-b border-[#E0E0E0]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center h-12">
            {[
              { value: 'customer invoices', label: 'Customer invoices' },
              { value: 'payments in', label: 'Payments in' },
              { value: 'reminders', label: 'Reminders' },
              { value: 'recurrent', label: 'Recurrent' },
              { value: 'invoice services', label: 'Invoice services' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`h-12 px-4 text-sm font-medium ${
                  activeTab === tab.value
                    ? 'text-[#1A1A1A] border-b-2 border-[#2E7D32]'
                    : 'text-[#4A4A4A] hover:text-[#000000]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="max-w-[1280px] mx-auto px-6 flex justify-between items-center h-12">
          <div className="text-sm text-[#4A4A4A]">Reports | Register ▼</div>
        </div>
      </div> */}

      <div className="max-w-[1280px] mx-auto p-6">
        {/* Invoice Header Bar */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold text-[#1A1A1A]">CUSTOMER INVOICE 1*</h1>
              <div className="flex gap-4 mt-2 text-xs text-[#757575]">
                <span>OCR: 133*</span>
                <span>VER.NR: B1*</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-[#8E8E8E] text-white rounded-full h-9 px-4 flex items-center gap-2 text-sm">
                <Plus size={16} />
                Create Invoice
              </button>
              <button 
                onClick={onCancel}
                className="bg-[#FFC107] text-black rounded-full h-9 px-4 flex items-center gap-2 text-sm hover:bg-[#FFB300]"
              >
                <List size={16} />
                Show List
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Action Toolbar */}
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex gap-6">
            {[
              { icon: FileText, label: 'Create credit note', disabled: true },
              { icon: Wallet, label: 'Payments in', disabled: true },
              { icon: Copy, label: 'Copy', disabled: true },
              { icon: Check, label: 'Credit report', disabled: false },
              { icon: Lock, label: 'Mark as not complete', disabled: false },
              { icon: MessageCircle, label: 'Comment', disabled: false },
              { icon: Printer, label: 'Preview', disabled: false },
            ].map((action, index) => (
              <button
                key={index}
                className={`flex flex-col items-center gap-1 ${
                  action.disabled ? 'text-[#BDBDBD]' : 'text-[#4A4A4A] hover:text-[#000000]'
                }`}
                disabled={action.disabled}
              >
                <action.icon size={18} />
                <span className="text-xs">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Form – Header Fields */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Customer *</label>
                <input
                  type="text"
                  placeholder="Customer no., Name, CIN/PIN"
                  className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                  value={invoiceData.customer}
                  onChange={(e) => handleInputChange('customer', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Invoice date *</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full h-9 border border-[#DADADA] rounded text-sm px-3 pl-10"
                    value={invoiceData.invoiceDate}
                    onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E]" size={14} />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Due date *</label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full h-9 border border-[#DADADA] rounded text-sm px-3 pl-10"
                    value={invoiceData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E]" size={14} />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Invoice type</label>
                <div className="flex border border-[#DADADA] rounded">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm ${
                      invoiceData.invoiceType === 'invoice' 
                        ? 'bg-[#E0E0E0] text-[#1A1A1A]' 
                        : 'text-[#757575]'
                    }`}
                    onClick={() => handleInputChange('invoiceType', 'invoice')}
                  >
                    Invoice
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm ${
                      invoiceData.invoiceType === 'cash invoice' 
                        ? 'bg-[#E0E0E0] text-[#1A1A1A]' 
                        : 'text-[#757575]'
                    }`}
                    onClick={() => handleInputChange('invoiceType', 'cash invoice')}
                  >
                    Cash invoice
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Credit note</label>
                <div className="flex border border-[#DADADA] rounded">
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm ${
                      invoiceData.creditNote === 'yes' 
                        ? 'bg-[#E0E0E0] text-[#1A1A1A]' 
                        : 'bg-[#F5F5F5] text-[#757575]'
                    }`}
                    onClick={() => handleInputChange('creditNote', 'yes')}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm ${
                      invoiceData.creditNote === 'no' 
                        ? 'bg-[#E0E0E0] text-[#1A1A1A]' 
                        : 'bg-[#F5F5F5] text-[#757575]'
                    }`}
                    onClick={() => handleInputChange('creditNote', 'no')}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Section – Invoice Details */}
          <div className="bg-white rounded-lg mb-6">
            <div 
              className="flex items-center justify-between p-4 border-b border-[#E0E0E0] cursor-pointer"
              onClick={() => setInvoiceDetailsExpanded(!invoiceDetailsExpanded)}
            >
              <div className="flex items-center">
                {invoiceDetailsExpanded ? (
                  <ChevronDown 
                    className="text-[#2E7D32]" 
                    size={16} 
                  />
                ) : (
                  <ChevronRight 
                    className="text-[#2E7D32]" 
                    size={16} 
                  />
                )}
                <span className="text-sm font-semibold text-[#1A1A1A] ml-2">Invoice details</span>
              </div>
            </div>
            
            {invoiceDetailsExpanded && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Payment terms *</label>
                  <select
                    className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                    value={invoiceData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  >
                    <option>30 dagar</option>
                    <option>14 dagar</option>
                    <option>Netto</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Our reference</label>
                  <input
                    type="text"
                    className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                    value={invoiceData.ourReference}
                    onChange={(e) => handleInputChange('ourReference', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Price list</label>
                  <select
                    className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                    value={invoiceData.priceList}
                    onChange={(e) => handleInputChange('priceList', e.target.value)}
                  >
                    <option>Prislista A</option>
                    <option>Prislista B</option>
                    <option>Prislista C</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Prices incl. VAT</label>
                  <div className="flex border border-[#DADADA] rounded">
                    <button
                      type="button"
                      className={`flex-1 py-2 text-sm ${
                        invoiceData.pricesInclVat === 'yes' 
                          ? 'bg-[#E0E0E0] text-[#1A1A1A]' 
                          : 'bg-[#F5F5F5] text-[#757575]'
                      }`}
                      onClick={() => handleInputChange('pricesInclVat', 'yes')}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={`flex-1 py-2 text-sm ${
                        invoiceData.pricesInclVat === 'no' 
                          ? 'bg-[#E0E0E0] text-[#1A1A1A]' 
                          : 'bg-[#F5F5F5] text-[#757575]'
                      }`}
                      onClick={() => handleInputChange('pricesInclVat', 'no')}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Your order number</label>
                  <input
                    type="text"
                    className="w-full h-9 border border-[#A5D6A7] bg-[#F1F8F4] rounded text-sm px-3"
                    value={invoiceData.yourOrderNumber}
                    onChange={(e) => handleInputChange('yourOrderNumber', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Your reference</label>
                  <input
                    type="text"
                    placeholder="First name, Last name"
                    className="w-full h-9 border border-[#DADADA] rounded text-sm px-3 text-[#9E9E9E]"
                    value={invoiceData.yourReference}
                    onChange={(e) => handleInputChange('yourReference', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Currency</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Rate</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.rate}
                      onChange={(e) => handleInputChange('rate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Unit</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1 flex items-center">
                    Type of VAT
                    <InfoIcon className="ml-1 text-[#1976D2]" />
                  </label>
                  <select
                    className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                    value={invoiceData.typeOfVat}
                    onChange={(e) => handleInputChange('typeOfVat', e.target.value)}
                  >
                    <option>Select VAT</option>
                    <option>25%</option>
                    <option>12%</option>
                    <option>6%</option>
                  </select>
                </div>
              </div>
            </div>
            )}
          </div>

          {/* Customer Details Collapsible Section */}
          <div className="bg-white rounded-lg mb-6">
            <div 
              className="flex items-center justify-between p-4 border-b border-[#E0E0E0] cursor-pointer"
              onClick={() => setCustomerDetailsExpanded(!customerDetailsExpanded)}
            >
              <div className="flex items-center">
                {customerDetailsExpanded ? (
                  <ChevronDown 
                    className="text-[#2E7D32]" 
                    size={16} 
                  />
                ) : (
                  <ChevronRight 
                    className="text-[#2E7D32]" 
                    size={16} 
                  />
                )}
                <span className="text-sm font-semibold text-[#1A1A1A] ml-2">Customer details</span>
              </div>
            </div>
            
            {customerDetailsExpanded && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Invoice address</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.invoiceAddress}
                      onChange={(e) => handleInputChange('invoiceAddress', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Postcode</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.postcode}
                      onChange={(e) => handleInputChange('postcode', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">City</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">CIN</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.cin}
                      onChange={(e) => handleInputChange('cin', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Invoice address 2</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.invoiceAddress2}
                      onChange={(e) => handleInputChange('invoiceAddress2', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Country</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Phone</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-start-4">
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">E-mail</label>
                    <input
                      type="email"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-start-4">
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">E-mail for reminders</label>
                    <input
                      type="email"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.emailForReminders}
                      onChange={(e) => handleInputChange('emailForReminders', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Information Collapsible Section */}
          <div className="bg-white rounded-lg mb-6">
            <div 
              className="flex items-center justify-between p-4 border-b border-[#E0E0E0] cursor-pointer"
              onClick={() => setDeliveryInfoExpanded(!deliveryInfoExpanded)}
            >
              <div className="flex items-center">
                {deliveryInfoExpanded ? (
                  <ChevronDown 
                    className="text-[#2E7D32]" 
                    size={16} 
                  />
                ) : (
                  <ChevronRight 
                    className="text-[#2E7D32]" 
                    size={16} 
                  />
                )}
                <span className="text-sm font-semibold text-[#1A1A1A] ml-2">Delivery information</span>
              </div>
            </div>
            
            {deliveryInfoExpanded && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryName}
                      onChange={(e) => handleInputChange('deliveryName', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Delivery address</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryAddress}
                      onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Postcode</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryPostcode}
                      onChange={(e) => handleInputChange('deliveryPostcode', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">City</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryCity}
                      onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Delivery method</label>
                    <select
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryMethod}
                      onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                    >
                      <option>Select method</option>
                      <option>Post</option>
                      <option>Email</option>
                      <option>Delivery</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Delivery date</label>
                    <input
                      type="date"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Delivery address 2</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryAddress2}
                      onChange={(e) => handleInputChange('deliveryAddress2', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Country</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryCountry}
                      onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Delivery terms</label>
                    <select
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryTerms}
                      onChange={(e) => handleInputChange('deliveryTerms', e.target.value)}
                    >
                      <option>Select terms</option>
                      <option>FOB</option>
                      <option>CIF</option>
                      <option>EXW</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Item Table */}
          <div className="bg-white rounded-lg mb-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-white border-b-2 border-[#BDBDBD]">
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Item no.</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Quantity</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Unit</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-right">Price per unit</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-right">Discount</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-right">Total</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">VAT</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">Account</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-left">CMR %</th>
                    <th className="px-4 py-3 text-xs font-semibold text-[#333333] uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#E6E6E6] h-11">
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E] text-right"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E] text-right"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E] text-right"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E]"></td>
                    <td className="px-4 py-2.5 text-sm text-[#2E2E2E] text-center">
                      <div className="flex justify-center gap-2">
                        <span className="text-[#555555]">⋯</span>
                        <span className="text-[#555555]">🗑</span>
                        <span className="text-[#555555]">⇅</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-white border-t border-[#E0E0E0]">
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm font-medium text-[#333333]">0,00</div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Footer & Summary Section */}
          <div className="bg-white rounded-lg p-6 border-t border-[#E6E6E6] mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Zone - Invoice Text */}
              <div>
                <label className="block text-xs font-medium text-[#4A4A4A] mb-2">Invoice text</label>
                <textarea
                  className="w-full h-24 border border-[#D9D9D9] rounded text-sm px-3 py-2 text-[#333333] bg-white"
                  placeholder="Enter invoice notes..."
                />
              </div>
              
              {/* Center Zone - Invoice Controls */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Shipping</label>
                    <input
                      type="number"
                      className="w-full h-9 border border-[#D9D9D9] rounded text-sm px-3 text-right"
                      defaultValue="0,00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Invoice</label>
                    <input
                      type="number"
                      className="w-full h-9 border border-[#D9D9D9] rounded text-sm px-3 text-right"
                      defaultValue="0,00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Invoice discount (%)</label>
                  <input
                    type="number"
                    className="w-full h-9 border border-[#D9D9D9] rounded text-sm px-3"
                    placeholder=""
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Printout template</label>
                  <select
                    className="w-full h-9 border border-[#D9D9D9] rounded text-sm px-3"
                  >
                    <option>Standardmall</option>
                    <option>Custom Template</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Language</label>
                  <select
                    className="w-full h-9 border border-[#D9D9D9] rounded text-sm px-3"
                  >
                    <option>Swedish</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
              
              {/* Right Zone - Totals Summary */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-[#666666]">Net</span>
                  <span className="text-sm font-medium text-[#333333]">0,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#666666]">Gross</span>
                  <span className="text-sm font-medium text-[#333333]">0,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#666666]">Total excl. VAT</span>
                  <span className="text-sm font-medium text-[#333333]">0,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#666666]">Round-off</span>
                  <span className="text-sm font-medium text-[#333333]">0,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#666666]">VAT</span>
                  <span className="text-sm font-medium text-[#333333]">0,00</span>
                </div>
                <div className="border-t border-[#E0E0E0] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-[#666666]">To pay</span>
                    <span className="text-lg font-bold text-[#F57C00]">0,00 SEK</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom Action Bar */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#E0E0E0]">
              <div className="flex gap-3">
                <button className="bg-[#D0D0D0] text-white rounded-full px-4 py-2 text-sm cursor-not-allowed" disabled>
                  Void
                </button>
                <button className="bg-[#D0D0D0] text-white rounded-full px-4 py-2 text-sm cursor-not-allowed" disabled>
                  Create Credit Note
                </button>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={onCancel}
                  className="bg-[#8E8E8E] text-white rounded-full px-6 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button className="bg-[#0B8043] text-white rounded-full px-6 py-2.5 text-sm">
                  Save
                </button>
                
                <div className="relative">
                  <select className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer">
                    <option>Post & send</option>
                    <option>Post only</option>
                    <option>Send only</option>
                  </select>
                  <button className="bg-[#007A33] text-white rounded-full px-6 py-2.5 text-sm flex items-center relative z-10">
                    Post & send
                    <ChevronDown size={16} className="ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Attachment Button */}
          <div className="fixed right-6 bottom-6">
            <button className="bg-[#FFC107] w-12 h-12 rounded flex items-center justify-center">
              <Image size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper component for info icon
const InfoIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" width="14" height="14">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );
};