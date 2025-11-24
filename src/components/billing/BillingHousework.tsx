import React, { useState } from 'react';

const BillingHousework: React.FC = () => {
  const [houseworkEnabled, setHouseworkEnabled] = useState(false);
  const [suggestType, setSuggestType] = useState('Nothing');

  const handleSave = () => {
    console.log('Saving housework settings:', {
      houseworkEnabled,
      suggestType
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Housework</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setHouseworkEnabled(!houseworkEnabled)}
            className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
              houseworkEnabled
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {houseworkEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
          <h3 className="text-lg font-medium text-gray-900">Suggest type</h3>
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">?</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSuggestType('Nothing')}
            className={`px-4 py-2 text-sm border border-gray-300 rounded transition-colors ${
              suggestType === 'Nothing'
                ? 'bg-gray-200 text-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Nothing
          </button>
          <button
            onClick={() => setSuggestType('ROOT')}
            className={`px-4 py-2 text-sm border border-gray-300 rounded transition-colors ${
              suggestType === 'ROOT'
                ? 'bg-gray-200 text-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ROOT
          </button>
          <button
            onClick={() => setSuggestType('ROUT')}
            className={`px-4 py-2 text-sm border border-gray-300 rounded transition-colors ${
              suggestType === 'ROUT'
                ? 'bg-gray-200 text-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ROUT
          </button>
          <button
            onClick={() => setSuggestType('Green')}
            className={`px-4 py-2 text-sm border border-gray-300 rounded transition-colors ${
              suggestType === 'Green'
                ? 'bg-gray-200 text-gray-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Green
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Read more about the rules and laws for ROT, RUT and Green deduction in our <a href="#" className="text-blue-600 underline">help section</a>.
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

export default BillingHousework;
