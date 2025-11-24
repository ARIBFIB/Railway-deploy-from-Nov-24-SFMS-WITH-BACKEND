import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, List, Printer, Copy, RotateCcw, ChevronDown, ChevronRight, BarChart3 } from 'lucide-react';
import { Button } from './Button';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (articleData: any) => void;
}

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ isOpen, onClose, onSave }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'basic' | 'stock'>('basic');
  const [pricesExpanded, setPricesExpanded] = useState(true);
  const [accountingExpanded, setAccountingExpanded] = useState(false);
  
  const [formData, setFormData] = useState({
    articleNumber: '1',
    ean: '',
    supplier: '',
    name: '',
    manufacturer: '',
    manufacturerPartNumber: '',
    notes: '',
    active: true,
    packageItem: false,
    unit: '',
    typeOfArticle: 'Be',
    inStock: false,
    externalWebshop: false,
    discontinuedItem: false,
    // Stock details
    estimatedCost: '',
    stockValue: '',
    inStockQuantity: '',
    reservedQuantity: '',
    availableQuantity: '',
    orderPoint: '',
    storageLocation: '',
    width: '',
    height: '',
    depth: '',
    weight: '',
    bulky: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent body scrolling and hide browser UI when modal is open
  useEffect(() => {
    if (isOpen) {
      const bodyElement = window.document.querySelector('body');
      const htmlElement = window.document.querySelector('html');
      
      if (bodyElement) {
        bodyElement.style.overflow = 'hidden';
        bodyElement.style.margin = '0';
        bodyElement.style.padding = '0';
      }
      
      if (htmlElement) {
        htmlElement.style.overflow = 'hidden';
        htmlElement.style.margin = '0';
        htmlElement.style.padding = '0';
      }
      
      return () => {
        if (bodyElement) {
          bodyElement.style.overflow = 'unset';
          bodyElement.style.margin = '';
          bodyElement.style.padding = '';
        }
        
        if (htmlElement) {
          htmlElement.style.overflow = 'unset';
          htmlElement.style.margin = '';
          htmlElement.style.padding = '';
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleShowList = () => {
    onClose(); // Close the modal first
    navigate('/articles'); // Navigate to articles page
  };

  const handleCancel = () => {
    setFormData({
      articleNumber: '1',
      ean: '',
      supplier: '',
      name: '',
      manufacturer: '',
      manufacturerPartNumber: '',
      notes: '',
      active: true,
      packageItem: false,
      unit: '',
      typeOfArticle: 'Be',
      inStock: false,
      externalWebshop: false,
      discontinuedItem: false,
      // Stock details
      estimatedCost: '',
      stockValue: '',
      inStockQuantity: '',
      reservedQuantity: '',
      availableQuantity: '',
      orderPoint: '',
      storageLocation: '',
      width: '',
      height: '',
      depth: '',
      weight: '',
      bulky: true
    });
    setErrors({});
    onClose();
  };

  const ToggleSwitch = ({ 
    value, 
    onChange, 
    options 
  }: { 
    value: boolean; 
    onChange: (value: boolean) => void; 
    options: [string, string] 
  }) => (
    <div className="flex space-x-1">
      <button
        onClick={() => onChange(true)}
        className={`px-4 py-2 rounded-l-lg border ${
          value
            ? 'bg-white text-gray-900 border-gray-300'
            : 'bg-gray-100 text-gray-600 border-gray-300'
        }`}
      >
        {options[0]}
      </button>
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-2 rounded-r-lg border ${
          !value
            ? 'bg-white text-gray-900 border-gray-300'
            : 'bg-gray-100 text-gray-600 border-gray-300'
        }`}
      >
        {options[1]}
      </button>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">ARTICLE 1 - CREATE NEW</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => console.log('Create article clicked')}
              className="bg-gray-700 hover:bg-gray-800 text-white font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create article
            </Button>
            <Button
              onClick={handleShowList}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Show list
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Printer className="w-4 h-4" />
              Print statistics
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <Copy className="w-4 h-4" />
              Copy article
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('basic')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'basic'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Basic information
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === 'stock'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Stock details
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Basic Information Form */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Article Identifiers */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Article number *
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.articleNumber}
                        onChange={(e) => handleInputChange('articleNumber', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      EAN
                    </label>
                    <input
                      type="text"
                      value={formData.ean}
                      onChange={(e) => handleInputChange('ean', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supplier
                    </label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => handleInputChange('supplier', e.target.value)}
                      placeholder="Supplier number, Name, Organization/Personal numb"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Middle Column - General Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
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
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                      placeholder="Manufacturer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer's part number
                    </label>
                    <input
                      type="text"
                      value={formData.manufacturerPartNumber}
                      onChange={(e) => handleInputChange('manufacturerPartNumber', e.target.value)}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column - Properties & Toggles */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active
                    </label>
                    <ToggleSwitch
                      value={formData.active}
                      onChange={(value) => handleInputChange('active', value)}
                      options={['Yes', 'No']}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package item
                    </label>
                    <ToggleSwitch
                      value={formData.packageItem}
                      onChange={(value) => handleInputChange('packageItem', value)}
                      options={['Yes', 'No']}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.unit}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                        className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of article
                    </label>
                    <ToggleSwitch
                      value={formData.typeOfArticle === 'Be'}
                      onChange={(value) => handleInputChange('typeOfArticle', value ? 'Be' : 'Service')}
                      options={['Be', 'Service']}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      In stock
                    </label>
                    <ToggleSwitch
                      value={formData.inStock}
                      onChange={(value) => handleInputChange('inStock', value)}
                      options={['Yes', 'No']}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      External webshop
                    </label>
                    <ToggleSwitch
                      value={formData.externalWebshop}
                      onChange={(value) => handleInputChange('externalWebshop', value)}
                      options={['Yes', 'No']}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Discontinued item
                    </label>
                    <ToggleSwitch
                      value={formData.discontinuedItem}
                      onChange={(value) => handleInputChange('discontinuedItem', value)}
                      options={['Yes', 'No']}
                    />
                  </div>
                </div>
              </div>

              {/* Prices Section */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setPricesExpanded(!pricesExpanded)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">Prices</span>
                  {pricesExpanded ? (
                    <ChevronDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-green-600" />
                  )}
                </button>
                
                {pricesExpanded && (
                  <div className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-medium text-gray-700">PRICE LIST</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">NAME</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">PRICE</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">TG %</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">TB SEK</th>
                            <th className="text-left py-3 px-4 font-medium text-gray-700">CHANGE DATE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100 bg-white">
                            <td className="py-3 px-4 text-sm text-gray-900">A</td>
                            <td className="py-3 px-4 text-sm text-gray-900">Price list A</td>
                            <td className="py-3 px-4 text-sm text-gray-900">
                              <input
                                type="text"
                                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0,00"
                              />
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">
                              <input
                                type="text"
                                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0"
                              />
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900">0,00</td>
                            <td className="py-3 px-4 text-sm text-gray-900 flex items-center gap-2">
                              Never changed
                              <BarChart3 className="w-4 h-4 text-gray-400" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Accounting Information Section */}
              <div className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setAccountingExpanded(!accountingExpanded)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100"
                >
                  <span className="font-medium text-gray-900">Accounting information</span>
                  {accountingExpanded ? (
                    <ChevronDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-green-600" />
                  )}
                </button>
                
                {accountingExpanded && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* First Row */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sale
                          </label>
                          <input
                            type="text"
                            value="3001"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            VAT
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">?</span>
                            </div>
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="25%">25%</option>
                            <option value="12%">12%</option>
                            <option value="6%">6%</option>
                            <option value="0%">0%</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sales SE reverse charge
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder=""
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sales EU reverse charge
                          </label>
                          <input
                            type="text"
                            value="3108"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                      
                      {/* Second Row */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sales subject to EU VAT
                          </label>
                          <input
                            type="text"
                            value="3106"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sales Export
                          </label>
                          <input
                            type="text"
                            value="3105"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Purchase
                          </label>
                          <input
                            type="text"
                            value="4000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-6">
              {/* Stock Details Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated cost
                    </label>
                    <input
                      type="text"
                      value={formData.estimatedCost}
                      onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock value
                    </label>
                    <input
                      type="text"
                      value={formData.stockValue}
                      onChange={(e) => handleInputChange('stockValue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      In stock
                    </label>
                    <input
                      type="text"
                      value={formData.inStockQuantity}
                      onChange={(e) => handleInputChange('inStockQuantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reserved quantity
                    </label>
                    <input
                      type="text"
                      value={formData.reservedQuantity}
                      onChange={(e) => handleInputChange('reservedQuantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available quantity
                    </label>
                    <input
                      type="text"
                      value={formData.availableQuantity}
                      onChange={(e) => handleInputChange('availableQuantity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order point
                    </label>
                    <input
                      type="text"
                      value={formData.orderPoint}
                      onChange={(e) => handleInputChange('orderPoint', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Storage location
                    </label>
                    <input
                      type="text"
                      value={formData.storageLocation}
                      onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                      placeholder="Storage location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Width (mm)
                    </label>
                    <input
                      type="text"
                      value={formData.width}
                      onChange={(e) => handleInputChange('width', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Height (mm)
                    </label>
                    <input
                      type="text"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depth (mm)
                    </label>
                    <input
                      type="text"
                      value={formData.depth}
                      onChange={(e) => handleInputChange('depth', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (Grams)
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bulky
                    </label>
                    <ToggleSwitch
                      value={formData.bulky}
                      onChange={(value) => handleInputChange('bulky', value)}
                      options={['Yes', 'No']}
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="flex justify-end">
                <div className="w-16 h-20 bg-yellow-100 border-2 border-dashed border-yellow-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-1 bg-yellow-200 rounded flex items-center justify-center">
                      <span className="text-yellow-600 text-xs">📷</span>
                    </div>
                    <span className="text-xs text-yellow-600">Image</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <Button
            onClick={() => console.log('Delete clicked')}
            disabled
            className="bg-gray-400 text-gray-600 cursor-not-allowed"
          >
            Delete
          </Button>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
