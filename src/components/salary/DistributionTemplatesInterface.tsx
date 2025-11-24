import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { salarySettingsService, type DistributionTemplateRow } from '../../services/salarySettingsService';
import { AccountSelector } from '../AccountSelector';

export const DistributionTemplatesInterface: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('New distribution template');
  const [name, setName] = useState('');
  const [accountNumberToggle, setAccountNumberToggle] = useState(true);
  const [costCenterToggle, setCostCenterToggle] = useState(true);
  const [projectToggle, setProjectToggle] = useState(true);
  const [rows, setRows] = useState<DistributionTemplateRow[]>([
    { id: '1', accountNumber: '', costCenter: '', project: '', percent: '0,00' },
    { id: '2', accountNumber: '', costCenter: '', project: '', percent: '0,00' }
  ]);
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
      const data = await salarySettingsService.getDistributionTemplates();
      setSelectedTemplate(data.selectedTemplate);
      setName(data.name || '');
      setAccountNumberToggle(data.accountNumberToggle ?? true);
      setCostCenterToggle(data.costCenterToggle ?? true);
      setProjectToggle(data.projectToggle ?? true);
      // Ensure exactly 2 rows exist (first editable, second auto-calculated)
      if (!data.rows || data.rows.length === 0) {
        setRows([
          { id: '1', accountNumber: '', costCenter: '', project: '', percent: '0,00' },
          { id: '2', accountNumber: '', costCenter: '', project: '', percent: '0,00' }
        ]);
      } else if (data.rows.length === 1) {
        // If only one row exists, add second row for auto-calculation
        setRows([
          ...data.rows,
          { id: '2', accountNumber: '', costCenter: '', project: '', percent: '0,00' }
        ]);
      } else {
        setRows(data.rows);
      }
    } catch (err) {
      console.error('Failed to load distribution templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      // Ensure exactly 2 rows exist even on error
      if (rows.length === 0) {
        setRows([
          { id: '1', accountNumber: '', costCenter: '', project: '', percent: '0,00' },
          { id: '2', accountNumber: '', costCenter: '', project: '', percent: '0,00' }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate second row percent based on first row
  const calculateSecondRowPercent = (firstRowPercent: string): string => {
    // Parse first row percent (handle comma or period as decimal separator)
    const percentStr = firstRowPercent.replace(',', '.');
    const firstPercent = parseFloat(percentStr) || 0;
    const secondPercent = Math.max(0, 100 - firstPercent);
    // Return with comma as decimal separator
    return secondPercent.toFixed(2).replace('.', ',');
  };

  const handleRowChange = (id: string, field: keyof DistributionTemplateRow, value: string) => {
    // Only allow editing the first row (id === '1' or index 0)
    const rowIndex = rows.findIndex(r => r.id === id);
    if (rowIndex !== 0) return; // Second row is read-only
    
    // Only allow changes if the corresponding toggle is enabled
    if (field === 'accountNumber' && !accountNumberToggle) return;
    if (field === 'costCenter' && !costCenterToggle) return;
    if (field === 'project' && !projectToggle) return;
    
    setRows(prev => {
      const updated = prev.map(row => 
        row.id === id ? { ...row, [field]: value } : row
      );
      
      // Auto-calculate second row percent if first row percent changed
      if (field === 'percent' && id === prev[0]?.id && prev.length >= 2) {
        updated[1].percent = calculateSecondRowPercent(value);
      }
      
      return updated;
    });
    setSuccess(false);
  };

  const handleAccountSelect = (id: string, accountNumber: string, accountName: string) => {
    // Only allow editing the first row
    const rowIndex = rows.findIndex(r => r.id === id);
    if (rowIndex !== 0) return; // Second row is read-only
    
    if (!accountNumberToggle) return;
    handleRowChange(id, 'accountNumber', accountNumber);
  };

  const handleDeleteRow = (id: string) => {
    // Only allow deleting first row, and reset both rows
    const rowIndex = rows.findIndex(r => r.id === id);
    if (rowIndex === 0) {
      setRows([
        { id: '1', accountNumber: '', costCenter: '', project: '', percent: '0,00' },
        { id: '2', accountNumber: '', costCenter: '', project: '', percent: '0,00' }
      ]);
    }
    setSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await salarySettingsService.saveDistributionTemplates({
        selectedTemplate,
        name,
        accountNumberToggle,
        costCenterToggle,
        projectToggle,
        rows
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save distribution templates:', err);
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
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">✓</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Distribution templates</h3>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-100"
          >
            <option>New distribution template</option>
          </select>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg transition-colors">
            Create new
          </button>
        </div>
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

      {/* Input Fields and Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Account number
          </label>
          <ToggleSwitch 
            value={accountNumberToggle} 
            onChange={() => {
              setAccountNumberToggle(!accountNumberToggle);
              // Clear account numbers when toggled off
              if (accountNumberToggle) {
                setRows(prev => prev.map(row => ({ ...row, accountNumber: '' })));
              }
            }} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cost center
          </label>
          <ToggleSwitch 
            value={costCenterToggle} 
            onChange={() => {
              setCostCenterToggle(!costCenterToggle);
              // Clear cost centers when toggled off
              if (costCenterToggle) {
                setRows(prev => prev.map(row => ({ ...row, costCenter: '' })));
              }
            }} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <ToggleSwitch 
            value={projectToggle} 
            onChange={() => {
              setProjectToggle(!projectToggle);
              // Clear projects when toggled off
              if (projectToggle) {
                setRows(prev => prev.map(row => ({ ...row, project: '' })));
              }
            }} 
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {accountNumberToggle && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ACCOUNT NUMBER</th>
              )}
              {costCenterToggle && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">COST CENTER</th>
              )}
              {projectToggle && (
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PROJECT</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PERCENT</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map((row, index) => {
              const isFirstRow = index === 0;
              const isReadOnly = !isFirstRow; // Second row is read-only
              
              return (
                <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {accountNumberToggle && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isReadOnly ? (
                        <input
                          type="text"
                          value={row.accountNumber}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                      ) : (
                        <AccountSelector
                          value={row.accountNumber}
                          onChange={(accountNumber, accountName) => handleAccountSelect(row.id, accountNumber, accountName)}
                          placeholder="Enter account"
                          className="w-full"
                        />
                      )}
                    </td>
                  )}
                  {costCenterToggle && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={row.costCenter}
                        onChange={(e) => handleRowChange(row.id, 'costCenter', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          isReadOnly 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-gray-900'
                        }`}
                      />
                    </td>
                  )}
                  {projectToggle && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        value={row.project}
                        onChange={(e) => handleRowChange(row.id, 'project', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                          isReadOnly 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-gray-900'
                        }`}
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={row.percent}
                      onChange={(e) => handleRowChange(row.id, 'percent', e.target.value)}
                      disabled={isReadOnly}
                      className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        isReadOnly 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : 'bg-white text-gray-900'
                      }`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {isFirstRow && (
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="text-red-600 hover:text-red-900"
                        type="button"
                        title="Delete row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
          Delete
        </button>
        <div className="flex items-center space-x-3">
          <button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
