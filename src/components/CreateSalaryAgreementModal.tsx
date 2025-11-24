import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, List, Calendar, HelpCircle } from 'lucide-react';
import { Button } from './Button';

interface CreateSalaryAgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (agreementData: any) => void;
}

export const CreateSalaryAgreementModal: React.FC<CreateSalaryAgreementModalProps> = ({ isOpen, onClose, onSave }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'create' | 'holiday' | 'generally'>('create');
  const [atfExpanded, setAtfExpanded] = useState(true);
  const [holidayExpanded, setHolidayExpanded] = useState(true);
  const [generallyExpanded, setGenerallyExpanded] = useState(false);
  
  const [formData, setFormData] = useState({
    // Create agreement
    name: '',
    staffType: 'Worker',
    agreementTemplate: 'Worker',
    payPeriod: 'Monthly salary previous month',
    
    // ATF (Shortened Working Hours)
    atf: true,
    atfPeriod: 'Calendar year',
    atfShowOnPaySlip: true,
    atfUnit: '',
    atfSource: '',
    
    // ATK (Working Hours Account)
    atk: true,
    atkPeriod: 'Calendar year',
    atkShowOnPaySlip: true,
    atkUnit: '',
    atkSource: '',
    
    // Holiday
    earningYear: 'Current earning year',
    vacationYearStart: '1',
    vacationYearMonth: 'April',
    holidayEntitlementDays: '25',
    onlyFullVacationDays: false,
    vacationConditions: 'The equal pay rule',
    
    // Generally
    waitingPeriodDeduction: 'Waiting period deduction',
    waitingPeriodFromDate: '2019-01-01',
    automaticScheduleTime: true,
    automaticFullDay: false,
    
    // Collective agreement settings
    obAdditionSimple: '0',
    obSupplementQualified: '0',
    obSupplementWeekend: '0',
    unionFeePercent: '0',
    inspectionFee: '0',
    travelTimeCompensation: '0',
    contractPeriod: '168',
    obSupplement4: '0',
    obSupplement5: '0',
    
    // Salary type formulas
    useA01: false,
    useA02: false,
    useA03: false,
    useA04: false,
    useA05: false,
    
    // Equal pay rule
    salaryPerDayPercent: '0,00',
    holidaySupplementPercent: '0,00',
    payHolidayAllowanceSeparately: false,
    variableSurchargePercent: '0,00',
    variableSupplementPerDay: false,
    
    // Percentage rule
    holidayCompensationPercent: '',
    minimumWagePerDay: '0,00',
    
    // Advance vacation
    holidayPayPerDay: '4.60',
    followsHolidayLaw: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prevent body scrolling and hide browser UI when modal is open
  useEffect(() => {
    if (isOpen) {
      const bodyElement = window.document.querySelector('body');
      const htmlElement = window.document.querySelector('html');
      
      if (bodyElement) {
        bodyElement.style.overflow = 'hidden';
        bodyElement.style.margin = '0';
        bodyElement.style.padding = '0';
      }
      
      if (htmlElement) {
        htmlElement.style.overflow = 'hidden';
        htmlElement.style.margin = '0';
        htmlElement.style.padding = '0';
      }
      
      return () => {
        if (bodyElement) {
          bodyElement.style.overflow = 'unset';
          bodyElement.style.margin = '';
          bodyElement.style.padding = '';
        }
        
        if (htmlElement) {
          htmlElement.style.overflow = 'unset';
          htmlElement.style.margin = '';
          htmlElement.style.padding = '';
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSave(formData);
    onClose();
  };

  const handleShowList = () => {
    onClose(); // Close the modal first
    navigate('/salary-agreements'); // Navigate to salary agreements page
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      staffType: 'Worker',
      agreementTemplate: 'Worker',
      payPeriod: 'Monthly salary previous month',
      atf: true,
      atfPeriod: 'Calendar year',
      atfShowOnPaySlip: true,
      atfUnit: '',
      atfSource: '',
      atk: true,
      atkPeriod: 'Calendar year',
      atkShowOnPaySlip: true,
      atkUnit: '',
      atkSource: '',
      earningYear: 'Current earning year',
      vacationYearStart: '1',
      vacationYearMonth: 'April',
      holidayEntitlementDays: '25',
      onlyFullVacationDays: false,
      vacationConditions: 'The equal pay rule',
      waitingPeriodDeduction: 'Waiting period deduction',
      waitingPeriodFromDate: '2019-01-01',
      automaticScheduleTime: true,
      automaticFullDay: false,
      obAdditionSimple: '0',
      obSupplementQualified: '0',
      obSupplementWeekend: '0',
      unionFeePercent: '0',
      inspectionFee: '0',
      travelTimeCompensation: '0',
      contractPeriod: '168',
      obSupplement4: '0',
      obSupplement5: '0',
      useA01: false,
      useA02: false,
      useA03: false,
      useA04: false,
      useA05: false,
      salaryPerDayPercent: '0,00',
      holidaySupplementPercent: '0,00',
      payHolidayAllowanceSeparately: false,
      variableSurchargePercent: '0,00',
      variableSupplementPerDay: false,
      holidayCompensationPercent: '',
      minimumWagePerDay: '0,00',
      holidayPayPerDay: '4.60',
      followsHolidayLaw: true
    });
    setErrors({});
    onClose();
  };

  const ToggleSwitch = ({ 
    value, 
    onChange, 
    options 
  }: { 
    value: boolean; 
    onChange: (value: boolean) => void; 
    options: [string, string] 
  }) => (
    <div className="flex space-x-1">
      <button
        onClick={() => onChange(true)}
        className={`px-4 py-2 rounded-l-lg border ${
          value
            ? 'bg-white text-gray-900 border-gray-300'
            : 'bg-gray-100 text-gray-600 border-gray-300'
        }`}
      >
        {options[0]}
      </button>
      <button
        onClick={() => onChange(false)}
        className={`px-4 py-2 rounded-r-lg border ${
          !value
            ? 'bg-white text-gray-900 border-gray-300'
            : 'bg-gray-100 text-gray-600 border-gray-300'
        }`}
      >
        {options[1]}
      </button>
    </div>
  );

  const SectionHeader = ({ 
    title, 
    expanded, 
    onToggle, 
    children 
  }: { 
    title: string; 
    expanded: boolean; 
    onToggle: () => void; 
    children: React.ReactNode 
  }) => (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100"
      >
        <span className="font-medium text-gray-900">{title}</span>
        {expanded ? (
          <span className="text-green-600">▼</span>
        ) : (
          <span className="text-green-600">▶</span>
        )}
      </button>
      {expanded && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999
      }}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">AGREEMENT FOR SALARIES - CREATE NEW</h2>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleShowList}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              Show list
            </Button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Create Agreement Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Create agreement</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Staff type
                  </label>
                  <select
                    value={formData.staffType}
                    onChange={(e) => handleInputChange('staffType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Worker">Worker</option>
                    <option value="Official">Official</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Agreement template
                  </label>
                  <select
                    value={formData.agreementTemplate}
                    onChange={(e) => handleInputChange('agreementTemplate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Worker">Worker</option>
                    <option value="Trade">Trade</option>
                    <option value="Metal">Metal</option>
                    <option value="Official">Official</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pay period
                  </label>
                  <select
                    value={formData.payPeriod}
                    onChange={(e) => handleInputChange('payPeriod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Monthly salary previous month">Monthly salary previous month</option>
                    <option value="Weekly salary">Weekly salary</option>
                    <option value="Bi-weekly salary">Bi-weekly salary</option>
                  </select>
                </div>
              </div>

              {/* ATF Section */}
              <SectionHeader
                title="Shortened working hours (ATF) and Working hours account (ATK)"
                expanded={atfExpanded}
                onToggle={() => setAtfExpanded(!atfExpanded)}
              >
                <div className="space-y-6">
                  {/* ATF Subsection */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">ATF (Arbetstidsförkortning - Shortened Working Hours)</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ATF
                      </label>
                      <ToggleSwitch
                        value={formData.atf}
                        onChange={(value) => handleInputChange('atf', value)}
                        options={['Yes', 'No']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Period
                      </label>
                      <ToggleSwitch
                        value={formData.atfPeriod === 'Calendar year'}
                        onChange={(value) => handleInputChange('atfPeriod', value ? 'Calendar year' : 'Vacation year')}
                        options={['Calendar year', 'Vacation year']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Show on pay slip
                      </label>
                      <ToggleSwitch
                        value={formData.atfShowOnPaySlip}
                        onChange={(value) => handleInputChange('atfShowOnPaySlip', value)}
                        options={['Yes', 'No']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={formData.atfUnit}
                        onChange={(e) => handleInputChange('atfUnit', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source
                      </label>
                      <input
                        type="text"
                        value={formData.atfSource}
                        onChange={(e) => handleInputChange('atfSource', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* ATK Subsection */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">ATK (Arbetstidskonto - Working Hours Account)</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ATK
                      </label>
                      <ToggleSwitch
                        value={formData.atk}
                        onChange={(value) => handleInputChange('atk', value)}
                        options={['Yes', 'No']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Period
                      </label>
                      <ToggleSwitch
                        value={formData.atkPeriod === 'Calendar year'}
                        onChange={(value) => handleInputChange('atkPeriod', value ? 'Calendar year' : 'Vacation year')}
                        options={['Calendar year', 'Vacation year']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Show on pay slip
                      </label>
                      <ToggleSwitch
                        value={formData.atkShowOnPaySlip}
                        onChange={(value) => handleInputChange('atkShowOnPaySlip', value)}
                        options={['Yes', 'No']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Unit
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Timmar</span>
                        <input
                          type="text"
                          value={formData.atkUnit}
                          onChange={(e) => handleInputChange('atkUnit', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">SEK</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source
                      </label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Antal</span>
                        <input
                          type="text"
                          value={formData.atkSource}
                          onChange={(e) => handleInputChange('atkSource', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Summa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionHeader>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Informational Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Here you specify which settings should apply according to your collective agreement. You can change the values that are pre-filled in some of the fields to the values that should apply to this agreement. Under Register - Personnel - Employment, you control which agreement applies to the employee.
                </p>
              </div>

              {/* Holiday Section */}
              <SectionHeader
                title="Holiday"
                expanded={holidayExpanded}
                onToggle={() => setHolidayExpanded(!holidayExpanded)}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Earning year
                    </label>
                    <ToggleSwitch
                      value={formData.earningYear === 'Current earning year'}
                      onChange={(value) => handleInputChange('earningYear', value ? 'Current earning year' : 'Previous earning year')}
                      options={['Current earning year', 'Previous earning year']}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter start date for vacation year
                    </label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={formData.vacationYearStart}
                        onChange={(e) => handleInputChange('vacationYearStart', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                      <select
                        value={formData.vacationYearMonth}
                        onChange={(e) => handleInputChange('vacationYearMonth', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Holiday entitlement in days
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.holidayEntitlementDays}
                        onChange={(e) => handleInputChange('holidayEntitlementDays', e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Only full vacation days
                    </label>
                    <div className="flex items-center space-x-2">
                      <ToggleSwitch
                        value={formData.onlyFullVacationDays}
                        onChange={(value) => handleInputChange('onlyFullVacationDays', value)}
                        options={['Yes', 'No']}
                      />
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specify vacation conditions for monthly paid employees
                    </label>
                    <div className="flex items-center space-x-2">
                      <ToggleSwitch
                        value={formData.vacationConditions === 'The equal pay rule'}
                        onChange={(value) => handleInputChange('vacationConditions', value ? 'The equal pay rule' : 'The percentage rule')}
                        options={['The equal pay rule', 'The percentage rule']}
                      />
                      <HelpCircle className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">* For hourly employees, the percentage rule always applies.</p>
                  </div>
                </div>
              </SectionHeader>

              {/* Generally Section */}
              <SectionHeader
                title="Generally"
                expanded={generallyExpanded}
                onToggle={() => setGenerallyExpanded(!generallyExpanded)}
              >
                <div className="space-y-6">
                  {/* Waiting Period Deduction */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Waiting period deduction</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waiting period deduction
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={formData.waitingPeriodDeduction}
                          onChange={(e) => handleInputChange('waitingPeriodDeduction', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button className="bg-gray-500 hover:bg-gray-600 text-white text-sm">
                          Karen's Day
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waiting period deduction from date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.waitingPeriodFromDate}
                          onChange={(e) => handleInputChange('waitingPeriodFromDate', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Automatic schedule time
                      </label>
                      <ToggleSwitch
                        value={formData.automaticScheduleTime}
                        onChange={(value) => handleInputChange('automaticScheduleTime', value)}
                        options={['Yes', 'No']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Automatic full day
                      </label>
                      <ToggleSwitch
                        value={formData.automaticFullDay}
                        onChange={(value) => handleInputChange('automaticFullDay', value)}
                        options={['Yes', 'No']}
                      />
                    </div>
                  </div>

                  {/* Collective Agreement Settings */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Settings according to collective agreements</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 font-medium text-gray-700">FORMULA</th>
                            <th className="text-left py-2 px-3 font-medium text-gray-700">VALUE</th>
                          </tr>
                        </thead>
                        <tbody className="space-y-2">
                          {[
                            { key: 'obAdditionSimple', label: 'OB addition simple', formula: 'P01' },
                            { key: 'obSupplementQualified', label: 'OB supplement qualified', formula: 'P02' },
                            { key: 'obSupplementWeekend', label: 'OB supplement weekend', formula: 'P03' },
                            { key: 'unionFeePercent', label: 'Union fee %', formula: 'P04' },
                            { key: 'inspectionFee', label: 'Inspection fee', formula: 'P05' },
                            { key: 'travelTimeCompensation', label: 'Travel time compensation', formula: 'P06' },
                            { key: 'contractPeriod', label: 'Contract period', formula: 'P07' },
                            { key: 'obSupplement4', label: 'OB supplement 4', formula: 'P09' },
                            { key: 'obSupplement5', label: 'OB supplement 5', formula: 'P10' }
                          ].map((item) => (
                            <tr key={item.key} className="border-b border-gray-100">
                              <td className="py-2 px-3 text-sm text-gray-900">{item.label}</td>
                              <td className="py-2 px-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">{item.formula}</span>
                                  <input
                                    type="text"
                                    value={formData[item.key as keyof typeof formData] as string}
                                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Salary Type Formulas */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Salary type formulas</h4>
                    
                    <div className="space-y-2">
                      {['A01', 'A02', 'A03', 'A04', 'A05'].map((formula) => (
                        <div key={formula} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Use {formula}</span>
                          <ToggleSwitch
                            value={formData[`use${formula}` as keyof typeof formData] as boolean}
                            onChange={(value) => handleInputChange(`use${formula}`, value)}
                            options={['Yes', 'No']}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equal Pay Rule */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">The equal pay rule</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary per day in %
                      </label>
                      <input
                        type="text"
                        value={formData.salaryPerDayPercent}
                        onChange={(e) => handleInputChange('salaryPerDayPercent', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Holiday supplement in %
                      </label>
                      <input
                        type="text"
                        value={formData.holidaySupplementPercent}
                        onChange={(e) => handleInputChange('holidaySupplementPercent', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pay holiday allowance separately
                      </label>
                      <ToggleSwitch
                        value={formData.payHolidayAllowanceSeparately}
                        onChange={(value) => handleInputChange('payHolidayAllowanceSeparately', value)}
                        options={['Yes', 'No']}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variable surcharge in %
                      </label>
                      <input
                        type="text"
                        value={formData.variableSurchargePercent}
                        onChange={(e) => handleInputChange('variableSurchargePercent', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Variable supplement in % per day
                      </label>
                      <ToggleSwitch
                        value={formData.variableSupplementPerDay}
                        onChange={(value) => handleInputChange('variableSupplementPerDay', value)}
                        options={['Yes', 'No']}
                      />
                    </div>
                  </div>

                  {/* Percentage Rule */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">The percentage rule</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Holiday compensation in %
                      </label>
                      <input
                        type="text"
                        value={formData.holidayCompensationPercent}
                        onChange={(e) => handleInputChange('holidayCompensationPercent', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum wage per day
                      </label>
                      <input
                        type="text"
                        value={formData.minimumWagePerDay}
                        onChange={(e) => handleInputChange('minimumWagePerDay', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Advance Vacation */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Advance vacation</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Holiday pay per day, advance holiday in %
                      </label>
                      <input
                        type="text"
                        value={formData.holidayPayPerDay}
                        onChange={(e) => handleInputChange('holidayPayPerDay', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Follows the holiday law for saved days?
                      </label>
                      <div className="flex items-center space-x-2">
                        <ToggleSwitch
                          value={formData.followsHolidayLaw}
                          onChange={(value) => handleInputChange('followsHolidayLaw', value)}
                          options={['Yes', 'No']}
                        />
                        <HelpCircle className="w-4 h-4 text-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </SectionHeader>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end">
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleCancel}
              className="bg-gray-700 hover:bg-gray-800 text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
