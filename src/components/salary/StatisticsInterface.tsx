import React, { useState, useEffect } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

export const StatisticsInterface: React.FC = () => {
  const [form, setForm] = useState({
    workplaceNumberCFAR: '',
    slp: true,
    ssyk2012: '',
    snSalaryStatistics: true,
    nyk14: '',
    membershipNumberInThe: '',
    workplaceNumber: '',
    federalNumberCivilServants: '',
    contractCodeWhiteCollar: '',
    unionNumberWorkers: '',
    contractCodeWorker: '',
    klp: true,
    ksjU: true,
    sus: true,
    ksp: true
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
      const data = await salarySettingsService.getStatistics();
      setForm(data);
    } catch (err) {
      console.error('Failed to load statistics settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const toggle = (k: keyof typeof form) => setForm(p => ({ ...p, [k]: !p[k] as any }));
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const Toggle = ({ value, onClick }: { value: boolean; onClick: () => void }) => (
    <div className="flex">
      <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-l-lg ${value ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>Yes</button>
      <button onClick={onClick} className={`px-4 py-2 text-sm font-medium rounded-r-lg border-l-0 ${!value ? 'bg-gray-600 text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'}`}>No</button>
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await salarySettingsService.saveStatistics(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save statistics settings:', err);
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
        <h3 className="text-lg font-medium text-gray-900">Statistics</h3>
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

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Workplace number/CFAR</label>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.workplaceNumberCFAR} onChange={(e)=>set('workplaceNumberCFAR', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statistics Sweden: Wage Structure Statistics (SLP)</label>
            <Toggle value={form.slp} onClick={()=>toggle('slp')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Code (SSYK 2012)</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.ssyk2012} onChange={(e)=>set('ssyk2012', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SN: Salary statistics</label>
          <Toggle value={form.snSalaryStatistics} onClick={()=>toggle('snSalaryStatistics')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Code (NYK 14)</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.nyk14} onChange={(e)=>set('nyk14', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Membership number in the</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.membershipNumberInThe} onChange={(e)=>set('membershipNumberInThe', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workplace number</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.workplaceNumber} onChange={(e)=>set('workplaceNumber', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Federal number for civil servants</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.federalNumberCivilServants} onChange={(e)=>set('federalNumberCivilServants', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contract code White-collar workers</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.contractCodeWhiteCollar} onChange={(e)=>set('contractCodeWhiteCollar', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Union number Workers</label>
            <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.unionNumberWorkers} onChange={(e)=>set('unionNumberWorkers', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contract code Worker</label>
          <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" value={form.contractCodeWorker} onChange={(e)=>set('contractCodeWorker', e.target.value)} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SCB Economic statistics (KLP)</label>
            <Toggle value={form.klp} onClick={()=>toggle('klp')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statistics Sweden Business cycle statistics on sick pay (KSJU)</label>
            <Toggle value={form.ksjU as any} onClick={()=>toggle('ksjU')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SCB Sickness absence during the sick pay period (SUS)</label>
            <Toggle value={form.sus} onClick={()=>toggle('sus')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SCB Short-term periodic employment statistics, private sector (KSP)</label>
            <Toggle value={form.ksp} onClick={()=>toggle('ksp')} />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};


