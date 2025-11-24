import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { billingSettingsService } from '../../services/billingSettingsService';
import type { PaymentMethod, PaymentTerm } from '../../services/billingSettingsService';
import { AccountSelector } from '../AccountSelector';

const BillingPaymentMethodsTerms: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTerm[]>([]);
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
      const data = await billingSettingsService.getPaymentMethodsTerms();
      setPaymentMethods(data.paymentMethods || []);
      setPaymentTerms(data.paymentTerms || []);
    } catch (err) {
      console.error('Failed to load payment methods and terms:', err);
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

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      console.log('Saving payment methods and terms:', { paymentMethods, paymentTerms });
      await billingSettingsService.savePaymentMethodsTerms(paymentMethods, paymentTerms);
      setSuccess('Settings saved successfully!');
      // Reload data to ensure we have the latest from server (without showing loading)
      await loadData(false);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Failed to save payment methods and terms:', err);
      setError(err instanceof Error ? err.message : 'Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentMethodChange = (id: string, field: string, value: string) => {
    setPaymentMethods(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handlePaymentTermChange = (id: string, field: string, value: boolean) => {
    if (field === 'preselected' && value) {
      // If setting this as preselected, unset all others
      setPaymentTerms(prev => prev.map(item => 
        item.id === id ? { ...item, preselected: true } : { ...item, preselected: false }
      ));
    } else {
      setPaymentTerms(prev => prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
    }
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(item => item.id !== id));
  };

  const handleDeletePaymentTerm = (id: string) => {
    setPaymentTerms(prev => prev.filter(item => item.id !== id));
  };

  const handleAddPaymentMethod = () => {
    const newItem = {
      id: Date.now().toString(),
      code: '',
      text: '',
      account: ''
    };
    setPaymentMethods(prev => [...prev, newItem]);
  };

  const handleAddPaymentTerm = () => {
    const newItem = {
      id: Date.now().toString(),
      code: '',
      text: '',
      preselected: false,
      reminder: false
    };
    setPaymentTerms(prev => [...prev, newItem]);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment method section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment method</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3">CODE</div>
                <div className="col-span-4">TEXT</div>
                <div className="col-span-4">ACCOUNT</div>
                <div className="col-span-1"></div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {paymentMethods.map((item) => (
                <div key={item.id} className="px-3 py-2 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) => handlePaymentMethodChange(item.id, 'code', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handlePaymentMethodChange(item.id, 'text', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="col-span-4">
                      <AccountSelector
                        value={item.account}
                        onChange={(accountNumber) => handlePaymentMethodChange(item.id, 'account', accountNumber)}
                        placeholder="Select account"
                        className="w-full"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => handleDeletePaymentMethod(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleAddPaymentMethod}
                  className="w-full px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-left"
                >
                  + Add new payment method
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment terms section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment terms</h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-2">CODE</div>
                <div className="col-span-3">TEXT</div>
                <div className="col-span-3">PRESELECTED</div>
                <div className="col-span-3">REMINDER SENT</div>
                <div className="col-span-1"></div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {paymentTerms.map((item) => (
                <div key={item.id} className="px-3 py-2 hover:bg-gray-50">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-2">
                      <input
                        type="text"
                        value={item.code}
                        onChange={(e) => setPaymentTerms(prev => prev.map(term => 
                          term.id === item.id ? { ...term, code: e.target.value } : term
                        ))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => setPaymentTerms(prev => prev.map(term => 
                          term.id === item.id ? { ...term, text: e.target.value } : term
                        ))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="radio"
                        name="preselected"
                        checked={item.preselected}
                        onChange={() => handlePaymentTermChange(item.id, 'preselected', true)}
                        className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="checkbox"
                        checked={item.reminder}
                        onChange={(e) => handlePaymentTermChange(item.id, 'reminder', e.target.checked)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => handleDeletePaymentTerm(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleAddPaymentTerm}
                  className="w-full px-3 py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded hover:border-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-left"
                >
                  + Add new payment term
                </button>
              </div>
            </div>
          </div>
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

export default BillingPaymentMethodsTerms;
