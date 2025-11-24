import React, { useState, useEffect } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

export const CompensationsInterface: React.FC = () => {
  const [settings, setSettings] = useState({
    mileageReimbursement: '25,00',
    mileageReimbursementForCompany: '12,00',
    mileageReimbursementForCompanySecond: '12,00',
    mileageReimbursementFor: '9,50',
    extraSickPayFor: '0'
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
      const data = await salarySettingsService.getCompensations();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load compensations settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      await salarySettingsService.saveCompensations(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save compensations settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

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
        <h3 className="text-lg font-medium text-gray-900">Compensations</h3>
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

      {/* Settings Grid - Horizontal Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Mileage reimbursement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage reimbursement
          </label>
          <input
            type="text"
            name="mileageReimbursement"
            value={settings.mileageReimbursement}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        {/* Mileage reimbursement for company */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage reimbursement for company
          </label>
          <input
            type="text"
            name="mileageReimbursementForCompany"
            value={settings.mileageReimbursementForCompany}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        {/* Mileage reimbursement for company (second) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage reimbursement for company
          </label>
          <input
            type="text"
            name="mileageReimbursementForCompanySecond"
            value={settings.mileageReimbursementForCompanySecond}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        {/* Mileage reimbursement for */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mileage reimbursement for
          </label>
          <input
            type="text"
            name="mileageReimbursementFor"
            value={settings.mileageReimbursementFor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        {/* Extra sick pay for the */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Extra sick pay for the
          </label>
          <input
            type="text"
            name="extraSickPayFor"
            value={settings.extraSickPayFor}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
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

