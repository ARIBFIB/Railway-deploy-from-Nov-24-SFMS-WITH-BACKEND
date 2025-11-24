import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { salarySettingsService } from '../../services/salarySettingsService';

export const PaySlipInterface: React.FC = () => {
  const [settings, setSettings] = useState({
    senderName: 'Test company',
    senderEmail: '',
    senderTitle: '',
    senderPhone: '',
    numberOfDaysBeforePayoutDate: ''
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
      const data = await salarySettingsService.getPaySlip();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load pay slip settings:', err);
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
      await salarySettingsService.savePaySlip(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save pay slip settings:', err);
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
        <h3 className="text-lg font-medium text-gray-900">Pay slip</h3>
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

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sender Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Sender</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="senderName"
                value={settings.senderName}
                onChange={handleChange}
                placeholder="Test company"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="senderEmail"
                value={settings.senderEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="senderTitle"
                  value={settings.senderTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="senderPhone"
                  value={settings.senderPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scheduling Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Scheduling</h4>
          <div>
            <div className="flex items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Number of days before payout date
              </label>
              <HelpCircle className="w-4 h-4 text-blue-600 ml-2 cursor-help" />
            </div>
            <input
              type="text"
              name="numberOfDaysBeforePayoutDate"
              value={settings.numberOfDaysBeforePayoutDate}
              onChange={handleChange}
              placeholder="0 - 28 days"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
            />
          </div>
        </div>

        {/* Quarrel Section */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Quarrel</h4>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              The add-on must be activated in order to send pay slips via Kivra. Please note that there is an additional cost per pay slip sent.
            </p>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg transition-colors w-full">
              Activate Kivra
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

