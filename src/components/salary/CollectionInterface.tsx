import React, { useState, useEffect } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

export const CollectionInterface: React.FC = () => {
  const [settings, setSettings] = useState({
    itpCartoon: true,
    itpCostCenter: '',
    itpType: 'Automatically depending on age',
    itp1ProductTime: '',
    itp2ProductTime: '',
    itp2FixedAnnualSalaryPaidMonthly: 'SysGrad / 100 * Månadslön * 12.2',
    itp2FixedAnnualSalaryHourlyPaid: 'SysGrad / 100 * Timlön * 168 * 12.2'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await salarySettingsService.getCollection();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load collection settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setSettings(prev => ({ ...prev, itpCartoon: !prev.itpCartoon }));
    setSuccess(false);
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
      await salarySettingsService.saveCollection(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save collection settings:', err);
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
        <h3 className="text-lg font-medium text-gray-900">Collection</h3>
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

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ITP cartoon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ITP cartoon
          </label>
          <ToggleSwitch 
            value={settings.itpCartoon} 
            onChange={handleToggle} 
          />
        </div>

        {/* ITP cost center */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ITP cost center
          </label>
          <input
            type="text"
            name="itpCostCenter"
            value={settings.itpCostCenter}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter cost center"
          />
        </div>

        {/* ITP Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ITP Type
          </label>
          <select
            name="itpType"
            value={settings.itpType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="Automatically depending on age">Automatically depending on age</option>
            <option value="ITP1">ITP1</option>
            <option value="ITP2">ITP2</option>
          </select>
        </div>

        {/* www.collectum.se link */}
        <div className="md:col-span-3">
          <a 
            href="https://www.collectum.se" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            www.collectum.se
          </a>
        </div>

        {/* ITP1 Product time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ITP1 Product time
          </label>
          <input
            type="text"
            name="itp1ProductTime"
            value={settings.itp1ProductTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter ITP1 product time"
          />
        </div>

        {/* ITP2 Product time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ITP2 Product time
          </label>
          <input
            type="text"
            name="itp2ProductTime"
            value={settings.itp2ProductTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter ITP2 product time"
          />
        </div>

        {/* ITP2 fixed annual salary paid monthly */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ITP2 fixed annual salary paid monthly
          </label>
          <input
            type="text"
            name="itp2FixedAnnualSalaryPaidMonthly"
            value={settings.itp2FixedAnnualSalaryPaidMonthly}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        {/* ITP2 fixed annual salary hourly paid */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ITP2 fixed annual salary hourly paid
          </label>
          <input
            type="text"
            name="itp2FixedAnnualSalaryHourlyPaid"
            value={settings.itp2FixedAnnualSalaryHourlyPaid}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

