import React, { useState } from 'react';
import { CreateSalaryYearModal } from './CreateSalaryYearModal';
import { AlertModal } from './AlertModal';

export const SalaryYearInterface: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [salaryYears, setSalaryYears] = useState<string[]>(['2025', '2024', '2023']);

  const handleCreateNew = () => {
    // Check if trying to create a year that's too far in the future
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    const yearToCreate = nextYear + 1; // If trying to create 2026 in 2025
    
    if (yearToCreate > nextYear) {
      setAlertMessage(`Pay year ${yearToCreate} can only be created at the turn of the year ${currentYear}/${nextYear} when the program has been updated with annual changes for the year ${yearToCreate}.`);
      setIsAlertOpen(true);
      return;
    }
    
    setIsModalOpen(true);
  };

  const handleSaveNewSalaryYear = (data: any) => {
    const yearToAdd = data.year || String(new Date().getFullYear());
    if (!salaryYears.includes(yearToAdd)) {
      const updated = [yearToAdd, ...salaryYears].sort((a, b) => b.localeCompare(a));
      setSalaryYears(updated);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">✓</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Salary Year</h3>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg transition-colors"
        >
          Create new
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                SALARY YEAR
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salaryYears.map((year, index) => (
              <tr key={year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Salary Year Modal */}
      <CreateSalaryYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewSalaryYear}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={isAlertOpen}
        message={alertMessage}
        onClose={() => setIsAlertOpen(false)}
      />
    </div>
  );
};

