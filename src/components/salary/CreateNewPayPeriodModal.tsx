import React, { useState } from 'react';
import { X, HelpCircle, Calendar } from 'lucide-react';

interface CreateNewPayPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const CreateNewPayPeriodModal: React.FC<CreateNewPayPeriodModalProps> = ({ isOpen, onClose, onSave }) => {
  const [payoutPeriod, setPayoutPeriod] = useState('Monthly salary current month');
  const [startDatePayPeriod, setStartDatePayPeriod] = useState('2025-01-01');
  const [startDateDeviationPeriod, setStartDateDeviationPeriod] = useState('2024-12-01');
  const [firstPayoutDate, setFirstPayoutDate] = useState('2025-01-25');
  const [name, setName] = useState('Monthly salary {MMMM} {YYYY}');

  if (!isOpen) return null;

  const handleCreate = () => {
    onSave({
      payoutPeriod,
      startDatePayPeriod,
      startDateDeviationPeriod,
      firstPayoutDate,
      name
    });
    // Reset form
    setPayoutPeriod('Monthly salary current month');
    setStartDatePayPeriod('2025-01-01');
    setStartDateDeviationPeriod('2024-12-01');
    setFirstPayoutDate('2025-01-25');
    setName('Monthly salary {MMMM} {YYYY}');
  };

  const handleResetTemplate = () => {
    setPayoutPeriod('Monthly salary current month');
    setStartDatePayPeriod('2025-01-01');
    setStartDateDeviationPeriod('2024-12-01');
    setFirstPayoutDate('2025-01-25');
    setName('Monthly salary {MMMM} {YYYY}');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-medium text-gray-900">Payout period</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Payout Period Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Payout period
            </label>
            <select
              value={payoutPeriod}
              onChange={(e) => setPayoutPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
            >
              <option>Monthly salary current month</option>
              <option>Monthly salary previous month</option>
              <option>Four weeks' pay</option>
              <option>Two weeks' pay</option>
              <option>Weekly salary</option>
              <option>Extra pay</option>
            </select>
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start date, pay period
                </label>
                <HelpCircle className="w-4 h-4 text-gray-400 ml-1 cursor-help" />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={startDatePayPeriod}
                  onChange={(e) => setStartDatePayPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Start date, deviation period
                </label>
                <HelpCircle className="w-4 h-4 text-gray-400 ml-1 cursor-help" />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={startDateDeviationPeriod}
                  onChange={(e) => setStartDateDeviationPeriod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  First payout date
                </label>
                <HelpCircle className="w-4 h-4 text-gray-400 ml-1 cursor-help" />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={firstPayoutDate}
                  onChange={(e) => setFirstPayoutDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Descriptive Text */}
          <div>
            <p className="text-sm text-gray-600">
              You create the pay periods for the entire calendar year January - December, with associated deviation periods where the first payment is in January. This is regardless of whether you start making salaries in a later month.
            </p>
          </div>

          {/* Name Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 mb-2"
            />
            <p className="text-sm text-gray-500">
              Example: Monthly salary januari 2025
            </p>
          </div>

          {/* Variable Legend */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Variables:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{YYYY}'}</span>
                <span className="ml-2 text-gray-600">Year</span>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{YY}'}</span>
                <span className="ml-2 text-gray-600">Year, card</span>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{MMMM}'}</span>
                <span className="ml-2 text-gray-600">Month</span>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{MMM}'}</span>
                <span className="ml-2 text-gray-600">Month, card</span>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{DDDD}'}</span>
                <span className="ml-2 text-gray-600">Weekday</span>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{DDD}'}</span>
                <span className="ml-2 text-gray-600">Weekday, card</span>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{VV}'}</span>
                <span className="ml-2 text-gray-600">Weekly issue</span>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{PP}'}</span>
                <span className="ml-2 text-gray-600">Period number</span>
              </div>
              <div>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{'{P}'}</span>
                <span className="ml-2 text-gray-600">Period number, short</span>
              </div>
            </div>
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
            onClick={handleResetTemplate}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reset template
          </button>
          <button
            type="button"
            onClick={handleCreate}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

