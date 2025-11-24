import React, { useState } from 'react';

const BillingCreditWarning: React.FC = () => {
  const [creditWarningEnabled, setCreditWarningEnabled] = useState(true);
  const [warningLimit, setWarningLimit] = useState('0,00');

  const handleSave = () => {
    console.log('Saving credit warning settings:', {
      creditWarningEnabled,
      warningLimit
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600">
        Warn when the sum of uninvoiced orders, unpaid invoices, and current order/invoice exceeds your specified warning threshold.
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCreditWarningEnabled(true)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            creditWarningEnabled
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          YES
        </button>
        <button
          onClick={() => setCreditWarningEnabled(false)}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            !creditWarningEnabled
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          NO
        </button>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Warning limit (SEK)</label>
        <input
          type="text"
          value={warningLimit}
          onChange={(e) => setWarningLimit(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default BillingCreditWarning;
