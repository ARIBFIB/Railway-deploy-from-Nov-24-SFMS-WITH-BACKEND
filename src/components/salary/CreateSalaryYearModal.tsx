import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface CreateSalaryYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const CreateSalaryYearModal: React.FC<CreateSalaryYearModalProps> = ({ isOpen, onClose, onSave }) => {
  const [fromDate, setFromDate] = useState('2027-01-01');
  const [toDate, setToDate] = useState('2027-12-31');
  const [accountingMethod, setAccountingMethod] = useState('Billing method');
  const [openThisFiscalYearAtLogin, setOpenThisFiscalYearAtLogin] = useState(false);
  const [accountChart, setAccountChart] = useState('Same as previous');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      fromDate,
      toDate,
      accountingMethod,
      openThisFiscalYearAtLogin,
      accountChart
    });
    onClose();
  };

  const ToggleSwitch = ({ 
    value, 
    onChange, 
    options = ['Yes', 'No'] 
  }: { 
    value: boolean; 
    onChange: () => void; 
    options?: [string, string];
  }) => (
    <div className="flex space-x-1">
      <button
        onClick={onChange}
        className={`px-4 py-2 rounded-l-lg border transition-colors ${
          value
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
        }`}
      >
        {options[0]}
      </button>
      <button
        onClick={onChange}
        className={`px-4 py-2 rounded-r-lg border transition-colors ${
          !value
            ? 'bg-gray-200 text-gray-700 border-gray-200'
            : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
        }`}
      >
        {options[1]}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-medium text-gray-900">Salary year</h3>
          <div className="flex items-center space-x-3">
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-lg transition-colors text-sm">
              Show list
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* About (From Date) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About
            </label>
            <div className="relative">
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Empty (To Date) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Empty
            </label>
            <div className="relative">
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Accounting method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accounting method
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => setAccountingMethod('Billing method')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  accountingMethod === 'Billing method'
                    ? 'bg-gray-200 text-gray-900 border-gray-300'
                    : 'bg-gray-300 text-gray-700 border-gray-400 hover:bg-gray-200'
                }`}
              >
                Billing method
              </button>
              <button
                onClick={() => setAccountingMethod('The cash method')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  accountingMethod === 'The cash method'
                    ? 'bg-gray-200 text-gray-900 border-gray-300'
                    : 'bg-gray-300 text-gray-700 border-gray-400 hover:bg-gray-200'
                }`}
              >
                The cash method
              </button>
            </div>
          </div>

          {/* Open this fiscal year at login */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Open this fiscal year at login
            </label>
            <ToggleSwitch 
              value={openThisFiscalYearAtLogin} 
              onChange={() => setOpenThisFiscalYearAtLogin(!openThisFiscalYearAtLogin)} 
            />
          </div>

          {/* Account chart */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account chart
            </label>
            <select
              value={accountChart}
              onChange={(e) => setAccountChart(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
            >
              <option>Same as previous</option>
              <option>Base 2025</option>
              <option>Base 2024</option>
              <option>Base English version</option>
              <option>Sports chart of accounts</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

