import React from 'react';

export const ShortTimeWorkingHoursInterface: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm">✓</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Short-time working hours/Working hours account</h3>
      </div>

      {/* Informational Text */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <p className="text-sm text-gray-700">
          The settings for Working time reduction/Working time account are now available on each agreement. You can find them under{' '}
          <a href="#" className="text-blue-600 underline">
            Register
          </a>
          {' '} -{' '}
          <a href="#" className="text-blue-600 underline">
            Agreement for salaries
          </a>
          .
        </p>
      </div>
    </div>
  );
};
