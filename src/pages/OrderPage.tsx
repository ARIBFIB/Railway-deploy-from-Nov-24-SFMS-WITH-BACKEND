import React, { useState } from 'react';
import loadingGif from "../assets/loading/200.gif";

import { 
  Search, 
  Plus, 
  Printer, 
  Send,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Copy,
  ShieldCheck,
  Lock,
  MessageCircle,
  ArrowRight,
  AlignJustify,
} from 'lucide-react';

const OrderPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [extendedSearchOpen, setExtendedSearchOpen] = useState(false);
  const [basicDetailsExpanded, setBasicDetailsExpanded] = useState(true);
  const [orderDetailsExpanded, setOrderDetailsExpanded] = useState(true);
  const [orderContentExpanded, setOrderContentExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateOrderForm, setShowCreateOrderForm] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [activeColumn, setActiveColumn] = useState<number | string | null>(null);
  const [loadingColumn, setLoadingColumn] = useState<number | string | null>(null);

  
  // State for Create order form
  const [customer, setCustomer] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [vatIncl, setVatIncl] = useState('yes');
  const [validTo, setValidTo] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [terms, setTerms] = useState('');
  const [ourReference, setOurReference] = useState('');
  const [yourReference, setYourReference] = useState('');
  const [priceList, setPriceList] = useState('');
  const [currency, setCurrency] = useState('');
  const [vat, setVat] = useState('');
  const [typeOfVat, setTypeOfVat] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [postcode, setPostcode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [invoiceAddress, setInvoiceAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPostcode, setDeliveryPostcode] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('');
  const [deliveryTerms, setDeliveryTerms] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [orderText, setOrderText] = useState('');
  const [charges, setCharges] = useState('');
  const [language, setLanguage] = useState('');
  const [lineItems, setLineItems] = useState([
    { id: 1, itemNo: 1, name: '', quantity: '', unit: 'pcs', pricePerUnit: '', discount: '', total: '0.00', vat: '25%', account: '', cc: '', pr: '', cmr: '' },
    { id: 2, itemNo: 2, name: '', quantity: '', unit: 'pcs', pricePerUnit: '', discount: '', total: '0.00', vat: '25%', account: '', cc: '', pr: '', cmr: '' },
    { id: 3, itemNo: 3, name: '', quantity: '', unit: 'pcs', pricePerUnit: '', discount: '', total: '0.00', vat: '25%', account: '', cc: '', pr: '', cmr: '' }
  ]);

  // Define type for errors
  type FormErrors = {
    customer?: string;
    orderDate?: string;
    validTo?: string;
    lineItems?: string;
  };
  
  // Validation state
  const [errors, setErrors] = useState<FormErrors>({});

  const handleColumnClick = (index: number | string) => {
  setLoadingColumn(index);
  setActiveColumn(null);

  setTimeout(() => {
    setLoadingColumn(null);
    setActiveColumn(index);
  }, 500);
};


const toggleRow = (rowId: number) => {
  setSelectedRows((prev: number[]) =>
    prev.includes(rowId)
      ? prev.filter((r) => r !== rowId)
      : [...prev, rowId]
  );
};

  
  // Validation function
  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!customer.trim()) {
      newErrors.customer = 'Customer is required';
    }
    
    if (!orderDate) {
      newErrors.orderDate = 'Order date is required';
    }
    
    if (!validTo) {
      newErrors.validTo = 'Valid to date is required';
    }
    
    if (lineItems.some(item => !item.name.trim())) {
      newErrors.lineItems = 'All line items must have a name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Here you would typically submit the form data to your API
    console.log('Submitting order:', {
      customer,
      orderDate,
      validTo,
      deliveryDate,
      terms,
      ourReference,
      yourReference,
      priceList,
      currency,
      vat,
      typeOfVat,
      orderRef,
      customerName,
      address,
      postcode,
      city,
      country,
      phone,
      email,
      invoiceAddress,
      deliveryAddress,
      deliveryPostcode,
      deliveryCity,
      deliveryCountry,
      deliveryTerms,
      deliveryMethod,
      orderText,
      charges,
      language,
      lineItems
    });
    
    // Show success message or redirect
    alert('Order created successfully!');
    
    // Reset form and return to list view
    setShowCreateOrderForm(false);
    setIsCreatingOrder(false);
  };

  // Handle adding a new line item
  const addLineItem = () => {
    const newItem = {
      id: Date.now(),
      itemNo: lineItems.length + 1,
      name: '',
      quantity: '',
      unit: 'pcs',
      pricePerUnit: '',
      discount: '',
      total: '0.00',
      vat: '25%',
      account: '',
      cc: '',
      pr: '',
      cmr: ''
    };
    setLineItems([...lineItems, newItem]);
  };

  // Handle removing a line item
  const removeLineItem = (id: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  // Handle updating a line item
  const updateLineItem = (id: number, field: string, value: string) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { ...item, [field]: value, cc: item.cc || '', pr: item.pr || '' } : item
    ));
  };

  const getOrderFilterColor = (filter: string) => {
    switch (filter) {
      case 'all': 
        return orderFilter === 'all' 
          ? 'border border-[#DADADA] bg-[#E9E9E9] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'active': 
        return orderFilter === 'active' 
          ? 'border border-[#DADADA] relative text-[#1F1F1F] overflow-hidden' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'due': 
        return orderFilter === 'due' 
          ? 'border-l-4 border-[#EF5350] bg-[#F9B6B6] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'order/invoices-created': 
        return orderFilter === 'order/invoices-created' 
          ? 'border-l-4 border-[#A5D6A7] bg-[#D4F3B8] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'voided': 
        return orderFilter === 'voided' 
          ? 'border-l-4 border-[#BDBDBD] bg-[#E7E7E7] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      case 'failed': 
        return orderFilter === 'failed' 
          ? 'border-l-4 border-[#9E9E9E] bg-[#E9E9E9] text-[#1F1F1F]' 
          : 'border border-[#DADADA] bg-white text-[#1F1F1F]';
      default: 
        return 'border border-[#DADADA] bg-white text-[#1F1F1F]';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-l-4 border-[#66BB6A] bg-[#F1F8F4]';
      case 'due': return 'border-l-4 border-[#EF5350] bg-[#FDECEC]';
      case 'order-created': return 'border-l-4 border-[#A5D6A7] bg-[#F3FBF5]';
      case 'voided': return 'border-l-4 border-[#BDBDBD] bg-[#F5F5F5]';
      case 'failed': return 'border-l-4 border-[#9E9E9E] bg-[#EEEEEE]';
      default: return 'bg-white';
    }
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      <div className="space-y-6 flex-grow">
        {/* Top Navigation Bar */}
        {isCreatingOrder && !showCreateOrderForm ? (
          // Loading state during transition
          <div className="flex flex-col items-center justify-center h-64">
            <img
              src={loadingGif}
              alt="loading"
              className="w-10 h-10"
            />
            {/* <p className="mt-4 text-[#BDBDBD]">Loading new order form...</p> */}
          </div>
        ) : showCreateOrderForm ? (
          // Create Order Form View
          <div className="bg-[#FAFAFA] border border-[#E0E0E0] rounded-lg p-6">
            {/* Header bar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E0E0E0]">
              <h2 className="text-xl font-bold text-[#333333]">ORDER 1*</h2>
              <div className="flex space-x-3">
                <button 
                  className="bg-[#8E8E8E] hover:bg-[#7A7A7A] text-white font-bold rounded-full h-9 px-4 text-sm"
                  onClick={handleSubmit}>
                  <span className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Create order
                  </span>
                </button>
                <button 
                  className="bg-[#FFC107] hover:bg-[#E6B800] text-[#111827] font-bold rounded-full h-9 px-4 text-sm"
                  onClick={async () => {
                    setIsLoading(true);
                    await new Promise(resolve => setTimeout(resolve, 500));
                    setShowCreateOrderForm(false);
                    setIsCreatingOrder(false);
                    setIsLoading(false);
                  }}
                >
                  <span className="flex items-center">
                    {isLoading ? (
                      <img
                        src={loadingGif}
                        alt="loading"
                        className="w-4 h-4 mr-2"
                      />
                    ) : (
                      <AlignJustify size={16} className="mr-2 text-[#111827]" />
                    )}
                    {isLoading ? 'Loading...' : 'Show list'}
                  </span>
                </button>
              </div>
            </div>
            
            {/* Customer & Date inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">Customer</label>
                <input 
                  type="text" 
                  className={`w-full h-9 border ${errors.customer ? 'border-red-500' : 'border-[#DADADA]'} rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]`} 
                  placeholder=""
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                />
                {errors.customer && <p className="text-red-500 text-xs mt-1">{errors.customer}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">Order date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className={`w-full h-9 border ${errors.orderDate ? 'border-red-500' : 'border-[#D1D1D1]'} rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]`} 
                    placeholder=""
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                  />
                </div>
                {errors.orderDate && <p className="text-red-500 text-xs mt-1">{errors.orderDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">Valid to</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className={`w-full h-9 border ${errors.validTo ? 'border-red-500' : 'border-[#D1D1D1]'} rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]`} 
                    placeholder=""
                    value={validTo}
                    onChange={(e) => setValidTo(e.target.value)}
                  />
                </div>
                {errors.validTo && <p className="text-red-500 text-xs mt-1">{errors.validTo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#555555] mb-1">Delivery date</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Order Details Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                  <span className="text-[#2E7D32] mr-2">▶</span>
                  Order details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Terms</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Our reference</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={ourReference}
                    onChange={(e) => setOurReference(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Your reference</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={yourReference}
                    onChange={(e) => setYourReference(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Price list</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={priceList}
                    onChange={(e) => setPriceList(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Currency</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">VAT</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={vat}
                    onChange={(e) => setVat(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Type of VAT</label>
                  <div className="flex">
                    <select 
                      className="w-full h-9 border border-[#D1D1D1] rounded-l px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                      value={typeOfVat}
                      onChange={(e) => setTypeOfVat(e.target.value)}>
                      <option>Select</option>
                    </select>
                    <div className="bg-[#EDEDED] border border-l-0 border-[#D1D1D1] rounded-r px-2 flex items-center">
                      <span className="text-[#007BFF] text-sm">?</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Order ref.</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={orderRef}
                    onChange={(e) => setOrderRef(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Customer Details Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                  <span className="text-[#2E7D32] mr-2">▶</span>
                  Customer details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Invoice address</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={invoiceAddress}
                    onChange={(e) => setInvoiceAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Postcode</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Phone</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">CIN</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Country</label>
                  <select 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#555555] mb-1">Invoice address 2</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#DADADA] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#2E7D32]" 
                    placeholder=""
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {/* Delivery Information Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="text-lg font-bold text-[#333333] flex items-center">
                  <span className="text-[#2E7D32] mr-2">▶</span>
                  Delivery information
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Delivery address</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Postcode</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={deliveryPostcode}
                    onChange={(e) => setDeliveryPostcode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">City</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]" 
                    placeholder=""
                    value={deliveryCity}
                    onChange={(e) => setDeliveryCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Country</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={deliveryCountry}
                    onChange={(e) => setDeliveryCountry(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Delivery terms</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={deliveryTerms}
                    onChange={(e) => setDeliveryTerms(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#555555] mb-1">Delivery method</label>
                  <select 
                    className="w-full h-9 border border-[#D1D1D1] rounded px-3 text-sm text-[#4A4A4A] bg-white focus:outline-none focus:border-[#007BFF]"
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}>
                    <option>Select</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Quick Action Toolbar */}
            <div className="flex items-center space-x-6 pt-4 border-t border-[#E0E0E0] py-4">
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <Copy size={18} />
                <span className="text-xs mt-1">Copy</span>
              </button>
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <ShieldCheck size={18} />
                <span className="text-xs mt-1">Credit report</span>
              </button>
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <Lock size={18} />
                <span className="text-xs mt-1">Mark as not complete</span>
              </button>
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <MessageCircle size={18} />
                <span className="text-xs mt-1">Comment</span>
              </button>
              <button className="text-[#6F6F6F] hover:text-[#333333] flex flex-col items-center">
                <Printer size={18} />
                <span className="text-xs mt-1">Preview</span>
              </button>
            </div>
            
            {/* Line Items Table */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                {/* <h3 className="text-lg font-bold text-[#333333]">LINE ITEMS</h3> */}
              </div>
              
              <div className="border border-[#DCDCDC] rounded-lg overflow-hidden min-h-[180px] bg-white">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-left border-b border-[#DADADA]">Item No.</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-left border-b border-[#DADADA]">Name</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">Quantity</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">Unit</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-right border-b border-[#DADADA]">Price per unit</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-right border-b border-[#DADADA]">Discount</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-right border-b border-[#DADADA]">Total</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">VAT</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-left border-b border-[#DADADA]">Account</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">CC</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">PR</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]">CMR %</th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]"></th>
                      <th className="h-8 px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] uppercase tracking-[0.5px] text-center border-b border-[#DADADA]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((item) => (
                      <tr key={item.id} className="h-8 bg-white border-b border-[#E5E5E5] hover:bg-[#F8F9FB]">
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] align-middle">{item.itemNo}</td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-left focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder=""
                            value={item.name}
                            onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="number" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="Unit"
                            value={item.unit}
                            onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-right align-middle">
                          <input 
                            type="number" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-right focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0.00"
                            value={item.pricePerUnit}
                            onChange={(e) => updateLineItem(item.id, 'pricePerUnit', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-right align-middle">
                          <input 
                            type="number" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-right focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0.00"
                            value={item.discount}
                            onChange={(e) => updateLineItem(item.id, 'discount', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-right font-medium align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-right focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0.00"
                            value={item.total}
                            readOnly
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="VAT"
                            value={item.vat}
                            onChange={(e) => updateLineItem(item.id, 'vat', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-left focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="Account"
                            value={item.account}
                            onChange={(e) => updateLineItem(item.id, 'account', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="CC"
                            value={item.cc}
                            onChange={(e) => updateLineItem(item.id, 'cc', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="text" 
                            className="w-full h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="PR"
                            value={item.pr}
                            onChange={(e) => updateLineItem(item.id, 'pr', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-[11px] text-[#2E2E2E] text-center align-middle">
                          <input 
                            type="number" 
                            className="w-12 h-6 border border-[#D0D0D0] rounded-sm px-1 text-xs text-[#2E2E2E] bg-white text-center focus:outline-none focus:border-[#2563EB] placeholder:text-[#9CA3AF]" 
                            placeholder="0"
                            value={item.cmr}
                            onChange={(e) => updateLineItem(item.id, 'cmr', e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-1 text-center align-middle">
                          <button 
                            className="text-[#6B7280] hover:text-[#DC2626]"
                            onClick={() => removeLineItem(item.id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                          </button>
                        </td>
                        <td className="px-2 py-1 text-center align-middle">
                          <div className="cursor-grab text-[#6B7280] hover:text-[#2563EB]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="9" cy="12" r="1"></circle>
                              <circle cx="9" cy="5" r="1"></circle>
                              <circle cx="9" cy="19" r="1"></circle>
                              <circle cx="15" cy="12" r="1"></circle>
                              <circle cx="15" cy="5" r="1"></circle>
                              <circle cx="15" cy="19" r="1"></circle>
                            </svg>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#FAFAFA] border-t-2 border-[#BDBDBD]">
                      <td className="px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] text-right" colSpan={2}>Total Quantity:</td>
                      <td className="px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] text-center">
                        {lineItems.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-[11px] font-semibold text-[#2E2E2E] text-right" colSpan={11}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            {/* Order text + Charges + Language options */}
            <div className="mt-6 flex items-start justify-between gap-6">
              <div className="w-[320px]">
                <label className="block text-[12px] font-medium text-[#4B5563] mb-1">Order text</label>
                <textarea 
                  className="w-full h-16 border border-[#D1D5DB] rounded-md px-2 py-1 text-[13px] text-[#111827] bg-white focus:outline-none focus:border-[#16A34A] resize-none" 
                  placeholder=""
                  value={orderText}
                  onChange={(e) => setOrderText(e.target.value)}
                ></textarea>
                <div className="mt-2 flex items-center">
                  <input 
                    type="checkbox" 
                    id="use-as-order-invoice"
                    className="w-4 h-4 text-[#16A34A] border-[#D1D5DB] rounded focus:ring-transparent"
                  />
                  <label htmlFor="use-as-order-invoice" className="ml-2 text-[12px] font-normal text-[#374151]">Use as order/invoice text.</label>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 w-[420px]">
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Shipping charge</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white text-right focus:outline-none focus:border-[#16A34A]" 
                    placeholder="0.00"
                    value={charges}
                    onChange={(e) => setCharges(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Invoice charge</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white text-right focus:outline-none focus:border-[#16A34A]" 
                    placeholder="0.00"
                    value=""
                    onChange={() => {}}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Invoice number</label>
                  <input 
                    type="text" 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white text-left placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#16A34A]" 
                    placeholder=""
                    value=""
                    onChange={() => {}}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 w-[420px] mt-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Printout template</label>
                  <select 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white appearance-none focus:outline-none focus:border-[#16A34A]"
                    value="Offer"
                    onChange={() => {}}>
                    <option>Offer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] mb-1">Language</label>
                  <select 
                    className="w-full h-9 border border-[#D1D5DB] rounded px-2 text-[13px] text-[#111827] bg-white appearance-none focus:outline-none focus:border-[#16A34A]"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}>
                    <option>English</option>
                    <option>Swedish</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Divider */}
            <div className="my-4 h-px bg-[#E5E7EB]"></div>
            
            {/* Amount Summary (XS Card Layout) */}
            <div className="w-[300px] text-right space-y-2">
  <div className="flex justify-between text-[13px]">
    <span className="text-[#6B7280]">Net</span>
    <span className="font-medium">0.00</span>
  </div>

  <div className="flex justify-between text-[13px]">
    <span className="text-[#6B7280]">Gross</span>
    <span className="font-medium">0.00</span>
  </div>

  <div className="flex justify-between text-[13px]">
    <span className="text-[#6B7280]">Total excl. VAT</span>
    <span className="font-medium">0.00</span>
  </div>

  <div className="flex justify-between text-[13px]">
    <span className="text-[#6B7280]">VAT</span>
    <span className="font-medium">0.00</span>
  </div>

  <div className="flex justify-between text-[14px] font-semibold text-[#EA580C] pt-2">
    <span>To pay</span>
    <span>0.00</span>
  </div>
</div>

            
            {/* Divider */}
            <div className="my-4 h-px bg-[#E5E7EB]"></div>
            
            {/* Action buttons */}
            {/* Action Buttons – XS Sticky Footer */}
<div className="sticky bottom-0 z-30 bg-white border-t border-[#E5E7EB] px-3 py-3">
  <div className="flex items-center justify-between mt-6">
  
  {/* Left */}
  <button className="h-9 px-6 bg-[#D1D5DB] text-white rounded-full text-[13px]">
    Void
  </button>

  {/* Right */}
  <div className="flex items-center gap-2">
    <button className="h-9 px-5 bg-[#9CA3AF] text-white rounded-full text-[13px]">
      Cancel
    </button>

    <button className="h-9 px-5 bg-[#15803D] text-white rounded-full text-[13px]">
      Save
    </button>

    <div className="flex items-center border rounded-full overflow-hidden">
      <button className="h-9 px-4 bg-white text-[#111827] text-[13px]">
        Printout
      </button>
      <button className="h-9 px-4 bg-[#15803D] text-white flex items-center gap-1 text-[13px]">
        Send <ArrowRight size={14} />
      </button>
    </div>

    <button className="h-9 px-6 bg-[#0F7A3D] text-white rounded-full flex items-center gap-2 text-[13px]">
      Create order <ChevronDown size={14} />
    </button>
  </div>
</div>

</div>

          </div>
        ) : (
          // List View (Original Content)
          <>
            {/* Top Navigation Bar */}
            <div className="h-14 bg-white border-b border-[#E5E5E5] flex items-center">
              <div className="h-[56px] flex items-center">
                <div className="relative h-[56px] px-4 flex items-center cursor-pointer font-sans text-[14px] font-medium text-[#4A4A4A] hover:text-[#000000] transition-colors duration-150">
                  <span className="font-semibold text-[#1F1F1F]">Order</span>
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2E7D32]"></div>
                </div>
              </div>
              <div className="ml-auto flex items-center space-x-6">
                {/* <div className="text-sm text-[#4A4A4A] hover:text-[#000000] cursor-pointer">Reports</div> */}
                {/* <div className="text-sm text-[#4A4A4A] hover:text-[#000000] cursor-pointer relative">
                  Register
                  <ChevronDown size={16} className="absolute top-0.5 right-[-18px] text-[#4A4A4A]" />
                </div> */}
              </div>
            </div>

            {/* Header Section */}
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold tracking-[0.4px] text-[#1F1F1F] uppercase">ORDER – LIST</h1>
              <div className="flex items-center space-x-4">
                <button className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold rounded-full h-10 px-4 flex items-center text-sm"
                onClick={async () => {
                  setIsLoading(true);
                  setIsCreatingOrder(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setShowCreateOrderForm(true);
                  setIsLoading(false);
                }}>
                  {isLoading ? (
                    <img
                      src={loadingGif}
                      alt="loading"
                      className="w-4 h-4 mr-2"
                    />
                  ) : (
                    <Plus size={16} className="mr-2" />
                  )}
                  {isLoading ? 'Loading...' : 'Create order'}
                </button>
                <button className="text-sm text-[#4A4A4A] hover:text-[#000000] flex items-center">
                  <Printer size={18} className="mr-1" />
                  Print list
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center space-x-4">
              <div className="relative w-[360px]">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9E9E9E]" />
                <input
                  placeholder="Order no., Customer no., Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 border border-[#DADADA] rounded pl-10 pr-3 text-sm"
                />
              </div>
              <button 
                className="text-[#1976D2] text-xs hover:underline"
                onClick={() => setExtendedSearchOpen(!extendedSearchOpen)}
              >
                {extendedSearchOpen ? 'close extended search' : 'extended search'}
              </button>
            </div>
            
            {/* Extended Search Panel */}
            {extendedSearchOpen && (
              <div className="bg-white border-t border-b border-[#E5E5E5] p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Basic Details Section */}
                  <div className="col-span-4">
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setBasicDetailsExpanded(!basicDetailsExpanded)}>
                      <h3 className="text-base font-semibold text-[#1F1F1F] flex items-center">
                        {basicDetailsExpanded ? <ChevronDown size={16} className="text-[#2E7D32] mr-2" /> : <ChevronRight size={16} className="text-[#2E7D32] mr-2" />}
                        Basic details
                      </h3>
                    </div>
                    
                    {basicDetailsExpanded && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Order number</label>
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder=""
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Customer number</label>
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder=""
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Customer name</label>
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder=""
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Status</label>
                            <select 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] appearance-none bg-white relative"
                            >
                              <option value="">All</option>
                              <option value="active">Active</option>
                              <option value="due">Due</option>
                              <option value="order-created">Order/Invoice Created</option>
                              <option value="voided">Voided</option>
                              <option value="failed">Failed</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-4">
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">View complete orders</label>
                            <div className="flex gap-1">
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-[#E0E0E0] text-[#757575] text-xs font-medium">Complete</button>
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-[#E0E0E0] text-[#757575] text-xs font-medium">Not done</button>
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-white text-[#212121] text-xs font-semibold">All</button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-[#424242] mb-1">Show sent order</label>
                            <div className="flex gap-1">
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-[#E0E0E0] text-[#757575] text-xs font-medium">Sent</button>
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-[#E0E0E0] text-[#757575] text-xs font-medium">Not sent</button>
                              <button className="h-9 px-3 border border-[#CFCFCF] bg-white text-[#212121] text-xs font-semibold">All</button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Order Details Section */}
                  <div className="col-span-4">

  {/* Header */}
  <button
    type="button"
    onClick={() => setOrderDetailsExpanded(prev => !prev)}
    className="w-full flex items-center justify-between mb-4 cursor-pointer focus:outline-none"
  >
    <h3 className="flex items-center text-base font-semibold text-[#1F1F1F]">

      {/* Angle / Chevron Icon */}
      <ChevronRight
        size={16}
        className={`
          mr-2 text-[#2E7D32]
          transition-transform duration-200 ease-in-out
          ${orderDetailsExpanded ? "rotate-90" : "rotate-0"}
        `}
      />

      Order details
    </h3>
  </button>

  {/* Expand / Collapse Content */}
  <div
    className={`
      grid overflow-hidden transition-all duration-300 ease-in-out
      ${orderDetailsExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
    `}
  >
    <div className="min-h-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

        {/* Example Field */}
        <div>
          <label className="block text-xs font-medium text-[#424242] mb-1">
            Our reference
          </label>
          <input
            type="text"
            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 text-sm
                       focus:outline-none focus:border-[#1976D2]
                       focus:ring-1 focus:ring-[#1976D2]/15"
          />
        </div>

        {/* (rest of your inputs stay unchanged) */}

      </div>
    </div>
  </div>
</div>

                  
                  {/* Order Content Section */}
                  <div className="col-span-4">
                    <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setOrderContentExpanded(!orderContentExpanded)}>
                      <h3 className="text-base font-semibold text-[#1F1F1F] flex items-center">
                        {orderContentExpanded ? <ChevronDown size={16} className="text-[#2E7D32] mr-2" /> : <ChevronRight size={16} className="text-[#2E7D32] mr-2" />}
                        Order content
                      </h3>
                    </div>
                    
                    {orderContentExpanded && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        <div>
                          <label className="block text-xs font-medium text-[#424242] mb-1">Item number</label>
                          <input 
                            type="text" 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-[#424242] mb-1">Account (from)</label>
                          <input 
                            type="text" 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-[#424242] mb-1">Account (to)</label>
                          <input 
                            type="text" 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                            placeholder=""
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-[#424242] mb-1">Amount type</label>
                          <select 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] appearance-none bg-white relative"
                          >
                            <option value="">Total incl. VAT</option>
                          </select>
                        </div>
                        
                        <div className="lg:col-span-2">
                          <label className="block text-xs font-medium text-[#424242] mb-1">Item name</label>
                          <input 
                            type="text" 
                            className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                            placeholder=""
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="block text-xs font-medium text-[#424242] mb-1">Amount range</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder="From"
                            />
                            <input 
                              type="text" 
                              className="w-full h-9 border border-[#CFCFCF] rounded px-2.5 py-2 text-sm text-[#212121] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1976D2] focus:ring-1 focus:ring-[#1976D2]/15" 
                              placeholder="To"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="col-span-4 flex justify-end gap-3 mt-4 pt-4 border-t border-[#E0E0E0]">
                    <button className="h-10 bg-[#9E9E9E] hover:bg-[#757575] text-white px-6 rounded-full text-sm font-semibold">
                      Clear
                    </button>
                    <button className="h-10 bg-[#8D8D8D] hover:bg-[#6F6F6F] text-white px-7 rounded-full text-sm font-semibold">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2">
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getOrderFilterColor('all')} ${orderFilter === 'all' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setOrderFilter('all');
                  setIsLoading(false);
                }}
              >
                All
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getOrderFilterColor('active')} ${orderFilter === 'active' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setOrderFilter('active');
                  setIsLoading(false);
                }}
              >
                <span className={`${orderFilter === 'active' ? 'bg-gradient-to-r from-white to-[#FFC6C6]' : ''} h-full w-full flex items-center justify-center rounded`}>
                  Active
                </span>
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getOrderFilterColor('due')} ${orderFilter === 'due' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setOrderFilter('due');
                  setIsLoading(false);
                }}
              >
                Due
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getOrderFilterColor('order/invoices-created')} ${orderFilter === 'order/invoices-created' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setOrderFilter('order/invoices-created');
                  setIsLoading(false);
                }}
              >
                Order/invoices created
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getOrderFilterColor('voided')} ${orderFilter === 'voided' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setOrderFilter('voided');
                  setIsLoading(false);
                }}
              >
                Voided
              </button>
              <button
                className={`h-8 px-3 text-xs font-medium rounded ${getOrderFilterColor('failed')} ${orderFilter === 'failed' ? 'font-semibold border-[#9E9E9E]' : ''}`}
                onClick={async () => {
                  setIsLoading(true);
                  await new Promise(resolve => setTimeout(resolve, 500));
                  setOrderFilter('failed');
                  setIsLoading(false);
                }}
              >
                Failed
              </button>
              <div className="flex-1"></div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-[#BDBDBD] rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#BDBDBD]"></div>
                </div>
                <span className="text-xs text-[#1F1F1F]">{selectedOrders.length} -</span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-[#E0E0E0] rounded-lg overflow-hidden relative">
              {loadingColumn !== null && (
                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-10">
                  <img
                    src={loadingGif}
                    alt="loading"
                    className="w-8 h-8"
                  />
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">

                  {/* ================= TABLE HEADER ================= */}
                  <thead className="bg-[#FAFAFA]">
                    <tr>

                      {/* MASTER CHECKBOX */}
                      <th
                        onClick={() => handleColumnClick('select')}
                        className={`h-11 w-12 border-b-2 border-[#BDBDBD] text-center cursor-pointer select-none relative ${
                          activeColumn === 'select' ? 'bg-[#B8B8B8]' : 'bg-[#FAFAFA]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {loadingColumn === 'select' ? (
                            <img
                              src={loadingGif}
                              alt="loading"
                              className="w-4 h-4"
                            />
                          ) : null}
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSelectAll(checked);
                              setSelectedRows(checked ? [1, 2, 3] : []);
                            }}
                            className="w-4 h-4"
                          />
                        </div>
                      </th>

                      {[
                        "Order No.",
                        "Customer No.",
                        "Name",
                        "Order Date",
                        "Valid To",
                        "Total",
                        "Order value",
                        "Currency",
                      ].map((col, index) => (
                        <th
                          key={col}
                          onClick={() => handleColumnClick(index)}
                          className={`h-11 px-6 border-b-2 border-[#BDBDBD]
                            text-left text-xs font-bold uppercase tracking-wider
                            cursor-pointer select-none relative
                            ${activeColumn === index ? "bg-[#B8B8B8]" : "bg-[#FAFAFA]"}`}
                        >
                          <div className="flex items-center gap-2">
                            {loadingColumn === index ? (
                              <img
                                src={loadingGif}
                                alt="loading"
                                className="w-4 h-4"
                              />
                            ) : null}
                            <span>{col}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* ================= TABLE BODY ================= */}
                  <tbody>

                    {[1, 2, 3].map((row) => (
                      <tr
                        key={row}
                        onClick={() => toggleRow(row)}
                        className="border-b border-[#E0E0E0] hover:bg-[#F5F5F5] cursor-pointer"
                      >

                        {/* ROW CHECKBOX */}
                        <td
                          className="h-14 text-center"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(row)}
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleRow(row)}
                            className="w-4 h-4"
                          />
                        </td>

                        {/* EMPTY COLUMNS */}
                        <td className="h-14 px-6"></td>
                        <td className="h-14 px-6"></td>
                        <td className="h-14 px-6"></td>
                        <td className="h-14 px-6"></td>

                        {/* VALID TO */}
                        <td className="h-14 px-6"></td>

                        {/* TOTAL */}
                        <td
                          className="h-14 px-6 text-right font-medium"
                        >
                          0,00
                        </td>

                        {/* ORDER VALUE */}
                        <td
                          className="h-14 px-6 text-right font-medium"
                        >
                          0,00
                        </td>

                        {/* CURRENCY */}
                        <td
                          className="h-14 px-6"
                        >
                          SEK
                        </td>
                      </tr>
                    ))}

                    {/* ================= TOTAL ROW ================= */}
                    <tr className="bg-[#F9FAFB] font-semibold">
                      <td className="h-14"></td>
                      <td colSpan={4}></td>

                      <td className="h-14 px-6 text-right">Total SEK</td>
                      <td className="h-14 px-6 text-right">0,00</td>
                      <td className="h-14 px-6 text-right">0,00</td>
                      <td></td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            
            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] py-3 px-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-[#66BB6A] border-[#BDBDBD] rounded focus:ring-transparent" />
                  <span className="ml-2 text-sm text-[#4A4A4A]">Selection</span>
                </div>
                <div className="text-sm text-[#4A4A4A]">({selectedOrders.length} selected)</div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#4A4A4A]">Template</span>
                  <select className="h-8 px-3 border border-[#D1D1D1] rounded text-sm text-[#4A4A4A] bg-white focus:outline-none">
                    <option>Default template</option>
                  </select>
                </div>
                
                <button className="h-8 px-4 bg-[#8E8E8E] text-white text-sm font-medium rounded">
                  Preview
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#4A4A4A]">Distribution method</span>
                  <select className="h-8 px-3 border border-[#D1D1D1] rounded text-sm text-[#4A4A4A] bg-white focus:outline-none">
                    <option>Default</option>
                  </select>
                </div>
                
                <button className="h-8 px-4 bg-[#FFC107] text-black text-sm font-medium rounded">
                  Send
                </button>
                
                <button className="h-8 px-4 bg-[#8BC34A] text-white text-sm font-medium rounded">
                  Create order
                </button>
              </div>
            </div>
            
          </>
        )}
        
      </div>
    </div>
  );
};
export default OrderPage;
