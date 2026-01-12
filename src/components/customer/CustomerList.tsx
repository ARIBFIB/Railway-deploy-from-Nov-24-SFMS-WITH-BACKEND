import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Clock, 
  Users, 
  Printer,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

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

interface CustomerListProps {
  customers: Customer[];
  loading?: boolean;
  onCustomerSelect?: (customer: Customer) => void;
  onCreateCustomer?: () => void;
}

const CustomerList: React.FC<CustomerListProps> = ({ 
  customers = [],
  loading = false,
  onCustomerSelect,
  onCreateCustomer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof Customer>('customerId');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.orgPersonNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || customer.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

  const handleSelectAll = () => {
    if (selectedCustomers.length === currentItems.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(currentItems.map(c => c.id));
    }
  };

  const handleSelectCustomer = (customerId: string) => {
    if (selectedCustomers.includes(customerId)) {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    } else {
      setSelectedCustomers([...selectedCustomers, customerId]);
    }
  };

  const handleSort = (column: keyof Customer) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const isColumnSorted = (column: keyof Customer) => sortColumn === column;

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-[#1A1A1A] tracking-[0.3px]">DIRECTORY – CUSTOMERS</h1>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#4A4A4A] hover:text-black"
            >
              <Clock className="h-4 w-4" />
              E-invoice requests
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#4A4A4A] hover:text-black"
            >
              <Users className="h-4 w-4" />
              Invite customers to e-invoice
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#4A4A4A] hover:text-black"
            >
              <Printer className="h-4 w-4" />
              Print list
            </button>
            <button
              onClick={onCreateCustomer}
              className="bg-[#FFC107] hover:bg-[#FFB300] text-black px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create customer
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
              <input
                type="text"
                placeholder="Customer no., Name, CIN/PIN"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-[#DADADA] rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                style={{ width: '280px' }}
              />
            </div>
            <button
              className="text-[#1976D2] hover:underline text-sm"
            >
              Extended search
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-2 text-sm rounded border border-[#DADADA] ${
              activeFilter === 'all'
                ? 'bg-[#F5F5F5] font-medium text-[#333333]'
                : 'bg-white text-[#333333] hover:text-[#1A1A1A]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3.5 py-2 text-sm rounded border border-[#DADADA] ${
              activeFilter === 'active'
                ? 'bg-[#F5F5F5] font-medium text-[#333333]'
                : 'bg-white text-[#333333] hover:text-[#1A1A1A]'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveFilter('inactive')}
            className={`px-3.5 py-2 text-sm rounded border border-[#DADADA] ${
              activeFilter === 'inactive'
                ? 'bg-[#F5F5F5] font-medium text-[#333333]'
                : 'bg-white text-[#333333] hover:text-[#1A1A1A]'
            }`}
          >
            Inactive
          </button>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-[#333333]">0</span>
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              className="text-sm border border-[#DADADA] rounded px-2 py-1 bg-white"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E0E0E0] rounded overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#FAFAFA]">
              <tr>
                <th className="px-4 py-3 text-left w-9">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === currentItems.length && currentItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider cursor-pointer ${
                    isColumnSorted('customerId') ? 'bg-[#B8B8B8] text-white' : ''
                  }`}
                  onClick={() => handleSort('customerId')}
                >
                  CUSTOMER NO.
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider cursor-pointer ${
                    isColumnSorted('name') ? 'bg-[#B8B8B8] text-white' : ''
                  }`}
                  onClick={() => handleSort('name')}
                >
                  NAME
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider cursor-pointer ${
                    isColumnSorted('orgPersonNumber') ? 'bg-[#B8B8B8] text-white' : ''
                  }`}
                  onClick={() => handleSort('orgPersonNumber')}
                >
                  CIN/PIN
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider cursor-pointer ${
                    isColumnSorted('postalCode') ? 'bg-[#B8B8B8] text-white' : ''
                  }`}
                  onClick={() => handleSort('postalCode')}
                >
                  POSTCODE
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider cursor-pointer ${
                    isColumnSorted('city') ? 'bg-[#B8B8B8] text-white' : ''
                  }`}
                  onClick={() => handleSort('city')}
                >
                  CITY
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider cursor-pointer ${
                    isColumnSorted('country') ? 'bg-[#B8B8B8] text-white' : ''
                  }`}
                  onClick={() => handleSort('country')}
                >
                  COUNTRY
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider cursor-pointer ${
                    isColumnSorted('phone') ? 'bg-[#B8B8B8] text-white' : ''
                  }`}
                  onClick={() => handleSort('phone')}
                >
                  PHONE
                </th>
                <th 
                  className={`px-4 py-3 text-left text-xs font-semibold text-[#333333] uppercase tracking-wider cursor-pointer ${
                    isColumnSorted('email') ? 'bg-[#B8B8B8] text-white' : ''
                  }`}
                  onClick={() => handleSort('email')}
                >
                  E-MAIL
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-[#757575]">
                    No customers to display
                  </td>
                </tr>
              ) : (
                currentItems.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className={`border-t border-[#EEEEEE] hover:bg-[#F9F9F9] ${
                      selectedCustomers.includes(customer.id) ? 'bg-[#E3F2FD]' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCustomerSelect && onCustomerSelect(customer);
                    }}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectCustomer(customer.id);
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">{customer.customerId}</td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">{customer.name}</td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">{customer.orgPersonNumber}</td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">{customer.postalCode}</td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">{customer.city}</td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">{customer.country}</td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">{customer.phone}</td>
                    <td className="px-4 py-3 text-sm text-[#2E2E2E]">{customer.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end mt-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`p-1 ${currentPage === 1 ? 'text-[#BDBDBD]' : 'text-[#1A1A1A] hover:bg-gray-100'}`}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1 ${currentPage === 1 ? 'text-[#BDBDBD]' : 'text-[#1A1A1A] hover:bg-gray-100'}`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded text-sm ${
                  currentPage === page 
                    ? 'bg-[#B8B8B8] text-white' 
                    : 'text-[#1A1A1A] hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1 ${currentPage === totalPages ? 'text-[#BDBDBD]' : 'text-[#1A1A1A] hover:bg-gray-100'}`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-1 ${currentPage === totalPages ? 'text-[#BDBDBD]' : 'text-[#1A1A1A] hover:bg-gray-100'}`}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom Actions - Sticky */}
        <div className="sticky bottom-0 bg-white border-t border-[#E0E0E0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              disabled={selectedCustomers.length === 0}
              className="px-5 py-2 bg-[#D6D6D6] text-white rounded-full text-sm font-medium hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
            <span className="text-xs text-[#757575]">
              ({selectedCustomers.length} selected)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={selectedCustomers.length === 0}
              className="px-4 py-2 bg-[#D6D6D6] text-white rounded-full text-sm font-medium hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Deactivate
            </button>
            <button
              disabled={selectedCustomers.length === 0}
              className="px-4 py-2 bg-[#81C784] text-white rounded-full text-sm font-medium hover:bg-[#66BB6A] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;