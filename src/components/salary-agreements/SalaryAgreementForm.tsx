import React, { useState } from 'react';
import XSDropdown, { type DropdownOption } from './XSDropdown';
import { salaryAgreementsService, type CreateSalaryAgreementData } from '../../services/salaryAgreementsService';

interface FormData {
  name: string;
  staffType: string;
  agreementTemplate: string;
  salaryPeriod: string;
  // ATF & ATK data
  atf: {
    enabled: boolean;
    period: 'calendar' | 'holiday';
    showOnPayslip: boolean;
    unit: string;
    source: string;
  };
  atk: {
    enabled: boolean;
    period: 'calendar' | 'holiday';
    showOnPayslip: boolean;
    unit: string;
    source: string;
  };
  // Holiday data
  holiday: {
    enabled: boolean;
    earningYear: 'current' | 'previous';
    startDay: string;
    startMonth: string;
    entitlementDays: string;
    fullDaysOnly: boolean;
    // Holiday conditions fields
    rule: 'equal' | 'percent';
    payPerDay: string;
    holidaySupplement: string;
    paySupplementSeparately: boolean;
    variableSupplement: string;
    variableSupplementPerDay: boolean;
    // New percent rule fields
    holidayPay: string;
    minimumWage: string;
    compliesWithAnnualLeaveAct: boolean;
    // New general section fields
    sicknessDeduction: 'qualifying' | 'sickness'; // 'qualifying' or 'sickness'
    sickWaitingPeriod: string;
    automaticSchedule: boolean;
    automaticFullDay: boolean;
    // New settings data
    settings: {
      name: string;
      formula: string;
      value: string;
    }[];
    // New salary types formulas
    salaryTypes: {
      label: string;
      enabled: boolean;
    }[];
  };
}

interface SalaryAgreementFormProps {
  onBackToList: () => void;
  onSave: (data: FormData) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface ExpandedSections {
  atfAtk: boolean;
  general: boolean;
  holiday: boolean;
  [key: string]: boolean;
}

const SalaryAgreementForm: React.FC<SalaryAgreementFormProps> = ({ onBackToList, onSave, showToast }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    staffType: 'blue-collar',
    agreementTemplate: 'blue-collar',
    salaryPeriod: 'monthly-previous',
    atf: {
      enabled: true,
      period: 'calendar',
      showOnPayslip: true,
      unit: 'Hours',
      source: 'Antal'
    },
    atk: {
      enabled: true,
      period: 'calendar',
      showOnPayslip: true,
      unit: 'SEK',
      source: 'Summa'
    },
    holiday: {
      enabled: true,
      earningYear: 'current',
      startDay: '1',
      startMonth: '4',
      entitlementDays: '25',
      fullDaysOnly: false,
      rule: 'equal',
      payPerDay: '4.60',
      holidaySupplement: '0.43',
      paySupplementSeparately: false,
      variableSupplement: '12.00',
      variableSupplementPerDay: false,
      holidayPay: '12.00',
      minimumWage: '0.00',
      compliesWithAnnualLeaveAct: true,
      sicknessDeduction: 'qualifying',
      sickWaitingPeriod: '2019-01-01',
      automaticSchedule: true,
      automaticFullDay: false,
      // New settings data
      settings: [
        { name: 'OB addition simple', formula: 'P01', value: '0' },
        { name: 'OB supplement qualified', formula: 'P02', value: '0' },
        { name: 'OB supplement weekend', formula: 'P03', value: '0' },
        { name: 'Union fee %', formula: 'P04', value: '0' },
        { name: 'Inspection fee', formula: 'P05', value: '0' },
        { name: 'Travel time compensation', formula: 'P06', value: '0' },
        { name: 'Contract period', formula: 'P07', value: '168' },
        { name: 'OB supplement 4', formula: 'P09', value: '0' },
        { name: 'OB supplement 5', formula: 'P10', value: '0' }
      ],
      // New salary types formulas
      salaryTypes: [
        { label: 'Use A01', enabled: false },
        { label: 'Use A02', enabled: false },
        { label: 'Use A03', enabled: false },
        { label: 'Use A04', enabled: false },
        { label: 'Use A05', enabled: false }
      ]
    }
  });

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    atfAtk: true,
    general: true,
    holiday: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare data for API
      const apiData: CreateSalaryAgreementData = {
        name: formData.name,
        staff_type: formData.staffType,
        agreement_template: formData.agreementTemplate,
        salary_period: formData.salaryPeriod,
        atf: {
          enabled: formData.atf.enabled,
          period: formData.atf.period,
          showOnPayslip: formData.atf.showOnPayslip
        },
        atk: {
          enabled: formData.atk.enabled,
          period: formData.atk.period,
          showOnPayslip: formData.atk.showOnPayslip
        },
        holiday: {
          earningYear: formData.holiday.earningYear,
          startDate: {
            day: formData.holiday.startDay,
            month: formData.holiday.startMonth
          },
          entitlement: formData.holiday.entitlementDays,
          fullDaysOnly: formData.holiday.fullDaysOnly,
          rule: formData.holiday.rule,
          holidayPay: formData.holiday.payPerDay,
          minimumWage: formData.holiday.minimumWage,
          compliesWithAnnualLeaveAct: formData.holiday.compliesWithAnnualLeaveAct,
          variableSupplementPerDay: formData.holiday.variableSupplementPerDay,
          sicknessDeduction: formData.holiday.sicknessDeduction,
          sickWaitingPeriod: formData.holiday.sickWaitingPeriod,
          automaticSchedule: formData.holiday.automaticSchedule,
          automaticFullDay: formData.holiday.automaticFullDay,
          settings: formData.holiday.settings,
          salaryTypes: formData.holiday.salaryTypes
        }
      };
      
      // Get foundation ID from user context
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const foundationId = user.foundation_id || '47935ef6-8b3e-4ceb-86c2-7ad9cdbbb3a9';
      
      console.log('Creating agreement for foundation:', foundationId);
      
      await salaryAgreementsService.create(apiData, foundationId);
      
      // Show success toast
      showToast('The agreement was created.', 'success');
      
      // Call onSave callback and go back to list
      onSave(formData);
      onBackToList();
      
    } catch (error) {
      console.error('Failed to create salary agreement:', error);
      showToast('Failed to create salary agreement. Please try again.', 'error');
    }
  };

  const handleATFChange = (field: keyof typeof formData.atf, value: any) => {
    setFormData(prev => ({
      ...prev,
      atf: {
        ...prev.atf,
        [field]: value
      }
    }));
  };

  const handleATKChange = (field: keyof typeof formData.atk, value: any) => {
    setFormData(prev => ({
      ...prev,
      atk: {
        ...prev.atk,
        [field]: value
      }
    }));
  };

  const handleHolidayChange = (field: keyof typeof formData.holiday, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      holiday: {
        ...prev.holiday,
        [field]: value
      }
    }));
  };

  const handleHolidayEnabledChange = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      holiday: {
        ...prev.holiday,
        enabled: value
      }
    }));
  };

  const handleHolidayConditionsChange = (field: keyof typeof formData.holiday, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      holiday: {
        ...prev.holiday,
        [field]: value
      }
    }));
  };

  const handlePercentRuleChange = (field: keyof typeof formData.holiday, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      holiday: {
        ...prev.holiday,
        [field]: value
      }
    }));
  };

  const handleGeneralChange = (field: keyof typeof formData.holiday, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      holiday: {
        ...prev.holiday,
        [field]: value
      }
    }));
  };

  const handleSalaryTypesChange = (index: number) => {
    setFormData(prev => {
      const updatedTypes = [...prev.holiday.salaryTypes];
      updatedTypes[index].enabled = !updatedTypes[index].enabled;
      return {
        ...prev,
        holiday: {
          ...prev.holiday,
          salaryTypes: updatedTypes
        }
      };
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof expandedSections]
    }));
  };

  // Dropdown options
  const staffTypeOptions = [
    { value: 'blue-collar', label: 'Blue-collar' },
    { value: 'white-collar', label: 'White-collar' }
  ];

  const agreementTemplateOptions = [
    { value: 'blue-collar', label: 'Blue-collar' },
    { value: 'white-collar', label: 'White-collar' },
    { value: 'trade', label: 'Trade' },
    { value: 'metal', label: 'Metal' }
  ];

  const salaryPeriodOptions = [
    { value: 'monthly-current', label: 'Monthly salary current month' },
    { value: 'monthly-previous', label: 'Monthly salary previous month' },
    { value: 'four-week', label: 'Four-week salary' },
    { value: 'biweekly', label: 'Biweekly salary' },
    { value: 'weekly', label: 'Weekly salary' }
  ];

  const sourceOptions = [
    { value: 'Antal', label: 'Antal' },
    { value: 'Summa', label: 'Summa' },
    { value: 'Timmar', label: 'Timmar' },
    { value: 'Procent', label: 'Procent' }
  ];

  // Holiday dropdown options
  const holidayDayOptions: DropdownOption[] = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString()
  }));

  const holidayMonthOptions: DropdownOption[] = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const holidayRuleOptions: DropdownOption[] = [
    { value: 'equal', label: 'Equal pay rule' },
    { value: 'percent', label: 'Percent rule' }
  ];

  const holidayYearOptions: DropdownOption[] = [
    { value: 'current', label: 'Current earning year' },
    { value: 'previous', label: 'Previous earning year' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header (Top Bar) */}
      <div className="h-14 bg-white border-b border-gray-300 flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-gray-800 tracking-wide">
          AGREEMENT FOR SALARIES - CREATE NEW
        </h1>
        <button
          onClick={onBackToList}
          className="flex items-center h-9 px-3.5 bg-amber-400 text-black font-semibold text-sm rounded-full hover:bg-amber-500 shadow-md transition-colors"
        >
          <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          Show list
        </button>
      </div>

      {/* Main Content Wrapper */}
      <div className="p-3 pb-16">
        {/* Section Title */}
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Create agreement
        </h2>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column – Form Card */}
          <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-8 px-2.5 border border-gray-400 rounded text-sm text-gray-800 focus:border-gray-500 outline-none"
                  required
                />
              </div>

              {/* Staff Type & Agreement Template (Row) - Using XS Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <XSDropdown
                  label="Staff type"
                  options={staffTypeOptions}
                  value={formData.staffType}
                  onChange={(value) => setFormData(prev => ({ ...prev, staffType: value }))}
                />
                
                <XSDropdown
                  label="Agreement template"
                  options={agreementTemplateOptions}
                  value={formData.agreementTemplate}
                  onChange={(value) => setFormData(prev => ({ ...prev, agreementTemplate: value }))}
                />
              </div>

              {/* Salary Period - Using XS Dropdown */}
              <XSDropdown
                label="Salary period"
                options={salaryPeriodOptions}
                value={formData.salaryPeriod}
                onChange={(value) => setFormData(prev => ({ ...prev, salaryPeriod: value }))}
              />
            </form>
          </div>

          {/* Right Column – Information Panel */}
          <div className="bg-white border border-gray-300 rounded-xl p-6 shadow-md">
            <h3 className="text-base font-semibold text-black mb-2">
              Create agreement
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Here you specify the settings that will apply according to your collective agreement. The values pre-filled in some of the fields can be changed to the values that should apply for this agreement.
            </p>
            <p className="text-sm leading-relaxed text-gray-600 mt-3">
              Under <strong>Register - Personnel - Employment</strong> You control which agreement applies to the employee.
            </p>
          </div>
        </div>

        {/* ATF & ATK Section */}
        <div className="mt-6 bg-white border-t border-gray-300">
          {/* Section Header (Collapsible) */}
          <div 
            className="flex items-center gap-2 h-10 px-5 cursor-pointer"
            onClick={() => toggleSection('atfAtk')}
          >
            <svg 
              className={`w-3.5 h-3.5 text-green-700 transform transition-transform ${expandedSections.atfAtk ? 'rotate-0' : '-rotate-90'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <h3 className="text-sm font-semibold text-gray-700">
              Reduced Working Hours (ATF) and Working Time Account (ATK)
            </h3>
          </div>

          {/* Content */}
          {expandedSections.atfAtk && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-5">
              {/* ATF Block (Left) */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="space-y-3">
                  {/* ATF Toggle */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      ATF
                    </label>
                    <div className="flex h-8 border border-gray-400 rounded">
                      <button
                        type="button"
                        onClick={() => handleATFChange('enabled', true)}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          formData.atf.enabled 
                            ? 'bg-white text-gray-800' 
                            : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleATFChange('enabled', false)}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          !formData.atf.enabled 
                            ? 'bg-white text-gray-800' 
                            : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Period Toggle */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Period
                    </label>
                    <div className={`flex h-8 border rounded ${
                      !formData.atf.enabled ? 'border-gray-300 bg-gray-200' : 'border-gray-400'
                    }`}>
                      <button
                        type="button"
                        onClick={() => formData.atf.enabled && handleATFChange('period', 'calendar')}
                        disabled={!formData.atf.enabled}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          formData.atf.period === 'calendar' && formData.atf.enabled
                            ? 'bg-white text-gray-800' 
                            : formData.atf.enabled
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Calendar year
                      </button>
                      <button
                        type="button"
                        onClick={() => formData.atf.enabled && handleATFChange('period', 'holiday')}
                        disabled={!formData.atf.enabled}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          formData.atf.period === 'holiday' && formData.atf.enabled
                            ? 'bg-white text-gray-800' 
                            : formData.atf.enabled
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Holiday year
                      </button>
                    </div>
                  </div>

                  {/* Show on payslip Toggle */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Show on payslip
                    </label>
                    <div className={`flex h-8 border rounded ${
                      !formData.atf.enabled ? 'border-gray-300 bg-gray-200' : 'border-gray-400'
                    }`}>
                      <button
                        type="button"
                        onClick={() => formData.atf.enabled && handleATFChange('showOnPayslip', true)}
                        disabled={!formData.atf.enabled}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          formData.atf.showOnPayslip && formData.atf.enabled
                            ? 'bg-white text-gray-800' 
                            : formData.atf.enabled
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => formData.atf.enabled && handleATFChange('showOnPayslip', false)}
                        disabled={!formData.atf.enabled}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          !formData.atf.showOnPayslip && formData.atf.enabled
                            ? 'bg-white text-gray-800' 
                            : formData.atf.enabled
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Unit (Read-only) */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.atf.unit}
                      readOnly
                      className="w-full h-8 px-2.5 border border-gray-400 rounded text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Source Dropdown - Using XS Dropdown */}
                  <XSDropdown
                    label="Source"
                    options={sourceOptions}
                    value={formData.atf.source}
                    onChange={(value) => handleATFChange('source', value)}
                    disabled={!formData.atf.enabled}
                    infoText="Select the source for ATF calculations"
                  />
                </div>
              </div>

              {/* ATK Block (Right) */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="space-y-3">
                  {/* ATK Toggle */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      ATK
                    </label>
                    <div className="flex h-8 border border-gray-400 rounded">
                      <button
                        type="button"
                        onClick={() => handleATKChange('enabled', true)}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          formData.atk.enabled 
                            ? 'bg-white text-gray-800' 
                            : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleATKChange('enabled', false)}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          !formData.atk.enabled 
                            ? 'bg-white text-gray-800' 
                            : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Period Toggle */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Period
                    </label>
                    <div className={`flex h-8 border rounded ${
                      !formData.atk.enabled ? 'border-gray-300 bg-gray-200' : 'border-gray-400'
                    }`}>
                      <button
                        type="button"
                        onClick={() => formData.atk.enabled && handleATKChange('period', 'calendar')}
                        disabled={!formData.atk.enabled}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          formData.atk.period === 'calendar' && formData.atk.enabled
                            ? 'bg-white text-gray-800' 
                            : formData.atk.enabled
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Calendar year
                      </button>
                      <button
                        type="button"
                        onClick={() => formData.atk.enabled && handleATKChange('period', 'holiday')}
                        disabled={!formData.atk.enabled}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          formData.atk.period === 'holiday' && formData.atk.enabled
                            ? 'bg-white text-gray-800' 
                            : formData.atk.enabled
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Holiday year
                      </button>
                    </div>
                  </div>

                  {/* Show on payslip Toggle */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Show on payslip
                    </label>
                    <div className={`flex h-8 border rounded ${
                      !formData.atk.enabled ? 'border-gray-300 bg-gray-200' : 'border-gray-400'
                    }`}>
                      <button
                        type="button"
                        onClick={() => formData.atk.enabled && handleATKChange('showOnPayslip', true)}
                        disabled={!formData.atk.enabled}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          formData.atk.showOnPayslip && formData.atk.enabled
                            ? 'bg-white text-gray-800' 
                            : formData.atk.enabled
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => formData.atk.enabled && handleATKChange('showOnPayslip', false)}
                        disabled={!formData.atk.enabled}
                        className={`flex-1 text-xs font-medium transition-colors ${
                          !formData.atk.showOnPayslip && formData.atk.enabled
                            ? 'bg-white text-gray-800' 
                            : formData.atk.enabled
                            ? 'bg-gray-300 text-gray-500'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  {/* Unit (Read-only) */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.atk.unit}
                      readOnly
                      className="w-full h-8 px-2.5 border border-gray-400 rounded text-sm text-gray-500 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Source Dropdown - Using XS Dropdown */}
                  <XSDropdown
                    label="Source"
                    options={sourceOptions}
                    value={formData.atk.source}
                    onChange={(value) => handleATKChange('source', value)}
                    disabled={!formData.atk.enabled}
                    infoText="Select the source for ATK calculations"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Holiday Configuration Section - Accordion */}
        <div className="border-b border-gray-300">
          {/* Accordion Header */}
          <div 
            className={`h-11 w-full px-3 bg-white flex items-center justify-between cursor-pointer transition-colors ${expandedSections.holiday ? 'bg-gray-50' : ''}`}
            onClick={() => toggleSection('holiday')}
            aria-expanded={expandedSections.holiday}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSection('holiday');
              }
            }}
          >
            {/* Left Side - Title Group */}
            <div className="flex items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-green-700 flex items-center justify-center text-white text-[10px] mr-2">
                ✔
              </div>
              <span className="text-sm font-semibold text-gray-800 leading-[44px]">
                Holiday
              </span>
            </div>
            
            {/* Right Side - Chevron Icon */}
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform duration-220 ease-in-out ${expandedSections.holiday ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gray-300 w-full"></div>
          
          {/* Accordion Content */}
          <div 
            className={`overflow-hidden transition-all duration-240 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${expandedSections.holiday ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-2 pb-3 pt-2">

          {/* Holiday Content - Updated for XS Design */}
          <div className="px-3 pb-4">
            {/* Holiday Master Toggle */}
            <div className="mb-3.5">
              <label className="block text-xs text-gray-600 mb-1">
                Holiday
              </label>
              <div className="flex h-8 border border-gray-400 rounded">
                <button
                  type="button"
                  onClick={() => handleHolidayEnabledChange(true)}
                  className={`flex-1 text-xs font-medium transition-colors ${
                    formData.holiday.enabled 
                      ? 'bg-white text-gray-800' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleHolidayEnabledChange(false)}
                  className={`flex-1 text-xs font-medium transition-colors ${
                    !formData.holiday.enabled 
                      ? 'bg-white text-gray-800' 
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Tab Switcher - Updated for XS Design */}
            <div className="mb-3.5">
              <div className={`flex h-8 rounded-md p-0.5 border ${
                !formData.holiday.enabled ? 'border-gray-300 bg-gray-200' : 'border-gray-300 bg-gray-100'
              }`}>
                <button
                  type="button"
                  onClick={() => formData.holiday.enabled && handleHolidayChange('earningYear', 'current')}
                  disabled={!formData.holiday.enabled}
                  className={`flex-1 h-7 rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${
                    formData.holiday.earningYear === 'current' && formData.holiday.enabled
                      ? 'bg-gray-200 text-gray-600' 
                      : formData.holiday.enabled
                      ? 'bg-white text-gray-800 border border-gray-400'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Current earning year
                </button>
                <button
                  type="button"
                  onClick={() => formData.holiday.enabled && handleHolidayChange('earningYear', 'previous')}
                  disabled={!formData.holiday.enabled}
                  className={`flex-1 h-7 rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${
                    formData.holiday.earningYear === 'previous' && formData.holiday.enabled
                      ? 'bg-gray-200 text-gray-600' 
                      : formData.holiday.enabled
                      ? 'bg-white text-gray-800 border border-gray-400'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous earning year
                </button>
              </div>
            </div>

            {/* Field Group: Start Date for Holiday Year - Updated for XS Design */}
            <div className="mb-3.5">
              <label className={`block text-xs mb-1.5 ${!formData.holiday.enabled ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter start date for holiday year
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select
                    value={formData.holiday.startDay}
                    onChange={(e) => formData.holiday.enabled && handleHolidayChange('startDay', e.target.value)}
                    disabled={!formData.holiday.enabled}
                    className={`w-full h-8 border rounded bg-white px-2 text-xs appearance-none ${
                      formData.holiday.enabled 
                        ? 'border-gray-300 text-gray-800' 
                        : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {holidayDayOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <div className="relative flex-1">
                  <select
                    value={formData.holiday.startMonth}
                    onChange={(e) => formData.holiday.enabled && handleHolidayChange('startMonth', e.target.value)}
                    disabled={!formData.holiday.enabled}
                    className={`w-full h-8 border rounded bg-white px-2 text-xs appearance-none ${
                      formData.holiday.enabled 
                        ? 'border-gray-300 text-gray-800' 
                        : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {holidayMonthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Field: Holiday Entitlement in Days - Updated for XS Design */}
            <div className="mb-3.5">
              <div className="flex items-center gap-1 mb-1.5">
                <label className={`text-xs ${!formData.holiday.enabled ? 'text-gray-400' : 'text-gray-600'}`}>
                  Holiday entitlement in days
                </label>
                <svg className={`w-3 h-3 ${formData.holiday.enabled ? 'text-blue-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={formData.holiday.entitlementDays}
                onChange={(e) => formData.holiday.enabled && handleHolidayChange('entitlementDays', e.target.value)}
                disabled={!formData.holiday.enabled}
                className={`w-full h-8 border rounded bg-white px-2 text-xs text-right ${
                  formData.holiday.enabled 
                    ? 'border-gray-300 text-gray-500' 
                    : 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              />
            </div>

            {/* Toggle Field: Full Holiday Days Only - Updated for XS Design */}
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <label className={`text-xs ${!formData.holiday.enabled ? 'text-gray-400' : 'text-gray-600'}`}>
                  Full holiday days only
                </label>
                <svg className={`w-3 h-3 ${formData.holiday.enabled ? 'text-blue-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex items-center">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => formData.holiday.enabled && handleHolidayChange('fullDaysOnly', !formData.holiday.fullDaysOnly)}
                    disabled={!formData.holiday.enabled}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      formData.holiday.enabled
                        ? formData.holiday.fullDaysOnly 
                          ? 'bg-green-600' 
                          : 'bg-gray-300 border border-gray-400'
                        : 'bg-gray-200 border border-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        formData.holiday.enabled
                          ? formData.holiday.fullDaysOnly ? 'left-6' : 'left-0.5'
                          : 'left-0.5'
                      }`}
                    ></div>
                  </button>
                </div>
                <span className="ml-2 text-xs text-gray-600">
                  {formData.holiday.fullDaysOnly ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Holiday Conditions Section */}
        <div className={`mt-4 pt-4 border-t border-gray-200 ${!formData.holiday.enabled ? 'opacity-60' : ''}`}>
          {/* Header */}
          <div className="flex items-center mb-2.5">
            <h3 className={`text-sm font-semibold ${formData.holiday.enabled ? 'text-gray-800' : 'text-gray-500'}`}>
              Enter holiday conditions for monthly salary
            </h3>
            <div 
              className={`ml-1 w-3 h-3 rounded-full flex items-center justify-center text-white text-[10px] ${formData.holiday.enabled ? 'bg-blue-500 cursor-pointer' : 'bg-gray-400 cursor-not-allowed'}`}
              title={formData.holiday.enabled ? "Configure holiday payment rules for monthly salary calculations" : "Enable holiday section to configure conditions"}
            >
              ⓘ
            </div>
          </div>

          {/* Rule Selector (Segmented Tabs) */}
          <div className={`w-full h-8 rounded border p-0.5 mb-2 ${formData.holiday.enabled ? 'bg-gray-200 border-gray-400' : 'bg-gray-100 border-gray-300'}`}>
            <div className="flex h-7">
              <button
                onClick={() => formData.holiday.enabled && handleHolidayConditionsChange('rule', 'equal')}
                disabled={!formData.holiday.enabled}
                className={`flex-1 text-xs font-medium rounded transition-colors ${
                  formData.holiday.rule === 'equal' && formData.holiday.enabled
                    ? 'bg-gray-300 text-gray-500'
                    : formData.holiday.enabled
                    ? 'bg-white text-gray-700 border border-gray-500'
                    : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                }`}
              >
                Equal pay rule
              </button>
              <button
                onClick={() => formData.holiday.enabled && handleHolidayConditionsChange('rule', 'percent')}
                disabled={!formData.holiday.enabled}
                className={`flex-1 text-xs font-medium rounded transition-colors ${
                  formData.holiday.rule === 'percent' && formData.holiday.enabled
                    ? 'bg-gray-300 text-gray-500'
                    : formData.holiday.enabled
                    ? 'bg-white text-gray-700 border border-gray-500'
                    : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                }`}
              >
                Percent rule
              </button>
            </div>
          </div>

          {/* Helper Note */}
          <p className="text-[11px] text-black mb-4 leading-tight">
            * For hourly paid workers, the percentage rule is always applied
          </p>

          {/* Equal Pay Rule Section */}
          <h4 className="text-[13px] font-semibold text-gray-800 mb-2.5">
            Equal pay rule
          </h4>

          {/* Pay per day in % */}
          <div className="mb-3.5">
            <label className="block text-xs text-gray-600 mb-1.5">
              Pay per day in %
            </label>
            <input
              type="text"
              value={formData.holiday.payPerDay}
              onChange={(e) => handleHolidayConditionsChange('payPerDay', e.target.value)}
              className="w-full h-8 px-2 border border-gray-400 rounded text-xs text-right text-gray-500 bg-white outline-none focus:border-blue-500"
            />
          </div>

          {/* Field Row 1 - Two Columns */}
          <div className="flex gap-2.5 mb-3.5">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1.5">
                Holiday supplement in %
              </label>
              <input
                type="text"
                value={formData.holiday.holidaySupplement}
                onChange={(e) => handleHolidayConditionsChange('holidaySupplement', e.target.value)}
                className="w-full h-8 px-2 border border-gray-400 rounded text-xs text-right text-gray-500 bg-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1.5">
                Pay holiday supplement separately
              </label>
              <div className="flex items-center mt-1">
                <div 
                  onClick={() => handleHolidayConditionsChange('paySupplementSeparately', !formData.holiday.paySupplementSeparately)}
                  className={`w-12 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${
                    formData.holiday.paySupplementSeparately ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      formData.holiday.paySupplementSeparately ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {formData.holiday.paySupplementSeparately ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Field Row 2 - Two Columns */}
          <div className="flex gap-2.5">
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1.5">
                Variable supplement in %
              </label>
              <input
                type="text"
                value={formData.holiday.variableSupplement}
                onChange={(e) => handleHolidayConditionsChange('variableSupplement', e.target.value)}
                className="w-full h-8 px-2 border border-gray-400 rounded text-xs text-right text-gray-500 bg-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-600 mb-1.5">
                Variable supplement in % per day
              </label>
              <div className="flex items-center mt-1">
                <div 
                  onClick={() => handleHolidayConditionsChange('variableSupplementPerDay', !formData.holiday.variableSupplementPerDay)}
                  className={`w-12 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${
                    formData.holiday.variableSupplementPerDay ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div 
                    className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                      formData.holiday.variableSupplementPerDay ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {formData.holiday.variableSupplementPerDay ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Percent Rule Section - New Addition */}
          <div className={`mt-4 ${formData.holiday.rule === 'percent' ? 'block' : 'hidden'}`}>
            {/* Section Title */}
            <h4 className="text-sm font-semibold text-gray-800 mb-2.5">
              Percent rule
            </h4>

            {/* Holiday pay in % */}
            <div className="mb-3.5">
              <label className="block text-xs text-gray-600 mb-1.5">
                Holiday pay in %
              </label>
              <input
                type="text"
                value={formData.holiday.holidayPay}
                onChange={(e) => handlePercentRuleChange('holidayPay', e.target.value)}
                className="w-full h-8 px-2 border border-gray-400 rounded text-xs text-right text-gray-500 bg-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Minimum wage per day */}
            <div className="mb-4.5">
              <label className="block text-xs text-gray-600 mb-1.5">
                Minimum wage per day
              </label>
              <input
                type="text"
                value={formData.holiday.minimumWage}
                onChange={(e) => handlePercentRuleChange('minimumWage', e.target.value)}
                className="w-full h-8 px-2 border border-gray-400 rounded text-xs text-right text-black bg-white outline-none focus:border-blue-500"
              />
            </div>

            {/* Holiday advance sub-section */}
            <div className="mb-2.5">
              <h5 className="text-[13px] font-semibold text-gray-800 mb-2.5">
                Holiday advance
              </h5>
              
              {/* Compliance Rule Toggle */}
              <div>
                <div className="flex items-start gap-1 mb-1.5 max-w-[85%]">
                  <label className="text-xs text-gray-600 leading-tight">
                    Complies with the Swedish Annual Leave Act for saved days
                  </label>
                  <div 
                    className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] cursor-pointer flex-shrink-0 mt-0.5"
                    title="Toggle compliance with Swedish Annual Leave Act"
                  >
                    ⓘ
                  </div>
                </div>
                
                {/* Toggle Switch (YES/NO) */}
                <div className="w-16 h-7 border border-gray-400 rounded flex bg-white mt-1.5">
                  <button
                    onClick={() => handlePercentRuleChange('compliesWithAnnualLeaveAct', true)}
                    className={`flex-1 text-xs font-semibold rounded-l transition-colors ${
                      formData.holiday.compliesWithAnnualLeaveAct
                        ? 'bg-green-700 text-white'
                        : 'bg-white text-transparent'
                    }`}
                    style={{ height: '26px' }}
                  >
                    Yes
                  </button>
                  <div className="w-px bg-gray-400"></div>
                  <button
                    onClick={() => handlePercentRuleChange('compliesWithAnnualLeaveAct', false)}
                    className={`flex-1 text-xs font-semibold rounded-r transition-colors ${
                      !formData.holiday.compliesWithAnnualLeaveAct
                        ? 'bg-white text-black'
                        : 'bg-white text-transparent'
                    }`}
                    style={{ height: '26px' }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* General Section - Accordion */}
        <div className="border-b border-gray-300">
          {/* Accordion Header */}
          <div 
            className={`h-11 w-full px-3 bg-white flex items-center justify-between cursor-pointer transition-colors ${expandedSections.general ? 'bg-gray-50' : ''}`}
            onClick={() => toggleSection('general')}
            aria-expanded={expandedSections.general}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSection('general');
              }
            }}
          >
            {/* Left Side - Title Group */}
            <div className="flex items-center">
              <div className="w-3.5 h-3.5 rounded-full bg-green-700 flex items-center justify-center text-white text-[10px] mr-2">
                ✔
              </div>
              <span className="text-sm font-semibold text-gray-800 leading-[44px]">
                General
              </span>
            </div>
            
            {/* Right Side - Chevron Icon */}
            <svg 
              className={`w-4 h-4 text-gray-500 transition-transform duration-220 ease-in-out ${expandedSections.general ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-gray-300 w-full"></div>
          
          {/* Accordion Content */}
          <div 
            className={`overflow-hidden transition-all duration-240 ease-[cubic-bezier(0.4,0.0,0.2,1)] ${expandedSections.general ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-2 pb-3 pt-2">

          {/* Qualifying Day of Sickness Deduction */}
          <div className="mb-3.5">
            <div className="flex items-center gap-1 mb-1.5">
              <label className="text-xs text-gray-600">
                Qualifying day of sickness deduction
              </label>
              <div 
                className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] cursor-pointer"
                title="Select sickness deduction type"
              >
                ⓘ
              </div>
            </div>
            
            {/* Option Buttons (Segmented) */}
            <div className="flex gap-1.5 mt-1.5">
              <button
                onClick={() => handleGeneralChange('sicknessDeduction', 'qualifying')}
                className={`px-2 h-7 border rounded text-[11px] font-medium transition-colors ${
                  formData.holiday.sicknessDeduction === 'qualifying'
                    ? 'bg-white border-gray-500 text-gray-800'
                    : 'bg-gray-300 border-gray-400 text-gray-500'
                }`}
              >
                Qualifying day of sickness deduction
              </button>
              <button
                onClick={() => handleGeneralChange('sicknessDeduction', 'sickness')}
                className={`px-2 h-7 border rounded text-[11px] transition-colors ${
                  formData.holiday.sicknessDeduction === 'sickness'
                    ? 'bg-white border-gray-500 text-gray-800'
                    : 'bg-gray-300 border-gray-400 text-gray-500'
                }`}
              >
                Qualifying day of sickness
              </button>
            </div>
          </div>

          {/* Sick Waiting Period Deduction From Date */}
          <div className="mb-4">
            <label className="block text-xs text-gray-600 mb-1.5">
              Sick waiting period deduction from date
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.holiday.sickWaitingPeriod}
                onChange={(e) => handleGeneralChange('sickWaitingPeriod', e.target.value)}
                className="w-full h-8 px-2 border border-gray-400 rounded text-xs text-gray-800 bg-white outline-none focus:border-blue-500 pr-9"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                📅
              </div>
            </div>
          </div>

          {/* Automatic Schedule Time Toggle */}
          <div className="mb-3.5">
            <div className="flex items-center gap-1 mb-1.5">
              <label className="text-xs text-gray-600">
                Automatic schedule time
              </label>
              <div 
                className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] cursor-pointer"
                title="Enable automatic schedule time calculation"
              >
                ⓘ
              </div>
            </div>
            
            {/* Toggle Switch (YES/NO) */}
            <div className="w-16 h-7 border border-gray-400 rounded flex bg-white mt-1.5">
              <button
                onClick={() => handleGeneralChange('automaticSchedule', true)}
                className={`flex-1 text-xs font-semibold rounded-l transition-colors ${
                  formData.holiday.automaticSchedule
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-transparent'
                }`}
                style={{ height: '26px' }}
              >
                Yes
              </button>
              <div className="w-px bg-gray-400"></div>
              <button
                onClick={() => handleGeneralChange('automaticSchedule', false)}
                className={`flex-1 text-xs font-semibold rounded-r transition-colors ${
                  !formData.holiday.automaticSchedule
                    ? 'bg-white text-black'
                    : 'bg-white text-transparent'
                }`}
                style={{ height: '26px' }}
              >
                No
              </button>
            </div>
          </div>

          {/* Automatic Full Day Toggle */}
          <div className="mb-3.5">
            <div className="flex items-center gap-1 mb-1.5">
              <label className="text-xs text-gray-600">
                Automatic full day
              </label>
              <div 
                className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] cursor-pointer"
                title="Enable automatic full day calculation"
              >
                ⓘ
              </div>
            </div>
            
            {/* Toggle Switch (YES/NO) */}
            <div className="w-16 h-7 border border-gray-400 rounded flex bg-white mt-1.5">
              <button
                onClick={() => handleGeneralChange('automaticFullDay', true)}
                className={`flex-1 text-xs font-semibold rounded-l transition-colors ${
                  formData.holiday.automaticFullDay
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-transparent'
                }`}
                style={{ height: '26px' }}
              >
                Yes
              </button>
              <div className="w-px bg-gray-400"></div>
              <button
                onClick={() => handleGeneralChange('automaticFullDay', false)}
                className={`flex-1 text-xs font-semibold rounded-r transition-colors ${
                  !formData.holiday.automaticFullDay
                    ? 'bg-gray-300 text-gray-600'
                    : 'bg-white text-transparent'
                }`}
                style={{ height: '26px' }}
              >
                No
              </button>
            </div>
          </div>
          
          {/* Settings Table Section - Moved inside General accordion */}
          <div className="mt-4 pt-2 border-t border-gray-200">
          {/* Table Card Container */}
          <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            {/* Section Title */}
            <div className="p-0">
              <h3 className="text-sm font-semibold text-gray-800 mb-2.5 pl-2.5 pt-2.5">
                Settings according to collective agreement
              </h3>
            </div>

            {/* Table Structure */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse" style={{ borderSpacing: 0 }}>
                {/* Table Header Row */}
                <thead>
                  <tr className="h-9 bg-gray-50 border-b border-gray-400">
                    <th className="w-[55%] text-left pl-2.5 pr-2 border-r border-gray-300 text-[11px] font-semibold text-gray-800 uppercase">
                      {/* Empty header for label column */}
                    </th>
                    <th className="w-[20%] text-left px-2.5 border-r border-gray-300 text-[11px] font-semibold text-gray-800 uppercase">
                      FORMULA
                    </th>
                    <th className="w-[25%] text-right pr-2.5 text-[11px] font-semibold text-gray-800 uppercase">
                      VALUE
                    </th>
                  </tr>
                </thead>

                {/* Table Body Rows */}
                <tbody>
                  {formData.holiday.settings.map((setting, index) => (
                    <tr 
                      key={index} 
                      className={`h-10 bg-white ${index < formData.holiday.settings.length - 1 ? 'border-b border-gray-300' : ''}`}
                    >
                      {/* Setting Name Column */}
                      <td className="text-xs font-normal text-gray-800 text-left pl-2.5 pr-2 vertical-align-middle">
                        {setting.name}
                      </td>
                      
                      {/* Formula Code Column */}
                      <td className="text-xs font-medium text-gray-800 text-left px-2.5 border-r border-gray-300">
                        {setting.formula}
                      </td>
                      
                      {/* Value Column */}
                      <td className="text-xs font-normal text-right pr-2.5 vertical-align-middle">
                        <span className={setting.value === '0' ? 'text-gray-500' : 'text-gray-800'}>
                          {setting.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Salary Types Formulas Section - Moved inside General accordion */}
          <div className="mt-4 pt-2">
          {/* Section Title */}
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            Salary types formulas
          </h3>

          {/* Compact Toggle List - No spacing between rows */}
          <div className="pt-2 pb-2 pl-3 pr-3">
            {formData.holiday.salaryTypes.map((type, index) => (
              <div 
                key={index}
                className="flex items-center h-9 w-full"
              >
                <span className="text-xs font-normal text-gray-800 leading-9 flex-1">
                  {type.label}
                </span>
                
                {/* Compact Toggle Control */}
                <div 
                  className="w-[52px] h-[26px] border border-gray-400 rounded flex bg-white cursor-pointer ml-2"
                  onClick={() => handleSalaryTypesChange(index)}
                >
                  <div className={`flex-1 text-[11px] font-medium text-center leading-[26px] ${
                    !type.enabled 
                      ? 'bg-gray-300 text-gray-600' 
                      : 'bg-white text-transparent'
                  }`}>
                    No
                  </div>
                  <div className={`flex-1 text-[11px] font-medium text-center leading-[26px] ${
                    type.enabled 
                      ? 'bg-green-700 text-white' 
                      : 'bg-white text-transparent'
                  }`}>
                    Yes
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>

      {/* Global Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-300 shadow-[0_-2px_6px_rgba(0,0,0,0.06)] z-1000 flex items-center justify-end px-3 pt-2 pb-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="h-9 min-w-[72px] px-[18px] bg-green-700 text-white text-[13px] font-semibold rounded-full hover:bg-green-800 active:bg-green-900 disabled:bg-green-300 disabled:text-gray-100 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default SalaryAgreementForm;