import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Printer, RotateCcw, Trash2, Eye, EyeOff, Edit } from 'lucide-react';
import { Button } from '../components/ui/button';
import CreateSupplierModal from '../components/CreateSupplierModal';

interface Supplier {
  id: string;
  supplierNo: string;
  name: string;
  corporatePersonalNo: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  isActive: boolean;
}

const SuppliersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    // Empty for now - will be populated when suppliers are added
  ]);

  const totalItems = suppliers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSelectSupplier = (supplierId: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(supplierId)
        ? prev.filter((id) => id !== supplierId)
        : [...prev, supplierId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSuppliers.length === filteredSuppliers.length) {
      setSelectedSuppliers([]);
    } else {
      setSelectedSuppliers(filteredSuppliers.map((supplier) => supplier.id));
    }
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateModalSave = (supplierData: any) => {
    console.log('Saving supplier:', supplierData);
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      supplierNo: supplierData.supplierNo,
      name: supplierData.supplierName,
      corporatePersonalNo: supplierData.corporatePersonalNo,
      postalCode: supplierData.postalCode,
      city: supplierData.city,
      country: supplierData.country,
      phone: supplierData.phone,
      email: supplierData.email,
      isActive: supplierData.isActive,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
    setShowCreateModal(false);
  };

  const handleDelete = () => {
    if (selectedSuppliers.length === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedSuppliers.length} selected supplier(s)?`)) {
      setSuppliers((prev) => prev.filter((supplier) => !selectedSuppliers.includes(supplier.id)));
      setSelectedSuppliers([]);
    }
  };

  const handleActivate = () => {
    if (selectedSuppliers.length === 0) return;

    setSuppliers((prev) =>
      prev.map((supplier) =>
        selectedSuppliers.includes(supplier.id)
          ? { ...supplier, isActive: true }
          : supplier
      )
    );
    setSelectedSuppliers([]);
  };

  const handleDisable = () => {
    if (selectedSuppliers.length === 0) return;

    setSuppliers((prev) =>
      prev.map((supplier) =>
        selectedSuppliers.includes(supplier.id)
          ? { ...supplier, isActive: false }
          : supplier
      )
    );
    setSelectedSuppliers([]);
  };

  const hasActiveSelected = selectedSuppliers.some((id) => {
    const supplier = suppliers.find((sup) => sup.id === id);
    return supplier?.isActive;
  });

  const hasInactiveSelected = selectedSuppliers.some((id) => {
    const supplier = suppliers.find((sup) => sup.id === id);
    return !supplier?.isActive;
  });

  const filteredSuppliers = suppliers.filter((supplier) => {
    if (filter === 'active') return supplier.isActive;
    if (filter === 'inactive') return !supplier.isActive;
    return true;
  });

  const handleFilterChange = (newFilter: 'all' | 'active' | 'inactive') => {
    setFilter(newFilter);
    setSelectedSuppliers([]);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-2 py-1 text-sm ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">REGISTER - SUPPLIERS</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Supplier number, Name, Organization/Person"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  aria-label="Search suppliers"
                />
              </div>
              <button
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                aria-label="Advanced search"
              >
                Advanced search
              </button>
              <Button
                onClick={handleCreateNew}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-lg flex items-center space-x-2"
                aria-label="Create new supplier"
              >
                <Plus className="w-4 h-4" />
                <span>Create supplier</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Edit className="w-4 h-4" />
                <span>Mass handling</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <RotateCcw className="w-4 h-4" />
                <span>Invite suppliers to e-invoice</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Printer className="w-4 h-4" />
                <span>Print list</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                aria-label="Items per page"
              >
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={200}>200</option>
              </select>
              <span className="text-sm text-gray-600">of {totalItems}</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Go to first page"
                >
                  {'<<'}
                </button>
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Go to previous page"
                >
                  {'<'}
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Go to next page"
                >
                  {'>'}
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  aria-label="Go to last page"
                >
                  {'>>'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-2">
          <div className="flex space-x-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-label="Show all suppliers"
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-label="Show active suppliers"
            >
              Active
            </button>
            <button
              onClick={() => handleFilterChange('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'inactive'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-label="Show inactive suppliers"
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSuppliers.length === filteredSuppliers.length && filteredSuppliers.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    aria-label="Select all suppliers"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-blue-50">
                  SUPPLIER NUMBER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CORPORATE/PERSONAL ID NUMBER
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  POSTAL CODE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CITY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  COUNTRY
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  PHONE
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-MAIL
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className={!supplier.isActive ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(supplier.id)}
                        onChange={() => handleSelectSupplier(supplier.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label={`Select supplier ${supplier.supplierNo}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {supplier.supplierNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {supplier.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.corporatePersonalNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.postalCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {supplier.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    {filter === 'active' && 'No active suppliers found'}
                    {filter === 'inactive' && 'No inactive suppliers found'}
                    {filter === 'all' && 'No suppliers found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleDelete}
                disabled={selectedSuppliers.length === 0}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  selectedSuppliers.length > 0
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                aria-label="Delete selected suppliers"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <span className="text-sm text-gray-600">
                ({selectedSuppliers.length} selected)
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleDisable}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  hasActiveSelected
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!hasActiveSelected}
                aria-label="Disable selected suppliers"
              >
                <EyeOff className="w-4 h-4" />
                <span>Disable</span>
              </button>
              <button
                onClick={handleActivate}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  hasInactiveSelected
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!hasInactiveSelected}
                aria-label="Activate selected suppliers"
              >
                <Eye className="w-4 h-4" />
                <span>Activate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Supplier Modal */}
      <CreateSupplierModal
        isOpen={showCreateModal}
        onClose={handleCreateModalClose}
        onSave={handleCreateModalSave}
      />
    </div>
  );
};

export default SuppliersPage;
