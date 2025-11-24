import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Gift, DollarSign, Eye, Edit, Filter } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { mockGrants, mockProjects, mockFoundations } from '../data/mockData';

export const GrantsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
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

  const filteredGrants = mockGrants.filter(grant => {
    const matchesSearch = grant.grant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grant.grantor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || grant.status === statusFilter;
    const matchesProject = projectFilter === 'all' || grant.project_id === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'awarded':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'applied':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalGrantAmount = filteredGrants.reduce((sum, grant) => sum + grant.amount, 0);
  const awardedGrants = filteredGrants.filter(g => g.status === 'awarded' || g.status === 'completed');
  const totalAwarded = awardedGrants.reduce((sum, grant) => sum + grant.amount, 0);

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false);
  };

  const handleProjectFilterChange = (project: string) => {
    setProjectFilter(project);
    setIsFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Grants</h1>
          <p className="text-gray-600 mt-1">Manage grant applications and funding.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
          Apply for Grant
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{filteredGrants.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applied</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalGrantAmount.toLocaleString('sv-SE')} SEK
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Awarded</p>
              <p className="text-2xl font-bold text-gray-900">{awardedGrants.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Awarded</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalAwarded.toLocaleString('sv-SE')} SEK
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
              placeholder="Search grants..."
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
                    { value: 'applied', label: 'Applied' },
                    { value: 'under_review', label: 'Under Review' },
                    { value: 'awarded', label: 'Awarded' },
                    { value: 'rejected', label: 'Rejected' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'cancelled', label: 'Cancelled' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusFilterChange(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                        statusFilter === option.value ? 'bg-gray-100 font-medium' : ''
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                  <div className="px-4 py-2 text-sm font-semibold text-gray-900 border-b border-gray-200 mt-2">
                    Project
                  </div>
                  {[
                    { value: 'all', label: 'All Projects' },
                    ...mockProjects.map((project) => ({
                      value: project.id,
                      label: project.name
                    }))
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleProjectFilterChange(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                        projectFilter === option.value ? 'bg-gray-100 font-medium' : ''
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

      {/* Grants List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredGrants.map((grant) => {
          const project = mockProjects.find(p => p.id === grant.project_id);
          const foundation = mockFoundations.find(f => f.id === project?.foundation_id);
          return (
            <Card key={grant.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{grant.grant_name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {grant.grantor_name} • {project?.name} • {foundation?.name}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-600">Grant Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {grant.amount.toLocaleString('sv-SE')} {grant.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Application Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(grant.application_date).toLocaleDateString()}
                      </p>
                    </div>
                    {grant.award_date && (
                      <div>
                        <p className="text-sm text-gray-600">Award Date</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(grant.award_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mt-4">
                    Created: {new Date(grant.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(grant.status)}`}>
                    {grant.status.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" icon={Eye}>
                      View
                    </Button>
                    <Button variant="ghost" size="sm" icon={Edit}>
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredGrants.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Gift className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grants found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || projectFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by applying for your first grant.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && projectFilter === 'all' && (
              <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
                Apply for Grant
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Grant Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Grant Status Distribution" subtitle="Overview of grant application status">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Awarded', value: filteredGrants.filter(g => g.status === 'awarded').length, color: '#10B981' },
                    { name: 'Under Review', value: filteredGrants.filter(g => g.status === 'under_review').length, color: '#3B82F6' },
                    { name: 'Applied', value: filteredGrants.filter(g => g.status === 'applied').length, color: '#F59E0B' },
                    { name: 'Rejected', value: filteredGrants.filter(g => g.status === 'rejected').length, color: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Awarded', value: filteredGrants.filter(g => g.status === 'awarded').length, color: '#10B981' },
                    { name: 'Under Review', value: filteredGrants.filter(g => g.status === 'under_review').length, color: '#3B82F6' },
                    { name: 'Applied', value: filteredGrants.filter(g => g.status === 'applied').length, color: '#F59E0B' },
                    { name: 'Rejected', value: filteredGrants.filter(g => g.status === 'rejected').length, color: '#EF4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Grant Funding Timeline" subtitle="Track grant applications and awards over time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Jan', applied: 2, awarded: 1, amount: 150000 },
                { month: 'Feb', applied: 1, awarded: 1, amount: 300000 },
                { month: 'Mar', applied: 3, awarded: 0, amount: 0 },
                { month: 'Apr', applied: 2, awarded: 2, amount: 450000 },
                { month: 'May', applied: 1, awarded: 1, amount: 200000 },
                { month: 'Jun', applied: 2, awarded: 0, amount: 0 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="applied" stroke="#3B82F6" strokeWidth={2} name="Applications" />
                <Line type="monotone" dataKey="awarded" stroke="#10B981" strokeWidth={2} name="Awards" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Create Grant Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Apply for Grant"
        size="lg"
      >
        <GrantForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

const GrantForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    project_id: '',
    grant_name: '',
    grantor_name: '',
    amount: '',
    currency: 'SEK',
    application_date: '',
    status: 'applied'
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project
        </label>
        <select
          name="project_id"
          value={formData.project_id}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        >
          <option value="">Select Project</option>
          {mockProjects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Grant Name"
          name="grant_name"
          value={formData.grant_name}
          onChange={handleChange}
          placeholder="e.g., EU Green Energy Grant"
          required
        />

        <Input
          label="Grantor Organization"
          name="grantor_name"
          value={formData.grantor_name}
          onChange={handleChange}
          placeholder="e.g., European Union"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Grant Amount"
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
          label="Application Date"
          name="application_date"
          type="date"
          value={formData.application_date}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <option value="applied">Applied</option>
          <option value="under_review">Under Review</option>
          <option value="awarded">Awarded</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Submit Application
        </Button>
      </div>
    </form>
  );
};