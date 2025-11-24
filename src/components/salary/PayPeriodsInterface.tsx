import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Menu } from 'lucide-react';
import { CreateNewPayPeriodModal } from './CreateNewPayPeriodModal';
import { salarySettingsService, type PayPeriodEntry } from '../../services/salarySettingsService';

export const PayPeriodsInterface: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [itemsPerPage, setItemsPerPage] = useState('10');
  const [payPeriods, setPayPeriods] = useState<PayPeriodEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<PayPeriodEntry>>({});
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
      const data = await salarySettingsService.getPayPeriods();
      setPayPeriods(data.periods || []);
    } catch (err) {
      console.error('Failed to load pay periods:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveToBackend = async (updatedPeriods: PayPeriodEntry[]) => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await salarySettingsService.savePayPeriods({ periods: updatedPeriods });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to save pay periods:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (id: string) => {
    const entry = payPeriods.find(p => p.id === id);
    if (entry) {
      setEditingId(id);
      setEditingData({ ...entry });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    
    const updated = payPeriods.map(p => 
      p.id === editingId ? { ...p, ...editingData } : p
    );
    setPayPeriods(updated);
    
    const saved = await saveToBackend(updated);
    if (saved) {
      setEditingId(null);
      setEditingData({});
    } else {
      // Reload on error to restore original state
      loadSettings();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this pay period?')) {
      return;
    }

    const updated = payPeriods.filter(p => p.id !== id);
    setPayPeriods(updated);
    
    const saved = await saveToBackend(updated);
    if (!saved) {
      // Reload on error to restore original state
      loadSettings();
    }
  };

  const handleCreateNew = () => {
    setIsModalOpen(true);
  };

  const handleSaveNewPayPeriod = async (data: any) => {
    // Extract year and month from startDatePayPeriod (format: YYYY-MM-DD)
    const startDate = data.startDatePayPeriod || '';
    const period = startDate ? startDate.substring(0, 7) : ''; // Get YYYY-MM from date
    
    // Format payment date from firstPayoutDate
    const paymentDate = data.firstPayoutDate || '';
    
    // Format deviation period from startDateDeviationPeriod
    const deviationPeriod = data.startDateDeviationPeriod || '';
    
    // Map payoutPeriod to payPeriod
    const payPeriod = data.payoutPeriod || 'Monthly salary current month';
    
    // Get name (with template variables if provided)
    const name = data.name || 'Monthly salary {MMMM} {YYYY}';

    const newPeriod: PayPeriodEntry = {
      id: Date.now().toString(),
      period: period,
      name: name,
      paymentDate: paymentDate,
      deviationPeriod: deviationPeriod,
      payPeriod: payPeriod,
      created: 'No'
    };
    const updated = [newPeriod, ...payPeriods];
    setPayPeriods(updated);
    setIsModalOpen(false);
    
    // Auto-save to backend
    const saved = await saveToBackend(updated);
    if (!saved) {
      // Reload on error to restore original state
      loadSettings();
      setIsModalOpen(true); // Re-open modal on error
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading pay periods...</div>
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
        <h3 className="text-lg font-medium text-gray-900">Pay periods</h3>
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

      {/* Top Controls */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'All'
                ? 'bg-gray-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Monthly salary previous')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'Monthly salary previous'
                ? 'bg-gray-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Monthly salary previous
          </button>
          <button
            onClick={() => setFilter('Current monthly salary')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              filter === 'Current monthly salary'
                ? 'bg-gray-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Current monthly salary
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <Menu className="text-gray-500 w-5 h-5 cursor-pointer" />
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <button
            onClick={handleCreateNew}
            disabled={saving || editingId !== null}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create new
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-lg bg-white overflow-x-auto">
        <table className="min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                PERIOD
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                PAYMENT DATE
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                DEVIATION PERIOD
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                PAY PERIOD
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                CREATED
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payPeriods.map((entry, index) => (
              <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {editingId === entry.id ? (
                    <input
                      type="text"
                      value={editingData.period || ''}
                      onChange={(e) => setEditingData({ ...editingData, period: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    entry.period
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === entry.id ? (
                    <input
                      type="text"
                      value={editingData.name || ''}
                      onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    entry.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === entry.id ? (
                    <input
                      type="date"
                      value={editingData.paymentDate || ''}
                      onChange={(e) => setEditingData({ ...editingData, paymentDate: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    entry.paymentDate
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === entry.id ? (
                    <input
                      type="date"
                      value={editingData.deviationPeriod || ''}
                      onChange={(e) => setEditingData({ ...editingData, deviationPeriod: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    entry.deviationPeriod
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === entry.id ? (
                    <input
                      type="text"
                      value={editingData.payPeriod || ''}
                      onChange={(e) => setEditingData({ ...editingData, payPeriod: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    entry.payPeriod
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === entry.id ? (
                    <select
                      value={editingData.created || 'No'}
                      onChange={(e) => setEditingData({ ...editingData, created: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  ) : (
                    entry.created
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-3">
                    {editingId === entry.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={saving}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          type="button"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={saving}
                          className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                          type="button"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(entry.id)}
                          disabled={saving || editingId !== null}
                          className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                          type="button"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          disabled={saving || editingId !== null}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create New Pay Period Modal */}
      <CreateNewPayPeriodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewPayPeriod}
      />
    </div>
  );
};

