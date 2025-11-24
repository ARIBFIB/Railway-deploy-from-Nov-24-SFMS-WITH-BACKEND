import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, DollarSign, Eye, Edit, Filter } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { mockInvestments, mockFoundations } from '../data/mockData';

export const InvestmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);
  
  const [predefinedInvestmentTypes] = useState([
    'Stock',
    'Bond',
    'Mutual Fund',
    'Real Estate',
    'Commodity',
    'Cash',
    'ETF',
    'Index Fund',
    'Hedge Fund',
    'Private Equity',
    'Venture Capital',
    'Cryptocurrency',
    'Precious Metals',
    'Government Securities',
    'Corporate Bonds',
    'Municipal Bonds',
    'REITs',
    'Options',
    'Futures',
    'Other'
  ]);

  // Handle clicks outside to close filter menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredInvestments = mockInvestments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || investment.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    setIsFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const getPerformanceIcon = (performance?: number) => {
    if (!performance) return <DollarSign className="w-5 h-5 text-gray-500" />;
    return performance >= 0 
      ? <TrendingUp className="w-5 h-5 text-green-500" />
      : <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getPerformanceColor = (performance?: number) => {
    if (!performance) return 'text-gray-600';
    return performance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const totalValue = filteredInvestments.reduce((sum, investment) => 
    sum + (investment.current_value || investment.amount), 0);
  const totalInvested = filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0);
  const totalGainLoss = totalValue - totalInvested;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
          <p className="text-gray-600 mt-1">Track and manage foundation investments.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
          Add Investment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalInvested.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalValue.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {totalGainLoss >= 0 
                  ? <TrendingUp className="w-5 h-5 text-green-600" />
                  : <TrendingDown className="w-5 h-5 text-red-600" />
                }
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gain/Loss</p>
              <p className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalGainLoss >= 0 ? '+' : ''}{totalGainLoss.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Portfolio Count</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredInvestments.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search investments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={toggleFilterMenu}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 focus:outline-none px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-200">
                    Investment Type
                  </div>
                  {[
                    { value: 'all', label: 'All Types' },
                    ...predefinedInvestmentTypes.map(type => ({ value: type, label: type }))
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleTypeFilterChange(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                        typeFilter === option.value ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Investments List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredInvestments.map((investment) => {
          const foundation = mockFoundations.find(f => f.id === investment.foundation_id);
          const gainLoss = (investment.current_value || investment.amount) - investment.amount;
          return (
            <Card key={investment.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getPerformanceIcon(investment.performance)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{investment.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {getTypeLabel(investment.type)} • {foundation?.name}
                    </p>
                    {investment.notes && (
                      <p className="text-sm text-gray-700 mt-2">{investment.notes}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Invested Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {investment.amount.toLocaleString('sv-SE')} {investment.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Value</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {(investment.current_value || investment.amount).toLocaleString('sv-SE')} {investment.currency}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <p className={`text-lg font-semibold ${getPerformanceColor(investment.performance)}`}>
                    {investment.performance ? `${investment.performance > 0 ? '+' : ''}${investment.performance}%` : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gain/Loss</p>
                  <p className={`text-lg font-semibold ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {gainLoss >= 0 ? '+' : ''}{gainLoss.toLocaleString('sv-SE')} {investment.currency}
                  </p>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Acquired: {new Date(investment.acquisition_date).toLocaleDateString()}
              </div>
              
              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="sm" icon={Eye}>
                  View Details
                </Button>
                <Button variant="ghost" size="sm" icon={Edit}>
                  Edit
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredInvestments.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No investments found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || typeFilter !== 'all' 
                              ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first investment.'
              }
            </p>
            {!searchTerm && typeFilter === 'all' && (
              <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
                Add Investment
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Create Investment Modal */}
      {/* Investment Performance Chart */}
      <Card title="Investment Performance Over Time" subtitle="Track portfolio growth and market comparison">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { month: 'Jan', portfolio: 1200000, market: 1180000 },
              { month: 'Feb', portfolio: 1250000, market: 1200000 },
              { month: 'Mar', portfolio: 1180000, market: 1190000 },
              { month: 'Apr', portfolio: 1320000, market: 1220000 },
              { month: 'May', portfolio: 1280000, market: 1240000 },
              { month: 'Jun', portfolio: 1350000, market: 1260000 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => [`${value.toLocaleString('sv-SE')} SEK`, '']} />
              <Area type="monotone" dataKey="portfolio" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Portfolio" />
              <Area type="monotone" dataKey="market" stackId="2" stroke="#6B7280" fill="#6B7280" fillOpacity={0.3} name="Market Index" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Investment"
        size="lg"
      >
        <InvestmentForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

const InvestmentForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    amount: '',
    currency: 'SEK',
    acquisition_date: '',
    current_value: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Investment Type *</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter investment type"
            required
          />
        </div>
      </div>

      <Input
        label="Investment Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="e.g., Apple Inc. Stock, Government Bond"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Amount Invested"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="SEK">SEK</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </select>
        </div>
        <Input
          label="Current Value (Optional)"
          name="current_value"
          type="number"
          step="0.01"
          value={formData.current_value}
          onChange={handleChange}
          placeholder="0.00"
        />
      </div>

      <Input
        label="Acquisition Date"
        name="acquisition_date"
        type="date"
        value={formData.acquisition_date}
        onChange={handleChange}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Additional notes about this investment"
        />
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add Investment
        </Button>
      </div>
    </form>
  );
};