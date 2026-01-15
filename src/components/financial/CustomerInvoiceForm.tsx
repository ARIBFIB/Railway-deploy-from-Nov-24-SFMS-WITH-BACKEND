import React, { useState, useEffect } from 'react';
import { Plus, List, FileText, Wallet, Copy, Check, Lock, MessageCircle, Printer, ChevronDown, ChevronRight, Calendar, Image, Send, Save } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { itemService } from '../../services/itemService';
import type { Item } from '../../services/itemService';
import { invoiceService } from '../../services/invoiceService';

interface CustomerInvoiceFormProps {
  onCancel: () => void;
  onSave: (invoiceData: any) => void;
}

export const CustomerInvoiceForm: React.FC<CustomerInvoiceFormProps> = ({ onCancel, onSave }) => {
  const [invoiceDetailsExpanded, setInvoiceDetailsExpanded] = useState(false);
  const [customerDetailsExpanded, setCustomerDetailsExpanded] = useState(false);
  const [deliveryInfoExpanded, setDeliveryInfoExpanded] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showItemDropdown, setShowItemDropdown] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedItemRowIndex, setSelectedItemRowIndex] = useState<number | null>(null);
  const [lineItems, setLineItems] = useState<any[]>([
    { id: 1, itemNumber: '', name: '', quantity: 1, unit: '', price: 0, discount: 0, total: 0, vat: 0, account: '', cmr: 0 }
  ]);
  const [shippingFee, setShippingFee] = useState(0);
  const [invoiceFee, setInvoiceFee] = useState(0);
  const [invoiceDiscountPercent, setInvoiceDiscountPercent] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
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

  // Calculate line item total
  const calculateLineTotal = (quantity: number, price: number, discount: number) => {
    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  // Calculate all totals
  const calculateTotals = () => {
    const lineTotals = lineItems.map(item =>
      calculateLineTotal(item.quantity, item.price, item.discount)
    );

    const subtotal = lineTotals.reduce((sum, total) => sum + total, 0);
    const totalWithFees = subtotal + shippingFee + invoiceFee;

    // Apply invoice discount
    const invoiceDiscountAmount = totalWithFees * (invoiceDiscountPercent / 100);
    const discountedTotal = totalWithFees - invoiceDiscountAmount;

    // Calculate VAT (assuming 25% average VAT for simplicity)
    const vatAmount = discountedTotal * 0.25;

    const grossTotal = discountedTotal + vatAmount;

    return {
      net: discountedTotal,
      gross: grossTotal,
      totalExclVat: discountedTotal,
      roundOff: 0,
      vat: vatAmount,
      toPay: grossTotal
    };
  };

  // Handle basic save (Draft)
  const handleSaveInvoice = async (asDraft: boolean = true) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundationId = userData.foundationId || userData.foundation_id || '12345678-1234-1234-1234-123456789012';

      const formattedItems = lineItems.map(item => ({
        description: item.name || item.itemNumber || 'Item',
        quantity: item.quantity,
        unit_price: item.price,
        unit: item.unit,
        discount_percent: item.discount,
        vat_rate: item.vat,
        product_id: item.productId || (typeof item.id === 'string' && item.id.includes('-') ? item.id : null)
      }));

      const payload = {
        foundation_id: foundationId,
        customer_id: selectedCustomerId,

        invoice_date: invoiceData.invoiceDate,
        due_date: invoiceData.dueDate,
        payment_terms: invoiceData.paymentTerms,
        invoice_type: invoiceData.invoiceType,
        currency: invoiceData.currency,

        invoice_address: invoiceData.invoiceAddress,
        invoice_address_2: invoiceData.invoiceAddress2,
        postcode: invoiceData.postcode,
        city: invoiceData.city,
        country: invoiceData.country,
        cin: invoiceData.cin,

        your_order_number: invoiceData.yourOrderNumber,
        your_reference: invoiceData.yourReference,
        our_reference: invoiceData.ourReference,

        delivery_name: invoiceData.deliveryName,
        delivery_address: invoiceData.deliveryAddress,
        delivery_address_2: invoiceData.deliveryAddress2,
        delivery_postcode: invoiceData.deliveryPostcode,
        delivery_city: invoiceData.deliveryCity,
        delivery_country: invoiceData.deliveryCountry,
        delivery_date: invoiceData.deliveryDate || null,
        delivery_method: invoiceData.deliveryMethod,

        shipping_fee: shippingFee,
        invoice_fee: invoiceFee,
        invoice_discount_percent: invoiceDiscountPercent,
        price_list: invoiceData.priceList,
        prices_incl_vat: invoiceData.pricesInclVat === 'yes',

        email: invoiceData.email,
        phone: invoiceData.phone,

        items: formattedItems
      };

      const response = await invoiceService.createInvoice(foundationId, payload);
      const createdInvoice = response.invoice || response.data || response;

      // First save the invoice successfully
      if (!asDraft) {
        try {
          await invoiceService.sendInvoice(createdInvoice.id, foundationId);
          alert('Invoice posted and sent successfully!');
        } catch (sendError) {
          console.error('Failed to send invoice:', sendError);
          alert('Invoice created successfully but failed to send. Invoice remains in draft status.');
        }
      } else {
        alert('Invoice saved as draft!');
      }

      onSave(createdInvoice);

    } catch (error) {
      console.error('Failed to save invoice:', error);
      alert('Failed to save invoice. Please check console for details.');
    }
  };

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const foundationId = userData.foundationId || userData.foundation_id || '12345678-1234-1234-1234-123456789012';

        const customersData = await customerService.getCustomers(foundationId);

        const transformedCustomers = customersData.map((customer: any) => ({
          id: customer.id,
          customerId: customer.customer_number,
          name: customer.name,
          orgPersonNumber: customer.corporate_personal_id || '',
          postalCode: '',
          city: '',
          country: '',
          phone: '',
          email: '',
          invoiceAddress: '',
          invoiceAddress2: '',
          cin: customer.corporate_personal_id || '',
          ...customer
        }));

        setCustomers(transformedCustomers);
        setFilteredCustomers(transformedCustomers);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  // Fetch items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const foundationId = userData.foundationId || userData.foundation_id || '12345678-1234-1234-1234-123456789012';

        const { data, error } = await itemService.getItems(foundationId);

        if (error) {
          console.error('Error fetching items:', error);
          setItems([]);
        } else {
          setItems(data || []);
          setFilteredItems(data || []);
        }
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };

    fetchItems();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowCustomerDropdown(false);
        setShowItemDropdown(false);
        setSelectedItemRowIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));

    if (field === 'customer') {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(value.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(value.toLowerCase()) ||
        customer.orgPersonNumber.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowCustomerDropdown(value.length > 0);
    }
  };

  const handleCustomerSelect = async (customer: any) => {
    try {
      setSelectedCustomerId(customer.id);
      const customerDetails = await customerService.getCustomerById(customer.id);

      if (customerDetails.success && customerDetails.data) {
        const detailedCustomer: any = customerDetails.data;

        const billingAddress = detailedCustomer.customer_addresses?.find((addr: any) => addr.address_type === 'billing') || {};
        const deliveryAddress = detailedCustomer.customer_addresses?.find((addr: any) => addr.address_type === 'delivery') || billingAddress;
        const contactInfo = detailedCustomer.customer_contacts?.[0] || {};

        setInvoiceData(prev => ({
          ...prev,
          customer: `${detailedCustomer.customer_number} - ${detailedCustomer.name}`,
          name: detailedCustomer.name,
          invoiceAddress: billingAddress.address || '',
          invoiceAddress2: billingAddress.address2 || '',
          postcode: billingAddress.postal_code || '',
          city: billingAddress.city || '',
          country: billingAddress.country || '',
          phone: contactInfo.phone || '',
          email: contactInfo.email || '',
          cin: detailedCustomer.corporate_personal_id || '',
          deliveryName: deliveryAddress.name || detailedCustomer.name,
          deliveryAddress: deliveryAddress.address || billingAddress.address || '',
          deliveryAddress2: deliveryAddress.address2 || billingAddress.address2 || '',
          deliveryPostcode: deliveryAddress.postal_code || billingAddress.postal_code || '',
          deliveryCity: deliveryAddress.city || billingAddress.city || '',
          deliveryCountry: deliveryAddress.country || billingAddress.country || ''
        }));
      } else {
        setInvoiceData(prev => ({
          ...prev,
          customer: `${customer.customerId} - ${customer.name}`,
          name: customer.name,
          invoiceAddress: customer.invoiceAddress || '',
          invoiceAddress2: customer.invoiceAddress2 || '',
          postcode: customer.postalCode || '',
          city: customer.city || '',
          country: customer.country || '',
          phone: customer.phone || '',
          email: customer.email || '',
          cin: customer.cin || '',
          deliveryName: customer.name,
          deliveryAddress: customer.invoiceAddress || '',
          deliveryPostcode: customer.postalCode || '',
          deliveryCity: customer.city || '',
          deliveryCountry: customer.country || ''
        }));
      }
    } catch (error) {
      console.error('Failed to fetch customer details:', error);
      setInvoiceData(prev => ({
        ...prev,
        customer: `${customer.customerId} - ${customer.name}`,
        name: customer.name,
        invoiceAddress: customer.invoiceAddress || '',
        invoiceAddress2: customer.invoiceAddress2 || '',
        postcode: customer.postalCode || '',
        city: customer.city || '',
        country: customer.country || '',
        phone: customer.phone || '',
        email: customer.email || '',
        cin: customer.cin || '',
        deliveryName: customer.name,
        deliveryAddress: customer.invoiceAddress || '',
        deliveryPostcode: customer.postalCode || '',
        deliveryCity: customer.city || '',
        deliveryCountry: customer.country || ''
      }));
    }

    setShowCustomerDropdown(false);
  };

  const handleItemSelect = (item: Item, rowIndex: number) => {
    const updatedItems = [...lineItems];
    updatedItems[rowIndex] = {
      ...updatedItems[rowIndex],
      itemNumber: item.item_number,
      name: item.name,
      unit: item.unit || 'pcs',
      price: item.cost_calculation,
      vat: parseFloat(item.vat) || 0,
      account: item.sale_account || '',
      productId: item.id, // Store valid UUID
      total: calculateLineTotal(1, item.cost_calculation, 0)
    };

    setLineItems(updatedItems);

    const tableRow = document.querySelector(`tr[data-row-index="${rowIndex}"]`) ||
      document.querySelector('tbody tr');

    if (tableRow) {
      const inputs = tableRow.querySelectorAll('input');

      if (inputs[0]) inputs[0].value = item.item_number;
      if (inputs[1]) inputs[1].value = item.name;
      if (inputs[3]) inputs[3].value = item.unit || 'pcs';
      if (inputs[4]) inputs[4].value = item.cost_calculation.toString();
      if (inputs[7]) inputs[7].value = item.vat || '0';
      if (inputs[8]) inputs[8].value = item.sale_account || '';

      const totalCell = tableRow.querySelector('td:nth-child(7)');
      if (totalCell) {
        totalCell.textContent = item.cost_calculation.toFixed(2);
      }
    }

    setShowItemDropdown(false);
    setSelectedItemRowIndex(null);
  };

  const handleItemInputChange = (value: string, rowIndex: number) => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(value.toLowerCase()) ||
      item.item_number.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredItems(filtered);
    setShowItemDropdown(value.length > 0);
    setSelectedItemRowIndex(rowIndex);
  };

  const updateLineItem = (index: number, field: string, value: any) => {
    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (['quantity', 'price', 'discount'].includes(field)) {
      const item = updatedItems[index];
      updatedItems[index].total = calculateLineTotal(
        item.quantity,
        item.price,
        item.discount
      );
    }

    setLineItems(updatedItems);
  };

  const handleFeeChange = (feeType: 'shipping' | 'invoice', value: string) => {
    const numericValue = parseFloat(value) || 0;
    if (feeType === 'shipping') {
      setShippingFee(numericValue);
    } else {
      setInvoiceFee(numericValue);
    }
  };

  const handleInvoiceDiscountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setInvoiceDiscountPercent(Math.max(0, Math.min(100, numericValue)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveInvoice(true);
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <div className="max-w-[1280px] mx-auto p-6">
        <div className="bg-white rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold text-[#1A1A1A]">CUSTOMER INVOICE NEW</h1>
              <div className="flex gap-4 mt-2 text-xs text-[#757575]">
                <span>OCR: 133*</span>
                <span>VER.NR: B1*</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSaveInvoice(true)}
                className="bg-[#8E8E8E] text-white rounded-full h-9 px-4 flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Save Draft
              </button>
              <button
                onClick={() => handleSaveInvoice(false)}
                className="bg-[#2E7D32] text-white rounded-full h-9 px-4 flex items-center gap-2 text-sm hover:bg-[#1B5E20]"
              >
                <Save size={16} />
                Save & Send
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
                className={`flex flex-col items-center gap-1 ${action.disabled ? 'text-[#BDBDBD]' : 'text-[#4A4A4A] hover:text-[#000000]'
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
              <div className="relative">
                <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Customer *</label>
                <input
                  type="text"
                  placeholder="Customer no., Name, CIN/PIN"
                  className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                  value={invoiceData.customer}
                  onChange={(e) => handleInputChange('customer', e.target.value)}
                  onFocus={() => setShowCustomerDropdown(true)}
                />

                {/* Customer Dropdown */}
                {showCustomerDropdown && filteredCustomers.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-[#DADADA] rounded shadow-lg max-h-60 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-[#F5F5F5] sticky top-0">
                        <tr>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-[#333333] border-b border-[#DADADA]">Customer No.</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-[#333333] border-b border-[#DADADA]">Name</th>
                          <th className="text-left py-2 px-3 text-xs font-semibold text-[#333333] border-b border-[#DADADA]">CIN/PIN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer) => (
                          <tr
                            key={customer.id}
                            className="hover:bg-[#FAFAFA] border-b border-[#E0E0E0] cursor-pointer"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <td className="py-2 px-3 text-sm text-[#444444]">{customer.customerId}</td>
                            <td className="py-2 px-3 text-sm text-[#444444]">{customer.name}</td>
                            <td className="py-2 px-3 text-sm text-[#444444]">{customer.orgPersonNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                    className={`flex-1 py-2 text-sm ${invoiceData.invoiceType === 'invoice'
                      ? 'bg-[#E0E0E0] text-[#1A1A1A]'
                      : 'text-[#757575]'
                      }`}
                    onClick={() => handleInputChange('invoiceType', 'invoice')}
                  >
                    Invoice
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm ${invoiceData.invoiceType === 'cash invoice'
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
                    className={`flex-1 py-2 text-sm ${invoiceData.creditNote === 'yes'
                      ? 'bg-[#E0E0E0] text-[#1A1A1A]'
                      : 'bg-[#F5F5F5] text-[#757575]'
                      }`}
                    onClick={() => handleInputChange('creditNote', 'yes')}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 text-sm ${invoiceData.creditNote === 'no'
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
                        className={`flex-1 py-2 text-sm ${invoiceData.pricesInclVat === 'yes'
                          ? 'bg-[#E0E0E0] text-[#1A1A1A]'
                          : 'bg-[#F5F5F5] text-[#757575]'
                          }`}
                        onClick={() => handleInputChange('pricesInclVat', 'yes')}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 text-sm ${invoiceData.pricesInclVat === 'no'
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

                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Currency</label>
                    <select
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                    >
                      <option>SEK</option>
                      <option>EUR</option>
                      <option>USD</option>
                    </select>
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Unit</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Type of VAT</label>
                    <select
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.typeOfVat}
                      onChange={(e) => handleInputChange('typeOfVat', e.target.value)}
                    >
                      <option value="">Standard</option>
                      <option value="reduced">Reduced</option>
                      <option value="exempt">Exempt</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsible Section – Customer Details */}
          <div className="bg-white rounded-lg mb-6">
            <div
              className="flex items-center justify-between p-4 border-b border-[#E0E0E0] cursor-pointer"
              onClick={() => setCustomerDetailsExpanded(!customerDetailsExpanded)}
            >
              <div className="flex items-center">
                {customerDetailsExpanded ? (
                  <ChevronDown className="text-[#2E7D32]" size={16} />
                ) : (
                  <ChevronRight className="text-[#2E7D32]" size={16} />
                )}
                <span className="text-sm font-semibold text-[#1A1A1A] ml-2">Customer details</span>
              </div>
            </div>

            {customerDetailsExpanded && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Address</label>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">CIN/PIN</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.cin}
                      onChange={(e) => handleInputChange('cin', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Address 2</label>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Email for reminders</label>
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

          {/* Collapsible Section – Delivery Information */}
          <div className="bg-white rounded-lg mb-6">
            <div
              className="flex items-center justify-between p-4 border-b border-[#E0E0E0] cursor-pointer"
              onClick={() => setDeliveryInfoExpanded(!deliveryInfoExpanded)}
            >
              <div className="flex items-center">
                {deliveryInfoExpanded ? (
                  <ChevronDown className="text-[#2E7D32]" size={16} />
                ) : (
                  <ChevronRight className="text-[#2E7D32]" size={16} />
                )}
                <span className="text-sm font-semibold text-[#1A1A1A] ml-2">Delivery information</span>
              </div>
            </div>

            {deliveryInfoExpanded && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Address</label>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Delivery method</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryMethod}
                      onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                    />
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
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Address 2</label>
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
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  <div>
                    <label className="block text-xs font-medium text-[#4A4A4A] mb-1">Delivery terms</label>
                    <input
                      type="text"
                      className="w-full h-9 border border-[#DADADA] rounded text-sm px-3"
                      value={invoiceData.deliveryTerms}
                      onChange={(e) => handleInputChange('deliveryTerms', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Line Items Section */}
          <div className="bg-white rounded-lg p-6 mb-6 overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#E0E0E0]">
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-24">Item number</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-64">Item name</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-20">Quantity</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-20">Unit</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-24">Price</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-20">Discount %</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-24">Total</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-16">VAT %</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-20">Account</th>
                  <th className="text-left py-3 px-2 text-xs font-medium text-[#757575] w-20">CMR</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, index) => (
                  <tr key={item.id} className="border-b border-[#F5F5F5]" data-row-index={index}>
                    <td className="py-2 px-2 relative">
                      <input
                        type="text"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2"
                        value={item.itemNumber}
                        onChange={(e) => {
                          updateLineItem(index, 'itemNumber', e.target.value);
                          handleItemInputChange(e.target.value, index);
                        }}
                      />
                      {showItemDropdown && selectedItemRowIndex === index && filteredItems.length > 0 && (
                        <div className="absolute z-20 w-80 mt-1 bg-white border border-[#DADADA] rounded shadow-lg max-h-60 overflow-y-auto">
                          {filteredItems.map((product) => (
                            <div
                              key={product.id}
                              className="p-2 hover:bg-[#F5F5F5] cursor-pointer border-b border-[#F0F0F0]"
                              onClick={() => handleItemSelect(product, index)}
                            >
                              <div className="font-medium text-sm">{product.item_number}</div>
                              <div className="text-xs text-gray-500">{product.name}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2"
                        value={item.name}
                        onChange={(e) => {
                          updateLineItem(index, 'name', e.target.value);
                          handleItemInputChange(e.target.value, index);
                        }}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2 text-right"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2"
                        value={item.unit}
                        onChange={(e) => updateLineItem(index, 'unit', e.target.value)}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2 text-right"
                        value={item.price}
                        onChange={(e) => updateLineItem(index, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="number"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2 text-right"
                        value={item.discount}
                        onChange={(e) => updateLineItem(index, 'discount', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-sm">
                      {item.total.toFixed(2)}
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2 text-right"
                        value={item.vat}
                        onChange={(e) => updateLineItem(index, 'vat', parseFloat(e.target.value) || 0)}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2"
                        value={item.account}
                        onChange={(e) => updateLineItem(index, 'account', e.target.value)}
                      />
                    </td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        className="w-full h-9 border border-[#DADADA] rounded text-sm px-2"
                        value={item.cmr}
                        onChange={(e) => updateLineItem(index, 'cmr', e.target.value)}
                      />
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = lineItems.filter((_, i) => i !== index);
                          setLineItems(newItems);
                        }}
                        className="text-[#757575] hover:text-[#D32F2F]"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              type="button"
              onClick={() => setLineItems([...lineItems, { id: lineItems.length + 1, itemNumber: '', name: '', quantity: 1, unit: '', price: 0, discount: 0, total: 0, vat: 0, account: '', cmr: 0 }])}
              className="mt-4 flex items-center gap-2 text-[#2E7D32] text-sm font-medium"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>

          {/* Footer Totals */}
          <div className="bg-white rounded-lg p-6">
            <div className="flex justify-end">
              <div className="w-80">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-[#4A4A4A]">Net</span>
                  <span className="font-medium">{calculateTotals().net.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2 text-sm">
                  <span className="text-[#4A4A4A]">Freight</span>
                  <div className="w-24">
                    <input
                      type="number"
                      className="w-full h-7 border border-[#DADADA] rounded text-right px-2 text-sm"
                      value={shippingFee}
                      onChange={(e) => handleFeeChange('shipping', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between py-2 text-sm">
                  <span className="text-[#4A4A4A]">Exp. fee</span>
                  <div className="w-24">
                    <input
                      type="number"
                      className="w-full h-7 border border-[#DADADA] rounded text-right px-2 text-sm"
                      value={invoiceFee}
                      onChange={(e) => handleFeeChange('invoice', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between py-2 text-sm">
                  <span className="text-[#4A4A4A]">Invoice discount %</span>
                  <div className="w-24">
                    <input
                      type="number"
                      className="w-full h-7 border border-[#DADADA] rounded text-right px-2 text-sm"
                      value={invoiceDiscountPercent}
                      onChange={(e) => handleInvoiceDiscountChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between py-2 text-sm border-t border-[#E0E0E0] mt-2 pt-2">
                  <span className="text-[#4A4A4A]">Total excl. VAT</span>
                  <span className="font-medium">{calculateTotals().totalExclVat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2 text-sm">
                  <span className="text-[#4A4A4A]">Round-off</span>
                  <span>{calculateTotals().roundOff.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-2 text-sm">
                  <span className="text-[#4A4A4A]">VAT</span>
                  <span>{calculateTotals().vat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between py-3 text-lg font-bold border-t-2 border-[#E0E0E0] mt-2">
                  <span>To pay</span>
                  <span>{calculateTotals().toPay.toFixed(2)} {invoiceData.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div >
  );
};