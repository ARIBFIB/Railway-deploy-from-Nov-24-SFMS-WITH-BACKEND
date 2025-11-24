import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, MapPin, Users, Eye, Edit, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Modal } from '../components/Modal';
import { ListManager } from '../components/ListManager';
import { mockMeetings, mockFoundations } from '../data/mockData';

// Define Meeting interface (inferred from usage)
// interface Meeting {
//   id: string;
//   foundation_id: string;
//   title: string;
//   description?: string;
//   start_time: string;
//   end_time: string;
//   location?: string;
//   meeting_type: string; // Changed to string
//   status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
//   attendees: string[];


export const MeetingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
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

  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    const matchesType = typeFilter === 'all' || meeting.meeting_type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeetingTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setIsFilterMenuOpen(false);
  };

  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    setIsFilterMenuOpen(false);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-1">Schedule and manage foundation meetings.</p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
          Schedule Meeting
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search meetings..."
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
                    { value: 'scheduled', label: 'Scheduled' },
                    { value: 'in_progress', label: 'In Progress' },
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
                    Meeting Type
                  </div>
                  {[
                    { value: 'all', label: 'All Types' },
                    { value: 'board_meeting', label: 'Board Meeting' },
                    { value: 'general_assembly', label: 'General Assembly' },
                    { value: 'committee_meeting', label: 'Committee Meeting' },
                    { value: 'other', label: 'Other' },
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

      {/* Meetings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMeetings.map((meeting) => {
          const foundation = mockFoundations.find(f => f.id === meeting.foundation_id);
          return (
            <Card key={meeting.id}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{foundation?.name}</p>
                  {meeting.description && (
                    <p className="text-sm text-gray-700 mt-2">{meeting.description}</p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}>
                  {meeting.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(meeting.start_time).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(meeting.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {meeting.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{meeting.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{meeting.attendees.length} attendees</span>
                </div>
                <div className="flex items-center">
                  <span className="w-4 h-4 mr-2 text-xs">📋</span>
                  <span>{getMeetingTypeLabel(meeting.meeting_type)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
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

      {filteredMeetings.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by scheduling your first meeting.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <Button icon={Plus} onClick={() => setShowCreateModal(true)}>
                Schedule Meeting
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Meeting Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Meeting Activity Trends" subtitle="Monthly meeting statistics">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jan', scheduled: 4, completed: 4, cancelled: 0 },
                { month: 'Feb', scheduled: 3, completed: 3, cancelled: 0 },
                { month: 'Mar', scheduled: 5, completed: 4, cancelled: 1 },
                { month: 'Apr', scheduled: 3, completed: 2, cancelled: 0 },
                { month: 'May', scheduled: 4, completed: 4, cancelled: 0 },
                { month: 'Jun', scheduled: 6, completed: 5, cancelled: 1 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scheduled" fill="#3B82F6" name="Scheduled" />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
                <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Attendance Patterns" subtitle="Meeting attendance over time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { month: 'Jan', attendance: 85, target: 90 },
                { month: 'Feb', attendance: 92, target: 90 },
                { month: 'Mar', attendance: 78, target: 90 },
                { month: 'Apr', attendance: 88, target: 90 },
                { month: 'May', attendance: 95, target: 90 },
                { month: 'Jun', attendance: 87, target: 90 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                <Line type="monotone" dataKey="attendance" stroke="#10B981" strokeWidth={2} name="Attendance %" />
                <Line type="monotone" dataKey="target" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" name="Target %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Create Meeting Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Schedule Meeting"
        size="lg"
      >
        <MeetingForm onClose={() => setShowCreateModal(false)} />
      </Modal>
    </div>
  );
};

const MeetingForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    foundation_id: '',
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    end_time: '',
    location: '',
    meeting_type: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

   
    if (!formData.title) {
      setError('Please enter a meeting title.');
      setLoading(false);
      return;
    }
    if (!formData.start_date) {
      setError('Please select a start date.');
      setLoading(false);
      return;
    }
    if (!formData.start_time) {
      setError('Please select a start time.');
      setLoading(false);
      return;
    }
    if (!formData.end_time) {
      setError('Please select an end time.');
      setLoading(false);
      return;
    }
    if (!formData.meeting_type) {
      setError('Please enter a meeting type.');
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      setError('Failed to schedule meeting. Please try again.');
      console.error('Schedule meeting failed:', error);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter meeting title"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Meeting agenda and description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Date"
          name="start_date"
          type="date"
          value={formData.start_date}
          onChange={handleChange}
          required
        />
        <Input
          label="Start Time"
          name="start_time"
          type="time"
          value={formData.start_time}
          onChange={handleChange}
          required
        />
        <Input
          label="End Time"
          name="end_time"
          type="time"
          value={formData.end_time}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter location"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Type *</label>
          <input
            type="text"
            name="meeting_type"
            value={formData.meeting_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter meeting type"
            required
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          Schedule Meeting
        </Button>
      </div>
    </form>
  );
};

//asdasd