import React, { useState, useEffect } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

export const ForumsInterface: React.FC = () => {
  const [settings, setSettings] = useState({
    foresigned: true,
    foraAgreementNumberAnnual: '',
    markups: [
      'Not employed as of ...',
      'Employed as a civil servant from ...',
      'Not drawn'
    ]
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
      const data = await salarySettingsService.getForums();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load forums settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setSettings(prev => ({ ...prev, foresigned: !prev.foresigned }));
    setSuccess(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setSuccess(false);
  };

  const handleAddMarkup = () => {
    setSettings(prev => ({
      ...prev,
      markups: [...prev.markups, 'New markup']
    }));
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await salarySettingsService.saveForums(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save forums settings:', err);
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
        <h3 className="text-lg font-medium text-gray-900">Forums</h3>
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

      {/* Help Link */}
      <div>
        <a
          href="#"
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          Read more in the help section
        </a>
      </div>

      {/* Top Section - Foresigned and Fora Agreement Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Foresigned Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foresigned
          </label>
          <ToggleSwitch
            value={settings.foresigned}
            onChange={handleToggle}
          />
        </div>

        {/* Fora Agreement Numbers */}
        <div className="space-y-4">
          {/* Annual Reporting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fora agreement number - Annual reporting
            </label>
            <input
              type="text"
              name="foraAgreementNumberAnnual"
              value={settings.foraAgreementNumberAnnual}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>

          {/* Monthly Reporting */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fora agreement number - Monthly reporting
            </label>
            <p className="text-sm text-gray-600">
              The contract number for monthly reporting is not used in the reporting. It therefore does not currently need to be entered in SFMS Lön.
            </p>
          </div>
        </div>
      </div>

      {/* MARKUP Section */}
      <div>
        <div className="border border-gray-300 rounded-lg bg-white">
          <div className="px-4 py-3 border-b border-gray-200">
            <h4 className="font-bold text-gray-900 uppercase">MARKUP</h4>
          </div>
          <div className="p-4 space-y-2">
            {settings.markups.map((markup, index) => (
              <div
                key={index}
                className="py-2 text-gray-700 text-sm"
              >
                {markup}
              </div>
            ))}
            <button
              onClick={handleAddMarkup}
              className="w-full text-left py-2 text-gray-400 text-sm hover:text-gray-600 focus:outline-none"
            >
              Add markup
            </button>
          </div>
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

