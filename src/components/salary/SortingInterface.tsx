import React, { useState, useEffect } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

export const SortingInterface: React.FC = () => {
  const [numericEmployeeIds, setNumericEmployeeIds] = useState(true);
  const [schemaIdNumericSorting, setSchemaIdNumericSorting] = useState(false);
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
      const data = await salarySettingsService.getSorting();
      setNumericEmployeeIds(data.numericEmployeeIds ?? true);
      setSchemaIdNumericSorting(data.schemaIdNumericSorting ?? false);
    } catch (err) {
      console.error('Failed to load sorting settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const Toggle = ({ value, onClick }: { value: boolean; onClick: () => void }) => (
    <div className="flex">
      <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
          value ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Yes
      </button>
      <button
        onClick={onClick}
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
      await salarySettingsService.saveSorting({
        numericEmployeeIds,
        schemaIdNumericSorting
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save sorting settings:', err);
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
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white text-sm">✓</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900">Sorting</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Numerical sorting of employee IDs</label>
          <Toggle value={numericEmployeeIds} onClick={() => setNumericEmployeeIds(!numericEmployeeIds)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Schema ID numeric sorting</label>
          <Toggle value={schemaIdNumericSorting} onClick={() => setSchemaIdNumericSorting(!schemaIdNumericSorting)} />
        </div>
      </div>

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


