import React, { useState, useEffect } from 'react';
import { X, Save, Plus, RefreshCw, ArrowRightLeft, Check, Search, ChevronDown, ChevronUp, Info } from 'lucide-react';
import RetrieveCustomerDetailsModal from './RetrieveCustomerDetailsModal';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: any) => void;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'billing'>('basic');
  const [showMoreAddressDetails, setShowMoreAddressDetails] = useState(false);
  const [showMoreCustomerDetails, setShowMoreCustomerDetails] = useState(false);
  const [showEDocumentDetails, setShowEDocumentDetails] = useState(false);
  const [showInvoiceText, setShowInvoiceText] = useState(false);
  const [showPreselectedTemplates, setShowPreselectedTemplates] = useState(false);
  const [showRetrieveModal, setShowRetrieveModal] = useState(false);
  const [formData, setFormData] = useState({
    customerNo: '1',
    name: '',
    billingAddress: '',
    billingAddress2: '',
    postalCode: '',
    city: '',
    country: 'Sweden',
    customerType: 'business',
    corporatePersonalNo: '',
    phone: '',
    phone2: '',
    fax: '',
    email: '',
    countryCode: '',
    webAddress: '',
    isActive: true,
    deliveryAddress: '',
    deliveryName: '',
    deliveryAddress2: '',
    deliveryPostalCode: '',
    deliveryCity: '',
    deliveryCountry: 'Sweden',
    deliveryCountryCode: '',
    deliveryPhone: '',
    deliveryPhone2: '',
    deliveryFax: '',
    industryCode: '',
    workplaceNumber: '',
    storeId: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent body scrolling when modal is open
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
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerNo.trim()) {
      newErrors.customerNo = 'Customer number is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Customer name is required';
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
      customerNo: '1',
      name: '',
      billingAddress: '',
      billingAddress2: '',
      postalCode: '',
      city: '',
      country: 'Sweden',
      customerType: 'business',
      corporatePersonalNo: '',
      phone: '',
      phone2: '',
      fax: '',
      email: '',
      countryCode: '',
      webAddress: '',
      isActive: true,
      deliveryAddress: '',
      deliveryName: '',
      deliveryAddress2: '',
      deliveryPostalCode: '',
      deliveryCity: '',
      deliveryCountry: 'Sweden',
      deliveryCountryCode: '',
      deliveryPhone: '',
      deliveryPhone2: '',
      deliveryFax: '',
      industryCode: '',
      workplaceNumber: '',
      storeId: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  const handleRetrieveSearch = (searchData: any) => {
    console.log('Retrieving customer details:', searchData);
    // Here you would typically make an API call to retrieve customer details
    // For now, we'll just log the search data
    alert('Customer details search functionality would be implemented here');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-100 border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">CUSTOMER 1 - CREATE NEW</h1>
              <div className="flex items-center space-x-4">
                {/* Action buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleSave}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                          >
                            Create customer
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
                <ArrowRightLeft className="w-4 h-4" />
                <span>Invite to e-invoice</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-800">
                <Check className="w-4 h-4" />
                <span>Credit information</span>
              </button>
                      <button 
                        onClick={() => setShowRetrieveModal(true)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                      >
                        <Search className="w-4 h-4" />
                        <span>Retrieve customer details</span>
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
                onClick={() => setActiveTab('billing')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'billing'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Billing information
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
                      Customer number*
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.customerNo}
                        onChange={(e) => handleInputChange('customerNo', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.customerNo ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <RefreshCw className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    </div>
                    {errors.customerNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.customerNo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name*
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
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

                  <div className="grid grid-cols-2 gap-4">
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

                  {/* More address details */}
                  <div>
                    <button
                      onClick={() => setShowMoreAddressDetails(!showMoreAddressDetails)}
                      className="flex items-center space-x-2 text-lg font-medium text-gray-900"
                    >
                      <span className="text-green-600">✔</span>
                      <span>More address details</span>
                      {showMoreAddressDetails ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </button>

                    {showMoreAddressDetails && (
                      <div className="mt-4 pl-6">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Delivery address
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Same as billing address</option>
                            <option>Different delivery address</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                              </label>
                              <input
                                type="text"
                                value={formData.deliveryName}
                                onChange={(e) => handleInputChange('deliveryName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Delivery address
                              </label>
                              <input
                                type="text"
                                value={formData.deliveryAddress}
                                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Delivery address 2
                              </label>
                              <input
                                type="text"
                                value={formData.deliveryAddress2}
                                onChange={(e) => handleInputChange('deliveryAddress2', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Postal code
                                </label>
                                <input
                                  type="text"
                                  value={formData.deliveryPostalCode}
                                  onChange={(e) => handleInputChange('deliveryPostalCode', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  City
                                </label>
                                <input
                                  type="text"
                                  value={formData.deliveryCity}
                                  onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Country
                                </label>
                                <input
                                  type="text"
                                  value={formData.deliveryCountry}
                                  onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Country code
                                </label>
                                <input
                                  type="text"
                                  value={formData.deliveryCountryCode}
                                  onChange={(e) => handleInputChange('deliveryCountryCode', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                              </label>
                              <input
                                type="tel"
                                value={formData.deliveryPhone}
                                onChange={(e) => handleInputChange('deliveryPhone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone 2
                              </label>
                              <input
                                type="tel"
                                value={formData.deliveryPhone2}
                                onChange={(e) => handleInputChange('deliveryPhone2', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fax
                              </label>
                              <input
                                type="tel"
                                value={formData.deliveryFax}
                                onChange={(e) => handleInputChange('deliveryFax', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Customer type
                    </label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleInputChange('customerType', 'business')}
                        className={`px-3 py-1 text-sm rounded ${
                          formData.customerType === 'business'
                            ? 'bg-gray-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-300'
                        }`}
                      >
                        Business
                      </button>
                      <button
                        onClick={() => handleInputChange('customerType', 'private')}
                        className={`px-3 py-1 text-sm rounded ${
                          formData.customerType === 'private'
                            ? 'bg-gray-500 text-white'
                            : 'bg-white text-gray-600 border border-gray-300'
                        }`}
                      >
                        Private
                      </button>
                    </div>
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
                      Country code
                    </label>
                    <input
                      type="text"
                      value={formData.countryCode}
                      onChange={(e) => handleInputChange('countryCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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

                  {/* More customer details */}
                  <div>
                    <button
                      onClick={() => setShowMoreCustomerDetails(!showMoreCustomerDetails)}
                      className="flex items-center space-x-2 text-lg font-medium text-gray-900"
                    >
                      <span className="text-green-600">✔</span>
                      <span>More customer details</span>
                      {showMoreCustomerDetails ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </button>

                    {showMoreCustomerDetails && (
                      <div className="mt-4 space-y-4 pl-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Industry code (SNI)
                          </label>
                          <input
                            type="text"
                            value={formData.industryCode}
                            onChange={(e) => handleInputChange('industryCode', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Workplace number (CFAR)
                          </label>
                          <input
                            type="text"
                            value={formData.workplaceNumber}
                            onChange={(e) => handleInputChange('workplaceNumber', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Store ID
                          </label>
                          <input
                            type="text"
                            value={formData.storeId}
                            onChange={(e) => handleInputChange('storeId', e.target.value)}
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
              </div>
            </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                          {/* Payment and Delivery Terms */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment and delivery terms</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Payment terms
                                </label>
                                <div className="relative">
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Select payment terms</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Delivery terms
                                </label>
                                <div className="relative">
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Select delivery terms</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Delivery method
                                </label>
                                <div className="relative">
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Select delivery method</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Interest invoicing
                                </label>
                                <div className="flex space-x-2">
                                  <button className="px-3 py-1 text-sm rounded bg-white text-gray-600 border border-gray-300">
                                    Yes
                                  </button>
                                  <button className="px-3 py-1 text-sm rounded bg-gray-500 text-white">
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Billing */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Price list
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value="Price list A"
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Currency
                                </label>
                                <input
                                  type="text"
                                  value="SEK"
                                  readOnly
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Invoice discount (%)
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Invoice fee
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Shipping fee
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Prices incl. VAT
                                </label>
                                <div className="flex space-x-2">
                                  <button className="px-3 py-1 text-sm rounded bg-white text-gray-600 border border-gray-300">
                                    Yes
                                  </button>
                                  <button className="px-3 py-1 text-sm rounded bg-gray-500 text-white">
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                          {/* References */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">References</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Our reference
                                </label>
                                <input
                                  type="text"
                                  placeholder="First name, Last name"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Customer Service Representative
                                </label>
                                <div className="relative">
                                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>Select representative</option>
                                  </select>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  External reference
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Your reference
                                </label>
                                <div className="border border-gray-300 rounded-lg overflow-hidden">
                                  <div className="grid grid-cols-2 bg-gray-50">
                                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">PRESELECTED</div>
                                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">NAME</div>
                                  </div>
                                  <div className="grid grid-cols-2">
                                    <div className="px-3 py-2 flex items-center">
                                      <input type="radio" checked className="mr-2" />
                                    </div>
                                    <div className="px-3 py-2 text-sm text-gray-900">Ingen förvald</div>
                                  </div>
                                </div>
                                <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                                  Add reference
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Accounting */}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounting</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  VAT number
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                  VAT type
                                  <Info className="w-4 h-4 text-blue-500 ml-1" />
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value="SEE"
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Sales account
                                </label>
                                <input
                                  type="text"
                                  placeholder="Account, Name"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* E-document Section */}
                      <div>
                        <button
                          onClick={() => setShowEDocumentDetails(!showEDocumentDetails)}
                          className="flex items-center space-x-2 text-lg font-medium text-gray-900 mb-4"
                        >
                          <span className="text-green-600">✔</span>
                          <span>E-document</span>
                          {showEDocumentDetails ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                        </button>

                        {showEDocumentDetails && (
                          <div className="space-y-6">
                            {/* Invoice, Offer, Order Sections */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Invoice */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Invoice</h4>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    Distribution method
                                    <Info className="w-4 h-4 text-blue-500 ml-1" />
                                    <span className="ml-1 text-sm text-blue-600">Invite to e-invoice</span>
                                  </label>
                                  <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-sm rounded bg-gray-500 text-white">E-invoice</button>
                                    <button className="px-3 py-1 text-sm rounded bg-white text-gray-600 border border-gray-300">E-mail</button>
                                    <button className="px-3 py-1 text-sm rounded bg-white text-gray-600 border border-gray-300">Printing</button>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email for reminders</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Copy</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Secret copy</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                      GLN number
                                      <Info className="w-4 h-4 text-blue-500 ml-1" />
                                    </label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                      GLN number for delivery
                                      <Info className="w-4 h-4 text-blue-500 ml-1" />
                                    </label>
                                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                </div>
                              </div>

                              {/* Offer */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Offer</h4>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Distribution method</label>
                                  <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-sm rounded bg-gray-500 text-white">E-mail</button>
                                    <button className="px-3 py-1 text-sm rounded bg-white text-gray-600 border border-gray-300">Printing</button>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Copy</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Secret copy</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                </div>
                              </div>

                              {/* Order */}
                              <div className="space-y-4">
                                <h4 className="font-medium text-gray-900">Order</h4>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">Distribution method</label>
                                  <div className="flex space-x-2">
                                    <button className="px-3 py-1 text-sm rounded bg-white text-gray-600 border border-gray-300">E-mail</button>
                                    <button className="px-3 py-1 text-sm rounded bg-gray-500 text-white">Printing</button>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Copy</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Secret copy</label>
                                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Invoice text and Preselected templates */}
                            <div className="space-y-6">
                              {/* Invoice text */}
                              <div>
                                <button
                                  onClick={() => setShowInvoiceText(!showInvoiceText)}
                                  className="flex items-center space-x-2 text-lg font-medium text-gray-900 mb-4"
                                >
                                  <span className="text-green-600">✔</span>
                                  <span>Invoice text</span>
                                  {showInvoiceText ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                                </button>
                                {showInvoiceText && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice text</label>
                                    <textarea
                                      rows={4}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Preselected templates */}
                              <div>
                                <button
                                  onClick={() => setShowPreselectedTemplates(!showPreselectedTemplates)}
                                  className="flex items-center space-x-2 text-lg font-medium text-gray-900 mb-4"
                                >
                                  <span className="text-green-600">✔</span>
                                  <span>Preselected templates</span>
                                  {showPreselectedTemplates ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                                </button>
                                {showPreselectedTemplates && (
                                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                    {['Invoice', 'Offer', 'Order', 'Cash invoice'].map((docType) => (
                                      <div key={docType} className="space-y-3">
                                        <h5 className="font-medium text-gray-900">{docType}</h5>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Nothing selected</option>
                                          </select>
                                        </div>
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                            <option>Nothing selected</option>
                                          </select>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
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
                      className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50"
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

      {/* Retrieve Customer Details Modal */}
      <RetrieveCustomerDetailsModal
        isOpen={showRetrieveModal}
        onClose={() => setShowRetrieveModal(false)}
        onSearch={handleRetrieveSearch}
      />
    </div>
  );
};

export default CreateCustomerModal;
