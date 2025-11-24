import React, { useEffect, useState } from 'react';
import { CreateFinancialYearModal } from './CreateFinancialYearModal';
import { salarySettingsService, type FinancialYearEntry } from '../../services/salarySettingsService';

interface FinancialYearInterfaceProps {
  data?: {
    createFiscalYearsAutomatically: boolean;
    years: FinancialYearEntry[];
  };
  onChange?: (data: { createFiscalYearsAutomatically: boolean; years: FinancialYearEntry[] }) => void;
  onSave?: (data: { createFiscalYearsAutomatically: boolean; years: FinancialYearEntry[] }) => void;
  saving?: boolean;
  loading?: boolean;
  error?: string | null;
  success?: boolean | string | null;
}

export const FinancialYearInterface: React.FC<FinancialYearInterfaceProps> = ({
  data,
  onChange,
  onSave,
  saving: externalSaving,
  loading: externalLoading,
  error: externalError,
  success: externalSuccess
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingYearId, setEditingYearId] = useState<string | null>(null);
  const [initialModalData, setInitialModalData] = useState<any | null>(null);
  const [internalCreateAutomatically, setInternalCreateAutomatically] = useState<boolean>(false);
  const [internalFinancialYears, setInternalFinancialYears] = useState<FinancialYearEntry[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalSaving, setInternalSaving] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [internalSuccess, setInternalSuccess] = useState<boolean | string>(false);

  const createAutomatically = data ? data.createFiscalYearsAutomatically : internalCreateAutomatically;
  const financialYears = data ? data.years : internalFinancialYears;
  const loading = externalLoading !== undefined ? externalLoading : internalLoading;
  const saving = externalSaving !== undefined ? externalSaving : internalSaving;
  const error = externalError !== undefined ? externalError : internalError;
  const success = externalSuccess !== undefined ? externalSuccess : internalSuccess;

  useEffect(() => {
    if (!data) {
      loadSettings();
    }
  }, [data]);

  const loadSettings = async () => {
    setInternalLoading(true);
    setInternalError(null);
    try {
      const data = await salarySettingsService.getFinancialYear();
      setInternalCreateAutomatically(data.createFiscalYearsAutomatically ?? false);
      setInternalFinancialYears(
        Array.isArray(data.years)
          ? data.years.map((year, index) => ({
            ...year,
            id: typeof year.id === 'string' && year.id.length > 0 ? year.id : `${Date.now()}-${index}`
          }))
          : []
      );
    } catch (err) {
      console.error('Failed to load financial year settings:', err);
      setInternalError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setInternalLoading(false);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      onSave({
        createFiscalYearsAutomatically: createAutomatically,
        years: financialYears
      });
      return;
    }

    setInternalSaving(true);
    setInternalError(null);
    setInternalSuccess(false);
    try {
      await salarySettingsService.saveFinancialYear({
        createFiscalYearsAutomatically: createAutomatically,
        years: financialYears
      });
      setInternalSuccess(true);
      setTimeout(() => setInternalSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save financial year settings:', err);
      setInternalError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setInternalSaving(false);
    }
  };

  const handleSaveNewFinancialYear = async (newData: any) => {
    let updated: FinancialYearEntry[];
    if (editingYearId) {
      updated = financialYears.map(y => y.id === editingYearId ? {
        ...y,
        fromDate: newData.fromDate,
        toDate: newData.toDate,
        accountingMethod: (newData.accountingMethod as 'Billing method' | 'The cash method') ?? 'Billing method',
        accountChart: newData.accountChart,
        isPreselected: newData.preselected || false
      } : y);
    } else {
      const newYear: FinancialYearEntry = {
        id: Date.now().toString(),
        fromDate: newData.fromDate,
        toDate: newData.toDate,
        accountingMethod: (newData.accountingMethod as 'Billing method' | 'The cash method') ?? 'Billing method',
        accountChart: newData.accountChart,
        isPreselected: newData.preselected || false,
        openAtLogin: false
      };
      updated = [newYear, ...financialYears];
    }

    if (onChange) {
      onChange({
        createFiscalYearsAutomatically: createAutomatically,
        years: updated
      });
      setIsModalOpen(false);
      setEditingYearId(null);
      setInitialModalData(null);
      return;
    }

    if (onSave) {
      onSave({
        createFiscalYearsAutomatically: createAutomatically,
        years: updated
      });
      setIsModalOpen(false);
      setEditingYearId(null);
      setInitialModalData(null);
      return;
    }

    setInternalSaving(true);
    setInternalError(null);
    try {
      await salarySettingsService.saveFinancialYear({
        createFiscalYearsAutomatically: createAutomatically,
        years: updated
      });
      setInternalFinancialYears(updated);
      setIsModalOpen(false);
      setEditingYearId(null);
      setInitialModalData(null);
      setInternalSuccess(true);
      setTimeout(() => setInternalSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save financial year:', err);
      setInternalError(err instanceof Error ? err.message : 'Failed to save financial year');
    } finally {
      setInternalSaving(false);
    }
  };

  const handleRowClick = (year: FinancialYearEntry) => {
    setEditingYearId(year.id);
    setInitialModalData({
      fromDate: year.fromDate,
      toDate: year.toDate,
      accountingMethod: year.accountingMethod,
      accountChart: year.accountChart,
      preselected: year.isPreselected
    });
    setIsModalOpen(true);
  };

  const handlePreselect = async (id: string) => {
    const updated = financialYears.map(y => ({ ...y, isPreselected: y.id === id }));

    if (onChange) {
      onChange({
        createFiscalYearsAutomatically: createAutomatically,
        years: updated
      });
      return;
    }

    if (onSave) {
      onSave({
        createFiscalYearsAutomatically: createAutomatically,
        years: updated
      });
      return;
    }

    try {
      await salarySettingsService.saveFinancialYear({
        createFiscalYearsAutomatically: createAutomatically,
        years: updated
      });
      setInternalFinancialYears(updated);
    } catch (err) {
      console.error('Failed to update preselected year:', err);
      setInternalError(err instanceof Error ? err.message : 'Failed to update year');
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
          <div className="text-gray-500">Loading financial years...</div>
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
        <h3 className="text-lg font-medium text-gray-900">Financial year</h3>
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
          <p className="text-sm text-green-700">
            {typeof success === 'string' ? success : 'Settings saved successfully!'}
          </p>
        </div>
      )}

      {/* Top Section with Toggle and Create Button */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4 mb-4">
            <h4 className="text-sm font-semibold text-gray-900">Create fiscal years automatically</h4>
            <ToggleSwitch
              value={createAutomatically}
              onChange={() => {
                const newValue = !createAutomatically;
                if (onChange) {
                  onChange({
                    createFiscalYearsAutomatically: newValue,
                    years: financialYears
                  });
                } else {
                  setInternalCreateAutomatically(newValue);
                  setInternalSuccess(false);
                }
              }}
            />
          </div>
          <p className="text-sm text-gray-600">
            The next fiscal year is automatically created approximately one month before the end date of the previous year. The new year will have the same chart of accounts as the previous year. Opening balances and all settings used will automatically be carried over to the next year.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={saving || loading}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-lg transition-colors ml-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create new
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                FROM
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                EMPTY
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ACCOUNTING METHOD
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                ACCOUNT CHART
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                PRESELECTED
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {financialYears.map((year, index) => (
              <tr
                key={year.id}
                className={index % 2 === 0 ? 'bg-white cursor-pointer' : 'bg-gray-50 cursor-pointer'}
                onClick={() => {
                  if (!saving && !loading) {
                    handleRowClick(year);
                  }
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{year.fromDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{year.toDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{year.accountingMethod}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{year.accountChart}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={year.isPreselected}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (!saving && !loading) {
                        handlePreselect(year.id);
                      }
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={saving || loading}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-green-600 text-white px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Create Financial Year Modal */}
      <CreateFinancialYearModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewFinancialYear}
        initialData={initialModalData}
      />
    </div>
  );
};

