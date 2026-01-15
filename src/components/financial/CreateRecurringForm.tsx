import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Truck, FileText, ArrowUpDown, X } from 'lucide-react';
import { customerService } from '../../services/customerService';
import { itemService } from '../../services/itemService';
import type { Item } from '../../services/itemService';

interface CreateRecurringFormProps {
  onCancel: () => void;
  onSave: (recurringData: any) => void;
}

export const CreateRecurringForm: React.FC<CreateRecurringFormProps> = ({ onCancel, onSave }) => {
  const [activeTab, setActiveTab] = useState('customer');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [textRows, setTextRows] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [itemDropdownOpen, setItemDropdownOpen] = useState(false);
  const [showCustomerPopup, setShowCustomerPopup] = useState(false);
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);
  const [showInvoicePopup, setShowInvoicePopup] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [recurringData, setRecurringData] = useState({
    customer: '',
    invoiceText: '',
    // Add other fields as needed
  });

  // Calculate financial summary
  const calculateSummary = () => {
    let netTotal = 0;
    let vatTotal = 0;
    
    textRows.forEach(row => {
      const amount = parseFloat(row.amount) || 0;
      const price = parseFloat(row.price) || 0;
      const discount = parseFloat(row.discount) || 0;
      const vatPercent = parseFloat(row.vat) || 0;
      
      // Calculate line total (amount * price * (1 - discount/100))
      const lineTotal = amount * price * (1 - discount / 100);
      
      // Add to net total
      netTotal += lineTotal;
      
      // Calculate VAT for this line
      const lineVat = lineTotal * (vatPercent / 100);
      vatTotal += lineVat;
    });
    
    const toPay = netTotal + vatTotal;
    
    return {
      net: netTotal,
      vat: vatTotal,
      toPay: toPay
    };
  };
  
  // Get calculated values
  const summary = calculateSummary();

  // Fetch customers and items on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const foundationId = userData.foundationId || userData.foundation_id;
        
        console.log('Fetching data for foundation:', foundationId);
        
        if (foundationId) {
          // Fetch customers
          const customerResponse = await customerService.getCustomers(foundationId);
          console.log('Customers fetched:', customerResponse);
          setCustomers(customerResponse);
          
          // Fetch items
          const itemResponse = await itemService.getItems(foundationId);
          console.log('Items fetched:', itemResponse);
          console.log('Items data:', itemResponse.data);
          if (itemResponse.data) {
            console.log('Setting items state with', itemResponse.data.length, 'items');
            setItems(itemResponse.data);
          } else {
            console.log('No items data received');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setRecurringData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(recurringData);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Top Navigation */}
      <div className="px-8 py-6">
        <div className="flex items-center">
          <button 
            onClick={onCancel}
            className="flex items-center text-[#0B3A2E] hover:text-[#066630] mr-2 h-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm font-medium">Back to list</span>
          </button>
        </div>
        
        <h1 className="text-2xl font-semibold text-[#0B3A2E] mt-4 mb-6">Create Recurring</h1>
      </div>

      {/* Stepper (Progress Indicator) */}
      <div className="px-8 pb-8">
        <div className="flex items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#F46A9B] flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <span className="ml-2 text-sm font-medium text-[#0B3A2E]">Customer & Offer</span>
          </div>
          <div className="flex-1 h-px bg-[#E0E0E0] mx-10"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center text-[#0B3A2E] font-bold text-sm">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-[#0B3A2E]">Periods & Deviations</span>
          </div>
          <div className="flex-1 h-px bg-[#E0E0E0] mx-10"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-white border border-[#D0D0D0] flex items-center justify-center text-[#0B3A2E] font-bold text-sm">
              3
            </div>
            <span className="ml-2 text-sm font-medium text-[#0B3A2E]">Handling & Activation</span>
          </div>
        </div>
      </div>

      <div className="px-8 max-w-6xl mx-auto">
        {/* Info Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            className={`h-9 min-w-[120px] flex items-center justify-center gap-1.5 px-2 rounded text-xs font-medium ${
              selectedCustomer
                ? activeTab === 'customer' 
                  ? 'text-[#0A7A3B] border-[1.5px] border-[#0A7A3B] bg-white'
                  : 'text-[#6B6B6B] border border-[#DADADA] bg-white hover:text-[#0A7A3B] hover:border-[#0A7A3B] hover:bg-[#F6F8F7]'
                : 'text-[#9E9E9E] border border-[#E0E0E0] bg-[#F5F5F5] cursor-not-allowed'
            }`}
            onClick={() => selectedCustomer && setShowCustomerPopup(true)}
            disabled={!selectedCustomer}
          >
            <User size={14} />
            Customer details
          </button>
          <button
            className={`h-9 min-w-[120px] flex items-center justify-center gap-1.5 px-2 rounded text-xs font-medium ${
              selectedCustomer
                ? activeTab === 'delivery' 
                  ? 'text-[#0A7A3B] border-[1.5px] border-[#0A7A3B] bg-white'
                  : 'text-[#6B6B6B] border border-[#DADADA] bg-white hover:text-[#0A7A3B] hover:border-[#0A7A3B] hover:bg-[#F6F8F7]'
                : 'text-[#9E9E9E] border border-[#E0E0E0] bg-[#F5F5F5] cursor-not-allowed'
            }`}
            onClick={() => selectedCustomer && setShowDeliveryPopup(true)}
            disabled={!selectedCustomer}
          >
            <Truck size={14} />
            Delivery info
          </button>
          <button
            className={`h-9 min-w-[120px] flex items-center justify-center gap-1.5 px-2 rounded text-xs font-medium ${
              selectedCustomer
                ? activeTab === 'invoice' 
                  ? 'text-[#0A7A3B] border-[1.5px] border-[#0A7A3B] bg-white'
                  : 'text-[#6B6B6B] border border-[#DADADA] bg-white hover:text-[#0A7A3B] hover:border-[#0A7A3B] hover:bg-[#F6F8F7]'
                : 'text-[#9E9E9E] border border-[#E0E0E0] bg-[#F5F5F5] cursor-not-allowed'
            }`}
            onClick={() => selectedCustomer && setShowInvoicePopup(true)}
            disabled={!selectedCustomer}
          >
            <FileText size={14} />
            Invoice info
          </button>
        </div>
        
        <div className="p-4 mb-6">
          {activeTab === 'customer' && (
            <div className="text-[#4A4A4A]">Customer details content would go here...</div>
          )}
          {activeTab === 'delivery' && (
            <div className="text-[#4A4A4A]">Delivery information content would go here...</div>
          )}
          {activeTab === 'invoice' && (
            <div className="text-[#4A4A4A]">Invoice information content would go here...</div>
          )}
        </div>
        
        {/* Customer Field */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Customer"
            className="w-full h-[52px] border border-[#DADADA] rounded-lg px-4 text-base text-[#0B3A2E] placeholder-[#9E9E9E] focus:outline-none focus:border-[#0A7A3B] focus:ring-2 focus:ring-[#0A7A3B] focus:ring-opacity-15"
            value={recurringData.customer}
            onChange={(e) => handleInputChange('customer', e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            onBlur={(e) => {
              // Prevent closing dropdown when clicking on dropdown items
              if (!e.relatedTarget || !e.relatedTarget.closest('.customer-dropdown-item')) {
                setTimeout(() => setDropdownOpen(false), 200);
              }
            }}
          />
          
          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 p-3 border-b border-[#E0E0E0] bg-[#F5F7F6]">
                <div className="text-xs font-semibold text-[#0B3A2E]">Customer No</div>
                <div className="text-xs font-semibold text-[#0B3A2E]">Customer name</div>
              </div>
              <div className="divide-y divide-[#E0E0E0]">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <div 
                      key={customer.id}
                      className="grid grid-cols-2 gap-4 p-3 hover:bg-[#F5F7F6] cursor-pointer customer-dropdown-item"
                      onClick={() => {
                        console.log('Customer selected:', customer);
                        setSelectedCustomer(customer);
                        setRecurringData(prev => ({ ...prev, customer: customer.name }));
                        setDropdownOpen(false);
                      }}
                      onMouseDown={(e) => {
                        // Prevent blur event from firing
                        e.preventDefault();
                      }}
                    >
                      <div className="text-sm text-[#0B3A2E]">{customer.customer_number}</div>
                      <div className="text-sm text-[#0B3A2E]">{customer.name}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-[#4A4A4A] text-center">No customers found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Add initial row button for testing */}
        <div className="mb-4">
          <button 
            className="h-9 px-4 bg-[#0A7A3B] text-white text-sm font-semibold rounded hover:bg-[#066630]"
            onClick={() => {
              const newRow = {
                id: Date.now(),
                articleNo: '',
                name: '',
                amount: 1,
                unit: '',
                type: 'Text',
                price: 0,
                discount: '',
                total: 0,
                vat: '',
                account: ''
              };
              setTextRows([newRow]);
            }}
          >
            Add Test Row
          </button>
          <span className="ml-4 text-sm text-[#6F6F6F]">
            Items loaded: {items.length}
          </span>
        </div>

        {/* Line Items Table - Full Width */}
        <div className="border border-[#E0E0E0] rounded-lg overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white">
                <tr className="h-12">
                  <th className="text-center text-sm font-semibold text-[#0B3A2E] px-2 py-3"></th>
                  <th className="text-left text-sm font-semibold text-[#0B3A2E] px-2 py-3">Article No</th>
                  <th className="text-left text-sm font-semibold text-[#0B3A2E] px-2 py-3">Name</th>
                  <th className="text-right text-sm font-semibold text-[#0B3A2E] px-2 py-3">Amount</th>
                  <th className="text-center text-sm font-semibold text-[#0B3A2E] px-2 py-3">Unit</th>
                  <th className="text-center text-sm font-semibold text-[#0B3A2E] px-2 py-3">Type</th>
                  <th className="text-right text-sm font-semibold text-[#0B3A2E] px-2 py-3">Price</th>
                  <th className="text-center text-sm font-semibold text-[#0B3A2E] px-2 py-3">
                    <div className="flex items-center justify-center">
                      Discount
                      <ArrowUpDown className="ml-1" size={14} />
                    </div>
                  </th>
                  <th className="text-right text-sm font-semibold text-[#0B3A2E] px-2 py-3">Total</th>
                  <th className="text-right text-sm font-semibold text-[#0B3A2E] px-2 py-3">VAT</th>
                  <th className="text-left text-sm font-semibold text-[#0B3A2E] px-2 py-3">Account</th>
                  <th className="text-center text-sm font-semibold text-[#0B3A2E] px-2 py-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {/* Render text rows */}
                {textRows.map((row, index) => (
                  <tr 
                    key={row.id} 
                    className="h-12 border-b border-[#E0E0E0] hover:bg-[#F6F8F7] bg-white"
                  >
                    <td className="px-2 py-1 text-center">
                      <div className="cursor-grab text-[#8A8A8A] hover:text-[#4A4A4A]">⋮⋮</div>
                    </td>
                    <td className="px-2 py-1 relative">
                      <input 
                        type="text" 
                        value={row.articleNo}
                        placeholder="Search article"
                        className="w-full h-9 px-3 py-1 text-[#0B3A2E] border border-transparent rounded focus:border-[#0A7A3B] focus:bg-white"
                        onFocus={() => {
                          setItemDropdownOpen(true);
                        }}
                        onBlur={(e) => {
                          // Prevent closing dropdown when clicking on dropdown items
                          if (!e.relatedTarget || !e.relatedTarget.closest('.item-dropdown-item')) {
                            setTimeout(() => setItemDropdownOpen(false), 200);
                          }
                        }}
                        onChange={(e) => {
                          const updatedRows = [...textRows];
                          updatedRows[index] = { ...updatedRows[index], articleNo: e.target.value };
                          setTextRows(updatedRows);
                        }}
                      />
                      {itemDropdownOpen && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-4 p-3 border-b border-[#E0E0E0] bg-[#F5F7F6]">
                            <div className="text-xs font-semibold text-[#0B3A2E]">Article No</div>
                            <div className="text-xs font-semibold text-[#0B3A2E]">Name</div>
                          </div>
                          <div className="divide-y divide-[#E0E0E0]">
                            {items.length > 0 ? (
                              items.map((item) => (
                                <div 
                                  key={item.id}
                                  className="grid grid-cols-2 gap-4 p-3 hover:bg-[#F5F7F6] cursor-pointer item-dropdown-item"
                                  onClick={() => {
                                    const updatedRows = [...textRows];
                                    updatedRows[index] = { 
                                      ...updatedRows[index], 
                                      articleNo: item.item_number,
                                      name: item.name,
                                      price: parseFloat(item.sale_account) || 0,
                                      unit: item.unit || 'st',
                                      vat: item.vat || '25'
                                    };
                                    setTextRows(updatedRows);
                                    setItemDropdownOpen(false);
                                  }}
                                  onMouseDown={(e) => {
                                    // Prevent blur event from firing
                                    e.preventDefault();
                                  }}
                                >
                                  <div className="text-sm text-[#0B3A2E]">{item.item_number}</div>
                                  <div className="text-sm text-[#0B3A2E]">{item.name}</div>
                                </div>
                              ))
                            ) : (
                              <div className="p-3 text-sm text-[#4A4A4A] text-center">No items found</div>
                            )}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-2 py-1">
                      <input 
                        type="text" 
                        value={row.name}
                        placeholder="Text row"
                        className="w-full h-9 px-3 py-1 text-[#0B3A2E] border border-transparent rounded focus:border-[#0A7A3B] focus:bg-white"
                        onChange={(e) => {
                          const updatedRows = [...textRows];
                          updatedRows[index] = { ...updatedRows[index], name: e.target.value };
                          setTextRows(updatedRows);
                        }}
                      />
                    </td>
                    <td className="px-2 py-1 text-right">
                      <input 
                        type="number" 
                        value={row.amount}
                        className="w-full h-9 px-3 py-1 text-right text-[#0B3A2E]"
                        onChange={(e) => {
                          const updatedRows = [...textRows];
                          updatedRows[index] = { ...updatedRows[index], amount: Number(e.target.value) };
                          setTextRows(updatedRows);
                        }}
                      />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <select 
                        value={row.unit}
                        className="w-full h-9 px-3 py-1 text-center text-[#0B3A2E]"
                        onChange={(e) => {
                          const updatedRows = [...textRows];
                          updatedRows[index] = { ...updatedRows[index], unit: e.target.value };
                          setTextRows(updatedRows);
                        }}
                      >
                        <option value=""></option>
                        <option value="st">st</option>
                        <option value="kg">kg</option>
                        <option value="m">m</option>
                        <option value="h">h</option>
                      </select>
                    </td>
                    <td className="px-2 py-1 text-center">
                      <input 
                        type="text" 
                        value={row.type}
                        className="w-full h-9 px-3 py-1 text-center text-[#0B3A2E] cursor-not-allowed"
                        disabled
                      />
                    </td>
                    <td className="px-2 py-1 text-right">
                      <input 
                        type="number" 
                        value={row.price}
                        className="w-full h-9 px-3 py-1 text-right text-[#0B3A2E]"
                        onChange={(e) => {
                          const updatedRows = [...textRows];
                          updatedRows[index] = { ...updatedRows[index], price: Number(e.target.value) };
                          setTextRows(updatedRows);
                        }}
                      />
                    </td>
                    <td className="px-2 py-1 text-center">
                      <input 
                        type="text" 
                        value={row.discount}
                        className="w-full h-9 px-3 py-1 text-center text-[#0B3A2E]"
                        onChange={(e) => {
                          const updatedRows = [...textRows];
                          updatedRows[index] = { ...updatedRows[index], discount: e.target.value };
                          setTextRows(updatedRows);
                        }}
                      />
                    </td>
                    <td className="px-2 py-1 text-right font-medium text-[#0B3A2E]">
                      {(parseFloat(row.amount || 0) * parseFloat(row.price || 0) * (1 - (parseFloat(row.discount || 0) / 100))).toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-2 py-1 text-right">
                      <select 
                        value={row.vat}
                        className="w-full h-9 px-3 py-1 text-right text-[#0B3A2E]"
                        onChange={(e) => {
                          const updatedRows = [...textRows];
                          updatedRows[index] = { ...updatedRows[index], vat: e.target.value };
                          setTextRows(updatedRows);
                        }}
                      >
                        <option value=""></option>
                        <option value="6">6%</option>
                        <option value="12">12%</option>
                        <option value="25">25%</option>
                      </select>
                    </td>
                    <td className="px-2 py-1 text-left">
                      <select 
                        value={row.account}
                        className="w-full h-9 px-3 py-1 text-left text-[#0B3A2E]"
                        onChange={(e) => {
                          const updatedRows = [...textRows];
                          updatedRows[index] = { ...updatedRows[index], account: e.target.value };
                          setTextRows(updatedRows);
                        }}
                      >
                        <option value=""></option>
                        <option value="1010">1010</option>
                        <option value="1020">1020</option>
                        <option value="3010">3010</option>
                        <option value="3020">3020</option>
                      </select>
                    </td>
                    <td className="px-2 py-1 text-center">
                      <button 
                        className="text-[#8A8A8A] hover:text-[#C62828]"
                        onClick={() => {
                          // Remove this row
                          const updatedRows = textRows.filter((_, i) => i !== index);
                          setTextRows(updatedRows);
                        }}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="h-13 bg-[#F3F5F4]">
                  <td colSpan={11} className="text-center text-sm text-[#9E9E9E] px-4 py-3">
                    <button 
                      className="w-full h-full text-left"
                      onClick={() => setSearchExpanded(true)}
                    >
                      Search article/write freely
                    </button>
                  </td>
                </tr>
                {searchExpanded && (
                  <tr>
                    <td colSpan={11} className="p-0">
                      <div className="bg-white border-t border-[#E0E0E0] p-4 pt-3 pb-3">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex gap-12">
                            <div className="text-sm font-semibold text-[#0B3A2E]">Article No</div>
                            <div className="text-sm font-semibold text-[#0B3A2E]">Name</div>
                          </div>
                          <button 
                            className="h-8 px-4 bg-[#0A7A3B] text-white text-xs font-semibold rounded-full hover:bg-[#066630]"
                            onClick={() => {
                              // Add a new text row
                              const newRow = {
                                id: Date.now(),
                                articleNo: '',
                                name: '',
                                amount: 1,
                                unit: '',
                                type: 'Text',
                                price: 0,
                                discount: '',
                                total: 0,
                                vat: '',
                                account: ''
                              };
                              setTextRows([...textRows, newRow]);
                              setSearchExpanded(false);
                            }}
                          >
                            Add text row
                          </button>
                        </div>
                        <div className="h-px bg-[#E0E0E0] my-3"></div>
                        <div className="text-sm text-[#6F6F6F] pl-4">
                          {items.length > 0 ? (
                            <div className="divide-y divide-[#E0E0E0] max-h-40 overflow-y-auto">
                              {items.map((item) => (
                                <div 
                                  key={item.id}
                                  className="grid grid-cols-2 gap-4 p-2 hover:bg-[#F5F7F6] cursor-pointer"
                                  onClick={() => {
                                    // Add item as a new row
                                    const newRow = {
                                      id: Date.now(),
                                      articleNo: item.item_number,
                                      name: item.name,
                                      amount: 1,
                                      unit: item.unit || 'st',
                                      type: 'Item',
                                      price: parseFloat(item.sale_account) || 0,
                                      discount: '',
                                      total: parseFloat(item.sale_account) || 0,
                                      vat: item.vat || '25',
                                      account: ''
                                    };
                                    setTextRows([...textRows, newRow]);
                                    setSearchExpanded(false);
                                  }}
                                >
                                  <div className="text-sm text-[#0B3A2E]">{item.item_number}</div>
                                  <div className="text-sm text-[#0B3A2E]">{item.name}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div>No items found</div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            {/* Invoice Text Area */}
            <div className="mb-6">
              <textarea
                className="w-full h-[140px] border border-[#DADADA] rounded-lg px-4 py-4 text-sm resize-none text-[#0B3A2E]"
                placeholder="Invoice text"
                value={recurringData.invoiceText}
                onChange={(e) => handleInputChange('invoiceText', e.target.value)}
              />
            </div>
          </div>

          <div className="col-span-5">
            {/* Summary Panel */}
            <div className="bg-[#F5F7F6] rounded-lg p-5">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-[#4A4A4A]">Net</span>
                  <span className="text-sm font-medium text-[#0B3A2E]">
                    {summary.net.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#4A4A4A]">VAT</span>
                  <span className="text-sm font-medium text-[#0B3A2E]">
                    {summary.vat.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-[#E0E0E0] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-[#0B3A2E]">To pay</span>
                    <span className="text-lg font-bold text-[#0A7A3B]">
                      {summary.toPay.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SEK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] h-[72px] px-8 py-0 flex items-center">
        <div className="max-w-6xl w-full mx-auto flex justify-between items-center">
          <button 
            onClick={onCancel}
            className="h-11 border-[1.5px] border-[#0A7A3B] text-[#0A7A3B] px-6 rounded-full font-medium hover:bg-[#F5F7F6]"
          >
            Cancel
          </button>
          <div className="flex gap-3">
            <button 
              className="h-11 border-[1.5px] border-[#0A7A3B] text-[#0A7A3B] px-6 rounded-full font-medium hover:bg-[#F5F7F6]"
            >
              Save
            </button>
            <button 
              className="h-11 bg-[#0A7A3B] text-white px-7 rounded-full font-semibold hover:bg-[#066630]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Customer Details Popup */}
      {showCustomerPopup && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#0B3A2E]">Customer Details</h2>
                <button 
                  onClick={() => setShowCustomerPopup(false)}
                  className="text-[#8A8A8A] hover:text-[#4A4A4A]"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Customer Number</label>
                    <div className="text-[#0B3A2E]">{selectedCustomer.customer_number}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Customer Name</label>
                    <div className="text-[#0B3A2E]">{selectedCustomer.name}</div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Type</label>
                  <div className="text-[#0B3A2E] capitalize">{selectedCustomer.customer_type}</div>
                </div>
                
                {selectedCustomer.corporate_personal_id && (
                  <div>
                    <label className="block text-sm font-medium text-[#4A4A4A] mb-1">Corporate/Personal ID</label>
                    <div className="text-[#0B3A2E]">{selectedCustomer.corporate_personal_id}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Info Popup */}
      {showDeliveryPopup && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#0B3A2E]">Delivery Information</h2>
                <button 
                  onClick={() => setShowDeliveryPopup(false)}
                  className="text-[#8A8A8A] hover:text-[#4A4A4A]"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="text-center py-8 text-[#4A4A4A]">
                Delivery information would be displayed here
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Info Popup */}
      {showInvoicePopup && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#0B3A2E]">Invoice Information</h2>
                <button 
                  onClick={() => setShowInvoicePopup(false)}
                  className="text-[#8A8A8A] hover:text-[#4A4A4A]"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="text-center py-8 text-[#4A4A4A]">
                Invoice information would be displayed here
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};