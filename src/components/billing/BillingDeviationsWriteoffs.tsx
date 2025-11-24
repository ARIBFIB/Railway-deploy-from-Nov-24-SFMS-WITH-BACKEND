import React, { useState, useEffect } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { billingSettingsService } from '../../services/billingSettingsService';
import type { DeviationsWriteoffItem } from '../../services/billingSettingsService';
import { AccountSelector } from '../AccountSelector';

const BillingDeviationsWriteoffs: React.FC = () => {
  const [deviationsData, setDeviationsData] = useState<DeviationsWriteoffItem[]>([]);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load data from backend
  const loadData = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const data = await billingSettingsService.getDeviationsWriteoffs();
      setDeviationsData(data.deviations || []);
    } catch (err) {
      console.error('Failed to load deviations/writeoffs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const applicationOptions = ['Payments', 'Payments/payments'];

  const handleAddRow = () => {
    const newRow = {
      id: Date.now().toString(),
      code: '',
      name: '',
      application: 'Payments',
      account: '2641'
    };
    setDeviationsData([...deviationsData, newRow]);
    setEditingRow(newRow.id);
  };

  const handleDeleteRow = (id: string) => {
    setDeviationsData(deviationsData.filter(row => row.id !== id));
  };

  const handleFieldChange = (id: string, field: string, value: string) => {
    setDeviationsData(deviationsData.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      console.log('Saving deviations data:', deviationsData);
      await billingSettingsService.saveDeviationsWriteoffs(deviationsData);
      setEditingRow(null);
      setEditingField(null);
      setSuccess('Settings saved successfully!');
      // Reload data to ensure we have the latest from server (without showing loading)
      await loadData(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save deviations/writeoffs:', err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CODE</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPLICATION</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACCOUNT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deviationsData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {editingRow === row.id && editingField === 'code' ? (
                    <input
                      type="text"
                      value={row.code}
                      onChange={(e) => handleFieldChange(row.id, 'code', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingField(null);
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => {
                        setEditingRow(row.id);
                        setEditingField('code');
                      }}
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm font-medium"
                    >
                      {row.code || 'Click to edit'}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingRow === row.id && editingField === 'name' ? (
                    <input
                      type="text"
                      value={row.name}
                      onChange={(e) => handleFieldChange(row.id, 'name', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingField(null);
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      autoFocus
                    />
                  ) : (
                    <div
                      onClick={() => {
                        setEditingRow(row.id);
                        setEditingField('name');
                      }}
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      {row.name || 'Click to edit'}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingRow === row.id && editingField === 'application' ? (
                    <select
                      value={row.application}
                      onChange={(e) => handleFieldChange(row.id, 'application', e.target.value)}
                      onBlur={() => setEditingField(null)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                      autoFocus
                    >
                      {applicationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingRow(row.id);
                        setEditingField('application');
                      }}
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      {row.application || 'Click to edit'}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editingRow === row.id && editingField === 'account' ? (
                    <div className="w-full">
                      <AccountSelector
                        value={row.account}
                        onChange={(accountNumber) => {
                          handleFieldChange(row.id, 'account', accountNumber);
                          setEditingField(null);
                        }}
                        placeholder="Select account"
                        className="w-full"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        setEditingRow(row.id);
                        setEditingField('account');
                      }}
                      className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      {row.account || 'Click to edit'}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDeleteRow(row.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleAddRow}
            className="text-sm text-green-600 hover:text-green-800 font-medium"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Row
          </button>
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

export default BillingDeviationsWriteoffs;
