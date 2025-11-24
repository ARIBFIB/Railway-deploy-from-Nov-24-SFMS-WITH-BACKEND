import React, { useState, useEffect } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

export const TaxEmployerContributionsInterface: React.FC = () => {
  const [form, setForm] = useState({
    calculationOfPreliminaryTax: 'Main employer (Tax according to tax table)',
    normalTaxTable: '',
    specificationNumberAgi: '1',
    workplaceNumberAgi: '',
    useAgiFrom2018: false,
    employerContributionLimitAthlete: true,
    useRegionalAidDeductions: false,
    useDiscountRAndD: false,
    growthSupportFirstEmployee: false,
    firstEmployee: 'No',
    growSupportUntilFirst: '',
    growthSupportOtherEmployees: false,
    secondEmployee: 'No',
    growSupportUntilSecond: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
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
      const data = await salarySettingsService.getTaxEmployerContributions();
      setForm(data);
    } catch (err) {
      console.error('Failed to load tax & employer contributions settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSuccess(false);
  };

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div className="flex">
      <button
        onClick={onChange}
        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
          value ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Yes
      </button>
      <button
        onClick={onChange}
        className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l-0 ${
          !value ? 'bg-gray-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        No
      </button>
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await salarySettingsService.saveTaxEmployerContributions(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save tax & employer contributions settings:', err);
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
        <h3 className="text-lg font-medium text-gray-900">Tax and employer contributions</h3>
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

      {/* Grid two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Calculation of preliminary tax</label>
            <select
              value={form.calculationOfPreliminaryTax}
              onChange={(e) => handleChange('calculationOfPreliminaryTax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option>Main employer (Tax according to tax table)</option>
              <option>Side income or short-term work (tax 30%)</option>
              <option>Short-term work less than 1 week (tax 30%)</option>
              <option>Students without tax deductions (tax 0%)</option>
              <option>Not tax deductible</option>
              <option>Unknown tax ratio (tax according to standard table + 10%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Normal tax table</label>
            <input
              type="text"
              value={form.normalTaxTable}
              onChange={(e) => handleChange('normalTaxTable', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specification number for AGI</label>
            <input
              type="text"
              value={form.specificationNumberAgi}
              onChange={(e) => handleChange('specificationNumberAgi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workplace number to AGI</label>
            <input
              type="text"
              value={form.workplaceNumberAgi}
              onChange={(e) => handleChange('workplaceNumberAgi', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Use AGI from 2018-07-01</label>
            <ToggleSwitch value={form.useAgiFrom2018} onChange={() => handleChange('useAgiFrom2018', !form.useAgiFrom2018)} />
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center">Contact person Employer declaration</h4>
            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e) => handleChange('contactName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employer contribution limit 1000 SEK/athlete</label>
            <ToggleSwitch
              value={form.employerContributionLimitAthlete}
              onChange={() => handleChange('employerContributionLimitAthlete', !form.employerContributionLimitAthlete)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Use regional aid deductions</label>
            <ToggleSwitch
              value={form.useRegionalAidDeductions}
              onChange={() => handleChange('useRegionalAidDeductions', !form.useRegionalAidDeductions)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Use discount for research and development</label>
            <ToggleSwitch
              value={form.useDiscountRAndD}
              onChange={() => handleChange('useDiscountRAndD', !form.useDiscountRAndD)}
            />
          </div>

          {/* Grow support */}
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-gray-900">Grow support</h4>
            <a href="#" className="text-blue-600 text-sm">Read more about growth support</a>

            <div className="mt-3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Use growth support for first employee</label>
                <ToggleSwitch
                  value={form.growthSupportFirstEmployee}
                  onChange={() => handleChange('growthSupportFirstEmployee', !form.growthSupportFirstEmployee)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First employee</label>
                <select
                  value={form.firstEmployee}
                  onChange={(e) => handleChange('firstEmployee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={!form.growthSupportFirstEmployee}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grow support until date</label>
                <input
                  type="date"
                  value={form.growSupportUntilFirst}
                  onChange={(e) => handleChange('growSupportUntilFirst', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={!form.growthSupportFirstEmployee}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Use grow support for other employees</label>
                <ToggleSwitch
                  value={form.growthSupportOtherEmployees}
                  onChange={() => handleChange('growthSupportOtherEmployees', !form.growthSupportOtherEmployees)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Second employee</label>
                <select
                  value={form.secondEmployee}
                  onChange={(e) => handleChange('secondEmployee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={!form.growthSupportOtherEmployees}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grow support until date</label>
                <input
                  type="date"
                  value={form.growSupportUntilSecond}
                  onChange={(e) => handleChange('growSupportUntilSecond', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={!form.growthSupportOtherEmployees}
                />
              </div>
            </div>
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


