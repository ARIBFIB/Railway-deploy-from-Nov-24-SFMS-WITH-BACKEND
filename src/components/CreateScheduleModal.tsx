import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scheduleData: any) => void;
}

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({ isOpen, onClose, onSave }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    schemaId: '',
    name: '',
    employmentRate: '0,00',
    deviatingScheduleLength: true,
    scheduleLengthInDays: '',
    fullTimeScheduleLength: '',
    numberOfOBCompensation: '0',
    workingHolidays: true,
    scheduleLengthBeginsToApply: '',
    dailyHours: {
      monday: '0,00',
      tuesday: '0,00',
      wednesday: '0,00',
      thursday: '0,00',
      friday: '0,00',
      saturday: '0,00',
      sunday: '0,00'
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent body scrolling and hide browser UI when modal is open
  useEffect(() => {
    if (isOpen) {
      const bodyElement = window.document.querySelector('body');
      const htmlElement = window.document.querySelector('html');
      
      if (bodyElement) {
        bodyElement.style.overflow = 'hidden';
        bodyElement.style.margin = '0';
        bodyElement.style.padding = '0';
      }
      
      if (htmlElement) {
        htmlElement.style.overflow = 'hidden';
        htmlElement.style.margin = '0';
        htmlElement.style.padding = '0';
      }
      
      return () => {
        if (bodyElement) {
          bodyElement.style.overflow = 'unset';
          bodyElement.style.margin = '';
          bodyElement.style.padding = '';
        }
        
        if (htmlElement) {
          htmlElement.style.overflow = 'unset';
          htmlElement.style.margin = '';
          htmlElement.style.padding = '';
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDailyHoursChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      dailyHours: {
        ...prev.dailyHours,
        [day]: value
      }
    }));
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.schemaId.trim()) {
      newErrors.schemaId = 'Schema ID is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleShowList = () => {
    onClose(); // Close the modal first
    navigate('/working-hours-schedule'); // Navigate to working hours schedule page
  };

  const handleCancel = () => {
    setFormData({
      schemaId: '',
      name: '',
      employmentRate: '0,00',
      deviatingScheduleLength: true,
      scheduleLengthInDays: '',
      fullTimeScheduleLength: '',
      numberOfOBCompensation: '0',
      workingHolidays: true,
      scheduleLengthBeginsToApply: '',
      dailyHours: {
        monday: '0,00',
        tuesday: '0,00',
        wednesday: '0,00',
        thursday: '0,00',
        friday: '0,00',
        saturday: '0,00',
        sunday: '0,00'
      }
    });
    setErrors({});
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">WORK SCHEDULE - CREATE NEW</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mb-6">
            <Button
              onClick={handleShowList}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              Show list
            </Button>
            <Button
              onClick={() => console.log('Create new clicked')}
              className="bg-gray-700 hover:bg-gray-800 text-white font-medium flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Create new
            </Button>
          </div>

          <div className="text-blue-600 hover:text-blue-800 cursor-pointer mb-6">
            Copy schedule
          </div>

          {/* Schedule Details Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Schedule Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Schema ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schema ID *
                </label>
                <input
                  type="text"
                  value={formData.schemaId}
                  onChange={(e) => handleInputChange('schemaId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.schemaId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter schema ID"
                />
                {errors.schemaId && (
                  <p className="text-red-500 text-sm mt-1">{errors.schemaId}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter schedule name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Employment Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment rate
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={formData.employmentRate}
                    onChange={(e) => handleInputChange('employmentRate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                  />
                  <span className="text-gray-500">0,00</span>
                </div>
              </div>

              {/* Deviating Schedule Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deviating schedule length
                </label>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleInputChange('deviatingScheduleLength', true)}
                    className={`px-4 py-2 rounded-l-lg border ${
                      formData.deviatingScheduleLength
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleInputChange('deviatingScheduleLength', false)}
                    className={`px-4 py-2 rounded-r-lg border ${
                      !formData.deviatingScheduleLength
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Schedule Length in Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule length in days
                </label>
                <input
                  type="text"
                  value={formData.scheduleLengthInDays}
                  onChange={(e) => handleInputChange('scheduleLengthInDays', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter days"
                />
              </div>

              {/* Full-time Schedule Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full-time (regarding schedule length)
                </label>
                <input
                  type="text"
                  value={formData.fullTimeScheduleLength}
                  onChange={(e) => handleInputChange('fullTimeScheduleLength', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full-time schedule length"
                />
              </div>

              {/* Number of OB Compensation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of OB compensation
                </label>
                <select
                  value={formData.numberOfOBCompensation}
                  onChange={(e) => handleInputChange('numberOfOBCompensation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>

              {/* Working Holidays */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Working holidays
                </label>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleInputChange('workingHolidays', true)}
                    className={`px-4 py-2 rounded-l-lg border ${
                      formData.workingHolidays
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleInputChange('workingHolidays', false)}
                    className={`px-4 py-2 rounded-r-lg border ${
                      !formData.workingHolidays
                        ? 'bg-gray-500 text-white border-gray-500'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Schedule Length Begins to Apply */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule length begins to apply
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.scheduleLengthBeginsToApply}
                    onChange={(e) => handleInputChange('scheduleLengthBeginsToApply', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Select date"
                  />
                  <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Hours Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Daily Hours
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">SCHEDULE DAY</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">HOURS</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(formData.dailyHours).map(([day, hours]) => (
                    <tr key={day} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                        {day}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={hours}
                          onChange={(e) => handleDailyHoursChange(day, e.target.value)}
                          className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0,00"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => console.log('Delete clicked')}
              disabled
              className="bg-gray-400 text-gray-600 cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <button className="flex items-center text-blue-600 hover:text-blue-800">
              Calendar
              <span className="ml-1">{'>'}</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
