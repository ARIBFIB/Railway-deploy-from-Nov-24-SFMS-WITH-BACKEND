import React, { useState, useEffect } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

import { billingSettingsService } from '../../services/billingSettingsService';

interface CostCentersInterfaceProps {
  scope?: 'salary' | 'billing';
}

export const CostCentersInterface: React.FC<CostCentersInterfaceProps> = ({ scope = 'salary' }) => {
  const [settings, setSettings] = useState({
    enableCostCenterSupport: false,
    includeCostCenterWhenTabEntering: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const service = scope === 'billing' ? billingSettingsService : salarySettingsService;
        const data = await service.getCostCenters();

        if (!isMounted) return;

        setSettings({
          enableCostCenterSupport: data.enableCostCenterSupport ?? false,
          includeCostCenterWhenTabEntering: data.includeCostCenterWhenTabEntering ?? false
        });
      } catch (err) {
        console.error('❌ Failed to load cost centers settings', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load settings');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, [scope]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const service = scope === 'billing' ? billingSettingsService : salarySettingsService;
      const updated = await service.saveCostCenters(settings);
      setSettings({
        enableCostCenterSupport: updated.enableCostCenterSupport ?? false,
        includeCostCenterWhenTabEntering: updated.includeCostCenterWhenTabEntering ?? false
      });
      setSuccessMessage('Cost centers settings saved successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('❌ Failed to save cost centers settings', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
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
        className={`px-4 py-2 rounded-l-lg border transition-colors ${value
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
          }`}
      >
        {options[0]}
      </button>
      <button
        onClick={onChange}
        className={`px-4 py-2 rounded-r-lg border transition-colors ${!value
            ? 'bg-gray-200 text-gray-700 border-gray-200'
            : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
          }`}
      >
        {options[1]}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm">✓</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Cost centers</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading cost centers settings...</div>
        </div>
      ) : (
        <>
          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Enable cost center support */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enable cost center support
              </label>
              <ToggleSwitch
                value={settings.enableCostCenterSupport}
                onChange={() => handleToggle('enableCostCenterSupport')}
              />
            </div>

            {/* Include cost center when tab/entering */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Include cost center when tab/entering
              </label>
              <ToggleSwitch
                value={settings.includeCostCenterWhenTabEntering}
                onChange={() => handleToggle('includeCostCenterWhenTabEntering')}
              />
            </div>
          </div>

          {/* Help Text with Link */}
          <div>
            <p className="text-sm text-gray-700">
              To add a new cost center, go to:{' '}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Register - Cost Centers
              </a>
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className={`bg-green-600 text-white px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSaving || isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

