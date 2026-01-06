import React, { useState } from 'react';
import { ArrowLeft, User, Truck, FileText, ArrowUpDown } from 'lucide-react';

interface CreateRecurringFormProps {
  onCancel: () => void;
  onSave: (recurringData: any) => void;
}

export const CreateRecurringForm: React.FC<CreateRecurringFormProps> = ({ onCancel, onSave }) => {
  const [activeTab, setActiveTab] = useState('customer');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [textRows, setTextRows] = useState<any[]>([]);
  const [recurringData, setRecurringData] = useState({
    customer: '',
    invoiceText: '',
    // Add other fields as needed
  });

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
              activeTab === 'customer' 
                ? 'text-[#0A7A3B] border-[1.5px] border-[#0A7A3B] bg-white'
                : 'text-[#6B6B6B] border border-[#DADADA] bg-white hover:text-[#0A7A3B] hover:border-[#0A7A3B] hover:bg-[#F6F8F7]'
            }`}
            onClick={() => setActiveTab('customer')}
          >
            <User size={14} />
            Customer details
          </button>
          <button
            className={`h-9 min-w-[120px] flex items-center justify-center gap-1.5 px-2 rounded text-xs font-medium ${
              activeTab === 'delivery' 
                ? 'text-[#0A7A3B] border-[1.5px] border-[#0A7A3B] bg-white'
                : 'text-[#6B6B6B] border border-[#DADADA] bg-white hover:text-[#0A7A3B] hover:border-[#0A7A3B] hover:bg-[#F6F8F7]'
            }`}
            onClick={() => setActiveTab('delivery')}
          >
            <Truck size={14} />
            Delivery info
          </button>
          <button
            className={`h-9 min-w-[120px] flex items-center justify-center gap-1.5 px-2 rounded text-xs font-medium ${
              activeTab === 'invoice' 
                ? 'text-[#0A7A3B] border-[1.5px] border-[#0A7A3B] bg-white'
                : 'text-[#6B6B6B] border border-[#DADADA] bg-white hover:text-[#0A7A3B] hover:border-[#0A7A3B] hover:bg-[#F6F8F7]'
            }`}
            onClick={() => setActiveTab('invoice')}
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
            className="w-full h-[52px] border border-[#DADADA] rounded-lg px-4 text-base text-[#0B3A2E] placeholder-[#9E9E9E] focus:outline-none focus:ring-0 focus:border-[#0A7A3B] focus:ring-[#0A7A3B] focus:ring-2 focus:ring-opacity-15"
            value={recurringData.customer}
            onChange={(e) => handleInputChange('customer', e.target.value)}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
          />
          
          {dropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg">
              <div className="grid grid-cols-2 gap-4 p-3 border-b border-[#E0E0E0]">
                <div className="text-xs font-semibold text-[#0B3A2E]">Customer No</div>
                <div className="text-xs font-semibold text-[#0B3A2E]">Customer name</div>
              </div>
              <div className="p-3 text-sm text-[#4A4A4A]">No results...</div>
            </div>
          )}
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
                    <td className="px-2 py-1">
                      <input 
                        type="text" 
                        value={row.articleNo}
                        className="w-full bg-transparent text-[#9E9E9E] cursor-not-allowed"
                        disabled
                      />
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
                      {(row.amount * row.price * (1 - (row.discount || 0) / 100)).toFixed(2)}
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
                        <div className="text-sm text-[#6F6F6F] pl-4">No results...</div>
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
                  <span className="text-sm font-medium text-[#0B3A2E]">0,00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#4A4A4A]">VAT</span>
                  <span className="text-sm font-medium text-[#0B3A2E]">0,00</span>
                </div>
                <div className="border-t border-[#E0E0E0] pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-[#0B3A2E]">To pay</span>
                    <span className="text-lg font-bold text-[#0A7A3B]">0,00 SEK</span>
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
    </div>
  );
};