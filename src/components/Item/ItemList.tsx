import React, { useState, useEffect } from 'react';
import { Search, Plus, Download, Printer, Trash2, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { itemService } from '../../services/itemService';
import type { Item } from '../../services/itemService';

const ItemList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // State to trigger refresh
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch items from backend
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Set loading to true at the start of fetch
      try {
        // Get foundation ID from localStorage
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        const foundationId = userData.foundationId || '12345678-1234-1234-1234-123456789012';

        const { data, error } = await itemService.getItems(foundationId);

        if (error) {
          console.error('Error fetching items:', error);
          // Set empty array in case of error
          setItems([]);
        } else {
          setItems(data || []);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [refreshTrigger]);

  // Filter items based on search term and active tab
  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.item_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase());

    // For this example, we're showing all items regardless of active/inactive status
    // since the mock data doesn't have an explicit status field
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedItems.map(item => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };
  
  const handleRowClick = (itemId: string) => {
    navigate(`/items/edit/${itemId}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Function to refresh items
  const refreshItems = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Check for refresh signal on location state change
  useEffect(() => {
    if (location.state?.refresh) {
      refreshItems();
      // Clear the refresh state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Initial refresh on mount
  useEffect(() => {
    refreshItems();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" style={{ fontSize: '10px' }}>
      {/* Header / Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">DIRECTORY - ITEMS</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 min-w-[280px] sm:min-w-[320px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              autoComplete="off"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Item no., Title"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button className="text-blue-600 hover:underline text-sm">
                Extended search
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none">
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </button>

            <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-transparent hover:bg-gray-50 focus:outline-none">
              <Printer className="h-4 w-4 mr-1" />
              Print list
            </button>

            <button
              disabled
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-gray-400 bg-transparent cursor-not-allowed"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Restore price update
            </button>
          </div>

          <button
            onClick={async () => {
              setListLoading(true);
              // Simulate a 0.5 second loading time
              await new Promise(resolve => setTimeout(resolve, 500));
              setListLoading(false);
              navigate('/items/create');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            disabled={listLoading}
          >
            {listLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Create item
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        {['all', 'active', 'inactive'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 border border-gray-300 text-sm font-medium ${activeTab === tab
              ? 'bg-gray-200 text-gray-900'
              : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1); // Reset to first page when changing tabs
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <img src="/src/assets/loading/200.gif" alt="Loading..." className="h-16 w-16" />
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-white border-b-2 border-gray-300">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === paginatedItems.length && paginatedItems.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Item No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Cost Calculation
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                    In Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Reserved
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Available
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Stock Location
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Stock Value
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedItems.length > 0 ? (
                  paginatedItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 ${selectedItems.includes(item.id) ? 'bg-gray-100' : ''} cursor-pointer`}
                      onClick={() => handleRowClick(item.id)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.item_number}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {item.sale_account && item.vat ? (parseFloat(item.sale_account) * (1 + parseInt(item.vat) / 100)).toFixed(2) : ''}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {item.purchase_account}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {item.in_warehouse}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {item.reserved_quantity}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {item.available_amount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.stock_location || ''}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {item.stock_value ? item.stock_value.toFixed(2) : ''}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-500">
                        <button 
                        className="text-gray-500 hover:text-gray-700 mr-2"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click handler from firing
                          handleRowClick(item.id);
                        }}
                      >
                          Edit
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-sm text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(startIndex + itemsPerPage, filteredItems.length)}
                </span>{' '}
                of <span className="font-medium">{filteredItems.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Previous</span>
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                      ? 'z-10 bg-green-600 border-green-600 text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                >
                  <span className="sr-only">Next</span>
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <button
              disabled={selectedItems.length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full ${selectedItems.length === 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
                }`}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-green-500 hover:bg-green-600">
              Activate
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gray-400">
              Deactivate
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gray-600">
              Update all prices
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-gray-400">
              Update selected prices
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {(listLoading || loading) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <img src="/src/assets/loading/200.gif" alt="Loading..." className="h-16 w-16" />
        </div>
      )}
    </div>
  );
};

export default ItemList;