import React, { useState } from 'react';
import { Plus, Search, Printer, Calendar, CheckSquare, ChevronDown, Trash2, List } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';

interface Project {
  id: string;
  projectNumber: string;
  name: string;
  startDate: string;
  endDate: string;
  projectManager: string;
  status: 'not-started' | 'ongoing' | 'completed';
}

const mockProjects: Project[] = [
  {
    id: '1',
    projectNumber: 'PRJ-001',
    name: 'Website Redesign',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    projectManager: 'John Smith',
    status: 'ongoing'
  },
  {
    id: '2',
    projectNumber: 'PRJ-002',
    name: 'Mobile App Development',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    projectManager: 'Sarah Johnson',
    status: 'not-started'
  },
  {
    id: '3',
    projectNumber: 'PRJ-003',
    name: 'Database Migration',
    startDate: '2023-11-01',
    endDate: '2024-01-01',
    projectManager: 'Mike Wilson',
    status: 'completed'
  }
];

export const ProjectManagementPage: React.FC = () => {
  console.log('ProjectManagementPage component loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'not-started' | 'ongoing' | 'completed'>('not-started');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.projectManager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(project => project.id));
    }
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">INDEX - PROJECTS</h1>
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Project number, Title, Project manag"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400 font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create project
          </Button>
          <Button
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print list
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600 border border-gray-300 rounded px-3 py-1">
            <span className="text-sm">☰</span>
            <span>{selectedProjects.length}</span>
            <span className="text-xs">▼</span>
          </div>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'not-started', label: 'Not started' },
          { key: 'ongoing', label: 'Ongoing' },
          { key: 'completed', label: 'Completed' }
        ].map((filter) => (
          <Button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key as any)}
            variant={statusFilter === filter.key ? 'primary' : 'secondary'}
            className={`px-4 py-2 text-sm ${
              statusFilter === filter.key 
                ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Projects Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <CheckSquare 
                    className={`w-4 h-4 cursor-pointer ${
                      selectedProjects.length === filteredProjects.length && filteredProjects.length > 0
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`}
                    onClick={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-100">
                  PROJECT NO.
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">NAME</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">START</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">FINAL</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">PROJECT MANAGER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <CheckSquare 
                        className={`w-4 h-4 cursor-pointer ${
                          selectedProjects.includes(project.id)
                            ? 'text-blue-600' 
                            : 'text-gray-400'
                        }`}
                        onClick={() => handleSelectProject(project.id)}
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {project.projectNumber}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {project.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(project.startDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(project.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {project.projectManager}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Actions */}
      {selectedProjects.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{selectedProjects.length} selected</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <Input
                type="date"
                placeholder="End date"
                className="w-40"
              />
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>Status</option>
              <option>Not started</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
            <Button className="bg-green-600 text-white hover:bg-green-700">
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title=""
        size="xl"
      >
        <CreateProjectForm 
          onClose={() => setShowCreateModal(false)}
          showAdditionalInfo={showAdditionalInfo}
          setShowAdditionalInfo={setShowAdditionalInfo}
        />
      </Modal>
    </div>
  );
};

const CreateProjectForm: React.FC<{
  onClose: () => void;
  showAdditionalInfo: boolean;
  setShowAdditionalInfo: (show: boolean) => void;
}> = ({ onClose, showAdditionalInfo, setShowAdditionalInfo }) => {
  const [formData, setFormData] = useState({
    projectNo: '1',
    name: '',
    startDate: '2025-09-24',
    endDate: '',
    status: 'In progress',
    hours: '',
    amount: '0,00',
    projectManager: '',
    notes: '',
    customerName: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving project:', formData);
    onClose();
  };

  const handleDelete = () => {
    console.log('Deleting project');
    onClose();
  };

  return (
    <div className="bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">PROJECT 1 - CREATE NEW</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create project
          </Button>
          <Button
            className="bg-yellow-400 text-gray-800 hover:bg-yellow-500 border-yellow-400 font-medium flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            Show list
          </Button>
        </div>
      </div>

      {/* Main Project Details */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project no.</label>
              <Input
                value={formData.projectNo}
                onChange={(e) => handleInputChange('projectNo', e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                className="w-full"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start date</label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End date</label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-2">
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Not started">Not started</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On hold">On hold</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <button
          onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
          className="flex items-center gap-2 text-green-600 font-medium mb-4"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${showAdditionalInfo ? 'rotate-180' : ''}`} />
          Additional information
        </button>

        {showAdditionalInfo && (
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                <Input
                  value={formData.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  placeholder="Enter hours"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="flex">
                  <Input
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="flex-1 rounded-r-none"
                  />
                  <div className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm text-gray-600">
                    0,00
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Manager</label>
                <Input
                  value={formData.projectManager}
                  onChange={(e) => handleInputChange('projectManager', e.target.value)}
                  placeholder="Enter project manager name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Enter project notes"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Customer Name Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">CUSTOMER NAME</h3>
        <div className="flex items-center gap-2">
          <Input
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            placeholder="Enter customer name"
            className="flex-1"
          />
          <Button variant="secondary" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700"
        >
          Delete
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
