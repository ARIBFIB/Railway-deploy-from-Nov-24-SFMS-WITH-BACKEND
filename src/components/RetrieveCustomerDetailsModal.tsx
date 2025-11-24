import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface RetrieveCustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (searchData: any) => void;
}

const RetrieveCustomerDetailsModal: React.FC<RetrieveCustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  onSearch
}) => {
  const [searchData, setSearchData] = useState({
    organizationNumber: '',
    name: '',
    postalAddress: '',
    postalCode: '',
    city: '',
    companyTypes: {
      ab: true,
      hbKb: true,
      ef: true,
      other: true
    }
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompanyTypeChange = (type: string, checked: boolean) => {
    setSearchData(prev => ({
      ...prev,
      companyTypes: {
        ...prev.companyTypes,
        [type]: checked
      }
    }));
  };

  const handleClear = () => {
    setSearchData({
      organizationNumber: '',
      name: '',
      postalAddress: '',
      postalCode: '',
      city: '',
      companyTypes: {
        ab: true,
        hbKb: true,
        ef: true,
        other: true
      }
    });
  };

  const handleSearch = () => {
    onSearch(searchData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* Header */}
        <div className="bg-green-800 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white uppercase">RETRIEVE CUSTOMER DETAILS</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization number
                </label>
                <input
                  type="text"
                  value={searchData.organizationNumber}
                  onChange={(e) => handleInputChange('organizationNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={searchData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal address
                </label>
                <input
                  type="text"
                  value={searchData.postalAddress}
                  onChange={(e) => handleInputChange('postalAddress', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal code
                </label>
                <input
                  type="text"
                  value={searchData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={searchData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Company Type Selection */}
          <div className="mt-6">
            <div className="flex items-center space-x-6">
              <label className="text-sm font-medium text-gray-700">Company type</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchData.companyTypes.ab}
                    onChange={(e) => handleCompanyTypeChange('ab', e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">AB</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchData.companyTypes.hbKb}
                    onChange={(e) => handleCompanyTypeChange('hbKb', e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">HB / KB</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchData.companyTypes.ef}
                    onChange={(e) => handleCompanyTypeChange('ef', e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">EF</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={searchData.companyTypes.other}
                    onChange={(e) => handleCompanyTypeChange('other', e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Other</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-3">
          <button
            onClick={handleClear}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
          >
            Clear
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-green-800 hover:bg-green-900 text-white rounded-lg text-sm font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetrieveCustomerDetailsModal;


