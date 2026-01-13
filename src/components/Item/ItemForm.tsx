import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Plus, Package, Tag, ShoppingCart, FileText, Search, RefreshCw, ChevronDown, BarChart3, Copy, Printer } from 'lucide-react';
import { itemService } from '../../services/itemService';
import type { CreateItemPayload, Item } from '../../services/itemService';
import { useNavigate, useParams } from 'react-router-dom';

const ItemForm = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const [formData, setFormData] = useState({
    itemNumber: '',
    ean: '',
    name: '',
    supplier: '',
    manufacturer: '',
    manufacturerItemNumber: '',
    unit: '',
    notes: '',
    active: true,
    itemPackage: false,
    itemType: 'goods' as 'goods' | 'service' | 'other',
    stockItem: true,
    externalWebshop: false,
    discontinued: false,
    bulky: false,
    saleAccount: '3001',
    vat: '25',
    salesSEReverseCharge: '',
    salesEUReverseCharge: '3108',
    salesEUSubjectToVAT: '3106',
    salesExport: '3105',
    purchaseAccount: '4000',
    // Stock details
    costCalculation: 0,
    stockValue: 0,
    inWarehouse: 0,
    reservedQuantity: 0,
    availableAmount: 0,
    orderPoint: 0,
    stockLocation: '',
    widthMM: '',
    heightMM: '',
    depthMM: '',
    weightGrams: '',
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'stock'>('basic');
  const [expandedSections, setExpandedSections] = useState({
    prices: false,
    accounting: true, // Default to expanded
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showSaveLoading, setShowSaveLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemLoading, setItemLoading] = useState(false);

  // Price list state
  const [priceList, setPriceList] = useState([
    {
      id: 1,
      priceList: 'A',
      name: 'Price list A',
      price: '0,00',
      cmr: '100,00',
      cmSek: '0,00',
      modificationDate: 'Never modified'
    }
  ]);

  // Previous manufacturers state
  const [previousManufacturers, setPreviousManufacturers] = useState<string[]>([]);
  const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false);
  const [filteredManufacturers, setFilteredManufacturers] = useState<string[]>([]);

  // Chart of accounts state
  const [accounts, setAccounts] = useState<{ id: string, account_number: string, account_name: string }[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Load chart of accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // Dynamically import AccountService to avoid import issues
        const accountServiceModule = await import('../../services/accountService');
        const AccountService = accountServiceModule.AccountService;

        const result = await AccountService.getAccounts();
        if (result.data) {
          // Map to the format we need
          const mappedAccounts = result.data.map((account: any) => ({
            id: account.id,
            account_number: account.account_number,
            account_name: account.account_name
          }));
          setAccounts(mappedAccounts);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
        // Set empty array in case of error
        setAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);
  
  // Load item data if in edit mode
  useEffect(() => {
    if (itemId) {
      setIsEditMode(true);
      const fetchItem = async () => {
        setItemLoading(true);
        try {
          const result = await itemService.getItemById(itemId);
          if (result.data) {
            setFormData({
              itemNumber: result.data.item_number || '',
              ean: result.data.ean || '',
              name: result.data.name || '',
              supplier: result.data.supplier || '',
              manufacturer: result.data.manufacturer || '',
              manufacturerItemNumber: result.data.manufacturer_item_number || '',
              unit: result.data.unit || '',
              notes: result.data.notes || '',
              active: result.data.active,
              itemPackage: result.data.item_package,
              itemType: result.data.item_type,
              stockItem: result.data.stock_item,
              externalWebshop: result.data.external_webshop,
              discontinued: result.data.discontinued,
              bulky: result.data.bulky,
              saleAccount: result.data.sale_account,
              vat: result.data.vat,
              salesSEReverseCharge: result.data.sales_se_reverse_charge || '',
              salesEUReverseCharge: result.data.sales_eu_reverse_charge,
              salesEUSubjectToVAT: result.data.sales_eu_subject_to_vat,
              salesExport: result.data.sales_export,
              purchaseAccount: result.data.purchase_account,
              costCalculation: result.data.cost_calculation,
              stockValue: result.data.stock_value,
              inWarehouse: result.data.in_warehouse,
              reservedQuantity: result.data.reserved_quantity,
              availableAmount: result.data.available_amount,
              orderPoint: result.data.order_point,
              stockLocation: result.data.stock_location || '',
              widthMM: result.data.width_mm?.toString() || '',
              heightMM: result.data.height_mm?.toString() || '',
              depthMM: result.data.depth_mm?.toString() || '',
              weightGrams: result.data.weight_grams?.toString() || '',
            });
          }
        } catch (error) {
          console.error('Error fetching item:', error);
          alert('Error loading item data');
        } finally {
          setItemLoading(false);
        }
      };
      
      fetchItem();
    }
  }, [itemId]);
  
  // Previous suppliers state
  const [previousSuppliers, setPreviousSuppliers] = useState([
    { id: 1, number: 'SUP001', name: 'ABC Electronics', cinPin: 'SE1234567890', bgPg: 'BG123' },
    { id: 2, number: 'SUP002', name: 'Tech Solutions Ltd', cinPin: 'SE0987654321', bgPg: 'BG456' },
    { id: 3, number: 'SUP003', name: 'Global Parts Co', cinPin: 'SE1122334455', bgPg: 'BG789' },
    { id: 4, number: 'SUP004', name: 'Industrial Supplies', cinPin: 'SE5566778899', bgPg: 'BG012' },
    { id: 5, number: 'SUP005', name: 'Quality Components', cinPin: 'SE9988776655', bgPg: 'BG345' },
  ]);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [filteredSuppliers, setFilteredSuppliers] = useState<typeof previousSuppliers>([]);

  // Load previous manufacturers
  useEffect(() => {
    const loadPreviousManufacturers = async () => {
      try {
        // Get foundation ID from localStorage
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const foundationId = userData.foundationId || '12345678-1234-1234-1234-123456789012';

        // Fetch all items for this foundation
        const { data, error } = await itemService.getItems(foundationId);

        if (error) {
          console.error('Error fetching items for manufacturers:', error);
          return;
        }

        // Extract unique manufacturers
        if (data) {
          const manufacturers = Array.from(
            new Set(data.map(item => item.manufacturer).filter(Boolean))
          ) as string[];

          setPreviousManufacturers(manufacturers);
        }
      } catch (error) {
        console.error('Error loading previous manufacturers:', error);
      }
    };

    loadPreviousManufacturers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const generateNextItemNumber = async () => {
    try {
      // Get foundation ID from localStorage
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundationId = userData.foundationId || '12345678-1234-1234-1234-123456789012';

      // Fetch all items for this foundation
      const { data, error } = await itemService.getItems(foundationId);

      if (error) {
        console.error('Error fetching items:', error);
        // Fallback to a default number
        setFormData(prev => ({
          ...prev,
          itemNumber: 'ITM001'
        }));
        return;
      }

      // Find the highest item number and increment
      if (data && data.length > 0) {
        // Extract numeric part from item numbers like 'ITM001', 'ITM002', etc.
        const numbers = data
          .map(item => {
            const match = item.item_number.match(/ITM(\d+)/);
            return match ? parseInt(match[1], 10) : 0;
          })
          .filter(num => !isNaN(num));

        const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
        const nextNumber = maxNumber + 1;
        const nextItemNumber = `ITM${nextNumber.toString().padStart(3, '0')}`;

        setFormData(prev => ({
          ...prev,
          itemNumber: nextItemNumber
        }));
      } else {
        // If no items exist, start with ITM001
        setFormData(prev => ({
          ...prev,
          itemNumber: 'ITM001'
        }));
      }
    } catch (error) {
      console.error('Error generating item number:', error);
      // Fallback to a default number
      setFormData(prev => ({
        ...prev,
        itemNumber: 'ITM001'
      }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setShowSaveLoading(true);

    try {
      // Prepare the item data for saving
      const itemPayload: CreateItemPayload = {
        foundation_id: (() => {
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
          return userData.foundationId || '12345678-1234-1234-1234-123456789012'; // Fallback to mock ID if not found
        })(),
        item_number: formData.itemNumber,
        ean: formData.ean,
        name: formData.name,
        supplier: formData.supplier,
        manufacturer: formData.manufacturer,
        manufacturer_item_number: formData.manufacturerItemNumber,
        unit: formData.unit,
        notes: formData.notes,
        active: formData.active,
        item_package: formData.itemPackage,
        item_type: formData.itemType,
        stock_item: formData.stockItem,
        external_webshop: formData.externalWebshop,
        discontinued: formData.discontinued,
        bulky: formData.bulky,
        sale_account: formData.saleAccount,
        vat: formData.vat,
        sales_se_reverse_charge: formData.salesSEReverseCharge,
        sales_eu_reverse_charge: formData.salesEUReverseCharge,
        sales_eu_subject_to_vat: formData.salesEUSubjectToVAT,
        sales_export: formData.salesExport,
        purchase_account: formData.purchaseAccount,
        cost_calculation: typeof formData.costCalculation === 'string' ? parseFloat(formData.costCalculation) : formData.costCalculation,
        stock_value: typeof formData.stockValue === 'string' ? parseFloat(formData.stockValue) : formData.stockValue,
        in_warehouse: typeof formData.inWarehouse === 'string' ? parseInt(formData.inWarehouse) : formData.inWarehouse,
        reserved_quantity: typeof formData.reservedQuantity === 'string' ? parseInt(formData.reservedQuantity) : formData.reservedQuantity,
        available_amount: typeof formData.availableAmount === 'string' ? parseInt(formData.availableAmount) : formData.availableAmount,
        order_point: typeof formData.orderPoint === 'string' ? parseInt(formData.orderPoint) : formData.orderPoint,
        stock_location: formData.stockLocation,
        width_mm: formData.widthMM ? parseFloat(formData.widthMM) : undefined,
        height_mm: formData.heightMM ? parseFloat(formData.heightMM) : undefined,
        depth_mm: formData.depthMM ? parseFloat(formData.depthMM) : undefined,
        weight_grams: formData.weightGrams ? parseFloat(formData.weightGrams) : undefined,
      };

      let result;
      if (isEditMode && itemId) {
        // Update existing item
        result = await itemService.updateItem(itemId, itemPayload);
        if (result.error) {
          throw new Error(result.error.message || 'Failed to update item');
        }
        alert('Item updated successfully!');
      } else {
        // Create new item
        result = await itemService.createItem(itemPayload);
        if (result.error) {
          throw new Error(result.error.message || 'Failed to save item');
        }
        alert('Item created.');
      }

      console.log('Item saved successfully:', result.data);
      setIsLoading(false);
      setShowSaveLoading(false);

      // Navigate to the item list after successful save
      navigate('/items', { state: { refresh: true } });
    } catch (error) {
      console.error('Error saving item:', error);
      setIsLoading(false);
      setShowSaveLoading(false);
      alert(`Error saving item: ${(error as Error).message}`);
    }
  };

  const handleCancel = () => {
    // Navigate back or reset form
    setFormData({
      itemNumber: '',
      ean: '',
      name: '',
      supplier: '',
      manufacturer: '',
      manufacturerItemNumber: '',
      unit: '',
      notes: '',
      active: true,
      itemPackage: false,
      itemType: 'goods' as 'goods' | 'service' | 'other',
      stockItem: true,
      externalWebshop: false,
      discontinued: false,
      bulky: false,
      saleAccount: '3001',
      vat: '25',
      salesSEReverseCharge: '',
      salesEUReverseCharge: '3108',
      salesEUSubjectToVAT: '3106',
      salesExport: '3105',
      purchaseAccount: '4000',
      // Stock details
      costCalculation: 0,
      stockValue: 0,
      inWarehouse: 0,
      reservedQuantity: 0,
      availableAmount: 0,
      orderPoint: 0,
      stockLocation: '',
      widthMM: '',
      heightMM: '',
      depthMM: '',
      weightGrams: '',
    });
  };

  const handleShowList = async () => {
    setIsLoading(true);
    // Simulate a 0.5 second loading time
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    navigate('/items');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ fontSize: '10px' }}>
      {/* Top Action Bar */}
      <div className="mb-6 bg-white shadow rounded-lg border border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">{isEditMode ? `ITEM ${formData.itemNumber} – EDIT` : (formData.itemNumber ? `ITEM ${formData.itemNumber} – CREATE NEW` : 'ITEM – CREATE NEW')}</h1>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center justify-center w-8 h-8 text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-center w-8 h-8 text-gray-700 border border-gray-300 rounded hover:bg-gray-50">
                <ChevronsRight className="h-4 w-4" />
              </button>

              <button
                onClick={async () => {
                  setIsLoading(true);
                  // Simulate a 0.25 second loading time
                  await new Promise(resolve => setTimeout(resolve, 250));
                  // Reset the form to clear all inputs
                  setFormData({
                    itemNumber: '',
                    ean: '',
                    name: '',
                    supplier: '',
                    manufacturer: '',
                    manufacturerItemNumber: '',
                    unit: '',
                    notes: '',
                    active: true,
                    itemPackage: false,
                    itemType: 'goods' as 'goods' | 'service' | 'other',
                    stockItem: true,
                    externalWebshop: false,
                    discontinued: false,
                    bulky: false,
                    saleAccount: '3001',
                    vat: '25',
                    salesSEReverseCharge: '',
                    salesEUReverseCharge: '3108',
                    salesEUSubjectToVAT: '3106',
                    salesExport: '3105',
                    purchaseAccount: '4000',
                    // Stock details
                    costCalculation: 0,
                    stockValue: 0,
                    inWarehouse: 0,
                    reservedQuantity: 0,
                    availableAmount: 0,
                    orderPoint: 0,
                    stockLocation: '',
                    widthMM: '',
                    heightMM: '',
                    depthMM: '',
                    weightGrams: '',
                  });
                  // Reset prices
                  setPriceList([
                    {
                      id: 1,
                      priceList: 'A',
                      name: 'Price list A',
                      price: '0,00',
                      cmr: '100,00',
                      cmSek: '0,00',
                      modificationDate: 'Never modified'
                    }
                  ]);
                  setIsLoading(false);
                }}
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50"
              >
                Create item
              </button>

              <button
                onClick={handleShowList}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-full text-black bg-yellow-500 hover:bg-yellow-400"
              >
                Show list
              </button>

              <button disabled className="flex items-center text-sm text-gray-400 hover:text-gray-400 cursor-not-allowed">
                <Printer className="h-4 w-4 mr-1" />
                Print statistics
              </button>

              <button disabled className="flex items-center text-sm text-gray-400 hover:text-gray-400 cursor-not-allowed">
                <Copy className="h-4 w-4 mr-1" />
                Copy item
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-20 mb-4 flex space-x-8 border-b border-gray-200">
        <button
          className={`py-2 px-1 font-medium text-sm ${activeTab === 'basic' ? 'text-black border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('basic')}
        >
          Basic details
        </button>
        <button
          className={`py-2 px-1 font-medium text-sm ${activeTab === 'stock' ? 'text-black border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('stock')}
        >
          Stock details
        </button>
      </div>

      {/* Main Form */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        {/* Basic Details Tab */}
        {activeTab === 'basic' && (
          <div className="p-6 transition-opacity duration-200 ease-in opacity-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="itemNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Item number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="itemNumber"
                      name="itemNumber"
                      value={formData.itemNumber}
                      autoComplete="off"
                      onChange={handleInputChange}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                      placeholder=""
                    />
                    <button
                      type="button"
                      onClick={generateNextItemNumber}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="ean" className="block text-sm font-medium text-gray-700 mb-1">
                    EAN
                  </label>
                  <input
                    type="text"
                    id="ean"
                    name="ean"
                    value={formData.ean}
                    autoComplete="off"
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder=""
                  />
                </div>

                <div className="relative">
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="supplier"
                      name="supplier"
                      value={formData.supplier}
                      autoComplete="off"
                      onChange={(e) => {
                        // Clear the input value when typing manually
                        setFormData({
                          ...formData,
                          supplier: ''
                        });

                        // Filter suppliers based on input
                        const inputValue = e.target.value.toLowerCase();
                        const filtered = previousSuppliers.filter(supplier =>
                          supplier.number.toLowerCase().includes(inputValue) ||
                          supplier.name.toLowerCase().includes(inputValue) ||
                          supplier.cinPin.toLowerCase().includes(inputValue) ||
                          supplier.bgPg.toLowerCase().includes(inputValue)
                        );
                        setFilteredSuppliers(filtered);
                        setShowSupplierDropdown(inputValue.length > 0 && filtered.length > 0);
                      }}
                      onFocus={() => {
                        if (previousSuppliers.length > 0 && formData.supplier === '') {
                          setFilteredSuppliers(previousSuppliers);
                          setShowSupplierDropdown(true);
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding the dropdown to allow click events
                        setTimeout(() => {
                          setShowSupplierDropdown(false);
                        }, 150);
                      }}
                      className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border pr-10"
                      placeholder="Supplier number, Name, CIN/PIN, Bg/Pg"
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-2 cursor-pointer"
                      onClick={() => {
                        if (previousSuppliers.length > 0) {
                          if (showSupplierDropdown) {
                            setShowSupplierDropdown(false);
                          } else {
                            setFilteredSuppliers(previousSuppliers);
                            setShowSupplierDropdown(true);
                          }
                        }
                      }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </div>
                  </div>

                  {/* Supplier Dropdown Table */}
                  {showSupplierDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier no</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CIN/PIN</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bg/Pg</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {filteredSuppliers.map((supplier) => (
                            <tr
                              key={supplier.id}
                              className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  supplier: `${supplier.number}, ${supplier.name}, ${supplier.cinPin}, ${supplier.bgPg}`
                                });
                                setShowSupplierDropdown(false);
                                setFilteredSuppliers([]);
                              }}
                            >
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.number}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.cinPin}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{supplier.bgPg}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    autoComplete="off"
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder=""
                  />
                </div>

                <div className="relative">
                  <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    value={formData.manufacturer}
                    autoComplete="off"
                    onChange={(e) => {
                      // Update the form data
                      handleInputChange(e);

                      // Filter manufacturers based on input
                      const inputValue = e.target.value.toLowerCase();
                      const filtered = previousManufacturers.filter(mfg =>
                        mfg.toLowerCase().includes(inputValue)
                      );
                      setFilteredManufacturers(filtered);
                      setShowManufacturerDropdown(inputValue.length > 0 && filtered.length > 0);
                    }}
                    onFocus={() => {
                      if (previousManufacturers.length > 0 && formData.manufacturer === '') {
                        setFilteredManufacturers(previousManufacturers);
                        setShowManufacturerDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding the dropdown to allow click events
                      setTimeout(() => {
                        setShowManufacturerDropdown(false);
                      }, 150);
                    }}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Manufacturer"
                  />

                  {/* Dropdown */}
                  {showManufacturerDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {filteredManufacturers.map((mfg, index) => (
                        <div
                          key={index}
                          className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              manufacturer: mfg
                            });
                            setShowManufacturerDropdown(false);
                            setFilteredManufacturers([]);
                          }}
                        >
                          {mfg}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="manufacturerItemNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Manufacturer item number
                  </label>
                  <input
                    type="text"
                    id="manufacturerItemNumber"
                    name="manufacturerItemNumber"
                    value={formData.manufacturerItemNumber}
                    autoComplete="off"
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder=""
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Active
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${formData.active ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, active: true })}
                    >
                      Yes
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${!formData.active ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, active: false })}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item package
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${formData.itemPackage ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => {
                        // Show the modal when switching to Yes
                        setShowPackageModal(true);
                      }}
                    >
                      Yes
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${!formData.itemPackage ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, itemPackage: false })}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item type
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${formData.itemType === 'goods' ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, itemType: 'goods' })}
                    >
                      Goods
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${formData.itemType === 'service' ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, itemType: 'service' })}
                    >
                      Service
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock item
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${formData.stockItem ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, stockItem: true })}
                    >
                      Yes
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${!formData.stockItem ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, stockItem: false })}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    External webshop
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${formData.externalWebshop ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, externalWebshop: true })}
                    >
                      Yes
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${!formData.externalWebshop ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, externalWebshop: false })}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discontinued
                  </label>
                  <div className="flex space-x-4">
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${formData.discontinued ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, discontinued: true })}
                    >
                      Yes
                    </button>
                    <button
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded border ${!formData.discontinued ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600 border-gray-300'}`}
                      onClick={() => setFormData({ ...formData, discontinued: false })}
                    >
                      No
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">Select unit</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="m">Meters (m)</option>
                    <option value="l">Liters (l)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder=""
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Prices Section */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <h3
                    className="text-lg font-semibold text-gray-900 cursor-pointer flex items-center"
                    onClick={() => toggleSection('prices')}
                  >
                    Prices
                    <ChevronDown
                      className={`h-5 w-5 text-green-600 ml-2 transform transition-transform ${expandedSections.prices ? 'rotate-180' : ''
                        }`}
                    />
                  </h3>
                </div>
              </div>

              {expandedSections.prices && (
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Price list</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">CMR %</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">CM SEK</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Modification date</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {priceList.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.priceList}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                            <input
                              type="text"
                              value={item.price}
                              onChange={(e) => {
                                const updatedPriceList = [...priceList];
                                const index = updatedPriceList.findIndex(p => p.id === item.id);
                                if (index !== -1) {
                                  updatedPriceList[index].price = e.target.value;
                                  setPriceList(updatedPriceList);
                                }
                              }}
                              className="w-full text-right bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter') {
                                  // Update CMR % to 100% when Enter is pressed
                                  const updatedPriceList = [...priceList];
                                  const index = updatedPriceList.findIndex(p => p.id === item.id);
                                  if (index !== -1) {
                                    updatedPriceList[index].cmr = '100,00';
                                    // Calculate CM SEK based on price
                                    const target = e.target as HTMLInputElement;
                                    updatedPriceList[index].cmSek = target.value;
                                    setPriceList(updatedPriceList);
                                  }
                                }
                              }}
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                            <input
                              type="text"
                              value={item.cmr}
                              onChange={(e) => {
                                const updatedPriceList = [...priceList];
                                const index = updatedPriceList.findIndex(p => p.id === item.id);
                                if (index !== -1) {
                                  updatedPriceList[index].cmr = e.target.value;
                                  setPriceList(updatedPriceList);
                                }
                              }}
                              className="w-full text-right bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">{item.cmSek}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.modificationDate}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                            <button className="text-gray-500 hover:text-green-600">
                              <BarChart3 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stock Details Tab */}
        {activeTab === 'stock' && (
          <div className="p-6 transition-opacity duration-200 ease-in opacity-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Financial/Stock Values */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Cost calculation
                  </label>
                  <input
                    type="text"
                    name="costCalculation"
                    value={formData.costCalculation}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Stock value
                  </label>
                  <input
                    type="text"
                    name="stockValue"
                    value={formData.stockValue}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md text-right"
                  />
                </div>
              </div>

              {/* Middle Column - Inventory Status */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    In warehouse
                  </label>
                  <input
                    type="text"
                    name="inWarehouse"
                    value={formData.inWarehouse}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Reserved quantity
                  </label>
                  <input
                    type="text"
                    name="reservedQuantity"
                    value={formData.reservedQuantity}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Available amount
                  </label>
                  <input
                    type="text"
                    name="availableAmount"
                    value={formData.availableAmount}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md text-right"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Order point
                  </label>
                  <input
                    type="text"
                    name="orderPoint"
                    value={formData.orderPoint}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Stock location
                  </label>
                  <input
                    type="text"
                    name="stockLocation"
                    value={formData.stockLocation}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md"
                    placeholder="Stock location"
                  />
                </div>
              </div>

              {/* Right Column - Physical Attributes */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Width (mm)
                  </label>
                  <input
                    type="text"
                    name="widthMM"
                    value={formData.widthMM}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Height (mm)
                  </label>
                  <input
                    type="text"
                    name="heightMM"
                    value={formData.heightMM}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md"
                    placeholder=""
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Depth (mm)
                  </label>
                  <input
                    type="text"
                    name="depthMM"
                    value={formData.depthMM}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md"
                    placeholder=""
                  />
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Weight (Grams)
                    </label>
                    <input
                      type="text"
                      name="weightGrams"
                      value={formData.weightGrams}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md"
                      placeholder=""
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">
                    Bulky
                  </label>
                  <div className="flex w-32 border border-gray-300 rounded-md overflow-hidden">
                    <button
                      className={`flex-1 py-2 text-sm font-medium ${formData.bulky ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600'}`}
                      onClick={() => setFormData({ ...formData, bulky: true })}
                    >
                      Yes
                    </button>
                    <button
                      className={`flex-1 py-2 text-sm font-medium ${!formData.bulky ? 'bg-gray-200 text-gray-900' : 'bg-white text-gray-600'}`}
                      onClick={() => setFormData({ ...formData, bulky: false })}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Accounting Details Section - Only in Basic Details tab */}
        {activeTab === 'basic' && (
          <div className="border-t border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <span className="text-green-600 mr-2">✓</span>
              <h3
                className="text-lg font-semibold text-gray-900 cursor-pointer flex items-center"
                onClick={() => toggleSection('accounting')}
              >
                Accounting details
                <ChevronDown
                  className={`h-5 w-5 text-green-600 ml-2 transform transition-transform ${expandedSections.accounting ? 'rotate-180' : ''
                    }`}
                />
              </h3>
            </div>

            <div className="mb-4 border-t border-gray-200"></div>

            {expandedSections.accounting && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="saleAccount" className="block text-sm font-medium text-gray-700 mb-1">
                    Sale
                  </label>
                  <select
                    id="saleAccount"
                    name="saleAccount"
                    value={formData.saleAccount}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.account_number}>
                        {account.account_number} - {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="vat" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    VAT
                    <button type="button" className="ml-2 text-blue-500 hover:text-blue-700">
                      <InfoIcon />
                    </button>
                  </label>
                  <select
                    id="vat"
                    name="vat"
                    value={formData.vat}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="0">0%</option>
                    <option value="6">6%</option>
                    <option value="12">12%</option>
                    <option value="25">25%</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="salesSEReverseCharge" className="block text-sm font-medium text-gray-700 mb-1">
                    Sales SE reverse charge
                  </label>
                  <select
                    id="salesSEReverseCharge"
                    name="salesSEReverseCharge"
                    value={formData.salesSEReverseCharge}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.account_number}>
                        {account.account_number} - {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="salesEUReverseCharge" className="block text-sm font-medium text-gray-700 mb-1">
                    Sales EU reverse charge
                  </label>
                  <select
                    id="salesEUReverseCharge"
                    name="salesEUReverseCharge"
                    value={formData.salesEUReverseCharge}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.account_number}>
                        {account.account_number} - {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="salesEUSubjectToVAT" className="block text-sm font-medium text-gray-700 mb-1">
                    Sales EU subject to VAT
                  </label>
                  <select
                    id="salesEUSubjectToVAT"
                    name="salesEUSubjectToVAT"
                    value={formData.salesEUSubjectToVAT}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.account_number}>
                        {account.account_number} - {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="salesExport" className="block text-sm font-medium text-gray-700 mb-1">
                    Sales Export
                  </label>
                  <select
                    id="salesExport"
                    name="salesExport"
                    value={formData.salesExport}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.account_number}>
                        {account.account_number} - {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="purchaseAccount" className="block text-sm font-medium text-gray-700 mb-1">
                    Purchase
                  </label>
                  <select
                    id="purchaseAccount"
                    name="purchaseAccount"
                    value={formData.purchaseAccount}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.account_number}>
                        {account.account_number} - {account.account_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Action Bar */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 sticky bottom-0">
          <div className="flex justify-between items-center">
            <div>
              <button
                disabled
                className="px-4 py-2 bg-gray-400 text-white rounded-full text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleShowList}
                className="px-4 py-2 bg-gray-400 text-white rounded-full text-sm font-medium"
              >
                Show list
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-full text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-700 text-white rounded-full text-sm font-medium"
                >
                  {isEditMode ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(isLoading || showSaveLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <img src="/src/assets/loading/200.gif" alt="Loading..." className="h-16 w-16" />
        </div>
      )}

      {/* Item Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              DO YOU HAVE AN INTEGRATION WITHIN QUOTE/ORDER/INVOICING?
            </h3>
            <p className="text-gray-700 mb-4">
              If your integration does not support item packages, the included items will be
              <br />
              displayed as standard line items.
              <br /><br />
              If you are uncertain whether your integration supports item packages, we recommend
              <br />
              sending a test invoice and possibly contacting the integrator regarding this matter.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  // Set itemPackage to true and close the modal
                  setFormData({ ...formData, itemPackage: true });
                  setShowPackageModal(false);
                }}
                className="px-4 py-2 bg-[#003824] text-white rounded-md hover:bg-[#002818]"
                style={{ backgroundColor: '#003824' }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// Info icon component
const InfoIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default ItemForm;