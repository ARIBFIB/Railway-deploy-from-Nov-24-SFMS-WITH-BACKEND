import React, { useState, useEffect } from 'react';
import { Search, Copy, Upload, Plus, Users, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { VismaImportWizard } from '../components/VismaImportWizard';
import { CreateScheduleModal } from '../components/CreateScheduleModal';
import { workingHoursService } from '../services/workingHoursService';

interface WorkingHoursSchedule {
  id: string;
  schemaId: string;
  name: string;
  scheduleLengthInDays: number;
  numberOfObs: number;
  employmentRate: number;
  isActive: boolean;
}

// Retrieved from backend
const mockSchedules: WorkingHoursSchedule[] = [];

export const WorkingHoursSchedulePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('active');
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showVismaWizard, setShowVismaWizard] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [schedules, setSchedules] = useState<WorkingHoursSchedule[]>(mockSchedules);


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await workingHoursService.list();
        if (!mounted) return;
        const mapped: WorkingHoursSchedule[] = data.map(s => ({
          id: s.id,
          schemaId: s.schema_id,
          name: s.name,
          scheduleLengthInDays: s.schedule_length_in_days,
          numberOfObs: s.number_of_obs,
          employmentRate: s.employment_rate,
          isActive: s.is_active
        }));
        setSchedules(mapped);
      } catch (e) {
        console.error('Failed to load working hours schedules', e);
        setSchedules([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.schemaId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'active' && schedule.isActive) ||
                         (activeFilter === 'inactive' && !schedule.isActive);
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedules = filteredSchedules.slice(startIndex, endIndex);

  const handleSelectAll = () => {
    if (selectedSchedules.length === currentSchedules.length) {
      setSelectedSchedules([]);
    } else {
      setSelectedSchedules(currentSchedules.map(schedule => schedule.id));
    }
  };

  const handleSelectSchedule = (scheduleId: string) => {
    setSelectedSchedules(prev => 
      prev.includes(scheduleId) 
        ? prev.filter(id => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  const handleCopySchedule = () => {
    console.log('Copy schedule clicked');
  };

  const handleImport = () => {
    setShowVismaWizard(true);
  };

  const handleWizardClose = () => {
    setShowVismaWizard(false);
  };

  const handleWizardNext = () => {
    console.log('Import completed');
    setShowVismaWizard(false);
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateModalSave = (scheduleData: any) => {
    console.log('New schedule created:', scheduleData);
    // Here you would typically add the new schedule to your data
    setShowCreateModal(false);
  };

  const handleDisable = () => {
    console.log('Disable clicked');
  };

  const handleActivate = () => {
    console.log('Activate clicked');
  };

  // Check if selected items are active or inactive
  const selectedActiveItems = selectedSchedules.filter(scheduleId => {
    const schedule = mockSchedules.find(s => s.id === scheduleId);
    return schedule?.isActive === true;
  });

  const selectedInactiveItems = selectedSchedules.filter(scheduleId => {
    const schedule = mockSchedules.find(s => s.id === scheduleId);
    return schedule?.isActive === false;
  });

  const hasActiveSelected = selectedActiveItems.length > 0;
  const hasInactiveSelected = selectedInactiveItems.length > 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase">Working Time Schedule - List</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Input
              placeholder="Schema ID, name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              className="w-64"
            />
          </div>
          <Button 
            variant="secondary" 
            onClick={handleCopySchedule}
            className="flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy schedule
          </Button>
          <Button 
            onClick={handleImport}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Plus className="w-4 h-4" />
            Create new
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 border-b border-gray-200">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeFilter === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeFilter === 'active'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter('inactive')}
          className={`px-4 py-2 text-sm font-medium border-b-2 ${
            activeFilter === 'inactive'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Inactive
        </button>
      </div>

      {/* Table Section */}
      <Card>
        <div className="overflow-x-auto">

          {/* Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedSchedules.length === currentSchedules.length && currentSchedules.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">SCHEMA ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">NAME</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">SCHEDULE LENGTH IN DAYS</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">NUMBER OF OBS</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">EMPLOYMENT RATE (%)</th>
                <th className="text-left py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {currentSchedules.map((schedule) => (
                <tr key={schedule.id} className={`border-b border-gray-100 hover:bg-gray-50 ${
                  !schedule.isActive ? 'bg-gray-50 opacity-75' : ''
                }`}>
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedSchedules.includes(schedule.id)}
                      onChange={() => handleSelectSchedule(schedule.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{schedule.schemaId}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{schedule.name}</span>
                      {!schedule.isActive && (
                        <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{schedule.scheduleLengthInDays}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{schedule.numberOfObs}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{schedule.employmentRate}%</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls - Bottom */}
          <div className="flex items-center justify-between mt-4">
            <div></div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <div className="w-4 h-4 flex flex-col space-y-0.5">
                  <div className="w-full h-0.5 bg-current"></div>
                  <div className="w-full h-0.5 bg-current"></div>
                  <div className="w-full h-0.5 bg-current"></div>
                </div>
              </button>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">of {filteredSchedules.length}</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className={`px-2 py-1 text-sm font-medium rounded ${
                  currentPage === 1 ? 'bg-green-500 text-white' : 'text-gray-600'
                }`}>
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleDisable}
            disabled={!hasActiveSelected}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              hasActiveSelected 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Disable
          </button>
          <span className="text-sm text-gray-600">
            ({selectedSchedules.length} selected)
          </span>
        </div>
        <button
          onClick={handleActivate}
          disabled={!hasInactiveSelected}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            hasInactiveSelected 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Activate
        </button>
      </div>

      {/* Visma Import Wizard */}
      <VismaImportWizard
        isOpen={showVismaWizard}
        onClose={handleWizardClose}
        onNext={handleWizardNext}
      />

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={showCreateModal}
        onClose={handleCreateModalClose}
        onSave={handleCreateModalSave}
      />
    </div>
  );
};
