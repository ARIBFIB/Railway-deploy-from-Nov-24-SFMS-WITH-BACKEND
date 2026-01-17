import React, { useState, useEffect } from 'react';
import { Plus, Menu, FileText, Copy, DollarSign, X, Check, MessageCircle, ChevronDown } from 'lucide-react';
import { supplierService, type Supplier } from '../../services/supplierService';

interface SupplierFormProps {
  onGoBackToList?: () => void;
}

interface SupplierFormProps {
  onGoBackToList?: () => void;
  supplierId?: string;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onGoBackToList, supplierId }) => {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'accounting'>('basic');

  // Form state
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierNumber: '',
    cinPin: '',
    address: '',
    address2: '',
    postcode: '',
    city: '',
    country: '',
    countryCode: '',
    phone: '',
    phone2: '',
    fax: '',
    email: '',
    website: '',
    contactPerson: '',
    ourReference: '',
    termsOfPayment: '',
    creditLimit: '',
    currency: 'SEK',
    bankDetails: '',
    orgNumber: '',
    vatNumber: '',
    // Payment Information fields
    bankGiro: '',
    plusgiro: '',
    bic: '',
    iban: '',
    accountType: 'Bank account', // 'Bank account' or 'Nordea personal account'
    bank: '',
    clearingNo: '',
    accountNo: '',
    chargeCode: 'Sender pays', // 'Sender pays', 'Shared cost*', 'The recipient pays'
    disablePaymentFile: 'No', // 'Yes' or 'No'
    // Visiting Address fields
    visitingAddress: '',
    visitingPostcode: '',
    visitingCity: '',
    visitingCountry: '',
    visitingCountryCode: '',
    notes: '',
    supplierReference: '',
    // Accounting Details fields
    defaultOffsetAccount: '',
    codingTemplate: '',
    itemRegistration: false,
    roundingEnabled: true, // Default to ON
    vatType: '',
    paymentTerms: '',
    ourCustomerNumber: '',
    placeOfWork: '',
    industryCode: ''
  });

  // Load supplier data when editing
  useEffect(() => {
    const loadSupplierData = async () => {
      if (supplierId) {
        try {
          const supplier = await supplierService.getById(supplierId);
          setFormData({
            supplierName: supplier.supplier_name || '',
            supplierNumber: supplier.supplier_number || '',
            cinPin: supplier.corporate_personal_id || '',
            address: supplier.address || '',
            address2: supplier.address2 || '',
            postcode: supplier.postcode || '',
            city: supplier.city || '',
            country: supplier.country || '',
            countryCode: supplier.countryCode || '',
            phone: supplier.phone || '',
            phone2: supplier.phone2 || '',
            fax: supplier.fax || '',
            email: supplier.email || '',
            // Set default values for other fields not in the supplier object
            website: '',
            contactPerson: '',
            ourReference: '',
            termsOfPayment: '',
            creditLimit: '',
            currency: 'SEK',
            bankDetails: '',
            orgNumber: '',
            vatNumber: '',
            // Payment Information fields
            bankGiro: '',
            plusgiro: '',
            bic: '',
            iban: '',
            accountType: 'Bank account',
            bank: '',
            clearingNo: '',
            accountNo: '',
            chargeCode: 'Sender pays',
            disablePaymentFile: 'No',
            // Visiting Address fields
            visitingAddress: '',
            visitingPostcode: '',
            visitingCity: '',
            visitingCountry: '',
            visitingCountryCode: '',
            notes: supplier.notes || '',
            supplierReference: '',
            // Accounting Details fields
            defaultOffsetAccount: '',
            codingTemplate: '',
            itemRegistration: false,
            roundingEnabled: true,
            vatType: '',
            paymentTerms: '',
            ourCustomerNumber: '',
            placeOfWork: '',
            industryCode: supplier.industry_code || ''
          });
          
          // Update the title to show 'EDIT'
          const titleElement = document.querySelector('h1.text-[14px]');
          if (titleElement) {
            titleElement.textContent = 'SUPPLIER 2 - EDIT';
          }
        } catch (error) {
          console.error('Error loading supplier data:', error);
          alert('Error loading supplier data: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      } else {
        // Set title to 'CREATE NEW' when creating
        const titleElement = document.querySelector('h1.text-[14px]');
        if (titleElement) {
          titleElement.textContent = 'SUPPLIER 2 - CREATE NEW';
        }
      }
    };

    loadSupplierData();
  }, [supplierId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountTypeChange = (type: string) => {
    setFormData(prev => ({
      ...prev,
      accountType: type
    }));
  };

  const handleChargeCodeChange = (code: string) => {
    setFormData(prev => ({
      ...prev,
      chargeCode: code
    }));
  };

  const handleDisablePaymentFileChange = (option: string) => {
    setFormData(prev => ({
      ...prev,
      disablePaymentFile: option
    }));
  };

  const handleSave = async () => {
    try {
      // Get foundation ID from user context (same as customers)
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundationId = userData.foundationId || userData.foundation_id || '00000000-0000-0000-0000-000000000000';
      

      // Prepare supplier data from form - only sending known existing columns
      const supplierData = {
        foundation_id: foundationId, // Use the actual foundation ID from user context
        supplier_number: formData.supplierNumber || 'SUP-' + Date.now().toString(), // Using a generated number if not provided
        supplier_name: formData.supplierName,
        corporate_personal_id: formData.cinPin,
        status: 'active', // Default status
        industry_code: formData.industryCode,
        notes: formData.notes,
        // Contact information
        email: formData.email,
        phone: formData.phone,
        phone2: formData.phone2,
        fax: formData.fax,
        // Address information
        address: formData.address,
        address2: formData.address2,
        postcode: formData.postcode,
        city: formData.city,
        country: formData.country,
        countryCode: formData.countryCode,
      };
      
      // Log the data being sent for debugging
      console.log('Sending supplier data:', supplierData);
      
      // If we have an ID, we're updating, otherwise creating new
      if (supplierId) {
        await supplierService.update(supplierId, supplierData as any);
      } else {
        await supplierService.create(supplierData as any);
      }
      
      // Optionally show a success message
      alert('Supplier saved successfully!');
      
      // Navigate back to list if onGoBackToList is provided
      if (onGoBackToList) {
        onGoBackToList();
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Error saving supplier: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white">
        {/* Top Header Bar */}
        <div className="h-[56px] flex items-center justify-between px-4 border-b border-[#E6E6E6]">
          <h1 className="text-[14px] font-semibold text-[#333333] tracking-[0.4px] uppercase">
            SUPPLIER 2 - CREATE NEW
          </h1>
          <div className="flex items-center gap-1">
            <div className="flex items-center border border-[#D0D0D0] rounded-[2px] p-1">
              <button className="w-8 h-8 flex items-center justify-center text-[#6F6F6F]">
                ⏮
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#6F6F6F]">
                ◀
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#6F6F6F]">
                ▶
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-[#6F6F6F]">
                ⏭
              </button>
            </div>
            <button 
              className="h-8 px-3.5 bg-[#7A7A7A] text-white text-[13px] font-semibold rounded-full flex items-center ml-1"
            >
              <Plus size={12} className="mr-2" />
              Create supplier
            </button>
            <button 
              className="h-8 px-3.5 bg-[#FFC107] text-black text-[13px] font-semibold rounded-full flex items-center ml-1"
              onClick={onGoBackToList || (() => window.history.back())}
            >
              <Menu size={12} className="mr-2" />
              Show list
            </button>
          </div>
        </div>

        {/* Secondary Action Bar */}
        <div className="h-10 flex items-center justify-end px-4 border-b border-[#EFEFEF] gap-6">
          <button className="flex items-center text-[12px] text-[#4F4F4F]">
            🔄 Reset fields
          </button>
          <button className="flex items-center text-[12px] text-[#4F4F4F]">
            🔁 E-invoice
          </button>
          <button className="flex items-center text-[12px] text-[#4F4F4F]">
            ✔ Credit report
          </button>
          <button className="flex items-center text-[12px] text-[#4F4F4F]">
            🔍 Retrieve supplier details
          </button>
        </div>

        {/* Tabs Section */}
        <div className="h-10 flex items-end px-4 gap-6 border-b border-[#D0D0D0]">
          <div 
            className={`text-[13px] font-medium pb-2 cursor-pointer ${activeTab === 'basic' ? 'text-[#000000] border-b-2 border-[#0A8F3C]' : 'text-[#6F6F6F]'}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic details
          </div>
          <div 
            className={`text-[13px] font-medium pb-2 cursor-pointer ${activeTab === 'accounting' ? 'text-[#000000] border-b-2 border-[#0A8F3C]' : 'text-[#6F6F6F]'}`}
            onClick={() => setActiveTab('accounting')}
          >
            Accounting details
          </div>
        </div>
        
        {/* Form Section */}
        {activeTab === 'basic' ? (
          <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
            {/* Row 1 */}
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Supplier number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="supplierNumber"
                  placeholder="Enter supplier number"
                  value={formData.supplierNumber}
                  onChange={handleInputChange}
                  className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#9E9E9E]">
                  ↻
                </button>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                CIN/PIN
              </label>
              <input
                type="text"
                name="cinPin"
                value={formData.cinPin}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1 flex items-end">
              <div className="h-8 flex items-center border border-[#D0D0D0] rounded-[2px] overflow-hidden">
                <button className="h-full px-3 text-[12px] bg-white text-[#000000] border-r border-[#D0D0D0]">
                  Yes
                </button>
                <button className="h-full px-3 text-[12px] bg-[#E0E0E0] text-[#000000]">
                  No
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mt-3">
            {/* Row 2 */}
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Supplier name *
              </label>
              <input
                type="text"
                name="supplierName"
                placeholder="Enter supplier name"
                value={formData.supplierName}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mt-3">
            {/* Row 3 */}
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Invoice address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Street address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Phone 2
              </label>
              <input
                type="text"
                name="phone2"
                value={formData.phone2}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Web address
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mt-3">
            {/* Row 4 */}
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Invoice address 2
              </label>
              <input
                type="text"
                name="address2"
                placeholder="Apartment, suite, etc."
                value={formData.address2}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Fax
              </label>
              <input
                type="text"
                name="fax"
                value={formData.fax}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              {/* Empty column */}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mt-3">
            {/* Row 5 */}
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Postcode
              </label>
              <input
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                className="w-30 h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              {/* Empty column */}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3 mt-3">
            {/* Row 6 */}
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              <label className="block text-[12px] font-medium text-[#4F4F4F] mb-1">
                Country code
              </label>
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="w-30 h-8 px-2 border border-[#D0D0D0] rounded-[2px] bg-white text-[#000000] text-[13px] focus:border-[#0A8F3C] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-1">
              {/* Empty column */}
            </div>
          </div>
          </div>
        ) : (
          /* Accounting Details Tab */
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Accounting Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Accounting</h3>
                
                <div className="space-y-4">
                  {/* Default Offset Account */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Default offset account</label>
                    <div className="relative">
                      <select
                        name="defaultOffsetAccount"
                        value={formData.defaultOffsetAccount || ''}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none appearance-none"
                      >
                        <option value="">Account, Title</option>
                        <option value="1000">1000 - Cash</option>
                        <option value="1500">1500 - Accounts Receivable</option>
                        <option value="2000">2000 - Accounts Payable</option>
                        <option value="4000">4000 - Sales Revenue</option>
                        <option value="5000">5000 - Cost of Goods Sold</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#9CA3AF]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Coding Template */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Coding template</label>
                    <input
                      type="text"
                      name="codingTemplate"
                      placeholder="Code, Title"
                      value={formData.codingTemplate || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                  
                  {/* Item Registration (e-invoice) */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[13px] font-medium text-[#374151] mb-1">Item registration (e-invoice)</label>
                      <p className="text-[12px] text-[#6B7280]">Enables item-level registration for electronic invoices</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        name="itemRegistration"
                        checked={formData.itemRegistration}
                        onChange={(e) => setFormData(prev => ({ ...prev, itemRegistration: e.target.checked }))}
                        className="sr-only"
                      />
                      <div 
                        className={`block w-12 h-6 rounded-full transition-colors ${formData.itemRegistration ? 'bg-[#15803D]' : 'bg-[#9CA3AF]'}`}
                      ></div>
                      <div 
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.itemRegistration ? 'transform translate-x-6' : ''}`}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Rounding Down/Up (e-invoice) */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-[13px] font-medium text-[#374151] mb-1">Rounding down/up (e-invoice)</label>
                      <p className="text-[12px] text-[#6B7280]">Controls automatic rounding behavior for invoice totals</p>
                    </div>
                    <div className="relative inline-block w-12 h-6">
                      <input
                        type="checkbox"
                        name="roundingEnabled"
                        checked={formData.roundingEnabled}
                        onChange={(e) => setFormData(prev => ({ ...prev, roundingEnabled: e.target.checked }))}
                        className="sr-only"
                      />
                      <div 
                        className={`block w-12 h-6 rounded-full transition-colors ${formData.roundingEnabled ? 'bg-[#15803D]' : 'bg-[#9CA3AF]'}`}
                      ></div>
                      <div 
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.roundingEnabled ? 'transform translate-x-6' : ''}`}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Type of VAT */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Type of VAT</label>
                    <div className="relative">
                      <select
                        name="vatType"
                        value={formData.vatType || ''}
                        onChange={handleInputChange}
                        className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none appearance-none"
                      >
                        <option value="">Select VAT type</option>
                        <option value="standard">Standard VAT</option>
                        <option value="reduced">Reduced VAT (6%)</option>
                        <option value="zero">Zero VAT</option>
                        <option value="exempt">VAT Exempt</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#9CA3AF]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Other Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-[#1F2937] mb-4">Other information</h3>
                
                <div className="space-y-4">
                  {/* VAT Number */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">VAT number</label>
                    <input
                      type="text"
                      name="vatNumber"
                      placeholder=""
                      value={formData.vatNumber}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                  
                  {/* Currency */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Currency</label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none appearance-none"
                    >
                      <option value="SEK">SEK</option>
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                      <option value="NOK">NOK</option>
                      <option value="DKK">DKK</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#9CA3AF]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Payment Terms */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Payment terms</label>
                    <select
                      name="paymentTerms"
                      value={formData.paymentTerms || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none appearance-none"
                    >
                      <option value="">Select payment terms</option>
                      <option value="net15">Net 15 days</option>
                      <option value="net30">Net 30 days</option>
                      <option value="net45">Net 45 days</option>
                      <option value="net60">Net 60 days</option>
                      <option value="cod">Cash on Delivery</option>
                      <option value="due_date">Due on receipt</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#9CA3AF]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Our Customer Number */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Our customer number</label>
                    <input
                      type="text"
                      name="ourCustomerNumber"
                      placeholder=""
                      value={formData.ourCustomerNumber || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                  
                  {/* Place of Work (CFAR) */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Place of work (CFAR)</label>
                    <input
                      type="text"
                      name="placeOfWork"
                      placeholder=""
                      value={formData.placeOfWork || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                  
                  {/* Industry Code (SNI) */}
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Industry code (SNI)</label>
                    <input
                      type="text"
                      name="industryCode"
                      placeholder=""
                      value={formData.industryCode || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 border border-[#D1D5DB] rounded-[4px] bg-white text-[#1F2937] text-[14px] focus:border-[#16A34A] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Payment Information Section */}
          <div className="p-6 bg-white border-b border-[#E5E7EB]">
            <h2 className="text-[16px] font-semibold text-[#111827] mb-3">Payment information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
              {/* Row 1 */}
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Bank transfer</label>
                <input
                  type="text"
                  name="bankGiro"
                  value={formData.bankGiro}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="Enter bank giro"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Plusgiro</label>
                <input
                  type="text"
                  name="plusgiro"
                  value={formData.plusgiro}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="Enter plusgiro"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">BIC</label>
                <input
                  type="text"
                  name="bic"
                  value={formData.bic}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="Enter BIC"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">IBAN</label>
                <input
                  type="text"
                  name="iban"
                  value={formData.iban}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="Enter IBAN"
                />
              </div>
              
              {/* Row 2 - Account type spans 2 columns */}
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Account type</label>
                <div className="flex gap-2">
                  <button 
                    type="button"
                    className={`h-8 px-3 text-[13px] ${formData.accountType === 'Bank account' ? 'bg-white text-[#111827] border border-[#D1D5DB]' : 'bg-[#E5E7EB] text-[#6B7280]'}`} 
                    onClick={() => handleAccountTypeChange('Bank account')}
                  >
                    Bank account
                  </button>
                  <button 
                    type="button"
                    className={`h-8 px-3 text-[13px] ${formData.accountType === 'Nordea personal account' ? 'bg-white text-[#111827] border border-[#D1D5DB]' : 'bg-[#E5E7EB] text-[#6B7280]'}`} 
                    onClick={() => handleAccountTypeChange('Nordea personal account')}
                  >
                    Nordea personal account
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Bank</label>
                <input
                  type="text"
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="Enter bank"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Clearing no.</label>
                <input
                  type="text"
                  name="clearingNo"
                  value={formData.clearingNo}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="Enter clearing no."
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Account no.</label>
                <input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="Enter account no."
                />
              </div>
            </div>
            
            {/* Charge Code Section */}
            <div className="mt-4">
              <label className="block text-[13px] font-medium text-[#1D4ED8] mb-2 cursor-pointer hover:underline">
                Charge code (Regulates any bank charges)
              </label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  className={`h-8 px-3 text-[13px] ${formData.chargeCode === 'Sender pays' ? 'bg-white text-[#111827] border border-[#D1D5DB]' : 'bg-[#E5E7EB] text-[#6B7280]'}`} 
                  onClick={() => handleChargeCodeChange('Sender pays')}
                >
                  Sender pays
                </button>
                <button 
                  type="button"
                  className={`h-8 px-3 text-[13px] ${formData.chargeCode === 'Shared cost*' ? 'bg-white text-[#111827] border border-[#D1D5DB]' : 'bg-[#E5E7EB] text-[#6B7280]'}`} 
                  onClick={() => handleChargeCodeChange('Shared cost*')}
                >
                  Shared cost*
                </button>
                <button 
                  type="button"
                  className={`h-8 px-3 text-[13px] ${formData.chargeCode === 'The recipient pays' ? 'bg-white text-[#111827] border border-[#D1D5DB]' : 'bg-[#E5E7EB] text-[#6B7280]'}`} 
                  onClick={() => handleChargeCodeChange('The recipient pays')}
                >
                  The recipient pays
                </button>
              </div>
              <p className="text-[12px] text-[#6B7280] mt-1">
                *Supported only in ISO 20022 to handle foreign payments out
              </p>
            </div>
            
            {/* Disable Payment File Toggle */}
            <div className="mt-4 flex items-center">
              <label className="text-[13px] font-medium text-[#374151] mr-3">Disable payment file</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  className={`h-8 px-3 text-[13px] ${formData.disablePaymentFile === 'Yes' ? 'bg-white text-[#111827] border border-[#D1D5DB]' : 'bg-[#E5E7EB] text-[#6B7280]'}`} 
                  onClick={() => handleDisablePaymentFileChange('Yes')}
                >
                  Yes
                </button>
                <button 
                  type="button"
                  className={`h-8 px-3 text-[13px] ${formData.disablePaymentFile === 'No' ? 'bg-white text-[#111827] border border-[#D1D5DB]' : 'bg-[#E5E7EB] text-[#6B7280]'}`} 
                  onClick={() => handleDisablePaymentFileChange('No')}
                >
                  No
                </button>
              </div>
            </div>
            
            {/* Collapsible Divider Section */}
            <div className="mt-6 pt-4 border-t border-[#E5E7EB]">
              <div className="flex items-center cursor-pointer">
                <span className="text-[#16A34A] mr-2">✔</span>
                <span className="text-[14px] font-semibold text-[#111827]">More address details</span>
              </div>
              
              {/* Visiting Address Section */}
              <div className="mt-4">
                <h3 className="text-[14px] font-semibold text-[#111827] mb-2">Visiting address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Address</label>
                    <input
                      type="text"
                      name="visitingAddress"
                      value={formData.visitingAddress}
                      onChange={handleInputChange}
                      className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                      placeholder="Enter address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-medium text-[#374151] mb-1">Postcode</label>
                      <input
                        type="text"
                        name="visitingPostcode"
                        value={formData.visitingPostcode}
                        onChange={handleInputChange}
                        className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                        placeholder="Enter postcode"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[13px] font-medium text-[#374151] mb-1">City</label>
                      <input
                        type="text"
                        name="visitingCity"
                        value={formData.visitingCity}
                        onChange={handleInputChange}
                        className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Country</label>
                    <input
                      type="text"
                      name="visitingCountry"
                      value={formData.visitingCountry}
                      onChange={handleInputChange}
                      className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                      placeholder="Enter country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[13px] font-medium text-[#374151] mb-1">Country code</label>
                    <input
                      type="text"
                      name="visitingCountryCode"
                      value={formData.visitingCountryCode}
                      onChange={handleInputChange}
                      className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                      placeholder="Enter code"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* References and Notes Section */}
          <div className="p-6 bg-white border-t border-[#E5E7EB]">
            <div className="pb-2 border-b border-[#E5E7EB] mb-4">
              <div className="flex items-center cursor-pointer">
                <span className="text-[#16A34A] mr-2">▼</span>
                <span className="text-[14px] font-semibold text-[#111827]">References and notes</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Our reference</label>
                <input
                  type="text"
                  name="ourReference"
                  value={formData.ourReference}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="First name, Last name"
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Supplier's reference</label>
                <input
                  type="text"
                  name="supplierReference"
                  value={formData.supplierReference}
                  onChange={handleInputChange}
                  className="w-full h-9 px-2.5 py-2 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors"
                  placeholder="First name, Last name"
                />
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-[13px] font-medium text-[#374151] mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-2.5 py-2.5 border border-[#D1D5DB] rounded-[4px] bg-white text-[#111827] text-[14px] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] focus:outline-none transition-colors resize-vertical"
                  placeholder="Enter notes here"
                ></textarea>
              </div>
            </div>
            
            {/* Action Buttons Footer */}
            <div className="mt-8 flex justify-between items-center">
              <button className="h-9 px-5 bg-[#E5E7EB] text-[#FFFFFF] text-[14px] font-semibold rounded-full opacity-50 cursor-not-allowed">
                Delete
              </button>
              
              <div className="flex items-center gap-[12px]">
                <button 
                  className="h-9 px-5 bg-[#9E9E9E] text-white text-[14px] font-semibold rounded-full border-none hover:bg-[#8C8C8C] transition-all duration-200"
                  onClick={onGoBackToList || (() => window.history.back())}
                >
                  Cancel
                </button>
                <button className="h-9 px-5.5 bg-[#15803D] text-white text-[14px] font-semibold rounded-full border-none hover:bg-[#166534] focus:ring-2 focus:ring-[#86EFAC] focus:outline-none transition-all duration-200">
                  Save
                </button>
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
                  type="button"
                  onClick={handleSave}
                  className="h-[40px] min-w-[88px] px-[22px] bg-[#0A8F3C] text-white text-[14px] font-semibold rounded-full border-none hover:bg-[#087A33] shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200"
                >
                  Save
                </button>
                <button className="h-[40px] min-w-[88px] px-[22px] bg-[#0A8F3C] text-white text-[14px] font-semibold rounded-full border-none hover:bg-[#087A33] shadow-[0_2px_6px_rgba(0,0,0,0.15)] transition-all duration-200">
                  Mail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default SupplierForm;