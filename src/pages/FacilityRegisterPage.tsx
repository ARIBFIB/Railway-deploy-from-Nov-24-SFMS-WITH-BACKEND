import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { 
  Search, 
  Plus, 
  Printer, 
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Menu
} from 'lucide-react';

interface Asset {
  id: string;
  number: string;
  name: string;
  assetType: string;
  publicRelations: string;
  ks: string;
  acquisitionValue: number;
  acquisitionDate: string;
  status: 'not-started' | 'activated' | 'written-off' | 'discarded' | 'sold' | 'cancelled';
}

interface DepreciationAsset {
  id: string;
  number: string;
  name: string;
  assetType: string;
  depreciationPeriod: string;
  depreciationAmount: number;
  remainingValue: number;
  selected: boolean;
}

const mockAssets: Asset[] = [
  {
    id: '1',
    number: '1',
    name: 'Brand Logo',
    assetType: '1030 - Patents',
    publicRelations: '',
    ks: '',
    acquisitionValue: 10000.00,
    acquisitionDate: '2025-02-17',
    status: 'activated'
  },
  {
    id: '2',
    number: '2',
    name: 'Office Computer',
    assetType: '1030 - Equipment',
    publicRelations: '',
    ks: '',
    acquisitionValue: 15000.00,
    acquisitionDate: '2025-01-15',
    status: 'activated'
  },
  {
    id: '3',
    number: '3',
    name: 'Office Desk',
    assetType: '1030 - Furniture',
    publicRelations: '',
    ks: '',
    acquisitionValue: 5000.00,
    acquisitionDate: '2025-01-10',
    status: 'not-started'
  }
];

const mockDepreciationAssets: DepreciationAsset[] = [
  {
    id: '1',
    number: '1',
    name: 'Brand Logo',
    assetType: '1030 - Patents',
    depreciationPeriod: '2025-05-01 - 2025-05-31',
    depreciationAmount: 167.00,
    remainingValue: 9499.00,
    selected: true
  },
  {
    id: '2',
    number: '2',
    name: 'Office Computer',
    assetType: '1030 - Equipment',
    depreciationPeriod: '2025-05-01 - 2025-05-31',
    depreciationAmount: 250.00,
    remainingValue: 14250.00,
    selected: false
  },
  {
    id: '3',
    number: '3',
    name: 'Office Desk',
    assetType: '1030 - Furniture',
    depreciationPeriod: '2025-05-01 - 2025-05-31',
    depreciationAmount: 83.33,
    remainingValue: 4166.67,
    selected: false
  }
];

export const FacilityRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'assets' | 'depreciation'>('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assets] = useState<Asset[]>(mockAssets);
  const [currentPage, setCurrentPage] = useState(1);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  
  // Depreciation state
  const [depreciationAssets, setDepreciationAssets] = useState<DepreciationAsset[]>(mockDepreciationAssets);
  const [writeOffEmptyDate, setWriteOffEmptyDate] = useState('2025-05-31');
  const [transactionDate, setTransactionDate] = useState('2025-05-31');
  const [printReport, setPrintReport] = useState(false);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.assetType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-yellow-100 text-yellow-800';
      case 'activated':
        return 'bg-green-100 text-green-800';
      case 'written-off':
        return 'bg-green-100 text-green-800';
      case 'discarded':
        return 'bg-gray-100 text-gray-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'Not started';
      case 'activated':
        return 'Activated';
      case 'written-off':
        return 'Completely written off';
      case 'discarded':
        return 'Discarded';
      case 'sold':
        return 'Sold';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const handleAdvancedSearch = () => {
    console.log('Advanced search clicked');
  };

  const handleCreateAsset = () => {
    navigate('/asset-form');
  };

  const handlePrintList = () => {
    console.log('Print list clicked');
  };

  // Depreciation handlers
  const handleSelectAllDepreciation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setDepreciationAssets(prev => prev.map(asset => ({ ...asset, selected: isChecked })));
  };

  const handleSelectDepreciationAsset = (id: string) => {
    setDepreciationAssets(prev =>
      prev.map(asset =>
        asset.id === id ? { ...asset, selected: !asset.selected } : asset
      )
    );
  };

  const handlePerformDepreciation = () => {
    const selectedAssets = depreciationAssets.filter(asset => asset.selected);
    console.log('Performing depreciation for selected assets:', selectedAssets);
    if (printReport) {
      console.log('Printing depreciation report.');
    }
  };

  const totalPages = Math.ceil(filteredAssets.length / 10);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentAssets = filteredAssets.slice(startIndex, endIndex);

  // Depreciation calculations
  const selectedDepreciationAssets = depreciationAssets.filter(asset => asset.selected);
  const totalDepreciationAmount = selectedDepreciationAssets.reduce((sum, asset) => sum + asset.depreciationAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'assets'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assets
          </button>
          <button
            onClick={() => setActiveTab('depreciation')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'depreciation'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Depreciation
          </button>
        </div>
      </div>

      {/* Assets Tab Content */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          {/* Main Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase">ASSETS - LIST</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrintList}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                <Printer className="w-4 h-4" />
                Print list
              </button>
              <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1">
                <span className="text-sm text-gray-600">1 of 1</span>
                <ChevronLeft className="w-4 h-4 text-gray-400" />
                <div className="w-6 h-6 bg-green-500 text-white text-xs flex items-center justify-center rounded">1</div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

      {/* Search and Create Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Number, Name, Asset type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <button 
            onClick={handleAdvancedSearch}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Advanced search
          </button>
        </div>
        <Button
          onClick={handleCreateAsset}
          className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create asset
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1">
        {[
          { key: 'all', label: 'All', count: null },
          { key: 'not-started', label: 'Not started', count: assets.filter(a => a.status === 'not-started').length },
          { key: 'activated', label: 'Activated', count: assets.filter(a => a.status === 'activated').length },
          { key: 'written-off', label: 'Completely written off', count: assets.filter(a => a.status === 'written-off').length },
          { key: 'discarded', label: 'Discarded', count: assets.filter(a => a.status === 'discarded').length },
          { key: 'sold', label: 'Sold', count: assets.filter(a => a.status === 'sold').length },
          { key: 'cancelled', label: 'Cancelled', count: assets.filter(a => a.status === 'cancelled').length }
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key)}
            className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
              statusFilter === filter.key
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {filter.label}
            {filter.count !== null && filter.count > 0 && (
              <span className={`w-2 h-2 rounded-full ${
                filter.key === 'not-started' ? 'bg-yellow-400' :
                filter.key === 'activated' || filter.key === 'written-off' ? 'bg-green-400' :
                'bg-gray-400'
              }`}></span>
            )}
          </button>
        ))}
      </div>

      {/* Assets Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NUMBER
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ASSET TYPE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PUBLIC RELATIONS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACQUISITION VALUE (SEK)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACQUISITION DATE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentAssets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {asset.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.assetType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.publicRelations || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.ks || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.acquisitionValue.toLocaleString('sv-SE', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {asset.acquisitionDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(asset.status)}`}>
                    {getStatusText(asset.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

          {/* Bottom Pagination */}
          <div className="flex justify-end">
            <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1">
              <ChevronLeft className="w-4 h-4 text-gray-400" />
              <div className="w-6 h-6 bg-green-500 text-white text-xs flex items-center justify-center rounded">1</div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      {/* Depreciation Tab Content */}
      {activeTab === 'depreciation' && (
        <div className="space-y-6">
          {/* Depreciation Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase">ASSETS - DEPRECIATION</h1>
          </div>

          {/* Date Input Fields */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label htmlFor="writeOffEmpty" className="text-sm font-medium text-gray-700">
                Write off empty
              </label>
              <div className="relative">
                <Input
                  id="writeOffEmpty"
                  type="date"
                  value={writeOffEmptyDate}
                  onChange={(e) => setWriteOffEmptyDate(e.target.value)}
                  className="pr-8"
                />
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="transactionDate" className="text-sm font-medium text-gray-700">
                Transaction date
              </label>
              <div className="relative">
                <Input
                  id="transactionDate"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="pr-8"
                />
                <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Depreciation Assets Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                      onChange={handleSelectAllDepreciation}
                      checked={selectedDepreciationAssets.length === depreciationAssets.length && depreciationAssets.length > 0}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NUMBER
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NAME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ASSET TYPE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DEPRECIATION PERIOD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DEPRECIATION AMOUNT (SEK)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    REMAINING VALUE (SEK)
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <Menu className="h-4 w-4 inline-block" />
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {depreciationAssets.map((asset) => (
                  <tr key={asset.id} className={asset.selected ? 'bg-green-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out"
                        checked={asset.selected}
                        onChange={() => handleSelectDepreciationAsset(asset.id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asset.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.assetType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.depreciationPeriod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.depreciationAmount.toLocaleString('sv-SE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.remainingValue.toLocaleString('sv-SE', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {/* Actions for each row if needed */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Summary and Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                ({selectedDepreciationAssets.length} selected)
              </p>
              <p className="text-sm text-gray-700">
                (Total marked depreciation amounts: {totalDepreciationAmount.toLocaleString('sv-SE', { minimumFractionDigits: 2 })} SEK)
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-green-600"
                  checked={printReport}
                  onChange={(e) => setPrintReport(e.target.checked)}
                />
                <span>Print report of depreciation performed</span>
              </label>
              <Button 
                onClick={handlePerformDepreciation} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Perform depreciation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
