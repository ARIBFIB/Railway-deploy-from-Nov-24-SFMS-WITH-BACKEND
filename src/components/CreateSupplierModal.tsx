import React, { useState, useEffect } from 'react';
import { X, Save, Plus, RefreshCw, ArrowRightLeft, Check, Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface CreateSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplierData: any) => void;
}

const CreateSupplierModal: React.FC<CreateSupplierModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'accounting'>('basic');
  const [showMoreAddressDetails, setShowMoreAddressDetails] = useState(false);
  const [showReferencesNotes, setShowReferencesNotes] = useState(false);
  const [formData, setFormData] = useState({
    supplierNo: '1',
    supplierName: '',
    corporatePersonalNo: '',
    isActive: true,
    billingAddress: '',
    billingAddress2: '',
    phone: '',
    phone2: '',
    fax: '',
    email: '',
    webAddress: '',
    postalCode: '',
    city: '',
    country: '',
    countryCode: '',
    bankTransfer: '',
    plusgiro: '',
    bic: '',
    iban: '',
    accountType: 'bank',
    bank: '',
    clearingNumber: '',
    accountNumber: '',
    disablePaymentFile: false,
    feeCode: 'shared',
    visitingAddress: '',
    visitingPostalCode: '',
    visitingCity: '',
    visitingCountry: '',
    visitingCountryCode: '',
    ourReference: '',
    supplierReference: '',
    notes: '',
    predefinedOffsetAccount: '',
    accountingTemplate: '',
    itemRegistrationEInvoice: true,
    roundingOffPennyEInvoice: true,
    vatType: '',
    vatNumber: '',
    currency: 'SEK',
    paymentTerms: '',
    ourCustomerNumber: '',
    workplaceCFAR: '',
    industryCodeSNI: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierNo.trim()) {
      newErrors.supplierNo = 'Supplier number is required';
    }
    if (!formData.supplierName.trim()) {
      newErrors.supplierName = 'Supplier name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    setFormData({
      supplierNo: '1',
      supplierName: '',
      corporatePersonalNo: '',
      isActive: true,
      billingAddress: '',
      billingAddress2: '',
      phone: '',
      phone2: '',
      fax: '',
      email: '',
      webAddress: '',
      postalCode: '',
      city: '',
      country: '',
      countryCode: '',
      bankTransfer: '',
      plusgiro: '',
      bic: '',
      iban: '',
      accountType: 'bank',
      bank: '',
      clearingNumber: '',
      accountNumber: '',
      disablePaymentFile: false,
      feeCode: 'shared',
      visitingAddress: '',
      visitingPostalCode: '',
      visitingCity: '',
      visitingCountry: '',
      visitingCountryCode: '',
      ourReference: '',
      supplierReference: '',
      notes: '',
      predefinedOffsetAccount: '',
      accountingTemplate: '',
      itemRegistrationEInvoice: true,
      roundingOffPennyEInvoice: true,
      vatType: '',
      vatNumber: '',
      currency: 'SEK',
      paymentTerms: '',
      ourCustomerNumber: '',
      workplaceCFAR: '',
      industryCodeSNI: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">SUPPLIER 1 - CREATE NEW</h1>
              <div className="flex items-center space-x-4">
                {/* Action buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Create supplier
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg"
                  >
                    Show list
                  </button>
                </div>
              </div>
            </div>
            
            {/* Secondary action links */}
            <div className="flex items-center space-x-4 mt-2">
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                <RefreshCw className="w-4 h-4" />
                <span>C Reset field</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                <ArrowRightLeft className="w-4 h-4" />
                <span>E-invoice</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                <Check className="w-4 h-4" />
                <span>Credit information</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                <Search className="w-4 h-4" />
                <span>Get supplier details</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'basic'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Basic information
              </button>
              <button
                onClick={() => setActiveTab('accounting')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'accounting'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Accounting information
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'basic' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier number*
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.supplierNo}
                        onChange={(e) => handleInputChange('supplierNo', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.supplierNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    {errors.supplierNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.supplierNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier name*
                    </label>
                    <input
                      type="text"
                      value={formData.supplierName}
                      onChange={(e) => handleInputChange('supplierName', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.supplierName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.supplierName && (
                      <p className="mt-1 text-sm text-red-600">{errors.supplierName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Corporate/Personal Identification Number
                    </label>
                    <input
                      type="text"
                      value={formData.corporatePersonalNo}
                      onChange={(e) => handleInputChange('corporatePersonalNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleInputChange('isActive', true)}
                        className={`px-3 py-1 text-sm rounded ${
                          formData.isActive
                            ? 'bg-gray-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-300'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleInputChange('isActive', false)}
                        className={`px-3 py-1 text-sm rounded ${
                          !formData.isActive
                            ? 'bg-gray-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-300'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing address
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Billing address 2
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress2}
                      onChange={(e) => handleInputChange('billingAddress2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone 2
                    </label>
                    <input
                      type="tel"
                      value={formData.phone2}
                      onChange={(e) => handleInputChange('phone2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fax
                    </label>
                    <input
                      type="tel"
                      value={formData.fax}
                      onChange={(e) => handleInputChange('fax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Web address
                    </label>
                    <input
                      type="url"
                      value={formData.webAddress}
                      onChange={(e) => handleInputChange('webAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country code
                    </label>
                    <input
                      type="text"
                      value={formData.countryCode}
                      onChange={(e) => handleInputChange('countryCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Payment Information Section */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank transfer
                        </label>
                        <input
                          type="text"
                          value={formData.bankTransfer}
                          onChange={(e) => handleInputChange('bankTransfer', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plusgiro
                        </label>
                        <input
                          type="text"
                          value={formData.plusgiro}
                          onChange={(e) => handleInputChange('plusgiro', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          BIC
                        </label>
                        <input
                          type="text"
                          value={formData.bic}
                          onChange={(e) => handleInputChange('bic', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IBAN
                        </label>
                        <input
                          type="text"
                          value={formData.iban}
                          onChange={(e) => handleInputChange('iban', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account type
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleInputChange('accountType', 'bank')}
                            className={`px-3 py-1 text-sm rounded ${
                              formData.accountType === 'bank'
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            Bank account
                          </button>
                          <button
                            onClick={() => handleInputChange('accountType', 'nordea')}
                            className={`px-3 py-1 text-sm rounded ${
                              formData.accountType === 'nordea'
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            Nordea Personal Account
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank
                        </label>
                        <input
                          type="text"
                          value={formData.bank}
                          onChange={(e) => handleInputChange('bank', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Clearing number
                        </label>
                        <input
                          type="text"
                          value={formData.clearingNumber}
                          onChange={(e) => handleInputChange('clearingNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account number
                        </label>
                        <input
                          type="text"
                          value={formData.accountNumber}
                          onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Disable payment file
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleInputChange('disablePaymentFile', true)}
                            className={`px-3 py-1 text-sm rounded ${
                              formData.disablePaymentFile
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleInputChange('disablePaymentFile', false)}
                            className={`px-3 py-1 text-sm rounded ${
                              !formData.disablePaymentFile
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fee code{' '}
                          <a href="#" className="text-blue-600 hover:text-blue-800 underline text-sm">
                            (Regulates any bank fees)
                          </a>
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleInputChange('feeCode', 'sender')}
                            className={`px-3 py-1 text-sm rounded ${
                              formData.feeCode === 'sender'
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            The sender pays
                          </button>
                          <button
                            onClick={() => handleInputChange('feeCode', 'shared')}
                            className={`px-3 py-1 text-sm rounded ${
                              formData.feeCode === 'shared'
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            Shared cost*
                          </button>
                          <button
                            onClick={() => handleInputChange('feeCode', 'recipient')}
                            className={`px-3 py-1 text-sm rounded ${
                              formData.feeCode === 'recipient'
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            The recipient pays
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          *Only supported in ISO 20022 to handle cross-border payments
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* More address details */}
              <div>
                <button
                  onClick={() => setShowMoreAddressDetails(!showMoreAddressDetails)}
                  className="flex items-center space-x-2 text-lg font-medium text-gray-900 mb-4"
                >
                  <span className="text-green-600">✔</span>
                  <span>More address details</span>
                  {showMoreAddressDetails ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>

                {showMoreAddressDetails && (
                  <div className="pl-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Visiting address</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Address
                          </label>
                          <input
                            type="text"
                            value={formData.visitingAddress}
                            onChange={(e) => handleInputChange('visitingAddress', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal code
                          </label>
                          <input
                            type="text"
                            value={formData.visitingPostalCode}
                            onChange={(e) => handleInputChange('visitingPostalCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={formData.visitingCity}
                            onChange={(e) => handleInputChange('visitingCity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={formData.visitingCountry}
                            onChange={(e) => handleInputChange('visitingCountry', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country code
                          </label>
                          <input
                            type="text"
                            value={formData.visitingCountryCode}
                            onChange={(e) => handleInputChange('visitingCountryCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* References and notes */}
              <div>
                <button
                  onClick={() => setShowReferencesNotes(!showReferencesNotes)}
                  className="flex items-center space-x-2 text-lg font-medium text-gray-900 mb-4"
                >
                  <span className="text-green-600">✔</span>
                  <span>References and notes</span>
                  {showReferencesNotes ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </button>

                {showReferencesNotes && (
                  <div className="pl-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Our reference
                      </label>
                      <input
                        type="text"
                        placeholder="First name, Last name"
                        value={formData.ourReference}
                        onChange={(e) => handleInputChange('ourReference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supplier reference
                      </label>
                      <input
                        type="text"
                        placeholder="First name, Last name"
                        value={formData.supplierReference}
                        onChange={(e) => handleInputChange('supplierReference', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Accounting */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounting</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Predefined offset account
                        </label>
                        <input
                          type="text"
                          placeholder="Account, Name"
                          value={formData.predefinedOffsetAccount}
                          onChange={(e) => handleInputChange('predefinedOffsetAccount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Accounting template
                        </label>
                        <input
                          type="text"
                          placeholder="Code, Name"
                          value={formData.accountingTemplate}
                          onChange={(e) => handleInputChange('accountingTemplate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Item registration (e-invoice)
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleInputChange('itemRegistrationEInvoice', true)}
                            className={`px-3 py-1 text-sm rounded ${
                              formData.itemRegistrationEInvoice
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleInputChange('itemRegistrationEInvoice', false)}
                            className={`px-3 py-1 text-sm rounded ${
                              !formData.itemRegistrationEInvoice
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rounding off the penny (e-invoice)
                        </label>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleInputChange('roundingOffPennyEInvoice', true)}
                            className={`px-3 py-1 text-sm rounded ${
                              formData.roundingOffPennyEInvoice
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleInputChange('roundingOffPennyEInvoice', false)}
                            className={`px-3 py-1 text-sm rounded ${
                              !formData.roundingOffPennyEInvoice
                                ? 'bg-gray-500 text-white'
                                : 'bg-white text-gray-600 border border-gray-300'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          VAT type
                          <HelpCircle className="w-4 h-4 text-blue-500 ml-1" />
                        </label>
                        <input
                          type="text"
                          value={formData.vatType}
                          onChange={(e) => handleInputChange('vatType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Other information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Other information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Our customer number
                        </label>
                        <input
                          type="text"
                          value={formData.ourCustomerNumber}
                          onChange={(e) => handleInputChange('ourCustomerNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Workplace (CFAR)
                        </label>
                        <input
                          type="text"
                          value={formData.workplaceCFAR}
                          onChange={(e) => handleInputChange('workplaceCFAR', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Industry code (SNI)
                        </label>
                        <input
                          type="text"
                          value={formData.industryCodeSNI}
                          onChange={(e) => handleInputChange('industryCodeSNI', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle Section - Full Width Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT number
                  </label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={(e) => handleInputChange('vatNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SEK">SEK</option>
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="NOK">NOK</option>
                    <option value="DKK">DKK</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment terms
                  </label>
                  <input
                    type="text"
                    value={formData.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full text-sm font-medium flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Delete</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplierModal;
