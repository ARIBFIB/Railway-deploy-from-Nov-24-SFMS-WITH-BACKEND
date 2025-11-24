import React, { useState } from 'react';

const BillingLabels: React.FC = () => {
  const [enableSupportForLabels, setEnableSupportForLabels] = useState(true);

  const handleSave = () => {
    console.log('Saving labels settings:', {
      enableSupportForLabels
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Enable support for labels</h3>
        <button
          onClick={() => setEnableSupportForLabels(!enableSupportForLabels)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            enableSupportForLabels ? 'bg-green-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enableSupportForLabels ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
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

export default BillingLabels;
