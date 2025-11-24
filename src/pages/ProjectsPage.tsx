import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, FolderOpen, Calendar, DollarSign, Eye, Edit, BarChart3, Filter } from 'lucide-react';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { mockProjects } from '../data/mockData';

export const ProjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
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

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'on_hold':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">Track and manage foundation projects.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
          Create Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{filteredProjects.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredProjects.filter(p => p.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredProjects.filter(p => p.status === 'completed').length}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredProjects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString('sv-SE')} SEK
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
              placeholder="Search projects..."
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
                    { value: 'planning', label: 'Planning' },
                    { value: 'in_progress', label: 'In Progress' },
                    { value: 'completed', label: 'Completed' },
                    { value: 'on_hold', label: 'On Hold' },
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
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          return (
            <Card key={project.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-2">{project.description}</p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{project.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(project.progress_percentage)}`}
                    style={{ width: `${project.progress_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {project.start_date && (
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(project.start_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {project.end_date && (
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(project.end_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {project.budget && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {project.budget.toLocaleString('sv-SE')} SEK
                  </p>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-4">
                Created: {new Date(project.created_at).toLocaleDateString()}
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

      {filteredProjects.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating your first project.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
                Create Project
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Project Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Project Status Distribution" subtitle="Overview of project completion rates">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: filteredProjects.filter(p => p.status === 'completed').length, color: '#10B981' },
                    { name: 'In Progress', value: filteredProjects.filter(p => p.status === 'in_progress').length, color: '#3B82F6' },
                    { name: 'Planning', value: filteredProjects.filter(p => p.status === 'planning').length, color: '#F59E0B' },
                    { name: 'On Hold', value: filteredProjects.filter(p => p.status === 'on_hold').length, color: '#EF4444' }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Completed', value: filteredProjects.filter(p => p.status === 'completed').length, color: '#10B981' },
                    { name: 'In Progress', value: filteredProjects.filter(p => p.status === 'in_progress').length, color: '#3B82F6' },
                    { name: 'Planning', value: filteredProjects.filter(p => p.status === 'planning').length, color: '#F59E0B' },
                    { name: 'On Hold', value: filteredProjects.filter(p => p.status === 'on_hold').length, color: '#EF4444' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Project Progress Timeline" subtitle="Track project completion over time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Jan', progress: 15, target: 20 },
                { month: 'Feb', progress: 28, target: 35 },
                { month: 'Mar', progress: 42, target: 50 },
                { month: 'Apr', progress: 58, target: 65 },
                { month: 'May', progress: 72, target: 80 },
                { month: 'Jun', progress: 85, target: 95 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                <Line type="monotone" dataKey="progress" stroke="#10B981" strokeWidth={2} name="Actual Progress" />
                <Line type="monotone" dataKey="target" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" name="Target Progress" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Project"
        size="lg"
      >
        <ProjectForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

const ProjectForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning',
    start_date: '',
    end_date: '',
    budget: ''
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
      <Input
        label="Project Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter project name"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Describe the project goals and objectives"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <option value="planning">Planning</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <Input
          label="Start Date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
        />

        <Input
          label="End Date"
          name="end_date"
          type="date"
          value={formData.end_date}
          onChange={handleChange}
        />
      </div>

      <Input
        label="Budget (SEK)"
        name="budget"
        type="number"
        step="0.01"
        value={formData.budget}
        onChange={handleChange}
        placeholder="0.00"
      />
      
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Create Project
        </Button>
      </div>
    </form>
  );
};
