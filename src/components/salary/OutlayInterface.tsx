import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { salarySettingsService, type OutlayRow } from '../../services/salarySettingsService';

interface OutlayRowWithEditing extends OutlayRow {
  isEditing?: boolean;
}

export const OutlayInterface: React.FC = () => {
  const [rows, setRows] = useState<OutlayRowWithEditing[]>([]);
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
      const data = await salarySettingsService.getOutlay();
      setRows(data.rows || []);
    } catch (err) {
      console.error('Failed to load outlay settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (id: string) => setRows(prev => prev.map(r => ({ ...r, isEditing: r.id === id })));
  const cancelEdit = () => setRows(prev => prev.map(r => ({ ...r, isEditing: false })));
  const saveRow = (id: string, updated: Partial<OutlayRow>) => {
    // Keep row in edit mode while typing; do not turn off isEditing here
    setRows(prev => prev.map(r => (r.id === id ? { ...r, ...updated } : r)));
  };
  const finishEdit = (id: string) => setRows(prev => prev.map(r => (r.id === id ? { ...r, isEditing: false } : r)));
  const deleteRow = async (id: string) => {
    if (!confirm('Are you sure you want to delete this row?')) {
      return;
    }

    try {
      const updated = rows.filter(r => r.id !== id).map(({ isEditing, ...rest }) => rest);
      setSaving(true);
      await salarySettingsService.saveOutlay({ rows: updated });
      setRows(rows.filter(r => r.id !== id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to delete row:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete row');
    } finally {
      setSaving(false);
    }
  };
  const addRow = () => {
    const newRow: OutlayRowWithEditing = { id: Date.now().toString(), code: '', name: '', accountNumber: '', isEditing: true };
    setRows(prev => [...prev, newRow]);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const rowsToSave = rows.map(({ isEditing, ...rest }) => rest);
      await salarySettingsService.saveOutlay({ rows: rowsToSave });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save outlay settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading outlay settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm">✓</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Outlay</h3>
        </div>
        <button 
          onClick={addRow} 
          disabled={saving}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Add row
        </button>
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

      <div className="border border-gray-300 rounded-lg bg-white overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">CODE</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">NAME</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ACCOUNT NUMBER</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => startEdit(row.id)}>
                <td className="px-4 py-3">
                  {row.isEditing ? (
                    <input
                      value={row.code}
                      onChange={(e) => saveRow(row.id, { code: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); finishEdit(row.id); } }}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    row.code
                  )}
                </td>
                <td className="px-4 py-3">
                  {row.isEditing ? (
                    <input
                      value={row.name}
                      onChange={(e) => saveRow(row.id, { name: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); finishEdit(row.id); } }}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    row.name
                  )}
                </td>
                <td className="px-4 py-3">
                  {row.isEditing ? (
                    <input
                      value={row.accountNumber}
                      onChange={(e) => saveRow(row.id, { accountNumber: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); finishEdit(row.id); } }}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    row.accountNumber
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.isEditing ? (
                    <div className="space-x-2">
                      <button onClick={(e)=>{ e.stopPropagation(); cancelEdit(); }} className="px-3 py-1 bg-gray-300 rounded">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={(e)=>{ e.stopPropagation(); deleteRow(row.id); }} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4" /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSaveAll} 
          disabled={saving}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};


