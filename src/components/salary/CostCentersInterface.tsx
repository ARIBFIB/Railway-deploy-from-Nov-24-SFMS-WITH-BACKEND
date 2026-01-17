import React, { useState, useEffect } from 'react';
import {
  fetchQuoteOrderInvoiceSection,
  updateQuoteOrderInvoiceSection
} from '../../services/supplierInvoiceSettingsService';

interface CostCentersSettings {
  enableCostCenterSupport: boolean;
  includeCostCenterWhenTabEntering: boolean;
}

interface CostCentersInterfaceProps {
  data?: CostCentersSettings;
  onChange?: (data: CostCentersSettings) => void;
  onSave?: (data: CostCentersSettings) => void;
  saving?: boolean;
  loading?: boolean;
  error?: string | null;
  success?: string | null;
  scope?: 'quote-order' | 'billing';
}

export const CostCentersInterface: React.FC<CostCentersInterfaceProps> = ({ 
  data, 
  onChange, 
  onSave, 
  saving = false, 
  loading = false, 
  error: propError, 
  success: propSuccess,
  scope = 'quote-order' 
}) => {
  const [settings, setSettings] = useState<CostCentersSettings>({
    enableCostCenterSupport: data?.enableCostCenterSupport ?? false,
    includeCostCenterWhenTabEntering: data?.includeCostCenterWhenTabEntering ?? false
  });
  const [isLoading, setIsLoading] = useState<boolean>(!!loading);
  const [isSaving, setIsSaving] = useState<boolean>(!!saving);
  const [error, setError] = useState<string | null>(propError || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(propSuccess || null);

  // Handle prop changes
  useEffect(() => {
    if (data) {
      setSettings({
        enableCostCenterSupport: data.enableCostCenterSupport ?? false,
        includeCostCenterWhenTabEntering: data.includeCostCenterWhenTabEntering ?? false
      });
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(!!loading);
    setIsSaving(!!saving);
    setError(propError || null);
    setSuccessMessage(propSuccess || null);
  }, [loading, saving, propError, propSuccess]);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let data: {
          enableCostCenterSupport?: boolean;
          includeCostCenterWhenTabEntering?: boolean;
        } | null = null;

        if (scope === 'billing') {
          const { billingSettingsService } = await import('../../services/billingSettingsService');
          data = await billingSettingsService.getCostCenters();
        } else {
          data = await fetchQuoteOrderInvoiceSection<{
            enableCostCenterSupport?: boolean;
            includeCostCenterWhenTabEntering?: boolean;
          }>('cost-centers');
        }

        if (!isMounted) return;

        if (typeof data?.enableCostCenterSupport === 'boolean') {
          setSettings(prev => ({ ...prev, enableCostCenterSupport: data.enableCostCenterSupport ?? false }));
        }
        if (typeof data?.includeCostCenterWhenTabEntering === 'boolean') {
          setSettings(prev => ({ ...prev, includeCostCenterWhenTabEntering: data.includeCostCenterWhenTabEntering ?? false }));
        }
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
    setSettings(prev => {
      const newSettings = { ...prev, [key]: !prev[key] };
      if (onChange) {
        onChange(newSettings);
      }
      return newSettings;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (onSave) {
        // If onSave prop is provided, use it (for SettingsModal)
        onSave(settings);
      } else {
        // Otherwise, use the original save logic
        if (scope === 'billing') {
          const { billingSettingsService } = await import('../../services/billingSettingsService');
          await billingSettingsService.saveCostCenters(settings);
          // Reload data after save
          const updated = await billingSettingsService.getCostCenters();
          if (typeof updated.enableCostCenterSupport === 'boolean') {
            setSettings(prev => ({ ...prev, enableCostCenterSupport: updated.enableCostCenterSupport ?? false }));
          }
          if (typeof updated.includeCostCenterWhenTabEntering === 'boolean') {
            setSettings(prev => ({ ...prev, includeCostCenterWhenTabEntering: updated.includeCostCenterWhenTabEntering ?? false }));
          }
        } else {
          await updateQuoteOrderInvoiceSection('cost-centers', settings);
          // Reload data after save
          const updated = await fetchQuoteOrderInvoiceSection<{
            enableCostCenterSupport?: boolean;
            includeCostCenterWhenTabEntering?: boolean;
          }>('cost-centers');
          if (typeof updated.enableCostCenterSupport === 'boolean') {
            setSettings(prev => ({ ...prev, enableCostCenterSupport: updated.enableCostCenterSupport ?? false }));
          }
          if (typeof updated.includeCostCenterWhenTabEntering === 'boolean') {
            setSettings(prev => ({ ...prev, includeCostCenterWhenTabEntering: updated.includeCostCenterWhenTabEntering ?? false }));
          }
        }
        setSuccessMessage('Cost centers settings saved successfully');
      }
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
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}
      {successMessage && !isLoading && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-600">{successMessage}</div>
      )}
      {isLoading ? (
        <div className="text-sm text-gray-500">Loading cost centers settings...</div>
      ) : (
        <>
      {/* Header */}
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm">✓</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Cost centers</h3>
      </div>

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
          className={`bg-green-600 text-white px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            isSaving || isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'
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