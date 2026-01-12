import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  Plus, 
  Users, 
  FileText, 
  Search,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import EInvoiceRequests from './EInvoiceRequests';

interface CustomerFormData {
  customerNumber: string;
  customerType: 'company' | 'private';
  cinPin: string;
  active: 'yes' | 'no';
  name: string;
  phone: string;
  phone2: string;
  fax: string;
  email: string;
  webAddress: string;
  invoiceAddress: string;
  invoiceAddress2: string;
  postcode: string;
  city: string;
  country: string;
  countryCode: string;
  // Additional fields for expanded sections
  deliveryName: string;
  deliveryAddress: string;
  deliveryAddress2: string;
  deliveryPostcode: string;
  deliveryCity: string;
  deliveryCountry: string;
  deliveryCountryCode: string;
  deliveryPhone: string;
  deliveryPhone2: string;
  deliveryFax: string;
  industryCode: string;
  workplaceNumber: string;
  storeId: string;
  notes: string;
}

interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSave: (data: CustomerFormData) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  initialData = {
    customerNumber: '2',
    customerType: 'company',
    cinPin: '',
    active: 'yes',
    name: '',
    phone: '',
    phone2: '',
    fax: '',
    email: '',
    webAddress: '',
    invoiceAddress: '',
    invoiceAddress2: '',
    postcode: '',
    city: '',
    country: '',
    countryCode: '',
    // Additional fields
    deliveryName: '',
    deliveryAddress: '',
    deliveryAddress2: '',
    deliveryPostcode: '',
    deliveryCity: '',
    deliveryCountry: '',
    deliveryCountryCode: '',
    deliveryPhone: '',
    deliveryPhone2: '',
    deliveryFax: '',
    industryCode: '',
    workplaceNumber: '',
    storeId: '',
    notes: ''
  }, 
  onSave, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'invoice'>('basic');
  const [showMoreAddressDetails, setShowMoreAddressDetails] = useState(false);
  const [showMoreCustomerDetails, setShowMoreCustomerDetails] = useState(false);
  const [showEInvoiceRequests, setShowEInvoiceRequests] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>(initialData);

  const handleInputChange = (field: keyof CustomerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleRefreshCustomerNumber = () => {
    // Simulate generating a new customer number
    const newNumber = (parseInt(formData.customerNumber) + 1).toString().padStart(2, '0');
    setFormData(prev => ({ ...prev, customerNumber: newNumber }));
  };

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-4 bg-white">
      {showEInvoiceRequests ? (
        <EInvoiceRequests onClose={() => setShowEInvoiceRequests(false)} />
      ) : (
        <>
          {/* Top Header Bar */}
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-[#1A1A1A] tracking-[0.4px]">
              CUSTOMER {formData.customerNumber} – CREATE NEW
            </h1>
            
            <div className="flex items-center gap-2">
              {/* Navigation Buttons */}
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center border border-[#DADADA] rounded text-[#616161] hover:bg-[#F5F5F5]">
                  <ChevronsLeft size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-[#DADADA] rounded text-[#616161] hover:bg-[#F5F5F5]">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-[#DADADA] rounded text-[#616161] hover:bg-[#F5F5F5]">
                  <ChevronRight size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-[#DADADA] rounded text-[#616161] hover:bg-[#F5F5F5]">
                  <ChevronsRight size={16} />
                </button>
              </div>
              
              <button
        type="button"
        onClick={handleSave}
        className="
          h-9
          px-5
          ml-4
          rounded-full
          bg-[#9E9E9E]
          text-white
          text-sm
          font-semibold
          flex
          items-center
          gap-2
          hover:bg-[#8E8E8E]
          focus:outline-none
          focus:ring-2
          focus:ring-[#9E9E9E]
          focus:ring-offset-2
        "
      >
      <Plus size={14} />
      <span>Create customer</span>
    </button>

              
              <button
        type="button"
        onClick={onCancel}
        className="
          h-9
          px-5
          ml-2
          rounded-full
          bg-[#FFC107]
          text-black
          text-sm
          font-semibold
          flex
          items-center
          gap-2
          hover:bg-[#FFB300]
          focus:outline-none
          focus:ring-2
          focus:ring-[#FFC107]
          focus:ring-offset-2
        "
      >
      <span className="text-base leading-none">☰</span>
      <span>Show list</span>
    </button>

            </div>
          </div>

          {/* Secondary Action Row */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowEInvoiceRequests(true)}
                className="flex items-center gap-2 text-sm text-[#616161] hover:text-black"
              >
                <Users size={14} />
                Invite to e-invoice
              </button>
              <button className="flex items-center gap-2 text-sm text-[#616161] hover:text-black">
                <FileText size={14} />
                Credit report
              </button>
              <button className="flex items-center gap-2 text-sm text-[#616161] hover:text-black">
                <Search size={14} />
                Retrieve customer details
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-6">
            <div className="flex space-x-6 border-b border-[#DADADA]">
              <button
                onClick={() => setActiveTab('basic')}
                className={`pb-2 text-sm font-medium relative ${
                  activeTab === 'basic'
                    ? 'text-[#000000]'
                    : 'text-[#616161]'
                }`}
              >
                Basic details
                {activeTab === 'basic' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2E7D32]"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('invoice')}
                className={`pb-2 text-sm font-medium relative ${
                  activeTab === 'invoice'
                    ? 'text-[#000000]'
                    : 'text-[#616161]'
                }`}
              >
                Invoice details
                {activeTab === 'invoice' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2E7D32]"></div>
                )}
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
            {/* Row 1 */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#424242]">
                Customer number *
                <span className="text-[#D32F2F] ml-0.5">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={formData.customerNumber}
                  onChange={(e) => handleInputChange('customerNumber', e.target.value)}
                  className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
                />
                <button 
                  onClick={handleRefreshCustomerNumber}
                  className="ml-2 p-2 text-[#757575] hover:text-black"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#424242]">
                Customer types
              </label>
              <div className="flex h-9 border border-[#DADADA] rounded overflow-hidden">
                <button
                  onClick={() => handleInputChange('customerType', 'company')}
                  className={`flex-1 text-sm ${
                    formData.customerType === 'company'
                      ? 'bg-white text-[#000000] font-medium'
                      : 'bg-[#E0E0E0] text-[#616161]'
                  }`}
                >
                  Company
                </button>
                <button
                  onClick={() => handleInputChange('customerType', 'private')}
                  className={`flex-1 text-sm border-l border-[#DADADA] ${
                    formData.customerType === 'private'
                      ? 'bg-white text-[#000000] font-medium'
                      : 'bg-[#E0E0E0] text-[#616161]'
                  }`}
                >
                  Private
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#424242]">
                CIN/PIN
              </label>
              <input
                type="text"
                value={formData.cinPin}
                onChange={(e) => handleInputChange('cinPin', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#424242]">
                Active
              </label>
              <div className="flex h-9 border border-[#DADADA] rounded overflow-hidden">
                <button
                  onClick={() => handleInputChange('active', 'yes')}
                  className={`flex-1 text-sm ${
                    formData.active === 'yes'
                      ? 'bg-white text-[#000000] font-medium'
                      : 'bg-[#E0E0E0] text-[#616161]'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => handleInputChange('active', 'no')}
                  className={`flex-1 text-sm border-l border-[#DADADA] ${
                    formData.active === 'no'
                      ? 'bg-white text-[#000000] font-medium'
                      : 'bg-[#E0E0E0] text-[#616161]'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Row 2 */}
            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                Name *
                <span className="text-[#D32F2F] ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            {/* Row 3 */}
            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                Invoice address
              </label>
              <input
                type="text"
                value={formData.invoiceAddress}
                onChange={(e) => handleInputChange('invoiceAddress', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                Phone 2
              </label>
              <input
                type="text"
                value={formData.phone2}
                onChange={(e) => handleInputChange('phone2', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            {/* Row 4 */}
            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                Invoice address 2
              </label>
              <input
                type="text"
                value={formData.invoiceAddress2}
                onChange={(e) => handleInputChange('invoiceAddress2', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                Fax
              </label>
              <input
                type="text"
                value={formData.fax}
                onChange={(e) => handleInputChange('fax', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            {/* Row 5 */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#424242]">
                Postcode
              </label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#424242]">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            {/* Row 6 */}
            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-[#424242]">
                Country code
              </label>
              <input
                type="text"
                value={formData.countryCode}
                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>

            <div className="space-y-1 lg:col-span-2">
              <label className="block text-xs font-medium text-[#424242]">
                Web address
              </label>
              <input
                type="text"
                value={formData.webAddress}
                onChange={(e) => handleInputChange('webAddress', e.target.value)}
                className="w-full h-9 px-2.5 border border-[#DADADA] rounded text-sm text-[#1A1A1A] bg-white focus:outline-none focus:ring-1 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          {/* More Address Details Section */}
          <div className="mt-6 border-t border-[#E5E7EB] pt-6">
            <button
              onClick={() => setShowMoreAddressDetails(!showMoreAddressDetails)}
              className="flex items-center gap-2 text-sm font-semibold text-[#374151] mb-4"
            >
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${showMoreAddressDetails ? 'rotate-180 text-[#0F9D58]' : 'text-[#0F9D58]'}`}
              />
              More address details
            </button>

            {showMoreAddressDetails && (
              <div className="mb-6">
                <div className="mb-4">
                  <label className="block text-xs font-medium text-[#374151] mb-1">
                    Delivery address
                  </label>
                  <select className="w-[220px] h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs bg-white text-[#111827] focus:outline-none focus:ring-1 focus:ring-[#2563EB]">
                    <option>Delivery address</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  {/* Left Column - Address Fields */}
                  <div>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryName}
                        onChange={(e) => handleInputChange('deliveryName', e.target.value)}
                        className="w-full h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Delivery address
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryAddress}
                        onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                        className="w-full h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Delivery address 2
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryAddress2}
                        onChange={(e) => handleInputChange('deliveryAddress2', e.target.value)}
                        className="w-full h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryPostcode}
                        onChange={(e) => handleInputChange('deliveryPostcode', e.target.value)}
                        className="w-[120px] h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryCountry}
                        onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
                        className="w-full h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>
                  
                  {/* Right Column - Contact Fields */}
                  <div>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryPhone}
                        onChange={(e) => handleInputChange('deliveryPhone', e.target.value)}
                        className="w-full h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Phone 2
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryPhone2}
                        onChange={(e) => handleInputChange('deliveryPhone2', e.target.value)}
                        className="w-full h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Fax
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryFax}
                        onChange={(e) => handleInputChange('deliveryFax', e.target.value)}
                        className="w-full h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryCity}
                        onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                        className="w-full h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-[#374151] mb-1">
                        Country code
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryCountryCode}
                        onChange={(e) => handleInputChange('deliveryCountryCode', e.target.value)}
                        className="w-[120px] h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* More Customer Details Section */}
          <div className="border-t border-[#E5E7EB] pt-6">
            <button
              onClick={() => setShowMoreCustomerDetails(!showMoreCustomerDetails)}
              className="flex items-center gap-2 text-sm font-semibold text-[#374151] mb-4"
            >
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${showMoreCustomerDetails ? 'rotate-180 text-[#0F9D58]' : 'text-[#0F9D58]'}`}
              />
              More customer details
            </button>

            {showMoreCustomerDetails && (
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">
                      Industry code (SNI)
                    </label>
                    <input
                      type="text"
                      value={formData.industryCode}
                      onChange={(e) => handleInputChange('industryCode', e.target.value)}
                      className="w-[240px] h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">
                      Place of work no. (CFAR)
                    </label>
                    <input
                      type="text"
                      value={formData.workplaceNumber}
                      onChange={(e) => handleInputChange('workplaceNumber', e.target.value)}
                      className="w-[240px] h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1">
                      Shop ID
                    </label>
                    <input
                      type="text"
                      value={formData.storeId}
                      onChange={(e) => handleInputChange('storeId', e.target.value)}
                      className="w-[240px] h-8 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-[#374151] mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={6}
                    className="w-full h-24 px-2 py-1 border border-[#D1D5DB] rounded text-xs text-[#111827] bg-white focus:outline-none focus:ring-1 focus:ring-[#2563EB] resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] px-6 py-4 flex items-center justify-between mt-6">
            <button className="h-8 px-4 bg-[#D1D5DB] text-white text-xs rounded-full font-medium">
              Delete
            </button>
            <div className="flex items-center gap-2">
              <button 
                className="h-8 bg-[#9CA3AF] text-white px-4 rounded-full text-xs font-medium"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button 
                className="h-8 bg-[#0F9D58] text-white px-4 rounded-full text-xs font-bold hover:bg-[#0B7A43]"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerForm;