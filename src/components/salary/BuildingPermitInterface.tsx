import React, { useState, useEffect } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

export const BuildingPermitInterface: React.FC = () => {
  const [settings, setSettings] = useState({
    useConstructionPermit: true,
    contractArea: 'Construction contract (28075)',
    countyAndMunicipality: ''
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const contractAreas = [
    'Construction contract (28075)',
    'Construction machinery agreement (10075)',
    'Sheet Metal and Ventilation Agreement - Installers\' Companies (25073)',
    'Sheet Metal and Ventilation Agreement - Sheet Metal and Vent Companies (42074)',
    'Technical Installation Agreement - Insulation (25071)',
    'Technical installation agreement - Refrigeration (25072)',
    'Technical Installation Agreement - Pipes (25070)',
    'Road & Rail Agreement (28071)'
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salarySettingsService.getBuildingPermit();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load building permit settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof settings) => {
    if (key === 'useConstructionPermit') {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
      setSuccess(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await salarySettingsService.saveBuildingPermit(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save building permit settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm">✓</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Building permit</h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">Settings saved successfully!</p>
        </div>
      )}

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Use construction permit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use construction permit
          </label>
          <ToggleSwitch 
            value={settings.useConstructionPermit} 
            onChange={() => handleToggle('useConstructionPermit')} 
          />
        </div>

        {/* Contract area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract area
          </label>
          <select
            name="contractArea"
            value={settings.contractArea}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {contractAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* County and municipality */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="flex items-center">
              County and municipality of the workplace
              <button className="ml-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-blue-600">
                ?
              </button>
            </span>
          </label>
          <input
            type="text"
            name="countyAndMunicipality"
            value={settings.countyAndMunicipality}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter county and municipality"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};
