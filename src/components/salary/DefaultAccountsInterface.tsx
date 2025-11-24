import React, { useState, useEffect, useCallback } from 'react';
import { salarySettingsService } from '../../services/salarySettingsService';

// Move InputField outside component to prevent recreation on every render
const InputField = React.memo<{ 
  label: string; 
  name: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}>(({ label, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value || ''}
      onChange={onChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
    />
  </div>
));

InputField.displayName = 'InputField';

export const DefaultAccountsInterface: React.FC = () => {
  const [settings, setSettings] = useState({
    // Tax and employer contributions
    debtStaffWithholdingTaxes: '2710',
    debtSocialSecurityContributions: '2730',
    costEmployerContributions: '7510',
    
    // Salary
    costWagesWorkers: '7010',
    costSalaryCivilServant: '7210',
    sickPayWorkers: '7081',
    sickPayCivilServant: '7281',
    
    // VAT
    inputVAT: '2641',
    outputVAT: '',
    inputReverseChargeVAT: '2645',
    outputReverseChargeVAT: '2614',
    
    // Other
    obsAccount: '2999',
    pennyRounding: '3740',
    otherNetCompensation: '7390',
    
    // Payment
    cashPayment: '1910',
    paymentFromBank: '1930',
    
    // Benefit
    benefit: '7390',
    counterBookingBenefit: '7399',
    
    // Personal
    net: '7390',
    tradeFee: '2794',
    advance: '1610',
    personalLoans: '1382',
    attachmentOfWages: '2750',
    
    // Allowances and mileage reimbursement
    taxFreeAllowance: '7321',
    allowanceTaxable: '7322',
    foreignAllowancesTaxFree: '7323',
    expatriateAllowanceTaxable: '7324',
    mileageReimbursementTaxFree: '7331',
    mileageReimbursementTaxable: '7332',
    entertainmentDeductible: '6071',
    entertainmentNotDeductible: '6072',
    mealReduction: '7321',
    
    // Dividend/interest
    dividendInterest: '2898',
    taxOnDividendsInterest: '2710'
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
      const data = await salarySettingsService.getDefaultAccounts();
      setSettings(prevSettings => ({ ...prevSettings, ...data }));
    } catch (err) {
      console.error('Failed to load default accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    setSuccess(false);
  }, []);

  const handleSave = useCallback(async () => {
    if (saving) return; // Prevent double-clicks
    
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await salarySettingsService.saveDefaultAccounts(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save default accounts:', err);
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }, [settings, saving]);

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
        <h3 className="text-lg font-medium text-gray-900">Default accounts</h3>
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

      {/* Tax and employer contributions */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Tax and employer contributions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Debt of staff withholding taxes" name="debtStaffWithholdingTaxes" value={settings.debtStaffWithholdingTaxes} onChange={handleChange} />
          <InputField label="Debt social security contributions and payroll tax" name="debtSocialSecurityContributions" value={settings.debtSocialSecurityContributions} onChange={handleChange} />
          <InputField label="Cost of employer contributions" name="costEmployerContributions" value={settings.costEmployerContributions} onChange={handleChange} />
        </div>
      </div>

      {/* Salary */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Salary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Cost of wages for workers" name="costWagesWorkers" value={settings.costWagesWorkers} onChange={handleChange} />
          <InputField label="Cost of salary of civil servant" name="costSalaryCivilServant" value={settings.costSalaryCivilServant} onChange={handleChange} />
          <InputField label="Sick pay workers" name="sickPayWorkers" value={settings.sickPayWorkers} onChange={handleChange} />
          <InputField label="Sick pay for civil servant" name="sickPayCivilServant" value={settings.sickPayCivilServant} onChange={handleChange} />
        </div>
      </div>

      {/* VAT */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">VAT</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Input VAT" name="inputVAT" value={settings.inputVAT} onChange={handleChange} />
          <InputField label="Output VAT" name="outputVAT" value={settings.outputVAT} onChange={handleChange} />
          <InputField label="Input reverse charge VAT" name="inputReverseChargeVAT" value={settings.inputReverseChargeVAT} onChange={handleChange} />
          <InputField label="Output reverse charge VAT" name="outputReverseChargeVAT" value={settings.outputReverseChargeVAT} onChange={handleChange} />
        </div>
      </div>

      {/* Other */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Other</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="OBS account" name="obsAccount" value={settings.obsAccount} onChange={handleChange} />
          <InputField label="Penny rounding" name="pennyRounding" value={settings.pennyRounding} onChange={handleChange} />
          <InputField label="Other net compensation" name="otherNetCompensation" value={settings.otherNetCompensation} onChange={handleChange} />
        </div>
      </div>

      {/* Payment */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Payment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Cash payment" name="cashPayment" value={settings.cashPayment} onChange={handleChange} />
          <InputField label="Payment from bank" name="paymentFromBank" value={settings.paymentFromBank} onChange={handleChange} />
        </div>
      </div>

      {/* Benefit */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Benefit</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Benefit" name="benefit" value={settings.benefit} onChange={handleChange} />
          <InputField label="Counter booking benefit" name="counterBookingBenefit" value={settings.counterBookingBenefit} onChange={handleChange} />
        </div>
      </div>

      {/* Personal */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Personal</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Net" name="net" value={settings.net} onChange={handleChange} />
          <InputField label="Trade fee" name="tradeFee" value={settings.tradeFee} onChange={handleChange} />
          <InputField label="Advance" name="advance" value={settings.advance} onChange={handleChange} />
          <InputField label="Personal loans" name="personalLoans" value={settings.personalLoans} onChange={handleChange} />
          <InputField label="Attachment of wages" name="attachmentOfWages" value={settings.attachmentOfWages} onChange={handleChange} />
        </div>
      </div>

      {/* Allowances and mileage reimbursement */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Allowances and mileage reimbursement</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InputField label="Tax-free allowance" name="taxFreeAllowance" value={settings.taxFreeAllowance} onChange={handleChange} />
          <InputField label="Allowance taxable" name="allowanceTaxable" value={settings.allowanceTaxable} onChange={handleChange} />
          <InputField label="Mileage reimbursement tax-free" name="mileageReimbursementTaxFree" value={settings.mileageReimbursementTaxFree} onChange={handleChange} />
          <InputField label="Entertainment deductible" name="entertainmentDeductible" value={settings.entertainmentDeductible} onChange={handleChange} />
          <InputField label="Foreign allowances tax-free" name="foreignAllowancesTaxFree" value={settings.foreignAllowancesTaxFree} onChange={handleChange} />
          <InputField label="Expatriate allowance taxable" name="expatriateAllowanceTaxable" value={settings.expatriateAllowanceTaxable} onChange={handleChange} />
          <InputField label="Mileage reimbursement taxable" name="mileageReimbursementTaxable" value={settings.mileageReimbursementTaxable} onChange={handleChange} />
          <InputField label="Entertainment not deductible" name="entertainmentNotDeductible" value={settings.entertainmentNotDeductible} onChange={handleChange} />
          <InputField label="Meal reduction" name="mealReduction" value={settings.mealReduction} onChange={handleChange} />
        </div>
      </div>

      {/* Dividend/interest */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Dividend/interest</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Dividend/interest" name="dividendInterest" value={settings.dividendInterest} onChange={handleChange} />
          <InputField label="Tax on dividends/interest" name="taxOnDividendsInterest" value={settings.taxOnDividendsInterest} onChange={handleChange} />
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

