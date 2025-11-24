import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Eye, Receipt, CheckCircle, Clock, XCircle, Filter, FileText, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useDropzone } from 'react-dropzone';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { ListManager } from '../components/ListManager';
import { mockExpenses, mockFoundations } from '../data/mockData';

// Define Expense interface (inferred from usage)
// interface Expense {
//   id: string;
//   foundation_id: string;
//   amount: number;
//   currency: string;
//   category: string; // Changed to string
//   description: string;
//   expense_date: string;
//   status: 'pending' | 'approved' | 'rejected';
//   created_at: string;
//   receipt_url?: string;
// }

export const ExpensesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement>(null);

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

  const filteredExpenses = mockExpenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || expense.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Receipt className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false);
  };

  const handleCategoryFilterChange = (category: string) => {
    setCategoryFilter(category);
    setIsFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage foundation expenses.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalExpenses.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredExpenses.filter(e => e.status === 'pending').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredExpenses.filter(e => e.status === 'approved').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredExpenses.filter(e => e.status === 'rejected').length}
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
              placeholder="Search expenses..."
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
                    Status
                  </div>
                  {[
                    { value: 'all', label: 'All Status' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'approved', label: 'Approved' },
                    { value: 'rejected', label: 'Rejected' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusFilterChange(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${statusFilter === option.value ? 'bg-gray-100 font-medium' : ''
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-200 mt-2">
                    Category
                  </div>
                  {[
                    { value: 'all', label: 'All Categories' },
                    { value: 'office_supplies', label: 'Office Supplies' },
                    { value: 'travel', label: 'Travel' },
                    { value: 'meals', label: 'Meals' },
                    { value: 'utilities', label: 'Utilities' },
                    { value: 'professional_services', label: 'Professional Services' },
                    { value: 'marketing', label: 'Marketing' },
                    { value: 'other', label: 'Other' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleCategoryFilterChange(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${categoryFilter === option.value ? 'bg-gray-100 font-medium' : ''
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

      {/* Expenses List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredExpenses.map((expense) => {
          const foundation = mockFoundations.find(f => f.id === expense.foundation_id);
          return (
            <Card key={expense.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(expense.status)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{expense.description}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {getCategoryLabel(expense.category)} • {foundation?.name}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Date: {new Date(expense.expense_date).toLocaleDateString()}</span>
                      <span>Submitted: {new Date(expense.created_at).toLocaleDateString()}</span>
                      {expense.receipt_url && <span>📎 Receipt attached</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {expense.amount.toLocaleString('sv-SE')} {expense.currency}
                    </p>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(expense.status)}`}>
                      {expense.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" icon={Eye}>
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredExpenses.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first expense.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
              <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
                Add Expense
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Expense Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Expenses by Category" subtitle="Spending distribution analysis">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Office Supplies', value: 25000, color: '#3B82F6' },
                    { name: 'Travel', value: 15000, color: '#10B981' },
                    { name: 'Professional Services', value: 35000, color: '#F59E0B' },
                    { name: 'Utilities', value: 8000, color: '#EF4444' },
                    { name: 'Marketing', value: 12000, color: '#8B5CF6' }
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent as number ?? 0) * 100).toFixed(0)}%`}
                >
                  {[
                    { name: 'Office Supplies', value: 25000, color: '#3B82F6' },
                    { name: 'Travel', value: 15000, color: '#10B981' },
                    { name: 'Professional Services', value: 35000, color: '#F59E0B' },
                    { name: 'Utilities', value: 8000, color: '#EF4444' },
                    { name: 'Marketing', value: 12000, color: '#8B5CF6' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value.toLocaleString('sv-SE')} SEK`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Monthly Expense Trends" subtitle="Track spending patterns over time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jan', amount: 45000, approved: 42000, pending: 3000 },
                { month: 'Feb', amount: 52000, approved: 48000, pending: 4000 },
                { month: 'Mar', amount: 48000, approved: 45000, pending: 3000 },
                { month: 'Apr', amount: 55000, approved: 50000, pending: 5000 },
                { month: 'May', amount: 49000, approved: 46000, pending: 3000 },
                { month: 'Jun', amount: 53000, approved: 49000, pending: 4000 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => [`${value.toLocaleString('sv-SE')} SEK`, '']} />
                <Bar dataKey="approved" fill="#10B981" name="Approved" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Create Expense Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Expense"
        size="lg"
      >
        <ExpenseForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

const ExpenseForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    foundation_id: '',
    amount: '',
    currency: 'SEK',
    category: '',
    description: '',
    expense_date: '',
    receipt: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setError('Invalid file type or size. Please upload a PDF, JPG, or PNG file (max 5MB).');
        return;
      }
      if (acceptedFiles.length > 0) {
        setFormData((prev) => ({ ...prev, receipt: acceptedFiles[0] }));
        setError(null);
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    if (!formData.amount) {
      setError('Please enter an amount.');
      setLoading(false);
      return;
    }
    if (!formData.category) {
      setError('Please enter a category.');
      setLoading(false);
      return;
    }
    if (!formData.description) {
      setError('Please enter a description.');
      setLoading(false);
      return;
    }
    if (!formData.expense_date) {
      setError('Please select an expense date.');
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      setError('Failed to add expense. Please try again.');
      console.error('Add expense failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, receipt: null }));
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter category"
            required
          />
        </div>

        <Input
          label="Expense Date"
          name="expense_date"
          type="date"
          value={formData.expense_date}
          onChange={handleChange}
          required
        />
      </div>

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Brief description of the expense"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Receipt (Optional)
        </label>
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 bg-gray-50'}
            hover:border-primary-400 hover:bg-primary-25 cursor-pointer`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <FileText className="w-8 h-8 text-gray-400" />
            {isDragActive ? (
              <p className="text-sm text-gray-600">Drop the file here...</p>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  Drag and drop your receipt here or{' '}
                  <span className="text-primary-600 font-medium">click to browse</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG (Max 5MB)
                </p>
              </>
            )}
          </div>
        </div>

        {formData.receipt && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">{formData.receipt.name}</p>
                <p className="text-xs text-gray-500">
                  {(formData.receipt.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Add Expense
        </Button>
      </div>
    </form>
  );
};