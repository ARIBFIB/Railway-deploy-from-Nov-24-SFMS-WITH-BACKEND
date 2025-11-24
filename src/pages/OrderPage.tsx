import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Search, 
  Plus, 
  Printer, 
  Send,
  ShoppingCart,
  ChevronDown,
  Copy,
  CheckSquare,
  Lock,
  MessageSquare,
  Eye,
  Calendar,
  X,
  MoreHorizontal,
  Trash2
} from 'lucide-react';

const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // Create Order modal state
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [customer, setCustomer] = useState('');
  const [orderDate, setOrderDate] = useState('2025-09-17');
  const [deliveryDate, setDeliveryDate] = useState('2025-09-17');
  const [orderText, setOrderText] = useState('');
  const [useAsInvoiceText, setUseAsInvoiceText] = useState(false);
  const [printTemplate, setPrintTemplate] = useState('Order confirmation');
  const [language, setLanguage] = useState('English');
  const [shippingFee, setShippingFee] = useState('0,00');
  const [invoiceFee, setInvoiceFee] = useState('0,00');
  const [invoiceDiscount, setInvoiceDiscount] = useState('');
  const [distributionMethod, setDistributionMethod] = useState('Printing');
  const [orderDetailsExpanded, setOrderDetailsExpanded] = useState(false);
  const [customerInfoExpanded, setCustomerInfoExpanded] = useState(false);
  const [deliveryDetailsExpanded, setDeliveryDetailsExpanded] = useState(false);
  
  // Order details form fields
  const [paymentTerms, setPaymentTerms] = useState('30 days');
  const [ourReference, setOurReference] = useState('test test');
  const [yourOrderNumber, setYourOrderNumber] = useState('');
  const [yourReference, setYourReference] = useState('');
  const [labels, setLabels] = useState('');
  const [priceList, setPriceList] = useState('Price list A');
  const [pricesInclVat, setPricesInclVat] = useState('No');
  const [currency, setCurrency] = useState('SEK');
  const [course, setCourse] = useState('1.0000');
  const [unit, setUnit] = useState('1');
  const [vatType, setVatType] = useState('');
  
  // Customer information form fields
  const [customerName, setCustomerName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationNumber, setOrganizationNumber] = useState('');
  const [billingAddress2, setBillingAddress2] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  
  // Delivery details form fields
  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPostalCode, setDeliveryPostalCode] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [deliveryAddress2, setDeliveryAddress2] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [orderItems, setOrderItems] = useState([
    { id: 1, articleNumber: '', description: '', orderedQty: '', deliveredQty: '', unit: '', unitPrice: '', discount: '', sum: '', vat: '', account: '', tgPercent: '' },
    { id: 2, articleNumber: '', description: '', orderedQty: '', deliveredQty: '', unit: '', unitPrice: '', discount: '', sum: '', vat: '', account: '', tgPercent: '' },
    { id: 3, articleNumber: '', description: '', orderedQty: '', deliveredQty: '', unit: '', unitPrice: '', discount: '', sum: '', vat: '', account: '', tgPercent: '' }
  ]);

  // Orders handlers
  const handleSelectAllOrders = () => {
    // Toggle select all logic here
    setSelectedOrders(prev => prev.length > 0 ? [] : ['all']);
  };

  const getOrderFilterColor = (filter: string) => {
    // Use orderFilter to avoid linter warning
    console.log('Current order filter:', orderFilter);
    switch (filter) {
      case 'all': return 'bg-gray-100 text-gray-800';
      case 'not-invoiced': return 'border-t-2 border-pink-400 bg-white text-gray-800';
      case 'unbilled-overdue': return 'border-t-2 border-pink-400 bg-white text-gray-800';
      case 'invoiced': return 'border-t-2 border-green-400 bg-white text-gray-800';
      case 'cancelled': return 'bg-white text-gray-800 border border-gray-300';
      case 'failed': return 'bg-white text-gray-800 border border-gray-300';
      default: return 'bg-white text-gray-800 border border-gray-300';
    }
  };

  // Create Order modal handlers
  const handleOpenCreateOrderModal = () => {
    setShowCreateOrderModal(true);
  };

  const handleCloseCreateOrderModal = () => {
    setShowCreateOrderModal(false);
  };

  const handleCreateOrderSubmit = () => {
    console.log('Creating order with:', { customer, orderDate, deliveryDate, orderItems });
    setShowCreateOrderModal(false);
  };

  const handleCancelCreateOrder = () => {
    setShowCreateOrderModal(false);
  };

  const handleOrderItemChange = (id: number, field: string, value: string) => {
    setOrderItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddOrderItem = () => {
    const newId = Math.max(...orderItems.map(item => item.id)) + 1;
    setOrderItems(prev => [...prev, {
      id: newId,
      articleNumber: '',
      description: '',
      orderedQty: '',
      deliveredQty: '',
      unit: '',
      unitPrice: '',
      discount: '',
      sum: '',
      vat: '',
      account: '',
      tgPercent: ''
    }]);
  };

  const handleDeleteOrderItem = (id: number) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const handleShowList = () => {
    // Close the modal and navigate to the orders list
    setShowCreateOrderModal(false);
    // Since we're already on the OrderPage, we just need to close the modal
    // The main orders list is already visible on this page
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ORDERS - LIST</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleOpenCreateOrderModal}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create order
          </Button>
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
            <Printer className="w-4 h-4 mr-1" />
            Print list
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Order number, Customer number, Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <button className="text-blue-600 text-sm hover:underline">Advanced search</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getOrderFilterColor('all')}`}
          onClick={() => setOrderFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getOrderFilterColor('not-invoiced')}`}
          onClick={() => setOrderFilter('not-invoiced')}
        >
          Not invoiced
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getOrderFilterColor('unbilled-overdue')}`}
          onClick={() => setOrderFilter('unbilled-overdue')}
        >
          Unbilled overdue
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getOrderFilterColor('invoiced')}`}
          onClick={() => setOrderFilter('invoiced')}
        >
          Invoiced
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getOrderFilterColor('cancelled')}`}
          onClick={() => setOrderFilter('cancelled')}
        >
          Cancelled
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium rounded ${getOrderFilterColor('failed')}`}
          onClick={() => setOrderFilter('failed')}
        >
          Failed
        </button>
        <div className="flex-1"></div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <div className="w-4 h-4 mr-1 flex items-center justify-center">
              <div className="w-3 h-3 border border-gray-400 rounded"></div>
            </div>
            {selectedOrders.length} -
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    onClick={handleSelectAllOrders}
                    className="w-4 h-4 bg-blue-500 rounded hover:bg-blue-600"
                  ></button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-200">ORDER NO.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CUSTOMER NO.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE OF BIRTH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER DATE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOTAL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER VALUE</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CURRENCY</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total SEK</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">0.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"></td>
              </tr>
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">({selectedOrders.length} selected)</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">Distribution method</label>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>Default template</option>
            </select>
          </div>
          <Button variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200" disabled>
            Preview
          </Button>
          <span className="text-sm text-gray-500">Preselected</span>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Create invoice
            <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-y-auto">
            <div className="bg-green-800 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-lg font-semibold">ORDER 1*</h2>
              <button
                onClick={handleCloseCreateOrderModal}
                className="text-white hover:text-gray-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Top Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Create order
                  </Button>
                  <Button 
                    onClick={handleShowList}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    Show list
                  </Button>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <CheckSquare className="w-4 h-4 mr-1" />
                    Credit information
                  </button>
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Lock className="w-4 h-4 mr-1" />
                    Mark as not ready
                  </button>
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Comment
                  </button>
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </button>
                </div>
              </div>

              {/* Customer and Date Information */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                  <Input
                    placeholder="Customer number, Name, Corporate/Personal ID number"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order date</label>
                  <Input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery date</label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="pr-8"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Collapsible Sections */}
              <div className="space-y-4">
                {/* Order Details Section */}
                <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOrderDetailsExpanded(!orderDetailsExpanded)}
                    className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 rounded-t-lg"
                >
                    <div className="flex items-center">
                      <CheckSquare className="w-4 h-4 mr-2 text-green-600" />
                  Order details
                    </div>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${orderDetailsExpanded ? 'rotate-180' : ''}`} />
                </button>
                  {orderDetailsExpanded && (
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Payment terms</label>
                          <select
                            value={paymentTerms}
                            onChange={(e) => setPaymentTerms(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            <option>30 days</option>
                            <option>14 days</option>
                            <option>60 days</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Our reference</label>
                          <Input
                            value={ourReference}
                            onChange={(e) => setOurReference(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Your order number</label>
                          <Input
                            value={yourOrderNumber}
                            onChange={(e) => setYourOrderNumber(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Your reference</label>
                          <Input
                            value={yourReference}
                            onChange={(e) => setYourReference(e.target.value)}
                            placeholder="First name, Last name"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Labels</label>
                          <select
                            value={labels}
                            onChange={(e) => setLabels(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            <option value="">Select label</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price list</label>
                          <select
                            value={priceList}
                            onChange={(e) => setPriceList(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            <option>Price list A</option>
                            <option>Price list B</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prices incl. VAT</label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value="Yes"
                                checked={pricesInclVat === 'Yes'}
                                onChange={(e) => setPricesInclVat(e.target.value)}
                                className="mr-2"
                              />
                              Yes
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value="No"
                                checked={pricesInclVat === 'No'}
                                onChange={(e) => setPricesInclVat(e.target.value)}
                                className="mr-2"
                              />
                              No
                            </label>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            <option>SEK</option>
                            <option>EUR</option>
                            <option>USD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                          <Input
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                          <Input
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">VAT type</label>
                          <div className="flex items-center">
                            <select
                              value={vatType}
                              onChange={(e) => setVatType(e.target.value)}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                            >
                              <option value="">Select VAT type</option>
                            </select>
                            <button className="ml-2 text-blue-600">
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer Information Section */}
                <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setCustomerInfoExpanded(!customerInfoExpanded)}
                    className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 rounded-t-lg"
                >
                    <div className="flex items-center">
                      <CheckSquare className="w-4 h-4 mr-2 text-green-600" />
                  Customer information
                    </div>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${customerInfoExpanded ? 'rotate-180' : ''}`} />
                </button>
                  {customerInfoExpanded && (
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <Input
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Billing address</label>
                          <Input
                            value={billingAddress}
                            onChange={(e) => setBillingAddress(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                          <Input
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <Input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Organization number</label>
                          <Input
                            value={organizationNumber}
                            onChange={(e) => setOrganizationNumber(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Billing address 2</label>
                          <Input
                            value={billingAddress2}
                            onChange={(e) => setBillingAddress2(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Details Section */}
                <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setDeliveryDetailsExpanded(!deliveryDetailsExpanded)}
                    className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 rounded-t-lg"
                >
                    <div className="flex items-center">
                      <CheckSquare className="w-4 h-4 mr-2 text-green-600" />
                  Delivery details
                    </div>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${deliveryDetailsExpanded ? 'rotate-180' : ''}`} />
                </button>
                  {deliveryDetailsExpanded && (
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <Input
                            value={deliveryName}
                            onChange={(e) => setDeliveryName(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery address</label>
                          <Input
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Postal code</label>
                          <Input
                            value={deliveryPostalCode}
                            onChange={(e) => setDeliveryPostalCode(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <Input
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery method</label>
                          <select
                            value={deliveryMethod}
                            onChange={(e) => setDeliveryMethod(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            <option value="">Select delivery method</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery date</label>
                          <div className="relative">
                            <Input
                              type="date"
                              value={deliveryDate}
                              onChange={(e) => setDeliveryDate(e.target.value)}
                              className="text-sm pr-8"
                            />
                            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery address 2</label>
                          <Input
                            value={deliveryAddress2}
                            onChange={(e) => setDeliveryAddress2(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                          <Input
                            value={deliveryCountry}
                            onChange={(e) => setDeliveryCountry(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery terms</label>
                          <select
                            value={deliveryTerms}
                            onChange={(e) => setDeliveryTerms(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          >
                            <option value="">Select delivery terms</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ITEM NO.</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div>ORDER</div>
                          <div>QUANTITY</div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div>DELIVERY</div>
                          <div>QUANTITY</div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIT</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">À PRICE</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISCOUNT</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACCOUNT</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div>TG %</div>
                          <div className="w-3 h-3 bg-blue-100 rounded-sm inline-block"></div>
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2">
                            <Input
                              value={item.articleNumber}
                              onChange={(e) => handleOrderItemChange(item.id, 'articleNumber', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.description}
                              onChange={(e) => handleOrderItemChange(item.id, 'description', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.orderedQty}
                              onChange={(e) => handleOrderItemChange(item.id, 'orderedQty', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.deliveredQty}
                              onChange={(e) => handleOrderItemChange(item.id, 'deliveredQty', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.unit}
                              onChange={(e) => handleOrderItemChange(item.id, 'unit', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.unitPrice}
                              onChange={(e) => handleOrderItemChange(item.id, 'unitPrice', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.discount}
                              onChange={(e) => handleOrderItemChange(item.id, 'discount', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.sum}
                              onChange={(e) => handleOrderItemChange(item.id, 'sum', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.vat}
                              onChange={(e) => handleOrderItemChange(item.id, 'vat', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.account}
                              onChange={(e) => handleOrderItemChange(item.id, 'account', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              value={item.tgPercent}
                              onChange={(e) => handleOrderItemChange(item.id, 'tgPercent', e.target.value)}
                              className="w-full text-xs"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex items-center space-x-1">
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <MoreHorizontal className="w-4 h-4 text-gray-400" />
                              </button>
                              <button 
                                onClick={() => handleDeleteOrderItem(item.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Trash2 className="w-4 h-4 text-gray-400" />
                              </button>
                              <button 
                                onClick={handleAddOrderItem}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <Plus className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="px-3 py-2 text-sm font-medium text-gray-900">Total</td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">0.00</td>
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">0.00</td>
                        <td colSpan={8} className="px-3 py-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-right">
                    <div className="text-gray-600">Total excl. VAT</div>
                    <div className="font-medium">0.00 SEK</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">VAT</div>
                    <div className="font-medium">0.00 SEK</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">To pay</div>
                    <div className="font-medium">0.00 SEK</div>
                  </div>
                </div>
              </div>

              {/* Order Text and Settings */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order text</label>
                    <textarea
                      value={orderText}
                      onChange={(e) => setOrderText(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="Enter order text..."
                    />
                    <div className="mt-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={useAsInvoiceText}
                          onChange={(e) => setUseAsInvoiceText(e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Use as invoice text.</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Print template</label>
                    <select
                      value={printTemplate}
                      onChange={(e) => setPrintTemplate(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option>Order confirmation</option>
                      <option>Orderbekräftelse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option>English</option>
                      <option>Swedish</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Shipping fee</label>
                      <Input
                        value={shippingFee}
                        onChange={(e) => setShippingFee(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Invoice fee</label>
                      <Input
                        value={invoiceFee}
                        onChange={(e) => setInvoiceFee(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Invoice discount (%)</label>
                      <Input
                        value={invoiceDiscount}
                        onChange={(e) => setInvoiceDiscount(e.target.value)}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="text-right">
                    <div className="text-gray-600">Net</div>
                    <div className="font-medium">0,00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">Gross</div>
                    <div className="font-medium">0,00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">Ear smoothing</div>
                    <div className="font-medium">0,00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">Total excl. VAT</div>
                    <div className="font-medium">0,00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">VAT</div>
                    <div className="font-medium">0,00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">Total</div>
                    <div className="font-medium">0,00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">Order value</div>
                    <div className="font-medium">0,00</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">To pay</div>
                    <div className="font-medium text-red-600">0,00 SEK</div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={handleCancelCreateOrder}
                  variant="secondary"
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  Cancel
                </Button>
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleCreateOrderSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Save
                  </Button>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-700">Distribution method</label>
                    <select
                      value={distributionMethod}
                      onChange={(e) => setDistributionMethod(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm"
                    >
                      <option>Printing</option>
                      <option>Email</option>
                    </select>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Create invoice
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
