import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Modal } from './Modal';

interface StaffCategory {
  id: string;
  name: string;
  type: string;
}

interface StaffCategoriesProps {
  className?: string;
}

export const StaffCategories: React.FC<StaffCategoriesProps> = ({ className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categories, setCategories] = useState<StaffCategory[]>([
    // Mock data - replace with actual API calls
  ]);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    setShowCreateModal(true);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">STAFF CATEGORIES - LIST</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 rounded px-3 py-1">
            <span className="text-sm">☰</span>
            <span>0</span>
            <span className="text-xs">▼</span>
          </div>
          <Button
            onClick={handleCreateCategory}
            className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400 font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create new staff category
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider border-r border-gray-300">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  TYPE
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-gray-500">
                    <div className="space-y-3">
                      <p className="text-lg font-medium">No staff categories found</p>
                      <p className="text-sm">
                        {searchTerm 
                          ? `No categories match "${searchTerm}"` 
                          : "Click 'Create new staff category' to get started"
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.type}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions Panel */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              1
            </span>
            <p className="text-sm text-gray-700">
              Select 'Create new staff category'.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              2
            </span>
            <p className="text-sm text-gray-700">
              Give the category a name. This will appear as the title on the employee's personnel card.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </span>
            <p className="text-sm text-gray-700">
              Select the type of category you want.
            </p>
          </div>
          
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              4
            </span>
            <p className="text-sm text-gray-700">
              Drop-down menu or Option buttons, specify which values should be selectable on the personnel card.
            </p>
          </div>
          
          <div className="mt-6">
            <p className="text-sm text-gray-600">
              For more info see{' '}
              <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                Personnel categories
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Create Category Modal */}
      <CreateStaffCategoryModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={(newCategory) => {
          setCategories(prev => [...prev, { ...newCategory, id: Date.now().toString() }]);
          setShowCreateModal(false);
        }}
      />
    </div>
  );
};

// Create Staff Category Modal Component
interface CreateStaffCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<StaffCategory, 'id'>) => void;
}

const CreateStaffCategoryModal: React.FC<CreateStaffCategoryModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Free text field'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave({
        name: formData.name.trim(),
        type: formData.type
      });
      setFormData({ name: '', type: 'Free text field' });
    }
  };

  const handleClose = () => {
    setFormData({ name: '', type: 'Free text field' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">STAFF CATEGORY -</h2>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              className="bg-yellow-400 text-gray-800 hover:bg-yellow-500"
            >
              <span className="mr-2">☰</span>
              Show list
            </Button>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side - Form */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Free text field">Free text field</option>
                  <option value="Drop-down menu">Drop-down menu</option>
                  <option value="Option buttons">Option buttons</option>
                  <option value="Checkbox">Checkbox</option>
                </select>
              </div>
            </form>
          </div>

          {/* Right Side - Instructions */}
          <div className="flex-1 p-6 bg-gray-50">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <p className="text-sm text-gray-700">
                  Give the category a name. This will appear as the title on the employee's personnel card.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <p className="text-sm text-gray-700">
                  Select the type of category you want.
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <p className="text-sm text-gray-700">
                  Drop-down menu or Option buttons, specify which values should be selectable on the personnel card.
                </p>
              </div>
              
              <div className="mt-6">
                <p className="text-sm text-gray-600">
                  For more info see{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                    Personnel categories
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <button className="flex flex-col items-center gap-1 text-green-600 hover:text-green-800">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">→</span>
              </div>
              <span className="text-xs text-gray-600">Guide</span>
            </button>
            <Button
              variant="secondary"
              className="bg-gray-500 text-white hover:bg-gray-600"
            >
              Delete
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
