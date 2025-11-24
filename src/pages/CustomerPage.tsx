import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, FileText, Users, Printer, X, ChevronDown, Info, Check } from 'lucide-react';
import { BillingInformationForm } from '../components/BillingInformationForm';

interface Customer {
  id: string;
  customerId: string;
  name: string;
  orgPersonNumber: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
}

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockCustomers: Customer[] = [];

    setTimeout(() => {
      setCustomers(mockCustomers);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.orgPersonNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || customer.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  const handleCreateCustomer = () => {
    setShowCreateModal(true);
  };

  const handleAdvancedSearch = () => {
    // Handle advanced search logic
    console.log('Advanced search');
  };

  const handleEInvoiceRequests = () => {
    // Handle e-invoice requests logic
    console.log('E-invoice requests');
  };

  const handleInviteCustomers = () => {
    // Handle invite customers logic
    console.log('Invite customers');
  };

  const handlePrintList = () => {
    // Handle print list logic
    console.log('Print list');
  };

  const handleDelete = () => {
    if (selectedCustomers.length > 0) {
      if (window.confirm(`Are you sure you want to delete ${selectedCustomers.length} selected customers?`)) {
        setCustomers(customers.filter(c => !selectedCustomers.includes(c.id)));
        setSelectedCustomers([]);
      }
    }
  };

  const handleActivate = () => {
    if (selectedCustomers.length > 0) {
      setCustomers(customers.map(c => 
        selectedCustomers.includes(c.id) 
          ? { ...c, status: 'active' as const }
          : c
      ));
      setSelectedCustomers([]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-gray-900">REGISTER - CUSTOMERS</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleEInvoiceRequests}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800"
            >
              <FileText className="h-4 w-4" />
              E-invoice requests
            </button>
            <button
              onClick={handleInviteCustomers}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800"
            >
              <Users className="h-4 w-4" />
              Invite customers to e-invoice
            </button>
            <button
              onClick={handlePrintList}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800"
            >
              <Printer className="h-4 w-4" />
              Print list
            </button>
            <button
              onClick={handleCreateCustomer}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded text-sm font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create customer
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Customer number, Name, Company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={handleAdvancedSearch}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Advanced search
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 mb-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-sm rounded ${
              activeFilter === 'all'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
All
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1.5 text-sm rounded ${
              activeFilter === 'active'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
Active
          </button>
          <button
            onClick={() => setActiveFilter('inactive')}
            className={`px-3 py-1.5 text-sm rounded ${
              activeFilter === 'inactive'
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
Inactive
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-600">0</span>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-6">
        <div className="bg-white border border-gray-200 rounded">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  CUSTOMER NO.
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  NAME
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  ORG/PERSONAL NO.
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  POSTAL CODE
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  CITY
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  COUNTRY
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  PHONE
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                  EMAIL
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No customers to display
                  </td>
                </tr>
              )}
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{customer.customerId}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{customer.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{customer.orgPersonNumber}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{customer.postalCode}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{customer.city}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{customer.country}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{customer.phone}</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{customer.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between mt-4 pb-6">
          <div className="text-sm text-gray-600">
            ({selectedCustomers.length} selected)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={selectedCustomers.length === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <button
              onClick={handleActivate}
              disabled={selectedCustomers.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Activate
            </button>
          </div>
        </div>
      </div>

      {/* Create Customer Modal */}
      {showCreateModal && (
        <CreateCustomerModal
          onClose={() => setShowCreateModal(false)}
          onSave={(customerData) => {
            // Handle saving customer
            console.log('Saving customer:', customerData);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

interface CreateCustomerModalProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'billing'>('basic');
  const [showMoreAddressDetails, setShowMoreAddressDetails] = useState(false);
  const [showMoreCustomerDetails, setShowMoreCustomerDetails] = useState(false);
  
  const [formData, setFormData] = useState({
    customerNumber: '1',
    customerType: 'business',
    corporatePersonalId: '',
    active: 'yes',
    name: '',
    phone: '',
    phone2: '',
    fax: '',
    email: '',
    webAddress: '',
    billingAddress: '',
    billingAddress2: '',
    postalCode: '',
    city: '',
    country: '',
    countryCode: '',
    // Delivery address fields
    deliveryName: '',
    deliveryPhone: '',
    deliveryPhone2: '',
    deliveryFax: '',
    deliveryAddress: '',
    deliveryAddress2: '',
    deliveryPostalCode: '',
    deliveryCity: '',
    deliveryCountry: '',
    deliveryCountryCode: '',
    // More customer details
    industryCode: '',
    workplaceNumber: '',
    storeId: '',
    notes: '',
    // Billing information fields
    paymentTerms: '',
    deliveryTerms: '',
    deliveryMethod: '',
    interestInvoicing: 'yes',
    priceList: 'Price list A',
    currency: 'SEK',
    invoiceDiscount: '',
    invoiceFee: '',
    shippingFee: '',
    pricesInclVAT: 'yes',
    ourReference: '',
    customerServiceRep: '',
    externalReference: '',
    yourReference: 'Ingen förvald',
    vatNumber: '',
    vatType: 'SEE',
    salesAccount: '',
    // E-document fields
    invoiceDistributionMethod: 'e-invoice',
    invoiceEmail: '',
    invoiceEmailReminders: '',
    invoiceCopy: '',
    invoiceSecretCopy: '',
    invoiceGlnNumber: '',
    invoiceGlnDelivery: '',
    offerDistributionMethod: 'email',
    offerEmail: '',
    offerCopy: '',
    offerSecretCopy: '',
    orderDistributionMethod: 'email',
    orderEmail: '',
    orderCopy: '',
    orderSecretCopy: '',
    // Invoice text and templates
    invoiceText: '',
    invoiceTemplate: '',
    invoiceLanguage: '',
    offerTemplate: '',
    offerLanguage: '',
    orderTemplate: '',
    orderLanguage: '',
    cashInvoiceTemplate: '',
    cashInvoiceLanguage: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">CUSTOMER 1 - CREATE NEW</h2>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
              <Users className="h-4 w-4" />
              Invite to e-invoice
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
              <FileText className="h-4 w-4" />
              Credit information
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
              <Search className="h-4 w-4" />
              Retrieve customer details
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-1.5 rounded text-sm font-medium">
              Create customer
            </button>
            <button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded text-sm">
              Show list
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'basic'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Basic information
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'billing'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Billing information
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Basic Information Row */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer number *
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.customerNumber}
                      onChange={(e) => handleInputChange('customerNumber', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button className="px-2 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r hover:bg-gray-200">
                      <Search className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer type
                  </label>
                  <div className="flex rounded border border-gray-300">
                    <button
                      onClick={() => handleInputChange('customerType', 'business')}
                      className={`flex-1 px-3 py-2 text-sm ${
                        formData.customerType === 'business'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Business
                    </button>
                    <button
                      onClick={() => handleInputChange('customerType', 'private')}
                      className={`flex-1 px-3 py-2 text-sm border-l border-gray-300 ${
                        formData.customerType === 'private'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Private
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Corporate/Personal Identification Number
                  </label>
                  <input
                    type="text"
                    value={formData.corporatePersonalId}
                    onChange={(e) => handleInputChange('corporatePersonalId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Active
                  </label>
                  <div className="flex rounded border border-gray-300">
                    <button
                      onClick={() => handleInputChange('active', 'yes')}
                      className={`flex-1 px-3 py-2 text-sm ${
                        formData.active === 'yes'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleInputChange('active', 'no')}
                      className={`flex-1 px-3 py-2 text-sm border-l border-gray-300 ${
                        formData.active === 'no'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing address
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing address 2
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress2}
                      onChange={(e) => handleInputChange('billingAddress2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal code
                      </label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country code
                      </label>
                      <input
                        type="text"
                        value={formData.countryCode}
                        onChange={(e) => handleInputChange('countryCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone 2
                    </label>
                    <input
                      type="text"
                      value={formData.phone2}
                      onChange={(e) => handleInputChange('phone2', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fax
                    </label>
                    <input
                      type="text"
                      value={formData.fax}
                      onChange={(e) => handleInputChange('fax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Web address
                    </label>
                    <input
                      type="text"
                      value={formData.webAddress}
                      onChange={(e) => handleInputChange('webAddress', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* More address details */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowMoreAddressDetails(!showMoreAddressDetails)}
                  className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <ChevronDown className={`h-4 w-4 transform ${showMoreAddressDetails ? 'rotate-180' : ''}`} />
                  More address details
                </button>

                {showMoreAddressDetails && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery address
                      </label>
                      <select className="w-48 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
                        <option>Delivery address</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={formData.deliveryName}
                            onChange={(e) => handleInputChange('deliveryName', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery address
                          </label>
                          <input
                            type="text"
                            value={formData.deliveryAddress}
                            onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery address 2
                          </label>
                          <input
                            type="text"
                            value={formData.deliveryAddress2}
                            onChange={(e) => handleInputChange('deliveryAddress2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Postal code
                            </label>
                            <input
                              type="text"
                              value={formData.deliveryPostalCode}
                              onChange={(e) => handleInputChange('deliveryPostalCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </label>
                            <input
                              type="text"
                              value={formData.deliveryCity}
                              onChange={(e) => handleInputChange('deliveryCity', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country
                            </label>
                            <input
                              type="text"
                              value={formData.deliveryCountry}
                              onChange={(e) => handleInputChange('deliveryCountry', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Country code
                            </label>
                            <input
                              type="text"
                              value={formData.deliveryCountryCode}
                              onChange={(e) => handleInputChange('deliveryCountryCode', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="text"
                            value={formData.deliveryPhone}
                            onChange={(e) => handleInputChange('deliveryPhone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone 2
                          </label>
                          <input
                            type="text"
                            value={formData.deliveryPhone2}
                            onChange={(e) => handleInputChange('deliveryPhone2', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fax
                          </label>
                          <input
                            type="text"
                            value={formData.deliveryFax}
                            onChange={(e) => handleInputChange('deliveryFax', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* More customer details */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowMoreCustomerDetails(!showMoreCustomerDetails)}
                  className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  <ChevronDown className={`h-4 w-4 transform ${showMoreCustomerDetails ? 'rotate-180' : ''}`} />
                  More customer details
                </button>

                {showMoreCustomerDetails && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry code (SNI)
                      </label>
                      <input
                        type="text"
                        value={formData.industryCode}
                        onChange={(e) => handleInputChange('industryCode', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Workplace number (CFAR)
                      </label>
                      <input
                        type="text"
                        value={formData.workplaceNumber}
                        onChange={(e) => handleInputChange('workplaceNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Store ID
                      </label>
                      <input
                        type="text"
                        value={formData.storeId}
                        onChange={(e) => handleInputChange('storeId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <BillingInformationForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
          >
            Delete
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
